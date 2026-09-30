// Serves AAK's downloadable documents (PDFs, radio clips) from the
// "aak-documents" R2 bucket, so they don't take up space on the cPanel host.
// Keys mirror the old site paths: /documents/<file> -> "documents/<file>".
// Supports HEAD, range requests (PDF viewers and audio players use them)
// and conditional requests.

const CACHE = "public, max-age=86400, stale-while-revalidate=604800";

export default {
  async fetch(request, env) {
    if (request.method !== "GET" && request.method !== "HEAD") {
      return new Response("Method not allowed", { status: 405, headers: { Allow: "GET, HEAD" } });
    }

    const url = new URL(request.url);
    if (url.pathname === "/" || url.pathname === "") {
      return Response.redirect("https://aak.or.ke/resources", 302);
    }

    const key = decodeURIComponent(url.pathname.slice(1));
    if (!key.startsWith("documents/") || key.includes("..")) {
      return new Response("Not found", { status: 404 });
    }

    const object = await env.FILES.get(key, {
      range: request.headers,
      onlyIf: request.headers,
    });
    if (!object) return new Response("Not found", { status: 404 });

    const headers = new Headers();
    object.writeHttpMetadata(headers);
    headers.set("etag", object.httpEtag);
    headers.set("cache-control", CACHE);
    headers.set("accept-ranges", "bytes");
    headers.set("access-control-allow-origin", "*");
    // Browsers must treat each file as its stored type, never sniff it into
    // something else (e.g. a PDF or clip rendered as HTML).
    headers.set("x-content-type-options", "nosniff");

    // Precondition matched (If-None-Match etc.): no body came back.
    if (!("body" in object)) return new Response(null, { status: 304, headers });

    let status = 200;
    const range = request.headers.has("range") ? object.range : undefined;
    if (range) {
      // R2 reports either { suffix } ("last N bytes") or { offset, length },
      // and may include the unused keys as undefined.
      let offset, length;
      if (typeof range.suffix === "number") {
        length = Math.min(range.suffix, object.size);
        offset = object.size - length;
      } else {
        offset = range.offset ?? 0;
        length = range.length ?? object.size - offset;
      }
      headers.set("content-range", `bytes ${offset}-${offset + length - 1}/${object.size}`);
      headers.set("content-length", String(length));
      status = 206;
    } else {
      headers.set("content-length", String(object.size));
    }

    return new Response(request.method === "HEAD" ? null : object.body, { status, headers });
  },
};
