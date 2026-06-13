# Solvely Demo Lab

Solvely interactive demo workspace. This project is independent from `ios-motion-system`.

## Structure

- `src/app`: Next.js routes and the demo shell page.
- `src/demos/registry.ts`: demo metadata, navigation groups, and experiment guards.
- `src/demos/previews`: individual demo preview implementations.
- `src/components/simulator`: shared simulator helpers such as `DemoCanvas`.
- `src/components`: cross-demo shared app components.
- `public/figma`: exported design assets grouped by demo or shared domain.

## Scripts

- `npm run dev`: start the local Next.js dev server.
- `npm run lint`: run ESLint.
- `npm run typecheck`: run TypeScript checks.
- `npm run test`: run smoke tests.
- `npm run build`: build the Next.js app.
- `npm run check`: run lint, typecheck, tests, and build.

## Quality Gates

GitHub Actions runs `npm ci` and `npm run check` on pushes to `main` and on pull requests.

## Asset Conventions

- Keep exported Figma assets under `public/figma/<demo-or-domain>`.
- Use descriptive names that match the UI purpose, for example `top-card-record@3x.png`.
- Prefer replacing a Figma-rendered asset in place when the design changes and the UI purpose stays the same.
- Run `npm run test` after adding or renaming assets referenced by preview files.
