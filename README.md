# Solvely Demo Lab

Solvely interactive demo workspace. This project is independent from `ios-motion-system`.

## Structure

- `src/app`: Next.js routes and the demo shell page.
- `src/demos/registry.ts`: demo metadata, navigation groups, and experiment guards.
- `src/demos/previews`: individual demo preview implementations.
- `src/components/simulator`: shared simulator helpers such as `DemoCanvas`.
- `src/components`: cross-demo shared app components.
- `public/figma`: exported design assets grouped by demo or shared domain.
- `docs`: reusable animation catalog, Figma asset rules, and integration guidance.
- `.agents/skills/solvely-ios-interactions`: project skill for reusing the iOS interaction patterns with Multica/Cursor-style agents.

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

## Reusing Interactions

Start with `docs/animation-catalog.md` to find an interaction pattern.

For agent-assisted reuse, load the project skill:

```txt
.agents/skills/solvely-ios-interactions/SKILL.md
```

The skill documents how to reuse Home tabbars, camera sheets, add bottom sheets, Lottie camera buttons, and Figma-exported assets without redesigning or accidentally coupling tab switches to sheet animations.

### Syncing the Multica Skill

The Multica workspace skill ID is:

```txt
b33027ee-0a7d-40d1-b701-48ead51bb621
```

Sync manually after editing docs or skill files:

```bash
bash scripts/sync-multica-skill.sh
```

GitHub Actions can sync automatically on `main` when `MULTICA_TOKEN` is configured as a repository secret.
