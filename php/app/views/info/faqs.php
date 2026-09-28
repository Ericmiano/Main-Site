<?php
/** FAQs body (src/components/info/FaqsBody.tsx). Answers are trusted HTML. */
$portal = 'https://members.aak.or.ke';
$ext = function (string $href, string $label): string {
    return '<a href="' . e($href) . '" target="_blank" rel="noopener noreferrer">' . $label . '</a>';
};
$d = data('grow-a-classroom', 'gacDonation');
$groups = [
    ['Membership', [
        ['How do I become a member?', '<p>Apply online through the ' . $ext("$portal/application/registerv3", 'AAK members portal') . ', choosing the chapter that matches your discipline. The <a href="/membership">membership page</a> explains the steps, the membership tiers and their fees.</p>'],
        ['Which membership category is right for me?', '<p>Categories include Corporate, Licentiate, Graduate, Student, Technician, Firm, Visiting and Institutional membership. The <a href="/membership">membership page</a> lists each with its entrance and annual fees, and the &ldquo;Find your fit&rdquo; tool on the <a href="/#membership">homepage</a> suggests a starting point. If you&rsquo;re unsure, email <a href="mailto:aak@aak.or.ke">aak@aak.or.ke</a>.</p>'],
        ['How do I renew my membership?', '<p>Renew and pay your subscription on the ' . $ext("$portal/public/pay?for=MEMBERSHIP", 'members portal payment page') . '. Fees are listed on the <a href="/membership">membership page</a>.</p>'],
        ['I’m a student. Can I join?', '<p>Yes. Students join as student affiliates through the ' . $ext("$portal/application/registerv3", 'members portal') . '. See <a href="/students">student affiliates</a> for details.</p>'],
    ]],
    ['Certificates and the directory', [
        ['How can I check that a practitioner’s AAK certificate is genuine?', '<p>Use the ' . $ext("$portal/validate", 'certificate validation service') . ' on the members portal. Anyone can use it; you don&rsquo;t need to be a member.</p>'],
        ['How do I find a registered professional or firm?', '<p>Search the ' . $ext("$portal/directory", 'members directory') . ' by name, member number or chapter. It lists members in good standing, and has a separate directory of member firms. Results are limited to 50 per search, so narrow your search with the filters if you don&rsquo;t see who you&rsquo;re looking for.</p>'],
    ]],
    ['Events', [
        ['Where can I see upcoming events?', '<p>All upcoming events are on the <a href="/events">events page</a>, where you can also download the 2026 calendar of events as a PDF. Each event page has an &ldquo;Add to calendar&rdquo; button.</p>'],
        ['How do I register for an event?', '<p>Each event&rsquo;s page shows how to register. Registration for most AAK events is on the ' . $ext("$portal/publicevents", 'members portal events page') . '.</p>'],
    ]],
    ['Awards', [
        ['What are the Awards of Excellence?', '<p>The AAK&ndash;Basco DuraCoat Awards of Excellence in Architecture, hosted by the Architects Chapter, recognise outstanding architectural achievement across nine categories. The <a href="/awards">awards page</a> sets out the categories, evaluation criteria, jury and past winners.</p>'],
    ]],
    ['Grow A Classroom', [
        ['How do I donate to Grow A Classroom?', '<p>Donate by ' . e($d['method']) . ': Paybill <strong>' . e($d['paybill']) . '</strong>, account <strong>' . e($d['account']) . '</strong>. To partner with the programme, email <a href="mailto:advocacy@aak.or.ke">advocacy@aak.or.ke</a>. Read more on the ' . $ext('https://schools.aak.or.ke/', 'Grow A Classroom website') . '.</p>'],
    ]],
    ['Store', [
        ['How do I order from the AAK store?', '<p>Choose an item on the <a href="/store">store page</a> and use its WhatsApp link to message the secretariat on 0721 691 337. Availability, the final price and payment are confirmed with you there.</p>'],
    ]],
    ['Anything else', [
        ['How do I contact the secretariat?', '<p>Call or WhatsApp 0721 691 337, email <a href="mailto:aak@aak.or.ke">aak@aak.or.ke</a>, or visit Blue Violets Plaza, 6th Floor, Room 605, Kindaruma Rd, off Ngong Rd, Nairobi. All contact details are on the <a href="/contact">contact page</a>.</p>'],
    ]],
];
foreach ($groups as [$title, $items]): $id = 'faq-' . $title; ?>
<section aria-labelledby="<?= e($id) ?>">
  <h2 id="<?= e($id) ?>"><?= e($title) ?></h2>
  <div class="mt-4 border-t border-border">
    <?php foreach ($items as [$q, $a]): ?>
      <details class="group/faq border-b border-border">
        <summary class="flex cursor-pointer list-none items-center justify-between py-5 text-left font-display text-lg font-semibold text-foreground [&::-webkit-details-marker]:hidden">
          <?= e($q) ?>
          <?= icon('ChevronDown', 'h-4 w-4 shrink-0 text-current opacity-60 transition-transform duration-200 group-open/faq:rotate-180') ?>
        </summary>
        <div class="pb-5 text-base leading-relaxed text-muted-foreground"><?= $a ?></div>
      </details>
    <?php endforeach; ?>
  </div>
</section>
<?php endforeach;
