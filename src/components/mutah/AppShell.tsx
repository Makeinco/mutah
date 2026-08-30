import { Link } from "@tanstack/react-router";
import { Compass, Info, PlusCircle } from "lucide-react";
import type { ReactNode } from "react";
import { MutahLogo } from "./Logo";
import { cn } from "@/lib/utils";

const NAV = [
  { to: "/discover", label: "استكشف", icon: Compass },
  { to: "/contribute", label: "ساهم", icon: PlusCircle },
  { to: "/about", label: "مُتاح", icon: Info },
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
  return (
    <div className="flex min-h-dvh flex-col bg-background">
      <header className="sticky top-0 z-30 border-b border-border bg-background/95 backdrop-blur">
        <div
          className={cn(
            "mx-auto flex items-center justify-between gap-4 px-4 py-3",
            wide ? "max-w-7xl" : "max-w-5xl",
          )}
        >
          <Link to="/" aria-label="مُتاح ماب — الصفحة الرئيسية" className="shrink-0">
            <MutahLogo className="h-9" />
          </Link>
          {title ? <p className="truncate text-sm font-semibold text-muted-foreground">{title}</p> : null}
          <nav aria-label="التنقل الرئيسي" className="hidden items-center gap-1 md:flex">
            {NAV.map(({ to, label }) => (
              <Link
                key={to}
                to={to}
                className="min-h-11 rounded-xl px-4 py-2.5 text-sm font-semibold text-foreground hover:bg-muted"
                activeProps={{ className: "bg-primary-soft text-primary" }}
              >
                {label}
              </Link>
            ))}
          </nav>
        </div>
      </header>

      <main id="main-content" className={cn("mx-auto w-full flex-1 px-4 pb-28 pt-6 md:pb-12", wide ? "max-w-7xl" : "max-w-5xl")}>
        {children}
      </main>

      <nav
        aria-label="التنقل السفلي"
        className="fixed inset-x-0 bottom-0 z-30 border-t border-border bg-background/98 backdrop-blur md:hidden"
      >
        <ul className="mx-auto flex max-w-md">
          {NAV.map(({ to, label, icon: Icon }) => (
            <li key={to} className="flex-1">
              <Link
                to={to}
                className="flex min-h-16 flex-col items-center justify-center gap-1 text-xs font-semibold text-muted-foreground"
                activeProps={{ className: "text-primary" }}
              >
                <Icon className="size-6" aria-hidden="true" />
                {label}
              </Link>
            </li>
          ))}
        </ul>
      </nav>
    </div>
  );
}
