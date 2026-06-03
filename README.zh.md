# claude-hub-new

帶有**情境感知教學／提示列**的 Claude Code statusline HUD。

它保留 [claude-hud](https://github.com/jarrodwatts/claude-hud) 的全部內容 —— 模型、context 用量條、rate limit、git 狀態、工具／代理／todo 活動 —— 並多加一行 **教學 bar**:當有狀況需要你注意時跳出情境提示,否則輪播簡短的 Claude Code 小技巧。

> **Fork 聲明:** 本專案 fork 自 [jarrodwatts/claude-hud](https://github.com/jarrodwatts/claude-hud)(MIT)。核心 HUD 全是 Jarrod Watts 的作品,本 repo 的新增物是教學 bar 與改名。English: [README.md](./README.md)。

---

## 教學 bar 怎麼運作

這一行分兩層:

**第一層 — 情境感知提示(高優先)。** 規則命中時直接顯示:

```
~/my-project   main*
Opus 4.8 │ ctx 87%
▸ 提示  context 已用 87%，可用 /compact 壓縮對話
```

內建規則:
- context 用量達門檻 → 建議 `/compact`
- 有未 commit 的 git 變更 → 提醒(有檔案統計時附筆數)
- 5 小時／7 日 rate limit 用量達門檻 → 配額提醒

**第二層 — 輪播教學(沒有急事時)。** 一組精選的 Claude Code 小技巧(繁中 + 英文),一次顯示一則:

```
~/my-project   main
Opus 4.8 │ ctx 24%
▸ 教學  雙擊 Esc 可編輯並重送上一則訊息
```

**不閃爍。** statusline 大約每 300ms 重畫一次,但顯示的那一則只在每個 `rotateSeconds` 視窗變一次 —— index 由時鐘推出(`floor(now / rotateSeconds)`),所以高頻重畫期間都顯示同一則。

---

## 安裝

```
/plugin marketplace add hyderapple/claude-hub-new
/plugin install claude-hub-new
/claude-hub-new:setup
```

`/claude-hub-new:setup` 會偵測你的 runtime(node/bun)並把 `statusLine` 設定寫進 Claude Code 的 `settings.json`。完成後重啟 Claude Code。

需求:Node.js ≥ 18(或 Bun)。

---

## 設定

設定檔位於 `~/.claude/plugins/claude-hub-new/config.json`。教學 bar 新增一個 `tutorial` 區塊(全部可選,以下為預設值):

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

| 鍵 | 預設 | 說明 |
|-----|---------|---------|
| `enabled` | `true` | 是否顯示教學 bar |
| `rotateSeconds` | `30` | 每則停留幾秒後輪播 |
| `contextThreshold` | `85` | context 用量達此 % 就建議 `/compact` |
| `rateThreshold` | `80` | rate limit 用量達此 % 就提醒配額 |
| `extraTips` | `[]` | 你自己的 tips,排在內建之前 |

把 `"language"` 設成 `"zh"` 可用繁中教學與提示。要關掉這一行,把 `tutorial.enabled` 設為 `false`。要調整它在各行之間的位置,用 `elementOrder`(element 名稱是 `tutorial`)。

其餘設定(版面、配色、git 狀態、選用行)沿用 claude-hud,完整參考見[上游 README](https://github.com/jarrodwatts/claude-hud)。

---

## 致謝與授權

- 原始 HUD:**[claude-hud](https://github.com/jarrodwatts/claude-hud)**,作者 Jarrod Watts。
- 教學 bar + 改名:hyderapple。

MIT — 見 [LICENSE](./LICENSE),原版權聲明已保留。
