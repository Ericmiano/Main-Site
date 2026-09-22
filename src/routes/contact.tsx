import { createFileRoute, Link } from "@tanstack/react-router";
import {
  IconClock as Clock,
  IconMail as Mail,
  IconMapPin as MapPin,
  IconMessageCircle as MessageCircle,
  IconPhone as Phone,
} from "@tabler/icons-react";

import { Header } from "@/components/site/Header";
import { Footer } from "@/components/site/Footer";
import { Reveal } from "@/components/site/Reveal";
import { PageBreadcrumb } from "@/components/site/PageBreadcrumb";

const SITE_URL = "https://aak.or.ke";
const TITLE = "Contact Us | Architectural Association of Kenya";
const DESCRIPTION =
  "Reach the AAK secretariat at Blue Violets Plaza, Nairobi: phone, WhatsApp and email for members, the press and the public.";

export const Route = createFileRoute("/contact")({
  head: () => ({
    meta: [
      { title: TITLE },
      { name: "description", content: DESCRIPTION },
      { property: "og:title", content: TITLE },
      { property: "og:description", content: DESCRIPTION },
      { property: "og:type", content: "website" },
      { property: "og:url", content: `${SITE_URL}/contact` },
      { name: "twitter:card", content: "summary_large_image" },
    ],
    links: [{ rel: "canonical", href: `${SITE_URL}/contact` }],
  }),
  component: ContactPage,
});

function structuredData() {
  return {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "BreadcrumbList",
        itemListElement: [
          { "@type": "ListItem", position: 1, name: "Home", item: `${SITE_URL}/` },
          { "@type": "ListItem", position: 2, name: "Contact Us", item: `${SITE_URL}/contact` },
        ],
      },
      {
        "@type": "ContactPage",
        name: TITLE,
        about: { "@id": `${SITE_URL}/#organization` },
      },
    ],
  };
}

function ContactPage() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData()) }}
      />
      <Header />
      <main>
        <section className="border-b border-border bg-secondary/40 py-14 lg:py-20">
          <div className="mx-auto max-w-[1400px] px-6 lg:px-12">
            <PageBreadcrumb trail={[{ label: "Contact Us" }]} />

            <Reveal className="mt-8 max-w-2xl">
              <h1 className="mt-2 font-display text-4xl font-semibold tracking-tight text-foreground sm:text-5xl">
                Get in touch
              </h1>
              <p className="mt-5 text-base leading-relaxed text-muted-foreground">
                The secretariat handles membership, advocacy and general enquiries. Mon-Fri, during
                business hours.
              </p>
            </Reveal>
          </div>
        </section>

        <section className="py-16 lg:py-24">
          <div className="mx-auto grid max-w-[1400px] gap-6 px-6 sm:grid-cols-2 lg:grid-cols-4 lg:px-12">
            <Reveal className="h-full">
              <div className="flex h-full flex-col gap-3 rounded-2xl border border-border p-7">
                <MapPin className="h-5 w-5 text-primary" aria-hidden="true" />
                <h2 className="font-display text-base font-semibold text-foreground">Office</h2>
                <p className="text-sm leading-relaxed text-muted-foreground">
                  Blue Violets Plaza, 6th Floor, Room 605
                  <br />
                  Kindaruma Rd, Off Ngong Rd
                  <br />
                  P.O. Box 44258-00100, Nairobi, Kenya
                </p>
              </div>
            </Reveal>

            <Reveal delay={60} className="h-full">
              <div className="flex h-full flex-col gap-3 rounded-2xl border border-border p-7">
                <Phone className="h-5 w-5 text-primary" aria-hidden="true" />
                <h2 className="font-display text-base font-semibold text-foreground">
                  Call &amp; WhatsApp
                </h2>
                <ul className="space-y-1 text-sm text-muted-foreground">
                  <li>
                    <a className="link-underline" href="tel:+254721691337">
                      0721 691 337
                    </a>
                  </li>
                  <li>
                    <a className="link-underline" href="tel:+254202420808">
                      020 242 0808
                    </a>
                  </li>
                  <li>
                    <a className="link-underline" href="tel:+254202420586">
                      020 242 0586
                    </a>
                  </li>
                </ul>
              </div>
            </Reveal>

            <Reveal delay={120} className="h-full">
              <div className="flex h-full flex-col gap-3 rounded-2xl border border-border p-7">
                <Mail className="h-5 w-5 text-primary" aria-hidden="true" />
                <h2 className="font-display text-base font-semibold text-foreground">Email</h2>
                <ul className="space-y-1 text-sm text-muted-foreground">
                  <li>
                    <a className="link-underline" href="mailto:aak@aak.or.ke">
                      aak@aak.or.ke
                    </a>{" "}
                    (general)
                  </li>
                  <li>
                    <a className="link-underline" href="mailto:advocacy@aak.or.ke">
                      advocacy@aak.or.ke
                    </a>{" "}
                    (advocacy &amp; Mulika Mjengo)
                  </li>
                </ul>
              </div>
            </Reveal>

            <Reveal delay={180} className="h-full">
              <div className="flex h-full flex-col gap-3 rounded-2xl border border-border p-7">
                <Clock className="h-5 w-5 text-primary" aria-hidden="true" />
                <h2 className="font-display text-base font-semibold text-foreground">Hours</h2>
                <p className="text-sm leading-relaxed text-muted-foreground">
                  Monday-Friday
                  <br />
                  8:00 am-5:00 pm
                </p>
              </div>
            </Reveal>
          </div>

          <Reveal delay={220} className="mt-6">
            <div className="mx-auto flex max-w-[1400px] flex-col items-start gap-4 rounded-2xl bg-secondary/40 px-6 py-7 sm:flex-row sm:items-center sm:justify-between lg:px-12">
              <div className="flex items-center gap-3">
                <MessageCircle className="h-5 w-5 text-primary" aria-hidden="true" />
                <p className="text-sm text-foreground">
                  Report an unsafe building via Mulika Mjengo, or reach the secretariat directly.
                </p>
              </div>
              <div className="flex flex-wrap gap-3">
                <Link
                  to="/initiatives/$slug"
                  params={{ slug: "mulika-mjengo" }}
                  className="rounded-xl bg-foreground px-5 py-2.5 text-sm font-semibold text-background transition-colors hover:bg-primary"
                >
                  Mulika Mjengo
                </Link>
                <a
                  href="mailto:aak@aak.or.ke"
                  className="rounded-xl border border-border px-5 py-2.5 text-sm font-semibold text-foreground transition-colors hover:border-primary/60"
                >
                  Email the secretariat
                </a>
              </div>
            </div>
          </Reveal>
        </section>
      </main>
      <Footer />
    </>
  );
}
