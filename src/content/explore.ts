import type { BilingualContent } from "./shared";

export type ExploreCopy = {
  title: string;
  introduction: string;
  searchLabel: string;
  searchPlaceholder: string;
  filtersTitle: string;
  editNeeds: string;
  mapView: string;
  listView: string;
  resultSingular: string;
  resultPlural: string;
  emptyTitle: string;
  emptyBody: string;
  errorTitle: string;
  errorBody: string;
  locationOptional: string;
  showLocation: string;
  locationUnavailable: string;
  preciseLocationUnavailable: string;
};

export const EXPLORE_COPY: BilingualContent<ExploreCopy> = {
  ar: {
    title: "استكشف الأماكن",
    introduction:
      "اختر احتياجات الوصول لعرض المعلومات المناسبة لك. ما لم يُوثق يبقى واضحًا بوصفه غير موثق.",
    searchLabel: "ابحث عن مكان",
    searchPlaceholder: "ابحث باسم المكان أو الحي",
    filtersTitle: "تصفية حسب احتياجات الوصول",
    editNeeds: "تعديل احتياجات الوصول",
    mapView: "الخريطة",
    listView: "القائمة",
    resultSingular: "نتيجة واحدة",
    resultPlural: "نتائج",
    emptyTitle: "لا توجد أماكن مطابقة",
    emptyBody: "جرّب تعديل البحث أو احتياجات الوصول.",
    errorTitle: "تعذر تحميل الأماكن",
    errorBody: "لم تتغير بياناتك. حاول مرة أخرى.",
    locationOptional: "عرض موقعك اختياري ولا يبدأ إلا بطلبك.",
    showLocation: "اعرض موقعي",
    locationUnavailable: "تعذر تحديد موقعك. يمكنك متابعة استخدام الخريطة والقائمة.",
    preciseLocationUnavailable: "الموقع الدقيق غير متاح؛ لا نعرض علامة تخمينية.",
  },
  en: {
    title: "Explore places",
    introduction:
      "Choose your access needs to see relevant information. Anything without evidence stays clearly Not Documented.",
    searchLabel: "Search for a place",
    searchPlaceholder: "Search by place or area",
    filtersTitle: "Filter by access needs",
    editNeeds: "Edit access needs",
    mapView: "Map",
    listView: "List",
    resultSingular: "1 result",
    resultPlural: "results",
    emptyTitle: "No matching places",
    emptyBody: "Try changing your search or access needs.",
    errorTitle: "Places could not be loaded",
    errorBody: "Your data was not changed. Try again.",
    locationOptional: "Showing your location is optional and starts only when you request it.",
    showLocation: "Show my location",
    locationUnavailable: "Your location could not be found. You can keep using the map and list.",
    preciseLocationUnavailable: "A precise location is unavailable; no estimated marker is shown.",
  },
};
