import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import test from "node:test";

const pageSource = await readFile(new URL("../app/page.tsx", import.meta.url), "utf8");
const lessonSource = await readFile(new URL("../app/lesson-data.ts", import.meta.url), "utf8");
const docsSource = await readFile(new URL("../app/techdocs.ts", import.meta.url), "utf8");

test("offers the three approved first-run paths", () => {
  assert.match(pageSource, /Launch an AI Agent by Phone/);
  assert.match(pageSource, /Connect SIP \+ a Live Hub Number/);
  assert.match(pageSource, /Connect Microsoft Teams \+ SIP/);
  assert.match(pageSource, /THE HEART/);
});

test("phone-number lesson uses the Academy request workflow", () => {
  assert.match(lessonSource, /Request a US or UK phone number/);
  assert.match(lessonSource, /Submit the form/);
  assert.match(lessonSource, /Wait for provisioning/);
  assert.doesNotMatch(lessonSource, /Buy one Live Hub phone number/);
});

test("navigation transitions reset the document to the top", () => {
  assert.match(pageSource, /function resetPagePosition/);
  assert.match(pageSource, /window\.scrollTo\(\{ top: 0, left: 0, behavior: "auto" \}\)/);
  assert.match(pageSource, /const openLesson = \(index: number\)/);
});

test("official deep links do not use the broken lowercase content path", () => {
  assert.doesNotMatch(docsSource, /\/content\/ai-agents/i);
  assert.match(docsSource, /#AI-Agents\/Tools\.htm/);
  assert.match(docsSource, /Purchasing%20Phone%20Numbers\.htm/);
});

test("turns the supplied SIP training into actionable checks", () => {
  assert.match(lessonSource, /FQDN \(Request-URI\)/);
  assert.match(lessonSource, /REGISTER or OPTIONS/);
  assert.match(lessonSource, /Teams-to-SIP and SIP-to-Teams need separate rules/);
});
