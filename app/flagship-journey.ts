import type { Lesson } from "./lesson-data";
import { TECH_DOCS } from "./techdocs";

export const FLAGSHIP_SCENARIO = {
  business: "Bright Smile Dental Clinic",
  agent: "Bright Smile Receptionist",
  caller: "Maya, a patient who needs the clinic hours and an appointment slot",
  promise: "A real caller gets a grounded answer, hears an available slot, and leaves a useful outcome in Live Hub.",
  finalStatement: "I built an agent that answers clinic hours from our FAQ, checks appointment slots, and logs whether the caller got booked.",
} as const;

const faqDownload = "bright-smile-faq.txt";
const availabilityEndpoint = "https://tyzworks200.github.io/Live-Hub-Academy/bright-smile-availability.json";

/**
 * The dependency order is intentional:
 * create -> ground -> add a tool -> prove voice -> capture an outcome
 * -> provision a public origin -> route and prove the complete call.
 */
export const flagshipLessons: Lesson[] = [
  {
    id: "bright-smile-create",
    title: "Create the Bright Smile Receptionist",
    objective: "Create one named agent with one job: help Bright Smile callers without inventing clinic information.",
    duration: "7 min",
    path: ["AI Agents", "Agents", "Add new agent"],
    before: [
      "Access to AI Agents in the correct Current account",
      "An available model in your Live Hub account",
      "The sample clinic scenario on this page",
    ],
    actions: [
      {
        title: "Choose an Agent, not a Flow",
        instruction: "This receptionist must handle callers who phrase the same request in many ways, so start with an Agent. A controlled Flow is better when mandatory steps must run in a fixed order.",
      },
      {
        title: "Create one recognisable agent",
        instruction: "Open AI Agents → Agents → Add new agent. Name it Bright Smile Receptionist and describe its job as answering clinic questions and helping a caller find an appointment slot.",
      },
      {
        title: "Give it a short welcome",
        instruction: "Use: “Thanks for calling Bright Smile Dental Clinic. How can I help?” Keep the greeting short enough that a caller can interrupt naturally.",
      },
      {
        title: "Add the first operating rules",
        instruction: "Tell the agent to use short spoken answers, ask one question at a time, never invent clinic facts or medical advice, and offer a callback when it cannot safely help.",
        note: "Do not paste the clinic hours into the instructions. The next Mission deliberately shows why trusted knowledge belongs in a document.",
      },
      {
        title: "Select a model and save",
        instruction: "Choose an available model, create the agent, then reopen it from the Agents list. Do not add voice, tools, documents, or telephony yet.",
      },
    ],
    success: [
      "Bright Smile Receptionist appears in the Agents list",
      "The welcome message and four operating rules are saved",
      "The agent has no document, tool, phone number, or route yet",
    ],
    troubleshooting: [
      { problem: "The agent does not appear after Save", fix: "Confirm Current account, refresh AI Agents → Agents, and save again before changing any other setting." },
      { problem: "You are unsure whether to use a Flow", fix: "Stay with an Agent for this path. The conversation order may vary; only the safety boundaries are fixed." },
    ],
    commonMistake: "Building the production design on day one. This first Mission creates only the object every later Mission will improve.",
    skipForNow: ["Documents", "Tools", "Post-call analysis", "Speech and Telephony", "Phone numbers", "Routing", "Transfers"],
    opening: {
      label: "THE STAKE",
      problem: "Bright Smile misses calls while staff are helping patients. Today, a caller asking a simple question may wait, hang up, or receive no answer at all.",
    },
    capabilityGained: "A saved Bright Smile Receptionist with one clear job and safe first-run rules.",
    docUrl: TECH_DOCS.aiAgent,
  },
  {
    id: "bright-smile-ground",
    title: "Stop it guessing about clinic hours",
    objective: "Let the agent fail once, then ground the same agent with the clinic FAQ and prove the answer changed.",
    duration: "9 min",
    path: ["AI Agents", "Documents", "Add document", "Agents", "Bright Smile Receptionist"],
    requires: ["bright-smile-create"],
    before: [
      "Bright Smile Receptionist is saved",
      "The Academy sample FAQ is downloaded",
      "The exact before-and-after question: What time are you open on Friday?",
    ],
    actions: [
      {
        title: "Watch the ungrounded answer first",
        instruction: "Open the agent's chat test and ask: “What time are you open on Friday?” Copy the answer. A confident guess is a failure; “I don't know” is safer, but still not useful.",
      },
      {
        title: "Download one focused source",
        instruction: "Download the fictional Bright Smile FAQ supplied with this Academy. Read it once so you know the exact Friday and weekend hours before the agent sees it.",
        resource: { label: "Download the Bright Smile FAQ", href: faqDownload, download: true },
      },
      {
        title: "Create the document",
        instruction: "Open AI Agents → Documents → Add document, upload the FAQ, and wait until processing is complete. Use a name you will recognise: Bright Smile FAQ.",
      },
      {
        title: "Attach it to the same agent",
        instruction: "Edit Bright Smile Receptionist and attach Bright Smile FAQ in its knowledge configuration. Add one rule: answer clinic facts only from this source; if the answer is absent, offer a callback instead of guessing.",
      },
      {
        title: "Repeat the exact question",
        instruction: "Ask “What time are you open on Friday?” again. Then ask “Are you open on Sunday?” and “Can you diagnose my tooth pain?” Compare the results with the FAQ and the safety rule.",
      },
    ],
    success: [
      "Friday hours match the sample FAQ exactly",
      "The agent says the clinic is closed on Sunday",
      "The agent does not diagnose pain and offers the defined callback path",
    ],
    troubleshooting: [
      { problem: "The old answer does not change", fix: "Confirm document processing completed, the FAQ is attached to Bright Smile Receptionist, and the instructions tell this agent when to use it." },
      { problem: "The agent invents a medical answer", fix: "Make the medical boundary explicit, save, and repeat the exact same question. Do not try to solve this with more documents." },
    ],
    commonMistake: "Uploading a large document library before one small FAQ works with three repeatable questions.",
    skipForNow: ["Website crawling", "Multiple collections", "Tool calls", "Voice", "Phone numbers", "Routing"],
    opening: {
      label: "SEE THE GAP FIRST",
      problem: "The new agent knows its role, but it does not know Bright Smile's actual hours. If it guesses, callers receive confident misinformation.",
      tryThis: "Ask: “What time are you open on Friday?” before attaching any document.",
      expectedGap: "You should see either a guess or an unhelpful refusal. Save that answer—the Mission succeeds only when the same question produces a grounded result.",
    },
    capabilityGained: "Bright Smile Receptionist now answers clinic hours from one trusted FAQ and refuses unsafe medical advice.",
    docUrl: TECH_DOCS.aiAgent,
  },
  {
    id: "bright-smile-availability",
    title: "Let it check an appointment slot",
    objective: "Add one read-only availability tool to the same agent and prove the tool result appears in the answer and logs.",
    duration: "11 min",
    path: ["AI Agents", "Tools", "Add tool", "Test", "Agents", "Bright Smile Receptionist"],
    requires: ["bright-smile-ground"],
    before: [
      "The grounded Friday-hours test passes",
      "The public Academy mock endpoint opens and returns fictional slots",
      "The test request: Do you have a hygiene appointment on Tuesday morning?",
    ],
    actions: [
      {
        title: "Expose the missing live data",
        instruction: "Ask the agent: “Do you have a hygiene appointment on Tuesday morning?” The FAQ cannot know changing availability, so the agent should decline or offer a callback—not invent a time.",
      },
      {
        title: "Open the read-only mock endpoint",
        instruction: "Use the Academy endpoint for this exercise. It contains fictional appointment slots and performs no booking or write action.",
        resource: { label: "Open the mock availability data", href: availabilityEndpoint },
      },
      {
        title: "Create one focused lookup tool",
        instruction: `In AI Agents → Tools → Add tool, create Bright Smile Availability. Configure a read-only GET request to ${availabilityEndpoint}. Describe it as a lookup used only when a caller asks for available appointment times.`,
      },
      {
        title: "Test the tool before attaching it",
        instruction: "Run the built-in tool test. Confirm the response contains the Tuesday 10:00 hygiene slot. If the request fails, fix the URL or response handling here—not in the agent prompt.",
      },
      {
        title: "Attach it and define its boundary",
        instruction: "Attach Bright Smile Availability to Bright Smile Receptionist. Tell the agent to read available slots, never claim a booking is confirmed, and offer staff follow-up after the caller chooses a slot.",
      },
      {
        title: "Repeat the exact request and inspect the log",
        instruction: "Ask for a Tuesday-morning hygiene appointment again. Confirm the answer offers 10:00, then open AI Agents logs and find the tool request, response, and final answer.",
      },
    ],
    success: [
      "The built-in tool test returns the fictional availability data",
      "The agent offers Tuesday at 10:00 without claiming it is booked",
      "AI Agents logs show the tool request, response, and final answer",
    ],
    troubleshooting: [
      { problem: "The tool returns 4xx, 5xx, or no data", fix: "Open the endpoint directly, verify the exact GET URL, then rerun the built-in test before touching the agent." },
      { problem: "The agent answers from memory instead of calling the tool", fix: "Make the tool description specific to appointment availability and state when it must be used." },
    ],
    commonMistake: "Attaching an untested endpoint, then changing the prompt when the real fault is the request or response.",
    skipForNow: ["Real scheduling systems", "Write or booking actions", "Production authentication", "Multiple tools", "Transfers"],
    opening: {
      label: "SEE THE GAP FIRST",
      problem: "The FAQ can answer stable facts, but appointment availability changes. Without a tool, the agent must either guess or send every caller to staff.",
      tryThis: "Ask: “Do you have a hygiene appointment on Tuesday morning?” before adding the tool.",
      expectedGap: "A safe agent cannot answer from the FAQ. The tool is the missing bridge between conversation and changing business data.",
    },
    capabilityGained: "Bright Smile Receptionist can read a safe availability source and offer a real slot without pretending to book it.",
    docUrl: TECH_DOCS.aiTools,
  },
  {
    id: "bright-smile-voice",
    title: "Rehearse the patient call by voice",
    objective: "Give the same agent speech, then complete one realistic patient conversation in the browser before telephony is involved.",
    duration: "10 min",
    path: ["AI Agents", "Agents", "Bright Smile Receptionist", "Speech and Telephony"],
    requires: ["bright-smile-availability"],
    before: [
      "FAQ and availability tests pass in chat",
      "A target language and matching voice are selected",
      "Browser microphone and speaker permission are available",
    ],
    actions: [
      {
        title: "Enable the correct audio path",
        instruction: "Edit Bright Smile Receptionist → Speech and Telephony and enable voice. Use STT and TTS for a standard model; use voice streaming only with a compatible real-time audio model.",
      },
      {
        title: "Choose matching speech settings",
        instruction: "Select provider, model, language, and a TTS voice for the same locale. Save the agent and confirm the associated Bot connection exists.",
      },
      {
        title: "Open the direct browser call",
        instruction: "Go to Bot connections, find the connection created for Bright Smile Receptionist, select its phone icon, and choose the correct microphone and speaker.",
      },
      {
        title: "Play Maya's complete scenario",
        instruction: "Say: “What time are you open on Friday?” Then ask: “Do you have a hygiene appointment Tuesday morning?” Choose the offered slot and ask what happens next.",
      },
      {
        title: "Test one natural interruption",
        instruction: "Interrupt one long answer. The agent should stop, listen, and continue naturally. Record what it heard and whether the call ended normally.",
      },
    ],
    success: [
      "You hear the Bright Smile greeting in the browser call",
      "The Friday answer matches the FAQ and the Tuesday slot comes from the tool",
      "The agent handles one interruption and the call ends normally",
    ],
    troubleshooting: [
      { problem: "You hear nothing", fix: "Check browser media permission and the selected microphone/speaker before editing Live Hub." },
      { problem: "The words are wrong but chat was correct", fix: "Inspect recognized text and the STT locale. This is now a speech problem, not a grounding problem." },
    ],
    commonMistake: "Adding a phone number and route before the exact conversation passes in a direct browser call.",
    skipForNow: ["Phone numbers", "Routing", "Recording", "DTMF", "Background music", "Voice tuning beyond one locale"],
    opening: {
      label: "THE STAKE",
      problem: "A correct chat answer is not yet a good phone experience. Speech recognition, voice locale, turn-taking, and silence can break an otherwise good agent.",
    },
    capabilityGained: "Bright Smile Receptionist can complete the clinic-hours and availability scenario in a direct browser voice call.",
    docUrl: TECH_DOCS.aiAgent,
  },
  {
    id: "bright-smile-outcomes",
    title: "Make every call leave a useful outcome",
    objective: "Extract three business results from the conversation so staff can tell what happened without replaying the call.",
    duration: "8 min",
    path: ["AI Agents", "Post Call Analysis", "Add new post call analysis"],
    requires: ["bright-smile-voice"],
    before: [
      "The browser voice scenario completed once",
      "Three outcome values: booked, needs_callback, escalated",
      "A definition for each value that staff would understand",
    ],
    actions: [
      {
        title: "Create one post-call analysis",
        instruction: "Open AI Agents → Post Call Analysis → Add new post call analysis. Name it Bright Smile Outcome, choose Extract variables, and leave WebHook URL empty for this first local proof.",
      },
      {
        title: "Define the outcome and summary",
        instruction: "Add appointment_outcome with three allowed meanings: booked, needs_callback, and escalated. In the extract prompt, also request a compact summary of what the caller wanted, which slot was offered, and the next action. Unknown information must stay empty.",
      },
      {
        title: "Attach it to the same agent",
        instruction: "Save the analysis. Edit Bright Smile Receptionist, open its Post Call Analysis tab, add Bright Smile Outcome, and update the agent.",
      },
      {
        title: "Repeat Maya's browser call",
        instruction: "Run the same hours-and-availability conversation. Choose Tuesday at 10:00, but remember the mock tool cannot confirm a booking, so the expected outcome is needs_callback.",
      },
      {
        title: "Inspect the evidence",
        instruction: "Open AI Agents logs, find the completed call, and compare appointment_outcome and the summary with what was actually said.",
      },
    ],
    success: [
      "Bright Smile Outcome is attached to Bright Smile Receptionist",
      "appointment_outcome is needs_callback for the mock availability call",
      "The summary contains the caller's request, offered slot, and next action",
      "No confirmation or patient detail is invented",
    ],
    troubleshooting: [
      { problem: "The outcome changes between identical calls", fix: "Tighten the field definition and allowed meanings, then repeat the exact conversation before adding more fields." },
      { problem: "The summary claims the appointment is booked", fix: "State explicitly that the availability tool is read-only and that only a real booking confirmation may produce booked." },
    ],
    commonMistake: "Extracting dozens of fields before proving the three results that drive a real staff action.",
    skipForNow: ["Webhooks", "CRM updates", "Sentiment", "Large extraction schemas", "Production patient data"],
    opening: {
      label: "THE STAKE",
      problem: "The call can now help a patient, but staff still need to know whether anything was booked, requires a callback, or was escalated.",
    },
    capabilityGained: "Bright Smile Receptionist now produces a reliable outcome and summary after a useful voice conversation.",
    docUrl: TECH_DOCS.aiAgent,
  },
  {
    id: "bright-smile-number",
    title: "Request the clinic's public number",
    objective: "Submit one US or UK phone-number request and wait for provisioning without pretending that purchase is instant.",
    duration: "7 min + provisioning",
    path: ["Voice channels", "Phone numbers", "Add new phone number"],
    requires: ["bright-smile-outcomes"],
    before: [
      "United States or United Kingdom selected for this Academy run",
      "The billing owner knows the displayed monthly fee",
      "Required business information and documents are ready",
      "The target Live Hub region matches the Bright Smile agent connection",
    ],
    actions: [
      {
        title: "Open the number request",
        instruction: "Go to Voice channels → Phone numbers → Add new phone number. For this first run, choose only United States or United Kingdom.",
      },
      {
        title: "Choose the number and region",
        instruction: "Review the monthly fee. For a US number, select state and city when available, then choose the Live Hub region used by the agent connection.",
      },
      {
        title: "Complete the request form",
        instruction: "Provide every business field and document requested. Submit the form, then record the request status.",
      },
      {
        title: "Pause for real provisioning",
        instruction: "Return to Phone numbers until the number is provisioned and visible for use. Record its exact E.164 form and region. Do not create a route around a pending number.",
      },
    ],
    success: [
      "The request form and required documents were submitted",
      "The number is provisioned and visible in Phone numbers",
      "Its exact E.164 number and region are recorded",
    ],
    troubleshooting: [
      { problem: "The country you need is not offered", fix: "Stop this Academy run and contact support for that country. Do not substitute a random country just to continue." },
      { problem: "The request remains pending", fix: "Resolve missing form information or wait for review. A routing rule cannot make a pending number callable." },
    ],
    commonMistake: "Treating Add new phone number as instant self-service. The form, documents, and provisioning delay are part of the real process.",
    skipForNow: ["Countries outside the US and UK", "Several numbers", "Number patterns", "Production capacity", "Advanced number formatting"],
    opening: {
      label: "THE STAKE",
      problem: "The agent works in a controlled browser test. A real patient still has no public number to call, and number provisioning may require review.",
    },
    capabilityGained: "Bright Smile now has one provisioned public number, in the correct region, ready to become the call origin.",
    docUrl: TECH_DOCS.phoneNumberPurchase,
  },
  {
    id: "bright-smile-route-proof",
    title: "Route the number and call it from your phone",
    objective: "Connect the provisioned number to Bright Smile Receptionist, complete the whole patient story, and prove the result in Calls and AI Agents logs.",
    duration: "10 min",
    path: ["Routing", "Routing Rules", "Add new routing rule"],
    requires: ["bright-smile-number"],
    before: [
      "The Bright Smile number is provisioned",
      "The Bright Smile Bot connection passes the browser voice test",
      "The number, Bot connection, and route use the same Live Hub region",
      "A mobile phone is available for the final call",
    ],
    actions: [
      {
        title: "Create one exact inbound route",
        instruction: "Set Type to Call. Select the Bright Smile Live Hub number as Call origin, then select the Bot connection created for Bright Smile Receptionist under Route To.",
      },
      {
        title: "Keep the baseline clean",
        instruction: "Use the exact called number. Leave recording, translation, Agent Assist, number customization, and broad patterns off until the baseline works. Save the rule.",
      },
      {
        title: "Call as Maya from a real phone",
        instruction: "Call the provisioned number. Ask Friday hours, ask for a Tuesday-morning hygiene slot, choose 10:00, confirm that staff will call back, then hang up normally.",
      },
      {
        title: "Prove the telephony path",
        instruction: "Open Calls and find the newest Call ID. Confirm completion status, the selected routing rule, destination, duration, and transcript where enabled.",
      },
      {
        title: "Prove the agent behavior",
        instruction: "Open AI Agents logs for the same interaction. Confirm the document answer, availability tool call, final response, summary, and appointment_outcome = needs_callback.",
      },
      {
        title: "Say what you built",
        instruction: "Use the completion statement on the next screen. If any clause is not proven by evidence, reopen that Mission instead of marking this Path complete.",
      },
    ],
    success: [
      "A mobile call reaches Bright Smile Receptionist through the intended routing rule",
      "Calls contains the matching Call ID and successful route evidence",
      "AI Agents logs show grounded hours, the tool result, and needs_callback",
      "You can repeat the call and explain every layer using evidence",
    ],
    troubleshooting: [
      { problem: "The call never appears in Calls", fix: "The failure occurred before Live Hub. Check the dialed number, provisioning state, carrier, and origin." },
      { problem: "The call appears but misses the agent", fix: "Check the exact called number, rule order, region, and selected Bot connection." },
      { problem: "Telephony works but the answer is wrong", fix: "The route is healthy. Use AI Agents logs to inspect document retrieval, the tool response, and the agent instructions." },
    ],
    commonMistake: "Changing routing, speech, and agent behavior together. Calls proves the path; AI Agents logs explains the behavior.",
    skipForNow: ["Recording", "Voice translation", "Agent Assist", "Transfers", "Failover", "Number customization", "Broad wildcard rules"],
    opening: {
      label: "THE STAKE",
      problem: "Everything works in isolation. This final Mission proves that a real public call crosses the route, reaches the same agent, and leaves evidence a colleague can investigate.",
    },
    capabilityGained: "A real caller can reach Bright Smile Receptionist, receive grounded and tool-backed help, and leave a verifiable call outcome.",
    docUrl: TECH_DOCS.routing,
  },
];

export const FLAGSHIP_CAPABILITIES = flagshipLessons.map((lesson) => ({
  id: lesson.id,
  title: lesson.title,
  capability: lesson.capabilityGained ?? lesson.objective,
}));
