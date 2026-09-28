import { lazy, Suspense, useEffect, useRef, useState } from "react";
import { Link } from "@tanstack/react-router";
import {
  IconChevronDown as ChevronDown,
  IconSearch as Search,
  IconX as Close,
} from "@tabler/icons-react";
import {
  aakPlatforms,
  initiatives,
  memberPortalUrl,
  navMenu,
  utilityLinks,
  type NavMenuEntry,
} from "@/data/site";
import { cn } from "@/lib/utils";
import logoHorizontal from "@/assets/aak-logo-horizontal.webp";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
// cmdk + the Radix dialog primitive it needs are ~30KB gzipped and only
// matter once someone actually opens search — split them out of the
// header's own chunk (loaded on every page) instead of bundling eagerly.
const SearchDialog = lazy(() =>
  import("./SearchDialog").then((mod) => ({ default: mod.SearchDialog })),
);

function NavItem({
  href,
  external,
  children,
  className,
  onClick,
}: {
  href: string;
  external?: boolean | undefined;
  children: React.ReactNode;
  className?: string;
  onClick?: () => void;
}) {
  if (external || href.startsWith("#") || href.startsWith("/#") || href.startsWith("mailto:")) {
    const isHttp = href.startsWith("http");
    return (
      <a
        href={href}
        className={className}
        onClick={onClick}
        target={isHttp ? "_blank" : undefined}
        rel={isHttp ? "noopener noreferrer" : undefined}
      >
        {children}
      </a>
    );
  }
  return (
    <Link to={href} className={className} onClick={onClick}>
      {children}
    </Link>
  );
}

function menuLabel(entry: NavMenuEntry): string {
  if (entry.type === "initiatives") return "Initiatives";
  return entry.label;
}

export function Header() {
  const [open, setOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchLoaded, setSearchLoaded] = useState(false);
  const [activeMenu, setActiveMenu] = useState<string | null>(null);
  const navRef = useRef<HTMLDivElement>(null);
  const menuButtonRef = useRef<HTMLButtonElement>(null);
  const closeTimer = useRef<number | null>(null);
  const progressRef = useRef<HTMLDivElement>(null);
  const [scrolled, setScrolled] = useState(false);
  const headerRef = useRef<HTMLElement>(null);

  // Publish the header's live height (it shrinks once scrolled) so other
  // sticky bars, like the member register strip, can park right beneath it.
  useEffect(() => {
    const header = headerRef.current;
    if (!header) return;
    const root = document.documentElement;
    const observer = new ResizeObserver(() =>
      root.style.setProperty("--header-h", `${header.offsetHeight}px`),
    );
    observer.observe(header);
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    let frame: number | null = null;
    const update = () => {
      frame = null;
      const max = document.documentElement.scrollHeight - window.innerHeight;
      setScrolled(window.scrollY > 80);
      // Written straight to the element so scrolling doesn't re-render the header.
      progressRef.current?.style.setProperty(
        "transform",
        `scaleX(${max > 0 ? Math.min(1, window.scrollY / max) : 0})`,
      );
    };
    const onScroll = () => {
      if (frame === null) frame = requestAnimationFrame(update);
    };
    update();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
      if (frame !== null) cancelAnimationFrame(frame);
    };
  }, []);

  const openMenu = (label: string) => {
    if (closeTimer.current) {
      window.clearTimeout(closeTimer.current);
      closeTimer.current = null;
    }
    setActiveMenu(label);
  };
  const scheduleCloseMenu = () => {
    closeTimer.current = window.setTimeout(() => setActiveMenu(null), 150);
  };
  const cancelCloseMenu = () => {
    if (closeTimer.current) {
      window.clearTimeout(closeTimer.current);
      closeTimer.current = null;
    }
  };
  const closeMenuNow = () => {
    cancelCloseMenu();
    setActiveMenu(null);
  };

  useEffect(() => {
    if (!open) return;
    const panel = document.getElementById("mobile-nav");
    const trigger = menuButtonRef.current;
    const focusables = () =>
      Array.from(panel?.querySelectorAll<HTMLElement>("a[href], button:not([disabled])") ?? []);
    focusables()[1]?.focus();

    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false);
      if (e.key !== "Tab") return;
      // Keep focus inside the full-screen menu while it covers the page.
      const items = focusables();
      const first = items[0];
      const last = items[items.length - 1];
      if (!first || !last) return;
      if (e.shiftKey && document.activeElement === first) {
        e.preventDefault();
        last.focus();
      } else if (!e.shiftKey && document.activeElement === last) {
        e.preventDefault();
        first.focus();
      }
    };
    document.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
      trigger?.focus();
    };
  }, [open]);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "k") {
        e.preventDefault();
        setSearchLoaded(true);
        setSearchOpen((v) => !v);
      }
    };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, []);

  useEffect(() => {
    if (!activeMenu) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") closeMenuNow();
    };
    const onClickOutside = (e: MouseEvent) => {
      if (navRef.current && !navRef.current.contains(e.target as Node)) closeMenuNow();
    };
    document.addEventListener("keydown", onKey);
    document.addEventListener("mousedown", onClickOutside);
    return () => {
      document.removeEventListener("keydown", onKey);
      document.removeEventListener("mousedown", onClickOutside);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [activeMenu]);

  const activeEntry = navMenu.find(
    (entry): entry is Exclude<(typeof navMenu)[number], { type: "link" }> =>
      entry.type !== "link" && menuLabel(entry) === activeMenu,
  );

  return (
    <header ref={headerRef} className="sticky top-0 z-50 bg-background">
      {/* Utility strip */}
      <div
        className={cn(
          "hidden overflow-hidden bg-ink-deep text-background transition-[max-height] duration-300 lg:block",
          scrolled ? "max-h-0" : "max-h-9",
        )}
      >
        <div className="mx-auto flex h-9 max-w-[1400px] items-center justify-between px-6 text-[11px] tracking-[0.14em] uppercase lg:px-12">
          <p className="text-background/50">
            Blue Violets Plaza, Kindaruma Rd, Off Ngong Rd, Nairobi
          </p>
          <ul className="flex items-center gap-7">
            {utilityLinks.map((link) => (
              <li key={link.label}>
                <a
                  href={link.href}
                  target={link.href.startsWith("http") ? "_blank" : undefined}
                  rel={link.href.startsWith("http") ? "noopener noreferrer" : undefined}
                  className="text-background/60 transition-colors hover:text-background focus-visible:text-background"
                >
                  {link.label}
                </a>
              </li>
            ))}
          </ul>
        </div>
      </div>

      {/* Main bar */}
      <div
        ref={navRef}
        className="relative bg-primary"
        onMouseLeave={scheduleCloseMenu}
        onMouseEnter={cancelCloseMenu}
      >
        <div className="mx-auto flex max-w-[1400px] items-stretch justify-between px-6 lg:px-12">
          <Link
            to="/"
            className={cn(
              "flex items-center transition-[padding] duration-300",
              scrolled ? "py-2.5" : "py-4",
            )}
            aria-label="Architectural Association of Kenya, home"
            onClick={closeMenuNow}
          >
            <span className="flex items-center rounded-lg bg-background px-3 py-2">
              <img
                src={logoHorizontal}
                width={405}
                height={96}
                alt="AAK — Promoting excellence in the built environment"
                className={cn(
                  "w-auto object-contain transition-[height] duration-300",
                  scrolled ? "h-7" : "h-8",
                )}
              />
            </span>
          </Link>

          <nav aria-label="Primary" className="hidden items-stretch lg:flex">
            <ul className="flex items-stretch">
              {navMenu.map((entry) => {
                if (entry.type === "link") {
                  return (
                    <li key={entry.label} className="flex">
                      <NavItem
                        href={entry.href}
                        external={entry.external}
                        onClick={closeMenuNow}
                        className="group relative flex items-center border-l border-primary-foreground/20 px-6 text-sm font-medium text-primary-foreground/85 transition-colors hover:text-primary-foreground focus-visible:text-primary-foreground"
                      >
                        {entry.label}
                        <span className="absolute inset-x-0 bottom-0 h-0.5 origin-left scale-x-0 bg-primary-foreground transition-transform duration-300 group-hover:scale-x-100 group-focus-visible:scale-x-100" />
                      </NavItem>
                    </li>
                  );
                }

                const label = menuLabel(entry);
                const isOpen = activeMenu === label;
                return (
                  <li key={label} className="flex">
                    <button
                      type="button"
                      aria-haspopup="true"
                      aria-expanded={isOpen}
                      onMouseEnter={() => openMenu(label)}
                      onFocus={() => openMenu(label)}
                      onClick={() => (isOpen ? closeMenuNow() : openMenu(label))}
                      className={cn(
                        "group relative flex items-center gap-1.5 border-l border-primary-foreground/20 px-6 text-sm font-medium text-primary-foreground/85 transition-colors hover:text-primary-foreground focus-visible:text-primary-foreground",
                        isOpen && "text-primary-foreground",
                      )}
                    >
                      {label}
                      <ChevronDown
                        className={cn(
                          "h-3.5 w-3.5 transition-transform duration-300",
                          isOpen && "rotate-180",
                        )}
                        aria-hidden="true"
                      />
                      <span
                        className={cn(
                          "absolute inset-x-0 bottom-0 h-0.5 origin-left bg-primary-foreground transition-transform duration-300 group-hover:scale-x-100 group-focus-visible:scale-x-100",
                          isOpen ? "scale-x-100" : "scale-x-0",
                        )}
                      />
                    </button>
                  </li>
                );
              })}
              <li className="flex items-center pl-2">
                <button
                  type="button"
                  onClick={() => {
                    setSearchLoaded(true);
                    setSearchOpen(true);
                  }}
                  aria-label="Search the site"
                  className="flex h-10 w-10 items-center justify-center rounded-xl text-primary-foreground/85 transition-colors hover:text-primary-foreground focus-visible:text-primary-foreground"
                >
                  <Search className="h-5 w-5" aria-hidden="true" />
                </button>
              </li>
              <li className="flex items-center pl-2">
                <a
                  href={memberPortalUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="rounded-xl bg-primary-foreground px-6 py-3 text-sm font-semibold text-primary transition-colors hover:bg-ink-deep hover:text-background"
                >
                  Member log in
                </a>
              </li>
            </ul>
          </nav>

          <div className="flex items-center gap-2 lg:hidden">
            <button
              type="button"
              onClick={() => {
                setSearchLoaded(true);
                setSearchOpen(true);
              }}
              aria-label="Search the site"
              className="my-2 inline-flex h-11 w-11 items-center justify-center rounded-xl border border-primary-foreground/30 text-primary-foreground"
            >
              <Search className="h-4 w-4" aria-hidden="true" />
            </button>

            <button
              ref={menuButtonRef}
              type="button"
              onClick={() => setOpen((v) => !v)}
              aria-expanded={open}
              aria-controls="mobile-nav"
              className="my-2 inline-flex min-h-11 items-center gap-3 rounded-xl border border-primary-foreground/30 px-4 meta-label text-primary-foreground"
            >
              {open ? "Close" : "Menu"}
              <span aria-hidden="true" className="flex flex-col gap-1">
                <span
                  className={cn(
                    "block h-px w-5 bg-primary-foreground transition-transform duration-300",
                    open && "translate-y-[3px] rotate-45",
                  )}
                />
                <span
                  className={cn(
                    "block h-px w-5 bg-primary-foreground transition-transform duration-300",
                    open && "-translate-y-[3px] -rotate-45",
                  )}
                />
              </span>
            </button>
          </div>
        </div>

        <div
          aria-hidden="true"
          className="absolute inset-x-0 bottom-0 h-0.5 bg-primary-foreground/15"
        >
          <div
            ref={progressRef}
            className="h-full origin-left scale-x-0 bg-primary-foreground/80"
          />
        </div>

        {/* Mega menu panel */}
        {activeEntry ? (
          <div className="absolute inset-x-0 top-full z-40 hidden animate-in fade-in slide-in-from-top-2 border-t border-background/10 bg-ink-deep text-background shadow-2xl duration-200 lg:block">
            <div className="mx-auto max-w-[1400px] px-6 py-10 lg:px-12">
              {activeEntry.type === "initiatives" ? (
                <div>
                  <p className="meta-label text-background/60">Initiatives</p>
                  <h3 className="mt-2 font-display text-2xl font-semibold text-background">
                    Programmes we run for the public good
                  </h3>
                  <ul className="mt-8 grid gap-x-8 gap-y-6 sm:grid-cols-2 lg:grid-cols-3">
                    {initiatives.map((initiative) => (
                      <li key={initiative.slug}>
                        <Link
                          to="/initiatives/$slug"
                          params={{ slug: initiative.slug }}
                          onClick={closeMenuNow}
                          className="group flex items-center gap-3"
                        >
                          <span className="h-12 w-12 shrink-0 overflow-hidden rounded-full bg-secondary">
                            <img
                              src={initiative.image}
                              alt=""
                              loading="lazy"
                              className="h-full w-full object-cover grayscale transition-[filter] duration-300 group-hover:grayscale-0"
                            />
                          </span>
                          <span>
                            <span className="block text-sm font-semibold text-background transition-colors group-hover:text-primary">
                              {initiative.title}
                            </span>
                            <span
                              className={cn(
                                "block text-xs",
                                initiative.tone === "green" ? "text-sustain" : "text-primary/80",
                              )}
                            >
                              {initiative.eyebrow}
                            </span>
                          </span>
                        </Link>
                      </li>
                    ))}
                  </ul>
                  <div className="mt-8 flex flex-wrap items-baseline gap-x-8 gap-y-3 border-t border-background/10 pt-6">
                    <span className="meta-label text-background/50">More from AAK</span>
                    {aakPlatforms.map((link) => (
                      <NavItem
                        key={link.label}
                        href={link.href}
                        external={link.external}
                        onClick={closeMenuNow}
                        className="link-underline text-sm font-medium text-background/85 transition-colors hover:text-background"
                      >
                        {link.label}
                      </NavItem>
                    ))}
                  </div>
                </div>
              ) : (
                <div className="grid gap-10 lg:grid-cols-[minmax(0,1fr)_2fr]">
                  <div>
                    <p className="meta-label text-background/60">{activeEntry.label}</p>
                    <p className="mt-3 max-w-xs text-sm leading-relaxed text-background/65">
                      {activeEntry.description}
                    </p>
                  </div>
                  <ul className="grid gap-x-8 gap-y-1 sm:grid-cols-2">
                    {activeEntry.links.map((link) => (
                      <li key={link.label}>
                        <NavItem
                          href={link.href}
                          external={link.external}
                          onClick={closeMenuNow}
                          className="link-underline inline-flex min-h-11 items-center text-[0.95rem] font-medium text-background/85 transition-colors hover:text-background"
                        >
                          {link.label}
                        </NavItem>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          </div>
        ) : null}
      </div>

      {/* Full-screen spatial takeover, mobile/tablet only — the desktop hover
          mega-menu above stays as the primary nav there. */}
      {open ? (
        <div
          id="mobile-nav"
          role="dialog"
          aria-modal="true"
          aria-label="Site menu"
          className="animate-in fade-in fixed inset-0 z-50 flex flex-col bg-ink-deep text-background duration-200 lg:hidden"
        >
          <div className="flex items-center justify-between border-b border-background/15 px-6 py-4">
            <Link
              to="/"
              className="flex items-center"
              aria-label="Architectural Association of Kenya, home"
              onClick={() => setOpen(false)}
            >
              <span className="flex items-center rounded-lg bg-background px-3 py-2">
                <img
                  src={logoHorizontal}
                  alt=""
                  width={405}
                  height={96}
                  className="h-7 w-auto object-contain"
                />
              </span>
            </Link>
            <button
              type="button"
              onClick={() => setOpen(false)}
              aria-label="Close menu"
              className="inline-flex h-11 w-11 items-center justify-center rounded-xl border border-background/25 text-background"
            >
              <Close className="h-5 w-5" aria-hidden="true" />
            </button>
          </div>

          <nav aria-label="Mobile" className="flex-1 overflow-y-auto px-6 py-6">
            <ul>
              {navMenu.map((entry, i) => {
                const num = String(i + 1).padStart(2, "0");
                if (entry.type === "link") {
                  return (
                    <li key={entry.label} className="border-b border-background/12">
                      <NavItem
                        href={entry.href}
                        external={entry.external}
                        onClick={() => setOpen(false)}
                        className="group flex min-h-16 items-baseline gap-4 py-4"
                      >
                        <span className="font-display text-xs text-background/35">{num}</span>
                        <span className="font-display text-2xl font-semibold tracking-tight text-balance transition-colors group-hover:text-primary sm:text-3xl">
                          {entry.label}
                        </span>
                      </NavItem>
                    </li>
                  );
                }

                const label = menuLabel(entry);
                return (
                  <Accordion key={label} type="single" collapsible>
                    <AccordionItem value={label} className="border-background/12">
                      <AccordionTrigger className="min-h-16 py-4 hover:no-underline">
                        <span className="flex items-baseline gap-4">
                          <span className="font-display text-xs text-background/35">{num}</span>
                          <span className="font-display text-2xl font-semibold tracking-tight sm:text-3xl">
                            {label}
                          </span>
                        </span>
                      </AccordionTrigger>
                      <AccordionContent>
                        <ul className="space-y-1 py-2 pl-9">
                          {entry.type === "initiatives"
                            ? initiatives
                                .map((initiative) => (
                                  <li key={initiative.slug}>
                                    <Link
                                      to="/initiatives/$slug"
                                      params={{ slug: initiative.slug }}
                                      onClick={() => setOpen(false)}
                                      className="flex min-h-11 items-center text-base text-background/65 transition-colors hover:text-background"
                                    >
                                      {initiative.title}
                                    </Link>
                                  </li>
                                ))
                                .concat(
                                  aakPlatforms.map((link) => (
                                    <li key={link.label}>
                                      <NavItem
                                        href={link.href}
                                        external={link.external}
                                        onClick={() => setOpen(false)}
                                        className="flex min-h-11 items-center text-base text-background/65 transition-colors hover:text-background"
                                      >
                                        {link.label}
                                      </NavItem>
                                    </li>
                                  )),
                                )
                            : entry.links.map((link) => (
                                <li key={link.label}>
                                  <NavItem
                                    href={link.href}
                                    external={link.external}
                                    onClick={() => setOpen(false)}
                                    className="flex min-h-11 items-center text-base text-background/65 transition-colors hover:text-background"
                                  >
                                    {link.label}
                                  </NavItem>
                                </li>
                              ))}
                        </ul>
                      </AccordionContent>
                    </AccordionItem>
                  </Accordion>
                );
              })}
            </ul>
            <a
              href={memberPortalUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="group btn-primary mt-8 w-full justify-center"
            >
              Member log in
            </a>
          </nav>
        </div>
      ) : null}

      {searchLoaded ? (
        <Suspense fallback={null}>
          <SearchDialog open={searchOpen} onOpenChange={setSearchOpen} />
        </Suspense>
      ) : null}
    </header>
  );
}
