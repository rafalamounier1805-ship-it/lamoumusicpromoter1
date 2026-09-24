import ownerIconSprite from "@/assets/owner-icons/owner-icons-sprite.webp";
import {
  OWNER_ICON_INVENTORY,
  ownerOfficialIconIndex,
  type OwnerOfficialIconCode,
} from "@/lib/lamou/icon-governance";
import { cn } from "@/lib/utils";

const X_POSITIONS = ["0%", "25%", "50%", "75%", "100%"] as const;

export function OwnerOfficialIcon({
  code,
  className,
  decorative = true,
}: {
  code: OwnerOfficialIconCode;
  className?: string;
  decorative?: boolean;
}) {
  const index = ownerOfficialIconIndex(code);
  const column = index % OWNER_ICON_INVENTORY.cells.columns;
  const row = Math.floor(index / OWNER_ICON_INVENTORY.cells.columns);
  const meta = OWNER_ICON_INVENTORY.generated[index]!;

  return (
    <span
      role={decorative ? undefined : "img"}
      aria-hidden={decorative ? true : undefined}
      aria-label={decorative ? undefined : `${meta.label} · ${meta.code}`}
      title={decorative ? undefined : `${meta.label} · ${meta.code}`}
      data-icon-source="lamou-owner-icons-v0.1-cr"
      data-icon-code={code}
      className={cn(
        "inline-block shrink-0 rounded-md bg-contain bg-no-repeat shadow-[0_0_14px_oklch(0.74_0.15_218/0.16)]",
        className,
      )}
      style={{
        backgroundImage: `url(${ownerIconSprite})`,
        backgroundSize: "500% 200%",
        backgroundPosition: `${X_POSITIONS[column]} ${row === 0 ? "0%" : "100%"}`,
      }}
    />
  );
}
