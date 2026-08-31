export function getDatabaseSsl(connectionString: string) {
  const isLocal =
    connectionString.includes("localhost") ||
    connectionString.includes("127.0.0.1");

  if (isLocal) return undefined;

  return { rejectUnauthorized: false };
}
