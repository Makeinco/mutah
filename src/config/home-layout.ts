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
      heightBase: "500px",
      heightWide: "520px",
      heightVeryWide: "560px",
      contentWidth: "min(50%, 430px)",
      visualWidth: "58%",
      imageFit: "contain",
      imagePosition: "center",
      imageScale: 1,
      blendWidth: "60%",
      blendRtl:
        "linear-gradient(90deg, #fff 0%, rgba(255,255,255,.985) 48%, rgba(255,255,255,.82) 70%, rgba(255,255,255,0) 100%)",
      blendLtr:
        "linear-gradient(270deg, #fff 0%, rgba(255,255,255,.985) 48%, rgba(255,255,255,.82) 70%, rgba(255,255,255,0) 100%)",
      maskRtl: "linear-gradient(to right, transparent 0%, black 18%, black 100%)",
      maskLtr: "linear-gradient(to left, transparent 0%, black 18%, black 100%)",
      radialGlowWidth: "30%",
      radialGlowOffset: "34%",
      radialGlow:
        "radial-gradient(ellipse at center, rgba(255,255,255,.5) 0%, rgba(255,255,255,.16) 48%, rgba(255,255,255,0) 74%)",
      bottomFadeHeight: "4rem",
      bottomFade:
        "linear-gradient(to top, #fff 0%, rgba(255,255,255,.42) 50%, rgba(255,255,255,0) 100%)",
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
      visualHeightMin: "25.75rem",
      visualHeightFluid: "56vw",
      visualHeightMax: "17.25rem",
      imageHeightSmall: "500px",
      imageHeightLarge: "520px",
      imageFit: "contain",
      imagePosition: "center",
      imageScale: 0.92,
      titleMin: "2.25rem",
      titleFluid: "9.5vw",
      titleMax: "2.625rem",
      searchHeight: "3.125rem",
      buttonHeight: "3.125rem",
      visualToContentGap: "1rem",
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
