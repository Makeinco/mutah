import { Link } from "@tanstack/react-router";
import { Compass, Info, Network, PlusCircle } from "lucide-react";
import type { ReactNode } from "react";
import { MutahLogo } from "./Logo";
import { LanguageSwitcher } from "./LanguageSwitcher";
import { useLang } from "@/lib/mutah/i18n";
import { UI } from "@/lib/mutah/i18n";
import { cn } from "@/lib/utils";

const NAV = [
  { to: "/discover", key: "navDiscover", icon: Compass },
  { to: "/contribute", key: "navContribute", icon: PlusCircle },
  { to: "/ecosystem", key: "navEcosystem", icon: Network },
  { to: "/about", key: "navAbout", icon: Info },
] as const satisfies ReadonlyArray<{
  to: string;
  key: keyof typeof UI;
  icon: typeof Compass;
}>;

export function AppShell({
  children,
  title,
  wide = false,
}: {
  children: ReactNode;
  title?: string;
  wide?: boolean;
}) {
  const { t } = useLang();

  return (
    <div className="flex min-h-dvh flex-col bg-background">
      <header className="sticky top-0 z-30 border-b border-border bg-background/95 backdrop-blur">
        <div
          className={cn(
            "mx-auto flex items-center justify-between gap-3 px-4 py-3",
            wide ? "max-w-7xl" : "max-w-5xl",
          )}
        >
          <Link to="/" aria-label={`${t("brand")} — ${t("home")}`} className="shrink-0">
            <MutahLogo className="h-9" />
          </Link>
          {title ? (
            <p className="hidden truncate text-sm font-semibold text-muted-foreground sm:block">
              {title}
            </p>
          ) : null}
          <div className="flex items-center gap-1">
            <nav aria-label={t("mainNav")} className="hidden items-center gap-1 md:flex">
              {NAV.map(({ to, key }) => (
                <Link
                  key={to}
                  to={to}
                  className="min-h-11 rounded-xl px-4 py-2.5 text-sm font-semibold text-foreground transition-colors hover:bg-muted"
                  activeProps={{ className: "bg-primary-soft text-primary" }}
                >
                  {t(key)}
                </Link>
              ))}
            </nav>
            <LanguageSwitcher />
          </div>
        </div>
      </header>

      <main
        id="main-content"
        className={cn(
          "door-reveal mx-auto w-full flex-1 px-4 pb-28 pt-6 md:pb-12",
          wide ? "max-w-7xl" : "max-w-5xl",
        )}
      >
        {children}
      </main>

      <nav
        aria-label={t("bottomNav")}
        className="fixed inset-x-0 bottom-0 z-30 border-t border-border bg-background/98 backdrop-blur md:hidden"
      >
        <ul className="mx-auto flex max-w-md">
          {NAV.map(({ to, key, icon: Icon }) => (
            <li key={to} className="flex-1">
              <Link
                to={to}
                className="flex min-h-16 flex-col items-center justify-center gap-1 text-xs font-semibold text-muted-foreground"
                activeProps={{ className: "text-primary" }}
              >
                <Icon className="size-6" aria-hidden="true" />
                {t(key)}
              </Link>
            </li>
          ))}
        </ul>
      </nav>
    </div>
  );
}
