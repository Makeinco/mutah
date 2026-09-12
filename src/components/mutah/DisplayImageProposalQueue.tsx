import { LoaderCircle } from "lucide-react";
import { useCallback, useEffect, useState } from "react";
import { useAuth } from "@/lib/mutah/auth";
import { useLang } from "@/lib/mutah/i18n";
import {
  listDisplayImageProposals,
  publishDisplayImageProposal,
  reviewDisplayImageProposal,
  type DisplayImageProposal,
} from "@/lib/mutah/operational";
import { Button, Card, EmptyState, SectionTitle } from "./ui";

export function DisplayImageProposalQueue() {
  const { profile } = useAuth();
  const { lang } = useLang();
  const ar = lang === "ar";
  const [items, setItems] = useState<DisplayImageProposal[]>([]);
  const [busy, setBusy] = useState(false);
  const [reason, setReason] = useState("");
  const [message, setMessage] = useState("");
  const load = useCallback(async () => {
    setBusy(true);
    try {
      setItems(await listDisplayImageProposals(true));
    } catch {
      setMessage(ar ? "تعذر تحميل مقترحات الصور." : "Photo proposals could not be loaded.");
    } finally {
      setBusy(false);
    }
  }, [ar]);
  useEffect(() => {
    void load();
  }, [load]);
  const review = async (
    item: DisplayImageProposal,
    action: "clarification" | "recommend" | "reject",
  ) => {
    setBusy(true);
    try {
      await reviewDisplayImageProposal(item.id, action, reason);
      setReason("");
      await load();
    } catch {
      setMessage(ar ? "لم يُحفظ القرار." : "Decision was not saved.");
      setBusy(false);
    }
  };
  const publish = async (item: DisplayImageProposal) => {
    setBusy(true);
    try {
      await publishDisplayImageProposal(item, reason);
      setReason("");
      await load();
    } catch {
      setMessage(ar ? "لم تُنشر الصورة الرسمية." : "Official photo was not published.");
      setBusy(false);
    }
  };
  return (
    <section className="mt-10" aria-labelledby="display-image-queue-title">
      <div id="display-image-queue-title">
        <SectionTitle>{ar ? "مقترحات صور المرافق" : "Facility photo proposals"}</SectionTitle>
      </div>
      <p className="text-sm text-muted-foreground">
        {ar
          ? "المراجع يوصي فقط؛ المدير وحده ينشر الصورة العامة."
          : "Reviewers recommend only; an admin alone publishes public media."}
      </p>
      {message ? (
        <p role="status" className="mt-3 text-sm">
          {message}
        </p>
      ) : null}
      {busy && !items.length ? (
        <LoaderCircle className="mt-4 size-5 animate-spin" />
      ) : items.length ? (
        <ul className="mt-4 grid gap-4 md:grid-cols-2">
          {items.map((item) => (
            <li key={item.id}>
              <Card>
                <h3 className="font-bold">
                  {ar ? item.facility?.name_ar : item.facility?.name_en || item.facility?.name_ar}
                </h3>
                <p className="text-xs text-muted-foreground">{item.status}</p>
                {item.signed_url ? (
                  <img
                    src={item.signed_url}
                    alt={ar ? "صورة مقترحة خاصة للمراجعة" : "Private proposed photo for review"}
                    className="mt-3 aspect-video w-full rounded-xl object-cover"
                  />
                ) : null}
                {item.context_note ? <p className="mt-2 text-sm">{item.context_note}</p> : null}
                <input
                  className="mt-3 min-h-11 w-full rounded-xl border-2 border-input px-3 text-sm"
                  value={reason}
                  onChange={(event) => setReason(event.target.value)}
                  placeholder={ar ? "سبب أو ملاحظة" : "Reason or note"}
                />
                {item.status === "pending_review" ? (
                  <div className="mt-3 flex flex-wrap gap-2">
                    <Button size="sm" onClick={() => void review(item, "recommend")}>
                      {ar ? "التوصية" : "Recommend"}
                    </Button>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => void review(item, "clarification")}
                    >
                      {ar ? "طلب توضيح" : "Request clarification"}
                    </Button>
                    <Button size="sm" variant="quiet" onClick={() => void review(item, "reject")}>
                      {ar ? "رفض" : "Reject"}
                    </Button>
                  </div>
                ) : null}
                {item.status === "recommended" && profile?.role === "admin" ? (
                  <Button className="mt-3" onClick={() => void publish(item)}>
                    {ar ? "اعتماد ونشر" : "Approve and publish"}
                  </Button>
                ) : null}
              </Card>
            </li>
          ))}
        </ul>
      ) : (
        <div className="mt-4">
          <EmptyState
            title={ar ? "لا مقترحات صور معلقة" : "No pending photo proposals"}
            description={
              ar
                ? "ستظهر المقترحات الخاصة هنا للمراجعة."
                : "Private proposals will appear here for review."
            }
          />
        </div>
      )}
    </section>
  );
}
