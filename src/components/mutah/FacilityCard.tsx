import { Link } from "@tanstack/react-router";
import {
  Accessibility,
  CircleAlert,
  CircleCheck,
  CircleHelp,
  Clock3,
  Grip,
  MapPin,
  ParkingSquare,
  Route as RouteIcon,
  Waypoints,
} from "lucide-react";
import type { ComponentType } from "react";
import { decideFor, VERDICT_LABEL, type NeedOutcome } from "@/lib/mutah/decision";
import { useLang } from "@/lib/mutah/i18n";
import { ACCESS_NEED_LABEL, VERIFICATION_LABEL, relativeDate } from "@/lib/mutah/labels";
import type { AccessNeed, Facility } from "@/lib/mutah/types";
import { Tag } from "./ui";

const DEFAULT_NEEDS: AccessNeed[] = [
  "step_free",
  "ramp_when_raised",
  "parking",
  "elevator",
  "accessible_restroom",
];

const NEED_ICON: Record<AccessNeed, ComponentType<{ className?: string }>> = {
  step_free: RouteIcon,
  ramp_when_raised: Waypoints,
  clear_path: RouteIcon,
  handrail: Grip,
  parking: ParkingSquare,
  elevator: Accessibility,
  accessible_restroom: Accessibility,
};

const OUTCOME_STYLE: Record<NeedOutcome, { icon: ComponentType<{ className?: string }>; className: string }> = {
  met: { icon: CircleCheck, className: "text-access-strong" },
  not_met: { icon: CircleAlert, className: "text-warn-strong" },
  unknown: { icon: CircleHelp, className: "text-muted-foreground" },
};

export function FacilityCard({ facility, needs }: { facility: Facility; needs: AccessNeed[] }) {
  const { pick, t, lang } = useLang();
  const decision = decideFor(facility, needs);
  const shownNeeds = (needs.length > 0 ? needs : DEFAULT_NEEDS).slice(0, 5);
  const shownResults = decideFor(facility, shownNeeds).results;
  const name = pick(facility.name);
  const missing = Math.max(0, decision.total - decision.completeness);
  const evidenceLabel =
    missing === 0 ? t("infoComplete") : decision.completeness === 0 ? t("infoLimited") : t("infoMissing");
  const EvidenceIcon = missing === 0 ? CircleCheck : decision.completeness === 0 ? CircleAlert : Clock3;

  return (
    <article className="group overflow-hidden rounded-3xl border border-border bg-card transition-colors hover:border-primary/30">
      <div className="flex gap-4 p-4 sm:p-5">
        {facility.imageUrl ? (
          <img
            src={facility.imageUrl}
            alt={pick(facility.imageAlt)}
            loading="lazy"
            width={1200}
            height={900}
            className="size-24 shrink-0 rounded-2xl object-cover sm:size-28"
          />
        ) : (
          <div className="flex size-24 shrink-0 items-center justify-center rounded-2xl border-2 border-dashed border-input text-center text-xs text-muted-foreground sm:size-28">
            {t("noPhoto")}
          </div>
        )}

        <div className="min-w-0 flex-1">
          <h3 className="text-lg font-bold leading-tight">
            <Link
              to="/facility/$id"
              params={{ id: facility.id }}
              className="rounded-sm hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
            >
              {name}
            </Link>
          </h3>
          <p className="mt-1 text-sm text-muted-foreground">
            {pick(facility.category)} · {pick(facility.area)}
            {facility.distanceKm !== undefined
              ? lang === "ar"
                ? ` · نحو ${facility.distanceKm} كم`
                : ` · about ${facility.distanceKm} km`
              : ""}
          </p>

          <div className="mt-3 flex flex-wrap items-center gap-2">
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

      <div className="border-t border-border px-4 py-4 sm:px-5">
        <div className="mb-3 flex items-center justify-between gap-3">
          <p className="text-sm font-bold">
            {lang === "ar" ? "احتياجات الوصول" : "Access needs"}
          </p>
          <span className="text-xs text-muted-foreground">
            {needs.length > 0
              ? lang === "ar"
                ? "وفق تفضيلاتك"
                : "Based on your preferences"
              : lang === "ar"
                ? "ملخص الأدلة"
                : "Evidence summary"}
          </span>
        </div>

        <ul className="grid grid-cols-3 gap-2 sm:grid-cols-5">
          {shownResults.map((result) => {
            const NeedIcon = NEED_ICON[result.need];
            const outcome = OUTCOME_STYLE[result.outcome];
            const OutcomeIcon = outcome.icon;
            return (
              <li
                key={result.need}
                title={pick(result.reason)}
                className="relative flex min-h-24 flex-col items-center justify-center gap-1.5 rounded-2xl bg-surface px-2 py-3 text-center"
              >
                <span className="flex size-9 items-center justify-center rounded-xl bg-primary-soft text-primary">
                  <NeedIcon className="size-5" aria-hidden="true" />
                </span>
                <span className="line-clamp-2 text-[11px] font-semibold leading-tight">
                  {pick(ACCESS_NEED_LABEL[result.need])}
                </span>
                <OutcomeIcon className={`absolute end-2 top-2 size-4 ${outcome.className}`} aria-hidden="true" />
                <span className="sr-only">{pick(result.reason)}</span>
              </li>
            );
          })}
        </ul>
      </div>

      <div className="flex items-center justify-between gap-3 border-t border-border px-4 py-3 sm:px-5">
        <span className="flex min-w-0 items-center gap-1.5 text-sm text-muted-foreground">
          <MapPin className="size-4 shrink-0" aria-hidden="true" />
          <span className="truncate">{pick(facility.area)}</span>
          <span aria-hidden="true">·</span>
          <span className="truncate">{pick(VERIFICATION_LABEL[facility.verification])}</span>
          <span className="hidden sm:inline">· {relativeDate(facility.lastVerifiedISO, lang)}</span>
        </span>
        <Link
          to="/facility/$id"
          params={{ id: facility.id }}
          className="min-h-11 shrink-0 rounded-xl bg-primary px-4 py-2.5 text-sm font-semibold text-primary-foreground transition-colors hover:bg-primary/90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
        >
          {t("viewDetails")}
          <span className="sr-only"> {t("about")} {name}</span>
        </Link>
      </div>
    </article>
  );
}
