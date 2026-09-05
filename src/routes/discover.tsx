import { createFileRoute, Link } from "@tanstack/react-router";
import { Search, SlidersHorizontal } from "lucide-react";
import { useMemo, useState } from "react";
import { z } from "zod";
import { AppShell } from "@/components/mutah/AppShell";
import { FacilityCard } from "@/components/mutah/FacilityCard";
import { SchematicMap } from "@/components/mutah/SchematicMap";
import { Button, Chip, EmptyState } from "@/components/mutah/ui";
import { useLang } from "@/lib/mutah/i18n";
import { ACCESS_NEEDS, ACCESS_NEED_LABEL } from "@/lib/mutah/labels";
import { useMutah } from "@/lib/mutah/store";
import type { AccessNeed } from "@/lib/mutah/types";

const searchSchema = z.object({ q: z.string().optional() });

export const Route = createFileRoute("/discover")({
  validateSearch: searchSchema,
  head: () => ({
    meta: [
      { title: "استكشف الأماكن | مُتاح ماب" },
      {
        name: "description",
        content:
          "ابحث عن الأماكن وشاهد أدلة الوصول حسب المنطقة: مسار الوصول، المدخل، المواقف، المصعد، ودورة المياه المخصصة.",
      },
      { property: "og:title", content: "استكشف الأماكن | مُتاح ماب" },
      {
        property: "og:description",
        content: "خريطة وقائمة لأدلة الوصول، مع إبقاء المعلومات غير الموثقة وغير المؤكدة ظاهرة.",
      },
    ],
  }),
  component: Discover,
});

function Discover() {
  const { q } = Route.useSearch();
  const { facilities, needs, setNeeds } = useMutah();
  const { t, pick, lang } = useLang();
  const [query, setQuery] = useState(q ?? "");
  const [view, setView] = useState<"list" | "map">("list");
  const [selectedId, setSelectedId] = useState<string | undefined>(undefined);

  const results = useMemo(() => {
    const term = query.trim().toLowerCase();
    if (!term) return facilities;
    return facilities.filter((f) =>
      [f.name, f.category, f.area]
        .flatMap((v) => [v.ar, v.en])
        .some((v) => v.toLowerCase().includes(term)),
    );
  }, [facilities, query]);

  const toggleNeed = (n: AccessNeed) =>
    setNeeds(needs.includes(n) ? needs.filter((x) => x !== n) : [...needs, n]);

  return (
    <AppShell title={t("navDiscover")} wide>
      <h1 className="text-2xl font-bold">{t("explore")}</h1>
      <p className="mt-1 text-sm text-muted-foreground">
        {lang === "ar"
          ? "اختر احتياجاتك لعرض حالة مخصصة. المعلومات غير الموثقة لا تُعامل على أنها غير موجودة."
          : "Choose your access needs for a personalised status. Undocumented information is never treated as absent."}
      </p>

      <div className="mt-4 flex items-center gap-2 rounded-2xl border-2 border-input bg-background px-4 transition-colors focus-within:border-primary">
        <Search className="size-5 shrink-0 text-muted-foreground" aria-hidden="true" />
        <label htmlFor="discover-search" className="sr-only">
          {t("searchLabel")}
        </label>
        <input
          id="discover-search"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder={t("search")}
          className="min-h-14 w-full bg-transparent text-base outline-none"
        />
      </div>

      <section aria-labelledby="filters-title" className="mt-5">
        <div className="flex flex-wrap items-center justify-between gap-2">
          <h2 id="filters-title" className="flex items-center gap-2 text-sm font-bold">
            <SlidersHorizontal className="size-4" aria-hidden="true" />
            {t("accessNeeds")}
          </h2>
          <Link to="/preferences" className="text-sm font-semibold text-primary hover:underline">
            {t("editNeeds")}
          </Link>
        </div>
        <ul className="mt-3 flex flex-wrap gap-2">
          {ACCESS_NEEDS.map((n) => (
            <li key={n}>
              <Chip selected={needs.includes(n)} onClick={() => toggleNeed(n)}>
                {pick(ACCESS_NEED_LABEL[n])}
              </Chip>
            </li>
          ))}
        </ul>
      </section>

      <div className="mt-6 flex flex-wrap items-center justify-between gap-3">
        <p aria-live="polite" className="text-sm text-muted-foreground">
          {lang === "ar" ? `${results.length} نتيجة` : `${results.length} results`}
        </p>
        <div
          role="group"
          aria-label={t("viewMode")}
          className="inline-flex rounded-xl border-2 border-border p-1"
        >
          <button
            type="button"
            aria-pressed={view === "map"}
            onClick={() => setView("map")}
            className={`min-h-11 rounded-lg px-4 text-sm font-semibold transition-colors ${view === "map" ? "bg-primary text-primary-foreground" : "text-foreground"}`}
          >
            {t("mapView")}
          </button>
          <button
            type="button"
            aria-pressed={view === "list"}
            onClick={() => setView("list")}
            className={`min-h-11 rounded-lg px-4 text-sm font-semibold transition-colors ${view === "list" ? "bg-primary text-primary-foreground" : "text-foreground"}`}
          >
            {t("listView")}
          </button>
        </div>
      </div>

      {view === "map" ? (
        <p className="mt-2 text-xs text-muted-foreground lg:hidden">
          {lang === "ar"
            ? "يمكنك التحويل إلى «القائمة» في أي وقت للحصول على بديل نصي كامل للخريطة."
            : "Switch to List at any time for a complete text alternative to the map."}
        </p>
      ) : null}

      <div className="mt-4 grid gap-6 lg:grid-cols-[minmax(0,1fr)_minmax(0,1fr)]">
        <div className={view === "map" ? "block" : "hidden lg:block"}>
          <SchematicMap
            facilities={results}
            needs={needs}
            selectedId={selectedId}
            onSelect={setSelectedId}
          />
        </div>

        <div className={view === "list" ? "block" : "hidden lg:block"}>
          {results.length === 0 ? (
            <EmptyState
              title={t("noResults")}
              description={t("noResultsBody")}
              action={
                <Link to="/contribute">
                  <Button variant="outline">{t("goContribute")}</Button>
                </Link>
              }
            />
          ) : (
            <ul className="space-y-4">
              {results.map((f) => (
                <li key={f.id}>
                  <FacilityCard facility={f} needs={needs} />
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </AppShell>
  );
}
