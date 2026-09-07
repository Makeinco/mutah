import { supabase } from "./supabase-client";
import type { FocusIndicator } from "./guide-assets";
import type { Contribution, IndicatorEvidence, ZoneKey } from "./types";

const ZONE_TO_DB: Record<
  ZoneKey,
  "approach_path" | "entrance" | "parking" | "elevator" | "accessible_restroom"
> = {
  approach: "approach_path",
  entrance: "entrance",
  parking: "parking",
  elevator: "elevator",
  restroom: "accessible_restroom",
};

export type PersistedContribution = {
  id: string;
  status:
    | "draft"
    | "processing"
    | "awaiting_confirmation"
    | "pending_review"
    | "clarification_requested"
    | "approved"
    | "rejected";
  submitted_at: string | null;
  created_at: string;
  clarification_note: string | null;
  focus_indicator: FocusIndicator | null;
  facility: { name_ar: string; name_en: string | null; external_key: string | null } | null;
  zone: { zone_type: string; label_ar: string | null; label_en: string | null } | null;
  clarification_responses: ClarificationResponse[];
  review_history: ReviewDecision[];
};

export type ReviewDecision = {
  id: string;
  decision: "approved" | "rejected" | "clarification";
  reviewer_note: string | null;
  created_at: string;
};

export type ClarificationResponse = {
  id: string;
  clarification_round: number;
  contributor_note: string | null;
  created_at: string;
};

export type ReviewObservation = {
  id: string;
  indicator_code: string;
  ai_state: string;
  explanation_ar: string | null;
  explanation_en: string | null;
  confirmations: Array<{
    id: string;
    confirmed_state: string;
    action: "confirmed" | "corrected" | "unsure";
    note: string | null;
    created_at: string;
  }>;
};

export type ReviewContribution = {
  id: string;
  status: PersistedContribution["status"];
  submitted_by: string;
  submitted_at: string | null;
  created_at: string;
  clarification_note: string | null;
  focus_indicator: FocusIndicator | null;
  facility: {
    name_ar: string;
    name_en: string | null;
    external_key: string | null;
  } | null;
  zone: {
    zone_type: string;
    label_ar: string | null;
    label_en: string | null;
  } | null;
  images: Array<{
    id: string;
    storage_path: string;
    mime_type: string;
    created_at: string;
    clarification_round: number;
    signed_url: string | null;
  }>;
  analyses: Array<{
    id: string;
    provider: string;
    model: string;
    prompt_version: string;
    created_at: string;
    clarification_round: number;
    observations: ReviewObservation[];
  }>;
  clarification_responses: ClarificationResponse[];
  review_history: ReviewDecision[];
};

export type OpsOverview = {
  pending_review: number;
  clarification_requested: number;
  approved: number;
  open_reports: number;
  stale_facilities: number;
  contributors: number;
};

export async function createContributionDraft(
  facilityExternalKey: string,
  zone: ZoneKey,
  focusIndicator: FocusIndicator,
) {
  const { data, error } = await supabase.rpc("create_contribution_draft", {
    p_external_key: facilityExternalKey,
    p_zone_type: ZONE_TO_DB[zone],
    p_focus_indicator: focusIndicator,
  });
  if (error) throw error;
  return data as string;
}

export async function uploadRawContributionImage({
  contributionId,
  userId,
  file,
  index,
}: {
  contributionId: string;
  userId: string;
  file: File;
  index: number;
}) {
  const extension = file.type === "image/png" ? "png" : file.type === "image/webp" ? "webp" : "jpg";
  const storagePath = `${userId}/${contributionId}/${String(index + 1).padStart(2, "0")}-${crypto.randomUUID()}.${extension}`;
  const { error: uploadError } = await supabase.storage
    .from("mutah-raw-evidence")
    .upload(storagePath, file, { contentType: file.type, upsert: false });
  if (uploadError) throw uploadError;

  const { data: imageId, error: attachError } = await supabase.rpc("attach_contribution_image", {
    p_contribution_id: contributionId,
    p_storage_path: storagePath,
    p_mime_type: file.type,
  });
  if (attachError) {
    await supabase.storage.from("mutah-raw-evidence").remove([storagePath]);
    throw attachError;
  }

  return { imageId: imageId as string, storagePath };
}

export async function finalizeContributionForReview({
  contributionId,
  observations,
  confirmations,
}: {
  contributionId: string;
  observations: IndicatorEvidence[];
  confirmations: Contribution["confirmed"];
}) {
  const { error } = await supabase.rpc("finalize_contribution_for_review", {
    p_contribution_id: contributionId,
    p_provider: "google",
    p_model: "gemini-3.6-flash",
    p_prompt_version: "mutah-evidence-v1",
    p_observations: observations,
    p_confirmations: confirmations,
  });
  if (error) throw error;
}

export async function resubmitClarificationForReview({
  contributionId,
  contributorNote,
  observations,
  confirmations,
}: {
  contributionId: string;
  contributorNote?: string;
  observations: IndicatorEvidence[];
  confirmations: Contribution["confirmed"];
}) {
  const { error } = await supabase.rpc("resubmit_contribution_for_review", {
    p_contribution_id: contributionId,
    p_provider: "google",
    p_model: "gemini-3.6-flash",
    p_prompt_version: "mutah-evidence-v1",
    p_observations: observations,
    p_confirmations: confirmations,
    p_contributor_note: contributorNote?.trim() || null,
  });
  if (error) throw error;
}

export async function persistClarificationResponse({
  contributionId,
  userId,
  files,
  contributorNote,
  observations,
  confirmations,
}: {
  contributionId: string;
  userId: string;
  files: File[];
  contributorNote?: string;
  observations: IndicatorEvidence[];
  confirmations: Contribution["confirmed"];
}) {
  if (files.length === 0) throw new Error("CLARIFICATION_IMAGES_REQUIRED");
  for (const [index, file] of files.entries()) {
    await uploadRawContributionImage({ contributionId, userId, file, index });
  }
  await resubmitClarificationForReview({
    contributionId,
    ...(contributorNote === undefined ? {} : { contributorNote }),
    observations,
    confirmations,
  });
}

export async function persistLiveContribution({
  facilityExternalKey,
  zone,
  focusIndicator,
  userId,
  files,
  observations,
  confirmations,
}: {
  facilityExternalKey: string;
  zone: ZoneKey;
  focusIndicator: FocusIndicator;
  userId: string;
  files: File[];
  observations: IndicatorEvidence[];
  confirmations: Contribution["confirmed"];
}) {
  if (files.length === 0) throw new Error("LIVE_IMAGES_REQUIRED");
  const contributionId = await createContributionDraft(facilityExternalKey, zone, focusIndicator);
  for (const [index, file] of files.entries()) {
    await uploadRawContributionImage({ contributionId, userId, file, index });
  }
  await finalizeContributionForReview({ contributionId, observations, confirmations });
  return contributionId;
}

export async function listMyContributions(): Promise<PersistedContribution[]> {
  const { data, error } = await supabase
    .from("contributions")
    .select(
      "id,status,submitted_at,created_at,clarification_note,focus_indicator,facility:facilities(name_ar,name_en,external_key),zone:facility_zones(zone_type,label_ar,label_en),clarification_responses(id,clarification_round,contributor_note:note,created_at),review_history:moderation_decisions(id,decision,reviewer_note,created_at)",
    )
    .order("created_at", { ascending: false });
  if (error) throw error;
  return (data ?? []) as unknown as PersistedContribution[];
}

export async function listReviewContributions(): Promise<ReviewContribution[]> {
  const { data, error } = await supabase
    .from("contributions")
    .select(
      "id,status,submitted_by,submitted_at,created_at,clarification_note,focus_indicator,facility:facilities(name_ar,name_en,external_key),zone:facility_zones(zone_type,label_ar,label_en),images:contribution_images(id,storage_path,mime_type,created_at,clarification_round),analyses(id,provider,model,prompt_version,created_at,clarification_round,observations(id,indicator_code,ai_state,explanation_ar,explanation_en,confirmations(id,confirmed_state,action,note,created_at))),clarification_responses(id,clarification_round,contributor_note:note,created_at),review_history:moderation_decisions(id,decision,reviewer_note,created_at)",
    )
    .in("status", ["pending_review", "clarification_requested"])
    .order("created_at", { ascending: true });
  if (error) throw error;

  const rows = (data ?? []) as unknown as ReviewContribution[];
  return Promise.all(
    rows.map(async (row) => ({
      ...row,
      images: await Promise.all(
        (row.images ?? []).map(async (image) => {
          const { data: signed } = await supabase.storage
            .from("mutah-raw-evidence")
            .createSignedUrl(image.storage_path, 15 * 60);
          return { ...image, signed_url: signed?.signedUrl ?? null };
        }),
      ),
    })),
  );
}

export async function reviewContribution({
  contributionId,
  decision,
  note,
}: {
  contributionId: string;
  decision: "approved" | "rejected" | "clarification";
  note?: string;
}) {
  const { error } = await supabase.rpc("review_contribution", {
    p_contribution_id: contributionId,
    p_decision: decision,
    p_reviewer_note: note?.trim() || null,
  });
  if (error) throw error;
  if (decision === "approved" && typeof window !== "undefined") {
    window.dispatchEvent(new Event("mutah:reviewed-evidence-changed"));
  }
}

export async function getOpsOverview(): Promise<OpsOverview> {
  const { data, error } = await supabase.rpc("get_mutah_ops_overview");
  if (error) throw error;
  const row = (data ?? {}) as Partial<OpsOverview>;
  return {
    pending_review: Number(row.pending_review ?? 0),
    clarification_requested: Number(row.clarification_requested ?? 0),
    approved: Number(row.approved ?? 0),
    open_reports: Number(row.open_reports ?? 0),
    stale_facilities: Number(row.stale_facilities ?? 0),
    contributors: Number(row.contributors ?? 0),
  };
}
