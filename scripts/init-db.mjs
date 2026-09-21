import pg from "pg";

const { Pool } = pg;

async function main() {
  if (!process.env.DATABASE_URL) {
    console.error("DATABASE_URL is required");
    process.exit(1);
  }

  const rawConnectionString = process.env.DATABASE_URL;
  const isPlaceholder =
    !rawConnectionString ||
    rawConnectionString.includes("://...") ||
    /USER:PASSWORD|your-host|HOST\/DATABASE/i.test(rawConnectionString);

  if (isPlaceholder) {
    console.error("DATABASE_URL is required");
    process.exit(1);
  }

  const connectionString = (() => {
    if (process.env.RENDER === "true") return rawConnectionString;
    try {
      const url = new URL(rawConnectionString);
      if (/^dpg-[a-z0-9]+(?:-[a-z0-9]+)*-a$/.test(url.hostname)) {
        const region = process.env.RENDER_POSTGRES_REGION || "oregon";
        url.hostname = `${url.hostname}.${region}-postgres.render.com`;
        if (!url.searchParams.get("sslmode")) {
          url.searchParams.set("sslmode", "require");
        }
      }
      return url.toString();
    } catch {
      return rawConnectionString;
    }
  })();
  const isLocal =
    connectionString.includes("localhost") ||
    connectionString.includes("127.0.0.1");

  const pool = new Pool({
    connectionString,
    ssl: isLocal ? undefined : { rejectUnauthorized: false },
  });

  const client = await pool.connect();

  try {
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

    console.log("Database tables initialized successfully.");
  } finally {
    client.release();
    await pool.end();
  }
}

main().catch((error) => {
  console.error("Database initialization failed:", error);
  process.exit(1);
});
