# Home Experiment B Tabbar

Source file:

- `src/demos/previews/home-v2-preview.tsx`

Primary components:

- `HomeExperimentBPreview`
- `HomeExperimentBBottomBar`
- `HomeStudyLayer`
- `PhotoLottieIcon`

## Contract

The B tabbar has three distinct actions:

- Study: switch directly to Study page content.
- Center camera: trigger camera-specific behavior.
- AI Tutor: switch directly to AI Tutor page content.

Never make Study or AI Tutor depend on camera sheet state.

## Current Implementation Notes

`HomeExperimentBPreview` owns the B-group page state.

`HomeExperimentBBottomBar` owns B-group tabbar hit areas and visual layers.

The center camera button uses:

- `b-tabbar-study-bg.svg`
- `b-tabbar-tutor-bg.svg`
- `b-tabbar-solve-bg.svg`
- `b-photo-button-bg.svg`
- `scan_click.json`

## Anti-Patterns

Do not:

- Reuse `activeTab === "solve"` as a sheet lifecycle state.
- Run a sheet exit animation during Study or AI Tutor tab switching.
- Let transparent add-button hit areas overlap the AI Tutor tab.
- Make the whole visual shadow area clickable when only the button body should be clickable.

## Validation

Check:

- AI Tutor -> Study switches immediately.
- Study -> AI Tutor switches immediately.
- Center camera button press only affects camera behavior.
- The tabbar active state matches the visible page.
