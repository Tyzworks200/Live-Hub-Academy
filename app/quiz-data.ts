import { TECH_DOCS } from "./techdocs";

export type KnowledgeQuestion = {
  id: string;
  question: string;
  options: string[];
  correctIndex: number;
  explanation: string;
  sourceUrl: string;
};

/**
 * Customer-facing questions selected from the supplied Live Hub bootcamp quiz.
 * Commercial figures, regional availability, and package entitlements are intentionally
 * not scored here because they can change independently of the product workflow.
 */
export const knowledgeQuestions: KnowledgeQuestion[] = [
  {
    id: "generic-sip",
    question: "Your SIP trunk or contact center is not in the provider list. What should you do?",
    options: [
      "Choose the matching Generic SIP option and use provider-supplied settings",
      "Choose a similar provider template and change its name",
      "Stop—the provider cannot be connected to Live Hub",
      "Create a routing rule before creating the connection",
    ],
    correctIndex: 0,
    explanation:
      "Use Generic SIP Trunk, Generic Contact Center, or Generic UC for an unlisted provider. Generic setup requires the real transport, authentication, address, and number-format requirements from that provider.",
    sourceUrl: TECH_DOCS.sipConnections,
  },
  {
    id: "debug-call",
    question: "A call from a SIP trunk to a bot fails. What is the strongest first investigation?",
    options: [
      "Recreate the bot and trunk immediately",
      "Check SIP connectivity, the matched route, the call record, SIP ladder, and transcript or AI logs",
      "Ask only the external SIP provider",
      "Open a ticket without a Call ID",
    ],
    correctIndex: 1,
    explanation:
      "Follow the call through each layer. The exact Calls record shows how it ended; the matched route, SIP ladder, transcript, and AI logs show where the first failure occurred.",
    sourceUrl: TECH_DOCS.callHistory,
  },
  {
    id: "support-evidence",
    question: "Which information makes a Live Hub support request investigation-ready?",
    options: [
      "Only the account name",
      "Only a screenshot of the error",
      "Issue and impact, timestamp, account ID, Call or Session ID, plus relevant evidence",
      "No details are needed because support can see all call content",
    ],
    correctIndex: 2,
    explanation:
      "Precise identifiers let support find the right event. Include only relevant recordings, transcripts, or logs, because support does not automatically have standing access to every call artifact.",
    sourceUrl: TECH_DOCS.support,
  },
  {
    id: "public-addresses",
    question: "Where do you find the Live Hub addresses and certificate for a SIP connection?",
    options: [
      "In the Billing page",
      "In the SIP connection Info view",
      "Inside every routing rule",
      "Only by requesting them from engineering",
    ],
    correctIndex: 1,
    explanation:
      "The SIP connection Info view contains its FQDN, signaling and media addresses, certificate, limits, and available REGISTER or OPTIONS troubleshooting tools.",
    sourceUrl: TECH_DOCS.sipConnections,
  },
  {
    id: "routing-conditions",
    question: "When should you add calling-number or called-number conditions to a routing rule?",
    options: [
      "When calls from the same origin must reach different destinations",
      "To change the account password",
      "To enable a speech provider",
      "Conditions are never needed",
    ],
    correctIndex: 0,
    explanation:
      "Conditions narrow the match. Start with one exact test number; introduce prefixes or wildcards only after the baseline call works.",
    sourceUrl: TECH_DOCS.routing,
  },
  {
    id: "routing-order",
    question: "Why does routing-rule order matter?",
    options: [
      "It changes only how the table looks",
      "A broad rule can match before the more specific rule you intended",
      "It matters only for deleted rules",
      "Live Hub always ignores broad rules",
    ],
    correctIndex: 1,
    explanation:
      "Put exact and narrow rules before broad prefix or catch-all rules so the intended path is evaluated first.",
    sourceUrl: TECH_DOCS.routing,
  },
  {
    id: "number-format",
    question: "A provider expects numbers without the + prefix. Where should you align that format?",
    options: [
      "The SIP connection Numbers tab",
      "The user profile",
      "The AI Agent prompt",
      "The billing report",
    ],
    correctIndex: 0,
    explanation:
      "Configure the provider's required E.164 presentation and national format on the SIP connection. Confirm the actual calling and called values in the SIP ladder.",
    sourceUrl: TECH_DOCS.genericSip,
  },
  {
    id: "two-directions",
    question: "You need calls to travel both from a bot to SIP and from SIP to the bot. What is the clean setup?",
    options: [
      "One catch-all rule with no origin",
      "Two explicit rules—one for each direction",
      "A single phone number with no routing",
      "Two copies of the same rule",
    ],
    correctIndex: 1,
    explanation:
      "Each direction has a different origin and destination. Create and test each rule independently before adding optional services.",
    sourceUrl: TECH_DOCS.routing,
  },
  {
    id: "red-sip-status",
    question: "Registration or keep-alive is enabled and the SIP connection turns red. What next?",
    options: [
      "Change every Advanced setting",
      "Delete the connection",
      "Open SIP Info and inspect the last REGISTER or OPTIONS ladder",
      "Add a second routing rule",
    ],
    correctIndex: 2,
    explanation:
      "The response to REGISTER or OPTIONS identifies the first signaling failure. Check address, port, transport, credentials, firewall, and the provider response before changing configuration.",
    sourceUrl: TECH_DOCS.sipConnections,
  },
  {
    id: "prove-sip-first",
    question: "What should you prove before combining a new SIP connection with routing?",
    options: [
      "That the connection card exists",
      "A direct controlled test and understandable evidence in Calls",
      "That every optional codec is enabled",
      "That a broad wildcard rule is active",
    ],
    correctIndex: 1,
    explanation:
      "A saved object is not proof. Run the smallest direct test available and understand its completion status and SIP ladder before adding another layer.",
    sourceUrl: TECH_DOCS.sipConnections,
  },
  {
    id: "call-or-transfer",
    question: "What does the Type field decide in a routing rule?",
    options: [
      "Whether the rule begins with a new call or a transfer event",
      "Whether the account is prepaid or postpaid",
      "Which speech model the bot uses",
      "Which user group can sign in",
    ],
    correctIndex: 0,
    explanation:
      "Type determines the event that triggers the rule. It also changes Call Origin to Transferred by and affects which services are available.",
    sourceUrl: TECH_DOCS.routing,
  },
  {
    id: "advanced-bot",
    question: "What belongs in a bot connection's Advanced settings?",
    options: [
      "Every configuration value, even when Live Hub has a dedicated field",
      "Framework-specific configuration that does not have a dedicated Live Hub setting",
      "SIP provider credentials",
      "Teams user licenses",
    ],
    correctIndex: 1,
    explanation:
      "Use dedicated Live Hub fields where they exist. Advanced settings are for supported framework-specific properties that do not have their own product control.",
    sourceUrl: TECH_DOCS.botFeatures,
  },
];
