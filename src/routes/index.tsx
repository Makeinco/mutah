import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { ArrowLeft, ArrowRight, Camera, Search } from "lucide-react";
import { useState } from "react";
import { AppShell } from "@/components/mutah/AppShell";
import { Button } from "@/components/mutah/ui";
import { useLang } from "@/lib/mutah/i18n";
import { relativeDate } from "@/lib/mutah/labels";
import { useMutah } from "@/lib/mutah/store";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "مُتاح ماب | اعرف قبل أن تصل" },
      {
        name: "description",
        content:
          "معلومات واضحة عن الوصول إلى الأماكن، مبنية على أدلة مرئية متعددة يراجعها البشر، بالعربية والإنجليزية.",
      },
      { property: "og:title", content: "مُتاح ماب | اعرف قبل أن تصل" },
      {
        property: "og:description",
        content: "أدلة مرئية عن الوصول: ما نعرفه، وما لا نعرفه، ولماذا.",
      },
    ],
  }),
  component: Home,
});

function Home() {
  const navigate = useNavigate();
  const { facilities } = useMutah();
  const { t, pick, lang } = useLang();
  const [query, setQuery] = useState("");
  const Arrow = lang === "ar" ? ArrowLeft : ArrowRight;

  const recent = [...facilities]
    .sort((a, b) => b.lastVerifiedISO.localeCompare(a.lastVerifiedISO))
    .slice(0, 3);

  return (
    <AppShell>
      <div className="relative mx-auto max-w-2xl overflow-hidden">
        <div
          aria-hidden="true"
          className="door-sweep pointer-events-none absolute end-0 top-0 h-56 w-[38%] rounded-es-[5rem] bg-primary-soft/50"
        />

        <section className="relative py-8 md:py-14">
          <p className="text-sm font-bold text-primary">مُتاح ماب | MUTAH MAP</p>
          <h1 className="door-reveal mt-3 text-4xl font-bold md:text-5xl">{t("tagline")}</h1>
          <p className="mt-3 max-w-lg text-lg text-muted-foreground">{t("taglineSub")}</p>

          <form
            className="mt-8"
            onSubmit={(e) => {
              e.preventDefault();
              navigate({ to: "/discover", search: { q: query || undefined } });
            }}
          >
            <label htmlFor="home-search" className="sr-only">
              {t("searchLabel")}
            </label>
            <div className="flex items-center gap-2 rounded-2xl border-2 border-input bg-background px-4 transition-colors focus-within:border-primary">
              <Search className="size-5 shrink-0 text-muted-foreground" aria-hidden="true" />
              <input
                id="home-search"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder={t("search")}
                className="min-h-14 w-full bg-transparent text-base outline-none placeholder:text-muted-foreground"
              />
            </div>
          </form>

          <div className="mt-6 grid gap-3 sm:grid-cols-2">
            <Button size="lg" onClick={() => navigate({ to: "/discover" })}>
              {t("explore")}
              <Arrow className="size-5" aria-hidden="true" />
            </Button>
            <Button size="lg" variant="outline" onClick={() => navigate({ to: "/preferences" })}>
              {t("setNeeds")}
            </Button>
          </div>

          <button
            type="button"
            onClick={() => navigate({ to: "/contribute" })}
            className="mt-4 flex min-h-14 w-full items-center justify-center gap-2 rounded-2xl border-2 border-access/50 bg-access-soft px-5 text-base font-bold text-access-strong transition-colors hover:bg-access-soft/70 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
          >
            <Camera className="size-5" aria-hidden="true" />
            {lang === "ar" ? "ساهم بتحديث دليل الوصول" : "Contribute updated access evidence"}
          </button>
        </section>

        <section aria-labelledby="recent-title" className="mt-4 pb-8">
          <h2 id="recent-title" className="text-sm font-bold text-muted-foreground">
            {t("recentlyUpdated")}
          </h2>
          <ul className="mt-3 divide-y divide-border border-y border-border">
            {recent.map((f) => (
              <li key={f.id}>
                <Link
                  to="/facility/$id"
                  params={{ id: f.id }}
                  className="flex min-h-14 items-center justify-between gap-3 py-3 text-sm transition-colors hover:text-primary"
                >
                  <span className="font-semibold">{pick(f.name)}</span>
                  <span className="text-muted-foreground">{relativeDate(f.lastVerifiedISO, lang)}</span>
                </Link>
              </li>
            ))}
          </ul>
        </section>
      </div>
    </AppShell>
  );
}
