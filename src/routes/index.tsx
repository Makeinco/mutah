import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { ArrowLeft, ArrowRight, Search } from "lucide-react";
import { useState } from "react";
import { LanguageSwitcher } from "@/components/mutah/LanguageSwitcher";
import { MutahLogo } from "@/components/mutah/Logo";
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
          "معلومات واضحة عن مداخل الأماكن ومساراتها، مبنية على أدلة مرئية يراجعها البشر، بالعربية والإنجليزية.",
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
    <div className="relative flex min-h-dvh flex-col overflow-hidden bg-background">
      {/* Open door: a single quiet opening of space, not an icon. */}
      <div
        aria-hidden="true"
        className="door-sweep pointer-events-none absolute end-0 top-0 h-[46vh] w-[38%] rounded-es-[6rem] bg-primary-soft/50"
      />

      <main
        id="main-content"
        className="relative mx-auto flex w-full max-w-2xl flex-1 flex-col justify-center px-5 py-14"
      >
        <div className="flex items-start justify-between gap-4">
          <MutahLogo className="h-16 md:h-20" />
          <LanguageSwitcher />
        </div>

        <h1 className="door-reveal mt-10 text-4xl font-bold md:text-5xl">{t("tagline")}</h1>
        <p className="mt-3 max-w-md text-lg text-muted-foreground">{t("taglineSub")}</p>

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

        <div className="mt-6 flex flex-col gap-3 sm:flex-row">
          <Button size="lg" onClick={() => navigate({ to: "/discover" })} className="sm:flex-1">
            {t("explore")}
            <Arrow className="size-5" aria-hidden="true" />
          </Button>
          <Button
            size="lg"
            variant="outline"
            onClick={() => navigate({ to: "/preferences" })}
            className="sm:flex-1"
          >
            {t("setNeeds")}
          </Button>
        </div>

        <section aria-labelledby="recent-title" className="mt-12">
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
                  <span className="text-muted-foreground">
                    {relativeDate(f.lastVerifiedISO, lang)}
                  </span>
                </Link>
              </li>
            ))}
          </ul>
        </section>
      </main>
    </div>
  );
}
