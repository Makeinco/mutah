import logoAsset from "@/assets/mutah-logo.png.asset.json";
import iconAsset from "@/assets/mutah-icon.png.asset.json";
import { cn } from "@/lib/utils";

/** Locked brand asset — never redrawn or recoloured. */
export function MutahLogo({ className }: { className?: string }) {
  return (
    <img
      src={logoAsset.url}
      alt="مُتاح | MUTAH"
      width={340}
      height={200}
      className={cn("h-auto w-auto object-contain", className)}
    />
  );
}

export function MutahMark({ className }: { className?: string }) {
  return (
    <img
      src={iconAsset.url}
      alt=""
      aria-hidden="true"
      width={64}
      height={70}
      className={cn("h-auto w-auto object-contain", className)}
    />
  );
}
