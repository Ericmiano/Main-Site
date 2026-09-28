<?php
/** Contact Us (src/routes/contact.tsx). */
$page['title'] = 'Contact Us | ' . SITE_NAME;
$page['description'] = 'Reach the AAK secretariat at Blue Violets Plaza, Nairobi: phone, WhatsApp and email for members, the press and the public.';
$trail = [['Contact Us', null]];
$page['head'] = json_ld(['@context' => 'https://schema.org', '@graph' => [
    breadcrumb_ld($trail),
    ['@type' => 'ContactPage', 'name' => $page['title'], 'about' => ['@id' => SITE_URL . '/#organization']],
]]);
$mapSrc = 'https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3988.7954780058567!2d36.790491314254716!3d-1.2974023990537153!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x182f109787542ce1%3A0x1fff8b8ca80946c!2sBlue+Violet+Plaza%2C+Kamburu+Dr%2C+Nairobi!5e0!3m2!1sen!2ske!4v1549692093091';
$card = 'flex h-full flex-col gap-3 rounded-2xl border border-border p-7';
?>
<main>
  <section class="border-b border-border bg-secondary/40 py-14 lg:py-20">
    <div class="mx-auto max-w-[1400px] px-6 lg:px-12">
      <?= breadcrumb($trail) ?>
      <div <?= reveal('mt-8 max-w-2xl') ?>>
        <h1 class="mt-2 font-display text-4xl font-semibold leading-[1.02] tracking-tight text-balance text-foreground sm:text-5xl lg:text-6xl">Get in touch</h1>
        <p class="mt-5 text-base leading-relaxed text-muted-foreground">The secretariat handles membership, advocacy and general enquiries. Mon-Fri, during business hours.</p>
      </div>
    </div>
  </section>

  <section class="py-16 lg:py-24">
    <div class="mx-auto grid max-w-[1400px] gap-6 px-6 sm:grid-cols-2 lg:grid-cols-4 lg:px-12">
      <div <?= reveal('h-full') ?>>
        <div class="<?= $card ?>">
          <?= icon('MapPin', 'h-5 w-5 text-primary') ?>
          <h2 class="font-display text-base font-semibold text-foreground">Office</h2>
          <p class="text-sm leading-relaxed text-muted-foreground">Blue Violets Plaza, 6th Floor, Room 605<br>Kindaruma Rd, Off Ngong Rd<br>P.O. Box 44258-00100, Nairobi, Kenya</p>
        </div>
      </div>
      <div <?= reveal('h-full', 60) ?>>
        <div class="<?= $card ?>">
          <?= icon('Phone', 'h-5 w-5 text-primary') ?>
          <h2 class="font-display text-base font-semibold text-foreground">Call &amp; WhatsApp</h2>
          <ul class="space-y-1 text-sm text-muted-foreground">
            <li><a class="link-underline" href="tel:+254721691337">0721 691 337</a></li>
            <li><a class="link-underline" href="tel:+254202420808">020 242 0808</a></li>
            <li><a class="link-underline" href="tel:+254202420586">020 242 0586</a></li>
          </ul>
          <a href="https://wa.me/254721691337" target="_blank" rel="noopener noreferrer" class="mt-auto inline-flex items-center gap-2 pt-2 text-sm font-semibold text-foreground transition-colors hover:text-primary">Chat on WhatsApp <?= icon('ArrowUpRight', 'h-4 w-4 text-primary') ?></a>
        </div>
      </div>
      <div <?= reveal('h-full', 120) ?>>
        <div class="<?= $card ?>">
          <?= icon('Mail', 'h-5 w-5 text-primary') ?>
          <h2 class="font-display text-base font-semibold text-foreground">Email</h2>
          <ul class="space-y-1 text-sm text-muted-foreground">
            <li><a class="link-underline" href="mailto:aak@aak.or.ke">aak@aak.or.ke</a> (general)</li>
            <li><a class="link-underline" href="mailto:advocacy@aak.or.ke">advocacy@aak.or.ke</a> (advocacy &amp; Mulika Mjengo)</li>
          </ul>
        </div>
      </div>
      <div <?= reveal('h-full', 180) ?>>
        <div class="<?= $card ?>">
          <?= icon('Clock', 'h-5 w-5 text-primary') ?>
          <h2 class="font-display text-base font-semibold text-foreground">Hours</h2>
          <p class="text-sm leading-relaxed text-muted-foreground">Monday-Friday<br>8:00 am-5:00 pm</p>
        </div>
      </div>
    </div>

    <div <?= reveal('mt-6', 220) ?>>
      <div class="mx-auto flex max-w-[1400px] flex-col items-start gap-4 rounded-2xl bg-secondary/40 px-6 py-7 sm:flex-row sm:items-center sm:justify-between lg:px-12">
        <div class="flex items-center gap-3">
          <?= icon('MessageCircle', 'h-5 w-5 text-primary') ?>
          <p class="text-sm text-foreground">Report an unsafe building via Mulika Mjengo, or reach the secretariat directly.</p>
        </div>
        <div class="flex flex-wrap gap-3">
          <a href="/initiatives/mulika-mjengo" class="group btn-primary">Mulika Mjengo</a>
          <a href="mailto:aak@aak.or.ke" class="link-quiet text-foreground">Email the secretariat</a>
        </div>
      </div>
    </div>
  </section>

  <section aria-labelledby="map-title" class="border-t border-border bg-secondary/40 py-16 lg:py-20">
    <div class="mx-auto grid max-w-[1400px] gap-8 px-6 lg:grid-cols-[0.7fr_1.6fr] lg:items-center lg:px-12">
      <div>
        <h2 id="map-title" class="font-display text-2xl font-semibold tracking-tight text-foreground">Find the secretariat</h2>
        <p class="mt-3 text-sm leading-relaxed text-muted-foreground">Blue Violets Plaza, 6th Floor, Room 605, Kindaruma Rd, off Ngong Rd, Nairobi.</p>
        <a href="https://www.google.com/maps/search/?api=1&amp;query=Blue+Violet+Plaza+Kindaruma+Road+Nairobi" target="_blank" rel="noopener noreferrer" class="mt-5 inline-flex items-center gap-2 text-sm font-semibold text-foreground transition-colors hover:text-primary">Get directions <?= icon('ArrowUpRight', 'h-4 w-4 text-primary') ?></a>
      </div>
      <div class="aspect-4/3 overflow-hidden rounded-2xl border border-border bg-secondary sm:aspect-video">
        <!-- Loads Google Maps (and its cookies) only when the visitor asks. -->
        <div data-map="<?= e($mapSrc) ?>" data-map-title="Map showing Blue Violet Plaza, Nairobi" class="flex h-full flex-col items-center justify-center gap-4 p-6 text-center">
          <?= icon('MapPin', 'h-8 w-8 text-foreground/60') ?>
          <button type="button" data-map-load class="btn-primary">Show map</button>
          <p class="max-w-xs text-xs leading-relaxed text-foreground/75">The map loads from Google Maps, which may set cookies. See our <a href="/cookies" class="underline underline-offset-2">cookie notice</a>.</p>
        </div>
      </div>
    </div>
  </section>
</main>
