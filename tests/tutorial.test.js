import { test } from "node:test";
import assert from "node:assert/strict";
import { renderTutorialLine } from "../dist/render/lines/tutorial.js";
import { setLanguage } from "../dist/i18n/index.js";
import { DEFAULT_CONFIG } from "../dist/config.js";

function stripAnsi(text) {
  return (text ?? "").replace(/\x1b\[[0-9;]*m/g, "");
}

function makeCtx({ lang = "en", ctxPct = 20, dirty = false, five = null } = {}) {
  setLanguage(lang);
  return {
    stdin: { context_window: { used_percentage: ctxPct } },
    transcript: {},
    config: { ...DEFAULT_CONFIG, language: lang },
    gitStatus: dirty
      ? { branch: "main", isDirty: true, ahead: 0, behind: 0, fileStats: { modified: 2, added: 0, deleted: 0, untracked: 1 } }
      : null,
    usageData:
      five === null
        ? null
        : { fiveHour: five, sevenDay: null, fiveHourResetAt: null, sevenDayResetAt: null },
  };
}

test("tutorial: disabled returns null", () => {
  const ctx = makeCtx();
  ctx.config.tutorial = { ...DEFAULT_CONFIG.tutorial, enabled: false };
  assert.equal(renderTutorialLine(ctx), null);
});

test("tutorial: high context fires the /compact hint (deterministic, single hint)", () => {
  const ctx = makeCtx({ ctxPct: 91 });
  const out = stripAnsi(renderTutorialLine(ctx));
  assert.match(out, /Hint/);
  assert.match(out, /91%/);
  assert.match(out, /\/compact/);
});

test("tutorial: uncommitted changes hint includes file count", () => {
  const ctx = makeCtx({ ctxPct: 10, dirty: true });
  const out = stripAnsi(renderTutorialLine(ctx));
  assert.match(out, /Hint/);
  assert.match(out, /3 uncommitted/); // 2 modified + 1 untracked
});

test("tutorial: high rate limit fires quota hint", () => {
  const ctx = makeCtx({ ctxPct: 10, five: 88 });
  const out = stripAnsi(renderTutorialLine(ctx));
  assert.match(out, /Hint/);
  assert.match(out, /88%/);
});

test("tutorial: no triggers falls back to a general Tip", () => {
  const ctx = makeCtx({ ctxPct: 10 });
  const out = stripAnsi(renderTutorialLine(ctx));
  assert.match(out, /^▸ Tip /);
});

test("tutorial: zh hint is in Traditional Chinese", () => {
  const ctx = makeCtx({ lang: "zh", ctxPct: 92 });
  const out = stripAnsi(renderTutorialLine(ctx));
  assert.match(out, /提示/);
  assert.match(out, /壓縮對話/);
});

test("tutorial: extraTips appear before built-ins when no hint is active", () => {
  const ctx = makeCtx({ ctxPct: 10 });
  // rotateMs must exceed Date.now() so floor(now/rotateMs) === 0 -> first pool
  // entry -> the extra tip. (1e15 s dwarfs any real epoch-ms value.)
  ctx.config.tutorial = { ...DEFAULT_CONFIG.tutorial, extraTips: ["MY TEAM RULE"], rotateSeconds: 1e15 };
  const out = stripAnsi(renderTutorialLine(ctx));
  assert.match(out, /MY TEAM RULE/);
});
