import { createFileRoute } from "@tanstack/react-router";
import { IconMessageCircle as MessageCircle } from "@tabler/icons-react";

import { Header } from "@/components/site/Header";
import { Footer } from "@/components/site/Footer";
import { Reveal } from "@/components/site/Reveal";
import { PageBreadcrumb } from "@/components/site/PageBreadcrumb";

const SITE_URL = "https://aak.or.ke";
const TITLE = "Store | Architectural Association of Kenya";
const DESCRIPTION =
  "AAK merchandise and industry documents: JBC contract books and certificates. Order via WhatsApp.";

export const Route = createFileRoute("/store")({
  head: () => ({
    meta: [
      { title: TITLE },
      { name: "description", content: DESCRIPTION },
      { property: "og:title", content: TITLE },
      { property: "og:description", content: DESCRIPTION },
      { property: "og:type", content: "website" },
      { property: "og:url", content: `${SITE_URL}/store` },
      { name: "twitter:card", content: "summary_large_image" },
    ],
    links: [{ rel: "canonical", href: `${SITE_URL}/store` }],
  }),
  component: StorePage,
});

const WHATSAPP_NUMBER = "254721691337";

function orderHref(message: string) {
  return `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(message)}`;
}

interface StoreItem {
  name: string;
  price: string;
  category: "Merchandise" | "Industry documents";
  image?: string;
  /** Defaults to "Order via WhatsApp" / "Hi, I'd like to order: {name}" when omitted. */
  ctaLabel?: string;
  ctaMessage?: string;
}

const items: StoreItem[] = [
  {
    name: "AAK Hats",
    price: "Out of stock",
    category: "Merchandise",
    image: "/img/aak-caps.webp",
  },
  {
    name: "Branded AAK Cups",
    price: "Out of stock",
    category: "Merchandise",
    image: "/img/branded-aak-cups.webp",
  },
  {
    name: "Certificate of Good Making",
    price: "KES 2,320-4,060",
    category: "Industry documents",
    image: "/img/certificate-of-good-making-1.webp",
  },
  {
    name: "Certificate of Practical Completion",
    price: "KES 2,320-4,060",
    category: "Industry documents",
    image: "/img/certificate-of-practical-completion.webp",
  },
  {
    name: "Interim Certificate",
    price: "KES 2,320-4,060",
    category: "Industry documents",
    image: "/img/aak-interim-certificate.webp",
  },
  {
    name: "JBC Contract Green Book",
    price: "KES 4,060-5,800",
    category: "Industry documents",
    image: "/img/joint-building-council-contract-book-green-book-e1551606319777.webp",
  },
  {
    name: "Standard Method of Measurement Book",
    price: "KES 600-2,000",
    category: "Industry documents",
    image: "/img/standard-method-of-measurement-smm.webp",
  },
];

function StorePage() {
  return (
    <>
      <Header />
      <main>
        <section className="border-b border-border bg-secondary/40 py-14 lg:py-20">
          <div className="mx-auto max-w-[1400px] px-6 lg:px-12">
            <PageBreadcrumb trail={[{ label: "Store" }]} />

            <Reveal className="mt-8 max-w-2xl">
              <p className="meta-label text-muted-foreground">The AAK Store</p>
              <h1 className="mt-4 font-display text-4xl font-semibold leading-[1.02] tracking-tight text-balance text-foreground sm:text-5xl lg:text-6xl">
                The tools of the trade, from the profession&rsquo;s home.
              </h1>
              <p className="mt-5 text-base leading-relaxed text-muted-foreground">
                The JBC contract books and certificates that Kenya&rsquo;s building projects run on,
                straight from AAK, plus branded merchandise to carry the Association with you on
                site and in the studio. Order in a quick WhatsApp chat and pay by M-Pesa, Visa,
                Mastercard, PayPal or Stripe.
              </p>
              <a
                href={`https://wa.me/${WHATSAPP_NUMBER}`}
                target="_blank"
                rel="noopener noreferrer"
                className="group btn-primary mt-8"
              >
                <MessageCircle className="h-4 w-4" aria-hidden="true" />
                Order on WhatsApp
              </a>
            </Reveal>
          </div>
        </section>

        <section aria-labelledby="store-items-title" className="py-16 lg:py-24">
          <div className="mx-auto max-w-[1400px] px-6 lg:px-12">
            <h2 id="store-items-title" className="sr-only">
              Items available
            </h2>
            <ul className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {items.map((item, i) => (
                <li key={item.name}>
                  <Reveal delay={(i % 3) * 60} className="h-full">
                    <div className="flex h-full flex-col overflow-hidden rounded-2xl border border-border">
                      {item.image ? (
                        <div className="aspect-square overflow-hidden bg-secondary">
                          <img
                            src={item.image}
                            alt={item.name}
                            loading="lazy"
                            className="h-full w-full object-contain p-6"
                          />
                        </div>
                      ) : null}
                      <div className="flex flex-1 flex-col justify-between p-6">
                        <div>
                          <span className="meta-label text-muted-foreground">{item.category}</span>
                          <h3 className="mt-3 font-display text-base font-semibold leading-snug text-foreground">
                            {item.name}
                          </h3>
                        </div>
                        <div>
                          <p className="mt-4 text-sm text-muted-foreground">{item.price}</p>
                          {item.price !== "Out of stock" ? (
                            <a
                              href={orderHref(
                                item.ctaMessage ?? `Hi, I'd like to order: ${item.name}`,
                              )}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="link-quiet mt-4 text-foreground"
                            >
                              <MessageCircle className="h-4 w-4" aria-hidden="true" />
                              {item.ctaLabel ?? "Order via WhatsApp"}
                            </a>
                          ) : null}
                        </div>
                      </div>
                    </div>
                  </Reveal>
                </li>
              ))}
            </ul>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
