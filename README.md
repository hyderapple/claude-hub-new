# claude-hub-new

A Claude Code statusline HUD with a **context-aware tutorial / hint bar**.

It shows everything the excellent [claude-hud](https://github.com/jarrodwatts/claude-hud) shows — model, context-usage bar, rate limits, git status, tool/agent/todo activity — and adds one more line: a **tutorial bar** that surfaces context-aware suggestions when something needs your attention, and otherwise rotates short Claude Code tips.

> **Fork notice:** This project is a fork of [jarrodwatts/claude-hud](https://github.com/jarrodwatts/claude-hud) (MIT). All the core HUD work is Jarrod Watts'. The tutorial bar and rebrand are the additions here. 繁體中文說明見 [README.zh.md](./README.zh.md)。

---

## The tutorial bar

The extra line behaves in two tiers:

**Tier 1 — context-aware hints (high priority).** When a rule fires, the bar shows it:

```
~/my-project   main*
Opus 4.8 │ ctx 87%
▸ Hint  Context at 87% — use /compact to compress the conversation
```

Built-in rules:
- Context window usage at/above a threshold → suggest `/compact`
- Uncommitted git changes → reminder (with file count when available)
- 5-hour / 7-day rate-limit usage at/above a threshold → quota warning

**Tier 2 — rotating tips (when nothing urgent).** A curated set of Claude Code tips (English + Traditional Chinese), shown one at a time:

```
~/my-project   main
Opus 4.8 │ ctx 24%
▸ Tip  Double-tap Esc to edit and resend a previous message
```

**No flicker.** The statusline redraws roughly every 300 ms, but the shown entry only changes once per `rotateSeconds` window — the index is derived from the clock (`floor(now / rotateSeconds)`), so rapid redraws keep showing the same line.

---

## Install

```
/plugin marketplace add hyderapple/claude-hub-new
/plugin install claude-hub-new
/claude-hub-new:setup
```

`/claude-hub-new:setup` detects your runtime (node/bun) and writes the `statusLine` entry to your Claude Code `settings.json`. Restart Claude Code afterwards.

Requires Node.js ≥ 18 (or Bun).

---

## Configuration

Config lives at `~/.claude/plugins/claude-hub-new/config.json`. The tutorial bar adds a `tutorial` block (all optional — defaults shown):

```json
{
  "language": "zh",
  "tutorial": {
    "enabled": true,
    "rotateSeconds": 30,
    "contextThreshold": 85,
    "rateThreshold": 80,
    "extraTips": []
  }
}
```

| Key | Default | Meaning |
|-----|---------|---------|
| `enabled` | `true` | Show the tutorial bar at all |
| `rotateSeconds` | `30` | Seconds each tip/hint stays before rotating |
| `contextThreshold` | `85` | Context-window used-% at/above which to suggest `/compact` |
| `rateThreshold` | `80` | Rate-limit used-% at/above which to warn about quota |
| `extraTips` | `[]` | Your own tips, shown before the built-in ones |

Set `"language": "zh"` for Traditional-Chinese tips and hints. To turn the bar off, set `tutorial.enabled` to `false`. To reorder it among the other lines, use `elementOrder` (the element name is `tutorial`).

All other configuration — layout, colors, git status, optional lines — is inherited from claude-hud; see the [upstream README](https://github.com/jarrodwatts/claude-hud) for the full reference.

---

## Credits & license

- Original HUD: **[claude-hud](https://github.com/jarrodwatts/claude-hud)** by Jarrod Watts.
- Tutorial bar + rebrand: hyderapple.

MIT — see [LICENSE](./LICENSE). The original copyright notice is retained.
