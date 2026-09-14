import { MUTAH_DESIGN_TOKENS } from "@/lib/mutah/design-tokens";

type ImageFit = "contain" | "cover";

type HeroViewportLayout = {
  imageFit: ImageFit;
  imagePosition: string;
  imageScale: number;
};

export type HomeLayoutConfig = {
  hero: {
    desktop: HeroViewportLayout & {
      heightBase: string;
      heightWide: string;
      heightVeryWide: string;
      contentWidth: string;
      visualWidth: string;
      blendWidth: string;
      blendRtl: string;
      blendLtr: string;
      maskRtl: string;
      maskLtr: string;
      radialGlowWidth: string;
      radialGlowOffset: string;
      radialGlow: string;
      radialGlowOpacity: number;
      contentVeilWidth: string;
      contentVeilOpacity: number;
      contentVeilRtl: string;
      contentVeilLtr: string;
      topFadeHeight: string;
      topFade: string;
      bottomFadeHeight: string;
      bottomFade: string;
      titleMin: string;
      titleFluid: string;
      titleMax: string;
      searchHeight: string;
      buttonHeight: string;
    };
    tablet: HeroViewportLayout & {
      visualHeight: string;
      visualToContentGap: string;
    };
    mobile: HeroViewportLayout & {
      visualHeightMin: string;
      visualHeightFluid: string;
      visualHeightMax: string;
      imageHeightSmall: string;
      imageHeightLarge: string;
      archCenterX: string;
      edgeFadeHeight: string;
      edgeFade: string;
      titleMin: string;
      titleFluid: string;
      titleMax: string;
      searchHeight: string;
      buttonHeight: string;
      visualToContentGap: string;
      ctaToRecentGap: string;
    };
  };
  sections: {
    recentTopGapDesktop: string;
    howItWorksPaddingDesktop: string;
    howItWorksPaddingMobile: string;
    aiPaddingDesktop: string;
    aiPaddingMobile: string;
    contributionPaddingDesktop: string;
    contributionPaddingMobile: string;
    footerPaddingDesktop: string;
    footerPaddingMobile: string;
  };
  cards: {
    desktopCount: number;
    mobileInitialCount: number;
  };
  navigation: {
    mobileBottomNavHeight: string;
    mobileSafeAreaPadding: string;
  };
};

/**
 * Home-only composition controls. Marketing copy, asset paths, and global design
 * semantics intentionally remain in their dedicated content, asset, and token modules.
 */
export const HOME_LAYOUT = {
  hero: {
    desktop: {
      heightBase: "490px",
      heightWide: "510px",
      heightVeryWide: "540px",
      contentWidth: "min(43%, 430px)",
      visualWidth: "58%",
      imageFit: "contain",
      imagePosition: "center",
      imageScale: 0.91,
      blendWidth: "58%",
      blendRtl:
        "linear-gradient(90deg, #fff 0%, rgba(255,255,255,.96) 46%, rgba(255,255,255,.76) 70%, rgba(255,255,255,0) 100%)",
      blendLtr:
        "linear-gradient(270deg, #fff 0%, rgba(255,255,255,.96) 46%, rgba(255,255,255,.76) 70%, rgba(255,255,255,0) 100%)",
      maskRtl: "linear-gradient(to right, transparent 0%, black 22%, black 96%, transparent 100%)",
      maskLtr: "linear-gradient(to left, transparent 0%, black 22%, black 96%, transparent 100%)",
      radialGlowWidth: "36%",
      radialGlowOffset: "30%",
      radialGlow:
        "radial-gradient(ellipse at center, rgba(255,255,255,.42) 0%, rgba(255,255,255,.12) 48%, rgba(255,255,255,0) 76%)",
      radialGlowOpacity: 0.8,
      contentVeilWidth: "52%",
      contentVeilOpacity: 0.78,
      contentVeilRtl:
        "radial-gradient(ellipse at 28% 50%, rgba(255,255,255,.94) 0%, rgba(255,255,255,.62) 58%, rgba(255,255,255,0) 100%)",
      contentVeilLtr:
        "radial-gradient(ellipse at 72% 50%, rgba(255,255,255,.94) 0%, rgba(255,255,255,.62) 58%, rgba(255,255,255,0) 100%)",
      topFadeHeight: "6rem",
      topFade:
        "linear-gradient(to bottom, #fff 0%, rgba(255,255,255,.9) 34%, rgba(255,255,255,0) 100%)",
      bottomFadeHeight: "4.5rem",
      bottomFade:
        "linear-gradient(to top, #fff 0%, rgba(255,255,255,.34) 55%, rgba(255,255,255,0) 100%)",
      titleMin: "3.25rem",
      titleFluid: "4.15vw",
      titleMax: MUTAH_DESIGN_TOKENS.typography.heroDesktop,
      searchHeight: "3.375rem",
      buttonHeight: "3.125rem",
    },
    tablet: {
      visualHeight: "300px",
      imageFit: "contain",
      imagePosition: "center",
      imageScale: 1,
      visualToContentGap: "1.25rem",
    },
    mobile: {
      visualHeightMin: "13.75rem",
      visualHeightFluid: "56vw",
      visualHeightMax: "16.25rem",
      imageHeightSmall: "500px",
      imageHeightLarge: "520px",
      imageFit: "contain",
      imagePosition: "center",
      imageScale: 0.94,
      archCenterX: "50%",
      edgeFadeHeight: "3.25rem",
      edgeFade:
        "linear-gradient(to top, rgba(255,255,255,.92) 0%, rgba(255,255,255,.24) 55%, rgba(255,255,255,0) 100%)",
      titleMin: "2.25rem",
      titleFluid: "9.5vw",
      titleMax: "2.625rem",
      searchHeight: "3.125rem",
      buttonHeight: "3.125rem",
      visualToContentGap: "0.875rem",
      ctaToRecentGap: "3rem",
    },
  },
  sections: {
    recentTopGapDesktop: "3.5rem",
    howItWorksPaddingDesktop: "5rem",
    howItWorksPaddingMobile: "3.5rem",
    aiPaddingDesktop: "6rem",
    aiPaddingMobile: "4rem",
    contributionPaddingDesktop: "2.5rem",
    contributionPaddingMobile: "2rem",
    footerPaddingDesktop: "2.25rem",
    footerPaddingMobile: "2rem",
  },
  cards: {
    desktopCount: 3,
    mobileInitialCount: 2,
  },
  navigation: {
    mobileBottomNavHeight: MUTAH_DESIGN_TOKENS.layout.bottomNavHeight,
    mobileSafeAreaPadding: "env(safe-area-inset-bottom)",
  },
} as const satisfies HomeLayoutConfig;
