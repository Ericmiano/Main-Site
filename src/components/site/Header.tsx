import { useEffect, useRef, useState } from "react";
import { Link } from "@tanstack/react-router";
import { IconChevronDown as ChevronDown, IconSearch as Search } from "@tabler/icons-react";
import {
  chapters,
  initiatives,
  memberPortalUrl,
  navMenu,
  utilityLinks,
  type NavMenuEntry,
} from "@/data/site";
import { cn } from "@/lib/utils";
import logoMark from "@/assets/aak-logo-mark.png";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { SearchDialog } from "./SearchDialog";

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
  if (entry.type === "chapters") return "Chapters";
  if (entry.type === "initiatives") return "Initiatives";
  return entry.label;
}

export function Header() {
  const [open, setOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [activeMenu, setActiveMenu] = useState<string | null>(null);
  const navRef = useRef<HTMLDivElement>(null);
  const closeTimer = useRef<number | null>(null);

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
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false);
    };
    document.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
    };
  }, [open]);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "k") {
        e.preventDefault();
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
    <header className="sticky top-0 z-50 bg-background">
      {/* Utility strip */}
      <div className="hidden bg-ink-deep text-background lg:block">
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
            className="flex items-center gap-3 py-4"
            aria-label="Architectural Association of Kenya, home"
            onClick={closeMenuNow}
          >
            <img
              src={logoMark}
              alt=""
              className="h-11 w-11 object-contain"
              width={44}
              height={44}
            />
            <span className="hidden max-w-[13rem] text-[11px] leading-tight uppercase tracking-[0.16em] text-primary-foreground/95 sm:block">
              Architectural Association
              <br />
              of Kenya
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
                  onClick={() => setSearchOpen(true)}
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
                  Member portal
                </a>
              </li>
            </ul>
          </nav>

          <div className="flex items-center gap-2 lg:hidden">
            <button
              type="button"
              onClick={() => setSearchOpen(true)}
              aria-label="Search the site"
              className="my-2 inline-flex h-11 w-11 items-center justify-center rounded-xl border border-primary-foreground/30 text-primary-foreground"
            >
              <Search className="h-4 w-4" aria-hidden="true" />
            </button>

            <button
              type="button"
              onClick={() => setOpen((v) => !v)}
              aria-expanded={open}
              aria-controls="mobile-nav"
              className="my-2 inline-flex min-h-11 items-center gap-3 rounded-xl border border-primary-foreground/30 px-4 text-[11px] font-semibold uppercase tracking-[0.18em] text-primary-foreground"
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

        {/* Mega menu panel */}
        {activeEntry ? (
          <div className="absolute inset-x-0 top-full z-40 hidden animate-in fade-in slide-in-from-top-2 border-t border-background/10 bg-ink-deep text-background shadow-2xl duration-200 lg:block">
            <div className="mx-auto max-w-[1400px] px-6 py-10 lg:px-12">
              {activeEntry.type === "chapters" ? (
                <div>
                  <p className="text-xs font-semibold uppercase tracking-[0.18em] text-primary">
                    Chapters
                  </p>
                  <h3 className="mt-2 font-display text-2xl font-semibold text-background">
                    Eight professional chapters, one association
                  </h3>
                  <ul className="mt-8 grid gap-x-8 gap-y-6 sm:grid-cols-2 lg:grid-cols-4">
                    {chapters.map((chapter) => (
                      <li key={chapter.slug}>
                        <Link
                          to="/chapters/$slug"
                          params={{ slug: chapter.slug }}
                          onClick={closeMenuNow}
                          className="group flex items-center gap-3"
                        >
                          <span className="h-12 w-12 shrink-0 overflow-hidden rounded-full bg-secondary">
                            <img
                              src={chapter.image}
                              alt=""
                              loading="lazy"
                              className="h-full w-full object-cover grayscale transition-[filter] duration-300 group-hover:grayscale-0"
                            />
                          </span>
                          <span>
                            <span className="block text-sm font-semibold text-background transition-colors group-hover:text-primary">
                              {chapter.name}
                            </span>
                            <span className="block text-xs text-background/50">
                              Explore chapter
                            </span>
                          </span>
                        </Link>
                      </li>
                    ))}
                  </ul>
                </div>
              ) : activeEntry.type === "initiatives" ? (
                <div>
                  <p className="text-xs font-semibold uppercase tracking-[0.18em] text-primary">
                    Initiatives
                  </p>
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
                </div>
              ) : (
                <div className="grid gap-10 lg:grid-cols-[minmax(0,1fr)_2fr]">
                  <div>
                    <p className="text-xs font-semibold uppercase tracking-[0.18em] text-primary">
                      {activeEntry.label}
                    </p>
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

      {open ? (
        <div id="mobile-nav" className="border-b border-foreground/12 bg-background lg:hidden">
          <nav aria-label="Mobile" className="mx-auto max-w-[1400px] px-6 py-4">
            <ul>
              {navMenu.map((entry) => {
                if (entry.type === "link") {
                  return (
                    <li key={entry.label}>
                      <NavItem
                        href={entry.href}
                        external={entry.external}
                        onClick={() => setOpen(false)}
                        className="flex min-h-12 items-center border-b border-foreground/10 py-3 font-display text-xl font-semibold text-foreground"
                      >
                        {entry.label}
                      </NavItem>
                    </li>
                  );
                }

                const label = menuLabel(entry);
                return (
                  <Accordion key={label} type="single" collapsible>
                    <AccordionItem value={label} className="border-foreground/10">
                      <AccordionTrigger className="min-h-12 py-3 font-display text-xl font-semibold text-foreground hover:no-underline">
                        {label}
                      </AccordionTrigger>
                      <AccordionContent>
                        <ul className="space-y-1 pb-2">
                          {entry.type === "chapters"
                            ? chapters.map((chapter) => (
                                <li key={chapter.slug}>
                                  <Link
                                    to="/chapters/$slug"
                                    params={{ slug: chapter.slug }}
                                    onClick={() => setOpen(false)}
                                    className="flex min-h-11 items-center text-base text-muted-foreground transition-colors hover:text-foreground"
                                  >
                                    {chapter.name}
                                  </Link>
                                </li>
                              ))
                            : entry.type === "initiatives"
                              ? initiatives.map((initiative) => (
                                  <li key={initiative.slug}>
                                    <Link
                                      to="/initiatives/$slug"
                                      params={{ slug: initiative.slug }}
                                      onClick={() => setOpen(false)}
                                      className="flex min-h-11 items-center text-base text-muted-foreground transition-colors hover:text-foreground"
                                    >
                                      {initiative.title}
                                    </Link>
                                  </li>
                                ))
                              : entry.links.map((link) => (
                                  <li key={link.label}>
                                    <NavItem
                                      href={link.href}
                                      external={link.external}
                                      onClick={() => setOpen(false)}
                                      className="flex min-h-11 items-center text-base text-muted-foreground transition-colors hover:text-foreground"
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
              className="mt-5 flex min-h-12 items-center justify-center rounded-xl bg-primary px-5 text-sm font-semibold text-primary-foreground"
            >
              Member portal
            </a>
          </nav>
        </div>
      ) : null}

      <SearchDialog open={searchOpen} onOpenChange={setSearchOpen} />
    </header>
  );
}
