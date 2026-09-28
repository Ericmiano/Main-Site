<?php /** Nairobi Biennale exhibition plate (src/components/home/Biennale.tsx). */ ?>
<section aria-labelledby="biennale-title" class="bg-ink-deep pb-28 text-background lg:pb-40">
  <div class="mx-auto max-w-[1400px] px-6 pt-24 lg:px-12 lg:pt-32">
    <?= section_rule('03', 'Biennale', 'dark') ?>
  </div>

  <div data-parallax="40" class="relative isolate mt-10 flex min-h-[80svh] items-end overflow-hidden lg:mt-14 lg:min-h-[88vh]">
    <img src="/biennale/featured.webp" alt="Exhibitors and AAK members at the Nairobi Biennale of Architecture &amp; Art 2026" loading="lazy" width="1920" height="1280"
         data-parallax-target class="photo-grade absolute inset-0 -z-10 h-[115%] w-full object-cover will-change-transform" style="transform: translateY(-40px)">
    <div aria-hidden="true" class="absolute inset-0 -z-10 bg-linear-to-t from-ink-deep via-ink-deep/80 to-ink-deep/25"></div>
    <div aria-hidden="true" class="absolute inset-0 -z-10 bg-linear-to-r from-ink-deep/60 to-transparent"></div>

    <div class="mx-auto w-full max-w-[1400px] px-6 pb-12 lg:px-12 lg:pb-16">
      <div <?= reveal() ?>>
        <p class="meta-label text-background/85">7&ndash;12 September 2026 &middot; Nairobi</p>
        <h2 id="biennale-title" class="mt-5 max-w-5xl font-display text-5xl font-semibold leading-[0.95] tracking-tight text-balance sm:text-7xl lg:text-8xl">
          Nairobi Biennale of <span class="font-accent italic font-medium">Architecture</span> &amp; Art
        </h2>
      </div>
      <div class="mt-10 grid gap-6 border-t border-background/20 pt-6 sm:grid-cols-3">
        <?php foreach ([
            ['Theme', 'Shifting the Center: From Fragility to Resilience'],
            ['Venue', 'ASK Nairobi Showground, Jamhuri Park'],
            ['Edition', 'Nairobi&rsquo;s first Architecture Biennale'],
        ] as [$label, $value]): ?>
          <div>
            <p class="meta-label text-background/60"><?= $label ?></p>
            <p class="mt-2 font-display text-lg leading-snug"><?= $value ?></p>
          </div>
        <?php endforeach; ?>
      </div>
    </div>
  </div>

  <div class="mx-auto max-w-[1400px] px-6 pt-14 lg:px-12">
    <div <?= reveal('grid gap-8 lg:grid-cols-[1.2fr_1fr] lg:items-end') ?>>
      <p class="max-w-xl text-base leading-relaxed text-background/70">Exhibitions, conversations and public programming exploring Africa&rsquo;s built environment.</p>
      <div class="flex flex-wrap items-center gap-x-7 gap-y-4 lg:justify-end">
        <a href="https://www.biennale.aak.or.ke/" target="_blank" rel="noopener noreferrer" class="group btn-primary">Explore the Biennale <?= icon('ArrowRight') ?></a>
        <a href="/events/nairobi-biennale-2026" class="link-quiet text-background/85">Event details on AAK</a>
      </div>
    </div>
  </div>
</section>
