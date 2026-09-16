import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import test from "node:test";

const pageSource = await readFile(new URL("../app/page.tsx", import.meta.url), "utf8");
const lessonSource = await readFile(new URL("../app/lesson-data.ts", import.meta.url), "utf8");
const supplementalSource = await readFile(new URL("../app/supplemental-lesson-data.ts", import.meta.url), "utf8");
const docsSource = await readFile(new URL("../app/techdocs.ts", import.meta.url), "utf8");
const quizSource = await readFile(new URL("../app/quiz-data.ts", import.meta.url), "utf8");

const homeRuntime = pageSource.slice(pageSource.indexOf("export default function Home()"), pageSource.indexOf("type MissionMatch"));
const academyHome = pageSource.slice(pageSource.indexOf("function AcademyHome("), pageSource.indexOf("type RoutingSource"));
const pathWorkspace = pageSource.slice(pageSource.indexOf("function PathWorkspace("), pageSource.indexOf("function MissionWorkspace("));
const missionWorkspace = pageSource.slice(pageSource.indexOf("function MissionWorkspace("), pageSource.indexOf("function LegacyHomeView("));
const audioBriefing = pageSource.slice(pageSource.indexOf("function buildSpokenBriefing("), pageSource.indexOf("function PathWorkspace("));

test("renders exactly the Home, Path, and Mission structure for the primary journey", () => {
  assert.match(homeRuntime, /<AcademyHome/);
  assert.match(homeRuntime, /<PathWorkspace/);
  assert.match(pathWorkspace, /<MissionWorkspace/);
  assert.doesNotMatch(homeRuntime, /<HomeView|<JourneysView|<LessonWorkspace|<RoutingVisualWorkspace/);
});

test("uses one persistent progress indicator and no competing path or mission progress bar", () => {
  assert.equal((homeRuntime.match(/className="topbar-progress"/g) ?? []).length, 1);
  assert.match(homeRuntime, /Mission \{Math\.min\(selectedMissionIndex \+ 1/);
  assert.match(homeRuntime, /\{progress\}% complete/);
  assert.doesNotMatch(homeRuntime, /sidebar-progress-card/);
  assert.doesNotMatch(pathWorkspace, /<Progress/);
  assert.doesNotMatch(missionWorkspace, /<Progress/);
});

test("home has one recommended door, plain alternate paths, and a working mission finder", () => {
  assert.match(academyHome, /Turn a Live Hub goal/);
  assert.match(academyHome, /Make my first AI call/);
  assert.match(academyHome, /Open the path you need/);
  assert.match(academyHome, /findMissionMatches\(submittedQuery\)/);
  assert.match(academyHome, /goToTrack\(match\.track\.id, match\.lessonIndex\)/);
  assert.match(academyHome, /data-integration-slot="intercom"/);
  assert.doesNotMatch(academyHome, /disabled[^>]*>[^<]*(Soon|Coming soon)/i);
});

test("Path merges the old level and outcome layers", () => {
  assert.match(pathWorkspace, /className="path-header"/);
  assert.match(pathWorkspace, /className="path-mission-list"/);
  assert.match(pathWorkspace, /Build a new AI Agent/);
  assert.match(pathWorkspace, /Connect an existing bot/);
  assert.match(pathWorkspace, /Live Hub number/);
  assert.match(pathWorkspace, /External SIP provider/);
  assert.doesNotMatch(pathWorkspace, /LEVEL|OUTCOME|Certification path/);
});

test("Path mission rows contain only position, title, duration, and completion state", () => {
  assert.match(pathWorkspace, /done \? <Check \/> : index \+ 1/);
  assert.match(pathWorkspace, /<strong>\{item\.title\}<\/strong>/);
  assert.match(pathWorkspace, /<small>\{item\.duration\}<\/small>/);
  assert.doesNotMatch(pathWorkspace, /item\.objective|item\.description/);
});

test("Mission puts every action in one scrolling view with inline checks", () => {
  assert.match(missionWorkspace, /SUCCESS LOOKS LIKE/);
  assert.match(missionWorkspace, /lesson\.path\.map/);
  assert.match(missionWorkspace, /<details className="mission-before-v2">/);
  assert.match(missionWorkspace, /lesson\.actions\.map/);
  assert.match(missionWorkspace, /Mark \$\{action\.title\} complete/);
  assert.match(missionWorkspace, /lesson\.success\.map/);
  assert.doesNotMatch(missionWorkspace, /actionIndex|furthestActionIndex|Action \{.*of/);
});

test("screenshots and videos sit beside the action that needs them", () => {
  assert.match(pageSource, /function getActionMedia/);
  assert.match(pageSource, /routing-rule-builder\.png/);
  assert.match(pageSource, /call-history-proof\.png/);
  assert.match(pageSource, /S3VdrZ5FadQ/);
  assert.match(pageSource, /mWC5wFb6hoQ/);
  assert.match(missionWorkspace, /className="action-media"/);
});

test("voice is a short spoken briefing rather than a lesson read-aloud", () => {
  assert.match(audioBriefing, /lesson\.objective/);
  assert.match(audioBriefing, /lesson\.commonMistake/);
  assert.match(audioBriefing, /lesson\.success\.slice\(0, 2\)/);
  assert.doesNotMatch(audioBriefing, /lesson\.path|lesson\.actions/);
  assert.match(missionWorkspace, /Play 60–90 sec briefing/);
  assert.doesNotMatch(missionWorkspace, /lessonNarration/);
});

test("the first real instruction is reachable in two views", () => {
  assert.match(academyHome, /goToTrack\("voice-agent"\)/);
  assert.match(pathWorkspace, /<MissionWorkspace/);
  assert.match(missionWorkspace, /GO TO/);
  assert.match(missionWorkspace, /lesson\.actions\.map/);
});

test("phone-number mission uses the documented request workflow", () => {
  assert.match(lessonSource, /Give customers a real US or UK number/);
  assert.match(lessonSource, /Submit the form/);
  assert.match(lessonSource, /Wait for provisioning/);
  assert.doesNotMatch(lessonSource, /Buy one Live Hub phone number/);
});

test("keeps current authentication and account rules accurate", () => {
  assert.match(supplementalSource, /Dialout API.*HTTP Basic/s);
  assert.match(supplementalSource, /main REST API.*OAuth bearer/s);
  assert.match(supplementalSource, /does not by itself enable outbound PSTN/s);
  assert.match(supplementalSource, /seven days for transcripts and thirty days for recordings/);
});

test("navigation transitions reset the document to the top", () => {
  assert.match(pageSource, /function resetPagePosition/);
  assert.match(pageSource, /window\.scrollTo\(\{ top: 0, left: 0, behavior: "auto" \}\)/);
  assert.match(pathWorkspace, /selectMission\(index\); resetPagePosition\(\)/);
});

test("official deep links use verified documentation entry points", () => {
  assert.doesNotMatch(docsSource, /\/content\/ai-agents/i);
  assert.match(docsSource, /#AI-Agents\/Tools\.htm/);
  assert.match(docsSource, /Purchasing%20Phone%20Numbers\.htm/);
  assert.match(docsSource, /AudioCodes%20Live%20Hub\.htm\?TocPath=_____1/);
});

test("turns supplied SIP material into actionable checks", () => {
  assert.match(lessonSource, /FQDN \(Request-URI\)/);
  assert.match(lessonSource, /REGISTER or OPTIONS/);
  assert.match(lessonSource, /Teams-to-SIP and SIP-to-Teams need separate rules/);
});

test("bootcamp checkpoint keeps explanations linked to official TechDocs", () => {
  assert.match(pageSource, /function KnowledgeCheckView/);
  assert.match(quizSource, /knowledgeQuestions/);
  assert.match(quizSource, /sourceUrl: TECH_DOCS\./);
  assert.doesNotMatch(quizSource, /\$750|\$500|MOQ|Azure Marketplace/);
});
