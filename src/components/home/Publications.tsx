import { useState } from "react";
import { IconArrowUpRight as ArrowUpRight, IconFileText as FileText } from "@tabler/icons-react";
import { publications } from "@/data/site";
import { Reveal } from "@/components/site/Reveal";
import { SectionRule } from "@/components/site/SectionRule";
import { Lightbox } from "@/components/site/Lightbox";

export function Publications() {
  const [openIndex, setOpenIndex] = useState<number | null>(null);
  const activeDoc = openIndex !== null ? publications[openIndex] : undefined;

  const navigate = (direction: -1 | 1) => {
    setOpenIndex((current) => {
      if (current === null) return current;
      return (current + direction + publications.length) % publications.length;
    });
  };

  return (
    <section
      id="publications"
      aria-labelledby="publications-title"
      className="bg-background py-24 lg:py-32"
    >
      <div className="mx-auto max-w-[1400px] px-6 lg:px-12">
        <Reveal className="max-w-2xl">
          <SectionRule index="07" label="Knowledge archive" />
          <h2
            id="publications-title"
            className="mt-8 font-display text-4xl font-semibold leading-[0.98] tracking-tight text-balance text-foreground sm:text-5xl"
          >
            Research, policy and the record.
          </h2>
          <p className="mt-5 max-w-xl text-base leading-relaxed text-muted-foreground">
            The association&rsquo;s submissions, reports and magazines: public documents that shape
            how Kenya builds.
          </p>
        </Reveal>

        <ul className="mt-16 grid grid-cols-1 gap-5 sm:grid-cols-3">
          {publications.map((doc, i) => (
            <li key={doc.title}>
              <Reveal delay={i * 80}>
                <button
                  type="button"
                  onClick={() => setOpenIndex(i)}
                  className="group flex w-full flex-col justify-between gap-8 border border-border p-6 text-left transition-colors duration-300 hover:bg-secondary/60 sm:aspect-3/4 sm:p-7"
                >
                  <div className="flex items-start justify-between">
                    <span className="font-display text-sm text-muted-foreground/60">
                      {String(i + 1).padStart(2, "0")}
                    </span>
                    <FileText className="h-5 w-5 text-primary" aria-hidden="true" />
                  </div>
                  <div>
                    <span className="meta-label text-primary">{doc.meta}</span>
                    <h3 className="mt-3 font-display text-2xl font-semibold leading-tight text-balance text-foreground">
                      {doc.title}
                    </h3>
                    <span className="mt-4 inline-flex items-center gap-2 text-sm font-semibold text-foreground transition-opacity duration-300 sm:opacity-0 sm:group-hover:opacity-100 sm:group-focus-visible:opacity-100">
                      Open PDF
                      <ArrowUpRight className="h-4 w-4 text-primary" />
                    </span>
                  </div>
                </button>
              </Reveal>
            </li>
          ))}
        </ul>
      </div>

      <Lightbox
        open={activeDoc !== undefined}
        onOpenChange={(open) => {
          if (!open) setOpenIndex(null);
        }}
        onNavigate={navigate}
        title={activeDoc?.title ?? "Publication"}
        className="max-w-md"
      >
        {activeDoc ? (
          <div className="flex flex-col gap-4 px-6 py-8 sm:px-8">
            <span className="inline-flex h-12 w-12 items-center justify-center bg-primary/10 text-primary">
              <FileText className="h-5 w-5" aria-hidden="true" />
            </span>
            <div>
              <span className="text-[11px] font-medium uppercase tracking-[0.16em] text-muted-foreground">
                {activeDoc.meta}
              </span>
              <h3 className="mt-2 font-display text-xl font-semibold leading-snug text-foreground">
                {activeDoc.title}
              </h3>
            </div>
            <a
              href={activeDoc.href}
              target="_blank"
              rel="noopener noreferrer"
              className="group mt-2 inline-flex items-center justify-center gap-2 rounded-xl bg-foreground px-6 py-3 text-sm font-semibold text-background transition-transform duration-300 hover:-translate-y-0.5"
            >
              Open PDF
              <ArrowUpRight className="h-4 w-4" />
            </a>
          </div>
        ) : null}
      </Lightbox>
    </section>
  );
}
