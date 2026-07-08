---
name: solvely-ios-interactions
description: Reuse Solvely iOS-style demo animations and Figma-derived interaction patterns. Use when implementing or porting Home tabbars, camera sheet transitions, add bottom sheets, Lottie camera buttons, Tutor flows, Study sheets, or Figma-to-code UI motion from this repository.
---

# Solvely iOS Interactions

Use this skill to reuse the interaction patterns in this repository without redesigning them.

## Start Here

1. Read `references/animation-catalog.md` or the repository `docs/animation-catalog.md`.
2. Identify the closest existing pattern.
3. Read the matching reference in `references/`.
4. Copy the smallest working implementation.
5. Preserve the interaction contract before adapting visuals.
6. Run `npm run typecheck`.

## Core Rules

- Do not redesign the interaction.
- Do not introduce new libraries unless the target pattern already uses them or the user asks.
- Do not process Figma-exported image assets unless explicitly requested.
- Do not silently fix PNG transparency. Use the correct source asset or ask for one.
- Keep normal tab switching separate from sheet animations.
- Do not reuse sheet state for tab selection.

## Key Patterns

### Home Experiment B Tabbar

Use for three-entry iOS tabbar demos with a center camera button.

Read: `references/home-experiment-b-tabbar.md`

### Add Bottom Sheet

Use for add-button-triggered bottom sheets and black overlay masks.

Read: `references/add-bottom-sheet.md`

### Lottie Camera Button

Use for camera button animations based on Lottie JSON.

Read: `references/lottie-camera-button.md`

### Figma Asset Handling

Use before exporting or replacing any icon, PNG, SVG, or Lottie file.

Read: `references/figma-assets.md`

## Output Expectations

When applying this skill:

- Name the source component and asset files used.
- State which interaction contract is being preserved.
- Mention any deviation from the original demo.
- Confirm typecheck or explain why it was not run.
