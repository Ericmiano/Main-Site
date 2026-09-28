<?php
/** About Us (src/routes/about.tsx). */
$page['title'] = 'About Us | ' . SITE_NAME;
$page['description'] = "Established in 1967, AAK is Kenya's leading association for professionals in the built and natural environment: eight chapters, three regional branches, registered under the Societies Act.";
$trail = [['About Us', null]];
$page['head'] = json_ld(['@context' => 'https://schema.org', '@graph' => [
    breadcrumb_ld($trail),
    ['@type' => 'AboutPage', 'name' => $page['title'], 'description' => $page['description'], 'url' => SITE_URL . '/about', 'mainEntity' => ['@id' => SITE_URL . '/#organization']],
]]);

$objectives = [
    ['Policy & Standards', 'Co-ordinate the activities of professionals concerned with the built and natural environment in Kenya, promoting integrity and directing members in all matters of professional practice.'],
    ['Education', 'Advance the science and art of planning and building by developing standards of professional education, training and practice, and facilitate matters of mutual interest.'],
    ['Public Interest', 'Create public awareness by marketing the services of member professions and providing professional opinions on matters pertaining to violation of statutes.'],
    ['Development', 'Establish and accredit Continuing Professional Development programmes and encourage collaboration of professionals and societies in the built and natural environment.'],
    ['Advocacy', 'Liaise with Government and regulatory agencies on matters affecting registration and licensing of professionals in the built and natural environment.'],
    ['Conservation', 'Maintain and protect the heritage of the built and natural environment through research and dissemination of information.'],
    ['Community', 'Offer community services by participating in the enhancement of the built and natural environment, maintaining building information services, and monitoring quality assurance on materials.'],
    ['Cooperation', 'Foster national, regional and international co-operation in matters dealing with the professions related to the built and natural environment.'],
    ['Publications', 'Publish documents and publications for the benefit of members and the general public in matters of the built and natural environment, and create revenue-generating activities.'],
];
$coreValues = ['Professionalism', 'Integrity', 'Transparency', 'Accountability', 'Innovation'];
$stats = [[1967, 'Registered since'], [8, 'Professional chapters'], [3, 'Regional branches'], [59, 'Years of excellence']];
?>
<main>
  <section class="border-b border-border bg-secondary/40 py-14 lg:py-20">
    <div class="mx-auto max-w-[1400px] px-6 lg:px-12">
      <?= breadcrumb($trail) ?>
      <div <?= reveal('mt-8 max-w-3xl') ?>>
        <div class="meta-label flex items-center gap-3 border-t border-border pt-5 text-muted-foreground"><span>Who we are</span></div>
        <h1 class="mt-5 font-display text-4xl font-semibold leading-[1.02] tracking-tight text-balance text-foreground sm:text-5xl lg:text-6xl">Promoting excellence in the built environment.</h1>
        <p class="mt-5 text-base leading-relaxed text-muted-foreground">Established in 1967, the Architectural Association of Kenya (AAK) is Kenya&rsquo;s leading association for professionals in the built and natural environment, incorporating Architects, Quantity Surveyors, Town Planners, Engineers, Landscape Architects, Environmental Design Consultants, Construction Project Managers and Interior Designers.</p>
        <p class="mt-4 text-base leading-relaxed text-muted-foreground">The Association is registered under the Societies Act and brings together professionals from the private sector, public sector and academia, acting as a link between professionals and stakeholders including policymakers, manufacturers, real estate developers and financial institutions.</p>
      </div>
      <div <?= reveal('mt-12 grid grid-cols-2 gap-6 sm:grid-cols-4', 100) ?>>
        <?php foreach ($stats as [$k, $v]): ?>
          <div>
            <span data-countup="<?= $k ?>"<?= $k !== 1967 ? ' data-grouped' : '' ?> class="block font-display text-3xl font-semibold tabular-nums text-foreground"><?= $k ?></span>
            <span class="mt-1 block text-xs uppercase tracking-[0.14em] text-muted-foreground"><?= e($v) ?></span>
          </div>
        <?php endforeach; ?>
      </div>
    </div>
  </section>

  <section aria-labelledby="mission-title" class="border-t border-border py-16 lg:py-24">
    <div class="mx-auto max-w-[1400px] px-6 lg:px-12">
      <h2 id="mission-title" class="sr-only">Mission, vision and core values</h2>
      <div class="grid gap-12 lg:grid-cols-2 lg:gap-20">
        <div <?= reveal() ?>>
          <span class="meta-label text-muted-foreground">Our Mission</span>
          <p class="mt-4 font-display text-2xl font-semibold leading-snug tracking-tight text-foreground">To promote professionalism and integrity in the built and natural environment, ensuring that every member adheres to the highest global standards of practice and ethics.</p>
        </div>
        <div <?= reveal('', 80) ?>>
          <span class="meta-label text-muted-foreground">Our Vision</span>
          <p class="mt-4 font-display text-2xl font-semibold leading-snug tracking-tight text-foreground">To be the leading professional organization in the built and natural environment in the region, driving innovation and sustainable development for future generations.</p>
        </div>
      </div>
      <div <?= reveal('mt-14 border-t border-border pt-10', 160) ?>>
        <span class="meta-label text-muted-foreground">Our Core Values</span>
        <ul class="mt-4 flex flex-wrap gap-x-10 gap-y-2">
          <?php foreach ($coreValues as $value): ?><li class="font-display text-lg font-semibold text-foreground"><?= e($value) ?></li><?php endforeach; ?>
        </ul>
      </div>
    </div>
  </section>

  <section aria-labelledby="objectives-title" class="border-t border-border bg-secondary/40 py-16 lg:py-24">
    <div class="mx-auto max-w-[1400px] px-6 lg:px-12">
      <?= section_heading('Our objectives', 'Defining our commitment to professional excellence', ['id' => 'objectives-title']) ?>
      <ul class="mt-14 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
        <?php foreach ($objectives as $i => [$title, $body]): ?>
          <li>
            <div <?= reveal('h-full rounded-2xl bg-card p-7', $i * 60) ?>>
              <h3 class="font-display text-lg font-semibold text-foreground"><?= e($title) ?></h3>
              <p class="mt-3 text-sm leading-relaxed text-muted-foreground"><?= e($body) ?></p>
            </div>
          </li>
        <?php endforeach; ?>
      </ul>
    </div>
  </section>

  <section aria-labelledby="structure-title" class="py-16 lg:py-24">
    <div class="mx-auto max-w-[1400px] px-6 lg:px-12">
      <?= section_heading('Structure', 'Eight chapters, three regional branches', [
          'id' => 'structure-title',
          'description' => 'Every practising discipline in the built and natural environment has a home chapter; three branches extend that structure along the coast, the west and the south rift.',
      ]) ?>
      <div class="mt-14 grid gap-10 lg:grid-cols-[1.3fr_1fr]">
        <ul class="grid grid-cols-2 gap-3 sm:grid-cols-4">
          <?php foreach (data('site', 'chapters') as $i => $chapter): ?>
            <li>
              <div <?= reveal('', $i * 50) ?>>
                <a href="/chapters/<?= e($chapter['slug']) ?>" class="block rounded-xl border border-border px-4 py-4 text-sm font-medium text-foreground transition-colors hover:border-primary/60"><?= e($chapter['name']) ?></a>
              </div>
            </li>
          <?php endforeach; ?>
        </ul>
        <div class="rounded-2xl bg-secondary/60 p-7">
          <h3 class="font-display text-lg font-semibold text-foreground">Regional branches</h3>
          <ul class="mt-4 space-y-3 text-sm text-foreground/70">
            <?php foreach (data('site', 'regionalBranches') as $branch): ?>
              <li class="flex items-center justify-between gap-3"><span><?= e($branch['chapter']) ?></span></li>
            <?php endforeach; ?>
          </ul>
          <a href="/team" class="group mt-6 inline-flex items-center gap-2 text-sm font-semibold text-foreground">Meet the leadership <?= icon('ArrowUpRight', 'h-4 w-4 text-primary') ?></a>
        </div>
      </div>
      <p class="mt-10 max-w-2xl text-sm leading-relaxed text-muted-foreground"><span class="font-semibold text-foreground">Secretariat.</span> The AAK Secretariat manages the day-to-day operations of the Association and serves as the primary point of contact for members and stakeholders.</p>
    </div>
  </section>

  <section class="border-t border-border py-16 text-center lg:py-20">
    <div class="mx-auto max-w-xl px-6 lg:px-12">
      <h2 class="font-display text-2xl font-semibold tracking-tight text-foreground">Join the association</h2>
      <p class="mt-3 text-sm leading-relaxed text-muted-foreground">Membership gives you standing, CPD access and a voice across all eight chapters.</p>
      <a href="https://members.aak.or.ke/application/registerv3/" target="_blank" rel="noopener noreferrer" class="group btn-primary mt-7">Start your application <?= icon('ArrowUpRight') ?></a>
    </div>
  </section>
</main>
