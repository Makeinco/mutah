import cafeImg from "@/assets/entrance-cafe.jpg";
import libraryImg from "@/assets/entrance-library.jpg";
import pharmacyImg from "@/assets/entrance-pharmacy.jpg";
import mallImg from "@/assets/entrance-mall.jpg";
import { bi } from "./i18n";
import { INDICATOR_ORDER, INDICATOR_ZONE, ZONE_ORDER } from "./labels";
import type {
  Contribution,
  EvidenceImage,
  Facility,
  IndicatorEvidence,
  IndicatorKey,
  ZoneEvidence,
  ZoneKey,
} from "./types";

/**
 * Mock repository. Replace the bodies of these functions with Supabase queries
 * later — component code only depends on the shapes returned here.
 */

const ev = (
  key: IndicatorKey,
  state: IndicatorEvidence["state"],
  ar: string,
  en: string,
): IndicatorEvidence => ({ key, state, note: bi(ar, en) });

const UNDOCUMENTED = bi(
  "لا توجد صورة موثقة لهذا المسار بعد.",
  "This view has not been photographed yet.",
);

/** Fill every indicator; anything not supplied stays honestly unknown. */
function indicators(list: IndicatorEvidence[]): Facility["indicators"] {
  const map = Object.fromEntries(list.map((e) => [e.key, e])) as Partial<Facility["indicators"]>;
  for (const key of INDICATOR_ORDER) {
    if (!map[key]) map[key] = { key, state: "unknown", note: UNDOCUMENTED };
  }
  return map as Facility["indicators"];
}

function zones(documented: Partial<Record<ZoneKey, EvidenceImage[]>>): Facility["zones"] {
  return Object.fromEntries(
    ZONE_ORDER.map((key) => {
      const images = documented[key] ?? [];
      return [key, { key, images, documented: images.length > 0 } satisfies ZoneEvidence];
    }),
  ) as Facility["zones"];
}

const img = (url: string, ar: string, en: string, capturedISO: string): EvidenceImage => ({
  url,
  alt: bi(ar, en),
  capturedISO,
});

export const FACILITIES: Facility[] = [
  {
    id: "cafe-nassim",
    name: bi("مقهى نسيم", "Naseem Café"),
    category: bi("مقهى", "Café"),
    area: bi("حي النخيل", "Al Nakheel district"),
    distanceKm: 0.4,
    point: { x: 0.32, y: 0.38 },
    imageUrl: cafeImg,
    imageAlt: bi(
      "مدخل مقهى نسيم: باب زجاجي تسبقه درجة واحدة ورصيف مرصوف.",
      "Naseem Café entrance: a glass door with one step and a paved sidewalk.",
    ),
    lastVerifiedISO: "2026-08-24",
    verification: "team_reviewed",
    source: "contributor_image",
    indicators: indicators([
      ev("path_surface", "present", "الرصيف أمام المقهى مستوٍ ومرصوف.", "The sidewalk in front of the café is even and paved."),
      ev("curb_ramp", "not_visible", "طرف الرصيف خارج إطار الصورة.", "The curb edge is outside the photo frame."),
      ev("steps", "present", "تظهر درجة أمام الباب الرئيسي.", "One step is visible in front of the main door."),
      ev("ramp", "not_visible", "لا يظهر منحدر داخل إطار الصورة الحالية.", "No ramp appears within the current frame."),
      ev("handrail", "present", "يظهر عمود معدني بمحاذاة الدرجة.", "A metal rail runs alongside the step."),
      ev("obstruction", "absent", "مسار الرصيف أمام الباب يبدو خاليًا.", "The sidewalk route to the door looks clear."),
      ev("elevator", "not_applicable", "المقهى بطابق واحد.", "The café is single-storey."),
    ]),
    zones: zones({
      approach: [
        img(cafeImg, "الرصيف المؤدي إلى مقهى نسيم.", "The sidewalk leading to Naseem Café.", "2026-08-24"),
      ],
      entrance: [
        img(cafeImg, "الباب الزجاجي وأمامه درجة واحدة.", "The glass door with a single step in front.", "2026-08-24"),
      ],
    }),
  },
  {
    id: "library-taak",
    name: bi("مكتبة الحي العامة", "Neighbourhood Public Library"),
    category: bi("مكتبة عامة", "Public library"),
    area: bi("حي الياسمين", "Al Yasmin district"),
    distanceKm: 1.2,
    point: { x: 0.62, y: 0.24 },
    imageUrl: libraryImg,
    imageAlt: bi(
      "مدخل مكتبة عامة: أبواب زجاجية وأرضية مستوية بلا درجات.",
      "Public library entrance: glass doors and a level, step-free floor.",
    ),
    lastVerifiedISO: "2026-08-20",
    verification: "team_reviewed",
    source: "team_survey",
    indicators: indicators([
      ev("path_surface", "present", "المسار من الشارع مرصوف ومستوٍ.", "The route from the street is paved and level."),
      ev("curb_ramp", "present", "يظهر منحدر رصيف عند مدخل الموقع.", "A curb ramp is visible at the site entrance."),
      ev("steps", "absent", "لا تظهر درجات؛ الأرضية مستوية حتى الباب.", "No steps; the floor is level up to the door."),
      ev("ramp", "not_applicable", "لا يوجد ارتفاع يستدعي منحدرًا.", "There is no rise that would need a ramp."),
      ev("handrail", "absent", "لا يظهر درابزين، ولا يوجد ارتفاع يستدعيه.", "No handrail is visible, and no rise requires one."),
      ev("obstruction", "absent", "المسار أمام الباب واسع وخالٍ.", "The route to the door is wide and clear."),
      ev("parking", "present", "تظهر لوحة موقف مخصص قرب المدخل الرئيسي.", "A designated parking sign is visible near the main entrance."),
      ev("parking_route", "present", "المسار من الموقف إلى الباب مرصوف وبلا درجات.", "The route from parking to the door is paved and step-free."),
      ev("elevator", "present", "يظهر مصعد في بهو المكتبة.", "An elevator is visible in the library lobby."),
      ev("elevator_space", "present", "المساحة داخل المصعد تتسع لكرسي متحرك.", "The elevator has space for a wheelchair."),
      ev("accessible_restroom", "present", "تظهر دورة مياه متاحة مع علامة إتاحة.", "An accessible restroom with an access sign is visible."),
      ev("restroom_door", "present", "باب دورة المياه واسع ويفتح للخارج.", "The restroom door is wide and opens outward."),
    ]),
    zones: zones({
      approach: [img(libraryImg, "المسار المرصوف من الشارع إلى المكتبة.", "The paved route from the street to the library.", "2026-08-20")],
      entrance: [img(libraryImg, "أبواب زجاجية وأرضية مستوية.", "Glass doors and a level floor.", "2026-08-20")],
      parking: [img(libraryImg, "موقف مخصص قرب المدخل.", "Designated parking near the entrance.", "2026-08-20")],
      elevator: [img(libraryImg, "مصعد في بهو المكتبة.", "Elevator in the library lobby.", "2026-08-20")],
      restroom: [img(libraryImg, "دورة مياه متاحة بعلامة إتاحة.", "Accessible restroom with an access sign.", "2026-08-20")],
    }),
  },
  {
    id: "pharmacy-rukn",
    name: bi("صيدلية الركن", "Al Rukn Pharmacy"),
    category: bi("صيدلية", "Pharmacy"),
    area: bi("حي النخيل", "Al Nakheel district"),
    distanceKm: 0.8,
    point: { x: 0.44, y: 0.66 },
    imageUrl: pharmacyImg,
    imageAlt: bi(
      "مدخل صيدلية: درجة مرتفعة أمام الباب وأحواض نباتات على الرصيف.",
      "Pharmacy entrance: a raised step at the door and planters on the sidewalk.",
    ),
    lastVerifiedISO: "2026-05-11",
    verification: "stale",
    source: "contributor_image",
    indicators: indicators([
      ev("path_surface", "present", "الرصيف مرصوف لكنه ضيق.", "The sidewalk is paved but narrow."),
      ev("curb_ramp", "absent", "لا يظهر منحدر رصيف قرب المحل.", "No curb ramp is visible near the shop."),
      ev("steps", "present", "تظهر عتبة مرتفعة أمام الباب.", "A raised threshold is visible at the door."),
      ev("ramp", "absent", "لا يظهر منحدر بجانب المدخل.", "No ramp is visible beside the entrance."),
      ev("handrail", "absent", "لا يظهر درابزين.", "No handrail is visible."),
      ev("obstruction", "present", "أحواض نباتات تضيّق مسار الوصول إلى الباب.", "Planters narrow the route to the door."),
      ev("parking", "unknown", "لا يمكن التأكد من وجود موقف مخصص.", "Designated parking can't be confirmed."),
      ev("elevator", "not_applicable", "المحل بطابق واحد.", "The shop is single-storey."),
    ]),
    zones: zones({
      approach: [img(pharmacyImg, "الرصيف الضيق أمام الصيدلية.", "The narrow sidewalk in front of the pharmacy.", "2026-05-11")],
      entrance: [img(pharmacyImg, "عتبة مرتفعة وأحواض نباتات أمام الباب.", "A raised threshold and planters in front of the door.", "2026-05-11")],
    }),
  },
  {
    id: "mall-side",
    name: bi("مركز الواحة — المدخل الجانبي", "Al Waha Centre — side entrance"),
    category: bi("مركز تسوق", "Shopping centre"),
    area: bi("طريق الملك عبدالله", "King Abdullah Road"),
    distanceKm: 2.6,
    point: { x: 0.74, y: 0.58 },
    imageUrl: mallImg,
    imageAlt: bi(
      "مدخل جانبي لمركز تسوق: منحدر طويل بدرابزين على الجانبين ولوحة موقف مخصص.",
      "Shopping centre side entrance: a long ramp with handrails on both sides and a designated parking sign.",
    ),
    lastVerifiedISO: "2026-08-26",
    verification: "team_reviewed",
    source: "team_survey",
    indicators: indicators([
      ev("path_surface", "present", "المسار من الموقف مرصوف ومستوٍ.", "The route from the car park is paved and level."),
      ev("curb_ramp", "present", "يظهر منحدر رصيف عند نهاية الممر.", "A curb ramp is visible at the end of the walkway."),
      ev("steps", "present", "تظهر درجات بجانب المنحدر.", "Steps are visible beside the ramp."),
      ev("ramp", "present", "يظهر منحدر طويل يصل إلى الباب.", "A long ramp leads to the door."),
      ev("handrail", "present", "يظهر درابزين على جانبي المنحدر.", "Handrails run along both sides of the ramp."),
      ev("obstruction", "absent", "المسار على المنحدر يبدو خاليًا.", "The ramp route looks clear."),
      ev("parking", "present", "تظهر لوحة موقف مخصص قرب المدخل.", "A designated parking sign is visible near the entrance."),
      ev("parking_route", "present", "المسار من الموقف إلى المنحدر متصل وبلا درجات.", "The route from parking to the ramp is continuous and step-free."),
      ev("elevator", "present", "يظهر مصعد بعد المدخل الجانبي مباشرة.", "An elevator is visible just inside the side entrance."),
      ev("elevator_space", "not_visible", "داخل المصعد غير ظاهر في الصور الحالية.", "The inside of the elevator isn't shown in current photos."),
      ev("accessible_restroom", "present", "تظهر لوحة دورة مياه متاحة في الممر.", "An accessible restroom sign is visible in the corridor."),
      ev("restroom_door", "not_visible", "باب دورة المياه خارج إطار الصورة.", "The restroom door is outside the photo frame."),
    ]),
    zones: zones({
      approach: [img(mallImg, "ممر مرصوف من الموقف إلى المدخل الجانبي.", "A paved walkway from the car park to the side entrance.", "2026-08-26")],
      entrance: [img(mallImg, "منحدر طويل بدرابزين على الجانبين.", "A long ramp with handrails on both sides.", "2026-08-26")],
      parking: [img(mallImg, "لوحة موقف مخصص قرب المدخل.", "Designated parking sign near the entrance.", "2026-08-26")],
      elevator: [img(mallImg, "مصعد قرب المدخل الجانبي.", "Elevator near the side entrance.", "2026-08-26")],
    }),
  },
  {
    id: "clinic-noor",
    name: bi("مركز نور الصحي", "Noor Health Centre"),
    category: bi("مركز صحي", "Health centre"),
    area: bi("حي الياسمين", "Al Yasmin district"),
    distanceKm: 1.9,
    point: { x: 0.2, y: 0.72 },
    imageUrl: "",
    imageAlt: bi("", ""),
    lastVerifiedISO: "2026-03-02",
    verification: "stale",
    source: "contributor_image",
    indicators: indicators([]),
    zones: zones({}),
  },
];

export const INITIAL_CONTRIBUTIONS: Contribution[] = [
  {
    id: "c-1024",
    facilityId: "pharmacy-rukn",
    facilityName: bi("صيدلية الركن", "Al Rukn Pharmacy"),
    zone: "entrance",
    imageUrl: pharmacyImg,
    submittedISO: "2026-08-26",
    status: "pending_review",
    aiObservations: [
      ev("steps", "present", "تظهر عتبة مرتفعة أمام الباب.", "A raised threshold is visible at the door."),
      ev("ramp", "absent", "لا يظهر منحدر بجانب المدخل.", "No ramp is visible beside the entrance."),
      ev("handrail", "absent", "لا يظهر درابزين.", "No handrail is visible."),
      ev("obstruction", "present", "أحواض نباتات على مسار الوصول.", "Planters sit on the access route."),
    ],
    confirmed: {
      steps: { state: "present", action: "confirmed" },
      ramp: { state: "absent", action: "confirmed" },
      handrail: { state: "absent", action: "confirmed" },
      obstruction: { state: "present", action: "confirmed" },
    },
  },
];

export function listFacilities(): Facility[] {
  return FACILITIES;
}

export function getFacility(id: string): Facility | undefined {
  return FACILITIES.find((f) => f.id === id);
}

export function zoneOf(key: IndicatorKey): ZoneKey {
  return INDICATOR_ZONE[key];
}
