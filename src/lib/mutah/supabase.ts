import type { IndicatorState } from "./types";

const DEFAULT_SUPABASE_URL = "https://lxwwdobvlysgqdgixniv.supabase.co";

function config() {
  const url = import.meta.env.VITE_SUPABASE_URL || DEFAULT_SUPABASE_URL;
  const key = import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY || "";
  return { url: url.replace(/\/$/, ""), key };
}

export type ReviewedFacilityRow = {
  id: string;
  name_ar: string;
  name_en: string | null;
  category_ar: string | null;
  category_en: string | null;
  area_ar: string | null;
  area_en: string | null;
  verification: "team_reviewed" | "stale";
  last_verified_at: string | null;
};

export type ReviewedSummaryRow = {
  facility_id: string;
  reviewed_evidence: Record<
    string,
    {
      state?: IndicatorState;
      explanation_ar?: string;
      explanation_en?: string;
    }
  >;
  evidence_status: Record<string, unknown>;
  last_recomputed_at: string;
};

async function rest<T>(path: string): Promise<T> {
  const { url, key } = config();
  if (!key) throw new Error("SUPABASE_NOT_CONFIGURED");

  const response = await fetch(`${url}/rest/v1/${path}`, {
    headers: {
      apikey: key,
      Authorization: `Bearer ${key}`,
      Accept: "application/json",
    },
  });

  if (!response.ok) {
    throw new Error(`SUPABASE_HTTP_${response.status}`);
  }

  return (await response.json()) as T;
}

/**
 * Public read path only. RLS guarantees that the browser can read reviewed/stale
 * facility data, never the internal analysis/moderation tables.
 */
export async function loadReviewedFacilities(): Promise<ReviewedFacilityRow[]> {
  return rest<ReviewedFacilityRow[]>(
    "facilities?select=id,name_ar,name_en,category_ar,category_en,area_ar,area_en,verification,last_verified_at&order=updated_at.desc",
  );
}

export async function loadReviewedSummaries(): Promise<ReviewedSummaryRow[]> {
  return rest<ReviewedSummaryRow[]>(
    "facility_summaries?select=facility_id,reviewed_evidence,evidence_status,last_recomputed_at",
  );
}

export async function checkSupabaseConnection(): Promise<"connected" | "unconfigured" | "unavailable"> {
  const { key } = config();
  if (!key) return "unconfigured";
  try {
    await loadReviewedFacilities();
    return "connected";
  } catch {
    return "unavailable";
  }
}
