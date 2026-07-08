# Solvely iOS Interaction Animation Catalog

This catalog maps the reusable interaction demos in this repository to source files, assets, and implementation notes.

## Runtime

- Framework: Next.js + React
- Styling: Tailwind utility classes and inline styles for exact Figma values
- Preview shell: `src/components/simulator/demo-canvas.tsx`
- Default screen size: `393 x 852`

## Demo Map

| Demo | Route | Source | Purpose |
| --- | --- | --- | --- |
| Home experiments | `/home?version=experiment-a`, `/home?version=experiment-b` | `src/demos/previews/home-v2-preview.tsx` | Home tabbar, camera entry, add sheet, study set cards |
| Camera/Solve page | `/solve` | `src/demos/previews/home-preview.tsx` | Camera page, capture modes, solve-mode overlay |
| Tutor | `/tutor` | `src/demos/previews/tutor-preview.tsx` | AI Tutor home, history/loading/answer subpages, voice/preview flows |
| Study | `/study` | `src/demos/previews/study-preview.tsx` | Study set creation, bottom sheet, card animations |
| Flash cards | `/flash-card-stack`, `/flash-card-flip-swipe-away` | `src/demos/previews/card-flip-preview.tsx` | Card stack and flip/swipe motion |
| Shared tabbar | internal | `src/demos/previews/tabbar-preview.tsx` | Shared tabbar icons and states |

## Reusable Interaction Patterns

### Experiment B Camera Tab

- Source: `src/demos/previews/home-v2-preview.tsx`
- Component: `HomeExperimentBBottomBar`
- Assets:
  - `public/figma/home-v2/b-tabbar-study-bg.svg`
  - `public/figma/home-v2/b-tabbar-tutor-bg.svg`
  - `public/figma/home-v2/b-tabbar-solve-bg.svg`
  - `public/figma/home-v2/b-photo-button-bg.svg`
  - `public/figma/home-v2/scan_click.json`
- Behavior:
  - Study and AI Tutor tabs switch pages directly.
  - The center camera tab opens the camera page as an overlay/sheet when enabled for the current experiment.
  - The Lottie animation replays on every camera button click.

### Add Button Bottom Sheet

- Source: `HomeUploadMenu` in `src/demos/previews/home-v2-preview.tsx`
- Asset: `public/figma/home-v2/upload-bottom-sheet.svg`
- Behavior:
  - Add button opens a black `0.5` opacity mask.
  - Bottom sheet enters from the bottom.
  - The previous floating menu is intentionally removed.

### Camera Page Toolbar

- Source: `src/demos/previews/home-preview.tsx`
- Extension point: `toolbarLeft`
- Purpose:
  - Allows another demo to replace the left toolbar area without editing the camera page internals.

### Lottie Press Button

- Source: `PhotoLottieIcon` in `src/demos/previews/home-v2-preview.tsx`
- Dependency: `lottie-web`
- Behavior:
  - `loadAnimation` is dynamic-imported on the client.
  - `playKey` forces replay on each click.
  - Playback speed is controlled via `animation.setSpeed(...)`.

## Asset Rules

See `docs/figma-export-rules.md`.

## Integration Rules

See `docs/integration-guide.md`.
