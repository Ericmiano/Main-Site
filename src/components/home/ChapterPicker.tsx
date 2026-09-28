import { useState } from "react";
import { IconArrowRight as ArrowRight } from "@tabler/icons-react";
import { Link } from "@tanstack/react-router";
import { chapters, membershipFees } from "@/data/site";
import { cn } from "@/lib/utils";

const REGISTER_URL = "https://members.aak.or.ke/register";

// Only categories whose names say who they're for; "qualified" deliberately
// shows both options rather than guessing between them.
const stages = [
  { id: "student", label: "Student", categories: ["Student"] },
  { id: "graduate", label: "Recent graduate", categories: ["Graduate"] },
  { id: "technician", label: "Technician", categories: ["Technician"] },
  { id: "qualified", label: "Qualified professional", categories: ["Corporate", "Licentiate"] },
];

const chip = (selected: boolean) =>
  cn(
    "rounded-full border px-4 py-2 text-sm font-medium transition-colors",
    selected
      ? "border-foreground bg-foreground text-background"
      : "border-foreground/25 text-foreground hover:border-foreground",
  );

export function ChapterPicker() {
  const [chapterSlug, setChapterSlug] = useState<string | null>(null);
  const [stageId, setStageId] = useState<string | null>(null);
  const chapter = chapters.find((c) => c.slug === chapterSlug);
  const stage = stages.find((s) => s.id === stageId);
  const fees = stage ? membershipFees.filter((f) => stage.categories.includes(f.category)) : [];

  return (
    <div className="mt-16 border-t border-foreground/15 pt-10">
      <p className="meta-label text-foreground/60">Find your fit</p>
      <h3 className="type-title mt-3 sm:text-3xl">Which chapter, and which membership?</h3>

      <div className="mt-8 grid gap-8 lg:grid-cols-[1.4fr_1fr] lg:gap-14">
        <div className="space-y-7">
          <fieldset>
            <legend className="text-sm font-semibold">1. Your discipline</legend>
            <div className="mt-3 flex flex-wrap gap-2">
              {chapters.map((c) => (
                <button
                  key={c.slug}
                  type="button"
                  aria-pressed={c.slug === chapterSlug}
                  onClick={() => setChapterSlug(c.slug)}
                  className={chip(c.slug === chapterSlug)}
                >
                  {c.name}
                </button>
              ))}
            </div>
          </fieldset>
          <fieldset>
            <legend className="text-sm font-semibold">2. Where you are in your career</legend>
            <div className="mt-3 flex flex-wrap gap-2">
              {stages.map((s) => (
                <button
                  key={s.id}
                  type="button"
                  aria-pressed={s.id === stageId}
                  onClick={() => setStageId(s.id)}
                  className={chip(s.id === stageId)}
                >
                  {s.label}
                </button>
              ))}
            </div>
          </fieldset>
        </div>

        <div
          aria-live="polite"
          className="flex min-h-56 flex-col bg-background p-6 text-foreground shadow-xl lg:p-8"
        >
          {chapter && stage ? (
            <>
              <p className="meta-label text-muted-foreground">Your route in</p>
              <p className="mt-3 font-display text-2xl font-semibold leading-snug">
                {chapter.name} Chapter
              </p>
              <p className="mt-1 text-sm text-muted-foreground">{chapter.tagline}</p>
              <dl className="mt-5 space-y-2 border-t border-border pt-4 text-sm">
                {fees.map((f) => (
                  <div key={f.category} className="flex flex-wrap justify-between gap-x-4">
                    <dt className="font-semibold">{f.category} member</dt>
                    <dd className="text-muted-foreground">
                      Entrance {f.entrance === "None" ? "none" : `KES ${f.entrance}`} &middot;
                      Annual KES {f.annual}
                    </dd>
                  </div>
                ))}
              </dl>
              {fees.length > 1 ? (
                <p className="mt-3 text-xs text-muted-foreground">
                  The membership page explains which of these applies to you.
                </p>
              ) : null}
              <div className="mt-auto flex flex-wrap items-center gap-x-6 gap-y-3 pt-6">
                <a
                  href={REGISTER_URL}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group btn-primary"
                >
                  Start application
                  <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
                </a>
                <Link to="/membership" className="link-quiet">
                  Membership details
                </Link>
              </div>
            </>
          ) : (
            <div className="my-auto">
              <p className="font-display text-xl font-semibold">
                Pick your discipline and career stage.
              </p>
              <p className="mt-2 text-sm text-muted-foreground">
                We&rsquo;ll show the chapter to join and the fees for your membership category.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
