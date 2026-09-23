import { IconArrowRight as ArrowRight } from "@tabler/icons-react";
import heroImage from "@/assets/hero-architecture.jpg";
import { CountUp } from "@/components/site/CountUp";

export function Hero() {
  return (
    <section className="relative isolate flex min-h-[92vh] items-start overflow-hidden bg-background">
      <img
        src={heroImage}
        alt="Golden-hour view of a modern Nairobi building facade with a deep concrete grid"
        width={1920}
        height={1280}
        fetchPriority="high"
        className="absolute inset-0 h-full w-full object-cover hero-zoom"
      />

      <div className="relative mx-auto w-full max-w-[1400px] px-6 pt-14 pb-20 lg:px-12 lg:pt-16">
        <div className="hero-item max-w-2xl rounded-2xl bg-background/92 p-7 shadow-2xl backdrop-blur-md sm:p-9 lg:max-w-3xl lg:p-11">
          <p className="flex items-center gap-2.5 text-xs font-semibold uppercase tracking-[0.24em] text-foreground/60">
            <span aria-hidden="true" className="h-1.5 w-1.5 bg-primary" />
            Since 1967 &middot; Nairobi, Kenya
          </p>
          <h1 className="mt-6 font-display text-4xl font-semibold leading-[0.96] tracking-tight text-balance text-foreground sm:text-5xl lg:text-[4.25rem]">
            Promoting excellence in the{" "}
            <span className="font-accent italic font-medium text-primary">built environment</span>.
          </h1>
          <p className="mt-6 max-w-xl text-lg leading-relaxed text-muted-foreground">
            The Architectural Association of Kenya unites eight professional chapters advancing
            safe, sustainable and well-planned development across the country.
          </p>
          <div className="mt-9">
            <a
              href="#events"
              className="group inline-flex items-center gap-3 rounded-xl bg-primary px-7 py-4 text-sm font-semibold text-primary-foreground transition-transform duration-300 hover:-translate-y-0.5"
            >
              See what&rsquo;s happening now
              <ArrowRight className="h-4 w-4" />
            </a>
          </div>

          <dl className="mt-10 flex flex-wrap gap-x-10 gap-y-6 border-t border-border pt-7">
            {[
              { k: 1967, v: "Founded" },
              { k: 8, v: "Professional chapters" },
              { k: 3, v: "Regional branches" },
              { k: 59, v: "Years of excellence" },
            ].map((stat) => (
              <div key={stat.v} className="flex items-baseline gap-2.5">
                <dt className="sr-only">{stat.v}</dt>
                <dd className="flex items-baseline gap-2.5">
                  <CountUp
                    value={stat.k}
                    grouped={stat.k !== 1967}
                    className="font-display text-2xl font-semibold tabular-nums text-foreground sm:text-3xl"
                  />
                  <span className="text-xs uppercase tracking-[0.14em] text-muted-foreground">
                    {stat.v}
                  </span>
                </dd>
              </div>
            ))}
          </dl>
        </div>
      </div>
    </section>
  );
}
