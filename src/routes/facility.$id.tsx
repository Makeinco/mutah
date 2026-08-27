import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { CalendarClock, Camera, Flag, MapPin, ShieldCheck } from "lucide-react";
import { AppShell } from "@/components/mutah/AppShell";
import { DecisionSummary } from "@/components/mutah/DecisionSummary";
import { EvidenceList } from "@/components/mutah/Evidence";
import { Button, Card, EmptyState, SectionTitle, Tag } from "@/components/mutah/ui";
import { decideFor } from "@/lib/mutah/decision";
import { INDICATOR_ORDER, VERIFICATION_LABEL, formatArabicDate } from "@/lib/mutah/labels";
import { useMutah } from "@/lib/mutah/store";

export const Route = createFileRoute("/facility/$id")({
  head: () => ({
    meta: [
      { title: "معلومات المدخل | مُتاح ماب" },
      {
        name: "description",
        content: "أدلة مرئية عن مدخل المرفق: ما هو ظاهر، وما هو غير مرئي، ومتى جرى التحقق منه.",
      },
      { property: "og:title", content: "معلومات المدخل | مُتاح ماب" },
      { property: "og:description", content: "الأدلة أولًا: خمسة عناصر مرئية عند المدخل، مع توضيح ما لا نعرفه." },
    ],
  }),
  component: FacilityProfile,
});

function FacilityProfile() {
  const { id } = Route.useParams();
  const navigate = useNavigate();
  const { getFacility, needs, contributions } = useMutah();
  const facility = getFacility(id);

  if (!facility) {
    return (
      <AppShell title="المرفق">
        <EmptyState
          title="لم نجد هذا المرفق"
          description="ربما تغيّر الرابط. عد إلى الاستكشاف للبحث من جديد."
          action={
            <Link to="/discover">
              <Button>العودة إلى الاستكشاف</Button>
            </Link>
          }
        />
      </AppShell>
    );
  }

  const decision = decideFor(facility, needs);
  const evidence = INDICATOR_ORDER.map((k) => facility.indicators[k]);
  const pending = contributions.filter(
    (c) => c.facilityId === facility.id && c.status === "pending_review",
  );

  return (
    <AppShell title={facility.name}>
      <article className="mx-auto max-w-3xl">
        <header>
          <h1 className="text-2xl font-bold">{facility.name}</h1>
          <p className="mt-1 flex flex-wrap items-center gap-2 text-muted-foreground">
            <span>{facility.category}</span>
            <span aria-hidden="true">·</span>
            <span className="flex items-center gap-1">
              <MapPin className="size-4" aria-hidden="true" />
              {facility.area}
            </span>
          </p>
        </header>

        {facility.imageUrl ? (
          <img
            src={facility.imageUrl}
            alt={facility.imageAlt}
            width={1200}
            height={900}
            className="mt-5 aspect-4/3 w-full rounded-2xl object-cover sm:aspect-video"
          />
        ) : (
          <div className="mt-5 rounded-2xl border-2 border-dashed border-input p-10 text-center text-sm text-muted-foreground">
            لا توجد صورة حديثة لهذا المدخل. المساهمة بصورة تجعل المعلومات أوضح للجميع.
          </div>
        )}

        <div className="mt-5">
          <DecisionSummary decision={decision} hasNeeds={needs.length > 0} />
        </div>

        {pending.length > 0 ? (
          <p className="mt-4 rounded-xl border-2 border-dashed border-input bg-unknown-soft p-4 text-sm">
            توجد {pending.length} مساهمة قيد المراجعة لهذا المرفق. لن تُنشر قبل مراجعتها.
          </p>
        ) : null}

        <section aria-labelledby="entrance-title" className="mt-10">
          <div id="entrance-title">
            <SectionTitle hint="خمسة عناصر مرئية فقط. ما لا يظهر في الصور يبقى معروضًا كغير مؤكد.">
              معلومات المدخل
            </SectionTitle>
          </div>
          <EvidenceList items={evidence} />
        </section>

        <section aria-labelledby="analysis-title" className="mt-10">
          <div id="analysis-title">
            <SectionTitle hint="تحليل أولي يحتاج إلى تحقق. الذكاء الاصطناعي يرصد، والبشر يتحققون.">
              دليل التحليل
            </SectionTitle>
          </div>
          <Card className="bg-surface">
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li>المصدر: {facility.source === "team_survey" ? "مسح ميداني من فريق مُتاح" : "صورة مساهم"}</li>
              <li>المدخلات: صورة واحدة للمدخل ضمن إطار محدود.</li>
              <li>لا يُعد هذا التحليل شهادة إتاحة، ولا يصف ما هو خارج إطار الصورة.</li>
            </ul>
          </Card>
        </section>

        <section aria-labelledby="status-title" className="mt-10">
          <div id="status-title">
            <SectionTitle>حالة المعلومة</SectionTitle>
          </div>
          <Card>
            <ul className="space-y-3 text-sm">
              <li className="flex items-center gap-2">
                <ShieldCheck className="size-5 text-primary" aria-hidden="true" />
                {VERIFICATION_LABEL[facility.verification]}
              </li>
              <li className="flex items-center gap-2">
                <CalendarClock className="size-5 text-primary" aria-hidden="true" />
                آخر تحقق: {formatArabicDate(facility.lastVerifiedISO)}
              </li>
              <li className="flex flex-wrap items-center gap-2">
                <Tag>المصدر: {facility.source === "team_survey" ? "مسح فريق مُتاح" : "صورة مساهم"}</Tag>
                <Tag tone={decision.completeness >= 4 ? "brand" : "warn"}>
                  اكتمال المعلومات {decision.completeness}/5
                </Tag>
              </li>
            </ul>
          </Card>
        </section>

        <div className="mt-8 flex flex-col gap-3 sm:flex-row">
          <Button
            size="lg"
            className="sm:flex-1"
            onClick={() => navigate({ to: "/contribute/$facilityId", params: { facilityId: facility.id } })}
          >
            <Camera className="size-5" aria-hidden="true" />
            ساهم بصورة أحدث
          </Button>
          <Button
            size="lg"
            variant="outline"
            onClick={() => navigate({ to: "/contribute" })}
          >
            <Flag className="size-5" aria-hidden="true" />
            أبلغ عن تغير
          </Button>
        </div>
      </article>
    </AppShell>
  );
}
