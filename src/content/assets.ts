export const MUTAH_ASSETS = {
  brand: {
    logo: "/assets/brand/mutah-logo.svg",
    icon: "/assets/brand/mutah-icon.svg",
  },
  home: {
    heroDesktop: "/assets/home/mutah-home-web.webp",
    heroMobile: "/assets/home/mutah-home-mobile.webp",
    splashVideo: "/assets/home/mutah-splash-intro.mp4",
  },
} as const;

export type MutahAssetKey = keyof typeof MUTAH_ASSETS;
