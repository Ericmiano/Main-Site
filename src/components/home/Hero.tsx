import heroImage from "@/assets/hero-architecture.jpg";

export function Hero() {
  return (
    <section className="relative isolate flex min-h-[100vh] items-start overflow-hidden bg-ink-deep">
      <img
        src={heroImage}
        alt="Golden-hour view of a modern Nairobi building facade with a deep concrete grid"
        width={1920}
        height={1280}
        fetchPriority="high"
        className="absolute inset-0 h-full w-full object-cover hero-zoom"
      />
      {/* Bottom-anchored scrim only — most of the frame stays at full vibrance,
          contrast is concentrated where the scroll cue sits. */}
      <div
        className="absolute inset-0 bg-linear-to-t from-ink-deep/85 via-ink-deep/15 to-transparent"
        aria-hidden="true"
      />
      <div
        className="absolute inset-x-0 top-0 h-1/2 bg-linear-to-b from-ink-deep/55 to-transparent"
        aria-hidden="true"
      />

      <div className="relative mx-auto w-full max-w-[1400px] px-6 pt-20 lg:px-12 lg:pt-24">
        <p className="hero-item meta-label text-background/70">AAK</p>
        <h1 className="hero-item hero-delay-1 mt-5 max-w-4xl font-display text-5xl font-semibold leading-[0.94] tracking-tight text-balance text-background sm:text-7xl lg:text-[6rem]">
          The Architectural Association of Kenya
        </h1>
        <p className="hero-item hero-delay-2 meta-label mt-7 text-background/70">
          Est. 1967 &middot; Nairobi, Kenya
        </p>
      </div>

      <a
        href="#origin"
        className="hero-item hero-delay-3 group absolute bottom-10 left-1/2 z-10 flex -translate-x-1/2 items-center gap-2.5 text-background/80 transition-colors hover:text-background"
      >
        <span className="meta-label">Scroll to explore</span>
        <span
          aria-hidden="true"
          className="text-base transition-transform group-hover:translate-y-0.5"
        >
          &darr;
        </span>
      </a>
    </section>
  );
}
