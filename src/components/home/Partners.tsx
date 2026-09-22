import { partners } from "@/data/site";

export function Partners() {
  const track = [...partners, ...partners];

  return (
    <section
      aria-labelledby="partners-title"
      className="border-y border-border bg-secondary/40 py-14"
    >
      <div className="mx-auto max-w-[1400px] px-6 lg:px-12">
        <p
          id="partners-title"
          className="text-center text-xs font-medium uppercase tracking-[0.22em] text-muted-foreground"
        >
          Working alongside
        </p>
      </div>

      <div className="group relative mt-8 overflow-hidden [mask-image:linear-gradient(to_right,transparent,black_10%,black_90%,transparent)]">
        <ul className="marquee flex w-max items-center gap-16">
          {track.map((partner, i) => (
            <li
              key={`${partner.abbreviation}-${i}`}
              className="flex shrink-0 items-center gap-2.5 text-muted-foreground"
              aria-hidden={i >= partners.length ? "true" : undefined}
            >
              <span className="font-display text-lg font-bold tracking-tight text-foreground/70">
                {partner.abbreviation}
              </span>
              <span className="hidden text-sm sm:inline">{partner.name}</span>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
