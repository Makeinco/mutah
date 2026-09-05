import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import {
  Accessibility,
  Camera,
  Check,
  CheckCircle2,
  CircleHelp,
  CircleParking,
  DoorOpen,
  Footprints,
  ImagePlus,
  ImageUp,
  LoaderCircle,
  Pencil,
  Trash2,
} from "lucide-react";
import { useEffect, useRef, useState } from "react";
import type { ComponentType } from "react";
import { z } from "zod";
import { AppShell } from "@/components/mutah/AppShell";
import { EvidenceItem } from "@/components/mutah/Evidence";
import { Button, Card, EmptyState, SectionTitle } from "@/components/mutah/ui";
import { analyseEvidenceServer } from "@/lib/mutah/ai.functions";
import { ANALYSIS_STEPS, analyseZoneImage } from "@/lib/mutah/ai";
import { useLang } from "@/lib/mutah/i18n";
import { INDICATOR_LABEL, ZONE_HINT, ZONE_LABEL, ZONE_ORDER, stateLabel } from "@/lib/mutah/labels";
import { emptyConfirmations, useMutah } from "@/lib/mutah/store";
import type { Contribution, IndicatorEvidence, IndicatorState, L, ZoneKey } from "@/lib/mutah/types";

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
type AnalysisMode = "live" | "demo" | null;

type ZoneGuide = {
  image: string;
  icon: ComponentType<{ className?: string }>;
  title: L;
  points: L[];
};

const ZONE_GUIDE: Record<ZoneKey, ZoneGuide> = {
  approach: {
    image: "/guides/approach.svg",
    icon: Footprints,
    title: { ar: "مثال لمسار الوصول المناسب", en: "Example of a useful approach-path photo" },
    points: [
      { ar: "أظهر الطريق من نقطة الوصول حتى المدخل.", en: "Show the route from the arrival point to the entrance." },
      { ar: "أظهر الرصيف والمنحدر والعوائق إن وجدت.", en: "Include the curb, curb ramp, and any visible obstacles." },
      { ar: "استخدم زاوية واسعة قدر الإمكان.", en: "Use a wide angle whenever possible." },
    ],
  },
  entrance: {
    image: "/guides/entrance.svg",
    icon: DoorOpen,
    title: { ar: "مثال لصورة المدخل المناسبة", en: "Example of a useful entrance photo" },
    points: [
      { ar: "أظهر الباب والمساحة أمامه بوضوح.", en: "Show the door and the space immediately in front of it." },
      { ar: "أظهر الدرج أو المنحدر إن وجد.", en: "Include any visible steps or ramp." },
      { ar: "أضف زاوية ثانية إذا لم يظهر المسار كاملًا.", en: "Add a second angle if the full route is not visible." },
    ],
  },
  parking: {
    image: "/guides/parking.svg",
    icon: CircleParking,
    title: { ar: "مثال لصورة المواقف المناسبة", en: "Example of a useful parking photo" },
    points: [
      { ar: "أظهر الموقف المخصص أو علامة الإتاحة إن وجدت.", en: "Show the accessible bay or access marking if present." },
      { ar: "حاول إظهار علاقته بمسار الوصول للمبنى.", en: "Try to show how it connects to the route toward the building." },
      { ar: "تجنب تصوير لوحات المركبات.", en: "Avoid capturing vehicle licence plates." },
    ],
  },
  elevator: {
    image: "/guides/elevator.svg",
    icon: Accessibility,
    title: { ar: "مثال لصورة المصعد المناسبة", en: "Example of a useful elevator photo" },
    points: [
      { ar: "أظهر باب المصعد والمنطقة المحيطة.", en: "Show the elevator doors and surrounding area." },
      { ar: "يمكن إضافة صورة للوحة الأزرار إذا كانت واضحة.", en: "Add a second photo of the call buttons when useful." },
      { ar: "لا تستنتج أبعاد المصعد من الصورة.", en: "Do not infer elevator dimensions from the photo." },
    ],
  },
  restroom: {
    image: "/guides/restroom.svg",
    icon: Accessibility,
    title: { ar: "مثال لصورة دورة المياه المخصصة", en: "Example of a useful accessible-restroom photo" },
    points: [
      { ar: "أظهر المدخل والعلامة الخارجية بوضوح.", en: "Show the entrance and external access sign clearly." },
      { ar: "أضف صورة أخرى للعناصر المرئية المهمة عند الحاجة.", en: "Add another image for relevant visible features when needed." },
      { ar: "لا تصوّر الأشخاص داخل دورة المياه.", en: "Do not photograph people inside the restroom." },
    ],
  },
};

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
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
  const [observations, setObservations] = useState<IndicatorEvidence[]>([]);
  const [confirmed, setConfirmed] = useState<Contribution["confirmed"] | null>(null);
  const [analysisMode, setAnalysisMode] = useState<AnalysisMode>(null);
  const [analysisError, setAnalysisError] = useState(false);
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
    const accepted = Array.from(files)
      .filter((file) => file.type.startsWith("image/"))
      .slice(0, Math.max(0, 6 - selectedFiles.length));
    if (accepted.length === 0) return;

    setSelectedFiles((current) => [...current, ...accepted].slice(0, 6));
    setPreviews((current) => [
      ...current,
      ...accepted.map((file) => URL.createObjectURL(file)),
    ].slice(0, 6));
  };

  const removeFile = (index: number) => {
    setPreviews((items) => items.filter((_, i) => i !== index));
    setSelectedFiles((items) => items.filter((_, i) => i !== index));
  };

  const startAnalysis = async () => {
    if (previews.length === 0) return;
    setStep("analysing");
    setAnalysisError(false);

    try {
      if (selectedFiles.length > 0) {
        const formData = new FormData();
        formData.set("zone", zone);
        selectedFiles.forEach((file) => formData.append("images", file));
        const result = await analyseEvidenceServer({ data: formData });
        setObservations(result);
        setConfirmed(emptyConfirmations(result));
        setAnalysisMode("live");
      } else {
        const result = analyseZoneImage(facility, zone);
        setObservations(result);
        setConfirmed(emptyConfirmations(result));
        setAnalysisMode("demo");
      }
      setStep("confirm");
    } catch (error) {
      console.error("Live evidence analysis failed", error);
      const fallback = analyseZoneImage(facility, zone);
      setObservations(fallback);
      setConfirmed(emptyConfirmations(fallback));
      setAnalysisMode("demo");
      setAnalysisError(true);
      setStep("confirm");
    }
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
              <legend className="text-lg font-bold">
                {lang === "ar" ? "اختر الجزء الذي تظهره الصورة" : "Choose the area shown in the photo"}
              </legend>
              <p className="mt-1 text-sm text-muted-foreground">
                {lang === "ar"
                  ? "اختر قسمًا واحدًا فقط لكل حزمة صور. سنعرض لك مثالًا لما نحتاج أن يظهر."
                  : "Choose one zone per image bundle. We will show an example of what the photo should capture."}
              </p>
              <div className="mt-4 grid grid-cols-2 gap-3 sm:grid-cols-5">
                {ZONE_ORDER.map((z) => {
                  const Icon = ZONE_GUIDE[z].icon;
                  return (
                    <label
                      key={z}
                      className={`flex min-h-24 cursor-pointer flex-col items-center justify-center gap-2 rounded-2xl border-2 px-3 py-3 text-center text-sm font-semibold transition-colors ${zone === z ? "border-primary bg-primary-soft text-primary" : "border-border bg-card hover:bg-muted"}`}
                    >
                      <input
                        type="radio"
                        name="zone"
                        checked={zone === z}
                        onChange={() => {
                          setZone(z);
                          setPreviews([]);
                          setSelectedFiles([]);
                        }}
                        className="sr-only"
                      />
                      <Icon className="size-6" aria-hidden="true" />
                      <span>{pick(ZONE_LABEL[z])}</span>
                    </label>
                  );
                })}
              </div>
            </fieldset>

            <ZoneGuideCard zone={zone} />

            <CaptureStep
              previews={previews}
              fallbackImage={facility.imageUrl}
              onAdd={addFiles}
              onUseSample={() => {
                setSelectedFiles([]);
                facility.imageUrl && setPreviews([facility.imageUrl]);
              }}
              onRemove={removeFile}
              onContinue={startAnalysis}
              fileRef={fileRef}
            />
          </>
        ) : null}

        {step === "analysing" ? <AnalysingStep count={previews.length} /> : null}

        {step === "confirm" && confirmed ? (
          <ConfirmStep
            observations={observations}
            confirmed={confirmed}
            setConfirmed={setConfirmed}
            evidenceCount={previews.length}
            analysisMode={analysisMode}
            analysisError={analysisError}
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

function ZoneGuideCard({ zone }: { zone: ZoneKey }) {
  const { pick, lang } = useLang();
  const guide = ZONE_GUIDE[zone];

  return (
    <section className="door-reveal mt-6 overflow-hidden rounded-3xl border border-border bg-surface" aria-labelledby="zone-guide-title">
      <div className="grid gap-0 sm:grid-cols-[220px_1fr]">
        <img
          src={guide.image}
          alt={lang === "ar" ? `مثال إرشادي لـ ${pick(ZONE_LABEL[zone])}` : `Illustrated guide for ${pick(ZONE_LABEL[zone])}`}
          className="aspect-[16/8] w-full bg-primary-soft object-cover sm:aspect-auto sm:h-full"
        />
        <div className="p-5">
          <p className="text-xs font-bold uppercase tracking-wide text-primary">
            {lang === "ar" ? "مثال إرشادي للصورة" : "Photo guide example"}
          </p>
          <h2 id="zone-guide-title" className="mt-1 text-lg font-bold">{pick(guide.title)}</h2>
          <p className="mt-2 text-sm text-muted-foreground">{pick(ZONE_HINT[zone])}</p>
          <ul className="mt-4 space-y-2">
            {guide.points.map((point) => (
              <li key={pick(point)} className="flex gap-2 text-sm">
                <CheckCircle2 className="mt-0.5 size-4 shrink-0 text-access-strong" aria-hidden="true" />
                <span>{pick(point)}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
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

function AnalysingStep({ count }: { count: number }) {
  const { t, pick, lang } = useLang();
  const [activeIndex, setActiveIndex] = useState(0);

  useEffect(() => {
    const timer = window.setInterval(() => {
      setActiveIndex((current) => Math.min(current + 1, ANALYSIS_STEPS.length - 1));
    }, 900);
    return () => window.clearInterval(timer);
  }, []);

  const progress = Math.max(8, Math.round(((activeIndex + 0.45) / ANALYSIS_STEPS.length) * 100));

  return (
    <section aria-labelledby="analysing-title" className="mt-8" aria-live="polite">
      <div className="flex items-start gap-4">
        <span className="flex size-12 shrink-0 items-center justify-center rounded-2xl bg-primary-soft text-primary">
          <LoaderCircle className="size-7 animate-spin" aria-hidden="true" />
        </span>
        <div>
          <h2 id="analysing-title" className="text-xl font-bold">{t("analysingTitle")}</h2>
          <p className="mt-1 text-sm text-muted-foreground">{t("analysingHint")}</p>
          <p className="mt-2 text-sm font-semibold">
            {lang === "ar"
              ? `تحليل حزمة أدلة من ${count} صورة عبر Gemini…`
              : `Analysing an evidence bundle of ${count} image${count === 1 ? "" : "s"} with Gemini…`}
          </p>
        </div>
      </div>

      <div className="mt-6" aria-label={lang === "ar" ? "تقدم التحليل" : "Analysis progress"}>
        <div className="h-2 overflow-hidden rounded-full bg-muted">
          <div className="h-full rounded-full bg-primary transition-[width] duration-700" style={{ width: `${progress}%` }} />
        </div>
        <div className="mt-2 flex items-center justify-between text-xs font-semibold text-muted-foreground">
          <span>{progress}%</span>
          <span>
            {lang === "ar"
              ? "قد يستغرق التحليل بضع ثوانٍ حسب جودة الصورة والاتصال."
              : "Analysis may take a few seconds depending on image quality and connection."}
          </span>
        </div>
      </div>

      <ul className="mt-6 space-y-3">
        {ANALYSIS_STEPS.map((s, i) => {
          const done = i < activeIndex;
          const active = i === activeIndex;
          return (
            <li
              key={s.id}
              className={`flex items-center gap-3 rounded-2xl border p-4 transition-colors ${active ? "border-primary bg-primary-soft" : "border-border"}`}
            >
              <span className={`flex size-8 shrink-0 items-center justify-center rounded-full ${done ? "bg-access-soft text-access-strong" : active ? "bg-primary text-primary-foreground" : "bg-muted text-muted-foreground"}`}>
                {done ? (
                  <Check className="size-4" aria-hidden="true" />
                ) : active ? (
                  <LoaderCircle className="size-4 animate-spin" aria-hidden="true" />
                ) : (
                  <span className="size-2 rounded-full bg-current" aria-hidden="true" />
                )}
              </span>
              <div className="min-w-0 flex-1">
                <span className="font-semibold">{pick(s.label)}</span>
                <p className="mt-0.5 text-xs text-muted-foreground">
                  {done
                    ? lang === "ar" ? "تم" : "Done"
                    : active
                      ? lang === "ar" ? "قيد التنفيذ" : "In progress"
                      : lang === "ar" ? "التالي" : "Next"}
                </p>
              </div>
            </li>
          );
        })}
      </ul>
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
  analysisMode,
  analysisError,
}: {
  observations: IndicatorEvidence[];
  confirmed: Contribution["confirmed"];
  setConfirmed: (c: Contribution["confirmed"]) => void;
  onSubmit: () => void;
  evidenceCount: number;
  analysisMode: AnalysisMode;
  analysisError: boolean;
}) {
  const { t, pick, lang } = useLang();
  const [editing, setEditing] = useState<string | null>(null);

  return (
    <section aria-labelledby="results-title" className="mt-8">
      <div id="results-title">
        <SectionTitle hint={t("preliminaryHint")}>{t("preliminary")}</SectionTitle>
      </div>

      <div className="mb-4 rounded-xl border border-border bg-surface p-3 text-sm">
        <p className="font-semibold">
          {analysisMode === "live"
            ? lang === "ar"
              ? "تحليل حي عبر Gemini — يحتاج تأكيدك قبل الإرسال."
              : "Live Gemini analysis — your confirmation is required before submission."
            : lang === "ar"
              ? "عرض تجريبي محافظ — لا يُنشر أي شيء قبل المراجعة البشرية."
              : "Conservative demo fallback — nothing is published before human review."}
        </p>
        {analysisError ? (
          <p className="mt-1 text-muted-foreground">
            {lang === "ar"
              ? "تعذر الاتصال بالتحليل الحي، لذلك استخدمنا العرض التجريبي بدلًا منه لهذه المحاولة."
              : "Live analysis could not be reached, so the demo fallback was used for this attempt."}
          </p>
        ) : null}
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
