# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Package Manager

This project uses **bun**. Always use `bun` instead of `npm` or `yarn`.

## Commands

```bash
bun dev          # Start dev server with Turbopack
bun build        # Production build
bun lint         # ESLint
bun format       # Prettier (*.ts, *.tsx)
bun typecheck    # TypeScript type check (tsc --noEmit)
```

## Tech Stack

- **Next.js 16** (App Router, React 19, TypeScript)
- **Tailwind CSS v4** — config is CSS-first via `app/globals.css` (no `tailwind.config.js`)
- **shadcn/ui** (style: `radix-maia`, baseColor: `taupe`) with Radix UI primitives
- **lucide-react** for icons
- **next-themes** for dark/light mode — toggled with the `d` key (handled in `components/theme-provider.tsx`)

## Path Aliases

`@/` maps to the project root. Key aliases from `components.json`:

| Alias | Path |
|---|---|
| `@/components` | `components/` |
| `@/components/ui` | `components/ui/` |
| `@/lib` | `lib/` |
| `@/hooks` | `hooks/` |

## Adding UI Components

Use the shadcn CLI to add components:

```bash
bunx shadcn@latest add <component-name>
```

Components are generated into `components/ui/`. The `cn()` utility in `lib/utils.ts` merges Tailwind classes (`clsx` + `tailwind-merge`).

## Architecture Notes

- **App Router**: All pages live under `app/`. Layout wraps pages with `ThemeProvider`.
- **ThemeProvider** (`components/theme-provider.tsx`): Client component that enables system-aware dark mode and the `d` key hotkey. It skips the toggle when the focused element is an input, textarea, select, or contentEditable.
- No test framework is configured yet.
