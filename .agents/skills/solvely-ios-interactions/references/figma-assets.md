# Figma Assets

Primary project guide:

- `docs/figma-export-rules.md`

## Do

- Use original exported files.
- Keep exported asset names clear and stable.
- Keep display CSS size separate from export resolution.
- Verify whether a PNG has transparent corners before treating it as an icon.
- Prefer using a real vector asset when the exported PNG has a baked background.

## Do Not

- Do not redraw icons.
- Do not manually remove backgrounds from PNGs unless the user explicitly asks.
- Do not silently change SVG internals except for documented page-background artifacts.
- Do not use a frame export when the task requires a pure icon export.

## Quick Checks

For PNGs:

```bash
python3 - <<'PY'
from PIL import Image
im = Image.open("asset.png").convert("RGBA")
print(im.size, im.getchannel("A").getextrema(), im.getpixel((0,0)))
PY
```

For SVGs:

- Check whether the SVG includes full-page background rects.
- Check whether the relevant design element is inside a clipping path.
- Check the viewBox size before stretching.

## Naming

Use names that describe state and purpose:

- `b-tabbar-study-bg.svg`
- `b-photo-button-bg.svg`
- `scan_click.json`
- `upload-bottom-sheet.svg`

Avoid ambiguous names like:

- `frame.svg`
- `icon-new-new.svg`
- `tmp-export.png`
