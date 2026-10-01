/**
 * Serialise structured data for a `<script type="application/ld+json">` via
 * dangerouslySetInnerHTML. JSON.stringify alone would let a "</script>" in
 * any string end the element early; replacing "<" and the two line
 * separators JavaScript treats as newlines with their JSON unicode escapes
 * keeps the payload inert whatever it contains, and it parses back the same.
 */
const UNSAFE = new RegExp("[<" + String.fromCharCode(0x2028, 0x2029) + "]", "g");
const BACKSLASH = String.fromCharCode(92);

const escapeChar = (c: string) => BACKSLASH + "u" + c.charCodeAt(0).toString(16).padStart(4, "0");

export const jsonLd = (data: unknown) => JSON.stringify(data).replace(UNSAFE, escapeChar);
