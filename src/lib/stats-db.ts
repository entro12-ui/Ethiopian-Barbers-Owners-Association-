import { getPool } from "@/lib/db";

export const FOUNDING_YEAR = 2016;

export interface SiteStatistics {
  professionalMembers: number;
  trainingPrograms: number;
  communityEvents: number;
  yearsOfDevelopment: number;
}

export async function getSiteStatistics(): Promise<SiteStatistics> {
  const pool = getPool();

  const [membersResult, statsResult] = await Promise.all([
    pool.query(`SELECT COUNT(*)::int AS count FROM membership_applications`),
    pool.query<{ key: string; value: number }>(
      `SELECT key, value FROM association_stats WHERE key IN ('training_programs', 'community_events')`
    ),
  ]);

  const statsMap = Object.fromEntries(
    statsResult.rows.map((row) => [row.key, Number(row.value)])
  );

  const currentYear = new Date().getFullYear();
  const yearsOfDevelopment = Math.max(currentYear - FOUNDING_YEAR, 1);

  return {
    professionalMembers: Number(membersResult.rows[0]?.count ?? 0),
    trainingPrograms: statsMap.training_programs ?? 0,
    communityEvents: statsMap.community_events ?? 0,
    yearsOfDevelopment,
  };
}
