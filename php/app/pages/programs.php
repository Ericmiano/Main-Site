<?php
/** AAK Programmes (src/routes/programs.tsx). */
$page['title'] = 'AAK Programmes | ' . SITE_NAME;
$page['description'] = 'The ongoing areas of public interest AAK participates in as a professional association: education, CPD, construction standards, cost control, planning and professional ethics.';
$trail = [['Programmes', null]];
$page['head'] = json_ld(['@context' => 'https://schema.org', '@graph' => [
    breadcrumb_ld($trail),
    ['@type' => 'AboutPage', 'name' => $page['title'], 'description' => $page['description'], 'url' => SITE_URL . '/programs', 'mainEntity' => ['@id' => SITE_URL . '/#organization']],
]]);
$programmes = [
    ['Education', 'AAK participates in drawing up training curricula at local universities and polytechnics. For architecture, the Association has solicited the support of the Commonwealth Association of Architects (CAA) to accredit our schools of architecture, giving degree courses international recognition.'],
    ['Continuous Professional Development', 'To keep pace with changing technologies, the Association conducts seminars and workshops through which members continually develop their professional skills. Kenya is one of the few countries in Africa that runs continuous professional development exercises.'],
    ['Building Construction Standards', 'AAK takes an interest and participates, as a public watchdog, in setting building construction standards through local authority by-laws, making periodic written submissions to local authorities for the adoption or amendment of construction standards.'],
    ['Construction Cost Control', 'In collaboration with the Kenya Association of Building and Civil Engineering Contractors (KABCEC), AAK established the Joint Building Council to periodically review and publish recommended prices for building material and labour. The two associations also publish the Standard Agreement and Conditions of Contract for Building Works.'],
    ['Town and County', 'AAK takes a particular interest in town and county matters, including the preparation of national, regional and local/town development plans.'],
    ['Professional Ethics', 'Members of AAK sit on the respective Boards of Registration for the different building professions, upholding professional ethics across the industry.'],
];
?>
<main>
  <?= page_intro($trail, 'Public interest', 'AAK programmes', '<p class="mt-5 text-base leading-relaxed text-muted-foreground">AAK is purely a social professional association with no legal executive mandate. Based on its objectives, however, the Association takes interest and participates in several issues of public concern.</p>', '', 'max-w-2xl') ?>

  <section aria-labelledby="programmes-title" class="py-16 lg:py-24">
    <div class="mx-auto max-w-[1400px] px-6 lg:px-12">
      <h2 id="programmes-title" class="sr-only">Areas of participation</h2>
      <?= info_cards($programmes) ?>
    </div>
  </section>

  <section aria-labelledby="programmes-initiatives-title" class="border-t border-border bg-muted/40 py-16 lg:py-24">
    <div class="mx-auto max-w-[1400px] px-6 lg:px-12">
      <?= section_heading('Featured', 'Key initiatives members are running now', ['id' => 'programmes-initiatives-title', 'description' => "These operational programmes are complemented by AAK's headline public-good initiatives."]) ?>
      <?= initiative_cards(data('site', 'initiatives')) ?>
    </div>
  </section>
</main>
