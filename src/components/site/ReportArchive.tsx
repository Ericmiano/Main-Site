import { useEffect, useRef, type PointerEvent as ReactPointerEvent } from "react";
import { IconArrowUpRight as ArrowUpRight } from "@tabler/icons-react";

import { Header } from "@/components/site/Header";
import { Footer } from "@/components/site/Footer";
import { Reveal } from "@/components/site/Reveal";
import { PageBreadcrumb } from "@/components/site/PageBreadcrumb";
import { ArchitecturalDrawing } from "@/components/site/ArchitecturalDrawing";
import { documentPreviews } from "@/data/document-previews";
import { prefersReducedMotion } from "@/lib/gsap";

export interface ArchiveDocument {
  title: string;
  year?: string;
  href: string;
  /** The report's cover, shown as a small thumbnail beside its title. */
  cover?: { src: string; width: number; height: number };
}

interface ReportArchivePageProps {
  eyebrow: string;
  title: string;
  description: string;
  documents: ArchiveDocument[];
}

type Preview = (typeof documentPreviews)[string];

/** A document's first-page preview (scripts/document-previews.py), if made. */
const previewFor = (href: string): Preview | undefined =>
  documentPreviews[decodeURIComponent(href.split("/").pop() ?? "")];

const PREVIEW_WIDTH = 160;
const GAP = 28;

/**
 * The cover that follows the pointer along a document list: hovering a title
 * shows its first page beside the pointer, gliding after it with a slight
 * lag and a tilt in the direction of travel. Mouse and trackpad only (touch
 * screens have nothing to follow); with reduced motion it sits beside the
 * pointer without the glide. Purely visual: the title is the link.
 */
function useCursorPreview() {
  const box = useRef<HTMLDivElement>(null);
  const img = useRef<HTMLImageElement>(null);
  const state = useRef({ x: 0, y: 0, tx: 0, ty: 0, shown: false, frame: 0 });

  useEffect(() => {
    const s = state.current;
    return () => cancelAnimationFrame(s.frame);
  }, []);

  const place = () => {
    const s = state.current;
    const el = box.current;
    if (!el) return;
    const still = prefersReducedMotion();
    s.x = still ? s.tx : s.x + (s.tx - s.x) * 0.18;
    s.y = still ? s.ty : s.y + (s.ty - s.y) * 0.18;
    const tilt = still ? 0 : Math.max(-12, Math.min(12, (s.tx - s.x) * 0.15));
    el.style.transform = `translate3d(${s.x}px, ${s.y}px, 0) rotate(${tilt}deg)`;
    const moving = Math.abs(s.tx - s.x) > 0.3 || Math.abs(s.ty - s.y) > 0.3;
    s.frame = s.shown && moving ? requestAnimationFrame(place) : 0;
  };

  const aim = (event: ReactPointerEvent, height: number) => {
    const s = state.current;
    // Beside the pointer; on its left near the right edge of the screen.
    const right = event.clientX + GAP + PREVIEW_WIDTH < window.innerWidth;
    s.tx = right ? event.clientX + GAP : event.clientX - GAP - PREVIEW_WIDTH;
    s.ty = Math.max(12, Math.min(window.innerHeight - height - 12, event.clientY - height / 2));
    if (!s.frame) s.frame = requestAnimationFrame(place);
  };

  const rowProps = (preview: Preview | undefined) =>
    preview
      ? {
          onPointerEnter(event: ReactPointerEvent) {
            if (event.pointerType !== "mouse" || !box.current || !img.current) return;
            const height = (PREVIEW_WIDTH * preview.height) / preview.width;
            img.current.src = preview.src;
            img.current.style.height = `${height}px`;
            const s = state.current;
            if (!s.shown) {
              // Appear where the pointer is, then follow it.
              aim(event, height);
              s.x = s.tx;
              s.y = s.ty;
            }
            s.shown = true;
            box.current.dataset["shown"] = "";
            aim(event, height);
          },
          onPointerMove(event: ReactPointerEvent) {
            if (event.pointerType !== "mouse" || !state.current.shown) return;
            aim(event, (PREVIEW_WIDTH * preview.height) / preview.width);
          },
          onPointerLeave() {
            state.current.shown = false;
            if (box.current) delete box.current.dataset["shown"];
          },
        }
      : {};

  const layer = (
    <div ref={box} aria-hidden="true" className="cursor-preview">
      <img ref={img} alt="" width={PREVIEW_WIDTH} decoding="async" />
    </div>
  );
  return { rowProps, layer };
}

export function ReportArchivePage({
  eyebrow,
  title,
  description,
  documents,
}: ReportArchivePageProps) {
  const { rowProps, layer } = useCursorPreview();
  return (
    <>
      {layer}
      <Header />
      <main>
        <section className="relative overflow-hidden border-b border-border bg-secondary/40 py-14 lg:py-20">
          <ArchitecturalDrawing
            intro
            variant="plan"
            className="pointer-events-none absolute top-1/2 right-12 hidden w-[26rem] -translate-y-1/2 text-foreground/20 xl:block"
          />
          <div className="relative mx-auto max-w-[1400px] px-6 lg:px-12">
            <PageBreadcrumb
              trail={[{ label: "Resource Centre", href: "/resources" }, { label: title }]}
            />

            <Reveal className="mt-8 max-w-2xl">
              <div className="flex items-center gap-3 meta-label text-muted-foreground">
                <span>{eyebrow}</span>
              </div>
              <h1 className="mt-5 font-display text-4xl font-semibold tracking-tight text-foreground sm:text-5xl">
                {title}
              </h1>
              <p className="mt-5 text-base leading-relaxed text-muted-foreground">{description}</p>
            </Reveal>
          </div>
        </section>

        <section aria-labelledby="documents-title" className="py-16 lg:py-24">
          <div className="mx-auto max-w-[1400px] px-6 lg:px-12">
            <h2 id="documents-title" className="sr-only">
              Documents
            </h2>
            {documents.length ? (
              <ul className="border-t border-border">
                {documents.map((doc, i) => (
                  <li key={doc.href}>
                    <Reveal delay={i * 60}>
                      <a
                        href={doc.href}
                        target="_blank"
                        rel="noopener noreferrer"
                        {...rowProps(previewFor(doc.href))}
                        className="group flex w-full flex-col gap-2 border-b border-border py-7 text-left transition-colors hover:bg-secondary/60 sm:flex-row sm:items-center sm:justify-between sm:gap-8"
                      >
                        <div className="flex items-start gap-6 sm:items-center">
                          <span className="pt-1 font-display text-xs tabular-nums text-muted-foreground sm:pt-0">
                            {String(i + 1).padStart(2, "0")}
                          </span>
                          {doc.cover ? (
                            <img
                              src={doc.cover.src}
                              alt=""
                              width={doc.cover.width}
                              height={doc.cover.height}
                              loading="lazy"
                              decoding="async"
                              className="h-20 w-auto shrink-0 rounded-sm border border-border bg-secondary shadow-sm"
                            />
                          ) : null}
                          <h3 className="font-display text-lg font-semibold leading-snug text-foreground sm:text-xl">
                            {doc.title}
                          </h3>
                        </div>
                        <div className="flex items-center gap-4 pl-12 sm:pl-0">
                          {doc.year ? (
                            <span className="text-xs uppercase tracking-[0.16em] text-muted-foreground">
                              {doc.year}
                            </span>
                          ) : null}
                          <ArrowUpRight className="h-5 w-5 shrink-0 text-primary" />
                        </div>
                      </a>
                    </Reveal>
                  </li>
                ))}
              </ul>
            ) : (
              <p className="text-sm text-muted-foreground">
                No documents are currently listed for this category.
              </p>
            )}
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
