import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import {
  ArrowLeft,
  ArrowRight,
  Camera,
  CircleCheck,
  Compass,
  Home as HomeIcon,
  MapPin,
  Network,
  Search,
  ShieldCheck,
  Sparkles,
  UserRound,
} from "lucide-react";
import { useEffect, useState } from "react";
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

type BottomNavItem = {
  to: "/" | "/discover" | "/contribute" | "/ecosystem" | "/preferences";
  ar: string;
  en: string;
  icon: typeof HomeIcon;
  prominent: boolean;
};

const bottomNav: readonly BottomNavItem[] = [
  { to: "/", ar: "الرئيسية", en: "Home", icon: HomeIcon, prominent: false },
  { to: "/discover", ar: "استكشف", en: "Explore", icon: Compass, prominent: false },
  { to: "/contribute", ar: "ساهم", en: "Contribute", icon: Camera, prominent: true },
  { to: "/ecosystem", ar: "مُتاح", en: "MUTAH", icon: Network, prominent: false },
  { to: "/preferences", ar: "حسابي", en: "Account", icon: UserRound, prominent: false },
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
    .slice(0, 3);

  return (
    <>
      <HomeSplash />
      <div className="min-h-dvh bg-white pb-20 text-foreground md:pb-0">
        <header className="sticky top-0 z-40 border-b border-border/45 bg-white/90 backdrop-blur-xl">
          <div className="mx-auto flex min-h-[72px] max-w-[1440px] items-center justify-between gap-4 px-5 md:px-8 lg:px-12">
            <Link to="/" aria-label={`${t("brand")} — ${t("home")}`} className="shrink-0">
              <MutahLogo className="h-8 md:h-9" />
            </Link>

            <nav aria-label={t("mainNav")} className="hidden items-center gap-1 lg:flex">
              <Link
                to="/"
                className="rounded-full bg-primary-soft px-4 py-2 text-sm font-bold text-primary"
              >
                {lang === "ar" ? "الرئيسية" : "Home"}
              </Link>
              <Link
                to="/discover"
                className="rounded-full px-4 py-2 text-sm font-semibold text-foreground/75 transition hover:bg-muted hover:text-foreground"
              >
                {lang === "ar" ? "استكشف" : "Explore"}
              </Link>
              <Link
                to="/contribute"
                className="rounded-full px-4 py-2 text-sm font-semibold text-foreground/75 transition hover:bg-muted hover:text-foreground"
              >
                {lang === "ar" ? "ساهم" : "Contribute"}
              </Link>
              <Link
                to="/ecosystem"
                className="rounded-full px-4 py-2 text-sm font-semibold text-foreground/75 transition hover:bg-muted hover:text-foreground"
              >
                {lang === "ar" ? "مُتاح" : "MUTAH"}
              </Link>
            </nav>

            <LanguageSwitcher />
          </div>
        </header>

        <main id="main-content">
          <section className="relative isolate overflow-hidden bg-white">
            <div
              aria-hidden="true"
              className="absolute inset-x-0 top-0 -z-10 h-[78%] bg-[radial-gradient(circle_at_22%_14%,rgba(0,102,255,0.055),transparent_34%),radial-gradient(circle_at_72%_36%,rgba(0,255,0,0.035),transparent_26%)]"
            />

            <div className="mx-auto grid min-h-[calc(100svh-72px)] max-w-[1440px] items-center gap-4 px-5 pb-12 pt-7 md:min-h-[720px] md:grid-cols-[0.88fr_1.12fr] md:gap-6 md:px-8 md:py-12 lg:gap-10 lg:px-12 xl:min-h-[780px]">
              <div className="order-2 relative z-10 max-w-[620px] md:order-1 md:py-8">
                <p className="text-xs font-extrabold tracking-[0.14em] text-primary md:text-sm">
                  {lang === "ar" ? "مُتاح ماب | MUTAH MAP" : "MUTAH MAP | مُتاح ماب"}
                </p>
                <h1 className="mt-4 text-[clamp(2.7rem,5.4vw,5.55rem)] font-bold leading-[1.02] tracking-[-0.035em] text-slate-950">
                  {t("tagline")}
                </h1>
                <p className="mt-5 max-w-[560px] text-base leading-8 text-slate-600 md:text-lg lg:text-xl">
                  {copy.heroBody}
                </p>

                <form
                  className="mt-8 max-w-[590px]"
                  onSubmit={(event) => {
                    event.preventDefault();
                    navigate({ to: "/discover", search: { q: query || undefined } });
                  }}
                >
                  <label htmlFor="home-search" className="sr-only">
                    {t("searchLabel")}
                  </label>
                  <div className="flex min-h-[58px] items-center gap-3 rounded-[22px] border border-slate-200 bg-white px-5 shadow-[0_12px_34px_-24px_rgba(15,23,42,0.34)] transition focus-within:border-primary/45 focus-within:shadow-[0_18px_42px_-26px_rgba(0,102,255,0.32)]">
                    <Search className="size-5 shrink-0 text-slate-400" aria-hidden="true" />
                    <input
                      id="home-search"
                      value={query}
                      onChange={(event) => setQuery(event.target.value)}
                      placeholder={t("search")}
                      className="w-full bg-transparent text-[15px] outline-none placeholder:text-slate-400"
                    />
                  </div>
                </form>

                <div className="mt-4 flex max-w-[590px] flex-col gap-3 sm:flex-row">
                  <Button
                    size="lg"
                    onClick={() => navigate({ to: "/discover" })}
                    className="min-h-[54px] rounded-2xl px-7 sm:flex-1"
                  >
                    {t("explore")}
                    <Arrow className="size-5" aria-hidden="true" />
                  </Button>
                  <Button
                    size="lg"
                    variant="outline"
                    onClick={() => navigate({ to: "/preferences" })}
                    className="min-h-[54px] rounded-2xl border-slate-200 bg-white px-7 sm:flex-1"
                  >
                    {t("setNeeds")}
                  </Button>
                </div>
              </div>

              <div className="order-1 flex min-h-[42vh] items-center justify-center md:order-2 md:min-h-0">
                <HomeHero label={copy.heroVisualLabel} />
              </div>
            </div>
          </section>

          <section aria-labelledby="recent-title" className="border-t border-slate-100 bg-white">
            <div className="mx-auto max-w-[1320px] px-5 py-14 md:px-8 md:py-20 lg:px-10">
              <SectionHeading
                id="recent-title"
                eyebrow={copy.recentEyebrow}
                title={t("recentlyUpdated")}
                body={copy.recentBody}
                action={{ label: copy.viewAll, to: "/discover" }}
              />

              <div className="mt-8 flex snap-x gap-4 overflow-x-auto pb-3 md:grid md:grid-cols-3 md:overflow-visible md:pb-0">
                {recent.map((facility) => {
                  const decision = decideFor(facility, needs);
                  return (
                    <Link
                      key={facility.id}
                      to="/facility/$id"
                      params={{ id: facility.id }}
                      className="group min-w-[82%] snap-start overflow-hidden rounded-[26px] border border-slate-200/80 bg-white shadow-[0_20px_55px_-40px_rgba(15,23,42,0.34)] transition duration-300 hover:-translate-y-1 hover:shadow-[0_26px_60px_-38px_rgba(15,23,42,0.4)] sm:min-w-[48%] md:min-w-0"
                    >
                      <div className="aspect-[16/10] overflow-hidden bg-slate-100">
                        {facility.imageUrl ? (
                          <img
                            src={facility.imageUrl}
                            alt={pick(facility.imageAlt)}
                            loading="lazy"
                            className="h-full w-full object-cover transition duration-500 group-hover:scale-[1.025]"
                          />
                        ) : (
                          <div className="flex h-full items-center justify-center text-sm text-slate-400">
                            {t("noPhoto")}
                          </div>
                        )}
                      </div>
                      <div className="p-5">
                        <div className="flex items-start justify-between gap-4">
                          <div>
                            <h3 className="line-clamp-1 text-lg font-bold text-slate-950">
                              {pick(facility.name)}
                            </h3>
                            <p className="mt-1.5 flex items-center gap-1.5 text-sm text-slate-500">
                              <MapPin className="size-4" aria-hidden="true" />
                              {pick(facility.area)}
                            </p>
                          </div>
                          <span
                            className={`shrink-0 rounded-full px-3 py-1 text-xs font-bold ${verdictClass(decision.verdict)}`}
                          >
                            {pick(VERDICT_LABEL[decision.verdict])}
                          </span>
                        </div>
                        <div className="mt-5 flex items-center justify-between border-t border-slate-100 pt-4 text-xs text-slate-500">
                          <span>{copy.lastUpdated}</span>
                          <span>{relativeDate(facility.lastVerifiedISO, lang)}</span>
                        </div>
                      </div>
                    </Link>
                  );
                })}
              </div>
            </div>
          </section>

          <section className="bg-[#f8fbff]">
            <div className="mx-auto max-w-[1180px] px-5 py-16 md:px-8 md:py-24">
              <SectionHeading eyebrow={copy.howEyebrow} title={copy.howTitle} body={copy.howBody} centered />
              <div className="mt-10 grid gap-4 md:grid-cols-3">
                {copy.steps.map((step, index) => (
                  <article
                    key={step.title}
                    className="rounded-[28px] border border-white/80 bg-white p-6 shadow-[0_20px_55px_-44px_rgba(15,23,42,0.32)] md:p-7"
                  >
                    <div className="flex size-11 items-center justify-center rounded-full bg-primary text-sm font-bold text-white">
                      {index + 1}
                    </div>
                    <h3 className="mt-6 text-xl font-bold text-slate-950">{step.title}</h3>
                    <p className="mt-3 leading-7 text-slate-600">{step.body}</p>
                  </article>
                ))}
              </div>
            </div>
          </section>

          <section className="bg-white">
            <div className="mx-auto grid max-w-[1280px] items-center gap-10 px-5 py-16 md:grid-cols-[1.05fr_0.95fr] md:px-8 md:py-24 lg:gap-16">
              <EvidenceVisual imageUrl={recent[0]?.imageUrl} imageAlt={recent[0] ? pick(recent[0].imageAlt) : ""} />
              <div className="max-w-[560px]">
                <p className="text-xs font-extrabold tracking-[0.14em] text-primary md:text-sm">{copy.aiKicker}</p>
                <h2 className="mt-4 text-3xl font-bold leading-tight tracking-[-0.025em] text-slate-950 md:text-5xl">
                  {copy.aiTitle}
                </h2>
                <p className="mt-5 text-base leading-8 text-slate-600 md:text-lg">{copy.aiBody}</p>
                <div className="mt-7 flex flex-wrap gap-2.5">
                  <TrustChip icon={Sparkles} text="AI Observes." />
                  <TrustChip icon={ShieldCheck} text="Humans Verify." />
                  <TrustChip icon={CircleCheck} text={copy.publishAfterReview} />
                </div>
              </div>
            </div>
          </section>

          <section className="px-5 pb-16 md:px-8 md:pb-24">
            <div className="mx-auto max-w-[1280px] overflow-hidden rounded-[32px] bg-slate-950 px-6 py-10 text-white md:px-10 md:py-12 lg:flex lg:items-center lg:justify-between lg:gap-10">
              <div className="max-w-[760px]">
                <p className="text-sm font-bold text-[#65ff74]">{copy.contributeEyebrow}</p>
                <h2 className="mt-3 text-3xl font-bold leading-tight md:text-4xl">{copy.contributeTitle}</h2>
                <p className="mt-4 max-w-[680px] leading-7 text-white/68">{copy.contributeBody}</p>
              </div>
              <Button
                size="lg"
                onClick={() => navigate({ to: "/contribute" })}
                className="mt-7 min-h-[54px] rounded-2xl px-7 lg:mt-0 lg:shrink-0"
              >
                {copy.contributeCta}
                <Camera className="size-5" aria-hidden="true" />
              </Button>
            </div>
          </section>
        </main>

        <footer className="border-t border-slate-100 bg-white">
          <div className="mx-auto flex max-w-[1280px] flex-col gap-4 px-5 py-8 text-sm text-slate-500 md:flex-row md:items-center md:justify-between md:px-8">
            <MutahLogo className="h-7" />
            <p>{lang === "ar" ? "اعرف قبل أن تصل." : "Know before you go."}</p>
          </div>
        </footer>

        <nav
          aria-label={t("bottomNav")}
          className="fixed inset-x-0 bottom-0 z-50 border-t border-slate-200 bg-white/96 backdrop-blur-xl md:hidden"
        >
          <ul className="mx-auto grid max-w-md grid-cols-5 px-1">
            {bottomNav.map(({ to, ar, en, icon: Icon, prominent }) => (
              <li key={to}>
                <Link
                  to={to}
                  className={`flex min-h-16 flex-col items-center justify-center gap-1 text-[11px] font-bold ${
                    prominent ? "text-primary" : "text-slate-500"
                  }`}
                  activeProps={{ className: "text-primary" }}
                >
                  <span
                    className={
                      prominent
                        ? "-mt-4 flex size-12 items-center justify-center rounded-full bg-primary text-white shadow-lg ring-4 ring-white"
                        : "flex size-8 items-center justify-center"
                    }
                  >
                    <Icon className={prominent ? "size-6" : "size-5"} aria-hidden="true" />
                  </span>
                  {lang === "ar" ? ar : en}
                </Link>
              </li>
            ))}
          </ul>
        </nav>
      </div>
    </>
  );
}

function SectionHeading({
  id,
  eyebrow,
  title,
  body,
  action,
  centered = false,
}: {
  id?: string;
  eyebrow?: string;
  title: string;
  body?: string;
  action?: { label: string; to: "/discover" };
  centered?: boolean;
}) {
  return (
    <div
      className={`flex flex-col gap-3 ${
        centered ? "items-center text-center" : "md:flex-row md:items-end md:justify-between"
      }`}
    >
      <div className={centered ? "max-w-2xl" : ""}>
        {eyebrow ? <p className="text-xs font-extrabold tracking-[0.14em] text-primary md:text-sm">{eyebrow}</p> : null}
        <h2 id={id} className={`${eyebrow ? "mt-3" : ""} text-2xl font-bold tracking-[-0.02em] text-slate-950 md:text-4xl`}>
          {title}
        </h2>
        {body ? <p className="mt-3 max-w-2xl leading-7 text-slate-600 md:text-lg">{body}</p> : null}
      </div>
      {action ? (
        <Link to={action.to} className="mt-1 text-sm font-bold text-primary hover:underline md:mt-0">
          {action.label}
        </Link>
      ) : null}
    </div>
  );
}

function HomeHero({ label }: { label: string }) {
  return (
    <picture className="relative block w-full max-w-[780px]">
      <source media="(min-width: 768px)" srcSet="/assets/home/mutah-home-web.webp" />
      <img
        src="/assets/home/mutah-home-mobile.webp"
        width={1520}
        height={2688}
        alt={label}
        loading="eager"
        fetchPriority="high"
        decoding="async"
        className="mx-auto max-h-[46vh] w-auto max-w-full object-contain md:max-h-none md:w-full"
        style={{
          WebkitMaskImage:
            "linear-gradient(to bottom, transparent 0%, black 7%, black 92%, transparent 100%)",
          maskImage: "linear-gradient(to bottom, transparent 0%, black 7%, black 92%, transparent 100%)",
        }}
      />
    </picture>
  );
}

const SPLASH_SESSION_KEY = "mutah-home-splash-seen";

function HomeSplash() {
  const [show, setShow] = useState(false);
  const [leaving, setLeaving] = useState(false);

  useEffect(() => {
    const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const seen = window.sessionStorage.getItem(SPLASH_SESSION_KEY) === "1";
    if (reduceMotion || seen) return;

    window.sessionStorage.setItem(SPLASH_SESSION_KEY, "1");
    setShow(true);
  }, []);

  useEffect(() => {
    if (!show) return;

    const finish = () => {
      setLeaving(true);
      window.setTimeout(() => setShow(false), 380);
    };
    const fallback = window.setTimeout(finish, 6000);
    return () => window.clearTimeout(fallback);
  }, [show]);

  if (!show) return null;

  const finish = () => {
    setLeaving(true);
    window.setTimeout(() => setShow(false), 380);
  };

  return (
    <div
      aria-hidden="true"
      className={`pointer-events-none fixed inset-0 z-[100] flex items-center justify-center bg-white transition-opacity duration-500 motion-reduce:hidden ${
        leaving ? "opacity-0" : "opacity-100"
      }`}
    >
      <video
        autoPlay
        muted
        playsInline
        preload="auto"
        onEnded={finish}
        onError={finish}
        className="size-full object-contain"
      >
        <source src="/assets/home/mutah-splash-intro.mp4" type="video/mp4" />
      </video>
    </div>
  );
}

function EvidenceVisual({ imageUrl, imageAlt }: { imageUrl?: string; imageAlt: string }) {
  return (
    <div className="relative mx-auto w-full max-w-[620px] overflow-hidden rounded-[32px] bg-[#f7fbff] p-5 md:p-7">
      <div className="relative aspect-[4/3] overflow-hidden rounded-[24px] bg-white shadow-[0_25px_60px_-40px_rgba(15,23,42,0.4)]">
        {imageUrl ? (
          <img src={imageUrl} alt={imageAlt} loading="lazy" className="h-full w-full object-cover" />
        ) : (
          <div className="h-full w-full bg-[linear-gradient(145deg,#f8fafc,#eaf3ff)]" aria-hidden="true" />
        )}
        <div aria-hidden="true" className="absolute inset-0 bg-gradient-to-t from-slate-950/18 via-transparent to-transparent" />
        <div aria-hidden="true" className="absolute inset-y-[12%] end-[12%] w-[58%] rounded-[24px] border border-primary/20 bg-primary/5 backdrop-blur-[1px]" />
        <div aria-hidden="true" className="absolute inset-y-[18%] end-[7%] w-[58%] rounded-[24px] border border-[#00d948]/30 bg-[#00ff00]/5" />
        <div className="absolute bottom-5 start-5 flex items-center gap-2 rounded-full bg-white/92 px-4 py-2 text-xs font-bold text-slate-700 shadow-sm backdrop-blur">
          <CircleCheck className="size-4 text-[#00b83e]" aria-hidden="true" />
          AI Observes. Humans Verify.
        </div>
      </div>
    </div>
  );
}

function TrustChip({ icon: Icon, text }: { icon: typeof Sparkles; text: string }) {
  return (
    <span className="inline-flex min-h-10 items-center gap-2 rounded-full border border-slate-200 bg-white px-4 text-sm font-bold text-slate-700">
      <Icon className="size-4 text-primary" aria-hidden="true" />
      {text}
    </span>
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
  recentEyebrow: "معلومات حديثة",
  recentBody: "استكشف أماكن أضيفت أو تمت مراجعة أدلة الوصول فيها مؤخرًا.",
  viewAll: "عرض جميع الأماكن",
  lastUpdated: "آخر تحديث",
  howEyebrow: "ثلاث خطوات واضحة",
  howTitle: "كيف يعمل مُتاح؟",
  howBody: "من احتياجك إلى الدليل ثم القرار — بدون تعقيد أو تصنيف طبي.",
  steps: [
    { title: "حدد ما تحتاجه", body: "اختر احتياجات الوصول التي تهمك قبل بدء الرحلة." },
    { title: "استكشف الأدلة", body: "شاهد الصور، حالة التحقق، وما هو معروف وما يزال غير موثق." },
    { title: "قرر قبل الزيارة", body: "افهم مدى ملاءمة المكان لاحتياجاتك قبل أن تصل." },
  ],
  aiKicker: "من الصورة إلى قرار أوضح",
  aiTitle: "الذكاء الاصطناعي يرصد. والإنسان يتحقق.",
  aiBody:
    "يحوّل مُتاح الصور إلى أدلة وصول قابلة للفهم، ويُظهر ما هو غير واضح بدل التخمين، ثم تمر المعلومة بمراجعة بشرية قبل النشر.",
  publishAfterReview: "النشر بعد المراجعة",
  contributeEyebrow: "المجتمع جزء من الثقة",
  contributeTitle: "معلومة واحدة قد تفتح الطريق لشخص آخر",
  contributeBody: "صورة حديثة أو تحديث بسيط يمكن أن يساعد الآخرين على اتخاذ قرار أوضح قبل الزيارة.",
  contributeCta: "ساهم الآن",
};

const EN = {
  heroBody: "Clear, verified access information that helps you decide before you visit.",
  heroVisualLabel: "From uncertainty to clarity before the journey",
  recentEyebrow: "Fresh information",
  recentBody: "Explore places with recently added or reviewed accessibility evidence.",
  viewAll: "View all places",
  lastUpdated: "Last updated",
  howEyebrow: "Three clear steps",
  howTitle: "How MUTAH works",
  howBody: "From your needs to evidence to a decision — without complexity or medical classification.",
  steps: [
    { title: "Choose what matters", body: "Select the access needs that matter before the journey begins." },
    { title: "Explore the evidence", body: "See photos, verification state, what is known and what is still undocumented." },
    { title: "Decide before you go", body: "Understand whether the place fits your needs before you arrive." },
  ],
  aiKicker: "From image to a clearer decision",
  aiTitle: "AI observes. Humans verify.",
  aiBody:
    "MUTAH turns images into understandable access evidence, keeps uncertainty visible instead of guessing, and requires human review before publication.",
  publishAfterReview: "Published after review",
  contributeEyebrow: "Community builds trust",
  contributeTitle: "One update can open the way for someone else",
  contributeBody: "A recent photo or simple update can help someone else make a clearer decision before visiting.",
  contributeCta: "Contribute now",
};
