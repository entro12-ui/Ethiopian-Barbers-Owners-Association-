"use client";

import Button from "@/components/ui/Button";
import { BILINGUAL_SECTION_KEYS } from "@/lib/site-content-types";
import type {
  ContactSettingsPayload,
  MembershipPaymentPayload,
  SiteContentPayload,
  StatsConfigPayload,
} from "@/lib/site-content-types";
import { Loader2, Save } from "lucide-react";
import { useCallback, useEffect, useState, type ReactNode } from "react";

type LocaleTab = "en" | "am";

interface Bundle {
  bilingual: Record<string, { en: SiteContentPayload; am: SiteContentPayload }>;
  contactSettings: ContactSettingsPayload;
  membershipPayment: MembershipPaymentPayload;
  statsConfig: StatsConfigPayload;
}

const SECTION_LABELS: Record<string, string> = {
  hero: "Hero",
  about: "About",
  goals: "Goals",
  development: "Professional development",
  health: "Health & safety",
  membershipSection: "Membership band",
  gallery: "Gallery labels",
  statistics: "Statistics labels",
  cta: "CTA",
  faq: "FAQ",
  contact: "Contact labels",
  contactSettings: "Contact details",
  membershipPayment: "Membership payment",
  statsConfig: "Statistics numbers",
};

function Field({
  label,
  value,
  onChange,
  multiline,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  multiline?: boolean;
}) {
  return (
    <label className="block text-sm">
      <span className="font-medium text-charcoal mb-1 block">{label}</span>
      {multiline ? (
        <textarea
          className="w-full px-3 py-2 border border-gray-200 rounded-sm focus:outline-none focus:ring-2 focus:ring-gold/40 min-h-[88px]"
          value={value}
          onChange={(e) => onChange(e.target.value)}
        />
      ) : (
        <input
          className="w-full px-3 py-2 border border-gray-200 rounded-sm focus:outline-none focus:ring-2 focus:ring-gold/40"
          value={value}
          onChange={(e) => onChange(e.target.value)}
        />
      )}
    </label>
  );
}

function setPath(obj: SiteContentPayload, path: string[], value: unknown): SiteContentPayload {
  const next = { ...obj };
  let cursor: Record<string, unknown> = next;
  for (let i = 0; i < path.length - 1; i++) {
    const key = path[i];
    const child = cursor[key];
    const copy =
      child && typeof child === "object" && !Array.isArray(child)
        ? { ...(child as Record<string, unknown>) }
        : {};
    cursor[key] = copy;
    cursor = copy;
  }
  cursor[path[path.length - 1]] = value;
  return next;
}

function getPath(obj: SiteContentPayload, path: string[]): string {
  let cursor: unknown = obj;
  for (const key of path) {
    if (!cursor || typeof cursor !== "object") return "";
    cursor = (cursor as Record<string, unknown>)[key];
  }
  return typeof cursor === "string" ? cursor : cursor == null ? "" : String(cursor);
}

export default function SiteContentEditor({
  onMessage,
}: {
  onMessage: (message: string, type: "success" | "error") => void;
}) {
  const [bundle, setBundle] = useState<Bundle | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [section, setSection] = useState<string>("hero");
  const [locale, setLocale] = useState<LocaleTab>("en");

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/admin/site-content", { cache: "no-store" });
      if (!res.ok) throw new Error("Failed to load");
      const data = (await res.json()) as Bundle;
      setBundle(data);
    } catch {
      onMessage("Could not load site content", "error");
      setBundle(null);
    } finally {
      setLoading(false);
    }
  }, [onMessage]);

  useEffect(() => {
    load();
  }, [load]);

  const save = async (key: string, loc: string, payload: SiteContentPayload) => {
    setSaving(true);
    try {
      const res = await fetch("/api/admin/site-content", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ key, locale: loc, payload }),
      });
      if (!res.ok) {
        const err = await res.json().catch(() => ({}));
        throw new Error(err.error || "Save failed");
      }
      onMessage("Saved", "success");
      await load();
    } catch (e) {
      onMessage(e instanceof Error ? e.message : "Save failed", "error");
    } finally {
      setSaving(false);
    }
  };

  if (loading || !bundle) {
    return (
      <div className="flex items-center gap-2 text-gray-600 py-12 justify-center">
        <Loader2 className="w-5 h-5 animate-spin" />
        Loading site content…
      </div>
    );
  }

  const bilingualKeys = [...BILINGUAL_SECTION_KEYS];
  const navItems = [
    ...bilingualKeys,
    "contactSettings",
    "membershipPayment",
    "statsConfig",
  ];

  const renderStringFields = (
    payload: SiteContentPayload,
    fields: { label: string; path: string[]; multiline?: boolean }[],
    onUpdate: (next: SiteContentPayload) => void
  ) => (
    <div className="grid gap-4 md:grid-cols-2">
      {fields.map((f) => (
        <Field
          key={f.path.join(".")}
          label={f.label}
          value={getPath(payload, f.path)}
          multiline={f.multiline}
          onChange={(v) => onUpdate(setPath(payload, f.path, v))}
        />
      ))}
    </div>
  );

  let editor: ReactNode = null;

  if (section === "contactSettings") {
    const p = bundle.contactSettings;
    editor = (
      <div className="space-y-4">
        {renderStringFields(
          p as unknown as SiteContentPayload,
          [
            { label: "Phone", path: ["phone"] },
            { label: "Email", path: ["email"] },
            { label: "Map embed URL", path: ["mapEmbedUrl"], multiline: true },
            { label: "Map link URL", path: ["mapLinkUrl"], multiline: true },
            { label: "Facebook", path: ["social", "facebook"] },
            { label: "YouTube", path: ["social", "youtube"] },
            { label: "TikTok", path: ["social", "tiktok"] },
            { label: "Instagram", path: ["social", "instagram"] },
            { label: "Telegram", path: ["social", "telegram"] },
          ],
          (next) =>
            setBundle({ ...bundle, contactSettings: next as unknown as ContactSettingsPayload })
        )}
        <Button
          disabled={saving}
          onClick={() => save("contactSettings", "all", bundle.contactSettings as unknown as SiteContentPayload)}
        >
          {saving ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : <Save className="w-4 h-4 mr-2" />}
          Save contact details
        </Button>
      </div>
    );
  } else if (section === "membershipPayment") {
    const p = bundle.membershipPayment;
    editor = (
      <div className="space-y-4">
        {renderStringFields(
          p as unknown as SiteContentPayload,
          [
            { label: "Bank name", path: ["bankName"] },
            { label: "Account name", path: ["accountName"] },
            { label: "Account number", path: ["accountNumber"] },
            { label: "Telebirr", path: ["telebirr"] },
            { label: "Officer title", path: ["officerTitle"] },
            { label: "Officer name", path: ["officerName"] },
            { label: "Gold fee", path: ["fees", "gold"] },
            { label: "Silver fee", path: ["fees", "silver"] },
            { label: "White fee", path: ["fees", "white"] },
          ],
          (next) =>
            setBundle({
              ...bundle,
              membershipPayment: next as unknown as MembershipPaymentPayload,
            })
        )}
        <Button
          disabled={saving}
          onClick={() =>
            save("membershipPayment", "all", bundle.membershipPayment as unknown as SiteContentPayload)
          }
        >
          {saving ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : <Save className="w-4 h-4 mr-2" />}
          Save payment details
        </Button>
      </div>
    );
  } else if (section === "statsConfig") {
    const p = bundle.statsConfig;
    editor = (
      <div className="space-y-4 max-w-lg">
        <label className="block text-sm">
          <span className="font-medium text-charcoal mb-1 block">Count mode</span>
          <select
            className="w-full px-3 py-2 border border-gray-200 rounded-sm"
            value={p.mode}
            onChange={(e) =>
              setBundle({
                ...bundle,
                statsConfig: { ...p, mode: e.target.value as "auto" | "manual" },
              })
            }
          >
            <option value="auto">Auto (from memberships)</option>
            <option value="manual">Manual override</option>
          </select>
        </label>
        <Field
          label="Barbers count"
          value={String(p.barbers)}
          onChange={(v) =>
            setBundle({
              ...bundle,
              statsConfig: { ...p, barbers: Number(v) || 0 },
            })
          }
        />
        <Field
          label="Barbershop owners count"
          value={String(p.barbershopOwners)}
          onChange={(v) =>
            setBundle({
              ...bundle,
              statsConfig: { ...p, barbershopOwners: Number(v) || 0 },
            })
          }
        />
        <p className="text-xs text-gray-500">
          Manual numbers are used only when mode is Manual. Labels are edited under Statistics labels.
        </p>
        <Button
          disabled={saving}
          onClick={() =>
            save("statsConfig", "all", bundle.statsConfig as unknown as SiteContentPayload)
          }
        >
          {saving ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : <Save className="w-4 h-4 mr-2" />}
          Save statistics numbers
        </Button>
      </div>
    );
  } else {
    const pair = bundle.bilingual[section];
    const payload = pair?.[locale] || {};
    const updateLocalePayload = (next: SiteContentPayload) => {
      setBundle({
        ...bundle,
        bilingual: {
          ...bundle.bilingual,
          [section]: { ...pair, [locale]: next },
        },
      });
    };

    const commonTop =
      section === "faq"
        ? null
        : renderStringFields(
            payload,
            Object.keys(payload)
              .filter((k) => typeof payload[k] === "string")
              .map((k) => ({
                label: k,
                path: [k],
                multiline: String(payload[k]).length > 80,
              })),
            updateLocalePayload
          );

    editor = (
      <div className="space-y-6">
        <div className="flex gap-2">
          {(["en", "am"] as const).map((loc) => (
            <button
              key={loc}
              type="button"
              onClick={() => setLocale(loc)}
              className={`px-3 py-1.5 text-sm rounded-sm uppercase ${
                locale === loc
                  ? "bg-gold text-charcoal font-semibold"
                  : "bg-white border border-gray-200 text-gray-600"
              }`}
            >
              {loc}
            </button>
          ))}
        </div>

        {commonTop}

        {section === "faq" && (
          <div className="space-y-4">
            <Field
              label="Title"
              value={getPath(payload, ["title"])}
              onChange={(v) => updateLocalePayload(setPath(payload, ["title"], v))}
            />
            <Field
              label="Subtitle"
              value={getPath(payload, ["subtitle"])}
              multiline
              onChange={(v) => updateLocalePayload(setPath(payload, ["subtitle"], v))}
            />
            {(Array.isArray(payload.items) ? payload.items : []).map((item, index) => {
              const row = item as { question?: string; answer?: string };
              return (
                <div key={index} className="p-4 border border-gray-200 rounded-sm space-y-2 bg-white">
                  <div className="flex justify-between items-center">
                    <span className="text-xs font-semibold text-gray-500">Q&A {index + 1}</span>
                    <button
                      type="button"
                      className="text-xs text-red-600"
                      onClick={() => {
                        const items = [...(payload.items as unknown[])];
                        items.splice(index, 1);
                        updateLocalePayload({ ...payload, items });
                      }}
                    >
                      Remove
                    </button>
                  </div>
                  <Field
                    label="Question"
                    value={row.question || ""}
                    onChange={(v) => {
                      const items = [...(payload.items as Record<string, string>[])];
                      items[index] = { ...items[index], question: v };
                      updateLocalePayload({ ...payload, items });
                    }}
                  />
                  <Field
                    label="Answer"
                    value={row.answer || ""}
                    multiline
                    onChange={(v) => {
                      const items = [...(payload.items as Record<string, string>[])];
                      items[index] = { ...items[index], answer: v };
                      updateLocalePayload({ ...payload, items });
                    }}
                  />
                </div>
              );
            })}
            <Button
              type="button"
              variant="outline"
              onClick={() => {
                const items = [...(Array.isArray(payload.items) ? payload.items : [])];
                items.push({ question: "", answer: "" });
                updateLocalePayload({ ...payload, items });
              }}
            >
              Add FAQ item
            </Button>
          </div>
        )}

        {(section === "goals" ||
          section === "health" ||
          section === "development" ||
          section === "membershipSection" ||
          section === "gallery" ||
          section === "hero" ||
          section === "about" ||
          section === "statistics" ||
          section === "cta" ||
          section === "contact") && (
            <NestedObjectEditor payload={payload} onChange={updateLocalePayload} />
          )}

        <Button
          disabled={saving}
          onClick={() => save(section, locale, bundle.bilingual[section][locale])}
        >
          {saving ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : <Save className="w-4 h-4 mr-2" />}
          Save {SECTION_LABELS[section] || section} ({locale.toUpperCase()})
        </Button>
      </div>
    );
  }

  return (
    <div className="grid lg:grid-cols-[220px_1fr] gap-6">
      <aside className="space-y-1">
        {navItems.map((key) => (
          <button
            key={key}
            type="button"
            onClick={() => setSection(key)}
            className={`w-full text-left px-3 py-2 text-sm rounded-sm ${
              section === key
                ? "bg-charcoal text-white font-semibold"
                : "bg-white border border-gray-200 text-gray-700 hover:border-gold"
            }`}
          >
            {SECTION_LABELS[key] || key}
          </button>
        ))}
      </aside>
      <div className="bg-white border border-gray-100 rounded-sm p-5 md:p-6 shadow-sm">
        <h2 className="text-lg font-bold text-charcoal mb-4">
          {SECTION_LABELS[section] || section}
        </h2>
        {editor}
      </div>
    </div>
  );
}

/** Edit nested string leaves under object maps (items/topics/features/categories/values). */
function NestedObjectEditor({
  payload,
  onChange,
}: {
  payload: SiteContentPayload;
  onChange: (next: SiteContentPayload) => void;
}) {
  const blocks: ReactNode[] = [];

  for (const [key, value] of Object.entries(payload)) {
    if (typeof value === "string" || Array.isArray(value)) continue;
    if (!value || typeof value !== "object") continue;

    const obj = value as Record<string, unknown>;
    const entries = Object.entries(obj);
    if (entries.length === 0) continue;

    blocks.push(
      <div key={key} className="space-y-3 border-t border-gray-100 pt-4">
        <h3 className="text-sm font-semibold text-charcoal capitalize">{key}</h3>
        <div className="grid gap-3 md:grid-cols-2">
          {entries.map(([childKey, childVal]) => {
            if (typeof childVal === "string") {
              return (
                <Field
                  key={`${key}.${childKey}`}
                  label={`${key}.${childKey}`}
                  value={childVal}
                  multiline={childVal.length > 60}
                  onChange={(v) => {
                    const nextGroup = { ...obj, [childKey]: v };
                    onChange({ ...payload, [key]: nextGroup });
                  }}
                />
              );
            }
            if (childVal && typeof childVal === "object" && !Array.isArray(childVal)) {
              const nested = childVal as Record<string, unknown>;
              return (
                <div
                  key={`${key}.${childKey}`}
                  className="md:col-span-2 p-3 border border-gray-200 rounded-sm space-y-2"
                >
                  <p className="text-xs font-semibold text-gray-500">
                    {key}.{childKey}
                  </p>
                  {Object.entries(nested)
                    .filter(([, v]) => typeof v === "string")
                    .map(([nk, nv]) => (
                      <Field
                        key={nk}
                        label={nk}
                        value={String(nv)}
                        multiline={String(nv).length > 60}
                        onChange={(v) => {
                          const nextNested = { ...nested, [nk]: v };
                          const nextGroup = { ...obj, [childKey]: nextNested };
                          onChange({ ...payload, [key]: nextGroup });
                        }}
                      />
                    ))}
                </div>
              );
            }
            return null;
          })}
        </div>
      </div>
    );
  }

  if (blocks.length === 0) return null;
  return <div className="space-y-4">{blocks}</div>;
}
