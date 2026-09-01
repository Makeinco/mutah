import { bi } from "./i18n";
import type {
  AccessNeed,
  IndicatorKey,
  IndicatorState,
  L,
  Lang,
  VerificationStatus,
  ZoneKey,
} from "./types";

/* Zones -------------------------------------------------------------------- */

export const ZONE_ORDER: ZoneKey[] = ["approach", "entrance", "parking", "elevator", "restroom"];

export const ZONE_LABEL: Record<ZoneKey, L> = {
  approach: bi("مسار الوصول", "Approach"),
  entrance: bi("المدخل", "Entrance"),
  parking: bi("المواقف", "Parking"),
  elevator: bi("المصعد", "Elevator"),
  restroom: bi("دورة المياه", "Restroom"),
};

export const ZONE_HINT: Record<ZoneKey, L> = {
  approach: bi(
    "الرصيف والطريق من الشارع حتى الباب.",
    "The sidewalk and route from the street to the door.",
  ),
  entrance: bi("الباب وما يسبقه من درجات أو منحدر.", "The door and the steps or ramp before it."),
  parking: bi("الموقف المخصص والمسار منه إلى المدخل.", "Designated parking and the route to the entrance."),
  elevator: bi("المصعد داخل المبنى ومساحته.", "The elevator inside the building and its space."),
  restroom: bi("دورة المياه المتاحة وبابها.", "The accessible restroom and its door."),
};

export const ZONE_INDICATORS: Record<ZoneKey, IndicatorKey[]> = {
  approach: ["path_surface", "curb_ramp"],
  entrance: ["steps", "ramp", "handrail", "obstruction"],
  parking: ["parking", "parking_route"],
  elevator: ["elevator", "elevator_space"],
  restroom: ["accessible_restroom", "restroom_door"],
};

/* Indicators --------------------------------------------------------------- */

export const INDICATOR_ORDER: IndicatorKey[] = ZONE_ORDER.flatMap((z) => ZONE_INDICATORS[z]);

export const INDICATOR_ZONE: Record<IndicatorKey, ZoneKey> = Object.fromEntries(
  ZONE_ORDER.flatMap((z) => ZONE_INDICATORS[z].map((k) => [k, z])),
) as Record<IndicatorKey, ZoneKey>;

export const INDICATOR_LABEL: Record<IndicatorKey, L> = {
  path_surface: bi("مسار مستوٍ ومرصوف", "Even, paved route"),
  curb_ramp: bi("منحدر رصيف", "Curb ramp"),
  steps: bi("درجات أو عتبة مرتفعة", "Steps or a raised threshold"),
  ramp: bi("منحدر", "Ramp"),
  handrail: bi("درابزين", "Handrail"),
  obstruction: bi("عائق في مسار الوصول", "Obstruction on the route"),
  parking: bi("موقف مخصص أو علامة إتاحة", "Designated parking or access marking"),
  parking_route: bi("مسار من الموقف إلى المدخل", "Route from parking to the entrance"),
  elevator: bi("مصعد", "Elevator"),
  elevator_space: bi("مساحة كافية داخل المصعد", "Enough space inside the elevator"),
  accessible_restroom: bi("دورة مياه متاحة", "Accessible restroom"),
  restroom_door: bi("باب واسع لدورة المياه", "Wide restroom door"),
};

/** Arabic grammatical gender, so "ظاهر" / "ظاهرة" reads correctly. */
const FEMININE: IndicatorKey[] = ["steps", "accessible_restroom"];

export function stateLabel(key: IndicatorKey, state: IndicatorState): L {
  const f = FEMININE.includes(key);
  switch (state) {
    case "present":
      return bi(f ? "ظاهرة" : "ظاهر", "Visible");
    case "absent":
      return bi(f ? "غير ظاهرة" : "غير ظاهر", "Not visible in view");
    case "not_visible":
      return bi(f ? "غير مرئية في الصور" : "غير مرئي في الصور", "Outside the photo frame");
    case "not_applicable":
      return bi("لا ينطبق", "Not applicable");
    default:
      return bi("لا يمكن التأكد", "Cannot be confirmed");
  }
}

/* Access needs ------------------------------------------------------------- */

export const ACCESS_NEEDS: AccessNeed[] = [
  "step_free",
  "ramp_when_raised",
  "clear_path",
  "handrail",
  "parking",
  "elevator",
  "accessible_restroom",
];

export const ACCESS_NEED_LABEL: Record<AccessNeed, L> = {
  step_free: bi("مسار بلا درجات", "Step-free route"),
  ramp_when_raised: bi("منحدر عند وجود ارتفاع", "A ramp where there is a rise"),
  clear_path: bi("مسار خالٍ من العوائق", "Clear, unobstructed route"),
  handrail: bi("درابزين", "Handrail"),
  parking: bi("موقف مخصص", "Designated parking"),
  elevator: bi("مصعد", "Elevator"),
  accessible_restroom: bi("دورة مياه متاحة", "Accessible restroom"),
};

/* Verification ------------------------------------------------------------- */

export const VERIFICATION_LABEL: Record<VerificationStatus, L> = {
  team_reviewed: bi("راجعها فريق مُتاح", "Reviewed by the MUTAH team"),
  contributor_only: bi("مصدرها مساهم، لم تُراجع بعد", "From a contributor, not yet reviewed"),
  pending_review: bi("قيد المراجعة", "Under review"),
  disputed: bi("معلومات متعارضة", "Conflicting information"),
  stale: bi("تحتاج تحديثًا", "Needs an update"),
};

/* Dates -------------------------------------------------------------------- */

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

const EN_MONTHS = [
  "January",
  "February",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "October",
  "November",
  "December",
];

export function formatDate(iso: string, lang: Lang): string {
  const d = new Date(iso);
  const months = lang === "ar" ? AR_MONTHS : EN_MONTHS;
  return lang === "ar"
    ? `${d.getDate()} ${months[d.getMonth()]} ${d.getFullYear()}`
    : `${months[d.getMonth()]} ${d.getDate()}, ${d.getFullYear()}`;
}

export function relativeDate(iso: string, lang: Lang, now = new Date()): string {
  const days = Math.max(0, Math.round((now.getTime() - new Date(iso).getTime()) / 86400000));
  if (lang === "ar") {
    if (days === 0) return "اليوم";
    if (days === 1) return "أمس";
    if (days < 11) return `قبل ${days} أيام`;
    if (days < 60) return `قبل ${Math.round(days / 7)} أسابيع`;
    return `قبل ${Math.round(days / 30)} أشهر`;
  }
  if (days === 0) return "today";
  if (days === 1) return "yesterday";
  if (days < 11) return `${days} days ago`;
  if (days < 60) return `${Math.round(days / 7)} weeks ago`;
  return `${Math.round(days / 30)} months ago`;
}
