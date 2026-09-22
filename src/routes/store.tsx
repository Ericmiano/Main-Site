import { createFileRoute } from "@tanstack/react-router";
import { IconMessageCircle as MessageCircle } from "@tabler/icons-react";

import { Header } from "@/components/site/Header";
import { Footer } from "@/components/site/Footer";
import { Reveal } from "@/components/site/Reveal";
import { PageBreadcrumb } from "@/components/site/PageBreadcrumb";

const SITE_URL = "https://aak.or.ke";
const TITLE = "Store | Architectural Association of Kenya";
const DESCRIPTION =
  "AAK merchandise and industry documents: JBC contract books, certificates and the David Mutiso Bursary Fund. Order via WhatsApp.";

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
  category: "Merchandise" | "Industry documents" | "Fundraising";
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
    image: "https://aak.or.ke/wp-content/uploads/2021/08/AAK-Caps.png",
  },
  {
    name: "Branded AAK Cups",
    price: "Out of stock",
    category: "Merchandise",
    image: "https://aak.or.ke/wp-content/uploads/2023/06/branded-aak-cups.png",
  },
  {
    name: "Certificate of Good Making",
    price: "KES 2,320-4,060",
    category: "Industry documents",
    image: "https://aak.or.ke/wp-content/uploads/2021/08/Certificate-of-Good-Making-1.jpg",
  },
  {
    name: "Certificate of Practical Completion",
    price: "KES 2,320-4,060",
    category: "Industry documents",
    image: "https://aak.or.ke/wp-content/uploads/2021/08/Certificate-of-Practical-Completion.jpg",
  },
  {
    name: "Interim Certificate",
    price: "KES 2,320-4,060",
    category: "Industry documents",
    image: "https://aak.or.ke/wp-content/uploads/2021/08/AAK-Interim-Certificate.jpg",
  },
  {
    name: "JBC Contract Green Book",
    price: "KES 4,060-5,800",
    category: "Industry documents",
    image:
      "https://aak.or.ke/wp-content/uploads/2021/08/Joint-Building-Council-Contract-Book-Green-Book-e1551606319777.jpg",
  },
  {
    name: "Standard Method of Measurement Book",
    price: "KES 600-2,000",
    category: "Industry documents",
    image: "https://aak.or.ke/wp-content/uploads/2021/08/Standard-Method-of-Measurement-SMM.jpg",
  },
  {
    name: "David Mutiso Bursary Fund",
    price: "Donation",
    category: "Fundraising",
    ctaLabel: "Donate via WhatsApp",
    ctaMessage: "Hi, I'd like to donate to the David Mutiso Bursary Fund.",
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
              <h1 className="mt-2 font-display text-4xl font-semibold tracking-tight text-foreground sm:text-5xl">
                Store
              </h1>
              <p className="mt-5 text-base leading-relaxed text-muted-foreground">
                Branded merchandise, standard industry documents used across the profession, and the
                David Mutiso Bursary Fund. Orders are placed via WhatsApp; payment by M-Pesa, Visa,
                Mastercard, PayPal or Stripe.
              </p>
              <a
                href={`https://wa.me/${WHATSAPP_NUMBER}`}
                target="_blank"
                rel="noopener noreferrer"
                className="group mt-8 inline-flex items-center gap-3 rounded-xl bg-primary px-7 py-4 text-sm font-semibold text-primary-foreground transition-transform duration-300 hover:-translate-y-0.5"
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
                          <span className="text-[11px] font-semibold uppercase tracking-[0.1em] text-primary">
                            {item.category}
                          </span>
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
                              className="mt-4 inline-flex items-center justify-center gap-2 rounded-lg bg-primary/10 px-4 py-2.5 text-sm font-semibold text-primary transition-colors hover:bg-primary hover:text-primary-foreground"
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
