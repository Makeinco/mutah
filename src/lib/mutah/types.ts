/**
 * MUTAH MAP — domain types.
 * UI never talks to a backend directly; it talks to the repository in `data.ts`
 * and the AI adapter in `ai.ts`. Both can later be swapped for Supabase / Gemini.
 */

/** The only five visible entrance indicators the product analyses. */
export type IndicatorKey = "steps" | "ramp" | "handrail" | "obstruction" | "parking";

/** Evidence states. `not_visible` NEVER means `absent`. */
export type IndicatorState = "present" | "absent" | "unknown" | "not_visible" | "not_applicable";

export interface IndicatorEvidence {
  key: IndicatorKey;
  state: IndicatorState;
  /** Short human sentence describing what is visible in the image. */
  note: string;
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
  name: string;
  category: string;
  area: string;
  distanceKm?: number;
  /** Normalised 0..1 position used by the schematic map view. */
  point: { x: number; y: number };
  imageUrl: string;
  imageAlt: string;
  lastVerifiedISO: string;
  verification: VerificationStatus;
  source: SourceKind;
  indicators: Record<IndicatorKey, IndicatorEvidence>;
}

/** Access needs — never a medical or disability classification. */
export type AccessNeed = "step_free" | "ramp_when_raised" | "clear_path" | "handrail" | "parking";

export type ContributionStatus = "pending_review" | "approved" | "rejected" | "clarification";

export interface Contribution {
  id: string;
  facilityId: string;
  facilityName: string;
  imageUrl: string;
  submittedISO: string;
  status: ContributionStatus;
  /** What the AI observed (preliminary). */
  aiObservations: IndicatorEvidence[];
  /** What the contributor confirmed or corrected. */
  confirmed: Record<IndicatorKey, { state: IndicatorState; action: "confirmed" | "corrected" | "unsure" }>;
  reviewerNote?: string;
}
