import { getPool, isDatabaseConfigured } from "@/lib/db";
import { getDefaultStatsConfig, mergePayload } from "@/lib/site-content-defaults";
import type { StatsConfigPayload } from "@/lib/site-content-types";

export interface SiteStatistics {
  barbers: number;
  barbershopOwners: number;
  mode?: "auto" | "manual";
}

async function getStatsConfigFromDb(): Promise<StatsConfigPayload> {
  const pool = getPool();
  const result = await pool.query<{ payload: unknown }>(
    `SELECT payload FROM site_content WHERE key = 'statsConfig' AND locale = 'all' LIMIT 1`
  );
  return mergePayload(
    getDefaultStatsConfig(),
    (result.rows[0]?.payload as Record<string, unknown>) || undefined
  );
}

async function getMembershipCounts(): Promise<{ barbers: number; barbershopOwners: number }> {
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

export async function getSiteStatistics(): Promise<SiteStatistics> {
  if (!isDatabaseConfigured()) {
    return { barbers: 0, barbershopOwners: 0, mode: "auto" };
  }

  let config = getDefaultStatsConfig();
  try {
    config = await getStatsConfigFromDb();
  } catch {
    // site_content may not exist yet on first boot
  }

  if (config.mode === "manual") {
    return {
      barbers: Math.max(0, Number(config.barbers) || 0),
      barbershopOwners: Math.max(0, Number(config.barbershopOwners) || 0),
      mode: "manual",
    };
  }

  const counts = await getMembershipCounts();
  return { ...counts, mode: "auto" };
}
