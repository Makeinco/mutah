import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { ArrowLeft, Search } from "lucide-react";
import { useState } from "react";
import { MutahLogo } from "@/components/mutah/Logo";
import { Button } from "@/components/mutah/ui";
import { relativeArabic } from "@/lib/mutah/labels";
import { useMutah } from "@/lib/mutah/store";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "مُتاح ماب | اعرف قبل أن تصل" },
      {
        name: "description",
        content: "معلومات واضحة عن مداخل الأماكن، مبنية على أدلة مرئية يراجعها البشر، تساعدك قبل زيارة المكان.",
      },
      { property: "og:title", content: "مُتاح ماب | اعرف قبل أن تصل" },
      {
        property: "og:description",
        content: "أدلة مرئية عن مداخل المرافق: ما نعرفه، وما لا نعرفه، ولماذا.",
      },
    ],
  }),
  component: Home,
});

function Home() {
  const navigate = useNavigate();
  const { facilities } = useMutah();
  const [query, setQuery] = useState("");

  const recent = [...facilities]
    .sort((a, b) => b.lastVerifiedISO.localeCompare(a.lastVerifiedISO))
    .slice(0, 3);

  return (
    <div className="relative flex min-h-dvh flex-col overflow-hidden bg-background">
      {/* Open door: a single quiet opening of space, not an icon. */}
      <div
        aria-hidden="true"
        className="door-sweep pointer-events-none absolute inset-y-0 right-0 w-[42%] bg-primary-soft/60"
      />
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-y-0 right-[42%] w-1 bg-brand-green"
      />

      <main id="main-content" className="relative mx-auto flex w-full max-w-2xl flex-1 flex-col justify-center px-5 py-14">
        <MutahLogo className="h-16 md:h-20" />

        <h1 className="mt-10 text-4xl font-bold md:text-5xl">اعرف قبل أن تصل</h1>
        <p className="mt-3 max-w-md text-lg text-muted-foreground">
          معلومات واضحة عن المدخل تساعدك قبل زيارة المكان.
        </p>

        <form
          className="mt-8"
          onSubmit={(e) => {
            e.preventDefault();
            navigate({ to: "/discover", search: { q: query || undefined } });
          }}
        >
          <label htmlFor="home-search" className="sr-only">
            ابحث عن مكان
          </label>
          <div className="flex items-center gap-2 rounded-2xl border-2 border-input bg-background px-4 focus-within:border-primary">
            <Search className="size-5 shrink-0 text-muted-foreground" aria-hidden="true" />
            <input
              id="home-search"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="ابحث عن مكان..."
              className="min-h-14 w-full bg-transparent text-base outline-none placeholder:text-muted-foreground"
            />
          </div>
        </form>

        <div className="mt-6 flex flex-col gap-3 sm:flex-row">
          <Button size="lg" onClick={() => navigate({ to: "/discover" })} className="sm:flex-1">
            استكشف الأماكن
            <ArrowLeft className="size-5" aria-hidden="true" />
          </Button>
          <Button
            size="lg"
            variant="outline"
            onClick={() => navigate({ to: "/preferences" })}
            className="sm:flex-1"
          >
            حدد احتياجات الوصول
          </Button>
        </div>

        <section aria-labelledby="recent-title" className="mt-12">
          <h2 id="recent-title" className="text-sm font-bold text-muted-foreground">
            أماكن تم تحديث معلوماتها مؤخرًا
          </h2>
          <ul className="mt-3 divide-y divide-border border-y border-border">
            {recent.map((f) => (
              <li key={f.id}>
                <Link
                  to="/facility/$id"
                  params={{ id: f.id }}
                  className="flex min-h-14 items-center justify-between gap-3 py-3 text-sm hover:text-primary"
                >
                  <span className="font-semibold">{f.name}</span>
                  <span className="text-muted-foreground">{relativeArabic(f.lastVerifiedISO)}</span>
                </Link>
              </li>
            ))}
          </ul>
        </section>
      </main>
    </div>
  );
}
