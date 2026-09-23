import { Reveal } from "@/components/site/Reveal";

export function Statement() {
  return (
    <section aria-label="AAK statement" className="bg-ink-deep py-32 lg:py-48">
      <div className="mx-auto max-w-[1400px] px-6 lg:px-12">
        <Reveal>
          <p className="max-w-4xl font-display text-4xl font-semibold leading-[1.08] tracking-tight text-balance text-background sm:text-6xl lg:text-7xl">
            We shape the places where life happens.
          </p>
        </Reveal>
      </div>
    </section>
  );
}
