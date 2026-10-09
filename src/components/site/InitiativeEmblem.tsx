import { cn } from "@/lib/utils";

/**
 * An initiative's logo emblem on a light rounded tile, so it reads on photos
 * and on the dark menu panel alike (several emblems use black or brown ink).
 */
export function InitiativeEmblem({
  src,
  title,
  className,
  decorative = false,
}: {
  src: string;
  title: string;
  className?: string;
  /** True where the initiative's name is already next to the emblem. */
  decorative?: boolean;
}) {
  return (
    <span
      className={cn(
        "inline-flex shrink-0 items-center justify-center rounded-xl bg-white p-1.5 shadow-sm",
        className,
      )}
    >
      <img
        src={src}
        alt={decorative ? "" : `${title} logo`}
        loading="lazy"
        decoding="async"
        className="h-full w-full min-h-0 min-w-0 object-contain"
      />
    </span>
  );
}
