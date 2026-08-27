import { INDICATOR_ORDER } from "./labels";
import type { Facility, IndicatorEvidence, IndicatorKey } from "./types";

/**
 * AI provider adapter (mock).
 * Later: replace `analyseEntranceImage` with a call to a server function that
 * talks to Gemini. The contract — five observations, states, human notes —
 * stays identical, so no UI change is needed.
 */

export interface AnalysisStep {
  id: string;
  label: string;
}

export const ANALYSIS_STEPS: AnalysisStep[] = [
  { id: "prepare", label: "جاري تجهيز الصورة" },
  { id: "quality", label: "فحص جودة الصورة" },
  { id: "privacy", label: "حماية الخصوصية" },
  { id: "analyse", label: "تحليل عناصر المدخل" },
  { id: "evidence", label: "تجهيز الأدلة" },
];

/**
 * Deterministic mock analysis. Always leaves at least one indicator uncertain,
 * because uncertainty is a product feature, not a defect.
 */
export function analyseEntranceImage(facility: Facility | undefined): IndicatorEvidence[] {
  const base: Record<IndicatorKey, IndicatorEvidence> = {
    steps: { key: "steps", state: "present", note: "تظهر درجة واحدة أمام الباب الرئيسي." },
    ramp: { key: "ramp", state: "present", note: "يظهر منحدر بجانب المدخل." },
    handrail: { key: "handrail", state: "present", note: "يظهر درابزين بمحاذاة المنحدر." },
    obstruction: { key: "obstruction", state: "absent", note: "لا يظهر عائق في مسار الوصول." },
    parking: {
      key: "parking",
      state: "not_visible",
      note: "الموقف خارج إطار الصورة الحالية، لذلك لا يمكن تأكيده.",
    },
  };

  if (facility?.id === "pharmacy-rukn") {
    base['ramp'] = { key: "ramp", state: "present", note: "يظهر منحدر معدني صغير أمام العتبة." };
    base['obstruction'] = {
      key: "obstruction",
      state: "absent",
      note: "تم إزاحة الأحواض؛ المسار يبدو خاليًا.",
    };
    base['handrail'] = { key: "handrail", state: "not_visible", note: "جانب الباب خارج إطار الصورة." };
  }

  return INDICATOR_ORDER.map((k) => base[k]);
}

/** Basic pre-checks shown to the user before analysis. */
export function checkImageQuality(): { ok: boolean; message: string } {
  return { ok: true, message: "جودة الصورة كافية للتحليل." };
}
