import type { RenderContext } from '../../types.js';
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
export declare function renderTutorialLine(ctx: RenderContext): string | null;
//# sourceMappingURL=tutorial.d.ts.map