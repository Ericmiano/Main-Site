import { useEffect, useState } from "react";
import { IconChevronUp as ChevronUp } from "@tabler/icons-react";
import { cn } from "@/lib/utils";

interface Entry {
  index: string;
  label: string;
  el: HTMLElement;
}

/** Floating "04 / 08 · Public impact" marker built from the SectionRule
 * headings on the page; doubles as a jump menu. Desktop only. */
export function SectionIndicator() {
  const [sections, setSections] = useState<Entry[]>([]);
  const [current, setCurrent] = useState(-1);
  const [hidden, setHidden] = useState(true);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const list = [...document.querySelectorAll<HTMLElement>("main [data-section-index]")].map(
      (el) => ({
        index: el.dataset["sectionIndex"] ?? "",
        label: el.dataset["sectionLabel"] ?? "",
        el,
      }),
    );
    setSections(list);

    let frame: number | null = null;
    const update = () => {
      frame = null;
      const line = window.innerHeight * 0.45;
      let idx = -1;
      list.forEach((s, i) => {
        if (s.el.getBoundingClientRect().top < line) idx = i;
      });
      const footer = document.querySelector("main ~ footer");
      setCurrent(idx);
      setHidden(
        idx < 0 || (footer ? footer.getBoundingClientRect().top < window.innerHeight * 0.6 : false),
      );
    };
    const onScroll = () => {
      if (frame === null) frame = requestAnimationFrame(update);
    };
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false);
    };
    update();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    document.addEventListener("keydown", onKey);
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
      document.removeEventListener("keydown", onKey);
      if (frame !== null) cancelAnimationFrame(frame);
    };
  }, []);

  useEffect(() => {
    if (hidden) setOpen(false);
  }, [hidden]);

  const jump = (el: HTMLElement) => {
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    // Offset for the sticky header and register strip so the section's rule lands in view.
    const css = getComputedStyle(document.documentElement);
    const offset =
      (parseFloat(css.getPropertyValue("--header-h")) || 86) +
      (parseFloat(css.getPropertyValue("--register-h")) || 0) +
      24;
    window.scrollTo({
      top: el.getBoundingClientRect().top + window.scrollY - offset,
      behavior: reduce ? "auto" : "smooth",
    });
    setOpen(false);
  };

  const cur = sections[Math.max(current, 0)];
  if (!cur) return null;

  return (
    <nav
      aria-label="Page sections"
      inert={hidden}
      className={cn(
        "fixed bottom-6 left-6 z-40 hidden transition-[opacity,transform] duration-300 lg:block",
        hidden ? "pointer-events-none translate-y-3 opacity-0" : "opacity-100",
      )}
    >
      {open ? (
        <ol className="mb-2 min-w-60 bg-ink-deep/95 py-2 text-background shadow-2xl backdrop-blur-md">
          {sections.map((s, i) => (
            <li key={s.index}>
              <button
                type="button"
                onClick={() => jump(s.el)}
                aria-current={i === current ? "location" : undefined}
                className={cn(
                  "flex w-full items-baseline gap-3 px-4 py-2 text-left text-sm transition-colors hover:bg-background/10",
                  i === current ? "text-[oklch(0.75_0.13_38.5)]" : "text-background/85",
                )}
              >
                <span className="meta-label w-6">{s.index}</span>
                {s.label}
              </button>
            </li>
          ))}
        </ol>
      ) : null}
      <button
        type="button"
        aria-expanded={open}
        onClick={() => setOpen((v) => !v)}
        className="flex items-center gap-3 bg-ink-deep/90 px-4 py-3 text-background shadow-xl backdrop-blur-md transition-colors hover:bg-ink-deep"
      >
        <span className="meta-label text-[oklch(0.75_0.13_38.5)]">{cur.index}</span>
        <span className="meta-label text-background/45">
          / {String(sections.length).padStart(2, "0")}
        </span>
        <span className="text-sm font-medium">{cur.label}</span>
        <ChevronUp
          aria-hidden="true"
          className={cn("h-4 w-4 transition-transform duration-300", open ? "" : "rotate-180")}
        />
      </button>
    </nav>
  );
}
