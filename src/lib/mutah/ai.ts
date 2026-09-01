import { bi } from "./i18n";
import { ZONE_INDICATORS } from "./labels";
import type { Facility, IndicatorEvidence, IndicatorKey, L, ZoneKey } from "./types";

/**
 * AI provider adapter (mock).
 * Later: replace `analyseZoneImage` with a call to a server function that
 * talks to a vision model. The contract — observations, states, human notes —
 * stays identical, so no UI change is needed.
 */

export interface AnalysisStep {
  id: string;
  label: L;
}

export const ANALYSIS_STEPS: AnalysisStep[] = [
  { id: "prepare", label: bi("جاري تجهيز الصورة", "Preparing the photo") },
  { id: "quality", label: bi("فحص جودة الصورة", "Checking photo quality") },
  { id: "privacy", label: bi("حماية الخصوصية", "Protecting privacy") },
  { id: "analyse", label: bi("تحليل عناصر المسار", "Analysing the view") },
  { id: "evidence", label: bi("تجهيز الأدلة", "Preparing the evidence") },
];

const DEFAULTS: Record<IndicatorKey, { state: IndicatorEvidence["state"]; note: L }> = {
  path_surface: { state: "present", note: bi("المسار يبدو مرصوفًا ومستويًا.", "The route looks paved and level.") },
  curb_ramp: { state: "not_visible", note: bi("طرف الرصيف خارج إطار الصورة.", "The curb edge is outside the frame.") },
  steps: { state: "present", note: bi("تظهر درجة واحدة أمام الباب.", "One step appears in front of the door.") },
  ramp: { state: "present", note: bi("يظهر منحدر بجانب المدخل.", "A ramp appears beside the entrance.") },
  handrail: { state: "present", note: bi("يظهر درابزين بمحاذاة المنحدر.", "A handrail runs along the ramp.") },
  obstruction: { state: "absent", note: bi("لا يظهر عائق في مسار الوصول.", "No obstruction appears on the route.") },
  parking: { state: "not_visible", note: bi("الموقف خارج إطار الصورة الحالية.", "Parking is outside the current frame.") },
  parking_route: { state: "unknown", note: bi("المسار من الموقف غير واضح.", "The route from parking isn't clear.") },
  elevator: { state: "present", note: bi("يظهر باب مصعد في الصورة.", "An elevator door appears in the photo.") },
  elevator_space: { state: "not_visible", note: bi("داخل المصعد غير ظاهر.", "The inside of the elevator isn't visible.") },
  accessible_restroom: { state: "present", note: bi("تظهر علامة إتاحة على الباب.", "An access sign appears on the door.") },
  restroom_door: { state: "not_visible", note: bi("عرض الباب غير واضح في الصورة.", "The door width isn't clear in the photo.") },
};

/**
 * Deterministic mock analysis for one zone. Always leaves at least one
 * indicator uncertain, because uncertainty is a product feature, not a defect.
 */
export function analyseZoneImage(facility: Facility | undefined, zone: ZoneKey): IndicatorEvidence[] {
  const keys = ZONE_INDICATORS[zone];
  return keys.map((key) => {
    if (facility?.id === "pharmacy-rukn" && key === "ramp") {
      return { key, state: "present", note: bi("يظهر منحدر معدني صغير أمام العتبة.", "A small metal ramp appears in front of the threshold.") };
    }
    if (facility?.id === "pharmacy-rukn" && key === "obstruction") {
      return { key, state: "absent", note: bi("تم إزاحة الأحواض؛ المسار يبدو خاليًا.", "The planters were moved; the route looks clear.") };
    }
    const d = DEFAULTS[key];
    return { key, state: d.state, note: d.note };
  });
}

/** Basic pre-checks shown to the user before analysis. */
export function checkImageQuality(): { ok: boolean; message: L } {
  return { ok: true, message: bi("جودة الصورة كافية للتحليل.", "Photo quality is sufficient for analysis.") };
}
