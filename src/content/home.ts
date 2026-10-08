export type HomeLocale = "ar" | "en";

export type HomeStep = {
  title: string;
  body: string;
};

export type HomeCopy = {
  navigation: {
    home: string;
    mutah: string;
    account: string;
    mainLabel: string;
    bottomLabel: string;
  };
  eyebrow: string;
  heroTitle: string;
  heroBody: string;
  searchPlaceholder: string;
  primaryCta: string;
  secondaryCta: string;
  recentEyebrow: string;
  recentTitle: string;
  recentBody: string;
  viewAll: string;
  lastUpdated: string;
  howEyebrow: string;
  howTitle: string;
  howBody: string;
  steps: HomeStep[];
  aiKicker: string;
  aiTitleLines: readonly [string, string];
  aiDecision: string;
  aiBody: string;
  aiSceneAlt: string;
  aiExampleLabel: string;
  aiStairsLabel: string;
  aiRampLabel: string;
  aiParkingLabel: string;
  aiStages: readonly [HomeStep, HomeStep, HomeStep, HomeStep, HomeStep];
  aiTrustBody: string;
  publishAfterReview: string;
  contributeEyebrow: string;
  contributeTitle: string;
  contributeBody: string;
  contributeCta: string;
  heroVisualLabel: string;
  noPhoto: string;
  footerLine: string;
};

export const HOME_COPY: Record<HomeLocale, HomeCopy> = {
  ar: {
    navigation: {
      home: "الرئيسية",
      mutah: "مُتاح",
      account: "حسابي",
      mainLabel: "التنقل الرئيسي",
      bottomLabel: "التنقل السفلي",
    },
    eyebrow: "مُتاح ماب | MUTAH MAP",
    heroTitle: "اعرف قبل أن تصل",
    heroBody: "معلومات وصول واضحة وموثقة تساعدك على اتخاذ قرارك قبل الزيارة.",
    searchPlaceholder: "ابحث عن مكان...",
    primaryCta: "استكشف الأماكن",
    secondaryCta: "حدد احتياجات الوصول",
    recentEyebrow: "معلومات حديثة",
    recentTitle: "أماكن تم تحديث معلوماتها مؤخرًا",
    recentBody: "استكشف أماكن أضيفت أو تمت مراجعة أدلة الوصول فيها مؤخرًا.",
    viewAll: "عرض جميع الأماكن",
    lastUpdated: "آخر تحديث",
    howEyebrow: "ثلاث خطوات واضحة",
    howTitle: "كيف يعمل مُتاح؟",
    howBody: "رحلة بسيطة من البحث إلى الدليل ثم القرار قبل الوصول.",
    steps: [
      { title: "استكشف", body: "ابحث عن الأماكن وتعرّف على معلومات الوصول قبل زيارتك." },
      { title: "ساهم", body: "أضف صورًا ومعلومات من تجربتك لمساعدة الآخرين." },
      { title: "تحقق بشريًا", body: "تُراجع الأدلة قبل النشر لضمان الدقة والموثوقية." },
    ],
    aiKicker: "ذكاء مُتاح",
    aiTitleLines: ["الذكاء الاصطناعي يرصد.", "والإنسان يتحقق."],
    aiDecision: "والقرار لك.",
    aiBody: "من صور الأماكن إلى مؤشرات وصول واضحة، بتأكيد المساهم ومراجعة بشرية قبل النشر.",
    aiSceneAlt: "مشهد توضيحي لمدخل مبنى ودرج ومنحدر ومسار أخضر متصل ببوابة زرقاء",
    aiExampleLabel: "مثال توضيحي",
    aiStairsLabel: "درجات ظاهرة",
    aiRampLabel: "منحدر ظاهر",
    aiParkingLabel: "الموقف غير موثّق بهذه الصورة",
    aiStages: [
      { title: "صورة المدخل", body: "أضف صورة واضحة للمدخل." },
      { title: "رصد أولي", body: "نرصد مؤشرات الوصول الظاهرة." },
      { title: "تأكيد أو تصحيح", body: "تؤكد النتائج أو تصححها." },
      { title: "مراجعة مُتاح", body: "نراجع الدليل قبل النشر." },
      { title: "نشر المعلومة", body: "نعرض المعلومات بعد مراجعتها." },
    ],
    aiTrustBody: "ما لا يظهر في الصورة يبقى غير مؤكد.",
    publishAfterReview: "النشر بعد المراجعة",
    contributeEyebrow: "المجتمع جزء من الثقة",
    contributeTitle: "معلومة واحدة قد تفتح الطريق لشخص آخر",
    contributeBody: "صورة حديثة أو تحديث بسيط قد يساعد شخصًا آخر على اتخاذ قرار أوضح قبل الزيارة.",
    contributeCta: "ساهم الآن",
    heroVisualLabel: "من الغموض إلى الوضوح قبل الرحلة",
    noPhoto: "لا توجد صورة",
    footerLine: "اعرف قبل أن تصل.",
  },
  en: {
    navigation: {
      home: "Home",
      mutah: "MUTAH",
      account: "Account",
      mainLabel: "Main navigation",
      bottomLabel: "Bottom navigation",
    },
    eyebrow: "MUTAH MAP | مُتاح ماب",
    heroTitle: "Know before you go",
    heroBody: "Clear, verified access information that helps you decide before you visit.",
    searchPlaceholder: "Search for a place...",
    primaryCta: "Explore places",
    secondaryCta: "Set access needs",
    recentEyebrow: "Fresh information",
    recentTitle: "Recently updated places",
    recentBody: "Explore places with recently added or reviewed accessibility evidence.",
    viewAll: "View all places",
    lastUpdated: "Last updated",
    howEyebrow: "Three clear steps",
    howTitle: "How MUTAH works",
    howBody: "A simple journey from search to evidence to a decision before arrival.",
    steps: [
      {
        title: "Explore",
        body: "Search places and understand access information before your visit.",
      },
      {
        title: "Contribute",
        body: "Add photos and information from your experience to help others.",
      },
      {
        title: "Human verification",
        body: "Evidence is reviewed before publication for accuracy and trust.",
      },
    ],
    aiKicker: "MUTAH Intelligence",
    aiTitleLines: ["AI observes.", "Humans verify."],
    aiDecision: "The decision is yours.",
    aiBody: "From place photos to clear access indicators, confirmed by contributors and reviewed by people before publication.",
    aiSceneAlt: "Illustration of a building entrance, stairs, ramp, and a green path leading to a blue gateway",
    aiExampleLabel: "Illustrative example",
    aiStairsLabel: "Stairs visible",
    aiRampLabel: "Ramp visible",
    aiParkingLabel: "Parking not documented by this image",
    aiStages: [
      { title: "Entrance photo", body: "Add a clear photo of the entrance." },
      { title: "Initial observation", body: "We observe visible access indicators." },
      { title: "Confirm or correct", body: "Confirm or correct the findings." },
      { title: "MUTAH review", body: "We review the evidence before publishing." },
      { title: "Publish information", body: "We display information after review." },
    ],
    aiTrustBody: "What is not visible in the image remains unconfirmed.",
    publishAfterReview: "Published after review",
    contributeEyebrow: "Community builds trust",
    contributeTitle: "One piece of information can open the way for someone else",
    contributeBody:
      "A recent photo or simple update can help someone else make a clearer decision before visiting.",
    contributeCta: "Contribute now",
    heroVisualLabel: "From uncertainty to clarity before the journey",
    noPhoto: "No photo",
    footerLine: "Know before you go.",
  },
};
