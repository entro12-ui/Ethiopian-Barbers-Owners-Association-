import { getPool, initializeDatabase, isDatabaseConfigured } from "@/lib/db";
import type { Locale } from "@/lib/i18n";
import {
  deepMerge,
  getDefaultBilingualSection,
  getDefaultContactSettings,
  getDefaultMembershipPayment,
  getDefaultStatsConfig,
  mergePayload,
} from "@/lib/site-content-defaults";
import {
  BILINGUAL_SECTION_KEYS,
  type BilingualSectionKey,
  type MergedSiteContent,
  type SiteContentPayload,
  type SiteContentRow,
  isBilingualSectionKey,
  isSharedSectionKey,
} from "@/lib/site-content-types";

function rowFromDb(row: {
  key: string;
  locale: string;
  payload: unknown;
  updated_at: Date | string;
}): SiteContentRow {
  return {
    key: row.key,
    locale: row.locale,
    payload:
      row.payload && typeof row.payload === "object"
        ? (row.payload as SiteContentPayload)
        : {},
    updatedAt:
      typeof row.updated_at === "string"
        ? row.updated_at
        : row.updated_at.toISOString(),
  };
}

export async function listSiteContent(): Promise<SiteContentRow[]> {
  const pool = getPool();
  const result = await pool.query<{
    key: string;
    locale: string;
    payload: unknown;
    updated_at: Date;
  }>(`SELECT key, locale, payload, updated_at FROM site_content ORDER BY key, locale`);
  return result.rows.map(rowFromDb);
}

export async function getSiteContentRow(
  key: string,
  locale: string
): Promise<SiteContentRow | null> {
  const pool = getPool();
  const result = await pool.query<{
    key: string;
    locale: string;
    payload: unknown;
    updated_at: Date;
  }>(`SELECT key, locale, payload, updated_at FROM site_content WHERE key = $1 AND locale = $2`, [
    key,
    locale,
  ]);
  if (!result.rows[0]) return null;
  return rowFromDb(result.rows[0]);
}

export async function upsertSiteContent(
  key: string,
  locale: string,
  payload: SiteContentPayload
): Promise<SiteContentRow> {
  const pool = getPool();
  const result = await pool.query<{
    key: string;
    locale: string;
    payload: unknown;
    updated_at: Date;
  }>(
    `INSERT INTO site_content (key, locale, payload, updated_at)
     VALUES ($1, $2, $3::jsonb, NOW())
     ON CONFLICT (key, locale) DO UPDATE SET
       payload = EXCLUDED.payload,
       updated_at = NOW()
     RETURNING key, locale, payload, updated_at`,
    [key, locale, JSON.stringify(payload)]
  );
  return rowFromDb(result.rows[0]);
}

export async function seedSiteContentIfEmpty(): Promise<void> {
  const pool = getPool();
  const count = await pool.query<{ n: string }>(`SELECT COUNT(*)::text AS n FROM site_content`);
  if (Number(count.rows[0]?.n ?? 0) > 0) return;

  const client = await pool.connect();
  try {
    await client.query("BEGIN");
    for (const key of BILINGUAL_SECTION_KEYS) {
      for (const locale of ["en", "am"] as const) {
        await client.query(
          `INSERT INTO site_content (key, locale, payload, updated_at)
           VALUES ($1, $2, $3::jsonb, NOW())
           ON CONFLICT (key, locale) DO NOTHING`,
          [key, locale, JSON.stringify(getDefaultBilingualSection(key, locale))]
        );
      }
    }
    await client.query(
      `INSERT INTO site_content (key, locale, payload, updated_at)
       VALUES ('contactSettings', 'all', $1::jsonb, NOW())
       ON CONFLICT (key, locale) DO NOTHING`,
      [JSON.stringify(getDefaultContactSettings())]
    );
    await client.query(
      `INSERT INTO site_content (key, locale, payload, updated_at)
       VALUES ('membershipPayment', 'all', $1::jsonb, NOW())
       ON CONFLICT (key, locale) DO NOTHING`,
      [JSON.stringify(getDefaultMembershipPayment())]
    );
    await client.query(
      `INSERT INTO site_content (key, locale, payload, updated_at)
       VALUES ('statsConfig', 'all', $1::jsonb, NOW())
       ON CONFLICT (key, locale) DO NOTHING`,
      [JSON.stringify(getDefaultStatsConfig())]
    );
    await client.query("COMMIT");
  } catch (error) {
    await client.query("ROLLBACK");
    throw error;
  } finally {
    client.release();
  }
}

export async function getMergedSiteContent(locale: Locale): Promise<MergedSiteContent> {
  const sections: Partial<Record<BilingualSectionKey, SiteContentPayload>> = {};
  let contactSettings = getDefaultContactSettings();
  let membershipPayment = getDefaultMembershipPayment();
  let statsConfig = getDefaultStatsConfig();

  if (!isDatabaseConfigured()) {
    for (const key of BILINGUAL_SECTION_KEYS) {
      sections[key] = getDefaultBilingualSection(key, locale);
    }
    return { locale, sections, contactSettings, membershipPayment, statsConfig };
  }

  try {
    await initializeDatabase();
    const rows = await listSiteContent();
    const byKey = new Map(rows.map((r) => [`${r.key}:${r.locale}`, r.payload]));

    for (const key of BILINGUAL_SECTION_KEYS) {
      const defaults = getDefaultBilingualSection(key, locale);
      const override = byKey.get(`${key}:${locale}`);
      sections[key] = deepMerge(defaults, override);
    }

    contactSettings = mergePayload(
      getDefaultContactSettings(),
      byKey.get("contactSettings:all")
    );
    membershipPayment = mergePayload(
      getDefaultMembershipPayment(),
      byKey.get("membershipPayment:all")
    );
    statsConfig = mergePayload(
      getDefaultStatsConfig(),
      byKey.get("statsConfig:all")
    );
  } catch (error) {
    console.error("getMergedSiteContent error:", error);
    for (const key of BILINGUAL_SECTION_KEYS) {
      sections[key] = getDefaultBilingualSection(key, locale);
    }
  }

  return { locale, sections, contactSettings, membershipPayment, statsConfig };
}

export async function getAdminSiteContentBundle() {
  await initializeDatabase();
  await seedSiteContentIfEmpty();
  const rows = await listSiteContent();

  const bilingual: Record<
    string,
    { en: SiteContentPayload; am: SiteContentPayload }
  > = {};
  for (const key of BILINGUAL_SECTION_KEYS) {
    bilingual[key] = {
      en: deepMerge(
        getDefaultBilingualSection(key, "en"),
        rows.find((r) => r.key === key && r.locale === "en")?.payload
      ),
      am: deepMerge(
        getDefaultBilingualSection(key, "am"),
        rows.find((r) => r.key === key && r.locale === "am")?.payload
      ),
    };
  }

  return {
    bilingual,
    contactSettings: mergePayload(
      getDefaultContactSettings(),
      rows.find((r) => r.key === "contactSettings" && r.locale === "all")?.payload
    ),
    membershipPayment: mergePayload(
      getDefaultMembershipPayment(),
      rows.find((r) => r.key === "membershipPayment" && r.locale === "all")?.payload
    ),
    statsConfig: mergePayload(
      getDefaultStatsConfig(),
      rows.find((r) => r.key === "statsConfig" && r.locale === "all")?.payload
    ),
  };
}

export function validateSectionUpdate(
  key: string,
  locale: string
): { ok: true } | { ok: false; error: string } {
  if (isBilingualSectionKey(key)) {
    if (locale !== "en" && locale !== "am") {
      return { ok: false, error: "Bilingual sections require locale en or am" };
    }
    return { ok: true };
  }
  if (isSharedSectionKey(key)) {
    if (locale !== "all") {
      return { ok: false, error: "Shared sections require locale all" };
    }
    return { ok: true };
  }
  return { ok: false, error: "Unknown section key" };
}
