# Repo notes

TanStack Start app (file-based routing under `src/routes`, see `src/routes/README.md` for conventions). Vite config is wrapped by `@lovable.dev/vite-tanstack-config`, which already registers TanStack Start, React, Tailwind, tsconfig-paths and the Cloudflare/Nitro build target — do not add those plugins again in `vite.config.ts` or the build breaks with duplicate plugins.

Content in `src/data/site.ts` should stay factual — it's sourced from aak.or.ke. Verify against the live site before changing names, dates or figures.
