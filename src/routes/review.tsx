import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { AppShell } from "@/components/mutah/AppShell";
import { EvidenceItem } from "@/components/mutah/Evidence";
import { Button, Card, EmptyState, SectionTitle, Tag } from "@/components/mutah/ui";
import { INDICATOR_LABEL, STATE_LABEL, formatArabicDate } from "@/lib/mutah/labels";
import { useMutah } from "@/lib/mutah/store";
import type { ContributionStatus } from "@/lib/mutah/types";

export const Route = createFileRoute("/review")({
  head: () => ({
    meta: [
      { title: "مركز المراجعة | مُتاح ماب" },
      {
        name: "description",
        content: "واجهة فريق المراجعة: مراجعة مساهمات صور المداخل واعتمادها أو طلب توضيح قبل النشر.",
      },
      { property: "og:title", content: "مركز المراجعة | مُتاح ماب" },
      { property: "og:description", content: "لا نشر تلقائي: كل مساهمة تمر على مراجع بشري." },
    ],
  }),
  component: ReviewCenter;
});

const STATUS_LABEL: Record<ContributionStatus, string> = {
  pending_review: "قيد المراجعة",
  approved: "تمت المراجعة",
  rejected: "مرفوضة",
  clarification: "بانتظار توضيح",
};

function ReviewCenter() {
  const { contributions, approveContribution, rejectContribution, requestClarification } = useMutah();
  const [selectedId, setSelectedId] = useState(contributions[0]?.id ?? "");
  const [note, setNote] = useState("");
  const [message, setMessage] = useState("");

  const selected = contributions.find((c) => c.id === selectedId) ?? contributions[0];

  const act = (kind: "approve" | "clarify" | "reject") => {
    if (!selected) return;
    if (kind !== "approve" && note.trim().length < 4) {
      setMessage("يرجى كتابة سبب واضح قبل طلب التوضيح أو الرفض.");
      return;
    }
    if (kind === "approve") approveContribution(selected.id, note.trim());
    if (kind === "clarify") requestClarification(selected.id, note.trim());
    if (kind === "reject") rejectContribution(selected.id, note.trim());
    setNote("");
    setMessage(
      kind === "approve"
        ? "تم الاعتماد وتحديث معلومات المرفق."
        : kind === "clarify"
          ? "أُرسل طلب التوضيح إلى المساهم."
          : "تم رفض المساهمة ولم تُنشر.",
    );
  };

  return (
    <AppShell title="مركز المراجعة" wide>
      <h1 className="text-2xl font-bold">مركز المراجعة</h1>
      <p className="mt-1 text-muted-foreground">
        لا يوجد نشر تلقائي. تُنشر المعلومة بعد مراجعة بشرية فقط.
      </p>

      {contributions.length === 0 ? (
        <div className="mt-8">
          <EmptyState title="لا توجد مساهمات" description="ستظهر هنا المساهمات فور إرسالها." />
        </div>
      ) : (
        <div className="mt-6 grid gap-6 lg:grid-cols-[320px_minmax(0,1fr)]">
          <section aria-labelledby="queue-title">
            <div id="queue-title">
              <SectionTitle>قائمة المراجعة</SectionTitle>
            </div>
            <ul className="space-y-2">
              {contributions.map((c) => (
                <li key={c.id}>
                  <button
                    type="button"
                    onClick={() => {
                      setSelectedId(c.id);
                      setMessage("");
                    }}
                    aria-current={selected?.id === c.id ? "true" : undefined}
                    className={`w-full rounded-xl border-2 p-4 text-right ${selected?.id === c.id ? "border-primary bg-primary-soft" : "border-border hover:bg-muted"}`}
                  >
                    <span className="block font-bold">{c.facilityName}</span>
                    <span className="mt-1 block text-sm text-muted-foreground">
                      {formatArabicDate(c.submittedISO)} · {STATUS_LABEL[c.status]}
                    </span>
                  </button>
                </li>
              ))}
            </ul>
          </section>

          {selected ? (
            <section aria-labelledby="detail-title" className="space-y-6">
              <div id="detail-title">
                <SectionTitle hint={`رقم المساهمة ${selected.id}`}>{selected.facilityName}</SectionTitle>
              </div>

              <div className="grid gap-6 xl:grid-cols-2">
                <div>
                  {selected.imageUrl ? (
                    <img
                      src={selected.imageUrl}
                      alt={`صورة المدخل المرسلة لمرفق ${selected.facilityName}`}
                      className="aspect-4/3 w-full rounded-2xl object-cover"
                    />
                  ) : (
                    <div className="rounded-2xl border-2 border-dashed border-input p-8 text-center text-sm text-muted-foreground">
                      لا توجد صورة مرفقة
                    </div>
                  )}
                  <div className="mt-3 flex flex-wrap gap-2">
                    <Tag tone={selected.status === "approved" ? "brand" : "neutral"}>
                      {STATUS_LABEL[selected.status]}
                    </Tag>
                    <Tag>أُرسلت في {formatArabicDate(selected.submittedISO)}</Tag>
                  </div>
                </div>

                <div>
                  <h3 className="mb-3 font-bold">رصد الذكاء الاصطناعي (أولي)</h3>
                  <ul className="space-y-3">
                    {selected.aiObservations.map((o) => (
                      <EvidenceItem key={o.key} evidence={o} compact />
                    ))}
                  </ul>
                </div>
              </div>

              <Card>
                <h3 className="font-bold">تأكيدات المساهم</h3>
                <table className="mt-3 w-full text-right text-sm">
                  <caption className="sr-only">مقارنة بين رصد الذكاء الاصطناعي وتأكيد المساهم</caption>
                  <thead>
                    <tr className="border-b border-border text-muted-foreground">
                      <th scope="col" className="py-2 font-semibold">العنصر</th>
                      <th scope="col" className="py-2 font-semibold">الحالة بعد المراجعة</th>
                      <th scope="col" className="py-2 font-semibold">الإجراء</th>
                    </tr>
                  </thead>
                  <tbody>
                    {selected.aiObservations.map((o) => {
                      const entry = selected.confirmed[o.key];
                      return (
                        <tr key={o.key} className="border-b border-border/60">
                          <td className="py-2">{INDICATOR_LABEL[o.key]}</td>
                          <td className="py-2">{STATE_LABEL[o.key][entry?.state ?? o.state]}</td>
                          <td className="py-2">
                            {entry?.action === "confirmed"
                              ? "أكّد"
                              : entry?.action === "corrected"
                                ? "صحّح"
                                : "لم يستطع التأكد"}
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </Card>

              <Card>
                <label htmlFor="reviewer-note" className="block font-bold">
                  سبب القرار
                </label>
                <p className="mt-1 text-sm text-muted-foreground">
                  مطلوب عند طلب التوضيح أو الرفض، واختياري عند الاعتماد.
                </p>
                <textarea
                  id="reviewer-note"
                  value={note}
                  onChange={(e) => setNote(e.target.value)}
                  rows={3}
                  className="mt-3 w-full rounded-xl border-2 border-input bg-background p-3 text-base"
                />
                <div className="mt-4 flex flex-wrap gap-3">
                  <Button onClick={() => act("approve")}>اعتماد</Button>
                  <Button variant="outline" onClick={() => act("clarify")}>
                    طلب توضيح
                  </Button>
                  <Button variant="danger" onClick={() => act("reject")}>
                    رفض
                  </Button>
                </div>
                <p aria-live="polite" className="mt-3 text-sm font-semibold">
                  {message}
                </p>
              </Card>

              {selected.reviewerNote ? (
                <Card className="bg-surface">
                  <h3 className="font-bold">سجل التحقق</h3>
                  <p className="mt-2 text-sm text-muted-foreground">{selected.reviewerNote}</p>
                </Card>
              ) : null}
            </section>
          ) : null}
        </div>
      )}
    </AppShell>
  );
}
