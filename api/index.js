/**
 * Vercel Serverless Function adapter for TanStack Start.
 *
 * The Vite build produces a Cloudflare Workers-style server entry at
 * `dist/server/server.js` that exports `{ fetch(request, env, ctx) }`.
 * Vercel serverless functions receive `(req, res)` (Node.js HTTP).
 *
 * This adapter converts between the two worlds:
 *   1. Builds a web-standard `Request` from the incoming Node.js `req`.
 *   2. Passes it to the TanStack Start `fetch` handler.
 *   3. Writes the web-standard `Response` back to Node.js `res`.
 */

export default async function handler(req, res) {
  try {
    // Dynamically import the built SSR server entry
    const serverModule = await import("../dist/server/server.js");
    const server = serverModule.default;

    // --- Build a web-standard Request from Node.js IncomingMessage ---
    const protocol = req.headers["x-forwarded-proto"] || "https";
    const host = req.headers["x-forwarded-host"] || req.headers.host;
    const url = new URL(req.url, `${protocol}://${host}`);

    const method = req.method || "GET";
    const headers = new Headers();
    for (const [key, value] of Object.entries(req.headers)) {
      if (value !== undefined) {
        if (Array.isArray(value)) {
          for (const v of value) headers.append(key, v);
        } else {
          headers.set(key, value);
        }
      }
    }

    const hasBody = method !== "GET" && method !== "HEAD";
    const body = hasBody ? req : undefined;

    const request = new Request(url.toString(), {
      method,
      headers,
      body,
      duplex: hasBody ? "half" : undefined,
    });

    // --- Call the TanStack Start fetch handler ---
    const response = await server.fetch(request, {}, {});

    // --- Write the web-standard Response back to Node.js ---
    res.statusCode = response.status;
    res.statusMessage = response.statusText || "";

    for (const [key, value] of response.headers) {
      // set-cookie may have multiple values
      if (key.toLowerCase() === "set-cookie") {
        const existing = res.getHeader("set-cookie") || [];
        const arr = Array.isArray(existing) ? existing : [existing];
        arr.push(value);
        res.setHeader("set-cookie", arr);
      } else {
        res.setHeader(key, value);
      }
    }

    if (response.body) {
      const reader = response.body.getReader();
      try {
        while (true) {
          const { done, value } = await reader.read();
          if (done) break;
          res.write(value);
        }
      } finally {
        reader.releaseLock();
      }
    }

    res.end();
  } catch (error) {
    console.error("Vercel SSR handler error:", error);
    res.statusCode = 500;
    res.setHeader("content-type", "text/html; charset=utf-8");
    res.end(`<!doctype html>
<html><head><title>Server Error</title></head>
<body style="font:15px/1.5 system-ui;display:grid;place-items:center;min-height:100vh;margin:0">
<div style="text-align:center;max-width:28rem">
<h1>Something went wrong</h1>
<p>Please try refreshing the page.</p>
<button onclick="location.reload()" style="padding:.5rem 1rem;border-radius:.375rem;background:#111;color:#fff;border:none;cursor:pointer">Refresh</button>
</div></body></html>`);
  }
}
