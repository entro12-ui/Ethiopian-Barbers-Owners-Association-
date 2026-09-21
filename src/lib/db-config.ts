export function isPlaceholderDatabaseUrl(connectionString: string | undefined): boolean {
  if (!connectionString?.trim()) return true;
  return (
    connectionString.includes("://...") ||
    /:PASSWORD@|USER:PASSWORD|your-host|HOST\/DATABASE/i.test(connectionString)
  );
}

export function normalizeDatabaseUrl(connectionString: string): string {
  // Render sets RENDER=true. Internal hosts like dpg-xxxxx-a only resolve there.
  if (process.env.RENDER === "true") return connectionString;

  try {
    const url = new URL(connectionString);
    if (/^dpg-[a-z0-9]+(?:-[a-z0-9]+)*-a$/.test(url.hostname)) {
      const region = process.env.RENDER_POSTGRES_REGION || "oregon";
      url.hostname = `${url.hostname}.${region}-postgres.render.com`;
      if (!url.searchParams.get("sslmode")) {
        url.searchParams.set("sslmode", "require");
      }
    }
    return url.toString();
  } catch {
    return connectionString;
  }
}

export function getDatabaseSsl(connectionString: string) {
  const isLocal =
    connectionString.includes("localhost") ||
    connectionString.includes("127.0.0.1");

  if (isLocal) return undefined;

  return { rejectUnauthorized: false };
}
