# Server-side code dropped during the Astro port

The source at `genai/` was a TanStack Start app with framework-specific
server code that does **not** translate to Astro's static-output model
(`output: 'static'`). These files were intentionally **not** ported.
They are listed here so the behavior can be reintroduced (e.g. via an
Astro endpoint, server island, or external service) if ever needed.

## Dropped files

- `genai/src/server.ts`
  TanStack Start SSR server entry — wraps `@tanstack/react-start/server-entry`
  with a try/catch and normalizes h3's "swallowed" 500 JSON responses into a
  rendered HTML error page. No equivalent in a static Astro build.
  TODO: if SSR error handling is needed, use Astro middleware
  (`src/middleware.ts`) or the adapter's error page.

- `genai/src/start.ts`
  `createStart()` instance registering an error-handling request middleware.
  TODO: Astro equivalent is `src/middleware.ts` (`onRequest`).

- `genai/src/lib/api/example.functions.ts`
  Example `createServerFn` (`getGreeting`) with a Zod input validator —
  a server RPC invoked from the client. Demo only; nothing referenced it.
  TODO: for real server logic, use an Astro endpoint (`src/pages/api/*.ts`
  with `export const prerender = false`) or an external function.

- `genai/src/lib/config.server.ts`
  Server-only config reader (`getServerConfig`) for `process.env`.
  TODO: in Astro use `import.meta.env` (with the `PUBLIC_` prefix for
  client-readable values); keep secrets in server endpoints only.

- `genai/src/lib/error-capture.ts`, `genai/src/lib/error-page.ts`,
  `genai/src/lib/lovable-error-reporting.ts`
  Lovable/TanStack error-capture + reporting + rendered error-page helpers,
  wired into the SSR server entry and the root route's error boundary.
  TODO: reintroduce via Astro middleware / a custom 500 page if desired.

## Routing / shell that was translated (not dropped)

- `genai/src/routes/__root.tsx` — the root shell (`<html>`, theme-init
  script, head meta, QueryClientProvider) was translated:
  - HTML shell + no-FOUC theme script → `src/layouts/Layout.astro`
  - `<head>` meta/OG/Twitter/JSON-LD → `src/pages/index.astro` head slot
  - `QueryClientProvider` (React Query) was **dropped** — no data fetching
    in the ported content used it; it only wrapped `<Outlet />`.
  - The root `NotFoundComponent` / `ErrorComponent` (TanStack boundaries)
    were dropped; Astro serves its own 404 and these depended on
    `@tanstack/react-router` + the Lovable error reporter.
- `genai/src/routes/index.tsx` — the `/` landing page content was fully
  ported to `src/pages/index.astro` (static sections) plus two React
  islands: `src/components/ThemeToggle.tsx` and `src/components/SignupForm.tsx`.
- `genai/src/router.tsx` / `genai/src/routeTree.gen.ts` — TanStack Router
  setup; not needed under Astro file-based routing.

## shadcn/ui library (not ported)

`genai/src/components/ui/*` (~50 shadcn/ui components) and
`genai/src/hooks/use-mobile.tsx` were **not** ported: the landing page does
not import any of them (it uses plain markup + the two islands above).
Porting them would have pulled ~25 unused Radix UI / lucide-react / cva
dependencies into `package.json` with nothing referencing them. They can be
copied verbatim from `genai/` later if a future page needs them — add the
matching deps (`@radix-ui/*`, `lucide-react`, `class-variance-authority`,
`clsx`, `tailwind-merge`) at that point.
