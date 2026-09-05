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

const HIGHLIGHT: IndicatorKey[] = ["steps", "ramp", "parking"];

export function FacilityCard({ facility, needs }: { facility: Facility; needs: AccessNeed[] }) {
  const { pick, t, lang } = useLang();
  const decision = decideFor(facility, needs);
  const name = pick(facility.name);
  const missing = Math.max(0, decision.total - decision.completeness);
  const evidenceLabel =
    missing === 0 ? t("infoComplete") : decision.completeness === 0 ? t("infoLimited") : t("infoMissing");
  const EvidenceIcon = missing === 0 ? CircleCheck : decision.completeness === 0 ? CircleAlert : Clock3;

  return (
    <article className="group overflow-hidden rounded-2xl border border-border bg-card transition-shadow hover:shadow-md">
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
            <Link to="/facility/$id" params={{ id: facility.id }} className="hover:underline">
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
          <div className="mt-2 flex flex-wrap gap-2">
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
        {HIGHLIGHT.map((k) => (
          <li key={k} className="flex flex-wrap items-center gap-2">
            <span className="text-muted-foreground">{pick(INDICATOR_LABEL[k])}:</span>
            <span className="font-semibold">{pick(stateLabel(k, facility.indicators[k].state))}</span>
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
          className="min-h-11 rounded-xl bg-primary px-4 py-2.5 text-sm font-semibold text-primary-foreground transition-colors hover:bg-primary/90"
        >
          {t("viewDetails")}
          <span className="sr-only"> {t("about")} {name}</span>
        </Link>
      </div>
    </article>
  );
}
