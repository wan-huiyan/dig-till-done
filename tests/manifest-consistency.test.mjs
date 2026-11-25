/**
 * Manifest consistency, Pattern B (one plugin, several skills).
 * Assertive checks only: a missing manifest at its canonical path is a FAILURE, never a skip.
 */
import { describe, it } from "node:test";
import assert from "node:assert/strict";
import { readFileSync, existsSync } from "node:fs";
import { resolve, dirname } from "node:path";
import { fileURLToPath } from "node:url";

const ROOT = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const PLUGIN = "no-ask-left-behind";
const SKILLS = ["no-ask-left-behind", "imposter-client"];

const marketplacePath = resolve(ROOT, ".claude-plugin/marketplace.json");
const pluginPath = resolve(ROOT, `plugins/${PLUGIN}/.claude-plugin/plugin.json`);
const skillPath = (s) => resolve(ROOT, `plugins/${PLUGIN}/skills/${s}/SKILL.md`);
const nameOf = (md) => (md.match(/^---\n[\s\S]*?^name:\s*(\S+)/m) || [])[1];

describe("layout", () => {
  it("marketplace.json is at .claude-plugin/marketplace.json", () => assert.ok(existsSync(marketplacePath)));
  it("plugin.json is inside plugins/<name>/.claude-plugin/", () => assert.ok(existsSync(pluginPath)));
  for (const s of SKILLS) it(`${s}/SKILL.md exists`, () => assert.ok(existsSync(skillPath(s)), skillPath(s)));
  it("no stale root-level SKILL.md", () => assert.ok(!existsSync(resolve(ROOT, "SKILL.md"))));
});

const marketplace = JSON.parse(readFileSync(marketplacePath, "utf-8"));
const plugin = JSON.parse(readFileSync(pluginPath, "utf-8"));

describe("manifests", () => {
  it("one plugin entry, named as in plugin.json", () => {
    assert.equal(marketplace.plugins.length, 1);
    assert.equal(marketplace.plugins[0].name, plugin.name);
  });
  it("source points at ./plugins/<name>", () => {
    assert.equal(marketplace.plugins[0].source, `./plugins/${plugin.name}`);
  });
  it("marketplace name is owner-prefixed", () => {
    assert.notEqual(marketplace.name, plugin.name);
    assert.ok(marketplace.name.endsWith(plugin.name));
  });
  it("version agrees across marketplace, plugin.json, package.json and VERSION", () => {
    const pkg = JSON.parse(readFileSync(resolve(ROOT, "package.json"), "utf-8"));
    const ver = readFileSync(resolve(ROOT, "VERSION"), "utf-8").trim();
    assert.equal(marketplace.plugins[0].version, plugin.version);
    assert.equal(pkg.version, plugin.version);
    assert.equal(ver, plugin.version);
  });
});

describe("skills", () => {
  for (const s of SKILLS) it(`${s} frontmatter name matches its folder`, () => {
    assert.equal(nameOf(readFileSync(skillPath(s), "utf-8")), s);
  });
});

describe("README", () => {
  const readme = readFileSync(resolve(ROOT, "README.md"), "utf-8");
  it("has a Version History entry for the current version", () => {
    assert.ok(readme.includes(`- **${plugin.version}** (`), `no '- **${plugin.version}** (' line`);
  });
  it("never shows the fake install command", () => {
    assert.ok(!/claude\s+install[- ]skill|claude\s+skill\s+install/.test(readme));
  });
  it("every repo-relative link and image exists", () => {
    const links = [...readme.matchAll(/\]\(((?:docs|plugins)\/[^)#\s]+)\)/g)].map((m) => m[1]);
    assert.ok(links.length > 0);
    for (const l of links) assert.ok(existsSync(resolve(ROOT, l)), `README links a missing path: ${l}`);
  });
});
