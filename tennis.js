/* ==========================================================================
   TENNIS SCORE TRACKER & TOURNAMENT LEAGUE MODULE - CORE ENGINE
   ========================================================================== */

console.log("ScoreTracker Tennis Module loaded - version 210");

(function () {
  // 1. STORAGE KEYS & DEFAULT STATES
  const TENNIS_STORAGE_KEY = "tennis-score-tracker-v1";
  const TENNIST_STORAGE_KEY = "tennis-tournament-tracker-v1";

  const defaultTennisState = {
    active: false,
    isTournamentMatch: false,
    matchType: "singles", // singles or doubles
    p1Name: "",
    p2Name: "",
    t1p1: "", t1p2: "", // Team 1 player names (for doubles)
    t2p1: "", t2p2: "", // Team 2 player names (for doubles)
    setsLength: 3, // Best of 3 or 5 sets
    advantageSystem: "standard", // standard (deuce/adv) or no-ad
    tiebreakEnabled: true,
    
    // Live scores
    scoreP1: "0", // "0", "15", "30", "40", "Ad"
    scoreP2: "0",
    gamesP1: [0, 0, 0, 0, 0], // games won in sets 1 to 5
    gamesP2: [0, 0, 0, 0, 0],
    setsWonP1: 0,
    setsWonP2: 0,
    currentSetIndex: 0, // 0-indexed (Set 1 = 0)
    
    // Tiebreak state
    isTiebreak: false,
    tiebreakPointsP1: 0,
    tiebreakPointsP2: 0,
    
    server: "p1", // "p1" or "p2" currently serving
    timeline: [], // { pointLog, setScore, gameScore }
    history: [], // stack of state copies for undo
    matchCompleted: false
  };

  const defaultTennistState = {
    active: false,
    name: "",
    teamCount: 4,
    setsLength: 3,
    teams: [], // { name, played, wins, losses, setsWon, setsLost, setsDiff, gamesWon, gamesLost, gamesDiff, pts }
    fixtures: [], // { round, teamA, teamB, scoreA, scoreB, status, matchState }
    activeFixtureIndex: -1
  };

  let ten = clone(defaultTennisState);
  let tent = clone(defaultTennistState);

  // Helper deep cloner
  function clone(obj) {
    return JSON.parse(JSON.stringify(obj));
  }

  // 2. DOM SELECTORS
  const els = {
    // Page Wrappers
    tennisPage: document.querySelector("#tennis-page"),
    formatView: document.querySelector("#ten-format-view"),
    setupView: document.querySelector("#ten-setup-view"),
    dashboardView: document.querySelector("#ten-dashboard-view"),
    tsetupView: document.querySelector("#ten-tsetup-view"),
    tdashboardView: document.querySelector("#ten-tdashboard-view"),

    // Format selection buttons
    formatBackBtn: document.querySelector("#ten-format-back-btn"),
    formatCustomBtn: document.querySelector("#ten-format-custom-btn"),
    formatTournamentBtn: document.querySelector("#ten-format-tournament-btn"),

    // Setup view inputs
    setupBackBtn: document.querySelector("#ten-setup-back-btn"),
    typeSingles: document.querySelector("#ten-type-singles"),
    typeDoubles: document.querySelector("#ten-type-doubles"),
    singlesInputs: document.querySelector("#ten-singles-inputs"),
    doublesInputs: document.querySelector("#ten-doubles-inputs"),
    p1Input: document.querySelector("#ten-p1-input"),
    p2Input: document.querySelector("#ten-p2-input"),
    t1p1Input: document.querySelector("#ten-t1p1-input"),
    t1p2Input: document.querySelector("#ten-t1p2-input"),
    t2p1Input: document.querySelector("#ten-t2p1-input"),
    t2p2Input: document.querySelector("#ten-t2p2-input"),
    setsSelect: document.querySelector("#ten-sets-select"),
    advantageSelect: document.querySelector("#ten-advantage-select"),
    tiebreakInput: document.querySelector("#ten-tiebreak-input"),
    startBtn: document.querySelector("#ten-start-btn"),

    // Scorer Dashboard
    dashboardBackBtn: document.querySelector("#ten-dashboard-back-btn"),
    resetMatchBtn: document.querySelector("#ten-reset-match-btn"),
    p1NameDisplay: document.querySelector("#ten-p1-name-display"),
    p2NameDisplay: document.querySelector("#ten-p2-name-display"),
    p1Serving: document.querySelector("#ten-p1-serving"),
    p2Serving: document.querySelector("#ten-p2-serving"),
    p1Points: document.querySelector("#ten-p1-points"),
    p2Points: document.querySelector("#ten-p2-points"),
    tiebreakIndicator: document.querySelector("#ten-tiebreak-indicator"),
    liveIndicator: document.querySelector("#ten-live-indicator"),
    
    // Set headers and cells
    set4Header: document.querySelector(".ten-set4-header"),
    set5Header: document.querySelector(".ten-set5-header"),
    tableP1Name: document.querySelector("#ten-table-p1"),
    tableP2Name: document.querySelector("#ten-table-p2"),
    s1g1: document.querySelector("#ten-s1g1"),
    s2g1: document.querySelector("#ten-s2g1"),
    s3g1: document.querySelector("#ten-s3g1"),
    s4g1: document.querySelector("#ten-s4g1"),
    s5g1: document.querySelector("#ten-s5g1"),
    s1g2: document.querySelector("#ten-s1g2"),
    s2g2: document.querySelector("#ten-s2g2"),
    s3g2: document.querySelector("#ten-s3g2"),
    s4g2: document.querySelector("#ten-s4g2"),
    s5g2: document.querySelector("#ten-s5g2"),
    setsWonP1: document.querySelector("#ten-setswon-p1"),
    setsWonP2: document.querySelector("#ten-setswon-p2"),

    // Dashboard Buttons
    p1PtBtn: document.querySelector("#ten-p1-pt-btn"),
    p2PtBtn: document.querySelector("#ten-p2-pt-btn"),
    toggleServerBtn: document.querySelector("#ten-toggle-server-btn"),
    undoBtn: document.querySelector("#ten-undo-btn"),
    faultBtn: document.querySelector("#ten-fault-btn"),
    submitResultBtn: document.querySelector("#ten-submit-result-btn"),
    timelineList: document.querySelector("#ten-timeline-list"),

    // Tournament Setup
    tsetupBackBtn: document.querySelector("#ten-tsetup-back-btn"),
    tnameInput: document.querySelector("#ten-tname-input"),
    tteamCount: document.querySelector("#ten-tteam-count"),
    tsetsSelect: document.querySelector("#ten-tsets-select"),
    tteamInputs: document.querySelector("#ten-tteam-inputs"),
    tcreateBtn: document.querySelector("#ten-tcreate-btn"),

    // Tournament Dashboard
    tdashboardBackBtn: document.querySelector("#ten-tdashboard-back-btn"),
    tresetBtn: document.querySelector("#ten-treset-btn"),
    tdashboardName: document.querySelector("#ten-tdashboard-name"),
    tabTable: document.querySelector("#ten-tab-table"),
    tabFixtures: document.querySelector("#ten-tab-fixtures"),
    tabEdit: document.querySelector("#ten-tab-edit"),
    tableView: document.querySelector("#ten-table-view"),
    fixturesView: document.querySelector("#ten-fixtures-view"),
    editView: document.querySelector("#ten-edit-view"),
    pointsTableBody: document.querySelector("#ten-points-table-body"),
    fixturesList: document.querySelector("#ten-fixtures-list"),
    editTeamsContainer: document.querySelector("#ten-edit-teams-container"),
    editSaveBtn: document.querySelector("#ten-edit-save-btn")
  };

  // Helper Toast
  function triggerTenToast(msg) {
    if (typeof showToast === "function") {
      showToast(msg);
    } else {
      alert(msg);
    }
  }

  // 3. NAVIGATION & ROUTING
  function hideAllTenViews() {
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

  window.showTennisPage = function (fromHash = false) {
    if (!fromHash) window.location.hash = "#tennis";

    // Hide cricket, football, and basketball wrappers
    const cp = document.querySelector("#cricket-page");
    const fp = document.querySelector("#football-page");
    const bp = document.querySelector("#basketball-page");
    const sp = document.querySelector("#sports-page");
    const fop = document.querySelector("#format-page");
    if (cp) cp.classList.add("hidden");
    if (fp) fp.classList.add("hidden");
    if (bp) bp.classList.add("hidden");
    if (sp) sp.classList.add("hidden");
    if (fop) fop.classList.add("hidden");

    if (els.tennisPage) els.tennisPage.classList.remove("hidden");

    hideAllTenViews();

    const hash = window.location.hash;
    if (hash === "#tennis") {
      if (els.formatView) els.formatView.classList.remove("hidden");
    } else if (hash === "#tennis-custom") {
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
    } else if (hash === "#tennis-match") {
      if (els.dashboardView) els.dashboardView.classList.remove("hidden");
      renderTennisDashboard();
    } else if (hash === "#tennis-tsetup") {
      if (els.tsetupView) els.tsetupView.classList.remove("hidden");
      renderTournamentTeamInputs();
    } else if (hash === "#tennis-tdashboard") {
      if (els.tdashboardView) els.tdashboardView.classList.remove("hidden");
      renderTournamentDashboard();
    }
  };

  // Local storage loaders
  function loadTennisState() {
    try {
      const stored = localStorage.getItem(TENNIS_STORAGE_KEY);
      const storedT = localStorage.getItem(TENNIST_STORAGE_KEY);

      if (stored) {
        ten = { ...clone(defaultTennisState), ...JSON.parse(stored) };
      }
      if (storedT) {
        tent = { ...clone(defaultTennistState), ...JSON.parse(storedT) };
      }
    } catch (e) {
      console.error("Failed to load tennis states: ", e);
    }
  }

  function saveTennisState() {
    try {
      localStorage.setItem(TENNIS_STORAGE_KEY, JSON.stringify(ten));
      localStorage.setItem(TENNIST_STORAGE_KEY, JSON.stringify(tent));
    } catch (e) {
      console.error("Failed to save tennis states: ", e);
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
      window.location.hash = "#tennis-custom";
    });
  }

  if (els.formatTournamentBtn) {
    els.formatTournamentBtn.addEventListener("click", () => {
      window.location.hash = "#tennis-tsetup";
    });
  }

  if (els.setupBackBtn) {
    els.setupBackBtn.addEventListener("click", () => {
      window.location.hash = "#tennis";
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
          triggerTenToast("Player names must be unique. Please resolve duplicates.");
          return;
        }
        p1 = `${t1p1} / ${t1p2}`;
        p2 = `${t2p1} / ${t2p2}`;
      } else {
        p1 = els.p1Input.value.trim() || "Player 1";
        p2 = els.p2Input.value.trim() || "Player 2";
        if (p1.toLowerCase() === p2.toLowerCase()) {
          triggerTenToast("Player names must be unique. Please use different names.");
          return;
        }
      }

      const setsLen = Number(els.setsSelect.value) || 3;
      const advSystem = els.advantageSelect.value;
      const tiebreakOn = els.tiebreakInput.checked;

      initializeTennisMatch(p1, p2, isDoubles ? "doubles" : "singles", setsLen, advSystem, tiebreakOn, t1p1, t1p2, t2p1, t2p2);
    });
  }

  function initializeTennisMatch(p1, p2, type, setsLen, advSystem, tiebreakOn, t1p1, t1p2, t2p1, t2p2) {
    ten = clone(defaultTennisState);
    ten.active = true;
    ten.isTournamentMatch = false;
    ten.p1Name = p1;
    ten.p2Name = p2;
    ten.matchType = type;
    ten.setsLength = setsLen;
    ten.advantageSystem = advSystem;
    ten.tiebreakEnabled = tiebreakOn;
    ten.t1p1 = t1p1; ten.t1p2 = t1p2;
    ten.t2p1 = t2p1; ten.t2p2 = t2p2;

    saveTennisState();
    window.location.hash = "#tennis-match";
  }

  // 5. TENNIS POINTS LOGIC ENGINE
  const POINTS_PATH = ["0", "15", "30", "40"];

  function saveToHistory() {
    ten.history.push({
      scoreP1: ten.scoreP1,
      scoreP2: ten.scoreP2,
      gamesP1: [...ten.gamesP1],
      gamesP2: [...ten.gamesP2],
      setsWonP1: ten.setsWonP1,
      setsWonP2: ten.setsWonP2,
      currentSetIndex: ten.currentSetIndex,
      isTiebreak: ten.isTiebreak,
      tiebreakPointsP1: ten.tiebreakPointsP1,
      tiebreakPointsP2: ten.tiebreakPointsP2,
      server: ten.server,
      matchCompleted: ten.matchCompleted,
      timeline: [...ten.timeline]
    });
    // Limit stack size to 20
    if (ten.history.length > 20) ten.history.shift();
  }

  function logTimelinePoint(desc) {
    const setsScore = `Set ${ten.currentSetIndex+1}: ${ten.gamesP1[ten.currentSetIndex]}-${ten.gamesP2[ten.currentSetIndex]}`;
    let gameScore = "";
    if (ten.isTiebreak) {
      gameScore = `TB Points: ${ten.tiebreakPointsP1}-${ten.tiebreakPointsP2}`;
    } else {
      gameScore = `Game Points: ${ten.scoreP1}-${ten.scoreP2}`;
    }

    ten.timeline.unshift({
      detail: desc,
      setScore: setsScore,
      gameScore: gameScore
    });
  }

  function addPointToPlayer(playerNum) {
    if (ten.matchCompleted) return;
    saveToHistory();

    const p1 = playerNum === 1;
    const activePlayerName = p1 ? ten.p1Name : ten.p2Name;

    if (ten.isTiebreak) {
      // Tiebreak Point progression (first to 7, win by 2)
      if (p1) ten.tiebreakPointsP1++;
      else ten.tiebreakPointsP2++;

      logTimelinePoint(`Point won by ${activePlayerName}`);

      // Tiebreaker server rotation: switch server every 2 points (starting from 2nd point)
      const totalPoints = ten.tiebreakPointsP1 + ten.tiebreakPointsP2;
      if (totalPoints % 2 === 1) {
        // Toggle server
        ten.server = ten.server === "p1" ? "p2" : "p1";
      }

      // Check for tiebreaker win
      const ptsA = ten.tiebreakPointsP1;
      const ptsB = ten.tiebreakPointsP2;
      if (ptsA >= 7 && (ptsA - ptsB) >= 2) {
        winGame(1);
      } else if (ptsB >= 7 && (ptsB - ptsA) >= 2) {
        winGame(2);
      }
    } else {
      // Standard Point progression
      let ptsA = ten.scoreP1;
      let ptsB = ten.scoreP2;

      if (ptsA === "0") {
        if (p1) ten.scoreP1 = "15";
        else scoreOpponentPt();
      } else if (ptsA === "15") {
        if (p1) ten.scoreP1 = "30";
        else scoreOpponentPt();
      } else if (ptsA === "30") {
        if (p1) ten.scoreP1 = "40";
        else scoreOpponentPt();
      } else if (ptsA === "40" && ptsB === "40") {
        // Deuce rules
        if (ten.advantageSystem === "no-ad") {
          // Sudden death point
          winGame(playerNum);
        } else {
          if (p1) ten.scoreP1 = "Ad";
          else ten.scoreP2 = "Ad";
        }
      } else if (ptsA === "Ad" && ptsB === "40") {
        if (p1) winGame(1);
        else ten.scoreP1 = "40"; // returns to deuce
      } else if (ptsB === "Ad" && ptsA === "40") {
        if (!p1) winGame(2);
        else ten.scoreP2 = "40"; // returns to deuce
      } else if (ptsA === "40" && ptsB !== "40" && ptsB !== "Ad") {
        if (p1) winGame(1);
        else scoreOpponentPt();
      } else if (ptsB === "40" && ptsA !== "40" && ptsA !== "Ad") {
        if (!p1) winGame(2);
        else scoreOpponentPt();
      }

      function scoreOpponentPt() {
        if (ptsB === "0") ten.scoreP2 = "15";
        else if (ptsB === "15") ten.scoreP2 = "30";
        else if (ptsB === "30") ten.scoreP2 = "40";
      }

      if (!ten.matchCompleted) {
        logTimelinePoint(`Point won by ${activePlayerName}`);
      }
    }

    saveTennisState();
    renderTennisDashboard();
  }

  function winGame(playerNum) {
    const isP1 = playerNum === 1;
    const name = isP1 ? ten.p1Name : ten.p2Name;

    // Reset game point scores
    ten.scoreP1 = "0";
    ten.scoreP2 = "0";
    ten.isTiebreak = false;
    ten.tiebreakPointsP1 = 0;
    ten.tiebreakPointsP2 = 0;

    // Increment games won in current set
    if (isP1) ten.gamesP1[ten.currentSetIndex]++;
    else ten.gamesP2[ten.currentSetIndex]++;

    logTimelinePoint(`🏆 Game won by ${name}`);
    triggerTenToast(`Game won by ${name}!`);

    // Switch server automatically for next game
    ten.server = ten.server === "p1" ? "p2" : "p1";

    // Check Set Win
    const gA = ten.gamesP1[ten.currentSetIndex];
    const gB = ten.gamesP2[ten.currentSetIndex];

    if (gA >= 6 && (gA - gB) >= 2) {
      winSet(1);
    } else if (gB >= 6 && (gB - gA) >= 2) {
      winSet(2);
    } else if (gA === 6 && gB === 6) {
      if (ten.tiebreakEnabled) {
        ten.isTiebreak = true;
        triggerTenToast("Set reaches 6-6! Triggering Tiebreaker!");
        logTimelinePoint("⚠️ Tiebreaker started!");
      }
    }
  }

  function winSet(playerNum) {
    const isP1 = playerNum === 1;
    const name = isP1 ? ten.p1Name : ten.p2Name;

    if (isP1) ten.setsWonP1++;
    else ten.setsWonP2++;

    logTimelinePoint(`🎾 Set won by ${name} (${ten.gamesP1[ten.currentSetIndex]}-${ten.gamesP2[ten.currentSetIndex]})`);
    triggerTenToast(`Set won by ${name}!`);

    // Check Match Win
    const targetSets = ten.setsLength === 3 ? 2 : 3;
    if (ten.setsWonP1 >= targetSets) {
      ten.matchCompleted = true;
      logTimelinePoint(`🎉 Match Won by ${ten.p1Name}!`);
      triggerTenToast(`Match Won by ${ten.p1Name}!`);
    } else if (ten.setsWonP2 >= targetSets) {
      ten.matchCompleted = true;
      logTimelinePoint(`🎉 Match Won by ${ten.p2Name}!`);
      triggerTenToast(`Match Won by ${ten.p2Name}!`);
    } else {
      // Go to next set
      ten.currentSetIndex++;
    }
  }

  function undoPoint() {
    if (ten.history.length === 0) {
      triggerTenToast("Nothing to undo!");
      return;
    }
    const prev = ten.history.pop();
    
    ten.scoreP1 = prev.scoreP1;
    ten.scoreP2 = prev.scoreP2;
    ten.gamesP1 = prev.gamesP1;
    ten.gamesP2 = prev.gamesP2;
    ten.setsWonP1 = prev.setsWonP1;
    ten.setsWonP2 = prev.setsWonP2;
    ten.currentSetIndex = prev.currentSetIndex;
    ten.isTiebreak = prev.isTiebreak;
    ten.tiebreakPointsP1 = prev.tiebreakPointsP1;
    ten.tiebreakPointsP2 = prev.tiebreakPointsP2;
    ten.server = prev.server;
    ten.matchCompleted = prev.matchCompleted;
    ten.timeline = prev.timeline;

    saveTennisState();
    renderTennisDashboard();
    triggerTenToast("Last point undone.");
  }

  function recordFault() {
    logTimelinePoint("⚠️ Fault / Double Fault logged.");
    triggerTenToast("Fault recorded.");
    saveTennisState();
    renderTennisDashboard();
  }

  // Bind Scorer controls click listeners
  if (els.p1PtBtn) els.p1PtBtn.addEventListener("click", () => addPointToPlayer(1));
  if (els.p2PtBtn) els.p2PtBtn.addEventListener("click", () => addPointToPlayer(2));
  if (els.toggleServerBtn) {
    els.toggleServerBtn.addEventListener("click", () => {
      ten.server = ten.server === "p1" ? "p2" : "p1";
      saveTennisState();
      renderTennisDashboard();
      triggerTenToast(`Server toggled. Now serving: ${ten.server === 'p1' ? ten.p1Name : ten.p2Name}`);
    });
  }
  if (els.undoBtn) els.undoBtn.addEventListener("click", undoPoint);
  if (els.faultBtn) els.faultBtn.addEventListener("click", recordFault);

  if (els.resetMatchBtn) {
    els.resetMatchBtn.addEventListener("click", () => {
      if (confirm("Are you sure you want to reset this match? All set points will be cleared.")) {
        ten.scoreP1 = "0";
        ten.scoreP2 = "0";
        ten.gamesP1 = [0, 0, 0, 0, 0];
        ten.gamesP2 = [0, 0, 0, 0, 0];
        ten.setsWonP1 = 0;
        ten.setsWonP2 = 0;
        ten.currentSetIndex = 0;
        ten.isTiebreak = false;
        ten.tiebreakPointsP1 = 0;
        ten.tiebreakPointsP2 = 0;
        ten.server = "p1";
        ten.timeline = [];
        ten.history = [];
        ten.matchCompleted = false;

        saveTennisState();
        renderTennisDashboard();
        triggerTenToast("Match scores reset.");
      }
    });
  }

  if (els.dashboardBackBtn) {
    els.dashboardBackBtn.addEventListener("click", () => {
      if (ten.isTournamentMatch && tent.active && tent.activeFixtureIndex !== -1) {
        tent.fixtures[tent.activeFixtureIndex].matchState = clone(ten);
        ten.active = false;
        saveTennisState();
        window.location.hash = "#tennis-tdashboard";
      } else {
        ten.active = false;
        saveTennisState();
        window.location.hash = "#tennis";
      }
    });
  }

  // 6. RENDER SCOREBOARD DETAILS
  function renderTennisDashboard() {
    if (!ten.active) return;

    if (els.p1NameDisplay) els.p1NameDisplay.textContent = ten.p1Name;
    if (els.p2NameDisplay) els.p2NameDisplay.textContent = ten.p2Name;
    if (els.tableP1Name) els.tableP1Name.textContent = ten.p1Name;
    if (els.tableP2Name) els.tableP2Name.textContent = ten.p2Name;

    // Service dot indicators
    if (els.p1Serving) els.p1Serving.style.display = ten.server === "p1" ? "inline-block" : "none";
    if (els.p2Serving) els.p2Serving.style.display = ten.server === "p2" ? "inline-block" : "none";

    // Point badge updates
    if (els.p1Points && els.p2Points) {
      if (ten.isTiebreak) {
        els.p1Points.textContent = ten.tiebreakPointsP1;
        els.p2Points.textContent = ten.tiebreakPointsP2;
      } else {
        els.p1Points.textContent = ten.scoreP1;
        els.p2Points.textContent = ten.scoreP2;
      }
    }

    if (els.tiebreakIndicator) {
      els.tiebreakIndicator.style.display = ten.isTiebreak ? "block" : "none";
    }
    if (els.liveIndicator) {
      els.liveIndicator.style.display = ten.matchCompleted ? "none" : "inline-flex";
    }

    // Set header limits (Best of 5 vs Best of 3 sets columns)
    const bestOf5 = ten.setsLength === 5;
    if (els.set4Header) els.set4Header.style.display = bestOf5 ? "table-cell" : "none";
    if (els.set5Header) els.set5Header.style.display = bestOf5 ? "table-cell" : "none";
    if (els.s4g1) els.s4g1.style.display = bestOf5 ? "table-cell" : "none";
    if (els.s5g1) els.s5g1.style.display = bestOf5 ? "table-cell" : "none";
    if (els.s4g2) els.s4g2.style.display = bestOf5 ? "table-cell" : "none";
    if (els.s5g2) els.s5g2.style.display = bestOf5 ? "table-cell" : "none";

    // Set numbers
    if (els.s1g1) els.s1g1.textContent = ten.gamesP1[0];
    if (els.s2g1) els.s2g1.textContent = ten.gamesP1[1];
    if (els.s3g1) els.s3g1.textContent = ten.gamesP1[2];
    if (els.s4g1) els.s4g1.textContent = ten.gamesP1[3];
    if (els.s5g1) els.s5g1.textContent = ten.gamesP1[4];

    if (els.s1g2) els.s1g2.textContent = ten.gamesP2[0];
    if (els.s2g2) els.s2g2.textContent = ten.gamesP2[1];
    if (els.s3g2) els.s3g2.textContent = ten.gamesP2[2];
    if (els.s4g2) els.s4g2.textContent = ten.gamesP2[3];
    if (els.s5g2) els.s5g2.textContent = ten.gamesP2[4];

    if (els.setsWonP1) els.setsWonP1.textContent = ten.setsWonP1;
    if (els.setsWonP2) els.setsWonP2.textContent = ten.setsWonP2;

    // Toggle submit results button if tournament fixture
    if (els.submitResultBtn) {
      if (ten.isTournamentMatch && ten.matchCompleted) {
        els.submitResultBtn.classList.remove("hidden");
      } else {
        els.submitResultBtn.classList.add("hidden");
      }
    }

    // Render Timeline Points List
    if (els.timelineList) {
      if (ten.timeline.length === 0) {
        els.timelineList.innerHTML = `<p style="color: var(--text-muted); font-style: italic; font-size: 0.9rem; margin: 0;">No points logged yet.</p>`;
      } else {
        els.timelineList.innerHTML = ten.timeline.map(e => `
          <div class="ten-log-item">
            <div>
              <span style="color:#fff; font-weight:700; margin-right:6px;">•</span>
              <span style="color:var(--ink);">${e.detail}</span>
            </div>
            <div style="font-family:monospace; font-size:0.8rem;">
              <span style="color:var(--gold); margin-right:8px;">[${e.setScore}]</span>
              <span style="color:var(--text-muted);">(${e.gameScore})</span>
            </div>
          </div>
        `).join("");
      }
    }
  }

  // 7. TENNIS TOURNAMENT LEAGUE RULES ENGINE
  function renderTournamentTeamInputs() {
    if (!els.tteamInputs) return;
    els.tteamInputs.innerHTML = "";

    const count = els.tteamCount ? Number(els.tteamCount.value) : 4;
    for (let i = 0; i < count; i++) {
      const div = document.createElement("div");
      div.className = "setup-group";
      div.innerHTML = `
        <label style="display: block; font-size: 0.8rem; color: var(--text-muted); margin-bottom: 6px; font-weight: 600;">Player ${i + 1} Name</label>
        <input type="text" class="tennis-tteam-name-input" placeholder="Player Name" autocomplete="off" style="width: 100%; height: 40px; background: rgba(0,0,0,0.2); border: 1px solid rgba(255,255,255,0.1); border-radius: 8px; color: var(--ink); padding: 0 12px; font-family: inherit; font-size: 0.9rem;" />
      `;
      els.tteamInputs.appendChild(div);
    }
  }

  if (els.tteamCount) {
    els.tteamCount.addEventListener("change", renderTournamentTeamInputs);
  }

  if (els.tsetupBackBtn) {
    els.tsetupBackBtn.addEventListener("click", () => {
      window.location.hash = "#tennis";
    });
  }

  if (els.tcreateBtn) {
    els.tcreateBtn.addEventListener("click", () => {
      const name = els.tnameInput.value.trim() || "Tennis Tournament Cup";
      const teamCount = Number(els.tteamCount.value) || 4;
      const setsLen = Number(els.tsetsSelect.value) || 3;

      const teamInputs = document.querySelectorAll(".tennis-tteam-name-input");
      const teamNames = [];
      const uniqueNames = new Set();

      for (let i = 0; i < teamInputs.length; i++) {
        const tName = teamInputs[i].value.trim() || `Player ${i + 1}`;
        const nameKey = tName.toLowerCase();
        if (uniqueNames.has(nameKey)) {
          triggerTenToast(`Names must be unique. Duplicate found: "${tName}"`);
          return;
        }
        uniqueNames.add(nameKey);
        teamNames.push(tName);
      }

      tent = clone(defaultTennistState);
      tent.active = true;
      tent.name = name;
      tent.teamCount = teamCount;
      tent.setsLength = setsLen;

      tent.teams = teamNames.map(t => ({
        name: t,
        played: 0,
        wins: 0,
        losses: 0,
        setsWon: 0,
        setsLost: 0,
        setsDiff: 0,
        gamesWon: 0,
        gamesLost: 0,
        gamesDiff: 0,
        pts: 0
      }));

      // Generate round-robin schedule
      tent.fixtures = [];
      const list = [...teamNames];
      const rounds = teamCount - 1;
      const halfSize = teamCount / 2;

      for (let r = 0; r < rounds * 2; r++) { // Double round-robin
        for (let i = 0; i < halfSize; i++) {
          const home = list[i];
          const away = list[teamCount - 1 - i];
          tent.fixtures.push({
            round: r + 1,
            teamA: r % 2 === 0 ? home : away,
            teamB: r % 2 === 0 ? away : home,
            scoreA: 0,
            scoreB: 0,
            status: "scheduled",
            matchState: null
          });
        }
        // Rotate list
        const last = list.pop();
        list.splice(1, 0, last);
      }

      saveTennisState();
      window.location.hash = "#tennis-tdashboard";
    });
  }

  // Tournament dashboard tab navigation
  const tabNames = ["table", "fixtures", "edit"];
  tabNames.forEach(tab => {
    const btn = document.querySelector(`#ten-tab-${tab}`);
    if (btn) {
      btn.addEventListener("click", () => {
        tabNames.forEach(t => {
          const btn2 = document.querySelector(`#ten-tab-${t}`);
          const view2 = document.querySelector(`#ten-${t}-view`);
          if (btn2 && view2) {
            btn2.classList.remove("active");
            view2.classList.add("hidden");
          }
        });
        btn.classList.add("active");
        const activeView = document.querySelector(`#ten-${tab}-view`);
        if (activeView) activeView.classList.remove("hidden");

        if (tab === "table") renderPointsTable();
        else if (tab === "fixtures") renderFixtures();
        else if (tab === "edit") renderEditSetup();
      });
    }
  });

  // Table calculations
  function renderPointsTable() {
    if (!tent.active) return;

    tent.teams.forEach(t => {
      t.played = 0; t.wins = 0; t.losses = 0; t.setsWon = 0; t.setsLost = 0; t.setsDiff = 0; t.gamesWon = 0; t.gamesLost = 0; t.gamesDiff = 0; t.pts = 0;
    });

    tent.fixtures.forEach(f => {
      if (f.status === "completed") {
        const tA = tent.teams.find(t => t.name === f.teamA);
        const tB = tent.teams.find(t => t.name === f.teamB);
        if (tA && tB) {
          tA.played++;
          tB.played++;

          const ms = f.matchState;
          if (ms) {
            tA.setsWon += ms.setsWonP1;
            tA.setsLost += ms.setsWonP2;
            tB.setsWon += ms.setsWonP2;
            tB.setsLost += ms.setsWonP1;

            // sum game points
            let gP1Sum = 0;
            let gP2Sum = 0;
            for (let i = 0; i <= ms.currentSetIndex; i++) {
              gP1Sum += ms.gamesP1[i];
              gP2Sum += ms.gamesP2[i];
            }
            tA.gamesWon += gP1Sum;
            tA.gamesLost += gP2Sum;
            tB.gamesWon += gP2Sum;
            tB.gamesLost += gP1Sum;
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

    tent.teams.forEach(t => {
      t.setsDiff = t.setsWon - t.setsLost;
      t.gamesDiff = t.gamesWon - t.gamesLost;
    });

    // Sort: pts DESC, setsDiff DESC, gamesDiff DESC
    const sorted = [...tent.teams].sort((a,b) => {
      if (b.pts !== a.pts) return b.pts - a.pts;
      if (b.setsDiff !== a.setsDiff) return b.setsDiff - a.setsDiff;
      return b.gamesDiff - a.gamesDiff;
    });

    if (els.pointsTableBody) {
      els.pointsTableBody.innerHTML = sorted.map((t, idx) => `
        <tr style="border-bottom: 1px solid rgba(255,255,255,0.05);">
          <td style="padding: 10px 8px; font-weight:700; color: var(--gold);">${idx + 1}</td>
          <td style="padding: 10px 8px; font-weight:700; color:#fff;">${t.name}</td>
          <td style="padding: 10px 8px;">${t.played}</td>
          <td style="padding: 10px 8px; color: #10b981;">${t.wins}</td>
          <td style="padding: 10px 8px; color: #f87171;">${t.losses}</td>
          <td style="padding: 10px 8px; color: ${t.setsDiff >= 0 ? '#10b981' : '#f87171'};">${t.setsWon}-${t.setsLost} (${t.setsDiff >= 0 ? '+' : ''}${t.setsDiff})</td>
          <td style="padding: 10px 8px; color: ${t.gamesDiff >= 0 ? '#10b981' : '#f87171'};">${t.gamesWon}-${t.gamesLost} (${t.gamesDiff >= 0 ? '+' : ''}${t.gamesDiff})</td>
          <td style="padding: 10px 8px; font-weight:900; text-align:right; color: var(--ten-primary);">${t.pts}</td>
        </tr>
      `).join("");
    }
  }

  function renderFixtures() {
    if (!els.fixturesList) return;
    els.fixturesList.innerHTML = "";

    tent.fixtures.forEach((f, idx) => {
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
            <div style="font-family: monospace; font-size:1.5rem; font-weight:900; color:var(--ten-primary);">${f.scoreA} - ${f.scoreB}</div>
            <span style="background: rgba(16,185,129,0.15); color:#10b981; font-size:0.75rem; padding:4px 8px; border-radius:6px; font-weight:700; text-transform:uppercase;">Played</span>
          </div>
        `;
      } else {
        rightSide = `
          <button class="start-custom" type="button" data-ten-fixture-index="${idx}" style="margin:0; padding:8px 16px; font-size:0.8rem; border-radius:6px; font-weight:700;">⏱️ Play Match</button>
        `;
      }

      card.innerHTML = leftSide + rightSide;
      els.fixturesList.appendChild(card);
    });

    document.querySelectorAll("[data-ten-fixture-index]").forEach(btn => {
      btn.addEventListener("click", (e) => {
        const idx = Number(e.currentTarget.getAttribute("data-ten-fixture-index"));
        const fix = tent.fixtures[idx];

        if (fix) {
          tent.activeFixtureIndex = idx;
          if (fix.matchState) {
            ten = clone(fix.matchState);
          } else {
            initializeTennisTournamentMatch(fix.teamA, fix.teamB);
          }
        }
      });
    });
  }

  function initializeTennisTournamentMatch(p1, p2) {
    ten = clone(defaultTennisState);
    ten.active = true;
    ten.isTournamentMatch = true;
    ten.p1Name = p1;
    ten.p2Name = p2;
    ten.matchType = "singles";
    ten.setsLength = tent.setsLength;
    ten.advantageSystem = "standard";
    ten.tiebreakEnabled = true;

    saveTennisState();
    window.location.hash = "#tennis-match";
  }

  function renderEditSetup() {
    if (els.editTeamsContainer) {
      els.editTeamsContainer.innerHTML = tent.teams.map((t, idx) => `
        <div class="setup-group">
          <label style="display: block; font-size: 0.85rem; color: var(--text-muted); margin-bottom: 4px; font-weight: 600;">Player ${idx + 1} Name</label>
          <input type="text" class="ten-edit-tteam-input" data-team-index="${idx}" value="${t.name}" autocomplete="off" style="width: 100%; height: 38px; background: rgba(0,0,0,0.25); border: 1px solid rgba(255,255,255,0.1); border-radius: 6px; color: var(--ink); padding: 0 12px; font-size: 0.9rem;" />
        </div>
      `).join("");
    }
  }

  if (els.editSaveBtn) {
    els.editSaveBtn.addEventListener("click", () => {
      const inputs = document.querySelectorAll(".ten-edit-tteam-input");
      const tempNames = [];
      const uniqueNames = new Set();

      for (let i = 0; i < inputs.length; i++) {
        const tName = inputs[i].value.trim();
        if (!tName) {
          triggerTenToast("Player name cannot be blank!");
          return;
        }
        const nameKey = tName.toLowerCase();
        if (uniqueNames.has(nameKey)) {
          triggerTenToast(`Names must be unique. Duplicate: "${tName}"`);
          return;
        }
        uniqueNames.add(nameKey);
        tempNames.push({ index: Number(inputs[i].getAttribute("data-team-index")), name: tName });
      }

      tempNames.forEach(item => {
        const oldName = tent.teams[item.index].name;
        const newName = item.name;

        if (oldName !== newName) {
          tent.teams[item.index].name = newName;
          
          tent.fixtures.forEach(f => {
            if (f.teamA === oldName) f.teamA = newName;
            if (f.teamB === oldName) f.teamB = newName;
            if (f.matchState) {
              if (f.matchState.p1Name === oldName) f.matchState.p1Name = newName;
              if (f.matchState.p2Name === oldName) f.matchState.p2Name = newName;
            }
          });
        }
      });

      triggerTenToast("Tournament settings saved successfully!");
      saveTennisState();
      renderPointsTable();
    });
  }

  // End of match score submission
  window.submitTenTournamentMatchResult = function () {
    if (!tent.active || tent.activeFixtureIndex === -1) return;

    const idx = tent.activeFixtureIndex;
    const fix = tent.fixtures[idx];

    fix.status = "completed";
    fix.scoreA = ten.setsWonP1;
    fix.scoreB = ten.setsWonP2;
    fix.matchState = clone(ten);

    ten.active = false;
    tent.activeFixtureIndex = -1;

    saveTennisState();
    triggerTenToast("Match score submitted successfully!");
    window.location.hash = "#tennis-tdashboard";
    renderPointsTable();
  };

  if (els.submitResultBtn) {
    els.submitResultBtn.addEventListener("click", () => {
      window.submitTenTournamentMatchResult();
    });
  }

  if (els.tresetBtn) {
    els.tresetBtn.addEventListener("click", () => {
      if (confirm("Are you sure you want to reset this tournament? All league scores will be lost.")) {
        tent = clone(defaultTennistState);
        saveTennisState();
        window.location.hash = "#tennis";
      }
    });
  }

  if (els.tdashboardBackBtn) {
    els.tdashboardBackBtn.addEventListener("click", () => {
      tent.active = false;
      saveTennisState();
      window.location.hash = "#tennis";
    });
  }

  // 8. INITIALIZE ROUTINGS
  loadTennisState();

  if (window.location.hash.startsWith("#tennis")) {
    showTennisPage(true);
  }

  window.addEventListener("hashchange", () => {
    if (window.location.hash.startsWith("#tennis")) {
      showTennisPage(true);
    }
  });

  // Bind the home card button from sports page
  const tennisCardBtn = document.querySelector("[data-open-sport='tennis']");
  if (tennisCardBtn) {
    tennisCardBtn.addEventListener("click", () => {
      window.location.hash = "#tennis";
    });
  }

})();
