# Lottie Camera Button

Source:

- `PhotoLottieIcon` in `src/demos/previews/home-v2-preview.tsx`

Assets:

- `public/figma/home-v2/b-photo-button-bg.svg`
- `public/figma/home-v2/scan_click.json`

Dependency:

- `lottie-web`

## Contract

The camera button consists of:

- Static background circle from Figma
- Lottie animation layer in the center
- Optional selected ring/background state from Figma

Every click should replay the Lottie from frame `0`.

## Implementation Pattern

Use a ref for the Lottie instance.

Load the animation inside `useEffect`:

```ts
const animation = lottie.loadAnimation({
  container,
  renderer: "svg",
  loop: false,
  autoplay: false,
  path: "/figma/home-v2/scan_click.json",
});
```

Replay:

```ts
animation.goToAndPlay(0, true);
```

Speed:

- Default speed unless explicitly requested.
- If requested, use `animation.setSpeed(value)`.

## Validation

Check:

- The animation appears centered in the camera button.
- Clicking repeatedly restarts the animation.
- Press feedback does not move the tabbar background.
- Typecheck passes.
