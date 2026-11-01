import { test } from "node:test";
import { strict as assert } from "node:assert";
import { matchesGlossaryQuery } from "./glossarySearch.ts";

test("matches case-insensitively in terms and definitions, and clears with whitespace", () => {
  const entry =
    "Moderator/Mod: The official in charge of reading questions and scoring games.";
  assert.equal(matchesGlossaryQuery(entry, " MODERATOR "), true);
  assert.equal(matchesGlossaryQuery(entry, "SCORING"), true);
  assert.equal(matchesGlossaryQuery(entry, "neg"), false);
  assert.equal(matchesGlossaryQuery(entry, "  "), true);
});
