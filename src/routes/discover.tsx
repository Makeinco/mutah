import { createFileRoute, Link } from "@tanstack/react-router";
import { Search, SlidersHorizontal } from "lucide-react";
import { useMemo, useState } from "react";
import { z } from "zod";
import { AppShell } from "@/components/mutah/AppShell";
import { FacilityCard } from "@/components/mutah/FacilityCard";
import { SchematicMap } from "@/components/mutah/SchematicMap";
import { Button, Chip, EmptyState } from "@/components/mutah/ui";
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
        content: "ابحث عن المرافق وشاهد أدلة المدخل: منحدر، درجات، درابزين، عوائق المسار، وموقف مخصص.",
      },
      { property: "og:title", content: "استكشف الأماكن | مُتاح ماب" },
      { property: "og:description", content: "خريطة وقائمة لأدلة مداخل المرافق، مع توضيح ما هو غير معروف." },
    ],
  }),
  component: Discover,
});

function Discover() {
  const { q } = Route.useSearch();
  const { facilities, needs, setNeeds } = useMutah();
  const [query, setQuery] = useState(q ?? "");
  const [view, setView] = useState<"list" | "map">("list");
  const [selectedId, setSelectedId] = useState<string | undefined>(undefined);

  const results = useMemo(() => {
    const term = query.trim();
    return facilities.filter(
      (f) => !term || f.name.includes(term) || f.category.includes(term) || f.area.includes(term),
    );
  }, [facilities, query]);

  const toggleNeed = (n: AccessNeed) =>
    setNeeds(needs.includes(n) ? needs.filter((x) => x !== n) : [...needs, n]);

  return (
    <AppShell title="استكشف" wide>
      <h1 className="text-2xl font-bold">استكشف الأماكن</h1>

      <div className="mt-4 flex items-center gap-2 rounded-2xl border-2 border-input bg-background px-4 focus-within:border-primary">
        <Search className="size-5 shrink-0 text-muted-foreground" aria-hidden="true" />
        <label htmlFor="discover-search" className="sr-only">
          ابحث عن مكان
        </label>
        <input
          id="discover-search"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="ابحث عن مكان..."
          className="min-h-14 w-full bg-transparent text-base outline-none"
        />
      </div>

      <section aria-labelledby="filters-title" className="mt-5">
        <div className="flex flex-wrap items-center justify-between gap-2">
          <h2 id="filters-title" className="flex items-center gap-2 text-sm font-bold">
            <SlidersHorizontal className="size-4" aria-hidden="true" />
            احتياجات الوصول
          </h2>
          <Link to="/preferences" className="text-sm font-semibold text-primary hover:underline">
            تعديل الاحتياجات
          </Link>
        </div>
        <ul className="mt-3 flex flex-wrap gap-2">
          {ACCESS_NEEDS.map((n) => (
            <li key={n}>
              <Chip selected={needs.includes(n)} onClick={() => toggleNeed(n)}>
                {ACCESS_NEED_LABEL[n]}
              </Chip>
            </li>
          ))}
        </ul>
      </section>

      <div className="mt-6 flex items-center justify-between gap-3">
        <p aria-live="polite" className="text-sm text-muted-foreground">
          {results.length} نتيجة
        </p>
        <div
          role="group"
          aria-label="طريقة العرض"
          className="inline-flex rounded-xl border-2 border-border p-1"
        >
          <button
            type="button"
            aria-pressed={view === "map"}
            onClick={() => setView("map")}
            className={`min-h-11 rounded-lg px-4 text-sm font-semibold ${view === "map" ? "bg-primary text-primary-foreground" : "text-foreground"}`}
          >
            الخريطة
          </button>
          <button
            type="button"
            aria-pressed={view === "list"}
            onClick={() => setView("list")}
            className={`min-h-11 rounded-lg px-4 text-sm font-semibold ${view === "list" ? "bg-primary text-primary-foreground" : "text-foreground"}`}
          >
            القائمة
          </button>
        </div>
      </div>

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
              title="لا توجد نتائج مطابقة"
              description="جرّب اسمًا آخر أو أزل بعض عوامل التصفية. يمكنك أيضًا المساهمة بصورة مدخل لمكان لم يُوثّق بعد."
              action={
                <Link to="/contribute">
                  <Button variant="outline">اذهب إلى المساهمة</Button>
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
