import { useCallback, useEffect, useState } from "react";
import { useLang } from "@/lib/mutah/i18n";
import {
  listDisplayImageProposals,
  respondToDisplayImageClarification,
  type DisplayImageProposal,
} from "@/lib/mutah/operational";
import { Button, Card, SectionTitle } from "./ui";

export function MyDisplayImageProposals() {
  const { lang } = useLang();
  const ar = lang === "ar";
  const [items, setItems] = useState<DisplayImageProposal[]>([]);
  const [context, setContext] = useState("");
  const [message, setMessage] = useState("");
  const load = useCallback(() => {
    void listDisplayImageProposals()
      .then(setItems)
      .catch(() => setItems([]));
  }, []);
  useEffect(load, [load]);
  if (!items.length) return null;
  return (
    <section>
      <SectionTitle>{ar ? "مقترحات صور المرافق" : "Facility photo proposals"}</SectionTitle>
      <ul className="mt-3 space-y-3">
        {items.map((item) => (
          <li key={item.id}>
            <Card>
              <h3 className="font-bold">
                {ar ? item.facility?.name_ar : item.facility?.name_en || item.facility?.name_ar}
              </h3>
              <p className="mt-1 text-sm text-muted-foreground">
                {item.status === "clarification_requested"
                  ? ar
                    ? "يحتاج توضيحًا"
                    : "Needs clarification"
                  : item.status === "recommended"
                    ? ar
                      ? "موصى به للمدير"
                      : "Recommended to admin"
                    : ar
                      ? "قيد المراجعة"
                      : "Under review"}
              </p>
              {item.review_reason ? <p className="mt-2 text-sm">{item.review_reason}</p> : null}
              {item.status === "clarification_requested" ? (
                <>
                  <textarea
                    rows={2}
                    className="mt-3 w-full rounded-xl border-2 border-input p-3 text-sm"
                    value={context}
                    onChange={(event) => setContext(event.target.value)}
                    placeholder={ar ? "أضف التوضيح المطلوب" : "Add the requested clarification"}
                  />
                  <Button
                    className="mt-2"
                    disabled={context.trim().length < 2}
                    onClick={() => {
                      void respondToDisplayImageClarification(item.id, context)
                        .then(() => {
                          setContext("");
                          setMessage(ar ? "أُعيد للمراجعة." : "Returned to review.");
                          load();
                        })
                        .catch(() =>
                          setMessage(
                            ar ? "تعذر إرسال التوضيح." : "Clarification could not be sent.",
                          ),
                        );
                    }}
                  >
                    {ar ? "إرسال التوضيح" : "Send clarification"}
                  </Button>
                </>
              ) : null}
            </Card>
          </li>
        ))}
      </ul>
      {message ? (
        <p role="status" className="mt-2 text-sm">
          {message}
        </p>
      ) : null}
    </section>
  );
}
