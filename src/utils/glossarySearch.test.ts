import { test } from "node:test";
import { strict as assert } from "node:assert";
import { isGlossaryEntry, matchesGlossaryQuery } from "./glossarySearch.ts";

test("recognises both bold-label colon styles in the glossary redraft", () => {
  assert.equal(
    isGlossaryEntry("Bonus/bonus set:", " A set of three questions"),
    true,
  );
  assert.equal(isGlossaryEntry("Field", ": The set of players"), true);
  assert.equal(isGlossaryEntry("Emphasis", " without a colon"), false);
});

test("matches case-insensitively in terms and definitions, and clears with whitespace", () => {
  const entry =
    "Moderator/Mod: The official in charge of reading questions and scoring games.";
  assert.equal(matchesGlossaryQuery(entry, " MODERATOR "), true);
  assert.equal(matchesGlossaryQuery(entry, "SCORING"), true);
  assert.equal(matchesGlossaryQuery(entry, "neg"), false);
  assert.equal(matchesGlossaryQuery(entry, "  "), true);
});
