# Drone Inspection Gallery

A React + TypeScript dashboard with TailwindCSS for reviewing façade defects detected from drone-captured imagery (Sample Images and Sample JSON Data).

**Live demo:** https://drone-inspection-gallery.vercel.app/

**Sample JSON Data:** https://drone-inspection-gallery.vercel.app/mockInspection.json

## Demo features

- Responsive grid of drone captures with defect counts and severity badges
- Filter captures by defect severity (high / medium / low / all)
- Click any capture to open a detail modal with bounding-box overlays drawn over each detected defect
- Keyboard accessible — Tab navigation, Esc to close modal, ARIA roles for screen readers
- Live summary stats at the top of the dashboard

## Tech stack

- **React 19** with functional components and hooks
- **TypeScript** in strict mode
- **TailwindCSS v4** via the official Vite plugin
- **Vite** as the build tool
- **Vitest** + **React Testing Library** + **jsdom** for tests

No state management library and no UI component library — kept minimal on purpose (see _Trade-offs_ below).

## Running locally

```bash
npm install
npm run dev
```

## Running tests

```bash
npm run test          # watch mode
npm run test -- --run # single run (CI)
```

Test files live next to the code they cover (e.g. [src/lib/defectStats.test.ts](src/lib/defectStats.test.ts)). Global `expect` and the `@testing-library/jest-dom` matchers are wired up in [src/test/setup.ts](src/test/setup.ts).

## Architecture decisions

### Data fetched from a JSON file via a custom hook

The mock data lives in `public/mockInspection.json` and is loaded through a `useInspection` custom hook that handles loading, error, and success states with proper cleanup on unmount. Swapping to a real REST API is a one-line change — replace the URL.

### Normalized bounding-box coordinates

Defect bounding boxes are stored as normalized values in `[0, 1]` rather than raw pixels. The same image may be rendered at any size on screen, so storing pixels would tie the box to the original image dimensions. Normalized coordinates let CSS percentages do the affine transformation for free, and the box stays correct on resize.

This mirrors the output format of common ML detection models (YOLO, COCO).

### Lifting filter state up to `App`

The severity filter is owned by `App`, not `FilterBar`. Both the filter UI and the filtered grid need access to the value, so the state lives at their nearest common ancestor and is passed down as props. `FilterBar` is therefore a controlled component.

### Component composition

Components were built in isolation and composed at the top level. `DefectCard`, `FilterBar`, `StatTile`, `BoundingBoxOverlay`, and `CaptureModal` each have a single responsibility and don't know about the data fetching layer. The `useInspection` hook isolates the async logic so any component could consume it.

### Accessibility

- The card is a `<button>` element so keyboard users get focus, Enter/Space activation, and screen-reader semantics for free
- The modal uses `role="dialog"`, `aria-modal="true"`, and listens for `Escape`
- Filter buttons use `aria-pressed` for toggle state
- Body scroll is locked while the modal is open and restored on close

## Trade-offs and what I would add with more time

- **More test coverage** — Vitest + React Testing Library are set up and the stat-counting logic in `src/lib/defectStats.ts` has unit tests. Still to add: integration tests for `FilterBar` interaction and a smoke test that the modal opens with the correct capture.
- **Performance** — at this data size, no memoization was warranted beyond what I added for demonstration. For 10k+ defects I would virtualize the gallery with `react-window`, paginate the API, and debounce filter inputs. Premature optimization was avoided intentionally.
- **3D façade view** — Inspekt's product includes a 3D building view. I scoped this out to avoid a half-finished feature, but `react-three-fiber` would be the natural fit, with the same normalized-coordinate pattern translated to UV mapping on the building's mesh.
- **Real images and AI output** — image URLs are stock photos from Unsplash and bounding boxes are hardcoded. In production, both would come from the inspection backend.
