import { createFileRoute, Link } from "@tanstack/react-router";
import {
  BarChart3,
  BriefcaseBusiness,
  HeartPulse,
  MapPinned,
  ShoppingBag,
  UsersRound,
} from "lucide-react";
import type { ComponentType } from "react";
import { AppShell } from "@/components/mutah/AppShell";
import { Card } from "@/components/mutah/ui";
import { bi, useLang } from "@/lib/mutah/i18n";
import type { L } from "@/lib/mutah/types";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/ecosystem")({
  head: () => ({
    meta: [
      { title: "مُتاح | منظومة الوصول" },
      {
        name: "description",
        content: "منظومة مُتاح: مُتاح ماب اليوم، وخدمات مستقبلية توسّع الوصول إلى الرعاية والمنتجات والفرص والبيانات.",
      },
    ],
  }),
  component: MutahEcosystem,
});

type ServiceStatus = "current" | "future" | "pilot";

interface Service {
  id: string;
  icon: ComponentType<{ className?: string }>;
  name: L;
  english: string;
  body: L;
  status: ServiceStatus;
  accent: string;
  to?: "/discover" | "/insights";
}

const SERVICES: Service[] = [
  {
    id: "map",
    icon: MapPinned,
    name: bi("مُتاح ماب", "MUTAH MAP"),
    english: "MUTAH MAP",
    body: bi(
      "أدلة موثقة تساعدك على فهم إتاحة المرافق قبل الزيارة.",
      "Verified evidence that helps you understand facility access before visiting.",
    ),
    status: "current",
    accent: "bg-blue-50 text-blue-700",
    to: "/discover",
  },
  {
    id: "care",
    icon: HeartPulse,
    name: bi("مُتاح كير", "MUTAH CARE"),
    english: "MUTAH CARE",
    body: bi(
      "وصول أسهل إلى الخدمات الصحية والتأهيلية المناسبة.",
      "Easier access to relevant health and rehabilitation services.",
    ),
    status: "future",
    accent: "bg-rose-50 text-rose-700",
  },
  {
    id: "market",
    icon: ShoppingBag,
    name: bi("مُتاح ماركت", "MUTAH MARKET"),
    english: "MUTAH MARKET",
    body: bi(
      "اكتشاف ومقارنة الأجهزة والحلول المساعدة بسهولة.",
      "Discover and compare assistive products and solutions more easily.",
    ),
    status: "future",
    accent: "bg-amber-50 text-amber-700",
  },
  {
    id: "works",
    icon: BriefcaseBusiness,
    name: bi("مُتاح ووركس", "MUTAH WORKS"),
    english: "MUTAH WORKS",
    body: bi(
      "تمكين مهني وربط أكثر ذكاءً بين المهارات والفرص.",
      "Professional empowerment and smarter connections between skills and opportunities.",
    ),
    status: "future",
    accent: "bg-indigo-50 text-indigo-700",
  },
  {
    id: "connect",
    icon: UsersRound,
    name: bi("مُتاح كونكت", "MUTAH CONNECT"),
    english: "MUTAH CONNECT",
    body: bi(
      "مجتمع آمن يربط الأفراد والأسر والجهات ويعزز الدعم والتواصل.",
      "A safe community connecting individuals, families and organisations.",
    ),
    status: "future",
    accent: "bg-teal-50 text-teal-700",
  },
  {
    id: "insights",
    icon: BarChart3,
    name: bi("مُتاح إنسايتس", "MUTAH INSIGHTS"),
    english: "MUTAH INSIGHTS",
    body: bi(
      "تحويل بيانات الإتاحة إلى مؤشرات تساعد المرافق وصنّاع القرار.",
      "Turning accessibility data into insights for facilities and decision-makers.",
    ),
    status: "pilot",
    accent: "bg-violet-50 text-violet-700",
    to: "/insights",
  },
];

function StatusLabel({ status }: { status: ServiceStatus }) {
  const { lang } = useLang();
  const copy = {
    current: lang === "ar" ? "المنتج الحالي" : "Current product",
    future: lang === "ar" ? "ضمن الرؤية المستقبلية" : "Future roadmap",
    pilot: lang === "ar" ? "قيد التطوير · Pilot" : "Pilot · In development",
  }[status];

  return (
    <span className="inline-flex rounded-full border border-border bg-background px-2.5 py-1 text-xs font-semibold text-muted-foreground">
      {copy}
    </span>
  );
}

function MutahEcosystem() {
  const { pick, lang } = useLang();
  const ar = lang === "ar";

  return (
    <AppShell title={ar ? "مُتاح" : "MUTAH"} wide>
      <div className="mx-auto max-w-5xl">
        <div className="max-w-3xl">
          <p className="text-sm font-semibold text-primary">{ar ? "المنظومة الأم" : "The master ecosystem"}</p>
          <h1 className="mt-2 text-3xl font-bold tracking-tight">{ar ? "مُتاح" : "MUTAH"}</h1>
          <p className="mt-3 text-base leading-7 text-muted-foreground">
            {ar
              ? "منظومة متكاملة تجعل الوصول إلى الأماكن والخدمات والفرص أكثر وضوحًا وإتاحة. مُتاح ماب هو المنتج الحالي، وما سواه يظهر هنا كرؤية مستقبلية أو كتجربة قيد التطوير بوضوح."
              : "An integrated ecosystem designed to make access to places, services and opportunities clearer and more available. MUTAH MAP is the current product; the others are clearly labelled as roadmap or pilot concepts."}
          </p>
        </div>

        <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {SERVICES.map((service) => {
            const Icon = service.icon;
            const content = (
              <Card
                className={cn(
                  "h-full transition-all duration-200 hover:-translate-y-0.5 hover:shadow-sm",
                  service.status === "current" && "border-primary/40 ring-1 ring-primary/10",
                )}
              >
                <div className="flex items-start justify-between gap-3">
                  <span className={cn("flex size-12 items-center justify-center rounded-2xl", service.accent)}>
                    <Icon className="size-6" aria-hidden="true" />
                  </span>
                  <StatusLabel status={service.status} />
                </div>
                <h2 className="mt-5 text-lg font-bold">{pick(service.name)}</h2>
                <p className="mt-1 text-xs font-semibold tracking-wide text-muted-foreground">{service.english}</p>
                <p className="mt-3 text-sm leading-6 text-muted-foreground">{pick(service.body)}</p>
                {service.status === "current" ? (
                  <p className="mt-4 text-sm font-semibold text-primary">{ar ? "اعرف قبل أن تصل" : "Know Before You Go"}</p>
                ) : null}
              </Card>
            );

            return service.to ? (
              <Link key={service.id} to={service.to} className="block rounded-2xl focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2">
                {content}
              </Link>
            ) : (
              <div key={service.id}>{content}</div>
            );
          })}
        </div>

        <div className="mt-10 rounded-3xl border border-border bg-muted/35 p-5 sm:p-6">
          <p className="font-semibold">{ar ? "مبدأ التنفيذ" : "Build principle"}</p>
          <p className="mt-2 text-sm leading-6 text-muted-foreground">
            {ar
              ? "نُظهر الرؤية كاملة، لكننا لا ندّعي أن الخدمات المستقبلية تعمل اليوم. عمق تنفيذ مُتاح ماب يسبق كثرة الميزات."
              : "We show the full vision without implying that roadmap services are live today. Depth of execution in MUTAH MAP comes before feature count."}
          </p>
        </div>
      </div>
    </AppShell>
  );
}
