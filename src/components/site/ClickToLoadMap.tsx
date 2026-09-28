import { useState } from "react";
import { IconMapPin as MapPin } from "@tabler/icons-react";

/** Google Maps embed that only loads (and only contacts Google) when the
 * visitor asks for it, so the page itself sets no third-party cookies. */
export function ClickToLoadMap({ src, title }: { src: string; title: string }) {
  const [show, setShow] = useState(false);

  if (show) {
    return (
      <iframe
        src={src}
        title={title}
        referrerPolicy="no-referrer-when-downgrade"
        className="h-full w-full border-0"
      />
    );
  }

  return (
    <div className="flex h-full flex-col items-center justify-center gap-4 p-6 text-center">
      <MapPin className="h-8 w-8 text-foreground/60" aria-hidden="true" />
      <button type="button" onClick={() => setShow(true)} className="btn-primary">
        Show map
      </button>
      <p className="max-w-xs text-xs leading-relaxed text-foreground/75">
        The map loads from Google Maps, which may set cookies. See our{" "}
        <a href="/cookies" className="underline underline-offset-2">
          cookie notice
        </a>
        .
      </p>
    </div>
  );
}
