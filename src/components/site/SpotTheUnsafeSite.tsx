import { useState } from "react";
import { IconArrowUpRight as ArrowUpRight, IconEye as Eye } from "@tabler/icons-react";
import { fileUrl } from "@/lib/files";

const REPORT_FORM = "https://forms.cloud.microsoft/r/h1TCEjvRNz?origin=lprLink";
const REPORT_PDF = fileUrl("/documents/Mulika-Mjengo-Report-2025.pdf");

/**
 * The eight problems, each as the Mulika Mjengo Report 2025 records it in
 * "Key Issues Identified from the Site Inspections" (pp. 9–11): `body`
 * follows the report's own wording; "Photographed:" lines are the report's
 * photo captions; `pages` are the report pages they come from (the PDF's page
 * numbers match the printed ones). Change nothing here without the report.
 * `x`, `y`: where the problem is in the drawing (its 800 × 480 frame).
 */
const PROBLEMS = [
  {
    id: "site-board",
    x: 650,
    y: 318,
    title: "No proper site board",
    body: "The team noted no site board at the entrance of some construction sites, and boards lacking complete information, such as missing approval numbers from the county government, NCA or NEMA.",
    photographed: "a missing site board in Ridgeways Estate.",
    pages: [10],
  },
  {
    id: "stop-work",
    x: 230,
    y: 358,
    title: "Building through a stop-work notice",
    body: "Some construction works were proceeding despite stop-work notices from the relevant authorities.",
    photographed: "a stop-work notice issued to a project in Westlands.",
    pages: [10],
  },
  {
    id: "ppe",
    x: 470,
    y: 240,
    title: "No protective gear",
    body: "Workers lacked personal protective equipment (PPE), or were provided with insufficient equipment.",
    photographed: "workers lacking PPE in Kilimani and in Tassia.",
    pages: [11],
  },
  {
    id: "netting",
    x: 578,
    y: 198,
    title: "No safety netting",
    body: "The team observed missing safety signage, safety netting for arresting debris, scaffolding and site hoarding.",
    photographed: null,
    pages: [11],
  },
  {
    id: "cracks",
    x: 372,
    y: 298,
    title: "Cracks and honeycombing",
    body: "Significant structural integrity issues at several inspected sites, including honeycombing and large cracks in some developments.",
    photographed: "honeycombing on an active construction in Kamulu.",
    pages: [9, 10],
  },
  {
    id: "effluent",
    x: 618,
    y: 440,
    title: "Effluent on the road",
    body: "Discharge of untreated effluent onto the road, posing significant health risks to neighbouring developments.",
    photographed: "discharge of effluent along Muchai Drive, and untreated effluent in Kamulu.",
    pages: [11],
  },
  {
    id: "riparian",
    x: 70,
    y: 424,
    title: "Debris in the river reserve",
    body: "Illegal construction on wetlands, playgrounds, public land and green spaces, and dumping of debris into riparian reserves and green spaces, reported in South C, Karen, Kangemi, KALRO, Chaani and Parklands.",
    photographed: null,
    pages: [11],
  },
  {
    id: "road-reserve",
    x: 492,
    y: 418,
    title: "Building on the road reserve",
    body: "Among the sites the report shows: building on the road reserve, and the building line not observed.",
    photographed:
      "construction on the road reserve in Tassia, Embakasi; lack of observance of the building line in Pangani; beacon-to-beacon construction in South C.",
    pages: [9, 10],
  },
] as const;

type Problem = (typeof PROBLEMS)[number];
type ProblemId = Problem["id"];

/** "Mulika Mjengo Report 2025, p. 10", each page linked to that page of the PDF. */
function Source({ pages, className }: { pages: readonly number[]; className?: string }) {
  return (
    <p className={className}>
      Source: Mulika Mjengo Report 2025, {pages.length > 1 ? "pp." : "p."}{" "}
      {pages.map((page, i) => (
        <span key={page}>
          {i > 0 ? ", " : null}
          <a
            href={`${REPORT_PDF}#page=${page}`}
            target="_blank"
            rel="noopener noreferrer"
            className="underline underline-offset-2 hover:text-foreground"
          >
            {page}
          </a>
        </span>
      ))}
    </p>
  );
}

/** A problem's explanation: the report's finding, its photo caption, its source. */
function Finding({ problem }: { problem: Problem }) {
  return (
    <>
      {problem.body}
      {problem.photographed ? (
        <>
          {" "}
          <span className="italic">Photographed: {problem.photographed}</span>
        </>
      ) : null}
    </>
  );
}

/**
 * "Spot the unsafe site": an illustration of a construction site with the
 * eight problems the Mulika Mjengo Report 2025 records from AAK's inspections
 * of reported sites. Tapping one marks it and gives the report's finding with
 * its source page; finding all eight leads on to reporting a site. The list
 * of problems is readable without playing (and "Show all" reveals them).
 */
export function SpotTheUnsafeSite() {
  const [found, setFound] = useState<ProblemId[]>([]);
  const [current, setCurrent] = useState<ProblemId | null>(null);
  const done = found.length === PROBLEMS.length;
  const shown = PROBLEMS.find((p) => p.id === current);

  const find = (id: ProblemId) => {
    setFound((list) => (list.includes(id) ? list : [...list, id]));
    setCurrent(id);
  };

  return (
    <div className="grid gap-8 lg:grid-cols-[minmax(0,1.6fr)_minmax(0,1fr)] lg:items-start">
      <div className="spot-scene relative overflow-hidden rounded-2xl border border-border bg-background">
        <SiteDrawing />
        {PROBLEMS.map((p) => {
          const index = found.indexOf(p.id);
          return (
            <button
              key={p.id}
              type="button"
              onClick={() => find(p.id)}
              data-found={index >= 0 || undefined}
              className="spot-hotspot"
              style={{ left: `${(p.x / 800) * 100}%`, top: `${(p.y / 480) * 100}%` }}
              aria-label={index >= 0 ? `Found: ${p.title}` : "Something looks wrong here"}
            >
              {index >= 0 ? <span className="spot-number">{index + 1}</span> : null}
            </button>
          );
        })}
      </div>

      <div>
        <p className="meta-label text-muted-foreground" aria-live="polite">
          {done ? "All eight found" : `Found ${found.length} of ${PROBLEMS.length}`}
        </p>
        <div className="mt-3 flex gap-1.5" aria-hidden="true">
          {PROBLEMS.map((p, i) => (
            <span
              key={p.id}
              className={
                i < found.length
                  ? "h-1.5 flex-1 rounded-full bg-primary"
                  : "h-1.5 flex-1 rounded-full bg-border"
              }
            />
          ))}
        </div>

        <div
          className="mt-6 min-h-[11rem] rounded-2xl border border-border bg-secondary/40 p-6"
          aria-live="polite"
        >
          {shown ? (
            <>
              <p className="font-display text-xl font-semibold text-foreground">{shown.title}</p>
              <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
                <Finding problem={shown} />
              </p>
              <Source pages={shown.pages} className="mt-3 text-xs text-muted-foreground" />
            </>
          ) : (
            <p className="text-sm leading-relaxed text-muted-foreground">
              This illustration shows eight problems that the Mulika Mjengo Report 2025 records from
              AAK&rsquo;s inspections of reported sites in Nairobi County. Tap each one you can
              spot.
            </p>
          )}
        </div>

        {done ? (
          <div className="mt-6 rounded-2xl bg-ink-deep p-6 text-background">
            <p className="font-display text-xl font-semibold">You found them all.</p>
            <p className="mt-2 text-sm leading-relaxed text-background/80">
              Seen something like this near you? Report it to Mulika Mjengo.
            </p>
            <div className="mt-5 flex flex-wrap items-center gap-x-6 gap-y-3">
              <a
                href={REPORT_FORM}
                target="_blank"
                rel="noopener noreferrer"
                className="btn-primary"
              >
                Report an unsafe building
                <ArrowUpRight className="h-4 w-4" aria-hidden="true" />
              </a>
              <a
                href={REPORT_PDF}
                target="_blank"
                rel="noopener noreferrer"
                className="text-sm font-semibold text-background underline underline-offset-4"
              >
                Read the Mulika Mjengo Report 2025
              </a>
            </div>
          </div>
        ) : (
          <button
            type="button"
            onClick={() => {
              setFound(PROBLEMS.map((p) => p.id));
              setCurrent(null);
            }}
            className="mt-5 inline-flex items-center gap-2 text-sm font-semibold text-foreground underline-offset-4 hover:underline"
          >
            <Eye className="h-4 w-4 text-primary" aria-hidden="true" />
            Show all eight
          </button>
        )}

        <details className="mt-6 text-sm">
          <summary className="cursor-pointer font-semibold text-foreground">
            The eight problems, as a list
          </summary>
          <ol className="mt-3 list-decimal space-y-3 pl-5 text-muted-foreground">
            {PROBLEMS.map((p) => (
              <li key={p.id}>
                <span className="font-semibold text-foreground">{p.title}.</span>{" "}
                <Finding problem={p} />
                <Source pages={p.pages} className="mt-1 text-xs" />
              </li>
            ))}
          </ol>
          <p className="mt-3 text-xs text-muted-foreground">
            All eight from the Mulika Mjengo Report 2025, &ldquo;Key Issues Identified from the Site
            Inspections&rdquo; (pp. 9&ndash;11), which covers the 26 reported sites the team
            inspected in Nairobi County (p. 6). The drawing is an illustration, not a real site.
          </p>
        </details>
      </div>
    </div>
  );
}

/** The site, in line drawing: river, road, hoarding, frame, workers, board. */
function SiteDrawing() {
  const columns = [310, 370, 430, 490, 550];
  const slabs = [330, 268, 206, 144];
  return (
    <svg
      viewBox="0 0 800 480"
      className="block h-auto w-full text-foreground"
      fill="none"
      stroke="currentColor"
      strokeWidth={1.4}
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      {/* Ground, road, kerb and centre line */}
      <line x1={0} y1={392} x2={800} y2={392} />
      <path d="M150 410 H800 M150 470 H800" />
      <path
        d="M170 440 h30 M230 440 h30 M290 440 h30 M350 440 h30 M410 440 h30 M470 440 h30 M530 440 h30 M650 440 h30 M710 440 h30 M770 440 h30"
        opacity={0.6}
      />
      {/* Road reserve: beacons and the line between them */}
      <path d="M320 404 H640" strokeDasharray="3 5" opacity={0.7} />
      <path d="M320 396 v12 M640 396 v12" />
      <text x={600} y={403} className="spot-label">
        ROAD RESERVE
      </text>

      {/* River, and the rubble dumped on its bank */}
      <path
        d="M0 392 Q70 386 120 392 L150 480 H0 Z"
        fill="color-mix(in oklab, #3b82f6 10%, transparent)"
        stroke="none"
      />
      <path d="M120 392 L150 480" />
      <path
        d="M8 430 q10 -5 20 0 t20 0 t20 0 M30 452 q10 -5 20 0 t20 0 t20 0 M60 470 q10 -5 20 0 t20 0"
        stroke="#3b82f6"
        opacity={0.7}
      />
      <path
        d="M40 420 l14 -16 l10 8 l12 -12 l14 18 z M86 424 l10 -10 l12 6 l4 10 z M52 426 h12 v-8 h-12 z"
        fill="color-mix(in oklab, currentColor 12%, transparent)"
      />

      {/* Hoarding, with a stop-work notice pasted on it */}
      <path d="M165 392 V330 H295 V392" />
      {Array.from({ length: 12 }, (_, i) => (
        <line key={i} x1={175 + i * 10} y1={332} x2={175 + i * 10} y2={392} opacity={0.35} />
      ))}
      <rect
        x={203}
        y={343}
        width={54}
        height={30}
        fill="var(--background)"
        stroke="var(--primary)"
        strokeWidth={1.8}
      />
      <text x={230} y={356} textAnchor="middle" className="spot-label spot-label-red">
        STOP WORK
      </text>
      <text x={230} y={367} textAnchor="middle" className="spot-label spot-label-small">
        NOTICE
      </text>

      {/* The concrete frame going up: slabs, columns, starter bars */}
      {slabs.map((y) => (
        <rect
          key={y}
          x={300}
          y={y}
          width={262}
          height={7}
          fill="color-mix(in oklab, currentColor 8%, transparent)"
        />
      ))}
      {columns.map((x) => (
        <line key={x} x1={x} y1={151} x2={x} y2={392} />
      ))}
      {columns.map((x) => (
        <path key={`r${x}`} d={`M${x - 3} 144 v-20 M${x + 3} 144 v-16`} opacity={0.7} />
      ))}
      {/* A cracked, honeycombed column */}
      <path d="M370 276 l6 10 l-8 10 l7 10 l-6 12" stroke="var(--foreground)" strokeWidth={1.8} />
      <path
        d="M362 292 h0.1 M378 300 h0.1 M364 306 h0.1 M380 288 h0.1 M366 296 h0.1"
        strokeWidth={3}
      />

      {/* Debris falling from the unnetted top floor */}
      <rect x={570} y={166} width={8} height={7} transform="rotate(20 574 170)" />
      <rect x={582} y={196} width={6} height={6} transform="rotate(-15 585 199)" />
      <rect x={572} y={226} width={7} height={5} transform="rotate(35 575 228)" />
      <path d="M566 158 v8 M588 188 v6 M578 216 v7" opacity={0.5} />

      {/* A worker in a hard hat and vest, at ground level */}
      <g>
        <circle cx={338} cy={360} r={6} />
        <path d="M331 358 a7 7 0 0 1 14 0 z" fill="#f2b705" stroke="#b58500" />
        <path d="M338 366 v14 M338 370 l-8 6 M338 370 l8 5 M338 380 l-6 12 M338 380 l6 12" />
        <path d="M334 368 h8 v8 h-8 z" fill="#f28c05" stroke="none" opacity={0.85} />
      </g>
      {/* A worker with no protective gear, up on a slab */}
      <g>
        <circle cx={470} cy={236} r={6} />
        <path d="M470 242 v14 M470 246 l-8 5 M470 246 l9 -3 M470 256 l-6 12 M470 256 l6 12" />
      </g>

      {/* Site shed over the road-reserve line */}
      <rect x={446} y={372} width={92} height={46} fill="var(--background)" />
      <path d="M440 372 L492 356 L544 372" />
      <rect x={462} y={386} width={16} height={32} />
      <rect x={498} y={384} width={26} height={14} />

      {/* A pipe draining onto the road */}
      <path
        d="M556 384 h22 q8 0 8 8 v28"
        strokeWidth={4}
        stroke="color-mix(in oklab, currentColor 55%, transparent)"
      />
      <ellipse
        cx={612}
        cy={444}
        rx={34}
        ry={9}
        fill="color-mix(in oklab, #8b5a2b 45%, transparent)"
        stroke="#8b5a2b"
      />
      <path d="M586 422 q2 8 6 14 M590 428 v8" stroke="#8b5a2b" />

      {/* Site board on two posts: approval numbers left blank */}
      <path d="M612 392 V346 M688 392 V346" />
      <rect x={596} y={290} width={108} height={58} fill="var(--background)" />
      <text x={650} y={304} textAnchor="middle" className="spot-label">
        SITE BOARD
      </text>
      <text x={604} y={318} className="spot-label spot-label-small">
        COUNTY No.:
      </text>
      <text x={604} y={330} className="spot-label spot-label-small">
        NCA No.:
      </text>
      <text x={604} y={342} className="spot-label spot-label-small">
        NEMA No.:
      </text>
      <path d="M654 318 h42 M648 330 h48 M652 342 h44" strokeDasharray="2 3" opacity={0.6} />

      {/* Tower crane */}
      <path
        d="M744 392 V92 M736 392 V92 M736 120 l8 -14 M736 150 l8 -14 M736 180 l8 -14 M736 210 l8 -14 M736 240 l8 -14 M736 270 l8 -14 M736 300 l8 -14 M736 330 l8 -14 M736 360 l8 -14"
        opacity={0.8}
      />
      <path d="M640 92 H796 M640 92 l100 -18 M796 92 l-52 -18" />
      <path d="M680 92 v52" strokeWidth={1} />
      <path d="M674 144 h12 l-6 8 z" />
    </svg>
  );
}
