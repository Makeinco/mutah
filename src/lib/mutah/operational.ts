import { supabase } from "./supabase-client";
import type { Contribution, IndicatorEvidence, ZoneKey } from "./types";

const ZONE_TO_DB: Record<ZoneKey, "approach_path" | "entrance" | "parking" | "elevator" | "accessible_restroom"> = {
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
  facility: { name_ar: string; name_en: string | null; external_key: string | null } | null;
  zone: { zone_type: string; label_ar: string | null; label_en: string | null } | null;
};

export async function createContributionDraft(facilityExternalKey: string, zone: ZoneKey) {
  const { data, error } = await supabase.rpc("create_contribution_draft", {
    p_external_key: facilityExternalKey,
    p_zone_type: ZONE_TO_DB[zone],
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

export async function persistLiveContribution({
  facilityExternalKey,
  zone,
  userId,
  files,
  observations,
  confirmations,
}: {
  facilityExternalKey: string;
  zone: ZoneKey;
  userId: string;
  files: File[];
  observations: IndicatorEvidence[];
  confirmations: Contribution["confirmed"];
}) {
  if (files.length === 0) throw new Error("LIVE_IMAGES_REQUIRED");
  const contributionId = await createContributionDraft(facilityExternalKey, zone);
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
      "id,status,submitted_at,created_at,clarification_note,facility:facilities(name_ar,name_en,external_key),zone:facility_zones(zone_type,label_ar,label_en)",
    )
    .order("created_at", { ascending: false });
  if (error) throw error;
  return (data ?? []) as unknown as PersistedContribution[];
}
