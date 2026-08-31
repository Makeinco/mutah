/**
 * MUTAH MAP — domain types (v2.1).
 * UI never talks to a backend directly; it talks to the repository in `data.ts`
 * and the AI adapter in `ai.ts`. Both can later be swapped for Supabase / Gemini.
 */

/** Bilingual string. Every user-visible piece of content carries both languages. */
export interface L {
  ar: string;
  en: string;
}

export type Lang = "ar" | "en";

/** The five evidence views a facility can be documented through. */
export type ZoneKey = "approach" | "entrance" | "parking" | "elevator" | "restroom";

/** Visible indicators, grouped by the zone they belong to. */
export type IndicatorKey =
  // approach
  | "path_surface"
  | "curb_ramp"
  // entrance
  | "steps"
  | "ramp"
  | "handrail"
  | "obstruction"
  // parking
  | "parking"
  | "parking_route"
  // elevator
  | "elevator"
  | "elevator_space"
  // restroom
  | "accessible_restroom"
  | "restroom_door";

/** Evidence states. `not_visible` NEVER means `absent`. */
export type IndicatorState = "present" | "absent" | "unknown" | "not_visible" | "not_applicable";

export interface IndicatorEvidence {
  key: IndicatorKey;
  state: IndicatorState;
  /** Short human sentence describing what is visible in the image. */
  note: L;
}

export interface EvidenceImage {
  url: string;
  alt: L;
  capturedISO: string;
}

export interface ZoneEvidence {
  key: ZoneKey;
  images: EvidenceImage[];
  /** Empty when this zone has not been documented at all. */
  documented: boolean;
}

export type VerificationStatus =
  | "team_reviewed"
  | "contributor_only"
  | "pending_review"
  | "disputed"
  | "stale";

export type SourceKind = "contributor_image" | "team_survey";

export interface Facility {
  id: string;
  name: L;
  category: L;
  area: L;
  distanceKm?: number;
  /** Normalised 0..1 position used by the schematic map view. */
  point: { x: number; y: number };
  /** Cover image, usually the entrance view. */
  imageUrl: string;
  imageAlt: L;
  lastVerifiedISO: string;
  verification: VerificationStatus;
  source: SourceKind;
  indicators: Record<IndicatorKey, IndicatorEvidence>;
  zones: Record<ZoneKey, ZoneEvidence>;
}

/** Access needs — never a medical or disability classification. */
export type AccessNeed =
  | "step_free"
  | "ramp_when_raised"
  | "clear_path"
  | "handrail"
  | "parking"
  | "elevator"
  | "accessible_restroom";

export type ContributionStatus = "pending_review" | "approved" | "rejected" | "clarification";

export interface Contribution {
  id: string;
  facilityId: string;
  facilityName: L;
  zone: ZoneKey;
  imageUrl: string;
  submittedISO: string;
  status: ContributionStatus;
  /** What the AI observed (preliminary). */
  aiObservations: IndicatorEvidence[];
  /** What the contributor confirmed or corrected. */
  confirmed: Partial<
    Record<IndicatorKey, { state: IndicatorState; action: "confirmed" | "corrected" | "unsure" }>
  >;
  reviewerNote?: string;
}
