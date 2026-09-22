import { useEffect, useState } from "react";

interface CountdownProps {
  /** ISO date the countdown counts down to. */
  targetIso: string;
  /** ISO end date — while "now" is inside [targetIso, endIso], shows a live badge instead of counting. */
  endIso?: string | undefined;
  className?: string;
  /** Compact renders one short line ("12d 04h"); non-compact shows day/hour/min/sec boxes. */
  compact?: boolean;
}

function getParts(msRemaining: number) {
  const totalSeconds = Math.max(0, Math.floor(msRemaining / 1000));
  return {
    days: Math.floor(totalSeconds / 86400),
    hours: Math.floor((totalSeconds % 86400) / 3600),
    minutes: Math.floor((totalSeconds % 3600) / 60),
    seconds: totalSeconds % 60,
  };
}

export function Countdown({ targetIso, endIso, className, compact = true }: CountdownProps) {
  const target = new Date(targetIso).getTime();
  const end = endIso ? new Date(endIso).getTime() : target;
  const [now, setNow] = useState<number | null>(null);

  useEffect(() => {
    setNow(Date.now());
    const tick = () => setNow(Date.now());
    const interval = window.setInterval(tick, compact ? 60_000 : 1000);
    return () => window.clearInterval(interval);
  }, [compact]);

  // Avoid a hydration mismatch: render nothing until mounted, then show the live value.
  if (now === null) return null;
  if (now > end) return null;

  if (now >= target) {
    return (
      <span className={className}>
        <span className="pulse-dot mr-1.5 inline-block h-1.5 w-1.5 bg-primary align-middle" />
        Happening now
      </span>
    );
  }

  const { days, hours, minutes, seconds } = getParts(target - now);

  if (compact) {
    const label =
      days > 0 ? `${days}d ${hours}h` : hours > 0 ? `${hours}h ${minutes}m` : `${minutes}m`;
    return <span className={className}>Starts in {label}</span>;
  }

  return (
    <div className={className}>
      <dl className="flex items-start gap-4 sm:gap-6">
        {[
          { label: "Days", value: days },
          { label: "Hours", value: hours },
          { label: "Min", value: minutes },
          { label: "Sec", value: seconds },
        ].map((unit) => (
          <div key={unit.label} className="text-center">
            <dt className="sr-only">{unit.label}</dt>
            <dd className="font-sans text-2xl font-semibold tabular-nums text-foreground sm:text-3xl">
              {String(unit.value).padStart(2, "0")}
            </dd>
            <dd className="mt-1 text-[10px] font-medium uppercase tracking-[0.12em] text-muted-foreground">
              {unit.label}
            </dd>
          </div>
        ))}
      </dl>
    </div>
  );
}
