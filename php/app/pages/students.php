<?php
/** Student affiliates (src/routes/students.tsx). */
$page['title'] = 'Student Affiliates | ' . SITE_NAME;
$page['description'] = 'AAK supports student organisations across the architectural industry: the Architecture Students Association, CRESA and PLASA.';
$trail = [['Student Affiliates', null]];
$affiliates = [
    ['ASA', 'Architecture Students Association', "Represents students in architecture programmes, connecting them to AAK's Architects Chapter and its professional network from the start of their studies."],
    ['CRESA', 'Construction & Real Estate Students Association', 'Nurtures and exposes students of real estate and construction management (RECM) to their profession and the construction industry through internships, career talks, industrial visits, social welfare activities and community development.'],
    ['PLASA', 'Planning Students Association', "Represents students in planning programmes, linking them to AAK's Town Planners Chapter and the wider profession."],
];
?>
<main>
  <?= page_intro($trail, 'For students', 'Student affiliates', '<p class="mt-5 text-base leading-relaxed text-muted-foreground">AAK supports student organisations for those studying elements of the architectural industry, recognising three affiliates.</p>', 'School', 'max-w-2xl') ?>

  <section aria-labelledby="affiliates-title" class="py-16 lg:py-24">
    <div class="mx-auto max-w-[1400px] px-6 lg:px-12">
      <h2 id="affiliates-title" class="sr-only">Student affiliate organisations</h2>
      <ul class="grid grid-cols-1 gap-6 lg:grid-cols-3">
        <?php foreach ($affiliates as $i => [$abbr, $name, $body]): ?>
          <li>
            <div <?= reveal('h-full', $i * 80) ?>>
              <div class="flex h-full flex-col rounded-2xl border border-border p-7">
                <span class="font-display text-3xl font-semibold tracking-tight text-primary"><?= e($abbr) ?></span>
                <h3 class="mt-4 font-display text-lg font-semibold leading-snug text-foreground"><?= e($name) ?></h3>
                <p class="mt-3 text-sm leading-relaxed text-muted-foreground"><?= e($body) ?></p>
              </div>
            </div>
          </li>
        <?php endforeach; ?>
      </ul>
    </div>
  </section>

  <section class="border-t border-border py-16 text-center lg:py-20">
    <div class="mx-auto max-w-xl px-6 lg:px-12">
      <h2 class="font-display text-2xl font-semibold tracking-tight text-foreground">Ready to join?</h2>
      <p class="mt-3 text-sm leading-relaxed text-muted-foreground">Student membership carries a reduced subscription. See the fees table for the current rate.</p>
      <a href="/membership" class="group btn-primary mt-7">View membership &amp; fees <?= icon('ArrowUpRight') ?></a>
    </div>
  </section>
</main>
