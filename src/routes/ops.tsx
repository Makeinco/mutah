import { createFileRoute, Link } from "@tanstack/react-router";
import { Building2, ClipboardCheck, FileWarning, History, ShieldCheck, UsersRound } from "lucide-react";
import { AppShell } from "@/components/mutah/AppShell";
import { RoleGate } from "@/components/mutah/RoleGate";
import { Card } from "@/components/mutah/ui";
import { useLang } from "@/lib/mutah/i18n";

export const Route = createFileRoute("/ops")({
  head: () => ({
    meta: [
      { title: "مركز عمليات مُتاح | MUTAH Operations" },
      { name: "description", content: "مساحة تشغيلية محمية لفريق مُتاح: المراجعة وإدارة المرافق وجودة البيانات." },
    ],
  }),
  component: OperationsPage,
});

const ITEMS = [
  { icon: ClipboardCheck, ar: "قائمة المراجعة", en: "Review queue", bodyAr: "مراجعة حزم الأدلة قبل النشر.", bodyEn: "Review evidence bundles before publishing.", to: "/review" as const },
  { icon: Building2, ar: "المرافق", en: "Facilities", bodyAr: "إدارة هوية المرافق ومناطق التوثيق.", bodyEn: "Manage facility identity and evidence zones." },
  { icon: UsersRound, ar: "المساهمون", en: "Contributors", bodyAr: "متابعة المساهمات دون إنشاء ملفات شخصية تدخّلية.", bodyEn: "Track contributions without invasive profiling." },
  { icon: FileWarning, ar: "البلاغات", en: "Reports", bodyAr: "التغييرات المقترحة والمرافق الجديدة.", bodyEn: "Reported changes and suggested facilities." },
  { icon: ShieldCheck, ar: "جودة البيانات", en: "Data quality", bodyAr: "الأدلة القديمة والمناطق غير الموثقة والتعارضات.", bodyEn: "Stale evidence, missing zones, and conflicts." },
  { icon: History, ar: "سجل التدقيق", en: "Audit log", bodyAr: "من اتخذ القرار ومتى ولماذا.", bodyEn: "Who made a decision, when, and why." },
];

function OperationsPage() {
  const { lang } = useLang();
  const ar = lang === "ar";

  return (
    <AppShell title={ar ? "مركز عمليات مُتاح" : "MUTAH Operations"} wide>
      <RoleGate allow={["reviewer", "admin"]}>
        <div className="mx-auto max-w-6xl">
          <div>
            <p className="text-sm font-semibold text-primary">MUTAH Operations</p>
            <h1 className="mt-2 text-3xl font-bold">{ar ? "مركز عمليات مُتاح" : "MUTAH Operations"}</h1>
            <p className="mt-2 max-w-3xl text-muted-foreground">
              {ar
                ? "مساحة العمل الداخلية للمراجعة والإدارة والنشر. لا تظهر هذه الأدوات ضمن تنقل المستخدم العام."
                : "The internal workspace for review, management, and publication. These tools never appear in the public navigation."}
            </p>
          </div>

          <div className="mt-8 grid gap-4 md:grid-cols-2 xl:grid-cols-3">
            {ITEMS.map(({ icon: Icon, ar: arTitle, en, bodyAr, bodyEn, ...item }) => {
              const content = (
                <Card className="h-full transition-colors hover:border-primary/40">
                  <Icon className="size-6 text-primary" aria-hidden="true" />
                  <h2 className="mt-4 text-lg font-bold">{ar ? arTitle : en}</h2>
                  <p className="mt-2 text-sm text-muted-foreground">{ar ? bodyAr : bodyEn}</p>
                  {"to" in item ? (
                    <p className="mt-4 text-sm font-semibold text-primary">{ar ? "فتح" : "Open"}</p>
                  ) : (
                    <p className="mt-4 text-xs font-semibold text-muted-foreground">{ar ? "يُستكمل في المرحلة التشغيلية التالية" : "Continues in the next operational phase"}</p>
                  )}
                </Card>
              );
              return "to" in item ? (
                <Link key={arTitle} to={item.to} className="block focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring">
                  {content}
                </Link>
              ) : (
                <div key={arTitle}>{content}</div>
              );
            })}
          </div>
        </div>
      </RoleGate>
    </AppShell>
  );
}
