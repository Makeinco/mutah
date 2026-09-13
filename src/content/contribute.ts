import type { BilingualContent } from "./shared";

export type ContributeStepKey = "photo" | "analysis" | "confirmation" | "submission";

export type ContributeCopy = {
  title: string;
  introduction: string;
  steps: Readonly<Record<ContributeStepKey, string>>;
  zoneTitle: string;
  zoneDescription: string;
  captureTitle: string;
  captureDescription: string;
  chooseFromDevice: string;
  takePhoto: string;
  useDemoImage: string;
  continueToAnalysis: string;
  analysisTitle: string;
  analysisDisclaimer: string;
  confirm: string;
  correct: string;
  cannotConfirm: string;
  tryAgain: string;
  submitForReview: string;
  submissionNotice: string;
  successTitle: string;
  successBody: string;
};

export const CONTRIBUTE_COPY: BilingualContent<ContributeCopy> = {
  ar: {
    title: "ساهم بدليل مرئي",
    introduction: "وثّق منطقة واحدة بصور واضحة، ثم راجع الرصد قبل الإرسال للتحقق البشري.",
    steps: {
      photo: "الصورة",
      analysis: "التحليل",
      confirmation: "التأكيد",
      submission: "الإرسال",
    },
    zoneTitle: "اختر الجزء الذي تظهره الصورة",
    zoneDescription: "اختر منطقة واحدة لكل حزمة صور حتى يبقى الدليل واضح السياق.",
    captureTitle: "صوّر المسار بوضوح",
    captureDescription: "أظهر المساحة المحيطة، وتجنب الوجوه ولوحات المركبات.",
    chooseFromDevice: "اختيار من الجهاز",
    takePhoto: "التقاط صورة",
    useDemoImage: "استخدام صورة تجريبية",
    continueToAnalysis: "متابعة للتحليل",
    analysisTitle: "تحليل أولي",
    analysisDisclaimer: "الذكاء الاصطناعي يرصد ما يظهر في الصورة، والبشر يتحققون قبل النشر.",
    confirm: "أؤكد",
    correct: "تصحيح",
    cannotConfirm: "لا أستطيع التأكد",
    tryAgain: "إعادة المحاولة",
    submitForReview: "إرسال للمراجعة",
    submissionNotice: "لن تُنشر المساهمة قبل التحقق البشري.",
    successTitle: "تم إرسال المساهمة للمراجعة",
    successBody: "شكرًا لمساعدتك في بناء معلومات أوضح قبل الوصول.",
  },
  en: {
    title: "Contribute visual evidence",
    introduction:
      "Document one zone with clear photos, then review the observations before Human verification.",
    steps: {
      photo: "Photo",
      analysis: "Analysis",
      confirmation: "Confirmation",
      submission: "Submission",
    },
    zoneTitle: "Choose the area shown in the photo",
    zoneDescription: "Choose one zone per image bundle so the evidence keeps a clear context.",
    captureTitle: "Capture the route clearly",
    captureDescription: "Show the surrounding space and avoid faces and vehicle plates.",
    chooseFromDevice: "Choose from device",
    takePhoto: "Take a photo",
    useDemoImage: "Use a demo image",
    continueToAnalysis: "Continue to analysis",
    analysisTitle: "Initial analysis",
    analysisDisclaimer:
      "AI observes what is visible in the image; humans verify before publication.",
    confirm: "Confirm",
    correct: "Correct",
    cannotConfirm: "I cannot confirm",
    tryAgain: "Try again",
    submitForReview: "Submit for review",
    submissionNotice: "The contribution will not be published before Human verification.",
    successTitle: "Contribution sent for review",
    successBody: "Thank you for helping build clearer information before arrival.",
  },
};
