import { cn } from "@/lib/utils";

/**
 * A faint architectural line drawing (a building section or a floor plan)
 * used as a page-header motif. Every stroke has pathLength 1, so the CSS in
 * styles.css (`.arch-drawing`) can draw it in by one variable, `--draw`,
 * which MotionLayer scrubs from 0 to 1 with the scroll. Fully drawn without
 * JavaScript or with reduced motion. Purely decorative.
 */
export function ArchitecturalDrawing({
  variant,
  intro = false,
  className,
}: {
  variant: "section" | "plan";
  /** In the first screen: draw itself once on load (CSS) instead of on scroll. */
  intro?: boolean;
  className?: string;
}) {
  return (
    <svg
      viewBox="0 0 480 280"
      aria-hidden="true"
      focusable="false"
      fill="none"
      stroke="currentColor"
      strokeWidth={1}
      strokeLinecap="round"
      strokeLinejoin="round"
      className={cn("arch-drawing", intro && "arch-drawing-intro", className)}
    >
      {variant === "section" ? <Section /> : <Plan />}
    </svg>
  );
}

const L = { pathLength: 1 } as const;

/** A two-storey building in section: grid, frame, slabs, stair and roof. */
function Section() {
  const grid = [70, 190, 310, 410];
  return (
    <>
      {/* Structural grid with its bubbles */}
      {grid.map((x) => (
        <g key={x}>
          <circle cx={x} cy={18} r={9} {...L} />
          <line x1={x} y1={27} x2={x} y2={52} {...L} />
        </g>
      ))}
      {/* Roof: a monopitch over a ridge beam */}
      <polyline points="56,118 70,110 410,62 424,64" {...L} />
      <line x1={70} y1={118} x2={410} y2={70} {...L} />
      {/* Columns */}
      {grid.map((x) => (
        <line key={`c${x}`} x1={x} y1={118 - ((x - 70) * 48) / 340} x2={x} y2={232} {...L} />
      ))}
      {/* First-floor slab and ground slab */}
      <rect x={58} y={168} width={364} height={7} {...L} />
      <line x1={58} y1={232} x2={422} y2={232} {...L} />
      {/* Stair between the floors */}
      <polyline
        points="216,232 216,222 230,222 230,212 244,212 244,202 258,202 258,192 272,192 272,182 286,182 286,175"
        {...L}
      />
      {/* Openings */}
      <rect x={96} y={132} width={66} height={26} {...L} />
      <rect x={330} y={190} width={56} height={34} {...L} />
      {/* Ground, footings and hatch */}
      <line x1={20} y1={240} x2={460} y2={240} {...L} />
      {grid.map((x) => (
        <rect key={`f${x}`} x={x - 14} y={240} width={28} height={10} {...L} />
      ))}
      <path
        d="M30 240 l-10 12 M60 240 l-10 12 M120 240 l-10 12 M150 240 l-10 12 M240 240 l-10 12 M270 240 l-10 12 M350 240 l-10 12 M380 240 l-10 12 M440 240 l-10 12"
        {...L}
      />
      {/* Overall dimension line */}
      <line x1={70} y1={268} x2={410} y2={268} {...L} />
      <path d="M66 272 l8 -8 M406 272 l8 -8 M70 262 v12 M410 262 v12" {...L} />
    </>
  );
}

/** A small floor plan: double walls, partitions, door swings, a north point. */
function Plan() {
  return (
    <>
      {/* External walls (inner and outer faces) */}
      <rect x={40} y={40} width={330} height={200} {...L} />
      <rect x={48} y={48} width={314} height={184} {...L} />
      {/* Partitions */}
      <line x1={180} y1={48} x2={180} y2={150} {...L} />
      <line x1={180} y1={176} x2={180} y2={232} {...L} />
      <line x1={180} y1={140} x2={290} y2={140} {...L} />
      <line x1={316} y1={140} x2={362} y2={140} {...L} />
      {/* Door swings */}
      <path d="M180 150 a26 26 0 0 1 26 26 M180 176 h26" {...L} />
      <path d="M290 140 a26 26 0 0 0 26 -26 M316 140 v-26" {...L} />
      {/* Windows on the outer wall */}
      <path d="M86 40 v8 M136 40 v8 M86 44 h50 M230 240 v-8 M300 240 v-8 M230 236 h70" {...L} />
      {/* Grid axes */}
      <line x1={20} y1={94} x2={380} y2={94} {...L} />
      <line x1={110} y1={20} x2={110} y2={252} {...L} />
      <circle cx={110} cy={262} r={9} {...L} />
      <circle cx={390} cy={94} r={9} {...L} />
      {/* North point */}
      <circle cx={430} cy={60} r={22} {...L} />
      <polyline points="430,30 422,64 430,58 438,64 430,30" {...L} />
      {/* Scale bar */}
      <path d="M400 230 h60 M400 224 v12 M420 226 v8 M440 226 v8 M460 224 v12" {...L} />
    </>
  );
}
