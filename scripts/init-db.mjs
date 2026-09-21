import { existsSync, readFileSync } from "fs";
import { resolve } from "path";
import pg from "pg";

const { Pool } = pg;
const DEFAULT_SCHEMA = "barbershop";

function loadEnvFile(filePath) {
  if (!existsSync(filePath)) return;
  const text = readFileSync(filePath, "utf8");
  for (const rawLine of text.split("\n")) {
    const line = rawLine.trim();
    if (!line || line.startsWith("#")) continue;
    const eq = line.indexOf("=");
    if (eq === -1) continue;
    const key = line.slice(0, eq).trim();
    let value = line.slice(eq + 1).trim();
    if (
      (value.startsWith('"') && value.endsWith('"')) ||
      (value.startsWith("'") && value.endsWith("'"))
    ) {
      value = value.slice(1, -1);
    }
    if (process.env[key] === undefined) process.env[key] = value;
  }
}

function isPlaceholder(connectionString) {
  if (!connectionString?.trim()) return true;
  return (
    connectionString.includes("://...") ||
    /:PASSWORD@|USER:PASSWORD|your-host|HOST\/DATABASE/i.test(connectionString)
  );
}

function quoteIdent(name) {
  if (!/^[a-zA-Z_][a-zA-Z0-9_]*$/.test(name)) {
    throw new Error(`Invalid Postgres identifier: ${name}`);
  }
  return `"${name}"`;
}

function parseDatabaseUrl(rawConnectionString) {
  let schema = DEFAULT_SCHEMA;
  let parsed;
  try {
    parsed = new URL(rawConnectionString);
  } catch {
    return { connectionString: rawConnectionString, schema };
  }

  const schemaParam = parsed.searchParams.get("schema");
  if (schemaParam) {
    schema = schemaParam;
    parsed.searchParams.delete("schema");
  }

  if (process.env.RENDER !== "true") {
    if (/^dpg-[a-z0-9]+(?:-[a-z0-9]+)*-a$/.test(parsed.hostname)) {
      const region = process.env.RENDER_POSTGRES_REGION || "oregon";
      parsed.hostname = `${parsed.hostname}.${region}-postgres.render.com`;
    }
  }

  if (
    !parsed.hostname.includes("localhost") &&
    parsed.hostname !== "127.0.0.1" &&
    !parsed.searchParams.get("sslmode")
  ) {
    parsed.searchParams.set("sslmode", "require");
  }

  return { connectionString: parsed.toString(), schema };
}

async function main() {
  loadEnvFile(resolve(process.cwd(), ".env.local"));

  const rawConnectionString = process.env.DATABASE_URL;
  if (isPlaceholder(rawConnectionString)) {
    console.error("DATABASE_URL is required");
    process.exit(1);
  }

  const { connectionString, schema } = parseDatabaseUrl(rawConnectionString);
  const schemaIdent = quoteIdent(schema);
  const isLocal =
    connectionString.includes("localhost") ||
    connectionString.includes("127.0.0.1");

  const pool = new Pool({
    connectionString,
    ssl: isLocal ? undefined : { rejectUnauthorized: false },
    options: `-c search_path=${schema},public`,
  });

  const client = await pool.connect();

  try {
    await client.query(`CREATE SCHEMA IF NOT EXISTS ${schemaIdent}`);
    await client.query(`SET search_path TO ${schemaIdent}, public`);
    await client.query(`
      CREATE TABLE IF NOT EXISTS membership_applications (
        id TEXT PRIMARY KEY,
        application_ref TEXT UNIQUE NOT NULL,
        full_name TEXT NOT NULL,
        date_of_birth DATE NOT NULL,
        phone TEXT NOT NULL,
        email TEXT NOT NULL,
        address TEXT NOT NULL,
        city TEXT NOT NULL,
        profession TEXT NOT NULL,
        barbershop_name TEXT,
        years_of_experience INTEGER NOT NULL,
        barbershop_address TEXT,
        applicant_type TEXT NOT NULL CHECK (applicant_type IN ('owner', 'barber')),
        membership_level TEXT NOT NULL DEFAULT 'white' CHECK (membership_level IN ('gold', 'silver', 'white')),
        membership_id TEXT,
        status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'under_review', 'approved', 'rejected')),
        agreement BOOLEAN NOT NULL DEFAULT true,
        submitted_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
        updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
        reviewed_at TIMESTAMPTZ,
        review_notes TEXT
      );

      CREATE INDEX IF NOT EXISTS idx_membership_email ON membership_applications(email);
      CREATE INDEX IF NOT EXISTS idx_membership_phone ON membership_applications(phone);
      CREATE INDEX IF NOT EXISTS idx_membership_status ON membership_applications(status);
      CREATE INDEX IF NOT EXISTS idx_membership_submitted ON membership_applications(submitted_at DESC);

      CREATE TABLE IF NOT EXISTS application_documents (
        id TEXT PRIMARY KEY,
        application_id TEXT NOT NULL REFERENCES membership_applications(id) ON DELETE CASCADE,
        document_type TEXT NOT NULL,
        file_name TEXT NOT NULL,
        mime_type TEXT NOT NULL,
        file_size INTEGER NOT NULL,
        file_data BYTEA NOT NULL,
        uploaded_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
        UNIQUE(application_id, document_type)
      );

      CREATE INDEX IF NOT EXISTS idx_documents_application ON application_documents(application_id);

      CREATE TABLE IF NOT EXISTS contact_messages (
        id TEXT PRIMARY KEY,
        name TEXT NOT NULL,
        phone TEXT NOT NULL,
        email TEXT NOT NULL,
        subject TEXT NOT NULL,
        message TEXT NOT NULL,
        created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
      );

      CREATE INDEX IF NOT EXISTS idx_contact_created ON contact_messages(created_at DESC);

      CREATE TABLE IF NOT EXISTS association_stats (
        key TEXT PRIMARY KEY,
        value INTEGER NOT NULL DEFAULT 0,
        updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
      );

      INSERT INTO association_stats (key, value) VALUES
        ('training_programs', 0),
        ('community_events', 0)
      ON CONFLICT (key) DO NOTHING;

      CREATE TABLE IF NOT EXISTS posts (
        id TEXT PRIMARY KEY,
        slug TEXT UNIQUE NOT NULL,
        type TEXT NOT NULL CHECK (type IN ('event', 'job', 'announcement', 'general')),
        title TEXT NOT NULL,
        summary TEXT,
        body TEXT NOT NULL,
        category TEXT,
        location TEXT,
        event_date DATE,
        application_deadline DATE,
        contact_email TEXT,
        contact_phone TEXT,
        image_mime_type TEXT,
        image_file_name TEXT,
        image_data BYTEA,
        status TEXT NOT NULL DEFAULT 'draft' CHECK (status IN ('draft', 'published', 'archived')),
        published_at TIMESTAMPTZ,
        created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
        updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
        created_by TEXT DEFAULT 'admin'
      );

      CREATE INDEX IF NOT EXISTS idx_posts_type ON posts(type);
      CREATE INDEX IF NOT EXISTS idx_posts_status ON posts(status);
      CREATE INDEX IF NOT EXISTS idx_posts_published ON posts(published_at DESC);
      CREATE INDEX IF NOT EXISTS idx_posts_slug ON posts(slug);
    `);

    await client.query(`
      ALTER TABLE membership_applications ALTER COLUMN date_of_birth DROP NOT NULL;
      ALTER TABLE membership_applications ALTER COLUMN email DROP NOT NULL;
      ALTER TABLE membership_applications ALTER COLUMN city DROP NOT NULL;
      ALTER TABLE membership_applications
        ADD COLUMN IF NOT EXISTS membership_level TEXT NOT NULL DEFAULT 'white';
      ALTER TABLE membership_applications
        ADD COLUMN IF NOT EXISTS membership_id TEXT;
    `).catch(() => {});

    await client.query(`
      CREATE UNIQUE INDEX IF NOT EXISTS idx_membership_id
        ON membership_applications(membership_id)
        WHERE membership_id IS NOT NULL;
      CREATE UNIQUE INDEX IF NOT EXISTS idx_application_documents_type
        ON application_documents(application_id, document_type);
    `).catch(() => {});

    const tables = await client.query(
      `SELECT table_name
       FROM information_schema.tables
       WHERE table_schema = $1
       ORDER BY table_name`,
      [schema]
    );
    console.log(`Database schema "${schema}" initialized with tables: ${tables.rows.map((row) => row.table_name).join(", ")}`);
  } finally {
    client.release();
    await pool.end();
  }
}

main().catch((error) => {
  console.error("Database initialization failed:", error);
  process.exit(1);
});
