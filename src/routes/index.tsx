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
import { MUTAH_ASSETS } from "@/content/assets";
import { HOME_COPY } from "@/content/home";
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
  const { pick, lang } = useLang();
  const [query, setQuery] = useState("");
  const copy = HOME_COPY[lang === "ar" ? "ar" : "en"];
  const Arrow = lang === "ar" ? ArrowLeft : ArrowRight;

  const recent = [...facilities]
    .sort((a, b) => b.lastVerifiedISO.localeCompare(a.lastVerifiedISO))
    .slice(0, 3);

  return (
    <>
      <HomeSplash />
      <div className="min-h-dvh bg-white pb-20 text-foreground md:pb-0">
        <header className="sticky top-0 z-40 border-b border-slate-100/90 bg-white/94 backdrop-blur-xl">
          <div className="mx-auto flex h-[68px] max-w-[1440px] items-center justify-between gap-4 px-4 sm:px-6 lg:px-10">
            <Link to="/" aria-label="MUTAH home" className="shrink-0">
              <MutahLogo className="h-8 md:h-9" />
            </Link>

            <nav aria-label="Main navigation" className="hidden items-center gap-1 lg:flex">
              <HeaderLink to="/" active ar="الرئيسية" en="Home" lang={lang} />
              <HeaderLink to="/discover" ar="استكشف" en="Explore" lang={lang} />
              <HeaderLink to="/contribute" ar="ساهم" en="Contribute" lang={lang} />
              <HeaderLink to="/ecosystem" ar="مُتاح" en="MUTAH" lang={lang} />
            </nav>

            <LanguageSwitcher />
          </div>
        </header>

        <main id="main-content">
          <section className="overflow-hidden bg-white">
            <div className="mx-auto grid max-w-[1440px] items-center gap-8 px-4 pb-10 pt-5 sm:px-6 md:grid-cols-[0.92fr_1.08fr] md:gap-8 md:pb-12 md:pt-8 lg:gap-12 lg:px-10 lg:pb-16 lg:pt-10 xl:gap-16">
              <div className="order-2 max-w-[590px] md:order-1 md:justify-self-start rtl:md:justify-self-end">
                <p className="text-xs font-extrabold tracking-[0.16em] text-primary md:text-sm">
                  {copy.eyebrow}
                </p>
                <h1 className="mt-3 text-[clamp(2.55rem,4vw,4.65rem)] font-bold leading-[1.04] tracking-[-0.035em] text-slate-950">
                  {copy.heroTitle}
                </h1>
                <p className="mt-4 max-w-[540px] text-base leading-8 text-slate-600 md:text-lg lg:text-[1.15rem]">
                  {copy.heroBody}
                </p>

                <form
                  className="mt-6 max-w-[560px]"
                  onSubmit={(event) => {
                    event.preventDefault();
                    navigate({ to: "/discover", search: { q: query || undefined } });
                  }}
                >
                  <label htmlFor="home-search" className="sr-only">
                    {copy.searchPlaceholder}
                  </label>
                  <div className="flex h-[56px] items-center gap-3 rounded-[18px] border border-slate-200 bg-white px-5 shadow-[0_14px_36px_-28px_rgba(15,23,42,0.4)] transition focus-within:border-primary/45 focus-within:shadow-[0_18px_42px_-26px_rgba(0,102,255,0.28)]">
                    <Search className="size-5 shrink-0 text-slate-400" aria-hidden="true" />
                    <input
                      id="home-search"
                      value={query}
                      onChange={(event) => setQuery(event.target.value)}
                      placeholder={copy.searchPlaceholder}
                      className="w-full bg-transparent text-[15px] outline-none placeholder:text-slate-400"
                    />
                  </div>
                </form>

                <div className="mt-3 flex max-w-[560px] flex-col gap-3 sm:flex-row">
                  <Button
                    size="lg"
                    onClick={() => navigate({ to: "/discover" })}
                    className="h-[52px] rounded-[16px] px-7 sm:flex-1"
                  >
                    {copy.primaryCta}
                    <Arrow className="size-5" aria-hidden="true" />
                  </Button>
                  <Button
                    size="lg"
                    variant="outline"
                    onClick={() => navigate({ to: "/preferences" })}
                    className="h-[52px] rounded-[16px] border-slate-200 bg-white px-7 sm:flex-1"
                  >
                    {copy.secondaryCta}
                  </Button>
                </div>
              </div>

              <div className="order-1 md:order-2">
                <HomeHero label={copy.heroVisualLabel} />
              </div>
            </div>
          </section>

          <section aria-labelledby="recent-title" className="border-t border-slate-100 bg-white">
            <div className="mx-auto max-w-[1320px] px-4 py-12 sm:px-6 md:py-16 lg:px-8 lg:py-18">
              <SectionHeading
                id="recent-title"
                eyebrow={copy.recentEyebrow}
                title={copy.recentTitle}
                body={copy.recentBody}
                action={{ label: copy.viewAll, to: "/discover" }}
              />

              <div className="mt-7 grid gap-4 md:grid-cols-3">
                {recent.map((facility, index) => {
                  const decision = decideFor(facility, needs);
                  return (
                    <Link
                      key={facility.id}
                      to="/facility/$id"
                      params={{ id: facility.id }}
                      className={`group overflow-hidden rounded-[24px] border border-slate-200/80 bg-white shadow-[0_18px_48px_-40px_rgba(15,23,42,0.42)] transition duration-300 hover:-translate-y-1 hover:shadow-[0_24px_60px_-38px_rgba(15,23,42,0.42)] ${
                        index === 2 ? "hidden md:block" : ""
                      }`}
                    >
                      <div className="aspect-[16/9] overflow-hidden bg-slate-100">
                        {facility.imageUrl ? (
                          <img
                            src={facility.imageUrl}
                            alt={pick(facility.imageAlt)}
                            loading="lazy"
                            className="h-full w-full object-cover transition duration-500 group-hover:scale-[1.025]"
                          />
                        ) : (
                          <div className="flex h-full items-center justify-center text-sm text-slate-400">No photo</div>
                        )}
                      </div>
                      <div className="p-5">
                        <div className="flex items-start justify-between gap-4">
                          <div className="min-w-0">
                            <h3 className="line-clamp-1 text-lg font-bold text-slate-950">{pick(facility.name)}</h3>
                            <p className="mt-1.5 flex items-center gap-1.5 text-sm text-slate-500">
                              <MapPin className="size-4" aria-hidden="true" />
                              {pick(facility.area)}
                            </p>
                          </div>
                          <span className={`shrink-0 rounded-full px-3 py-1 text-xs font-bold ${verdictClass(decision.verdict)}`}>
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
            <div className="mx-auto max-w-[1180px] px-4 py-14 sm:px-6 md:py-20 lg:px-8">
              <SectionHeading eyebrow={copy.howEyebrow} title={copy.howTitle} body={copy.howBody} centered />

              <div className="mt-9 grid gap-4 md:grid-cols-3">
                {copy.steps.map((step, index) => (
                  <article key={step.title} className="rounded-[24px] border border-white bg-white p-6 shadow-[0_18px_50px_-44px_rgba(15,23,42,0.35)]">
                    <div className="flex items-center gap-3">
                      <div className="flex size-11 items-center justify-center rounded-full bg-primary-soft text-base font-bold text-primary">
                        {index + 1}
                      </div>
                      <h3 className="text-xl font-bold text-slate-950">{step.title}</h3>
                    </div>
                    <p className="mt-4 leading-7 text-slate-600">{step.body}</p>
                  </article>
                ))}
              </div>
            </div>
          </section>

          <section className="bg-white">
            <div className="mx-auto grid max-w-[1240px] items-center gap-9 px-4 py-14 sm:px-6 md:grid-cols-[1.02fr_0.98fr] md:py-20 lg:gap-14 lg:px-8">
              <EvidenceVisual imageUrl={recent[0]?.imageUrl} imageAlt={recent[0] ? pick(recent[0].imageAlt) : ""} />

              <div className="max-w-[560px]">
                <p className="text-xs font-extrabold tracking-[0.14em] text-primary md:text-sm">{copy.aiKicker}</p>
                <h2 className="mt-3 text-3xl font-bold leading-tight tracking-[-0.025em] text-slate-950 md:text-5xl">
                  {copy.aiTitle}
                </h2>
                <p className="mt-4 text-base leading-8 text-slate-600 md:text-lg">{copy.aiBody}</p>
                <div className="mt-6 flex flex-wrap gap-2.5">
                  <TrustChip icon={Sparkles} text="AI Observes." />
                  <TrustChip icon={ShieldCheck} text="Humans Verify." />
                  <TrustChip icon={CircleCheck} text={copy.publishAfterReview} />
                </div>
              </div>
            </div>
          </section>

          <section className="px-4 pb-14 sm:px-6 md:pb-20 lg:px-8">
            <div className="mx-auto max-w-[1240px] overflow-hidden rounded-[30px] border border-primary/10 bg-[linear-gradient(135deg,#f7fbff_0%,#eef8ff_52%,#f4fff7_100%)] px-6 py-8 md:flex md:items-center md:justify-between md:gap-10 md:px-9 md:py-10">
              <div className="max-w-[760px]">
                <p className="text-sm font-bold text-primary">{copy.contributeEyebrow}</p>
                <h2 className="mt-2 text-3xl font-bold leading-tight text-slate-950 md:text-4xl">{copy.contributeTitle}</h2>
                <p className="mt-3 max-w-[680px] leading-7 text-slate-600">{copy.contributeBody}</p>
              </div>
              <Button
                size="lg"
                onClick={() => navigate({ to: "/contribute" })}
                className="mt-6 h-[52px] rounded-[16px] px-7 md:mt-0 md:shrink-0"
              >
                {copy.contributeCta}
                <Camera className="size-5" aria-hidden="true" />
              </Button>
            </div>
          </section>
        </main>

        <footer className="border-t border-slate-100 bg-white">
          <div className="mx-auto flex max-w-[1240px] flex-col gap-4 px-4 py-8 text-sm text-slate-500 sm:px-6 md:flex-row md:items-center md:justify-between lg:px-8">
            <MutahLogo className="h-7" />
            <p>{lang === "ar" ? "اعرف قبل أن تصل." : "Know before you go."}</p>
          </div>
        </footer>

        <BottomNav lang={lang} />
      </div>
    </>
  );
}

function HeaderLink({
  to,
  ar,
  en,
  lang,
  active = false,
}: {
  to: "/" | "/discover" | "/contribute" | "/ecosystem";
  ar: string;
  en: string;
  lang: string;
  active?: boolean;
}) {
  return (
    <Link
      to={to}
      className={
        active
          ? "rounded-full bg-primary-soft px-5 py-2.5 text-sm font-bold text-primary"
          : "rounded-full px-5 py-2.5 text-sm font-semibold text-slate-700 transition hover:bg-slate-50"
      }
    >
      {lang === "ar" ? ar : en}
    </Link>
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
    <div className={`flex flex-col gap-3 ${centered ? "items-center text-center" : "md:flex-row md:items-end md:justify-between"}`}>
      <div className={centered ? "max-w-2xl" : ""}>
        {eyebrow ? <p className="text-xs font-extrabold tracking-[0.14em] text-primary md:text-sm">{eyebrow}</p> : null}
        <h2 id={id} className={`${eyebrow ? "mt-2" : ""} text-2xl font-bold tracking-[-0.02em] text-slate-950 md:text-4xl`}>
          {title}
        </h2>
        {body ? <p className="mt-2 max-w-2xl leading-7 text-slate-600 md:text-lg">{body}</p> : null}
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
    <picture className="block w-full">
      <source media="(min-width: 768px)" srcSet={MUTAH_ASSETS.home.heroDesktop} />
      <img
        src={MUTAH_ASSETS.home.heroMobile}
        width={1520}
        height={2688}
        alt={label}
        loading="eager"
        fetchPriority="high"
        decoding="async"
        className="mx-auto h-auto max-h-[430px] w-full max-w-[420px] object-contain md:max-h-none md:max-w-none md:rounded-[22px] md:object-cover"
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
    const fallback = window.setTimeout(() => finishSplash(setLeaving, setShow), 6000);
    return () => window.clearTimeout(fallback);
  }, [show]);

  if (!show) return null;

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
        onEnded={() => finishSplash(setLeaving, setShow)}
        onError={() => finishSplash(setLeaving, setShow)}
        className="size-full object-contain"
      >
        <source src={MUTAH_ASSETS.home.splashVideo} type="video/mp4" />
      </video>
    </div>
  );
}

function finishSplash(
  setLeaving: (value: boolean) => void,
  setShow: (value: boolean) => void,
) {
  setLeaving(true);
  window.setTimeout(() => setShow(false), 380);
}

function EvidenceVisual({ imageUrl, imageAlt }: { imageUrl?: string; imageAlt: string }) {
  return (
    <div className="relative mx-auto w-full max-w-[600px] overflow-hidden rounded-[30px] bg-[#f7fbff] p-4 md:p-6">
      <div className="relative aspect-[4/3] overflow-hidden rounded-[22px] bg-white shadow-[0_24px_60px_-42px_rgba(15,23,42,0.4)]">
        {imageUrl ? (
          <img src={imageUrl} alt={imageAlt} loading="lazy" className="h-full w-full object-cover" />
        ) : (
          <div className="h-full w-full bg-[linear-gradient(145deg,#f8fafc,#eaf3ff)]" aria-hidden="true" />
        )}
        <div aria-hidden="true" className="absolute inset-0 bg-gradient-to-t from-slate-950/16 via-transparent to-transparent" />
        <div aria-hidden="true" className="absolute inset-y-[12%] end-[12%] w-[58%] rounded-[22px] border border-primary/20 bg-primary/5 backdrop-blur-[1px]" />
        <div aria-hidden="true" className="absolute inset-y-[18%] end-[7%] w-[58%] rounded-[22px] border border-[#00d948]/30 bg-[#00ff00]/5" />
        <div className="absolute bottom-4 start-4 flex items-center gap-2 rounded-full bg-white/92 px-4 py-2 text-xs font-bold text-slate-700 shadow-sm backdrop-blur">
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

function BottomNav({ lang }: { lang: string }) {
  return (
    <nav aria-label="Bottom navigation" className="fixed inset-x-0 bottom-0 z-50 border-t border-slate-200 bg-white/96 backdrop-blur-xl md:hidden">
      <ul className="mx-auto grid max-w-md grid-cols-5 px-1">
        {bottomNav.map(({ to, ar, en, icon: Icon, prominent }) => (
          <li key={to}>
            <Link
              to={to}
              className={`flex min-h-16 flex-col items-center justify-center gap-1 text-[11px] font-bold ${prominent ? "text-primary" : "text-slate-500"}`}
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
