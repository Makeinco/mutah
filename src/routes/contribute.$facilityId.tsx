import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { Camera, Check, CircleHelp, ImageUp, Pencil } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { AppShell } from "@/components/mutah/AppShell";
import { EvidenceItem } from "@/components/mutah/Evidence";
import { Button, Card, EmptyState, SectionTitle } from "@/components/mutah/ui";
import { ANALYSIS_STEPS, analyseEntranceImage } from "@/lib/mutah/ai";
import { INDICATOR_LABEL, STATE_LABEL } from "@/lib/mutah/labels";
import { emptyConfirmations, useMutah } from "@/lib/mutah/store";
import type { Contribution, IndicatorEvidence, IndicatorState } from "@/lib/mutah/types";

export const Route = createFileRoute("/contribute/$facilityId")({
  head: () => ({
    meta: [
      { title: "مساهمة بصورة مدخل | مُتاح ماب" },
      {
        name: "description",
        content: "صوّر المدخل، راجع التحليل الأولي، صحّح ما يلزم، ثم أرسل المساهمة للمراجعة قبل النشر.",
      },
      { property: "og:title", content: "مساهمة بصورة مدخل | مُتاح ماب" },
      { property: "og:description", content: "الذكاء الاصطناعي يرصد، والبشر يتحققون." },
    ],
  }),
  component: ContributeFlow,
});

type Step = "capture" | "analysing" | "confirm" | "done";

function ContributeFlow() {
  const { facilityId } = Route.useParams();
  const navigate = useNavigate();
  const { getFacility, submitContribution } = useMutah();
  const facility = getFacility(facilityId);

  const [step, setStep] = useState<Step>("capture");
  const [preview, setPreview] = useState<string>("");
  const [observations, setObservations] = useState<IndicatorEvidence[]>([]);
  const [confirmed, setConfirmed] = useState<Contribution["confirmed"] | null>(null);
  const fileRef = useRef<HTMLInputElement>(null);

  if (!facility) {
    return (
      <AppShell title="مساهمة">
        <EmptyState
          title="لم نجد هذا المرفق"
          description="اختر مرفقًا من صفحة المساهمة للمتابعة."
          action={
            <Link to="/contribute">
              <Button>العودة إلى المساهمة</Button>
            </Link>
          }
        />
      </AppShell>
    );
  }

  const startAnalysis = () => {
    const result = analyseEntranceImage(facility);
    setObservations(result);
    setConfirmed(emptyConfirmations(result));
    setStep("analysing");
  };

  return (
    <AppShell title={`مساهمة — ${facility.name}`}>
      <div className="mx-auto max-w-2xl">
        <h1 className="text-2xl font-bold">{facility.name}</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          {facility.category} · {facility.area}
        </p>

        <ol className="mt-5 flex gap-2 text-xs font-semibold" aria-label="مراحل المساهمة">
          {[
            ["capture", "الصورة"],
            ["analysing", "التحليل"],
            ["confirm", "التأكيد"],
            ["done", "الإرسال"],
          ].map(([key, label], i) => {
            const order: Step[] = ["capture", "analysing", "confirm", "done"];
            const active = order.indexOf(step) >= i;
            return (
              <li
                key={key}
                aria-current={step === key ? "step" : undefined}
                className={`flex-1 rounded-full border-2 px-2 py-1 text-center ${active ? "border-primary bg-primary-soft text-primary" : "border-border text-muted-foreground"}`}
              >
                {label}
              </li>
            );
          })}
        </ol>

        {step === "capture" ? (
          <CaptureStep
            preview={preview}
            fallbackImage={facility.imageUrl}
            onPick={(url) => setPreview(url)}
            onReset={() => setPreview("")}
            onContinue={startAnalysis}
            fileRef={fileRef}
          />
        ) : null}

        {step === "analysing" ? <AnalysingStep onDone={() => setStep("confirm")} /> : null}

        {step === "confirm" && confirmed ? (
          <ConfirmStep
            observations={observations}
            confirmed={confirmed}
            setConfirmed={setConfirmed}
            onSubmit={() => {
              submitContribution({
                facilityId: facility.id,
                imageUrl: preview || facility.imageUrl,
                aiObservations: observations,
                confirmed,
              });
              setStep("done");
            }}
          />
        ) : null}

        {step === "done" ? (
          <div className="door-reveal mt-8 rounded-2xl border-2 border-access bg-access-soft p-8 text-center">
            <h2 className="text-xl font-bold text-access-strong">شكرًا لمساهمتك</h2>
            <p className="mt-2 text-sm">أُرسلت المعلومات إلى المراجعة.</p>
            <div className="mt-6 flex flex-col justify-center gap-3 sm:flex-row">
              <Button onClick={() => navigate({ to: "/facility/$id", params: { id: facility.id } })}>
                العودة إلى المرفق
              </Button>
              <Button variant="outline" onClick={() => navigate({ to: "/review" })}>
                فتح مركز المراجعة
              </Button>
            </div>
          </div>
        ) : null}
      </div>
    </AppShell>
  );
}

function CaptureStep({
  preview,
  fallbackImage,
  onPick,
  onReset,
  onContinue,
  fileRef,
}: {
  preview: string;
  fallbackImage: string;
  onPick: (url: string) => void;
  onReset: () => void;
  onContinue: () => void;
  fileRef: React.RefObject<HTMLInputElement | null>;
}) {
  return (
    <section aria-labelledby="capture-title" className="mt-8">
      <div id="capture-title">
        <SectionTitle hint="الصورة الحديثة هي أساس كل دليل في مُتاح.">صوّر المدخل بوضوح</SectionTitle>
      </div>

      <Card className="bg-surface">
        <ul className="list-inside list-disc space-y-1 text-sm text-muted-foreground">
          <li>حاول إظهار الطريق إلى الباب.</li>
          <li>تجنب تصوير الوجوه.</li>
          <li>تجنب ظهور لوحات المركبات.</li>
          <li>استخدم صورة حديثة قدر الإمكان.</li>
        </ul>
      </Card>

      <input
        ref={fileRef}
        type="file"
        accept="image/*"
        className="sr-only"
        aria-label="اختيار صورة من الجهاز"
        onChange={(e) => {
          const file = e.target.files?.[0];
          if (file) onPick(URL.createObjectURL(file));
        }}
      />

      {preview || fallbackImage ? null : null}

      {preview ? (
        <div className="mt-6">
          <img
            src={preview}
            alt="معاينة الصورة التي اخترتها للمدخل"
            className="aspect-4/3 w-full rounded-2xl object-cover"
          />
          <div className="mt-4 flex flex-col gap-3 sm:flex-row">
            <Button size="lg" className="sm:flex-1" onClick={onContinue}>
              متابعة للتحليل
            </Button>
            <Button size="lg" variant="outline" onClick={onReset}>
              إعادة الاختيار
            </Button>
          </div>
        </div>
      ) : (
        <div className="mt-6 flex flex-col gap-3 sm:flex-row">
          <Button size="lg" className="sm:flex-1" onClick={() => fileRef.current?.click()}>
            <Camera className="size-5" aria-hidden="true" />
            التقاط صورة
          </Button>
          <Button
            size="lg"
            variant="outline"
            className="sm:flex-1"
            onClick={() => fileRef.current?.click()}
          >
            <ImageUp className="size-5" aria-hidden="true" />
            اختيار من الجهاز
          </Button>
          <Button size="lg" variant="quiet" onClick={() => onPick(fallbackImage)}>
            استخدام صورة تجريبية
          </Button>
        </div>
      )}
    </section>
  );
}

function AnalysingStep({ onDone }: { onDone: () => void }) {
  const [index, setIndex] = useState(0);

  useEffect(() => {
    if (index >= ANALYSIS_STEPS.length) {
      const t = setTimeout(onDone, 400);
      return () => clearTimeout(t);
    }
    const t = setTimeout(() => setIndex((i) => i + 1), 750);
    return () => clearTimeout(t);
  }, [index, onDone]);

  return (
    <section aria-labelledby="analysing-title" className="mt-8">
      <h2 id="analysing-title" className="text-lg font-bold">
        جاري تجهيز الصورة
      </h2>
      <p className="mt-1 text-sm text-muted-foreground">
        الذكاء الاصطناعي يرصد ما يظهر في الصورة فقط، ولا يمنح شهادة إتاحة.
      </p>

      <ul className="mt-6 space-y-3" aria-live="polite">
        {ANALYSIS_STEPS.map((s, i) => {
          const done = i < index;
          const current = i === index;
          return (
            <li
              key={s.id}
              className={`flex items-center gap-3 rounded-xl border p-4 ${done ? "border-access bg-access-soft" : current ? "border-primary bg-primary-soft" : "border-border"}`}
            >
              <span aria-hidden="true" className="font-bold">
                {done ? "✓" : current ? "◌" : "·"}
              </span>
              <span className="font-semibold">{s.label}</span>
              <span className="sr-only">{done ? "مكتمل" : current ? "جارٍ" : "بالانتظار"}</span>
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
}: {
  observations: IndicatorEvidence[];
  confirmed: Contribution["confirmed"];
  setConfirmed: (c: Contribution["confirmed"]) => void;
  onSubmit: () => void;
}) {
  const [editing, setEditing] = useState<string | null>(null);

  return (
    <section aria-labelledby="results-title" className="mt-8">
      <div id="results-title">
        <SectionTitle hint="راجع ما ظهر في الصورة قبل إرسال المساهمة.">تحليل أولي للمدخل</SectionTitle>
      </div>

      <ul className="space-y-4">
        {observations.map((o) => {
          const entry = confirmed[o.key];
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
                  أؤكد
                </Button>
                <Button
                  size="sm"
                  variant={entry.action === "corrected" ? "primary" : "outline"}
                  onClick={() => setEditing(editing === o.key ? null : o.key)}
                  aria-expanded={editing === o.key}
                >
                  <Pencil className="size-4" aria-hidden="true" />
                  تصحيح
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
                  لا أستطيع التأكد
                </Button>
              </div>

              {editing === o.key ? (
                <fieldset className="door-reveal mt-4 rounded-xl border border-border bg-surface p-4">
                  <legend className="px-1 text-sm font-semibold">
                    ما الذي تراه فعلًا في {INDICATOR_LABEL[o.key]}؟
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
                          onChange={() =>
                            setConfirmed({ ...confirmed, [o.key]: { state: s, action: "corrected" } })
                          }
                          className="size-4 accent-[var(--color-primary)]"
                        />
                        {STATE_LABEL[o.key][s]}
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
        <Button size="lg" block onClick={onSubmit}>
          إرسال للمراجعة
        </Button>
        <p className="mt-2 text-center text-sm text-muted-foreground">
          ستتم مراجعة المساهمة قبل نشرها.
        </p>
      </div>
    </section>
  );
}
