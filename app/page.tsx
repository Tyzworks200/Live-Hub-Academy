"use client";

import { useEffect, useMemo, useState } from "react";
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
import { Input } from "@/components/ui/input";
import { Progress } from "@/components/ui/progress";
import { lessonsByTrack, type Lesson } from "./lesson-data";
import { knowledgeQuestions } from "./quiz-data";
import { TECH_DOCS } from "./techdocs";
import troubleshootingData from "./troubleshooting-data.json";

type View = "home" | "orientation" | "journeys" | "troubleshooting" | "quiz" | "library" | "glossary";

type Track = {
  id: string;
  eyebrow: string;
  title: string;
  description: string;
  time: string;
  level: string;
  icon: typeof Bot;
  color: string;
  steps: string[];
  phases: string[];
};

const OFFICIAL_VIDEO_PLAYLIST =
  "https://www.youtube.com/playlist?list=PLWI2eO0GVBO-nwUsm1csXntGlLwj6XxjB";

const tracks: Track[] = [
  {
    id: "voice-agent",
    eyebrow: "Promoted first path",
    title: "Launch an AI Agent by Phone",
    description:
      "Build one small native AI Agent, prove it in chat and voice, request a US or UK number, route it, and call it.",
    time: "35 min + provisioning",
    level: "Recommended",
    icon: Bot,
    color: "cyan",
    steps: lessonsByTrack["voice-agent"].map((lesson) => lesson.title),
    phases: ["BUILD", "PROVE LOGIC", "ADD VOICE", "PROVE VOICE", "ADD CHANNEL", "ROUTE + OBSERVE"],
  },
  {
    id: "sip-trunk",
    eyebrow: "Common first path",
    title: "Connect SIP + a Live Hub Number",
    description:
      "Choose listed or Generic SIP, prove the trunk, request a US or UK number, and join them with one exact route.",
    time: "43 min + provisioning",
    level: "Technical",
    icon: Radio,
    color: "blue",
    steps: lessonsByTrack["sip-trunk"].map((lesson) => lesson.title),
    phases: ["CHOOSE TYPE", "PREPARE", "CONNECT", "MATCH NUMBERS", "PROVE SIP", "GET NUMBER", "ROUTE + CALL"],
  },
  {
    id: "teams-sip",
    eyebrow: "Enterprise voice path",
    title: "Connect Microsoft Teams + SIP",
    description:
      "Prepare the tenant, activate Teams, assign numbers, verify SIP, and create one route for each direction.",
    time: "41 min + activation",
    level: "Administrator",
    icon: Network,
    color: "pink",
    steps: lessonsByTrack["teams-sip"].map((lesson) => lesson.title),
    phases: ["PREPARE TENANT", "ACTIVATE TEAMS", "ASSIGN NUMBERS", "PROVE SIP", "ROUTE BOTH WAYS"],
  },
  {
    id: "routing",
    eyebrow: "Live Hub core",
    title: "Route and Test a Call",
    description:
      "Connect one origin to one destination, test the basic route, then add only the services you need.",
    time: "17 min",
    level: "Beginner",
    icon: Route,
    color: "green",
    steps: lessonsByTrack.routing.map((lesson) => lesson.title),
    phases: ["UNDERSTAND", "CREATE", "TEST", "ADD ONE OPTION"],
  },
  {
    id: "operate",
    eyebrow: "Run the service",
    title: "Monitor and Operate Live Hub",
    description:
      "Read calls and alarms, enable evidence, understand billing, and manage access safely.",
    time: "24 min",
    level: "All users",
    icon: Activity,
    color: "violet",
    steps: lessonsByTrack.operate.map((lesson) => lesson.title),
    phases: ["ACCOUNT", "DASHBOARD", "ALARMS", "EVIDENCE", "BILLING", "ACCESS"],
  },
  {
    id: "diagnose",
    eyebrow: "Operator essential",
    title: "Diagnose a Failed Call",
    description:
      "Find the exact call, isolate the failing layer, test one fix, and build a support-ready case.",
    time: "23 min",
    level: "All levels",
    icon: AlertTriangle,
    color: "amber",
    steps: lessonsByTrack.diagnose.map((lesson) => lesson.title),
    phases: ["CAPTURE", "READ RESULT", "FIND LAYER", "RETEST", "ESCALATE"],
  },
];

const navItems: { id: View; label: string; icon: typeof Bot }[] = [
  { id: "home", label: "Academy home", icon: Sparkles },
  { id: "orientation", label: "Start here", icon: ListChecks },
  { id: "journeys", label: "Course catalog", icon: FolderOpen },
  { id: "troubleshooting", label: "Troubleshooting", icon: AlertTriangle },
  { id: "quiz", label: "Knowledge check", icon: Award },
  { id: "library", label: "Official docs", icon: LibraryBig },
  { id: "glossary", label: "Voice glossary", icon: Code2 },
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
  { title: "Official Live Hub video playlist", description: "Watch the AudioCodes walkthrough that matches your current lesson. Use the Academy for the ordered steps and the playlist for visual confirmation.", category: "Watch", time: "Video", level: "Official", icon: Play, url: OFFICIAL_VIDEO_PLAYLIST },
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

export default function Home() {
  const [view, setView] = useState<View>("home");
  const [selectedTrack, setSelectedTrack] = useState<Track>(tracks[0]);
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
    completed.includes(`${selectedTrack.id}:${index}`)
  ).length;
  const progress = currentSteps ? Math.round((currentCompleted / currentSteps) * 100) : 0;

  const selectedIndex = useMemo(
    () => tracks.findIndex((track) => track.id === selectedTrack.id),
    [selectedTrack]
  );

  const goToTrack = (id: string) => {
    const track = tracks.find((item) => item.id === id);
    if (track) setSelectedTrack(track);
    setView("journeys");
    setMobileOpen(false);
    resetPagePosition();
  };

  const goToView = (next: View) => {
    setView(next);
    setMobileOpen(false);
    resetPagePosition();
  };

  const selectJourneyTrack = (track: Track) => {
    setSelectedTrack(track);
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

        <div className="sidebar-progress-card">
          <div className="progress-card-head">
            <span>Current mission</span>
            <strong>{progress}%</strong>
          </div>
          <Progress value={progress} aria-label="Academy progress" />
          <p>{currentCompleted ? `${currentCompleted} of ${currentSteps} lessons complete in ${selectedTrack.title}.` : `Ready to begin: ${selectedTrack.title}.`}</p>
        </div>

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
          <div className="topbar-actions">
            <Button variant="ghost" className="top-link" onClick={() => goToView("library")}>
              <Search /> Search docs
            </Button>
            <Button asChild className="portal-button">
              <a href="https://livehub.audiocodes.io/login" target="_blank" rel="noreferrer">
                Open Live Hub <ArrowRight />
              </a>
            </Button>
          </div>
        </header>

        {view === "home" && (
          <HomeView
            goToTrack={goToTrack}
            goToOrientation={() => goToView("orientation")}
            goToJourneys={() => goToView("journeys")}
          />
        )}
        {view === "orientation" && <OrientationView goToJourneys={() => goToView("journeys")} />}
        {view === "journeys" && (
          <JourneysView
            key={selectedTrack.id}
            selected={selectedTrack}
            selectedIndex={selectedIndex}
            selectTrack={selectJourneyTrack}
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

function HomeView({
  goToTrack,
  goToOrientation,
  goToJourneys,
}: {
  goToTrack: (id: string) => void;
  goToOrientation: () => void;
  goToJourneys: () => void;
}) {
  const [courseQuery, setCourseQuery] = useState("");
  const normalizedQuery = courseQuery.trim().toLowerCase();
  const matchingTracks = normalizedQuery
    ? tracks.filter((track) => `${track.title} ${track.description} ${track.level}`.toLowerCase().includes(normalizedQuery))
    : tracks.slice(0, 3);

  return (
    <div className="page home-page simplified-home">
      <section className="academy-welcome">
        <div>
          <span className="section-kicker"><Sparkles /> WELCOME TO THE LIVE HUB ACADEMY</span>
          <h1>What do you want to make work today?</h1>
          <p>
            Live Hub is AudioCodes&apos; enterprise platform for building Voice AI and connecting it to real voice channels. The Academy turns that platform into short, ordered courses that finish with a working call.
          </p>
        </div>
        <Button variant="outline" className="welcome-tour-button" onClick={goToOrientation}>
          <Play /> New here? Take the 3-minute tour
        </Button>
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

          {/* Future Intercom or another Academy AI agent can mount into this stable slot. */}
          <article
            id="livehub-academy-assistant"
            className="assistant-space"
            data-integration-slot="intercom"
          >
            <span className="assistant-status"><span /> RESERVED ASSISTANT SPACE</span>
            <div className="assistant-icon"><MessageCircle /></div>
            <h2>Ask the Live Hub Academy</h2>
            <p>This space is reserved for your future AI guide. It can answer questions and send learners to the exact course or TechDocs topic.</p>
            <div className="assistant-input-preview" aria-label="AI Assistant integration placeholder">
              <span>Ask how to route a call…</span>
              <Button disabled aria-label="AI Assistant coming soon"><Bot /> Soon</Button>
            </div>
            <small>Integration-ready placeholder · no assistant is connected yet</small>
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
          <span className="section-kicker"><Award /> LIVE HUB BOOTCAMP</span>
          <h1>Can you make the right next move?</h1>
          <p>Twelve practical questions from the supplied bootcamp material. This check focuses on stable product workflows; changing commercial terms are kept out of the score.</p>
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
            <Button size="lg" className="primary-cta" disabled={answeredCount !== knowledgeQuestions.length} onClick={() => { setSubmitted(true); resetPagePosition(); }}>Check my answers <ArrowRight /></Button>
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
          <div><span className="section-kicker">THE ONLY MODEL TO REMEMBER</span><h2>Build → Connect → Route → Test → Observe</h2></div>
          <p>Every lesson tells you which part of this chain you are changing.</p>
        </div>
        <div className="learning-loop">
          {[
            ["01", "Build", "Create one agent or connect one bot"],
            ["02", "Connect", "Give it speech and a voice channel"],
            ["03", "Route", "Send one origin to one destination"],
            ["04", "Test", "Make the smallest real call"],
            ["05", "Observe", "Use Calls and AI Logs as proof"],
          ].map(([number, title, detail]) => (
            <article key={number}><span>{number}</span><div><strong>{title}</strong><p>{detail}</p></div></article>
          ))}
        </div>
        <p className="advanced-later"><Lightbulb /> Transfers, recordings, translation, Agent Assist, campaigns, headers, and APIs come after this chain works.</p>
      </section>

      <section className="portal-tour">
        <div className="portal-tour-head">
          <div><span className="section-kicker">WHEN YOU OPEN LIVE HUB</span><h2>Seven landmarks—nothing more.</h2></div>
          <p>Use this map only when a lesson tells you to open a specific area.</p>
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

function JourneysView({
  selected,
  selectedIndex,
  selectTrack,
  completed,
  toggleStep,
}: {
  selected: Track;
  selectedIndex: number;
  selectTrack: (track: Track) => void;
  completed: string[];
  toggleStep: (key: string) => void;
}) {
  const Icon = selected.icon;
  const [activeLessonIndex, setActiveLessonIndex] = useState<number | null>(null);
  const lessons = lessonsByTrack[selected.id] ?? [];
  const missionComplete = selected.steps.filter((_, index) => completed.includes(`${selected.id}:${index}`)).length;

  const openLesson = (index: number) => {
    setActiveLessonIndex(index);
    resetPagePosition();
  };

  const backToMission = () => {
    setActiveLessonIndex(null);
    resetPagePosition();
  };

  if (activeLessonIndex !== null && lessons[activeLessonIndex]) {
    return (
      <LessonWorkspace
        track={selected}
        lessons={lessons}
        lessonIndex={activeLessonIndex}
        completed={completed}
        toggleStep={toggleStep}
        onBack={backToMission}
        onSelectLesson={openLesson}
      />
    );
  }

  const firstIncomplete = Math.max(0, selected.steps.findIndex((_, index) => !completed.includes(`${selected.id}:${index}`)));
  return (
    <div className="page journeys-page">
      <div className="journey-header">
        <div>
          <span className="section-kicker">THREE WAYS TO BEGIN</span>
          <h1>Choose the origin. Routing joins the path.</h1>
          <p>Start with an AI Agent, SIP plus a Live Hub number, or Microsoft Teams plus SIP. Complete one path in order; use the focused missions only after its baseline call works.</p>
        </div>
        <div className="journey-count"><strong>3</strong><span>real starting<br />paths</span></div>
      </div>

      <div className="routing-heart" aria-label="Every starting path meets at routing">
        <div className="routing-origins"><span><Bot /> AI Agent</span><span><Radio /> SIP + number</span><span><Network /> Teams + SIP</span></div>
        <ArrowRight />
        <div className="routing-center"><Route /><span><small>THE HEART</small><strong>Routing</strong></span></div>
        <ArrowRight />
        <div className="routing-proof"><CheckCircle2 /><span><small>FINISH</small><strong>Test + Calls evidence</strong></span></div>
      </div>

      <div className="journey-workspace">
        <div className="journey-selector" role="tablist" aria-label="Learning journeys">
          {tracks.map((track, index) => {
            const TrackIcon = track.icon;
            return (
              <div key={track.id} className={index === 0 ? "journey-choice recommended-path" : "journey-choice"}>
                {index === 0 && <span className="journey-group-label">START A SERVICE</span>}
                {index === 3 && <span className="journey-group-label secondary">FOCUSED MISSIONS</span>}
                <Button
                  variant="ghost"
                  role="tab"
                  aria-selected={selected.id === track.id}
                  className={selected.id === track.id ? "journey-tab active" : "journey-tab"}
                  onClick={() => selectTrack(track)}
                >
                  <span className={`journey-tab-icon ${track.color}`}><TrackIcon /></span>
                  <span className="journey-tab-copy">
                    <small>{index === 0 ? "PROMOTED START" : index < 3 ? `START 0${index + 1}` : `TASK 0${index - 2}`} · {track.time}</small>
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
            <span><Check /> Clear success check</span>
          </div>
          <div className="mission-guardrail"><Lightbulb /><span><strong>{["voice-agent", "sip-trunk", "teams-sip"].includes(selected.id) ? "Follow this in order:" : "Keep the scope small:"}</strong> {["voice-agent", "sip-trunk", "teams-sip"].includes(selected.id) ? "each lesson produces a prerequisite for the next. Routing comes only after the origin and destination are ready." : "finish this mission’s success checks before adding another channel or optional service."}</span></div>
          <div className="mission-steps">
            {selected.steps.map((step, index) => {
              const stepKey = `${selected.id}:${index}`;
              const done = completed.includes(stepKey);
              return (
              <Button
                variant="ghost"
                id={`${selected.id}-step-${index}`}
                className={done ? "mission-step done" : "mission-step"}
                key={step}
                onClick={() => openLesson(index)}
              >
                <span className="step-index">{done ? <Check /> : index + 1}</span>
                <div>
                  <small>{done ? "LESSON COMPLETE" : `OPEN LESSON ${index + 1}`}</small>
                  <strong><em>{selected.phases[index]}</em>{step}</strong>
                </div>
                <ChevronRight />
              </Button>
            )})}
          </div>
          <div className="mission-footer">
            <div>
              <span>Mission 0{selectedIndex + 1} · {missionComplete}/{selected.steps.length} complete</span>
              <p>Tap each step as you finish. Progress saves on this device.</p>
            </div>
            <Button
              size="lg"
              className="primary-cta"
              onClick={() => openLesson(firstIncomplete)}
            >
              {missionComplete ? "Continue mission" : selected.id === "voice-agent" ? "Start step 1" : "Begin mission"} <ArrowRight />
            </Button>
          </div>
        </section>
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
}: {
  track: Track;
  lessons: Lesson[];
  lessonIndex: number;
  completed: string[];
  toggleStep: (key: string) => void;
  onBack: () => void;
  onSelectLesson: (index: number) => void;
}) {
  const lesson = lessons[lessonIndex];
  const lessonKey = `${track.id}:${lessonIndex}`;
  const done = completed.includes(lessonKey);
  const completedInTrack = lessons.filter((_, index) => completed.includes(`${track.id}:${index}`)).length;
  const [speaking, setSpeaking] = useState(false);

  useEffect(() => {
    return () => {
      if (typeof window !== "undefined" && "speechSynthesis" in window) {
        window.speechSynthesis.cancel();
      }
    };
  }, [lesson.id]);

  const lessonNarration = [
    lesson.title,
    lesson.objective,
    lesson.decision ? `${lesson.decision.question}. ${lesson.decision.options.map((option) => `${option.title}: ${option.chooseWhen} ${option.next}`).join(" ")}` : "",
    lesson.architecture ? `Architecture: ${lesson.architecture.join(" to ")}.` : "",
    `Before you start: ${lesson.before.join(". ")}.`,
    lesson.skipForNow ? `Ignore these for now: ${lesson.skipForNow.join(", ")}.` : "",
    ...lesson.actions.map((action, index) => `Step ${index + 1}. ${action.title}. ${action.instruction}`),
    `Success check: ${lesson.success.join(". ")}.`,
  ].join(" ");

  const toggleListening = () => {
    if (!("speechSynthesis" in window)) return;
    if (speaking) {
      window.speechSynthesis.cancel();
      setSpeaking(false);
      return;
    }
    window.speechSynthesis.cancel();
    const utterance = new SpeechSynthesisUtterance(lessonNarration);
    utterance.rate = 0.94;
    utterance.pitch = 1;
    utterance.onend = () => setSpeaking(false);
    utterance.onerror = () => setSpeaking(false);
    window.speechSynthesis.speak(utterance);
    setSpeaking(true);
  };

  const completeAndContinue = () => {
    if (!done) toggleStep(lessonKey);
    if (lessonIndex < lessons.length - 1) onSelectLesson(lessonIndex + 1);
    else onBack();
  };

  return (
    <div className="page lesson-page">
      <div className="lesson-topline">
        <Button variant="ghost" className="lesson-back" onClick={onBack}>
          <ArrowLeft /> Back to mission
        </Button>
        <div className="lesson-progress-summary">
          <span>{completedInTrack}/{lessons.length} lessons complete</span>
          <Progress value={(completedInTrack / lessons.length) * 100} aria-label={`${track.title} progress`} />
        </div>
      </div>

      <div className="lesson-layout">
        <aside className="lesson-outline">
          <div className="lesson-outline-head">
            <span>MISSION</span>
            <h2>{track.title}</h2>
            <p>{track.time} · {lessons.length} guided lessons</p>
          </div>
          <div className="lesson-outline-list">
            {lessons.map((item, index) => {
              const itemDone = completed.includes(`${track.id}:${index}`);
              return (
                <Button
                  key={item.id}
                  variant="ghost"
                  className={index === lessonIndex ? "outline-lesson active" : "outline-lesson"}
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
            <p>Complete the action in Live Hub first—then mark the lesson done.</p>
          </div>
        </aside>

        <article className="lesson-content">
          <header className="lesson-header">
            <div className="lesson-header-meta">
              <span>LESSON {lessonIndex + 1} OF {lessons.length}</span>
              <span><Clock3 /> {lesson.duration}</span>
            </div>
            <h1>{lesson.title}</h1>
            <p>{lesson.objective}</p>
            <div className="lesson-header-actions">
              <Button variant="outline" onClick={toggleListening} className={speaking ? "listen-button active" : "listen-button"}>
                {speaking ? <Square /> : <Volume2 />}
                {speaking ? "Stop listening" : "Listen to this lesson"}
              </Button>
              <Button asChild variant="ghost" className="official-guide-button">
                <a href={lesson.docUrl} target="_blank" rel="noreferrer">Open official guide <ExternalLink /></a>
              </Button>
            </div>
          </header>

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

          {lesson.architecture && (
            <section className="lesson-architecture" aria-label="Architecture for this lesson">
              <span>WHAT CONNECTS TO WHAT</span>
              <div>
                {lesson.architecture.map((part, index) => (
                  <span key={part}><strong>{part}</strong>{index < lesson.architecture!.length - 1 && <ArrowRight />}</span>
                ))}
              </div>
            </section>
          )}

          <section className="lesson-section before-section">
            <div className="lesson-section-title">
              <ListChecks />
              <div><span>01</span><h2>Before you start</h2></div>
            </div>
            <div className="before-grid">
              {lesson.before.map((item) => <div key={item}><Check /> {item}</div>)}
            </div>
          </section>

          {lesson.skipForNow && (
            <section className="skip-for-now">
              <Lightbulb />
              <div>
                <strong>Ignore these for now</strong>
                <p>{lesson.skipForNow.join(" · ")}</p>
              </div>
            </section>
          )}

          <section className="lesson-section actions-section">
            <div className="lesson-section-title">
              <Play />
              <div><span>02 · YOUR TASK NOW</span><h2>Do this in Live Hub</h2></div>
            </div>
            <div className="action-list">
              {lesson.actions.map((action, index) => (
                <div className="action-row" key={`${action.title}-${index}`}>
                  <span className="action-number">{String(index + 1).padStart(2, "0")}</span>
                  <div className="action-copy">
                    <h3>{action.title}</h3>
                    <p>{action.instruction}</p>
                    {action.note && <div className="action-note"><Lightbulb /> {action.note}</div>}
                  </div>
                </div>
              ))}
            </div>
            {lesson.commonMistake && (
              <div className="common-mistake"><AlertTriangle /><div><strong>Common mistake</strong><p>{lesson.commonMistake}</p></div></div>
            )}
          </section>

          {(lesson.image || lesson.videoId) && (
            <details className="lesson-support-details">
              <summary><Play /><span><strong>Need a visual?</strong><small>Open the official screen or video for this exact lesson.</small></span><ChevronRight /></summary>
              <section className="lesson-media-grid">
                {lesson.image && (
                  <figure className="lesson-visual">
                    <div className="visual-label"><span /> OFFICIAL LIVE HUB SCREEN</div>
                    <img src={lesson.image} alt={lesson.imageAlt ?? "Live Hub screen for this lesson"} loading="lazy" />
                    <figcaption>Use the labels in the lesson; the portal may evolve slightly between releases.</figcaption>
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

          <section className="lesson-section success-section">
            <div className="lesson-section-title">
              <CircleCheckBig />
              <div><span>03</span><h2>You’re done when…</h2></div>
            </div>
            <div className="success-grid">
              {lesson.success.map((item) => <div key={item}><CheckCircle2 /> {item}</div>)}
            </div>
          </section>

          <details className="lesson-troubleshooting-details">
            <summary><AlertTriangle /><span><strong>If it doesn’t work</strong><small>Open only after you have tried the steps once.</small></span><ChevronRight /></summary>
            <div className="troubleshooting-list">
              {lesson.troubleshooting.map((item) => (
                <div className="troubleshooting-item" key={item.problem}>
                  <strong>{item.problem}</strong>
                  <p>{item.fix}</p>
                </div>
              ))}
            </div>
          </details>

          <footer className="lesson-footer-actions">
            <div>
              <span>{done ? <CheckCircle2 /> : <CircleHelp />}</span>
              <div>
                <strong>{done ? "Lesson completed" : "Did the result match the success check?"}</strong>
                <p>{done ? "You can review it anytime." : "Only continue after you have tried the steps in Live Hub."}</p>
              </div>
            </div>
            <Button size="lg" className="primary-cta" onClick={completeAndContinue}>
              {lessonIndex === lessons.length - 1 ? "Complete mission" : done ? "Next lesson" : "Mark complete & continue"}
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
          <span className="section-kicker">LIVE HUB REFERENCE</span>
          <h1>One library.<br /><span>No treasure hunt.</span></h1>
          <p>Search by what you are trying to do, then jump into the exact official guide when you need the full detail.</p>
        </div>
        <div className="library-stat-panel">
          <div><strong>{docs.length}</strong><span>curated<br />starting points</span></div>
          <div><strong>15</strong><span>documentation<br />domains</span></div>
          <div><strong>{tracks.length}</strong><span>guided<br />missions</span></div>
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
