import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import {
  ArrowLeft,
  ArrowRight,
  Camera,
  CircleCheck,
  Compass,
  Eye,
  Home as HomeIcon,
  MapPin,
  Network,
  Search,
  ShieldCheck,
  Sparkles,
  UserRound,
} from "lucide-react";
import { type CSSProperties, useEffect, useState } from "react";
import { LanguageSwitcher } from "@/components/mutah/LanguageSwitcher";
import { MutahLogo } from "@/components/mutah/Logo";
import { Button } from "@/components/mutah/ui";
import { MUTAH_ASSETS } from "@/content/assets";
import { HOME_COPY, type HomeCopy } from "@/content/home";
import { SHARED_COPY, type SharedCopy } from "@/content/shared";
import { decideFor, VERDICT_LABEL } from "@/lib/mutah/decision";
import { MUTAH_DESIGN_TOKENS } from "@/lib/mutah/design-tokens";
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

type HomePath = "/" | "/discover" | "/contribute" | "/ecosystem" | "/preferences";
type NavigationLabel = "home" | "explore" | "contribute" | "mutah" | "account";

type BottomNavItem = {
  to: HomePath;
  label: NavigationLabel;
  icon: typeof HomeIcon;
  prominent?: boolean;
};

const bottomNav: readonly BottomNavItem[] = [
  { to: "/", label: "home", icon: HomeIcon },
  { to: "/discover", label: "explore", icon: Compass },
  { to: "/contribute", label: "contribute", icon: Camera, prominent: true },
  { to: "/ecosystem", label: "mutah", icon: Network },
  { to: "/preferences", label: "account", icon: UserRound },
] as const;

const HOME_TOKEN_STYLE = {
  "--home-content-max": MUTAH_DESIGN_TOKENS.layout.contentMax,
  "--home-wide-max": MUTAH_DESIGN_TOKENS.layout.wideMax,
  "--home-header-desktop": MUTAH_DESIGN_TOKENS.layout.headerHeightDesktop,
  "--home-header-mobile": MUTAH_DESIGN_TOKENS.layout.headerHeightMobile,
  "--home-bottom-nav": MUTAH_DESIGN_TOKENS.layout.bottomNavHeight,
  "--home-hero-desktop": MUTAH_DESIGN_TOKENS.typography.heroDesktop,
  "--home-hero-mobile": MUTAH_DESIGN_TOKENS.typography.heroMobile,
  "--home-h2-desktop": MUTAH_DESIGN_TOKENS.typography.h2Desktop,
  "--home-h2-mobile": MUTAH_DESIGN_TOKENS.typography.h2Mobile,
} as CSSProperties;

function Home() {
  const navigate = useNavigate();
  const { facilities, needs } = useMutah();
  const { pick, lang } = useLang();
  const [query, setQuery] = useState("");
  const locale = lang === "ar" ? "ar" : "en";
  const copy = HOME_COPY[locale];
  const shared = SHARED_COPY[locale];
  const Arrow = locale === "ar" ? ArrowLeft : ArrowRight;
  const heroColumns =
    locale === "ar" ? "lg:grid-cols-[1.08fr_0.92fr]" : "lg:grid-cols-[0.92fr_1.08fr]";
  const heroContentColumn = locale === "ar" ? "lg:col-start-2" : "lg:col-start-1";
  const heroVisualColumn = locale === "ar" ? "lg:col-start-1" : "lg:col-start-2";

  const recent = [...facilities]
    .sort((a, b) => b.lastVerifiedISO.localeCompare(a.lastVerifiedISO))
    .slice(0, 3);

  return (
    <>
      <HomeSplash />
      <div
        style={HOME_TOKEN_STYLE}
        className="min-h-dvh bg-white pb-[var(--home-bottom-nav)] text-foreground lg:pb-0"
      >
        <header className="sticky top-0 z-40 border-b border-slate-100/90 bg-white/95 backdrop-blur-xl">
          <div className="mx-auto flex h-[var(--home-header-mobile)] max-w-[var(--home-wide-max)] items-center justify-between gap-4 px-4 sm:px-6 lg:h-[var(--home-header-desktop)] lg:px-10">
            <Link to="/" aria-label={copy.navigation.home} className="shrink-0">
              <MutahLogo className="h-8 lg:h-9" />
            </Link>

            <nav
              aria-label={copy.navigation.mainLabel}
              className="hidden items-center gap-1 lg:flex"
            >
              <HeaderLink to="/" active label={copy.navigation.home} />
              <HeaderLink to="/discover" label={shared.explore} />
              <HeaderLink to="/contribute" label={shared.contribute} />
              <HeaderLink to="/ecosystem" label={copy.navigation.mutah} />
            </nav>

            <LanguageSwitcher />
          </div>
        </header>

        <main id="main-content">
          <section className="overflow-hidden bg-white">
            <div
              dir="ltr"
              className={`mx-auto grid max-w-[var(--home-wide-max)] items-center gap-5 pb-10 pt-3 sm:px-6 sm:pt-5 md:gap-7 md:pb-12 lg:min-h-[560px] lg:gap-10 lg:px-10 lg:py-5 xl:min-h-[600px] xl:gap-14 ${heroColumns}`}
            >
              <div
                dir={locale === "ar" ? "rtl" : "ltr"}
                className={`order-2 px-4 sm:px-0 lg:row-start-1 lg:max-w-[580px] lg:px-0 ${heroContentColumn} ${
                  locale === "ar" ? "lg:justify-self-end" : "lg:justify-self-start"
                }`}
              >
                <p className="text-xs font-extrabold tracking-[0.16em] text-primary md:text-sm">
                  {copy.eyebrow}
                </p>
                <h1 className="mt-3 text-[length:var(--home-hero-mobile)] font-bold leading-[1.04] tracking-[-0.035em] text-slate-950 min-[390px]:text-[2.55rem] md:text-[3.25rem] lg:text-[length:var(--home-hero-desktop)]">
                  {copy.heroTitle}
                </h1>
                <p className="mt-4 max-w-[540px] text-base leading-7 text-slate-600 md:text-lg md:leading-8">
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
                  <div className="flex min-h-14 items-center gap-3 rounded-2xl border border-slate-200 bg-white px-4 shadow-[0_12px_34px_-28px_rgba(15,23,42,0.45)] transition focus-within:border-primary/50 focus-within:ring-4 focus-within:ring-primary/10">
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
                    className="min-h-[52px] rounded-2xl px-7 sm:flex-1"
                  >
                    {copy.primaryCta}
                    <Arrow className="size-5" aria-hidden="true" />
                  </Button>
                  <Button
                    size="lg"
                    variant="outline"
                    onClick={() => navigate({ to: "/preferences" })}
                    className="min-h-[52px] rounded-2xl border-slate-200 bg-white px-7 sm:flex-1"
                  >
                    {copy.secondaryCta}
                  </Button>
                </div>
              </div>

              <div className={`order-1 lg:row-start-1 ${heroVisualColumn}`}>
                <HomeHero label={copy.heroVisualLabel} />
              </div>
            </div>
          </section>

          <section aria-labelledby="recent-title" className="border-t border-slate-100 bg-white">
            <div className="mx-auto max-w-[var(--home-content-max)] px-4 py-11 sm:px-6 md:py-14 lg:px-8 lg:py-16">
              <SectionHeading
                id="recent-title"
                eyebrow={copy.recentEyebrow}
                title={copy.recentTitle}
                body={copy.recentBody}
                action={{ label: copy.viewAll, to: "/discover" }}
              />

              <div className="mt-7 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                {recent.map((facility, index) => {
                  const decision = decideFor(facility, needs);
                  return (
                    <Link
                      key={facility.id}
                      to="/facility/$id"
                      params={{ id: facility.id }}
                      className={`group overflow-hidden rounded-2xl border border-slate-200 bg-white transition duration-300 hover:-translate-y-0.5 hover:border-primary/25 hover:shadow-[0_18px_44px_-36px_rgba(15,23,42,0.45)] ${
                        index === 2 ? "hidden lg:block" : ""
                      }`}
                    >
                      <div className="aspect-[16/9] overflow-hidden bg-slate-100">
                        {facility.imageUrl ? (
                          <img
                            src={facility.imageUrl}
                            alt={pick(facility.imageAlt)}
                            loading="lazy"
                            className="h-full w-full object-cover transition duration-500 group-hover:scale-[1.02]"
                          />
                        ) : (
                          <div className="flex h-full items-center justify-center text-sm text-slate-400">
                            {copy.noPhoto}
                          </div>
                        )}
                      </div>
                      <div className="p-4 md:p-5">
                        <div className="flex items-start justify-between gap-3">
                          <div className="min-w-0">
                            <h3 className="line-clamp-1 text-lg font-bold text-slate-950">
                              {pick(facility.name)}
                            </h3>
                            <p className="mt-1.5 flex items-center gap-1.5 text-sm text-slate-500">
                              <MapPin className="size-4 shrink-0" aria-hidden="true" />
                              <span className="truncate">{pick(facility.area)}</span>
                            </p>
                          </div>
                          <span
                            className={`shrink-0 rounded-full px-3 py-1 text-xs font-bold ${verdictClass(decision.verdict)}`}
                          >
                            {pick(VERDICT_LABEL[decision.verdict])}
                          </span>
                        </div>
                        <div className="mt-4 flex items-center justify-between border-t border-slate-100 pt-3 text-xs text-slate-500">
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

          <section className="bg-[#f7faff]">
            <div className="mx-auto max-w-[74rem] px-4 py-12 sm:px-6 md:py-16 lg:px-8">
              <SectionHeading
                eyebrow={copy.howEyebrow}
                title={copy.howTitle}
                body={copy.howBody}
                centered
              />

              <ol className="mt-8 grid gap-0 md:grid-cols-3" dir={locale === "ar" ? "rtl" : "ltr"}>
                {copy.steps.map((step, index) => (
                  <li
                    key={step.title}
                    className={`border-slate-200 py-5 md:px-7 md:py-2 ${index === 0 ? "" : "border-t md:border-t-0 md:border-s"}`}
                  >
                    <div className="flex items-start gap-4">
                      <span className="flex size-9 shrink-0 items-center justify-center rounded-full bg-primary text-sm font-extrabold text-white">
                        {index + 1}
                      </span>
                      <div>
                        <h3 className="text-lg font-bold text-slate-950">{step.title}</h3>
                        <p className="mt-2 leading-7 text-slate-600">{step.body}</p>
                      </div>
                    </div>
                  </li>
                ))}
              </ol>
            </div>
          </section>

          <section className="bg-white">
            <div className="mx-auto grid max-w-[var(--home-content-max)] items-center gap-8 px-4 py-12 sm:px-6 md:py-16 lg:grid-cols-[0.88fr_1.12fr] lg:gap-14 lg:px-8">
              <div className="rounded-2xl border border-primary/10 bg-[#f6f9ff] p-5 md:p-7">
                <div className="flex items-center gap-3 border-b border-primary/10 pb-5">
                  <span className="flex size-11 items-center justify-center rounded-full bg-primary text-white">
                    <Sparkles className="size-5" aria-hidden="true" />
                  </span>
                  <span className="text-sm font-bold text-primary">{copy.aiKicker}</span>
                </div>
                <ul className="divide-y divide-slate-200/80">
                  <Principle icon={Eye} text={copy.aiObserves} />
                  <Principle icon={ShieldCheck} text={copy.humansVerify} />
                  <Principle icon={CircleCheck} text={copy.notVisiblePrinciple} />
                </ul>
                <p className="border-t border-slate-200/80 pt-4 text-sm font-semibold leading-6 text-slate-500">
                  {copy.noAutoPublish}
                </p>
              </div>

              <div className="max-w-[610px]">
                <p className="text-xs font-extrabold tracking-[0.14em] text-primary md:text-sm">
                  {copy.aiKicker}
                </p>
                <h2 className="mt-3 text-[length:var(--home-h2-mobile)] font-bold leading-tight tracking-[-0.025em] text-slate-950 md:text-[length:var(--home-h2-desktop)]">
                  {copy.aiTitle}
                </h2>
                <p className="mt-4 text-base leading-8 text-slate-600 md:text-lg">{copy.aiBody}</p>
                <span className="mt-5 inline-flex min-h-10 items-center gap-2 rounded-full border border-access/20 bg-access-soft px-4 text-sm font-bold text-access-strong">
                  <CircleCheck className="size-4" aria-hidden="true" />
                  {copy.publishAfterReview}
                </span>
              </div>
            </div>
          </section>

          <section className="px-4 pb-12 sm:px-6 md:pb-16 lg:px-8">
            <div className="mx-auto max-w-[var(--home-content-max)] rounded-2xl border border-primary/15 bg-primary-soft/55 px-5 py-7 md:flex md:items-center md:justify-between md:gap-10 md:px-8 md:py-8">
              <div className="max-w-[780px]">
                <p className="text-sm font-bold text-primary">{copy.contributeEyebrow}</p>
                <h2 className="mt-2 text-[length:var(--home-h2-mobile)] font-bold leading-tight text-slate-950 md:text-[length:var(--home-h2-desktop)]">
                  {copy.contributeTitle}
                </h2>
                <p className="mt-3 max-w-[680px] leading-7 text-slate-600">{copy.contributeBody}</p>
              </div>
              <Button
                size="lg"
                onClick={() => navigate({ to: "/contribute" })}
                className="mt-6 min-h-[52px] rounded-2xl px-7 md:mt-0 md:shrink-0"
              >
                {copy.contributeCta}
                <Camera className="size-5" aria-hidden="true" />
              </Button>
            </div>
          </section>
        </main>

        <footer className="border-t border-slate-100 bg-white">
          <div className="mx-auto flex max-w-[var(--home-content-max)] flex-col gap-4 px-4 py-7 text-sm text-slate-500 sm:px-6 md:flex-row md:items-center md:justify-between lg:px-8">
            <MutahLogo className="h-7" />
            <p>{copy.footerLine}</p>
          </div>
        </footer>

        <BottomNav copy={copy} shared={shared} />
      </div>
    </>
  );
}

function HeaderLink({
  to,
  label,
  active = false,
}: {
  to: HomePath;
  label: string;
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
      {label}
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
    <div
      className={`flex flex-col gap-3 ${centered ? "items-center text-center" : "md:flex-row md:items-end md:justify-between"}`}
    >
      <div className={centered ? "max-w-2xl" : ""}>
        {eyebrow ? (
          <p className="text-xs font-extrabold tracking-[0.14em] text-primary md:text-sm">
            {eyebrow}
          </p>
        ) : null}
        <h2
          id={id}
          className={`${eyebrow ? "mt-2" : ""} text-[length:var(--home-h2-mobile)] font-bold tracking-[-0.02em] text-slate-950 md:text-[length:var(--home-h2-desktop)]`}
        >
          {title}
        </h2>
        {body ? <p className="mt-2 max-w-2xl leading-7 text-slate-600 md:text-lg">{body}</p> : null}
      </div>
      {action ? (
        <Link
          to={action.to}
          className="mt-1 text-sm font-bold text-primary hover:underline md:mt-0"
        >
          {action.label}
        </Link>
      ) : null}
    </div>
  );
}

function HomeHero({ label }: { label: string }) {
  return (
    <div className="mx-4 h-[clamp(230px,64vw,285px)] overflow-hidden bg-white sm:mx-0 sm:h-[310px] md:h-[350px] lg:h-[520px] xl:h-[570px]">
      <picture className="block size-full">
        <source media="(min-width: 768px)" srcSet={MUTAH_ASSETS.home.heroDesktop} />
        <img
          src={MUTAH_ASSETS.home.heroMobile}
          width={1520}
          height={2688}
          alt={label}
          loading="eager"
          fetchPriority="high"
          decoding="async"
          sizes="(min-width: 1024px) 55vw, (min-width: 640px) calc(100vw - 3rem), calc(100vw - 2rem)"
          className="size-full object-cover object-[center_57%] md:object-cover md:object-center lg:object-contain"
        />
      </picture>
    </div>
  );
}

const SPLASH_SESSION_KEY = "mutah-home-splash-seen";

function HomeSplash() {
  const [show, setShow] = useState(false);
  const [leaving, setLeaving] = useState(false);

  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    try {
      if (window.sessionStorage.getItem(SPLASH_SESSION_KEY) === "1") return;
      window.sessionStorage.setItem(SPLASH_SESSION_KEY, "1");
    } catch {
      return;
    }

    setShow(true);
  }, []);

  useEffect(() => {
    if (!show) return;
    const fallback = window.setTimeout(() => finishSplash(setLeaving, setShow), 7000);
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

function finishSplash(setLeaving: (value: boolean) => void, setShow: (value: boolean) => void) {
  setLeaving(true);
  window.setTimeout(() => setShow(false), 380);
}

function Principle({ icon: Icon, text }: { icon: typeof Eye; text: string }) {
  return (
    <li className="flex items-start gap-3 py-4 text-sm font-semibold leading-6 text-slate-700">
      <Icon className="mt-0.5 size-5 shrink-0 text-primary" aria-hidden="true" />
      <span>{text}</span>
    </li>
  );
}

function getNavigationLabel(label: NavigationLabel, copy: HomeCopy, shared: SharedCopy) {
  switch (label) {
    case "home":
      return copy.navigation.home;
    case "explore":
      return shared.explore;
    case "contribute":
      return shared.contribute;
    case "mutah":
      return copy.navigation.mutah;
    case "account":
      return copy.navigation.account;
  }
}

function BottomNav({ copy, shared }: { copy: HomeCopy; shared: SharedCopy }) {
  return (
    <nav
      aria-label={copy.navigation.bottomLabel}
      className="fixed inset-x-0 bottom-0 z-50 border-t border-slate-200 bg-white/96 backdrop-blur-xl lg:hidden"
    >
      <ul className="mx-auto grid h-[var(--home-bottom-nav)] max-w-md grid-cols-5 px-1">
        {bottomNav.map(({ to, label, icon: Icon, prominent }) => (
          <li key={to}>
            <Link
              to={to}
              className={`flex size-full min-w-0 flex-col items-center justify-center gap-1 text-[11px] font-bold transition ${
                prominent ? "text-primary" : "text-slate-500"
              }`}
              activeProps={{ className: "text-primary" }}
            >
              <span
                className={
                  prominent
                    ? "flex size-8 items-center justify-center rounded-xl bg-primary-soft text-primary"
                    : "flex size-8 items-center justify-center"
                }
              >
                <Icon className="size-5" aria-hidden="true" />
              </span>
              <span className="max-w-full truncate px-0.5">
                {getNavigationLabel(label, copy, shared)}
              </span>
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
