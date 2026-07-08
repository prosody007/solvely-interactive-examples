# Integration Guide

Use this guide when reusing Solvely demo interactions in another product codebase.

## Recommended Workflow

1. Identify the closest interaction in `docs/animation-catalog.md`.
2. Open the source component listed in the catalog.
3. Copy the smallest needed component or pattern.
4. Copy only the assets referenced by that component.
5. Preserve the interaction contract before changing styling.
6. Adapt layout to the target project.
7. Validate against the original demo and Figma.

## Home Experiment B Tabbar

Source:

- `src/demos/previews/home-v2-preview.tsx`

Core pieces:

- `HomeExperimentBPreview`
- `HomeExperimentBBottomBar`
- `PhotoLottieIcon`

Contract:

- Study tab changes directly to Study content.
- AI Tutor tab changes directly to AI Tutor content.
- Center camera button triggers camera-specific behavior only.
- Add button opens the add bottom sheet.

Do not couple tab switching to sheet animation state.

## Camera Button With Lottie

Assets:

- `public/figma/home-v2/b-photo-button-bg.svg`
- `public/figma/home-v2/scan_click.json`

Dependency:

- `lottie-web`

Implementation notes:

- Create the Lottie instance in a client-only effect.
- Store the animation instance in a ref.
- Replay with `goToAndPlay(0, true)` on every click.
- Set playback speed only when explicitly requested.

## Add Bottom Sheet

Source:

- `HomeUploadMenu`

Asset:

- `public/figma/home-v2/upload-bottom-sheet.svg`

Contract:

- Closed initial state must render nothing.
- Open state shows a black `0.5` opacity mask.
- Bottom sheet appears from the bottom.
- The old right-side floating action list is not used.

Important:

If the component is rendered while `open=false`, it must not play an exit animation. Otherwise ordinary page/tab switches can look like a sheet is closing.

## Camera Page Toolbar Customization

Source:

- `src/demos/previews/home-preview.tsx`

Extension:

- `toolbarLeft?: ReactNode`

Use this to replace only the left toolbar controls when embedding the camera page. Keep the right toolbar controls owned by `HomePreview`.

## Quality Checklist

Before shipping a reused interaction:

- Study and AI Tutor tab switches are direct.
- Only camera/sheet triggers use sheet animation.
- Initial closed sheets do not animate out.
- Transparent tabbar hit areas do not overlap add button hit areas.
- Lottie replays on every click.
- Assets are original exports unless the user explicitly requested processing.
- `npm run typecheck` passes.
