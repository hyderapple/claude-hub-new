import type { RenderContext } from '../../types.js';
import type { Language } from '../../i18n/types.js';

/**
 * Tutorial bar content + rules.
 *
 * Two tiers feed the tutorial line's rotation pool:
 *   - Tier 1 (context-aware hints): produced by {@link buildContextHints} from
 *     the live RenderContext. High priority — when any fire, only these rotate.
 *   - Tier 2 (general tips): the curated, static {@link GENERAL_TIPS} below,
 *     shown when no Tier-1 hint is active.
 *
 * Content is bilingual. zh strings are Traditional Chinese (this fork's
 * primary audience); upstream UI labels remain Simplified.
 */

/** Tier 2 — general rotating tips (low priority), keyed by language. */
export const GENERAL_TIPS: Record<Language, string[]> = {
  en: [
    'Double-tap Esc to edit and resend a previous message',
    'Use /context to inspect your context window usage',
    'Start a line with # to save a memory',
    'Use /compact to compress the conversation and free up context',
    'Run /clear to start a fresh conversation',
    'Use @ to quickly reference a file path',
    'Type /agents to create and manage subagents',
    'Use /rewind to roll back to an earlier checkpoint',
    'Press Shift+Tab to cycle permission modes (incl. plan mode)',
    'Drag a file into the prompt to attach it',
  ],
  zh: [
    '雙擊 Esc 可編輯並重送上一則訊息',
    '用 /context 查看目前 context window 用量',
    '行首用 # 開頭可直接寫入記憶 (memory)',
    '用 /compact 壓縮對話、釋放 context 空間',
    '用 /clear 開一段全新對話',
    '用 @ 快速引用檔案路徑',
    '輸入 /agents 建立與管理子代理 (subagents)',
    '用 /rewind 回到先前的檢查點',
    '按 Shift+Tab 可切換權限模式（含 plan mode）',
    '把檔案拖進輸入框即可附加',
  ],
};

export interface TutorialParams {
  /** Context-window used-percentage at/above which to suggest /compact. */
  contextThreshold: number;
  /** Rate-limit used-percentage at/above which to warn about quota. */
  rateThreshold: number;
}

/**
 * Tier 1 — context-aware hints. Each rule inspects the live context and pushes
 * a localized string when its condition fires. Returns all active hints (the
 * caller rotates among them by time).
 */
export function buildContextHints(ctx: RenderContext, params: TutorialParams): string[] {
  const zh = ctx.config.language === 'zh';
  const hints: string[] = [];

  // Rule: context window usage high -> suggest /compact
  const ctxPct = ctx.stdin.context_window?.used_percentage;
  if (typeof ctxPct === 'number' && ctxPct >= params.contextThreshold) {
    const p = Math.round(ctxPct);
    hints.push(zh
      ? `context 已用 ${p}%，可用 /compact 壓縮對話`
      : `Context at ${p}% — use /compact to compress the conversation`);
  }

  // Rule: uncommitted git changes
  const gs = ctx.gitStatus;
  if (gs?.isDirty) {
    const fileStats = gs.fileStats;
    const count = fileStats
      ? fileStats.modified + fileStats.added + fileStats.deleted + fileStats.untracked
      : 0;
    if (count > 0) {
      hints.push(zh
        ? `有 ${count} 個未 commit 變更，記得適時提交`
        : `${count} uncommitted change(s) — consider committing`);
    } else {
      hints.push(zh
        ? '有未 commit 的變更，記得適時提交'
        : 'You have uncommitted changes — consider committing');
    }
  }

  // Rule: rate-limit usage high (5h takes priority over 7d)
  const usage = ctx.usageData;
  if (usage) {
    const five = usage.fiveHour;
    const week = usage.sevenDay;
    if (typeof five === 'number' && five >= params.rateThreshold) {
      hints.push(zh
        ? `5 小時用量已達 ${Math.round(five)}%，留意配額`
        : `5-hour usage at ${Math.round(five)}% — watch your quota`);
    } else if (typeof week === 'number' && week >= params.rateThreshold) {
      hints.push(zh
        ? `7 日用量已達 ${Math.round(week)}%，留意配額`
        : `7-day usage at ${Math.round(week)}% — watch your quota`);
    }
  }

  return hints;
}
