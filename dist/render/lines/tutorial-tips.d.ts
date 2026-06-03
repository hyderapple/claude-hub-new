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
export declare const GENERAL_TIPS: Record<Language, string[]>;
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
export declare function buildContextHints(ctx: RenderContext, params: TutorialParams): string[];
//# sourceMappingURL=tutorial-tips.d.ts.map