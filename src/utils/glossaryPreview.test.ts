import { test } from "node:test";
import { strict as assert } from "node:assert";
import { readFileSync } from "node:fs";

const preview = JSON.parse(
  readFileSync(
    new URL("../data/glossaryPreview.json", import.meta.url),
    "utf8",
  ),
);

test("the preview retains Danny's entries and the existing glossary", () => {
  const entries = preview.groups.flatMap(
    (group: { entries: unknown[] }) => group.entries,
  );
  const paired = entries.filter(
    (entry: { existing?: unknown }) => entry.existing,
  );
  assert.equal(entries.length, 82);
  assert.equal(paired.length, 24);
  assert.equal(paired.length + preview.existingOnly.length, 35);
});
