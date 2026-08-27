import { CircleAlert, CircleCheck, CircleHelp, CircleSlash } from "lucide-react";
import type { ComponentType } from "react";
import { VERDICT_LABEL, type Decision, type Verdict } from "@/lib/mutah/decision";
import { ACCESS_NEED_LABEL } from "@/lib/mutah/labels";
import { cn } from "@/lib/utils";

const VERDICT_STYLE: Record<
  Verdict,
  { icon: ComponentType<{ className?: string }>; frame: string; accent: string }
> = {
  match: { icon: CircleCheck, frame: "border-access bg-access-soft", accent: "text-access-strong" },
  partial: { icon: CircleAlert, frame: "border-primary bg-primary-soft", accent: "text-primary" },
  conflict: { icon: CircleSlash, frame: "border-caution bg-caution-soft", accent: "text-caution" },
  insufficient: {
    icon: CircleHelp,
    frame: "border-input border-dashed bg-unknown-soft",
    accent: "text-unknown",
  },
};

export function DecisionSummary({
  decision,
  hasNeeds,
}: {
  decision: Decision;
  hasNeeds: boolean;
}) {
  const style = VERDICT_STYLE[decision.verdict];
  const Icon = style.icon;

  return (
    <section
      aria-labelledby="decision-title"
      className={cn("door-reveal rounded-2xl border-2 p-5", style.frame)}
    >
      <div className="flex items-start gap-3">
        <Icon className={cn("mt-0.5 size-7 shrink-0", style.accent)} aria-hidden="true" />
        <div>
          <h2 id="decision-title" className={cn("text-xl font-bold", style.accent)}>
            {VERDICT_LABEL[decision.verdict]}
          </h2>
          <p className="mt-1 text-sm text-foreground/80">
            {hasNeeds
              ? "بناءً على احتياجات الوصول التي اخترتها والأدلة المرئية المتاحة."
              : "لم تحدد احتياجات وصول بعد، لذلك نعرض ما هو معروف وما هو غير معروف عن المدخل."}
          </p>
        </div>
      </div>

      {decision.results.length > 0 ? (
        <ul className="mt-4 space-y-2">
          {decision.results.map((r) => (
            <li key={r.need} className="flex gap-2 rounded-xl bg-background/70 p-3 text-sm">
              <span aria-hidden="true" className="font-bold">
                {r.outcome === "met" ? "✓" : r.outcome === "not_met" ? "✕" : "؟"}
              </span>
              <span>
                <span className="font-semibold">{ACCESS_NEED_LABEL[r.need]}</span>
                <span className="sr-only">
                  {r.outcome === "met" ? " — متوفر" : r.outcome === "not_met" ? " — غير متوفر" : " — غير مؤكد"}
                </span>
                <span className="text-muted-foreground"> — {r.reason}</span>
              </span>
            </li>
          ))}
        </ul>
      ) : null}

      <p className="mt-4 text-sm font-semibold">
        اكتمال المعلومات: {decision.completeness} من 5 عناصر مؤكدة
      </p>
    </section>
  );
}
