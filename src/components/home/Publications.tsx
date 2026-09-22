import { useState } from "react";
import { IconArrowUpRight as ArrowUpRight, IconFileText as FileText } from "@tabler/icons-react";
import { publications } from "@/data/site";
import { Reveal } from "@/components/site/Reveal";
import { SectionHeading } from "@/components/site/SectionHeading";
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
        <SectionHeading
          eyebrow="Publications"
          title={<span id="publications-title">Research, policy and the record</span>}
          description="The association's submissions, reports and magazines: public documents that shape how Kenya builds."
        />

        <ul className="mt-14 border-t border-border">
          {publications.map((doc, i) => (
            <li key={doc.title}>
              <Reveal delay={i * 60}>
                <button
                  type="button"
                  onClick={() => setOpenIndex(i)}
                  className="group flex w-full flex-col gap-2 border-b border-border py-7 text-left transition-colors hover:bg-secondary/60 sm:flex-row sm:items-center sm:justify-between sm:gap-8"
                >
                  <div className="flex items-start gap-6 sm:items-center">
                    <span className="pt-1 font-display text-xs tabular-nums text-muted-foreground sm:pt-0">
                      {String(i + 1).padStart(2, "0")}
                    </span>
                    <h3 className="font-display text-lg font-semibold leading-snug text-foreground sm:text-xl">
                      {doc.title}
                    </h3>
                  </div>
                  <div className="flex items-center gap-4 pl-12 sm:pl-0">
                    <span className="text-xs uppercase tracking-[0.16em] text-muted-foreground">
                      {doc.meta}
                    </span>
                    <ArrowUpRight className="h-5 w-5 shrink-0 text-primary" />
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
