<?php
/**
 * Help and policy notices (src/components/info/docs.ts). Each has a
 * standalone page and opens as a pop-up from links on the site; the pop-up
 * fetches `<path>?fragment=1`. Bodies live in views/info/<key>.php.
 */

/** Legal notices stay drafts (noindex, out of the sitemap) until AAK
 * approves the wording. Flip to true once approved. */
const LEGAL_PAGES_APPROVED = false;

return [
    'faqs' => [
        'path' => '/faqs',
        'title' => 'Frequently asked questions',
        'description' => 'Answers on AAK membership and renewals, certificate validation, the members directory, events, awards, Grow A Classroom donations and store orders.',
        'intro' => 'Quick answers about membership, certificates, events, awards, donations and the store, each with a link to the service you need.',
        'updated' => '28 September 2026',
        'draft' => false,
    ],
    'accessibility' => [
        'path' => '/accessibility',
        'title' => 'Accessibility',
        'description' => "AAK's commitment to an accessible website, how it has been tested, known limitations, and how to report an access problem.",
        'intro' => 'We want everyone to be able to use this website, including people who use assistive technology, a keyboard or a small screen.',
        'updated' => '28 September 2026',
        'draft' => false,
    ],
    'privacy' => [
        'path' => '/privacy',
        'title' => 'Privacy notice',
        'description' => 'What personal information the AAK website collects, what it is used for, and how to contact the Association about it.',
        'intro' => "What personal information this website collects, what it's used for, and how to reach us about it.",
        'updated' => '28 September 2026',
        'draft' => !LEGAL_PAGES_APPROVED,
    ],
    'terms' => [
        'path' => '/terms',
        'title' => 'Terms of use',
        'description' => 'Terms for using the AAK website: site use, reuse of content and documents, external links, store orders and donations.',
        'intro' => 'The terms that apply when you use this website, its documents and its store and donation information.',
        'updated' => '28 September 2026',
        'draft' => !LEGAL_PAGES_APPROVED,
    ],
    'cookies' => [
        'path' => '/cookies',
        'title' => 'Cookie notice',
        'description' => 'The AAK website sets no cookies of its own and uses no tracking. Embedded videos and the map load only when you choose.',
        'intro' => "This website sets no cookies of its own and doesn't track you, which is why it doesn't ask for cookie consent.",
        'updated' => '28 September 2026',
        'draft' => !LEGAL_PAGES_APPROVED,
    ],
];
