import { createFileRoute, Link } from "@tanstack/react-router";
import { Languages, LockKeyhole, SlidersHorizontal, UploadCloud } from "lucide-react";
import { AppShell } from "@/components/mutah/AppShell";
import { Card } from "@/components/mutah/ui";
import { LanguageSwitcher } from "@/components/mutah/LanguageSwitcher";
import { useLang } from "@/lib/mutah/i18n";

export const Route = createFileRoute("/account")({ component: AccountPage });

function AccountPage() {
  const { lang } = useLang();
  const ar = lang === "ar";

  return (
    <AppShell title={ar ? "حسابي" : "Account"}>
      <div className="mx-auto max-w-3xl space-y-5">
        <div>
          <h1 className="text-2xl font-bold">{ar ? "حسابي" : "Account"}</h1>
          <p className="mt-2 text-muted-foreground">
            {ar
              ? "إعدادات بسيطة تساعدك على تخصيص تجربة مُتاح دون طلب أي معلومات طبية."
              : "Simple settings that personalise MUTAH without asking for medical information."}
          </p>
        </div>

        <Card>
          <div className="flex items-start gap-3">
            <SlidersHorizontal className="mt-1 size-5 text-primary" aria-hidden="true" />
            <div className="flex-1">
              <h2 className="font-bold">{ar ? "احتياجات الوصول" : "Access needs"}</h2>
              <p className="mt-1 text-sm text-muted-foreground">
                {ar ? "عدّل ما تحتاجه لتكون الزيارة أسهل." : "Update what makes a visit easier for you."}
              </p>
              <Link to="/preferences" className="mt-3 inline-flex min-h-11 items-center rounded-xl border border-input px-4 text-sm font-semibold hover:bg-muted">
                {ar ? "تعديل الاحتياجات" : "Edit access needs"}
              </Link>
            </div>
          </div>
        </Card>

        <Card>
          <div className="flex items-center justify-between gap-4">
            <div className="flex items-start gap-3">
              <Languages className="mt-1 size-5 text-primary" aria-hidden="true" />
              <div>
                <h2 className="font-bold">{ar ? "اللغة" : "Language"}</h2>
                <p className="mt-1 text-sm text-muted-foreground">{ar ? "العربية هي اللغة الافتراضية." : "Arabic is the default language."}</p>
              </div>
            </div>
            <LanguageSwitcher />
          </div>
        </Card>

        <Card>
          <div className="flex items-start gap-3">
            <UploadCloud className="mt-1 size-5 text-primary" aria-hidden="true" />
            <div>
              <h2 className="font-bold">{ar ? "مساهماتي" : "My contributions"}</h2>
              <p className="mt-1 text-sm text-muted-foreground">
                {ar ? "ستظهر هنا المساهمات وحالة مراجعتها عند ربط الحسابات في النسخة التشغيلية." : "Your contributions and review status will appear here once accounts are connected in the production version."}
              </p>
              <p className="mt-3 text-xs font-semibold text-muted-foreground">{ar ? "بيانات تجريبية للعرض" : "Demo data for this preview"}</p>
            </div>
          </div>
        </Card>

        <Card>
          <div className="flex items-start gap-3">
            <LockKeyhole className="mt-1 size-5 text-primary" aria-hidden="true" />
            <div>
              <h2 className="font-bold">{ar ? "الخصوصية" : "Privacy"}</h2>
              <p className="mt-1 text-sm text-muted-foreground">
                {ar
                  ? "لا نطلب تشخيصًا طبيًا. تجنّب تصوير الوجوه ولوحات المركبات، وتُزال بيانات الصور غير الضرورية عند الإمكان."
                  : "We do not request medical diagnoses. Avoid faces and vehicle plates; unnecessary image metadata is removed where possible."}
              </p>
            </div>
          </div>
        </Card>
      </div>
    </AppShell>
  );
}
