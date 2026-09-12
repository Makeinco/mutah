import { cn } from "@/lib/utils";

const MUTAH_LOGO_SRC = "/assets/brand/mutah-logo.svg";
const MUTAH_ICON_SRC = "/assets/brand/mutah-icon.svg";

/** Locked brand asset — never redrawn or recoloured. */
export function MutahLogo({ className }: { className?: string }) {
  return (
    <img
      src={MUTAH_LOGO_SRC}
      alt="مُتاح | MUTAH"
      width={340}
      height={210}
      className={cn("h-auto w-auto object-contain", className)}
    />
  );
}

export function MutahMark({ className }: { className?: string }) {
  return (
    <img
      src={MUTAH_ICON_SRC}
      alt=""
      aria-hidden="true"
      width={64}
      height={70}
      className={cn("h-auto w-auto object-contain", className)}
    />
  );
}
