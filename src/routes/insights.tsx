import { createFileRoute } from "@tanstack/react-router";
import { AppShell } from "@/components/mutah/AppShell";
import { Card, SectionTitle, Tag } from "@/components/mutah/ui";
import { INDICATOR_LABEL, INDICATOR_ORDER } from "@/lib/mutah/labels";
import { useMutah } from "@/lib/mutah/store";
import type { IndicatorKey } from "@/lib/mutah/types";

export const Route = createFileRoute("/insights")({
  head: () => ({
    meta: [
      { title: "مُتاح إنسايتس | مُتاح ماب" },
      {
        name: "description",
        content: "عرض بيانات وأثر للمرحلة التجريبية: تغطية المرافق، صور المداخل، اكتمال البيانات، وأكثر الحواجز المرصودة.",
      },
      { property: "og:title", content: "مُتاح إنسايتس | مُتاح ماب" },
      { property: "og:description", content: "بيانات تجريبية فقط، بلا أرقام وطنية وبلا ترتيب للمدن." },
    ],
  }),
  component: Insights,
});

function Insights() {
  const { facilities, contributions } = useMutah();

  const withImages = facilities.filter((f) => f.imageUrl).length;
  const reviewed = contributions.filter((c) => c.status === "approved").length;
  const totalKnown = facilities.reduce(
    (sum, f) =>
      sum +
      INDICATOR_ORDER.filter((k) => {
        const s = f.indicators[k].state;
        return s === "present" || s === "absent" || s === "not_applicable";
      }).length,
    0,
  );
  const completeness = Math.round((totalKnown / (facilities.length * 5)) * 100);
  const needsUpdate = facilities.filter((f) => f.verification === "stale").length;

  const barriers = INDICATOR_ORDER.map((k) => ({
    key: k,
    count: facilities.filter((f) =>
      k === "steps" || k === "obstruction"
        ? f.indicators[k].state === "present"
        : f.indicators[k].state === "absent",
    ).length,
  })).sort((a, b) => b.count - a.count);

  const maxBarrier = Math.max(1, ...barriers.map((b) => b.count));

  return (
    <AppShell title="مُتاح إنسايتس" wide>
      <div className="flex flex-wrap items-center gap-3">
        <h1 className="text-2xl font-bold">مُتاح إنسايتس</h1>
        <Tag tone="warn">بيانات تجريبية</Tag>
      </div>
      <p className="mt-1 text-muted-foreground">
        عرض للبيانات والأثر ضمن نطاق المرحلة التجريبية فقط.
      </p>

      <div className="mt-6 grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
        <Metric label="عدد المرافق المغطاة" value={facilities.length} />
        <Metric label="عدد صور المداخل" value={withImages} />
        <Metric label="عدد المساهمات المراجعة" value={reviewed} />
        <Metric label="نسبة اكتمال البيانات" value={`${completeness}%`} />
        <Metric label="المعلومات التي تحتاج تحديثًا" value={needsUpdate} />
        <Metric label="مساهمات قيد المراجعة" value={contributions.filter((c) => c.status === "pending_review").length} />
      </div>

      <section aria-labelledby="barriers-title" className="mt-10">
        <div id="barriers-title">
          <SectionTitle hint="عدد المرافق التي رُصد فيها كل حاجز ضمن العينة التجريبية.">
            أكثر الحواجز المرصودة
          </SectionTitle>
        </div>

        <Card>
          <ul className="space-y-4" aria-hidden="true">
            {barriers.map((b) => (
              <li key={b.key}>
                <div className="flex justify-between text-sm font-semibold">
                  <span>{barrierLabel(b.key)}</span>
                  <span>{b.count}</span>
                </div>
                <div className="mt-1 h-3 rounded-full bg-muted">
                  <div
                    className="h-full rounded-full bg-primary"
                    style={{ width: `${(b.count / maxBarrier) * 100}%` }}
                  />
                </div>
              </li>
            ))}
          </ul>

          <table className="mt-6 w-full text-right text-sm">
            <caption className="mb-2 text-right font-semibold">
              جدول بديل لأكثر الحواجز المرصودة
            </caption>
            <thead>
              <tr className="border-b border-border text-muted-foreground">
                <th scope="col" className="py-2">الحاجز</th>
                <th scope="col" className="py-2">عدد المرافق</th>
              </tr>
            </thead>
            <tbody>
              {barriers.map((b) => (
                <tr key={b.key} className="border-b border-border/60">
                  <td className="py-2">{barrierLabel(b.key)}</td>
                  <td className="py-2">{b.count}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </Card>
      </section>
    </AppShell>
  );
}

function barrierLabel(k: IndicatorKey): string {
  if (k === "steps") return "درجات أو عتبة مرتفعة عند المدخل";
  if (k === "obstruction") return "عائق في مسار الوصول";
  return `غياب: ${INDICATOR_LABEL[k]}`;
}

function Metric({ label, value }: { label: string; value: string | number }) {
  return (
    <Card>
      <p className="text-sm text-muted-foreground">{label}</p>
      <p className="mt-2 text-3xl font-bold">{value}</p>
    </Card>
  );
}
