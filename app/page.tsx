"use client";

import { type FormEvent, useEffect, useMemo, useState } from "react";
import {
  AlertTriangle,
  ArrowLeft,
  ArrowRight,
  Activity,
  Award,
  BookOpen,
  Bookmark,
  Bot,
  Check,
  CheckCircle2,
  ChevronRight,
  CircleHelp,
  CircleCheckBig,
  Clock3,
  Code2,
  ExternalLink,
  FileText,
  FolderOpen,
  Headphones,
  Languages,
  LibraryBig,
  Lightbulb,
  ListChecks,
  LockKeyhole,
  Menu,
  MessageCircle,
  Network,
  PhoneCall,
  Play,
  Radio,
  Route,
  RotateCcw,
  Search,
  ShieldCheck,
  SlidersHorizontal,
  Sparkles,
  Square,
  Volume2,
  X,
  Zap,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Progress } from "@/components/ui/progress";
import { lessonsByTrack as coreLessonsByTrack, type Lesson } from "./lesson-data";
import { supplementalLessonsByTrack } from "./supplemental-lesson-data";
import { FLAGSHIP_CAPABILITIES, FLAGSHIP_SCENARIO, flagshipLessons } from "./flagship-journey";
import { knowledgeQuestions } from "./quiz-data";
import { TECH_DOCS } from "./techdocs";
import troubleshootingData from "./troubleshooting-data.json";

type View = "home" | "orientation" | "journeys" | "troubleshooting" | "quiz" | "library" | "glossary";

type Track = {
  id: string;
  eyebrow: string;
  title: string;
  description: string;
  role: string;
  scenario: string;
  outcome: string;
  evidence: string;
  reward: string;
  time: string;
  level: string;
  icon: typeof Bot;
  color: string;
  steps: string[];
  phases: string[];
};

const lessonsByTrack: Record<string, Lesson[]> = {
  ...coreLessonsByTrack,
  ...supplementalLessonsByTrack,
  "voice-agent": flagshipLessons,
};

const OFFICIAL_VIDEO_PLAYLIST =
  "https://www.youtube.com/playlist?list=PLWI2eO0GVBO-nwUsm1csXntGlLwj6XxjB";

const tracks: Track[] = [
  {
    id: "voice-agent",
    eyebrow: "Best first win",
    title: "Get one AI Agent answering real calls",
    description:
      "Build Bright Smile Dental Clinic's receptionist as one continuous project—from empty agent to a real, evidence-backed phone call.",
    role: "New Live Hub users and AI builders",
    scenario: `${FLAGSHIP_SCENARIO.business} needs ${FLAGSHIP_SCENARIO.agent} to help ${FLAGSHIP_SCENARIO.caller}.`,
    outcome: FLAGSHIP_SCENARIO.promise,
    evidence: "One successful Call ID plus AI Agents logs proving the FAQ answer, availability lookup, summary, and outcome.",
    reward: "AI Receptionist Builder",
    time: "62 min + provisioning",
    level: "Recommended",
    icon: Bot,
    color: "cyan",
    steps: lessonsByTrack["voice-agent"].map((lesson) => lesson.title),
    phases: ["BUILD", "PROVE LOGIC", "ADD VOICE", "PROVE VOICE", "ADD CHANNEL", "ROUTE + OBSERVE"],
  },
  {
    id: "sip-trunk",
    eyebrow: "Telephony path",
    title: "Bring Your Own SIP",
    description:
      "Connect a listed or Generic SIP provider, prove signaling, add a number, and complete a real call.",
    role: "Telephony and contact-center administrators",
    scenario: "Your voice provider already carries the company’s calls. Your job is to connect that provider to Live Hub without disrupting existing traffic.",
    outcome: "A controlled test call crosses your SIP trunk and completes through the intended route.",
    evidence: "Connected status or a successful test call, SIP Ladder, and Call ID.",
    reward: "SIP Pathfinder",
    time: "43 min + provisioning",
    level: "Technical",
    icon: Radio,
    color: "blue",
    steps: lessonsByTrack["sip-trunk"].map((lesson) => lesson.title),
    phases: ["CHOOSE TYPE", "PREPARE", "CONNECT", "MATCH NUMBERS", "PROVE SIP", "GET NUMBER", "ROUTE + CALL"],
  },
  {
    id: "teams-sip",
    eyebrow: "Enterprise path",
    title: "Connect Microsoft Teams",
    description:
      "Prepare the tenant, activate Teams, assign numbers, prove SIP, and route both directions.",
    role: "Microsoft Teams voice administrators",
    scenario: "Your Teams users need Live Hub voice connectivity while the existing SIP provider remains the public call path.",
    outcome: "A Teams user can make and receive a controlled external call through Live Hub.",
    evidence: "One successful Teams-to-SIP call and one successful SIP-to-Teams call.",
    reward: "Teams Connector",
    time: "41 min + activation",
    level: "Administrator",
    icon: Network,
    color: "pink",
    steps: lessonsByTrack["teams-sip"].map((lesson) => lesson.title),
    phases: ["PREPARE TENANT", "ACTIVATE TEAMS", "ASSIGN NUMBERS", "PROVE SIP", "ROUTE BOTH WAYS"],
  },
  {
    id: "phone-number",
    eyebrow: "Channel win",
    title: "Get a Real Phone Number",
    description: "Request a first US or UK number, complete the form, and wait for it to be ready before routing.",
    role: "Account owners and service builders",
    scenario: "Your new service needs a public entry point that a customer can call from a normal phone.",
    outcome: "A provisioned US or UK number is visible and ready to use in a routing rule.",
    evidence: "The provisioned number, exact E.164 format, and Live Hub region.",
    reward: "Channel Starter",
    time: "6 min + provisioning",
    level: "Beginner",
    icon: PhoneCall,
    color: "pink",
    steps: lessonsByTrack["phone-number"].map((lesson) => lesson.title),
    phases: ["REQUEST + PROVE"],
  },
  {
    id: "routing",
    eyebrow: "Live Hub core",
    title: "Route a Real Customer Call",
    description:
      "Take one real caller from a ready phone number or SIP connection to the right destination—and prove the result.",
    role: "Every Live Hub implementer",
    scenario: "A customer calls your published number. Live Hub must recognize that exact call, send it to the right AI or phone service, and leave evidence your team can trust.",
    outcome: "A real test caller reaches the intended destination and the matching rule is visible in Call History.",
    evidence: "A successful Call ID and the exact routing rule that matched it.",
    reward: "Routing Navigator",
    time: "17 min",
    level: "Beginner",
    icon: Route,
    color: "green",
    steps: lessonsByTrack.routing.map((lesson) => lesson.title),
    phases: ["UNDERSTAND", "CREATE", "TEST", "ADD ONE OPTION"],
  },
  {
    id: "agent-builder",
    eyebrow: "AI builder path",
    title: "Build Production AI Agents",
    description: "Ground the agent, add one useful tool, test behavior, and read the logs before production.",
    role: "AI Agent designers and developers",
    scenario: "Your prototype can answer, but it now needs trusted knowledge, one real action, and repeatable tests before customers rely on it.",
    outcome: "The agent answers from approved knowledge, completes one tool action, and passes its test set.",
    evidence: "A passing test suite plus a log showing the expected document or tool activity.",
    reward: "AI Agent Builder",
    time: "34 min",
    level: "Intermediate",
    icon: Bot,
    color: "cyan",
    steps: lessonsByTrack["agent-builder"].map((lesson) => lesson.title),
    phases: ["GROUND", "ACT", "ANALYZE", "TEST", "CHOOSE"],
  },
  {
    id: "operate",
    eyebrow: "Production path",
    title: "Monitor Production Traffic",
    description:
      "Read calls and alarms, preserve evidence, understand usage, and manage access safely.",
    role: "Service owners and operations teams",
    scenario: "Your first call works. Now you are responsible for spotting service risk before customers report it.",
    outcome: "You can prove service health, find a call, read an alarm, and identify usage and access owners.",
    evidence: "A health review containing one call, one alarm check, usage status, and owner.",
    reward: "Production Operator",
    time: "24 min",
    level: "All users",
    icon: Activity,
    color: "violet",
    steps: lessonsByTrack.operate.map((lesson) => lesson.title),
    phases: ["ACCOUNT", "DASHBOARD", "ALARMS", "EVIDENCE", "BILLING", "ACCESS"],
  },
  {
    id: "diagnose",
    eyebrow: "Support path",
    title: "Troubleshoot Live Traffic",
    description:
      "Find the exact call, isolate the failing layer, test one change, and build a support-ready case.",
    role: "Support engineers and advanced operators",
    scenario: "A customer says, “the call failed.” You need to replace guesswork with one exact Call ID and one evidence-backed finding.",
    outcome: "You identify the first failing layer, test one reversible fix, and prove the new result.",
    evidence: "Before-and-after Call IDs, exact status, and one evidence sentence.",
    reward: "Live Traffic Investigator",
    time: "23 min",
    level: "All levels",
    icon: AlertTriangle,
    color: "amber",
    steps: lessonsByTrack.diagnose.map((lesson) => lesson.title),
    phases: ["CAPTURE", "READ RESULT", "FIND LAYER", "RETEST", "ESCALATE"],
  },
  {
    id: "bot-connect",
    eyebrow: "Bring your own AI",
    title: "Connect an Existing Bot",
    description: "Choose the exact framework, connect speech, and prove the bot before telephony is added.",
    role: "Bot developers and integration teams",
    scenario: "Your bot already works in its own platform. Customers now need to speak with it through Live Hub.",
    outcome: "A direct browser call reaches the existing bot and returns the expected spoken answer.",
    evidence: "A successful direct bot test with recognized input and the expected response.",
    reward: "Bot Connector",
    time: "18 min",
    level: "Builder",
    icon: Bot,
    color: "cyan",
    steps: lessonsByTrack["bot-connect"].map((lesson) => lesson.title),
    phases: ["CHOOSE", "CONNECT", "PROVE"],
  },
  {
    id: "speech-provider",
    eyebrow: "Speech stack",
    title: "Bring Your Own Speech",
    description: "Choose, connect, and measure one STT and TTS experience without guesswork.",
    role: "AI builders and voice-experience owners",
    scenario: "Your callers need a particular language, voice, latency, or provider account that the default stack does not cover.",
    outcome: "The bot recognizes a real phrase, speaks in the correct voice, and exposes measurable latency.",
    evidence: "A transcript, audio result, and the STT, bot, and TTS timing for one call.",
    reward: "Speech Tuner",
    time: "18 min",
    level: "Builder",
    icon: Headphones,
    color: "violet",
    steps: lessonsByTrack["speech-provider"].map((lesson) => lesson.title),
    phases: ["CHOOSE", "CONNECT", "MEASURE"],
  },
  {
    id: "voice-channel",
    eyebrow: "Channel decision",
    title: "Choose My Voice Channel",
    description: "Choose one entry point, create it correctly, and prove it before routing grows.",
    role: "New solution owners",
    scenario: "You know who should handle the call, but first you must decide how that call enters Live Hub.",
    outcome: "One correctly selected voice channel is ready and proven in the intended region.",
    evidence: "A ready connection card with the correct region, state, and test result.",
    reward: "Channel Architect",
    time: "19 min",
    level: "Beginner",
    icon: Network,
    color: "blue",
    steps: lessonsByTrack["voice-channel"].map((lesson) => lesson.title),
    phases: ["CHOOSE", "CREATE", "VERIFY", "ROUTE"],
  },
  {
    id: "click-to-call",
    eyebrow: "Digital channel",
    title: "Add Calling to a Website",
    description: "Create Click-to-call, protect browser authentication, and prove a routed WebRTC call.",
    role: "Web and mobile application teams",
    scenario: "A customer on your website should reach the AI without leaving the page or dialing a number.",
    outcome: "A customer clicks one button and reaches the intended Live Hub destination from the browser.",
    evidence: "A completed WebRTC call record showing the Click-to-call origin and matched route.",
    reward: "Web Voice Builder",
    time: "20 min",
    level: "Developer",
    icon: PhoneCall,
    color: "green",
    steps: lessonsByTrack["click-to-call"].map((lesson) => lesson.title),
    phases: ["CREATE", "EMBED", "PROVE"],
  },
  {
    id: "whatsapp",
    eyebrow: "Messaging channel",
    title: "Connect WhatsApp Calling",
    description: "Prepare Meta ownership, authorize one number, and prove a WhatsApp voice call.",
    role: "Digital-channel and customer-experience teams",
    scenario: "Customers already use WhatsApp and should be able to call the same AI experience from there.",
    outcome: "A WhatsApp caller reaches the intended destination and the result appears in Calls.",
    evidence: "An active WhatsApp number and a successful call record with the matched route.",
    reward: "WhatsApp Connector",
    time: "18 min",
    level: "Administrator",
    icon: MessageCircle,
    color: "green",
    steps: lessonsByTrack.whatsapp.map((lesson) => lesson.title),
    phases: ["PREPARE", "AUTHORIZE", "CALL"],
  },
  {
    id: "call-features",
    eyebrow: "Customer experience",
    title: "Add Evidence, Transfer & Failover",
    description: "Make calls observable and resilient after the baseline route works.",
    role: "Solution designers and operations owners",
    scenario: "The call works. Now it must leave the right evidence, reach a human when needed, and fail safely.",
    outcome: "The production call produces approved evidence and has a tested human or failover path.",
    evidence: "A test call containing the expected artifact and a proven transfer or failover outcome.",
    reward: "Experience Guardian",
    time: "21 min",
    level: "Intermediate",
    icon: ShieldCheck,
    color: "violet",
    steps: lessonsByTrack["call-features"].map((lesson) => lesson.title),
    phases: ["EVIDENCE", "TRANSFER", "FAILOVER"],
  },
  {
    id: "agent-assist",
    eyebrow: "Human + AI",
    title: "Deploy Agent Assist",
    description: "Choose in-path or SIPREC, attach the assistant, and prove the human receives useful help.",
    role: "Contact-center and agent-experience teams",
    scenario: "A human agent handles the customer, but needs real-time AI guidance during the conversation.",
    outcome: "The assistant receives the conversation and delivers the expected guidance to the human agent.",
    evidence: "A captured transcript, the triggering phrase, and the expected assist output.",
    reward: "Agent Assist Builder",
    time: "20 min",
    level: "Advanced",
    icon: Activity,
    color: "cyan",
    steps: lessonsByTrack["agent-assist"].map((lesson) => lesson.title),
    phases: ["DEFINE", "CHOOSE PATH", "ATTACH", "PROVE"],
  },
  {
    id: "translation",
    eyebrow: "Real-time language",
    title: "Translate a Live Call",
    description: "Create one language profile, attach it to routing, and prove both directions.",
    role: "Global service and contact-center teams",
    scenario: "The customer and human agent speak different languages but need a natural two-way conversation.",
    outcome: "Both participants hear the other in their own language during one stable test call.",
    evidence: "A successful two-way call and the real-time translation transcript.",
    reward: "Language Bridge",
    time: "20 min",
    level: "Intermediate",
    icon: Languages,
    color: "pink",
    steps: lessonsByTrack.translation.map((lesson) => lesson.title),
    phases: ["PROFILE", "LANGUAGES", "VOICE", "PROVE"],
  },
  {
    id: "outbound",
    eyebrow: "API dialout",
    title: "Place an Outbound AI Call",
    description: "Enable dialout, create the reverse route, trigger one API call, and follow its status.",
    role: "Developers and outbound solution teams",
    scenario: "Your application must ask Live Hub to call one opted-in customer and connect the answered call to a bot.",
    outcome: "The controlled phone rings, the bot handles the answer, and the final status is visible.",
    evidence: "The returned call ID, Call History record, and final dialout status.",
    reward: "Dialout Builder",
    time: "20 min",
    level: "Developer",
    icon: PhoneCall,
    color: "amber",
    steps: lessonsByTrack.outbound.map((lesson) => lesson.title),
    phases: ["ENABLE", "ROUTE", "CALL"],
  },
  {
    id: "campaigns",
    eyebrow: "Outbound automation",
    title: "Run a Safe Outbound Campaign",
    description: "Design a tiny pilot, validate targets, and scale only after every outcome is understood.",
    role: "Campaign managers and operations teams",
    scenario: "A consented customer list needs an automated reminder campaign without risking a production-scale mistake.",
    outcome: "A controlled pilot completes and every target outcome can be explained.",
    evidence: "Campaign progress, target statuses, related Call IDs, and a documented scale decision.",
    reward: "Campaign Operator",
    time: "20 min",
    level: "Operator",
    icon: SlidersHorizontal,
    color: "amber",
    steps: lessonsByTrack.campaigns.map((lesson) => lesson.title),
    phases: ["DESIGN", "TARGETS", "RUN"],
  },
  {
    id: "platform-api",
    eyebrow: "Platform automation",
    title: "Build with the Live Hub API",
    description: "Create a safe API identity, authenticate correctly, and retrieve one known call.",
    role: "Developers and platform integrators",
    scenario: "Your operations system needs Live Hub call data without relying on a person exporting it from the portal.",
    outcome: "A least-privilege integration retrieves one known call through the REST API.",
    evidence: "A successful bounded API response containing the expected Call ID.",
    reward: "Platform Integrator",
    time: "20 min",
    level: "Developer",
    icon: Code2,
    color: "blue",
    steps: lessonsByTrack["platform-api"].map((lesson) => lesson.title),
    phases: ["IDENTITY", "AUTHENTICATE", "PROVE"],
  },
  {
    id: "account-admin",
    eyebrow: "Governance",
    title: "Prepare the Account for Production",
    description: "Choose the account structure, protect continuity, and lock down people, systems, and call data.",
    role: "Account owners, security teams, and administrators",
    scenario: "The technical flow works, but the account now needs clear ownership, reliable billing, and safe access before customers call.",
    outcome: "The account has the right hierarchy, an active billing plan, least-privilege access, and approved retention.",
    evidence: "A readiness record covering ownership, plan state, access groups, retention, and support sharing.",
    reward: "Production Steward",
    time: "21 min",
    level: "Administrator",
    icon: ShieldCheck,
    color: "violet",
    steps: lessonsByTrack["account-admin"].map((lesson) => lesson.title),
    phases: ["STRUCTURE", "CONTINUITY", "PROTECT"],
  },
];

type SuccessLevel = {
  number: number;
  title: string;
  promise: string;
  question: string;
  choiceNote: string;
  trackIds: string[];
};

const successLevels: SuccessLevel[] = [
  {
    number: 1,
    title: "First successful call",
    promise: "A real phone call reaches an AI and receives the correct answer.",
    question: "Can one customer call one AI receptionist successfully?",
    choiceNote: "New to Live Hub? Start with First Successful AI Call. Choose Connect an Existing Bot only when you already have a working bot outside Live Hub. Complete one route—not both.",
    trackIds: ["voice-agent", "bot-connect"],
  },
  {
    number: 2,
    title: "Connect my telephony",
    promise: "Your existing voice environment reaches Live Hub.",
    question: "Which real voice channel must connect next?",
    choiceNote: "Pick the one channel your deployment needs now. The other channels remain available later and are not required to complete this level.",
    trackIds: ["voice-channel", "phone-number", "sip-trunk", "teams-sip", "click-to-call", "whatsapp", "speech-provider"],
  },
  {
    number: 3,
    title: "Route intelligently",
    promise: "The right call reaches the right destination.",
    question: "What should happen when this specific call arrives?",
    choiceNote: "Start with the routing outcome blocking your launch. Add transfer, translation, outbound, or campaign behavior only when the basic call already works.",
    trackIds: ["routing", "call-features", "agent-assist", "translation", "outbound", "campaigns"],
  },
  {
    number: 4,
    title: "Operate production",
    promise: "You can see what happened and fix the first failing layer.",
    question: "Can your team explain every important call from evidence?",
    choiceNote: "Choose Operations for daily visibility, Diagnosis for a failing call, or the API when another system must retrieve the evidence.",
    trackIds: ["operate", "diagnose", "platform-api"],
  },
  {
    number: 5,
    title: "Production readiness",
    promise: "Your AI behavior is grounded, tested, and observable before launch.",
    question: "Can you prove this deployment is safe to put in front of customers?",
    choiceNote: "Choose the readiness route you own: AI behavior for builders, or account governance for owners and administrators. Production teams may complete both.",
    trackIds: ["agent-builder", "account-admin"],
  },
];

type AcademyGuideResult = {
  eyebrow: string;
  title: string;
  answer: string;
  trackId: string;
  action: string;
};

function guideLearner(question: string): AcademyGuideResult {
  const prompt = question.trim().toLowerCase();

  if (/fail|error|debug|disconnect|alarm|log|ladder|not work|troubleshoot/.test(prompt)) {
    return {
      eyebrow: "WHEN SOMETHING FAILED",
      title: "Start with the exact call—not a guess.",
      answer: "Open Troubleshoot Live Traffic. It takes you from Call History to the first failing layer, then helps you collect a support-ready evidence pack.",
      trackId: "diagnose",
      action: "Start troubleshooting path",
    };
  }

  if (/existing bot|copilot|dialogflow|rasa|amazon lex|bot framework/.test(prompt)) {
    return {
      eyebrow: "EXISTING BOT PATH",
      title: "Connect the bot before adding a phone channel.",
      answer: "Choose the exact framework and credentials, add the correct speech services, and prove a direct browser call before routing real traffic.",
      trackId: "bot-connect",
      action: "Connect my bot",
    };
  }

  if (/speech|stt|tts|voice model|deepgram|soniox|elevenlabs|speechmatics/.test(prompt)) {
    return {
      eyebrow: "SPEECH PATH",
      title: "Choose speech from the call you need to support.",
      answer: "Bring Your Own Speech turns language, voice, latency, region, and provider ownership into one measurable call test.",
      trackId: "speech-provider",
      action: "Build the speech stack",
    };
  }

  if (/whatsapp|meta business/.test(prompt)) {
    return {
      eyebrow: "WHATSAPP CALLING",
      title: "Authorize one number, then prove one call.",
      answer: "Prepare the correct Meta business, connect the WhatsApp number, route it, and verify the call in Live Hub.",
      trackId: "whatsapp",
      action: "Connect WhatsApp",
    };
  }

  if (/click.to.call|webrtc|website call|web call|call button/.test(prompt)) {
    return {
      eyebrow: "WEB CALLING",
      title: "Put a safe voice entry point in your website.",
      answer: "Create the Click-to-call connection, protect browser authentication, embed the widget or SDK, and prove the routed WebRTC call.",
      trackId: "click-to-call",
      action: "Add web calling",
    };
  }

  if (/campaign|target list|bulk call/.test(prompt)) {
    return {
      eyebrow: "OUTBOUND AUTOMATION",
      title: "Pilot small before calling a real audience.",
      answer: "Design one campaign outcome, validate a tiny target list, then monitor every result before you scale.",
      trackId: "campaigns",
      action: "Build a safe pilot",
    };
  }

  if (/outbound|dialout|dial out|place a call|call api/.test(prompt)) {
    return {
      eyebrow: "OUTBOUND CALLING",
      title: "Reverse the flow: bot to channel to customer.",
      answer: "Enable dialout, create the bot-origin routing rule, send one Basic-auth API request, and follow its Call ID to the final status.",
      trackId: "outbound",
      action: "Place one outbound call",
    };
  }

  if (/agent assist|siprec|human agent/.test(prompt)) {
    return {
      eyebrow: "HUMAN + AI",
      title: "Choose in-path or SIPREC before configuring Agent Assist.",
      answer: "The Agent Assist path connects the transcript source, routing service, assist bot, and one real human-facing result.",
      trackId: "agent-assist",
      action: "Deploy Agent Assist",
    };
  }

  if (/translation|translate|language pair|multi.?language/.test(prompt)) {
    return {
      eyebrow: "REAL-TIME TRANSLATION",
      title: "Build and prove one two-way language bridge.",
      answer: "Choose automatic or dynamic activation, configure both languages and voices, attach the profile to routing, and test both directions.",
      trackId: "translation",
      action: "Translate a call",
    };
  }

  if (/rest api|oauth|bearer|api client|automation/.test(prompt)) {
    return {
      eyebrow: "PLATFORM API",
      title: "Start with one safe, read-only proof.",
      answer: "Create a least-privilege API client, obtain an OAuth token, and retrieve one known Call ID before automating broader operations.",
      trackId: "platform-api",
      action: "Prove the API",
    };
  }

  if (/team|tenant|direct routing/.test(prompt)) {
    return {
      eyebrow: "MICROSOFT TEAMS PATH",
      title: "Prepare Teams, prove SIP, then route both ways.",
      answer: "Use the Connect Microsoft Teams path. It keeps tenant activation, number assignment, SIP validation, and the two required routing directions in the correct order.",
      trackId: "teams-sip",
      action: "Start the Teams path",
    };
  }

  if (/sip|trunk|contact center|provider|fqdn|registration|keep alive/.test(prompt)) {
    return {
      eyebrow: "SIP PATH",
      title: "Choose listed or Generic SIP before configuring fields.",
      answer: "Use Bring Your Own SIP. It gathers provider details first, explains the Generic SIP choice, proves the connection, then adds the number and route.",
      trackId: "sip-trunk",
      action: "Start the SIP path",
    };
  }

  if (/route|routing|origin|destination|called number|calling number/.test(prompt)) {
    return {
      eyebrow: "LIVE HUB CORE",
      title: "Make one real customer call reach the right place.",
      answer: "Open Route a Real Customer Call. You will choose the incoming call, build one exact rule on the real Live Hub screen, place the call, and prove the result in Call History.",
      trackId: "routing",
      action: "Route the customer call",
    };
  }

  if (/number|phone number|did|e\.164|provision/.test(prompt)) {
    return {
      eyebrow: "PHONE NUMBER PATH",
      title: "Request the number before you build its route.",
      answer: "Use Get a Real Phone Number. For the first Academy run, request a US or UK number, complete the required form, and wait until provisioning is complete.",
      trackId: "phone-number",
      action: "Start number path",
    };
  }

  if (/tool|document|knowledge|test suite|production agent/.test(prompt)) {
    return {
      eyebrow: "PRODUCTION AI PATH",
      title: "Move from a speaking prototype to a tested agent.",
      answer: "Use Build Production AI Agents to add trusted knowledge, one focused tool, test scenarios, and log-based proof.",
      trackId: "agent-builder",
      action: "Start production AI path",
    };
  }

  if (/account|subaccount|parent account|mfa|governance|privacy|retention|permission/.test(prompt)) {
    return {
      eyebrow: "PRODUCTION GOVERNANCE",
      title: "Make the account safe before real traffic arrives.",
      answer: "Choose the account model, protect billing continuity, assign least-privilege access, and set call-data retention and sharing deliberately.",
      trackId: "account-admin",
      action: "Prepare the account",
    };
  }

  if (/bill|usage|balance|user|access|iam|record|transcript|monitor/.test(prompt)) {
    return {
      eyebrow: "OPERATIONS PATH",
      title: "Use one path for day-two operations.",
      answer: "Open Monitor Production Traffic for dashboard signals, alarms, evidence, billing, transcripts, recordings, and access control.",
      trackId: "operate",
      action: "Open operations mission",
    };
  }

  return {
    eyebrow: "RECOMMENDED FIRST WIN",
    title: "Create your first successful AI call.",
    answer: "This is the recommended first win: build a focused native agent, prove it in chat and voice, add a number, route it, and inspect the first real call.",
    trackId: "voice-agent",
    action: "Start the AI call path",
  };
}

const navItems: { id: View; label: string; icon: typeof Bot }[] = [
  { id: "home", label: "Success home", icon: Sparkles },
  { id: "journeys", label: "Paths", icon: Route },
  { id: "troubleshooting", label: "Fix a failed call", icon: AlertTriangle },
  { id: "library", label: "Expert reference", icon: LibraryBig },
  { id: "glossary", label: "Voice terms", icon: Code2 },
];

type DocItem = {
  title: string;
  description: string;
  category: string;
  time: string;
  level: string;
  url: string;
  icon: typeof BookOpen;
};

type TroubleshootingIssue = {
  id: string;
  section: string;
  title: string;
  status: string[];
  statusVerified: boolean;
  type: string;
  investigate: string;
  actionability: string;
  meaning: string;
  causes: string[];
  actions: string[];
  escalate: string;
  evidence: string[];
  related: string;
};

const troubleshootingIssues = troubleshootingData as TroubleshootingIssue[];

const docs: DocItem[] = [
  { title: "Official Live Hub video playlist", description: "Watch the AudioCodes walkthrough that matches your current mission. Use the Academy for the challenge and the playlist for visual confirmation.", category: "Watch", time: "Video", level: "Official", icon: Play, url: OFFICIAL_VIDEO_PLAYLIST },
  { title: "Start with Live Hub", description: "Sign in, learn the product model, and choose the shortest path to a first call.", category: "Get started", time: "5 min", level: "Start", icon: Sparkles, url: TECH_DOCS.home },
  { title: "Tour the dashboard", description: "Learn the navigation, account selector, usage, Help Center, wizard, and monitoring cards.", category: "Get started", time: "6 min", level: "Tour", icon: ListChecks, url: TECH_DOCS.dashboard },
  { title: "Quick setup wizard", description: "Use Live Hub's guided configuration when you need help creating a common first call path.", category: "Get started", time: "6 min", level: "Wizard", icon: ListChecks, url: TECH_DOCS.quickSetupWizard },
  { title: "Build a native AI Agent", description: "Create an agent, enable Speech and Telephony, and connect it to Live Hub voice.", category: "Build", time: "15 min", level: "Guide", icon: Bot, url: TECH_DOCS.aiAgent },
  { title: "AI Agent tools", description: "Give an agent a focused, testable external action and inspect the result in logs.", category: "Build", time: "12 min", level: "Guide", icon: SlidersHorizontal, url: TECH_DOCS.aiTools },
  { title: "Agent Assist modes", description: "Choose the assistant behavior that matches your live-agent experience.", category: "Build", time: "9 min", level: "Guide", icon: Headphones, url: TECH_DOCS.agentAssistMode },
  { title: "Test a bot connection", description: "Make a browser test call before introducing a phone number and routing rule.", category: "Build", time: "5 min", level: "Test", icon: PhoneCall, url: TECH_DOCS.botTest },
  { title: "Bot features and failover", description: "Configure transcript, recording, transfer, outbound calling, background music, and failover.", category: "Build", time: "13 min", level: "Guide", icon: SlidersHorizontal, url: TECH_DOCS.botFeatures },
  { title: "Voice channels overview", description: "Choose among numbers, SIP, Teams, WebRTC, WhatsApp, PBXs, and contact centers.", category: "Connect", time: "8 min", level: "Overview", icon: Network, url: TECH_DOCS.voiceChannels },
  { title: "Request a phone number", description: "Review country availability, fees, region, required forms or documents, and provisioning state before routing.", category: "Connect", time: "8 min", level: "Guide", icon: PhoneCall, url: TECH_DOCS.phoneNumberPurchase },
  { title: "Listed or Generic SIP", description: "Use a provider profile when available; otherwise configure a Generic SIP trunk, contact center, or UC connection.", category: "Connect", time: "14 min", level: "Technical", icon: Radio, url: TECH_DOCS.genericSip },
  { title: "SIP Info and troubleshooting", description: "Find the connection FQDN, addresses, certificate, limits, REGISTER/OPTIONS tools, and SIP evidence.", category: "Connect", time: "10 min", level: "Technical", icon: Activity, url: TECH_DOCS.sipConnections },
  { title: "Connect a Teams tenant", description: "Verify licenses, provision the service account, connect the tenant, and troubleshoot Microsoft prerequisites.", category: "Connect", time: "12 min", level: "Admin", icon: Network, url: TECH_DOCS.teamsTenant },
  { title: "Route Microsoft Teams and SIP", description: "Create the Teams connection, assign numbers, and define separate routing rules for both directions.", category: "Route", time: "15 min", level: "Admin", icon: Route, url: TECH_DOCS.teamsRouting },
  { title: "WhatsApp voice calling", description: "Connect a verified WhatsApp Business number and route voice calls.", category: "Connect", time: "12 min", level: "Guide", icon: PhoneCall, url: TECH_DOCS.whatsapp },
  { title: "WebRTC Click-to-Call", description: "Add browser or mobile calling with the widget, SDK, and authentication code.", category: "Connect", time: "15 min", level: "Guide", icon: Code2, url: TECH_DOCS.clickToCall },
  { title: "Routing rules", description: "Match an origin, choose a destination, order rules, and attach call services.", category: "Route", time: "14 min", level: "Core", icon: Route, url: TECH_DOCS.routing },
  { title: "Advanced call transfer", description: "Choose INVITE or REFER, route the transfer, pass SIP headers, and inspect transfer notifications.", category: "Route", time: "15 min", level: "Advanced", icon: Route, url: TECH_DOCS.callTransfer },
  { title: "Live-Agent Assist", description: "Connect an assist bot in-path or through SIPREC and attach it as a service.", category: "Route", time: "13 min", level: "Guide", icon: Headphones, url: TECH_DOCS.agentAssist },
  { title: "Real-time translation", description: "Configure language pairs, activation, speech, voice, and two-way translation.", category: "Route", time: "10 min", level: "Guide", icon: Languages, url: TECH_DOCS.translation },
  { title: "Outbound calling", description: "Place controlled outbound calls from a bot connection.", category: "Operate", time: "10 min", level: "Guide", icon: Activity, url: TECH_DOCS.outboundCalling },
  { title: "Outbound automation", description: "Automate campaigns while controlling schedules, traffic, and results.", category: "Operate", time: "13 min", level: "Guide", icon: Activity, url: TECH_DOCS.outboundAutomation },
  { title: "Call History", description: "Inspect completion status, services, media, transcript, latency, and SIP evidence.", category: "Operate", time: "10 min", level: "Reference", icon: Activity, url: TECH_DOCS.callHistory },
  { title: "Dashboard statistics and alarms", description: "Monitor configured services, traffic, success, voice quality, and active alarm severity.", category: "Operate", time: "8 min", level: "Monitor", icon: Activity, url: TECH_DOCS.dashboard },
  { title: "Alarm thresholds and notifications", description: "Configure email recipients, metric direction, severity thresholds, and Alarm History.", category: "Operate", time: "8 min", level: "Monitor", icon: AlertTriangle, url: TECH_DOCS.alarmThresholds },
  { title: "Call transcripts", description: "Enable, review, retain, download, and share transcripts safely.", category: "Operate", time: "8 min", level: "Policy", icon: FileText, url: TECH_DOCS.callTranscript },
  { title: "Call recordings", description: "Choose automatic or bot-controlled recording, test the result, and download recordings from Call History.", category: "Operate", time: "8 min", level: "Policy", icon: FileText, url: TECH_DOCS.callRecording },
  { title: "Billing and usage", description: "Understand balance, consumption, billing controls, and continuity risks.", category: "Operate", time: "9 min", level: "Admin", icon: Bookmark, url: TECH_DOCS.billing },
  { title: "Account types and relationships", description: "Understand Standalone, Parent, and Subaccounts before changing billing or administration.", category: "Operate", time: "7 min", level: "Admin", icon: ShieldCheck, url: TECH_DOCS.accountTypes },
  { title: "Users, access, and API clients", description: "Manage people and system identities in IAM with the minimum required user group.", category: "Operate", time: "9 min", level: "Admin", icon: ShieldCheck, url: TECH_DOCS.userGroups },
  { title: "Live Hub REST API", description: "Manage and monitor Live Hub from your own system.", category: "Develop", time: "12 min", level: "API", icon: Code2, url: TECH_DOCS.restApi },
  { title: "REST API authentication", description: "Create an API client and obtain a bearer token with OAuth client credentials.", category: "Develop", time: "8 min", level: "API", icon: ShieldCheck, url: TECH_DOCS.restAuthentication },
  { title: "Support and evidence", description: "Use documentation, assistants, tickets, and privacy-aware evidence sharing.", category: "Support", time: "8 min", level: "Guide", icon: CircleHelp, url: TECH_DOCS.support },
  { title: "Release notes", description: "Check platform changes before diagnosing behavior that changed after an update.", category: "Support", time: "6 min", level: "Reference", icon: Bookmark, url: TECH_DOCS.releaseNotes },
];

const glossary = [
  { term: "SIP", meaning: "Session Initiation Protocol — the signaling language used to start, manage, and end voice sessions.", tag: "Voice" },
  { term: "SIPREC", meaning: "A SIP-based recording method that lets Live Hub receive a mirrored live call for recording or agent assist.", tag: "Voice" },
  { term: "STT", meaning: "Speech-to-text — turns the caller’s audio into text a bot, agent, or workflow can understand.", tag: "Speech" },
  { term: "TTS", meaning: "Text-to-speech — turns a bot’s response or translated text into a voice the caller hears.", tag: "Speech" },
  { term: "Voice streaming", meaning: "Streams audio directly between the caller and a real-time AI model instead of using separate STT and TTS stages.", tag: "AI" },
  { term: "Routing rule", meaning: "A set of call conditions and actions that decides where a call goes and which services it uses.", tag: "Routing" },
  { term: "Barge-in", meaning: "Lets a caller interrupt a prompt naturally, so the bot can stop speaking and listen.", tag: "Experience" },
  { term: "DTMF", meaning: "The keypad tones created when a caller presses digits during a call.", tag: "Voice" },
  { term: "WebRTC", meaning: "Browser and app technology for real-time media, used by Live Hub Click-to-Call experiences.", tag: "Channel" },
  { term: "SIP ladder", meaning: "A time-ordered view of SIP messages between systems, used to debug signaling and call setup.", tag: "Troubleshooting" },
  { term: "CDR", meaning: "Call Detail Record — structured metadata about a completed or attempted call.", tag: "Monitoring" },
  { term: "PSTN", meaning: "The public telephone network that connects traditional and mobile phone numbers worldwide.", tag: "Channel" },
];

function resetPagePosition() {
  if (typeof window === "undefined") return;
  window.requestAnimationFrame(() => {
    const root = document.documentElement;
    const previousBehavior = root.style.scrollBehavior;
    root.style.scrollBehavior = "auto";
    window.scrollTo({ top: 0, left: 0, behavior: "auto" });
    window.requestAnimationFrame(() => {
      root.style.scrollBehavior = previousBehavior;
    });
  });
}

function missionProgressKey(track: Track, index: number) {
  const missionId = lessonsByTrack[track.id]?.[index]?.id ?? `${track.id}-${index}`;
  return `mission:${missionId}`;
}

function missionIsComplete(track: Track, index: number, completed: string[]) {
  return completed.includes(missionProgressKey(track, index)) || completed.includes(`${track.id}:${index}`);
}

export default function Home() {
  const [view, setView] = useState<View>("home");
  const [selectedTrack, setSelectedTrack] = useState<Track>(tracks[0]);
  const [selectedMissionIndex, setSelectedMissionIndex] = useState(0);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [completed, setCompleted] = useState<string[]>([]);

  useEffect(() => {
    let active = true;
    window.queueMicrotask(() => {
      try {
        const saved = window.localStorage.getItem("live-hub-academy-progress");
        if (saved && active) setCompleted(JSON.parse(saved));
      } catch {
        // Device-local progress is an enhancement; the Academy still works without it.
      }
    });
    return () => {
      active = false;
    };
  }, []);

  const toggleStep = (key: string) => {
    setCompleted((current) => {
      const next = current.includes(key)
        ? current.filter((item) => item !== key)
        : [...current, key];
      try {
        window.localStorage.setItem("live-hub-academy-progress", JSON.stringify(next));
      } catch {
        // Ignore storage restrictions and keep the in-session state.
      }
      return next;
    });
  };

  const currentSteps = selectedTrack.steps.length;
  const currentCompleted = selectedTrack.steps.filter((_, index) =>
    missionIsComplete(selectedTrack, index, completed)
  ).length;
  const progress = currentSteps ? Math.round((currentCompleted / currentSteps) * 100) : 0;

  const goToTrack = (id: string, missionIndex?: number) => {
    const track = tracks.find((item) => item.id === id);
    if (track) {
      setSelectedTrack(track);
      const trackLessons = lessonsByTrack[track.id] ?? [];
      const firstIncomplete = trackLessons.findIndex((_, index) => !missionIsComplete(track, index, completed));
      const requestedMission = missionIndex ?? (firstIncomplete === -1 ? Math.max(0, trackLessons.length - 1) : firstIncomplete);
      const dependencySafeMission = track.id === "voice-agent" && firstIncomplete >= 0 && requestedMission > firstIncomplete ? firstIncomplete : requestedMission;
      setSelectedMissionIndex(dependencySafeMission);
    }
    setView("journeys");
    setMobileOpen(false);
    resetPagePosition();
  };

  const goToView = (next: View) => {
    setView(next);
    setMobileOpen(false);
    resetPagePosition();
  };

  return (
    <main className="academy-shell">
      <button
        className="mobile-menu-button"
        aria-label={mobileOpen ? "Close navigation" : "Open navigation"}
        onClick={() => setMobileOpen((open) => !open)}
      >
        {mobileOpen ? <X /> : <Menu />}
      </button>

      <aside className={`academy-sidebar ${mobileOpen ? "is-open" : ""}`}>
        <div className="brand-lockup" aria-label="Live Hub by AudioCodes">
          <span className="brand-mark">
            <span />
            <span />
            <span />
            <span />
          </span>
          <span className="brand-copy">
            <strong>LIVE HUB</strong>
            <small>by AudioCodes</small>
          </span>
        </div>

        <div className="academy-label">
          <span>ACADEMY</span>
          <span className="academy-label-line" />
        </div>

        <nav className="side-nav" aria-label="Academy navigation">
          {navItems.map((item) => {
            const Icon = item.icon;
            return (
              <Button
                key={item.id}
                variant="ghost"
                className={view === item.id ? "side-nav-item active" : "side-nav-item"}
                onClick={() => goToView(item.id)}
              >
                <Icon />
                <span>{item.label}</span>
                {view === item.id && <ChevronRight className="nav-chevron" />}
              </Button>
            );
          })}
        </nav>

        <Button asChild variant="ghost" className="sidebar-help">
          <a href={TECH_DOCS.support} target="_blank" rel="noreferrer">
            <CircleHelp />
            <span className="sidebar-help-copy">
              <strong>Need official detail?</strong>
              <small>Open Live Hub TechDocs</small>
            </span>
            <ArrowRight />
          </a>
        </Button>
      </aside>

      {mobileOpen && <button className="mobile-overlay" aria-label="Close navigation" onClick={() => setMobileOpen(false)} />}

      <section className="academy-main">
        <header className="topbar">
          <div className="breadcrumb">
            Live Hub <span>/</span> Academy
          </div>
          <div className="topbar-progress" aria-label={`${progress}% complete in ${selectedTrack.title}`}>
            <div><strong>Mission {Math.min(selectedMissionIndex + 1, Math.max(1, currentSteps))} of {Math.max(1, currentSteps)} · {progress}% complete</strong></div>
            <Progress value={progress} />
          </div>
          <div className="topbar-actions">
            <Button variant="ghost" className="top-link" onClick={() => goToView("library")}>
              <Search /> Expert reference
            </Button>
            <Button asChild className="portal-button">
              <a href="https://livehub.audiocodes.io/login" target="_blank" rel="noreferrer">
                Open Live Hub <ArrowRight />
              </a>
            </Button>
          </div>
        </header>

        {view === "home" && (
          <AcademyHome
            goToTrack={goToTrack}
            goToOrientation={() => goToView("orientation")}
            completed={completed}
          />
        )}
        {view === "orientation" && <OrientationView goToJourneys={() => goToView("journeys")} />}
        {view === "journeys" && (
          <PathWorkspace
            key={selectedTrack.id}
            selected={selectedTrack}
            selectedMissionIndex={selectedMissionIndex}
            selectMission={setSelectedMissionIndex}
            launchTrack={goToTrack}
            completed={completed}
            toggleStep={toggleStep}
          />
        )}
        {view === "troubleshooting" && <TroubleshootingView goToDiagnosis={() => goToTrack("diagnose")} />}
        {view === "quiz" && <KnowledgeCheckView />}
        {view === "library" && <LibraryView />}
        {view === "glossary" && <GlossaryView />}
      </section>
    </main>
  );
}

type MissionMatch = {
  track: Track;
  lesson: Lesson;
  lessonIndex: number;
  score: number;
};

const trackSearchAliases: Record<string, string> = {
  "voice-agent": "ai receptionist native agent answer customer opening hours first call",
  "bot-connect": "existing bot copilot dialogflow rasa amazon lex framework",
  "sip-trunk": "sip trunk provider contact center fqdn registration keep alive",
  "teams-sip": "microsoft teams tenant direct routing users",
  "phone-number": "phone number did purchase provision us uk",
  routing: "route routing origin destination called calling number real customer call",
  diagnose: "failed call error logs ladder debug troubleshoot disconnected",
  operate: "monitor calls alarms billing usage access iam",
};

function findMissionMatches(query: string): MissionMatch[] {
  const normalized = query.trim().toLowerCase();
  if (!normalized) return [];
  const tokens = normalized.split(/[^a-z0-9+]+/).filter((token) => token.length > 1);

  return tracks
    .flatMap((track) => (lessonsByTrack[track.id] ?? []).map((lesson, lessonIndex) => {
      const titleText = `${track.title} ${lesson.title}`.toLowerCase();
      const searchable = [
        titleText,
        trackSearchAliases[track.id] ?? "",
        lesson.objective,
        lesson.path.join(" "),
        lesson.before.join(" "),
        lesson.actions.map((action) => `${action.title} ${action.instruction}`).join(" "),
        lesson.success.join(" "),
      ].join(" ").toLowerCase();
      const tokenScore = tokens.reduce((score, token) => score + (searchable.includes(token) ? 2 : 0), 0);
      const score = tokenScore
        + (titleText.includes(normalized) ? 12 : 0)
        + (searchable.includes(normalized) ? 6 : 0);
      return { track, lesson, lessonIndex, score };
    }))
    .filter((match) => match.score > 0)
    .sort((a, b) => b.score - a.score || a.lessonIndex - b.lessonIndex)
    .slice(0, 4);
}

function AcademyHome({
  goToTrack,
  goToOrientation,
  completed,
}: {
  goToTrack: (id: string, missionIndex?: number) => void;
  goToOrientation: () => void;
  completed: string[];
}) {
  const [query, setQuery] = useState("");
  const [submittedQuery, setSubmittedQuery] = useState("");
  const matches = useMemo(() => findMissionMatches(submittedQuery), [submittedQuery]);
  const alternateIds = ["sip-trunk", "teams-sip", "routing", "phone-number", "bot-connect", "diagnose", "operate", "agent-builder"];
  const alternatePaths = alternateIds.map((id) => tracks.find((track) => track.id === id)).filter((track): track is Track => Boolean(track));

  const runSearch = (value: string) => {
    const trimmed = value.trim();
    setQuery(value);
    setSubmittedQuery(trimmed);
    if (trimmed && typeof window !== "undefined") {
      window.dispatchEvent(new CustomEvent("livehub-academy:assistant-query", { detail: { query: trimmed } }));
    }
  };

  return (
    <div className="page academy-home-v2">
      <section className="home-entry-hero">
        <div>
          <span className="section-kicker"><Sparkles /> WELCOME TO LIVE HUB ACADEMY</span>
          <h1>Turn a Live Hub goal<br /><span>into a working result.</span></h1>
          <p>Choose what you need to make work, then follow one focused path inside the real product.</p>
          <div className="home-entry-actions">
            <Button size="lg" onClick={() => goToTrack("voice-agent")}>Make my first AI call <ArrowRight /></Button>
            <Button size="lg" variant="outline" onClick={goToOrientation}><Play /> See Live Hub in 3 minutes</Button>
          </div>
        </div>
        <aside id="livehub-academy-assistant" className="home-ai-guide" data-integration-slot="intercom" data-assistant-fallback="mission-search">
          <header><span><Bot /></span><div><small>LIVE HUB ACADEMY ASSISTANT</small><strong>Ask what you need to make work</strong></div><i>READY</i></header>
          <p>Describe your goal or the thing that failed. The built-in guide opens the closest verified Mission; this same space is ready for a Live Hub agent or Intercom.</p>
          <form onSubmit={(event) => { event.preventDefault(); runSearch(query); }}>
            <Input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Example: route my number to an AI Agent" aria-label="Ask the Live Hub Academy assistant" />
            <Button type="submit" aria-label="Ask the Academy"><ArrowRight /></Button>
          </form>
          <div className="home-ai-prompts" aria-label="Suggested questions">
            {["Route a customer call", "Connect Generic SIP", "Fix a failed call"].map((suggestion) => <button key={suggestion} type="button" onClick={() => runSearch(suggestion)}>{suggestion}</button>)}
          </div>
          {submittedQuery && (
            <div className="home-ai-answer" aria-live="polite">
              <span className="home-ai-user">{submittedQuery}</span>
              {matches.length ? (
                <div><small>BEST NEXT MISSION</small><strong>{matches[0].lesson.title}</strong><p>{matches[0].track.title}</p><Button onClick={() => goToTrack(matches[0].track.id, matches[0].lessonIndex)}>Open this Mission <ArrowRight /></Button></div>
              ) : <div><strong>I could not match that yet.</strong><p>Try SIP, routing, Teams, AI Agent, billing, or failed call.</p></div>}
            </div>
          )}
          <footer><span /> Local Mission matching is active</footer>
        </aside>
      </section>

      <section className="alternate-paths">
        <header><div><span className="section-kicker">ALREADY KNOW YOUR START?</span><h2>Open the path you need.</h2></div><p>SIP, Teams, routing, operations, and advanced AI paths start directly in their first unfinished mission.</p></header>
        <div>
          {alternatePaths.map((track) => {
            const Icon = track.icon;
            const done = track.steps.filter((_, index) => missionIsComplete(track, index, completed)).length;
            return (
              <button key={track.id} type="button" onClick={() => goToTrack(track.id)}>
                <span className={`alternate-path-icon ${track.color}`}><Icon /></span>
                <span><strong>{track.title}</strong><small>{track.time} · {track.steps.length} missions{done ? ` · ${done} complete` : ""}</small></span>
                <ChevronRight />
              </button>
            );
          })}
        </div>
      </section>

    </div>
  );
}

type RoutingSource = "number" | "sip";

type VerifiedActionMedia = {
  image: string;
  alt: string;
  caption: string;
  controlName: string;
  verified: true;
};

const verifiedActionMedia: Record<string, VerifiedActionMedia> = {
  "voice-agent:bright-smile-create:1": { image: "ai-agents-list.png", alt: "Live Hub AI Agents list with the Add new agent button", caption: "Select Add new agent here to create Bright Smile Receptionist.", controlName: "Add new agent", verified: true },
  "voice-agent:bright-smile-create:2": { image: "ai-agent-editor.png", alt: "Live Hub Add Agent editor showing name, welcome message, model, and prompt fields", caption: "Use this editor for the agent name, welcome message, model, and operating rules beside this action.", controlName: "Add Agent editor", verified: true },
  "voice-agent:bright-smile-ground:2": { image: "ai-document-editor.png", alt: "Live Hub Add Document editor showing upload, name, description, and chunk settings", caption: "Choose Upload file in this editor and add the Bright Smile FAQ downloaded in the previous action.", controlName: "Add Document editor", verified: true },
  "voice-agent:bright-smile-availability:2": { image: "ai-tool-editor.png", alt: "Live Hub Tool editor showing name, description, type, method, URL, parameters, and Test button", caption: "Use these controls for Bright Smile Availability; unlike the example shown, set this Academy tool to REST + GET and use the supplied mock URL.", controlName: "Tool General editor", verified: true },
  "voice-agent:bright-smile-voice:0": { image: "ai-speech-telephony.png", alt: "Live Hub Speech and Telephony tab showing enabled state, region, STT, TTS, language, voice, barge-in, and DTMF", caption: "Enable voice and choose the matching region, STT, TTS, language, and voice in this tab.", controlName: "Speech and Telephony", verified: true },
  "voice-agent:bright-smile-outcomes:0": { image: "ai-post-call-list.png", alt: "Live Hub Post call analysis list with the Add new post call analysis button", caption: "Select Add new post call analysis here to create Bright Smile Outcome.", controlName: "Add new post call analysis", verified: true },
  "voice-agent:bright-smile-outcomes:1": { image: "ai-post-call-editor.png", alt: "Live Hub Add Post Call Analysis editor showing type, extract prompt, model, and variables", caption: "Choose Extract variables, define the outcome prompt, and add appointment_outcome in this editor.", controlName: "Add Post Call Analysis editor", verified: true },
  "routing:routing-model:0": { image: "routing-rules-list.png", alt: "Routing Rules table with Origin and Route to columns", caption: "Use the Origin column to identify where the call begins.", controlName: "Origin column", verified: true },
  "routing:routing-model:2": { image: "routing-rule-builder.png", alt: "Create Routing Rule screen with Calling number and Called number condition fields", caption: "Use one exact Calling number or Called number condition for the first test.", controlName: "Calling number and Called number fields", verified: true },
  "routing:routing-create:0": { image: "routing-rules-list.png", alt: "Routing Rules page with Add new routing rule button", caption: "Select Add new routing rule from this screen.", controlName: "Add new routing rule", verified: true },
  "routing:routing-create:2": { image: "routing-rule-builder.png", alt: "Create Routing Rule screen showing Type, Call origin, and Conditions", caption: "Complete Type, Call origin, and the exact test condition here.", controlName: "Origin and Conditions", verified: true },
  "routing:routing-create:3": { image: "routing-rule-builder.png", alt: "Create Routing Rule screen showing the Route to destination field", caption: "Choose the single destination in the Route to panel.", controlName: "Route to", verified: true },
  "routing:routing-create:4": { image: "routing-rule-summary.png", alt: "Expanded saved routing rule showing origin, destination, region, and services", caption: "Expand the saved rule and read it from origin to destination.", controlName: "Expanded routing rule", verified: true },
  "routing:routing-test:2": { image: "call-history-proof.png", alt: "Call History table with successful and failed completion states", caption: "Use the newest Call History row to verify the result.", controlName: "Call History", verified: true },
  "routing:routing-add-services:0": { image: "routing-rule-services.png", alt: "Routing Services controls for recording, Agent Assist, and Voice Translation", caption: "Enable only the one service required by this action.", controlName: "Services", verified: true },
  "routing:routing-add-services:2": { image: "routing-rule-numbers.png", alt: "Number customization fields for calling, called, and service numbers", caption: "Change a number only when the downstream service requires it.", controlName: "Number customization", verified: true },
  "routing:routing-add-services:4": { image: "call-history-proof.png", alt: "Call History table used to compare a new call with a baseline", caption: "Compare the repeated call with the known-good Call History record.", controlName: "Call History", verified: true },
  "operate:operate-dashboard:0": { image: "live-hub-dashboard.png", alt: "Live Hub dashboard with the Current account selector at the top", caption: "Confirm Current account before interpreting any dashboard value.", controlName: "Current account", verified: true },
  "operate:operate-dashboard:1": { image: "live-hub-dashboard.png", alt: "Live Hub dashboard showing the Main Services counters", caption: "Use the Main Services counters to open each configured service area.", controlName: "Main Services", verified: true },
  "operate:operate-dashboard:2": { image: "live-hub-dashboard.png", alt: "Live Hub dashboard showing the Call statistics panel", caption: "Read traffic for the selected interval in Call statistics.", controlName: "Call statistics", verified: true },
  "operate:operate-dashboard:3": { image: "live-hub-dashboard.png", alt: "Live Hub dashboard showing the Active alarms panel", caption: "Select an Active alarms severity to investigate it.", controlName: "Active alarms", verified: true },
};

function getActionMedia(trackId: string, lesson: Lesson, actionIndex: number): VerifiedActionMedia | null {
  return verifiedActionMedia[`${trackId}:${lesson.id}:${actionIndex}`] ?? null;
}

function buildSpokenBriefing(lesson: Lesson) {
  const objective = lesson.objective.replace(/\.$/, "");
  const warning = lesson.commonMistake ?? "Keep the first attempt narrow and change only one thing at a time.";
  const success = lesson.success.slice(0, 2).join(" Then confirm that ").replace(/\.$/, "");
  if (lesson.capabilityGained && lesson.opening) {
    return [
      lesson.opening.problem,
      `Your move now is to ${objective.toLowerCase()}.`,
      `Watch for one trap: ${warning}`,
      `Success is visible: ${success.toLowerCase()}.`,
      `When that is true, ${lesson.capabilityGained.toLowerCase()}`,
    ].join(" ");
  }
  return [
    `Your focus is simple: ${objective.toLowerCase()}.`,
    "Before you start, make sure the prerequisite is real, not assumed. A missing connection, permission, number, or region choice will make the next result misleading.",
    `The main trap is this: ${warning}`,
    "Work through the visible actions in order. Keep the first attempt small, use one controlled test, and resist adding optional behavior until the basic result is stable.",
    `You are finished when ${success.toLowerCase()}.`,
    "If the evidence does not match, stop at that point. Keep the failed result, change one thing, and test again. The goal is a result you can explain, repeat, and show to another person.",
  ].join(" ");
}

type MissionWalkthroughSlide = {
  kind: "opening" | "action" | "closing";
  eyebrow: string;
  title: string;
  text: string;
  media: VerifiedActionMedia | null;
};

function buildMissionWalkthroughSlides(track: Track, lesson: Lesson): MissionWalkthroughSlide[] {
  return [
    { kind: "opening", eyebrow: lesson.opening?.label ?? "MISSION BRIEF", title: lesson.title, text: lesson.opening?.problem ?? `Success looks like: ${lesson.success[0]}`, media: null },
    ...lesson.actions.map((action, index) => ({
      kind: "action" as const,
      eyebrow: `ACTION ${index + 1} OF ${lesson.actions.length}`,
      title: action.title,
      text: action.instruction,
      media: getActionMedia(track.id, lesson, index),
    })),
    { kind: "closing", eyebrow: lesson.capabilityGained ? "CAPABILITY ADDED" : "SUCCESS CHECK", title: lesson.capabilityGained ?? "You are done when…", text: lesson.success.join(" · "), media: null },
  ];
}

function MissionWalkthrough({ track, lesson, briefing, onClose }: { track: Track; lesson: Lesson; briefing: string; onClose: () => void }) {
  const slides = useMemo(() => buildMissionWalkthroughSlides(track, lesson), [track, lesson]);
  const [slideIndex, setSlideIndex] = useState(0);
  const [playing, setPlaying] = useState(false);
  const slide = slides[slideIndex];
  const verifiedScreenCount = slides.filter((item) => item.media?.verified).length;

  useEffect(() => {
    if (!playing) return;
    const millisecondsPerSlide = Math.max(6000, Math.round(75000 / slides.length));
    const timer = window.setInterval(() => {
      setSlideIndex((current) => {
        if (current >= slides.length - 1) {
          window.clearInterval(timer);
          return current;
        }
        return current + 1;
      });
    }, millisecondsPerSlide);
    return () => window.clearInterval(timer);
  }, [playing, slides.length]);

  useEffect(() => () => {
    if ("speechSynthesis" in window) window.speechSynthesis.cancel();
  }, []);

  const play = () => {
    if (!("speechSynthesis" in window)) return;
    window.speechSynthesis.cancel();
    setSlideIndex(0);
    const utterance = new SpeechSynthesisUtterance(briefing);
    utterance.rate = 0.94;
    utterance.onend = () => { setPlaying(false); setSlideIndex(slides.length - 1); };
    utterance.onerror = () => setPlaying(false);
    window.speechSynthesis.speak(utterance);
    setPlaying(true);
  };

  const stop = () => {
    if ("speechSynthesis" in window) window.speechSynthesis.cancel();
    setPlaying(false);
  };

  const close = () => {
    stop();
    onClose();
  };

  return (
    <section className="mission-walkthrough" aria-label={`Narrated walkthrough for ${lesson.title}`}>
      <header><div><span>WATCH INSTEAD · GENERATED FROM THIS MISSION</span><strong>{slides.length} slides · {verifiedScreenCount} verified screens · about 75 seconds</strong></div><Button variant="ghost" onClick={close} aria-label="Close narrated walkthrough"><X /></Button></header>
      <div className={`walkthrough-stage ${slide.media ? "has-screen" : "text-card"}`}>
        {slide.media ? <figure><img src={slide.media.image} alt={slide.media.alt} /><figcaption><CheckCircle2 /> Verified screen · {slide.media.controlName}</figcaption></figure> : <div className="walkthrough-text-card"><span>{slide.kind === "closing" ? <CheckCircle2 /> : <Play />}</span><small>{slide.eyebrow}</small><h3>{slide.title}</h3><p>{slide.text}</p></div>}
        {slide.media && <div className="walkthrough-lower-third"><small>{slide.eyebrow}</small><strong>{slide.title}</strong><p>{slide.text}</p><em>{slide.media.caption}</em></div>}
      </div>
      <footer>
        <Button variant="outline" onClick={() => setSlideIndex((current) => Math.max(0, current - 1))} disabled={slideIndex === 0}><ArrowLeft /> Previous</Button>
        <div className="walkthrough-dots" aria-label={`Slide ${slideIndex + 1} of ${slides.length}`}>{slides.map((item, index) => <button key={`${item.kind}:${index}`} type="button" className={index === slideIndex ? "active" : ""} onClick={() => setSlideIndex(index)} aria-label={`Open slide ${index + 1}`} />)}</div>
        <Button onClick={playing ? stop : play}>{playing ? <Square /> : <Play />}{playing ? "Stop" : "Play narrated flow"}</Button>
        <Button variant="outline" onClick={() => setSlideIndex((current) => Math.min(slides.length - 1, current + 1))} disabled={slideIndex === slides.length - 1}>Next <ArrowRight /></Button>
      </footer>
    </section>
  );
}

function PathWorkspace({
  selected,
  selectedMissionIndex,
  selectMission,
  launchTrack,
  completed,
  toggleStep,
}: {
  selected: Track;
  selectedMissionIndex: number;
  selectMission: (index: number) => void;
  launchTrack: (id: string, missionIndex?: number) => void;
  completed: string[];
  toggleStep: (key: string) => void;
}) {
  const lessons = lessonsByTrack[selected.id] ?? [];
  const safeIndex = Math.min(selectedMissionIndex, Math.max(0, lessons.length - 1));
  const lesson = lessons[safeIndex];
  const [routingSource, setRoutingSource] = useState<RoutingSource>("number");
  const pathComplete = lessons.length > 0 && lessons.every((_, index) => missionIsComplete(selected, index, completed));
  const flagshipCapabilities = FLAGSHIP_CAPABILITIES.filter((_, index) => missionIsComplete(selected, index, completed));

  if (!lesson) return <div className="page"><p>No missions are available for this path yet.</p></div>;

  const completeMission = () => {
    const key = missionProgressKey(selected, safeIndex);
    if (!missionIsComplete(selected, safeIndex, completed)) toggleStep(key);
  };

  const continueMission = () => {
    if (safeIndex < lessons.length - 1) {
      selectMission(safeIndex + 1);
      resetPagePosition();
    }
  };

  return (
    <div className="page path-page">
      <header className="path-header">
        <div><span className="section-kicker">PATH</span><h1>{selected.title}</h1><p>{selected.description}</p></div>
        {["voice-agent", "bot-connect"].includes(selected.id) && (
          <div className="path-toggle" aria-label="Choose how to start the AI path">
            <span>STARTING POINT</span>
            <div><Button variant="outline" className={selected.id === "voice-agent" ? "active" : ""} onClick={() => launchTrack("voice-agent", 0)}>Build a new AI Agent</Button><Button variant="outline" className={selected.id === "bot-connect" ? "active" : ""} onClick={() => launchTrack("bot-connect", 0)}>Connect an existing bot</Button></div>
          </div>
        )}
        {selected.id === "routing" && (
          <div className="path-toggle" aria-label="Choose the origin for this routing path">
            <span>CALL ORIGIN</span>
            <div><Button variant="outline" className={routingSource === "number" ? "active" : ""} onClick={() => setRoutingSource("number")}>Live Hub number</Button><Button variant="outline" className={routingSource === "sip" ? "active" : ""} onClick={() => setRoutingSource("sip")}>External SIP provider</Button></div>
          </div>
        )}
      </header>

      {selected.id === "voice-agent" && (
        <section className="flagship-build-card" aria-label="The single project built across this path">
          <div className="flagship-build-main">
            <span><Bot /></span>
            <div><small>ONE PROJECT · SAME AGENT IN EVERY MISSION</small><h2>{FLAGSHIP_SCENARIO.agent}</h2><p>{FLAGSHIP_SCENARIO.business} · Caller: {FLAGSHIP_SCENARIO.caller}</p></div>
          </div>
          <div className="flagship-build-state">
            <small>WHAT IT CAN DO NOW</small>
            {flagshipCapabilities.length ? flagshipCapabilities.map((item) => <span key={item.id}><CheckCircle2 /> {item.capability}</span>) : <p>Nothing yet. Mission 1 creates the agent every later Mission improves.</p>}
          </div>
        </section>
      )}

      <div className="path-workspace-v2">
        <aside className="path-mission-list" aria-label="Missions in this path">
          <span>MISSIONS</span>
          {lessons.map((item, index) => {
            const done = missionIsComplete(selected, index, completed);
            const unlocked = selected.id !== "voice-agent" || index === 0 || done || missionIsComplete(selected, index - 1, completed);
            return (
              <button key={item.id} type="button" className={index === safeIndex ? "active" : done ? "done" : !unlocked ? "locked" : ""} disabled={!unlocked} onClick={() => { selectMission(index); resetPagePosition(); }}>
                <span>{done ? <Check /> : !unlocked ? <LockKeyhole /> : index + 1}</span>
                <strong>{item.title}</strong>
                <small>{item.duration}</small>
              </button>
            );
          })}
          {pathComplete && <div className="path-complete-note"><Award /><span><strong>Path complete</strong><small>{selected.reward} earned</small></span></div>}
        </aside>

        <MissionWorkspace
          key={lesson.id}
          track={selected}
          lesson={lesson}
          lessonIndex={safeIndex}
          totalMissions={lessons.length}
          completed={completed}
          toggleStep={toggleStep}
          onComplete={completeMission}
          onContinue={continueMission}
        />
      </div>
    </div>
  );
}

function MissionWorkspace({
  track,
  lesson,
  lessonIndex,
  totalMissions,
  completed,
  toggleStep,
  onComplete,
  onContinue,
}: {
  track: Track;
  lesson: Lesson;
  lessonIndex: number;
  totalMissions: number;
  completed: string[];
  toggleStep: (key: string) => void;
  onComplete: () => void;
  onContinue: () => void;
}) {
  const done = missionIsComplete(track, lessonIndex, completed);
  const [speaking, setSpeaking] = useState(false);
  const [watching, setWatching] = useState(false);
  const briefing = buildSpokenBriefing(lesson);
  const actionKeys = lesson.actions.map((_, index) => `action:${lesson.id}:${index}`);
  const successKeys = lesson.success.map((_, index) => `success:${lesson.id}:${index}`);
  const allActionsDone = done || actionKeys.every((key) => completed.includes(key));
  const allSuccessDone = done || successKeys.every((key) => completed.includes(key));
  const isFlagship = track.id === "voice-agent";
  const previouslyEarned = isFlagship ? FLAGSHIP_CAPABILITIES.slice(0, lessonIndex) : [];

  useEffect(() => () => {
    if (typeof window !== "undefined" && "speechSynthesis" in window) window.speechSynthesis.cancel();
  }, [lesson.id]);

  const toggleBriefing = () => {
    if (!("speechSynthesis" in window)) return;
    setWatching(false);
    if (speaking) {
      window.speechSynthesis.cancel();
      setSpeaking(false);
      return;
    }
    const utterance = new SpeechSynthesisUtterance(briefing);
    utterance.rate = 0.94;
    utterance.onend = () => setSpeaking(false);
    utterance.onerror = () => setSpeaking(false);
    window.speechSynthesis.speak(utterance);
    setSpeaking(true);
  };

  return (
    <article className="mission-surface">
      <header className="mission-head-v2">
        <div><span>MISSION {lessonIndex + 1} · {lesson.duration}</span><h2>{lesson.title}</h2>{isFlagship && <p className="mission-running-build"><Bot /> Still building: <strong>{FLAGSHIP_SCENARIO.agent}</strong>{previouslyEarned.length ? ` · ${previouslyEarned.length} capabilities already working` : " · starts here"}</p>}</div>
        <div className="mission-audio"><div className="mission-format-buttons"><Button variant="outline" onClick={toggleBriefing}>{speaking ? <Square /> : <Volume2 />}{speaking ? "Stop briefing" : "Listen · 60–90 sec"}</Button><Button variant="outline" className={watching ? "active" : ""} onClick={() => { if ("speechSynthesis" in window) window.speechSynthesis.cancel(); setSpeaking(false); setWatching((current) => !current); }}><Play />{watching ? "Close walkthrough" : "Watch instead"}</Button></div><details><summary>Read briefing</summary><p>{briefing}</p></details></div>
      </header>

      {watching && <MissionWalkthrough track={track} lesson={lesson} briefing={briefing} onClose={() => setWatching(false)} />}

      {lesson.opening && (
        <section className={`mission-opening ${lesson.opening.label === "SEE THE GAP FIRST" ? "failure-first" : "stake-first"}`}>
          <div className="mission-opening-icon">{lesson.opening.label === "SEE THE GAP FIRST" ? <Zap /> : <Lightbulb />}</div>
          <div><small>{lesson.opening.label}</small><h3>{lesson.opening.problem}</h3>{lesson.opening.tryThis && <p><strong>Try this before you fix it:</strong> {lesson.opening.tryThis}</p>}{lesson.opening.expectedGap && <p><strong>What you should notice:</strong> {lesson.opening.expectedGap}</p>}</div>
        </section>
      )}

      <section className="mission-success-line"><CheckCircle2 /><span><small>SUCCESS LOOKS LIKE</small><strong>{lesson.success[0]}</strong></span></section>

      <section className="mission-click-path" aria-label="Click path in Live Hub"><span>GO TO</span><div>{lesson.path.map((part, index) => <span key={`${part}:${index}`}>{part}{index < lesson.path.length - 1 && <ChevronRight />}</span>)}</div></section>

      <details className="mission-before-v2">
        <summary><ListChecks /><span><strong>Before you start</strong><small>{lesson.before.length} prerequisites</small></span><ChevronRight /></summary>
        <div>{lesson.before.map((item) => <p key={item}><Check /> {item}</p>)}</div>
      </details>

      {lesson.skipForNow?.length ? (
        <details className="mission-skip-v2">
          <summary><ShieldCheck /><span><strong>Keep this first run small</strong><small>{lesson.skipForNow.length} things to ignore for now</small></span><ChevronRight /></summary>
          <div>{lesson.skipForNow.map((item) => <span key={item}><X /> {item}</span>)}</div>
        </details>
      ) : null}

      <section className="mission-actions-v2">
        <header><span>DO THE WORK</span><h3>Complete these actions in Live Hub</h3></header>
        <div>
          {lesson.actions.map((action, index) => {
            const actionKey = actionKeys[index];
            const checked = done || completed.includes(actionKey);
            const media = getActionMedia(track.id, lesson, index);
            return (
              <article key={actionKey} className={checked ? "inline-action checked" : "inline-action"}>
                <label><Checkbox checked={checked} disabled={done} onCheckedChange={() => toggleStep(actionKey)} aria-label={`Mark ${action.title} complete`} /><span><strong>{action.title}</strong><p>{action.instruction}</p>{action.note && <em><Lightbulb /> {action.note}</em>}</span></label>
                {action.resource && <div className="action-resource"><Button asChild variant="outline"><a href={action.resource.href} target={action.resource.download ? undefined : "_blank"} rel={action.resource.download ? undefined : "noreferrer"} download={action.resource.download}><FileText /> {action.resource.label} {action.resource.download ? <ArrowRight /> : <ExternalLink />}</a></Button></div>}
                {media && (
                  <div className="action-media">
                    <figure><img src={media.image} alt={media.alt} loading="lazy" /><figcaption><CheckCircle2 /> {media.caption}</figcaption></figure>
                  </div>
                )}
              </article>
            );
          })}
        </div>
      </section>

      {lesson.commonMistake && <aside className="mission-warning-v2"><AlertTriangle /><span><strong>Common mistake</strong><p>{lesson.commonMistake}</p></span></aside>}

      <section className="mission-proof-v2">
        <header><span>SUCCESS CHECK</span><h3>Confirm what you can see</h3></header>
        <div>{lesson.success.map((item, index) => { const key = successKeys[index]; const checked = done || completed.includes(key); return <label key={key} className={checked ? "checked" : ""}><Checkbox checked={checked} disabled={done || !allActionsDone} onCheckedChange={() => toggleStep(key)} /><strong>{item}</strong></label>; })}</div>
        <Button size="lg" disabled={done || !allActionsDone || !allSuccessDone} onClick={onComplete}>{done ? "Mission complete" : lessonIndex === totalMissions - 1 ? "Complete this path" : "Confirm mission complete"}<ArrowRight /></Button>
      </section>

      {done && lesson.capabilityGained && (
        lessonIndex === totalMissions - 1 && isFlagship ? (
          <section className="path-payoff" aria-live="polite">
            <span className="path-payoff-award"><Award /></span>
            <small>PATH COMPLETE · {track.reward.toUpperCase()} EARNED</small>
            <h3>You built {FLAGSHIP_SCENARIO.agent}.</h3>
            <p className="path-payoff-statement">“{FLAGSHIP_SCENARIO.finalStatement}”</p>
            <div>{FLAGSHIP_CAPABILITIES.map((item) => <span key={item.id}><CheckCircle2 /><strong>{item.capability}</strong></span>)}</div>
            <p>Call the provisioned number again whenever you want to repeat the proof. Use the matching Call ID and AI Agents log when you show the result to a colleague.</p>
            <Button asChild size="lg"><a href="https://livehub.audiocodes.io/login" target="_blank" rel="noreferrer"><PhoneCall /> Call or inspect it again <ExternalLink /></a></Button>
          </section>
        ) : (
          <section className="mission-capability-earned" aria-live="polite">
            <span><CheckCircle2 /></span>
            <div><small>CAPABILITY ADDED</small><h3>{lesson.capabilityGained}</h3>{isFlagship && <p>The next Mission changes this same {FLAGSHIP_SCENARIO.agent}—you are not starting a new exercise.</p>}</div>
            {lessonIndex < totalMissions - 1 && <Button size="lg" onClick={onContinue}>Continue to Mission {lessonIndex + 2} <ArrowRight /></Button>}
          </section>
        )
      )}

      {done && !lesson.capabilityGained && lessonIndex < totalMissions - 1 && <section className="mission-capability-earned"><span><CheckCircle2 /></span><div><small>MISSION COMPLETE</small><h3>The result is saved. Continue when you are ready.</h3></div><Button size="lg" onClick={onContinue}>Continue to Mission {lessonIndex + 2} <ArrowRight /></Button></section>}

      <details className="mission-troubleshooting-v2"><summary><AlertTriangle /><span><strong>Troubleshoot this mission</strong><small>Open only if your result differs</small></span><ChevronRight /></summary><div>{lesson.troubleshooting.map((item) => <section key={item.problem}><strong>{item.problem}</strong><p>{item.fix}</p></section>)}</div></details>
    </article>
  );
}

function LegacyHomeView({
  goToTrack,
  goToOrientation,
  goToJourneys,
}: {
  goToTrack: (id: string) => void;
  goToOrientation: () => void;
  goToJourneys: () => void;
}) {
  const [courseQuery, setCourseQuery] = useState("");
  const [assistantQuery, setAssistantQuery] = useState("");
  const [assistantPrompt, setAssistantPrompt] = useState("");
  const normalizedQuery = courseQuery.trim().toLowerCase();
  const matchingTracks = normalizedQuery
    ? tracks.filter((track) => `${track.title} ${track.description} ${track.level}`.toLowerCase().includes(normalizedQuery))
    : tracks.slice(0, 3);
  const assistantResult = assistantPrompt ? guideLearner(assistantPrompt) : null;

  const askAcademy = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!assistantQuery.trim()) return;
    setAssistantPrompt(assistantQuery);
  };

  const applyGuidePrompt = (prompt: string) => {
    setAssistantQuery(prompt);
    setAssistantPrompt(prompt);
  };

  return (
    <div className="page home-page simplified-home">
      <section className="academy-welcome brand-hero">
        <div className="brand-hero-copy">
          <span className="section-kicker"><Sparkles /> WELCOME TO THE LIVE HUB ACADEMY</span>
          <h1>Make Voice AI<br /><span>work in the real world.</span></h1>
          <p>
            Live Hub is AudioCodes&apos; enterprise platform for building Voice AI and connecting it to real voice channels. Here, you learn it through short missions that end with a working call—not another page of theory.
          </p>
          <div className="brand-hero-actions">
            <Button size="lg" onClick={() => goToTrack("voice-agent")}>Start the AI Agent course <ArrowRight /></Button>
            <Button variant="outline" className="welcome-tour-button" onClick={goToOrientation}>
              <Play /> Take the 3-minute tour
            </Button>
          </div>
          <div className="brand-hero-promise" aria-label="Academy learning promise">
            <span><CheckCircle2 /> One goal at a time</span>
            <span><Route /> Routing made visual</span>
            <span><Activity /> Every mission ends with proof</span>
          </div>
        </div>
        <div className="brand-hero-art" aria-hidden="true">
          <img src="livehub-brand-wave.webp" alt="" />
          <span className="brand-hero-art-label"><small>VOICE AI · CONNECTIVITY · ORCHESTRATION</small><strong>LIVE HUB</strong></span>
        </div>
      </section>

      <section className="course-search" aria-label="Find a Live Hub course">
        <Search />
        <Input
          value={courseQuery}
          onChange={(event) => setCourseQuery(event.target.value)}
          placeholder="Search a goal: AI Agent, SIP, Teams, routing, calls…"
          aria-label="Search Academy courses"
        />
        {courseQuery && <Button variant="ghost" onClick={() => setCourseQuery("")} aria-label="Clear course search"><X /></Button>}
      </section>

      {!normalizedQuery && (
        <section className="home-feature-grid">
          <article className="featured-course">
            <div className="featured-course-copy">
              <span className="featured-label"><Bot /> FEATURED FIRST COURSE</span>
              <h2>Launch a Live Hub AI Agent by phone</h2>
              <p>Build one focused agent, prove its logic, add speech, connect a number, route the call, and inspect the result.</p>
              <div className="featured-outcomes">
                <span><Check /> Guided from blank agent to real call</span>
                <span><Check /> 6 short lessons</span>
                <span><Check /> 35 minutes plus number provisioning</span>
              </div>
              <Button size="lg" onClick={() => goToTrack("voice-agent")}>Start the AI Agent course <ArrowRight /></Button>
            </div>
            <div className="featured-call-path" aria-label="AI Agent course path">
              <span><small>01</small><strong>Build</strong></span>
              <ArrowRight />
              <span><small>02</small><strong>Add voice</strong></span>
              <ArrowRight />
              <span><small>03</small><strong>Route</strong></span>
              <ArrowRight />
              <span><small>04</small><strong>Call</strong></span>
            </div>
          </article>

          {/* This useful local guide can be replaced by Intercom at the same stable mount point. */}
          <article
            id="livehub-academy-assistant"
            className="assistant-space"
            data-integration-slot="intercom"
          >
            <span className="assistant-status"><span /> ACADEMY GUIDE · READY</span>
            <div className="assistant-icon"><MessageCircle /></div>
            <h2>Tell me what you need to make work.</h2>
            <p>I&apos;ll point you to the shortest verified Academy path. This guide uses the existing courses today and keeps the same slot ready for Intercom later.</p>
            <div className="assistant-quick-prompts" aria-label="Common Academy questions">
              {[
                "My SIP trunk is disconnected",
                "I need to route a call",
                "I want to build an AI Agent",
              ].map((prompt) => <button key={prompt} onClick={() => applyGuidePrompt(prompt)}>{prompt}</button>)}
            </div>
            <form className="assistant-input-preview" onSubmit={askAcademy}>
              <Input
                value={assistantQuery}
                onChange={(event) => setAssistantQuery(event.target.value)}
                placeholder="Ask about SIP, routing, calls…"
                aria-label="Ask the Academy guide"
              />
              <Button type="submit" aria-label="Find my Academy path"><Bot /> Guide me</Button>
            </form>
            {assistantResult && (
              <div className="assistant-result" aria-live="polite">
                <small>{assistantResult.eyebrow}</small>
                <strong>{assistantResult.title}</strong>
                <p>{assistantResult.answer}</p>
                <Button variant="ghost" onClick={() => goToTrack(assistantResult.trackId)}>
                  {assistantResult.action} <ArrowRight />
                </Button>
              </div>
            )}
          </article>
        </section>
      )}

      <section className="catalog-section">
        <div className="catalog-heading">
          <div>
            <span className="section-kicker">{normalizedQuery ? "SEARCH RESULTS" : "CHOOSE ONE STARTING PATH"}</span>
            <h2>{normalizedQuery ? `${matchingTracks.length} matching courses` : "Start with the call you need"}</h2>
          </div>
          {!normalizedQuery && <p>Do not learn the whole platform at once. Pick one origin; Routing joins it to a destination.</p>}
        </div>

        {matchingTracks.length ? (
          <div className="simple-course-list">
            {matchingTracks.map((track, index) => {
              const Icon = track.icon;
              return (
                <button key={track.id} className="simple-course-card" onClick={() => goToTrack(track.id)}>
                  <span className={`simple-course-icon ${track.color}`}><Icon /></span>
                  <span className="simple-course-copy">
                    <small>{index === 0 && !normalizedQuery ? "RECOMMENDED · " : ""}{track.level}</small>
                    <strong>{track.title}</strong>
                    <em>{track.description}</em>
                  </span>
                  <span className="simple-course-meta"><Clock3 /> {track.time}</span>
                  <ArrowRight />
                </button>
              );
            })}
          </div>
        ) : (
          <section className="empty-results course-empty">
            <Search />
            <h2>No exact course yet.</h2>
            <p>Try “SIP”, “AI Agent”, “routing”, “monitor”, or “failed call”.</p>
            <Button variant="outline" onClick={() => setCourseQuery("")}>Show starting paths</Button>
          </section>
        )}
      </section>

      {!normalizedQuery && (
        <section className="home-next-row">
          <button onClick={() => goToTrack("routing")}><span><Route /></span><div><small>CORE SKILL</small><strong>Understand Routing</strong><p>Match one origin to one destination.</p></div><ArrowRight /></button>
          <button onClick={() => goToTrack("operate")}><span><Activity /></span><div><small>AFTER GO-LIVE</small><strong>Monitor and operate</strong><p>Read Calls, alarms, billing, and access.</p></div><ArrowRight /></button>
          <button onClick={() => goToTrack("diagnose")}><span><AlertTriangle /></span><div><small>WHEN IT FAILS</small><strong>Diagnose a call</strong><p>Find the first failing layer and collect proof.</p></div><ArrowRight /></button>
        </section>
      )}

      {!normalizedQuery && (
        <section className="home-resource-bar">
          <div><Play /><span><strong>Prefer to watch?</strong><small>Use the official AudioCodes Live Hub playlist alongside the ordered lessons.</small></span></div>
          <Button asChild variant="outline"><a href={OFFICIAL_VIDEO_PLAYLIST} target="_blank" rel="noreferrer">Video playlist <ExternalLink /></a></Button>
          <Button variant="outline" onClick={goToJourneys}>All courses <FolderOpen /></Button>
        </section>
      )}
    </div>
  );
}

function HomeView({
  goToTrack,
  goToOrientation,
  goToJourneys,
  goToCertification,
  completed,
}: {
  goToTrack: (id: string) => void;
  goToOrientation: () => void;
  goToJourneys: () => void;
  goToCertification: () => void;
  completed: string[];
}) {
  const [assistantQuery, setAssistantQuery] = useState("");
  const [assistantPrompt, setAssistantPrompt] = useState("");
  const assistantResult = assistantPrompt ? guideLearner(assistantPrompt) : null;
  const alternateStarts = tracks.slice(1, 3);
  const startedPath = tracks.find((track) =>
    track.steps.some((_, index) => missionIsComplete(track, index, completed))
  ) ?? tracks[0];
  const completedInStartedPath = startedPath.steps.filter((_, index) =>
    missionIsComplete(startedPath, index, completed)
  ).length;
  const pathProgress = startedPath.steps.length
    ? Math.round((completedInStartedPath / startedPath.steps.length) * 100)
    : 0;

  const askAcademy = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (assistantQuery.trim()) setAssistantPrompt(assistantQuery);
  };

  const askSuggestedQuestion = (question: string) => {
    setAssistantQuery(question);
    setAssistantPrompt(question);
  };

  return (
    <div className="page outcome-home">
      <section className="outcome-hero">
        <div className="outcome-hero-copy">
          <span className="section-kicker"><Sparkles /> WELCOME TO LIVE HUB ACADEMY · ALIGNED TO 2.19.2</span>
          <h1>What will you<br /><span>make work?</span></h1>
          <p>
            Live Hub connects Voice AI to real phone systems, numbers, Microsoft Teams, and customer conversations. This is your fastest path from zero to a working, production-ready deployment.
          </p>
          <div className="outcome-hero-actions">
            <Button size="lg" onClick={() => goToTrack("voice-agent")}>Make my first AI call <ArrowRight /></Button>
            <Button size="lg" variant="outline" onClick={goToOrientation}><Play /> See Live Hub in 3 minutes</Button>
          </div>
        </div>

        <aside id="livehub-academy-assistant" className="hero-guide" data-integration-slot="intercom">
          <div className="hero-guide-art" aria-hidden="true"><img src="livehub-brand-wave.webp" alt="" /></div>
          <div className="hero-guide-content">
            <div className="hero-guide-status"><span /><strong>ACADEMY GUIDE · READY</strong><small>Always available</small></div>
            <div className="hero-guide-avatar"><Bot /></div>
            <span className="hero-guide-eyebrow">YOUR LIVE HUB COPILOT</span>
            <h2>Tell me what you need to make work.</h2>
            <p>Describe the outcome or the failure. I’ll send you to the shortest verified path.</p>
            <form onSubmit={askAcademy}>
              <Input value={assistantQuery} onChange={(event) => setAssistantQuery(event.target.value)} placeholder="Example: Route my number to an AI Agent" aria-label="Ask the Academy guide" />
              <Button type="submit" aria-label="Ask the Academy guide"><ArrowRight /></Button>
            </form>
            {!assistantResult && (
              <div className="hero-guide-prompts">
                <span>TRY ASKING</span>
                <button type="button" onClick={() => askSuggestedQuestion("Route a real customer call")}>Route a customer call</button>
                <button type="button" onClick={() => askSuggestedQuestion("My SIP trunk is disconnected")}>Fix a failed SIP call</button>
                <button type="button" onClick={() => askSuggestedQuestion("Launch an AI receptionist")}>Launch an AI receptionist</button>
              </div>
            )}
            {assistantResult && (
              <div className="hero-guide-result" aria-live="polite">
                <small>{assistantResult.eyebrow}</small>
                <strong>{assistantResult.title}</strong>
                <p>{assistantResult.answer}</p>
                <Button onClick={() => goToTrack(assistantResult.trackId)}>{assistantResult.action} <ArrowRight /></Button>
              </div>
            )}
            <div className="hero-guide-continue">
              <span>{completedInStartedPath ? `${pathProgress}% complete` : "Recommended first win"}</span>
              <button type="button" onClick={() => goToTrack(startedPath.id)}>{completedInStartedPath ? `Continue ${startedPath.title}` : startedPath.title}<ChevronRight /></button>
            </div>
          </div>
        </aside>
      </section>

      <section className="path-section start-paths">
        <div className="path-heading">
          <div><span className="section-kicker">ALREADY HAVE A TELEPHONY START?</span><h2>Choose an alternate entry.</h2></div>
          <p>The AI call above is the recommended start. Use one of these only when SIP or Teams is already the system you need to connect.</p>
        </div>
        <div className="primary-path-grid">
          {alternateStarts.map((track) => {
            const Icon = track.icon;
            const count = track.steps.filter((_, stepIndex) => missionIsComplete(track, stepIndex, completed)).length;
            return (
              <button key={track.id} className="outcome-path-card" onClick={() => goToTrack(track.id)}>
                <span className={`path-card-icon ${track.color}`}><Icon /></span>
                <span className="alternate-pill">ALTERNATE START</span>
                <h3>{track.title}</h3>
                <p>{track.outcome}</p>
                <span className="path-card-role">FOR · {track.role}</span>
                <span className="path-card-footer"><span><Clock3 /> {track.time}</span><span>{count ? `${count}/${track.steps.length} done` : `${track.steps.length} missions`}</span><ArrowRight /></span>
              </button>
            );
          })}
        </div>
      </section>

      <section className="course-universe-strip">
        <div><span>{tracks.length}</span><p><strong>complete outcome courses</strong><small>Every major subject from Live Hub 2.19.2, organized into five go-live levels.</small></p></div>
        <Button size="lg" onClick={goToJourneys}>Open the complete journey <ArrowRight /></Button>
      </section>

      <section className="certification-banner">
        <div><ShieldCheck /><span><small>BEFORE CUSTOMERS CALL</small><h2>Run a production readiness check</h2><p>Review resilience, evidence, access, and the next move in real Live Hub scenarios.</p></span></div>
        <div className="certification-actions">
          <Button size="lg" onClick={goToCertification}>Open readiness checkpoint <ArrowRight /></Button>
          <Button asChild size="lg" variant="outline"><a href={OFFICIAL_VIDEO_PLAYLIST} target="_blank" rel="noreferrer"><Play /> Official video library</a></Button>
        </div>
      </section>
    </div>
  );
}

function KnowledgeCheckView() {
  const [answers, setAnswers] = useState<Record<string, number>>({});
  const [submitted, setSubmitted] = useState(false);
  const answeredCount = Object.keys(answers).length;
  const score = knowledgeQuestions.filter((question) => answers[question.id] === question.correctIndex).length;

  const selectAnswer = (questionId: string, answerIndex: number) => {
    if (submitted) return;
    setAnswers((current) => ({ ...current, [questionId]: answerIndex }));
  };

  const resetQuiz = () => {
    setAnswers({});
    setSubmitted(false);
    resetPagePosition();
  };

  return (
    <div className="page quiz-page">
      <section className="quiz-hero">
        <div>
          <span className="section-kicker"><ShieldCheck /> PRODUCTION READINESS · OPTIONAL CHECKPOINT</span>
          <h1>Can you make the right next move?</h1>
          <p>Twelve practical scenarios from the supplied bootcamp material. Pass by applying stable Live Hub judgment—not by memorizing changing commercial terms.</p>
        </div>
        <div className="quiz-progress-card">
          <span>YOUR PROGRESS</span>
          <strong>{answeredCount}<small> / {knowledgeQuestions.length}</small></strong>
          <Progress value={(answeredCount / knowledgeQuestions.length) * 100} aria-label={`${answeredCount} of ${knowledgeQuestions.length} questions answered`} />
        </div>
      </section>

      <section className="quiz-list">
        {knowledgeQuestions.map((question, questionIndex) => {
          const selectedAnswer = answers[question.id];
          const isCorrect = selectedAnswer === question.correctIndex;
          return (
            <article className="quiz-question" key={question.id}>
              <header><span>{String(questionIndex + 1).padStart(2, "0")}</span><h2>{question.question}</h2></header>
              <div className="quiz-options" role="radiogroup" aria-label={question.question}>
                {question.options.map((option, optionIndex) => {
                  const selected = selectedAnswer === optionIndex;
                  const stateClass = submitted
                    ? optionIndex === question.correctIndex
                      ? "correct"
                      : selected
                        ? "incorrect"
                        : ""
                    : selected
                      ? "selected"
                      : "";
                  return (
                    <label key={option} className={`quiz-option ${stateClass}`}>
                      <input
                        type="radio"
                        name={question.id}
                        checked={selected}
                        onChange={() => selectAnswer(question.id, optionIndex)}
                        disabled={submitted}
                      />
                      <span>{String.fromCharCode(65 + optionIndex)}</span>
                      <strong>{option}</strong>
                      {submitted && optionIndex === question.correctIndex && <CheckCircle2 />}
                      {submitted && selected && !isCorrect && <X />}
                    </label>
                  );
                })}
              </div>
              {submitted && (
                <div className={isCorrect ? "quiz-explanation correct" : "quiz-explanation"}>
                  <span>{isCorrect ? <CheckCircle2 /> : <Lightbulb />}</span>
                  <p><strong>{isCorrect ? "Correct." : "Best answer:"}</strong> {question.explanation}</p>
                  <a href={question.sourceUrl} target="_blank" rel="noreferrer">Open the official guide <ExternalLink /></a>
                </div>
              )}
            </article>
          );
        })}
      </section>

      <section className="quiz-submit-bar">
        {submitted ? (
          <>
            <div><Award /><span><small>YOUR SCORE</small><strong>{score} / {knowledgeQuestions.length}</strong><p>{score >= 10 ? "Strong operational judgment." : "Review the explanations, then try again."}</p></span></div>
            <Button size="lg" variant="outline" onClick={resetQuiz}><RotateCcw /> Try again</Button>
          </>
        ) : (
          <>
            <div><ListChecks /><span><small>READY TO CHECK?</small><strong>{answeredCount} of {knowledgeQuestions.length} answered</strong><p>Answer every question to reveal the explanations and source links.</p></span></div>
            <Button size="lg" className="primary-cta" disabled={answeredCount !== knowledgeQuestions.length} onClick={() => { setSubmitted(true); resetPagePosition(); }}>Check production readiness <ArrowRight /></Button>
          </>
        )}
      </section>
    </div>
  );
}

function OrientationView({ goToJourneys }: { goToJourneys: () => void }) {
  const landmarks = [
    { number: 1, title: "Current account", detail: "Check this before every edit. The right object in the wrong account still looks like it disappeared." },
    { number: 2, title: "Main menu", detail: "This is the map: build, connect, route, operate, and administer from the left side." },
    { number: 3, title: "Monthly usage", detail: "Watch consumption and plan limits before a test becomes production traffic." },
    { number: 4, title: "Help Center", detail: "Open official documentation and the supported contact path from here." },
    { number: 5, title: "Profile and IAM", detail: "Manage identity, access, API clients, and account-level settings." },
    { number: 6, title: "Launch wizard", detail: "Use the guided setup when you want help creating a common call path." },
    { number: 7, title: "Support assistant", detail: "Ask a product question from the screen you are already working on." },
  ];

  return (
    <div className="page orientation-page">
      <section className="orientation-hero">
        <div>
          <span className="section-kicker">QUICK ORIENTATION · 3 MINUTES</span>
          <h1>Learn one model.<br /><span>Ignore the menu for now.</span></h1>
          <p>A working Live Hub service is a chain. Something enters, Live Hub routes it, something handles it, and the logs prove the result. You do not need to learn every product area first.</p>
          <div className="hero-actions">
            <Button size="lg" className="primary-cta" onClick={goToJourneys}><Route /> Choose my starting path</Button>
            <Button asChild size="lg" variant="outline" className="secondary-cta">
              <a href={TECH_DOCS.dashboard} target="_blank" rel="noreferrer">Open dashboard TechDocs <ExternalLink /></a>
            </Button>
          </div>
        </div>
        <figure className="orientation-video">
          <div className="visual-label"><Play /> OFFICIAL 3-MINUTE PLATFORM TOUR</div>
          <div className="video-frame"><iframe src="https://www.youtube-nocookie.com/embed/45XIL7YHhYo?rel=0" title="Live Hub Platform General Review" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" allowFullScreen /></div>
          <figcaption>Watch once, then follow the Academy&apos;s ordered first-call path.</figcaption>
        </figure>
      </section>

      <section className="orientation-model">
        <div className="section-heading compact">
          <div><span className="section-kicker">HOW ONE CALL MOVES · CONCEPT ONLY</span><h2>Origin → Route → Destination → Proof</h2></div>
          <p>This is the Live Hub mental model—not a course progress tracker.</p>
        </div>
        <div className="call-concept" aria-label="A call enters from an origin, Live Hub routes it to a destination, and evidence proves the result">
          <article><small>ORIGIN</small><strong>A call enters</strong><p>A number, SIP trunk, Teams user, browser, or WhatsApp caller.</p></article>
          <ArrowRight aria-hidden="true" />
          <article><small>ROUTE</small><strong>Live Hub decides</strong><p>Conditions select the correct destination and optional services.</p></article>
          <ArrowRight aria-hidden="true" />
          <article><small>DESTINATION</small><strong>Something answers</strong><p>An AI Agent, connected bot, SIP service, Teams user, or phone number.</p></article>
          <ArrowRight aria-hidden="true" />
          <article><small>PROOF</small><strong>Evidence confirms it</strong><p>Call History, transcript, logs, and SIP ladder show what happened.</p></article>
        </div>
        <p className="call-concept-note"><CircleHelp /> Academy progress appears only as Levels 1–5. This call map appears only here because it explains the product—not your position in the course.</p>
      </section>

      <section className="portal-tour">
        <div className="portal-tour-head">
          <div><span className="section-kicker">WHEN YOU OPEN LIVE HUB</span><h2>Seven landmarks—nothing more.</h2></div>
          <p>Use this map only when a mission tells you to open a specific area.</p>
        </div>
        <div className="portal-shot">
          <img src="live-hub-dashboard.png" alt="Live Hub dashboard with navigation, account, usage, Help Center, wizard, and support assistant" />
          {landmarks.map((item) => <span key={item.number} className={`portal-marker marker-${item.number}`}>{item.number}</span>)}
        </div>
        <div className="landmark-grid">
          {landmarks.map((item) => (
            <article key={item.number}>
              <span>{String(item.number).padStart(2, "0")}</span>
              <div><h3>{item.title}</h3><p>{item.detail}</p></div>
            </article>
          ))}
        </div>
      </section>

      <section className="orientation-next">
        <div><span>YOUR NEXT ACTION</span><h2>Choose one origin and complete the chain.</h2><p>AI Agent, SIP + number, or Teams + SIP → Routing → real call → evidence.</p></div>
        <Button size="lg" className="primary-cta" onClick={goToJourneys}>Choose a path <ArrowRight /></Button>
      </section>
    </div>
  );
}

function LegacyJourneysView({
  selected,
  selectedIndex,
  selectTrack,
  completed,
  toggleStep,
  onKnowledgeCheck,
}: {
  selected: Track;
  selectedIndex: number;
  selectTrack: (track: Track) => void;
  completed: string[];
  toggleStep: (key: string) => void;
  onKnowledgeCheck: () => void;
}) {
  const Icon = selected.icon;
  const [activeLessonIndex, setActiveLessonIndex] = useState<number | null>(null);
  const [celebrating, setCelebrating] = useState(false);
  const lessons = lessonsByTrack[selected.id] ?? [];
  const missionComplete = selected.steps.filter((_, index) => missionIsComplete(selected, index, completed)).length;
  const isMissionComplete = missionComplete === selected.steps.length;

  const openLesson = (index: number) => {
    setActiveLessonIndex(index);
    resetPagePosition();
  };

  const backToMission = () => {
    setActiveLessonIndex(null);
    resetPagePosition();
  };

  const finishMission = () => {
    setActiveLessonIndex(null);
    setCelebrating(true);
    resetPagePosition();
  };

  const chooseNextMission = () => {
    const nextTrack = tracks[(selectedIndex + 1) % tracks.length];
    setCelebrating(false);
    selectTrack(nextTrack);
  };

  if (celebrating) {
    return (
      <MissionCompleteView
        track={selected}
        lessonCount={lessons.length}
        nextTrack={tracks[(selectedIndex + 1) % tracks.length]}
        onReview={() => setCelebrating(false)}
        onNext={chooseNextMission}
        onKnowledgeCheck={onKnowledgeCheck}
      />
    );
  }

  if (activeLessonIndex !== null && lessons[activeLessonIndex]) {
    return (
      <LessonWorkspace
        key={`${selected.id}:${activeLessonIndex}`}
        track={selected}
        lessons={lessons}
        lessonIndex={activeLessonIndex}
        completed={completed}
        toggleStep={toggleStep}
        onBack={backToMission}
        onSelectLesson={openLesson}
        onMissionComplete={finishMission}
      />
    );
  }

  const missingIndex = selected.steps.findIndex((_, index) => !missionIsComplete(selected, index, completed));
  const firstIncomplete = missingIndex === -1 ? selected.steps.length - 1 : missingIndex;
  return (
    <div className="page journeys-page">
      <div className="journey-header">
        <div>
          <span className="section-kicker">LEARNING PATHS · OUTCOMES, NOT FEATURES</span>
          <h1>Choose the win you need.</h1>
          <p>Start with an AI Agent, your own SIP, or Microsoft Teams. Every certification path tells a real-world story and ends with evidence that the outcome works.</p>
        </div>
        <div className="journey-count"><strong>{tracks.length}</strong><span>outcome-based<br />paths</span></div>
      </div>

      <div className="routing-heart" aria-label="Every starting path meets at routing">
          <div className="routing-origins"><span><Bot /> AI Agent</span><span><Radio /> Your SIP</span><span><Network /> Teams</span></div>
        <ArrowRight />
        <div className="routing-center"><Route /><span><small>THE HEART</small><strong>Routing</strong></span></div>
        <ArrowRight />
        <div className="routing-proof"><CheckCircle2 /><span><small>FINISH</small><strong>Test + Calls evidence</strong></span></div>
      </div>

      <div className="journey-workspace">
        <div className="journey-selector" role="tablist" aria-label="Certification paths">
          {tracks.map((track, index) => {
            const TrackIcon = track.icon;
            return (
              <div key={track.id} className={index === 0 ? "journey-choice recommended-path" : "journey-choice"}>
                {index === 0 && <span className="journey-group-label">START WITH A WORKING CALL</span>}
                {index === 3 && <span className="journey-group-label secondary">FOCUSED OUTCOMES</span>}
                <Button
                  variant="ghost"
                  role="tab"
                  aria-selected={selected.id === track.id}
                  className={selected.id === track.id ? "journey-tab active" : "journey-tab"}
                  onClick={() => selectTrack(track)}
                >
                  <span className={`journey-tab-icon ${track.color}`}><TrackIcon /></span>
                  <span className="journey-tab-copy">
                    <small>{index === 0 ? "RECOMMENDED" : index < 3 ? `START 0${index + 1}` : `PATH 0${index + 1}`} · {track.time}</small>
                    <strong>{track.title}</strong>
                  </span>
                  <ChevronRight />
                </Button>
              </div>
            );
          })}
        </div>

        <section className={`mission-panel ${selected.color}`}>
          <div className="mission-panel-head">
            <div className="mission-icon"><Icon /></div>
            <div>
              <span>{selected.eyebrow}</span>
              <h2>{selected.title}</h2>
              <p>{selected.description}</p>
            </div>
          </div>
          <div className="mission-meta-row">
            <span><Clock3 /> {selected.time}</span>
            <span><Zap /> {selected.level}</span>
            <span><Award /> {selected.reward} badge</span>
          </div>
          <div className="path-story-grid">
            <article><span>YOUR SCENARIO</span><p>{selected.scenario}</p></article>
            <article><span>THE WIN</span><p>{selected.outcome}</p></article>
            <article><span>EVIDENCE REQUIRED</span><p>{selected.evidence}</p></article>
          </div>
          <div className="mission-guardrail"><Lightbulb /><span><strong>{["voice-agent", "sip-trunk", "teams-sip"].includes(selected.id) ? "Complete the story in order:" : "Keep this challenge focused:"}</strong> {["voice-agent", "sip-trunk", "teams-sip"].includes(selected.id) ? "each mission produces a prerequisite for the next. Routing comes only after the origin and destination are ready." : "prove every success criterion before you move to another channel or optional service."}</span></div>
          <div className="mission-steps">
            {selected.steps.map((step, index) => {
              const done = missionIsComplete(selected, index, completed);
              const unlocked = index === 0 || done || missionIsComplete(selected, index - 1, completed);
              return (
              <Button
                variant="ghost"
                id={`${selected.id}-step-${index}`}
                className={done ? "mission-step done" : unlocked ? "mission-step" : "mission-step locked"}
                key={step}
                disabled={!unlocked}
                onClick={() => openLesson(index)}
              >
                <span className="step-index">{done ? <Check /> : index + 1}</span>
                <div>
                  <small>{done ? "MISSION COMPLETE" : unlocked ? `OPEN MISSION ${index + 1}` : `LOCKED · FINISH MISSION ${index}`}</small>
                  <strong><em>{selected.phases[index]}</em>{step}</strong>
                </div>
                <ChevronRight />
              </Button>
            )})}
          </div>
          <div className="mission-footer">
            <div>
              <span>{isMissionComplete ? `${selected.reward.toUpperCase()} BADGE UNLOCKED` : `Certification path 0${selectedIndex + 1} · ${missionComplete}/${selected.steps.length} missions`}</span>
              <p>{isMissionComplete ? "Your evidence and progress are saved on this device." : "Complete each challenge and check every required piece of evidence."}</p>
            </div>
            <Button
              size="lg"
              className="primary-cta"
              onClick={() => isMissionComplete ? setCelebrating(true) : openLesson(firstIncomplete)}
            >
              {isMissionComplete ? "View earned badge" : missionComplete ? "Continue path" : "Start mission 1"} <ArrowRight />
            </Button>
          </div>
        </section>
      </div>
    </div>
  );
}

function JourneysView({
  selected,
  selectedIndex,
  startImmediately,
  launchTrack,
  completed,
  toggleStep,
  onKnowledgeCheck,
}: {
  selected: Track;
  selectedIndex: number;
  startImmediately: boolean;
  launchTrack: (id: string) => void;
  completed: string[];
  toggleStep: (key: string) => void;
  onKnowledgeCheck: () => void;
}) {
  const lessons = lessonsByTrack[selected.id] ?? [];
  const completedCount = lessons.filter((_, index) => missionIsComplete(selected, index, completed)).length;
  const missingIndex = lessons.findIndex((_, index) => !missionIsComplete(selected, index, completed));
  const firstIncomplete = missingIndex === -1 ? Math.max(0, lessons.length - 1) : missingIndex;
  const orderedTrackIds = successLevels.flatMap((level) => level.trackIds);
  const currentJourneyIndex = orderedTrackIds.indexOf(selected.id);
  const nextTrackId = orderedTrackIds[(currentJourneyIndex + 1 + orderedTrackIds.length) % orderedTrackIds.length];
  const nextTrack = tracks.find((track) => track.id === nextTrackId) ?? tracks[(selectedIndex + 1) % tracks.length];
  const selectedLevel = successLevels.findIndex((level) => level.trackIds.includes(selected.id));
  const [expandedLevel, setExpandedLevel] = useState(selectedLevel >= 0 ? selectedLevel : 0);
  const [focusedTrackId, setFocusedTrackId] = useState(selected.id);
  const [activeMissionIndex, setActiveMissionIndex] = useState<number | null>(startImmediately ? firstIncomplete : null);
  const [celebrating, setCelebrating] = useState(false);

  const openMission = (index: number) => {
    setActiveMissionIndex(index);
    resetPagePosition();
  };

  const startOutcome = (track: Track) => {
    if (track.id !== selected.id) {
      launchTrack(track.id);
      return;
    }
    const trackLessons = lessonsByTrack[track.id] ?? [];
    const missing = trackLessons.findIndex((_, index) => !missionIsComplete(track, index, completed));
    openMission(missing === -1 ? Math.max(0, trackLessons.length - 1) : missing);
  };

  const finishPath = () => {
    setActiveMissionIndex(null);
    setCelebrating(true);
    resetPagePosition();
  };

  if (celebrating) {
    return (
      <MissionCompleteView
        track={selected}
        lessonCount={lessons.length}
        nextTrack={nextTrack}
        onReview={() => setCelebrating(false)}
        onNext={() => launchTrack(nextTrack.id)}
        onKnowledgeCheck={onKnowledgeCheck}
      />
    );
  }

  if (activeMissionIndex !== null && lessons[activeMissionIndex]) {
    if (selected.id === "routing") {
      return (
        <RoutingVisualWorkspace
          key={`${selected.id}:${activeMissionIndex}`}
          track={selected}
          lessons={lessons}
          lessonIndex={activeMissionIndex}
          completed={completed}
          toggleStep={toggleStep}
          onBack={() => { setActiveMissionIndex(null); resetPagePosition(); }}
          onSelectLesson={openMission}
          onMissionComplete={finishPath}
        />
      );
    }
    return (
      <LessonWorkspace
        key={`${selected.id}:${activeMissionIndex}`}
        track={selected}
        lessons={lessons}
        lessonIndex={activeMissionIndex}
        completed={completed}
        toggleStep={toggleStep}
        onBack={() => { setActiveMissionIndex(null); resetPagePosition(); }}
        onSelectLesson={openMission}
        onMissionComplete={finishPath}
      />
    );
  }

  const activeLevel = successLevels[expandedLevel];
  const activeTracks = activeLevel.trackIds
    .map((id) => tracks.find((track) => track.id === id))
    .filter((track): track is Track => Boolean(track));
  const focusedTrack = activeTracks.find((track) => track.id === focusedTrackId) ?? activeTracks[0];
  const focusedCompleted = focusedTrack
    ? focusedTrack.steps.filter((_, index) => missionIsComplete(focusedTrack, index, completed)).length
    : 0;
  const focusedPercentage = focusedTrack?.steps.length
    ? Math.round((focusedCompleted / focusedTrack.steps.length) * 100)
    : 0;

  return (
    <div className="page success-roadmap-page">
      <header className="success-roadmap-head">
        <div>
          <span className="section-kicker"><Zap /> LIVE HUB SUCCESS PATH · ALIGNED TO 2.19.2</span>
          <h1>From zero to a working<br /><span>Voice AI deployment.</span></h1>
          <p>Choose one working result. The Academy reveals the next decision only when it matters—even though every Live Hub subject is now covered.</p>
        </div>
        <aside>
          <span>YOUR FASTEST FIRST WIN</span>
          <strong>A real caller reaches an AI</strong>
          <small>About 35 minutes, plus number provisioning</small>
          <Button onClick={() => startOutcome(tracks.find((track) => track.id === "voice-agent")!)}>Build the first call <ArrowRight /></Button>
        </aside>
      </header>

      <section className="success-levels">
        <div className="level-rail" role="tablist" aria-label="Go-live levels">
          <div className="level-rail-title"><span>GO-LIVE JOURNEY</span><strong>Start where you are.</strong></div>
          {successLevels.map((level, index) => {
            const levelTracks = level.trackIds.map((id) => tracks.find((track) => track.id === id)).filter((track): track is Track => Boolean(track));
            const done = levelTracks.some((track) => track.steps.every((_, stepIndex) => missionIsComplete(track, stepIndex, completed)));
            return (
              <Button key={level.number} variant="ghost" role="tab" aria-selected={expandedLevel === index} className={expandedLevel === index ? "level-button active" : "level-button"} onClick={() => { setExpandedLevel(index); setFocusedTrackId(level.trackIds[0]); }}>
                <span className={done ? "level-number done" : "level-number"}>{done ? <Check /> : level.number}</span>
                <span><small>{done ? "OUTCOME ACHIEVED" : `LEVEL ${level.number}`}</small><strong>{level.title}</strong></span>
                <ChevronRight />
              </Button>
            );
          })}
        </div>

        <div className="level-focus" role="tabpanel">
          <div className="level-focus-head">
            <span>LEVEL {activeLevel.number} OF {successLevels.length}</span>
            <h2>{activeLevel.title}</h2>
            <p>{activeLevel.promise}</p>
          </div>
          <div className="level-question"><CircleHelp /><span><small>THE ONLY QUESTION FOR THIS LEVEL</small><strong>{activeLevel.question}</strong></span></div>

          {activeTracks.length > 1 && (
            <div className="level-course-picker" aria-label={`Choose an outcome in ${activeLevel.title}`}>
              <div className="level-choice-explanation">
                <span>CHOOSE YOUR ROUTE THROUGH THIS LEVEL</span>
                <p>{activeLevel.choiceNote}</p>
              </div>
              <div>
                {activeTracks.map((track) => (
                  <Button key={track.id} variant="outline" className={focusedTrack?.id === track.id ? "active" : ""} onClick={() => setFocusedTrackId(track.id)}>{track.title}</Button>
                ))}
              </div>
            </div>
          )}

          {focusedTrack && (() => {
            const Icon = focusedTrack.icon;
            return (
              <article className="level-outcome-focus">
                <header className="level-outcome-head">
                  <span className={`level-path-icon ${focusedTrack.color}`}><Icon /></span>
                  <div className="level-outcome-title">
                    <small>{activeLevel.number === 1 && focusedTrack.id === "voice-agent" ? "RECOMMENDED START" : "SELECTED OUTCOME"}</small>
                    <h3>{focusedTrack.title}</h3>
                    <p>{focusedTrack.outcome}</p>
                  </div>
                  <div className="level-outcome-progress" aria-label={`${focusedTrack.title} ${focusedPercentage}% complete`}>
                    <strong>{focusedPercentage}%</strong>
                    <small>COMPLETE</small>
                    <Progress value={focusedPercentage} />
                  </div>
                </header>
                <div className="level-outcome-brief">
                  <div><span>WHY THIS ROUTE</span><p>{focusedTrack.scenario}</p></div>
                  <div><span>YOU ARE DONE WHEN</span><p>{focusedTrack.evidence}</p></div>
                </div>
                <footer className="level-path-action">
                  <span><Clock3 /> {focusedTrack.time} · {focusedTrack.steps.length} focused missions</span>
                  <Button onClick={() => startOutcome(focusedTrack)}>{focusedCompleted ? "Continue this outcome" : "Start this outcome"} <ArrowRight /></Button>
                </footer>
              </article>
            );
          })()}

          <footer className="level-focus-footer">
            <Lightbulb />
            <p>Technical background, optional settings, and edge cases stay in <strong>Expert Reference</strong> until a mission needs them.</p>
          </footer>
        </div>
      </section>
    </div>
  );
}

function MissionCompleteView({
  track,
  lessonCount,
  nextTrack,
  onReview,
  onNext,
  onKnowledgeCheck,
}: {
  track: Track;
  lessonCount: number;
  nextTrack: Track;
  onReview: () => void;
  onNext: () => void;
  onKnowledgeCheck: () => void;
}) {
  return (
    <div className="page mission-complete-page">
      <section className="mission-complete-card">
        <div className="mission-complete-art" aria-hidden="true">
          <img src="livehub-brand-wave.webp" alt="" />
        </div>
        <div className="mission-complete-copy">
          <span className="completion-kicker"><Award /> WORKING OUTCOME ACHIEVED</span>
          <h1>You made it<br />work.</h1>
          <p>
            <strong>{track.outcome}</strong> You did not just read about Live Hub—you produced and verified a real result.
          </p>
          <div className="completion-proof">
            <span><CheckCircle2 /><strong>{lessonCount}/{lessonCount}</strong><small>missions completed</small></span>
            <span><Zap /><strong>1</strong><small>working outcome</small></span>
            <span><Activity /><strong>✓</strong><small>evidence verified</small></span>
          </div>
          <div className="completion-actions">
            <Button size="lg" onClick={onNext}>Continue toward production <ArrowRight /></Button>
            <Button size="lg" variant="outline" onClick={onKnowledgeCheck}>Optional knowledge checkpoint</Button>
            <Button variant="ghost" onClick={onReview}>Review this path</Button>
          </div>
          <small className="completion-saved"><Check /> Progress and evidence saved on this device · Next: {nextTrack.title}</small>
        </div>
      </section>
    </div>
  );
}

type RoutingScenario = "number" | "sip";

type RoutingScreen = {
  src: string;
  alt: string;
  caption: string;
  hotspot: { left: number; top: number; width: number; height: number };
};

const routingScreens: RoutingScreen[][] = [
  [
    { src: "routing-rules-list.png", alt: "Live Hub Routing rules list", caption: "Start by locating the real source and destination already available in this account.", hotspot: { left: 4, top: 21, width: 91, height: 26 } },
    { src: "routing-rule-builder.png", alt: "Live Hub routing rule type and origin fields", caption: "A normal incoming customer call starts with Type: Call. Transfer is only for a call already in progress.", hotspot: { left: 5, top: 5, width: 47, height: 13 } },
    { src: "routing-rule-builder.png", alt: "Live Hub routing condition fields", caption: "Use one exact calling or called number for the first controlled test.", hotspot: { left: 5, top: 22, width: 47, height: 17 } },
    { src: "routing-rule-builder.png", alt: "Live Hub Route To destination field", caption: "Route To is the service that must handle the call: an AI Agent, bot connection, SIP connection, or number.", hotspot: { left: 5, top: 40, width: 47, height: 15 } },
  ],
  [
    { src: "routing-rules-list.png", alt: "Live Hub Add new routing rule button", caption: "Open Routing and select Add new routing rule.", hotspot: { left: 78, top: 3, width: 18, height: 10 } },
    { src: "routing-rule-builder.png", alt: "Live Hub Region field in routing rule", caption: "The origin, destination, and rule must use the same Live Hub region.", hotspot: { left: 58, top: 5, width: 36, height: 13 } },
    { src: "routing-rule-builder.png", alt: "Live Hub Origin configuration", caption: "Select Type: Call, then choose the exact channel where the customer call enters Live Hub.", hotspot: { left: 5, top: 5, width: 89, height: 33 } },
    { src: "routing-rule-builder.png", alt: "Live Hub Route To configuration", caption: "Choose one destination. Keep optional services off until this baseline call works.", hotspot: { left: 5, top: 40, width: 47, height: 15 } },
    { src: "routing-rule-summary.png", alt: "Expanded saved Live Hub routing rule", caption: "After Create, expand the new top rule and read it back from origin to destination.", hotspot: { left: 2, top: 7, width: 96, height: 83 } },
  ],
  [
    { src: "routing-rule-summary.png", alt: "Saved routing rule ready for a test call", caption: "Place one call using the exact numbers and direction defined in this rule.", hotspot: { left: 2, top: 7, width: 96, height: 83 } },
    { src: "call-history-proof.png", alt: "Live Hub Call History showing successful calls", caption: "The intended AI Agent, bot, SIP connection, or person must actually receive the call.", hotspot: { left: 2, top: 19, width: 96, height: 39 } },
    { src: "call-history-proof.png", alt: "Live Hub Call History completion and routing evidence", caption: "Open the newest call and confirm its completion, participants, and matched routing information.", hotspot: { left: 2, top: 19, width: 96, height: 39 } },
    { src: "call-history-proof.png", alt: "Live Hub successful call evidence", caption: "Save the successful Call ID before changing the route. It is your known-good baseline.", hotspot: { left: 2, top: 19, width: 96, height: 12 } },
  ],
  [
    { src: "routing-rule-services.png", alt: "Optional services in a Live Hub routing rule", caption: "Choose only the production capability the call actually needs.", hotspot: { left: 1, top: 1, width: 98, height: 97 } },
    { src: "routing-rule-services.png", alt: "Live Hub recording, Agent Assist, and translation options", caption: "Confirm the feature prerequisite before turning it on. Agent Assist and translation cannot be combined on the same rule.", hotspot: { left: 1, top: 1, width: 98, height: 97 } },
    { src: "routing-rule-numbers.png", alt: "Live Hub routing number customization fields", caption: "Customize numbers only when the destination requires a different calling, called, or service number.", hotspot: { left: 1, top: 1, width: 98, height: 97 } },
    { src: "routing-rule-summary.png", alt: "Live Hub route ready for repeat testing", caption: "Repeat the same caller, called number, and expected answer so the new option is the only variable.", hotspot: { left: 2, top: 7, width: 96, height: 83 } },
    { src: "call-history-proof.png", alt: "Live Hub Call History used to compare a baseline and changed call", caption: "Compare the new call with the saved baseline. The call should still complete and the new evidence should appear.", hotspot: { left: 2, top: 19, width: 96, height: 39 } },
  ],
];

const routingScenarioDetails: Record<RoutingScenario, { label: string; short: string; videoId: string; videoTitle: string }> = {
  number: {
    label: "Live Hub number → AI Agent",
    short: "Recommended first route",
    videoId: "S3VdrZ5FadQ",
    videoTitle: "Inbound Calls to a Bot Using a Live Hub Number",
  },
  sip: {
    label: "External SIP → AI Agent",
    short: "Use when your provider owns the number",
    videoId: "mWC5wFb6hoQ",
    videoTitle: "Inbound Calls to a Bot Using External SIP Provider",
  },
};

function RoutingVisualWorkspace({
  track,
  lessons,
  lessonIndex,
  completed,
  toggleStep,
  onBack,
  onSelectLesson,
  onMissionComplete,
}: {
  track: Track;
  lessons: Lesson[];
  lessonIndex: number;
  completed: string[];
  toggleStep: (key: string) => void;
  onBack: () => void;
  onSelectLesson: (index: number) => void;
  onMissionComplete: () => void;
}) {
  const lesson = lessons[lessonIndex];
  const done = missionIsComplete(track, lessonIndex, completed);
  const lessonKey = missionProgressKey(track, lessonIndex);
  const [scenario, setScenario] = useState<RoutingScenario>("number");
  const [actionIndex, setActionIndex] = useState(done ? Math.max(0, lesson.actions.length - 1) : 0);
  const [furthestActionIndex, setFurthestActionIndex] = useState(done ? Math.max(0, lesson.actions.length - 1) : 0);
  const [verifiedCriteria, setVerifiedCriteria] = useState<number[]>(done ? lesson.success.map((_, index) => index) : []);
  const [evidenceNote, setEvidenceNote] = useState("");
  const [showVideo, setShowVideo] = useState(false);
  const [speaking, setSpeaking] = useState(false);
  const challengeReady = done || furthestActionIndex === Math.max(0, lesson.actions.length - 1);
  const allEvidenceVerified = verifiedCriteria.length === lesson.success.length;
  const activeAction = lesson.actions[actionIndex];
  const screen = routingScreens[lessonIndex]?.[actionIndex] ?? routingScreens[0][0];
  const scenarioDetails = routingScenarioDetails[scenario];
  const coachingScript = [
    `Here is the outcome: ${track.outcome}`,
    `Right now, ${activeAction.title.toLowerCase()}.`,
    activeAction.instruction,
    `Success looks like this: ${lesson.success[0]}.`,
    lesson.commonMistake ? `Watch for this: ${lesson.commonMistake}` : "Keep the first route exact and change one thing at a time.",
  ].join(" ");

  useEffect(() => {
    return () => {
      if (typeof window !== "undefined" && "speechSynthesis" in window) window.speechSynthesis.cancel();
    };
  }, [lesson.id]);

  const toggleCoach = () => {
    if (!("speechSynthesis" in window)) return;
    if (speaking) {
      window.speechSynthesis.cancel();
      setSpeaking(false);
      return;
    }
    window.speechSynthesis.cancel();
    const utterance = new SpeechSynthesisUtterance(coachingScript);
    utterance.rate = 0.94;
    utterance.onend = () => setSpeaking(false);
    utterance.onerror = () => setSpeaking(false);
    window.speechSynthesis.speak(utterance);
    setSpeaking(true);
  };

  const goNextAction = () => {
    const next = Math.min(lesson.actions.length - 1, actionIndex + 1);
    setActionIndex(next);
    setFurthestActionIndex((current) => Math.max(current, next));
    setShowVideo(false);
  };

  const toggleEvidence = (index: number) => {
    if (!challengeReady) return;
    setVerifiedCriteria((current) => current.includes(index)
      ? current.filter((item) => item !== index)
      : [...current, index]);
  };

  const completeAndContinue = () => {
    if (!done && !allEvidenceVerified) return;
    if (!done) toggleStep(lessonKey);
    if (lessonIndex < lessons.length - 1) onSelectLesson(lessonIndex + 1);
    else onMissionComplete();
  };

  return (
    <div className="page routing-lab-page">
      <header className="routing-lab-top">
        <Button variant="ghost" onClick={onBack}><ArrowLeft /> Back to the go-live journey</Button>
        <div>
          <span>GOLD-STANDARD GUIDED JOURNEY · LIVE HUB 2.19.2</span>
          <h1>Route a Real Customer Call</h1>
          <p>A working route—not a routing lesson—is the finish line.</p>
        </div>
      </header>

      <div className="routing-lab-layout">
        <aside className="routing-level-rail" aria-label="Five-level go-live journey">
          <div className="routing-rail-head"><span>GO-LIVE JOURNEY</span><strong>You are here.</strong></div>
          {successLevels.map((level) => {
            const active = level.number === 3;
            return (
              <section key={level.number} className={active ? "routing-level active" : "routing-level"}>
                <div className="routing-level-label">
                  <span>{level.number}</span>
                  <div><small>LEVEL {level.number}</small><strong>{level.title}</strong></div>
                </div>
                {active && (
                  <div className="routing-mission-list">
                    {lessons.map((item, index) => {
                      const itemDone = missionIsComplete(track, index, completed);
                      const unlocked = index === 0 || itemDone || missionIsComplete(track, index - 1, completed);
                      return (
                        <button key={item.id} type="button" disabled={!unlocked} className={index === lessonIndex ? "active" : itemDone ? "done" : ""} onClick={() => onSelectLesson(index)}>
                          <span>{itemDone ? <Check /> : index + 1}</span>
                          <strong>{item.title}</strong>
                        </button>
                      );
                    })}
                  </div>
                )}
              </section>
            );
          })}
          <div className="routing-rail-reward"><Award /><span><small>WORKING OUTCOME</small><strong>{track.reward} badge</strong></span></div>
        </aside>

        <main className="routing-lab-main">
          <header className="routing-mission-head">
            <div>
              <span>MISSION {lessonIndex + 1} OF {lessons.length} · {lesson.duration}</span>
              <h2>{lesson.title}</h2>
              <p>{lesson.objective}</p>
            </div>
            <section><CheckCircle2 /><span><small>DONE WHEN</small><strong>{lesson.success[0]}</strong></span></section>
          </header>

          <section className="routing-scenario-choice">
            <div><span>YOUR CALL TODAY</span><p>Choose the origin you are routing. This changes the example and the exact video—not your progress.</p></div>
            <div role="group" aria-label="Choose routing scenario">
              {(Object.keys(routingScenarioDetails) as RoutingScenario[]).map((key) => (
                <Button key={key} variant="outline" className={scenario === key ? "active" : ""} onClick={() => { setScenario(key); setShowVideo(false); }}>
                  <span><strong>{routingScenarioDetails[key].label}</strong><small>{routingScenarioDetails[key].short}</small></span>
                </Button>
              ))}
            </div>
          </section>

          <section className="routing-product-stage">
            <div className="routing-screen-shell">
              <div className="routing-screen-bar"><span /><span /><span /><strong>{showVideo ? "OFFICIAL WALKTHROUGH" : "LIVE HUB · REAL PRODUCT SCREEN"}</strong></div>
              {showVideo ? (
                <div className="routing-context-video">
                  <iframe
                    src={`https://www.youtube-nocookie.com/embed/${scenarioDetails.videoId}?rel=0`}
                    title={scenarioDetails.videoTitle}
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                    allowFullScreen
                  />
                </div>
              ) : (
                <figure className="routing-screen">
                  <img src={screen.src} alt={screen.alt} />
                  <span className="routing-hotspot" style={{ left: `${screen.hotspot.left}%`, top: `${screen.hotspot.top}%`, width: `${screen.hotspot.width}%`, height: `${screen.hotspot.height}%` }}><i>LOOK HERE</i></span>
                  <figcaption>{screen.caption}</figcaption>
                </figure>
              )}
            </div>

            <aside className="routing-coach-card">
              <div className="routing-coach-status"><Bot /><span><small>ACADEMY COACH</small><strong>{showVideo ? "Watch this exact call path" : "Do this now"}</strong></span></div>
              {showVideo ? (
                <>
                  <h3>{scenarioDetails.videoTitle}</h3>
                  <p>Use this walkthrough at the moment you build the route. Return to the live screen when you are ready to perform the action yourself.</p>
                  <Button variant="outline" onClick={() => setShowVideo(false)}><ArrowLeft /> Return to the live screen</Button>
                </>
              ) : (
                <>
                  <h3>{activeAction.title}</h3>
                  <p>{activeAction.instruction}</p>
                  {activeAction.note && <div className="routing-coach-note"><Lightbulb /> {activeAction.note}</div>}
                  {lessonIndex === 1 && (
                    <button type="button" className="routing-video-invite" onClick={() => setShowVideo(true)}>
                      <span><Play /></span><span><small>WATCH AT THIS STEP</small><strong>{scenarioDetails.videoTitle}</strong></span><ChevronRight />
                    </button>
                  )}
                  <div className="routing-coach-actions">
                    <Button variant="ghost" onClick={toggleCoach}>{speaking ? <Square /> : <Volume2 />}{speaking ? "Stop coach" : "Play 60-sec coach"}</Button>
                    <Button asChild variant="ghost"><a href={lesson.docUrl} target="_blank" rel="noreferrer">Expert reference <ExternalLink /></a></Button>
                  </div>
                </>
              )}
              {!showVideo && (
                <div className="routing-action-controls">
                  <Button variant="outline" disabled={actionIndex === 0} onClick={() => setActionIndex((current) => Math.max(0, current - 1))}><ArrowLeft /> Previous</Button>
                  {actionIndex < lesson.actions.length - 1 ? (
                    <Button onClick={goNextAction}>Done · show my next move <ArrowRight /></Button>
                  ) : (
                    <Button onClick={() => document.querySelector(".routing-proof")?.scrollIntoView({ behavior: "smooth", block: "start" })}>I did it · prove the result <CheckCircle2 /></Button>
                  )}
                </div>
              )}
              {lesson.commonMistake && <details className="routing-warning"><summary><AlertTriangle /> Before you continue</summary><p>{lesson.commonMistake}</p></details>}
            </aside>
          </section>

          <section className={challengeReady ? "routing-proof" : "routing-proof locked"}>
            <div className="routing-proof-copy">
              <span>SUCCESS CHECK</span>
              <h3>Show the result—not the reading.</h3>
              <p>{challengeReady ? "Confirm only what you can see in Live Hub. The mission completes when every required result is real." : "Finish the current screen walkthrough to unlock the evidence check."}</p>
              <div className="routing-proof-list">
                {lesson.success.map((item, index) => {
                  const checked = verifiedCriteria.includes(index);
                  return (
                    <label key={item} className={checked ? "checked" : ""}>
                      <Checkbox checked={checked} disabled={!challengeReady} onCheckedChange={() => toggleEvidence(index)} />
                      <strong>{item}</strong>
                    </label>
                  );
                })}
              </div>
              <label className="routing-evidence-note" htmlFor={`routing-evidence-${lesson.id}`}><span>Call ID or evidence note <small>optional</small></span><Input id={`routing-evidence-${lesson.id}`} value={evidenceNote} onChange={(event) => setEvidenceNote(event.target.value)} placeholder="Example: Call ID 8f2… / screenshot saved" disabled={!challengeReady} /></label>
              <Button size="lg" disabled={!done && !allEvidenceVerified} onClick={completeAndContinue}>
                {lessonIndex === lessons.length - 1 ? "Confirm the working route" : done ? "Continue to the next mission" : "Complete mission & continue"}<ArrowRight />
              </Button>
            </div>
            <figure>
              <div><span /> PROOF LIVES IN LIVE HUB</div>
              <img src={lessonIndex >= 2 ? "call-history-proof.png" : "routing-rule-summary.png"} alt={lessonIndex >= 2 ? "Live Hub Call History evidence" : "Expanded Live Hub routing rule evidence"} />
              <figcaption>{lessonIndex >= 2 ? "A successful call record is the proof that your route works." : "An expanded saved rule lets you verify the exact origin, condition, and destination."}</figcaption>
            </figure>
          </section>
        </main>
      </div>
    </div>
  );
}

function LessonWorkspace({
  track,
  lessons,
  lessonIndex,
  completed,
  toggleStep,
  onBack,
  onSelectLesson,
  onMissionComplete,
}: {
  track: Track;
  lessons: Lesson[];
  lessonIndex: number;
  completed: string[];
  toggleStep: (key: string) => void;
  onBack: () => void;
  onSelectLesson: (index: number) => void;
  onMissionComplete: () => void;
}) {
  const lesson = lessons[lessonIndex];
  const lessonKey = missionProgressKey(track, lessonIndex);
  const done = missionIsComplete(track, lessonIndex, completed);
  const completedInTrack = lessons.filter((_, index) => missionIsComplete(track, index, completed)).length;
  const currentLevel = successLevels.find((level) => level.trackIds.includes(track.id)) ?? successLevels[0];
  const trackPercentage = lessons.length ? Math.round((completedInTrack / lessons.length) * 100) : 0;
  const [speaking, setSpeaking] = useState(false);
  const [verifiedCriteria, setVerifiedCriteria] = useState<number[]>(done ? lesson.success.map((_, index) => index) : []);
  const [evidenceNote, setEvidenceNote] = useState("");
  const [actionIndex, setActionIndex] = useState(done ? Math.max(0, lesson.actions.length - 1) : 0);
  const [furthestActionIndex, setFurthestActionIndex] = useState(done ? Math.max(0, lesson.actions.length - 1) : 0);
  const challengeReady = done || furthestActionIndex === Math.max(0, lesson.actions.length - 1);
  const allEvidenceVerified = verifiedCriteria.length === lesson.success.length;

  useEffect(() => {
    return () => {
      if (typeof window !== "undefined" && "speechSynthesis" in window) {
        window.speechSynthesis.cancel();
      }
    };
  }, [lesson.id]);

  const coachingScript = [
    `Here’s your mission: ${lesson.title}.`,
    track.scenario,
    `Why it matters: ${track.outcome}`,
    `Begin with ${lesson.actions.slice(0, 2).map((action) => action.title.toLowerCase()).join(", then ")}.`,
    `Your checkpoint is simple: ${lesson.success.slice(0, 2).join(" And ")}.`,
    lesson.commonMistake ? `One warning: ${lesson.commonMistake}` : "Change one thing at a time, then verify the result.",
    "When you can see the evidence, check it off here and move to the next challenge.",
  ].join(" ");

  const toggleListening = () => {
    if (!("speechSynthesis" in window)) return;
    if (speaking) {
      window.speechSynthesis.cancel();
      setSpeaking(false);
      return;
    }
    window.speechSynthesis.cancel();
    const utterance = new SpeechSynthesisUtterance(coachingScript);
    utterance.rate = 0.94;
    utterance.pitch = 1;
    utterance.onend = () => setSpeaking(false);
    utterance.onerror = () => setSpeaking(false);
    window.speechSynthesis.speak(utterance);
    setSpeaking(true);
  };

  const completeAndContinue = () => {
    if (!done && !allEvidenceVerified) return;
    if (!done) toggleStep(lessonKey);
    if (lessonIndex < lessons.length - 1) onSelectLesson(lessonIndex + 1);
    else onMissionComplete();
  };

  const toggleEvidence = (index: number) => {
    if (!challengeReady) return;
    setVerifiedCriteria((current) => current.includes(index)
      ? current.filter((item) => item !== index)
      : [...current, index]);
  };

  const activeAction = lesson.actions[actionIndex];

  return (
    <div className="page lesson-page">
      <div className="lesson-topline">
        <Button variant="ghost" className="lesson-back" onClick={onBack}>
          <ArrowLeft /> Back to go-live journey
        </Button>
        <div className="lesson-location">
          <span>LEVEL {currentLevel.number} OF {successLevels.length}</span>
          <strong>{track.title}</strong>
          <small>{trackPercentage}% complete · {completedInTrack} of {lessons.length} missions verified</small>
          <Progress value={trackPercentage} aria-label={`${track.title} ${trackPercentage}% complete`} />
        </div>
      </div>

      <div className="lesson-layout">
        <aside className="lesson-outline">
          <div className="lesson-outline-head">
            <span>LEVEL {currentLevel.number} · {currentLevel.title}</span>
            <h2>Mission list</h2>
            <p>{track.time} · finish these in order</p>
          </div>
          <div className="lesson-outline-list">
            {lessons.map((item, index) => {
              const itemDone = missionIsComplete(track, index, completed);
              const itemUnlocked = index === 0 || itemDone || missionIsComplete(track, index - 1, completed);
              return (
                <Button
                  key={item.id}
                  variant="ghost"
                  className={index === lessonIndex ? "outline-lesson active" : itemUnlocked ? "outline-lesson" : "outline-lesson locked"}
                  disabled={!itemUnlocked}
                  onClick={() => onSelectLesson(index)}
                >
                  <span className={itemDone ? "outline-number done" : "outline-number"}>
                    {itemDone ? <Check /> : index + 1}
                  </span>
                  <span className="outline-copy">
                    <small>{item.duration}</small>
                    <strong>{item.title}</strong>
                  </span>
                </Button>
              );
            })}
          </div>
          <div className="outline-tip">
            <Lightbulb />
            <p>Do the work in Live Hub. The next mission unlocks only after you confirm the evidence.</p>
          </div>
        </aside>

        <article className="lesson-content">
          <header className="lesson-header">
            <div className="lesson-header-meta">
              <span>CURRENT MISSION</span>
              <span><Clock3 /> {lesson.duration}</span>
            </div>
            <h1>{lesson.title}</h1>
            <section className="mission-success-target" aria-label="Success target for this mission">
              <CheckCircle2 />
              <div><span>SUCCESS LOOKS LIKE</span><strong>{lesson.success[0]}</strong></div>
            </section>
            <p className="mission-objective">{lesson.objective}</p>
            <div className="lesson-header-actions">
              <Button variant="outline" onClick={toggleListening} className={speaking ? "listen-button active" : "listen-button"}>
                {speaking ? <Square /> : <Volume2 />}
                {speaking ? "Stop coach" : "Coach me · under 90 sec"}
              </Button>
              <Button asChild variant="ghost" className="official-guide-button">
                <a href={lesson.docUrl} target="_blank" rel="noreferrer">Expert reference <ExternalLink /></a>
              </Button>
            </div>
            <details className="coach-transcript">
              <summary>Read the coaching summary</summary>
              <p>{coachingScript}</p>
            </details>
          </header>

          <section className="mission-story">
            <div><span>THE STORY</span><p>{track.scenario}</p></div>
            <div><span>WHAT YOU WILL HAVE</span><strong>{track.outcome}</strong></div>
          </section>

          <section className="click-path" aria-label="Live Hub navigation path">
            <span>GO HERE</span>
            <div>
              {lesson.path.map((part, index) => (
                <span key={part}>{part}{index < lesson.path.length - 1 && <ChevronRight />}</span>
              ))}
            </div>
          </section>

          {lesson.decision && (
            <section className="lesson-decision" aria-label="Choose the correct setup path">
              <div className="lesson-decision-head">
                <span>CHOOSE ONE PATH FIRST</span>
                <h2>{lesson.decision.question}</h2>
              </div>
              <div className="decision-grid">
                {lesson.decision.options.map((option, index) => (
                  <article key={option.title}>
                    <span>{String(index + 1).padStart(2, "0")}</span>
                    <h3>{option.title}</h3>
                    <p>{option.chooseWhen}</p>
                    <div><ArrowRight /><strong>{option.next}</strong></div>
                  </article>
                ))}
              </div>
            </section>
          )}

          <details className="mission-prep">
            <summary><ListChecks /><span><strong>Before you start</strong><small>{lesson.before.length} things to have ready</small></span><ChevronRight /></summary>
            <div className="before-grid">
              {lesson.before.map((item) => <div key={item}><Check /> {item}</div>)}
            </div>
            {lesson.skipForNow && (
              <div className="skip-for-now">
                <Lightbulb />
                <div><strong>Ignore these for now</strong><p>{lesson.skipForNow.join(" · ")}</p></div>
              </div>
            )}
          </details>

          <section className="lesson-section actions-section challenge-stage">
            <div className="lesson-section-title">
              <Play />
              <div><span>DO NOW · HANDS-ON</span><h2>One action at a time</h2></div>
            </div>
            <div className="action-stepper" aria-label={`Action ${actionIndex + 1} of ${lesson.actions.length}`}>
              {lesson.actions.map((_, index) => (
                <Button key={index} variant="ghost" className={index === actionIndex ? "active" : index < furthestActionIndex ? "passed" : ""} disabled={index > furthestActionIndex} onClick={() => setActionIndex(index)} aria-label={`Show action ${index + 1}`}>
                  {index < furthestActionIndex ? <Check /> : index + 1}
                </Button>
              ))}
            </div>
            {activeAction && (
              <article className="single-action">
                <span className="action-number">{String(actionIndex + 1).padStart(2, "0")}</span>
                <div className="action-copy">
                  <small>ACTION {actionIndex + 1} OF {lesson.actions.length}</small>
                  <h3>{activeAction.title}</h3>
                  <p>{activeAction.instruction}</p>
                  {activeAction.note && <div className="action-note"><Lightbulb /> {activeAction.note}</div>}
                </div>
              </article>
            )}
            <div className="challenge-controls">
              <Button variant="outline" disabled={actionIndex === 0} onClick={() => setActionIndex((current) => Math.max(0, current - 1))}><ArrowLeft /> Previous</Button>
              {actionIndex < lesson.actions.length - 1 ? (
                <Button onClick={() => {
                  const next = Math.min(lesson.actions.length - 1, actionIndex + 1);
                  setActionIndex(next);
                  setFurthestActionIndex((current) => Math.max(current, next));
                }}>I did this · next action <ArrowRight /></Button>
              ) : (
                <Button onClick={() => document.querySelector(".evidence-section")?.scrollIntoView({ behavior: "smooth", block: "start" })}>Open the success check <CheckCircle2 /></Button>
              )}
            </div>
            {lesson.commonMistake && (
              <div className="common-mistake"><AlertTriangle /><div><strong>Common mistake</strong><p>{lesson.commonMistake}</p></div></div>
            )}
          </section>

          {(lesson.image || lesson.videoId) && (
            <details className="lesson-support-details">
              <summary><Play /><span><strong>Need visual help?</strong><small>Open the official screen or video for this exact mission.</small></span><ChevronRight /></summary>
              <section className="lesson-media-grid">
                {lesson.image && (
                  <figure className="lesson-visual">
                    <div className="visual-label"><span /> OFFICIAL LIVE HUB SCREEN</div>
                    <img src={lesson.image} alt={lesson.imageAlt ?? "Live Hub screen for this mission"} loading="lazy" />
                    <figcaption>Use the mission labels; the portal may evolve slightly between releases.</figcaption>
                  </figure>
                )}
                {lesson.videoId && (
                  <figure className="lesson-video">
                    <div className="visual-label"><Play /> WATCH THE GUIDE</div>
                    <div className="video-frame">
                      <iframe
                        src={`https://www.youtube-nocookie.com/embed/${lesson.videoId}?rel=0`}
                        title={lesson.videoTitle ?? lesson.title}
                        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                        allowFullScreen
                      />
                    </div>
                    <figcaption>{lesson.videoTitle}</figcaption>
                  </figure>
                )}
              </section>
            </details>
          )}

          <section className={challengeReady ? "lesson-section evidence-section" : "lesson-section evidence-section locked"}>
            <div className="lesson-section-title">
              <CircleCheckBig />
              <div><span>VERIFY · EVIDENCE CHECKPOINT</span><h2>Prove the mission worked</h2></div>
            </div>
            <p className="evidence-intro">{challengeReady ? "Check only what you can see in Live Hub. Every criterion is required before this mission is complete." : "Finish the hands-on actions above. Your success check unlocks on the final action."}</p>
            <div className="evidence-checklist">
              {lesson.success.map((item, index) => {
                const checked = verifiedCriteria.includes(index);
                return (
                  <label key={item} className={checked ? "evidence-item checked" : "evidence-item"}>
                    <Checkbox checked={checked} disabled={!challengeReady} onCheckedChange={() => toggleEvidence(index)} aria-label={item} />
                    <span><small>EVIDENCE {String(index + 1).padStart(2, "0")}</small><strong>{item}</strong></span>
                  </label>
                );
              })}
            </div>
            <div className="evidence-note">
              <label htmlFor={`evidence-${lesson.id}`}>Evidence note <span>optional</span></label>
              <Input id={`evidence-${lesson.id}`} value={evidenceNote} onChange={(event) => setEvidenceNote(event.target.value)} placeholder="Call ID, screenshot filename, or short result note" />
              <small>Keep sensitive data and credentials out of this field. This note is temporary and is not submitted.</small>
            </div>
            <div className={allEvidenceVerified ? "evidence-status ready" : "evidence-status"}>
              {allEvidenceVerified ? <CheckCircle2 /> : challengeReady ? <CircleHelp /> : <LockKeyhole />}
              <span><strong>{allEvidenceVerified ? "Success proved" : challengeReady ? `${verifiedCriteria.length} of ${lesson.success.length} verified` : "Success check locked"}</strong><small>{allEvidenceVerified ? "You can complete this mission." : challengeReady ? "Confirm only the result you can see." : `Complete action ${lesson.actions.length} to unlock it.`}</small></span>
            </div>
          </section>

          <details className="lesson-troubleshooting-details">
            <summary><AlertTriangle /><span><strong>Troubleshoot this mission</strong><small>Open only after you have tried the challenge once.</small></span><ChevronRight /></summary>
            <div className="troubleshooting-list">
              {lesson.troubleshooting.map((item) => (
                <div className="troubleshooting-item" key={item.problem}>
                  <strong>{item.problem}</strong>
                  <p>{item.fix}</p>
                </div>
              ))}
            </div>
          </details>

          <section className="next-challenge">
            <span>NEXT CHALLENGE</span>
            <div>
              <strong>{lessonIndex < lessons.length - 1 ? lessons[lessonIndex + 1].title : "Put this working outcome to use"}</strong>
              <p>{lessonIndex < lessons.length - 1 ? lessons[lessonIndex + 1].objective : `Complete this final evidence checkpoint to finish ${track.title}.`}</p>
            </div>
            <ArrowRight />
          </section>

          <footer className="lesson-footer-actions">
            <div>
              <span>{done || allEvidenceVerified ? <CheckCircle2 /> : <CircleHelp />}</span>
              <div>
                <strong>{done ? "Mission completed" : allEvidenceVerified ? "Evidence confirmed" : "Complete the evidence checkpoint"}</strong>
                <p>{done ? "You can review it anytime." : allEvidenceVerified ? "Your next mission is ready." : "Completion means visible proof, not reading."}</p>
              </div>
            </div>
            <Button size="lg" className="primary-cta" disabled={!done && !allEvidenceVerified} onClick={completeAndContinue}>
              {lessonIndex === lessons.length - 1 ? "Confirm working outcome" : done ? "Next mission" : "Complete mission & continue"}
              <ArrowRight />
            </Button>
          </footer>
        </article>
      </div>
    </div>
  );
}

function TroubleshootingView({ goToDiagnosis }: { goToDiagnosis: () => void }) {
  const categories = ["All", ...Array.from(new Set(troubleshootingIssues.map((issue) => issue.section)))];
  const [query, setQuery] = useState("");
  const [category, setCategory] = useState("All");
  const [selectedId, setSelectedId] = useState(troubleshootingIssues[0]?.id ?? "");

  const filteredIssues = useMemo(() => {
    const normalized = query.trim().toLowerCase();
    return troubleshootingIssues.filter((issue) => {
      const matchesCategory = category === "All" || issue.section === category;
      const searchable = [
        issue.title,
        issue.section,
        issue.type,
        issue.investigate,
        issue.meaning,
        issue.related,
        ...issue.status,
        ...issue.causes,
        ...issue.actions,
      ].join(" ").toLowerCase();
      return matchesCategory && (!normalized || searchable.includes(normalized));
    });
  }, [category, query]);

  const activeIssue = filteredIssues.find((issue) => issue.id === selectedId) ?? filteredIssues[0];
  const symptomShortcuts = [
    { label: "Call won’t connect", query: "", category: "Calling" },
    { label: "Bad or missing audio", query: "audio", category: "All" },
    { label: "Agent doesn’t answer", query: "Agent Does Not Respond", category: "All" },
    { label: "STT or TTS failed", query: "Err", category: "Speech & Telephony" },
    { label: "Teams issue", query: "", category: "Microsoft Teams" },
    { label: "Limit or capacity", query: "", category: "Capacity & Limits" },
    { label: "Is this actually normal?", query: "", category: "Not Errors / Expected Events" },
  ];

  const applyShortcut = (nextQuery: string, nextCategory: string) => {
    setQuery(nextQuery);
    setCategory(nextCategory);
    const normalized = nextQuery.toLowerCase();
    const match = troubleshootingIssues.find((issue) => {
      const inCategory = nextCategory === "All" || issue.section === nextCategory;
      return inCategory && (!normalized || `${issue.title} ${issue.status.join(" ")} ${issue.meaning}`.toLowerCase().includes(normalized));
    });
    if (match) setSelectedId(match.id);
  };

  return (
    <div className="page troubleshooting-page">
      <section className="troubleshooting-hero">
        <div>
          <span className="section-kicker">100 LIVE HUB ISSUE PATTERNS</span>
          <h1>Find the failure.<br /><span>Fix the right layer.</span></h1>
          <p>Search the exact Completion status—or start with what the user experienced. The Academy turns the log glossary into a guided diagnostic path.</p>
          <div className="hero-actions">
            <Button size="lg" className="primary-cta" onClick={goToDiagnosis}>
              <Play /> Learn the 23-minute method
            </Button>
            <Button asChild size="lg" variant="outline" className="secondary-cta">
              <a href={TECH_DOCS.callHistory} target="_blank" rel="noreferrer">
                Open Call History guide <ExternalLink />
              </a>
            </Button>
          </div>
        </div>
        <div className="diagnostic-loop" aria-label="Troubleshooting method">
          <div><strong>01</strong><span>Find one<br />call</span></div>
          <ChevronRight />
          <div><strong>02</strong><span>Name the<br />layer</span></div>
          <ChevronRight />
          <div><strong>03</strong><span>Change one<br />thing</span></div>
          <ChevronRight />
          <div><strong>04</strong><span>Prove the<br />result</span></div>
        </div>
      </section>

      <section className="symptom-strip" aria-label="Common troubleshooting starting points">
        <span>I’M SEEING</span>
        <div>
          {symptomShortcuts.map((shortcut) => (
            <Button
              key={shortcut.label}
              variant="ghost"
              onClick={() => applyShortcut(shortcut.query, shortcut.category)}
            >
              {shortcut.label} <ArrowRight />
            </Button>
          ))}
        </div>
      </section>

      <section className="troubleshooting-tools">
        <div className="doc-search">
          <Search />
          <Input
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder="Paste ‘403 Forbidden’, ‘Bot Err’, ‘STT Err’—or describe the symptom…"
            aria-label="Search the Live Hub troubleshooting glossary"
          />
          <span>{filteredIssues.length} matches</span>
        </div>
        <div className="category-filters issue-filters" aria-label="Troubleshooting categories">
          {categories.map((item) => (
            <Button
              key={item}
              size="sm"
              variant="ghost"
              aria-pressed={category === item}
              className={category === item ? "category-button active" : "category-button"}
              onClick={() => setCategory(item)}
            >
              {item}
            </Button>
          ))}
        </div>
      </section>

      {activeIssue ? (
        <section className="issue-workspace">
          <aside className="issue-results" aria-label="Matching issues">
            <div className="issue-results-head">
              <span>BEST MATCHES</span>
              <strong>{filteredIssues.length}</strong>
            </div>
            <div className="issue-result-list">
              {filteredIssues.map((issue) => (
                <Button
                  key={issue.id}
                  variant="ghost"
                  className={activeIssue.id === issue.id ? "issue-result active" : "issue-result"}
                  onClick={() => setSelectedId(issue.id)}
                >
                  <span className={issue.type === "Expected Event" ? "issue-state expected" : "issue-state"}>
                    {issue.type === "Expected Event" ? <Check /> : <AlertTriangle />}
                  </span>
                  <span>
                    <small>{issue.section}</small>
                    <strong>{issue.title}</strong>
                    <em>{issue.investigate}</em>
                  </span>
                  <ChevronRight />
                </Button>
              ))}
            </div>
          </aside>

          <article className="issue-detail">
            <header className="issue-detail-head">
              <div className="issue-badges">
                <span>{activeIssue.type}</span>
                <span>{activeIssue.actionability}</span>
              </div>
              <p>{activeIssue.section}</p>
              <h2>{activeIssue.title}</h2>
              <div className="issue-owner"><Activity /> First investigate: <strong>{activeIssue.investigate}</strong></div>
            </header>

            {activeIssue.status.length > 0 && (
              <section className="status-panel">
                <div>
                  <span>COMPLETION STATUS</span>
                  <strong>{activeIssue.statusVerified ? "Verified GUI text" : "Working label"}</strong>
                </div>
                <div className="status-values">
                  {activeIssue.status.map((status) => <code key={status}>{status}</code>)}
                </div>
              </section>
            )}

            <section className="issue-meaning">
              <span>WHAT IT MEANS</span>
              <p>{activeIssue.meaning}</p>
            </section>

            <div className="issue-detail-grid">
              <section>
                <div className="detail-section-title"><CircleHelp /><div><span>01</span><h3>Why it happens</h3></div></div>
                <ul>{activeIssue.causes.map((cause) => <li key={cause}>{cause}</li>)}</ul>
              </section>
              <section className="try-panel">
                <div className="detail-section-title"><Play /><div><span>02</span><h3>What to try</h3></div></div>
                <ol>{activeIssue.actions.map((action) => <li key={action}>{action}</li>)}</ol>
              </section>
            </div>

            <section className="escalation-panel">
              <div className="escalation-copy">
                <span><AlertTriangle /></span>
                <div>
                  <small>ESCALATE WHEN</small>
                  <p>{activeIssue.escalate}</p>
                </div>
              </div>
              <div className="evidence-list">
                <span>INCLUDE WITH THE CASE</span>
                <div>{activeIssue.evidence.map((item) => <em key={item}><Check /> {item}</em>)}</div>
              </div>
            </section>

            {activeIssue.related && <p className="related-issues"><strong>Related:</strong> {activeIssue.related}</p>}
          </article>
        </section>
      ) : (
        <section className="empty-results">
          <Search />
          <h2>No exact match yet.</h2>
          <p>Try the raw Completion status, a shorter error phrase, or All categories.</p>
          <Button variant="outline" onClick={() => { setQuery(""); setCategory("All"); }}>Show all issues</Button>
        </section>
      )}

      <section className="support-runway">
        <div className="support-runway-head">
          <span className="section-kicker">WHEN SELF-SERVICE STOPS</span>
          <h2>Use the smallest support path that can solve it.</h2>
        </div>
        <div className="support-path-grid">
          <article><span>01</span><CircleHelp /><h3>Documentation</h3><p>Help Center → Documentation. Search the topic or browse the table of contents.</p></article>
          <article><span>02</span><Bookmark /><h3>Support assistant</h3><p>Use the bottom-right chat icon for help content and product questions from any screen.</p></article>
          <article><span>03</span><Bot /><h3>AI Assistant</h3><p>Inside AI Agents, use Build with AI to inspect, simulate, edit, search conversations, and run tests.</p></article>
          <article><span>04</span><AlertTriangle /><h3>Support ticket</h3><p>Help Center → Contact support. Choose Low, Medium, High, or Urgent by service impact.</p></article>
        </div>
        <div className="sharing-grid">
          <div><strong>Bot transcripts</strong><p>Share per bot connection under Features, after Call Transcript is enabled.</p></div>
          <div><strong>AI agent logs</strong><p>Share account-wide under Settings → Advanced. Logs include transcripts.</p></div>
          <div><strong>Recordings</strong><p>No standing-access switch exists. Download and send only the recordings support needs.</p></div>
          <Button asChild variant="outline">
            <a href={TECH_DOCS.support} target="_blank" rel="noreferrer">Support documentation <ExternalLink /></a>
          </Button>
        </div>
      </section>
    </div>
  );
}

function LibraryView() {
  const categories = ["All", "Watch", "Get started", "Concepts", "Build", "Connect", "Route", "Operate", "Develop", "Support"];
  const [query, setQuery] = useState("");
  const [category, setCategory] = useState("All");
  const [bookmarked, setBookmarked] = useState<string[]>([]);

  const filteredDocs = useMemo(() => {
    const normalized = query.trim().toLowerCase();
    return docs.filter((doc) => {
      const matchesCategory = category === "All" || doc.category === category;
      const matchesQuery = !normalized || `${doc.title} ${doc.description} ${doc.category}`.toLowerCase().includes(normalized);
      return matchesCategory && matchesQuery;
    });
  }, [category, query]);

  const toggleBookmark = (title: string) => {
    setBookmarked((current) => current.includes(title) ? current.filter((item) => item !== title) : [...current, title]);
  };

  return (
    <div className="page library-page">
      <section className="library-hero">
        <div>
          <span className="section-kicker">EXPERT REFERENCE · USE WHEN NEEDED</span>
          <h1>Deep detail.<br /><span>Outside the mission flow.</span></h1>
          <p>Search by what you are trying to do, then open the exact official guide only when your mission needs the full technical detail.</p>
        </div>
        <div className="library-stat-panel">
          <div><strong>{docs.length}</strong><span>curated<br />starting points</span></div>
          <div><strong>15</strong><span>documentation<br />domains</span></div>
          <div><strong>{tracks.length}</strong><span>certification<br />paths</span></div>
        </div>
      </section>

      <section className="library-tools">
        <div className="doc-search">
          <Search />
          <Input
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder="Try “SIP”, “translation”, “Teams”, or “call logs”…"
            aria-label="Search Live Hub documentation"
          />
          <kbd>⌘ K</kbd>
        </div>
        <div className="category-filters" aria-label="Documentation categories">
          {categories.map((item) => (
            <Button
              key={item}
              size="sm"
              variant="ghost"
              aria-pressed={category === item}
              className={category === item ? "category-button active" : "category-button"}
              onClick={() => setCategory(item)}
            >
              {item}
            </Button>
          ))}
        </div>
      </section>

      <div className="library-results-head">
        <span>{filteredDocs.length} resources</span>
        <span>Curated path → official source</span>
      </div>

      {filteredDocs.length ? (
        <section className="docs-grid" aria-live="polite">
          {filteredDocs.map((doc) => {
            const Icon = doc.icon;
            const saved = bookmarked.includes(doc.title);
            return (
              <article className="doc-card" key={doc.title}>
                <div className="doc-card-head">
                  <span className={`doc-icon ${doc.category.toLowerCase()}`}><Icon /></span>
                  <Button
                    variant="ghost"
                    size="icon-sm"
                    className={saved ? "bookmark-button saved" : "bookmark-button"}
                    aria-label={saved ? `Remove ${doc.title} bookmark` : `Bookmark ${doc.title}`}
                    aria-pressed={saved}
                    onClick={() => toggleBookmark(doc.title)}
                  >
                    <Bookmark />
                  </Button>
                </div>
                <span className="doc-category">{doc.category}</span>
                <h2>{doc.title}</h2>
                <p>{doc.description}</p>
                <div className="doc-meta">
                  <span><Clock3 /> {doc.time}</span>
                  <span>{doc.level}</span>
                </div>
                <Button asChild variant="ghost" className="doc-open">
                  <a href={doc.url} target="_blank" rel="noreferrer">
                    Open official guide <ExternalLink />
                  </a>
                </Button>
              </article>
            );
          })}
        </section>
      ) : (
        <section className="empty-results">
          <Search />
          <h2>No exact match yet.</h2>
          <p>Try a shorter product term or switch the category back to All.</p>
          <Button variant="outline" onClick={() => { setQuery(""); setCategory("All"); }}>Clear filters</Button>
        </section>
      )}

      <section className="api-academy">
        <div className="section-heading compact">
          <div>
            <span className="section-kicker">DEVELOPER COMPASS</span>
            <h2>Choose the API by who calls whom.</h2>
          </div>
          <p>Two integration directions. Two authentication models.</p>
        </div>
        <div className="api-choice-grid">
          <article>
            <div className="api-choice-top"><span>YOUR SYSTEM</span><ArrowRight /><strong>LIVE HUB</strong></div>
            <h3>Live Hub REST API</h3>
            <p>Manage and monitor Live Hub from your own systems. Create an API client in IAM and obtain a bearer token with the OAuth 2.0 client credentials grant.</p>
            <code>https://livehub.audiocodes.io/api/v1/</code>
          </article>
          <article>
            <div className="api-choice-top reverse"><strong>LIVE HUB</strong><ArrowRight /><span>YOUR SERVER</span></div>
            <h3>Bot & speech provider APIs</h3>
            <p>Use these when you build a bot framework, middleware, or custom speech provider that Live Hub connects to. Live Hub is the client.</p>
            <code>Different direction · different authentication</code>
          </article>
        </div>
        <div className="api-resources">
          <span>REST RESOURCES</span>
          <div>{["Call details", "Transcripts", "Recordings", "Campaigns", "Outbound calling", "AI Agents", "SIP Ladder", "Click-to-call auth"].map((resource) => <em key={resource}>{resource}</em>)}</div>
          <p><strong>AI Agents exception:</strong> its management API lives under <code>/ai-framework-management/api/v1/</code>.</p>
        </div>
      </section>

      <section className="source-banner">
        <div className="source-banner-icon"><BookOpen /></div>
        <div>
          <span>Need the complete manual?</span>
          <h2>Every Academy shortcut still leads back to the source of truth.</h2>
        </div>
        <Button asChild variant="outline">
          <a href={TECH_DOCS.home} target="_blank" rel="noreferrer">Browse all TechDocs <ExternalLink /></a>
        </Button>
      </section>
    </div>
  );
}

function GlossaryView() {
  const [query, setQuery] = useState("");
  const normalized = query.trim().toLowerCase();
  const filtered = glossary.filter((item) => `${item.term} ${item.meaning} ${item.tag}`.toLowerCase().includes(normalized));

  return (
    <div className="page glossary-page">
      <section className="glossary-hero">
        <div>
          <span className="section-kicker">VOICE, WITHOUT THE VOODOO</span>
          <h1>Say hello to the<br /><span>human-language glossary.</span></h1>
          <p>Short definitions for the voice and AI terms that usually slow a first build down.</p>
        </div>
        <div className="glossary-orbit" aria-hidden="true">
          <span className="orbit-core"><Radio /></span>
          <span className="orbit-label one">SIP</span>
          <span className="orbit-label two">STT</span>
          <span className="orbit-label three">TTS</span>
          <span className="orbit-label four">CDR</span>
        </div>
      </section>

      <div className="doc-search glossary-search">
        <Search />
        <Input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Search a voice or AI term…" aria-label="Search voice glossary" />
        <span>{filtered.length} terms</span>
      </div>

      <section className="glossary-grid" aria-live="polite">
        {filtered.map((item, index) => (
          <article className="glossary-card" key={item.term}>
            <div className="glossary-term-row">
              <span className="glossary-index">{String(index + 1).padStart(2, "0")}</span>
              <span className="glossary-tag">{item.tag}</span>
            </div>
            <h2>{item.term}</h2>
            <p>{item.meaning}</p>
          </article>
        ))}
      </section>

      {!filtered.length && (
        <section className="empty-results">
          <Code2 />
          <h2>That one is not in the Academy yet.</h2>
          <p>Try a related term or open the complete technical documentation.</p>
          <Button variant="outline" onClick={() => setQuery("")}>Show all terms</Button>
        </section>
      )}
    </div>
  );
}
