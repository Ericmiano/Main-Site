import { Reveal } from "@/components/site/Reveal";
import { featuredFirm } from "@/data/site";
import { cn } from "@/lib/utils";

export function FeaturedFirm() {
  const [lead, ...rest] = featuredFirm.projects;

  return (
    <section
      aria-labelledby="featured-firm-title"
      className="bg-ink-deep py-24 text-background lg:py-32"
    >
      <div className="mx-auto grid max-w-[1400px] gap-12 px-6 lg:grid-cols-[0.8fr_1.6fr] lg:gap-16 lg:px-12">
        <Reveal className="lg:self-center">
          <p className="meta-label flex items-center justify-between border-t border-background/15 pt-6 text-background/60">
            <span>Feature firm &middot; Showcase</span>
            <span className="text-[oklch(0.75_0.13_38.5)]">Member firm</span>
          </p>
          <h2 id="featured-firm-title" className="type-section mt-8">
            {featuredFirm.name}
          </h2>
          <p className="mt-5 max-w-md text-base leading-relaxed text-background/75">
            {featuredFirm.intro}
          </p>
          <figure className="mt-8 max-w-sm">
            <img
              src={featuredFirm.photo.src}
              alt={featuredFirm.photo.alt}
              loading="lazy"
              className="aspect-4/3 w-full object-cover object-top"
            />
            <figcaption className="meta-label mt-3 text-background/55">
              {featuredFirm.photo.caption}
            </figcaption>
          </figure>
        </Reveal>

        <ul className="grid gap-3 sm:grid-cols-2">
          {[lead, ...rest].map((project, i) =>
            project ? (
              <li key={project.name} className={cn(i === 0 && "sm:col-span-2")}>
                <Reveal wipe={i === 0} delay={i * 70} className="h-full">
                  <figure className="group relative h-full overflow-hidden bg-background/5">
                    <img
                      src={project.image}
                      alt={project.name}
                      loading="lazy"
                      className={cn(
                        "photo-grade w-full object-cover transition-transform duration-[1200ms] ease-out group-hover:scale-105",
                        i === 0 ? "aspect-video" : "aspect-4/3",
                      )}
                    />
                    <figcaption className="absolute inset-x-0 bottom-0 bg-linear-to-t from-ink-deep/85 to-transparent p-5 pt-16 text-background">
                      <p className="font-display text-xl font-semibold">{project.name}</p>
                      <p className="meta-label mt-2 text-background/75">
                        {project.facts.map((f) => f.value).join(" · ")}
                      </p>
                    </figcaption>
                  </figure>
                </Reveal>
              </li>
            ) : null,
          )}
        </ul>
      </div>
    </section>
  );
}
