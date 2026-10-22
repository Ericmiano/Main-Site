import { useEffect, useRef, useState, type FormEvent, type ReactNode } from "react";
import { IconArrowUpRight as ArrowUpRight, IconX as X } from "@tabler/icons-react";

import { cn } from "@/lib/utils";

/*
 * Application to the President for appointment of an arbitrator: AAK's Form
 * SP/1 (Statement of particulars), online. It opens in a pop-up that looks
 * like AAK's arbitration system (its "ledger" design: warm paper, ink rules,
 * square corners, Plex Mono labels; tokens --color-ledger-* in styles.css).
 * The questions are SP/1's, in its order; the field names are the system's
 * (applicant = claimant, other party = respondent, basis, project, contract,
 * dispute value, category, description), so an application goes into the
 * system as it stands. public/api/arbitration-request.php checks it and
 * emails it to the Secretariat.
 */

const ENDPOINT = "/api/arbitration-request";
const MAX_FILES = 10;
const MAX_TOTAL_BYTES = 15 * 1024 * 1024;
const ACCEPT = ".pdf,.doc,.docx,.xls,.xlsx,.jpg,.jpeg,.png";

/** SP/1: "Parties in Dispute (tick as appropriate)". */
const PARTY_KINDS: [string, string][] = [
  ["contractor", "Contractor"],
  ["employer", "Employer"],
  ["sub_contractor", "Sub-contractor"],
  ["architect", "Architect"],
  ["other", "Other"],
];

/** SP/1: "Attach documents", plus anything else in support. */
const DOCUMENT_ITEMS: [string, string][] = [
  ["arbitration_agreement", "Arbitration agreement, or the contract containing it"],
  ["declaration_of_dispute", "Letter of declaration of dispute"],
  ["request_for_appointment", "Letter requesting appointment of arbitrator by parties"],
  [
    "applicant_declaration",
    "Declaration by applicant that all matters required to be observed by parties prior to application for appointment have been fulfilled",
  ],
  ["supporting", "Other supporting documents"],
];
const ITEM_LABEL = Object.fromEntries(DOCUMENT_ITEMS);

const CURRENCIES = ["KES", "USD", "EUR", "GBP"];
/** SP/1's own examples of matters in dispute. */
const MATTER_SUGGESTIONS = [
  "Quality of workmanship",
  "Claim for extension of time",
  "Payments",
  "Consultant's misconduct",
];

/* The arbitration system's own classes, in this site's Tailwind. */
const inputClass =
  "w-full min-w-0 rounded-none border-0 border-b border-ledger-rule bg-transparent py-1.5 text-[13px] text-ledger-ink outline-none placeholder:text-ledger-muted focus:border-ledger-ink";
const textareaClass =
  "w-full rounded-none border border-ledger-rule bg-transparent p-2 text-[13px] text-ledger-ink outline-none focus:border-ledger-ink";
const primaryButton =
  "inline-flex min-h-[31px] cursor-pointer items-center gap-2 bg-ledger-red px-3.5 py-1.5 text-[12.5px] font-medium text-white hover:bg-ledger-red-hover disabled:cursor-not-allowed disabled:bg-ledger-red-hover";
const secondaryButton =
  "inline-flex min-h-[31px] cursor-pointer items-center gap-2 border border-ledger-ink bg-transparent px-3.5 text-[12.5px] text-ledger-ink hover:bg-ledger-band disabled:cursor-not-allowed";
const monoLabel = "font-mono text-[9.5px] uppercase tracking-[0.11em] text-ledger-muted";
const checkClass = "mt-0.5 h-3.5 w-3.5 shrink-0 accent-[var(--color-ledger-red)]";

type Role = "claimant" | "respondent";
interface StagedFile {
  id: string;
  file: File;
  item: string;
}
type Status =
  | { state: "editing" }
  | { state: "reviewing" }
  | { state: "sending" }
  | { state: "sent"; reference: string }
  | { state: "error"; message: string };

const formatSize = (bytes: number) =>
  bytes >= 1024 * 1024 ? `${(bytes / 1024 / 1024).toFixed(1)} MB` : `${Math.ceil(bytes / 1024)} KB`;

function Field({
  label,
  hint,
  className,
  children,
}: {
  label: string;
  hint?: string;
  className?: string;
  children: ReactNode;
}) {
  return (
    <label className={cn("flex flex-col gap-1.5", className)}>
      <span className={monoLabel}>{label}</span>
      {children}
      {hint ? <span className="text-[11.5px] text-ledger-muted">{hint}</span> : null}
    </label>
  );
}

function FormSection({
  step,
  title,
  note,
  children,
}: {
  step: string;
  title: string;
  note?: string;
  children: ReactNode;
}) {
  return (
    <section className="border-t border-ledger-rule pt-5 first:border-t-0 first:pt-0">
      <h3 className="mb-1 flex items-baseline gap-3 font-mono text-[10.5px] uppercase tracking-[0.12em] text-ledger-muted">
        <span className="text-ledger-red">{step}</span>
        {title}
      </h3>
      {note ? <p className="text-[12.5px] text-ledger-ink-2">{note}</p> : null}
      <div className="mt-3.5 grid gap-4 sm:grid-cols-2">{children}</div>
    </section>
  );
}

function PartyFields({
  role,
  type,
  onType,
}: {
  role: Role;
  type: string;
  onType: (t: string) => void;
}) {
  const applicant = role === "claimant";
  return (
    <>
      <Field label="Party type">
        <select
          name={`${role}Type`}
          value={type}
          onChange={(e) => onType(e.target.value)}
          className={inputClass}
        >
          <option value="individual">Individual</option>
          <option value="organization">Organisation</option>
        </select>
      </Field>
      {type === "organization" ? (
        <Field label="Organisation name">
          <input name={`${role}OrganizationName`} required maxLength={255} className={inputClass} />
        </Field>
      ) : (
        <span className="hidden sm:block" aria-hidden="true" />
      )}
      <Field label={type === "organization" ? "Contact person" : "Name"}>
        <input
          name={`${role}FullName`}
          required
          maxLength={255}
          autoComplete={applicant ? "name" : "off"}
          className={inputClass}
        />
      </Field>
      <Field label={applicant ? "Email" : "Email (if known)"}>
        <input
          name={`${role}Email`}
          type="email"
          required={applicant}
          maxLength={254}
          autoComplete={applicant ? "email" : "off"}
          className={inputClass}
        />
      </Field>
      <Field label={applicant ? "Phone" : "Phone (if known)"}>
        <input
          name={`${role}Phone`}
          type="tel"
          required={applicant}
          maxLength={50}
          autoComplete={applicant ? "tel" : "off"}
          className={inputClass}
        />
      </Field>
      <Field label="Address">
        <input name={`${role}Address`} required maxLength={500} className={inputClass} />
      </Field>
    </>
  );
}

/** The review, in SP/1's order. */
const REVIEW_GROUPS: { title: string; fields: [string, string][] }[] = [
  {
    title: "Applicant",
    fields: [
      ["claimantOrganizationName", "Organisation"],
      ["claimantFullName", "Name"],
      ["claimantAddress", "Address"],
      ["claimantEmail", "Email"],
      ["claimantPhone", "Phone"],
    ],
  },
  {
    title: "Representative / advocate / agent of applicant",
    fields: [
      ["representativeFullName", "Name"],
      ["representativeOrganizationName", "Firm"],
      ["representativeAddress", "Address"],
      ["representativeEmail", "Email"],
      ["representativePhone", "Phone"],
    ],
  },
  {
    title: "Other party",
    fields: [
      ["respondentOrganizationName", "Organisation"],
      ["respondentFullName", "Name"],
      ["respondentAddress", "Address"],
      ["respondentEmail", "Email"],
      ["respondentPhone", "Phone"],
      ["respondentAdvocateName", "Advocate / agent"],
      ["respondentAdvocateAddress", "Advocate's address"],
      ["respondentAdvocateReference", "File reference"],
    ],
  },
  {
    title: "Architect / contract administrator",
    fields: [
      ["architectName", "Name"],
      ["architectAddress", "Address"],
      ["otherConsultants", "QS / engineer"],
    ],
  },
  {
    title: "Building works & contract",
    fields: [
      ["projectName", "Building works"],
      ["projectLocation", "Location"],
      ["contractReference", "Contract form"],
      ["contractSum", "Contract sum"],
      ["contractSigned", "Contract signed"],
      ["contractExecutionDate", "Contract date"],
      ["basis", "Arbitration agreement"],
      ["arbitrationClause", "Clause"],
    ],
  },
  {
    title: "Dispute",
    fields: [
      ["category", "Matter in dispute"],
      ["description", "Outline"],
      ["priorAdr", "Adjudication / mediation"],
      ["disputeValue", "Approx. sum in dispute"],
      ["venueContractor", "Venue: contractor"],
      ["venueEmployer", "Venue: employer"],
    ],
  },
  { title: "Submitted by", fields: [["submittedBy", "Name"]] },
];

function ApplicationForm({ onDone }: { onDone: () => void }) {
  const formRef = useRef<HTMLFormElement>(null);
  const startedAt = useRef(Date.now());
  const topRef = useRef<HTMLDivElement>(null);
  const [status, setStatus] = useState<Status>({ state: "editing" });
  const [kinds, setKinds] = useState<string[]>([]);
  const [claimantType, setClaimantType] = useState("organization");
  const [respondentType, setRespondentType] = useState("organization");
  const [represented, setRepresented] = useState(false);
  const [otherAdvocate, setOtherAdvocate] = useState(false);
  const [basis, setBasis] = useState("contractual_clause");
  const [files, setFiles] = useState<StagedFile[]>([]);
  const [fileError, setFileError] = useState<string | null>(null);
  const [review, setReview] = useState<{ title: string; rows: [string, string][] }[]>([]);
  const today = new Date().toLocaleDateString("en-GB", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });

  const totalBytes = files.reduce((sum, f) => sum + f.file.size, 0);

  useEffect(() => {
    topRef.current?.scrollIntoView({ block: "start" });
  }, [status.state]);

  const addFiles = (item: string, list: FileList | null) => {
    if (!list) return;
    setFileError(null);
    const next = [...files];
    let total = totalBytes;
    for (const file of Array.from(list)) {
      const ext = file.name.split(".").pop()?.toLowerCase() ?? "";
      if (!ACCEPT.split(",").includes(`.${ext}`)) {
        setFileError(`${file.name}: please use PDF, Word, Excel, JPG or PNG.`);
        continue;
      }
      if (next.length >= MAX_FILES) {
        setFileError(`Up to ${MAX_FILES} files.`);
        break;
      }
      if (total + file.size > MAX_TOTAL_BYTES) {
        setFileError(
          `${file.name} would take the total over ${formatSize(MAX_TOTAL_BYTES)}. Send larger files once the Secretariat replies.`,
        );
        continue;
      }
      total += file.size;
      next.push({ id: crypto.randomUUID(), file, item });
    }
    setFiles(next);
  };

  const toReview = (event: FormEvent) => {
    event.preventDefault();
    const form = formRef.current;
    if (!form) return;
    // At least one "Parties in dispute" box, as on the paper form.
    const firstKind = form.querySelector<HTMLInputElement>('input[name="partiesInDispute[]"]');
    firstKind?.setCustomValidity(kinds.length ? "" : "Tick the parties in dispute.");
    if (!form.reportValidity()) return;
    const data = new FormData(form);
    const currency = String(data.get("currency") ?? "KES");
    const kindNames = kinds
      .map((k) =>
        k === "other"
          ? `Other: ${String(data.get("partiesInDisputeOther") ?? "")}`
          : (PARTY_KINDS.find(([v]) => v === k)?.[1] ?? k),
      )
      .join(", ");
    setReview([
      { title: "Parties in dispute", rows: [["Tick", kindNames]] },
      ...REVIEW_GROUPS.map(({ title, fields }) => ({
        title,
        rows: fields.flatMap(([key, label]): [string, string][] => {
          let value = String(data.get(key) ?? "").trim();
          if (!value) return [];
          if (key === "basis")
            value =
              value === "contractual_clause"
                ? "Arbitration clause in the contract"
                : "Separate arbitration agreement";
          if (key === "disputeValue" || key === "contractSum") value = `${currency} ${value}`;
          if (key === "contractSigned") value = value === "yes" ? "Yes" : "No";
          if (key === "priorAdr")
            value = "A matter in dispute has been the subject of adjudication or mediation";
          if (key === "submittedBy") value = `${value}, ${today}`;
          return [[label, value]];
        }),
      })),
    ]);
    setStatus({ state: "reviewing" });
  };

  const submit = async () => {
    const form = formRef.current;
    if (!form) return;
    setStatus({ state: "sending" });
    const data = new FormData(form);
    data.set("elapsed", String(Date.now() - startedAt.current));
    for (const f of files) {
      data.append("files[]", f.file, f.file.name);
      data.append("documentTypes[]", f.item);
    }
    try {
      const res = await fetch(ENDPOINT, { method: "POST", body: data });
      const body = (await res.json().catch(() => ({}))) as {
        status?: string;
        reference?: string;
        error?: string;
      };
      if (res.ok && body.status === "ok" && body.reference) {
        setStatus({ state: "sent", reference: body.reference });
        return;
      }
      const message =
        res.status === 413
          ? `The documents are too large to send together. Keep them under ${formatSize(MAX_TOTAL_BYTES)} in total, and send the rest once the Secretariat replies.`
          : res.status === 429
            ? "Several applications have come from this connection in the last hour. Please try again later."
            : res.status === 400 && body.error
              ? `Please check ${body.error}.`
              : "The application couldn't be sent just now.";
      setStatus({ state: "error", message });
    } catch {
      setStatus({ state: "error", message: "The application couldn't be sent just now." });
    }
  };

  const reviewing =
    status.state === "reviewing" || status.state === "sending" || status.state === "error";

  return (
    <div ref={topRef}>
      {/* SP/1's title band, in the system's red. */}
      <div className="bg-ledger-red px-6 pt-6 pb-5 pr-24 text-white">
        <h2
          id="sp1-title"
          className="m-0 text-[22px] font-semibold uppercase leading-[1.1] tracking-[-0.01em] sm:text-[27px]"
        >
          Application to the President for appointment of arbitrator
        </h2>
      </div>
      <div className="border-b border-ledger-ink px-6 pt-4 pb-[18px]">
        <p
          id="sp1-description"
          className="font-mono text-[10.5px] uppercase tracking-[0.1em] text-ledger-muted"
        >
          {status.state === "sent"
            ? "Application received"
            : reviewing
              ? "Review · nothing is sent yet"
              : "Form SP/1 · Statement of particulars: JCT or other main building contract"}
        </p>
        {status.state === "editing" ? (
          <p className="mt-2 text-[12.5px] text-ledger-ink-2">
            To be completed by or on behalf of the applicant(s), and returned together with the
            appointment fees.
          </p>
        ) : null}
      </div>

      {status.state === "sent" ? (
        <div className="flex flex-col gap-5 px-6 py-5">
          <div className="flex items-baseline gap-3">
            <span className="flex-[0_0_140px] font-mono text-[10.5px] uppercase text-ledger-muted">
              Reference
            </span>
            <span className="font-mono text-[15px] font-medium text-ledger-ink">
              {status.reference}
            </span>
          </div>
          <p className="text-[13.5px] text-ledger-ink-2">
            The Association&rsquo;s Secretariat has your application. A copy is on its way to your
            email; please quote the reference when you write to the Secretariat.
          </p>
          <div>
            <button type="button" onClick={onDone} className={secondaryButton}>
              Close
            </button>
          </div>
        </div>
      ) : null}

      {reviewing ? (
        <div className="flex flex-col gap-5 px-6 py-5">
          {[
            ...review,
            {
              title: "Documents",
              rows: files.map((f): [string, string] => [ITEM_LABEL[f.item] ?? f.item, f.file.name]),
            },
          ]
            .filter((group) => group.rows.length || group.title === "Documents")
            .map((group) => (
              <section key={group.title}>
                <h3 className="mb-2 font-mono text-[9.5px] uppercase tracking-[0.12em] text-ledger-muted">
                  {group.title}
                </h3>
                {group.rows.length ? (
                  <div className="flex flex-col gap-1.5">
                    {group.rows.map(([label, value], i) => (
                      <div
                        key={`${label}-${i}`}
                        className="flex flex-col gap-0.5 sm:flex-row sm:items-baseline sm:gap-3"
                      >
                        <span className="font-mono text-[10.5px] uppercase text-ledger-muted sm:flex-[0_0_180px]">
                          {label}
                        </span>
                        <span className="flex-1 whitespace-pre-wrap break-words text-[13.5px] text-ledger-ink">
                          {value}
                        </span>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-[13px] text-ledger-muted">
                    No documents attached - send them once the Secretariat replies.
                  </p>
                )}
              </section>
            ))}
          {status.state === "error" ? (
            <p role="alert" className="text-[13px] text-ledger-red">
              {status.message} If it keeps happening, write to{" "}
              <a className="underline" href="mailto:aak@aak.or.ke">
                aak@aak.or.ke
              </a>
              .
            </p>
          ) : null}
          <div className="flex flex-wrap gap-3">
            <button
              type="button"
              onClick={() => setStatus({ state: "editing" })}
              disabled={status.state === "sending"}
              className={secondaryButton}
            >
              Back to edit
            </button>
            <button
              type="button"
              onClick={submit}
              disabled={status.state === "sending"}
              className={primaryButton}
            >
              {status.state === "sending" ? "Submitting..." : "Confirm & submit application"}
            </button>
          </div>
        </div>
      ) : null}

      {/* Kept mounted while reviewing so nothing typed is lost. */}
      <form
        ref={formRef}
        onSubmit={toReview}
        hidden={reviewing || status.state === "sent"}
        className="flex flex-col gap-6 px-6 py-5"
      >
        <FormSection step="01" title="Parties in dispute" note="Tick as appropriate.">
          <div className="flex flex-wrap gap-x-6 gap-y-2 sm:col-span-2">
            {PARTY_KINDS.map(([value, label]) => (
              <label key={value} className="flex items-center gap-2 text-[13px] text-ledger-ink">
                <input
                  type="checkbox"
                  name="partiesInDispute[]"
                  value={value}
                  checked={kinds.includes(value)}
                  onChange={(e) => {
                    e.currentTarget.form
                      ?.querySelector<HTMLInputElement>('input[name="partiesInDispute[]"]')
                      ?.setCustomValidity("");
                    setKinds((k) =>
                      e.target.checked ? [...k, value] : k.filter((x) => x !== value),
                    );
                  }}
                  className={checkClass}
                />
                {label}
              </label>
            ))}
          </div>
          {kinds.includes("other") ? (
            <Field label="Other (please state)">
              <input name="partiesInDisputeOther" required maxLength={100} className={inputClass} />
            </Field>
          ) : null}
        </FormSection>

        <FormSection step="02" title="Applicant party" note="Name and address, plus email.">
          <PartyFields role="claimant" type={claimantType} onType={setClaimantType} />
          <label className="flex items-start gap-2.5 text-[13px] text-ledger-ink sm:col-span-2">
            <input
              type="checkbox"
              checked={represented}
              onChange={(e) => setRepresented(e.target.checked)}
              className={checkClass}
            />
            The applicant has a representative, advocate or agent
          </label>
          {represented ? (
            <>
              <Field label="Representative / advocate / agent">
                <input
                  name="representativeFullName"
                  required
                  maxLength={255}
                  className={inputClass}
                />
              </Field>
              <Field label="Firm (optional)">
                <input
                  name="representativeOrganizationName"
                  maxLength={255}
                  className={inputClass}
                />
              </Field>
              <Field label="Email">
                <input
                  name="representativeEmail"
                  type="email"
                  required
                  maxLength={254}
                  className={inputClass}
                />
              </Field>
              <Field label="Phone (optional)">
                <input
                  name="representativePhone"
                  type="tel"
                  maxLength={50}
                  className={inputClass}
                />
              </Field>
              <Field label="Address (optional)" className="sm:col-span-2">
                <input name="representativeAddress" maxLength={500} className={inputClass} />
              </Field>
            </>
          ) : null}
        </FormSection>

        <FormSection step="03" title="Other party" note="Name and address, plus email.">
          <PartyFields role="respondent" type={respondentType} onType={setRespondentType} />
          <label className="flex items-start gap-2.5 text-[13px] text-ledger-ink sm:col-span-2">
            <input
              type="checkbox"
              checked={otherAdvocate}
              onChange={(e) => setOtherAdvocate(e.target.checked)}
              className={checkClass}
            />
            An advocate or agent acts for the other party
          </label>
          {otherAdvocate ? (
            <>
              <Field label="Advocate / agent">
                <input
                  name="respondentAdvocateName"
                  required
                  maxLength={255}
                  className={inputClass}
                />
              </Field>
              <Field label="File reference (optional)">
                <input name="respondentAdvocateReference" maxLength={100} className={inputClass} />
              </Field>
              <Field label="Address (optional)" className="sm:col-span-2">
                <input name="respondentAdvocateAddress" maxLength={500} className={inputClass} />
              </Field>
            </>
          ) : null}
        </FormSection>

        <FormSection
          step="04"
          title="Architect"
          note="The architect (or contract administrator / supervising officer) appointed by the employer, and the quantity surveyor and/or consulting engineer where relevant."
        >
          <Field label="Name (optional)">
            <input name="architectName" maxLength={255} className={inputClass} />
          </Field>
          <Field label="Address (optional)">
            <input name="architectAddress" maxLength={500} className={inputClass} />
          </Field>
          <Field
            label="Quantity surveyor / consulting engineer (optional)"
            className="sm:col-span-2"
          >
            <input name="otherConsultants" maxLength={500} className={inputClass} />
          </Field>
        </FormSection>

        <FormSection step="05" title="Building works and contract">
          <Field label="Description of building works">
            <input name="projectName" required maxLength={255} className={inputClass} />
          </Field>
          <Field label="Location">
            <input name="projectLocation" required maxLength={255} className={inputClass} />
          </Field>
          <Field label="Title of contract form" hint="i.e. JBC or other">
            <input name="contractReference" required maxLength={150} className={inputClass} />
          </Field>
          <Field label="Contract sum (optional)">
            <input
              name="contractSum"
              inputMode="decimal"
              pattern="[0-9][0-9, ]*(\.[0-9]{1,2})?"
              title="An amount, e.g. 25,000,000"
              className={cn(inputClass, "font-mono")}
            />
          </Field>
          <fieldset className="flex flex-col gap-1.5">
            <legend className={cn(monoLabel, "mb-1.5")}>Is the contract signed?</legend>
            <div className="flex gap-6 py-1.5 text-[13px] text-ledger-ink">
              {[
                ["yes", "Yes"],
                ["no", "No"],
              ].map(([value, label]) => (
                <label key={value} className="flex items-center gap-2">
                  <input
                    type="radio"
                    name="contractSigned"
                    value={value}
                    required
                    className={checkClass}
                  />
                  {label}
                </label>
              ))}
            </div>
          </fieldset>
          <Field label="Contract date (optional)">
            <input name="contractExecutionDate" type="date" className={inputClass} />
          </Field>
          <Field label="Arbitration agreement" className="sm:col-span-2">
            <select
              name="basis"
              value={basis}
              onChange={(e) => setBasis(e.target.value)}
              className={inputClass}
            >
              <option value="contractual_clause">Arbitration clause in the contract</option>
              <option value="mutual_agreement">Separate arbitration agreement</option>
            </select>
          </Field>
          <Field
            label="Arbitration clause (optional)"
            hint="Its number, or paste the wording. A copy of the arbitration agreement, or the contract containing it, goes under Documents."
            className="sm:col-span-2"
          >
            <textarea
              name="arbitrationClause"
              rows={2}
              maxLength={5000}
              className={textareaClass}
            />
          </Field>
        </FormSection>

        <FormSection step="06" title="The dispute">
          <Field
            label="Matter in dispute"
            hint="e.g. quality of workmanship; claim for extension of time; payments; or consultant's misconduct"
          >
            <input
              name="category"
              required
              maxLength={100}
              list="arbitration-matters"
              className={inputClass}
            />
            <datalist id="arbitration-matters">
              {MATTER_SUGGESTIONS.map((c) => (
                <option key={c} value={c} />
              ))}
            </datalist>
          </Field>
          <Field label="Approximate sum of money in dispute">
            <div className="flex gap-2">
              <input
                name="disputeValue"
                required
                inputMode="decimal"
                pattern="[0-9][0-9, ]*(\.[0-9]{1,2})?"
                title="An amount, e.g. 2,500,000"
                className={cn(inputClass, "font-mono")}
              />
              <select
                name="currency"
                defaultValue="KES"
                aria-label="Currency"
                className={cn(inputClass, "flex-[0_0_80px] font-mono")}
              >
                {CURRENCIES.map((c) => (
                  <option key={c}>{c}</option>
                ))}
              </select>
            </div>
          </Field>
          <Field label="Brief outline of the matter(s) in dispute" className="sm:col-span-2">
            <textarea
              name="description"
              required
              rows={5}
              maxLength={10000}
              className={textareaClass}
            />
          </Field>
          <label className="flex items-start gap-2.5 text-[13px] text-ledger-ink sm:col-span-2">
            <input type="checkbox" name="priorAdr" value="yes" className={checkClass} />A matter in
            dispute has been the subject of adjudication or mediation (for AAK records)
          </label>
        </FormSection>

        <FormSection step="07" title="Preferences as to venue for the arbitration hearing">
          <Field label="(a) Contractor (optional)">
            <input name="venueContractor" maxLength={255} className={inputClass} />
          </Field>
          <Field label="(b) Employer (optional)">
            <input name="venueEmployer" maxLength={255} className={inputClass} />
          </Field>
        </FormSection>

        <FormSection
          step="08"
          title="Attach documents"
          note={`PDF, Word, Excel, JPG or PNG, up to ${formatSize(MAX_TOTAL_BYTES)} in total. Anything not to hand can be sent once the Secretariat replies.`}
        >
          <ul className="flex flex-col divide-y divide-ledger-hairline border-y border-ledger-hairline sm:col-span-2">
            {DOCUMENT_ITEMS.map(([item, label]) => {
              const attached = files.filter((f) => f.item === item);
              return (
                <li key={item} className="py-3">
                  <div className="flex flex-wrap items-start justify-between gap-3">
                    <span className="flex items-start gap-2.5 text-[12.5px] uppercase leading-snug tracking-[0.02em] text-ledger-ink">
                      <span
                        aria-hidden="true"
                        className={cn(
                          "mt-0.5 flex h-3.5 w-3.5 shrink-0 items-center justify-center border text-[10px] leading-none",
                          attached.length
                            ? "border-ledger-red bg-ledger-red text-white"
                            : "border-ledger-ink-2",
                        )}
                      >
                        {attached.length ? "✓" : ""}
                      </span>
                      <span className="max-w-[46ch]">{label}</span>
                    </span>
                    <label className={cn(secondaryButton, "min-h-[27px] px-3 text-[11.5px]")}>
                      Attach
                      <span className="sr-only">: {label}</span>
                      <input
                        type="file"
                        multiple
                        accept={ACCEPT}
                        className="sr-only"
                        onChange={(e) => {
                          addFiles(item, e.target.files);
                          e.target.value = "";
                        }}
                      />
                    </label>
                  </div>
                  {attached.length ? (
                    <ul className="mt-2 flex flex-col gap-1.5 pl-6">
                      {attached.map((f) => (
                        <li key={f.id} className="flex flex-wrap items-baseline gap-2 text-[13px]">
                          <span className="min-w-0 truncate font-medium text-ledger-ink">
                            {f.file.name}
                          </span>
                          <span className="font-mono text-[10.5px] uppercase text-ledger-muted">
                            {formatSize(f.file.size)}
                          </span>
                          <button
                            type="button"
                            onClick={() => setFiles(files.filter((x) => x.id !== f.id))}
                            className="ml-auto cursor-pointer border-0 border-b border-ledger-ink bg-transparent py-px text-[11.5px] text-ledger-ink hover:border-ledger-red hover:text-ledger-red"
                          >
                            Remove<span className="sr-only"> {f.file.name}</span>
                          </button>
                        </li>
                      ))}
                    </ul>
                  ) : null}
                </li>
              );
            })}
          </ul>
          {fileError ? (
            <p role="alert" className="text-[12.5px] text-ledger-red sm:col-span-2">
              {fileError}
            </p>
          ) : null}
          {files.length ? (
            <p className="font-mono text-[10.5px] uppercase text-ledger-muted sm:col-span-2">
              {files.length} file{files.length === 1 ? "" : "s"} · {formatSize(totalBytes)} of{" "}
              {formatSize(MAX_TOTAL_BYTES)}
            </p>
          ) : null}
        </FormSection>

        <FormSection step="09" title="This statement of particulars submitted by">
          <Field label="Name">
            <input
              name="submittedBy"
              required
              maxLength={255}
              autoComplete="name"
              className={inputClass}
            />
          </Field>
          <Field label="Date">
            <input value={today} readOnly tabIndex={-1} className={cn(inputClass, "font-mono")} />
          </Field>
          <label className="flex items-start gap-2.5 text-[12.5px] text-ledger-ink-2 sm:col-span-2">
            <input type="checkbox" name="declaration" value="yes" required className={checkClass} />
            <span>
              The particulars in this statement are accurate, and AAK may use them, and the
              documents, to handle the application. They are emailed to the Association&rsquo;s
              Secretariat and not kept on this website.
            </span>
          </label>
          {/* Left empty by people; filled in by spam scripts. */}
          <div aria-hidden="true" className="absolute -left-[9999px] h-px w-px overflow-hidden">
            <label>
              Website
              <input name="website" tabIndex={-1} autoComplete="off" />
            </label>
          </div>
          <div className="sm:col-span-2">
            <button type="submit" className={primaryButton}>
              Review before submitting
            </button>
          </div>
        </FormSection>
      </form>
    </div>
  );
}

/**
 * The button that opens the application, and the pop-up itself: a native
 * <dialog>, so it stays in the page while closed (what's been typed is kept)
 * and, only while open, makes the rest of the page inert, traps focus and
 * closes on Esc.
 */
export function ArbitrationApplication({
  label = "Apply for appointment of an arbitrator",
}: {
  label?: string;
}) {
  const dialogRef = useRef<HTMLDialogElement>(null);
  // A new, empty form after a successful application.
  const [formKey, setFormKey] = useState(0);

  const open = () => {
    dialogRef.current?.showModal();
    document.documentElement.style.overflow = "hidden";
  };
  const close = () => dialogRef.current?.close();

  return (
    <>
      <button type="button" onClick={open} aria-haspopup="dialog" className="group btn-primary">
        {label}
        <ArrowUpRight className="h-4 w-4" />
      </button>
      <dialog
        ref={dialogRef}
        aria-labelledby="sp1-title"
        aria-describedby="sp1-description"
        onClose={() => {
          document.documentElement.style.overflow = "";
        }}
        className="m-0 h-full max-h-none w-full max-w-none overflow-y-auto border-0 bg-ledger-paper p-0 font-sans text-ledger-ink [font-variant-numeric:tabular-nums] backdrop:bg-ledger-ink/60 sm:mx-auto sm:mt-[4vh] sm:h-auto sm:max-h-[92vh] sm:w-[min(760px,calc(100vw-2rem))] sm:border sm:border-ledger-ink"
      >
        <ApplicationForm
          key={formKey}
          onDone={() => {
            close();
            setFormKey((k) => k + 1);
          }}
        />
        <button
          type="button"
          onClick={close}
          className="absolute top-5 right-5 inline-flex cursor-pointer items-center gap-1.5 border-0 bg-transparent font-mono text-[10.5px] uppercase tracking-[0.1em] text-white/85 hover:text-white"
        >
          Close
          <X className="h-3.5 w-3.5" aria-hidden="true" />
        </button>
      </dialog>
    </>
  );
}
