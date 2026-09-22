import { IconArrowUpRight as ArrowUpRight } from "@tabler/icons-react";

import { Header } from "@/components/site/Header";
import { Footer } from "@/components/site/Footer";
import { Reveal } from "@/components/site/Reveal";
import { PageBreadcrumb } from "@/components/site/PageBreadcrumb";

export interface ArchiveDocument {
  title: string;
  year?: string;
  href: string;
}

interface ReportArchivePageProps {
  eyebrow: string;
  title: string;
  description: string;
  documents: ArchiveDocument[];
}

export function ReportArchivePage({
  eyebrow,
  title,
  description,
  documents,
}: ReportArchivePageProps) {
  return (
    <>
      <Header />
      <main>
        <section className="border-b border-border bg-secondary/40 py-14 lg:py-20">
          <div className="mx-auto max-w-[1400px] px-6 lg:px-12">
            <PageBreadcrumb
              trail={[{ label: "Resource Centre", href: "/resources" }, { label: title }]}
            />

            <Reveal className="mt-8 max-w-2xl">
              <div className="flex items-center gap-3 text-xs font-medium uppercase tracking-[0.22em] text-muted-foreground">
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
