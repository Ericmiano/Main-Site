import { useEffect, useRef, useState, type FormEvent } from "react";
import { createFileRoute } from "@tanstack/react-router";
import {
  IconAlertTriangle as AlertTriangle,
  IconCircleCheck as CircleCheck,
  IconCircleX as CircleX,
  IconHash as Hash,
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
  "Check that a certificate issued by the Architectural Association of Kenya for one of its events is genuine, using the serial number printed on it and the holder's surname.";
const ENQUIRIES = "aak@aak.or.ke";
const inputClass =
  "mt-3 block w-full min-w-0 rounded-full border border-border bg-background px-5 py-3 text-base text-foreground outline-none placeholder:text-muted-foreground focus-visible:border-foreground";

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
  serial: string;
  name: string;
  certificate: string;
  event: string;
  dates: string;
  venue: string;
  cpdPoints: string | null;
  issued: string;
}

interface Query {
  serial: string;
  name: string;
}

type Result =
  | { state: "idle" | "checking" | "not_found" | "invalid" | "rate_limited" | "unavailable" }
  | { state: "valid" | "revoked"; certificate: Certificate };

function CertificateVerificationPage() {
  const [serial, setSerial] = useState("");
  const [surname, setSurname] = useState("");
  const [result, setResult] = useState<Result>({ state: "idle" });
  const resultRef = useRef<HTMLDivElement>(null);

  async function verify(raw: Query) {
    const query = { serial: raw.serial.trim().toUpperCase(), name: raw.name.trim() };
    if (!query.serial || !query.name) return;
    const params = new URLSearchParams({ serial: query.serial, name: query.name });
    setResult({ state: "checking" });
    // Keep the address shareable: /certificate-verification?serial=...&name=...
    window.history.replaceState(null, "", `?${params.toString()}`);
    try {
      const res = await fetch(`/api/certificate?${params.toString()}`);
      const data = (await res.json().catch(() => null)) as
        ({ status?: string } & Partial<Certificate>) | null;
      const status = data?.status;
      if ((status === "valid" || status === "revoked") && data) {
        setResult({ state: status, certificate: data as Certificate });
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

  // Arriving from a shared verification link: check it straight away.
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const serialParam = params.get("serial");
    const nameParam = params.get("name");
    if (serialParam && nameParam) {
      setSerial(serialParam);
      setSurname(nameParam);
      void verify({ serial: serialParam, name: nameParam });
    }
  }, []);

  function onSubmit(event: FormEvent) {
    event.preventDefault();
    void verify({ serial, name: surname });
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
                Every certificate AAK issues for its events carries a serial number. Whether you
                hold the certificate or have been shown it by someone else, enter the serial number
                with the holder&rsquo;s surname to confirm it is genuine and see the details AAK
                holds for it.
              </p>
            </Reveal>
          </div>
        </section>

        <section className="py-14 lg:py-20">
          <div className="mx-auto grid max-w-[1400px] gap-12 px-6 lg:grid-cols-[minmax(0,1fr)_minmax(0,22rem)] lg:gap-16 lg:px-12">
            <div className="min-w-0">
              <form onSubmit={onSubmit} className="max-w-xl">
                <div className="grid gap-4 sm:grid-cols-2">
                  <div>
                    <label
                      htmlFor="certificate-serial"
                      className="meta-label text-muted-foreground"
                    >
                      Serial number
                    </label>
                    <input
                      id="certificate-serial"
                      name="serial"
                      value={serial}
                      onChange={(e) => setSerial(e.target.value)}
                      placeholder="e.g. AAK/CONV26/DL/0001"
                      autoComplete="off"
                      autoCapitalize="characters"
                      spellCheck={false}
                      required
                      className={`${inputClass} font-mono tracking-wide uppercase placeholder:font-sans placeholder:normal-case placeholder:tracking-normal`}
                    />
                  </div>
                  <div>
                    <label
                      htmlFor="certificate-surname"
                      className="meta-label text-muted-foreground"
                    >
                      Holder&rsquo;s surname
                    </label>
                    <input
                      id="certificate-surname"
                      name="name"
                      value={surname}
                      onChange={(e) => setSurname(e.target.value)}
                      placeholder="As on the certificate"
                      autoComplete="off"
                      spellCheck={false}
                      required
                      className={inputClass}
                    />
                  </div>
                </div>
                <button
                  type="submit"
                  className="btn-primary mt-5 justify-center"
                  disabled={result.state === "checking"}
                >
                  {result.state === "checking" ? "Checking…" : "Verify"}
                </button>
              </form>

              <div ref={resultRef} tabIndex={-1} aria-live="polite" className="mt-10 outline-none">
                <ResultPanel result={result} />
              </div>
            </div>

            <aside className="space-y-8 text-sm leading-relaxed text-muted-foreground lg:border-l lg:border-border lg:pl-10">
              <div>
                <h2 className="flex items-center gap-2 font-display text-lg font-semibold text-foreground">
                  <Hash className="h-5 w-5 text-primary" aria-hidden="true" />
                  Where to find the serial number
                </h2>
                <p className="mt-3">
                  It&rsquo;s printed on the certificate, in the form AAK/CONV26/DL/0001. Enter it
                  with the holder&rsquo;s surname as it appears on the certificate. Capitals and
                  punctuation don&rsquo;t matter.
                </p>
                <p className="mt-3">
                  The surname is asked for so that the list of certificate holders stays private.
                </p>
              </div>
              <div>
                <h2 className="font-display text-lg font-semibold text-foreground">
                  Checking someone else&rsquo;s certificate
                </h2>
                <p className="mt-3">
                  Anyone who has been shown an AAK certificate can check it here: an employer, a
                  client, an institution or any other party. You don&rsquo;t need an account or the
                  holder&rsquo;s permission.
                </p>
                <p className="mt-3">
                  A genuine certificate shows here with the holder&rsquo;s full name and the event
                  they attended. Check these match the certificate you were shown. If anything
                  differs, or the certificate isn&rsquo;t found, contact{" "}
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

function Detail({ label, value, mono }: { label: string; value: string; mono?: boolean }) {
  return (
    <div>
      <dt className="meta-label text-muted-foreground">{label}</dt>
      <dd className={`mt-1 text-base text-foreground ${mono ? "font-mono tracking-wide" : ""}`}>
        {value}
      </dd>
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
          <Detail label="Serial number" value={cert.serial} mono />
        </dl>
      </article>
    );
  }

  const messages = {
    not_found: {
      title: "No certificate found with these details",
      body: (
        <>
          Check the serial number (e.g. AAK/CONV26/DL/0001) and the surname against the certificate
          and try again. If it still isn&rsquo;t found, the certificate may not be genuine. Contact{" "}
          <a href={`mailto:${ENQUIRIES}`} className="link-quiet text-foreground">
            {ENQUIRIES}
          </a>{" "}
          to confirm.
        </>
      ),
    },
    invalid: {
      title: "Some details are missing",
      body: (
        <>Enter the serial number as printed on the certificate and the holder&rsquo;s surname.</>
      ),
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
