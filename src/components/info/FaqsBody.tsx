import { useEffect, useState } from "react";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { faqGroups } from "@/components/info/faq-data";
import { slugify } from "@/lib/node-text";

export default function FaqsBody() {
  // A question linked to directly (/faqs#<slug>, e.g. from site search) opens.
  const [open, setOpen] = useState<string[]>([]);
  useEffect(() => {
    const openFromHash = () => {
      const id = decodeURIComponent(window.location.hash.slice(1));
      if (!id || !faqGroups.some((g) => g.items.some((item) => slugify(item.q) === id))) return;
      setOpen((current) => (current.includes(id) ? current : [...current, id]));
      requestAnimationFrame(() => document.getElementById(id)?.scrollIntoView({ block: "center" }));
    };
    openFromHash();
    window.addEventListener("hashchange", openFromHash);
    return () => window.removeEventListener("hashchange", openFromHash);
  }, []);

  return (
    <>
      {faqGroups.map((group) => (
        <section key={group.title} aria-labelledby={`faq-${group.title}`}>
          <h2 id={`faq-${group.title}`}>{group.title}</h2>
          <Accordion
            type="multiple"
            value={open}
            onValueChange={setOpen}
            className="mt-4 border-t border-border"
          >
            {group.items.map((item) => (
              <AccordionItem
                key={item.q}
                id={slugify(item.q)}
                value={slugify(item.q)}
                className="scroll-mt-28 border-border"
              >
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
