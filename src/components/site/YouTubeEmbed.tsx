import { useState } from "react";
import { IconPlayerPlayFilled as Play } from "@tabler/icons-react";

import { cn } from "@/lib/utils";

/**
 * A YouTube embed that shows the video's thumbnail and a play button, and
 * only loads YouTube's player (~300KB of scripts, styles and fonts) once the
 * visitor presses play. `src` is the embed URL, e.g.
 * https://www.youtube-nocookie.com/embed/VIDEO_ID or …/embed/videoseries?list=…
 */
export function YouTubeEmbed({
  src,
  title,
  className,
}: {
  src: string;
  title: string;
  className?: string | undefined;
}) {
  const [playing, setPlaying] = useState(false);
  // Playlists (/embed/videoseries?list=…) have no single thumbnail.
  const videoId = /\/embed\/(?!videoseries)([\w-]{11})(?:[?#]|$)/.exec(src)?.[1];

  if (playing) {
    const url = new URL(src);
    url.searchParams.set("autoplay", "1");
    return (
      <iframe
        src={url.toString()}
        title={title}
        className={className}
        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
        allowFullScreen
      />
    );
  }

  return (
    <button
      type="button"
      onClick={() => setPlaying(true)}
      className={cn("group relative block overflow-hidden bg-ink-deep text-left", className)}
      aria-label={`Play video: ${title}`}
    >
      {videoId ? (
        <img
          src={`https://i.ytimg.com/vi/${videoId}/hqdefault.jpg`}
          alt=""
          loading="lazy"
          decoding="async"
          className="absolute inset-0 h-full w-full object-cover opacity-80 transition-opacity duration-300 group-hover:opacity-100"
        />
      ) : null}
      <span className="absolute inset-0 bg-linear-to-t from-ink-deep/80 via-transparent to-transparent" />
      <span className="absolute inset-0 flex items-center justify-center">
        <span className="flex h-16 w-16 items-center justify-center rounded-full bg-primary text-primary-foreground shadow-xl transition-transform duration-300 group-hover:scale-110">
          <Play className="ml-1 h-7 w-7" aria-hidden="true" />
        </span>
      </span>
      <span className="absolute inset-x-0 bottom-0 px-5 py-4 text-sm font-semibold text-background">
        {title}
      </span>
    </button>
  );
}
