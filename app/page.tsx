"use client";

import { useEffect, useMemo, useState } from "react";
import {
  AlertTriangle,
  ArrowLeft,
  ArrowRight,
  Activity,
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
  Headphones,
  Languages,
  LibraryBig,
  Lightbulb,
  ListChecks,
  Menu,
  Network,
  PhoneCall,
  Play,
  Radio,
  Route,
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
import troubleshootingData from "./troubleshooting-data.json";

type View = "home" | "journeys" | "troubleshooting" | "library" | "glossary";

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
};

const tracks: Track[] = [
  {
    id: "voice-agent",
    eyebrow: "Most popular",
    title: "Launch a Voice AI Agent",
    description:
      "Give an AI agent a voice, connect a real number, and complete your first test call.",
    time: "25 min",
    level: "Start here",
    icon: Bot,
    color: "cyan",
    steps: lessonsByTrack["voice-agent"].map((lesson) => lesson.title),
  },
  {
    id: "voice-channel",
    eyebrow: "Voice foundations",
    title: "Connect a Voice Channel",
    description:
      "Bring SIP, Teams, WebRTC, WhatsApp, a contact center, or a global number into Live Hub.",
    time: "15 min",
    level: "Beginner",
    icon: Network,
    color: "blue",
    steps: lessonsByTrack["voice-channel"].map((lesson) => lesson.title),
  },
  {
    id: "agent-assist",
    eyebrow: "For contact centers",
    title: "Add Live-Agent Assist",
    description:
      "Let an AI assistant follow live conversations and help agents in the moment.",
    time: "20 min",
    level: "Intermediate",
    icon: Headphones,
    color: "violet",
    steps: lessonsByTrack["agent-assist"].map((lesson) => lesson.title),
  },
  {
    id: "translation",
    eyebrow: "50+ languages",
    title: "Translate a Live Call",
    description:
      "Make agents and customers sound local to one another with two-way real-time translation.",
    time: "15 min",
    level: "Intermediate",
    icon: Languages,
    color: "pink",
    steps: lessonsByTrack.translation.map((lesson) => lesson.title),
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
  },
];

const navItems: { id: View; label: string; icon: typeof Bot }[] = [
  { id: "home", label: "Academy home", icon: Sparkles },
  { id: "journeys", label: "Learning journeys", icon: Route },
  { id: "troubleshooting", label: "Troubleshooting", icon: AlertTriangle },
  { id: "library", label: "Doc library", icon: LibraryBig },
  { id: "glossary", label: "Voice glossary", icon: Code2 },
];

const quickGoals = [
  { label: "Build an AI agent", icon: Bot, track: "voice-agent" },
  { label: "Connect telephony", icon: PhoneCall, track: "voice-channel" },
  { label: "Assist human agents", icon: Headphones, track: "agent-assist" },
  { label: "Translate calls", icon: Languages, track: "translation" },
  { label: "Fix a failed call", icon: AlertTriangle, track: "diagnose" },
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
  { title: "Sign up and sign in", description: "Create access, enter the portal, and know where to start after login.", category: "Get started", time: "4 min", level: "Start", icon: Sparkles, url: "https://livehub.audiocodes.io/login" },
  { title: "Your first call, end to end", description: "See the complete chain from agent and speech to channel, route, test, and call record.", category: "Get started", time: "8 min", level: "Walkthrough", icon: PhoneCall, url: "https://techdocs.audiocodes.com/livehub/" },
  { title: "Tour the interface", description: "Learn the side navigation, dashboard, Help Center, profile, balance, and Build with AI controls.", category: "Get started", time: "6 min", level: "Tour", icon: ListChecks, url: "https://techdocs.audiocodes.com/livehub/" },
  { title: "Quick setup wizard", description: "Choose a use case, connect a number and bot, then create a first routing rule.", category: "Get started", time: "7 min", level: "Wizard", icon: Zap, url: "https://techdocs.audiocodes.com/livehub/" },
  { title: "Core Live Hub concepts", description: "Understand the voice channel, destination, and routing rule behind every call path.", category: "Concepts", time: "7 min", level: "Foundation", icon: Network, url: "https://techdocs.audiocodes.com/livehub/" },
  { title: "Regions and data privacy", description: "Align entity regions and understand where recordings, transcripts, and call data are handled.", category: "Concepts", time: "9 min", level: "Foundation", icon: ShieldCheck, url: "https://techdocs.audiocodes.com/livehub/" },
  { title: "Recording and transcripts", description: "Plan capture, retention, downloads, and support-sharing choices before production.", category: "Concepts", time: "8 min", level: "Policy", icon: FileText, url: "https://techdocs.audiocodes.com/livehub/Content/LiveHub/managing_call_history_new.htm" },
  { title: "Build a native AI Agent", description: "Create agents, flows, tools, and documents in Live Hub's native agent platform.", category: "Build", time: "15 min", level: "Guide", icon: Bot, url: "https://intercom.help/audiocodes-1a6772ae1c8a/en/articles/11999522-video-guide-for-creating-ai-agents-in-live-hub" },
  { title: "Connect a bot", description: "Attach Live Hub AI Agents, Copilot Studio, Dialogflow, RASA, or a custom framework.", category: "Build", time: "12 min", level: "Guide", icon: Bot, url: "https://techdocs.audiocodes.com/livehub/Content/LiveHub/LiveHub-AIAgent.htm" },
  { title: "Speech providers", description: "Select independent STT and TTS providers, models, languages, voices, and custom services.", category: "Build", time: "11 min", level: "Catalog", icon: Volume2, url: "https://techdocs.audiocodes.com/livehub/Content/LiveHub/Editing%20your%20bot.htm" },
  { title: "Bot features and failover", description: "Configure transcription, recording, background music, transfer, outbound calls, and failover actions.", category: "Build", time: "13 min", level: "Guide", icon: SlidersHorizontal, url: "https://techdocs.audiocodes.com/livehub/Content/LiveHub/Editing%20your%20bot.htm" },
  { title: "Voice channels overview", description: "Choose among phone numbers, SIP, Teams, WebRTC, WhatsApp, PBXs, and contact centers.", category: "Connect", time: "8 min", level: "Overview", icon: Network, url: "https://techdocs.audiocodes.com/livehub/Content/LiveHub/voice-channels.htm" },
  { title: "SIP connections", description: "Create a tested provider connection or configure a generic SIP, UC, or contact-center path.", category: "Connect", time: "14 min", level: "Guide", icon: Radio, url: "https://techdocs.audiocodes.com/livehub/Content/LiveHub/sip_connections.htm" },
  { title: "Microsoft Teams connection", description: "Connect a Teams tenant, create a voice route, and prepare licensed users for calling.", category: "Connect", time: "18 min", level: "Guide", icon: PhoneCall, url: "https://techdocs.audiocodes.com/livehub/Content/LiveHub/Creating%20Teams%20connection.htm" },
  { title: "WhatsApp voice calling", description: "Connect a verified WhatsApp Business number and route calls to bots or contact centers.", category: "Connect", time: "12 min", level: "Guide", icon: PhoneCall, url: "https://techdocs.audiocodes.com/livehub/Content/LiveHub/buy-whats-app-number.htm" },
  { title: "WebRTC Click-to-Call", description: "Add browser or mobile calling with the widget, SDK, and authentication-code options.", category: "Connect", time: "15 min", level: "Guide", icon: Code2, url: "https://techdocs.audiocodes.com/livehub/Content/LiveHub/configuration-WebRTC-Click-to-Call.htm" },
  { title: "Routing rules", description: "Match origins and number patterns, choose destinations, order rules, and apply call services.", category: "Route", time: "14 min", level: "Core", icon: Route, url: "https://techdocs.audiocodes.com/livehub/Content/LiveHub/Defining%20Routing.htm" },
  { title: "Live-Agent Assist", description: "Connect an assist bot in-path or through SIPREC and attach it as a routing service.", category: "Route", time: "13 min", level: "Guide", icon: Headphones, url: "https://techdocs.audiocodes.com/livehub/Content/LiveHub/Agent%20assist.htm" },
  { title: "Real-time voice translation", description: "Configure languages, speech providers, activation, volume, and two-way translation.", category: "Route", time: "10 min", level: "Guide", icon: Languages, url: "https://techdocs.audiocodes.com/livehub/Content/LiveHub/Voice-translation.htm" },
  { title: "Outbound campaigns and Hub+", description: "Automate outbound calling while controlling schedules, traffic, and campaign results.", category: "Operate", time: "13 min", level: "Guide", icon: Activity, url: "https://techdocs.audiocodes.com/livehub/" },
  { title: "Call history and logs", description: "Inspect completion status, services, recordings, transcripts, AI logs, latency, and SIP Ladder.", category: "Operate", time: "10 min", level: "Reference", icon: Activity, url: "https://techdocs.audiocodes.com/livehub/Content/LiveHub/managing_call_history_new.htm" },
  { title: "Monitoring and alarms", description: "Watch activity, voice quality, current alarms, and alarm history across the account.", category: "Operate", time: "9 min", level: "Reference", icon: AlertTriangle, url: "https://techdocs.audiocodes.com/livehub/" },
  { title: "Administration and IAM", description: "Manage accounts, users, roles, permissions, API clients, plans, balance, and billing.", category: "Operate", time: "12 min", level: "Admin", icon: ShieldCheck, url: "https://techdocs.audiocodes.com/livehub/" },
  { title: "Live Hub REST API", description: "Authenticate with OAuth client credentials and manage calls, transcripts, recordings, campaigns, and more.", category: "Develop", time: "12 min", level: "API", icon: Code2, url: "https://techdocs.audiocodes.com/livehub/Content/LiveHub/API/API-Endpoints.htm" },
  { title: "SIP Ladder API", description: "Retrieve the signaling sequence as JSON for deeper troubleshooting and visualization.", category: "Develop", time: "7 min", level: "API", icon: Code2, url: "https://techdocs.audiocodes.com/livehub/Content/LiveHub/API/api-sip-ladder.htm" },
  { title: "Bot and speech provider APIs", description: "Implement a server that Live Hub connects to when you build a framework, middleware, or custom speech provider.", category: "Develop", time: "14 min", level: "API", icon: FileText, url: "https://techdocs.audiocodes.com/livehub/" },
  { title: "Support and evidence sharing", description: "Use documentation, chat, AI Assistant, tickets, and privacy-aware sharing for investigations.", category: "Support", time: "8 min", level: "Guide", icon: CircleHelp, url: "https://techdocs.audiocodes.com/livehub/" },
  { title: "Release notes", description: "Review recent platform changes before diagnosing a behavior that changed after an update.", category: "Support", time: "6 min", level: "Reference", icon: Bookmark, url: "https://techdocs.audiocodes.com/livehub/" },
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

export default function Home() {
  const [view, setView] = useState<View>("home");
  const [selectedTrack, setSelectedTrack] = useState<Track>(tracks[0]);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [completed, setCompleted] = useState<string[]>([]);

  useEffect(() => {
    try {
      const saved = window.localStorage.getItem("live-hub-academy-progress");
      if (saved) setCompleted(JSON.parse(saved));
    } catch {
      // Device-local progress is an enhancement; the Academy still works without it.
    }
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

  const totalSteps = tracks.reduce((total, track) => total + track.steps.length, 0);
  const progress = Math.round((completed.length / totalSteps) * 100);

  const selectedIndex = useMemo(
    () => tracks.findIndex((track) => track.id === selectedTrack.id),
    [selectedTrack]
  );

  const goToTrack = (id: string) => {
    const track = tracks.find((item) => item.id === id);
    if (track) setSelectedTrack(track);
    setView("journeys");
    setMobileOpen(false);
  };

  const goToView = (next: View) => {
    setView(next);
    setMobileOpen(false);
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
            <span>Your launch path</span>
            <strong>{progress}%</strong>
          </div>
          <Progress value={progress} aria-label="Academy progress" />
          <p>{completed.length ? `${completed.length} of ${totalSteps} steps complete.` : "Choose a journey to begin."}</p>
        </div>

        <Button asChild variant="ghost" className="sidebar-help">
          <a href="https://intercom.help/audiocodes-1a6772ae1c8a/en/" target="_blank" rel="noreferrer">
            <CircleHelp />
            <span className="sidebar-help-copy">
              <strong>Need a human?</strong>
              <small>Open Live Hub support</small>
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

        {view === "home" && <HomeView goToTrack={goToTrack} />}
        {view === "journeys" && (
          <JourneysView
            selected={selectedTrack}
            selectedIndex={selectedIndex}
            selectTrack={setSelectedTrack}
            completed={completed}
            toggleStep={toggleStep}
          />
        )}
        {view === "troubleshooting" && <TroubleshootingView goToDiagnosis={() => goToTrack("diagnose")} />}
        {view === "library" && <LibraryView />}
        {view === "glossary" && <GlossaryView />}
      </section>
    </main>
  );
}

function HomeView({ goToTrack }: { goToTrack: (id: string) => void }) {
  return (
    <div className="page home-page">
      <section className="hero-grid">
        <div className="hero-copy">
          <div className="eyebrow"><Zap /> FROM FIRST CLICK TO FIRST CALL</div>
          <h1>
            Don&apos;t just read Live Hub.
            <span>Make it talk.</span>
          </h1>
          <p className="hero-lead">
            Pick an outcome. Follow one clear path. Build, connect, test, and ship your voice AI experience with confidence.
          </p>
          <div className="hero-actions">
            <Button size="lg" className="primary-cta" onClick={() => goToTrack("voice-agent")}>
              <Play /> Start your first call
            </Button>
            <Button size="lg" variant="outline" className="secondary-cta" onClick={() => goToTrack("voice-channel")}>
              Explore all journeys <ArrowRight />
            </Button>
          </div>
          <div className="trust-row">
            <span><Check /> No telephony expertise required</span>
            <span><Clock3 /> Learn by doing</span>
            <span><ShieldCheck /> Production-minded</span>
          </div>
        </div>

        <div className="voice-console" aria-label="Live Hub voice flow overview">
          <div className="console-topline">
            <span className="live-dot" /> LIVE FLOW
            <span className="console-id">CALL_001</span>
          </div>
          <div className="waveform" aria-hidden="true">
            {[19, 35, 56, 31, 72, 44, 86, 52, 28, 61, 93, 46, 66, 36, 76, 50, 26, 58, 39, 70, 30, 48].map((height, index) => (
              <span key={index} style={{ height: `${height}%`, animationDelay: `${index * 40}ms` }} />
            ))}
          </div>
          <div className="flow-map">
            <FlowNode icon={Bot} label="AI agent" sublabel="Understands" active />
            <div className="flow-connector"><span /></div>
            <FlowNode icon={Sparkles} label="Live Hub" sublabel="Orchestrates" active />
            <div className="flow-connector"><span /></div>
            <FlowNode icon={PhoneCall} label="Voice" sublabel="Connects" active />
          </div>
          <div className="console-result">
            <span><Check /></span>
            <div>
              <strong>Ready for a real conversation</strong>
              <small>One platform · any AI · any voice channel</small>
            </div>
          </div>
        </div>
      </section>

      <section className="goal-section">
        <div className="section-heading">
          <div>
            <span className="section-kicker">YOUR FASTEST WAY IN</span>
            <h2>What do you want to make happen?</h2>
          </div>
          <p>Skip the manual. Start with the outcome.</p>
        </div>
        <div className="goal-grid">
          {quickGoals.map((goal) => {
            const Icon = goal.icon;
            return (
              <Button key={goal.track} variant="ghost" className="goal-card" onClick={() => goToTrack(goal.track)}>
                <span className="goal-icon"><Icon /></span>
                <span>{goal.label}</span>
                <ArrowRight />
              </Button>
            );
          })}
        </div>
      </section>

      <section className="journey-preview">
        <div className="section-heading compact">
          <div>
            <span className="section-kicker">GUIDED MISSIONS</span>
            <h2>From “hello” to production</h2>
          </div>
          <Button variant="ghost" className="view-all" onClick={() => goToTrack("voice-agent")}>View all journeys <ArrowRight /></Button>
        </div>
        <div className="track-grid">
          {tracks.map((track, index) => (
            <TrackCard key={track.id} track={track} index={index} onSelect={() => goToTrack(track.id)} />
          ))}
        </div>
      </section>
    </div>
  );
}

function FlowNode({ icon: Icon, label, sublabel, active }: { icon: typeof Bot; label: string; sublabel: string; active?: boolean }) {
  return (
    <div className={`flow-node ${active ? "active" : ""}`}>
      <span><Icon /></span>
      <strong>{label}</strong>
      <small>{sublabel}</small>
    </div>
  );
}

function TrackCard({ track, index, onSelect }: { track: Track; index: number; onSelect: () => void }) {
  const Icon = track.icon;
  return (
    <article className={`track-card ${track.color}`}>
      <div className="track-card-top">
        <span className="track-number">0{index + 1}</span>
        <span className="track-icon"><Icon /></span>
      </div>
      <span className="track-eyebrow">{track.eyebrow}</span>
      <h3>{track.title}</h3>
      <p>{track.description}</p>
      <div className="track-meta">
        <span><Clock3 /> {track.time}</span>
        <span>{track.level}</span>
      </div>
      <Button variant="ghost" className="track-start" onClick={onSelect}>
        Start journey <ArrowRight />
      </Button>
    </article>
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

  useEffect(() => setActiveLessonIndex(null), [selected.id]);

  if (activeLessonIndex !== null && lessons[activeLessonIndex]) {
    return (
      <LessonWorkspace
        track={selected}
        lessons={lessons}
        lessonIndex={activeLessonIndex}
        completed={completed}
        toggleStep={toggleStep}
        onBack={() => setActiveLessonIndex(null)}
        onSelectLesson={setActiveLessonIndex}
      />
    );
  }

  const firstIncomplete = Math.max(0, selected.steps.findIndex((_, index) => !completed.includes(`${selected.id}:${index}`)));
  return (
    <div className="page journeys-page">
      <div className="journey-header">
        <div>
          <span className="section-kicker">LEARNING JOURNEYS</span>
          <h1>Choose a mission. Ship an outcome.</h1>
          <p>Each journey connects the right concepts, settings, and checks in the order you actually need them.</p>
        </div>
        <div className="journey-count"><strong>{tracks.length}</strong><span>guided<br />missions</span></div>
      </div>

      <div className="journey-workspace">
        <div className="journey-selector" role="tablist" aria-label="Learning journeys">
          {tracks.map((track, index) => {
            const TrackIcon = track.icon;
            return (
              <Button
                key={track.id}
                variant="ghost"
                role="tab"
                aria-selected={selected.id === track.id}
                className={selected.id === track.id ? "journey-tab active" : "journey-tab"}
                onClick={() => selectTrack(track)}
              >
                <span className={`journey-tab-icon ${track.color}`}><TrackIcon /></span>
                <span className="journey-tab-copy">
                  <small>0{index + 1} · {track.time}</small>
                  <strong>{track.title}</strong>
                </span>
                <ChevronRight />
              </Button>
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
                onClick={() => setActiveLessonIndex(index)}
              >
                <span className="step-index">{done ? <Check /> : index + 1}</span>
                <div>
                  <small>{done ? "LESSON COMPLETE" : `OPEN LESSON ${index + 1}`}</small>
                  <strong>{step}</strong>
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
              onClick={() => setActiveLessonIndex(firstIncomplete)}
            >
              {missionComplete ? "Continue mission" : "Begin mission"} <ArrowRight />
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
    `Before you start: ${lesson.before.join(". ")}.`,
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

          <section className="lesson-section before-section">
            <div className="lesson-section-title">
              <ListChecks />
              <div><span>01</span><h2>Before you start</h2></div>
            </div>
            <div className="before-grid">
              {lesson.before.map((item) => <div key={item}><Check /> {item}</div>)}
            </div>
          </section>

          {(lesson.image || lesson.videoId) && (
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
          )}

          <section className="lesson-section actions-section">
            <div className="lesson-section-title">
              <Play />
              <div><span>02</span><h2>Do this in Live Hub</h2></div>
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
          </section>

          <section className="lesson-section success-section">
            <div className="lesson-section-title">
              <CircleCheckBig />
              <div><span>03</span><h2>You’re done when…</h2></div>
            </div>
            <div className="success-grid">
              {lesson.success.map((item) => <div key={item}><CheckCircle2 /> {item}</div>)}
            </div>
          </section>

          <section className="lesson-section troubleshooting-section">
            <div className="lesson-section-title">
              <AlertTriangle />
              <div><span>04</span><h2>If it doesn’t work</h2></div>
            </div>
            <div className="troubleshooting-list">
              {lesson.troubleshooting.map((item) => (
                <div className="troubleshooting-item" key={item.problem}>
                  <strong>{item.problem}</strong>
                  <p>{item.fix}</p>
                </div>
              ))}
            </div>
          </section>

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
              <a href="https://techdocs.audiocodes.com/livehub/Content/LiveHub/managing_call_history_new.htm" target="_blank" rel="noreferrer">
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
            <a href="https://services.audiocodes.com/app/utils/login_form/redirect/tools/session/" target="_blank" rel="noreferrer">Premium Service Portal <ExternalLink /></a>
          </Button>
        </div>
      </section>
    </div>
  );
}

function LibraryView() {
  const categories = ["All", "Get started", "Concepts", "Build", "Connect", "Route", "Operate", "Develop", "Support"];
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
          <a href="https://techdocs.audiocodes.com/livehub/" target="_blank" rel="noreferrer">Browse all TechDocs <ExternalLink /></a>
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
