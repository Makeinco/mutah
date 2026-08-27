import cafeImg from "@/assets/entrance-cafe.jpg";
import libraryImg from "@/assets/entrance-library.jpg";
import pharmacyImg from "@/assets/entrance-pharmacy.jpg";
import mallImg from "@/assets/entrance-mall.jpg";
import type { Contribution, Facility, IndicatorEvidence, IndicatorKey } from "./types";

/**
 * Mock repository. Replace the bodies of these functions with Supabase queries
 * later — component code only depends on the shapes returned here.
 */

const ev = (
  key: IndicatorKey,
  state: IndicatorEvidence["state"],
  note: string,
): IndicatorEvidence => ({ key, state, note });

function indicators(list: IndicatorEvidence[]): Facility["indicators"] {
  return Object.fromEntries(list.map((e) => [e.key, e])) as Facility["indicators"];
}

export const FACILITIES: Facility[] = [
  {
    id: "cafe-nassim",
    name: "مقهى نسيم",
    category: "مقهى",
    area: "حي النخيل",
    distanceKm: 0.4,
    point: { x: 0.32, y: 0.38 },
    imageUrl: cafeImg,
    imageAlt: "مدخل مقهى نسيم: باب زجاجي تسبقه درجة واحدة ورصيف مرصوف.",
    lastVerifiedISO: "2026-08-24",
    verification: "team_reviewed",
    source: "contributor_image",
    indicators: indicators([
      ev("steps", "present", "تظهر درجة أمام الباب الرئيسي."),
      ev("ramp", "not_visible", "لا يظهر منحدر داخل إطار الصورة الحالية."),
      ev("handrail", "present", "يظهر عمود معدني بمحاذاة الدرجة."),
      ev("obstruction", "absent", "مسار الرصيف أمام الباب يبدو خاليًا."),
      ev("parking", "not_visible", "الموقف خارج إطار الصور الحالية، لذلك لا يمكن تأكيده."),
    ]),
  },
  {
    id: "library-taak",
    name: "مكتبة الحي العامة",
    category: "مكتبة عامة",
    area: "حي الياسمين",
    distanceKm: 1.2,
    point: { x: 0.62, y: 0.24 },
    imageUrl: libraryImg,
    imageAlt: "مدخل مكتبة عامة: أبواب زجاجية وأرضية مستوية بلا درجات.",
    lastVerifiedISO: "2026-08-20",
    verification: "team_reviewed",
    source: "team_survey",
    indicators: indicators([
      ev("steps", "absent", "لا تظهر درجات؛ الأرضية مستوية حتى الباب."),
      ev("ramp", "not_applicable", "لا يوجد ارتفاع يستدعي منحدرًا."),
      ev("handrail", "absent", "لا يظهر درابزين، ولا يوجد ارتفاع يستدعيه."),
      ev("obstruction", "absent", "المسار أمام الباب واسع وخالٍ."),
      ev("parking", "not_visible", "لا تظهر مواقف المركبات في الصور الحالية."),
    ]),
  },
  {
    id: "pharmacy-rukn",
    name: "صيدلية الركن",
    category: "صيدلية",
    area: "حي النخيل",
    distanceKm: 0.8,
    point: { x: 0.44, y: 0.66 },
    imageUrl: pharmacyImg,
    imageAlt: "مدخل صيدلية: درجة مرتفعة أمام الباب وأحواض نباتات على الرصيف.",
    lastVerifiedISO: "2026-05-11",
    verification: "stale",
    source: "contributor_image",
    indicators: indicators([
      ev("steps", "present", "تظهر عتبة مرتفعة أمام الباب."),
      ev("ramp", "absent", "لا يظهر منحدر بجانب المدخل."),
      ev("handrail", "absent", "لا يظهر درابزين."),
      ev("obstruction", "present", "أحواض نباتات تضيّق مسار الوصول إلى الباب."),
      ev("parking", "unknown", "لا يمكن التأكد من وجود موقف مخصص."),
    ]),
  },
  {
    id: "mall-side",
    name: "مركز الواحة — المدخل الجانبي",
    category: "مركز تسوق",
    area: "طريق الملك عبدالله",
    distanceKm: 2.6,
    point: { x: 0.74, y: 0.58 },
    imageUrl: mallImg,
    imageAlt: "مدخل جانبي لمركز تسوق: منحدر طويل بدرابزين على الجانبين ولوحة موقف مخصص.",
    lastVerifiedISO: "2026-08-26",
    verification: "team_reviewed",
    source: "team_survey",
    indicators: indicators([
      ev("steps", "present", "تظهر درجات بجانب المنحدر."),
      ev("ramp", "present", "يظهر منحدر طويل يصل إلى الباب."),
      ev("handrail", "present", "يظهر درابزين على جانبي المنحدر."),
      ev("obstruction", "absent", "المسار على المنحدر يبدو خاليًا."),
      ev("parking", "present", "تظهر لوحة موقف مخصص قرب المدخل."),
    ]),
  },
  {
    id: "clinic-noor",
    name: "مركز نور الصحي",
    category: "مركز صحي",
    area: "حي الياسمين",
    distanceKm: 1.9,
    point: { x: 0.2, y: 0.72 },
    imageUrl: "",
    imageAlt: "",
    lastVerifiedISO: "2026-03-02",
    verification: "stale",
    source: "contributor_image",
    indicators: indicators([
      ev("steps", "unknown", "لا توجد صورة حديثة للمدخل."),
      ev("ramp", "unknown", "لا توجد صورة حديثة للمدخل."),
      ev("handrail", "unknown", "لا توجد صورة حديثة للمدخل."),
      ev("obstruction", "unknown", "لا توجد صورة حديثة للمدخل."),
      ev("parking", "unknown", "لا توجد صورة حديثة للمدخل."),
    ]),
  },
];

export const INITIAL_CONTRIBUTIONS: Contribution[] = [
  {
    id: "c-1024",
    facilityId: "pharmacy-rukn",
    facilityName: "صيدلية الركن",
    imageUrl: pharmacyImg,
    submittedISO: "2026-08-26",
    status: "pending_review",
    aiObservations: [
      ev("steps", "present", "تظهر عتبة مرتفعة أمام الباب."),
      ev("ramp", "absent", "لا يظهر منحدر بجانب المدخل."),
      ev("handrail", "absent", "لا يظهر درابزين."),
      ev("obstruction", "present", "أحواض نباتات على مسار الوصول."),
      ev("parking", "not_visible", "الموقف خارج إطار الصورة."),
    ],
    confirmed: {
      steps: { state: "present", action: "confirmed" },
      ramp: { state: "absent", action: "confirmed" },
      handrail: { state: "absent", action: "confirmed" },
      obstruction: { state: "present", action: "confirmed" },
      parking: { state: "unknown", action: "unsure" },
    },
  },
];

export function listFacilities(): Facility[] {
  return FACILITIES;
}

export function getFacility(id: string): Facility | undefined {
  return FACILITIES.find((f) => f.id === id);
}
