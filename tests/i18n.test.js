import { test } from "node:test";
import assert from "node:assert/strict";
import { setLanguage, getLanguage, t } from "../dist/i18n/index.js";
import { mergeConfig } from "../dist/config.js";

test("t() returns English strings by default", () => {
  setLanguage("en");
  assert.equal(t("label.context"), "Context");
  assert.equal(t("label.usage"), "Usage");
  assert.equal(t("label.approxRam"), "Approx RAM");
  assert.equal(t("status.limitReached"), "Limit reached");
  assert.equal(t("status.allTodosComplete"), "All todos complete");
});

test("t() returns Chinese strings when language is zh", () => {
  setLanguage("zh");
  assert.equal(t("label.context"), "上下文");
  assert.equal(t("label.usage"), "用量");
  assert.equal(t("label.approxRam"), "記憶體");
  assert.equal(t("label.rules"), "規則");
  assert.equal(t("label.hooks"), "鉤子");
  assert.equal(t("status.limitReached"), "已達上限");
  assert.equal(t("status.allTodosComplete"), "全部完成");
  assert.equal(t("format.in"), "輸入");
  assert.equal(t("format.cache"), "快取");
  assert.equal(t("format.out"), "輸出");
  // Restore
  setLanguage("en");
});

test("setLanguage and getLanguage round-trip", () => {
  setLanguage("zh");
  assert.equal(getLanguage(), "zh");
  setLanguage("en");
  assert.equal(getLanguage(), "en");
});

test("mergeConfig defaults to Traditional Chinese when no language is specified", () => {
  const config = mergeConfig({});
  assert.equal(config.language, "zh");
});

test("mergeConfig preserves explicit language from config", () => {
  const config = mergeConfig({ language: "zh" });
  assert.equal(config.language, "zh");

  const config2 = mergeConfig({ language: "en" });
  assert.equal(config2.language, "en");
});

test("mergeConfig falls back to default (zh) for invalid language", () => {
  const config = mergeConfig({ language: "invalid" });
  assert.equal(config.language, "zh");
});
