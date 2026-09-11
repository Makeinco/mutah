import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import {
  Accessibility,
  ArrowLeft,
  ArrowRight,
  Building2,
  Camera,
  CircleCheck,
  Compass,
  Home as HomeIcon,
  MapPin,
  Network,
  ParkingCircle,
  PlusCircle,
  Route as RouteIcon,
  Search,
  ShieldCheck,
  Sparkles,
  UserRound,
} from "lucide-react";
import { useState } from "react";
import { LanguageSwitcher } from "@/components/mutah/LanguageSwitcher";
import { MutahLogo } from "@/components/mutah/Logo";
import { Button } from "@/components/mutah/ui";
import { decideFor, VERDICT_LABEL } from "@/lib/mutah/decision";
import { useLang } from "@/lib/mutah/i18n";
import { relativeDate } from "@/lib/mutah/labels";
import { useMutah } from "@/lib/mutah/store";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "مُتاح ماب | اعرف قبل أن تصل" },
      {
        name: "description",
        content:
          "معلومات وصول واضحة وموثقة تساعدك على اتخاذ قرارك قبل الزيارة، مع أدلة مرئية ومراجعة بشرية.",
      },
      { property: "og:title", content: "مُتاح ماب | اعرف قبل أن تصل" },
      {
        property: "og:description",
        content: "من الغموض قبل الرحلة إلى معلومات وصول أوضح وموثقة قبل أن تصل.",
      },
    ],
  }),
  component: Home,
});

const accessNeedTiles = [
  { key: "step", ar: "مسار بلا درجات", en: "Step-free route", icon: Accessibility },
  { key: "ramp", ar: "منحدر", en: "Ramp", icon: RouteIcon },
  { key: "path", ar: "مسار خالٍ من العوائق", en: "Obstacle-free path", icon: Compass },
  { key: "rail", ar: "درابزين", en: "Handrail", icon: ShieldCheck },
  { key: "parking", ar: "موقف مخصص", en: "Accessible parking", icon: ParkingCircle },
  { key: "elevator", ar: "مصعد", en: "Elevator", icon: Building2 },
  { key: "restroom", ar: "دورة مياه مخصصة", en: "Accessible restroom", icon: Accessibility },
] as const;

const bottomNav = [
  { to: "/", ar: "الرئيسية", en: "Home", icon: HomeIcon },
  { to: "/discover", ar: "استكشف", en: "Explore", icon: Compass },
  { to: "/contribute", ar: "ساهم", en: "Contribute", icon: Camera, prominent: true },
  { to: "/ecosystem", ar: "مُتاح", en: "MUTAH", icon: Network },
  { to: "/preferences", ar: "حسابي", en: "Account", icon: UserRound },
] as const;

function Home() {
  const navigate = useNavigate();
  const { facilities, needs } = useMutah();
  const { t, pick, lang } = useLang();
  const [query, setQuery] = useState("");
  const Arrow = lang === "ar" ? ArrowLeft : ArrowRight;
  const copy = lang === "ar" ? AR : EN;

  const recent = [...facilities]
    .sort((a, b) => b.lastVerifiedISO.localeCompare(a.lastVerifiedISO))
    .slice(0, 4);

  return (
    <div className="min-h-dvh bg-background pb-20 md:pb-0">
      <header className="sticky top-0 z-40 border-b border-border/70 bg-background/90 backdrop-blur-xl">
        <div className="mx-auto flex min-h-16 max-w-7xl items-center justify-between gap-4 px-4 md:px-6">
          <Link to="/" aria-label={`${t("brand")} — ${t("home")}`} className="shrink-0">
            <MutahLogo className="h-9 md:h-10" />
          </Link>

          <nav aria-label={t("mainNav")} className="hidden items-center gap-1 md:flex">
            <Link to="/" className="rounded-xl bg-primary-soft px-4 py-2 text-sm font-bold text-primary">
              {lang === "ar" ? "الرئيسية" : "Home"}
            </Link>
            <Link to="/discover" className="rounded-xl px-4 py-2 text-sm font-semibold hover:bg-muted">
              {lang === "ar" ? "استكشف" : "Explore"}
            </Link>
            <Link to="/contribute" className="rounded-xl px-4 py-2 text-sm font-semibold hover:bg-muted">
              {lang === "ar" ? "ساهم" : "Contribute"}
            </Link>
            <Link to="/ecosystem" className="rounded-xl px-4 py-2 text-sm font-semibold hover:bg-muted">
              {lang === "ar" ? "مُتاح" : "MUTAH"}
            </Link>
          </nav>

          <LanguageSwitcher />
        </div>
      </header>

      <main id="main-content">
        <section className="relative overflow-hidden border-b border-border/60">
          <div aria-hidden="true" className="absolute inset-0 bg-[radial-gradient(circle_at_75%_18%,rgba(0,102,255,0.08),transparent_34%),radial-gradient(circle_at_58%_72%,rgba(0,255,0,0.05),transparent_24%)]" />
          <div className="relative mx-auto grid max-w-7xl items-center gap-8 px-4 py-10 md:grid-cols-[1.02fr_0.98fr] md:px-6 md:py-16 lg:gap-14 lg:py-20">
            <div className="order-2 md:order-1">
              <p className="text-sm font-bold tracking-wide text-primary">{lang === "ar" ? "مُتاح ماب | MUTAH MAP" : "MUTAH MAP | مُتاح ماب"}</p>
              <h1 className="door-reveal mt-4 max-w-2xl text-4xl font-bold text-foreground md:text-6xl lg:text-7xl">
                {t("tagline")}
              </h1>
              <p className="mt-4 max-w-xl text-lg text-muted-foreground md:text-xl">{copy.heroBody}</p>

              <form
                className="mt-8 max-w-2xl"
                onSubmit={(e) => {
                  e.preventDefault();
                  navigate({ to: "/discover", search: { q: query || undefined } });
                }}
              >
                <label htmlFor="home-search" className="sr-only">
                  {t("searchLabel")}
                </label>
                <div className="flex min-h-16 items-center gap-3 rounded-2xl border border-input bg-background/95 px-4 shadow-sm transition focus-within:border-primary focus-within:shadow-md">
                  <Search className="size-5 shrink-0 text-muted-foreground" aria-hidden="true" />
                  <input
                    id="home-search"
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                    placeholder={t("search")}
                    className="w-full bg-transparent text-base outline-none placeholder:text-muted-foreground"
                  />
                </div>
              </form>

              <div className="mt-4 flex flex-col gap-3 sm:flex-row sm:max-w-2xl">
                <Button size="lg" onClick={() => navigate({ to: "/discover" })} className="min-h-14 sm:flex-1">
                  {t("explore")}
                  <Arrow className="size-5" aria-hidden="true" />
                </Button>
                <Button
                  size="lg"
                  variant="outline"
                  onClick={() => navigate({ to: "/preferences" })}
                  className="min-h-14 sm:flex-1"
                >
                  {t("setNeeds")}
                </Button>
              </div>

              <div className="mt-6 flex flex-wrap gap-x-6 gap-y-3 text-sm text-muted-foreground">
                <span className="inline-flex items-center gap-2"><ShieldCheck className="size-4 text-primary" />{copy.trust1}</span>
                <span className="inline-flex items-center gap-2"><CircleCheck className="size-4 text-access" />{copy.trust2}</span>
              </div>
            </div>

            <div className="order-1 md:order-2">
              <OpenDoorHeroArt label={copy.heroVisualLabel} />
            </div>
          </div>
        </section>

        <section aria-labelledby="recent-title" className="mx-auto max-w-7xl px-4 py-12 md:px-6 md:py-16">
          <SectionHeading
            id="recent-title"
            title={t("recentlyUpdated")}
            body={copy.recentBody}
            action={{ label: copy.viewAll, to: "/discover" }}
          />
          <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {recent.map((facility) => {
              const decision = decideFor(facility, needs);
              return (
                <Link
                  key={facility.id}
                  to="/facility/$id"
                  params={{ id: facility.id }}
                  className="group overflow-hidden rounded-3xl border border-border bg-card transition duration-200 hover:-translate-y-0.5 hover:shadow-lg"
                >
                  <div className="aspect-[4/3] overflow-hidden bg-surface">
                    {facility.imageUrl ? (
                      <img
                        src={facility.imageUrl}
                        alt={pick(facility.imageAlt)}
                        loading="lazy"
                        className="h-full w-full object-cover transition duration-300 group-hover:scale-[1.02]"
                      />
                    ) : (
                      <div className="flex h-full items-center justify-center text-sm text-muted-foreground">{t("noPhoto")}</div>
                    )}
                  </div>
                  <div className="p-4">
                    <p className="line-clamp-1 font-bold">{pick(facility.name)}</p>
                    <p className="mt-1 flex items-center gap-1 text-sm text-muted-foreground">
                      <MapPin className="size-4" aria-hidden="true" />
                      {pick(facility.area)}
                    </p>
                    <div className="mt-4 flex items-end justify-between gap-3">
                      <span className={`rounded-full px-3 py-1 text-xs font-bold ${verdictClass(decision.verdict)}`}>
                        {pick(VERDICT_LABEL[decision.verdict])}
                      </span>
                      <span className="text-xs text-muted-foreground">{relativeDate(facility.lastVerifiedISO, lang)}</span>
                    </div>
                  </div>
                </Link>
              );
            })}
          </div>
        </section>

        <section className="border-y border-border/60 bg-surface/70">
          <div className="mx-auto max-w-7xl px-4 py-12 md:px-6 md:py-16">
            <SectionHeading title={copy.needsTitle} body={copy.needsBody} />
            <div className="mt-6 grid grid-cols-2 gap-3 sm:grid-cols-4 lg:grid-cols-7">
              {accessNeedTiles.map(({ key, ar, en, icon: Icon }) => (
                <button
                  key={key}
                  type="button"
                  onClick={() => navigate({ to: "/preferences" })}
                  className="min-h-28 rounded-2xl border border-border bg-background p-4 text-start transition hover:border-primary/40 hover:shadow-md"
                >
                  <span className="flex size-10 items-center justify-center rounded-xl bg-primary-soft text-primary">
                    <Icon className="size-5" aria-hidden="true" />
                  </span>
                  <span className="mt-3 block text-sm font-bold">{lang === "ar" ? ar : en}</span>
                </button>
              ))}
            </div>
          </div>
        </section>

        <section className="mx-auto grid max-w-7xl gap-8 px-4 py-14 md:grid-cols-2 md:items-center md:px-6 md:py-20 lg:gap-14">
          <EvidenceVisual />
          <div>
            <p className="text-sm font-bold text-primary">{copy.aiKicker}</p>
            <h2 className="mt-3 text-3xl font-bold md:text-5xl">{copy.aiTitle}</h2>
            <p className="mt-4 max-w-xl text-lg text-muted-foreground">{copy.aiBody}</p>
            <div className="mt-6 inline-flex items-center gap-2 rounded-full border border-border bg-surface px-4 py-2 text-sm font-bold">
              <Sparkles className="size-4 text-primary" aria-hidden="true" />
              AI Observes. Humans Verify.
            </div>
          </div>
        </section>

        <section className="border-y border-border/60 bg-surface/70">
          <div className="mx-auto max-w-7xl px-4 py-12 md:px-6 md:py-16">
            <SectionHeading title={copy.howTitle} body={copy.howBody} />
            <div className="mt-7 grid gap-4 md:grid-cols-3">
              {copy.steps.map((step, index) => (
                <article key={step.title} className="rounded-3xl border border-border bg-background p-6">
                  <div className="flex size-10 items-center justify-center rounded-full bg-primary text-sm font-bold text-primary-foreground">{index + 1}</div>
                  <h3 className="mt-5 text-xl font-bold">{step.title}</h3>
                  <p className="mt-2 text-muted-foreground">{step.body}</p>
                </article>
              ))}
            </div>
          </div>
        </section>

        <section className="mx-auto max-w-7xl px-4 py-14 md:px-6 md:py-20">
          <div className="relative overflow-hidden rounded-[2rem] border border-primary/15 bg-primary-soft p-7 md:p-10">
            <div aria-hidden="true" className="absolute -end-12 -top-12 size-48 rounded-full bg-brand-green/20 blur-3xl" />
            <div className="relative max-w-3xl">
              <Camera className="size-8 text-primary" aria-hidden="true" />
              <h2 className="mt-5 text-3xl font-bold md:text-4xl">{copy.contributeTitle}</h2>
              <p className="mt-3 text-lg text-muted-foreground">{copy.contributeBody}</p>
              <Button size="lg" onClick={() => navigate({ to: "/contribute" })} className="mt-6 min-h-14">
                {copy.contributeCta}
                <PlusCircle className="size-5" aria-hidden="true" />
              </Button>
            </div>
          </div>
        </section>

        <section className="border-t border-border/60">
          <div className="mx-auto flex max-w-7xl flex-col gap-5 px-4 py-12 md:flex-row md:items-center md:justify-between md:px-6">
            <div>
              <p className="text-sm font-bold text-primary">MUTAH ECOSYSTEM</p>
              <h2 className="mt-2 text-2xl font-bold">{copy.ecosystemTitle}</h2>
              <p className="mt-2 max-w-2xl text-muted-foreground">{copy.ecosystemBody}</p>
            </div>
            <Link to="/ecosystem" className="inline-flex min-h-12 items-center gap-2 rounded-xl border border-input px-5 py-3 text-sm font-bold hover:bg-muted">
              {copy.ecosystemCta}
              <Arrow className="size-4" aria-hidden="true" />
            </Link>
          </div>
        </section>
      </main>

      <footer className="border-t border-border bg-background">
        <div className="mx-auto flex max-w-7xl flex-col gap-3 px-4 py-8 text-sm text-muted-foreground md:flex-row md:items-center md:justify-between md:px-6">
          <MutahLogo className="h-8" />
          <p>{lang === "ar" ? "اعرف قبل أن تصل." : "Know before you go."}</p>
        </div>
      </footer>

      <nav aria-label={t("bottomNav")} className="fixed inset-x-0 bottom-0 z-50 border-t border-border bg-background/95 backdrop-blur-xl md:hidden">
        <ul className="mx-auto grid max-w-md grid-cols-5 px-1">
          {bottomNav.map(({ to, ar, en, icon: Icon, prominent }) => (
            <li key={to}>
              <Link
                to={to}
                className={`flex min-h-16 flex-col items-center justify-center gap-1 text-[11px] font-bold ${prominent ? "text-primary" : "text-muted-foreground"}`}
                activeProps={{ className: "text-primary" }}
              >
                <span className={prominent ? "-mt-4 flex size-12 items-center justify-center rounded-full bg-primary text-primary-foreground shadow-lg ring-4 ring-background" : "flex size-8 items-center justify-center"}>
                  <Icon className={prominent ? "size-6" : "size-5"} aria-hidden="true" />
                </span>
                {lang === "ar" ? ar : en}
              </Link>
            </li>
          ))}
        </ul>
      </nav>
    </div>
  );
}

function SectionHeading({
  id,
  title,
  body,
  action,
}: {
  id?: string;
  title: string;
  body?: string;
  action?: { label: string; to: "/discover" };
}) {
  return (
    <div className="flex flex-col gap-3 md:flex-row md:items-end md:justify-between">
      <div>
        <h2 id={id} className="text-2xl font-bold md:text-3xl">{title}</h2>
        {body ? <p className="mt-2 max-w-2xl text-muted-foreground">{body}</p> : null}
      </div>
      {action ? (
        <Link to={action.to} className="text-sm font-bold text-primary hover:underline">{action.label}</Link>
      ) : null}
    </div>
  );
}

function OpenDoorHeroArt({ label }: { label: string }) {
  return (
    <div role="img" aria-label={label} className="relative mx-auto aspect-[4/3] w-full max-w-xl overflow-hidden rounded-[2.25rem] border border-border/70 bg-white shadow-[0_30px_80px_-50px_rgba(0,51,153,0.4)]">
      <div aria-hidden="true" className="absolute inset-0 bg-[radial-gradient(circle_at_50%_18%,rgba(0,102,255,0.10),transparent_35%),linear-gradient(180deg,#ffffff_0%,#f7fbff_100%)]" />
      <div aria-hidden="true" className="absolute bottom-[18%] start-[8%] h-[16%] w-[84%] rounded-[50%] bg-black/5 blur-2xl" />

      <div aria-hidden="true" className="absolute bottom-[19%] start-[13%] h-[22%] w-[30%] rounded-2xl bg-slate-200/80" />
      <div aria-hidden="true" className="absolute bottom-[25%] start-[8%] h-[8%] w-[24%] rounded-xl bg-slate-100" />

      <div aria-hidden="true" className="door-sweep absolute bottom-[22%] start-1/2 h-[66%] w-[43%] -translate-x-1/2 rounded-t-[46%] rounded-b-[1.2rem] bg-[linear-gradient(145deg,#1681ff_0%,#0066ff_45%,#0049b8_100%)] p-[10%] shadow-[0_24px_45px_-24px_rgba(0,74,190,0.7)] rtl:translate-x-1/2">
        <div className="relative h-full w-full overflow-hidden rounded-t-[43%] rounded-b-[0.7rem] bg-white shadow-inner">
          <div className="absolute inset-y-0 end-0 w-[48%] origin-right rounded-tl-[65%] bg-[linear-gradient(160deg,#4dff63,#00ff00_55%,#00c93c)] shadow-[inset_8px_0_18px_rgba(0,0,0,0.08)]" />
          <div className="absolute start-[51%] top-[48%] size-2 rounded-full bg-primary" />
          <div className="absolute inset-0 bg-[linear-gradient(180deg,transparent_45%,rgba(0,255,0,0.06))]" />
        </div>
      </div>

      <div aria-hidden="true" className="absolute bottom-[4%] start-1/2 h-[42%] w-[42%] -translate-x-1/2 [clip-path:polygon(32%_0,68%_0,100%_100%,0_100%)] bg-[linear-gradient(180deg,rgba(0,255,0,0.82),rgba(0,214,70,0.16))] blur-[0.2px] rtl:translate-x-1/2" />
      <div aria-hidden="true" className="absolute bottom-[3%] start-[14%] h-px w-[72%] bg-gradient-to-r from-transparent via-primary/20 to-transparent" />

      <div className="absolute bottom-5 start-5 rounded-full border border-border/80 bg-background/85 px-3 py-1.5 text-xs font-bold text-muted-foreground backdrop-blur">
        {label}
      </div>
    </div>
  );
}

function EvidenceVisual() {
  return (
    <div aria-hidden="true" className="relative min-h-[340px] overflow-hidden rounded-[2rem] border border-border bg-surface p-6 md:min-h-[420px]">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_30%,rgba(0,102,255,0.10),transparent_30%),radial-gradient(circle_at_75%_75%,rgba(0,255,0,0.10),transparent_25%)]" />
      <div className="absolute inset-x-[12%] bottom-[13%] top-[14%] overflow-hidden rounded-3xl border border-border bg-background shadow-xl">
        <div className="absolute inset-0 bg-[linear-gradient(135deg,#f8fafc,#eef6ff)]" />
        <div className="absolute bottom-0 start-0 h-[42%] w-full bg-slate-200" />
        <div className="absolute bottom-[18%] start-[12%] h-[34%] w-[42%] rounded-t-2xl border-8 border-primary/70 bg-white" />
        <div className="absolute bottom-[18%] end-[9%] h-[26%] w-[34%] [clip-path:polygon(0_100%,100%_100%,100%_10%)] bg-brand-green/70" />
        <div className="absolute end-[11%] top-[18%] flex size-12 items-center justify-center rounded-2xl bg-primary text-primary-foreground shadow-lg">
          <Sparkles className="size-5" />
        </div>
        <div className="absolute bottom-[22%] start-[16%] h-[42%] w-[48%] rounded-2xl border-2 border-primary/50" />
        <div className="absolute bottom-[12%] end-[12%] flex size-11 items-center justify-center rounded-full bg-access text-white shadow-lg">
          <CircleCheck className="size-6" />
        </div>
      </div>
    </div>
  );
}

function verdictClass(verdict: "available" | "partial" | "not_available" | "insufficient") {
  switch (verdict) {
    case "available":
      return "bg-access-soft text-access-strong";
    case "partial":
      return "bg-caution-soft text-caution";
    case "not_available":
      return "bg-red-50 text-red-700";
    default:
      return "bg-unknown-soft text-unknown";
  }
}

const AR = {
  heroBody: "معلومات وصول واضحة وموثقة تساعدك على اتخاذ قرارك قبل الزيارة.",
  heroVisualLabel: "من الغموض إلى الوضوح قبل الرحلة",
  trust1: "أدلة مرئية واضحة",
  trust2: "مراجعة بشرية قبل النشر",
  recentBody: "أماكن أضيفت أو تمت مراجعة أدلة الوصول فيها مؤخرًا.",
  viewAll: "عرض جميع الأماكن",
  needsTitle: "استكشف حسب احتياج الوصول",
  needsBody: "اختر ما يهمك، ثم دع مُتاح يوضح الأدلة المرتبطة باحتياجاتك — دون تشخيص أو تصنيف طبي.",
  aiKicker: "من الصورة إلى دليل أوضح",
  aiTitle: "الذكاء الاصطناعي يرصد. والإنسان يتحقق.",
  aiBody: "يحوّل مُتاح الصور إلى أدلة وصول قابلة للفهم، ويُظهر ما هو غير واضح بدل التخمين، ثم تمر المعلومة بمراجعة بشرية قبل النشر.",
  howTitle: "كيف يساعدك مُتاح؟",
  howBody: "ثلاث خطوات بسيطة لتحويل معلومات الوصول إلى قرار عملي قبل الزيارة.",
  steps: [
    { title: "حدد ما تحتاجه", body: "اختر احتياجات الوصول التي تهمك دون مشاركة معلومات طبية." },
    { title: "استكشف الأدلة", body: "شاهد الصور، حالة التحقق، وما هو معروف وما يزال غير موثق." },
    { title: "قرر قبل الزيارة", body: "افهم مدى ملاءمة المكان لاحتياجاتك قبل أن تبدأ الرحلة." },
  ],
  contributeTitle: "معلومة واحدة قد تفتح الطريق لشخص آخر",
  contributeBody: "صورة حديثة أو تحديث بسيط يمكن أن يجعل قرار الوصول أوضح للآخرين. كل مساهمة تمر بالمراجعة قبل النشر.",
  contributeCta: "ساهم الآن",
  ecosystemTitle: "مُتاح أكبر من خريطة",
  ecosystemBody: "مُتاح ماب هو أول منتج عامل نختبر من خلاله رؤية أوسع لذكاء الإتاحة، مع مُتاح إنسايتس كطبقة بيانات قيد التطوير.",
  ecosystemCta: "استكشف منظومة مُتاح",
};

const EN = {
  heroBody: "Clear, verified access information that helps you decide before you visit.",
  heroVisualLabel: "From uncertainty to clarity before the journey",
  trust1: "Clear visual evidence",
  trust2: "Human review before publication",
  recentBody: "Places with recently added or reviewed accessibility evidence.",
  viewAll: "View all places",
  needsTitle: "Explore by access need",
  needsBody: "Choose what matters to you, and MUTAH will surface the relevant evidence — without medical classification.",
  aiKicker: "From image to clearer evidence",
  aiTitle: "AI observes. Humans verify.",
  aiBody: "MUTAH turns images into understandable access evidence, keeps uncertainty visible instead of guessing, and requires human review before publication.",
  howTitle: "How does MUTAH help?",
  howBody: "Three simple steps turn access information into a practical pre-visit decision.",
  steps: [
    { title: "Choose what matters", body: "Select your access needs without sharing medical information." },
    { title: "Explore the evidence", body: "See photos, verification state, what is known and what is still undocumented." },
    { title: "Decide before you go", body: "Understand whether the place fits your needs before the journey begins." },
  ],
  contributeTitle: "One update can open the way for someone else",
  contributeBody: "A recent photo or simple update can make access decisions clearer for others. Every contribution is reviewed before publication.",
  contributeCta: "Contribute now",
  ecosystemTitle: "MUTAH is bigger than a map",
  ecosystemBody: "MUTAH MAP is the first working product testing a broader accessibility-intelligence vision, with MUTAH Insights in development.",
  ecosystemCta: "Explore the MUTAH ecosystem",
};
