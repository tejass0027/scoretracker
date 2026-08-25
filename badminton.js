/* ==========================================================================
   BADMINTON SCORE TRACKER & TOURNAMENT LEAGUE MODULE - CORE ENGINE
   ========================================================================== */

console.log("ScoreTracker Badminton Module loaded - version 211");

(function () {
  // 1. STORAGE KEYS & DEFAULT STATES
  const BAD_STORAGE_KEY = "badminton-score-tracker-v1";
  const BADT_STORAGE_KEY = "badminton-tournament-tracker-v1";

  const defaultBadmintonState = {
    active: false,
    isTournamentMatch: false,
    matchType: "singles", // singles or doubles
    p1Name: "",
    p2Name: "",
    t1p1: "", t1p2: "", // Team 1 player names (for doubles)
    t2p1: "", t2p2: "", // Team 2 player names (for doubles)
    gamesLength: 3, // Best of 3 games
    
    // Live scores
    scoreP1: 0,
    scoreP2: 0,
    gamesP1: [0, 0, 0], // points won in game 1, 2, 3
    gamesP2: [0, 0, 0],
    gamesWonP1: 0, // number of games won in the match
    gamesWonP2: 0,
    currentGameIndex: 0, // 0-indexed (Game 1 = 0)
    
    isSetting: false, // true when deuce setting active (20-20)
    server: "p1", // "p1" or "p2" currently serving
    timeline: [], // { pointLog, gameScore, pointScore }
    history: [], // stack of state copies for undo
    matchCompleted: false
  };

  const defaultBadtState = {
    active: false,
    name: "",
    teamCount: 4,
    gamesLength: 3,
    teams: [], // { name, played, wins, losses, gamesWon, gamesLost, gamesDiff, ptsWon, ptsLost, ptsDiff, pts }
    fixtures: [], // { round, teamA, teamB, scoreA, scoreB, status, matchState }
    activeFixtureIndex: -1
  };

  let bad = clone(defaultBadmintonState);
  let badt = clone(defaultBadtState);

  // Helper deep cloner
  function clone(obj) {
    return JSON.parse(JSON.stringify(obj));
  }

  // 2. DOM SELECTORS
  const els = {
    // Page Wrappers
    badmintonPage: document.querySelector("#badminton-page"),
    formatView: document.querySelector("#bad-format-view"),
    setupView: document.querySelector("#bad-setup-view"),
    dashboardView: document.querySelector("#bad-dashboard-view"),
    tsetupView: document.querySelector("#bad-tsetup-view"),
    tdashboardView: document.querySelector("#bad-tdashboard-view"),

    // Format selection buttons
    formatBackBtn: document.querySelector("#bad-format-back-btn"),
    formatCustomBtn: document.querySelector("#bad-format-custom-btn"),
    formatTournamentBtn: document.querySelector("#bad-format-tournament-btn"),

    // Setup view inputs
    setupBackBtn: document.querySelector("#bad-setup-back-btn"),
    typeSingles: document.querySelector("#bad-type-singles"),
    typeDoubles: document.querySelector("#bad-type-doubles"),
    singlesInputs: document.querySelector("#bad-singles-inputs"),
    doublesInputs: document.querySelector("#bad-doubles-inputs"),
    p1Input: document.querySelector("#bad-p1-input"),
    p2Input: document.querySelector("#bad-p2-input"),
    t1p1Input: document.querySelector("#bad-t1p1-input"),
    t1p2Input: document.querySelector("#bad-t1p2-input"),
    t2p1Input: document.querySelector("#bad-t2p1-input"),
    t2p2Input: document.querySelector("#bad-t2p2-input"),
    gamesSelect: document.querySelector("#bad-games-select"),
    startBtn: document.querySelector("#bad-start-btn"),

    // Scorer Dashboard
    dashboardBackBtn: document.querySelector("#bad-dashboard-back-btn"),
    resetMatchBtn: document.querySelector("#bad-reset-match-btn"),
    p1NameDisplay: document.querySelector("#bad-p1-name-display"),
    p2NameDisplay: document.querySelector("#bad-p2-name-display"),
    p1Serving: document.querySelector("#bad-p1-serving"),
    p2Serving: document.querySelector("#bad-p2-serving"),
    p1Points: document.querySelector("#bad-p1-points"),
    p2Points: document.querySelector("#bad-p2-points"),
    settingIndicator: document.querySelector("#bad-setting-indicator"),
    liveIndicator: document.querySelector("#bad-live-indicator"),
    
    // Game cells
    tableP1Name: document.querySelector("#bad-table-p1"),
    tableP2Name: document.querySelector("#bad-table-p2"),
    g1p1: document.querySelector("#bad-g1p1"),
    g2p1: document.querySelector("#bad-g2p1"),
    g3p1: document.querySelector("#bad-g3p1"),
    g1p2: document.querySelector("#bad-g1p2"),
    g2p2: document.querySelector("#bad-g2p2"),
    g3p2: document.querySelector("#bad-g3p2"),
    gamesWonP1: document.querySelector("#bad-gameswon-p1"),
    gamesWonP2: document.querySelector("#bad-gameswon-p2"),

    // Dashboard Buttons
    p1PtBtn: document.querySelector("#bad-p1-pt-btn"),
    p2PtBtn: document.querySelector("#bad-p2-pt-btn"),
    toggleServerBtn: document.querySelector("#bad-toggle-server-btn"),
    undoBtn: document.querySelector("#bad-undo-btn"),
    faultBtn: document.querySelector("#bad-fault-btn"),
    submitResultBtn: document.querySelector("#bad-submit-result-btn"),
    timelineList: document.querySelector("#bad-timeline-list"),

    // Tournament Setup
    tsetupBackBtn: document.querySelector("#bad-tsetup-back-btn"),
    tnameInput: document.querySelector("#bad-tname-input"),
    tteamCount: document.querySelector("#bad-tteam-count"),
    tgamesSelect: document.querySelector("#bad-tgames-select"),
    tteamInputs: document.querySelector("#bad-tteam-inputs"),
    tcreateBtn: document.querySelector("#bad-tcreate-btn"),

    // Tournament Dashboard
    tdashboardBackBtn: document.querySelector("#bad-tdashboard-back-btn"),
    tresetBtn: document.querySelector("#bad-treset-btn"),
    tdashboardName: document.querySelector("#bad-tdashboard-name"),
    tabTable: document.querySelector("#bad-tab-table"),
    tabFixtures: document.querySelector("#bad-tab-fixtures"),
    tabEdit: document.querySelector("#bad-tab-edit"),
    tableView: document.querySelector("#bad-table-view"),
    fixturesView: document.querySelector("#bad-fixtures-view"),
    editView: document.querySelector("#bad-edit-view"),
    pointsTableBody: document.querySelector("#bad-points-table-body"),
    fixturesList: document.querySelector("#bad-fixtures-list"),
    editTeamsContainer: document.querySelector("#bad-edit-teams-container"),
    editSaveBtn: document.querySelector("#bad-edit-save-btn")
  };

  // Helper Toast
  function triggerBadToast(msg) {
    if (typeof showToast === "function") {
      showToast(msg);
    } else {
      alert(msg);
    }
  }

  // 3. NAVIGATION & GENERAL ROUTING
  function hideAllBadViews() {
    const views = [
      els.formatView,
      els.setupView,
      els.dashboardView,
      els.tsetupView,
      els.tdashboardView
    ];
    views.forEach(v => {
      if (v) v.classList.add("hidden");
    });
  }

  window.showBadmintonPage = function (fromHash = false) {
    if (!fromHash) window.location.hash = "#badminton";

    // Hide cricket, football, basketball, and tennis wrappers
    const cp = document.querySelector("#cricket-page");
    const fp = document.querySelector("#football-page");
    const bp = document.querySelector("#basketball-page");
    const tp = document.querySelector("#tennis-page");
    const sp = document.querySelector("#sports-page");
    const fop = document.querySelector("#format-page");
    if (cp) cp.classList.add("hidden");
    if (fp) fp.classList.add("hidden");
    if (bp) bp.classList.add("hidden");
    if (tp) tp.classList.add("hidden");
    if (sp) sp.classList.add("hidden");
    if (fop) fop.classList.add("hidden");

    if (els.badmintonPage) els.badmintonPage.classList.remove("hidden");

    hideAllBadViews();

    const hash = window.location.hash;
    if (hash === "#badminton") {
      if (els.formatView) els.formatView.classList.remove("hidden");
    } else if (hash === "#badminton-custom") {
      if (els.setupView) els.setupView.classList.remove("hidden");
      // Clear inputs
      if (els.p1Input) els.p1Input.value = "";
      if (els.p2Input) els.p2Input.value = "";
      if (els.t1p1Input) els.t1p1Input.value = "";
      if (els.t1p2Input) els.t1p2Input.value = "";
      if (els.t2p1Input) els.t2p1Input.value = "";
      if (els.t2p2Input) els.t2p2Input.value = "";
      if (els.typeSingles) els.typeSingles.classList.add("active");
      if (els.typeDoubles) els.typeDoubles.classList.remove("active");
      if (els.singlesInputs) els.singlesInputs.classList.remove("hidden");
      if (els.doublesInputs) els.doublesInputs.classList.add("hidden");
    } else if (hash === "#badminton-match") {
      if (els.dashboardView) els.dashboardView.classList.remove("hidden");
      renderBadmintonDashboard();
    } else if (hash === "#badminton-tsetup") {
      if (els.tsetupView) els.tsetupView.classList.remove("hidden");
      renderTournamentTeamInputs();
    } else if (hash === "#badminton-tdashboard") {
      if (els.tdashboardView) els.tdashboardView.classList.remove("hidden");
      renderTournamentDashboard();
    }
  };

  // Local storage loaders
  function loadBadmintonState() {
    try {
      const stored = localStorage.getItem(BAD_STORAGE_KEY);
      const storedT = localStorage.getItem(BADT_STORAGE_KEY);

      if (stored) {
        bad = { ...clone(defaultBadmintonState), ...JSON.parse(stored) };
      }
      if (storedT) {
        badt = { ...clone(defaultBadtState), ...JSON.parse(storedT) };
      }
    } catch (e) {
      console.error("Failed to load badminton states: ", e);
    }
  }

  function saveBadmintonState() {
    try {
      localStorage.setItem(BAD_STORAGE_KEY, JSON.stringify(bad));
      localStorage.setItem(BADT_STORAGE_KEY, JSON.stringify(badt));
    } catch (e) {
      console.error("Failed to save badminton states: ", e);
    }
  }

  // 4. FORMAT SELECTION BINDINGS
  if (els.formatBackBtn) {
    els.formatBackBtn.addEventListener("click", () => {
      window.location.hash = "#sports";
    });
  }

  if (els.formatCustomBtn) {
    els.formatCustomBtn.addEventListener("click", () => {
      window.location.hash = "#badminton-custom";
    });
  }

  if (els.formatTournamentBtn) {
    els.formatTournamentBtn.addEventListener("click", () => {
      window.location.hash = "#badminton-tsetup";
    });
  }

  if (els.setupBackBtn) {
    els.setupBackBtn.addEventListener("click", () => {
      window.location.hash = "#badminton";
    });
  }

  // Singles / Doubles Toggle
  if (els.typeSingles && els.typeDoubles) {
    els.typeSingles.addEventListener("click", () => {
      els.typeSingles.classList.add("active");
      els.typeDoubles.classList.remove("active");
      els.singlesInputs.classList.remove("hidden");
      els.doublesInputs.classList.add("hidden");
    });

    els.typeDoubles.addEventListener("click", () => {
      els.typeDoubles.classList.add("active");
      els.typeSingles.classList.remove("active");
      els.singlesInputs.classList.add("hidden");
      els.doublesInputs.classList.remove("hidden");
    });
  }

  // Start Custom Match click
  if (els.startBtn) {
    els.startBtn.addEventListener("click", () => {
      const isDoubles = els.typeDoubles.classList.contains("active");
      
      let p1 = "Player 1";
      let p2 = "Player 2";
      let t1p1 = "", t1p2 = "", t2p1 = "", t2p2 = "";

      if (isDoubles) {
        t1p1 = els.t1p1Input.value.trim() || "Player A1";
        t1p2 = els.t1p2Input.value.trim() || "Player A2";
        t2p1 = els.t2p1Input.value.trim() || "Player B1";
        t2p2 = els.t2p2Input.value.trim() || "Player B2";

        // Check for duplicates
        const names = [t1p1, t1p2, t2p1, t2p2];
        const unique = new Set(names.map(n => n.toLowerCase()));
        if (unique.size !== 4) {
          triggerBadToast("Player names must be unique. Please resolve duplicates.");
          return;
        }
        p1 = `${t1p1} / ${t1p2}`;
        p2 = `${t2p1} / ${t2p2}`;
      } else {
        p1 = els.p1Input.value.trim() || "Player 1";
        p2 = els.p2Input.value.trim() || "Player 2";
        if (p1.toLowerCase() === p2.toLowerCase()) {
          triggerBadToast("Player names must be unique. Please use different names.");
          return;
        }
      }

      initializeBadmintonMatch(p1, p2, isDoubles ? "doubles" : "singles", t1p1, t1p2, t2p1, t2p2);
    });
  }

  function initializeBadmintonMatch(p1, p2, type, t1p1, t1p2, t2p1, t2p2) {
    bad = clone(defaultBadmintonState);
    bad.active = true;
    bad.isTournamentMatch = false;
    bad.p1Name = p1;
    bad.p2Name = p2;
    bad.matchType = type;
    bad.t1p1 = t1p1; bad.t1p2 = t1p2;
    bad.t2p1 = t2p1; bad.t2p2 = t2p2;

    saveBadmintonState();
    window.location.hash = "#badminton-match";
  }

  // 5. BADMINTON POINTS LOGIC ENGINE
  function saveToHistory() {
    bad.history.push({
      scoreP1: bad.scoreP1,
      scoreP2: bad.scoreP2,
      gamesP1: [...bad.gamesP1],
      gamesP2: [...bad.gamesP2],
      gamesWonP1: bad.gamesWonP1,
      gamesWonP2: bad.gamesWonP2,
      currentGameIndex: bad.currentGameIndex,
      isSetting: bad.isSetting,
      server: bad.server,
      matchCompleted: bad.matchCompleted,
      timeline: [...bad.timeline]
    });
    if (bad.history.length > 20) bad.history.shift();
  }

  function logTimelinePoint(desc) {
    const gamesScore = `Game ${bad.currentGameIndex+1}: ${bad.scoreP1}-${bad.scoreP2}`;
    bad.timeline.unshift({
      detail: desc,
      gameScore: gamesScore,
      pointScore: `Games: ${bad.gamesWonP1}-${bad.gamesWonP2}`
    });
  }

  function addPointToPlayer(playerNum) {
    if (bad.matchCompleted) return;
    saveToHistory();

    const p1 = playerNum === 1;
    const activePlayerName = p1 ? bad.p1Name : bad.p2Name;

    // Rally Point Increment
    if (p1) bad.scoreP1++;
    else bad.scoreP2++;

    // Serve goes to the side that wins the rally
    bad.server = p1 ? "p1" : "p2";

    logTimelinePoint(`Point won by ${activePlayerName}`);

    // Check Setting / Deuce and Game Winner
    const sA = bad.scoreP1;
    const sB = bad.scoreP2;

    // Standard game win is to 21 rally points. 
    // Setting rules: 
    // - If score reaches 20-20, winner must lead by 2 points.
    // - Setting is capped at 30 (whoever reaches 30 first wins).
    if (sA >= 21 || sB >= 21) {
      if (Math.abs(sA - sB) >= 2) {
        winGame(sA > sB ? 1 : 2);
      } else if (sA === 20 && sB === 20) {
        bad.isSetting = true;
        logTimelinePoint("⚠️ Game reaches setting (deuce)! Must win by 2 points.");
        triggerBadToast("Setting active! Must win by 2 points.");
      } else if (sA === 30 || sB === 30) {
        // Capped at 30 points
        winGame(sA === 30 ? 1 : 2);
      }
    }

    saveBadmintonState();
    renderBadmintonDashboard();
  }

  function winGame(playerNum) {
    const isP1 = playerNum === 1;
    const name = isP1 ? bad.p1Name : bad.p2Name;

    // Save final point score of this game
    bad.gamesP1[bad.currentGameIndex] = bad.scoreP1;
    bad.gamesP2[bad.currentGameIndex] = bad.scoreP2;

    // Reset scores for next game
    bad.scoreP1 = 0;
    bad.scoreP2 = 0;
    bad.isSetting = false;

    // Increment games won in match
    if (isP1) bad.gamesWonP1++;
    else bad.gamesWonP2++;

    logTimelinePoint(`🏆 Game won by ${name}`);
    triggerBadToast(`Game won by ${name}!`);

    // Check Match Win (Best of 3 Games - first to win 2 games)
    if (bad.gamesWonP1 >= 2) {
      bad.matchCompleted = true;
      logTimelinePoint(`🎉 Match Won by ${bad.p1Name}!`);
      triggerBadToast(`Match Won by ${bad.p1Name}!`);
    } else if (bad.gamesWonP2 >= 2) {
      bad.matchCompleted = true;
      logTimelinePoint(`🎉 Match Won by ${bad.p2Name}!`);
      triggerBadToast(`Match Won by ${bad.p2Name}!`);
    } else {
      // Go to next game
      bad.currentGameIndex++;
    }
  }

  function undoPoint() {
    if (bad.history.length === 0) {
      triggerBadToast("Nothing to undo!");
      return;
    }
    const prev = bad.history.pop();
    
    bad.scoreP1 = prev.scoreP1;
    bad.scoreP2 = prev.scoreP2;
    bad.gamesP1 = prev.gamesP1;
    bad.gamesP2 = prev.gamesP2;
    bad.gamesWonP1 = prev.gamesWonP1;
    bad.gamesWonP2 = prev.gamesWonP2;
    bad.currentGameIndex = prev.currentGameIndex;
    bad.isSetting = prev.isSetting;
    bad.server = prev.server;
    bad.matchCompleted = prev.matchCompleted;
    bad.timeline = prev.timeline;

    saveBadmintonState();
    renderBadmintonDashboard();
    triggerBadToast("Last point undone.");
  }

  function recordFault() {
    logTimelinePoint("⚠️ Service Fault logged.");
    triggerBadToast("Service fault recorded.");
    saveBadmintonState();
    renderBadmintonDashboard();
  }

  // Bind controls click listeners
  if (els.p1PtBtn) els.p1PtBtn.addEventListener("click", () => addPointToPlayer(1));
  if (els.p2PtBtn) els.p2PtBtn.addEventListener("click", () => addPointToPlayer(2));
  if (els.toggleServerBtn) {
    els.toggleServerBtn.addEventListener("click", () => {
      bad.server = bad.server === "p1" ? "p2" : "p1";
      saveBadmintonState();
      renderBadmintonDashboard();
      triggerBadToast(`Server changed. Now serving: ${bad.server === 'p1' ? bad.p1Name : bad.p2Name}`);
    });
  }
  if (els.undoBtn) els.undoBtn.addEventListener("click", undoPoint);
  if (els.faultBtn) els.faultBtn.addEventListener("click", recordFault);

  if (els.resetMatchBtn) {
    els.resetMatchBtn.addEventListener("click", () => {
      if (confirm("Are you sure you want to reset this match? All match scores will be cleared.")) {
        bad.scoreP1 = 0;
        bad.scoreP2 = 0;
        bad.gamesP1 = [0, 0, 0];
        bad.gamesP2 = [0, 0, 0];
        bad.gamesWonP1 = 0;
        bad.gamesWonP2 = 0;
        bad.currentGameIndex = 0;
        bad.isSetting = false;
        bad.server = "p1";
        bad.timeline = [];
        bad.history = [];
        bad.matchCompleted = false;

        saveBadmintonState();
        renderBadmintonDashboard();
        triggerBadToast("Match scores reset.");
      }
    });
  }

  if (els.dashboardBackBtn) {
    els.dashboardBackBtn.addEventListener("click", () => {
      if (bad.isTournamentMatch && badt.active && badt.activeFixtureIndex !== -1) {
        badt.fixtures[badt.activeFixtureIndex].matchState = clone(bad);
        bad.active = false;
        saveBadmintonState();
        window.location.hash = "#badminton-tdashboard";
      } else {
        bad.active = false;
        saveBadmintonState();
        window.location.hash = "#badminton";
      }
    });
  }

  // 6. RENDER SCOREBOARD DETAILS
  function renderBadmintonDashboard() {
    if (!bad.active) return;

    if (els.p1NameDisplay) els.p1NameDisplay.textContent = bad.p1Name;
    if (els.p2NameDisplay) els.p2NameDisplay.textContent = bad.p2Name;
    if (els.tableP1Name) els.tableP1Name.textContent = bad.p1Name;
    if (els.tableP2Name) els.tableP2Name.textContent = bad.p2Name;

    // Service indicators
    if (els.p1Serving) els.p1Serving.style.display = bad.server === "p1" ? "inline-block" : "none";
    if (els.p2Serving) els.p2Serving.style.display = bad.server === "p2" ? "inline-block" : "none";

    // Point values
    if (els.p1Points) els.p1Points.textContent = bad.scoreP1;
    if (els.p2Points) els.p2Points.textContent = bad.scoreP2;

    if (els.settingIndicator) {
      els.settingIndicator.style.display = bad.isSetting ? "block" : "none";
    }
    if (els.liveIndicator) {
      els.liveIndicator.style.display = bad.matchCompleted ? "none" : "inline-flex";
    }

    // Games history cells
    if (els.g1p1) els.g1p1.textContent = bad.gamesP1[0];
    if (els.g2p1) els.g2p1.textContent = bad.gamesP1[1];
    if (els.g3p1) els.g3p1.textContent = bad.gamesP1[2];

    if (els.g1p2) els.g1p2.textContent = bad.gamesP2[0];
    if (els.g2p2) els.g2p2.textContent = bad.gamesP2[1];
    if (els.g3p2) els.g3p2.textContent = bad.gamesP2[2];

    if (els.gamesWonP1) els.gamesWonP1.textContent = bad.gamesWonP1;
    if (els.gamesWonP2) els.gamesWonP2.textContent = bad.gamesWonP2;

    // Submit results button if tournament fixture completed
    if (els.submitResultBtn) {
      if (bad.isTournamentMatch && bad.matchCompleted) {
        els.submitResultBtn.classList.remove("hidden");
      } else {
        els.submitResultBtn.classList.add("hidden");
      }
    }

    // History logs render
    if (els.timelineList) {
      if (bad.timeline.length === 0) {
        els.timelineList.innerHTML = `<p style="color: var(--text-muted); font-style: italic; font-size: 0.9rem; margin: 0;">No points logged yet.</p>`;
      } else {
        els.timelineList.innerHTML = bad.timeline.map(e => `
          <div class="bad-log-item">
            <div>
              <span style="color:#fff; font-weight:700; margin-right:6px;">•</span>
              <span style="color:var(--ink);">${e.detail}</span>
            </div>
            <div style="font-family:monospace; font-size:0.8rem;">
              <span style="color:var(--bad-primary); margin-right:8px;">[${e.gameScore}]</span>
              <span style="color:var(--text-muted);">(${e.pointScore})</span>
            </div>
          </div>
        `).join("");
      }
    }
  }

  // 7. TOURNAMENT ENGINE
  function renderTournamentTeamInputs() {
    if (!els.tteamInputs) return;
    els.tteamInputs.innerHTML = "";

    const count = els.tteamCount ? Number(els.tteamCount.value) : 4;
    for (let i = 0; i < count; i++) {
      const div = document.createElement("div");
      div.className = "setup-group";
      div.innerHTML = `
        <label style="display: block; font-size: 0.8rem; color: var(--text-muted); margin-bottom: 6px; font-weight: 600;">Player ${i + 1} Name</label>
        <input type="text" class="badminton-tteam-name-input" placeholder="Player Name" autocomplete="off" style="width: 100%; height: 40px; background: rgba(0,0,0,0.2); border: 1px solid rgba(255,255,255,0.1); border-radius: 8px; color: var(--ink); padding: 0 12px; font-family: inherit; font-size: 0.9rem;" />
      `;
      els.tteamInputs.appendChild(div);
    }
  }

  if (els.tteamCount) {
    els.tteamCount.addEventListener("change", renderTournamentTeamInputs);
  }

  if (els.tsetupBackBtn) {
    els.tsetupBackBtn.addEventListener("click", () => {
      window.location.hash = "#badminton";
    });
  }

  if (els.tcreateBtn) {
    els.tcreateBtn.addEventListener("click", () => {
      const name = els.tnameInput.value.trim() || "Badminton Tournament Cup";
      const teamCount = Number(els.tteamCount.value) || 4;

      const teamInputs = document.querySelectorAll(".badminton-tteam-name-input");
      const teamNames = [];
      const uniqueNames = new Set();

      for (let i = 0; i < teamInputs.length; i++) {
        const tName = teamInputs[i].value.trim() || `Player ${i + 1}`;
        const nameKey = tName.toLowerCase();
        if (uniqueNames.has(nameKey)) {
          triggerBadToast(`Names must be unique. Duplicate found: "${tName}"`);
          return;
        }
        uniqueNames.add(nameKey);
        teamNames.push(tName);
      }

      badt = clone(defaultBadtState);
      badt.active = true;
      badt.name = name;
      badt.teamCount = teamCount;

      badt.teams = teamNames.map(t => ({
        name: t,
        played: 0,
        wins: 0,
        losses: 0,
        gamesWon: 0,
        gamesLost: 0,
        gamesDiff: 0,
        ptsWon: 0,
        ptsLost: 0,
        ptsDiff: 0,
        pts: 0
      }));

      // Generate round-robin schedule (double round-robin)
      badt.fixtures = [];
      const list = [...teamNames];
      const rounds = teamCount - 1;
      const halfSize = teamCount / 2;

      for (let r = 0; r < rounds * 2; r++) {
        for (let i = 0; i < halfSize; i++) {
          const home = list[i];
          const away = list[teamCount - 1 - i];
          badt.fixtures.push({
            round: r + 1,
            teamA: r % 2 === 0 ? home : away,
            teamB: r % 2 === 0 ? away : home,
            scoreA: 0,
            scoreB: 0,
            status: "scheduled",
            matchState: null
          });
        }
        const last = list.pop();
        list.splice(1, 0, last);
      }

      saveBadmintonState();
      window.location.hash = "#badminton-tdashboard";
    });
  }

  // Dashboard Tabs bindings
  const tabNames = ["table", "fixtures", "edit"];
  tabNames.forEach(tab => {
    const btn = document.querySelector(`#bad-tab-${tab}`);
    if (btn) {
      btn.addEventListener("click", () => {
        tabNames.forEach(t => {
          const btn2 = document.querySelector(`#bad-tab-${t}`);
          const view2 = document.querySelector(`#bad-${t}-view`);
          if (btn2 && view2) {
            btn2.classList.remove("active");
            view2.classList.add("hidden");
          }
        });
        btn.classList.add("active");
        const activeView = document.querySelector(`#bad-${tab}-view`);
        if (activeView) activeView.classList.remove("hidden");

        if (tab === "table") renderPointsTable();
        else if (tab === "fixtures") renderFixtures();
        else if (tab === "edit") renderEditSetup();
      });
    }
  });

  // Table Standings compilation
  function renderPointsTable() {
    if (!badt.active) return;

    badt.teams.forEach(t => {
      t.played = 0; t.wins = 0; t.losses = 0; t.gamesWon = 0; t.gamesLost = 0; t.gamesDiff = 0; t.ptsWon = 0; t.ptsLost = 0; t.ptsDiff = 0; t.pts = 0;
    });

    badt.fixtures.forEach(f => {
      if (f.status === "completed") {
        const tA = badt.teams.find(t => t.name === f.teamA);
        const tB = badt.teams.find(t => t.name === f.teamB);
        if (tA && tB) {
          tA.played++;
          tB.played++;

          const ms = f.matchState;
          if (ms) {
            tA.gamesWon += ms.gamesWonP1;
            tA.gamesLost += ms.gamesWonP2;
            tB.gamesWon += ms.gamesWonP2;
            tB.gamesLost += ms.gamesWonP1;

            // sum logged points
            let p1Sum = 0;
            let p2Sum = 0;
            for (let i = 0; i <= ms.currentGameIndex; i++) {
              p1Sum += ms.gamesP1[i];
              p2Sum += ms.gamesP2[i];
            }
            tA.ptsWon += p1Sum;
            tA.ptsLost += p2Sum;
            tB.ptsWon += p2Sum;
            tB.ptsLost += p1Sum;
          }

          if (f.scoreA > f.scoreB) {
            tA.wins++;
            tA.pts += 2;
            tB.losses++;
          } else {
            tB.wins++;
            tB.pts += 2;
            tA.losses++;
          }
        }
      }
    });

    badt.teams.forEach(t => {
      t.gamesDiff = t.gamesWon - t.gamesLost;
      t.ptsDiff = t.ptsWon - t.ptsLost;
    });

    const sorted = [...badt.teams].sort((a,b) => {
      if (b.pts !== a.pts) return b.pts - a.pts;
      if (b.gamesDiff !== a.gamesDiff) return b.gamesDiff - a.gamesDiff;
      return b.ptsDiff - a.ptsDiff;
    });

    if (els.pointsTableBody) {
      els.pointsTableBody.innerHTML = sorted.map((t, idx) => `
        <tr style="border-bottom: 1px solid rgba(255,255,255,0.05);">
          <td style="padding: 10px 8px; font-weight:700; color: var(--gold);">${idx + 1}</td>
          <td style="padding: 10px 8px; font-weight:700; color:#fff;">${t.name}</td>
          <td style="padding: 10px 8px;">${t.played}</td>
          <td style="padding: 10px 8px; color: #10b981;">${t.wins}</td>
          <td style="padding: 10px 8px; color: #f87171;">${t.losses}</td>
          <td style="padding: 10px 8px; color: ${t.gamesDiff >= 0 ? '#10b981' : '#f87171'};">${t.gamesWon}-${t.gamesLost} (${t.gamesDiff >= 0 ? '+' : ''}${t.gamesDiff})</td>
          <td style="padding: 10px 8px; color: ${t.ptsDiff >= 0 ? '#10b981' : '#f87171'};">${t.ptsWon}-${t.ptsLost} (${t.ptsDiff >= 0 ? '+' : ''}${t.ptsDiff})</td>
          <td style="padding: 10px 8px; font-weight:900; text-align:right; color: var(--bad-primary);">${t.pts}</td>
        </tr>
      `).join("");
    }
  }

  function renderFixtures() {
    if (!els.fixturesList) return;
    els.fixturesList.innerHTML = "";

    badt.fixtures.forEach((f, idx) => {
      const card = document.createElement("div");
      card.style.background = "rgba(255,255,255,0.02)";
      card.style.border = "1px solid rgba(255,255,255,0.08)";
      card.style.borderRadius = "12px";
      card.style.padding = "16px";
      card.style.display = "flex";
      card.style.justifyContent = "space-between";
      card.style.alignItems = "center";

      const leftSide = `
        <div>
          <span style="font-size: 0.75rem; color: var(--gold); font-weight:700; text-transform:uppercase;">Round ${f.round}</span>
          <div style="font-weight: 700; font-size:1.05rem; margin-top:4px; color:#fff;">
            ${f.teamA} <span style="color:var(--text-muted); font-size:0.85rem; font-weight:normal; margin:0 6px;">vs</span> ${f.teamB}
          </div>
        </div>
      `;

      let rightSide = "";
      if (f.status === "completed") {
        rightSide = `
          <div style="display:flex; align-items:center; gap:16px;">
            <div style="font-family: monospace; font-size:1.5rem; font-weight:900; color:var(--bad-primary);">${f.scoreA} - ${f.scoreB}</div>
            <span style="background: rgba(16,185,129,0.15); color:#10b981; font-size:0.75rem; padding:4px 8px; border-radius:6px; font-weight:700; text-transform:uppercase;">Played</span>
          </div>
        `;
      } else {
        rightSide = `
          <button class="start-custom" type="button" data-bad-fixture-index="${idx}" style="margin:0; padding:8px 16px; font-size:0.8rem; border-radius:6px; font-weight:700;">⏱️ Play Match</button>
        `;
      }

      card.innerHTML = leftSide + rightSide;
      els.fixturesList.appendChild(card);
    });

    document.querySelectorAll("[data-bad-fixture-index]").forEach(btn => {
      btn.addEventListener("click", (e) => {
        const idx = Number(e.currentTarget.getAttribute("data-bad-fixture-index"));
        const fix = badt.fixtures[idx];

        if (fix) {
          badt.activeFixtureIndex = idx;
          if (fix.matchState) {
            bad = clone(fix.matchState);
          } else {
            initializeBadmintonTournamentMatch(fix.teamA, fix.teamB);
          }
        }
      });
    });
  }

  function initializeBadmintonTournamentMatch(p1, p2) {
    bad = clone(defaultBadmintonState);
    bad.active = true;
    bad.isTournamentMatch = true;
    bad.p1Name = p1;
    bad.p2Name = p2;
    bad.matchType = "singles";

    saveBadmintonState();
    window.location.hash = "#badminton-match";
  }

  function renderEditSetup() {
    if (els.editTeamsContainer) {
      els.editTeamsContainer.innerHTML = badt.teams.map((t, idx) => `
        <div class="setup-group">
          <label style="display: block; font-size: 0.85rem; color: var(--text-muted); margin-bottom: 4px; font-weight: 600;">Player ${idx + 1} Name</label>
          <input type="text" class="bad-edit-tteam-input" data-team-index="${idx}" value="${t.name}" autocomplete="off" style="width: 100%; height: 38px; background: rgba(0,0,0,0.25); border: 1px solid rgba(255,255,255,0.1); border-radius: 6px; color: var(--ink); padding: 0 12px; font-size: 0.9rem;" />
        </div>
      `).join("");
    }
  }

  if (els.editSaveBtn) {
    els.editSaveBtn.addEventListener("click", () => {
      const inputs = document.querySelectorAll(".bad-edit-tteam-input");
      const tempNames = [];
      const uniqueNames = new Set();

      for (let i = 0; i < inputs.length; i++) {
        const tName = inputs[i].value.trim();
        if (!tName) {
          triggerBadToast("Player name cannot be blank!");
          return;
        }
        const nameKey = tName.toLowerCase();
        if (uniqueNames.has(nameKey)) {
          triggerBadToast(`Names must be unique. Duplicate: "${tName}"`);
          return;
        }
        uniqueNames.add(nameKey);
        tempNames.push({ index: Number(inputs[i].getAttribute("data-team-index")), name: tName });
      }

      tempNames.forEach(item => {
        const oldName = badt.teams[item.index].name;
        const newName = item.name;

        if (oldName !== newName) {
          badt.teams[item.index].name = newName;
          
          badt.fixtures.forEach(f => {
            if (f.teamA === oldName) f.teamA = newName;
            if (f.teamB === oldName) f.teamB = newName;
            if (f.matchState) {
              if (f.matchState.p1Name === oldName) f.matchState.p1Name = newName;
              if (f.matchState.p2Name === oldName) f.matchState.p2Name = newName;
            }
          });
        }
      });

      triggerBadToast("Tournament settings saved successfully!");
      saveBadmintonState();
      renderPointsTable();
    });
  }

  window.submitBadTournamentMatchResult = function () {
    if (!badt.active || badt.activeFixtureIndex === -1) return;

    const idx = badt.activeFixtureIndex;
    const fix = badt.fixtures[idx];

    fix.status = "completed";
    fix.scoreA = bad.gamesWonP1;
    fix.scoreB = bad.gamesWonP2;
    fix.matchState = clone(bad);

    bad.active = false;
    badt.activeFixtureIndex = -1;

    saveBadmintonState();
    triggerBadToast("Match score submitted successfully!");
    window.location.hash = "#badminton-tdashboard";
    renderPointsTable();
  };

  if (els.submitResultBtn) {
    els.submitResultBtn.addEventListener("click", () => {
      window.submitBadTournamentMatchResult();
    });
  }

  if (els.tresetBtn) {
    els.tresetBtn.addEventListener("click", () => {
      if (confirm("Are you sure you want to reset this tournament? All league standings will be lost.")) {
        badt = clone(defaultBadtState);
        saveBadmintonState();
        window.location.hash = "#badminton";
      }
    });
  }

  if (els.tdashboardBackBtn) {
    els.tdashboardBackBtn.addEventListener("click", () => {
      badt.active = false;
      saveBadmintonState();
      window.location.hash = "#badminton";
    });
  }

  function renderTournamentDashboard() {
    if (els.tdashboardName) els.tdashboardName.textContent = badt.name;
    renderPointsTable();
  }

  // 8. INITIALIZE ROUTINGS
  loadBadmintonState();

  if (window.location.hash.startsWith("#badminton")) {
    showBadmintonPage(true);
  }

  window.addEventListener("hashchange", () => {
    if (window.location.hash.startsWith("#badminton")) {
      showBadmintonPage(true);
    }
  });

  const badmintonCardBtn = document.querySelector("[data-open-sport='badminton']");
  if (badmintonCardBtn) {
    badmintonCardBtn.addEventListener("click", () => {
      window.location.hash = "#badminton";
    });
  }

})();
