import { INDICATOR_LABEL } from "./labels";
import type { AccessNeed, Facility, IndicatorKey, IndicatorState } from "./types";

/**
 * Decision logic. Deliberately NOT a score.
 * Output is a match verdict plus the reasons behind it.
 */
export type NeedOutcome = "met" | "not_met" | "unknown";

export interface NeedResult {
  need: AccessNeed;
  outcome: NeedOutcome;
  reason: string;
}

export type Verdict = "match" | "partial" | "conflict" | "insufficient";

export const VERDICT_LABEL: Record<Verdict, string> = {
  match: "يطابق احتياجاتك المرصودة",
  partial: "يطابق جزئيًا",
  conflict: "لا يطابق حاجة أساسية",
  insufficient: "المعلومات غير كافية",
};

const known = (s: IndicatorState) => s === "present" || s === "absent";

function state(f: Facility, k: IndicatorKey): IndicatorState {
  return f.indicators[k].state;
}

function evaluate(f: Facility, need: AccessNeed): NeedResult {
  const steps = state(f, "steps");
  const ramp = state(f, "ramp");

  switch (need) {
    case "step_free": {
      if (steps === "absent") return { need, outcome: "met", reason: "لا تظهر درجات أو عتبة عند المدخل." };
      if (steps === "present" && ramp === "present")
        return { need, outcome: "met", reason: "توجد درجة، لكن يظهر منحدر بجانب المدخل." };
      if (steps === "present")
        return { need, outcome: "not_met", reason: "تظهر درجة عند المدخل ولا يظهر منحدر بديل." };
      return { need, outcome: "unknown", reason: "لا تكفي الصور الحالية لتأكيد وجود درجات من عدمه." };
    }
    case "ramp_when_raised": {
      if (steps === "absent") return { need, outcome: "met", reason: "لا يوجد ارتفاع يستدعي منحدرًا." };
      if (ramp === "present") return { need, outcome: "met", reason: "يظهر منحدر عند المدخل." };
      if (ramp === "absent" && steps === "present")
        return { need, outcome: "not_met", reason: "يوجد ارتفاع ولا يظهر منحدر." };
      return { need, outcome: "unknown", reason: "لم يتضح وجود منحدر في الصور الحالية." };
    }
    case "clear_path": {
      const o = state(f, "obstruction");
      if (o === "absent") return { need, outcome: "met", reason: "لا يظهر عائق في مسار الوصول." };
      if (o === "present") return { need, outcome: "not_met", reason: "يظهر عائق في مسار الوصول إلى الباب." };
      return { need, outcome: "unknown", reason: "مسار الوصول غير واضح بالكامل في الصور." };
    }
    case "handrail": {
      const h = state(f, "handrail");
      if (h === "present") return { need, outcome: "met", reason: "يظهر درابزين عند المدخل." };
      if (h === "absent") return { need, outcome: "not_met", reason: "لا يظهر درابزين في الصور الحالية." };
      return { need, outcome: "unknown", reason: "لا يمكن تأكيد وجود درابزين." };
    }
    case "parking": {
      const p = state(f, "parking");
      if (p === "present") return { need, outcome: "met", reason: "يظهر موقف مخصص أو علامة إتاحة." };
      if (p === "absent") return { need, outcome: "not_met", reason: "لا يظهر موقف مخصص أو علامة إتاحة." };
      return { need, outcome: "unknown", reason: "الموقف خارج إطار الصور الحالية، لذلك لا يمكن تأكيده." };
    }
  }
}

export interface Decision {
  verdict: Verdict;
  results: NeedResult[];
  /** Number of the five indicators with a known state. */
  completeness: number;
}

export function decideFor(facility: Facility, needs: AccessNeed[]): Decision {
  const results = needs.map((n) => evaluate(facility, n));
  const completeness = (Object.keys(facility.indicators) as IndicatorKey[]).filter((k) =>
    known(facility.indicators[k].state),
  ).length;

  let verdict: Verdict;
  if (results.length === 0) {
    verdict = completeness >= 4 ? "match" : "insufficient";
  } else if (results.some((r) => r.outcome === "not_met")) {
    verdict = "conflict";
  } else if (results.every((r) => r.outcome === "met")) {
    verdict = "match";
  } else if (results.some((r) => r.outcome === "met")) {
    verdict = "partial";
  } else {
    verdict = "insufficient";
  }

  return { verdict, results, completeness };
}

export function completenessLabel(count: number): string {
  return `اكتمال المعلومات: ${count} من ٥ عناصر مؤكدة`;
}

export function needIndicatorHint(k: IndicatorKey): string {
  return INDICATOR_LABEL[k];
}
