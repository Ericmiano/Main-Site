<?php
/** Membership (src/routes/membership.tsx). */
$page['title'] = 'Membership | ' . SITE_NAME;
$page['description'] = "How to join AAK, membership tiers and fees, and the benefits of belonging to Kenya's professional association for the built and natural environment.";
$trail = [['Membership', null]];
$page['head'] = json_ld(['@context' => 'https://schema.org', '@graph' => [breadcrumb_ld($trail)]]);

$steps = [
    ['Check requirements', 'Membership tiers accommodate students, technicians, graduates and registered professionals across all eight chapters. Confirm which tier fits your qualifications.'],
    ['Register', 'Create your application at the member portal, members.aak.or.ke/register, and submit your professional and academic details.'],
    ['Log in', 'Once approved, sign in at members.aak.or.ke/login to manage your subscription, CPD record and chapter activity.'],
    ['Validate', "Anyone can confirm a member's certificate is genuine and current at members.aak.or.ke/validate."],
];
$applicationProcess = [
    ['Complete the application', 'Complete the official application form and sign the declaration as required under By Law BL 4.0 of the AAK Constitution.'],
    ['Get proposed and seconded', 'All applicants must be proposed and seconded by corporate members of the chapter being applied for.'],
    ['Submit to the Secretariat', 'Submit the application to the Secretariat with the prescribed entrance fee and the first annual subscription.'],
    ['Chapter and Council approval', 'Approval is granted through the Chapter Chairman and confirmed by the Governing Council.'],
];
$electionCriteria = [
    'Election is determined by a majority vote of the Chapter Council.',
    'Rejections include a summary of reasons; re-application is permitted after twelve months.',
    'Successful candidates are entered into the Register of Association by the Honorary Registrar.',
    'Official Certificates of Membership are issued by the Governing Council.',
];
$benefits = [
    ['Users', 'Attend general meetings of the Association and of your Chapter or Branch.', null],
    ['CircleCheck', 'Participate in all Association, Chapter, Branch or Group activities and professional forums.', null],
    ['UsersGroup', 'Voting eligibility for corporate members at General Meetings and Governing Council sessions.', null],
    ['CashBanknote', 'AAK Sacco access.', 'https://sacco.aak.or.ke/'],
    ['ShieldCheck', 'Medical schemes.', null],
    ['News', 'CPD presentations and industry journals.', null],
    ['HeartHandshake', 'Benevolent funds.', null],
    ['ShieldCheck', 'Professional insurance.', null],
];

$stepCards = function (array $items): void { ?>
  <ol class="mt-14 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
    <?php foreach ($items as $i => [$title, $body]): ?>
      <li>
        <div <?= reveal('h-full', $i * 70) ?>>
          <div class="flex h-full flex-col rounded-2xl border border-border p-6">
            <span class="font-display text-3xl font-semibold tabular-nums text-primary"><?= str_pad((string) ($i + 1), 2, '0', STR_PAD_LEFT) ?></span>
            <h3 class="mt-4 font-display text-lg font-semibold leading-snug text-foreground"><?= e($title) ?></h3>
            <p class="mt-3 text-sm leading-relaxed text-muted-foreground"><?= e($body) ?></p>
          </div>
        </div>
      </li>
    <?php endforeach; ?>
  </ol>
<?php };
?>
<main>
  <section class="border-b border-border bg-secondary/40 py-14 lg:py-20">
    <div class="mx-auto max-w-[1400px] px-6 lg:px-12">
      <?= breadcrumb($trail) ?>
      <div <?= reveal('mt-8 max-w-2xl') ?>>
        <h1 class="mt-2 font-display text-4xl font-semibold leading-[1.02] tracking-tight text-balance text-foreground sm:text-5xl lg:text-6xl">Practise with the standing of a recognised professional body.</h1>
        <p class="mt-5 text-base leading-relaxed text-muted-foreground"><?= e($page['description']) ?></p>
        <a href="https://members.aak.or.ke/register" target="_blank" rel="noopener noreferrer" class="group btn-primary mt-8">Start your application <?= icon('ArrowUpRight') ?></a>
      </div>
    </div>
  </section>

  <?php $sticky = false; require APP_DIR . '/views/home/member-stats.php'; ?>

  <section aria-labelledby="join-steps-title" class="py-16 lg:py-24">
    <div class="mx-auto max-w-[1400px] px-6 lg:px-12">
      <?= section_heading('How to join', 'Four steps to membership', ['id' => 'join-steps-title']) ?>
      <?php $stepCards($steps); ?>
    </div>
  </section>

  <section aria-labelledby="fees-title" class="border-t border-border bg-secondary/40 py-16 lg:py-24">
    <div class="mx-auto max-w-[1400px] px-6 lg:px-12">
      <?= section_heading('Fees & subscriptions', 'Membership tiers', ['id' => 'fees-title', 'description' => 'All fees are quoted in Kenya Shillings (KES) and are subject to periodic review by the AAK Council.']) ?>
      <!-- Scrolls sideways on phones, so it must be reachable by keyboard. -->
      <div tabindex="0" role="region" aria-label="Membership fees table" class="mt-14 overflow-x-auto rounded-2xl border border-border bg-card focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary">
        <table class="w-full min-w-[480px] border-collapse text-left text-sm">
          <caption class="sr-only">AAK membership entrance and annual subscription fees</caption>
          <thead>
            <tr class="border-b border-border bg-secondary/60 text-[11px] uppercase tracking-[0.1em] text-muted-foreground">
              <th scope="col" class="px-6 py-4 font-semibold">Category</th>
              <th scope="col" class="px-6 py-4 font-semibold">Entrance fee (KES)</th>
              <th scope="col" class="px-6 py-4 font-semibold">Annual subscription (KES)</th>
            </tr>
          </thead>
          <tbody>
            <?php foreach (data('site', 'membershipFees') as $row): ?>
              <tr class="border-b border-border last:border-b-0">
                <td class="px-6 py-4 font-semibold text-foreground"><?= e($row['category']) ?></td>
                <td class="px-6 py-4 text-muted-foreground"><?= e($row['entrance']) ?></td>
                <td class="px-6 py-4 text-muted-foreground"><?= e($row['annual']) ?></td>
              </tr>
            <?php endforeach; ?>
          </tbody>
        </table>
      </div>
    </div>
  </section>

  <section aria-labelledby="benefits-title" class="py-16 lg:py-24">
    <div class="mx-auto max-w-[1400px] px-6 lg:px-12">
      <?= section_heading('Benefits', 'Membership Benefits', ['id' => 'benefits-title']) ?>
      <ul class="mt-14 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
        <?php foreach ($benefits as $i => [$iconName, $text, $href]): ?>
          <li>
            <div <?= reveal('h-full', ($i % 4) * 60) ?>>
              <?php if ($href): ?>
                <a href="<?= e($href) ?>" target="_blank" rel="noopener noreferrer" class="flex h-full flex-col gap-3 rounded-2xl bg-card p-6 transition-colors hover:bg-secondary">
                  <?= icon($iconName, 'h-5 w-5 text-primary') ?>
                  <p class="link-underline text-sm leading-relaxed text-foreground"><?= e($text) ?></p>
                </a>
              <?php else: ?>
                <div class="flex h-full flex-col gap-3 rounded-2xl bg-card p-6">
                  <?= icon($iconName, 'h-5 w-5 text-primary') ?>
                  <p class="text-sm leading-relaxed text-foreground"><?= e($text) ?></p>
                </div>
              <?php endif; ?>
            </div>
          </li>
        <?php endforeach; ?>
      </ul>
    </div>
  </section>

  <section aria-labelledby="application-process-title" class="border-t border-border bg-secondary/40 py-16 lg:py-24">
    <div class="mx-auto max-w-[1400px] px-6 lg:px-12">
      <?= section_heading('Registration pathway', 'Application process', ['id' => 'application-process-title']) ?>
      <?php $stepCards($applicationProcess); ?>
    </div>
  </section>

  <section aria-labelledby="election-criteria-title" class="py-16 lg:py-24">
    <div class="mx-auto max-w-[1400px] px-6 lg:px-12">
      <?= section_heading('Governance and validation', 'Election criteria', ['id' => 'election-criteria-title']) ?>
      <ul class="mt-14 grid grid-cols-1 gap-4 sm:grid-cols-2">
        <?php foreach ($electionCriteria as $i => $item): ?>
          <li>
            <div <?= reveal('h-full', $i * 70) ?>>
              <div class="flex h-full items-start gap-3 rounded-xl border border-border p-5">
                <span class="mt-1.5 h-1.5 w-1.5 shrink-0 bg-primary" aria-hidden="true"></span>
                <p class="text-sm leading-relaxed text-foreground"><?= e($item) ?></p>
              </div>
            </div>
          </li>
        <?php endforeach; ?>
      </ul>
    </div>
  </section>
</main>
