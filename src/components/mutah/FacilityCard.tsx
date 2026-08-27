import { Link } from "@tanstack/react-router";
import { MapPin } from "lucide-react";
import { decideFor, VERDICT_LABEL } from "@/lib/mutah/decision";
import { INDICATOR_LABEL, STATE_LABEL, VERIFICATION_LABEL, relativeArabic } from "@/lib/mutah/labels";
import type { AccessNeed, Facility, IndicatorKey } from "@/lib/mutah/types";
import { StateChip } from "./Evidence";
import { Tag } from "./ui";

const HIGHLIGHT: IndicatorKey[] = ["ramp", "obstruction", "parking"];

export function FacilityCard({ facility, needs }: { facility: Facility; needs: AccessNeed[] }) {
  const decision = decideFor(facility, needs);

  return (
    <article className="overflow-hidden rounded-2xl border border-border bg-card">
      <div className="flex gap-4 p-4">
        {facility.imageUrl ? (
          <img
            src={facility.imageUrl}
            alt={facility.imageAlt}
            loading="lazy"
            width={1200}
            height={900}
            className="size-24 shrink-0 rounded-xl object-cover"
          />
        ) : (
          <div className="flex size-24 shrink-0 items-center justify-center rounded-xl border-2 border-dashed border-input text-center text-xs text-muted-foreground">
            لا توجد صورة
          </div>
        )}

        <div className="min-w-0 flex-1">
          <h3 className="text-base font-bold">
            <Link to="/facility/$id" params={{ id: facility.id }} className="hover:underline">
              {facility.name}
            </Link>
          </h3>
          <p className="text-sm text-muted-foreground">
            {facility.category} · {facility.area}
            {facility.distanceKm !== undefined ? ` · نحو ${facility.distanceKm} كم` : ""}
          </p>
          <p className="mt-1 text-sm text-muted-foreground">
            {VERIFICATION_LABEL[facility.verification]} · آخر تحقق {relativeArabic(facility.lastVerifiedISO)}
          </p>
          <div className="mt-2 flex flex-wrap gap-2">
            <Tag tone={decision.verdict === "match" ? "brand" : decision.verdict === "conflict" ? "warn" : "neutral"}>
              {VERDICT_LABEL[decision.verdict]}
            </Tag>
            <Tag>اكتمال المعلومات {decision.completeness}/5</Tag>
          </div>
        </div>
      </div>

      <ul className="grid gap-2 border-t border-border bg-surface px-4 py-3 text-sm sm:grid-cols-3">
        {HIGHLIGHT.map((k) => (
          <li key={k} className="flex flex-wrap items-center gap-2">
            <span className="text-muted-foreground">{INDICATOR_LABEL[k]}:</span>
            <span className="font-semibold">{STATE_LABEL[k][facility.indicators[k].state]}</span>
          </li>
        ))}
      </ul>

      <div className="flex items-center justify-between gap-3 border-t border-border px-4 py-3">
        <span className="flex items-center gap-1 text-sm text-muted-foreground">
          <MapPin className="size-4" aria-hidden="true" />
          {facility.area}
        </span>
        <Link
          to="/facility/$id"
          params={{ id: facility.id }}
          className="min-h-11 rounded-xl bg-primary px-4 py-2.5 text-sm font-semibold text-primary-foreground hover:bg-primary/90"
        >
          عرض التفاصيل
          <span className="sr-only"> عن {facility.name}</span>
        </Link>
      </div>
    </article>
  );
}

export function FacilityCardChip({ facility }: { facility: Facility }) {
  return <StateChip indicator="ramp" state={facility.indicators.ramp.state} />;
}
