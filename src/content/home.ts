export type HomeLocale = "ar" | "en";

export type HomeStep = {
  title: string;
  body: string;
};

export type HomeCopy = {
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
  aiTitle: string;
  aiBody: string;
  publishAfterReview: string;
  contributeEyebrow: string;
  contributeTitle: string;
  contributeBody: string;
  contributeCta: string;
  heroVisualLabel: string;
};

export const HOME_COPY: Record<HomeLocale, HomeCopy> = {
  ar: {
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
    aiKicker: "من الصورة إلى قرار أوضح",
    aiTitle: "الذكاء الاصطناعي يرى. البشر يتحققون.",
    aiBody: "يستخرج مُتاح أدلة الوصول المرئية من الصور، ويُبقي عدم اليقين واضحًا، ثم تمر المعلومات بمراجعة بشرية قبل النشر.",
    publishAfterReview: "النشر بعد المراجعة",
    contributeEyebrow: "المجتمع جزء من الثقة",
    contributeTitle: "كن جزءًا من التغيير",
    contributeBody: "صورة حديثة أو تحديث بسيط قد يساعد شخصًا آخر على اتخاذ قرار أوضح قبل الزيارة.",
    contributeCta: "ابدأ المساهمة",
    heroVisualLabel: "من الغموض إلى الوضوح قبل الرحلة",
  },
  en: {
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
      { title: "Explore", body: "Search places and understand access information before your visit." },
      { title: "Contribute", body: "Add photos and information from your experience to help others." },
      { title: "Human verification", body: "Evidence is reviewed before publication for accuracy and trust." },
    ],
    aiKicker: "From image to a clearer decision",
    aiTitle: "AI observes. Humans verify.",
    aiBody: "MUTAH extracts visible access evidence from images, keeps uncertainty explicit, and requires human review before publication.",
    publishAfterReview: "Published after review",
    contributeEyebrow: "Community builds trust",
    contributeTitle: "Be part of the change",
    contributeBody: "A recent photo or simple update can help someone else make a clearer decision before visiting.",
    contributeCta: "Start contributing",
    heroVisualLabel: "From uncertainty to clarity before the journey",
  },
};
