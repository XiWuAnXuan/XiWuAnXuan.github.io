import assert from "node:assert/strict";
import { test } from "node:test";
import {
  getPageNumbers,
  getPaginatedItems,
  getTotalPages,
} from "./pagination.mjs";

test("calculates total pages with at least one page", () => {
  assert.equal(getTotalPages(0, 5), 1);
  assert.equal(getTotalPages(5, 5), 1);
  assert.equal(getTotalPages(6, 5), 2);
});

test("returns items for the requested page", () => {
  const items = Array.from({ length: 12 }, (_, index) => index + 1);

  assert.deepEqual(getPaginatedItems(items, 1, 5), [1, 2, 3, 4, 5]);
  assert.deepEqual(getPaginatedItems(items, 2, 5), [6, 7, 8, 9, 10]);
  assert.deepEqual(getPaginatedItems(items, 3, 5), [11, 12]);
});

test("returns all page numbers", () => {
  assert.deepEqual(getPageNumbers(12, 5), [1, 2, 3]);
});
