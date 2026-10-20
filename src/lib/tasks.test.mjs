// Run: node --test src/lib/tasks.test.mjs  (Node 24 strips the TS types)
import { test } from "node:test";
import assert from "node:assert/strict";
import { validateTask, isUuid } from "./tasks.ts";

test("title is required and trimmed", () => {
  assert.equal(validateTask({ title: "" }).ok, false);
  assert.equal(validateTask({ title: "   " }).ok, false);
  assert.equal(validateTask({ title: null }).ok, false);
  assert.deepEqual(validateTask({ title: "  Buy milk " }), { ok: true, value: { title: "Buy milk", description: null } });
});

test("length limits match the DB", () => {
  assert.equal(validateTask({ title: "a".repeat(200) }).ok, true);
  assert.equal(validateTask({ title: "a".repeat(201) }).ok, false);
  assert.equal(validateTask({ title: "x", description: "d".repeat(2001) }).ok, false);
});

test("empty description becomes null", () => {
  assert.equal(validateTask({ title: "x", description: "  " }).value.description, null);
});

test("status must be a known value", () => {
  assert.equal(validateTask({ title: "x", status: "done" }).value.status, "done");
  assert.equal(validateTask({ title: "x", status: "archived" }).ok, false);
});

test("isUuid", () => {
  assert.equal(isUuid("3f2b1c9e-8a7d-4e6f-9b0a-1c2d3e4f5a6b"), true);
  assert.equal(isUuid("1; drop table tasks"), false);
});
