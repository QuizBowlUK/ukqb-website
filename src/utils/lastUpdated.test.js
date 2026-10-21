import assert from "node:assert/strict";
import { execFileSync } from "node:child_process";
import { mkdtempSync, rmSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { join, resolve } from "node:path";
import { pathToFileURL } from "node:url";
import test from "node:test";
import { getLastUpdated } from "./lastUpdated.js";
import { getBlogSourceFiles } from "./blogSourceFiles.js";

test("timestamps follow page content and data, ignoring unrelated commits", () => {
  const originalDirectory = process.cwd();
  const prepareHistoryScript = resolve("scripts/prepare-git-history.js");
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
    writeFileSync("portrait.jpg", "Original photo");
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
    assert.throws(() => getLastUpdated(["missing.md"], true), /No Git history/);
    writeFileSync("draft.md", "Uncommitted draft");
    assert.equal(getLastUpdated(["draft.md"], true), null);
    assert.equal(getLastUpdated(["draft.md", "portrait.jpg"], true), null);
    assert.throws(() => getLastUpdated(["draft.md"]), /No Git history/);
    assert.throws(
      () => getLastUpdated(["draft.md", "portrait.jpg"]),
      /No Git history/,
    );

    writeFileSync("portrait.jpg", "Replacement photo");
    commit("2026-08-01T12:00:00Z");
    assert.equal(
      getLastUpdated(["page.md", "portrait.jpg"]).toISOString(),
      "2026-08-01T12:00:00.000Z",
    );

    const shallow = join(directory, "shallow");
    git(
      "clone",
      "--quiet",
      "--depth=1",
      pathToFileURL(directory).href,
      shallow,
    );
    process.chdir(shallow);
    assert.throws(() => getLastUpdated(["page.md"]), /full Git history/);
    execFileSync(process.execPath, [prepareHistoryScript], { cwd: shallow });
    assert.equal(
      getLastUpdated(["page.md"]).toISOString(),
      "2026-01-01T12:00:00.000Z",
    );
  } finally {
    process.chdir(originalDirectory);
    rmSync(directory, { recursive: true, force: true });
  }
});

test("blog sources include feature and body images, excluding remote URLs", () => {
  const post = {
    id: "post",
    filePath: "src/data/blog/post.md",
    data: { image: { feature: "feature.jpg", teaser: { path: "teaser.jpg" } } },
    rendered: {
      metadata: {
        imagePaths: [
          "../../assets/blog/body.jpg",
          "https://example.com/photo.jpg",
          "//example.com/photo.jpg",
        ],
      },
    },
  };
  assert.deepEqual(getBlogSourceFiles(post), [
    "src/data/blog/post.md",
    "src/assets/blog/feature.jpg",
    resolve("src/assets/blog/body.jpg"),
  ]);
  delete post.data.image.feature;
  assert.equal(getBlogSourceFiles(post)[1], "src/assets/blog/teaser.jpg");
});
