import { createFileRoute, Link } from "@tanstack/react-router";
import { AppShell } from "@/components/mutah/AppShell";
import { MutahLogo } from "@/components/mutah/Logo";
import { Card, SectionTitle } from "@/components/mutah/ui";
import { useLang } from "@/lib/mutah/i18n";
import { INDICATOR_LABEL, ZONE_INDICATORS, ZONE_LABEL, ZONE_ORDER } from "@/lib/mutah/labels";

export const Route = createFileRoute("/about")({
  head: () => ({
    meta: [
      { title: "عن مُتاح | مُتاح ماب" },
      {
        name: "description",
        content:
          "مُتاح ماب منصة قرار عن الوصول: الذكاء الاصطناعي يرصد، والبشر يتحققون، والمعلومة غير المؤكدة تبقى ظاهرة.",
      },
      { property: "og:title", content: "عن مُتاح | مُتاح ماب" },
      { property: "og:description", content: "الأدلة → الفهم → القرار." },
    ],
  }),
  component: About,
});

function About() {
  const { t, pick, lang } = useLang();
  const ar = lang === "ar";

  return (
    <AppShell title={t("navAbout")}>
      <div className="mx-auto max-w-2xl">
        <MutahLogo className="h-14" />
        <h1 className="mt-8 text-2xl font-bold">{t("tagline")}</h1>
        <p className="mt-3 text-muted-foreground">
          {ar
            ? "مُتاح ماب يساعدك على فهم ما ينتظرك في المكان قبل الزيارة، اعتمادًا على أدلة مرئية واضحة: ماذا نعرف؟ وما الذي لا نعرفه؟ ولماذا؟"
            : "MUTAH MAP helps you understand what awaits you at a place before you visit, using clear visual evidence: what we know, what we don't, and why."}
        </p>

        <div className="mt-10">
          <SectionTitle>
            {ar ? "الذكاء الاصطناعي يرصد، والبشر يتحققون" : "AI observes, humans verify"}
          </SectionTitle>
          <Card className="bg-surface">
            <ol className="list-inside list-decimal space-y-1 text-sm text-muted-foreground">
              {(ar
                ? ["صورة للمسار", "فحص جودة الصورة", "حماية الخصوصية", "تحليل أولي", "تأكيد المساهم", "مراجعة بشرية", "النشر"]
                : [
                    "A photo of the view",
                    "Photo quality check",
                    "Privacy protection",
                    "Preliminary analysis",
                    "Contributor confirmation",
                    "Human review",
                    "Publication",
                  ]
              ).map((s) => (
                <li key={s}>{s}</li>
              ))}
            </ol>
          </Card>
          <p className="mt-3 text-sm text-muted-foreground">
            {ar
              ? "لا يمنح مُتاح شهادة إتاحة لأي مبنى، ولا يعرض درجة أو نسبة عامة. الأدلة أهم من الدرجة."
              : "MUTAH never certifies a building and never shows an overall score. Evidence matters more than a rating."}
          </p>
        </div>

        <div className="mt-10">
          <SectionTitle hint={ar ? "خمسة مسارات، لكل منها أدلته." : "Five views, each with its own evidence."}>
            {ar ? "نطاق ما نحلله" : "What we analyse"}
          </SectionTitle>
          <ul className="space-y-4">
            {ZONE_ORDER.map((z) => (
              <li key={z} className="rounded-2xl border border-border p-4">
                <h3 className="font-bold">{pick(ZONE_LABEL[z])}</h3>
                <ul className="mt-1 list-inside list-disc text-sm text-muted-foreground">
                  {ZONE_INDICATORS[z].map((k) => (
                    <li key={k}>{pick(INDICATOR_LABEL[k])}</li>
                  ))}
                </ul>
              </li>
            ))}
          </ul>
          <p className="mt-3 text-sm text-muted-foreground">
            {ar
              ? "«غير مرئي» لا يعني «غير موجود». المعلومة غير المؤكدة تبقى ظاهرة دائمًا."
              : "\"Not visible\" never means \"not there\". Unconfirmed information always stays visible."}
          </p>
        </div>

        <div className="mt-10">
          <SectionTitle>{ar ? "تجارب مخصصة للأدوار" : "Role-specific experiences"}</SectionTitle>
          <div className="flex flex-wrap gap-3">
            {(
              [
                { to: "/ecosystem", label: t("navEcosystem") },
                { to: "/review", label: t("navReview") },
                { to: "/insights", label: t("navInsights") },
              ] as const
            ).map((item) => (
              <Link
                key={item.to}
                to={item.to}
                className="min-h-12 rounded-xl border-2 border-input px-5 py-3 text-sm font-semibold hover:bg-muted"
              >
                {item.label}
              </Link>
            ))}
          </div>
        </div>
      </div>
    </AppShell>
  );
}
