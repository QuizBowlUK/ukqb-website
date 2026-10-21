import assert from "node:assert/strict";
import { execFileSync } from "node:child_process";
import { mkdtempSync, rmSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import test from "node:test";
import { getLastUpdated } from "./lastUpdated.js";

test("timestamps follow page content and data, ignoring unrelated commits", () => {
  const originalDirectory = process.cwd();
  const directory = mkdtempSync(join(tmpdir(), "ukqb-last-updated-"));
  const git = (...args) => execFileSync("git", args, { cwd: directory });
  const commit = (date) => {
    git("add", ".");
    execFileSync(
      "git",
      ["-c", "commit.gpgsign=false", "commit", "-m", "Update"],
      {
        cwd: directory,
        env: {
          ...process.env,
          GIT_AUTHOR_NAME: "Test",
          GIT_AUTHOR_EMAIL: "test@example.com",
          GIT_COMMITTER_NAME: "Test",
          GIT_COMMITTER_EMAIL: "test@example.com",
          GIT_AUTHOR_DATE: date,
          GIT_COMMITTER_DATE: date,
        },
      },
    );
  };
  try {
    git("init");
    process.chdir(directory);
    writeFileSync("page.md", "Page");
    commit("2026-01-01T12:00:00Z");
    writeFileSync("data.json", "{}");
    commit("2026-07-01T12:00:00Z");
    assert.equal(
      getLastUpdated(["page.md"]).toISOString(),
      "2026-01-01T12:00:00.000Z",
    );
    assert.equal(
      getLastUpdated(["page.md", "data.json"]).toISOString(),
      "2026-07-01T12:00:00.000Z",
    );
    assert.throws(() => getLastUpdated(["missing.md"]), /No Git history/);
  } finally {
    process.chdir(originalDirectory);
    rmSync(directory, { recursive: true, force: true });
  }
});
