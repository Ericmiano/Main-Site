import { createFileRoute, Link } from "@tanstack/react-router";
import {
  IconArrowUpRight as ArrowUpRight,
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
import { ClickToLoadMap } from "@/components/site/ClickToLoadMap";
import { jsonLd } from "@/lib/json-ld";

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
        dangerouslySetInnerHTML={{ __html: jsonLd(structuredData()) }}
      />
      <Header />
      <main>
        <section className="border-b border-border bg-secondary/40 py-14 lg:py-20">
          <div className="mx-auto max-w-[1400px] px-6 lg:px-12">
            <PageBreadcrumb trail={[{ label: "Contact Us" }]} />

            <Reveal className="mt-8 max-w-2xl">
              <h1 className="mt-2 font-display text-4xl font-semibold leading-[1.02] tracking-tight text-balance text-foreground sm:text-5xl lg:text-6xl">
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
                <a
                  href="https://wa.me/254721691337"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="mt-auto inline-flex items-center gap-2 pt-2 text-sm font-semibold text-foreground transition-colors hover:text-primary"
                >
                  Chat on WhatsApp
                  <ArrowUpRight className="h-4 w-4 text-primary" aria-hidden="true" />
                </a>
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
                  className="group btn-primary"
                >
                  Mulika Mjengo
                </Link>
                <a href="mailto:aak@aak.or.ke" className="link-quiet text-foreground">
                  Email the secretariat
                </a>
              </div>
            </div>
          </Reveal>
        </section>

        <section
          aria-labelledby="map-title"
          className="border-t border-border bg-secondary/40 py-16 lg:py-20"
        >
          <div className="mx-auto grid max-w-[1400px] gap-8 px-6 lg:grid-cols-[0.7fr_1.6fr] lg:items-center lg:px-12">
            <div>
              <h2
                id="map-title"
                className="font-display text-2xl font-semibold tracking-tight text-foreground"
              >
                Find the secretariat
              </h2>
              <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
                Blue Violets Plaza, 6th Floor, Room 605, Kindaruma Rd, off Ngong Rd, Nairobi.
              </p>
              <a
                href="https://www.google.com/maps/search/?api=1&query=Blue+Violet+Plaza+Kindaruma+Road+Nairobi"
                target="_blank"
                rel="noopener noreferrer"
                className="mt-5 inline-flex items-center gap-2 text-sm font-semibold text-foreground transition-colors hover:text-primary"
              >
                Get directions
                <ArrowUpRight className="h-4 w-4 text-primary" aria-hidden="true" />
              </a>
            </div>
            <div className="aspect-4/3 overflow-hidden rounded-2xl border border-border bg-secondary sm:aspect-video">
              <ClickToLoadMap
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3988.7954780058567!2d36.790491314254716!3d-1.2974023990537153!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x182f109787542ce1%3A0x1fff8b8ca80946c!2sBlue+Violet+Plaza%2C+Kamburu+Dr%2C+Nairobi!5e0!3m2!1sen!2ske!4v1549692093091"
                title="Map showing Blue Violet Plaza, Nairobi"
              />
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
