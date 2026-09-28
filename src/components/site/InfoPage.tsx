import type { ReactNode } from "react";
import { IconAlertTriangle as Alert } from "@tabler/icons-react";
import { Header } from "@/components/site/Header";
import { Footer } from "@/components/site/Footer";
import { PageBreadcrumb } from "@/components/site/PageBreadcrumb";

/** Legal pages stay marked as drafts (and out of search results) until AAK
 * approves the wording. Flip to true once approved. */
export const LEGAL_PAGES_APPROVED = false;

export const infoPageMeta = (title: string, description: string, path: string, draft: boolean) => {
  const fullTitle = `${title} | Architectural Association of Kenya`;
  return {
    meta: [
      { title: fullTitle },
      { name: "description", content: description },
      { property: "og:title", content: fullTitle },
      { property: "og:description", content: description },
      ...(draft ? [{ name: "robots", content: "noindex" }] : []),
    ],
    links: [{ rel: "canonical", href: `https://aak.or.ke${path}` }],
  };
};

/** Shared layout for FAQs, legal and accessibility pages. */
export function InfoPage({
  title,
  intro,
  updated,
  draft = false,
  children,
}: {
  title: string;
  intro: string;
  updated: string;
  draft?: boolean;
  children: ReactNode;
}) {
  return (
    <>
      <Header />
      <main>
        <section className="border-b border-border bg-secondary/40 py-14 lg:py-20">
          <div className="mx-auto max-w-[1400px] px-6 lg:px-12">
            <PageBreadcrumb trail={[{ label: title }]} />
            <div className="mt-8 max-w-3xl">
              <p className="meta-label border-t border-border pt-5 text-muted-foreground">
                Last updated {updated}
              </p>
              <h1 className="mt-5 font-display text-4xl font-semibold leading-[1.02] tracking-tight text-balance text-foreground sm:text-5xl lg:text-6xl">
                {title}
              </h1>
              <p className="mt-5 text-base leading-relaxed text-muted-foreground">{intro}</p>
            </div>
          </div>
        </section>

        <div className="mx-auto max-w-[1400px] px-6 py-14 lg:px-12 lg:py-20">
          {draft ? (
            <div
              role="note"
              className="mb-10 flex max-w-3xl gap-3 rounded-xl border border-foreground/20 bg-paper-earth p-5 text-sm leading-relaxed text-foreground"
            >
              <Alert className="mt-0.5 h-5 w-5 shrink-0" aria-hidden="true" />
              <p>
                <strong>Draft pending AAK approval.</strong> This page describes how the website
                works today. Its wording has not yet been approved by the Association and may
                change.
              </p>
            </div>
          ) : null}
          <div className="info-prose max-w-3xl">{children}</div>
        </div>
      </main>
      <Footer />
    </>
  );
}
