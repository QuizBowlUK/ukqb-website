import assert from "node:assert/strict";
import test from "node:test";
import { matchesTournamentFilters } from "./filters.ts";

test("eligibility and difficulty selections combine, including empty selections", () => {
  const both = ["open", "closed"];
  assert.equal(
    matchesTournamentFilters("open", 2, false, both, ["1", "2", "3"]),
    true,
  );
  assert.equal(matchesTournamentFilters("closed", 2, false, both, ["2"]), true);
  assert.equal(
    matchesTournamentFilters("closed", 2, false, ["open"], ["2"]),
    false,
  );
  assert.equal(
    matchesTournamentFilters("open", 3, false, both, ["1", "2"]),
    false,
  );
  assert.equal(matchesTournamentFilters("open", 2, false, [], ["2"]), false);
  assert.equal(matchesTournamentFilters("open", 2, false, both, []), false);
  assert.equal(
    matchesTournamentFilters("open", 0, false, both, ["pop-culture"]),
    false,
  );
  assert.equal(
    matchesTournamentFilters("open", 0, false, both, ["1", "2", "3", "4"]),
    false,
  );
});

test("half-dot tournaments match either adjacent integer level", () => {
  for (const dots of [1.5, 2.5]) {
    for (const level of [0, 1, 2, 3, 4]) {
      assert.equal(
        matchesTournamentFilters(
          "closed",
          dots,
          false,
          ["closed"],
          [String(level)],
        ),
        level === Math.floor(dots) || level === Math.ceil(dots),
      );
    }
  }
});

test("pop culture matches the explicit flag, including tournaments with dots", () => {
  const both = ["open", "closed"];
  assert.equal(
    matchesTournamentFilters("open", 0, true, both, ["pop-culture"]),
    true,
  );
  assert.equal(
    matchesTournamentFilters("open", 2, true, both, ["pop-culture"]),
    true,
  );
  assert.equal(
    matchesTournamentFilters("open", 2, false, both, ["pop-culture"]),
    false,
  );
  assert.equal(
    matchesTournamentFilters("open", 0, true, both, ["1", "2"]),
    false,
  );
  assert.equal(
    matchesTournamentFilters("closed", 0, true, ["open"], ["pop-culture"]),
    false,
  );
  assert.equal(
    matchesTournamentFilters("open", 3, false, both, ["2", "pop-culture"]),
    false,
  );
  assert.equal(
    matchesTournamentFilters("open", 2, false, both, ["2", "pop-culture"]),
    true,
  );
});
