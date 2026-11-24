/**
 * Runs the skill-description gate (vendored inside the plugin so installed users get it too).
 * Fails, never skips, when python3 is missing: a gate that cannot run has not passed.
 */
import { it } from "node:test";
import assert from "node:assert/strict";
import { spawnSync } from "node:child_process";
import { resolve, dirname } from "node:path";
import { fileURLToPath } from "node:url";

const ROOT = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const GATE = resolve(ROOT, "plugins/dig-till-done/scripts/check_skill_descriptions.py");

it("every SKILL.md description is under the listing cap and not corrupted by line-wrap", () => {
  const r = spawnSync("python3", [GATE, resolve(ROOT, "plugins/dig-till-done"), "--no-color", "--triggers"], { encoding: "utf-8" });
  assert.ok(!r.error, `python3 could not run: ${r.error}`);
  assert.equal(r.status, 0, r.stdout + r.stderr);
});
