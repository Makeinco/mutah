import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import {
  ArrowLeft,
  ArrowRight,
  Camera,
  CircleCheck,
  FileCheck2,
  MapPin,
  ParkingCircle,
  Search,
  ShieldCheck,
  UsersRound,
} from "lucide-react";
import { type CSSProperties, useState } from "react";
import { MutahLogo } from "@/components/mutah/Logo";
import { SiteBottomNav } from "@/components/mutah/SiteBottomNav";
import { SiteHeader } from "@/components/mutah/SiteHeader";
import { Button } from "@/components/mutah/ui";
import { HOME_LAYOUT } from "@/config/home-layout";
import { MUTAH_ASSETS } from "@/content/assets";
import { HOME_COPY, type HomeCopy } from "@/content/home";
import { SHARED_COPY } from "@/content/shared";
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

const stepIcons = [Search, Camera, ShieldCheck] as const;
const aiStageIcons = [Camera, AiChipIcon, CircleCheck, UsersRound, FileCheck2] as const;

function AiChipIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" className={className} aria-hidden="true">
      <rect x="4.5" y="4.5" width="15" height="15" rx="2" stroke="currentColor" strokeWidth="1.7" />
      <path d="M8 1.5v3m4-3v3m4-3v3M8 19.5v3m4-3v3m4-3v3M1.5 8h3m-3 4h3m-3 4h3m15-8h3m-3 4h3m-3 4h3" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" />
      <text x="12" y="12.1" textAnchor="middle" dominantBaseline="middle" fill="currentColor" fontSize="7" fontWeight="800" stroke="none">AI</text>
    </svg>
  );
}

const HOME_TOKEN_STYLE = {
  "--home-content-max": MUTAH_DESIGN_TOKENS.layout.contentMax,
  "--home-hero-height-base": HOME_LAYOUT.hero.desktop.heightBase,
  "--home-hero-height-wide": HOME_LAYOUT.hero.desktop.heightWide,
  "--home-hero-height-very-wide": HOME_LAYOUT.hero.desktop.heightVeryWide,
  "--home-hero-content-max-width": HOME_LAYOUT.hero.desktop.contentMaxWidth,
  "--home-hero-content-inset": HOME_LAYOUT.hero.desktop.contentInset,
  "--home-hero-content-y": HOME_LAYOUT.hero.desktop.contentVerticalPosition,
  "--home-hero-desktop-image-fit": HOME_LAYOUT.hero.desktop.imageFit,
  "--home-hero-desktop-image-position": HOME_LAYOUT.hero.desktop.imagePosition,
  "--home-hero-desktop-image-scale": HOME_LAYOUT.hero.desktop.imageScale,
  "--home-hero-top-blend-height": HOME_LAYOUT.hero.desktop.topBlendHeight,
  "--home-hero-top-blend-opacity": HOME_LAYOUT.hero.desktop.topBlendOpacity,
  "--home-hero-top-blend": HOME_LAYOUT.hero.desktop.topBlend,
  "--home-hero-content-veil-width": HOME_LAYOUT.hero.desktop.contentVeilWidth,
  "--home-hero-content-veil-opacity": HOME_LAYOUT.hero.desktop.contentVeilOpacity,
  "--home-hero-content-veil": HOME_LAYOUT.hero.desktop.contentVeil,
  "--home-hero-radial-width": HOME_LAYOUT.hero.desktop.radialHazeWidth,
  "--home-hero-radial-height": HOME_LAYOUT.hero.desktop.radialHazeHeight,
  "--home-hero-radial-position": HOME_LAYOUT.hero.desktop.radialHazePosition,
  "--home-hero-radial-opacity": HOME_LAYOUT.hero.desktop.radialHazeOpacity,
  "--home-hero-radial": HOME_LAYOUT.hero.desktop.radialHaze,
  "--home-hero-lower-fade-height": HOME_LAYOUT.hero.desktop.lowerFadeHeight,
  "--home-hero-lower-fade-opacity": HOME_LAYOUT.hero.desktop.lowerFadeOpacity,
  "--home-hero-lower-fade": HOME_LAYOUT.hero.desktop.lowerFade,
  "--home-hero-desktop-title-min": HOME_LAYOUT.hero.desktop.titleMin,
  "--home-hero-desktop-title-fluid": HOME_LAYOUT.hero.desktop.titleFluid,
  "--home-hero-desktop-title-max": HOME_LAYOUT.hero.desktop.titleMax,
  "--home-hero-desktop-search-height": HOME_LAYOUT.hero.desktop.searchHeight,
  "--home-hero-desktop-button-height": HOME_LAYOUT.hero.desktop.buttonHeight,
  "--home-hero-tablet-visual-height": HOME_LAYOUT.hero.tablet.visualHeight,
  "--home-hero-tablet-image-fit": HOME_LAYOUT.hero.tablet.imageFit,
  "--home-hero-tablet-image-position": HOME_LAYOUT.hero.tablet.imagePosition,
  "--home-hero-tablet-image-scale": HOME_LAYOUT.hero.tablet.imageScale,
  "--home-hero-tablet-content-gap": HOME_LAYOUT.hero.tablet.visualToContentGap,
  "--home-hero-mobile-visual-min": HOME_LAYOUT.hero.mobile.visualHeightMin,
  "--home-hero-mobile-visual-fluid": HOME_LAYOUT.hero.mobile.visualHeightFluid,
  "--home-hero-mobile-visual-max": HOME_LAYOUT.hero.mobile.visualHeightMax,
  "--home-hero-mobile-image-height": HOME_LAYOUT.hero.mobile.imageHeightSmall,
  "--home-hero-mobile-image-height-large": HOME_LAYOUT.hero.mobile.imageHeightLarge,
  "--home-hero-mobile-image-fit": HOME_LAYOUT.hero.mobile.imageFit,
  "--home-hero-mobile-image-position": HOME_LAYOUT.hero.mobile.imagePosition,
  "--home-hero-mobile-image-scale": HOME_LAYOUT.hero.mobile.imageScale,
  "--home-hero-mobile-arch-center": HOME_LAYOUT.hero.mobile.archCenterX,
  "--home-hero-mobile-top-height": HOME_LAYOUT.hero.mobile.topBlendHeight,
  "--home-hero-mobile-top-opacity": HOME_LAYOUT.hero.mobile.topBlendOpacity,
  "--home-hero-mobile-top": HOME_LAYOUT.hero.mobile.topBlend,
  "--home-hero-mobile-lower-height": HOME_LAYOUT.hero.mobile.lowerFadeHeight,
  "--home-hero-mobile-lower-opacity": HOME_LAYOUT.hero.mobile.lowerFadeOpacity,
  "--home-hero-mobile-lower": HOME_LAYOUT.hero.mobile.lowerFade,
  "--home-hero-mobile-title-min": HOME_LAYOUT.hero.mobile.titleMin,
  "--home-hero-mobile-title-fluid": HOME_LAYOUT.hero.mobile.titleFluid,
  "--home-hero-mobile-title-max": HOME_LAYOUT.hero.mobile.titleMax,
  "--home-hero-mobile-search-height": HOME_LAYOUT.hero.mobile.searchHeight,
  "--home-hero-mobile-button-height": HOME_LAYOUT.hero.mobile.buttonHeight,
  "--home-hero-mobile-content-gap": HOME_LAYOUT.hero.mobile.visualToContentGap,
  "--home-recent-top-mobile": HOME_LAYOUT.hero.mobile.ctaToRecentGap,
  "--home-recent-top-desktop": HOME_LAYOUT.sections.recentTopGapDesktop,
  "--home-how-padding-mobile": HOME_LAYOUT.sections.howItWorksPaddingMobile,
  "--home-how-padding-desktop": HOME_LAYOUT.sections.howItWorksPaddingDesktop,
  "--home-ai-padding-mobile": HOME_LAYOUT.sections.aiPaddingMobile,
  "--home-ai-padding-desktop": HOME_LAYOUT.sections.aiPaddingDesktop,
  "--home-contribution-padding-mobile": HOME_LAYOUT.sections.contributionPaddingMobile,
  "--home-contribution-padding-desktop": HOME_LAYOUT.sections.contributionPaddingDesktop,
  "--home-footer-padding-mobile": HOME_LAYOUT.sections.footerPaddingMobile,
  "--home-footer-padding-desktop": HOME_LAYOUT.sections.footerPaddingDesktop,
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
    .slice(0, HOME_LAYOUT.cards.desktopCount);

  const submitSearch = () => {
    navigate({ to: "/discover", search: { q: query || undefined } });
  };

  return (
    <>
      <div
        style={HOME_TOKEN_STYLE}
        className="min-h-dvh bg-white pb-28 text-foreground md:pb-0"
      >
        <SiteHeader wide />

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

          <section
            aria-labelledby="recent-title"
            className="relative bg-[linear-gradient(180deg,#fff_0%,#fbfcff_100%)]"
          >
            <div className="mx-auto max-w-[var(--home-content-max)] px-4 pb-14 pt-[var(--home-recent-top-mobile)] sm:px-6 md:pb-16 lg:px-8 lg:pb-20 lg:pt-[var(--home-recent-top-desktop)]">
              <SectionHeading
                id="recent-title"
                eyebrow={copy.recentEyebrow}
                title={copy.recentTitle}
                body={copy.recentBody}
                action={{ label: copy.viewAll, to: "/discover" }}
              />

              <div className="mt-7 grid gap-5 sm:grid-cols-2 lg:mt-9 lg:grid-cols-3 lg:gap-6">
                {recent.map((facility, index) => {
                  const decision = decideFor(facility, needs);
                  return (
                    <Link
                      key={facility.id}
                      to="/facility/$id"
                      params={{ id: facility.id }}
                      className={`group flex h-full flex-col overflow-hidden rounded-[1.375rem] border border-slate-200/85 bg-white shadow-[0_18px_50px_-44px_rgba(15,23,42,0.45)] transition duration-300 hover:-translate-y-1 hover:border-primary/25 hover:shadow-[0_24px_55px_-38px_rgba(15,23,42,0.35)] focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-primary/15 ${
                        index >= HOME_LAYOUT.cards.mobileInitialCount ? "hidden lg:flex" : ""
                      }`}
                    >
                      <div className="relative aspect-[16/9] overflow-hidden bg-slate-100">
                        {facility.imageUrl ? (
                          <img
                            src={facility.imageUrl}
                            alt={pick(facility.imageAlt)}
                            loading="lazy"
                            className="size-full object-cover transition duration-700 ease-out group-hover:scale-[1.025]"
                          />
                        ) : (
                          <div className="flex size-full items-center justify-center text-sm text-slate-400">
                            {copy.noPhoto}
                          </div>
                        )}
                        <div
                          aria-hidden="true"
                          className="pointer-events-none absolute inset-x-0 bottom-0 h-14 bg-gradient-to-t from-slate-950/15 to-transparent"
                        />
                      </div>
                      <div className="flex flex-1 flex-col p-5 lg:p-6">
                        <div className="flex items-center justify-between gap-3">
                          <span
                            className={`inline-flex min-h-7 items-center rounded-full px-3 py-1 text-xs font-bold ring-1 ring-inset ring-current/10 ${verdictClass(decision.verdict)}`}
                          >
                            {pick(VERDICT_LABEL[decision.verdict])}
                          </span>
                          <span className="text-xs text-slate-500">
                            {relativeDate(facility.lastVerifiedISO, lang)}
                          </span>
                        </div>
                        <h3 className="mt-4 line-clamp-1 text-[1.0625rem] font-bold leading-7 text-slate-950 lg:text-lg">
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

          <section className="bg-[linear-gradient(180deg,#f8faff_0%,#f4f7fd_100%)]">
            <div className="mx-auto max-w-[74rem] px-4 py-[var(--home-how-padding-mobile)] sm:px-6 lg:px-8 lg:py-[var(--home-how-padding-desktop)]">
              <SectionHeading
                eyebrow={copy.howEyebrow}
                title={copy.howTitle}
                body={copy.howBody}
                centered
              />

              <ol
                className="relative mt-8 grid overflow-hidden rounded-[1.75rem] border border-white/80 bg-white/72 px-5 shadow-[0_24px_70px_-58px_rgba(15,23,42,0.5)] backdrop-blur-sm md:grid-cols-3 md:px-0 lg:mt-10"
                dir={locale === "ar" ? "rtl" : "ltr"}
              >
                <div
                  aria-hidden="true"
                  className="absolute inset-x-[16.66%] top-[54px] hidden h-px bg-gradient-to-r from-primary/10 via-primary/40 to-primary/10 md:block"
                />
                {copy.steps.map((step, index) => {
                  const StepIcon = stepIcons[index] ?? ShieldCheck;
                  return (
                    <li
                      key={step.title}
                      className={`relative flex gap-4 border-slate-200/80 py-5 md:min-h-[214px] md:flex-col md:items-center md:justify-center md:border-0 md:px-10 md:py-8 md:text-center ${
                        index === 0 ? "" : "border-t"
                      }`}
                    >
                      <span className="relative z-10 flex size-12 shrink-0 items-center justify-center rounded-2xl border border-primary/15 bg-primary-soft/70 text-primary shadow-[0_12px_28px_-22px_rgba(0,102,255,0.65)]">
                        <StepIcon className="size-5" aria-hidden="true" />
                        <span className="absolute -end-1.5 -top-1.5 flex size-5 items-center justify-center rounded-full bg-primary text-[10px] font-extrabold text-white ring-4 ring-white">
                          {index + 1}
                        </span>
                      </span>
                      <div>
                        <h3 className="text-lg font-bold text-slate-950">{step.title}</h3>
                        <p className="mt-2 text-sm leading-6 text-slate-600">{step.body}</p>
                      </div>
                    </li>
                  );
                })}
              </ol>
            </div>
          </section>

          <AiShowcase copy={copy} locale={locale} />

          <section className="bg-white px-4 pb-[var(--home-contribution-padding-mobile)] sm:px-6 lg:px-8 lg:pb-[var(--home-contribution-padding-desktop)]">
            <div className="relative mx-auto flex max-w-[var(--home-content-max)] flex-col justify-center gap-5 overflow-hidden rounded-[1.75rem] border border-primary/10 bg-[linear-gradient(110deg,rgba(238,246,255,0.88)_0%,rgba(248,251,255,0.96)_58%,rgba(239,255,243,0.72)_100%)] px-6 py-7 shadow-[0_24px_70px_-60px_rgba(0,102,255,0.45)] sm:px-8 md:flex-row md:items-center md:justify-between md:gap-10 lg:min-h-[140px] lg:px-10 lg:py-7">
              <div
                aria-hidden="true"
                className="pointer-events-none absolute -end-16 -top-28 size-56 rounded-full border-[28px] border-primary/5"
              />
              <div className="relative max-w-[780px]">
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
                className="relative min-h-[50px] rounded-2xl px-7 shadow-[0_16px_32px_-20px_rgba(0,102,255,0.75)] transition hover:-translate-y-0.5 md:shrink-0"
              >
                {copy.contributeCta}
                <Camera className="size-5" aria-hidden="true" />
              </Button>
            </div>
          </section>
        </main>

        <footer className="border-t border-slate-100 bg-white">
          <div className="mx-auto flex max-w-[var(--home-content-max)] flex-col gap-5 px-4 py-[var(--home-footer-padding-mobile)] text-sm text-slate-500 sm:px-6 md:flex-row md:items-center md:justify-between lg:px-8 lg:py-[var(--home-footer-padding-desktop)]">
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

        <SiteBottomNav />
      </div>
    </>
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
    <section
      aria-labelledby="home-hero-title"
      className="relative isolate overflow-hidden bg-white"
    >
      <div
        data-home-hero
        className="relative w-full lg:h-[var(--home-hero-height-base)] xl:h-[var(--home-hero-height-wide)] min-[1800px]:!h-[var(--home-hero-height-very-wide)]"
      >
        <div className="relative isolate h-[clamp(var(--home-hero-mobile-visual-min),var(--home-hero-mobile-visual-fluid),var(--home-hero-mobile-visual-max))] w-full overflow-hidden md:h-[var(--home-hero-tablet-visual-height)] lg:absolute lg:inset-0 lg:h-full">
          <picture className="relative block size-full">
            <source media="(min-width: 768px)" srcSet={MUTAH_ASSETS.home.heroDesktop} />
            <img
              src={MUTAH_ASSETS.home.heroMobile}
              width={4800}
              height={3584}
              alt={copy.heroVisualLabel}
              loading="eager"
              fetchPriority="high"
              decoding="async"
              sizes="100vw"
              className="absolute left-[var(--home-hero-mobile-arch-center)] top-1/2 h-[var(--home-hero-mobile-image-height)] w-full max-w-none -translate-x-1/2 -translate-y-1/2 scale-[var(--home-hero-mobile-image-scale)] [object-fit:var(--home-hero-mobile-image-fit)] [object-position:var(--home-hero-mobile-image-position)] min-[420px]:h-[var(--home-hero-mobile-image-height-large)] md:static md:size-full md:translate-x-0 md:translate-y-0 md:scale-[var(--home-hero-tablet-image-scale)] md:[object-fit:var(--home-hero-tablet-image-fit)] md:[object-position:var(--home-hero-tablet-image-position)] lg:scale-[var(--home-hero-desktop-image-scale)] lg:[object-fit:var(--home-hero-desktop-image-fit)] lg:[object-position:var(--home-hero-desktop-image-position)]"
            />
          </picture>
          <div
            aria-hidden="true"
            className="pointer-events-none absolute inset-x-0 top-0 z-[2] h-[var(--home-hero-mobile-top-height)] bg-[image:var(--home-hero-mobile-top)] opacity-[var(--home-hero-mobile-top-opacity)] lg:hidden"
          />
          <div
            aria-hidden="true"
            className="pointer-events-none absolute inset-x-0 bottom-0 z-[2] h-[var(--home-hero-mobile-lower-height)] bg-[image:var(--home-hero-mobile-lower)] opacity-[var(--home-hero-mobile-lower-opacity)] lg:hidden"
          />
        </div>

        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-x-0 top-0 z-[2] hidden h-[var(--home-hero-top-blend-height)] bg-[image:var(--home-hero-top-blend)] opacity-[var(--home-hero-top-blend-opacity)] lg:block"
        />
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-y-0 left-0 z-[3] hidden w-[var(--home-hero-content-veil-width)] bg-[image:var(--home-hero-content-veil)] opacity-[var(--home-hero-content-veil-opacity)] lg:block"
        />
        <div
          aria-hidden="true"
          className="pointer-events-none absolute left-0 top-[var(--home-hero-radial-position)] z-[4] hidden h-[var(--home-hero-radial-height)] w-[var(--home-hero-radial-width)] -translate-y-1/2 bg-[image:var(--home-hero-radial)] opacity-[var(--home-hero-radial-opacity)] lg:block"
        />
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-x-0 bottom-0 z-[5] hidden h-[var(--home-hero-lower-fade-height)] bg-[image:var(--home-hero-lower-fade)] opacity-[var(--home-hero-lower-fade-opacity)] lg:block"
        />

        <div
          dir={locale === "ar" ? "rtl" : "ltr"}
          className="relative z-10 px-4 pb-0 pt-[var(--home-hero-mobile-content-gap)] sm:px-6 md:pt-[var(--home-hero-tablet-content-gap)] lg:absolute lg:left-[var(--home-hero-content-inset)] lg:top-[var(--home-hero-content-y)] lg:w-[var(--home-hero-content-max-width)] lg:-translate-y-1/2 lg:p-0"
        >
          <p className="text-xs font-extrabold tracking-[0.16em] text-primary md:text-sm">
            {copy.eyebrow}
          </p>
          <h1
            id="home-hero-title"
            className="mt-2.5 text-[clamp(var(--home-hero-mobile-title-min),var(--home-hero-mobile-title-fluid),var(--home-hero-mobile-title-max))] font-bold leading-[1.08] tracking-[-0.04em] text-slate-950 text-balance lg:mt-3 lg:text-[clamp(var(--home-hero-desktop-title-min),var(--home-hero-desktop-title-fluid),var(--home-hero-desktop-title-max))] lg:leading-[1.04]"
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
            <div className="flex min-h-[var(--home-hero-mobile-search-height)] items-center gap-3 rounded-2xl border border-slate-200/90 bg-white/92 px-4 shadow-[0_18px_45px_-32px_rgba(15,23,42,0.38)] backdrop-blur-md transition duration-300 focus-within:border-primary/45 focus-within:bg-white focus-within:ring-4 focus-within:ring-primary/10 lg:min-h-[var(--home-hero-desktop-search-height)]">
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
              className="min-h-[var(--home-hero-mobile-button-height)] rounded-2xl px-6 shadow-[0_16px_32px_-22px_rgba(0,102,255,0.75)] transition hover:-translate-y-0.5 sm:flex-1 lg:min-h-[var(--home-hero-desktop-button-height)]"
            >
              {copy.primaryCta}
              <Arrow className="size-5" aria-hidden="true" />
            </Button>
            <Button
              size="lg"
              variant="outline"
              onClick={onSecondary}
              className="min-h-[var(--home-hero-mobile-button-height)] rounded-2xl border-slate-200/90 bg-white/90 px-6 backdrop-blur-md transition hover:-translate-y-0.5 hover:border-primary/25 hover:bg-white sm:flex-1 lg:min-h-[var(--home-hero-desktop-button-height)]"
            >
              {copy.secondaryCta}
            </Button>
          </div>
        </div>
      </div>
    </section>
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

function AiShowcase({ copy, locale }: { copy: HomeCopy; locale: "ar" | "en" }) {
  return (
    <section aria-labelledby="home-ai-title" className="bg-white px-2 py-[var(--home-ai-padding-mobile)] sm:px-4 lg:py-[var(--home-ai-padding-desktop)]">
      <div className="mx-auto max-w-[1440px] overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-[0_20px_55px_-45px_rgba(15,23,42,0.35)]">
        <div className="relative overflow-hidden">
          <picture className="block w-full">
            <source media="(min-width: 1024px)" srcSet={MUTAH_ASSETS.ai.sceneWeb} />
            <img
              src={MUTAH_ASSETS.ai.sceneMobile}
              width={1086}
              height={1448}
              alt={copy.aiSceneAlt}
              loading="lazy"
              className="block h-auto w-full"
            />
          </picture>
          <div aria-hidden="true" className="pointer-events-none absolute inset-x-0 top-0 h-[43%] bg-gradient-to-b from-white/85 via-white/55 to-transparent lg:inset-y-0 lg:left-0 lg:right-auto lg:h-auto lg:w-[41%] lg:bg-gradient-to-r lg:from-white/88 lg:via-white/55 lg:to-transparent" />

          <svg aria-hidden="true" className="pointer-events-none absolute inset-0 z-[9] size-full lg:hidden" viewBox="0 0 100 100" preserveAspectRatio="none" fill="none">
            <path d="M 18 77 L 36 75 M 52 77 L 48 75" stroke="#0066FF" strokeWidth="1.6" vectorEffect="non-scaling-stroke" strokeLinecap="round" />
            <circle cx="36" cy="75" r="0.8" fill="#0066FF" />
            <circle cx="48" cy="75" r="0.8" fill="#0066FF" />
          </svg>
          <svg aria-hidden="true" className="pointer-events-none absolute inset-0 z-[9] hidden size-full lg:block" viewBox="0 0 100 100" preserveAspectRatio="none" fill="none">
            <path d="M 39 70 L 42 79 M 63 70 L 56 77" stroke="#0066FF" strokeWidth="1.8" vectorEffect="non-scaling-stroke" strokeLinecap="round" />
            <circle cx="42" cy="79" r="0.45" fill="#0066FF" />
            <circle cx="56" cy="77" r="0.45" fill="#0066FF" />
          </svg>

          <div dir={locale === "ar" ? "rtl" : "ltr"} className="absolute left-[4%] right-[4%] top-[15%] z-10 text-start lg:left-[3%] lg:right-auto lg:top-[7%] lg:w-[30%]">
            <p className="text-xs font-extrabold text-[#0066FF] sm:text-sm lg:text-base">{copy.aiKicker}</p>
            <h2 id="home-ai-title" className="mt-1 text-[clamp(1.35rem,5.3vw,2rem)] font-extrabold leading-[1.18] tracking-tight text-[#09164b] lg:mt-3 lg:text-[clamp(2rem,2.7vw,2.6rem)]">
              {copy.aiTitleLines.map((line) => <span key={line} className="block">{line}</span>)}
              <span className="block text-[#0066FF]">{copy.aiDecision}</span>
            </h2>
            <p className="mt-2 max-w-[32rem] text-[clamp(0.75rem,3.1vw,0.95rem)] leading-[1.45] text-[#253a71] lg:mt-4 lg:text-[clamp(0.95rem,1.3vw,1.2rem)] lg:leading-[1.55]">{copy.aiBody}</p>
          </div>

          <span className="absolute right-[2%] top-[2%] z-10 inline-flex items-center gap-1.5 rounded-lg bg-white/85 px-2.5 py-1.5 text-[10px] font-bold text-[#253a71] shadow-sm sm:text-xs lg:px-3 lg:py-2">
            <FileCheck2 className="size-4 text-[#0066FF]" aria-hidden="true" />{copy.aiExampleLabel}
          </span>

          <span className="absolute left-[4%] top-[72%] z-10 inline-flex items-center gap-1.5 rounded-lg bg-white/90 px-2 py-1.5 text-[10px] font-bold text-[#09164b] shadow-sm sm:text-xs lg:left-[35%] lg:top-[64%] lg:px-3 lg:py-2">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" className="size-4 text-[#0066FF]" aria-hidden="true"><path d="M3 20h5v-5h5v-5h5V5h3" /></svg>{copy.aiStairsLabel}
          </span>
          <span className="absolute left-[49%] top-[71%] z-10 inline-flex items-center gap-1.5 rounded-lg bg-white/90 px-2 py-1.5 text-[10px] font-bold text-[#09164b] shadow-sm sm:text-xs lg:left-[57%] lg:top-[65%] lg:px-3 lg:py-2">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" className="size-4 text-[#0066FF]" aria-hidden="true"><path d="M3 19h18M3 17l18-10v10H3Z" /></svg>{copy.aiRampLabel}
          </span>
          <span dir={locale === "ar" ? "rtl" : "ltr"} className="absolute bottom-[2%] right-[2%] z-10 inline-flex max-w-[62%] items-center gap-1.5 rounded-lg bg-white/90 px-2 py-1.5 text-[10px] font-bold text-[#09164b] shadow-sm sm:text-xs lg:max-w-none lg:px-3 lg:py-2">
            <ParkingCircle className="size-4 shrink-0 text-[#0066FF]" aria-hidden="true" />{copy.aiParkingLabel}
          </span>
          <div className="absolute bottom-[2%] left-[2%] z-10 hidden items-center gap-2 rounded-lg bg-[#ecf8ee]/95 px-4 py-2 text-sm text-[#12652a] shadow-sm lg:flex" dir={locale === "ar" ? "rtl" : "ltr"}>
            <ShieldCheck className="size-6 shrink-0" aria-hidden="true" />
            <div><strong className="block">{copy.publishAfterReview}</strong><span className="text-xs text-[#335d3e]">{copy.aiTrustBody}</span></div>
          </div>
        </div>

        <ol dir={locale === "ar" ? "rtl" : "ltr"} className="relative divide-y divide-slate-100 px-3 py-2 sm:px-5 lg:grid lg:grid-cols-5 lg:divide-y-0 lg:px-1 lg:py-5">
          <span aria-hidden="true" className="pointer-events-none absolute inset-x-[10%] top-[2.375rem] hidden h-px bg-[#0066FF]/20 lg:block" />
          {copy.aiStages.map((stage, index) => {
            const Icon = aiStageIcons[index] ?? Camera;
            return <li key={stage.title} className="relative flex min-h-16 items-center gap-3 py-2.5 lg:min-h-32 lg:flex-col lg:gap-2 lg:px-3 lg:py-1 lg:text-center">
              {index > 0 && <span aria-hidden="true" className="pointer-events-none absolute bottom-2 start-0 top-12 hidden w-px bg-slate-100 lg:block" />}
              <span className="relative z-10 flex size-7 shrink-0 items-center justify-center rounded-full border border-[#0066FF]/25 bg-white text-sm font-bold text-[#0066FF]">{index + 1}</span>
              <span className="relative flex size-8 shrink-0 items-center justify-center text-[#0066FF] lg:size-9">
                <Icon className="size-7 stroke-[1.7] lg:size-8" aria-hidden="true" />
              </span>
              <div className="min-w-0"><h3 className="text-sm font-extrabold text-[#09164b] lg:text-base">{stage.title}</h3><p className="mt-0.5 text-xs leading-5 text-[#52648a] lg:text-sm">{stage.body}</p></div>
            </li>;
          })}
        </ol>
        <div className="mx-2 mb-2 flex items-center gap-2 rounded-lg bg-[#ecf8ee] px-3 py-2 text-[#12652a] lg:hidden" dir={locale === "ar" ? "rtl" : "ltr"}>
          <ShieldCheck className="size-6 shrink-0" aria-hidden="true" />
          <div><strong className="block text-sm">{copy.publishAfterReview}</strong><span className="text-xs text-[#335d3e]">{copy.aiTrustBody}</span></div>
        </div>
      </div>
    </section>
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
