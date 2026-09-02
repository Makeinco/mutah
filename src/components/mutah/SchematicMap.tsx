import { Link } from "@tanstack/react-router";
import { decideFor } from "@/lib/mutah/decision";
import { useLang } from "@/lib/mutah/i18n";
import type { AccessNeed, Facility } from "@/lib/mutah/types";

/**
 * Schematic map placeholder. Later replaced by MapLibre/MapTiler.
 * The map is never the only way to discover: the list view is always available.
 */
export function SchematicMap({
  facilities,
  needs,
  selectedId,
  onSelect,
}: {
  facilities: Facility[];
  needs: AccessNeed[];
  selectedId?: string | undefined;
  onSelect?: (id: string) => void;
}) {
  const { pick, lang } = useLang();

  return (
    <div className="relative overflow-hidden rounded-2xl border border-border bg-surface">
      <div
        aria-hidden="true"
        className="absolute inset-0 opacity-70"
        style={{
          backgroundImage:
            "linear-gradient(to left, var(--color-border) 1px, transparent 1px), linear-gradient(to bottom, var(--color-border) 1px, transparent 1px)",
          backgroundSize: "56px 56px",
        }}
      />
      <div className="relative aspect-4/3 w-full sm:aspect-video">
        {facilities.map((f) => {
          const verdict = decideFor(f, needs).verdict;
          const selected = f.id === selectedId;
          return (
            <button
              key={f.id}
              type="button"
              onClick={() => onSelect?.(f.id)}
              aria-pressed={selected}
              style={{ insetInlineStart: `${f.point.x * 100}%`, top: `${f.point.y * 100}%` }}
              className="absolute -translate-x-1/2 -translate-y-1/2 rounded-xl transition-transform focus-visible:z-10 hover:scale-105"
            >
              <span
                className={[
                  "flex min-h-11 items-center gap-2 rounded-xl border-2 bg-background px-3 py-2 text-xs font-bold shadow-sm",
                  selected ? "border-primary ring-2 ring-primary" : "border-border",
                ].join(" ")}
              >
                <span
                  aria-hidden="true"
                  className={[
                    "inline-block h-5 w-1.5 rounded-full",
                    verdict === "available"
                      ? "bg-access"
                      : verdict === "not_available"
                        ? "bg-caution"
                        : verdict === "partial"
                          ? "bg-primary"
                          : "bg-unknown",
                  ].join(" ")}
                />
                {pick(f.name)}
              </span>
            </button>
          );
        })}
      </div>

      <p className="border-t border-border bg-background px-4 py-3 text-sm text-muted-foreground">
        {lang === "ar"
          ? "عرض تخطيطي للمواقع. القائمة تحتوي على المعلومات نفسها بصيغة يمكن قراءتها بالكامل."
          : "A schematic view. The list holds the same information in a fully readable form."}
      </p>

      {selectedId ? (
        <div className="border-t border-border bg-background px-4 py-3">
          <Link
            to="/facility/$id"
            params={{ id: selectedId }}
            className="text-sm font-semibold text-primary hover:underline"
          >
            {lang === "ar" ? "عرض تفاصيل الموقع المحدد" : "View the selected place"}
          </Link>
        </div>
      ) : null}
    </div>
  );
}
