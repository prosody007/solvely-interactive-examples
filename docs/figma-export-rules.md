# Figma Export Rules

Use these rules when moving assets from Figma into this repository or into another product codebase.

## Hard Rules

1. Use the designer-provided or Figma-exported original asset whenever possible.
2. Do not redraw icons.
3. Do not process transparency after export.
4. Do not crop, mask, recolor, or regenerate PNGs unless explicitly requested.
5. If a PNG export includes an unwanted background, do not "fix" it silently. Export the correct node or ask for the transparent source.
6. Keep display size separate from pixel density. A 24px icon should usually be exported as 72x72 for `@3x`, but rendered as 24px in CSS.

## Choosing PNG vs SVG

Use PNG when:

- The user explicitly asks for exported PNG.
- The asset is a raster rendering, complex visual, or supplied by design as a PNG.
- The design requires exact snapshot fidelity.

Use SVG when:

- The asset is a pure vector icon and the user has not required PNG.
- You need sharp scaling and the SVG is itself the original design asset.
- The PNG export contains a baked-in background but the original vector node is background-free.

## Common Figma Export Pitfalls

### Icon Frame vs Icon Shape

Many Figma nodes named like `icon`, `tab_icon`, or `Frame` are actually containers. Exporting the container can bake in:

- a white background
- a gray canvas
- a tabbar background
- a page-level clipping area

Before using an exported PNG, inspect:

- dimensions
- alpha channel
- corner pixels
- whether the file includes page background elements

### Full Node SVGs

Full node SVG exports can include hidden or page-level background rectangles. If you must use the whole SVG, inspect for exported page background lines like:

```svg
<rect width="393" height="852" ... />
```

Remove only documented Figma page-background artifacts when necessary for runtime correctness. Do not remove real design shapes.

### Lottie Files

Lottie JSON files should be copied directly from the provided source.

Do:

- store under `public/figma/<area>/`
- reference by URL path in runtime code
- replay by calling `goToAndPlay(0, true)`

Do not:

- edit the JSON manually
- optimize it without approval
- convert it to another animation format

## Verification Checklist

For each visual asset:

- Confirm source Figma node or provided local file.
- Confirm final file path in `public/figma/...`.
- Confirm CSS display size.
- Confirm no unexpected background.
- Confirm no unused old asset remains referenced.
- Run `npm run typecheck` for code changes.
