import { cyan, label } from '../colors.js';
import { t } from '../../i18n/index.js';
import { GENERAL_TIPS, buildContextHints } from './tutorial-tips.js';
const MARKER = '▸';
/**
 * Tutorial / hint bar.
 *
 * Behavior (synthesis of "context-aware" + "time-rotated"):
 *   1. Build Tier-1 context-aware hints from the live context. If any fire,
 *      they become the rotation pool (and the line is labelled "Hint").
 *   2. Otherwise the pool is the user's extraTips followed by the curated
 *      general tips for the active language (labelled "Tip").
 *   3. Pick one entry by a TIME-based index so the ~300ms statusline refresh
 *      never causes flicker — the shown entry only changes every
 *      `rotateSeconds`.
 */
export function renderTutorialLine(ctx) {
    const cfg = ctx.config.tutorial;
    if (!cfg || cfg.enabled === false) {
        return null;
    }
    const colors = ctx.config.colors;
    const lang = ctx.config.language;
    const contextHints = buildContextHints(ctx, {
        contextThreshold: cfg.contextThreshold,
        rateThreshold: cfg.rateThreshold,
    });
    const isHint = contextHints.length > 0;
    let pool;
    if (isHint) {
        pool = contextHints;
    }
    else {
        const builtin = GENERAL_TIPS[lang] ?? GENERAL_TIPS.en;
        const extra = Array.isArray(cfg.extraTips) ? cfg.extraTips : [];
        pool = [...extra, ...builtin];
    }
    if (pool.length === 0) {
        return null;
    }
    // Time-based rotation: index changes once per rotateSeconds window, so the
    // high-frequency statusline refresh keeps showing the same entry (no flicker).
    const rotateMs = Math.max(1, cfg.rotateSeconds) * 1000;
    const index = Math.floor(Date.now() / rotateMs) % pool.length;
    const text = pool[index];
    const prefix = label(t(isHint ? 'label.hint' : 'label.tip'), colors);
    return `${cyan(MARKER)} ${prefix} ${text}`;
}
//# sourceMappingURL=tutorial.js.map