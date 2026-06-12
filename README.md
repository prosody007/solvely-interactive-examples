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
