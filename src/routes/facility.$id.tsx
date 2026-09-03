import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { CalendarClock, Camera, Flag, MapPin, ShieldCheck } from "lucide-react";
import { useState } from "react";
import { AppShell } from "@/components/mutah/AppShell";
import { DecisionSummary } from "@/components/mutah/DecisionSummary";
import { EvidenceList } from "@/components/mutah/Evidence";
import { Button, Card, EmptyState, SectionTitle, Tag } from "@/components/mutah/ui";
import { decideFor } from "@/lib/mutah/decision";
import { useLang } from "@/lib/mutah/i18n";
import {
  VERIFICATION_LABEL,
  ZONE_HINT,
  ZONE_INDICATORS,
  ZONE_LABEL,
  ZONE_ORDER,
  formatDate,
} from "@/lib/mutah/labels";
import { useMutah } from "@/lib/mutah/store";
import type { Facility, ZoneKey } from "@/lib/mutah/types";

export const Route = createFileRoute("/facility/$id")({
  head: () => ({
    meta: [
      { title: "أدلة الوصول | مُتاح ماب" },
      {
        name: "description",
        content: "أدلة مرئية عن مسار الوصول والمدخل والمواقف والمصعد ودورة المياه، وما لا يزال غير مؤكد.",
      },
      { property: "og:title", content: "أدلة الوصول | مُتاح ماب" },
      {
        property: "og:description",
        content: "الأدلة أولًا: خمسة مسارات، وحالة مخصصة لاحتياجاتك.",
      },
    ],
  }),
  component: FacilityProfile,
});

function FacilityProfile() {
  const { id } = Route.useParams();
  const navigate = useNavigate();
  const { getFacility, needs, contributions } = useMutah();
  const { t, pick, lang } = useLang();
  const facility = getFacility(id);
  const [activeZone, setActiveZone] = useState<ZoneKey>("entrance");

  if (!facility) {
    return (
      <AppShell>
        <EmptyState
          title={t("notFound")}
          description={t("notFoundBody")}
          action={
            <Link to="/discover">
              <Button>{t("backToDiscover")}</Button>
            </Link>
          }
        />
      </AppShell>
    );
  }

  const decision = decideFor(facility, needs);
  const pending = contributions.filter(
    (c) => c.facilityId === facility.id && c.status === "pending_review",
  );

  return (
    <AppShell title={pick(facility.name)}>
      <article className="mx-auto max-w-3xl">
        <header>
          <h1 className="text-2xl font-bold">{pick(facility.name)}</h1>
          <p className="mt-1 flex flex-wrap items-center gap-2 text-muted-foreground">
            <span>{pick(facility.category)}</span>
            <span aria-hidden="true">·</span>
            <span className="flex items-center gap-1">
              <MapPin className="size-4" aria-hidden="true" />
              {pick(facility.area)}
            </span>
          </p>
        </header>

        {facility.imageUrl ? (
          <img
            src={facility.imageUrl}
            alt={pick(facility.imageAlt)}
            width={1200}
            height={900}
            className="door-reveal mt-5 aspect-4/3 w-full rounded-2xl object-cover sm:aspect-video"
          />
        ) : (
          <div className="mt-5 rounded-2xl border-2 border-dashed border-input p-10 text-center text-sm text-muted-foreground">
            {t("noRecentPhoto")}
          </div>
        )}

        <div className="mt-5">
          <DecisionSummary decision={decision} hasNeeds={needs.length > 0} />
        </div>

        {pending.length > 0 ? (
          <p className="mt-4 rounded-xl border-2 border-dashed border-input bg-unknown-soft p-4 text-sm">
            {pending.length} {t("pendingHere")}
          </p>
        ) : null}

        <ZoneEvidence
          facility={facility}
          activeZone={activeZone}
          onZoneChange={setActiveZone}
        />

        <section aria-labelledby="analysis-title" className="mt-10">
          <div id="analysis-title">
            <SectionTitle hint={t("analysisTrailHint")}>{t("analysisTrail")}</SectionTitle>
          </div>
          <Card className="bg-surface">
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li>
                {t("source")}:{" "}
                {facility.source === "team_survey" ? t("sourceTeam") : t("sourceContributor")}
              </li>
              <li>{t("notCertification")}</li>
            </ul>
          </Card>
        </section>

        <section aria-labelledby="status-title" className="mt-10">
          <div id="status-title">
            <SectionTitle>{t("infoStatus")}</SectionTitle>
          </div>
          <Card>
            <ul className="space-y-3 text-sm">
              <li className="flex items-center gap-2">
                <ShieldCheck className="size-5 text-primary" aria-hidden="true" />
                {pick(VERIFICATION_LABEL[facility.verification])}
              </li>
              <li className="flex items-center gap-2">
                <CalendarClock className="size-5 text-primary" aria-hidden="true" />
                {t("lastVerified")}: {formatDate(facility.lastVerifiedISO, lang)}
              </li>
              <li className="flex flex-wrap items-center gap-2">
                <Tag>
                  {t("source")}:{" "}
                  {facility.source === "team_survey" ? t("sourceTeam") : t("sourceContributor")}
                </Tag>
                <Tag tone={decision.completeness >= decision.total * 0.7 ? "brand" : "warn"}>
                  {t("completeness")} {decision.completeness}/{decision.total}
                </Tag>
              </li>
            </ul>
          </Card>
        </section>

        <div className="mt-8 flex flex-col gap-3 sm:flex-row">
          <Button
            size="lg"
            className="sm:flex-1"
            onClick={() =>
              navigate({ to: "/contribute/$facilityId", params: { facilityId: facility.id } })
            }
          >
            <Camera className="size-5" aria-hidden="true" />
            {t("contributeNewer")}
          </Button>
          <Button size="lg" variant="outline" onClick={() => navigate({ to: "/contribute" })}>
            <Flag className="size-5" aria-hidden="true" />
            {t("reportChange")}
          </Button>
        </div>
      </article>
    </AppShell>
  );
}

function ZoneEvidence({
  facility,
  activeZone,
  onZoneChange,
}: {
  facility: Facility;
  activeZone: ZoneKey;
  onZoneChange: (z: ZoneKey) => void;
}) {
  const { t, pick } = useLang();
  const zone = facility.zones[activeZone];
  const items = ZONE_INDICATORS[activeZone].map((k) => facility.indicators[k]);

  return (
    <section aria-labelledby="views-title" className="mt-10">
      <div id="views-title">
        <SectionTitle hint={t("evidenceViewsHint")}>{t("evidenceViews")}</SectionTitle>
      </div>

      <div role="tablist" aria-label={t("evidenceViews")} className="flex flex-wrap gap-2">
        {ZONE_ORDER.map((z) => {
          const documented = facility.zones[z].documented;
          const selected = z === activeZone;
          return (
            <button
              key={z}
              type="button"
              role="tab"
              aria-selected={selected}
              onClick={() => onZoneChange(z)}
              className={[
                "min-h-11 rounded-full border-2 px-4 text-sm font-semibold transition-colors",
                selected
                  ? "border-primary bg-primary-soft text-primary"
                  : documented
                    ? "border-border bg-background hover:bg-muted"
                    : "border-dashed border-input bg-unknown-soft/60 text-muted-foreground",
              ].join(" ")}
            >
              {pick(ZONE_LABEL[z])}
            </button>
          );
        })}
      </div>

      <div className="door-reveal mt-5" key={activeZone}>
        <p className="text-sm text-muted-foreground">{pick(ZONE_HINT[activeZone])}</p>

        {zone.documented ? (
          <ul className="mt-4 grid gap-3 sm:grid-cols-2">
            {zone.images.map((image, i) => (
              <li key={`${image.url}-${i}`}>
                <img
                  src={image.url}
                  alt={pick(image.alt)}
                  loading="lazy"
                  width={1200}
                  height={900}
                  className="aspect-4/3 w-full rounded-2xl object-cover"
                />
              </li>
            ))}
          </ul>
        ) : (
          <div className="mt-4 rounded-2xl border-2 border-dashed border-input bg-unknown-soft/50 p-6 text-center text-sm">
            <p className="font-semibold">{t("noEvidenceForZone")}</p>
            <Link
              to="/contribute/$facilityId"
              params={{ facilityId: facility.id }}
              className="mt-3 inline-flex min-h-11 items-center rounded-xl border-2 border-input bg-background px-4 font-semibold hover:bg-muted"
            >
              {t("contributeThisView")}
            </Link>
          </div>
        )}

        <div className="mt-5">
          <EvidenceList items={items} />
        </div>
      </div>
    </section>
  );
}
