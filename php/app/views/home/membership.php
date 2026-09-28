<?php
/**
 * "Your AAK" (src/components/home/Membership.tsx) with the chapter and
 * membership picker (ChapterPicker.tsx). The picker's result panel is
 * filled by site.js from the JSON below; chips are aria-pressed buttons.
 */
$paths = [
    ['Become a member', 'Join the chapter that matches your discipline and access CPD, advocacy and professional networks.', 'https://members.aak.or.ke/register', 'Start application'],
    ['Validate a certificate', "Confirm that a practitioner's AAK membership certificate is genuine and current.", 'https://members.aak.or.ke/validate', 'Check a certificate'],
    ['Find a professional', 'Search the member directory for architects, surveyors, planners and engineers near you.', 'https://members.aak.or.ke/directory', 'Open the directory'],
];
// Only categories whose names say who they're for; "qualified" shows both.
$stages = [
    ['student', 'Student', ['Student']],
    ['graduate', 'Recent graduate', ['Graduate']],
    ['technician', 'Technician', ['Technician']],
    ['qualified', 'Qualified professional', ['Corporate', 'Licentiate']],
];
$chapters = data('site', 'chapters');
$chip = 'rounded-full border border-foreground/25 px-4 py-2 text-sm font-medium text-foreground transition-colors hover:border-foreground aria-pressed:border-foreground aria-pressed:bg-foreground aria-pressed:text-background';
$pickerData = [
    'chapters' => array_map(function ($c) {
        return ['slug' => $c['slug'], 'name' => $c['name'], 'tagline' => $c['tagline']];
    }, $chapters),
    'stages' => array_map(function ($s) {
        return ['id' => $s[0], 'categories' => $s[2]];
    }, $stages),
    'fees' => data('site', 'membershipFees'),
];
?>
<section id="membership" aria-labelledby="membership-title" class="bg-paper-earth py-24 text-foreground lg:py-32">
  <div class="mx-auto max-w-[1400px] px-6 lg:px-12">
    <div <?= reveal('max-w-3xl') ?>>
      <?= section_rule('07', 'Your AAK') ?>
      <h2 id="membership-title" class="type-section mt-8">Practise with the standing of a recognised professional body.</h2>
    </div>

    <div class="mt-16 border-t border-foreground/15 md:grid md:grid-cols-3">
      <?php foreach ($paths as $i => [$title, $body, $href, $cta]): ?>
        <div class="border-b border-foreground/15 py-10 md:border-r md:border-b-0 md:px-10 md:py-0 md:first:pl-0 md:last:border-r-0 md:last:pr-0 lg:px-14">
          <div <?= reveal('md:h-full md:py-10', $i * 80) ?>>
            <span class="font-display text-sm text-foreground/70"><?= str_pad((string) ($i + 1), 2, '0', STR_PAD_LEFT) ?></span>
            <h3 class="type-title mt-3"><?= e($title) ?></h3>
            <p class="mt-4 text-sm leading-relaxed text-foreground/70"><?= e($body) ?></p>
            <a href="<?= e($href) ?>" target="_blank" rel="noopener noreferrer" class="<?= $i === 0 ? 'group btn-primary mt-8' : 'group link-quiet mt-8' ?>"><?= e($cta) ?> <?= icon('ArrowRight') ?></a>
          </div>
        </div>
      <?php endforeach; ?>
    </div>

    <div data-picker class="mt-16 border-t border-foreground/15 pt-10">
      <p class="meta-label text-foreground/70">Find your fit</p>
      <h3 class="type-title mt-3 sm:text-3xl">Which chapter, and which membership?</h3>
      <div class="mt-8 grid gap-8 lg:grid-cols-[1.4fr_1fr] lg:gap-14">
        <div class="space-y-7">
          <fieldset>
            <legend class="text-sm font-semibold">1. Your discipline</legend>
            <div class="mt-3 flex flex-wrap gap-2">
              <?php foreach ($chapters as $c): ?>
                <button type="button" aria-pressed="false" data-picker-chapter="<?= e($c['slug']) ?>" class="<?= $chip ?>"><?= e($c['name']) ?></button>
              <?php endforeach; ?>
            </div>
          </fieldset>
          <fieldset>
            <legend class="text-sm font-semibold">2. Where you are in your career</legend>
            <div class="mt-3 flex flex-wrap gap-2">
              <?php foreach ($stages as [$id, $label]): ?>
                <button type="button" aria-pressed="false" data-picker-stage="<?= e($id) ?>" class="<?= $chip ?>"><?= e($label) ?></button>
              <?php endforeach; ?>
            </div>
          </fieldset>
        </div>

        <div aria-live="polite" class="flex min-h-56 flex-col bg-background p-6 text-foreground shadow-xl lg:p-8">
          <div data-picker-empty class="my-auto">
            <p class="font-display text-xl font-semibold">Pick your discipline and career stage.</p>
            <p class="mt-2 text-sm text-muted-foreground">We&rsquo;ll show the chapter to join and the fees for your membership category.</p>
          </div>
          <div data-picker-result hidden class="flex flex-1 flex-col">
            <p class="meta-label text-muted-foreground">Your route in</p>
            <p data-picker-name class="mt-3 font-display text-2xl font-semibold leading-snug"></p>
            <p data-picker-tagline class="mt-1 text-sm text-muted-foreground"></p>
            <dl data-picker-fees class="mt-5 space-y-2 border-t border-border pt-4 text-sm"></dl>
            <p data-picker-note hidden class="mt-3 text-xs text-muted-foreground">The membership page explains which of these applies to you.</p>
            <div class="mt-auto flex flex-wrap items-center gap-x-6 gap-y-3 pt-6">
              <a href="https://members.aak.or.ke/register" target="_blank" rel="noopener noreferrer" class="group btn-primary">Start application <?= icon('ArrowRight', 'h-4 w-4 transition-transform group-hover:translate-x-0.5') ?></a>
              <a href="/membership" class="link-quiet">Membership details</a>
            </div>
          </div>
        </div>
      </div>
      <script type="application/json" data-picker-data><?= json_encode($pickerData, JSON_HEX_TAG | JSON_UNESCAPED_UNICODE) ?></script>
    </div>
  </div>
</section>
