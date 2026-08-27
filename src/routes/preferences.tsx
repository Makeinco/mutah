import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { AppShell } from "@/components/mutah/AppShell";
import { Button } from "@/components/mutah/ui";
import { ACCESS_NEEDS, ACCESS_NEED_LABEL } from "@/lib/mutah/labels";
import { useMutah } from "@/lib/mutah/store";
import type { AccessNeed } from "@/lib/mutah/types";

export const Route = createFileRoute("/preferences")({
  head: () => ({
    meta: [
      { title: "احتياجات الوصول | مُتاح ماب" },
      {
        name: "description",
        content: "اختر ما يجعل الزيارة أسهل عليك: مسار بلا درجات، منحدر، مسار خالٍ من العوائق، درابزين، أو موقف مخصص.",
      },
      { property: "og:title", content: "احتياجات الوصول | مُتاح ماب" },
      { property: "og:description", content: "نستخدم احتياجاتك لشرح ما يطابقها وما لا يطابقها في كل مدخل." },
    ],
  }),
  component: Preferences,
});

function Preferences() {
  const navigate = useNavigate();
  const { needs, setNeeds, skipNeeds } = useMutah();
  const [selected, setSelected] = useState<AccessNeed[]>(needs);

  const toggle = (n: AccessNeed) =>
    setSelected((prev) => (prev.includes(n) ? prev.filter((x) => x !== n) : [...prev, n]));

  return (
    <AppShell title="احتياجات الوصول">
      <div className="mx-auto max-w-xl">
        <h1 className="text-2xl font-bold">ما الذي تحتاجه لتكون الزيارة أسهل؟</h1>
        <p className="mt-2 text-muted-foreground">
          هذه احتياجات وصول، ولا نطلب أي معلومة طبية. يمكنك تغييرها في أي وقت.
        </p>

        <fieldset className="mt-8">
          <legend className="sr-only">اختر احتياجات الوصول</legend>
          <ul className="space-y-3">
            {ACCESS_NEEDS.map((n) => {
              const checked = selected.includes(n);
              return (
                <li key={n}>
                  <label
                    className={[
                      "flex min-h-16 cursor-pointer items-center gap-3 rounded-2xl border-2 p-4 text-base font-semibold",
                      checked ? "border-primary bg-primary-soft" : "border-border bg-card hover:bg-muted",
                    ].join(" ")}
                  >
                    <input
                      type="checkbox"
                      checked={checked}
                      onChange={() => toggle(n)}
                      className="size-6 accent-[var(--color-primary)]"
                    />
                    {ACCESS_NEED_LABEL[n]}
                  </label>
                </li>
              );
            })}
          </ul>
        </fieldset>

        <div className="mt-8 flex flex-col gap-3 sm:flex-row">
          <Button
            size="lg"
            className="sm:flex-1"
            onClick={() => {
              setNeeds(selected);
              navigate({ to: "/discover" });
            }}
          >
            متابعة
          </Button>
          <Button
            size="lg"
            variant="ghost"
            onClick={() => {
              skipNeeds();
              navigate({ to: "/discover" });
            }}
          >
            تخطي الآن
          </Button>
        </div>
      </div>
    </AppShell>
  );
}
