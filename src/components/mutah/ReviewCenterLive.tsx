import { useCallback, useEffect, useMemo, useState } from "react";
import { CheckCircle2, CircleAlert, LoaderCircle, RefreshCw } from "lucide-react";
import { Button, Card, EmptyState, SectionTitle, Tag } from "@/components/mutah/ui";
import { useLang } from "@/lib/mutah/i18n";
import { listReviewContributions, reviewContribution, type ReviewContribution } from "@/lib/mutah/operational";

const STATE_AR: Record<string, string> = {
  present: "ظاهر / موجود",
  absent: "غير ظاهر في الجزء الموثق",
  unknown: "غير مؤكد",
  not_visible: "غير ظاهر في الصور",
  not_applicable: "غير منطبق",
  not_documented: "غير موثق بعد",
  conflicting: "أدلة متعارضة",
};
const STATE_EN: Record<string, string> = {
  present: "Present",
  absent: "Not shown in documented area",
  unknown: "Unknown",
  not_visible: "Not visible in images",
  not_applicable: "Not applicable",
  not_documented: "Not documented yet",
  conflicting: "Conflicting evidence",
};
const ACTION_AR: Record<string, string> = { confirmed: "أكّد", corrected: "صحّح", unsure: "غير متأكد" };
const ACTION_EN: Record<string, string> = { confirmed: "Confirmed", corrected: "Corrected", unsure: "Unsure" };

function dateLabel(value: string | null, locale: "ar" | "en") {
  if (!value) return locale === "ar" ? "غير محدد" : "Not set";
  return new Intl.DateTimeFormat(locale === "ar" ? "ar-SA" : "en-GB", { dateStyle: "medium", timeStyle: "short" }).format(new Date(value));
}

export function ReviewCenterLive() {
  const { lang } = useLang();
  const ar = lang === "ar";
  const [rows, setRows] = useState<ReviewContribution[]>([]);
  const [selectedId, setSelectedId] = useState("");
  const [note, setNote] = useState("");
  const [loading, setLoading] = useState(true);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");

  const load = useCallback(async () => {
    setLoading(true);
    setError("");
    try {
      const next = await listReviewContributions();
      setRows(next);
      setSelectedId((current) => (current && next.some((item) => item.id === current) ? current : next[0]?.id ?? ""));
    } catch (cause) {
      console.error("Could not load MUTAH review queue", cause);
      setError(ar ? "تعذر تحميل قائمة المراجعة. حاول مرة أخرى." : "Could not load the review queue. Try again.");
    } finally {
      setLoading(false);
    }
  }, [ar]);

  useEffect(() => {
    void load();
  }, [load]);

  const selected = useMemo(() => rows.find((item) => item.id === selectedId) ?? rows[0], [rows, selectedId]);
  const observations = selected?.analyses?.flatMap((analysis) => analysis.observations ?? []) ?? [];

  const decide = async (decision: "approved" | "rejected" | "clarification") => {
    if (!selected || busy) return;
    if (decision !== "approved" && note.trim().length < 4) {
      setMessage(ar ? "اكتب سببًا واضحًا قبل طلب التوضيح أو الرفض." : "Write a clear reason before requesting clarification or rejecting.");
      return;
    }
    setBusy(true);
    setMessage("");
    try {
      await reviewContribution({ contributionId: selected.id, decision, note });
      setNote("");
      setMessage(
        decision === "approved"
          ? ar
            ? "تم اعتماد المساهمة وتسجيل قرار المراجع."
            : "Contribution approved and the reviewer decision was recorded."
          : decision === "clarification"
            ? ar
              ? "تم إرسال المساهمة إلى حالة «يحتاج توضيحًا»."
              : "The contribution now requires clarification."
            : ar
              ? "تم رفض المساهمة ولم تُنشر."
              : "The contribution was rejected and was not published.",
      );
      await load();
    } catch (cause) {
      console.error("MUTAH review decision failed", cause);
      setMessage(ar ? "لم يُحفظ القرار. لم يتم تغيير المساهمة؛ حاول مرة أخرى." : "The decision was not saved. Nothing changed; try again.");
    } finally {
      setBusy(false);
    }
  };

  if (loading) {
    return (
      <Card className="mt-6 flex items-center gap-3">
        <LoaderCircle className="size-5 animate-spin text-primary" aria-hidden="true" />
        <p className="font-semibold">{ar ? "جاري تحميل قائمة المراجعة…" : "Loading review queue…"}</p>
      </Card>
    );
  }

  if (error) {
    return (
      <Card className="mt-6">
        <div className="flex items-start gap-3">
          <CircleAlert className="mt-0.5 size-5 text-destructive" aria-hidden="true" />
          <div>
            <p className="font-semibold">{error}</p>
            <Button size="sm" variant="outline" className="mt-3" onClick={() => void load()}>
              <RefreshCw className="size-4" aria-hidden="true" />
              {ar ? "إعادة المحاولة" : "Retry"}
            </Button>
          </div>
        </div>
      </Card>
    );
  }

  if (rows.length === 0) {
    return (
      <div className="mt-8">
        <EmptyState
          title={ar ? "لا توجد مساهمات بانتظار المراجعة" : "No contributions awaiting review"}
          description={ar ? "ستظهر هنا المساهمات الحقيقية بعد إرسالها من حسابات المساهمين." : "Real contributions will appear here after contributors submit them."}
          action={
            <Button size="sm" variant="outline" onClick={() => void load()}>
              <RefreshCw className="size-4" aria-hidden="true" />
              {ar ? "تحديث" : "Refresh"}
            </Button>
          }
        />
      </div>
    );
  }

  return (
    <div className="mt-6 grid gap-6 lg:grid-cols-[320px_minmax(0,1fr)]">
      <section aria-labelledby="live-review-queue-title">
        <div className="flex items-center justify-between gap-2">
          <div id="live-review-queue-title"><SectionTitle>{ar ? "قائمة المراجعة" : "Review queue"}</SectionTitle></div>
          <Button size="sm" variant="quiet" onClick={() => void load()} aria-label={ar ? "تحديث قائمة المراجعة" : "Refresh review queue"}>
            <RefreshCw className="size-4" aria-hidden="true" />
          </Button>
        </div>
        <ul className="space-y-2">
          {rows.map((item) => (
            <li key={item.id}>
              <button
                type="button"
                onClick={() => { setSelectedId(item.id); setNote(""); setMessage(""); }}
                aria-current={selected?.id === item.id ? "true" : undefined}
                className={`w-full rounded-xl border-2 p-4 text-start transition-colors ${selected?.id === item.id ? "border-primary bg-primary-soft" : "border-border bg-card hover:bg-muted"}`}
              >
                <span className="block font-bold">{ar ? item.facility?.name_ar : item.facility?.name_en || item.facility?.name_ar}</span>
                <span className="mt-1 block text-sm text-muted-foreground">{ar ? item.zone?.label_ar : item.zone?.label_en || item.zone?.zone_type}</span>
                <span className="mt-1 block text-xs text-muted-foreground">{dateLabel(item.submitted_at ?? item.created_at, lang)}</span>
                <span className="mt-2 inline-flex rounded-full bg-muted px-2 py-1 text-xs font-semibold">{item.images.length} {ar ? "صورة" : item.images.length === 1 ? "image" : "images"}</span>
              </button>
            </li>
          ))}
        </ul>
      </section>

      {selected ? (
        <section className="space-y-6" aria-labelledby="live-review-detail-title">
          <div id="live-review-detail-title">
            <SectionTitle hint={`${ar ? "رقم المساهمة" : "Contribution"} ${selected.id}`}>
              {ar ? selected.facility?.name_ar : selected.facility?.name_en || selected.facility?.name_ar}
            </SectionTitle>
          </div>

          <Card>
            <div className="flex flex-wrap items-center justify-between gap-3">
              <div>
                <h3 className="font-bold">{ar ? "حزمة الأدلة الخاصة" : "Private evidence bundle"}</h3>
                <p className="mt-1 text-sm text-muted-foreground">{ar ? "روابط الصور مؤقتة ومخصصة للمراجعين فقط." : "Image links are temporary and reviewer-only."}</p>
              </div>
              <Tag>{ar ? selected.zone?.label_ar : selected.zone?.label_en || selected.zone?.zone_type}</Tag>
            </div>
            <ul className="mt-4 grid gap-3 sm:grid-cols-2 xl:grid-cols-3">
              {selected.images.map((image, index) => (
                <li key={image.id}>
                  {image.signed_url ? (
                    <img src={image.signed_url} alt={`${ar ? "دليل مرئي" : "Visual evidence"} ${index + 1}`} className="aspect-4/3 w-full rounded-2xl object-cover" />
                  ) : (
                    <div className="flex aspect-4/3 items-center justify-center rounded-2xl border border-dashed border-input text-sm text-muted-foreground">{ar ? "تعذر إنشاء رابط الصورة" : "Image link unavailable"}</div>
                  )}
                </li>
              ))}
            </ul>
          </Card>

          <div>
            <h3 className="mb-3 font-bold">{ar ? "رصد Gemini وتأكيد المساهم" : "Gemini observations and contributor confirmation"}</h3>
            <p className="mb-3 text-sm text-muted-foreground">{ar ? "الملاحظات أدلة أولية فقط؛ قرارك البشري هو بوابة النشر." : "Observations are preliminary evidence; your human decision is the publication gate."}</p>
            <ul className="grid gap-3 md:grid-cols-2">
              {observations.map((observation) => {
                const confirmation = observation.confirmations?.[0];
                return (
                  <li key={observation.id} className="rounded-2xl border border-border bg-card p-4">
                    <div className="flex items-start justify-between gap-3">
                      <h4 className="font-bold">{observation.indicator_code}</h4>
                      <Tag tone={confirmation?.action === "corrected" ? "brand" : "neutral"}>{confirmation ? (ar ? ACTION_AR[confirmation.action] : ACTION_EN[confirmation.action]) : ar ? "بدون تأكيد" : "No confirmation"}</Tag>
                    </div>
                    <p className="mt-2 text-sm font-semibold">{ar ? STATE_AR[observation.ai_state] ?? observation.ai_state : STATE_EN[observation.ai_state] ?? observation.ai_state}</p>
                    <p className="mt-1 text-sm text-muted-foreground">{ar ? observation.explanation_ar : observation.explanation_en || observation.explanation_ar}</p>
                    {confirmation ? (
                      <div className="mt-3 border-t border-border pt-3 text-sm">
                        <span className="font-semibold">{ar ? "بعد مراجعة المساهم: " : "After contributor review: "}</span>
                        {ar ? STATE_AR[confirmation.confirmed_state] ?? confirmation.confirmed_state : STATE_EN[confirmation.confirmed_state] ?? confirmation.confirmed_state}
                      </div>
                    ) : null}
                  </li>
                );
              })}
            </ul>
          </div>

          <Card>
            <label htmlFor="live-review-note" className="block font-bold">{ar ? "سبب القرار" : "Reason for the decision"}</label>
            <p className="mt-1 text-sm text-muted-foreground">{ar ? "مطلوب للتوضيح أو الرفض، واختياري عند الاعتماد. إذا لم تكفِ الصور، اطلب توضيحًا بدل التخمين." : "Required for clarification or rejection, optional for approval. If evidence is insufficient, request clarification rather than guessing."}</p>
            <textarea id="live-review-note" value={note} onChange={(event) => setNote(event.target.value)} rows={3} className="mt-3 w-full rounded-xl border-2 border-input bg-background p-3 text-base" />
            <div className="mt-4 flex flex-wrap gap-3">
              <Button disabled={busy} onClick={() => void decide("approved")}>
                {busy ? <LoaderCircle className="size-4 animate-spin" aria-hidden="true" /> : <CheckCircle2 className="size-4" aria-hidden="true" />}
                {ar ? "اعتماد" : "Approve"}
              </Button>
              <Button disabled={busy} variant="outline" onClick={() => void decide("clarification")}>{ar ? "طلب توضيح" : "Request clarification"}</Button>
              <Button disabled={busy} variant="danger" onClick={() => void decide("rejected")}>{ar ? "رفض" : "Reject"}</Button>
            </div>
            <p aria-live="polite" className="mt-3 text-sm font-semibold">{message}</p>
          </Card>
        </section>
      ) : null}
    </div>
  );
}
