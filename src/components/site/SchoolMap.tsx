import { useMemo, useState, type CSSProperties } from "react";
import {
  IconArrowDown as ArrowDown,
  IconCheck as Check,
  IconX as Close,
} from "@tabler/icons-react";

import { gacW800, type GacSchool } from "@/data/grow-a-classroom";
import { KENYA_COUNTIES, KENYA_VIEWBOX, kenyaPoint } from "@/data/kenya-map";
import { cn } from "@/lib/utils";

const pad = (n: number) => String(n).padStart(2, "0");

// Closest two pins may sit, in map units (~44px apart on a phone-width map).
const MIN_GAP = 105;

/**
 * Each school's true spot on the map and where its pin goes: schools close
 * together (Butere and Kisumu) have their pins nudged apart, with a thin line
 * back to the real location. In map units, plus the pin as percentages.
 */
function layoutPins(schools: GacSchool[]) {
  const spots = schools.map((s) => kenyaPoint(s.location.lng, s.location.lat));
  const pins = spots.map((p) => ({ ...p }));
  for (let round = 0; round < 30; round++) {
    for (let i = 0; i < pins.length; i++) {
      for (let j = i + 1; j < pins.length; j++) {
        const a = pins[i]!;
        const b = pins[j]!;
        const dx = b.x - a.x || 0.01;
        const dy = b.y - a.y;
        const dist = Math.hypot(dx, dy);
        if (dist >= MIN_GAP) continue;
        const push = (MIN_GAP - dist) / 2 / dist;
        a.x -= dx * push;
        a.y -= dy * push;
        b.x += dx * push;
        b.y += dy * push;
      }
    }
  }
  return spots.map((spot, i) => {
    const pin = pins[i]!;
    return {
      spot,
      pin,
      moved: Math.hypot(pin.x - spot.x, pin.y - spot.y) > 1,
      left: (pin.x / KENYA_VIEWBOX.width) * 100,
      top: (pin.y / KENYA_VIEWBOX.height) * 100,
    };
  });
}

/** What a school's card says about it: its outcomes, or the visit if none yet. */
function SchoolCard({
  school,
  index,
  onClose,
  className,
  style,
}: {
  school: GacSchool;
  index: number;
  onClose: () => void;
  className?: string;
  style?: CSSProperties;
}) {
  const photo = school.highlights[school.mapPhoto ?? 0] ?? school.highlights[0];
  return (
    <div
      style={style}
      className={cn(
        "overflow-hidden rounded-2xl border border-border bg-background shadow-xl",
        className,
      )}
    >
      {photo ? (
        <img
          src={gacW800(photo.src)}
          alt={photo.alt}
          loading="lazy"
          decoding="async"
          className="aspect-16/10 w-full bg-secondary object-cover"
        />
      ) : null}
      <div className="relative p-5">
        <button
          type="button"
          onClick={onClose}
          aria-label="Close"
          className="absolute right-3 top-3 flex h-8 w-8 items-center justify-center rounded-full text-muted-foreground transition-colors hover:bg-secondary hover:text-foreground"
        >
          <Close className="h-4 w-4" aria-hidden="true" />
        </button>
        <p className="meta-label pr-8 text-muted-foreground">
          {pad(index + 1)} &middot; {school.county}
        </p>
        <h3 className="mt-2 pr-8 font-display text-xl font-semibold leading-snug text-foreground">
          {school.name}
        </h3>
        {school.outcomes.length ? (
          <ul className="mt-3 space-y-1.5">
            {school.outcomes.map((outcome) => (
              <li key={outcome} className="flex gap-2 text-sm leading-snug text-foreground">
                <Check className="mt-0.5 h-4 w-4 shrink-0 text-sustain" aria-hidden="true" />
                {outcome}
              </li>
            ))}
          </ul>
        ) : (
          <p className="mt-3 text-sm leading-snug text-foreground">
            {school.kind}
            {school.date ? <> &middot; {school.date}</> : null}
          </p>
        )}
        <a
          href={`#${school.id}`}
          className="mt-4 inline-flex items-center gap-1.5 text-sm font-semibold text-foreground transition-colors hover:text-primary"
        >
          See the photos
          <ArrowDown className="h-4 w-4 text-primary" aria-hidden="true" />
        </a>
      </div>
    </div>
  );
}

/**
 * Kenya, with a pin on each Grow A Classroom school. Hovering, focusing or
 * tapping a pin (or a name in the list beside it) shows that school's card:
 * floating by the pin on wider screens, under the map on phones.
 */
export function SchoolMap({ schools }: { schools: GacSchool[] }) {
  const [active, setActive] = useState<number | null>(null);
  const current = active === null ? undefined : schools[active];
  const close = () => setActive(null);
  const layout = useMemo(() => layoutPins(schools), [schools]);

  return (
    <div
      className="grid items-center gap-10 lg:grid-cols-[minmax(0,1.2fr)_minmax(0,1fr)] lg:gap-16"
      onKeyDown={(e) => {
        if (e.key === "Escape") close();
      }}
    >
      <div className="mx-auto w-full max-w-[560px]">
        <div
          className="relative"
          onPointerLeave={(e) => {
            if (e.pointerType === "mouse") close();
          }}
        >
          <svg
            viewBox={`0 0 ${KENYA_VIEWBOX.width} ${KENYA_VIEWBOX.height}`}
            className="h-auto w-full"
            aria-hidden="true"
          >
            {KENYA_COUNTIES.map((county) => (
              <path
                key={county.name}
                d={county.d}
                className="fill-paper-earth stroke-background"
                strokeWidth={2}
                strokeLinejoin="round"
              />
            ))}
            {layout.map(({ spot, pin, moved }, i) =>
              moved ? (
                <g key={i} className="fill-foreground stroke-foreground">
                  <line x1={spot.x} y1={spot.y} x2={pin.x} y2={pin.y} strokeWidth={2} />
                  <circle cx={spot.x} cy={spot.y} r={6} stroke="none" />
                </g>
              ) : null,
            )}
          </svg>

          {schools.map((school, i) => {
            const { left, top } = layout[i]!;
            const isActive = active === i;
            return (
              <button
                key={school.id}
                type="button"
                aria-label={`${school.name}, ${school.county}`}
                aria-expanded={isActive}
                onPointerEnter={(e) => {
                  if (e.pointerType === "mouse") setActive(i);
                }}
                onFocus={() => setActive(i)}
                onClick={() => setActive(i)}
                style={{ left: `${left}%`, top: `${top}%` }}
                className={cn(
                  "group/pin absolute z-10 flex h-11 w-11 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full",
                  isActive && "z-20",
                )}
              >
                <span
                  aria-hidden="true"
                  className={cn(
                    "absolute inset-1 rounded-full bg-sustain/20 ring-1 ring-sustain/30",
                    isActive && "hidden",
                  )}
                />
                <span
                  aria-hidden="true"
                  className={cn(
                    "relative flex h-7 w-7 items-center justify-center rounded-full border-2 border-background bg-sustain text-[11px] font-semibold text-sustain-foreground shadow-md transition-transform duration-200 group-hover/pin:scale-110",
                    isActive && "scale-125 bg-foreground text-background",
                  )}
                >
                  {i + 1}
                </span>
              </button>
            );
          })}

          {current && active !== null
            ? (() => {
                // Beside the pin, on whichever side has room; level with it in
                // mid-map, below it in the north and above it in the south.
                const { left, top } = layout[active]!;
                const toLeft = left > 45;
                const place = top < 30 ? "below" : top > 62 ? "above" : "level";
                const offset = { below: "- 1.5rem", above: "+ 1.5rem", level: "+ 0px" }[place];
                return (
                  <SchoolCard
                    key={current.id}
                    school={current}
                    index={active}
                    onClose={close}
                    style={{
                      left: `calc(${left}% ${toLeft ? "-" : "+"} 1.5rem)`,
                      top: `calc(${top}% ${offset})`,
                    }}
                    className={cn(
                      "absolute z-30 hidden w-72 sm:block",
                      toLeft && "-translate-x-full",
                      place === "above" && "-translate-y-full",
                      place === "level" && "-translate-y-1/2",
                    )}
                  />
                );
              })()
            : null}
        </div>
        {current && active !== null ? (
          <SchoolCard school={current} index={active} onClose={close} className="mt-4 sm:hidden" />
        ) : null}
      </div>

      <div>
        <ol className="border-t border-border">
          {schools.map((school, i) => (
            <li key={school.id} className="border-b border-border">
              <a
                href={`#${school.id}`}
                onPointerEnter={(e) => {
                  if (e.pointerType === "mouse") setActive(i);
                }}
                onPointerLeave={(e) => {
                  if (e.pointerType === "mouse") close();
                }}
                className={cn(
                  "group flex items-center gap-4 py-4 transition-colors",
                  active === i ? "text-primary" : "text-foreground hover:text-primary",
                )}
              >
                <span
                  className={cn(
                    "flex h-7 w-7 shrink-0 items-center justify-center rounded-full text-[11px] font-semibold transition-colors",
                    active === i
                      ? "bg-foreground text-background"
                      : "bg-sustain text-sustain-foreground",
                  )}
                >
                  {i + 1}
                </span>
                <span className="min-w-0 flex-1">
                  <span className="block font-display text-lg font-semibold leading-snug">
                    {school.name}
                  </span>
                  <span className="meta-label text-muted-foreground">{school.county}</span>
                </span>
                <ArrowDown
                  className="h-4 w-4 shrink-0 text-primary transition-transform group-hover:translate-y-0.5"
                  aria-hidden="true"
                />
              </a>
            </li>
          ))}
        </ol>
        <p className="mt-4 text-sm text-muted-foreground">
          Hover over or tap a pin to see what we did at each school.
        </p>
      </div>
    </div>
  );
}
