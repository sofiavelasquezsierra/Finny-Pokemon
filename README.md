# Pokemon Explorer

A searchable, infinitely scrolling grid of creatures with cards that flip to reveal their stats. This is my submission for the Finny front-end take-home. The original brief is kept unchanged in [ASSIGNMENT.md](ASSIGNMENT.md).

**Live:** https://finny-pokemon.onrender.com/ (Render's free tier sleeps when idle, so the first load can take about 30s)

## Running it

Requires **Node ≥ 20.19** (Vite 8's minimum; the brief's "Node 18+" no longer holds) and **pnpm 11** (pinned in `package.json`).

```bash
corepack enable          # or: npm i -g pnpm@11.2.1  (Node 25 no longer ships corepack)
pnpm install
pnpm dev                 # http://localhost:5173, app and API on one port
```

| Script | What it does |
| --- | --- |
| `pnpm dev` | Vite dev server with the Express API mounted as middleware |
| `pnpm build` | Type-check, build the client to `dist/` and bundle the server to `dist-server/` |
| `pnpm start` | Production server: the API plus the static client (`PORT` defaults to 3000) |
| `pnpm types` / `pnpm lint` | `tsc --noEmit` / ESLint |

Don't run `scripts/generate-pokemon.mjs`. It overwrites the committed fixture with new random data.

### Demoing loading and error states (dev only)

The local API answers in a few milliseconds, so loading states are normally invisible. Add these to the page URL:

| URL | Shows |
| --- | --- |
| `/?delay=1500` | Skeleton cards, then type to see the dimmed "searching" state |
| `/?failFrom=1` | First-page error with Try again |
| `/?failFrom=2` | Page 1 loads, then scroll for the next-page error (loaded cards are kept) |

This middleware is only mounted by the Vite dev server, and the client code that forwards these parameters is removed from production builds.

## What it does

- **Search** across name, type and description, debounced at 300ms and synced to `?search=` so results can be shared and survive a reload.
- **Infinite scroll** using an IntersectionObserver sentinel, with no pagination UI. It keeps loading on tall screens where the sentinel never leaves view.
- **Flip cards.** The front shows the image, name and type badges. Click, tap, Enter or Space flips the card to show the description, six stat bars, height, weight and generation.
- **Every state handled:** skeletons, dimmed results while searching, empty results with Clear search, first-page and next-page errors with retry, and an end-of-list pill.
- **Responsive:** 1 to 5 columns.

## Structure

```
src/
  App.tsx                       layout, sr-only h1
  components/
    PokemonGrid.tsx             search, query state, grid, sentinel, all list states
    PokemonCard.tsx             flip card (front/back faces, overlay button)
    PokemonImage.tsx            resized image with a fallback chain
    TypeBadge.tsx               contrast-checked type chips
    CardSkeleton.tsx
    ui/input.tsx                shadcn, with a contrast fix
  hooks/
    usePokemonQuery.ts          useInfiniteQuery + pagination guard
    useDebouncedValue.ts
    useIntersectionObserver.ts  callback ref + isIntersecting state
    useUrlSearchParam.ts        read once, mirror with replaceState
  lib/
    api.ts                      types + fetchPokemonPage
    image.ts                    URL resizing + backup image
server/
  app.ts                        starter API (unchanged)
  index.ts                      production server
  devApiControls.ts             dev-only ?delay / ?failFrom
```

## Key decisions

The full log, with the alternatives I rejected for each decision, is in [DECISIONS.md](DECISIONS.md). These are the main ones:

- **TanStack Query `useInfiniteQuery`** instead of a hand-rolled hook. Keying the cache by search term makes stale responses unable to overwrite newer ones, and superseded requests are aborted through `AbortSignal`. `staleTime: Infinity` and no refetch on focus, because the data is static and refetching an infinite query refetches every loaded page.
- **The load-more effect has five guards** (`isIntersecting && hasNextPage && !isFetching && !isPlaceholderData && !isFetchNextPageError`). `keepPreviousData` makes `hasNextPage` describe the *previous* search until the new one arrives, and the error guard prevents retry loops.
- **Cards flip on click instead of expanding inline.** The brief says "click to expand" and invites creativity. Stacking both faces in one grid cell sizes the card to its taller face, so nothing overflows and rows never shift. Hover was rejected: it doesn't exist on touch screens and contradicts "click".
- **Accessible flip.** One overlay `<button>` with `aria-expanded` (keeping the faces outside it keeps the HTML valid), `inert` on the hidden face, focus that never moves, and a crossfade under `prefers-reduced-motion`.
- **Type badges on the front,** following the brief ("name and type") over the design (name only). Without them, a search for "fire" returns cards that look unrelated.
- **Measured contrast.** 13 of the starter's 18 type colours failed WCAG AA (as low as 1.44:1). The tinted chips are all ≥ 7.26:1. The shadcn input's border (1.39:1) and focus ring (1.83:1) were fixed to ≥ 3.55:1.
- **Images.** The source images are up to about 4000px, so URLs are rewritten to 400×500 (picsum went from 393 KB to 18 KB). loremflickr returned HTTP 500 for every image during development (half the dataset), so each image falls back to a seeded picsum photo and then to an initial.
- **Minimal dependencies.** One added: `@tanstack/react-query`. Debounce, intersection and URL sync are each under 25 lines. No router, no icon library, no `class-variance-authority`.

## Changes to the starter

- **pnpm 11 fix.** The pinned pnpm ignores the `package.json` `"pnpm"` field, so the esbuild build approval was lost and every `pnpm` script failed. The approval moved to `pnpm-workspace.yaml`.
- **Production server.** The API only existed inside the Vite dev server. `server/index.ts` plus `build`/`start` scripts make it deployable.
- `index.html`: static `dark` class and page title. `globals.css`: pure black background and `color-scheme: dark`. `ui/input.tsx`: the contrast fix described above.

## Known limitations

- **The data is a generated fixture:** names are Faker first names, descriptions are Latin filler, images are random stock photos. The UI is built to the data's shape. The images have `alt=""` because they don't depict the creature and its name is adjacent text.
- **Search also matches the filler description,** so short queries like "a" match a lot. That's server behaviour, left as is.
- **Height and weight units (m, kg) are assumed.** The data has none, but the ranges match real Pokémon.
- **Infinite scroll keeps keyboard users from reaching the end of the page.** Tabbing through cards keeps loading more. Nothing focusable comes after the grid today.
- **No automated tests.** I cut them to make room for the deploy.

## With more time

- Tests: Vitest + Testing Library for the card's flip and accessibility, and the search race with a mocked fetch. Playwright + axe for contrast and keyboard flow in CI.
- Proxy and cache images through the server, so third-party outages are invisible. Add `srcSet` for 1×/2×.
- Virtualize rows (TanStack Virtual) if the dataset grew past about 10k. The fixed-shape cards make row heights predictable.
- Restore scroll position on back navigation, and highlight the matched search term.
- Validate API responses with a schema if the API weren't our own.
