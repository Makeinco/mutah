import { Link } from "@tanstack/react-router";
import { CircleAlert, CircleCheck, Clock3, MapPin } from "lucide-react";
import { decideFor, VERDICT_LABEL } from "@/lib/mutah/decision";
import { useLang } from "@/lib/mutah/i18n";
import {
  INDICATOR_LABEL,
  VERIFICATION_LABEL,
  relativeDate,
  stateLabel,
} from "@/lib/mutah/labels";
import type { AccessNeed, Facility, IndicatorKey } from "@/lib/mutah/types";
import { Tag } from "./ui";

const DEFAULT_HIGHLIGHT: IndicatorKey[] = ["steps", "ramp", "parking"];
const NEED_HIGHLIGHT: Record<AccessNeed, IndicatorKey> = {
  step_free: "steps",
  ramp_when_raised: "ramp",
  clear_path: "obstruction",
  handrail: "handrail",
  parking: "parking",
  elevator: "elevator",
  accessible_restroom: "accessible_restroom",
};

export function FacilityCard({ facility, needs }: { facility: Facility; needs: AccessNeed[] }) {
  const { pick, t, lang } = useLang();
  const decision = decideFor(facility, needs);
  const name = pick(facility.name);
  const missing = Math.max(0, decision.total - decision.completeness);
  const evidenceLabel =
    missing === 0 ? t("infoComplete") : decision.completeness === 0 ? t("infoLimited") : t("infoMissing");
  const EvidenceIcon = missing === 0 ? CircleCheck : decision.completeness === 0 ? CircleAlert : Clock3;
  const highlights =
    needs.length > 0
      ? [...new Set(needs.map((need) => NEED_HIGHLIGHT[need]))].slice(0, 3)
      : DEFAULT_HIGHLIGHT;

  return (
    <article className="group overflow-hidden rounded-2xl border border-border bg-card transition-colors hover:border-primary/30">
      <div className="flex gap-4 p-4">
        {facility.imageUrl ? (
          <img
            src={facility.imageUrl}
            alt={pick(facility.imageAlt)}
            loading="lazy"
            width={1200}
            height={900}
            className="size-24 shrink-0 rounded-xl object-cover"
          />
        ) : (
          <div className="flex size-24 shrink-0 items-center justify-center rounded-xl border-2 border-dashed border-input text-center text-xs text-muted-foreground">
            {t("noPhoto")}
          </div>
        )}

        <div className="min-w-0 flex-1">
          <h3 className="text-base font-bold">
            <Link
              to="/facility/$id"
              params={{ id: facility.id }}
              className="rounded-sm hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
            >
              {name}
            </Link>
          </h3>
          <p className="text-sm text-muted-foreground">
            {pick(facility.category)} · {pick(facility.area)}
            {facility.distanceKm !== undefined
              ? lang === "ar"
                ? ` · نحو ${facility.distanceKm} كم`
                : ` · about ${facility.distanceKm} km`
              : ""}
          </p>
          <p className="mt-1 text-sm text-muted-foreground">
            {pick(VERIFICATION_LABEL[facility.verification])} · {t("lastVerified")} {relativeDate(facility.lastVerifiedISO, lang)}
          </p>
          <div className="mt-2 flex flex-wrap items-center gap-2">
            <Tag
              tone={
                decision.verdict === "available"
                  ? "brand"
                  : decision.verdict === "not_available"
                    ? "warn"
                    : "neutral"
              }
            >
              {pick(VERDICT_LABEL[decision.verdict])}
            </Tag>
            <span className="inline-flex items-center gap-1.5 text-xs font-semibold text-muted-foreground">
              <EvidenceIcon className="size-4" aria-hidden="true" />
              {evidenceLabel}
            </span>
          </div>
        </div>
      </div>

      <ul className="grid gap-2 border-t border-border bg-surface px-4 py-3 text-sm sm:grid-cols-3">
        {highlights.map((key) => (
          <li key={key} className="flex flex-wrap items-center gap-2">
            <span className="text-muted-foreground">{pick(INDICATOR_LABEL[key])}:</span>
            <span className="font-semibold">{pick(stateLabel(key, facility.indicators[key].state))}</span>
          </li>
        ))}
      </ul>

      <div className="flex items-center justify-between gap-3 border-t border-border px-4 py-3">
        <span className="flex items-center gap-1 text-sm text-muted-foreground">
          <MapPin className="size-4" aria-hidden="true" />
          {pick(facility.area)}
        </span>
        <Link
          to="/facility/$id"
          params={{ id: facility.id }}
          className="min-h-11 rounded-xl bg-primary px-4 py-2.5 text-sm font-semibold text-primary-foreground transition-colors hover:bg-primary/90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
        >
          {t("viewDetails")}
          <span className="sr-only"> {t("about")} {name}</span>
        </Link>
      </div>
    </article>
  );
}
