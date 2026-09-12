import { Link } from "@tanstack/react-router";
import { Camera, Compass, Home, Shapes, UserRound } from "lucide-react";
import type { ComponentType, ReactNode, SVGProps } from "react";
import { MutahLogo } from "./Logo";
import { LanguageSwitcher } from "./LanguageSwitcher";
import { useLang } from "@/lib/mutah/i18n";
import { UI } from "@/lib/mutah/i18n";
import { cn } from "@/lib/utils";

type NavItem = {
  to: "/" | "/discover" | "/contribute" | "/ecosystem" | "/account";
  key: keyof typeof UI;
  icon: ComponentType<SVGProps<SVGSVGElement>>;
  primary?: boolean;
};

const NAV: readonly NavItem[] = [
  { to: "/", key: "navHome", icon: Home },
  { to: "/discover", key: "navDiscover", icon: Compass },
  { to: "/contribute", key: "navContribute", icon: Camera, primary: true },
  { to: "/ecosystem", key: "navMutah", icon: Shapes },
  { to: "/account", key: "navAccount", icon: UserRound },
] as const;

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
          <div className="flex items-center gap-2">
            <nav aria-label={t("mainNav")} className="hidden items-center gap-1 md:flex">
              {NAV.map(({ to, key, primary }) => {
                const activeProps = {
                  activeProps: {
                    className: primary
                      ? "ring-2 ring-primary ring-offset-2"
                      : "bg-primary-soft text-primary",
                  },
                };
                return (
                  <Link
                    key={to}
                    to={to}
                    className={cn(
                      "min-h-11 rounded-xl px-4 py-2.5 text-sm font-semibold transition-colors",
                      primary
                        ? "bg-primary text-primary-foreground hover:bg-primary/90"
                        : "text-foreground hover:bg-muted",
                    )}
                    {...activeProps}
                  >
                    {t(key)}
                  </Link>
                );
              })}
            </nav>
            <LanguageSwitcher />
          </div>
        </div>
      </header>

      <main
        id="main-content"
        tabIndex={-1}
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
        <ul className="mx-auto grid max-w-md grid-cols-5 items-end px-1 pb-[max(.25rem,env(safe-area-inset-bottom))]">
          {NAV.map(({ to, key, icon: Icon, primary }) => {
            const activeProps = { activeProps: { className: "text-primary" } };
            return (
              <li key={to} className="min-w-0">
                <Link
                  to={to}
                  className={cn(
                    "relative flex min-h-16 flex-col items-center justify-center gap-1 rounded-2xl px-1 text-[11px] font-semibold text-muted-foreground transition-all duration-200",
                    primary && "-translate-y-3 text-foreground",
                  )}
                  {...activeProps}
                >
                  <span
                    className={cn(
                      "flex items-center justify-center",
                      primary
                        ? "size-14 rounded-2xl border-4 border-background bg-primary text-primary-foreground shadow-[var(--shadow-raised)]"
                        : "size-7",
                    )}
                  >
                    <Icon className={primary ? "size-7" : "size-6"} aria-hidden="true" />
                  </span>
                  <span className={cn(primary && "-mt-0.5")}>{t(key)}</span>
                </Link>
              </li>
            );
          })}
        </ul>
      </nav>
    </div>
  );
}
