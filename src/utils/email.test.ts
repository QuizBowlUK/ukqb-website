import assert from "node:assert/strict";
import test from "node:test";
import { isEmail } from "./email.ts";

test("isEmail accepts plausible addresses", () => {
  for (const value of ["a@b.co", "first.last+tag@quizbowl.co.uk"]) {
    assert.equal(isEmail(value), true, value);
  }
});

test("isEmail rejects obvious typos", () => {
  for (const value of ["", "a@b", "a b@c.com", "a@b c.com", "@b.com", "a@"]) {
    assert.equal(isEmail(value), false, value);
  }
});
