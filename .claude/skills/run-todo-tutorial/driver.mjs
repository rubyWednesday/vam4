#!/usr/bin/env node
/**
 * Driver for todo-tutorial (Next.js web app).
 * Usage:  node driver.mjs [--url http://localhost:3000] [--out ./screenshots]
 *
 * Commands piped to stdin (one per line):
 *   ss [name]        – screenshot → screenshots/<name>.png (default: snap)
 *   add <text>       – type text in the input and press Enter
 *   toggle <n>       – click the n-th visible checkbox (1-indexed)
 *   filter <all|active|completed>  – click the matching filter button
 *   delete <n>       – click the delete button on the n-th todo item
 *   wait <ms>        – sleep ms milliseconds
 *   eval <js>        – evaluate JS in the page, prints result
 *   quit             – exit cleanly
 *
 * Standalone smoke test (no stdin piping):
 *   node driver.mjs --smoke
 */

import { chromium } from 'playwright';
import { existsSync, mkdirSync } from 'fs';
import { resolve, join } from 'path';
import { createInterface } from 'readline';

const args = process.argv.slice(2);
const URL = args.includes('--url') ? args[args.indexOf('--url') + 1] : 'http://localhost:3000';
const OUT_DIR = args.includes('--out') ? args[args.indexOf('--out') + 1] : resolve('./screenshots');
const SMOKE = args.includes('--smoke');

if (!existsSync(OUT_DIR)) mkdirSync(OUT_DIR, { recursive: true });

async function waitForServer(url, maxMs = 15000) {
  const deadline = Date.now() + maxMs;
  while (Date.now() < deadline) {
    try {
      const res = await fetch(url);
      if (res.ok || res.status < 500) return;
    } catch { /* keep waiting */ }
    await new Promise(r => setTimeout(r, 500));
  }
  throw new Error(`Server not ready after ${maxMs}ms: ${url}`);
}

(async () => {
  await waitForServer(URL);

  const browser = await chromium.launch({ headless: true });
  const context = await browser.newContext({ viewport: { width: 1280, height: 900 } });
  const page = await context.newPage();

  await page.goto(URL, { waitUntil: 'networkidle' });

  let snapCount = 0;
  const ss = async (name) => {
    const file = join(OUT_DIR, `${name ?? `snap-${++snapCount}`}.png`);
    await page.screenshot({ path: file, fullPage: true });
    console.log(`[ss] ${file}`);
    return file;
  };

  if (SMOKE) {
    // ── Smoke test: one end-to-end flow ──────────────────────────────────────
    await ss('01-initial');

    // Add first todo
    await page.fill('input[placeholder]', '우유 사기');
    await page.keyboard.press('Enter');
    await page.waitForTimeout(300);
    await ss('02-add-first');

    // Add second todo
    await page.fill('input[placeholder]', '코드 리뷰하기');
    await page.keyboard.press('Enter');
    await page.waitForTimeout(300);
    await ss('03-add-second');

    // Toggle first todo
    const checkboxes = page.locator('[data-testid="todo-item"] input[type="checkbox"], [role="checkbox"]');
    await checkboxes.first().click();
    await page.waitForTimeout(300);
    await ss('04-toggle-first');

    // Filter: completed
    await page.getByRole('button', { name: /완료|completed/i }).first().click();
    await page.waitForTimeout(300);
    await ss('05-filter-completed');

    // Filter: active
    await page.getByRole('button', { name: /진행중/i }).first().click();
    await page.waitForTimeout(300);
    await ss('06-filter-active');

    // Filter: all
    await page.getByRole('button', { name: /전체|all/i }).first().click();
    await page.waitForTimeout(300);
    await ss('07-filter-all');

    console.log('[smoke] PASS – screenshots in', OUT_DIR);
    await browser.close();
    process.exit(0);
  }

  // ── REPL mode ─────────────────────────────────────────────────────────────
  const rl = createInterface({ input: process.stdin, terminal: false });

  for await (const raw of rl) {
    const line = raw.trim();
    if (!line) continue;
    const [cmd, ...rest] = line.split(' ');
    const arg = rest.join(' ');

    try {
      switch (cmd) {
        case 'ss':
          await ss(arg || undefined);
          break;
        case 'add':
          await page.fill('input[placeholder]', arg);
          await page.keyboard.press('Enter');
          await page.waitForTimeout(200);
          console.log('[ok] added:', arg);
          break;
        case 'toggle': {
          const n = parseInt(arg, 10) || 1;
          const boxes = page.locator('[role="checkbox"]');
          await boxes.nth(n - 1).click();
          await page.waitForTimeout(200);
          console.log('[ok] toggled item', n);
          break;
        }
        case 'filter': {
          const label = { all: /전체/i, active: /진행중/i, completed: /완료/i }[arg?.toLowerCase()];
          if (!label) { console.error('[err] unknown filter:', arg); break; }
          await page.getByRole('button', { name: label }).first().click();
          await page.waitForTimeout(200);
          console.log('[ok] filter:', arg);
          break;
        }
        case 'delete': {
          const n = parseInt(arg, 10) || 1;
          // delete buttons are always visible with aria-label="삭제"
          const delBtns = page.getByRole('button', { name: '삭제' });
          await delBtns.nth(n - 1).click();
          await page.waitForTimeout(200);
          console.log('[ok] deleted item', n);
          break;
        }
        case 'wait':
          await page.waitForTimeout(parseInt(arg, 10) || 500);
          console.log('[ok] waited', arg, 'ms');
          break;
        case 'eval': {
          const result = await page.evaluate(arg);
          console.log('[eval]', JSON.stringify(result));
          break;
        }
        case 'quit':
          await browser.close();
          process.exit(0);
          break;
        default:
          console.error('[err] unknown command:', cmd);
      }
    } catch (e) {
      console.error('[err]', e.message);
    }
  }

  await browser.close();
})();
