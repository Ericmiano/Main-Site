/**
 * Downloadable documents (PDFs, radio clips) live in Cloudflare R2, served by
 * the Worker in workers/files, not on the web host. Once aak.or.ke's DNS is
 * on Cloudflare this becomes https://files.aak.or.ke; nothing else changes.
 *
 * Old /documents/... links on aak.or.ke redirect here (see public/.htaccess).
 */
export const FILES_HOST = "https://aak-files.aak-kenya.workers.dev";

export const fileUrl = (path: `/documents/${string}`) => `${FILES_HOST}${path}`;
