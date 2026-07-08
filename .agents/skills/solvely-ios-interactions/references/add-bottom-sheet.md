# Add Bottom Sheet

Source:

- `HomeUploadMenu` in `src/demos/previews/home-v2-preview.tsx`

Asset:

- `public/figma/home-v2/upload-bottom-sheet.svg`

## Contract

Clicking the add button opens a bottom sheet.

The old right-side multi-action floating list must not be used.

Overlay:

- Pure black
- Opacity `0.5`
- Above the app content

Sheet:

- Enters from the bottom
- Width matches the current viewport
- Top corners rounded
- Bottom corners not rounded
- Content left/right padding follows the design

## Important Bug Avoidance

If `open=false` on first render, render nothing.

Do not mount a hidden sheet with an exit animation on initial render. That creates false "closing" animations during ordinary tab switches.

Recommended lifecycle:

- `open=true`: mount and enter
- `open=false` after being open: play exit, then unmount
- initial `open=false`: return `null`

## Validation

Check:

- Opening add shows overlay first, then sheet.
- Closing the overlay does not affect tab selection.
- Ordinary tab switches do not play the add sheet exit animation.
