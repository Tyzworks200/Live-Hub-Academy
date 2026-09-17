(function upgradeAcademyData(){
  const D = window.DATA;
  if(!D) return;

  const replaceTrack = (id, values) => {
    const track = D.tracks.find(item => item.id === id);
    if(track) Object.assign(track, values);
  };

  const lesson = (id, title, objective, duration, path, before, actions, skipForNow, success, troubleshooting, commonMistake, docUrl, extra={}) => ({
    id, title, objective, duration, path, before, actions, skipForNow, success, troubleshooting, commonMistake, docUrl, ...extra
  });

  const numberLesson = lesson(
    "request-first-number",
    "Buy the first number without creating a provisioning project",
    "Use the fast US or UK purchase flow, then leave the new number unassigned until its routing Mission.",
    "6 min",
    ["Voice channels", "Phone numbers", "Add new phone number"],
    [
      "The destination service already exists in the same Live Hub region",
      "A Billing Administrator has confirmed the monthly number charge",
      "You can choose a United States or United Kingdom number for this first run"
    ],
    [
      {title:"Open Phone numbers", instruction:"In the navigation pane, expand Voice channels, select Phone numbers, and click Add new phone number."},
      {title:"Choose the fast first-run country", instruction:"Choose United States or United Kingdom. These are the self-service Academy route: select the available number and review the monthly charge before you continue."},
      {title:"Match the operating region", instruction:"Choose the same Live Hub region as the AI Agent, bot connection, SIP connection, or Teams connection that will receive the call."},
      {title:"Add the number", instruction:"Confirm the purchase. When the number appears on the Phone numbers screen, copy its exact E.164 value and confirm its region."},
      {title:"Stop at unassigned", instruction:"A new number is supposed to arrive unassigned. Do not search for an assignment button on the number card—the Routing page creates the connection."},
      {title:"Use the assisted route for other countries", instruction:"If you need a country other than the United States or United Kingdom, leave this fast path. Complete the country request form and wait for the AudioCodes administrator/provisioning process before building a route around that number."}
    ],
    ["Non-US/UK country paperwork", "Several numbers", "Outbound number eligibility", "Number transfer or porting"],
    [
      "A US or UK number is visible on the Phone numbers screen",
      "The number is in the same region as its future destination",
      "The exact E.164 number has been recorded",
      "The card is unassigned and ready for Routing"
    ],
    [
      {problem:"The country you need is not in the fast path", fix:"Use the country request form and wait for administrator provisioning. Do not buy an unrelated number just to continue."},
      {problem:"The number is marked unassigned", fix:"That is expected. A routing rule—not the number card—connects it to an AI Agent, bot, SIP connection, Teams connection, or other destination."},
      {problem:"The destination does not appear later in Routing", fix:"Confirm that the number and destination were created in the same Live Hub region."}
    ],
    "Trying to assign the number from its card. Purchase creates the channel; Routing connects that channel to a destination.",
    "https://techdocs.audiocodes.com/livehub/Content/LiveHub/Purchasing%20Phone%20Numbers.htm",
    {
      opening:{label:"THE SHORTCUT", problem:"A first successful call should not become a country-provisioning project. Use a US or UK number for the first proof; handle every other country as an assisted provisioning task."},
      capabilityGained:"You now have a real, region-matched public origin that is ready to route."
    }
  );

  D.lessonsByTrack["phone-number"] = [numberLesson];
  const flagshipNumberIndex = D.lessonsByTrack["voice-agent"].findIndex(item => item.id === "bright-smile-number");
  if(flagshipNumberIndex >= 0){
    D.lessonsByTrack["voice-agent"][flagshipNumberIndex] = {
      ...numberLesson,
      id:"bright-smile-number",
      title:"Give Bright Smile a US or UK phone number",
      objective:"Purchase one self-service number in the agent's region and keep it unassigned until the final routing Mission.",
      capabilityGained:"Bright Smile now has a real public number, in the correct region, ready to become the call origin."
    };
  }

  replaceTrack("phone-number", {
    description:"Buy a self-service US or UK number, confirm its region, and hand it cleanly to Routing. Other countries use an assisted request.",
    outcome:"A real US or UK number is visible, unassigned, and ready to become a routing origin.",
    evidence:"The exact E.164 number, its Live Hub region, and its unassigned status.",
    time:"6 min",
    phases:["BUY", "VERIFY", "HAND TO ROUTING"]
  });

  replaceTrack("routing", {
    description:"Build a simple Call rule first, prove it, then add Transfer behavior and production services without losing the baseline.",
    scenario:"A customer calls your published number. Live Hub must recognize where that call came from, choose the correct destination, and preserve the right behavior if the call later transfers.",
    outcome:"A real call follows the intended Call rule, a transfer follows its own Transfer rule, and every advanced service is intentional.",
    evidence:"A successful Call ID, the matched Call rule, and—when used—a separate verified Transfer rule.",
    time:"36 min",
    phases:["UNDERSTAND", "CALL RULE", "PROVE", "TRANSFER", "SERVICES", "CONTROL"]
  });

  const routingDoc = "https://techdocs.audiocodes.com/livehub/Content/LiveHub/Managing%20Routing.htm";
  D.lessonsByTrack.routing = [
    lesson(
      "routing-model",
      "Explain the call before you touch the rule",
      "Write one plain sentence naming what enters Live Hub, what should receive it, and what proof will show that it worked.",
      "4 min",
      ["Routing", "Routing rules"],
      ["A ready origin: phone number, SIP connection, Teams connection, bot, or other voice channel", "A ready destination in the same region"],
      [
        {title:"Name the origin", instruction:"Say where this call enters Live Hub. For the flagship run: “The call enters through the Bright Smile US or UK phone number.”"},
        {title:"Name the destination", instruction:"Say what must handle the call. For the flagship run: “Bright Smile Receptionist answers it.”"},
        {title:"Choose the rule type", instruction:"Use Type = Call for the original call. Use Type = Transfer only when an existing call is transferred later. These are two different matching moments."},
        {title:"Name the proof", instruction:"Decide what success will leave behind: a successful Call record, its Call ID, and the matching routing rule."}
      ],
      ["Recording", "Voice translation", "Agent Assist", "Number customization", "Transfer rules", "Routing groups"],
      ["The origin is named", "The destination is named", "Type = Call is chosen for the first route", "The proof is named"],
      [{problem:"Origin and destination sound interchangeable", fix:"Origin answers “where did Live Hub receive this call from?” Destination answers “where should Live Hub send it now?”"}],
      "Starting in the form before both ends exist. Live Hub can create a rule only after its source and destination are ready.",
      routingDoc,
      {opening:{label:"THE MENTAL MODEL", problem:"A routing rule is a decision, not a cable: when this Call or Transfer comes from this origin and matches these conditions, send it to this destination."}, capabilityGained:"You can describe the route in one testable sentence before configuring it."}
    ),
    lesson(
      "routing-create",
      "Build the plain Call rule",
      "Connect one real origin to one destination with no optional service hiding the basic result.",
      "7 min",
      ["Routing", "Routing rules", "Add new routing rule"],
      ["The origin and destination already exist", "Both use the same Live Hub region", "You know the exact called number if this rule needs one"],
      [
        {title:"Choose the region", instruction:"Select the region shared by the origin and destination."},
        {title:"Set Type to Call", instruction:"Under Origin, choose Type = Call. Then use Call origin to select the phone number, SIP connection, Teams connection, bot, or other source that receives the original call."},
        {title:"Use conditions only to distinguish traffic", instruction:"Leave Calling number and Called number empty if every call from this origin should match. Otherwise use the full number, a short prefix ending in *, or * for any number."},
        {title:"Choose Route to", instruction:"Under Call destination, select the exact AI Agent, bot, SIP connection, Teams connection, phone number, service number, or routing group that should receive the call."},
        {title:"Keep services off", instruction:"For this first proof, leave recording, external recording, Agent Assist, Voice Translation, and number customization off."},
        {title:"Create and check order", instruction:"Click Create. The new rule appears at the top. Live Hub evaluates rules from top to bottom and stops at the first match, so confirm this rule does not steal traffic from a more specific rule."}
      ],
      ["Transfer behavior", "Recording", "Agent Assist", "Voice Translation", "Number rewriting", "Failover groups"],
      ["Type is Call", "Call origin is the intended incoming source", "Call destination is correct", "The new rule is in a safe order"],
      [
        {problem:"The route matches too many calls", fix:"Add a Calling number or Called number condition, or move a more specific rule above it."},
        {problem:"The destination is missing", fix:"Confirm it exists in the same region and is ready before reopening the rule."}
      ],
      "Turning on every service while proving the first route. A failed call then has too many possible causes.",
      routingDoc,
      {opening:{label:"THE FIRST WIN", problem:"A customer calls your number, but an unassigned number has nowhere to go. Build the smallest possible Call rule first."}, capabilityGained:"Live Hub now has one clear Call decision from a real origin to a real destination."}
    ),
    lesson(
      "routing-test",
      "Call it and prove which rule won",
      "Make one controlled call and use Calls—not memory—to prove the matched route and destination.",
      "6 min",
      ["Calls", "Call history"],
      ["The plain Call rule is active", "A phone or source that can reach the configured origin", "A unique test phrase or timestamp"],
      [
        {title:"Make the test call", instruction:"Call the US or UK number, or originate the controlled call from the configured SIP or Teams source."},
        {title:"Use a unique phrase", instruction:"Say something easy to find in the transcript, such as “Academy routing proof,” then complete the call normally."},
        {title:"Open the newest call", instruction:"Go to Calls, open the record at the exact test time, and copy its Call ID."},
        {title:"Verify the decision", instruction:"Confirm the expected origin, destination, routing result, and completion status. If it failed, identify the first failing layer before editing anything."}
      ],
      ["A second route", "Transfer", "Recording", "Broad production traffic"],
      ["The intended destination answered", "A successful Call record exists", "The Call ID is saved", "The expected rule and destination are visible"],
      [{problem:"A different rule matched", fix:"Review rule order and overlapping origin/number conditions. The first matching rule wins."}, {problem:"No record appears", fix:"Confirm the call reached Live Hub and search by the exact time, calling number, and called number."}],
      "Changing several rule fields before opening the failed Call record. Preserve the evidence first.",
      "https://techdocs.audiocodes.com/livehub/Content/LiveHub/Calls.htm",
      {opening:{label:"THE PROOF", problem:"A ringing destination is encouraging, but Call History is the evidence that tells you what Live Hub actually matched."}, capabilityGained:"You have one evidence-backed route and its Call ID."}
    ),
    lesson(
      "routing-transfer",
      "Add the transfer as a second decision",
      "Create a dedicated Transfer rule so a live call can move to the right human or service without changing the original Call rule.",
      "7 min",
      ["Routing", "Routing rules", "Add new routing rule"],
      ["The original Call rule already works", "The bot, agent, or service that initiates the transfer exists", "The transfer destination exists"],
      [
        {title:"Create a separate rule", instruction:"Add a new routing rule. Do not edit the proven Call rule into a transfer rule."},
        {title:"Set Type to Transfer", instruction:"Under Origin, choose Type = Transfer. The next selector changes from Call origin to Transferred by."},
        {title:"Choose Transferred by", instruction:"Select the AI Agent, bot, SIP connection, Teams connection, or service that requests the transfer."},
        {title:"Choose the transfer destination", instruction:"Under Route to, select the human-facing SIP, Teams, phone, or routing-group destination that should receive the transferred call."},
        {title:"Test the handoff", instruction:"Place a controlled call, trigger the transfer, and inspect all related records. Multiple records can be normal for a transfer."}
      ],
      ["Transfer-specific number rewriting", "Assist or translation continuity", "Routing-group failover"],
      ["A separate Transfer rule exists", "Transferred by names the correct initiator", "The destination receives the transferred call", "The related Call IDs are saved"],
      [{problem:"The transfer never matches", fix:"Check Type = Transfer and Transferred by. A Call rule matches the original leg, not the later transfer decision."}],
      "Using Call origin for a transfer. Once Type is Transfer, Live Hub needs to know which service transferred the call.",
      routingDoc,
      {opening:{label:"THE SECOND DECISION", problem:"The AI answers correctly, but the caller now needs a human. The original Call rule did its job; the transfer needs its own rule."}, capabilityGained:"A proven call can now hand off through a dedicated Transfer rule."}
    ),
    lesson(
      "routing-services",
      "Add one production service at a time",
      "Extend the proven route with recording, external recording, Agent Assist, or Voice Translation—and keep every addition observable.",
      "6 min",
      ["Routing", "Routing rules", "Edit"],
      ["The baseline Call or Transfer rule already works", "Consent, retention, and privacy decisions are approved", "Any required recorder, assist bot, or translation profile already exists"],
      [
        {title:"Pick one service", instruction:"Edit the proven rule and enable only the next capability you actually need."},
        {title:"Choose recording deliberately", instruction:"Live Hub recording stores the call in Live Hub. External recording uses a Generic Recording Server over SIPREC and is available for Type = Call only when that recorder exists."},
        {title:"Choose Agent Assist or Voice Translation", instruction:"Select the configured assist bot or translation profile. These two services are mutually exclusive on the same rule—enabling one disables the other."},
        {title:"Preserve behavior across transfer", instruction:"If Assist or Voice Translation must continue after transfer, configure the same service on the Transfer rule. If the Transfer rule omits it, Live Hub stops it after transfer."},
        {title:"Retest and inspect evidence", instruction:"Place one new call and verify the expected recording, assist output, or translated conversation before adding another service."}
      ],
      ["Enabling several services together", "Production-wide rollout", "Changing the baseline conditions"],
      ["Exactly one advanced service was added", "A new controlled call succeeded", "The expected artifact or behavior is visible", "The baseline route still matches correctly"],
      [{problem:"Agent Assist and Voice Translation cannot both be selected", fix:"That is expected. They are mutually exclusive on one routing rule; choose the experience this route needs."}, {problem:"The service stops after transfer", fix:"Configure the same Assist or Voice Translation setting on the Transfer rule."}],
      "Treating optional services as part of basic routing. Prove the route first, then add one controlled variable.",
      routingDoc,
      {opening:{label:"THE UPGRADE", problem:"The call already works. Now you can add one production capability without confusing routing failure with service failure."}, capabilityGained:"The proven route now carries one intentionally tested production service."}
    ),
    lesson(
      "routing-control",
      "Control matching, numbers, blocking, and failover",
      "Make the route production-safe with precise conditions, number handling, block lists, tags, or a routing group—only where the call story requires them.",
      "6 min",
      ["Routing", "Routing rules / Routing groups / Call block lists"],
      ["The baseline route and any Transfer rule are already proven", "You know the exact production need being added"],
      [
        {title:"Make the match as narrow as needed", instruction:"Use Calling number and Called number conditions only when the origin alone is not specific enough. Keep SIP prefixes short."},
        {title:"Rewrite only with a reason", instruction:"Expand Number customization to replace the calling, called, or service number. Leave a field empty to pass the original value through."},
        {title:"Block before routing", instruction:"Use Call block lists for unwanted traffic so blocked calls are rejected before routing, billing, or CPS counting. Use Reject call in a rule for a specific matching decision."},
        {title:"Add failover as a destination", instruction:"Create a Routing group with prioritized destinations, then choose that group as the rule's destination. The lower priority number is tried first."},
        {title:"Use tags for operations", instruction:"Add a short tag when reporting or billing needs to categorize this call traffic. Tags apply to calls, not transfers."},
        {title:"Retest every branch", instruction:"Test the normal destination, the blocked case, and the failover case separately. Save a Call ID for each behavior you rely on."}
      ],
      ["Unrelated number manipulation", "Broad wildcards", "More than one untested failover destination"],
      ["Every condition has a business reason", "Any number rewrite is documented", "Blocked traffic is rejected as designed", "Failover order is proven with Call IDs"],
      [{problem:"A broad rule steals a specific call", fix:"Move the specific rule above the broad rule or narrow the broad rule's conditions."}, {problem:"Failover creates multiple records", fix:"That can be expected. Search related records by SID to see the complete attempt sequence."}],
      "Adding wildcards, rewrites, and failover together. Each one changes how evidence should be interpreted.",
      routingDoc,
      {opening:{label:"THE PRODUCTION EDGE", problem:"A working route becomes reliable only when its boundaries—what matches, what is blocked, and what happens on failure—are explicit."}, capabilityGained:"Your route has clear production boundaries and verifiable failover behavior."}
    )
  ];

  replaceTrack("operate", {
    title:"Monitor Calls Before Customers Complain",
    description:"Turn on alarm delivery, set a sensible baseline, read alarm history, and attach every alert to real call evidence.",
    role:"Operations teams, service owners, and support engineers",
    scenario:"The service is live. Your job is to learn about failed calls, poor quality, capacity pressure, or low funds before the customer opens a ticket.",
    outcome:"The right people receive actionable alerts and can move from an alarm to the affected calls and an owner.",
    evidence:"Email delivery settings, saved thresholds, one Alarm History review, and a linked Call ID or operational response.",
    reward:"Live Hub Watchkeeper",
    time:"32 min",
    phases:["DELIVER", "BASELINE", "THRESHOLDS", "HISTORY", "CALLS", "RESPOND"]
  });

  const alarmDoc = "https://techdocs.audiocodes.com/livehub/#LiveHub/Define-alarm-thresholds.htm?TocPath=Alarm%2520%2526%2520alerts%2520management%257C_____3";
  D.lessonsByTrack.operate = [
    lesson("operate-dashboard","Read the account's live pulse","Use the Dashboard and current-account selector to establish what you are monitoring before configuring alerts.","4 min",["Dashboard"],["Access to the intended Current account"],[
      {title:"Confirm Current account",instruction:"Read the account name in the top bar. Calls, resources, alarms, and billing data belong to the account currently selected."},
      {title:"Scan active alarms",instruction:"Use the Active alarms panel to see whether Critical, Major, Minor, or Warning conditions already exist."},
      {title:"Read call statistics",instruction:"Check the selected interval, call count, success indicators, concurrency, and call-attempt rate. This is the baseline you will protect."}
    ],["Changing thresholds","Clearing alarms","Investigating old calls"],["The correct account is selected","Current active alarms are noted","The dashboard interval and baseline are recorded"],[{problem:"The dashboard looks empty",fix:"Confirm the current account and time interval, then check whether the account has made calls in that period."}],"Reading a healthy child account while believing you are viewing the parent—or the reverse.","https://techdocs.audiocodes.com/livehub/Content/LiveHub/Live%20Hub%20Dashboard.htm",{opening:{label:"THE BASELINE",problem:"An alarm is meaningful only in the correct account and against a baseline you recognize."},capabilityGained:"You know which account and traffic baseline you are protecting."}),
    lesson("operate-alarm-delivery","Make sure alarms reach a human","Enable alarm email forwarding and add the operational contacts who must receive changes.","5 min",["Settings","Advanced / Contacts"],["Account Manager or the required settings permission","Up to five agreed recipient addresses"],[
      {title:"Enable forwarding",instruction:"Go to Settings → Advanced. Set Forward alarms via E-mail to Enabled and click Update."},
      {title:"Add recipients",instruction:"Open Settings → Contacts and add the operational email addresses. Live Hub supports up to five recipients."},
      {title:"Set ownership",instruction:"For each recipient, agree who acknowledges Major alarms, who investigates, and when support is contacted."}
    ],["Threshold tuning","SMS or custom integrations","A large mailing list"],["Forward alarms via E-mail is Enabled","At least one monitored recipient is saved","Major-alarm ownership is named"],[{problem:"Thresholds fire but nobody receives email",fix:"Check both the Advanced forwarding setting and the Contacts list. Thresholds alone do not configure recipients."}],"Configuring thresholds before proving that alarm changes can reach an owner.",alarmDoc,{opening:{label:"THE DELIVERY GAP",problem:"A perfect threshold is useless if the notification never reaches a person who owns the response."},capabilityGained:"Alarm changes now have a delivery path and a named owner."}),
    lesson("operate-alarm-thresholds","Set the first useful thresholds","Start with failed calls and poor-quality calls, then tune Minor and Major values from real traffic.","7 min",["Alarms","Thresholds"],["Alarm email delivery is configured","A recent traffic baseline is available","Permission to view and update alarm thresholds"],[
      {title:"Open Thresholds",instruction:"Go to Alarms → Thresholds. Live Hub evaluates the configured metrics every five minutes."},
      {title:"Start with call health",instruction:"Select Failed calls (%) and Poor quality calls (%). For both, use Exceeds threshold because a higher rate is worse."},
      {title:"Use a practical starting point",instruction:"For a first deployment, start with Minor = 10% and Major = 16%, then tune these values after observing normal traffic. Do not treat these numbers as universal production policy."},
      {title:"Understand direction",instruction:"Use Drops below only when a low value is the danger, such as unexpectedly short average call duration or remaining funds."},
      {title:"Add capacity or cost deliberately",instruction:"Available metrics also include average call duration, maximum concurrent calls, maximum call attempts per second, rejected calls, monthly cost, and remaining funds. Billing thresholds are available only on standalone or parent accounts."},
      {title:"Click Update",instruction:"Save the thresholds and record why each one exists and who owns it."}
    ],["Every available metric","Perfect final thresholds","Billing thresholds on a subaccount","Automatic remediation"],["Failed calls and poor quality calls are selected","Minor and Major values are saved","Threshold direction matches the risk","Every enabled threshold has an owner"],[{problem:"Normal traffic creates constant noise",fix:"Review the baseline and raise or narrow the threshold. Minor should warn early without making every fluctuation urgent."},{problem:"Billing thresholds are missing",fix:"They are available only on standalone or parent accounts; subaccounts use the parent's billing."}],"Copying sample values into production without observing the account's normal traffic pattern.",alarmDoc,{opening:{label:"THE EARLY WARNING",problem:"If customers report the outage first, monitoring is late. Your first thresholds should catch a rising failure or quality trend without flooding the team."},capabilityGained:"The account now turns call-health changes into Minor and Major alarms."}),
    lesson("operate-alarm-history","Read what changed—not only what is active","Use Alarm History to reconstruct when a condition was raised, changed severity, and cleared.","5 min",["Alarms","Alarms history"],["At least one threshold is configured","A known time window to review"],[
      {title:"Open Alarm History",instruction:"Go to Alarms → Alarms history. A cleared alarm remains in history even when the Active alarms view is empty."},
      {title:"Read the sequence",instruction:"Compare time, severity, description, region, and the exact metric value. Look for Minor → Major → Cleared rather than treating each row as unrelated."},
      {title:"Know the retention",instruction:"Live Hub keeps the last 1,000 alarms per account. Export the filtered history as CSV when an investigation or review needs a durable record."},
      {title:"Interpret clearing correctly",instruction:"Threshold alarms clear automatically after the metric returns past the configured boundary. A cleared alarm is evidence of recovery, not evidence that nothing happened."}
    ],["Changing thresholds during the first read","Assuming no active alarm means no incident"],["The raise/clear sequence is understood","The exact value and region are captured","A CSV is exported when durable evidence is required"],[{problem:"There is no active alarm now",fix:"Search Alarm History around the reported time. Transient conditions may already have cleared."}],"Looking only at Active alarms and missing a condition that already recovered.",alarmDoc,{opening:{label:"THE TIMELINE",problem:"A customer reported a failure at 13:25, but the dashboard is green now. Alarm History tells you what crossed a threshold at that exact time."},capabilityGained:"You can reconstruct an alarm's lifecycle instead of relying on the current color."}),
    lesson("operate-call-evidence","Connect the alarm to real calls","Move from a metric-level alert to the exact calls, transcripts, recordings, SIP ladders, or AI logs that explain it.","6 min",["Calls","Call history"],["The alarm time, region, metric, and severity","Permission for the required call artifacts"],[
      {title:"Narrow the time window",instruction:"Filter Calls around the alarm's raised time and region. Start with the smallest useful window."},
      {title:"Open representative calls",instruction:"Compare one failed or poor-quality call with one normal call from the same route when possible."},
      {title:"Collect the right layer",instruction:"Use status and routing first, SIP Ladder for telephony signaling, transcript or recording for conversation/media evidence, and AI logs for agent behavior."},
      {title:"Write one evidence sentence",instruction:"State what failed, where, and what proves it—for example: “At 13:25, calls from Provider-SIP reached Live Hub but the destination returned 503; Call ID …”"}
    ],["Downloading every artifact","Changing several systems at once","Sharing call content without approval"],["At least one relevant Call ID is saved","The failing layer is named","The evidence sentence is written","Sensitive artifacts are handled according to policy"],[{problem:"The alarm affects many calls",fix:"Sample calls across the alarm window and group them by route, destination, or status before choosing a fix."}],"Treating the alarm description as the root cause. An alarm identifies a metric; the call evidence identifies the failing layer.","https://techdocs.audiocodes.com/livehub/Content/LiveHub/Calls.htm",{opening:{label:"THE INVESTIGATION",problem:"Failed calls crossed Major, but the percentage alone cannot tell you whether routing, SIP, speech, or the destination failed."},capabilityGained:"You can move from an account alarm to the exact evidence and failing layer."}),
    lesson("operate-response","Turn the alert into an operating habit","Create a lightweight response loop so every serious alarm has an owner, evidence, a controlled change, and proof of recovery.","5 min",["Alarms","Alarms history / Calls"],["One configured alarm","One named owner","Access to Call History"],[
      {title:"Acknowledge",instruction:"Record who owns the alarm and when investigation started."},
      {title:"Capture before changing",instruction:"Save the alarm row, time zone, region, Call IDs, and relevant route or resource name."},
      {title:"Change one variable",instruction:"Make the smallest reversible fix and avoid simultaneous changes that destroy causal evidence."},
      {title:"Retest",instruction:"Generate a controlled call, save the new Call ID, and confirm the condition recovers or the alarm clears."},
      {title:"Escalate cleanly",instruction:"If support is needed, send issue description, timestamp and time zone, account ID, relevant session or Call IDs, and approved recordings/transcripts/logs."}
    ],["A complex incident-management platform","Automatic remediation","Production-wide changes without a test"],["An alarm owner and response note exist","Before-and-after Call IDs are saved","The recovery is visible","The support package is ready if needed"],[{problem:"The alarm cleared before the team responded",fix:"Keep the history and Call IDs. Automatic clearing proves the metric recovered; it does not remove the need to understand a recurring Major alarm."}],"Closing an alarm because it is green again without preserving the evidence needed to prevent recurrence.","https://techdocs.audiocodes.com/livehub/Content/LiveHub/Vewing%20Alarms.htm",{opening:{label:"THE OPERATING LOOP",problem:"Monitoring becomes useful only when an alert reliably produces ownership, evidence, one controlled change, and proof."},capabilityGained:"Your team now has a repeatable alarm-to-evidence response loop."})
  ];

  replaceTrack("account-admin", {
    title:"Create Accounts, Users & Access",
    description:"Choose the right account model, invite people through groups, and create safe API identities without mixing workspaces or permissions.",
    role:"Account owners, administrators, security teams, and partners",
    scenario:"The solution is growing from one builder to a team—or from one customer to several isolated workspaces.",
    outcome:"Every workload sits in the right account and every person or program has only the access it needs.",
    evidence:"Recorded account model, verified Current account, group membership, and secured API-client credentials where needed.",
    reward:"Access Steward",
    time:"31 min",
    phases:["MODEL", "CREATE", "SWITCH", "USERS", "API CLIENTS", "REVIEW"]
  });
  const accountDoc = "https://techdocs.audiocodes.com/livehub/Content/LiveHub/Account%20and%20Sign%20Up.htm";
  const userDoc = "https://techdocs.audiocodes.com/livehub/#LiveHub/users-introduction.htm?TocPath=User%2520access%2520%2526%2520permissions%257C_____1";
  D.lessonsByTrack["account-admin"] = [
    lesson("account-choose-model","Choose the account model before creating it","Decide whether you need one working account or a parent with separate customer or department workspaces.","5 min",["Current account","Create new account"],["A list of teams/customers that need isolation","A named billing owner"],[
      {title:"Use standalone for one workspace",instruction:"Choose Standalone when one organization or team needs its own resources, users, and payment method."},
      {title:"Use parent for governance",instruction:"A Parent holds subaccounts and aggregated billing but has no bot connections, voice channels, or routing resources of its own."},
      {title:"Use subaccounts for real workloads",instruction:"A Subaccount behaves like a working standalone account, but its charges go to the parent and its support plan is inherited."},
      {title:"Treat hierarchy changes as permanent",instruction:"Turning a standalone into a parent or adopting it as a subaccount is one-way. Trial and Azure Marketplace accounts cannot create a parent above themselves."}
    ],["Creating the hierarchy","Moving resources between accounts","Billing setup"],["The required isolation model is named","The billing owner is named","Any one-way hierarchy change is approved"],[{problem:"You only need one team and one bill",fix:"Stay standalone. A parent adds governance and consolidated billing, not extra product capability."}],"Creating a parent as if it were a working resource account. Parent accounts aggregate; subaccounts hold the actual configuration.",accountDoc,{opening:{label:"THE STRUCTURE DECISION",problem:"If account boundaries are wrong, users see the wrong workspace and billing lands in the wrong place. Decide the boundary before building more resources."},capabilityGained:"You have an approved account and billing structure."}),
    lesson("account-create-switch","Create or switch without losing context","Create the approved account type, then prove the Current account before changing any Live Hub resource.","5 min",["Current account","Create new account / Account list"],["The approved account model","Account Manager permissions where required"],[
      {title:"Create the approved type",instruction:"From Current account, choose Create new account. A standalone is unrelated to the current account; a multi-level parent places the current standalone beneath it as the first subaccount."},
      {title:"Expect approval when required",instruction:"Some accounts are created immediately; others require administrator approval before they appear as available workspaces."},
      {title:"Switch deliberately",instruction:"Open Current account, find the account under Account list, and click Switch. Read the Current account label again before editing anything."},
      {title:"Remember the boundary",instruction:"Bot connections, voice channels, routing rules, calls, recordings, and billing data stay inside their account; they do not carry across when you switch."}
    ],["Adopting an existing account","Deleting an account","Bulk resource moves"],["The intended account exists or is awaiting approval","Current account shows the intended workspace","No resource was created in the wrong account"],[{problem:"A known route or bot disappeared",fix:"Check Current account first. Resources belong to one account and do not follow the user between workspaces."}],"Starting configuration before confirming Current account after a switch.",accountDoc,{opening:{label:"THE WORKSPACE CHECK",problem:"The same user can be an administrator in one account and a viewer in another. Always prove where you are before you change anything."},capabilityGained:"You can enter the correct workspace without mixing customer or department resources."}),
    lesson("account-invite-users","Invite users through the right group","Grant access by placing each email address in the predefined group that matches the job.","6 min",["Current account","Access control (IAM)","User groups"],["Account Manager membership","The user's email address","The user's real job in this account"],[
      {title:"Open IAM",instruction:"From Current account, open Access control (IAM). It opens in a separate tab for the account you were already using."},
      {title:"Choose the least-powerful group that works",instruction:"Use Monitor for read-only configuration, Call Data Manager for calls/recordings/transcripts, Billing Viewer for read-only billing, or the relevant administrator group only when changes are required."},
      {title:"Invite from the group",instruction:"Edit the group, open Users, click Add user, enter the email address, and send the invitation."},
      {title:"Combine groups deliberately",instruction:"A person who needs more than one job can belong to multiple groups. Their access is the combined set of those group permissions."}
    ],["Custom groups—the seven supplied groups are the available groups","External identity-provider mapping","Administrator access by default"],["The invitation was sent","The selected group matches the user's job","Extra administrator access was avoided"],[{problem:"The user needs two distinct jobs",fix:"Add them to both relevant predefined groups rather than granting full Administrator access."}],"Treating invitation and authorization as separate steps. Inviting through a group is what gives the user their initial rights.",userDoc,{opening:{label:"THE ACCESS DECISION",problem:"A new colleague needs to investigate calls, not edit routing. Give them the job they need—not the broadest role that makes the error disappear."},capabilityGained:"A real user can enter the account with job-appropriate permissions."}),
    lesson("account-api-client","Create a program identity safely","Create an API client, store its one-time secret, and grant it only the group permissions its integration needs.","6 min",["Access control (IAM)","API Clients"],["Account Manager membership","A named integration owner","A secure secret store"],[
      {title:"Create the client",instruction:"Open API Clients, click Add API Client, and use a name that identifies the system and environment."},
      {title:"Copy the credentials once",instruction:"Copy the client ID and client secret immediately. The secret is shown only during creation and cannot be retrieved later."},
      {title:"Grant access through groups",instruction:"A new client has no rights. Add it to only the required group or groups. Outbound calling needs Call Control and Call Data Manager."},
      {title:"Plan rotation",instruction:"Record the owner and rotation procedure. Changing the secret invalidates the old secret, so the integration must be updated at the same time."},
      {title:"Lock before deleting",instruction:"If a secret may be exposed or an integration is paused, Lock disables the client without removing it; Unlock restores it."}
    ],["Putting secrets in source code","Administrator access","Creating a client without an owner"],["Client ID and secret are stored securely","The client has only required groups","An owner and rotation note exist"],[{problem:"The secret was not saved",fix:"Change the client secret and update the integration. The original secret cannot be retrieved."}],"Assuming a created API client can already call the API. It has no rights until it is added to a user group.",userDoc,{opening:{label:"THE MACHINE USER",problem:"Your integration needs an identity of its own. Reusing a person's credentials makes ownership, rotation, and incident response unsafe."},capabilityGained:"A program can authenticate with a controlled, least-privilege identity."}),
    lesson("account-review-access","Review and remove access cleanly","Check users and API clients account by account, then remove or lock what no longer belongs.","4 min",["Access control (IAM)","User groups / API Clients"],["A current list of people and integrations that should retain access"],[
      {title:"Review every group",instruction:"Inspect Users and API Clients in each predefined group. Remember that the same person may have different rights in different accounts."},
      {title:"Remove unnecessary membership",instruction:"Remove the user or API client from the group that grants unneeded rights."},
      {title:"Handle sessions correctly",instruction:"A signed-in user's old rights last until they sign in again; an API client's old rights last until its current token expires."},
      {title:"Lock suspicious clients",instruction:"Lock a client immediately when its secret may be exposed, then investigate and rotate before unlocking."}
    ],["Deleting the account","Redesigning every policy","External IdP rollout"],["Every user has a current owner/job","Every API client has an owner","Unneeded group memberships are removed","Suspicious clients are locked"],[{problem:"Removed access still appears to work",fix:"Have the user sign in again or wait for the API token to expire; mid-session rights are not revoked instantly."}],"Reviewing only people and forgetting program identities that may still hold powerful credentials.",userDoc,{opening:{label:"THE CLEANUP",problem:"Access accumulates quietly. A production account is safer when every person and program still has a reason to be there."},capabilityGained:"The account has a current, reviewable access list for people and programs."})
  ];

  const billingTrack = {
    id:"billing",
    eyebrow:"Service continuity",
    title:"Keep Billing & Usage Under Control",
    description:"Choose prepaid or postpaid, protect continuity, read the monthly report, and understand what a call actually costs.",
    role:"Billing owners, account owners, and operations teams",
    scenario:"Traffic is growing. The service must not stop because a balance, spending limit, or recurring charge was misunderstood.",
    outcome:"The correct billing model is active, continuity is protected, and the current month's charges can be explained.",
    evidence:"Billing model, balance or month-to-date value, continuity control, and one reviewed monthly report.",
    reward:"Continuity Keeper",
    time:"22 min",
    level:"Administrator",
    icon:"activity",
    color:"amber",
    phases:["MODEL", "CONTINUITY", "REPORT", "EXPLAIN"]
  };
  if(!D.tracks.some(item => item.id === "billing")){
    const operateIndex = D.tracks.findIndex(item => item.id === "operate");
    D.tracks.splice(Math.max(0, operateIndex + 1), 0, billingTrack);
  }
  const billingDoc = "https://techdocs.audiocodes.com/livehub/Content/LiveHub/billing.htm";
  D.lessonsByTrack.billing = [
    lesson("billing-model","Know how this account pays","Identify prepaid, postpaid, or parent-funded billing and understand what happens when its limit is reached.","5 min",["Billing"],["Billing Viewer or Billing Administrator access","The account type: standalone, parent, or subaccount"],[
      {title:"Read the top bar",instruction:"Prepaid shows remaining balance. Postpaid shows month-to-date charges and, when configured, a spending limit."},
      {title:"Confirm the model",instruction:"Prepaid spends added credit as charges occur. Postpaid pays the following month. Subaccounts use the parent account's balance and billing model."},
      {title:"Know the stop condition",instruction:"An empty prepaid balance suspends services until credit is added. A postpaid account that reaches its spending limit becomes inactive until the next cycle."}
    ],["Changing billing model","Price negotiation","Detailed service-rate calculation"],["The account type and billing model are recorded","The value in the top bar is understood","The service stop condition is understood"],[{problem:"Billing controls are missing on a subaccount",fix:"Work from the parent account; subaccounts use the parent's billing model and balance."}],"Assuming the top-bar number means the same thing on prepaid and postpaid accounts.",billingDoc,{opening:{label:"THE CONTINUITY RISK",problem:"A technically healthy call flow can still stop when the account reaches zero balance or a postpaid spending limit."},capabilityGained:"You know exactly how this account pays and what can interrupt it."}),
    lesson("billing-continuity","Protect prepaid continuity","Set the billing address, add credit, and use auto-recharge or a remaining-funds alarm before service is at risk.","6 min",["Billing","Billing Address / Credit Card"],["Billing Administrator membership","An approved payment method","A realistic usage estimate"],[
      {title:"Set the billing address",instruction:"A billing address is required before Live Hub accepts a credit card and is used for tax and the payment receipt."},
      {title:"Add credit",instruction:"For prepaid standalone or parent accounts, add credit by card for immediate balance or arrange a wire transfer. Subaccounts use the parent's balance."},
      {title:"Configure auto-recharge",instruction:"Set a Threshold Amount and Recharge Amount that leave enough time and credit for normal usage. Auto-recharge restores the balance to threshold plus recharge amount."},
      {title:"Add a remaining-funds alarm",instruction:"On a standalone or parent account, set a Drops below threshold alarm so operations gets an early warning before continuity is at risk."}
    ],["Postpaid conversion","Large untested recharge amounts","Subaccount payment controls"],["Billing address is valid","The prepaid balance is sufficient","Auto-recharge or a funds alarm is configured","An owner receives billing warnings"],[{problem:"Credit controls are unavailable",fix:"Confirm this is a standalone or parent account and the user belongs to Billing Administrator."}],"Setting the recharge threshold below the amount the service can consume before the payment completes.",billingDoc,{opening:{label:"THE PREVENTION",problem:"Do not wait for zero balance to prove the payment path. Build a warning and replenishment margin while the service is healthy."},capabilityGained:"Prepaid service has a tested continuity buffer."}),
    lesson("billing-report","Explain this month's charges","Open the monthly report, separate recurring from usage-based charges, and export a durable breakdown.","6 min",["Billing","Monthly billing reports"],["Billing Viewer or Billing Administrator access","The correct account and year selected"],[
      {title:"Open the report",instruction:"Choose the year and open the report icon for the current or previous month. On a parent, choose aggregated reporting or one subaccount."},
      {title:"Separate charge types",instruction:"Recurring charges include resources such as phone numbers, connection fees, and CPS capacity. Usage charges include call minutes, speech services, and LLM tokens."},
      {title:"Understand rounding",instruction:"AI Agents, Agent Assist, speech, and translation use actual duration. PSTN, bot/SIP/WhatsApp call legs, Click-to-call, and recording are billed in 60-second increments."},
      {title:"Export the evidence",instruction:"Click Save as CSV and keep the report with the month's operational review."}
    ],["Auditing every rate","Forecasting a full year","Disputing charges without call evidence"],["The current report was opened","Recurring and usage charges are separated","One significant charge is explained","The CSV is saved when required"],[{problem:"A parent total looks too high",fix:"Switch the report from aggregated view to individual subaccounts and compare their usage and recurring resources."}],"Explaining the bill only from call duration and forgetting monthly resources or multiple billable call legs.",billingDoc,{opening:{label:"THE EXPLANATION",problem:"The invoice is not one number. A single customer call can combine recurring resources, rounded telephony legs, and exact-duration AI or speech usage."},capabilityGained:"You can explain the month's bill and preserve its breakdown."}),
    lesson("billing-review","Create the monthly usage habit","Turn billing into a short recurring review tied to growth, capacity, and unused resources.","5 min",["Dashboard / Billing","Monthly billing reports"],["The latest report","An owner for numbers, connections, and capacity"],[
      {title:"Check month-to-date",instruction:"Compare the current top-bar value with the prior month and the expected traffic change."},
      {title:"Review recurring resources",instruction:"Confirm that purchased phone numbers, connections, and CPS capacity are still required. A phone number is charged monthly even when unassigned."},
      {title:"Link anomalies to calls",instruction:"For an unexpected usage increase, sample the relevant Call IDs, routes, tags, and services before changing capacity or deleting resources."},
      {title:"Record the decision",instruction:"Write the owner, explanation, and next action for any material variance."}
    ],["Deleting resources during the review","Changing routes without call evidence","Rate-card negotiation"],["Usage variance is explained","Unassigned paid numbers are reviewed","Unexpected usage is linked to call evidence","Next actions have owners"],[{problem:"An unassigned number still costs money",fix:"That is expected. Phone numbers are charged monthly whether or not Routing uses them."}],"Treating billing review as finance-only. Usage often reveals abandoned resources, routing loops, or unexpected production behavior.",billingDoc,{opening:{label:"THE MONTHLY HABIT",problem:"A charge is easiest to fix while the route, resource, and owner are still recognizable—not months later."},capabilityGained:"The team has a repeatable usage and cost review."})
  ];

  D.academyAudiences = [
    {id:"all", label:"All paths", icon:"grid_view", tracks:D.tracks.map(item=>item.id)},
    {id:"start", label:"New to Live Hub", icon:"rocket_launch", tracks:["voice-agent","phone-number","routing","operate"]},
    {id:"ai", label:"AI builders", icon:"smart_toy", tracks:["voice-agent","agent-builder","bot-connect","speech-provider","agent-assist","translation"]},
    {id:"telephony", label:"Voice & telephony", icon:"settings_input_antenna", tracks:["phone-number","sip-trunk","teams-sip","voice-channel","routing","call-features"]},
    {id:"operations", label:"Operations & support", icon:"monitor_heart", tracks:["operate","diagnose","billing","call-features"]},
    {id:"admin", label:"Administrators", icon:"admin_panel_settings", tracks:["account-admin","billing","operate","teams-sip"]},
    {id:"developer", label:"Developers", icon:"code", tracks:["platform-api","outbound","campaigns","click-to-call","bot-connect"]},
    {id:"experience", label:"Customer experience", icon:"support_agent", tracks:["voice-agent","agent-assist","translation","whatsapp","call-features"]}
  ];

  D.recommendationOrder = ["voice-agent","phone-number","routing","operate","billing","account-admin"];
})();
