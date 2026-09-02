const TECHDOCS_BASE = "https://techdocs.audiocodes.com/livehub";

/**
 * One maintained source for every official-documentation link in the Academy.
 * Keeping these URLs here prevents individual lessons from drifting to old
 * Help Center, staging, or placeholder pages.
 */
export const TECH_DOCS = {
  home: `${TECHDOCS_BASE}/#LiveHub/livehub-intro.htm?TocPath=_____1`,
  dashboard: `${TECHDOCS_BASE}/Content/LiveHub/Live%20Hub%20Dashboard.htm`,
  aiAgent: `${TECHDOCS_BASE}/Content/LiveHub/LiveHub-AIAgent.htm`,
  aiTools: `${TECHDOCS_BASE}/content/ai-agents/Tools.htm`,
  agentAssistMode: `${TECHDOCS_BASE}/content/ai-agents/Agent%20assist%20mode.htm`,
  botFeatures: `${TECHDOCS_BASE}/Content/LiveHub/byoc_cloud_managing_features.htm`,
  botTest: `${TECHDOCS_BASE}/Content/LiveHub/Testing%20your%20Bot.htm`,
  voiceChannels: `${TECHDOCS_BASE}/Content/LiveHub/voice-channels.htm`,
  phoneNumbers: `${TECHDOCS_BASE}/Content/LiveHub/managing_numbers.htm`,
  sipConnections: `${TECHDOCS_BASE}/Content/LiveHub/sip_connections.htm`,
  teams: `${TECHDOCS_BASE}/Content/LiveHub/Creating%20Teams%20connection.htm`,
  whatsapp: `${TECHDOCS_BASE}/Content/LiveHub/buy-whats-app-number.htm`,
  clickToCall: `${TECHDOCS_BASE}/Content/LiveHub/Configuring-webrtc-click-to-call.htm`,
  routing: `${TECHDOCS_BASE}/Content/LiveHub/Defining%20Routing.htm`,
  agentAssist: `${TECHDOCS_BASE}/Content/LiveHub/Agent%20assist.htm`,
  translation: `${TECHDOCS_BASE}/Content/LiveHub/Voice-translation.htm`,
  translationCreate: `${TECHDOCS_BASE}/Content/LiveHub/Create-Voice-translation.htm`,
  translationAutomatic: `${TECHDOCS_BASE}/Content/LiveHub/Configure-automatic-translation.htm`,
  translationDynamic: `${TECHDOCS_BASE}/Content/LiveHub/Configure-dynamic-translation.htm`,
  outboundCalling: `${TECHDOCS_BASE}/Content/LiveHub/byoc_Outbound%20Call.htm`,
  outboundAutomation: `${TECHDOCS_BASE}/Content/LiveHub/Campaign-Dialer.htm`,
  callHistory: `${TECHDOCS_BASE}/Content/LiveHub/managing_call_history_new.htm`,
  callTranscript: `${TECHDOCS_BASE}/Content/LiveHub/byoc_Call%20Transcript.htm`,
  billing: `${TECHDOCS_BASE}/Content/LiveHub/billing.htm`,
  userGroups: `${TECHDOCS_BASE}/Content/VAIC/User-Groups.htm`,
  apiClients: `${TECHDOCS_BASE}/Content/VAIC/api-introduction.htm`,
  restApi: `${TECHDOCS_BASE}/Content/LiveHub/API/API-Endpoints.htm`,
  restAuthentication: `${TECHDOCS_BASE}/Content/LiveHub/API/api-security.htm`,
  support: `${TECHDOCS_BASE}/#LiveHub/livehub-intro.htm?TocPath=_____1`,
  releaseNotes: `${TECHDOCS_BASE}/#LiveHub/Release%20Notes.htm`,
} as const;

