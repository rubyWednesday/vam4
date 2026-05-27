---
name: run-todo-tutorial
description: Run, start, build, screenshot, or test the todo-tutorial Next.js web app. Use this skill to launch the dev server, take screenshots, verify UI changes, or drive the app programmatically.
---

# run-todo-tutorial

Next.js 16 Todo app (React 19, Tailwind CSS v4, shadcn/ui, bun). Driven by a Playwright script (`driver.mjs`) that controls Chromium headlessly — no display server required.

Paths are relative to `claude_1/todo-tutorial/` (the project root).

---

## Prerequisites

```powershell
# bun must be installed
bun --version   # verified: 1.3.14

# Playwright Chromium must be present (already in devDependencies)
node_modules\.bin\playwright.exe install chromium
```

Playwright Chromium is installed at:
```
C:\Users\visio\AppData\Local\ms-playwright\chromium-1223\chrome-win64\chrome.exe
```

---

## Build

```bash
bun install        # install deps
bun run build      # production build (verified: ~3s, outputs to .next/)
```

Build output:
```
Route (app)
┌ ○ /
└ ○ /_not-found
```

---

## Run (agent path)

### Smoke test — end-to-end flow, 7 screenshots

```bash
# Start the server first (background)
bun run start &
sleep 2

# Run smoke test — adds 2 todos, toggles, filters all states
node .claude/skills/run-todo-tutorial/driver.mjs --smoke
```

Screenshots land in `screenshots/` relative to the project root:
- `01-initial.png` — empty state
- `02-add-first.png` — first todo added
- `03-add-second.png` — second todo added
- `04-toggle-first.png` — first item completed
- `05-filter-completed.png` — completed filter active
- `06-filter-active.png` — active (진행중) filter
- `07-filter-all.png` — all filter

### REPL mode — interactive commands via stdin

```bash
# Pipe commands to the driver (server must already be running)
printf 'add 새 할 일\nss after-add\ntoggle 1\nss after-toggle\ndelete 1\nss after-delete\nquit\n' \
  | node .claude/skills/run-todo-tutorial/driver.mjs
```

**Available commands:**

| Command | Effect |
|---|---|
| `ss [name]` | Screenshot → `screenshots/<name>.png` (default: `snap-N`) |
| `add <text>` | Type in the input field and press Enter (adds with default medium priority) |
| `toggle <n>` | Click the n-th checkbox (1-indexed) |
| `filter all\|active\|completed` | Click 전체 / 진행중 / 완료 filter button |
| `delete <n>` | Click the delete (삭제) button on the n-th item |
| `wait <ms>` | Sleep for ms milliseconds |
| `eval <js>` | Evaluate JS in the page context, prints result |
| `quit` | Close browser and exit |

**Options:**

```bash
node driver.mjs --url http://localhost:3001  # custom port
node driver.mjs --out /tmp/shots             # custom screenshot dir
node driver.mjs --smoke                      # run smoke test then exit
```

---

## Run (human path)

```bash
bun dev     # starts Next.js dev server at http://localhost:3000 with Turbopack
```

Opens in a browser. Dark mode toggles with the `d` key. Not useful headless.

---

## Test

```bash
bun run test:run     # vitest (3 files, 7 tests — verified passing)
bun run typecheck    # tsc --noEmit
bun run lint         # ESLint
```

---

## Gotchas

- **Filter labels are Korean.** Buttons are 전체 / 진행중 / 완료 — not All/Active/Completed. The driver maps `filter all|active|completed` to the correct Korean labels internally.
- **Delete and edit buttons are always visible** — no hover needed to reveal them. `aria-label="삭제"` and `aria-label="편집"` respectively.
- **Todos are added in reverse order** — newest item appears first in the list. `toggle 1` toggles the most recently added item.
- **Input enters text via `page.fill()`**, not `page.type()` — faster and more reliable since this is a controlled React input.
- **Port 3000 in use** — if `bun run start` fails with `EADDRINUSE`, the server is already running. The driver's `waitForServer()` will find it regardless.
- **Priority selector** — the `add` command always uses the default medium (중간) priority. To add with a different priority, use `eval` to interact with the Select component directly, or add a custom REPL command.

---

## Troubleshooting

| Symptom | Fix |
|---|---|
| `TimeoutError` on filter button | Check the exact button text — labels changed. Run `eval document.querySelectorAll('button').length` to inspect. |
| `locator.click: Timeout` on toggle | `toggle` uses `[role="checkbox"]` — confirmed working on Radix Checkbox. If the selector breaks, use `eval` to debug the DOM. |
| Screenshots are blank | Server not running. Start with `bun run start` and wait ~2s before running the driver. |
| `Error: Failed to start server: EADDRINUSE :::3000` | Another process is already listening on 3000 — the server is running. Ignore this error. |
