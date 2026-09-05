import { bi } from "./i18n";
import { INDICATOR_ORDER } from "./labels";
import type { AccessNeed, Facility, IndicatorKey, IndicatorState, L } from "./types";

/**
 * Personalised status logic. Deliberately NOT a score.
 * Output is a status plus the reasons behind it, always bilingual.
 */
export type NeedOutcome = "met" | "not_met" | "unknown";

export interface NeedResult {
  need: AccessNeed;
  outcome: NeedOutcome;
  reason: L;
}

/** Four personalised statuses. */
export type Verdict = "available" | "partial" | "not_available" | "insufficient";

export const VERDICT_LABEL: Record<Verdict, L> = {
  available: bi("متاح", "Available"),
  partial: bi("متاح جزئيًا", "Partially available"),
  not_available: bi("غير متاح وفق احتياجاتك الحالية", "Not available for your current needs"),
  insufficient: bi("معلومات غير كافية", "Not enough information"),
};

export const VERDICT_DETAIL: Record<Verdict, L> = {
  available: bi(
    "كل ما اخترته مؤكد في الأدلة المتاحة.",
    "Everything you selected is confirmed in the available evidence.",
  ),
  partial: bi(
    "بعض احتياجاتك مؤكدة، وبعضها لا يزال غير مؤكد.",
    "Some of your needs are confirmed; others remain unconfirmed.",
  ),
  not_available: bi(
    "تظهر الأدلة حاجة أساسية غير متوفرة.",
    "The evidence shows an essential need is not met.",
  ),
  insufficient: bi(
    "الأدلة الحالية لا تكفي للحكم على احتياجاتك.",
    "Current evidence is not enough to judge your needs.",
  ),
};

const known = (s: IndicatorState) => s === "present" || s === "absent" || s === "not_applicable";

function state(f: Facility, k: IndicatorKey): IndicatorState {
  return f.indicators[k]?.state ?? "unknown";
}

function evaluate(f: Facility, need: AccessNeed): NeedResult {
  const steps = state(f, "steps");
  const ramp = state(f, "ramp");

  switch (need) {
    case "step_free": {
      const curb = state(f, "curb_ramp");
      if (steps === "absent")
        return { need, outcome: "met", reason: bi("لا تظهر درجات أو عتبة عند المدخل.", "No steps or raised threshold at the entrance.") };
      if (steps === "present" && ramp === "present")
        return {
          need,
          outcome: "met",
          reason: bi(
            curb === "present"
              ? "توجد درجة، لكن يظهر منحدر عند المدخل ومنحدر رصيف على المسار."
              : "توجد درجة، لكن يظهر منحدر بجانب المدخل.",
            curb === "present"
              ? "There is a step, but a ramp at the entrance and a curb ramp on the route are visible."
              : "There is a step, but a ramp is visible beside the entrance.",
          ),
        };
      if (steps === "present")
        return { need, outcome: "not_met", reason: bi("تظهر درجة عند المدخل ولا يظهر منحدر بديل.", "A step is visible with no alternative ramp.") };
      return { need, outcome: "unknown", reason: bi("لا تكفي الصور الحالية لتأكيد وجود درجات من عدمه.", "Current photos can't confirm whether there are steps.") };
    }
    case "ramp_when_raised": {
      if (steps === "absent") return { need, outcome: "met", reason: bi("لا يوجد ارتفاع يستدعي منحدرًا.", "There is no rise that would need a ramp.") };
      if (ramp === "present") return { need, outcome: "met", reason: bi("يظهر منحدر عند المدخل.", "A ramp is visible at the entrance.") };
      if (ramp === "absent" && steps === "present")
        return { need, outcome: "not_met", reason: bi("يوجد ارتفاع ولا يظهر منحدر.", "There is a rise and no visible ramp.") };
      return { need, outcome: "unknown", reason: bi("لم يتضح وجود منحدر في الصور الحالية.", "A ramp isn't clear in the current photos.") };
    }
    case "clear_path": {
      const o = state(f, "obstruction");
      const surface = state(f, "path_surface");
      if (o === "present") return { need, outcome: "not_met", reason: bi("يظهر عائق في مسار الوصول إلى الباب.", "An obstruction is visible on the route to the door.") };
      if (o === "absent" && surface === "absent")
        return { need, outcome: "not_met", reason: bi("المسار غير مستوٍ أو غير مرصوف.", "The route is uneven or unpaved.") };
      if (o === "absent")
        return { need, outcome: "met", reason: bi("لا يظهر عائق في مسار الوصول.", "No obstruction is visible on the route.") };
      return { need, outcome: "unknown", reason: bi("مسار الوصول غير واضح بالكامل في الصور.", "The route isn't fully visible in the photos.") };
    }
    case "handrail": {
      const h = state(f, "handrail");
      if (h === "present") return { need, outcome: "met", reason: bi("يظهر درابزين عند المدخل.", "A handrail is visible at the entrance.") };
      if (h === "absent") return { need, outcome: "not_met", reason: bi("لا يظهر درابزين في الصور الحالية.", "No handrail is visible in the current photos.") };
      return { need, outcome: "unknown", reason: bi("لا يمكن تأكيد وجود درابزين.", "A handrail can't be confirmed.") };
    }
    case "parking": {
      const p = state(f, "parking");
      const route = state(f, "parking_route");
      if (p === "present" && route === "absent")
        return { need, outcome: "not_met", reason: bi("يظهر موقف مخصص، لكن المسار منه إلى المدخل غير متاح.", "Designated parking is visible, but the route to the entrance is not accessible.") };
      if (p === "present") return { need, outcome: "met", reason: bi("يظهر موقف مخصص أو علامة إتاحة.", "Designated parking or an access marking is visible.") };
      if (p === "absent") return { need, outcome: "not_met", reason: bi("لا يظهر موقف مخصص أو علامة إتاحة.", "No designated parking or access marking is visible.") };
      return { need, outcome: "unknown", reason: bi("المواقف خارج إطار الصور الحالية، لذلك لا يمكن تأكيدها.", "Parking is outside the current photo frames, so it can't be confirmed.") };
    }
    case "elevator": {
      const e = state(f, "elevator");
      const space = state(f, "elevator_space");
      if (e === "present" && space === "absent")
        return { need, outcome: "not_met", reason: bi("يوجد مصعد، لكن المساحة داخله تبدو غير كافية.", "There is an elevator, but the space inside looks insufficient.") };
      if (e === "present") return { need, outcome: "met", reason: bi("يظهر مصعد داخل المبنى.", "An elevator is visible inside the building.") };
      if (e === "absent") return { need, outcome: "not_met", reason: bi("لا يظهر مصعد في المبنى.", "No elevator is visible in the building.") };
      if (e === "not_applicable") return { need, outcome: "met", reason: bi("المبنى بطابق واحد، فلا حاجة لمصعد.", "The building is single-storey, so no elevator is needed.") };
      return { need, outcome: "unknown", reason: bi("لا توجد أدلة موثقة عن المصعد بعد.", "No documented evidence about the elevator yet.") };
    }
    case "accessible_restroom": {
      const r = state(f, "accessible_restroom");
      if (r === "present") return { need, outcome: "met", reason: bi("توجد دورة مياه مخصصة موثقة بالصور.", "A documented accessible restroom is visible.") };
      if (r === "absent") return { need, outcome: "not_met", reason: bi("لا تظهر دورة مياه مخصصة في الأدلة الحالية.", "No accessible restroom appears in the current evidence.") };
      return { need, outcome: "unknown", reason: bi("لا توجد أدلة موثقة عن دورة المياه بعد.", "No documented evidence about the restroom yet.") };
    }
  }
}

export interface Decision {
  verdict: Verdict;
  results: NeedResult[];
  /** Number of indicators with a known state. */
  completeness: number;
  /** Total number of indicators tracked. */
  total: number;
}

export function decideFor(facility: Facility, needs: AccessNeed[]): Decision {
  const results = needs.map((n) => evaluate(facility, n));
  const completeness = INDICATOR_ORDER.filter((k) => known(state(facility, k))).length;
  const total = INDICATOR_ORDER.length;

  let verdict: Verdict;
  if (results.length === 0) {
    verdict = completeness >= Math.ceil(total * 0.7) ? "available" : "insufficient";
  } else if (results.some((r) => r.outcome === "not_met")) {
    verdict = "not_available";
  } else if (results.every((r) => r.outcome === "met")) {
    verdict = "available";
  } else if (results.some((r) => r.outcome === "met")) {
    verdict = "partial";
  } else {
    verdict = "insufficient";
  }

  return { verdict, results, completeness, total };
}
