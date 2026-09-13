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
      { title: `مُتاح ماب | ${HOME_COPY.ar.heroTitle}` },
      { name: "description", content: HOME_COPY.ar.heroBody },
      { property: "og:title", content: `مُتاح ماب | ${HOME_COPY.ar.heroTitle}` },
      { property: "og:description", content: HOME_COPY.ar.heroBody },
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

const stepIcons = [Search, Camera, ShieldCheck] as const;

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
  "--home-access": MUTAH_DESIGN_TOKENS.color.brand.green,
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
  const recent = [...facilities]
    .sort((a, b) => b.lastVerifiedISO.localeCompare(a.lastVerifiedISO))
    .slice(0, 3);

  const submitSearch = () => {
    navigate({ to: "/discover", search: { q: query || undefined } });
  };

  return (
    <>
      <HomeSplash />
      <div
        style={HOME_TOKEN_STYLE}
        className="min-h-dvh bg-white pb-[calc(var(--home-bottom-nav)+env(safe-area-inset-bottom))] text-foreground lg:pb-0"
      >
        <HomeHeader copy={copy} shared={shared} />

        <main id="main-content">
          <HeroCanvas
            copy={copy}
            locale={locale}
            query={query}
            onQueryChange={setQuery}
            onSearch={submitSearch}
            onPrimary={() => navigate({ to: "/discover" })}
            onSecondary={() => navigate({ to: "/preferences" })}
            arrow={Arrow}
          />

          <section aria-labelledby="recent-title" className="border-t border-slate-100 bg-white">
            <div className="mx-auto max-w-[var(--home-content-max)] px-4 pb-12 pt-10 sm:px-6 md:pb-14 lg:px-8 lg:pb-16 lg:pt-12">
              <SectionHeading
                id="recent-title"
                eyebrow={copy.recentEyebrow}
                title={copy.recentTitle}
                body={copy.recentBody}
                action={{ label: copy.viewAll, to: "/discover" }}
              />

              <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:mt-7 lg:grid-cols-3">
                {recent.map((facility, index) => {
                  const decision = decideFor(facility, needs);
                  return (
                    <Link
                      key={facility.id}
                      to="/facility/$id"
                      params={{ id: facility.id }}
                      className={`group flex h-full flex-col overflow-hidden rounded-2xl border border-slate-200 bg-white transition duration-300 hover:-translate-y-0.5 hover:border-primary/30 hover:shadow-[0_16px_36px_-34px_rgba(15,23,42,0.55)] ${
                        index === 2 ? "hidden lg:flex" : ""
                      }`}
                    >
                      <div className="aspect-[16/9] overflow-hidden bg-slate-100">
                        {facility.imageUrl ? (
                          <img
                            src={facility.imageUrl}
                            alt={pick(facility.imageAlt)}
                            loading="lazy"
                            className="size-full object-cover transition duration-500 group-hover:scale-[1.02]"
                          />
                        ) : (
                          <div className="flex size-full items-center justify-center text-sm text-slate-400">
                            {copy.noPhoto}
                          </div>
                        )}
                      </div>
                      <div className="flex flex-1 flex-col p-4 lg:p-5">
                        <div className="flex items-center justify-between gap-3">
                          <span
                            className={`rounded-full px-3 py-1 text-xs font-bold ${verdictClass(decision.verdict)}`}
                          >
                            {pick(VERDICT_LABEL[decision.verdict])}
                          </span>
                          <span className="text-xs text-slate-500">
                            {relativeDate(facility.lastVerifiedISO, lang)}
                          </span>
                        </div>
                        <h3 className="mt-4 line-clamp-1 text-lg font-bold text-slate-950">
                          {pick(facility.name)}
                        </h3>
                        <p className="mt-1.5 flex items-center gap-1.5 text-sm text-slate-500">
                          <MapPin className="size-4 shrink-0" aria-hidden="true" />
                          <span className="truncate">{pick(facility.area)}</span>
                        </p>
                        <p className="mt-auto pt-4 text-xs text-slate-400">{copy.lastUpdated}</p>
                      </div>
                    </Link>
                  );
                })}
              </div>
            </div>
          </section>

          <section className="bg-[#f8faff]">
            <div className="mx-auto max-w-[74rem] px-4 py-12 sm:px-6 lg:px-8 lg:py-14">
              <SectionHeading
                eyebrow={copy.howEyebrow}
                title={copy.howTitle}
                body={copy.howBody}
                centered
              />

              <ol
                className="relative mt-7 grid md:grid-cols-3"
                dir={locale === "ar" ? "rtl" : "ltr"}
              >
                <div
                  aria-hidden="true"
                  className="absolute inset-x-[16.66%] top-[22px] hidden h-px bg-primary/15 md:block"
                />
                {copy.steps.map((step, index) => {
                  const StepIcon = stepIcons[index] ?? ShieldCheck;
                  return (
                    <li
                      key={step.title}
                      className={`relative flex gap-4 border-slate-200 py-4 md:flex-col md:items-center md:border-0 md:px-8 md:py-0 md:text-center ${
                        index === 0 ? "" : "border-t"
                      }`}
                    >
                      <span className="relative z-10 flex size-11 shrink-0 items-center justify-center rounded-full border border-primary/15 bg-white text-primary">
                        <StepIcon className="size-5" aria-hidden="true" />
                        <span className="absolute -end-1 -top-1 flex size-5 items-center justify-center rounded-full bg-primary text-[10px] font-extrabold text-white">
                          {index + 1}
                        </span>
                      </span>
                      <div>
                        <h3 className="text-lg font-bold text-slate-950">{step.title}</h3>
                        <p className="mt-1.5 text-sm leading-6 text-slate-600">{step.body}</p>
                      </div>
                    </li>
                  );
                })}
              </ol>
            </div>
          </section>

          <section className="bg-white">
            <div className="mx-auto grid max-w-[var(--home-content-max)] items-center gap-8 px-4 py-14 sm:px-6 lg:grid-cols-[0.95fr_1.05fr] lg:gap-16 lg:px-8 lg:py-20">
              <EvidenceBecomesAccess />

              <div className="max-w-[590px]">
                <p className="text-xs font-extrabold tracking-[0.14em] text-primary md:text-sm">
                  {copy.aiKicker}
                </p>
                <h2 className="mt-3 text-[length:var(--home-h2-mobile)] font-bold leading-tight tracking-[-0.025em] text-slate-950 md:text-[length:var(--home-h2-desktop)]">
                  {copy.aiTitle}
                </h2>
                <p className="mt-4 leading-7 text-slate-600 md:text-lg md:leading-8">
                  {copy.aiBody}
                </p>
                <ul className="mt-5 divide-y divide-slate-100 border-y border-slate-100">
                  <Principle icon={Eye} text={copy.aiObserves} />
                  <Principle icon={ShieldCheck} text={copy.humansVerify} />
                  <Principle icon={CircleCheck} text={copy.notVisiblePrinciple} />
                </ul>
                <div className="mt-5 flex flex-wrap items-center gap-3">
                  <span className="inline-flex min-h-9 items-center gap-2 rounded-full bg-access-soft px-4 text-sm font-bold text-access-strong">
                    <CircleCheck className="size-4" aria-hidden="true" />
                    {copy.publishAfterReview}
                  </span>
                  <span className="text-sm font-semibold text-slate-500">{copy.noAutoPublish}</span>
                </div>
              </div>
            </div>
          </section>

          <section className="border-y border-primary/10 bg-primary-soft/35">
            <div className="mx-auto flex max-w-[var(--home-content-max)] flex-col justify-center gap-5 px-4 py-7 sm:px-6 md:flex-row md:items-center md:justify-between md:gap-10 lg:min-h-[132px] lg:px-8 lg:py-6">
              <div className="max-w-[780px]">
                <p className="text-sm font-bold text-primary">{copy.contributeEyebrow}</p>
                <h2 className="mt-1.5 text-2xl font-bold leading-tight text-slate-950 md:text-3xl">
                  {copy.contributeTitle}
                </h2>
                <p className="mt-2 max-w-[650px] text-sm leading-6 text-slate-600 md:text-base">
                  {copy.contributeBody}
                </p>
              </div>
              <Button
                size="lg"
                onClick={() => navigate({ to: "/contribute" })}
                className="min-h-[50px] rounded-2xl px-7 md:shrink-0"
              >
                {copy.contributeCta}
                <Camera className="size-5" aria-hidden="true" />
              </Button>
            </div>
          </section>
        </main>

        <footer className="bg-white">
          <div className="mx-auto flex max-w-[var(--home-content-max)] flex-col gap-4 px-4 py-7 text-sm text-slate-500 sm:px-6 md:flex-row md:items-center md:justify-between lg:px-8">
            <div className="flex items-center gap-4">
              <MutahLogo className="h-7" />
              <p>{copy.footerLine}</p>
            </div>
            <div className="flex items-center gap-5">
              <Link to="/discover" className="font-semibold transition hover:text-primary">
                {shared.explore}
              </Link>
              <Link to="/contribute" className="font-semibold transition hover:text-primary">
                {shared.contribute}
              </Link>
            </div>
          </div>
        </footer>

        <BottomNav copy={copy} shared={shared} />
      </div>
    </>
  );
}

function HomeHeader({ copy, shared }: { copy: HomeCopy; shared: SharedCopy }) {
  return (
    <header className="sticky top-0 z-40 border-b border-slate-100 bg-white/95 backdrop-blur-xl">
      <div className="relative mx-auto flex h-[var(--home-header-mobile)] max-w-[var(--home-wide-max)] items-center justify-between px-4 sm:px-6 lg:h-[var(--home-header-desktop)] lg:px-10">
        <Link to="/" aria-label={copy.navigation.home} className="shrink-0">
          <MutahLogo className="h-7 lg:h-8" />
        </Link>

        <nav
          aria-label={copy.navigation.mainLabel}
          className="absolute left-1/2 hidden -translate-x-1/2 items-center gap-1 lg:flex"
        >
          <HeaderLink to="/" active label={copy.navigation.home} />
          <HeaderLink to="/discover" label={shared.explore} />
          <HeaderLink to="/contribute" label={shared.contribute} />
          <HeaderLink to="/ecosystem" label={copy.navigation.mutah} />
        </nav>

        <LanguageSwitcher />
      </div>
    </header>
  );
}

function HeroCanvas({
  copy,
  locale,
  query,
  onQueryChange,
  onSearch,
  onPrimary,
  onSecondary,
  arrow: Arrow,
}: {
  copy: HomeCopy;
  locale: "ar" | "en";
  query: string;
  onQueryChange: (value: string) => void;
  onSearch: () => void;
  onPrimary: () => void;
  onSecondary: () => void;
  arrow: typeof ArrowLeft;
}) {
  return (
    <section aria-labelledby="home-hero-title" className="overflow-hidden bg-white">
      <div
        data-home-hero
        className="relative mx-auto max-w-[var(--home-wide-max)] lg:h-[500px] xl:h-[520px] min-[1800px]:!h-[600px]"
      >
        <div className="mx-3 h-[clamp(13.5rem,56vw,15.625rem)] overflow-hidden sm:mx-4 md:mx-6 md:h-[300px] lg:absolute lg:inset-0 lg:m-0 lg:h-full">
          <picture className="block size-full lg:absolute lg:inset-y-0 lg:left-0 lg:w-[112%]">
            <source media="(min-width: 768px)" srcSet={MUTAH_ASSETS.home.heroDesktop} />
            <img
              src={MUTAH_ASSETS.home.heroMobile}
              width={1520}
              height={2688}
              alt={copy.heroVisualLabel}
              loading="eager"
              fetchPriority="high"
              decoding="async"
              sizes="(min-width: 1440px) 1613px, (min-width: 1024px) 112vw, calc(100vw - 1.5rem)"
              className="size-full object-cover object-[center_56%] md:object-center lg:object-cover"
            />
          </picture>
        </div>

        <div
          aria-hidden="true"
          className="absolute inset-y-0 left-0 hidden w-[49%] bg-[linear-gradient(90deg,rgba(255,255,255,0.99)_0%,rgba(255,255,255,0.94)_58%,rgba(255,255,255,0)_100%)] lg:block"
        />

        <div
          dir={locale === "ar" ? "rtl" : "ltr"}
          className="relative z-10 px-4 pb-0 pt-5 sm:px-6 md:pt-6 lg:absolute lg:left-[clamp(4.5rem,7.5vw,8rem)] lg:top-1/2 lg:w-[min(31vw,430px)] lg:-translate-y-1/2 lg:p-0"
        >
          <p className="text-xs font-extrabold tracking-[0.16em] text-primary md:text-sm">
            {copy.eyebrow}
          </p>
          <h1
            id="home-hero-title"
            className="mt-2.5 text-[clamp(2.25rem,9.5vw,2.625rem)] font-bold leading-[1.08] tracking-[-0.035em] text-slate-950 lg:mt-3 lg:text-[clamp(3.25rem,4.15vw,var(--home-hero-desktop))] lg:leading-[1.06]"
          >
            {copy.heroTitle}
          </h1>
          <p className="mt-3 max-w-[430px] text-[15px] leading-7 text-slate-600 md:text-base lg:mt-4 lg:text-[18px] lg:leading-8">
            {copy.heroBody}
          </p>

          <form
            className="mt-5 w-full lg:mt-6"
            onSubmit={(event) => {
              event.preventDefault();
              onSearch();
            }}
          >
            <label htmlFor="home-search" className="sr-only">
              {copy.searchPlaceholder}
            </label>
            <div className="flex min-h-[50px] items-center gap-3 rounded-2xl border border-slate-200 bg-white/95 px-4 shadow-[0_10px_28px_-26px_rgba(15,23,42,0.5)] transition focus-within:border-primary/50 focus-within:ring-4 focus-within:ring-primary/10 lg:min-h-[52px]">
              <Search className="size-5 shrink-0 text-slate-400" aria-hidden="true" />
              <input
                id="home-search"
                value={query}
                onChange={(event) => onQueryChange(event.target.value)}
                placeholder={copy.searchPlaceholder}
                className="w-full bg-transparent text-[15px] outline-none placeholder:text-slate-400"
              />
            </div>
          </form>

          <div className="mt-2.5 flex flex-col gap-2.5 sm:flex-row lg:mt-3 lg:gap-3">
            <Button
              size="lg"
              onClick={onPrimary}
              className="min-h-[50px] rounded-2xl px-6 sm:flex-1"
            >
              {copy.primaryCta}
              <Arrow className="size-5" aria-hidden="true" />
            </Button>
            <Button
              size="lg"
              variant="outline"
              onClick={onSecondary}
              className="min-h-[50px] rounded-2xl border-slate-200 bg-white/95 px-6 sm:flex-1"
            >
              {copy.secondaryCta}
            </Button>
          </div>
        </div>
      </div>
    </section>
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

function EvidenceBecomesAccess() {
  return (
    <div
      aria-hidden="true"
      className="relative min-h-[220px] overflow-hidden border-y border-primary/10 bg-[#f8faff] md:min-h-[250px]"
    >
      <div className="absolute start-[8%] top-[22%] h-px w-[43%] bg-slate-300" />
      <div className="absolute start-[13%] top-[39%] h-px w-[38%] bg-primary/25" />
      <div className="absolute start-[18%] top-[56%] h-px w-[33%] bg-slate-300" />
      <span className="absolute start-[8%] top-[22%] size-2 -translate-y-1/2 rounded-full bg-slate-400" />
      <span className="absolute start-[13%] top-[39%] size-2 -translate-y-1/2 rounded-full bg-primary" />
      <span className="absolute start-[18%] top-[56%] size-2 -translate-y-1/2 rounded-full bg-slate-400" />

      <div className="absolute bottom-[18%] end-[14%] h-[58%] w-[28%] rounded-t-[999px] bg-primary p-[10px]">
        <div className="relative size-full rounded-t-[999px] bg-white">
          <div className="absolute bottom-0 end-[12%] h-[76%] w-[48%] rounded-t-full bg-[var(--home-access)]" />
        </div>
      </div>
      <div className="absolute bottom-[18%] end-[7%] h-3 w-[43%] origin-right -skew-x-[28deg] bg-[var(--home-access)]/55" />
      <div className="absolute bottom-[12%] end-[10%] flex items-center gap-2 text-xs font-bold text-slate-500">
        <Sparkles className="size-4 text-primary" />
        <ShieldCheck className="size-4 text-access-strong" />
      </div>
    </div>
  );
}

function Principle({ icon: Icon, text }: { icon: typeof Eye; text: string }) {
  return (
    <li className="flex items-start gap-3 py-3.5 text-sm font-semibold leading-6 text-slate-700">
      <Icon className="mt-0.5 size-5 shrink-0 text-primary" aria-hidden="true" />
      <span>{text}</span>
    </li>
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
      className="fixed inset-x-0 bottom-0 z-50 border-t border-slate-200 bg-white/96 pb-[env(safe-area-inset-bottom)] backdrop-blur-xl lg:hidden"
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
