import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { AppShell } from "@/components/mutah/AppShell";
import { EvidenceItem } from "@/components/mutah/Evidence";
import { Button, Card, EmptyState, SectionTitle, Tag } from "@/components/mutah/ui";
import { bi, useLang } from "@/lib/mutah/i18n";
import { INDICATOR_LABEL, ZONE_LABEL, formatDate, stateLabel } from "@/lib/mutah/labels";
import { useMutah } from "@/lib/mutah/store";
import type { ContributionStatus, L } from "@/lib/mutah/types";

export const Route = createFileRoute("/review")({
  head: () => ({
    meta: [
      { title: "مركز المراجعة | مُتاح ماب" },
      {
        name: "description",
        content: "واجهة فريق المراجعة: مراجعة مساهمات الصور واعتمادها أو طلب توضيح قبل النشر.",
      },
      { property: "og:title", content: "مركز المراجعة | مُتاح ماب" },
      { property: "og:description", content: "لا نشر تلقائي: كل مساهمة تمر على مراجع بشري." },
    ],
  }),
  component: ReviewCenter,
});

const STATUS_LABEL: Record<ContributionStatus, L> = {
  pending_review: bi("قيد المراجعة", "Under review"),
  approved: bi("تمت المراجعة", "Approved"),
  rejected: bi("مرفوضة", "Rejected"),
  clarification: bi("بانتظار توضيح", "Awaiting clarification"),
};

function ReviewCenter() {
  const { contributions, approveContribution, rejectContribution, requestClarification } = useMutah();
  const { pick, lang, t } = useLang();
  const [selectedId, setSelectedId] = useState(contributions[0]?.id ?? "");
  const [note, setNote] = useState("");
  const [message, setMessage] = useState("");

  const selected = contributions.find((c) => c.id === selectedId) ?? contributions[0];
  const ar = lang === "ar";

  const act = (kind: "approve" | "clarify" | "reject") => {
    if (!selected) return;
    if (kind !== "approve" && note.trim().length < 4) {
      setMessage(
        ar
          ? "يرجى كتابة سبب واضح قبل طلب التوضيح أو الرفض."
          : "Please write a clear reason before requesting clarification or rejecting.",
      );
      return;
    }
    if (kind === "approve") approveContribution(selected.id, note.trim());
    if (kind === "clarify") requestClarification(selected.id, note.trim());
    if (kind === "reject") rejectContribution(selected.id, note.trim());
    setNote("");
    setMessage(
      kind === "approve"
        ? ar
          ? "تم الاعتماد وتحديث معلومات المكان."
          : "Approved, and the place has been updated."
        : kind === "clarify"
          ? ar
            ? "أُرسل طلب التوضيح إلى المساهم."
            : "A clarification request was sent to the contributor."
          : ar
            ? "تم رفض المساهمة ولم تُنشر."
            : "The contribution was rejected and not published.",
    );
  };

  return (
    <AppShell title={t("navReview")} wide>
      <h1 className="text-2xl font-bold">{t("navReview")}</h1>
      <p className="mt-1 text-muted-foreground">
        {ar
          ? "لا يوجد نشر تلقائي. تُنشر المعلومة بعد مراجعة بشرية فقط."
          : "There is no automatic publishing. Information goes live only after human review."}
      </p>

      {contributions.length === 0 ? (
        <div className="mt-8">
          <EmptyState
            title={ar ? "لا توجد مساهمات" : "No contributions"}
            description={ar ? "ستظهر هنا المساهمات فور إرسالها." : "Contributions appear here as soon as they're submitted."}
          />
        </div>
      ) : (
        <div className="mt-6 grid gap-6 lg:grid-cols-[320px_minmax(0,1fr)]">
          <section aria-labelledby="queue-title">
            <div id="queue-title">
              <SectionTitle>{ar ? "قائمة المراجعة" : "Review queue"}</SectionTitle>
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
                    className={`w-full rounded-xl border-2 p-4 text-start transition-colors ${selected?.id === c.id ? "border-primary bg-primary-soft" : "border-border hover:bg-muted"}`}
                  >
                    <span className="block font-bold">{pick(c.facilityName)}</span>
                    <span className="mt-1 block text-sm text-muted-foreground">
                      {pick(ZONE_LABEL[c.zone])} · {formatDate(c.submittedISO, lang)} ·{" "}
                      {pick(STATUS_LABEL[c.status])}
                    </span>
                  </button>
                </li>
              ))}
            </ul>
          </section>

          {selected ? (
            <section aria-labelledby="detail-title" className="space-y-6">
              <div id="detail-title">
                <SectionTitle hint={`${ar ? "رقم المساهمة" : "Contribution"} ${selected.id}`}>
                  {pick(selected.facilityName)} — {pick(ZONE_LABEL[selected.zone])}
                </SectionTitle>
              </div>

              <div className="grid gap-6 xl:grid-cols-2">
                <div>
                  {selected.imageUrl ? (
                    <img
                      src={selected.imageUrl}
                      alt={`${ar ? "صورة مرسلة لـ" : "Submitted photo for"} ${pick(selected.facilityName)}`}
                      className="aspect-4/3 w-full rounded-2xl object-cover"
                    />
                  ) : (
                    <div className="rounded-2xl border-2 border-dashed border-input p-8 text-center text-sm text-muted-foreground">
                      {t("noPhoto")}
                    </div>
                  )}
                  <div className="mt-3 flex flex-wrap gap-2">
                    <Tag tone={selected.status === "approved" ? "brand" : "neutral"}>
                      {pick(STATUS_LABEL[selected.status])}
                    </Tag>
                    <Tag>{formatDate(selected.submittedISO, lang)}</Tag>
                  </div>
                </div>

                <div>
                  <h3 className="mb-3 font-bold">
                    {ar ? "رصد الذكاء الاصطناعي (أولي)" : "AI observation (preliminary)"}
                  </h3>
                  <ul className="space-y-3">
                    {selected.aiObservations.map((o) => (
                      <EvidenceItem key={o.key} evidence={o} compact />
                    ))}
                  </ul>
                </div>
              </div>

              <Card>
                <h3 className="font-bold">{ar ? "تأكيدات المساهم" : "Contributor confirmations"}</h3>
                <table className="mt-3 w-full text-start text-sm">
                  <caption className="sr-only">
                    {ar
                      ? "مقارنة بين رصد الذكاء الاصطناعي وتأكيد المساهم"
                      : "AI observation compared with the contributor's confirmation"}
                  </caption>
                  <thead>
                    <tr className="border-b border-border text-muted-foreground">
                      <th scope="col" className="py-2 text-start font-semibold">
                        {ar ? "العنصر" : "Item"}
                      </th>
                      <th scope="col" className="py-2 text-start font-semibold">
                        {ar ? "الحالة بعد المراجعة" : "State after review"}
                      </th>
                      <th scope="col" className="py-2 text-start font-semibold">
                        {ar ? "الإجراء" : "Action"}
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {selected.aiObservations.map((o) => {
                      const entry = selected.confirmed[o.key];
                      return (
                        <tr key={o.key} className="border-b border-border/60">
                          <td className="py-2">{pick(INDICATOR_LABEL[o.key])}</td>
                          <td className="py-2">{pick(stateLabel(o.key, entry?.state ?? o.state))}</td>
                          <td className="py-2">
                            {entry?.action === "confirmed"
                              ? ar
                                ? "أكّد"
                                : "Confirmed"
                              : entry?.action === "corrected"
                                ? ar
                                  ? "صحّح"
                                  : "Corrected"
                                : ar
                                  ? "لم يستطع التأكد"
                                  : "Unsure"}
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </Card>

              <Card>
                <label htmlFor="reviewer-note" className="block font-bold">
                  {ar ? "سبب القرار" : "Reason for the decision"}
                </label>
                <p className="mt-1 text-sm text-muted-foreground">
                  {ar
                    ? "مطلوب عند طلب التوضيح أو الرفض، واختياري عند الاعتماد."
                    : "Required when requesting clarification or rejecting; optional when approving."}
                </p>
                <textarea
                  id="reviewer-note"
                  value={note}
                  onChange={(e) => setNote(e.target.value)}
                  rows={3}
                  className="mt-3 w-full rounded-xl border-2 border-input bg-background p-3 text-base"
                />
                <div className="mt-4 flex flex-wrap gap-3">
                  <Button onClick={() => act("approve")}>{ar ? "اعتماد" : "Approve"}</Button>
                  <Button variant="outline" onClick={() => act("clarify")}>
                    {ar ? "طلب توضيح" : "Request clarification"}
                  </Button>
                  <Button variant="danger" onClick={() => act("reject")}>
                    {ar ? "رفض" : "Reject"}
                  </Button>
                </div>
                <p aria-live="polite" className="mt-3 text-sm font-semibold">
                  {message}
                </p>
              </Card>

              {selected.reviewerNote ? (
                <Card className="bg-surface">
                  <h3 className="font-bold">{ar ? "سجل التحقق" : "Verification log"}</h3>
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
