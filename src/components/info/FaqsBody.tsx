import type { ReactNode } from "react";
import { Link } from "@tanstack/react-router";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { gacDonation } from "@/data/grow-a-classroom";
import { portalLinks } from "@/data/site";

const Ext = ({ href, children }: { href: string; children: ReactNode }) => (
  <a href={href} target="_blank" rel="noopener noreferrer">
    {children}
  </a>
);

const groups: { title: string; items: { q: string; a: ReactNode }[] }[] = [
  {
    title: "Membership",
    items: [
      {
        q: "How do I become a member?",
        a: (
          <p>
            Apply online through the <Ext href={portalLinks.apply}>AAK members portal</Ext>,
            choosing the chapter that matches your discipline. The{" "}
            <Link to="/membership">membership page</Link> explains the steps, the membership tiers
            and their fees.
          </p>
        ),
      },
      {
        q: "Which membership category is right for me?",
        a: (
          <p>
            Categories include Corporate, Licentiate, Graduate, Student, Technician, Firm, Visiting
            and Institutional membership. The <Link to="/membership">membership page</Link> lists
            each with its entrance and annual fees, and the &ldquo;Find your fit&rdquo; tool on the{" "}
            <a href="/#membership">homepage</a> suggests a starting point. If you&rsquo;re unsure,
            email <a href="mailto:aak@aak.or.ke">aak@aak.or.ke</a>.
          </p>
        ),
      },
      {
        q: "How do I renew my membership?",
        a: (
          <p>
            Renew and pay your subscription on the{" "}
            <Ext href={portalLinks.pay}>members portal payment page</Ext>. Fees are listed on the{" "}
            <Link to="/membership">membership page</Link>.
          </p>
        ),
      },
      {
        q: "I’m a student. Can I join?",
        a: (
          <p>
            Yes. Students join as student affiliates through the{" "}
            <Ext href={portalLinks.apply}>members portal</Ext>. See{" "}
            <Link to="/students">student affiliates</Link> for details.
          </p>
        ),
      },
    ],
  },
  {
    title: "Certificates and the directory",
    items: [
      {
        q: "How can I check that a practitioner’s AAK certificate is genuine?",
        a: (
          <p>
            Use the <Ext href={portalLinks.validate}>certificate validation service</Ext> on the
            members portal. Anyone can use it; you don&rsquo;t need to be a member.
          </p>
        ),
      },
      {
        q: "How do I find a registered professional or firm?",
        a: (
          <p>
            Search the <Ext href={portalLinks.directory}>members directory</Ext> by name, member
            number or chapter. It lists members in good standing, and has a separate directory of
            member firms. Results are limited to 50 per search, so narrow your search with the
            filters if you don&rsquo;t see who you&rsquo;re looking for.
          </p>
        ),
      },
    ],
  },
  {
    title: "Events",
    items: [
      {
        q: "Where can I see upcoming events?",
        a: (
          <p>
            All upcoming events are on the <Link to="/events">events page</Link>, where you can also
            download the 2026 calendar of events as a PDF. Each event page has an &ldquo;Add to
            calendar&rdquo; button.
          </p>
        ),
      },
      {
        q: "How do I register for an event?",
        a: (
          <p>
            Each event&rsquo;s page shows how to register. Registration for most AAK events is on
            the <Ext href={portalLinks.events}>members portal events page</Ext>.
          </p>
        ),
      },
    ],
  },
  {
    title: "Awards",
    items: [
      {
        q: "What are the Awards of Excellence?",
        a: (
          <p>
            The AAK&ndash;Basco DuraCoat Awards of Excellence in Architecture, hosted by the
            Architects Chapter, recognise outstanding architectural achievement across nine
            categories. The <Link to="/awards">awards page</Link> sets out the categories,
            evaluation criteria, jury and past winners.
          </p>
        ),
      },
    ],
  },
  {
    title: "Grow A Classroom",
    items: [
      {
        q: "How do I donate to Grow A Classroom?",
        a: (
          <p>
            Donate by {gacDonation.method}: Paybill <strong>{gacDonation.paybill}</strong>, account{" "}
            <strong>{gacDonation.account}</strong>. To partner with the programme, email{" "}
            <a href="mailto:advocacy@aak.or.ke">advocacy@aak.or.ke</a>. Read more on the{" "}
            <a href="https://schools.aak.or.ke/" target="_blank" rel="noopener noreferrer">
              Grow A Classroom website
            </a>
            .
          </p>
        ),
      },
    ],
  },
  {
    title: "Store",
    items: [
      {
        q: "How do I order from the AAK store?",
        a: (
          <p>
            Choose an item on the <Link to="/store">store page</Link> and call or message the
            secretariat on 0721 691 337, 020 242 0808 or 020 242 0586. Availability, the final price
            and payment are confirmed with you there.
          </p>
        ),
      },
    ],
  },
  {
    title: "Anything else",
    items: [
      {
        q: "How do I contact the secretariat?",
        a: (
          <p>
            Call or WhatsApp 0721 691 337, email <a href="mailto:aak@aak.or.ke">aak@aak.or.ke</a>,
            or visit Blue Violets Plaza, 6th Floor, Room 605, Kindaruma Rd, off Ngong Rd, Nairobi.
            All contact details are on the <Link to="/contact">contact page</Link>.
          </p>
        ),
      },
    ],
  },
];

export default function FaqsBody() {
  return (
    <>
      {groups.map((group) => (
        <section key={group.title} aria-labelledby={`faq-${group.title}`}>
          <h2 id={`faq-${group.title}`}>{group.title}</h2>
          <Accordion type="multiple" className="mt-4 border-t border-border">
            {group.items.map((item) => (
              <AccordionItem key={item.q} value={item.q} className="border-border">
                <AccordionTrigger className="py-5 text-left font-display text-lg font-semibold text-foreground hover:no-underline">
                  {item.q}
                </AccordionTrigger>
                <AccordionContent className="pb-5 text-base leading-relaxed text-muted-foreground">
                  {item.a}
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </section>
      ))}
    </>
  );
}
