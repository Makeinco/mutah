import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { Camera, Check, CircleHelp, ImagePlus, ImageUp, Pencil, Trash2 } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { z } from "zod";
import { AppShell } from "@/components/mutah/AppShell";
import { EvidenceItem } from "@/components/mutah/Evidence";
import { Button, Card, EmptyState, SectionTitle } from "@/components/mutah/ui";
import { ANALYSIS_STEPS, analyseZoneImage } from "@/lib/mutah/ai";
import { useLang } from "@/lib/mutah/i18n";
import { INDICATOR_LABEL, ZONE_HINT, ZONE_LABEL, ZONE_ORDER, stateLabel } from "@/lib/mutah/labels";
import { emptyConfirmations, useMutah } from "@/lib/mutah/store";
import type { Contribution, IndicatorEvidence, IndicatorState, ZoneKey } from "@/lib/mutah/types";

const zoneSchema = z.object({
  zone: z.enum(["approach", "entrance", "parking", "elevator", "restroom"]).optional(),
});

export const Route = createFileRoute("/contribute/$facilityId")({
  validateSearch: zoneSchema,
  head: () => ({
    meta: [
      { title: "مساهمة بأدلة مرئية | مُتاح ماب" },
      {
        name: "description",
        content: "وثّق منطقة واحدة من المرفق بصورة أو أكثر، راجع الرصد الأولي، ثم أرسل الأدلة للمراجعة البشرية.",
      },
      { property: "og:title", content: "مساهمة بأدلة مرئية | مُتاح ماب" },
      { property: "og:description", content: "الذكاء الاصطناعي يرصد، والبشر يتحققون." },
    ],
  }),
  component: ContributeFlow,
});

type Step = "capture" | "analysing" | "confirm" | "done";

function ContributeFlow() {
  const { facilityId } = Route.useParams();
  const { zone: zoneParam } = Route.useSearch();
  const navigate = useNavigate();
  const { getFacility, submitContribution } = useMutah();
  const { t, pick, lang } = useLang();
  const facility = getFacility(facilityId);

  const [zone, setZone] = useState<ZoneKey>(zoneParam ?? "entrance");
  const [step, setStep] = useState<Step>("capture");
  const [previews, setPreviews] = useState<string[]>([]);
  const [observations, setObservations] = useState<IndicatorEvidence[]>([]);
  const [confirmed, setConfirmed] = useState<Contribution["confirmed"] | null>(null);
  const fileRef = useRef<HTMLInputElement>(null);

  if (!facility) {
    return (
      <AppShell title={t("contributeTitle")}>
        <EmptyState
          title={t("notFound")}
          description={t("notFoundBody")}
          action={
            <Link to="/contribute">
              <Button>{t("goContribute")}</Button>
            </Link>
          }
        />
      </AppShell>
    );
  }

  const addFiles = (files: FileList | File[]) => {
    const urls = Array.from(files)
      .filter((file) => file.type.startsWith("image/"))
      .map((file) => URL.createObjectURL(file));
    setPreviews((current) => [...current, ...urls].slice(0, 6));
  };

  const startAnalysis = () => {
    if (previews.length === 0) return;
    // Demo adapter currently returns one zone-level observation bundle. In production,
    // Gemini/provider analysis will run per image and aggregate only after human review.
    const result = analyseZoneImage(facility, zone);
    setObservations(result);
    setConfirmed(emptyConfirmations(result));
    setStep("analysing");
  };

  const steps: Array<[Step, string]> = [
    ["capture", t("stepPhoto")],
    ["analysing", t("stepAnalysis")],
    ["confirm", t("stepConfirm")],
    ["done", t("stepSend")],
  ];

  return (
    <AppShell title={`${t("contributeTitle")} — ${pick(facility.name)}`}>
      <div className="mx-auto max-w-2xl">
        <h1 className="text-2xl font-bold">{pick(facility.name)}</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          {pick(facility.category)} · {pick(facility.area)}
        </p>

        <ol className="mt-5 flex gap-2 text-xs font-semibold" aria-label={t("contributeTitle")}>
          {steps.map(([key, label], i) => {
            const order: Step[] = ["capture", "analysing", "confirm", "done"];
            const active = order.indexOf(step) >= i;
            return (
              <li
                key={key}
                aria-current={step === key ? "step" : undefined}
                className={`flex-1 rounded-full border-2 px-2 py-1 text-center transition-colors ${active ? "border-primary bg-primary-soft text-primary" : "border-border text-muted-foreground"}`}
              >
                {label}
              </li>
            );
          })}
        </ol>

        {step === "capture" ? (
          <>
            <fieldset className="mt-8">
              <legend className="text-base font-bold">{t("whatToDocument")}</legend>
              <div className="mt-3 grid grid-cols-2 gap-2 sm:grid-cols-5">
                {ZONE_ORDER.map((z) => (
                  <label
                    key={z}
                    className={`flex min-h-12 cursor-pointer items-center justify-center rounded-xl border-2 px-3 text-center text-sm font-semibold transition-colors ${zone === z ? "border-primary bg-primary-soft text-primary" : "border-border hover:bg-muted"}`}
                  >
                    <input
                      type="radio"
                      name="zone"
                      checked={zone === z}
                      onChange={() => {
                        setZone(z);
                        setPreviews([]);
                      }}
                      className="sr-only"
                    />
                    {pick(ZONE_LABEL[z])}
                  </label>
                ))}
              </div>
              <p className="mt-3 text-sm text-muted-foreground">{pick(ZONE_HINT[zone])}</p>
            </fieldset>

            <CaptureStep
              previews={previews}
              fallbackImage={facility.imageUrl}
              onAdd={addFiles}
              onUseSample={() => facility.imageUrl && setPreviews([facility.imageUrl])}
              onRemove={(index) => setPreviews((items) => items.filter((_, i) => i !== index))}
              onContinue={startAnalysis}
              fileRef={fileRef}
            />
          </>
        ) : null}

        {step === "analysing" ? (
          <AnalysingStep
            count={previews.length}
            onDone={() => setStep("confirm")}
          />
        ) : null}

        {step === "confirm" && confirmed ? (
          <ConfirmStep
            observations={observations}
            confirmed={confirmed}
            setConfirmed={setConfirmed}
            evidenceCount={previews.length}
            onSubmit={() => {
              submitContribution({
                facilityId: facility.id,
                zone,
                imageUrls: previews,
                aiObservations: observations,
                confirmed,
              });
              setStep("done");
            }}
          />
        ) : null}

        {step === "done" ? (
          <div className="door-reveal mt-8 rounded-2xl border-2 border-access bg-access-soft p-8 text-center">
            <h2 className="text-xl font-bold text-access-strong">{t("thanks")}</h2>
            <p className="mt-2 text-sm">{t("thanksBody")}</p>
            <p className="mt-2 text-sm text-muted-foreground">
              {lang === "ar"
                ? "لن تُنشر الأدلة أو تغيّر حالة المرفق قبل المراجعة البشرية."
                : "The evidence will not be published or change the facility status before human review."}
            </p>
            <div className="mt-6 flex flex-col justify-center gap-3 sm:flex-row">
              <Button onClick={() => navigate({ to: "/facility/$id", params: { id: facility.id } })}>
                {t("backToFacility")}
              </Button>
              <Button variant="outline" onClick={() => navigate({ to: "/review" })}>
                {t("openReview")}
              </Button>
            </div>
          </div>
        ) : null}
      </div>
    </AppShell>
  );
}

function CaptureStep({
  previews,
  fallbackImage,
  onAdd,
  onUseSample,
  onRemove,
  onContinue,
  fileRef,
}: {
  previews: string[];
  fallbackImage: string;
  onAdd: (files: FileList | File[]) => void;
  onUseSample: () => void;
  onRemove: (index: number) => void;
  onContinue: () => void;
  fileRef: React.RefObject<HTMLInputElement | null>;
}) {
  const { t, lang } = useLang();

  const tips =
    lang === "ar"
      ? [
          "التقط أكثر من زاوية إذا لم تكفِ صورة واحدة لإظهار المنطقة.",
          "تجنب تصوير الوجوه ولوحات المركبات.",
          "استخدم صورًا حديثة قدر الإمكان.",
          "عدم ظهور العنصر في صورة واحدة لا يعني أنه غير موجود.",
        ]
      : [
          "Add another angle when one image is not enough to show the area.",
          "Avoid faces and vehicle plates.",
          "Use recent photos whenever possible.",
          "An item missing from one photo does not mean it is absent.",
        ];

  return (
    <section aria-labelledby="capture-title" className="mt-8">
      <div id="capture-title">
        <SectionTitle hint={t("captureHint")}>{t("captureTitle")}</SectionTitle>
      </div>

      <Card className="bg-surface">
        <ul className="list-inside list-disc space-y-1 text-sm text-muted-foreground">
          {tips.map((tip) => (
            <li key={tip}>{tip}</li>
          ))}
        </ul>
      </Card>

      <input
        ref={fileRef}
        type="file"
        accept="image/*"
        multiple
        className="sr-only"
        aria-label={t("pickPhoto")}
        onChange={(e) => {
          if (e.target.files?.length) onAdd(e.target.files);
          e.currentTarget.value = "";
        }}
      />

      {previews.length > 0 ? (
        <div className="door-reveal mt-6">
          <div className="mb-3 flex items-center justify-between gap-3">
            <p className="text-sm font-semibold">
              {previews.length} {t("photoCount")}
            </p>
            <Button size="sm" variant="outline" onClick={() => fileRef.current?.click()}>
              <ImagePlus className="size-4" aria-hidden="true" />
              {t("addAnotherPhoto")}
            </Button>
          </div>

          <ul className="grid grid-cols-2 gap-3 sm:grid-cols-3">
            {previews.map((preview, index) => (
              <li key={`${preview}-${index}`} className="relative overflow-hidden rounded-2xl border border-border bg-surface">
                <img
                  src={preview}
                  alt={`${t("previewAlt")} ${index + 1}`}
                  className="aspect-4/3 w-full object-cover"
                />
                <button
                  type="button"
                  onClick={() => onRemove(index)}
                  className="absolute end-2 top-2 flex size-11 items-center justify-center rounded-xl bg-background/95 shadow-sm"
                  aria-label={`${t("removePhoto")} ${index + 1}`}
                >
                  <Trash2 className="size-5" aria-hidden="true" />
                </button>
              </li>
            ))}
          </ul>

          <div className="mt-4 flex flex-col gap-3 sm:flex-row">
            <Button size="lg" className="sm:flex-1" onClick={onContinue}>
              {t("continueToAnalysis")}
            </Button>
            {previews.length < 6 ? (
              <Button size="lg" variant="outline" onClick={() => fileRef.current?.click()}>
                <ImagePlus className="size-5" aria-hidden="true" />
                {t("addAnotherPhoto")}
              </Button>
            ) : null}
          </div>
        </div>
      ) : (
        <div className="mt-6 flex flex-col gap-3 sm:flex-row">
          <Button size="lg" className="sm:flex-1" onClick={() => fileRef.current?.click()}>
            <Camera className="size-5" aria-hidden="true" />
            {t("takePhoto")}
          </Button>
          <Button
            size="lg"
            variant="outline"
            className="sm:flex-1"
            onClick={() => fileRef.current?.click()}
          >
            <ImageUp className="size-5" aria-hidden="true" />
            {t("pickPhoto")}
          </Button>
          {fallbackImage ? (
            <Button size="lg" variant="quiet" onClick={onUseSample}>
              {t("useSample")}
            </Button>
          ) : null}
        </div>
      )}
    </section>
  );
}

function AnalysingStep({ onDone, count }: { onDone: () => void; count: number }) {
  const { t, pick, lang } = useLang();
  const [index, setIndex] = useState(0);

  useEffect(() => {
    if (index >= ANALYSIS_STEPS.length) {
      const timer = setTimeout(onDone, 400);
      return () => clearTimeout(timer);
    }
    const timer = setTimeout(() => setIndex((i) => i + 1), 650);
    return () => clearTimeout(timer);
  }, [index, onDone]);

  return (
    <section aria-labelledby="analysing-title" className="mt-8">
      <h2 id="analysing-title" className="text-lg font-bold">{t("analysingTitle")}</h2>
      <p className="mt-1 text-sm text-muted-foreground">{t("analysingHint")}</p>
      <p className="mt-2 text-sm font-semibold">
        {lang === "ar" ? `تحليل حزمة أدلة من ${count} صورة` : `Analysing an evidence bundle of ${count} image${count === 1 ? "" : "s"}`}
      </p>

      <ul className="mt-6 space-y-3" aria-live="polite">
        {ANALYSIS_STEPS.map((s, i) => {
          const done = i < index;
          const current = i === index;
          return (
            <li
              key={s.id}
              className={`flex items-center gap-3 rounded-xl border p-4 transition-colors ${done ? "border-access bg-access-soft" : current ? "border-primary bg-primary-soft" : "border-border"}`}
            >
              <span aria-hidden="true" className="font-bold">{done ? "✓" : current ? "◌" : "·"}</span>
              <span className="font-semibold">{pick(s.label)}</span>
              <span className="sr-only">{done ? t("done") : current ? t("inProgress") : t("waiting")}</span>
            </li>
          );
        })}
      </ul>

      <div className="mt-6 h-1.5 overflow-hidden rounded-full bg-muted">
        <div
          className="h-full bg-primary transition-[width] duration-500"
          style={{ width: `${Math.min(100, (index / ANALYSIS_STEPS.length) * 100)}%` }}
        />
      </div>
    </section>
  );
}

const CORRECTION_OPTIONS: IndicatorState[] = ["present", "absent", "not_visible"];

function ConfirmStep({
  observations,
  confirmed,
  setConfirmed,
  onSubmit,
  evidenceCount,
}: {
  observations: IndicatorEvidence[];
  confirmed: Contribution["confirmed"];
  setConfirmed: (c: Contribution["confirmed"]) => void;
  onSubmit: () => void;
  evidenceCount: number;
}) {
  const { t, pick, lang } = useLang();
  const [editing, setEditing] = useState<string | null>(null);

  return (
    <section aria-labelledby="results-title" className="mt-8">
      <div id="results-title">
        <SectionTitle hint={t("preliminaryHint")}>{t("preliminary")}</SectionTitle>
      </div>
      <p className="mb-4 text-sm text-muted-foreground">
        {lang === "ar"
          ? `هذه ملاحظات أولية مستندة إلى ${evidenceCount} صورة. راجعها قبل الإرسال.`
          : `These are preliminary observations based on ${evidenceCount} image${evidenceCount === 1 ? "" : "s"}. Review them before submitting.`}
      </p>

      <ul className="space-y-4">
        {observations.map((o) => {
          const entry = confirmed[o.key] ?? { state: o.state, action: "confirmed" as const };
          return (
            <li key={o.key} className="rounded-2xl border border-border p-4">
              <ul>
                <EvidenceItem evidence={{ ...o, state: entry.state }} />
              </ul>

              <div className="mt-3 flex flex-wrap gap-2">
                <Button
                  size="sm"
                  variant={entry.action === "confirmed" ? "access" : "outline"}
                  onClick={() => {
                    setConfirmed({ ...confirmed, [o.key]: { state: o.state, action: "confirmed" } });
                    setEditing(null);
                  }}
                >
                  <Check className="size-4" aria-hidden="true" />
                  {t("iConfirm")}
                </Button>
                <Button
                  size="sm"
                  variant={entry.action === "corrected" ? "primary" : "outline"}
                  onClick={() => setEditing(editing === o.key ? null : o.key)}
                  aria-expanded={editing === o.key}
                >
                  <Pencil className="size-4" aria-hidden="true" />
                  {t("iCorrect")}
                </Button>
                <Button
                  size="sm"
                  variant={entry.action === "unsure" ? "primary" : "outline"}
                  onClick={() => {
                    setConfirmed({ ...confirmed, [o.key]: { state: "unknown", action: "unsure" } });
                    setEditing(null);
                  }}
                >
                  <CircleHelp className="size-4" aria-hidden="true" />
                  {t("iAmUnsure")}
                </Button>
              </div>

              {editing === o.key ? (
                <fieldset className="door-reveal mt-4 rounded-xl border border-border bg-surface p-4">
                  <legend className="px-1 text-sm font-semibold">
                    {t("whatDoYouSee")} {pick(INDICATOR_LABEL[o.key])}؟
                  </legend>
                  <div className="mt-2 flex flex-wrap gap-2">
                    {CORRECTION_OPTIONS.map((s) => (
                      <label
                        key={s}
                        className={`flex min-h-11 cursor-pointer items-center gap-2 rounded-full border-2 px-4 text-sm font-semibold ${entry.state === s ? "border-primary bg-primary-soft text-primary" : "border-border"}`}
                      >
                        <input
                          type="radio"
                          name={`fix-${o.key}`}
                          checked={entry.state === s}
                          onChange={() => setConfirmed({ ...confirmed, [o.key]: { state: s, action: "corrected" } })}
                          className="size-4 accent-[var(--color-primary)]"
                        />
                        {pick(stateLabel(o.key, s))}
                      </label>
                    ))}
                  </div>
                </fieldset>
              ) : null}
            </li>
          );
        })}
      </ul>

      <div className="mt-8">
        <Button size="lg" block onClick={onSubmit}>{t("submitForReview")}</Button>
        <p className="mt-2 text-center text-sm text-muted-foreground">{t("reviewedBeforePublish")}</p>
      </div>
    </section>
  );
}
