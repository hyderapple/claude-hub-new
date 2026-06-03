import type { Language } from './i18n/types.js';
export type LineLayoutType = 'compact' | 'expanded';
export type AutocompactBufferMode = 'enabled' | 'disabled';
export type ContextValueMode = 'percent' | 'tokens' | 'remaining' | 'both';
/**
 * Controls how the model name is displayed in the HUD badge.
 *
 *   full:    Show the raw display name as-is (e.g. "Opus 4.6 (1M context)")
 *   compact: Strip redundant context-window suffix (e.g. "Opus 4.6")
 *   short:   Strip context suffix AND "Claude " prefix (e.g. "Opus 4.6")
 */
export type ModelFormatMode = 'full' | 'compact' | 'short';
export type HudElement = 'project' | 'context' | 'usage' | 'memory' | 'environment' | 'tutorial' | 'tools' | 'agents' | 'todos';
export type HudColorName = 'dim' | 'red' | 'green' | 'yellow' | 'magenta' | 'cyan' | 'brightBlue' | 'brightMagenta';
/** A color value: named preset, 256-color index (0-255), or hex string (#rrggbb). */
export type HudColorValue = HudColorName | number | string;
export interface HudColorOverrides {
    context: HudColorValue;
    usage: HudColorValue;
    warning: HudColorValue;
    usageWarning: HudColorValue;
    critical: HudColorValue;
    model: HudColorValue;
    project: HudColorValue;
    git: HudColorValue;
    gitBranch: HudColorValue;
    label: HudColorValue;
    custom: HudColorValue;
}
export declare const DEFAULT_ELEMENT_ORDER: HudElement[];
/**
 * Tutorial / hint bar settings. The bar surfaces context-aware hints
 * (high priority) and otherwise rotates general tips on a timer.
 */
export interface TutorialConfig {
    enabled: boolean;
    /** Seconds each tip/hint stays before rotating (>= 1). */
    rotateSeconds: number;
    /** Context-window used-% at/above which to suggest /compact (0-100). */
    contextThreshold: number;
    /** Rate-limit used-% at/above which to warn about quota (0-100). */
    rateThreshold: number;
    /** User-supplied tips, shown before the built-in ones. */
    extraTips: string[];
}
export interface HudConfig {
    language: Language;
    lineLayout: LineLayoutType;
    showSeparators: boolean;
    pathLevels: 1 | 2 | 3;
    elementOrder: HudElement[];
    tutorial: TutorialConfig;
    gitStatus: {
        enabled: boolean;
        showDirty: boolean;
        showAheadBehind: boolean;
        showFileStats: boolean;
        pushWarningThreshold: number;
        pushCriticalThreshold: number;
    };
    display: {
        showModel: boolean;
        showProject: boolean;
        showContextBar: boolean;
        contextValue: ContextValueMode;
        showConfigCounts: boolean;
        showCost: boolean;
        showDuration: boolean;
        showSpeed: boolean;
        showTokenBreakdown: boolean;
        showUsage: boolean;
        usageBarEnabled: boolean;
        showTools: boolean;
        showAgents: boolean;
        showTodos: boolean;
        showSessionName: boolean;
        showClaudeCodeVersion: boolean;
        showMemoryUsage: boolean;
        showSessionTokens: boolean;
        showOutputStyle: boolean;
        autocompactBuffer: AutocompactBufferMode;
        usageThreshold: number;
        sevenDayThreshold: number;
        environmentThreshold: number;
        modelFormat: ModelFormatMode;
        modelOverride: string;
        customLine: string;
    };
    colors: HudColorOverrides;
}
export declare const DEFAULT_CONFIG: HudConfig;
export declare function getConfigPath(): string;
export declare function mergeConfig(userConfig: Partial<HudConfig>): HudConfig;
export declare function loadConfig(): Promise<HudConfig>;
//# sourceMappingURL=config.d.ts.map