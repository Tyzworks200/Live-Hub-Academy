import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import test from "node:test";

const pageSource = await readFile(new URL("../app/page.tsx", import.meta.url), "utf8");
const lessonSource = await readFile(new URL("../app/lesson-data.ts", import.meta.url), "utf8");
const supplementalSource = await readFile(new URL("../app/supplemental-lesson-data.ts", import.meta.url), "utf8");
const docsSource = await readFile(new URL("../app/techdocs.ts", import.meta.url), "utf8");
const quizSource = await readFile(new URL("../app/quiz-data.ts", import.meta.url), "utf8");

test("offers the three approved outcome-first paths", () => {
  assert.match(pageSource, /First Successful AI Call/);
  assert.match(pageSource, /Bring Your Own SIP/);
  assert.match(pageSource, /Connect Microsoft Teams/);
  assert.match(pageSource, /THE HEART/);
});

test("frames the Academy as a five-level customer success journey", () => {
  assert.match(pageSource, /First successful call/);
  assert.match(pageSource, /Connect my telephony/);
  assert.match(pageSource, /Route intelligently/);
  assert.match(pageSource, /Operate production/);
  assert.match(pageSource, /Production readiness/);
  assert.match(pageSource, /Origin/);
  assert.match(pageSource, /Destination/);
  assert.match(pageSource, /Proof/);
});

test("covers the full 2.19.2 product map as focused outcome courses", () => {
  for (const track of [
    "bot-connect",
    "speech-provider",
    "click-to-call",
    "whatsapp",
    "outbound",
    "campaigns",
    "call-features",
    "platform-api",
    "account-admin",
    "agent-assist",
    "translation",
  ]) assert.match(pageSource, new RegExp(`id: "${track}"`));
  assert.match(pageSource, /complete outcome courses/);
  assert.match(pageSource, /CHOOSE ONE OUTCOME/);
});

test("keeps current authentication and account rules accurate", () => {
  assert.match(supplementalSource, /Dialout API.*HTTP Basic/s);
  assert.match(supplementalSource, /main REST API.*OAuth bearer/s);
  assert.match(supplementalSource, /does not by itself enable outbound PSTN/s);
  assert.match(supplementalSource, /seven days for transcripts and thirty days for recordings/);
});

test("missions require actions and visible evidence instead of reading completion", () => {
  assert.match(pageSource, /MISSION/);
  assert.match(pageSource, /EVIDENCE/);
  assert.match(pageSource, /Prove the mission worked/);
  assert.match(pageSource, /One action at a time/);
  assert.match(pageSource, /Success check locked/);
  assert.match(pageSource, /challengeReady/);
  assert.match(pageSource, /allEvidenceVerified/);
  assert.match(pageSource, /Checkbox/);
});

test("voice is a short coaching script instead of full-text narration", () => {
  assert.match(pageSource, /const coachingScript/);
  assert.match(pageSource, /Coach me · under 90 sec/);
  assert.doesNotMatch(pageSource, /const lessonNarration/);
});

test("phone-number lesson uses the Academy request workflow", () => {
  assert.match(lessonSource, /Give customers a real US or UK number/);
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

test("home provides a useful guide and keeps a stable Intercom integration slot", () => {
  assert.match(pageSource, /id="livehub-academy-assistant"/);
  assert.match(pageSource, /data-integration-slot="intercom"/);
  assert.match(pageSource, /function guideLearner/);
  assert.match(pageSource, /ACADEMY GUIDE · READY/);
  assert.doesNotMatch(pageSource, /AI Assistant coming soon/);
});

test("finishing the last mission celebrates a working outcome", () => {
  assert.match(pageSource, /function MissionCompleteView/);
  assert.match(pageSource, /WORKING OUTCOME ACHIEVED/);
  assert.match(pageSource, /You made it/);
  assert.match(pageSource, /Continue toward production/);
  assert.match(pageSource, /Optional knowledge checkpoint/);
  assert.match(pageSource, /Progress and evidence saved on this device/);
  assert.match(pageSource, /onMissionComplete\(\)/);
});

test("bootcamp knowledge check links explanations to official TechDocs", () => {
  assert.match(pageSource, /function KnowledgeCheckView/);
  assert.match(quizSource, /knowledgeQuestions/);
  assert.match(quizSource, /sourceUrl: TECH_DOCS\./);
  assert.doesNotMatch(quizSource, /\$750|\$500|MOQ|Azure Marketplace/);
});

test("uses the improved Live Hub documentation entry point", () => {
  assert.match(docsSource, /AudioCodes%20Live%20Hub\.htm\?TocPath=_____1/);
});
