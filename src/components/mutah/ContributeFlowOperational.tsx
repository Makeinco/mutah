import { Link, useNavigate } from "@tanstack/react-router";
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
  LogIn,
  Pencil,
  Trash2,
} from "lucide-react";
import { useEffect, useRef, useState, type ComponentType } from "react";
import { EvidenceItem } from "@/components/mutah/Evidence";
import { Button, Card, EmptyState, SectionTitle } from "@/components/mutah/ui";
import { analyseEvidenceServer } from "@/lib/mutah/ai.functions";
import { ANALYSIS_STEPS, analyseZoneImage } from "@/lib/mutah/ai";
import { useAuth } from "@/lib/mutah/auth";
import { useLang } from "@/lib/mutah/i18n";
import { INDICATOR_LABEL, ZONE_HINT, ZONE_LABEL, ZONE_ORDER, stateLabel } from "@/lib/mutah/labels";
import { persistLiveContribution } from "@/lib/mutah/operational";
import { emptyConfirmations, useMutah } from "@/lib/mutah/store";
import type { Contribution, IndicatorEvidence, IndicatorState, L, ZoneKey } from "@/lib/mutah/types";

type Step = "capture" | "analysing" | "confirm" | "done";
type AnalysisMode = "live" | "demo" | null;
type SubmitState = "idle" | "saving" | "error";

type ZoneGuide = {
  image: string;
  icon: ComponentType<{ className?: string }>;
  title: L;
  points: L[];
};

const MAX_IMAGES = 6;
const MAX_IMAGE_BYTES = 8 * 1024 * 1024;
const ALLOWED_IMAGE_TYPES = new Set(["image/jpeg", "image/png", "image/webp"]);

const ZONE_GUIDE: Record<ZoneKey, ZoneGuide> = {
  approach: {
    image: "/guides/approach.svg",
    icon: Footprints,
    title: { ar: "مثال لمسار الوصول المناسب", en: "Example of a useful approach-path photo" },
    points: [
      { ar: "أظهر الطريق من نقطة الوصول حتى المدخل.", en: "Show the route from the arrival point to the entrance." },
      { ar: "أظهر الرصيف والمنحدر والعوائق إن وجدت.", en: "Include the curb, curb ramp, and visible obstacles." },
      { ar: "استخدم زاوية واسعة قدر الإمكان.", en: "Use a wide angle whenever possible." },
    ],
  },
  entrance: {
    image: "/guides/entrance.svg",
    icon: DoorOpen,
    title: { ar: "مثال لصورة المدخل المناسبة", en: "Example of a useful entrance photo" },
    points: [
      { ar: "أظهر الباب والمساحة أمامه بوضوح.", en: "Show the door and the space immediately in front of it." },
      { ar: "أظهر الدرج أو المنحدر إن وجد.", en: "Include visible steps or a ramp." },
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
      { ar: "يمكن إضافة صورة للوحة الأزرار إذا كانت واضحة.", en: "Add another photo of the call buttons when useful." },
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

export function ContributeFlowOperational({ facilityId, initialZone }: { facilityId: string; initialZone?: ZoneKey }) {
  const navigate = useNavigate();
  const { getFacility, submitContribution } = useMutah();
  const { user } = useAuth();
  const { t, pick, lang } = useLang();
  const facility = getFacility(facilityId);
  const ar = lang === "ar";

  const [zone, setZone] = useState<ZoneKey>(initialZone ?? "entrance");
  const [step, setStep] = useState<Step>("capture");
  const [previews, setPreviews] = useState<string[]>([]);
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
  const [observations, setObservations] = useState<IndicatorEvidence[]>([]);
  const [confirmed, setConfirmed] = useState<Contribution["confirmed"] | null>(null);
  const [analysisMode, setAnalysisMode] = useState<AnalysisMode>(null);
  const [analysisError, setAnalysisError] = useState(false);
  const [fileError, setFileError] = useState("");
  const [submitState, setSubmitState] = useState<SubmitState>("idle");
  const [submitError, setSubmitError] = useState("");
  const [persistedId, setPersistedId] = useState<string | null>(null);
  const fileRef = useRef<HTMLInputElement>(null);

  useEffect(() => () => previews.forEach((url) => url.startsWith("blob:") && URL.revokeObjectURL(url)), [previews]);

  if (!facility) {
    return (
      <EmptyState
        title={t("notFound")}
        description={t("notFoundBody")}
        action={<Link to="/contribute"><Button>{t("goContribute")}</Button></Link>}
      />
    );
  }

  const clearImages = () => {
    previews.forEach((url) => url.startsWith("blob:") && URL.revokeObjectURL(url));
    setPreviews([]);
    setSelectedFiles([]);
    setFileError("");
  };

  const addFiles = (files: FileList | File[]) => {
    const incoming = Array.from(files);
    const invalidType = incoming.some((file) => !ALLOWED_IMAGE_TYPES.has(file.type));
    const tooLarge = incoming.some((file) => file.size > MAX_IMAGE_BYTES);
    if (invalidType || tooLarge) {
      setFileError(
        invalidType
          ? ar ? "استخدم صور JPG أو PNG أو WebP فقط." : "Use JPG, PNG, or WebP images only."
          : ar ? "حجم الصورة الواحدة يجب ألا يتجاوز 8 ميجابايت." : "Each image must be 8 MB or smaller.",
      );
      return;
    }
    const accepted = incoming.slice(0, Math.max(0, MAX_IMAGES - selectedFiles.length));
    if (!accepted.length) return;
    setFileError("");
    setSelectedFiles((current) => [...current, ...accepted].slice(0, MAX_IMAGES));
    setPreviews((current) => [...current, ...accepted.map((file) => URL.createObjectURL(file))].slice(0, MAX_IMAGES));
  };

  const removeFile = (index: number) => {
    const url = previews[index];
    if (url?.startsWith("blob:")) URL.revokeObjectURL(url);
    setPreviews((items) => items.filter((_, i) => i !== index));
    setSelectedFiles((items) => items.filter((_, i) => i !== index));
  };

  const startAnalysis = async () => {
    if (!previews.length) return;
    if (selectedFiles.length > 0 && !user) {
      setFileError(ar ? "سجّل الدخول أولًا قبل تحليل صور مساهمة حقيقية حتى نستطيع حفظها بأمان بعد تأكيدك." : "Sign in before analysing real contribution images so they can be saved securely after your confirmation.");
      return;
    }
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
    } catch (cause) {
      console.error("Live evidence analysis failed", cause);
      const fallback = analyseZoneImage(facility, zone);
      setObservations(fallback);
      setConfirmed(emptyConfirmations(fallback));
      setAnalysisMode("demo");
      setAnalysisError(true);
      setStep("confirm");
    }
  };

  const submit = async () => {
    if (!confirmed || submitState === "saving") return;
    setSubmitError("");
    if (analysisMode === "live" && selectedFiles.length > 0) {
      if (!user) {
        setSubmitError(ar ? "انتهت جلسة الدخول. سجّل الدخول ثم أعد المحاولة؛ لم نعتبر المساهمة مرسلة." : "Your session ended. Sign in and try again; the contribution has not been marked as submitted.");
        return;
      }
      setSubmitState("saving");
      try {
        const id = await persistLiveContribution({
          facilityExternalKey: facility.id,
          zone,
          userId: user.id,
          files: selectedFiles,
          observations,
          confirmations: confirmed,
        });
        setPersistedId(id);
        setSubmitState("idle");
        setStep("done");
      } catch (cause) {
        console.error("Could not persist MUTAH contribution", cause);
        setSubmitState("error");
        setSubmitError(ar ? "لم تُرسل المساهمة. بقيت الصور والنتائج في هذه الصفحة؛ حاول مرة أخرى." : "The contribution was not submitted. Your images and review remain on this page; try again.");
      }
      return;
    }

    submitContribution({ facilityId: facility.id, zone, imageUrls: previews, aiObservations: observations, confirmed });
    setPersistedId(null);
    setSubmitState("idle");
    setStep("done");
  };

  const order: Step[] = ["capture", "analysing", "confirm", "done"];
  const steps: Array<[Step, string]> = [["capture", t("stepPhoto")], ["analysing", t("stepAnalysis")], ["confirm", t("stepConfirm")], ["done", t("stepSend")]];

  return (
    <div className="mx-auto max-w-2xl">
      <h1 className="text-2xl font-bold">{pick(facility.name)}</h1>
      <p className="mt-1 text-sm text-muted-foreground">{pick(facility.category)} · {pick(facility.area)}</p>

      <ol className="mt-5 flex gap-2 text-xs font-semibold" aria-label={t("contributeTitle")}>
        {steps.map(([key, label], index) => (
          <li key={key} aria-current={step === key ? "step" : undefined} className={`flex-1 rounded-full border-2 px-2 py-1 text-center ${order.indexOf(step) >= index ? "border-primary bg-primary-soft text-primary" : "border-border text-muted-foreground"}`}>{label}</li>
        ))}
      </ol>

      {step === "capture" ? (
        <>
          {!user ? (
            <Card className="mt-6 border-2 border-primary/20 bg-primary-soft/40">
              <div className="flex items-start gap-3">
                <LogIn className="mt-0.5 size-5 shrink-0 text-primary" aria-hidden="true" />
                <div>
                  <p className="font-bold">{ar ? "لإرسال مساهمة حقيقية، سجّل الدخول قبل اختيار الصور" : "Sign in before selecting images for a real contribution"}</p>
                  <p className="mt-1 text-sm text-muted-foreground">{ar ? "يمكنك استكشاف المثال التجريبي دون حساب، لكن الصور الحقيقية تُحفظ فقط لحساب مساهم موثّق." : "You can explore the demo without an account, but real images are saved only for a signed-in contributor."}</p>
                  <Link to="/account" className="mt-3 inline-flex min-h-11 items-center rounded-xl border border-primary px-4 text-sm font-semibold text-primary hover:bg-primary-soft">{ar ? "تسجيل الدخول" : "Sign in"}</Link>
                </div>
              </div>
            </Card>
          ) : null}

          <fieldset className="mt-8">
            <legend className="text-lg font-bold">{ar ? "اختر الجزء الذي تظهره الصورة" : "Choose the area shown in the photo"}</legend>
            <p className="mt-1 text-sm text-muted-foreground">{ar ? "اختر قسمًا واحدًا لكل حزمة صور. سنوضح ما الذي نحتاج أن يظهر." : "Choose one zone per image bundle. We will show what should be visible."}</p>
            <div className="mt-4 grid grid-cols-2 gap-3 sm:grid-cols-5">
              {ZONE_ORDER.map((key) => {
                const Icon = ZONE_GUIDE[key].icon;
                return (
                  <label key={key} className={`flex min-h-24 cursor-pointer flex-col items-center justify-center gap-2 rounded-2xl border-2 px-3 py-3 text-center text-sm font-semibold ${zone === key ? "border-primary bg-primary-soft text-primary" : "border-border bg-card hover:bg-muted"}`}>
                    <input type="radio" name="zone" checked={zone === key} onChange={() => { setZone(key); clearImages(); }} className="sr-only" />
                    <Icon className="size-6" aria-hidden="true" />
                    <span>{pick(ZONE_LABEL[key])}</span>
                  </label>
                );
              })}
            </div>
          </fieldset>

          <ZoneGuideCard zone={zone} />

          <section className="mt-8" aria-labelledby="capture-title">
            <div id="capture-title"><SectionTitle hint={t("captureHint")}>{t("captureTitle")}</SectionTitle></div>
            <Card className="bg-surface">
              <ul className="list-inside list-disc space-y-1 text-sm text-muted-foreground">
                <li>{ar ? "التقط أكثر من زاوية إذا لم تكفِ صورة واحدة." : "Use more than one angle when needed."}</li>
                <li>{ar ? "تجنب الوجوه ولوحات المركبات." : "Avoid faces and vehicle plates."}</li>
                <li>{ar ? "عدم ظهور العنصر لا يعني أنه غير موجود." : "Not visible does not mean absent."}</li>
              </ul>
            </Card>
            <input ref={fileRef} type="file" accept="image/jpeg,image/png,image/webp" multiple className="sr-only" aria-label={t("pickPhoto")} onChange={(event) => { if (event.target.files?.length) addFiles(event.target.files); event.currentTarget.value = ""; }} />
            {fileError ? <p role="alert" className="mt-3 rounded-xl border border-warning/30 bg-warning-soft p-3 text-sm font-semibold">{fileError}</p> : null}

            {previews.length ? (
              <div className="door-reveal mt-6">
                <div className="mb-3 flex items-center justify-between gap-3">
                  <p className="text-sm font-semibold">{previews.length} {t("photoCount")}</p>
                  {previews.length < MAX_IMAGES ? <Button size="sm" variant="outline" onClick={() => fileRef.current?.click()}><ImagePlus className="size-4" aria-hidden="true" />{t("addAnotherPhoto")}</Button> : null}
                </div>
                <ul className="grid grid-cols-2 gap-3 sm:grid-cols-3">
                  {previews.map((preview, index) => (
                    <li key={`${preview}-${index}`} className="relative overflow-hidden rounded-2xl border border-border bg-surface">
                      <img src={preview} alt={`${t("previewAlt")} ${index + 1}`} className="aspect-4/3 w-full object-cover" />
                      <button type="button" onClick={() => removeFile(index)} className="absolute end-2 top-2 flex size-11 items-center justify-center rounded-xl bg-background/95 shadow-sm" aria-label={`${t("removePhoto")} ${index + 1}`}><Trash2 className="size-5" aria-hidden="true" /></button>
                    </li>
                  ))}
                </ul>
                <Button size="lg" block className="mt-4" onClick={() => void startAnalysis()}>{t("continueToAnalysis")}</Button>
              </div>
            ) : (
              <div className="mt-6 flex flex-col gap-3 sm:flex-row">
                <Button size="lg" className="sm:flex-1" onClick={() => fileRef.current?.click()}><Camera className="size-5" aria-hidden="true" />{t("takePhoto")}</Button>
                <Button size="lg" variant="outline" className="sm:flex-1" onClick={() => fileRef.current?.click()}><ImageUp className="size-5" aria-hidden="true" />{t("pickPhoto")}</Button>
                {facility.imageUrl ? <Button size="lg" variant="quiet" onClick={() => { clearImages(); setPreviews([facility.imageUrl]); }}>{t("useSample")}</Button> : null}
              </div>
            )}
          </section>
        </>
      ) : null}

      {step === "analysing" ? <AnalysingStep count={previews.length} /> : null}

      {step === "confirm" && confirmed ? (
        <ConfirmStep observations={observations} confirmed={confirmed} setConfirmed={setConfirmed} evidenceCount={previews.length} analysisMode={analysisMode} analysisError={analysisError} submitState={submitState} submitError={submitError} onSubmit={() => void submit()} />
      ) : null}

      {step === "done" ? (
        <div className="door-reveal mt-8 rounded-2xl border-2 border-access bg-access-soft p-8 text-center">
          <CheckCircle2 className="mx-auto size-10 text-access-strong" aria-hidden="true" />
          <h2 className="mt-3 text-xl font-bold text-access-strong">{persistedId ? (ar ? "تم إرسال مساهمتك للمراجعة" : "Contribution sent for review") : t("thanks")}</h2>
          <p className="mt-2 text-sm">{persistedId ? (ar ? "حُفظت الصور والرصد وتأكيداتك بأمان، وهي الآن بانتظار المراجعة البشرية." : "Your images, observations, and confirmations were saved securely and are awaiting human review.") : t("thanksBody")}</p>
          <p className="mt-2 text-sm text-muted-foreground">{ar ? "لن تغيّر الأدلة حالة المرفق قبل قرار المراجع." : "Evidence will not change the facility status before a reviewer decision."}</p>
          <div className="mt-6 flex flex-col justify-center gap-3 sm:flex-row">
            {persistedId ? <Button onClick={() => navigate({ to: "/account" })}>{ar ? "متابعة مساهماتي" : "Track my contributions"}</Button> : null}
            <Button variant={persistedId ? "outline" : "primary"} onClick={() => navigate({ to: "/facility/$id", params: { id: facility.id } })}>{t("backToFacility")}</Button>
          </div>
        </div>
      ) : null}
    </div>
  );
}

function ZoneGuideCard({ zone }: { zone: ZoneKey }) {
  const { pick, lang } = useLang();
  const guide = ZONE_GUIDE[zone];
  return (
    <section className="door-reveal mt-6 overflow-hidden rounded-3xl border border-border bg-surface" aria-labelledby="zone-guide-title">
      <div className="grid sm:grid-cols-[220px_1fr]">
        <img src={guide.image} alt={lang === "ar" ? `مثال إرشادي لـ ${pick(ZONE_LABEL[zone])}` : `Illustrated guide for ${pick(ZONE_LABEL[zone])}`} className="aspect-[16/8] w-full bg-primary-soft object-cover sm:aspect-auto sm:h-full" />
        <div className="p-5">
          <p className="text-xs font-bold uppercase tracking-wide text-primary">{lang === "ar" ? "مثال إرشادي للصورة" : "Photo guide example"}</p>
          <h2 id="zone-guide-title" className="mt-1 text-lg font-bold">{pick(guide.title)}</h2>
          <p className="mt-2 text-sm text-muted-foreground">{pick(ZONE_HINT[zone])}</p>
          <ul className="mt-4 space-y-2">{guide.points.map((point) => <li key={pick(point)} className="flex gap-2 text-sm"><CheckCircle2 className="mt-0.5 size-4 shrink-0 text-access-strong" aria-hidden="true" /><span>{pick(point)}</span></li>)}</ul>
        </div>
      </div>
    </section>
  );
}

function AnalysingStep({ count }: { count: number }) {
  const { t, pick, lang } = useLang();
  const [activeIndex, setActiveIndex] = useState(0);
  useEffect(() => {
    const timer = window.setInterval(() => setActiveIndex((current) => Math.min(current + 1, ANALYSIS_STEPS.length - 1)), 900);
    return () => window.clearInterval(timer);
  }, []);
  const progress = Math.max(8, Math.round(((activeIndex + 0.45) / ANALYSIS_STEPS.length) * 100));
  return (
    <section aria-labelledby="analysing-title" className="mt-8" aria-live="polite">
      <div className="flex items-start gap-4"><span className="flex size-12 shrink-0 items-center justify-center rounded-2xl bg-primary-soft text-primary"><LoaderCircle className="size-7 animate-spin" aria-hidden="true" /></span><div><h2 id="analysing-title" className="text-xl font-bold">{t("analysingTitle")}</h2><p className="mt-1 text-sm text-muted-foreground">{t("analysingHint")}</p><p className="mt-2 text-sm font-semibold">{lang === "ar" ? `تحليل ${count} صورة عبر Gemini…` : `Analysing ${count} image${count === 1 ? "" : "s"} with Gemini…`}</p></div></div>
      <div className="mt-6"><div className="h-2 overflow-hidden rounded-full bg-muted"><div className="h-full rounded-full bg-primary transition-[width] duration-700" style={{ width: `${progress}%` }} /></div><div className="mt-2 flex items-center justify-between gap-3 text-xs font-semibold text-muted-foreground"><span>{progress}%</span><span>{lang === "ar" ? "قد يستغرق التحليل بضع ثوانٍ." : "Analysis may take a few seconds."}</span></div></div>
      <ul className="mt-6 space-y-3">{ANALYSIS_STEPS.map((item, index) => { const done = index < activeIndex; const active = index === activeIndex; return <li key={item.id} className={`flex items-center gap-3 rounded-2xl border p-4 ${active ? "border-primary bg-primary-soft" : "border-border"}`}><span className={`flex size-8 shrink-0 items-center justify-center rounded-full ${done ? "bg-access-soft text-access-strong" : active ? "bg-primary text-primary-foreground" : "bg-muted text-muted-foreground"}`}>{done ? <Check className="size-4" aria-hidden="true" /> : active ? <LoaderCircle className="size-4 animate-spin" aria-hidden="true" /> : <span className="size-2 rounded-full bg-current" />}</span><div><span className="font-semibold">{pick(item.label)}</span><p className="mt-0.5 text-xs text-muted-foreground">{done ? (lang === "ar" ? "تم" : "Done") : active ? (lang === "ar" ? "قيد التنفيذ" : "In progress") : (lang === "ar" ? "التالي" : "Next")}</p></div></li>; })}</ul>
    </section>
  );
}

const CORRECTION_OPTIONS: IndicatorState[] = ["present", "absent", "not_visible"];

function ConfirmStep({ observations, confirmed, setConfirmed, onSubmit, evidenceCount, analysisMode, analysisError, submitState, submitError }: { observations: IndicatorEvidence[]; confirmed: Contribution["confirmed"]; setConfirmed: (value: Contribution["confirmed"]) => void; onSubmit: () => void; evidenceCount: number; analysisMode: AnalysisMode; analysisError: boolean; submitState: SubmitState; submitError: string }) {
  const { t, pick, lang } = useLang();
  const [editing, setEditing] = useState<string | null>(null);
  const ar = lang === "ar";
  return (
    <section aria-labelledby="results-title" className="mt-8">
      <div id="results-title"><SectionTitle hint={t("preliminaryHint")}>{t("preliminary")}</SectionTitle></div>
      <div className="mb-4 rounded-xl border border-border bg-surface p-3 text-sm"><p className="font-semibold">{analysisMode === "live" ? (ar ? "تحليل حي عبر Gemini — يحتاج تأكيدك قبل الإرسال." : "Live Gemini analysis — confirm before submitting.") : (ar ? "عرض تجريبي محافظ — لا يدخل بيانات التشغيل." : "Conservative demo — it does not enter operational data.")}</p>{analysisError ? <p className="mt-1 text-muted-foreground">{ar ? "تعذر التحليل الحي؛ استخدمنا العرض التجريبي لهذه المحاولة ولن يُحفظ كدليل حقيقي." : "Live analysis failed; this attempt uses demo output and will not be saved as real evidence."}</p> : null}</div>
      <p className="mb-4 text-sm text-muted-foreground">{ar ? `ملاحظات أولية مستندة إلى ${evidenceCount} صورة. راجع كل عنصر.` : `Preliminary observations based on ${evidenceCount} image${evidenceCount === 1 ? "" : "s"}. Review each item.`}</p>
      <ul className="space-y-4">{observations.map((observation) => { const entry = confirmed[observation.key] ?? { state: observation.state, action: "confirmed" as const }; return <li key={observation.key} className="rounded-2xl border border-border p-4"><ul><EvidenceItem evidence={{ ...observation, state: entry.state }} /></ul><div className="mt-3 flex flex-wrap gap-2"><Button size="sm" variant={entry.action === "confirmed" ? "access" : "outline"} onClick={() => { setConfirmed({ ...confirmed, [observation.key]: { state: observation.state, action: "confirmed" } }); setEditing(null); }}><Check className="size-4" aria-hidden="true" />{t("iConfirm")}</Button><Button size="sm" variant={entry.action === "corrected" ? "primary" : "outline"} onClick={() => setEditing(editing === observation.key ? null : observation.key)}><Pencil className="size-4" aria-hidden="true" />{t("iCorrect")}</Button><Button size="sm" variant={entry.action === "unsure" ? "primary" : "outline"} onClick={() => { setConfirmed({ ...confirmed, [observation.key]: { state: "unknown", action: "unsure" } }); setEditing(null); }}><CircleHelp className="size-4" aria-hidden="true" />{t("iAmUnsure")}</Button></div>{editing === observation.key ? <fieldset className="door-reveal mt-4 rounded-xl border border-border bg-surface p-4"><legend className="px-1 text-sm font-semibold">{t("whatDoYouSee")} {pick(INDICATOR_LABEL[observation.key])}؟</legend><div className="mt-2 flex flex-wrap gap-2">{CORRECTION_OPTIONS.map((state) => <label key={state} className={`flex min-h-11 cursor-pointer items-center gap-2 rounded-full border-2 px-4 text-sm font-semibold ${entry.state === state ? "border-primary bg-primary-soft text-primary" : "border-border"}`}><input type="radio" name={`fix-${observation.key}`} checked={entry.state === state} onChange={() => setConfirmed({ ...confirmed, [observation.key]: { state, action: "corrected" } })} className="size-4 accent-[var(--color-primary)]" />{pick(stateLabel(observation.key, state))}</label>)}</div></fieldset> : null}</li>; })}</ul>
      {submitError ? <p role="alert" className="mt-5 rounded-xl border border-destructive/30 bg-destructive/5 p-3 text-sm font-semibold">{submitError}</p> : null}
      <div className="mt-8"><Button size="lg" block disabled={submitState === "saving"} onClick={onSubmit}>{submitState === "saving" ? <><LoaderCircle className="size-5 animate-spin" aria-hidden="true" />{ar ? "جاري حفظ مساهمتك…" : "Saving your contribution…"}</> : t("submitForReview")}</Button><p className="mt-2 text-center text-sm text-muted-foreground">{submitState === "saving" ? (ar ? "لا تغلق الصفحة حتى يكتمل الحفظ." : "Keep this page open until saving completes.") : t("reviewedBeforePublish")}</p></div>
    </section>
  );
}
