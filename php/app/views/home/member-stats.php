<?php
/**
 * Member register strip (src/components/site/MemberStats.tsx), sticky under
 * the header from md up. Reads the host's editable snapshot file
 * (/api/member-register-snapshot.json) at request time, so updating that
 * file updates the strip; falls back to the exported snapshot.
 * $sticky may be set by the including template (default true on home).
 */
$sticky = $sticky ?? true;
$stats = null;
$snapshotFile = PUBLIC_DIR . '/api/member-register-snapshot.json';
if (is_file($snapshotFile)) {
    $stats = json_decode((string) file_get_contents($snapshotFile), true);
}
if (!is_array($stats) || !isset($stats['totals']['members'])) {
    $stats = data('member-register-snapshot', 'registerSnapshot');
}
if (is_array($stats) && isset($stats['totals']['members'])):
    $items = [
        ['Registered members', $stats['totals']['members'], 'Users'],
        ['In good standing', $stats['totals']['inGoodStanding'], 'UserCheck'],
    ];
    foreach ($stats['byCategory'] ?? [] as $c) {
        $items[] = [ucfirst($c['category']) . ' members', $c['members'], preg_match('/corporate|firm/i', $c['category']) ? 'BuildingSkyscraper' : 'User'];
    }
    if (empty($stats['byCategory']) && isset($stats['totals']['firms'])) {
        $items[] = ['Member firms', $stats['totals']['firms'], 'BuildingSkyscraper'];
    }
    $updated = str_replace(' Sep ', ' Sept ', format_date(substr($stats['updatedAt'], 0, 10), 'j M Y'));
?>
<section id="register-strip" aria-label="Member register"<?= $sticky ? ' data-register-sticky' : '' ?> class="<?= e(cx('border-b border-border bg-background', $sticky ? 'z-40 md:sticky md:top-[var(--header-h,0px)]' : '')) ?>">
  <div class="mx-auto flex max-w-[1400px] flex-col gap-2 px-6 py-3 md:flex-row md:items-center md:gap-8 lg:px-12">
    <p class="meta-label flex shrink-0 items-center gap-2 text-[0.6875rem] text-foreground/70 md:flex-col md:items-start md:gap-0.5">
      <span class="flex items-center gap-2">Member register</span>
      <span class="font-normal normal-case tracking-normal text-muted-foreground"><span aria-hidden="true" class="md:hidden">&middot; </span>As of <?= e($updated) ?></span>
    </p>
    <ul class="<?= e(cx('grid flex-1 gap-x-3 md:divide-x md:divide-border', count($items) > 3 ? 'grid-cols-4' : 'grid-cols-3')) ?>">
      <?php foreach ($items as [$label, $value, $iconName]): ?>
        <li class="flex items-center gap-3 md:px-5 md:first:pl-0">
          <?= icon($iconName, 'hidden h-6 w-6 shrink-0 text-foreground/55 xl:block', 1.5) ?>
          <p class="flex flex-col">
            <span class="font-display text-lg font-semibold tabular-nums text-foreground md:text-xl"><?= number_format((int) $value) ?></span>
            <span class="text-[0.6875rem] leading-tight text-muted-foreground md:text-xs"><?= e($label) ?></span>
          </p>
        </li>
      <?php endforeach; ?>
    </ul>
    <a href="https://members.aak.or.ke/directory" target="_blank" rel="noopener noreferrer" class="link-quiet hidden shrink-0 items-center gap-1 text-sm lg:inline-flex">
      Find a member <?= icon('ArrowUpRight', 'h-4 w-4') ?>
    </a>
  </div>
</section>
<?php endif; ?>
