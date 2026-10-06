import { useRef, type CSSProperties } from "react";
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
    // Hold still while a keyboard user is on one of the links.
    const onFocusIn = () => {
      speed?.kill();
      speed = gsap.timeline().to(loop, { timeScale: 0, duration: 0.4 });
    };
    const onFocusOut = () => surge(1, 1, 0.8);
    el.addEventListener("focusin", onFocusIn);
    el.addEventListener("focusout", onFocusOut);
    // A drag ends in a click on whatever link is under the pointer; swallow
    // it so dragging the strip never opens a partner's site by accident.
    let dragged = false;
    const onClick = (event: MouseEvent) => {
      if (!dragged) return;
      dragged = false;
      event.preventDefault();
      event.stopPropagation();
    };
    el.addEventListener("click", onClick, true);

    // One copy of the partner list is half the track: dragging that far
    // moves the loop through one full cycle.
    const wrap = gsap.utils.wrap(0, 1);
    const drag = ScrollTrigger.observe({
      target: el,
      type: "touch,pointer",
      lockAxis: true,
      dragMinimum: 3,
      onPress: () => {
        dragged = false;
        speed?.kill();
      },
      onDragStart: () => {
        dragged = true;
      },
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
      el.removeEventListener("focusin", onFocusIn);
      el.removeEventListener("focusout", onFocusOut);
      el.removeEventListener("click", onClick, true);
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
          Our partners
        </p>
      </div>

      <div
        ref={strip}
        className="group relative mt-8 cursor-grab touch-pan-y overflow-hidden select-none active:cursor-grabbing [mask-image:linear-gradient(to_right,transparent,black_10%,black_90%,transparent)]"
      >
        <ul className="marquee flex w-max items-center gap-16">
          {track.map((partner, i) => {
            // The second copy only exists to make the loop seamless: hidden
            // from screen readers and skipped by the keyboard.
            const copy = i >= partners.length;
            return (
              <li
                key={`${partner.abbreviation}-${i}`}
                className="shrink-0"
                aria-hidden={copy ? "true" : undefined}
              >
                <a
                  href={partner.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  draggable={false}
                  tabIndex={copy ? -1 : undefined}
                  aria-label={`${partner.name} (opens in a new tab)`}
                  // The name takes the logo's colour on hover; black logos use the text colour.
                  style={
                    {
                      "--brand": partner.brand?.light ?? "var(--foreground)",
                      "--brand-dark": partner.brand?.dark ?? "var(--foreground)",
                    } as CSSProperties
                  }
                  className="group/partner flex w-[180px] cursor-pointer flex-col items-center gap-3 text-center"
                >
                  {/* Each logo at its own balanced size, centred in an even row. Loaded
                      straight away (they're tiny) so none pops in as the strip moves. */}
                  <span className="flex h-16 w-full items-center justify-center">
                    <img
                      src={partner.logo}
                      alt=""
                      width={partner.logoWidth}
                      height={partner.logoHeight}
                      decoding="async"
                      draggable={false}
                      style={{ width: partner.logoWidth, height: partner.logoHeight }}
                      className="max-w-full object-contain opacity-75 grayscale transition-[filter,opacity] duration-300 group-hover/partner:opacity-100 group-hover/partner:grayscale-0 group-focus-visible/partner:opacity-100 group-focus-visible/partner:grayscale-0"
                    />
                  </span>
                  <span className="text-xs leading-snug text-muted-foreground transition-colors group-hover/partner:text-[var(--brand)] group-focus-visible/partner:text-[var(--brand)] sm:text-sm dark:group-hover/partner:text-[var(--brand-dark)] dark:group-focus-visible/partner:text-[var(--brand-dark)]">
                    {partner.name}
                  </span>
                </a>
              </li>
            );
          })}
        </ul>
      </div>
    </section>
  );
}
