import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { Camera, FileText, Flag } from "lucide-react";
import { useState } from "react";
import { AppShell } from "@/components/mutah/AppShell";
import { Button, Card, SectionTitle } from "@/components/mutah/ui";
import { useMutah } from "@/lib/mutah/store";

export const Route = createFileRoute("/contribute/")({
  head: () => ({
    meta: [
      { title: "ساهم | مُتاح ماب" },
      {
        name: "description",
        content: "حدّث صورة مدخل أو أبلغ عن تغير، لتصبح معلومات الوصول أكثر وضوحًا وحداثة.",
      },
      { property: "og:title", content: "ساهم | مُتاح ماب" },
      { property: "og:description", content: "صورة واحدة للمدخل تساعد الآخرين على معرفة ما ينتظرهم قبل الوصول." },
    ],
  }),
  component: Contribute,
});

function Contribute() {
  const navigate = useNavigate();
  const { facilities } = useMutah();
  const [facilityId, setFacilityId] = useState(facilities[0]?.id ?? "");
  const [reported, setReported] = useState(false);

  return (
    <AppShell title="ساهم">
      <div className="mx-auto max-w-2xl">
        <h1 className="text-2xl font-bold">ساهم</h1>
        <p className="mt-2 text-muted-foreground">
          ساعد في جعل معلومات الوصول أكثر وضوحًا وحداثة.
        </p>

        <Card className="mt-6 border-2 border-primary/30 bg-primary-soft/40">
          <div className="flex items-start gap-3">
            <span className="flex size-12 shrink-0 items-center justify-center rounded-xl bg-primary text-primary-foreground">
              <Camera className="size-6" aria-hidden="true" />
            </span>
            <div>
              <h2 className="text-lg font-bold">حدّث صورة مدخل</h2>
              <p className="mt-1 text-sm text-muted-foreground">
                أضف صورة حديثة تساعد الآخرين على معرفة ما ينتظرهم قبل الوصول.
              </p>
            </div>
          </div>

          <div className="mt-5">
            <label htmlFor="facility-select" className="mb-2 block text-sm font-semibold">
              اختر المرفق
            </label>
            <select
              id="facility-select"
              value={facilityId}
              onChange={(e) => setFacilityId(e.target.value)}
              className="min-h-12 w-full rounded-xl border-2 border-input bg-background px-3 text-base"
            >
              {facilities.map((f) => (
                <option key={f.id} value={f.id}>
                  {f.name} — {f.area}
                </option>
              ))}
            </select>
          </div>

          <Button
            size="lg"
            block
            className="mt-4"
            onClick={() => navigate({ to: "/contribute/$facilityId", params: { facilityId } })}
          >
            ابدأ المساهمة
          </Button>
        </Card>

        <div className="mt-8">
          <SectionTitle>خيارات أخرى</SectionTitle>
          <div className="grid gap-4 sm:grid-cols-2">
            <Card>
              <FileText className="size-6 text-primary" aria-hidden="true" />
              <h3 className="mt-3 font-bold">أضف مرفقًا</h3>
              <p className="mt-1 text-sm text-muted-foreground">
                مكان غير موجود في مُتاح؟ أرسل اسمه وموقعه ليُضاف لاحقًا.
              </p>
              <Button variant="outline" size="sm" className="mt-4" onClick={() => setReported(true)}>
                إرسال اقتراح مرفق
              </Button>
            </Card>
            <Card>
              <Flag className="size-6 text-primary" aria-hidden="true" />
              <h3 className="mt-3 font-bold">أبلغ عن تغير</h3>
              <p className="mt-1 text-sm text-muted-foreground">
                تغيّر المدخل عمّا هو منشور؟ أخبرنا لنعيد التحقق منه.
              </p>
              <Button variant="outline" size="sm" className="mt-4" onClick={() => setReported(true)}>
                إرسال بلاغ
              </Button>
            </Card>
          </div>
          <p aria-live="polite" className="mt-4 text-sm font-semibold text-access-strong">
            {reported ? "شكرًا لك. سجّلنا ملاحظتك وستتم مراجعتها قبل النشر." : ""}
          </p>
        </div>

        <p className="mt-10 text-sm text-muted-foreground">
          تُراجع كل مساهمة قبل نشرها.{" "}
          <Link to="/review" className="font-semibold text-primary hover:underline">
            مركز المراجعة
          </Link>{" "}
          تجربة مخصصة لفريق المراجعة.
        </p>
      </div>
    </AppShell>
  );
}
