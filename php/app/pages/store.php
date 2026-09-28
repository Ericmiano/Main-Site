<?php
/** Store (src/routes/store.tsx). Orders go through WhatsApp. */
$page['title'] = 'Store | ' . SITE_NAME;
$page['description'] = 'AAK merchandise and industry documents: JBC contract books, certificates and the David Mutiso Bursary Fund. Order via WhatsApp.';
$trail = [['Store', null]];
$whatsapp = '254721691337';

/** Same encoding as JavaScript's encodeURIComponent. */
$encode = function (string $s): string {
    return strtr(rawurlencode($s), ['%21' => '!', '%2A' => '*', '%27' => "'", '%28' => '(', '%29' => ')']);
};
$items = [
    ['AAK Hats', 'Out of stock', 'Merchandise', '/img/aak-caps.webp'],
    ['Branded AAK Cups', 'Out of stock', 'Merchandise', '/img/branded-aak-cups.webp'],
    ['Certificate of Good Making', 'KES 2,320-4,060', 'Industry documents', '/img/certificate-of-good-making-1.webp'],
    ['Certificate of Practical Completion', 'KES 2,320-4,060', 'Industry documents', '/img/certificate-of-practical-completion.webp'],
    ['Interim Certificate', 'KES 2,320-4,060', 'Industry documents', '/img/aak-interim-certificate.webp'],
    ['JBC Contract Green Book', 'KES 4,060-5,800', 'Industry documents', '/img/joint-building-council-contract-book-green-book-e1551606319777.webp'],
    ['Standard Method of Measurement Book', 'KES 600-2,000', 'Industry documents', '/img/standard-method-of-measurement-smm.webp'],
    ['David Mutiso Bursary Fund', 'Donation', 'Fundraising', null, 'Donate via WhatsApp', "Hi, I'd like to donate to the David Mutiso Bursary Fund."],
];
?>
<main>
  <section class="border-b border-border bg-secondary/40 py-14 lg:py-20">
    <div class="mx-auto max-w-[1400px] px-6 lg:px-12">
      <?= breadcrumb($trail) ?>
      <div <?= reveal('mt-8 max-w-2xl') ?>>
        <h1 class="mt-2 font-display text-4xl font-semibold leading-[1.02] tracking-tight text-balance text-foreground sm:text-5xl lg:text-6xl">Store</h1>
        <p class="mt-5 text-base leading-relaxed text-muted-foreground">Branded merchandise, standard industry documents used across the profession, and the David Mutiso Bursary Fund. Orders are placed via WhatsApp; payment by M-Pesa, Visa, Mastercard, PayPal or Stripe.</p>
        <a href="https://wa.me/<?= $whatsapp ?>" target="_blank" rel="noopener noreferrer" class="group btn-primary mt-8"><?= icon('MessageCircle') ?> Order on WhatsApp</a>
      </div>
    </div>
  </section>

  <section aria-labelledby="store-items-title" class="py-16 lg:py-24">
    <div class="mx-auto max-w-[1400px] px-6 lg:px-12">
      <h2 id="store-items-title" class="sr-only">Items available</h2>
      <ul class="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
        <?php foreach ($items as $i => $item):
            [$name, $price, $category, $image] = $item;
            $label = $item[4] ?? 'Order via WhatsApp';
            $message = $item[5] ?? "Hi, I'd like to order: " . $name;
        ?>
          <li>
            <div <?= reveal('h-full', ($i % 3) * 60) ?>>
              <div class="flex h-full flex-col overflow-hidden rounded-2xl border border-border">
                <?php if ($image): ?>
                  <div class="aspect-square overflow-hidden bg-secondary">
                    <img src="<?= e($image) ?>" alt="<?= e($name) ?>" loading="lazy" class="h-full w-full object-contain p-6">
                  </div>
                <?php endif; ?>
                <div class="flex flex-1 flex-col justify-between p-6">
                  <div>
                    <span class="meta-label text-muted-foreground"><?= e($category) ?></span>
                    <h3 class="mt-3 font-display text-base font-semibold leading-snug text-foreground"><?= e($name) ?></h3>
                  </div>
                  <div>
                    <p class="mt-4 text-sm text-muted-foreground"><?= e($price) ?></p>
                    <?php if ($price !== 'Out of stock'): ?>
                      <a href="https://wa.me/<?= $whatsapp ?>?text=<?= e($encode($message)) ?>" target="_blank" rel="noopener noreferrer" class="link-quiet mt-4 text-foreground"><?= icon('MessageCircle') ?><?= e($label) ?></a>
                    <?php endif; ?>
                  </div>
                </div>
              </div>
            </div>
          </li>
        <?php endforeach; ?>
      </ul>
    </div>
  </section>
</main>
