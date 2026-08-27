import type { AccessNeed, IndicatorKey, IndicatorState, VerificationStatus } from "./types";

export const INDICATOR_ORDER: IndicatorKey[] = [
  "steps",
  "ramp",
  "handrail",
  "obstruction",
  "parking",
];

export const INDICATOR_LABEL: Record<IndicatorKey, string> = {
  steps: "درجات أو عتبة مرتفعة",
  ramp: "منحدر",
  handrail: "درابزين",
  obstruction: "عائق في مسار الوصول",
  parking: "موقف مخصص أو علامة إتاحة",
};

/** Per-indicator wording, because "ظاهر" vs "ظاهرة" differs by word gender. */
export const STATE_LABEL: Record<IndicatorKey, Record<IndicatorState, string>> = {
  steps: {
    present: "ظاهرة",
    absent: "غير ظاهرة",
    unknown: "لا يمكن التأكد",
    not_visible: "غير مرئية في الصور الحالية",
    not_applicable: "لا ينطبق",
  },
  ramp: {
    present: "ظاهر",
    absent: "غير ظاهر",
    unknown: "لا يمكن التأكد",
    not_visible: "غير مرئي في الصور الحالية",
    not_applicable: "لا ينطبق",
  },
  handrail: {
    present: "ظاهر",
    absent: "غير ظاهر",
    unknown: "لا يمكن التأكد",
    not_visible: "غير مرئي في الصور الحالية",
    not_applicable: "لا ينطبق",
  },
  obstruction: {
    present: "ظاهر",
    absent: "غير ظاهر",
    unknown: "لا يمكن التأكد",
    not_visible: "غير مرئي في الصور الحالية",
    not_applicable: "لا ينطبق",
  },
  parking: {
    present: "ظاهر",
    absent: "غير ظاهر",
    unknown: "لا يمكن التأكد",
    not_visible: "غير مرئي في الصور الحالية",
    not_applicable: "لا ينطبق",
  },
};

export const ACCESS_NEED_LABEL: Record<AccessNeed, string> = {
  step_free: "مسار بلا درجات",
  ramp_when_raised: "منحدر عند وجود ارتفاع",
  clear_path: "مسار خالٍ من العوائق",
  handrail: "درابزين",
  parking: "موقف مخصص",
};

export const ACCESS_NEEDS: AccessNeed[] = [
  "step_free",
  "ramp_when_raised",
  "clear_path",
  "handrail",
  "parking",
];

export const VERIFICATION_LABEL: Record<VerificationStatus, string> = {
  team_reviewed: "راجعها فريق مُتاح",
  contributor_only: "مصدرها مساهم، لم تُراجع بعد",
  pending_review: "قيد المراجعة",
  disputed: "معلومات متعارضة",
  stale: "تحتاج تحديثًا",
};

const AR_MONTHS = [
  "يناير",
  "فبراير",
  "مارس",
  "أبريل",
  "مايو",
  "يونيو",
  "يوليو",
  "أغسطس",
  "سبتمبر",
  "أكتوبر",
  "نوفمبر",
  "ديسمبر",
];

export function formatArabicDate(iso: string): string {
  const d = new Date(iso);
  return `${d.getDate()} ${AR_MONTHS[d.getMonth()]} ${d.getFullYear()}`;
}

export function relativeArabic(iso: string, now = new Date()): string {
  const days = Math.max(0, Math.round((now.getTime() - new Date(iso).getTime()) / 86400000));
  if (days === 0) return "اليوم";
  if (days === 1) return "أمس";
  if (days < 11) return `قبل ${days} أيام`;
  if (days < 60) return `قبل ${Math.round(days / 7)} أسابيع`;
  return `قبل ${Math.round(days / 30)} أشهر`;
}
