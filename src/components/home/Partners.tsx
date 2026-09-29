import { useRef } from "react";
import { partners } from "@/data/site";
import { useGsap } from "@/hooks/use-gsap";

/** Seconds per loop, matching the CSS `.marquee` it takes over from. */
const LOOP_SECONDS = 28;

export function Partners() {
  const track = [...partners, ...partners];
  const strip = useRef<HTMLDivElement>(null);

  // GSAP takes the strip over from the CSS marquee, from the same point, and
  // makes it respond: faster while the page scrolls quickly, easing to a
  // stop under the pointer, and draggable/flickable (either direction).
  useGsap(strip, ({ gsap, ScrollTrigger }, el) => {
    const list = el.querySelector("ul");
    if (!list) return;
    const css = list.getAnimations()[0];
    const at = css ? (Number(css.currentTime ?? 0) / 1000 / LOOP_SECONDS) % 1 : 0;
    list.style.animation = "none";

    const loop = gsap.fromTo(
      list,
      { xPercent: 0 },
      { xPercent: -50, duration: LOOP_SECONDS, ease: "none", repeat: -1 },
    );
    loop.progress(at);

    let speed: gsap.core.Timeline | undefined;
    /** Jump to `timeScale`, then settle back to `rest` (1 = normal pace). */
    const surge = (timeScale: number, rest = 1, settle = 1.4) => {
      speed?.kill();
      speed = gsap
        .timeline()
        .to(loop, { timeScale, duration: 0.2, ease: "power2.out" })
        .to(loop, { timeScale: rest, duration: settle, ease: "power2.out" });
    };

    const scroll = ScrollTrigger.create({
      trigger: el,
      start: "top bottom",
      end: "bottom top",
      onUpdate: (self) => {
        const boost = Math.min(Math.abs(self.getVelocity()) / 400, 5);
        if (boost > 0.3) surge(1 + boost);
      },
    });

    let hovering = false;
    const onEnter = (event: PointerEvent) => {
      if (event.pointerType !== "mouse") return;
      hovering = true;
      speed?.kill();
      speed = gsap.timeline().to(loop, { timeScale: 0, duration: 0.8, ease: "power2.out" });
    };
    const onLeave = (event: PointerEvent) => {
      if (event.pointerType !== "mouse") return;
      hovering = false;
      surge(1, 1, 0.8);
    };
    el.addEventListener("pointerenter", onEnter);
    el.addEventListener("pointerleave", onLeave);

    // One copy of the partner list is half the track: dragging that far
    // moves the loop through one full cycle.
    const wrap = gsap.utils.wrap(0, 1);
    const drag = ScrollTrigger.observe({
      target: el,
      type: "touch,pointer",
      lockAxis: true,
      dragMinimum: 3,
      onPress: () => speed?.kill(),
      onChangeX: (self) => {
        const cycle = list.scrollWidth / 2;
        loop.progress(wrap(loop.progress() - self.deltaX / cycle));
      },
      onRelease: (self) => {
        const pace = list.scrollWidth / 2 / LOOP_SECONDS; // px per second at timeScale 1
        const flick = gsap.utils.clamp(-6, 6, -self.velocityX / pace);
        surge(Math.abs(flick) > 1 ? flick : 1, hovering ? 0 : 1, 1.8);
      },
    });

    return () => {
      speed?.kill();
      scroll.kill();
      drag.kill();
      el.removeEventListener("pointerenter", onEnter);
      el.removeEventListener("pointerleave", onLeave);
      list.style.animation = "";
    };
  });

  return (
    <section
      aria-labelledby="partners-title"
      className="border-y border-border bg-background py-14"
    >
      <div className="mx-auto max-w-[1400px] px-6 lg:px-12">
        <p id="partners-title" className="text-center meta-label text-muted-foreground">
          Working alongside
        </p>
      </div>

      <div
        ref={strip}
        className="group relative mt-8 cursor-grab touch-pan-y overflow-hidden select-none active:cursor-grabbing [mask-image:linear-gradient(to_right,transparent,black_10%,black_90%,transparent)]"
      >
        <ul className="marquee flex w-max items-center gap-16">
          {track.map((partner, i) => (
            <li
              key={`${partner.abbreviation}-${i}`}
              className="flex shrink-0 items-center gap-2.5 text-muted-foreground"
              aria-hidden={i >= partners.length ? "true" : undefined}
            >
              <span className="font-display text-lg font-bold tracking-tight text-foreground/70">
                {partner.abbreviation}
              </span>
              <span className="hidden text-sm sm:inline">{partner.name}</span>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
