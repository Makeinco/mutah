import { createFileRoute, Link } from "@tanstack/react-router";
import { BarChart3, Building2, ClipboardCheck, Compass, Users } from "lucide-react";
import type { ComponentType } from "react";
import { AppShell } from "@/components/mutah/AppShell";
import { Card, SectionTitle } from "@/components/mutah/ui";
import { bi, useLang } from "@/lib/mutah/i18n";
import type { L } from "@/lib/mutah/types";

export const Route = createFileRoute("/ecosystem")({
  head: () => ({
    meta: [
      { title: "منظومة مُتاح | مُتاح ماب" },
      {
        name: "description",
        content: "أدوار منظومة مُتاح: الزائر، المساهم، فريق المراجعة، الجهات، ومُتاح إنسايتس.",
      },
      { property: "og:title", content: "منظومة مُتاح | مُتاح ماب" },
      { property: "og:description", content: "دور واضح لكل طرف: من يرصد، من يتحقق، ومن يقرر." },
    ],
  }),
  component: Ecosystem,
});

interface Role {
  id: string;
  icon: ComponentType<{ className?: string }>;
  title: L;
  body: L;
  link?: { to: "/discover" | "/contribute" | "/review" | "/insights"; label: L };
}

const ROLES: Role[] = [
  {
    id: "visitor",
    icon: Compass,
    title: bi("الزائر", "Visitor"),
    body: bi(
      "يرى حالة مخصصة لاحتياجاته، مع سبب واضح لكل نتيجة قبل أن يقرر الزيارة.",
      "Sees a status personalised to their needs, with a clear reason behind every result.",
    ),
    link: { to: "/discover", label: bi("استكشف الأماكن", "Explore places") },
  },
  {
    id: "contributor",
    icon: Users,
    title: bi("المساهم", "Contributor"),
    body: bi(
      "يصوّر مسارًا واحدًا في كل مرة، ويؤكد أو يصحّح ما رصده الذكاء الاصطناعي.",
      "Photographs one view at a time and confirms or corrects what the AI observed.",
    ),
    link: { to: "/contribute", label: bi("ابدأ المساهمة", "Start contributing") },
  },
  {
    id: "reviewer",
    icon: ClipboardCheck,
    title: bi("فريق المراجعة", "Review team"),
    body: bi(
      "لا نشر تلقائي: كل مساهمة تُعتمد أو تُرفض أو يُطلب توضيحها بقرار بشري مسجّل.",
      "No automatic publishing: every contribution is approved, rejected, or queried by a recorded human decision.",
    ),
    link: { to: "/review", label: bi("مركز المراجعة", "Review centre") },
  },
  {
    id: "operators",
    icon: Building2,
    title: bi("الجهات ومشغلو المرافق", "Venues and operators"),
    body: bi(
      "يرون ما هو موثّق عن أماكنهم وما ينقصه دليل، فيعرفون أين يبدأ التحسين.",
      "See what is documented about their places and what still lacks evidence, so they know where to start.",
    ),
  },
  {
    id: "insights",
    icon: BarChart3,
    title: bi("مُتاح إنسايتس", "MUTAH Insights"),
    body: bi(
      "قراءة مجمّعة للبيانات ضمن نطاق المرحلة التجريبية، بلا ترتيب للمدن وبلا أرقام وطنية.",
      "An aggregate reading within the pilot scope only — no city rankings, no national figures.",
    ),
    link: { to: "/insights", label: bi("افتح إنسايتس", "Open Insights") },
  },
];

function Ecosystem() {
  const { pick, lang } = useLang();

  return (
    <AppShell title={lang === "ar" ? "المنظومة" : "Ecosystem"} wide>
      <div className="mx-auto max-w-4xl">
        <h1 className="text-2xl font-bold">
          {lang === "ar" ? "منظومة مُتاح" : "The MUTAH ecosystem"}
        </h1>
        <p className="mt-2 max-w-2xl text-muted-foreground">
          {lang === "ar"
            ? "مُتاح ليس تطبيقًا واحدًا، بل سلسلة أدوار: من يرصد، من يتحقق، ومن يقرر."
            : "MUTAH is not a single app but a chain of roles: who observes, who verifies, and who decides."}
        </p>

        <div className="mt-8 grid gap-4 md:grid-cols-2">
          {ROLES.map(({ id, icon: Icon, title, body, link }) => (
            <Card key={id} className="door-reveal transition-shadow hover:shadow-md">
              <span className="flex size-12 items-center justify-center rounded-xl bg-primary-soft text-primary">
                <Icon className="size-6" aria-hidden="true" />
              </span>
              <h2 className="mt-4 text-lg font-bold">{pick(title)}</h2>
              <p className="mt-2 text-sm text-muted-foreground">{pick(body)}</p>
              {link ? (
                <Link
                  to={link.to}
                  className="mt-4 inline-flex min-h-11 items-center rounded-xl border-2 border-input px-4 text-sm font-semibold hover:bg-muted"
                >
                  {pick(link.label)}
                </Link>
              ) : null}
            </Card>
          ))}
        </div>

        <div className="mt-12">
          <SectionTitle
            hint={
              lang === "ar"
                ? "المعلومة تمر بالمسار نفسه في كل مرة."
                : "Information always travels the same path."
            }
          >
            {lang === "ar" ? "كيف تتحرك المعلومة" : "How information moves"}
          </SectionTitle>
          <ol className="grid gap-3 sm:grid-cols-5">
            {(lang === "ar"
              ? ["صورة", "رصد أولي", "تأكيد المساهم", "مراجعة بشرية", "نشر"]
              : ["Photo", "AI observation", "Contributor confirms", "Human review", "Published"]
            ).map((step, i) => (
              <li
                key={step}
                className="rounded-2xl border border-border bg-surface p-4 text-sm font-semibold"
              >
                <span className="block text-xs text-muted-foreground">{i + 1}</span>
                {step}
              </li>
            ))}
          </ol>
        </div>
      </div>
    </AppShell>
  );
}
