import assert from "node:assert/strict";
import test from "node:test";
import { matchesTournamentFilters } from "./filters.js";

test("eligibility and difficulty selections combine, including empty selections", () => {
  const both = ["open", "closed"];
  assert.equal(matchesTournamentFilters("open", 2, both, [1, 2, 3]), true);
  assert.equal(matchesTournamentFilters("closed", 2, both, [2]), true);
  assert.equal(matchesTournamentFilters("closed", 2, ["open"], [2]), false);
  assert.equal(matchesTournamentFilters("open", 3, both, [1, 2]), false);
  assert.equal(matchesTournamentFilters("open", 2, [], [2]), false);
  assert.equal(matchesTournamentFilters("open", 2, both, []), false);
  assert.equal(matchesTournamentFilters("open", 0, both, [0]), true);
  assert.equal(matchesTournamentFilters("open", 0, both, [1, 2, 3, 4]), false);
});

test("half-dot tournaments match either adjacent integer level", () => {
  for (const dots of [1.5, 2.5]) {
    for (const level of [0, 1, 2, 3, 4]) {
      assert.equal(
        matchesTournamentFilters("closed", dots, ["closed"], [level]),
        level === Math.floor(dots) || level === Math.ceil(dots),
      );
    }
  }
});
