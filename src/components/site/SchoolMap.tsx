import { useEffect, useId, useMemo, useRef, useState, type CSSProperties } from "react";
import {
  IconArrowDown as ArrowDown,
  IconCheck as Check,
  IconPlayerPlayFilled as Play,
  IconPlayerStopFilled as Stop,
  IconX as Close,
} from "@tabler/icons-react";

import { gacW800, type GacSchool } from "@/data/grow-a-classroom";
import { KENYA_COUNTIES, KENYA_VIEWBOX, kenyaPoint } from "@/data/kenya-map";
import {
  MOTION_OK,
  gsapIfLoaded,
  loadGsap,
  loadMotionPath,
  prefersReducedMotion,
  whenMotionReady,
} from "@/lib/gsap";
import { cn } from "@/lib/utils";

const pad = (n: number) => String(n).padStart(2, "0");

// Closest two pins may sit, in map units (~44px apart on a phone-width map).
const MIN_GAP = 105;
// How long the journey stays on each school, in seconds.
const DWELL = 2.6;
// The journey's marker starts hidden; GSAP shows it while it travels.
const HIDDEN: CSSProperties = { opacity: 0, visibility: "hidden" };

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

/** The journey between schools in visit order: one gentle arc per leg. */
function routeLegs(pins: { x: number; y: number }[]) {
  return pins.slice(1).map((b, i) => {
    const a = pins[i]!;
    const bend = 0.22;
    const cx = (a.x + b.x) / 2 - (b.y - a.y) * bend;
    const cy = (a.y + b.y) / 2 + (b.x - a.x) * bend;
    return `M${a.x} ${a.y}Q${cx} ${cy} ${b.x} ${b.y}`;
  });
}

const countyOf = (school: GacSchool) => school.county.replace(/ County$/, "");

/** What a school's card says about it: its outcomes, or the visit if none yet. */
function SchoolCard({
  school,
  index,
  onClose,
  origin = "center",
  className,
  style,
}: {
  school: GacSchool;
  index: number;
  onClose: () => void;
  /** Which edge the card springs out from: the side its pin is on. */
  origin?: string;
  className?: string;
  style?: CSSProperties;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const photo = school.highlights[school.mapPhoto ?? 0] ?? school.highlights[0];

  // Springs out of its pin, when GSAP is already on the page.
  useEffect(() => {
    const kit = gsapIfLoaded();
    if (!kit || !ref.current || prefersReducedMotion()) return;
    const tween = kit.gsap.from(ref.current, {
      autoAlpha: 0,
      scale: 0.9,
      transformOrigin: origin,
      duration: 0.45,
      ease: "back.out(1.6)",
      clearProps: "opacity,visibility,transform",
    });
    return () => {
      tween.revert();
    };
  }, [origin]);

  return (
    <div
      ref={ref}
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
 * Kenya, with a pin on each Grow A Classroom school, joined by the route of
 * the visits in order. Hovering, focusing or tapping a pin (or a name in the
 * list beside it) shows that school's card: floating by the pin on wider
 * screens, under the map on phones. "Play the journey" tours the schools in
 * turn, a marker travelling the route between them.
 *
 * With GSAP (loaded on first interaction, and only without reduced motion)
 * the route draws itself as the map comes into view, the pins pop in as it
 * reaches them, cards spring out of their pins and the map tilts a little
 * with the mouse. Without it, everything is simply there.
 */
export function SchoolMap({ schools }: { schools: GacSchool[] }) {
  const [active, setActive] = useState<number | null>(null);
  const [touring, setTouring] = useState(false);
  const current = active === null ? undefined : schools[active];
  const layout = useMemo(() => layoutPins(schools), [schools]);
  const legs = useMemo(() => routeLegs(layout.map((l) => l.pin)), [layout]);
  const schoolCounties = useMemo(() => new Set(schools.map(countyOf)), [schools]);
  const maskId = `route-${useId().replace(/:/g, "")}`;

  const stageRef = useRef<HTMLDivElement>(null);
  const pinRefs = useRef<(HTMLButtonElement | null)[]>([]);
  const drawRefs = useRef<(SVGPathElement | null)[]>([]);
  const legRefs = useRef<(SVGPathElement | null)[]>([]);
  const markerRef = useRef<SVGCircleElement>(null);
  const introRef = useRef<gsap.core.Timeline | null>(null);
  const tourRef = useRef<gsap.core.Timeline | null>(null);
  const tiltRef = useRef<((e: PointerEvent) => void) | null>(null);
  const untiltRef = useRef<(() => void) | null>(null);

  const stopTour = () => {
    tourRef.current?.kill();
    tourRef.current = null;
    if (markerRef.current) gsapIfLoaded()?.gsap.set(markerRef.current, { autoAlpha: 0 });
    setTouring(false);
  };
  /** The reader chose a school (or none): that takes over from the journey. */
  const choose = (i: number | null) => {
    if (tourRef.current) stopTour();
    setActive(i);
  };
  /** Hover only previews while the journey isn't playing. */
  const preview = (i: number | null) => {
    if (!tourRef.current) setActive(i);
  };

  // The intro (route draws, pins pop in) and the tilt.
  useEffect(() => {
    if (prefersReducedMotion()) return;
    let alive = true;
    let revert: (() => void) | undefined;
    void whenMotionReady().then(({ gsap }) => {
      const stage = stageRef.current;
      if (!alive || !stage) return;
      const mm = gsap.matchMedia();
      mm.add({ motion: MOTION_OK, fine: "(pointer: fine)" }, (ctx) => {
        const { motion, fine } = ctx.conditions as { motion: boolean; fine: boolean };
        if (!motion) return;
        let stopIntroWatch: (() => void) | undefined;

        // Already on screen: leave it as it is rather than make it flicker.
        const box = stage.getBoundingClientRect();
        if (box.top > window.innerHeight * 0.8) {
          const pins = pinRefs.current.filter(Boolean);
          const draws = drawRefs.current.filter(Boolean) as SVGPathElement[];
          const tl = gsap.timeline({ paused: true });
          tl.from(pins[0]!, { scale: 0, duration: 0.45, ease: "back.out(2.2)" });
          draws.forEach((path, i) => {
            const length = path.getTotalLength();
            tl.fromTo(
              path,
              { strokeDasharray: length, strokeDashoffset: length },
              { strokeDashoffset: 0, duration: 0.55 + length / 1400, ease: "power1.inOut" },
            ).from(pins[i + 1]!, { scale: 0, duration: 0.45, ease: "back.out(2.2)" }, "-=0.12");
          });
          introRef.current = tl;
          // Watches the map itself, so images loading above it can't throw
          // the timing off.
          const seen = new IntersectionObserver(
            ([entry]) => {
              if (!entry?.isIntersecting) return;
              seen.disconnect();
              void tl.play();
            },
            { threshold: 0.4 },
          );
          seen.observe(stage);
          stopIntroWatch = () => seen.disconnect();
        }

        if (fine) {
          const rx = gsap.quickTo(stage, "rotationX", { duration: 0.6, ease: "power3" });
          const ry = gsap.quickTo(stage, "rotationY", { duration: 0.6, ease: "power3" });
          gsap.set(stage, { transformPerspective: 1100 });
          tiltRef.current = (e) => {
            const r = stage.getBoundingClientRect();
            ry(((e.clientX - r.left) / r.width - 0.5) * 7);
            rx(-((e.clientY - r.top) / r.height - 0.5) * 7);
          };
          untiltRef.current = () => {
            rx(0);
            ry(0);
          };
        }

        return () => {
          stopIntroWatch?.();
          introRef.current = null;
          tiltRef.current = null;
          untiltRef.current = null;
        };
      });
      revert = () => mm.revert();
    });
    return () => {
      alive = false;
      revert?.();
      tourRef.current?.kill();
    };
  }, []);

  const playTour = async () => {
    const reduce = prefersReducedMotion();
    // Bring the whole map into view for the journey (below the sticky header).
    const box = stageRef.current?.getBoundingClientRect();
    if (box && (box.top < 64 || box.bottom > window.innerHeight)) {
      stageRef.current!.scrollIntoView({
        // Phones show the card under the map, so start at the map's top there.
        block: window.innerWidth < 640 ? "start" : "center",
        behavior: reduce ? "auto" : "smooth",
      });
    }
    const { gsap } = reduce ? await loadGsap() : await loadMotionPath();
    introRef.current?.progress(1);
    tourRef.current?.kill();
    const marker = markerRef.current;
    const tl = gsap.timeline({
      onComplete: () => {
        tourRef.current = null;
        setTouring(false);
      },
    });
    tl.call(() => setActive(0)).to({}, { duration: DWELL });
    legRefs.current.forEach((leg, i) => {
      tl.call(() => setActive(null));
      if (reduce || !leg || !marker) {
        tl.to({}, { duration: 0.4 });
      } else {
        tl.set(marker, { autoAlpha: 1 }).to(marker, {
          duration: 1.1 + leg.getTotalLength() / 700,
          ease: "power1.inOut",
          motionPath: { path: leg, align: leg, alignOrigin: [0.5, 0.5] },
        });
      }
      tl.call(() => setActive(i + 1));
      if (marker && !reduce) tl.set(marker, { autoAlpha: 0 });
      tl.to({}, { duration: DWELL });
    });
    tourRef.current = tl;
    setTouring(true);
  };

  const focusPin = (i: number) => pinRefs.current[(i + schools.length) % schools.length]?.focus();

  return (
    <div
      className="grid items-center gap-10 lg:grid-cols-[minmax(0,1.2fr)_minmax(0,1fr)] lg:gap-16"
      onKeyDown={(e) => {
        if (e.key === "Escape") choose(null);
      }}
    >
      <div className="mx-auto w-full max-w-[560px]">
        <div
          ref={stageRef}
          className="relative scroll-mt-20"
          onPointerMove={(e) => {
            if (e.pointerType === "mouse") tiltRef.current?.(e.nativeEvent);
          }}
          onPointerLeave={(e) => {
            if (e.pointerType !== "mouse") return;
            untiltRef.current?.();
            preview(null);
          }}
        >
          <svg
            viewBox={`0 0 ${KENYA_VIEWBOX.width} ${KENYA_VIEWBOX.height}`}
            className="h-auto w-full overflow-visible"
            aria-hidden="true"
          >
            <defs>
              {/* Draws the dotted route: GSAP reveals these solid strokes. */}
              <mask
                id={maskId}
                maskUnits="userSpaceOnUse"
                x={0}
                y={0}
                width={KENYA_VIEWBOX.width}
                height={KENYA_VIEWBOX.height}
              >
                <g fill="none" stroke="white" strokeWidth={16} strokeLinecap="round">
                  {legs.map((d, i) => (
                    <path
                      key={d}
                      d={d}
                      ref={(el) => {
                        drawRefs.current[i] = el;
                      }}
                    />
                  ))}
                </g>
              </mask>
            </defs>
            {KENYA_COUNTIES.map((county) => (
              <path
                key={county.name}
                d={county.d}
                className={cn(
                  "stroke-background transition-[fill] duration-300",
                  !schoolCounties.has(county.name)
                    ? "fill-paper-earth"
                    : current && countyOf(current) === county.name
                      ? "fill-sustain/40"
                      : "fill-sustain/15",
                )}
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
            <g
              mask={`url(#${maskId})`}
              fill="none"
              className="stroke-sustain"
              strokeWidth={5}
              strokeLinecap="round"
              strokeDasharray="0.1 14"
            >
              {legs.map((d, i) => (
                <path
                  key={d}
                  d={d}
                  ref={(el) => {
                    legRefs.current[i] = el;
                  }}
                />
              ))}
            </g>
            <circle
              ref={markerRef}
              r={13}
              style={HIDDEN}
              className="fill-primary stroke-background"
              strokeWidth={4}
            />
          </svg>

          {schools.map((school, i) => {
            const { left, top } = layout[i]!;
            const isActive = active === i;
            return (
              <button
                key={school.id}
                ref={(el) => {
                  pinRefs.current[i] = el;
                }}
                type="button"
                aria-label={`${i + 1}: ${school.name}, ${school.county}`}
                aria-expanded={isActive}
                onPointerEnter={(e) => {
                  if (e.pointerType === "mouse") preview(i);
                }}
                onFocus={() => {
                  if (!tourRef.current) setActive(i);
                }}
                onClick={() => choose(i)}
                onKeyDown={(e) => {
                  const step = { ArrowRight: 1, ArrowDown: 1, ArrowLeft: -1, ArrowUp: -1 }[e.key];
                  if (!step) return;
                  e.preventDefault();
                  if (tourRef.current) stopTour();
                  focusPin(i + step);
                }}
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
                {isActive ? (
                  <span
                    aria-hidden="true"
                    className="pin-ripple absolute inset-1 rounded-full bg-foreground/25"
                  />
                ) : null}
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
                const vertical = { below: "top", above: "bottom", level: "center" }[place];
                return (
                  <SchoolCard
                    key={current.id}
                    school={current}
                    index={active}
                    onClose={() => choose(null)}
                    origin={`${toLeft ? "right" : "left"} ${vertical}`}
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
          <SchoolCard
            key={current.id}
            school={current}
            index={active}
            onClose={() => choose(null)}
            origin="top center"
            className="mt-4 sm:hidden"
          />
        ) : null}
      </div>

      <div>
        <ol className="border-t border-border">
          {schools.map((school, i) => (
            <li key={school.id} className="border-b border-border">
              <a
                href={`#${school.id}`}
                onClick={() => {
                  if (tourRef.current) stopTour();
                }}
                onPointerEnter={(e) => {
                  if (e.pointerType === "mouse") preview(i);
                }}
                onPointerLeave={(e) => {
                  if (e.pointerType === "mouse") preview(null);
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
        <div className="mt-5 flex flex-wrap items-center gap-x-5 gap-y-3">
          <button
            type="button"
            onClick={() => (touring ? stopTour() : void playTour())}
            className="inline-flex items-center gap-2 rounded-full border border-foreground/20 px-4 py-2 text-sm font-semibold text-foreground transition-colors hover:border-foreground hover:bg-foreground hover:text-background"
          >
            {touring ? (
              <Stop className="h-4 w-4" aria-hidden="true" />
            ) : (
              <Play className="h-4 w-4 text-primary" aria-hidden="true" />
            )}
            {touring ? "Stop the journey" : "Play the journey"}
          </button>
          <p className="text-sm text-muted-foreground">
            Or hover over or tap a pin to see what we did at each school.
          </p>
        </div>
        <p className="sr-only" aria-live="polite">
          {touring && current ? `${active! + 1} of ${schools.length}: ${current.name}` : ""}
        </p>
      </div>
    </div>
  );
}
