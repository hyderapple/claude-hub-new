# Tutorial bar — design notes

The tutorial bar is the one feature claude-hub-new adds on top of claude-hud.
It is a normal HUD element (`tutorial`), so it participates in `elementOrder`,
toggling, and wrapping like every other line.

## Files

| File | Role |
|------|------|
| `src/render/lines/tutorial-tips.ts` | Content + rules. `GENERAL_TIPS` (bilingual tip pool) and `buildContextHints()` (the context-aware rules). |
| `src/render/lines/tutorial.ts` | `renderTutorialLine()` — assembles the pool, picks one by time, formats the line. |
| `src/config.ts` | `TutorialConfig` type, defaults, validation (`validateTutorial`), and `'tutorial'` in `HudElement` / `DEFAULT_ELEMENT_ORDER`. |
| `src/render/index.ts` | `case 'tutorial'` in `renderElementLine`. |
| `src/i18n/{types,en,zh}.ts` | `label.tip` / `label.hint`. |

## Behavior

Two tiers feed one rotation pool:

1. **Context-aware hints (Tier 1, high priority).** `buildContextHints(ctx)`
   inspects the live `RenderContext` and returns a string per active rule:
   - `context_window.used_percentage >= contextThreshold` → suggest `/compact`
   - `gitStatus.isDirty` → uncommitted-changes reminder (+ count from `fileStats`)
   - `usageData.fiveHour|sevenDay >= rateThreshold` → quota warning

   If any fire, they become the pool and the line is labelled "Hint".

2. **General tips (Tier 2).** When no Tier-1 hint is active, the pool is
   `extraTips` followed by `GENERAL_TIPS[language]`, labelled "Tip".

## Rotation without flicker

The statusline is re-invoked roughly every 300 ms. To avoid flicker, the shown
entry is a pure function of the wall clock:

```
index = floor(Date.now() / (rotateSeconds * 1000)) % pool.length
```

The index only advances once per `rotateSeconds` window, so rapid redraws keep
showing the same entry. No persistent state is needed.

This also makes single-hint scenarios deterministic (pool length 1 → index 0),
which is what `tests/tutorial.test.js` relies on.

## Adding a rule or tip

- New general tip: add to both `en` and `zh` arrays in `GENERAL_TIPS`.
- New context rule: push a localized string inside `buildContextHints()`.
- Keep `tests/tutorial.test.js` deterministic — assert on single-trigger
  scenarios, or force `index = 0` with a huge `rotateSeconds`.
