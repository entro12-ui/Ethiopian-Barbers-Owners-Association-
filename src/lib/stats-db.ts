import { getPool } from "@/lib/db";

export interface SiteStatistics {
  barbers: number;
  barbershopOwners: number;
}

export async function getSiteStatistics(): Promise<SiteStatistics> {
  const pool = getPool();

  const result = await pool.query<{ barbers: number; barbershop_owners: number }>(`
    SELECT
      COUNT(*) FILTER (WHERE applicant_type = 'barber')::int AS barbers,
      COUNT(*) FILTER (WHERE applicant_type = 'owner')::int AS barbershop_owners
    FROM membership_applications
    WHERE status != 'rejected'
  `);

  const row = result.rows[0];

  return {
    barbers: Number(row?.barbers ?? 0),
    barbershopOwners: Number(row?.barbershop_owners ?? 0),
  };
}
