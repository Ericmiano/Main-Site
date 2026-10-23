import { createFileRoute } from "@tanstack/react-router";

/*
 * Applications from the Form SP/1 pop-up, on the Cloudflare review site.
 *
 * The live site (cPanel) answers /api/arbitration-request with
 * public/api/arbitration-request.php. Workers can't run PHP, so this is the
 * same check and the same emails, for testing on the review site before
 * anything goes live: keep the two in step.
 *
 * It sends as arbitration@aak.or.ke through the cPanel mail server
 * (mail.aak.or.ke:465, signed in with the Worker secret
 * ARBITRATION_SMTP_PASSWORD), or, without that secret, through Microsoft 365
 * (Graph) with ARBITRATION_GRAPH_TENANT_ID, _CLIENT_ID and _CLIENT_SECRET.
 * Either way only ever to ARBITRATION_TO (default
 * arbitration@aak.or.ke) and ARBITRATION_CC (default none), so the review
 * site never writes to the Secretariat. Subjects start "[Review site]".
 * No rate limit here (a Worker keeps no files); the spam traps are the PHP's.
 */

const env = (key: string) => process.env[key]?.trim() || undefined;

const MAX_FILES = 10;
const MAX_TOTAL_BYTES = 15 * 1024 * 1024;
const MIN_SECONDS_ON_FORM = 5;
const GRAPH_CHUNK = 9 * 320 * 1024;
const ALLOWED_EXTENSIONS = ["pdf", "doc", "docx", "xls", "xlsx", "jpg", "jpeg", "png"];
const CURRENCIES = ["KES", "USD", "EUR", "GBP"];
const FROM = "arbitration@aak.or.ke";
const FROM_NAME = "AAK Arbitration";
const SECRETARIAT = "aak@aak.or.ke";

const PARTY_KINDS: Record<string, string> = {
  contractor: "Contractor",
  employer: "Employer",
  sub_contractor: "Sub-contractor",
  architect: "Architect",
  other: "Other",
};
/** Form SP/1's "Attach documents", each with the arbitration system's document type. */
const DOCUMENT_ITEMS: Record<string, [string, string | null]> = {
  arbitration_agreement: ["Arbitration agreement, or the contract containing it", null],
  declaration_of_dispute: ["Letter of declaration of dispute", "correspondence"],
  request_for_appointment: [
    "Letter requesting appointment of arbitrator by parties",
    "correspondence",
  ],
  applicant_declaration: [
    "Declaration by applicant that all matters required to be observed by parties prior to application have been fulfilled",
    "other",
  ],
  supporting: ["Other supporting documents", "evidence"],
};
const LABELS: Record<string, string> = {
  basis: "the arbitration agreement",
  partiesInDispute: "the parties in dispute",
  partiesInDisputeOther: "the other party type",
  claimantType: "the applicant's type",
  claimantFullName: "the applicant's name",
  claimantOrganizationName: "the applicant's organisation",
  claimantEmail: "the applicant's email",
  claimantPhone: "the applicant's phone",
  claimantAddress: "the applicant's address",
  representativeFullName: "the representative's name",
  representativeEmail: "the representative's email",
  respondentType: "the other party's type",
  respondentFullName: "the other party's name",
  respondentOrganizationName: "the other party's organisation",
  respondentEmail: "the other party's email",
  respondentAddress: "the other party's address",
  respondentAdvocateName: "the other party's advocate or agent",
  architectName: "the architect or contract administrator",
  projectName: "the description of the building works",
  projectLocation: "the location of the building works",
  contractReference: "the title of the contract form",
  contractSum: "the contract sum",
  contractSigned: "whether the contract is signed",
  contractExecutionDate: "the date of the contract",
  disputeValue: "the approximate sum in dispute",
  currency: "the currency",
  category: "the matter in dispute",
  description: "the outline of the matters in dispute",
  submittedBy: "who is submitting the statement",
};

class Invalid extends Error {}

const json = (status: number, body: unknown) =>
  new Response(JSON.stringify(body), {
    status,
    headers: {
      "content-type": "application/json",
      "cache-control": "no-store",
      "x-robots-tag": "noindex",
    },
  });

/** Date parts in Nairobi time. */
const MONTHS = [
  "January",
  "February",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "October",
  "November",
  "December",
];

/** Date parts in Nairobi time (UTC+3 all year: Kenya has no daylight saving). */
function nairobi(date = new Date()) {
  const d = new Date(date.getTime() + 3 * 3600 * 1000);
  const pad = (n: number) => String(n).padStart(2, "0");
  const [y, m, day] = [d.getUTCFullYear(), d.getUTCMonth(), d.getUTCDate()];
  const time = `${pad(d.getUTCHours())}:${pad(d.getUTCMinutes())}`;
  return {
    compact: `${y}${pad(m + 1)}${pad(day)}`,
    iso: `${y}-${pad(m + 1)}-${pad(day)}T${time}:${pad(d.getUTCSeconds())}+03:00`,
    day: `${day} ${MONTHS[m]} ${y}`,
    time,
  };
}

type Bytes = Uint8Array<ArrayBuffer>;

/** Files must be what their names say: the first bytes of each format. */
function looksLike(ext: string, b: Bytes): boolean {
  const starts = (...sig: number[]) => sig.every((v, i) => b[i] === v);
  if (ext === "pdf") return starts(0x25, 0x50, 0x44, 0x46); // %PDF
  if (ext === "png") return starts(0x89, 0x50, 0x4e, 0x47);
  if (ext === "jpg" || ext === "jpeg") return starts(0xff, 0xd8, 0xff);
  if (ext === "docx" || ext === "xlsx") return starts(0x50, 0x4b, 0x03, 0x04); // zip
  if (ext === "doc" || ext === "xls") return starts(0xd0, 0xcf, 0x11, 0xe0); // OLE
  return false;
}

function base64(bytes: Bytes): string {
  let binary = "";
  for (let i = 0; i < bytes.length; i += 0x8000)
    binary += String.fromCharCode(...bytes.subarray(i, i + 0x8000));
  return btoa(binary);
}

async function sha256(bytes: Bytes): Promise<string> {
  const digest = await crypto.subtle.digest("SHA-256", bytes);
  return [...new Uint8Array(digest)].map((b) => b.toString(16).padStart(2, "0")).join("");
}

const escapeHtml = (s: string) =>
  s.replace(
    /[&<>"']/g,
    (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[c]!,
  );

function contentType(name: string): string {
  const ext = name.split(".").pop()?.toLowerCase() ?? "";
  return (
    {
      pdf: "application/pdf",
      doc: "application/msword",
      docx: "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
      xls: "application/vnd.ms-excel",
      xlsx: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
      jpg: "image/jpeg",
      jpeg: "image/jpeg",
      png: "image/png",
      json: "application/json",
    }[ext] ?? "application/octet-stream"
  );
}

interface Mail {
  to: string;
  cc: string | null;
  replyTo: string | null;
  subject: string;
  plain: string;
  html: string;
  attachments: { name: string; data: Bytes }[];
}

async function graphToken(): Promise<string> {
  const tenant = env("ARBITRATION_GRAPH_TENANT_ID");
  const clientId = env("ARBITRATION_GRAPH_CLIENT_ID");
  const secret = env("ARBITRATION_GRAPH_CLIENT_SECRET");
  if (!tenant || !clientId || !secret) throw new Error("Microsoft 365 secrets are not set");
  const res = await fetch(
    `${env("ARBITRATION_GRAPH_LOGIN_BASE") ?? "https://login.microsoftonline.com"}/${encodeURIComponent(tenant)}/oauth2/v2.0/token`,
    {
      method: "POST",
      headers: { "content-type": "application/x-www-form-urlencoded" },
      body: new URLSearchParams({
        grant_type: "client_credentials",
        client_id: clientId,
        client_secret: secret,
        scope: "https://graph.microsoft.com/.default",
      }),
    },
  );
  const body = (await res.json().catch(() => ({}))) as { access_token?: string; error?: string };
  if (!res.ok || !body.access_token)
    throw new Error(`Microsoft sign-in failed (${res.status} ${body.error ?? ""})`);
  return body.access_token;
}

/** A draft, its attachments (over 3 MB in chunks), then send: as the PHP does. */
async function sendGraph(m: Mail, token: string): Promise<void> {
  const mailbox = `${env("ARBITRATION_GRAPH_BASE") ?? "https://graph.microsoft.com/v1.0"}/users/${encodeURIComponent(FROM)}`;
  const auth = { authorization: `Bearer ${token}`, "content-type": "application/json" };
  const who = (address: string | null) => (address ? [{ emailAddress: { address } }] : []);
  const step = async (what: string, res: Response, ok: number[]) => {
    if (!ok.includes(res.status)) {
      const body = (await res.json().catch(() => ({}))) as { error?: { code?: string } };
      throw new Error(`Microsoft 365 ${what} failed (${res.status} ${body.error?.code ?? ""})`);
    }
    return res;
  };

  const draftRes = await step(
    "draft",
    await fetch(`${mailbox}/messages`, {
      method: "POST",
      headers: auth,
      body: JSON.stringify({
        subject: m.subject,
        body: { contentType: "HTML", content: m.html },
        from: { emailAddress: { address: FROM, name: FROM_NAME } },
        toRecipients: who(m.to),
        ccRecipients: who(m.cc),
        replyTo: who(m.replyTo),
      }),
    }),
    [201],
  );
  const draft = (await draftRes.json()) as { id: string };
  const message = `${mailbox}/messages/${encodeURIComponent(draft.id)}`;

  for (const f of m.attachments) {
    if (f.data.length < 3 * 1024 * 1024) {
      await step(
        "attachment",
        await fetch(`${message}/attachments`, {
          method: "POST",
          headers: auth,
          body: JSON.stringify({
            "@odata.type": "#microsoft.graph.fileAttachment",
            name: f.name,
            contentType: contentType(f.name),
            contentBytes: base64(f.data),
          }),
        }),
        [201],
      );
      continue;
    }
    const sessionRes = await step(
      "upload session",
      await fetch(`${message}/attachments/createUploadSession`, {
        method: "POST",
        headers: auth,
        body: JSON.stringify({
          AttachmentItem: {
            attachmentType: "file",
            name: f.name,
            size: f.data.length,
            contentType: contentType(f.name),
          },
        }),
      }),
      [201],
    );
    const { uploadUrl } = (await sessionRes.json()) as { uploadUrl: string };
    // The upload address carries its own authorisation: no token here.
    for (let at = 0; at < f.data.length; at += GRAPH_CHUNK) {
      const chunk = f.data.subarray(at, at + GRAPH_CHUNK);
      await step(
        "upload",
        await fetch(uploadUrl, {
          method: "PUT",
          headers: {
            "content-type": "application/octet-stream",
            "content-range": `bytes ${at}-${at + chunk.length - 1}/${f.data.length}`,
          },
          body: chunk,
        }),
        [200, 201],
      );
    }
  }
  await step(
    "send",
    await fetch(`${message}/send`, {
      method: "POST",
      headers: { authorization: `Bearer ${token}` },
    }),
    [202],
  );
}

/* The cPanel mail server -------------------------------------------------- */

/** RFC 2047 encoding for a header value that isn't plain ASCII. */
const headerText = (value: string) =>
  /^[\x20-\x7e]*$/.test(value) ? value : `=?UTF-8?B?${base64(new TextEncoder().encode(value))}?=`;

const wrap76 = (b64: string) => b64.replace(/.{1,76}/g, "$&\r\n");

/** One email as MIME text: plain + HTML, then the attachments. */
function mime(m: Mail, messageId: string): string {
  const boundary = (tag: string) =>
    `${tag}-${[...crypto.getRandomValues(new Uint8Array(8))].map((b) => b.toString(16).padStart(2, "0")).join("")}`;
  const alt = boundary("alt");
  const mixed = boundary("mixed");
  const utf8 = (text: string) => wrap76(base64(new TextEncoder().encode(text)));
  const alternative =
    `--${alt}\r\nContent-Type: text/plain; charset=UTF-8\r\nContent-Transfer-Encoding: base64\r\n\r\n${utf8(m.plain)}` +
    `--${alt}\r\nContent-Type: text/html; charset=UTF-8\r\nContent-Transfer-Encoding: base64\r\n\r\n${utf8(m.html)}` +
    `--${alt}--\r\n`;
  const headers = [
    `From: ${headerText(FROM_NAME)} <${FROM}>`,
    `To: ${m.to}`,
    ...(m.cc ? [`Cc: ${m.cc}`] : []),
    ...(m.replyTo ? [`Reply-To: ${m.replyTo}`] : []),
    `Subject: ${headerText(m.subject)}`,
    `Date: ${new Date().toUTCString().replace("GMT", "+0000")}`,
    `Message-ID: <${messageId}@aak.or.ke>`,
    "MIME-Version: 1.0",
  ];
  if (!m.attachments.length)
    return `${headers.join("\r\n")}\r\nContent-Type: multipart/alternative; boundary="${alt}"\r\n\r\n${alternative}`;
  let body = `--${mixed}\r\nContent-Type: multipart/alternative; boundary="${alt}"\r\n\r\n${alternative}`;
  for (const f of m.attachments) {
    const name = headerText(f.name);
    body +=
      `--${mixed}\r\nContent-Type: ${contentType(f.name)}; name="${name}"\r\nContent-Transfer-Encoding: base64\r\n` +
      `Content-Disposition: attachment; filename="${name}"\r\n\r\n${wrap76(base64(f.data))}`;
  }
  return `${headers.join("\r\n")}\r\nContent-Type: multipart/mixed; boundary="${mixed}"\r\n\r\n${body}--${mixed}--\r\n`;
}

interface SmtpSocket {
  readable: ReadableStream<Uint8Array>;
  writable: WritableStream<Uint8Array>;
  close(): Promise<void>;
}
// A variable, so neither the cPanel build nor the dev server tries to resolve
// this Workers-only module; it's loaded only when an email is sent.
const SOCKETS_MODULE = "cloudflare:sockets";

/** Sends one email through the cPanel mail server, signed in as arbitration@. */
async function sendSmtp(m: Mail, password: string, messageId: string): Promise<void> {
  const host = env("ARBITRATION_SMTP_HOST") ?? "mail.aak.or.ke";
  const port = Number(env("ARBITRATION_SMTP_PORT") ?? 465);
  const tls = env("ARBITRATION_SMTP_TLS") !== "off"; // "off" only for local tests
  const { connect } = (await import(/* @vite-ignore */ SOCKETS_MODULE)) as {
    connect: (
      address: { hostname: string; port: number },
      options?: { secureTransport?: string },
    ) => SmtpSocket;
  };
  const socket = connect({ hostname: host, port }, { secureTransport: tls ? "on" : "off" });
  const reader = socket.readable.getReader();
  const writer = socket.writable.getWriter();
  const encoder = new TextEncoder();
  const decoder = new TextDecoder();
  let buffer = "";

  /** The next complete reply ("250-..." lines end with "250 ..."). */
  const reply = async (): Promise<number> => {
    for (;;) {
      const lines = buffer.split("\r\n");
      for (let i = 0; i < lines.length - 1; i++) {
        if (/^\d{3} /.test(lines[i]!)) {
          buffer = lines.slice(i + 1).join("\r\n");
          return Number(lines[i]!.slice(0, 3));
        }
      }
      const { value, done } = await reader.read();
      if (done) throw new Error("The mail server closed the connection");
      buffer += decoder.decode(value, { stream: true });
    }
  };
  /** Sends a command (never logged: one carries the password) and checks the reply. */
  const step = async (what: string, command: string | null, ok: number[]) => {
    if (command !== null) await writer.write(encoder.encode(`${command}\r\n`));
    const code = await reply();
    if (!ok.includes(code)) throw new Error(`Mail server ${what} failed (${code})`);
  };

  const work = (async () => {
    await step("greeting", null, [220]);
    await step("hello", "EHLO aak.or.ke", [250]);
    await step("sign-in", `AUTH PLAIN ${base64(encoder.encode(`\0${FROM}\0${password}`))}`, [235]);
    await step("sender", `MAIL FROM:<${FROM}>`, [250]);
    for (const rcpt of [m.to, m.cc].filter((r): r is string => !!r))
      await step("recipient", `RCPT TO:<${rcpt}>`, [250, 251]);
    await step("data", "DATA", [354]);
    // Lines starting with "." are doubled, as SMTP requires.
    const message = mime(m, messageId).replace(/^\./gm, "..");
    await writer.write(encoder.encode(`${message}\r\n.\r\n`));
    await step("delivery", null, [250]);
    await writer.write(encoder.encode("QUIT\r\n")).catch(() => {});
  })();
  const timeout = new Promise<never>((_, reject) =>
    setTimeout(() => reject(new Error("The mail server took too long")), 30_000),
  );
  try {
    await Promise.race([work, timeout]);
  } finally {
    await socket.close().catch(() => {});
  }
}

/** Posts only from this site (another site can't submit in a visitor's name). */
function sameSite(request: Request): boolean {
  const origin = request.headers.get("origin") ?? request.headers.get("referer");
  if (!origin) return false;
  try {
    return new URL(origin).host === new URL(request.url).host;
  } catch {
    return false;
  }
}

async function handle(request: Request): Promise<Response> {
  if (!sameSite(request)) return json(403, { status: "forbidden" });
  const length = Number(request.headers.get("content-length") ?? 0);
  if (length > MAX_TOTAL_BYTES + 1024 * 1024) return json(413, { status: "too_large" });
  let form: FormData;
  try {
    form = await request.formData();
  } catch {
    return json(400, { status: "invalid", error: "Please try again." });
  }
  const str = (key: string) => {
    const v = form.get(key);
    return typeof v === "string" ? v : "";
  };
  if (str("website").trim() !== "" || Number(str("elapsed")) < MIN_SECONDS_ON_FORM * 1000)
    return json(400, { status: "invalid", error: "Please try again." });

  const fail = (message: string): never => {
    throw new Invalid(message.replace(/^(\w+)/, (k) => LABELS[k] ?? k));
  };
  const line = (key: string, max: number, required = false): string | null => {
    const value = str(key)
      .replace(/\p{Cc}+/gu, " ")
      .trim();
    if (!value) return required ? fail(`${key} is required`) : null;
    if ([...value].length > max) fail(`${key} is too long`);
    return value;
  };
  const text = (key: string, max: number, required = false): string | null => {
    const value = str(key)
      .replace(/\r\n/g, "\n")
      .replace(/\p{Cc}/gu, (c) => (c === "\n" || c === "\t" ? c : ""))
      .trim();
    if (!value) return required ? fail(`${key} is required`) : null;
    if ([...value].length > max) fail(`${key} is too long`);
    return value;
  };
  const email = (key: string, required: boolean) => {
    const value = line(key, 254, required);
    if (value !== null && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value))
      fail(`${key} is not a valid email address`);
    return value;
  };
  const amount = (key: string, required: boolean): number | null => {
    const raw = str(key).replace(/[, ]/g, "");
    if (raw === "" && !required) return null;
    const n = Number(raw);
    if (raw === "" || !Number.isFinite(n) || n <= 0 || n > 1e15)
      fail(`${key} must be a number above zero`);
    return n;
  };
  const party = (role: "claimant" | "respondent", emailRequired: boolean) => {
    const type = line(`${role}Type`, 20, true);
    if (type !== "individual" && type !== "organization") fail(`${role}Type is invalid`);
    return {
      role,
      type,
      fullName: line(`${role}FullName`, 255, true)!,
      organizationName: type === "organization" ? line(`${role}OrganizationName`, 255, true) : null,
      email: email(`${role}Email`, emailRequired),
      phone: line(`${role}Phone`, 50, role === "claimant"),
      address: line(`${role}Address`, 500, true),
    };
  };

  const partiesInDispute = [...new Set(form.getAll("partiesInDispute[]").map(String))];
  if (!partiesInDispute.length || partiesInDispute.some((k) => !(k in PARTY_KINDS)))
    fail("partiesInDispute is required");
  const partiesInDisputeOther = partiesInDispute.includes("other")
    ? line("partiesInDisputeOther", 100, true)
    : null;
  const basis = line("basis", 30, true);
  if (basis !== "contractual_clause" && basis !== "mutual_agreement") fail("basis is invalid");
  const claimant = party("claimant", true);
  const respondent = party("respondent", true);
  const representative = str("representativeFullName").trim()
    ? {
        fullName: line("representativeFullName", 255, true)!,
        organizationName: line("representativeOrganizationName", 255),
        email: email("representativeEmail", true)!,
        phone: line("representativePhone", 50),
        address: line("representativeAddress", 500),
      }
    : null;
  const applicantEmail = representative?.email ?? claimant.email!;
  const respondentAdvocate = str("respondentAdvocateName").trim()
    ? {
        fullName: line("respondentAdvocateName", 255, true)!,
        address: line("respondentAdvocateAddress", 500),
        fileReference: line("respondentAdvocateReference", 100),
      }
    : null;
  const contractAdministrator = str("architectName").trim()
    ? {
        fullName: line("architectName", 255, true)!,
        address: line("architectAddress", 500),
        otherConsultants: line("otherConsultants", 500),
      }
    : null;
  const currency = (line("currency", 3) ?? "KES").toUpperCase();
  if (!CURRENCIES.includes(currency)) fail("currency is invalid");
  const disputeValue = amount("disputeValue", true)!;
  const contractSum = amount("contractSum", false);
  const contractSigned = line("contractSigned", 3, true);
  if (contractSigned !== "yes" && contractSigned !== "no") fail("contractSigned is required");
  const executionDate = line("contractExecutionDate", 10);
  if (executionDate !== null && !/^\d{4}-\d{2}-\d{2}$/.test(executionDate))
    fail("contractExecutionDate is invalid");

  const now = nairobi();
  const reference = `ARB-${now.compact}-${[...crypto.getRandomValues(new Uint8Array(3))]
    .map((b) => b.toString(16).padStart(2, "0"))
    .join("")
    .toUpperCase()}`;
  const application = {
    schema: "aak-arbitration-intake/1",
    form: "SP/1 Statement of particulars: application to the President for appointment of arbitrator",
    reference,
    submittedAt: now.iso,
    submittedBy: line("submittedBy", 255, true),
    case: {
      basis,
      disputeValue,
      currency,
      category: line("category", 100, true),
      description: text("description", 10000, true),
      priorAdjudicationOrMediation: str("priorAdr") === "yes",
    },
    parties: [claimant, respondent],
    partiesInDispute,
    partiesInDisputeOther,
    filedBy: representative
      ? { role: "representative of the applicant", ...representative }
      : { role: "applicant" },
    respondentRepresentative: respondentAdvocate,
    contractAdministrator,
    project: { name: line("projectName", 255, true), location: line("projectLocation", 255, true) },
    contract: {
      referenceNumber: line("contractReference", 150, true),
      executionDate,
      value: contractSum,
      currency,
      signed: contractSigned === "yes",
      hasArbitrationClause: basis === "contractual_clause",
      arbitrationClauseText: text("arbitrationClause", 5000),
    },
    venuePreferences: {
      contractor: line("venueContractor", 255),
      employer: line("venueEmployer", 255),
    },
    documents: [] as {
      fileName: string;
      formItem: string;
      documentType: string;
      sizeBytes: number;
      sha256: string;
    }[],
  };
  if (str("otherPartyCopied") !== "yes") fail("Please confirm the other party is copied");
  if (str("declaration") !== "yes") fail("Please confirm the declaration");

  const files = form.getAll("files[]");
  const items = form.getAll("documentTypes[]").map(String);
  if (files.length > MAX_FILES) fail(`Please attach at most ${MAX_FILES} files`);
  const attachments: Mail["attachments"] = [];
  let total = 0;
  for (const [i, file] of files.entries()) {
    if (typeof file === "string") continue;
    const item = items[i] ?? "";
    if (!(item in DOCUMENT_ITEMS)) fail("A document type is invalid");
    const safe = file.name
      .split(/[\\/]/)
      .pop()!
      .replace(/[^\w.\- ]+/gu, "_")
      .replace(/^[ .]+|[ .]+$/g, "")
      .slice(0, 120);
    const ext = safe.split(".").pop()?.toLowerCase() ?? "";
    if (!safe || !ALLOWED_EXTENSIONS.includes(ext))
      fail("Files must be PDF, Word, Excel, JPG or PNG");
    total += file.size;
    if (total > MAX_TOTAL_BYTES) return json(413, { status: "too_large" });
    const data = new Uint8Array(await file.arrayBuffer());
    if (!looksLike(ext, data)) fail(`${safe} isn't a readable ${ext.toUpperCase()} file`);
    attachments.push({ name: safe, data });
    application.documents.push({
      fileName: safe,
      formItem: item,
      documentType:
        DOCUMENT_ITEMS[item]![1] ??
        (basis === "contractual_clause" ? "contract_copy" : "submission_agreement"),
      sizeBytes: file.size,
      sha256: await sha256(data),
    });
  }

  /* The emails: the same rows as the PHP. */
  const money = (v: number | null) =>
    v === null
      ? null
      : `${currency} ${v.toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
  const contact = (p: {
    fullName: string;
    organizationName?: string | null;
    address?: string | null;
    email?: string | null;
    phone?: string | null;
    fileReference?: string | null;
    otherConsultants?: string | null;
  }) =>
    [
      `${p.fullName}${p.organizationName ? ` (${p.organizationName})` : ""}`,
      p.address,
      p.email,
      p.phone,
      p.fileReference ? `File reference: ${p.fileReference}` : null,
      p.otherConsultants ? `Quantity surveyor / consulting engineer: ${p.otherConsultants}` : null,
    ]
      .filter(Boolean)
      .join("\n");
  const a = application;
  const rows = (
    [
      ["Reference", reference],
      ["Received", `${now.day}, ${now.time}`],
      [
        "Parties in dispute",
        partiesInDispute
          .map((k) => (k === "other" ? `Other: ${partiesInDisputeOther}` : PARTY_KINDS[k]))
          .join(", "),
      ],
      ["Applicant party", contact(claimant)],
      representative
        ? ["Representative / advocate / agent of applicant", contact(representative)]
        : null,
      ["Other party", contact(respondent)],
      respondentAdvocate ? ["Other party's advocate / agent", contact(respondentAdvocate)] : null,
      contractAdministrator
        ? ["Architect / contract administrator", contact(contractAdministrator)]
        : null,
      ["Building works", `${a.project.name}\n${a.project.location}`],
      ["Contract form", a.contract.referenceNumber],
      contractSum !== null ? ["Contract sum", money(contractSum)] : null,
      ["Contract signed", contractSigned === "yes" ? "Yes" : "No"],
      executionDate ? ["Contract date", executionDate] : null,
      [
        "Arbitration agreement",
        basis === "contractual_clause"
          ? "Arbitration clause in the contract"
          : "Separate arbitration agreement",
      ],
      a.contract.arbitrationClauseText
        ? ["Arbitration clause", a.contract.arbitrationClauseText]
        : null,
      ["Matter in dispute", a.case.category],
      ["Outline of the matters in dispute", a.case.description],
      [
        "Adjudication / mediation",
        a.case.priorAdjudicationOrMediation
          ? "A matter in dispute has been the subject of adjudication or mediation"
          : "Not indicated",
      ],
      ["Approximate sum in dispute", money(disputeValue)],
      a.venuePreferences.contractor
        ? ["Venue preference: contractor", a.venuePreferences.contractor]
        : null,
      a.venuePreferences.employer
        ? ["Venue preference: employer", a.venuePreferences.employer]
        : null,
      [
        "Documents",
        a.documents.length
          ? a.documents.map((d) => `${DOCUMENT_ITEMS[d.formItem]![0]}: ${d.fileName}`).join("\n")
          : "None attached",
      ],
      ["Submitted by", `${a.submittedBy}, ${now.day}`],
    ] as ([string, string | null] | null)[]
  ).filter((r): r is [string, string] => r !== null && r[1] !== null);
  const htmlTable =
    '<table cellpadding="6" cellspacing="0" style="border-collapse:collapse;font:14px/1.5 Arial,sans-serif">' +
    rows
      .map(
        ([k, v]) =>
          `<tr><th align="left" valign="top" style="border-bottom:1px solid #ddd;color:#555;font-weight:600;white-space:nowrap">${escapeHtml(k)}</th><td style="border-bottom:1px solid #ddd">${escapeHtml(v).replace(/\n/g, "<br>\n")}</td></tr>`,
      )
      .join("") +
    "</table>";
  const partyName = (p: { organizationName: string | null; fullName: string }) =>
    p.organizationName ?? p.fullName;
  const to = env("ARBITRATION_TO") ?? FROM;
  const cc = env("ARBITRATION_CC") ?? null;
  const plainTable = rows.map(([k, v]) => `${k}:\n  ${v.replace(/\n/g, "\n  ")}`).join("\n");
  const intro =
    "A new application to the President for appointment of an arbitrator (Form SP/1) was submitted on aak.or.ke.";

  // The cPanel mail server when its password is set, otherwise Microsoft 365.
  const smtpPassword = env("ARBITRATION_SMTP_PASSWORD");
  let token: string | null = null;
  let sent = 0;
  const send = async (m: Mail) => {
    sent += 1;
    if (smtpPassword) return sendSmtp(m, smtpPassword, `${reference.toLowerCase()}.${sent}`);
    token ??= await graphToken();
    return sendGraph(m, token);
  };

  await send({
    to,
    cc,
    replyTo: applicantEmail,
    subject: `[Review site] Application for appointment of arbitrator ${reference}: ${partyName(claimant)} v ${partyName(respondent)}`,
    plain: `${intro}\n\n${plainTable}\n\nReply to this email to answer the applicant.\nThe attached JSON holds the same details in the arbitration system's format.`,
    html: `<p style="font:14px Arial,sans-serif">${escapeHtml(intro)}</p>${htmlTable}<p style="font:13px Arial,sans-serif;color:#555">Reply to this email to answer the applicant. The attached JSON holds the same details in the arbitration system&rsquo;s format.</p>`,
    attachments: [
      ...attachments,
      {
        name: `arbitration-request-${reference}.json`,
        data: new TextEncoder().encode(JSON.stringify(application, null, 4)),
      },
    ],
  });
  const ackIntro = `Thank you. The Architectural Association of Kenya has received your application to the President for appointment of an arbitrator. Your reference is ${reference}; please quote it when you write to the Secretariat.`;
  try {
    await send({
      // The review site never writes to outsiders: the copy goes to the test mailbox.
      to,
      cc: null,
      replyTo: SECRETARIAT,
      subject: `[Review site] Your application for appointment of an arbitrator: ${reference}`,
      plain: `${ackIntro}\n\nWhat you sent:\n\n${plainTable}\n\nArchitectural Association of Kenya\naak@aak.or.ke · +254 721 691 337`,
      html: `<p style="font:14px Arial,sans-serif">${escapeHtml(ackIntro)}</p><p style="font:14px Arial,sans-serif">What you sent:</p>${htmlTable}<p style="font:13px Arial,sans-serif;color:#555">Architectural Association of Kenya<br>aak@aak.or.ke · +254 721 691 337</p>`,
      attachments: [],
    });
  } catch (err) {
    console.error("arbitration-request: the acknowledgement could not be sent:", String(err));
  }
  return json(200, { status: "ok", reference });
}

export const Route = createFileRoute("/api/arbitration-request")({
  server: {
    handlers: {
      POST: async ({ request }) => {
        try {
          return await handle(request);
        } catch (err) {
          if (err instanceof Invalid) return json(400, { status: "invalid", error: err.message });
          console.error("arbitration-request:", String(err));
          return json(502, { status: "error" });
        }
      },
    },
  },
});
