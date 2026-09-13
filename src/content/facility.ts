import type { BilingualContent } from "./shared";

export type FacilityCopy = {
  decisionTitle: string;
  decisionDescription: string;
  evidenceTitle: string;
  evidenceDescription: string;
  whyThisResult: string;
  trustTrail: string;
  lastVerified: string;
  source: string;
  officialImageMissingTitle: string;
  officialImageDisclaimer: string;
  suggestOfficialImage: string;
  contributeEvidence: string;
  reportChange: string;
  notFoundTitle: string;
  notFoundBody: string;
};

export const FACILITY_COPY: BilingualContent<FacilityCopy> = {
  ar: {
    decisionTitle: "ملخص القرار",
    decisionDescription: "خلاصة مبنية على احتياجات الوصول والأدلة المنشورة المتاحة.",
    evidenceTitle: "أدلة الوصول في هذا المرفق",
    evidenceDescription:
      "لكل منطقة أدلتها الخاصة. عدم وجود صورة يعني أنها غير موثقة بعد، وليس أنها غير موجودة.",
    whyThisResult: "لماذا ظهرت هذه النتيجة؟",
    trustTrail: "مسار الثقة",
    lastVerified: "آخر تحقق",
    source: "المصدر",
    officialImageMissingTitle: "لا توجد صورة رسمية بعد",
    officialImageDisclaimer:
      "الصورة الرسمية لعرض المرفق فقط، ولا تُستخدم تلقائيًا كدليل على الإتاحة.",
    suggestOfficialImage: "اقترح صورة للمرفق",
    contributeEvidence: "ساهم بدليل أحدث",
    reportChange: "أبلغ عن تغير",
    notFoundTitle: "المرفق غير موجود",
    notFoundBody: "ربما تغير الرابط أو لم يعد هذا المرفق متاحًا للعرض.",
  },
  en: {
    decisionTitle: "Decision summary",
    decisionDescription:
      "A summary based on your access needs and the available published evidence.",
    evidenceTitle: "Access evidence at this place",
    evidenceDescription:
      "Each zone has its own evidence. No photo means it is Not Documented, not that it is absent.",
    whyThisResult: "Why this result?",
    trustTrail: "Trust trail",
    lastVerified: "Last verified",
    source: "Source",
    officialImageMissingTitle: "No official photo yet",
    officialImageDisclaimer:
      "The official photo is for facility display only and is not automatically used as accessibility evidence.",
    suggestOfficialImage: "Suggest a facility photo",
    contributeEvidence: "Contribute newer evidence",
    reportChange: "Report a change",
    notFoundTitle: "Facility not found",
    notFoundBody: "The link may have changed or this facility may no longer be available to view.",
  },
};
