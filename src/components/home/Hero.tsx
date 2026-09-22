import { IconArrowRight as ArrowRight } from "@tabler/icons-react";
import heroImage from "@/assets/hero-architecture.jpg";
import { CountUp } from "@/components/site/CountUp";

export function Hero() {
  return (
    <section className="relative isolate flex min-h-[92vh] items-end overflow-hidden bg-ink-deep">
      <img
        src={heroImage}
        alt="Golden-hour view of a modern Nairobi building facade with a deep concrete grid"
        width={1920}
        height={1280}
        fetchPriority="high"
        className="absolute inset-0 h-full w-full object-cover opacity-80 hero-zoom"
      />
      <div
        className="absolute inset-0 bg-linear-to-t from-ink-deep via-ink-deep/65 to-ink-deep/25"
        aria-hidden="true"
      />

      <div className="relative mx-auto w-full max-w-[1400px] px-6 pb-20 pt-36 lg:px-12 lg:pb-28">
        <p className="hero-item flex items-center gap-2.5 text-xs font-semibold uppercase tracking-[0.24em] text-primary-foreground/70">
          <span aria-hidden="true" className="h-1.5 w-1.5 bg-primary" />
          Since 1967 &middot; Nairobi, Kenya
        </p>
        <h1 className="hero-item hero-delay-1 mt-6 max-w-4xl font-display text-4xl font-semibold leading-[0.96] tracking-tight text-balance text-primary-foreground sm:text-6xl lg:text-[5.25rem]">
          Shaping Kenya&rsquo;s built environment with{" "}
          <span className="font-accent italic font-medium text-primary">
            professional integrity
          </span>
          .
        </h1>
        <p className="hero-item hero-delay-2 mt-7 max-w-xl text-lg leading-relaxed text-primary-foreground/75">
          The Architectural Association of Kenya unites eight professional chapters advancing safe,
          sustainable and well-planned development across the country.
        </p>
        <div className="hero-item hero-delay-3 mt-10">
          <a
            href="#events"
            className="group inline-flex items-center gap-3 rounded-xl bg-primary px-7 py-4 text-sm font-semibold text-primary-foreground transition-transform duration-300 hover:-translate-y-0.5"
          >
            See what&rsquo;s happening now
            <ArrowRight className="h-4 w-4" />
          </a>
        </div>

        <dl className="hero-item hero-delay-4 mt-16 flex max-w-3xl flex-wrap gap-x-10 gap-y-6 border-t border-primary-foreground/15 pt-7">
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
                  className="font-display text-2xl font-semibold tabular-nums text-primary-foreground sm:text-3xl"
                />
                <span className="text-xs uppercase tracking-[0.14em] text-primary-foreground/55">
                  {stat.v}
                </span>
              </dd>
            </div>
          ))}
        </dl>
      </div>
    </section>
  );
}
