# AAK back office (WordPress)

Staff write News & insights posts and upload event certificate lists in a
private WordPress at **cms.aak.or.ke**. Nobody else ever sees that WordPress:
its public pages redirect to aak.or.ke, which shows the posts in the site's own
design.

```
 staff ──► cms.aak.or.ke (WordPress + "AAK Site Connector" plugin)
              │  posts, over the REST API            │  certificate lists, as CSV files
              ▼                                      ▼
 aak.or.ke/api/news.php ──► /news, /news/<slug>    /home/<account>/aak-certificates/
 (cleans each post, caches 60 s)                    ▲
                                aak.or.ke/api/certificate.php ──► /certificate-verification
```

- Posts appear on aak.or.ke within about a minute of being published, changed or
  binned. No rebuild or upload is involved.
- Certificates can be verified the moment a list is published.

## Installing (once, in cPanel)

1. **Subdomain:** *Domains* › *Create a new domain* › `cms.aak.or.ke`. Give it its
   own folder **outside** `public_html`, e.g. `/home/<account>/cms.aak.or.ke`.
   It must be on the **same cPanel account** as aak.or.ke so it can write the
   certificate lists the site reads. The server's `*.aak.or.ke` certificate
   covers the subdomain. If the browser warns, run *SSL/TLS Status* › *Run
   AutoSSL*.
2. **WordPress:** *Softaculous* (or *WordPress Manager*) › install on
   `https://cms.aak.or.ke`.
   - Admin username: anything but `admin`, with a strong password.
   - Site title: "AAK back office".
   - Turn on automatic updates.
3. **Plugin:** in WordPress, *Plugins* › *Add New* › *Upload Plugin* ›
   `aak-site-connector.zip` › *Activate*. This:
   - creates the Blog, Article, Op-ed and News categories
   - makes new users Authors, who can publish their own posts
   - turns comments off
   - keeps WordPress out of search engines
4. **Check two settings:**
   - *Settings* › *General* › **Main website (AAK)** = `https://aak.or.ke`.
   - *Certificates* › **Settings** (bottom of the page): the detected folder
     should be `/home/<account>/aak-certificates`, the folder **beside**
     `public_html` that already holds `convention-2026.csv`. The convention
     list then appears under *Published lists*.
5. **Harden** (recommended):
   - Add `define('DISALLOW_FILE_EDIT', true);` to `wp-config.php`.
   - Install the **Two Factor** plugin (by WordPress.org) and turn it on for
     every account.
   - Don't install other plugins or themes unless they're needed.
6. **People:** *Users* › *Add New*.
   - **Author:** writes and publishes their own posts.
   - **Editor:** can also edit others' posts and manage **Certificates**.
   - **Administrator:** everything, including users and settings.

If WordPress ends up at an address other than `cms.aak.or.ke`, create
`/home/<account>/aak-cms-config.php` containing
`<?php return ['cms_url' => 'https://that-address'];`. Then add that address to
`img-src` in `public/.htaccess`, so article images can load.

## For staff: posting

1. *Posts* › *Add New Post*. Write the post with the normal blocks: paragraphs,
   headings, lists, quotes, images, tables, YouTube embeds.
2. In the right-hand panel:
   - tick a **category**
   - set a **featured image** (shown on the news page and when the post is shared)
   - optionally write an **excerpt** (the short summary under the title)
3. **Publish.** The post is on aak.or.ke/news within a minute. Edits and binned
   posts follow the same way.

The site uses its own fonts and colours, so text colours, font sizes, columns
and buttons from the editor aren't carried over. Write with headings, lists,
quotes and images and it will look right.

## For staff: certificates

1. *Certificates* › choose the spreadsheet (Excel or CSV). It needs a **Serial
   number** column and a **Name** column, and **only one of each**. Event,
   dates, venue, CPD points and issue date can be columns, or typed into the
   boxes for the whole list.
2. **Upload and preview.** Problems (duplicate serials, missing names, two name
   columns) are listed, and nothing can be published until they're fixed.
3. **Publish.** The certificates can be verified at
   aak.or.ke/certificate-verification straight away.
4. To withdraw one: open the list, find the person, press **Revoke**. Uploading
   the list again keeps revocations, unless the sheet has a Status column.

**Adding a few people without a spreadsheet:** use **Quick add** at the top of
*Certificates* (or on a list's own page). Choose the list, then paste one per
line:

```
AAK/CONV26/DL/0268 - Mutinda Mutuku
AAK/CONV26/DL/0173 - Cassius Kusienya
```

- **Event details:** new people take them from the rest of the list.
- **When they can be verified:** straight away.
- **If any line has a problem, nothing is added:** a serial already used by
  someone else, a serial that doesn't match the list's format (e.g. a missing
  zero), a duplicate line, or no dash. The lines stay in the box to fix.
- **People already in the list** are noted and skipped.

Every change is logged on the Certificates page, and each list's previous
version is kept in `aak-certificates/.history`.
