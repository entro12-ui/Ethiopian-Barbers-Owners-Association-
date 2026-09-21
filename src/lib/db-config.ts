export const DEFAULT_DB_SCHEMA = "barbershop";

export function isPlaceholderDatabaseUrl(connectionString: string | undefined): boolean {
  if (!connectionString?.trim()) return true;
  return (
    connectionString.includes("://...") ||
    /:PASSWORD@|USER:PASSWORD|your-host|HOST\/DATABASE/i.test(connectionString)
  );
}

export function quotePgIdent(name: string) {
  if (!/^[a-zA-Z_][a-zA-Z0-9_]*$/.test(name)) {
    throw new Error(`Invalid Postgres identifier: ${name}`);
  }
  return `"${name}"`;
}

export function parseDatabaseUrl(rawConnectionString: string): {
  connectionString: string;
  schema: string;
} {
  let schema = DEFAULT_DB_SCHEMA;
  let parsed: URL;

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
  quotePgIdent(schema);

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

export function normalizeDatabaseUrl(connectionString: string): string {
  return parseDatabaseUrl(connectionString).connectionString;
}

export function getDatabaseSchema(connectionString?: string): string {
  if (!connectionString) return DEFAULT_DB_SCHEMA;
  return parseDatabaseUrl(connectionString).schema;
}

export function getDatabaseSsl(connectionString: string) {
  const isLocal =
    connectionString.includes("localhost") ||
    connectionString.includes("127.0.0.1");

  if (isLocal) return undefined;

  return { rejectUnauthorized: false };
}
