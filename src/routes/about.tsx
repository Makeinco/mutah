import { createFileRoute, Link } from "@tanstack/react-router";
import { AppShell } from "@/components/mutah/AppShell";
import { MutahLogo } from "@/components/mutah/Logo";
import { Card, SectionTitle } from "@/components/mutah/ui";

export const Route = createFileRoute("/about")({
  head: () => ({
    meta: [
      { title: "عن مُتاح | مُتاح ماب" },
      {
        name: "description",
        content: "مُتاح ماب منصة قرار عن إتاحة المداخل: الذكاء الاصطناعي يرصد، والبشر يتحققون، والمعلومة غير المؤكدة تبقى ظاهرة.",
      },
      { property: "og:title", content: "عن مُتاح | مُتاح ماب" },
      { property: "og:description", content: "الأدلة → الفهم → القرار." },
    ],
  }),
  component: About,
});

function About() {
  return (
    <AppShell title="مُتاح">
      <div className="mx-auto max-w-2xl">
        <MutahLogo className="h-14" />
        <h1 className="mt-8 text-2xl font-bold">اعرف قبل أن تصل</h1>
        <p className="mt-3 text-muted-foreground">
          مُتاح ماب يساعدك على فهم ما ينتظرك عند مدخل المكان قبل الزيارة، اعتمادًا على أدلة مرئية
          واضحة: ماذا نعرف؟ وما الذي لا نعرفه؟ ولماذا؟
        </p>

        <div className="mt-10">
          <SectionTitle>الذكاء الاصطناعي يرصد، والبشر يتحققون</SectionTitle>
          <Card className="bg-surface">
            <ol className="list-inside list-decimal space-y-1 text-sm text-muted-foreground">
              <li>صورة للمدخل</li>
              <li>فحص جودة الصورة</li>
              <li>حماية الخصوصية</li>
              <li>تحليل أولي للعناصر المرئية</li>
              <li>تأكيد المساهم</li>
              <li>مراجعة بشرية</li>
              <li>النشر</li>
            </ol>
          </Card>
          <p className="mt-3 text-sm text-muted-foreground">
            لا يمنح مُتاح شهادة إتاحة لأي مبنى، ولا يعرض درجة أو نسبة عامة. الأدلة أهم من الدرجة.
          </p>
        </div>

        <div className="mt-10">
          <SectionTitle hint="خمسة عناصر مرئية فقط عند المدخل.">نطاق ما نحلله</SectionTitle>
          <ul className="list-inside list-disc space-y-1 text-sm">
            <li>درجات أو عتبة مرتفعة</li>
            <li>منحدر</li>
            <li>درابزين</li>
            <li>عائق في مسار الوصول</li>
            <li>موقف مخصص أو علامة إتاحة</li>
          </ul>
          <p className="mt-3 text-sm text-muted-foreground">
            «غير مرئي» لا يعني «غير موجود». المعلومة غير المؤكدة تبقى ظاهرة دائمًا.
          </p>
        </div>

        <div className="mt-10">
          <SectionTitle>تجارب مخصصة للأدوار</SectionTitle>
          <div className="flex flex-wrap gap-3">
            <Link
              to="/review"
              className="min-h-12 rounded-xl border-2 border-input px-5 py-3 text-sm font-semibold hover:bg-muted"
            >
              مركز المراجعة
            </Link>
            <Link
              to="/insights"
              className="min-h-12 rounded-xl border-2 border-input px-5 py-3 text-sm font-semibold hover:bg-muted"
            >
              مُتاح إنسايتس
            </Link>
          </div>
        </div>
      </div>
    </AppShell>
  );
}
