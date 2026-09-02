import { Pool, PoolClient } from "pg";
import { getDatabaseSsl } from "@/lib/db-config";

let pool: Pool | null = null;
let initialized = false;

export function isDatabaseConfigured(): boolean {
  return Boolean(process.env.DATABASE_URL);
}

export function getPool(): Pool {
  const connectionString = process.env.DATABASE_URL;
  if (!connectionString) {
    throw new Error("DATABASE_URL environment variable is not set");
  }

  if (!pool) {
    pool = new Pool({
      connectionString,
      ssl: getDatabaseSsl(connectionString),
      max: 10,
    });
  }

  return pool;
}

export async function withTransaction<T>(fn: (client: PoolClient) => Promise<T>): Promise<T> {
  const client = await getPool().connect();
  try {
    await client.query("BEGIN");
    const result = await fn(client);
    await client.query("COMMIT");
    return result;
  } catch (error) {
    await client.query("ROLLBACK");
    throw error;
  } finally {
    client.release();
  }
}

export async function initializeDatabase(): Promise<void> {
  if (initialized || !isDatabaseConfigured()) return;

  const client = await getPool().connect();
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
        ADD COLUMN IF NOT EXISTS membership_level TEXT NOT NULL DEFAULT 'white'
        CHECK (membership_level IN ('gold', 'silver', 'white'));
    `).catch(() => {});

    initialized = true;
  } finally {
    client.release();
  }
}
