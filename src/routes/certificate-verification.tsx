import { useEffect, useRef, useState, type FormEvent } from "react";
import { createFileRoute } from "@tanstack/react-router";
import {
  IconAlertTriangle as AlertTriangle,
  IconArrowUpRight as ArrowUpRight,
  IconCircleCheck as CircleCheck,
  IconCircleX as CircleX,
  IconQrcode as Qrcode,
  IconRosetteDiscountCheck as Rosette,
} from "@tabler/icons-react";

import { Header } from "@/components/site/Header";
import { Footer } from "@/components/site/Footer";
import { Reveal } from "@/components/site/Reveal";
import { PageBreadcrumb } from "@/components/site/PageBreadcrumb";
import { jsonLd } from "@/lib/json-ld";

const SITE_URL = "https://aak.or.ke";
const PAGE_URL = `${SITE_URL}/certificate-verification`;
const TITLE = "Certificate Verification | Architectural Association of Kenya";
const DESCRIPTION =
  "Check that a certificate issued by the Architectural Association of Kenya for one of its events is genuine, using the code or QR code printed on it.";
const ENQUIRIES = "aak@aak.or.ke";

export const Route = createFileRoute("/certificate-verification")({
  head: () => ({
    meta: [
      { title: TITLE },
      { name: "description", content: DESCRIPTION },
      { property: "og:title", content: TITLE },
      { property: "og:description", content: DESCRIPTION },
      { property: "og:type", content: "website" },
      { property: "og:url", content: PAGE_URL },
      { name: "twitter:card", content: "summary_large_image" },
    ],
    links: [{ rel: "canonical", href: PAGE_URL }],
  }),
  component: CertificateVerificationPage,
});

interface Certificate {
  code: string;
  name: string;
  certificate: string;
  event: string;
  dates: string;
  venue: string;
  cpdPoints: string | null;
  issued: string;
}

type Result =
  | { state: "idle" | "checking" | "not_found" | "invalid" | "rate_limited" | "unavailable" }
  | { state: "valid" | "revoked"; certificate: Certificate };

const MONTHS = [
  "january",
  "february",
  "march",
  "april",
  "may",
  "june",
  "july",
  "august",
  "september",
  "october",
  "november",
  "december",
];

/** Accept the code as printed, typed loosely, or the whole link from the QR code. */
function codeFrom(input: string) {
  const trimmed = input.trim();
  try {
    const fromLink = new URL(trimmed).searchParams.get("code");
    if (fromLink) return fromLink.trim().toUpperCase();
  } catch {
    // Not a link: the code itself.
  }
  return trimmed.toUpperCase().replace(/\s+/g, "");
}

/** LinkedIn's "Add licence or certification" form, filled in from the certificate. */
function linkedInUrl(cert: Certificate) {
  const [, monthName, year] = cert.issued.toLowerCase().match(/([a-z]+)\s+(\d{4})/) ?? [];
  const month = monthName ? MONTHS.indexOf(monthName) + 1 : 0;
  const params = new URLSearchParams({
    startTask: "CERTIFICATION_NAME",
    name: `${cert.certificate}: ${cert.event}`,
    organizationName: "Architectural Association of Kenya",
    certUrl: `${PAGE_URL}?code=${cert.code}`,
    certId: cert.code,
    ...(year ? { issueYear: year } : {}),
    ...(month > 0 ? { issueMonth: String(month) } : {}),
  });
  return `https://www.linkedin.com/profile/add?${params.toString()}`;
}

function CertificateVerificationPage() {
  const [input, setInput] = useState("");
  const [result, setResult] = useState<Result>({ state: "idle" });
  const resultRef = useRef<HTMLDivElement>(null);

  async function verify(raw: string) {
    const code = codeFrom(raw);
    if (!code) return;
    setInput(code);
    setResult({ state: "checking" });
    // Keep the address shareable: /certificate-verification?code=...
    window.history.replaceState(null, "", `?code=${encodeURIComponent(code)}`);
    try {
      const res = await fetch(`/api/certificate?code=${encodeURIComponent(code)}`);
      const data = (await res.json().catch(() => null)) as
        ({ status?: string } & Partial<Certificate>) | null;
      const status = data?.status;
      if ((status === "valid" || status === "revoked") && data) {
        const certificate = data as Certificate;
        // Show and share the code in its printed form, however it was typed.
        setInput(certificate.code);
        window.history.replaceState(null, "", `?code=${encodeURIComponent(certificate.code)}`);
        setResult({ state: status, certificate });
      } else if (status === "not_found" || status === "invalid" || status === "rate_limited") {
        setResult({ state: status });
      } else {
        setResult({ state: "unavailable" });
      }
    } catch {
      setResult({ state: "unavailable" });
    }
    requestAnimationFrame(() => resultRef.current?.focus());
  }

  // Arriving from a certificate's QR code: check it straight away.
  useEffect(() => {
    const code = new URLSearchParams(window.location.search).get("code");
    if (code) void verify(code);
  }, []);

  function onSubmit(event: FormEvent) {
    event.preventDefault();
    void verify(input);
  }

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: jsonLd({
            "@context": "https://schema.org",
            "@type": "BreadcrumbList",
            itemListElement: [
              { "@type": "ListItem", position: 1, name: "Home", item: `${SITE_URL}/` },
              {
                "@type": "ListItem",
                position: 2,
                name: "Certificate verification",
                item: PAGE_URL,
              },
            ],
          }),
        }}
      />
      <Header />
      <main>
        <section className="border-b border-border bg-secondary/40 py-14 lg:py-20">
          <div className="mx-auto max-w-[1400px] px-6 lg:px-12">
            <PageBreadcrumb trail={[{ label: "Certificate verification" }]} />
            <Reveal className="mt-8 max-w-3xl">
              <div className="meta-label flex items-center gap-3 border-t border-border pt-5 text-muted-foreground">
                <Rosette className="h-4 w-4 text-primary" aria-hidden="true" />
                <span>AAK event certificates</span>
              </div>
              <h1 className="mt-5 font-display text-4xl font-semibold leading-[1.02] tracking-tight text-balance text-foreground sm:text-5xl lg:text-6xl">
                Verify a certificate
              </h1>
              <p className="mt-5 text-base leading-relaxed text-muted-foreground">
                Every certificate AAK issues for its events carries a unique code and a QR code.
                Scan the QR code, or enter the code below, to confirm the certificate is genuine and
                see the details AAK holds for it.
              </p>
            </Reveal>
          </div>
        </section>

        <section className="py-14 lg:py-20">
          <div className="mx-auto grid max-w-[1400px] gap-12 px-6 lg:grid-cols-[minmax(0,1fr)_minmax(0,22rem)] lg:gap-16 lg:px-12">
            <div className="min-w-0">
              <form onSubmit={onSubmit} className="max-w-xl">
                <label htmlFor="certificate-code" className="meta-label text-muted-foreground">
                  Certificate code
                </label>
                <div className="mt-3 flex flex-col gap-3 sm:flex-row">
                  <input
                    id="certificate-code"
                    name="code"
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    placeholder="e.g. AAK-CV26-XXXX-XXXX"
                    autoComplete="off"
                    autoCapitalize="characters"
                    spellCheck={false}
                    required
                    className="min-w-0 flex-1 rounded-full border border-border bg-background px-5 py-3 font-mono text-base tracking-wide text-foreground uppercase outline-none placeholder:font-sans placeholder:normal-case placeholder:tracking-normal placeholder:text-muted-foreground focus-visible:border-foreground"
                  />
                  <button
                    type="submit"
                    className="btn-primary justify-center"
                    disabled={result.state === "checking"}
                  >
                    {result.state === "checking" ? "Checking…" : "Verify"}
                  </button>
                </div>
              </form>

              <div ref={resultRef} tabIndex={-1} aria-live="polite" className="mt-10 outline-none">
                <ResultPanel result={result} />
              </div>
            </div>

            <aside className="space-y-8 text-sm leading-relaxed text-muted-foreground lg:border-l lg:border-border lg:pl-10">
              <div>
                <h2 className="flex items-center gap-2 font-display text-lg font-semibold text-foreground">
                  <Qrcode className="h-5 w-5 text-primary" aria-hidden="true" />
                  Where to find the code
                </h2>
                <p className="mt-3">
                  The code is printed on the certificate beside its QR code, in the form
                  AAK-CV26-XXXX-XXXX. Scanning the QR code with a phone camera opens this page with
                  the code already checked.
                </p>
              </div>
              <div>
                <h2 className="font-display text-lg font-semibold text-foreground">
                  For employers
                </h2>
                <p className="mt-3">
                  A genuine certificate shows here with the holder&rsquo;s name and the event they
                  attended. Check the name matches the certificate you were given. If anything
                  differs, or the code isn&rsquo;t found, contact{" "}
                  <a href={`mailto:${ENQUIRIES}`} className="link-quiet text-foreground">
                    {ENQUIRIES}
                  </a>
                  .
                </p>
              </div>
              <div>
                <h2 className="font-display text-lg font-semibold text-foreground">
                  Membership certificates
                </h2>
                <p className="mt-3">
                  This page checks event certificates. To check an AAK membership certificate, use
                  the{" "}
                  <a
                    href="https://members.aak.or.ke/validate"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="link-quiet text-foreground"
                  >
                    member portal&rsquo;s validation service
                  </a>
                  .
                </p>
              </div>
            </aside>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}

function Detail({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <dt className="meta-label text-muted-foreground">{label}</dt>
      <dd className="mt-1 text-base text-foreground">{value}</dd>
    </div>
  );
}

function ResultPanel({ result }: { result: Result }) {
  if (result.state === "idle" || result.state === "checking") return null;

  if (result.state === "valid" || result.state === "revoked") {
    const cert = result.certificate;
    const valid = result.state === "valid";
    return (
      <article
        aria-labelledby="result-title"
        className={`max-w-2xl overflow-hidden rounded-2xl border ${valid ? "border-emerald-700/40" : "border-primary/50"} bg-background`}
      >
        <header
          className={`flex items-start gap-3 px-6 py-5 sm:px-8 ${valid ? "bg-emerald-50 text-emerald-900" : "bg-primary/10 text-foreground"}`}
        >
          {valid ? (
            <CircleCheck className="mt-0.5 h-6 w-6 shrink-0 text-emerald-700" aria-hidden="true" />
          ) : (
            <CircleX className="mt-0.5 h-6 w-6 shrink-0 text-primary" aria-hidden="true" />
          )}
          <div>
            <h2 id="result-title" className="font-display text-xl font-semibold">
              {valid ? "Genuine certificate" : "This certificate has been withdrawn"}
            </h2>
            <p className="mt-1 text-sm">
              {valid
                ? "Issued by the Architectural Association of Kenya."
                : `AAK has revoked this certificate. Contact ${ENQUIRIES} for details.`}
            </p>
          </div>
        </header>
        <dl className="grid gap-5 px-6 py-6 sm:grid-cols-2 sm:px-8">
          <div className="sm:col-span-2">
            <dt className="meta-label text-muted-foreground">Awarded to</dt>
            <dd className="mt-1 font-display text-2xl font-semibold text-foreground">
              {cert.name}
            </dd>
          </div>
          <Detail label="Certificate" value={cert.certificate} />
          <Detail label="Event" value={cert.event} />
          {cert.dates ? <Detail label="Dates" value={cert.dates} /> : null}
          {cert.venue ? <Detail label="Venue" value={cert.venue} /> : null}
          {cert.cpdPoints ? <Detail label="CPD points" value={cert.cpdPoints} /> : null}
          {cert.issued ? <Detail label="Issued" value={cert.issued} /> : null}
          <div className="sm:col-span-2">
            <dt className="meta-label text-muted-foreground">Certificate code</dt>
            <dd className="mt-1 font-mono text-base tracking-wide text-foreground">{cert.code}</dd>
          </div>
        </dl>
        {valid ? (
          <footer className="border-t border-border px-6 py-5 sm:px-8">
            <a
              href={linkedInUrl(cert)}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 text-sm font-semibold text-foreground hover:text-primary"
            >
              Add this certificate to LinkedIn
              <ArrowUpRight className="h-4 w-4 text-primary" aria-hidden="true" />
            </a>
            <p className="mt-1 text-xs text-muted-foreground">
              For the certificate holder: adds it to your profile with this verification link.
            </p>
          </footer>
        ) : null}
      </article>
    );
  }

  const messages = {
    not_found: {
      title: "No certificate found with this code",
      body: (
        <>
          Check the code against the certificate and try again: it looks like AAK-CV26-XXXX-XXXX. If
          it still isn&rsquo;t found, the certificate may not be genuine. Contact{" "}
          <a href={`mailto:${ENQUIRIES}`} className="link-quiet text-foreground">
            {ENQUIRIES}
          </a>{" "}
          to confirm.
        </>
      ),
    },
    invalid: {
      title: "That doesn’t look like a certificate code",
      body: <>Enter the code exactly as printed on the certificate, e.g. AAK-CV26-XXXX-XXXX.</>,
    },
    rate_limited: {
      title: "Too many checks",
      body: <>For security, checks are limited. Please wait a few minutes and try again.</>,
    },
    unavailable: {
      title: "Verification is unavailable right now",
      body: (
        <>
          Please try again later, or contact{" "}
          <a href={`mailto:${ENQUIRIES}`} className="link-quiet text-foreground">
            {ENQUIRIES}
          </a>{" "}
          to verify a certificate.
        </>
      ),
    },
  } as const;
  const message = messages[result.state];

  return (
    <div
      role="alert"
      className="flex max-w-2xl items-start gap-3 rounded-2xl border border-border bg-secondary/50 px-6 py-5"
    >
      <AlertTriangle className="mt-0.5 h-5 w-5 shrink-0 text-primary" aria-hidden="true" />
      <div>
        <h2 className="font-display text-lg font-semibold text-foreground">{message.title}</h2>
        <p className="mt-1 text-sm leading-relaxed text-muted-foreground">{message.body}</p>
      </div>
    </div>
  );
}
