import { createFileRoute, Link } from "@tanstack/react-router";
import { Languages, LockKeyhole, LogIn, LogOut, SlidersHorizontal, UploadCloud, UserRound } from "lucide-react";
import { useEffect, useState } from "react";
import { AppShell } from "@/components/mutah/AppShell";
import { Button, Card } from "@/components/mutah/ui";
import { LanguageSwitcher } from "@/components/mutah/LanguageSwitcher";
import { useAuth } from "@/lib/mutah/auth";
import { useLang } from "@/lib/mutah/i18n";
import { listMyContributions, type PersistedContribution } from "@/lib/mutah/operational";

export const Route = createFileRoute("/account")({ component: AccountPage });

const STATUS_LABEL: Record<PersistedContribution["status"], { ar: string; en: string }> = {
  draft: { ar: "قيد التجهيز", en: "Draft" },
  processing: { ar: "قيد التجهيز", en: "Processing" },
  awaiting_confirmation: { ar: "بانتظار تأكيدك", en: "Awaiting your confirmation" },
  pending_review: { ar: "قيد المراجعة", en: "Under review" },
  clarification_requested: { ar: "يحتاج توضيحًا", en: "Needs clarification" },
  approved: { ar: "تمت المراجعة", en: "Reviewed" },
  rejected: { ar: "لم تُعتمد", en: "Not approved" },
};

function AccountPage() {
  const { lang } = useLang();
  const { ready, user, profile, signInWithEmail, signOut, canReview } = useAuth();
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [sending, setSending] = useState(false);
  const [contributions, setContributions] = useState<PersistedContribution[]>([]);
  const [loadingContributions, setLoadingContributions] = useState(false);
  const ar = lang === "ar";

  useEffect(() => {
    if (!user) {
      setContributions([]);
      return;
    }
    setLoadingContributions(true);
    void listMyContributions()
      .then(setContributions)
      .catch(() => setContributions([]))
      .finally(() => setLoadingContributions(false));
  }, [user]);

  const submitLogin = async () => {
    if (!email.trim()) return;
    setSending(true);
    setMessage("");
    const result = await signInWithEmail(email.trim(), lang);
    setSending(false);
    setMessage(
      result.error
        ? ar
          ? "تعذر إرسال رابط الدخول. تحقق من البريد وحاول مرة أخرى."
          : "Could not send the sign-in link. Check the email and try again."
        : ar
          ? "أرسلنا رابط دخول آمن إلى بريدك. افتحه للعودة إلى مُتاح."
          : "We sent a secure sign-in link to your email. Open it to return to MUTAH.",
    );
  };

  return (
    <AppShell title={ar ? "حسابي" : "Account"}>
      <div className="mx-auto max-w-3xl space-y-5">
        <div>
          <h1 className="text-2xl font-bold">{ar ? "حسابي" : "Account"}</h1>
          <p className="mt-2 text-muted-foreground">
            {ar
              ? "استكشف مُتاح دون تسجيل. استخدم الحساب فقط لإرسال مساهمة حقيقية ومتابعتها بين الأجهزة."
              : "Browse MUTAH without signing in. Use an account only to submit and track real contributions across devices."}
          </p>
        </div>

        {!ready ? (
          <Card>
            <p className="text-sm text-muted-foreground">{ar ? "جاري التحقق من الحساب…" : "Checking your account…"}</p>
          </Card>
        ) : !user ? (
          <Card className="border-2 border-primary/20">
            <div className="flex items-start gap-3">
              <span className="flex size-11 shrink-0 items-center justify-center rounded-xl bg-primary-soft text-primary">
                <LogIn className="size-5" aria-hidden="true" />
              </span>
              <div className="min-w-0 flex-1">
                <h2 className="font-bold">{ar ? "الدخول للمساهمة" : "Sign in to contribute"}</h2>
                <p className="mt-1 text-sm text-muted-foreground">
                  {ar
                    ? "ندخل عبر رابط آمن إلى البريد الإلكتروني — بدون كلمة مرور."
                    : "Sign in with a secure email link — no password required."}
                </p>
                <label htmlFor="account-email" className="mt-4 block text-sm font-semibold">
                  {ar ? "البريد الإلكتروني" : "Email"}
                </label>
                <input
                  id="account-email"
                  type="email"
                  autoComplete="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="mt-2 min-h-12 w-full rounded-xl border-2 border-input bg-background px-4 text-base"
                  placeholder="name@example.com"
                />
                <Button className="mt-3" onClick={submitLogin} disabled={sending || !email.trim()}>
                  {sending ? (ar ? "جاري الإرسال…" : "Sending…") : ar ? "أرسل رابط الدخول" : "Send sign-in link"}
                </Button>
                <p aria-live="polite" className="mt-3 text-sm font-semibold text-muted-foreground">
                  {message}
                </p>
              </div>
            </div>
          </Card>
        ) : (
          <Card>
            <div className="flex flex-wrap items-center justify-between gap-4">
              <div className="flex items-start gap-3">
                <UserRound className="mt-1 size-5 text-primary" aria-hidden="true" />
                <div>
                  <h2 className="font-bold">{profile?.display_name || user.email}</h2>
                  <p className="mt-1 text-sm text-muted-foreground">{user.email}</p>
                  <p className="mt-2 text-xs font-semibold text-muted-foreground">
                    {profile?.role === "admin"
                      ? ar ? "مدير مُتاح" : "MUTAH admin"
                      : profile?.role === "reviewer"
                        ? ar ? "مراجع مُتاح" : "MUTAH reviewer"
                        : ar ? "حساب مساهم" : "Contributor account"}
                  </p>
                </div>
              </div>
              <div className="flex flex-wrap gap-2">
                {canReview ? (
                  <Link to="/ops">
                    <Button size="sm">{ar ? "مركز العمليات" : "Operations"}</Button>
                  </Link>
                ) : null}
                <Button variant="outline" size="sm" onClick={() => void signOut()}>
                  <LogOut className="size-4" aria-hidden="true" />
                  {ar ? "تسجيل الخروج" : "Sign out"}
                </Button>
              </div>
            </div>
          </Card>
        )}

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
            <div className="min-w-0 flex-1">
              <h2 className="font-bold">{ar ? "مساهماتي" : "My contributions"}</h2>
              {!user ? (
                <p className="mt-1 text-sm text-muted-foreground">
                  {ar ? "سجّل الدخول لتتمكن من متابعة مساهماتك وطلبات التوضيح." : "Sign in to track contributions and clarification requests."}
                </p>
              ) : loadingContributions ? (
                <p className="mt-2 text-sm text-muted-foreground">{ar ? "جارٍ تحميل مساهماتك…" : "Loading your contributions…"}</p>
              ) : contributions.length === 0 ? (
                <p className="mt-2 text-sm text-muted-foreground">
                  {ar ? "لا توجد مساهمات محفوظة في حسابك بعد." : "No persisted contributions in your account yet."}
                </p>
              ) : (
                <ul className="mt-4 space-y-3">
                  {contributions.map((item) => (
                    <li key={item.id} className="rounded-xl border border-border p-3">
                      <div className="flex flex-wrap items-start justify-between gap-2">
                        <div>
                          <p className="font-semibold">
                            {ar ? item.facility?.name_ar : item.facility?.name_en || item.facility?.name_ar}
                          </p>
                          <p className="mt-1 text-xs text-muted-foreground">
                            {ar ? item.zone?.label_ar : item.zone?.label_en || item.zone?.label_ar}
                          </p>
                        </div>
                        <span className="rounded-full bg-muted px-3 py-1 text-xs font-semibold">
                          {ar ? STATUS_LABEL[item.status].ar : STATUS_LABEL[item.status].en}
                        </span>
                      </div>
                      {item.clarification_note ? (
                        <p className="mt-3 rounded-lg bg-unknown-soft p-3 text-sm">
                          {item.clarification_note}
                        </p>
                      ) : null}
                    </li>
                  ))}
                </ul>
              )}
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
                  ? "لا نطلب تشخيصًا طبيًا. تجنّب تصوير الوجوه ولوحات المركبات، وتبقى صور المساهمة الخام خاصة أثناء المراجعة."
                  : "We do not request medical diagnoses. Avoid faces and vehicle plates; raw contribution images remain private during review."}
              </p>
            </div>
          </div>
        </Card>
      </div>
    </AppShell>
  );
}
