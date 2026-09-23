import { CountUp } from "@/components/site/CountUp";
import { Reveal } from "@/components/site/Reveal";

const moments = [
  { k: 1967, v: "AAK is established", grouped: false },
  { k: 8, v: "Professional chapters", grouped: false },
  { k: 3, v: "Regional branches", grouped: false },
  { k: 59, v: "Years of excellence", grouped: false },
];

export function Origin() {
  return (
    <section id="origin" aria-labelledby="origin-title" className="bg-background py-28 lg:py-40">
      <div className="mx-auto max-w-[1400px] px-6 lg:px-12">
        <Reveal>
          <h2
            id="origin-title"
            className="max-w-3xl font-display text-4xl font-semibold leading-[1.02] tracking-tight text-balance text-foreground sm:text-6xl lg:text-[5rem]"
          >
            The people who shape Kenya.
          </h2>
        </Reveal>

        <Reveal delay={120} ruleDraw className="mt-14 border-t border-border lg:mt-20">
          <dl className="grid grid-cols-2 gap-x-6 gap-y-10 pt-10 sm:grid-cols-4 lg:pt-12">
            {moments.map((moment) => (
              <div key={moment.v}>
                <dt className="sr-only">{moment.v}</dt>
                <dd>
                  <CountUp
                    value={moment.k}
                    grouped={moment.grouped}
                    className="block font-display text-4xl font-semibold tabular-nums text-foreground sm:text-5xl"
                  />
                  <span className="meta-label mt-2 block text-muted-foreground">{moment.v}</span>
                </dd>
              </div>
            ))}
          </dl>
        </Reveal>
      </div>
    </section>
  );
}
