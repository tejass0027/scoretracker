/**
 * ==========================================================================
 * BASEBALL SCORING & TOURNAMENT ENGINE
 * ==========================================================================
 * Modular Baseball & Softball tracker supporting 9/7/5/3 Innings,
 * Base Diamond runner advancement, B-S-O pitch counts, Box line score, and Tournaments.
 */

(() => {
  "use strict";

  // 1. STATE & CONSTANTS
  const BS_STORAGE_KEY = "scoretracker_baseball_match_state";
  const BST_STORAGE_KEY = "scoretracker_baseball_tournament_state";

  const defaultBaseballState = {
    active: false,
    isTournamentMatch: false,
    awayTeam: "Away Team",
    homeTeam: "Home Team",
    totalInnings: 9, // 9, 7, 5, or 3
    extraInningsRule: "standard",
    currentInning: 1, // 1-indexed
    isTopInning: true, // true = Top (Away batting), false = Bottom (Home batting)
    balls: 0, // 0 - 3
    strikes: 0, // 0 - 2
    outs: 0, // 0 - 2
    runners: { first: false, second: false, third: false },
    awayInningRuns: [0, null, null, null, null, null, null, null, null],
    homeInningRuns: [null, null, null, null, null, null, null, null, null],
    awayTotalRuns: 0,
    awayTotalHits: 0,
    awayTotalErrors: 0,
    homeTotalRuns: 0,
    homeTotalHits: 0,
    homeTotalErrors: 0,
    timeline: [], // { text, score, time }
    history: [], // stack of previous states for undo
    matchCompleted: false,
    winner: null
  };

  const defaultBstState = {
    active: false,
    name: "World Baseball Classic",
    teamCount: 4,
    totalInnings: 9,
    teams: [], // { name, played, wins, losses, pct, rs, ra, diff, pts }
    fixtures: [], // { round, teamA, teamB, runsA, runsB, status, matchState }
    activeFixtureIndex: -1
  };

  let bs = clone(defaultBaseballState);
  let bst = clone(defaultBstState);

  function clone(obj) {
    return JSON.parse(JSON.stringify(obj));
  }

  // 2. DOM ELEMENTS SELECTORS
  const els = {
    // Page Wrappers
    baseballPage: document.querySelector("#baseball-page"),
    formatView: document.querySelector("#bs-format-view"),
    setupView: document.querySelector("#bs-setup-view"),
    dashboardView: document.querySelector("#bs-dashboard-view"),
    tsetupView: document.querySelector("#bs-tsetup-view"),
    tdashboardView: document.querySelector("#bs-tdashboard-view"),

    // Format selection buttons
    formatBackBtn: document.querySelector("#bs-format-back-btn"),
    formatCustomBtn: document.querySelector("#bs-format-custom-btn"),
    formatTournamentBtn: document.querySelector("#bs-format-tournament-btn"),

    // Setup
    setupBackBtn: document.querySelector("#bs-setup-back-btn"),
    team1Input: document.querySelector("#bs-team1-input"),
    team2Input: document.querySelector("#bs-team2-input"),
    inningsSelect: document.querySelector("#bs-innings-select"),
    extraInningsSelect: document.querySelector("#bs-extrainnings-select"),
    startBtn: document.querySelector("#bs-start-btn"),

    // Dashboard Header & Status
    dashboardBackBtn: document.querySelector("#bs-dashboard-back-btn"),
    resetMatchBtn: document.querySelector("#bs-reset-match-btn"),
    liveIndicator: document.querySelector("#bs-live-indicator"),
    inningBadge: document.querySelector("#bs-inning-badge"),

    // Line Score Table
    linescoreHeaderRow: document.querySelector("#bs-linescore-header-row"),
    tableAwayName: document.querySelector("#bs-table-away-name"),
    tableHomeName: document.querySelector("#bs-table-home-name"),
    awayR: document.querySelector("#bs-a-r"),
    awayH: document.querySelector("#bs-a-h"),
    awayE: document.querySelector("#bs-a-e"),
    homeR: document.querySelector("#bs-h-r"),
    homeH: document.querySelector("#bs-h-h"),
    homeE: document.querySelector("#bs-h-e"),

    // Big Run Displays & Batting Badges
    awayNameDisplay: document.querySelector("#bs-away-name-display"),
    homeNameDisplay: document.querySelector("#bs-home-name-display"),
    awayRunsDisplay: document.querySelector("#bs-away-runs-display"),
    homeRunsDisplay: document.querySelector("#bs-home-runs-display"),
    awayBattingBadge: document.querySelector("#bs-away-batting-badge"),
    homeBattingBadge: document.querySelector("#bs-home-batting-badge"),

    // Base Diamond
    base1: document.querySelector("#bs-base-1"),
    base2: document.querySelector("#bs-base-2"),
    base3: document.querySelector("#bs-base-3"),

    // Count Lights (B - S - O)
    dotB1: document.querySelector("#bs-dot-b1"),
    dotB2: document.querySelector("#bs-dot-b2"),
    dotB3: document.querySelector("#bs-dot-b3"),
    dotS1: document.querySelector("#bs-dot-s1"),
    dotS2: document.querySelector("#bs-dot-s2"),
    dotO1: document.querySelector("#bs-dot-o1"),
    dotO2: document.querySelector("#bs-dot-o2"),

    // Action Controls
    btnBall: document.querySelector("#bs-btn-ball"),
    btnStrike: document.querySelector("#bs-btn-strike"),
    btnFoul: document.querySelector("#bs-btn-foul"),
    clearBasesBtn: document.querySelector("#bs-clear-bases-btn"),
    undoBtn: document.querySelector("#bs-undo-btn"),
    nextInningBtn: document.querySelector("#bs-next-inning-btn"),
    submitResultBtn: document.querySelector("#bs-submit-result-btn"),
    timelineList: document.querySelector("#bs-timeline-list"),

    // Tournament Setup
    tsetupBackBtn: document.querySelector("#bs-tsetup-back-btn"),
    tnameInput: document.querySelector("#bs-tname-input"),
    tteamCount: document.querySelector("#bs-tteam-count"),
    tinningsSelect: document.querySelector("#bs-tinnings-select"),
    tteamInputs: document.querySelector("#bs-tteam-inputs"),
    tcreateBtn: document.querySelector("#bs-tcreate-btn"),

    // Tournament Dashboard
    tdashboardBackBtn: document.querySelector("#bs-tdashboard-back-btn"),
    tresetBtn: document.querySelector("#bs-treset-btn"),
    tdashboardName: document.querySelector("#bs-tdashboard-name"),
    tabTable: document.querySelector("#bs-tab-table"),
    tabFixtures: document.querySelector("#bs-tab-fixtures"),
    tabEdit: document.querySelector("#bs-tab-edit"),
    tableView: document.querySelector("#bs-table-view"),
    fixturesView: document.querySelector("#bs-fixtures-view"),
    editView: document.querySelector("#bs-edit-view"),
    pointsTableBody: document.querySelector("#bs-points-table-body"),
    fixturesList: document.querySelector("#bs-fixtures-list"),
    editTeamsContainer: document.querySelector("#bs-edit-teams-container"),
    editSaveBtn: document.querySelector("#bs-edit-save-btn")
  };

  // 3. TOAST & AUDIO EFFECTS
  function triggerBsToast(message) {
    const existing = document.querySelector(".bs-toast-notification");
    if (existing) existing.remove();

    const toast = document.createElement("div");
    toast.className = "bs-toast-notification";
    toast.textContent = message;
    toast.style.position = "fixed";
    toast.style.bottom = "24px";
    toast.style.left = "50%";
    toast.style.transform = "translateX(-50%)";
    toast.style.background = "#ef4444";
    toast.style.color = "#ffffff";
    toast.style.padding = "10px 20px";
    toast.style.borderRadius = "30px";
    toast.style.fontWeight = "800";
    toast.style.fontSize = "0.9rem";
    toast.style.boxShadow = "0 8px 24px rgba(0,0,0,0.5)";
    toast.style.zIndex = "99999";
    toast.style.animation = "fadeIn 0.2s ease";

    document.body.appendChild(toast);
    setTimeout(() => {
      toast.style.opacity = "0";
      toast.style.transition = "opacity 0.3s";
      setTimeout(() => toast.remove(), 300);
    }, 2500);
  }

  function playBaseballAudio(type = "hit") {
    try {
      const AudioCtx = window.AudioContext || window.webkitAudioContext;
      if (!AudioCtx) return;
      const ctx = new AudioCtx();
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      if (type === "hr") {
        osc.type = "sawtooth";
        osc.frequency.setValueAtTime(300, ctx.currentTime);
        osc.frequency.exponentialRampToValueAtTime(700, ctx.currentTime + 0.6);
        gain.gain.setValueAtTime(0.3, ctx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.6);
        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.start();
        osc.stop(ctx.currentTime + 0.6);
      } else if (type === "out") {
        osc.type = "sine";
        osc.frequency.setValueAtTime(280, ctx.currentTime);
        osc.frequency.exponentialRampToValueAtTime(140, ctx.currentTime + 0.4);
        gain.gain.setValueAtTime(0.25, ctx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.4);
        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.start();
        osc.stop(ctx.currentTime + 0.4);
      } else {
        osc.type = "triangle";
        osc.frequency.setValueAtTime(450, ctx.currentTime);
        osc.frequency.exponentialRampToValueAtTime(200, ctx.currentTime + 0.15);
        gain.gain.setValueAtTime(0.3, ctx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.15);
        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.start();
        osc.stop(ctx.currentTime + 0.15);
      }
    } catch (e) {
      console.warn("Audio not supported", e);
    }
  }

  // 4. STORAGE PERSISTENCE
  function loadBaseballState() {
    try {
      const stored = localStorage.getItem(BS_STORAGE_KEY);
      const storedT = localStorage.getItem(BST_STORAGE_KEY);
      if (stored) bs = { ...clone(defaultBaseballState), ...JSON.parse(stored) };
      if (storedT) bst = { ...clone(defaultBstState), ...JSON.parse(storedT) };
    } catch (e) {
      console.error("Failed to load baseball state", e);
    }
  }

  function saveBaseballState() {
    try {
      localStorage.setItem(BS_STORAGE_KEY, JSON.stringify(bs));
      localStorage.setItem(BST_STORAGE_KEY, JSON.stringify(bst));
    } catch (e) {
      console.error("Failed to save baseball state", e);
    }
  }

  // 5. VIEW NAVIGATION
  function hideAllBsViews() {
    if (els.formatView) els.formatView.classList.add("hidden");
    if (els.setupView) els.setupView.classList.add("hidden");
    if (els.dashboardView) els.dashboardView.classList.add("hidden");
    if (els.tsetupView) els.tsetupView.classList.add("hidden");
    if (els.tdashboardView) els.tdashboardView.classList.add("hidden");
  }

  function showBaseballPage(fromHash = false) {
    const pages = ["#cricket-page", "#football-page", "#basketball-page", "#tennis-page", "#badminton-page", "#hockey-page", "#volleyball-page", "#sports-page", "#format-page"];
    pages.forEach(p => {
      const el = document.querySelector(p);
      if (el) el.classList.add("hidden");
    });

    if (els.baseballPage) els.baseballPage.classList.remove("hidden");
    hideAllBsViews();

    const hash = window.location.hash;
    if (hash === "#baseball") {
      if (els.formatView) els.formatView.classList.remove("hidden");
    } else if (hash === "#baseball-custom") {
      if (els.setupView) els.setupView.classList.remove("hidden");
      if (els.team1Input) els.team1Input.value = "";
      if (els.team2Input) els.team2Input.value = "";
    } else if (hash === "#baseball-match") {
      if (els.dashboardView) els.dashboardView.classList.remove("hidden");
      renderBaseballDashboard();
    } else if (hash === "#baseball-tsetup") {
      if (els.tsetupView) els.tsetupView.classList.remove("hidden");
      renderTournamentTeamInputs();
    } else if (hash === "#baseball-tdashboard") {
      if (els.tdashboardView) els.tdashboardView.classList.remove("hidden");
      renderTournamentDashboard();
    }
  }

  window.showBaseballPage = showBaseballPage;

  // 6. FORMAT CHOICE LISTENERS
  if (els.formatBackBtn) {
    els.formatBackBtn.addEventListener("click", () => {
      window.location.hash = "#sports";
    });
  }

  if (els.formatCustomBtn) {
    els.formatCustomBtn.addEventListener("click", () => {
      window.location.hash = "#baseball-custom";
    });
  }

  if (els.formatTournamentBtn) {
    els.formatTournamentBtn.addEventListener("click", () => {
      if (bst.active) {
        window.location.hash = "#baseball-tdashboard";
      } else {
        window.location.hash = "#baseball-tsetup";
      }
    });
  }

  // 7. MATCH SETUP & START
  if (els.setupBackBtn) {
    els.setupBackBtn.addEventListener("click", () => {
      window.location.hash = "#baseball";
    });
  }

  if (els.startBtn) {
    els.startBtn.addEventListener("click", () => {
      const away = els.team1Input.value.trim() || "New York Yankees";
      const home = els.team2Input.value.trim() || "Boston Red Sox";
      const innings = Number(els.inningsSelect ? els.inningsSelect.value : 9);
      const extraRule = els.extraInningsSelect ? els.extraInningsSelect.value : "standard";

      if (away.toLowerCase() === home.toLowerCase()) {
        triggerBsToast("Away and Home teams must be different.");
        return;
      }

      initializeBaseballMatch(away, home, innings, extraRule);
    });
  }

  function initializeBaseballMatch(away, home, innings = 9, extraRule = "standard") {
    bs = clone(defaultBaseballState);
    bs.active = true;
    bs.isTournamentMatch = false;
    bs.awayTeam = away;
    bs.homeTeam = home;
    bs.totalInnings = innings;
    bs.extraInningsRule = extraRule;
    bs.currentInning = 1;
    bs.isTopInning = true;
    bs.balls = 0;
    bs.strikes = 0;
    bs.outs = 0;
    bs.runners = { first: false, second: false, third: false };

    bs.awayInningRuns = new Array(innings).fill(null);
    bs.homeInningRuns = new Array(innings).fill(null);
    bs.awayInningRuns[0] = 0;

    saveBaseballState();
    window.location.hash = "#baseball-match";
  }

  // 8. SCORING & BASE RUNNERS ENGINE
  function saveToHistory() {
    bs.history.push({
      currentInning: bs.currentInning,
      isTopInning: bs.isTopInning,
      balls: bs.balls,
      strikes: bs.strikes,
      outs: bs.outs,
      runners: clone(bs.runners),
      awayInningRuns: [...bs.awayInningRuns],
      homeInningRuns: [...bs.homeInningRuns],
      awayTotalRuns: bs.awayTotalRuns,
      awayTotalHits: bs.awayTotalHits,
      awayTotalErrors: bs.awayTotalErrors,
      homeTotalRuns: bs.homeTotalRuns,
      homeTotalHits: bs.homeTotalHits,
      homeTotalErrors: bs.homeTotalErrors,
      matchCompleted: bs.matchCompleted,
      winner: bs.winner
    });
    if (bs.history.length > 30) bs.history.shift();
  }

  function logTimelineEvent(desc) {
    const halfStr = bs.isTopInning ? "▲ Top" : "▼ Bot";
    const inningStr = `${halfStr} ${bs.currentInning}`;
    const scoreStr = `${bs.awayTeam} ${bs.awayTotalRuns} - ${bs.homeTotalRuns} ${bs.homeTeam}`;

    bs.timeline.unshift({
      text: desc,
      score: scoreStr,
      time: inningStr
    });
  }

  function addRunsToBattingTeam(numRuns) {
    if (numRuns <= 0) return;
    const innIdx = bs.currentInning - 1;

    if (bs.isTopInning) {
      bs.awayTotalRuns += numRuns;
      if (bs.awayInningRuns[innIdx] === null) bs.awayInningRuns[innIdx] = 0;
      bs.awayInningRuns[innIdx] += numRuns;
    } else {
      bs.homeTotalRuns += numRuns;
      if (bs.homeInningRuns[innIdx] === null) bs.homeInningRuns[innIdx] = 0;
      bs.homeInningRuns[innIdx] += numRuns;
    }
  }

  // At-Bat Event Processor
  function handleHitAction(hitType) {
    if (bs.matchCompleted) return;
    saveToHistory();

    const battingTeam = bs.isTopInning ? bs.awayTeam : bs.homeTeam;
    const r = bs.runners;
    let runsScored = 0;

    switch (hitType) {
      case "1B": // Single
        playBaseballAudio("hit");
        if (bs.isTopInning) bs.awayTotalHits++;
        else bs.homeTotalHits++;

        if (r.third) { runsScored++; r.third = false; }
        if (r.second) { runsScored++; r.second = false; }
        if (r.first) { r.second = true; }
        r.first = true;

        addRunsToBattingTeam(runsScored);
        bs.balls = 0; bs.strikes = 0;
        logTimelineEvent(`⚾ Single (1B) by ${battingTeam}${runsScored ? ` (${runsScored} Run${runsScored > 1 ? 's' : ''} scored)` : ''}`);
        triggerBsToast(`Single! ${runsScored ? `+${runsScored} Run!` : ''}`);
        break;

      case "2B": // Double
        playBaseballAudio("hit");
        if (bs.isTopInning) bs.awayTotalHits++;
        else bs.homeTotalHits++;

        if (r.third) { runsScored++; r.third = false; }
        if (r.second) { runsScored++; r.second = false; }
        if (r.first) { r.third = true; r.first = false; }
        r.second = true;

        addRunsToBattingTeam(runsScored);
        bs.balls = 0; bs.strikes = 0;
        logTimelineEvent(`🚀 Double (2B) by ${battingTeam}${runsScored ? ` (${runsScored} Run${runsScored > 1 ? 's' : ''} scored)` : ''}`);
        triggerBsToast(`Double! ${runsScored ? `+${runsScored} Runs!` : ''}`);
        break;

      case "3B": // Triple
        playBaseballAudio("hit");
        if (bs.isTopInning) bs.awayTotalHits++;
        else bs.homeTotalHits++;

        if (r.third) { runsScored++; r.third = false; }
        if (r.second) { runsScored++; r.second = false; }
        if (r.first) { runsScored++; r.first = false; }
        r.third = true;

        addRunsToBattingTeam(runsScored);
        bs.balls = 0; bs.strikes = 0;
        logTimelineEvent(`🔥 Triple (3B) by ${battingTeam} (${runsScored} Runs scored)`);
        triggerBsToast(`Triple! +${runsScored} Runs!`);
        break;

      case "HR": // Home Run
        playBaseballAudio("hr");
        if (bs.isTopInning) bs.awayTotalHits++;
        else bs.homeTotalHits++;

        runsScored = 1; // Batter scores
        if (r.third) { runsScored++; r.third = false; }
        if (r.second) { runsScored++; r.second = false; }
        if (r.first) { runsScored++; r.first = false; }

        addRunsToBattingTeam(runsScored);
        bs.balls = 0; bs.strikes = 0;
        const hrLabel = runsScored === 4 ? "GRAND SLAM" : runsScored === 3 ? "3-Run Homer" : runsScored === 2 ? "2-Run Homer" : "Solo Home Run";
        logTimelineEvent(`💥 ${hrLabel} by ${battingTeam}! (+${runsScored} Runs)`);
        triggerBsToast(`💥 ${hrLabel}! (+${runsScored} Runs)`);
        break;

      case "BB": // Walk / Base on Balls
      case "HBP": // Hit By Pitch
        playBaseballAudio("hit");
        if (r.first && r.second && r.third) {
          runsScored++;
        } else if (r.first && r.second) {
          r.third = true;
        } else if (r.first) {
          r.second = true;
        }
        r.first = true;

        addRunsToBattingTeam(runsScored);
        bs.balls = 0; bs.strikes = 0;
        logTimelineEvent(`🚶 Walk (BB) for ${battingTeam}${runsScored ? ' (Bases Loaded Walk!)' : ''}`);
        triggerBsToast(`Walk awarded${runsScored ? ' (+1 Run)' : ''}`);
        break;

      case "K": // Strikeout
        playBaseballAudio("out");
        bs.balls = 0; bs.strikes = 0;
        recordOut(`❌ Strikeout (K) of ${battingTeam} batter`);
        break;

      case "OUT": // Flyout / Groundout
        playBaseballAudio("out");
        bs.balls = 0; bs.strikes = 0;
        recordOut(`🛡️ Out recorded by fielding team`);
        break;

      case "ERR": // Fielding Error
        playBaseballAudio("hit");
        if (bs.isTopInning) bs.homeTotalErrors++;
        else bs.awayTotalErrors++;

        if (r.third) { runsScored++; r.third = false; }
        if (r.second) { r.third = true; r.second = false; }
        if (r.first) { r.second = true; r.first = false; }
        r.first = true;

        addRunsToBattingTeam(runsScored);
        bs.balls = 0; bs.strikes = 0;
        logTimelineEvent(`⚠️ Error committed! Batter safe at 1st${runsScored ? ` (+${runsScored} Run)` : ''}`);
        triggerBsToast(`Fielding Error!`);
        break;
    }

    saveBaseballState();
    renderBaseballDashboard();
  }

  function recordOut(eventDesc = "") {
    bs.outs++;
    if (eventDesc) logTimelineEvent(eventDesc);

    if (bs.outs >= 3) {
      triggerBsToast("3 Outs! Switching sides.");
      advanceHalfInning();
    } else {
      triggerBsToast(`Out recorded (${bs.outs} Out${bs.outs > 1 ? 's' : ''})`);
    }
  }

  // Pitch Count Handlers
  function addBall() {
    if (bs.matchCompleted) return;
    saveToHistory();
    bs.balls++;

    if (bs.balls >= 4) {
      handleHitAction("BB");
    } else {
      triggerBsToast(`Ball ${bs.balls}`);
      saveBaseballState();
      renderBaseballDashboard();
    }
  }

  function addStrike() {
    if (bs.matchCompleted) return;
    saveToHistory();
    bs.strikes++;

    if (bs.strikes >= 3) {
      handleHitAction("K");
    } else {
      triggerBsToast(`Strike ${bs.strikes}`);
      saveBaseballState();
      renderBaseballDashboard();
    }
  }

  function addFoul() {
    if (bs.matchCompleted) return;
    saveToHistory();
    if (bs.strikes < 2) bs.strikes++;
    triggerBsToast("Foul Ball");
    saveBaseballState();
    renderBaseballDashboard();
  }

  // Inning Transitions
  function advanceHalfInning() {
    if (bs.matchCompleted) return;
    saveToHistory();

    bs.balls = 0;
    bs.strikes = 0;
    bs.outs = 0;
    bs.runners = { first: false, second: false, third: false };

    const cur = bs.currentInning;

    if (bs.isTopInning) {
      // Top of Inning completes -> Go to Bottom of same Inning
      bs.isTopInning = false;
      const innIdx = cur - 1;
      if (bs.homeInningRuns[innIdx] === null) bs.homeInningRuns[innIdx] = 0;

      // Check if Home team is already leading in bottom of final inning
      if (cur >= bs.totalInnings && bs.homeTotalRuns > bs.awayTotalRuns) {
        finishBaseballMatch(bs.homeTeam);
        return;
      }
    } else {
      // Bottom of Inning completes -> Check game completion or go to Next Inning Top
      if (cur >= bs.totalInnings) {
        if (bs.awayTotalRuns !== bs.homeTotalRuns) {
          const winner = bs.awayTotalRuns > bs.homeTotalRuns ? bs.awayTeam : bs.homeTeam;
          finishBaseballMatch(winner);
          return;
        } else if (bs.extraInningsRule === "draw") {
          finishBaseballMatch(null); // Draw
          return;
        }
      }

      // Proceed to Next Inning (Top)
      bs.currentInning++;
      bs.isTopInning = true;

      // Expand line score array if extra innings
      if (bs.currentInning > bs.awayInningRuns.length) {
        bs.awayInningRuns.push(0);
        bs.homeInningRuns.push(null);
      } else {
        bs.awayInningRuns[bs.currentInning - 1] = 0;
      }

      logTimelineEvent(`--- Start of Inning ${bs.currentInning} ---`);
    }

    saveBaseballState();
    renderBaseballDashboard();
  }

  function finishBaseballMatch(winnerName) {
    bs.matchCompleted = true;
    bs.winner = winnerName;

    if (winnerName) {
      logTimelineEvent(`🏁 FINAL - Game won by ${winnerName}! (${bs.awayTeam} ${bs.awayTotalRuns} - ${bs.homeTotalRuns} ${bs.homeTeam})`);
      triggerBsToast(`🎉 Game Over - ${winnerName} Wins!`);
    } else {
      logTimelineEvent(`🏁 FINAL - Game ended in a Tie! (${bs.awayTotalRuns} - ${bs.homeTotalRuns})`);
      triggerBsToast(`Game Over - Tie Game!`);
    }

    saveBaseballState();
    renderBaseballDashboard();
  }

  // Undo
  function undoBaseballEvent() {
    if (!bs.history || bs.history.length === 0) {
      triggerBsToast("No actions to undo.");
      return;
    }
    const prev = bs.history.pop();
    bs.currentInning = prev.currentInning;
    bs.isTopInning = prev.isTopInning;
    bs.balls = prev.balls;
    bs.strikes = prev.strikes;
    bs.outs = prev.outs;
    bs.runners = clone(prev.runners);
    bs.awayInningRuns = [...prev.awayInningRuns];
    bs.homeInningRuns = [...prev.homeInningRuns];
    bs.awayTotalRuns = prev.awayTotalRuns;
    bs.awayTotalHits = prev.awayTotalHits;
    bs.awayTotalErrors = prev.awayTotalErrors;
    bs.homeTotalRuns = prev.homeTotalRuns;
    bs.homeTotalHits = prev.homeTotalHits;
    bs.homeTotalErrors = prev.homeTotalErrors;
    bs.matchCompleted = prev.matchCompleted;
    bs.winner = prev.winner;

    if (bs.timeline.length > 0) bs.timeline.shift();

    saveBaseballState();
    renderBaseballDashboard();
    triggerBsToast("Last play undone.");
  }

  // Render Dashboard
  function renderBaseballDashboard() {
    if (!els.dashboardView) return;

    if (els.awayNameDisplay) els.awayNameDisplay.textContent = bs.awayTeam;
    if (els.homeNameDisplay) els.homeNameDisplay.textContent = bs.homeTeam;
    if (els.tableAwayName) els.tableAwayName.textContent = bs.awayTeam;
    if (els.tableHomeName) els.tableHomeName.textContent = bs.homeTeam;

    if (els.awayRunsDisplay) els.awayRunsDisplay.textContent = bs.awayTotalRuns;
    if (els.homeRunsDisplay) els.homeRunsDisplay.textContent = bs.homeTotalRuns;

    if (els.awayR) els.awayR.textContent = bs.awayTotalRuns;
    if (els.awayH) els.awayH.textContent = bs.awayTotalHits;
    if (els.awayE) els.awayE.textContent = bs.awayTotalErrors;

    if (els.homeR) els.homeR.textContent = bs.homeTotalRuns;
    if (els.homeH) els.homeH.textContent = bs.homeTotalHits;
    if (els.homeE) els.homeE.textContent = bs.homeTotalErrors;

    // Batting Indicator Badges
    if (els.awayBattingBadge) {
      if (!bs.matchCompleted && bs.isTopInning) els.awayBattingBadge.classList.remove("hidden");
      else els.awayBattingBadge.classList.add("hidden");
    }
    if (els.homeBattingBadge) {
      if (!bs.matchCompleted && !bs.isTopInning) els.homeBattingBadge.classList.remove("hidden");
      else els.homeBattingBadge.classList.add("hidden");
    }

    // Inning Badge
    if (els.inningBadge) {
      if (bs.matchCompleted) {
        els.inningBadge.textContent = bs.winner ? `FINAL • ${bs.winner} WINS` : "FINAL • TIE";
        els.inningBadge.style.color = "#10b981";
      } else {
        const half = bs.isTopInning ? "▲ Top" : "▼ Bot";
        const suffix = bs.currentInning === 1 ? "1st" : bs.currentInning === 2 ? "2nd" : bs.currentInning === 3 ? "3rd" : `${bs.currentInning}th`;
        els.inningBadge.textContent = `${half} ${suffix}`;
        els.inningBadge.style.color = bs.isTopInning ? "var(--bs-primary)" : "#38bdf8";
      }
    }

    // Render Inning Line Score Table
    renderLineScoreTable();

    // Base Diamond Active States
    if (els.base1) els.base1.className = `bs-base first ${bs.runners.first ? 'occupied' : ''}`;
    if (els.base2) els.base2.className = `bs-base second ${bs.runners.second ? 'occupied' : ''}`;
    if (els.base3) els.base3.className = `bs-base third ${bs.runners.third ? 'occupied' : ''}`;

    // Count Lights (B - S - O)
    if (els.dotB1) els.dotB1.className = `bs-count-dot ball ${bs.balls >= 1 ? 'active' : ''}`;
    if (els.dotB2) els.dotB2.className = `bs-count-dot ball ${bs.balls >= 2 ? 'active' : ''}`;
    if (els.dotB3) els.dotB3.className = `bs-count-dot ball ${bs.balls >= 3 ? 'active' : ''}`;

    if (els.dotS1) els.dotS1.className = `bs-count-dot strike ${bs.strikes >= 1 ? 'active' : ''}`;
    if (els.dotS2) els.dotS2.className = `bs-count-dot strike ${bs.strikes >= 2 ? 'active' : ''}`;

    if (els.dotO1) els.dotO1.className = `bs-count-dot out ${bs.outs >= 1 ? 'active' : ''}`;
    if (els.dotO2) els.dotO2.className = `bs-count-dot out ${bs.outs >= 2 ? 'active' : ''}`;

    // Live Indicator
    if (els.liveIndicator) {
      if (bs.matchCompleted) els.liveIndicator.classList.add("hidden");
      else els.liveIndicator.classList.remove("hidden");
    }

    // Tournament Result button
    if (els.submitResultBtn) {
      if (bs.isTournamentMatch && bs.matchCompleted) els.submitResultBtn.classList.remove("hidden");
      else els.submitResultBtn.classList.add("hidden");
    }

    // Render Timeline Log
    if (els.timelineList) {
      if (bs.timeline.length === 0) {
        els.timelineList.innerHTML = `<p style="color: var(--text-muted); font-style: italic; font-size: 0.9rem; margin: 0;">No plays recorded yet.</p>`;
      } else {
        els.timelineList.innerHTML = bs.timeline.map(item => `
          <div class="bs-log-item">
            <div>
              <div style="font-weight: 700;">${item.text}</div>
              <div style="font-size: 0.75rem; color: var(--text-muted); margin-top: 2px;">${item.score}</div>
            </div>
            <div style="font-family: monospace; font-size: 0.75rem; color: var(--bs-primary); font-weight:700;">${item.time}</div>
          </div>
        `).join("");
      }
    }
  }

  function renderLineScoreTable() {
    const totalCols = Math.max(bs.totalInnings, bs.currentInning, 9);

    for (let i = 1; i <= 9; i++) {
      const cellA = document.querySelector(`#bs-a-${i}`);
      const cellH = document.querySelector(`#bs-h-${i}`);

      if (cellA) {
        const valA = bs.awayInningRuns[i - 1];
        cellA.textContent = valA !== null && valA !== undefined ? valA : "-";
        if (i === bs.currentInning && bs.isTopInning && !bs.matchCompleted) {
          cellA.className = "bs-inning-active-col";
        } else {
          cellA.className = "";
        }
      }

      if (cellH) {
        const valH = bs.homeInningRuns[i - 1];
        cellH.textContent = valH !== null && valH !== undefined ? valH : "-";
        if (i === bs.currentInning && !bs.isTopInning && !bs.matchCompleted) {
          cellH.className = "bs-inning-active-col";
        } else {
          cellH.className = "";
        }
      }
    }
  }

  // 9. DASHBOARD EVENT LISTENERS
  if (els.dashboardBackBtn) {
    els.dashboardBackBtn.addEventListener("click", () => {
      if (bs.isTournamentMatch) {
        window.location.hash = "#baseball-tdashboard";
      } else {
        window.location.hash = "#baseball";
      }
    });
  }

  if (els.resetMatchBtn) {
    els.resetMatchBtn.addEventListener("click", () => {
      if (confirm("Reset current Baseball game? All runs, hits, and line scores will be erased.")) {
        initializeBaseballMatch(bs.awayTeam, bs.homeTeam, bs.totalInnings, bs.extraInningsRule);
      }
    });
  }

  // Clickable bases to toggle runner on/off manually
  if (els.base1) {
    els.base1.addEventListener("click", () => {
      if (bs.matchCompleted) return;
      saveToHistory();
      bs.runners.first = !bs.runners.first;
      saveBaseballState();
      renderBaseballDashboard();
      triggerBsToast(`1st Base ${bs.runners.first ? 'Occupied' : 'Cleared'}`);
    });
  }

  if (els.base2) {
    els.base2.addEventListener("click", () => {
      if (bs.matchCompleted) return;
      saveToHistory();
      bs.runners.second = !bs.runners.second;
      saveBaseballState();
      renderBaseballDashboard();
      triggerBsToast(`2nd Base ${bs.runners.second ? 'Occupied' : 'Cleared'}`);
    });
  }

  if (els.base3) {
    els.base3.addEventListener("click", () => {
      if (bs.matchCompleted) return;
      saveToHistory();
      bs.runners.third = !bs.runners.third;
      saveBaseballState();
      renderBaseballDashboard();
      triggerBsToast(`3rd Base ${bs.runners.third ? 'Occupied' : 'Cleared'}`);
    });
  }

  if (els.clearBasesBtn) {
    els.clearBasesBtn.addEventListener("click", () => {
      if (bs.matchCompleted) return;
      saveToHistory();
      bs.runners = { first: false, second: false, third: false };
      saveBaseballState();
      renderBaseballDashboard();
      triggerBsToast("Bases Cleared");
    });
  }

  if (els.btnBall) els.btnBall.addEventListener("click", addBall);
  if (els.btnStrike) els.btnStrike.addEventListener("click", addStrike);
  if (els.btnFoul) els.btnFoul.addEventListener("click", addFoul);

  document.querySelectorAll("[data-hit]").forEach(btn => {
    btn.addEventListener("click", (e) => {
      const hitType = e.currentTarget.getAttribute("data-hit");
      handleHitAction(hitType);
    });
  });

  if (els.undoBtn) els.undoBtn.addEventListener("click", undoBaseballEvent);
  if (els.nextInningBtn) els.nextInningBtn.addEventListener("click", advanceHalfInning);

  // Submit Result for Tournament Match
  if (els.submitResultBtn) {
    els.submitResultBtn.addEventListener("click", () => {
      if (bst.active && bst.activeFixtureIndex >= 0) {
        const fix = bst.fixtures[bst.activeFixtureIndex];
        if (fix) {
          fix.scoreA = `${bs.awayTotalRuns} (${bs.awayTotalHits}H, ${bs.awayTotalErrors}E)`;
          fix.scoreB = `${bs.homeTotalRuns} (${bs.homeTotalHits}H, ${bs.homeTotalErrors}E)`;
          fix.runsA = bs.awayTotalRuns;
          fix.runsB = bs.homeTotalRuns;
          fix.status = "completed";
          fix.matchState = clone(bs);
          saveBaseballState();
          triggerBsToast("Tournament match result submitted!");
          window.location.hash = "#baseball-tdashboard";
        }
      }
    });
  }

  // 10. TOURNAMENT ENGINE
  if (els.tsetupBackBtn) {
    els.tsetupBackBtn.addEventListener("click", () => {
      window.location.hash = "#baseball";
    });
  }

  if (els.tteamCount) {
    els.tteamCount.addEventListener("change", renderTournamentTeamInputs);
  }

  function renderTournamentTeamInputs() {
    if (!els.tteamInputs) return;
    const count = Number(els.tteamCount ? els.tteamCount.value : 4);
    const defaultBaseballTeams = ["New York Yankees", "Boston Red Sox", "Los Angeles Dodgers", "Houston Astros", "Chicago Cubs", "Atlanta Braves", "San Francisco Giants", "St. Louis Cardinals"];

    els.tteamInputs.innerHTML = "";
    for (let i = 0; i < count; i++) {
      const defName = defaultBaseballTeams[i] || `Team ${i + 1}`;
      const div = document.createElement("div");
      div.innerHTML = `
        <label style="display: block; font-size: 0.8rem; color: var(--text-muted); margin-bottom: 4px; font-weight: 600;">Team ${i + 1} Name</label>
        <input type="text" class="baseball-tteam-name-input" value="${defName}" autocomplete="off" style="width: 100%; height: 38px; background: rgba(0,0,0,0.25); border: 1px solid rgba(255,255,255,0.1); border-radius: 6px; color: var(--ink); padding: 0 12px; font-size: 0.9rem;" />
      `;
      els.tteamInputs.appendChild(div);
    }
  }

  if (els.tcreateBtn) {
    els.tcreateBtn.addEventListener("click", () => {
      const name = els.tnameInput.value.trim() || "Baseball Championship";
      const teamCount = Number(els.tteamCount.value) || 4;
      const innings = Number(els.tinningsSelect ? els.tinningsSelect.value : 9);

      const teamInputs = document.querySelectorAll(".baseball-tteam-name-input");
      const teamNames = [];
      const uniqueNames = new Set();

      for (let i = 0; i < teamInputs.length; i++) {
        const tName = teamInputs[i].value.trim() || `Team ${i + 1}`;
        const nameKey = tName.toLowerCase();
        if (uniqueNames.has(nameKey)) {
          triggerBsToast(`Team names must be unique. Duplicate found: "${tName}"`);
          return;
        }
        uniqueNames.add(nameKey);
        teamNames.push(tName);
      }

      bst = clone(defaultBstState);
      bst.active = true;
      bst.name = name;
      bst.teamCount = teamCount;
      bst.totalInnings = innings;

      bst.teams = teamNames.map(t => ({
        name: t,
        played: 0,
        wins: 0,
        losses: 0,
        pct: ".000",
        rs: 0,
        ra: 0,
        diff: 0,
        pts: 0
      }));

      // Generate round-robin schedule
      bst.fixtures = [];
      const list = [...teamNames];
      const rounds = teamCount - 1;
      const halfSize = teamCount / 2;

      for (let r = 0; r < rounds; r++) {
        for (let i = 0; i < halfSize; i++) {
          const away = list[i];
          const home = list[teamCount - 1 - i];
          bst.fixtures.push({
            round: r + 1,
            teamA: away, // Away
            teamB: home, // Home
            scoreA: "",
            scoreB: "",
            runsA: 0,
            runsB: 0,
            status: "pending",
            matchState: null
          });
        }
        list.splice(1, 0, list.pop());
      }

      saveBaseballState();
      window.location.hash = "#baseball-tdashboard";
    });
  }

  // Tournament Tabs
  const bsTabs = ["table", "fixtures", "edit"];
  bsTabs.forEach(tab => {
    const btn = document.querySelector(`#bs-tab-${tab}`);
    if (btn) {
      btn.addEventListener("click", () => {
        bsTabs.forEach(t => {
          const b = document.querySelector(`#bs-tab-${t}`);
          const v = document.querySelector(`#bs-${t}-view`);
          if (b) b.classList.remove("active");
          if (v) v.classList.add("hidden");
        });
        btn.classList.add("active");
        const activeView = document.querySelector(`#bs-${tab}-view`);
        if (activeView) activeView.classList.remove("hidden");

        if (tab === "table") renderPointsTable();
        else if (tab === "fixtures") renderFixtures();
        else if (tab === "edit") renderEditSetup();
      });
    }
  });

  // Standings Table Calculation
  function renderPointsTable() {
    if (!bst.active) return;

    bst.teams.forEach(t => {
      t.played = 0; t.wins = 0; t.losses = 0; t.rs = 0; t.ra = 0; t.diff = 0; t.pts = 0;
    });

    bst.fixtures.forEach(f => {
      if (f.status === "completed" && f.matchState) {
        const tA = bst.teams.find(t => t.name === f.teamA);
        const tB = bst.teams.find(t => t.name === f.teamB);
        if (tA && tB) {
          tA.played++;
          tB.played++;
          tA.rs += f.runsA;
          tA.ra += f.runsB;
          tB.rs += f.runsB;
          tB.ra += f.runsA;

          if (f.runsA > f.runsB) {
            tA.wins++;
            tA.pts += 2;
            tB.losses++;
          } else if (f.runsB > f.runsA) {
            tB.wins++;
            tB.pts += 2;
            tA.losses++;
          }
        }
      }
    });

    bst.teams.forEach(t => {
      t.diff = t.rs - t.ra;
      const winPct = t.played > 0 ? (t.wins / t.played).toFixed(3) : ".000";
      t.pct = winPct.startsWith("0.") ? winPct.substring(1) : winPct;
    });

    const sorted = [...bst.teams].sort((a, b) => {
      if (b.wins !== a.wins) return b.wins - a.wins;
      if (b.diff !== a.diff) return b.diff - a.diff;
      return b.rs - a.rs;
    });

    if (els.pointsTableBody) {
      els.pointsTableBody.innerHTML = sorted.map((t, idx) => `
        <tr style="border-bottom: 1px solid rgba(255,255,255,0.05);">
          <td style="padding: 10px 8px; font-weight:700; color: var(--bs-primary);">${idx + 1}</td>
          <td style="padding: 10px 8px; font-weight:700; color:#fff;">${t.name}</td>
          <td style="padding: 10px 8px; text-align:center;">${t.played}</td>
          <td style="padding: 10px 8px; text-align:center; color: #10b981;">${t.wins}</td>
          <td style="padding: 10px 8px; text-align:center; color: #f87171;">${t.losses}</td>
          <td style="padding: 10px 8px; text-align:center; font-family:monospace; font-weight:700;">${t.pct}</td>
          <td style="padding: 10px 8px; text-align:center;">${t.rs}</td>
          <td style="padding: 10px 8px; text-align:center;">${t.ra}</td>
          <td style="padding: 10px 8px; text-align:center; color: ${t.diff >= 0 ? '#10b981' : '#f87171'};">${t.diff >= 0 ? '+' : ''}${t.diff}</td>
          <td style="padding: 10px 8px; font-weight:900; text-align:right; color: var(--bs-primary);">${t.pts}</td>
        </tr>
      `).join("");
    }
  }

  function renderFixtures() {
    if (!els.fixturesList) return;
    els.fixturesList.innerHTML = "";

    bst.fixtures.forEach((f, idx) => {
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
          <span style="font-size: 0.75rem; color: var(--bs-primary); font-weight:700; text-transform:uppercase;">Round ${f.round}</span>
          <div style="font-weight: 700; font-size:1.05rem; margin-top:4px; color:#fff;">
            ${f.teamA} (Away) <span style="color:var(--text-muted); font-size:0.85rem; font-weight:normal; margin:0 6px;">@</span> ${f.teamB} (Home)
          </div>
        </div>
      `;

      let rightSide = "";
      if (f.status === "completed") {
        rightSide = `
          <div style="display:flex; align-items:center; gap:16px;">
            <div style="font-family: monospace; font-size:1.4rem; font-weight:900; color:var(--bs-primary);">${f.runsA} - ${f.runsB}</div>
            <span style="background: rgba(16,185,129,0.15); color:#10b981; font-size:0.75rem; padding:4px 8px; border-radius:6px; font-weight:700; text-transform:uppercase;">Final</span>
          </div>
        `;
      } else {
        rightSide = `
          <button class="start-custom" type="button" data-bs-fixture-index="${idx}" style="margin:0; padding:8px 16px; font-size:0.8rem; border-radius:6px; font-weight:700;">⚾ Play Game</button>
        `;
      }

      card.innerHTML = leftSide + rightSide;
      els.fixturesList.appendChild(card);
    });

    document.querySelectorAll("[data-bs-fixture-index]").forEach(btn => {
      btn.addEventListener("click", (e) => {
        const idx = Number(e.currentTarget.getAttribute("data-bs-fixture-index"));
        const fix = bst.fixtures[idx];

        if (fix) {
          bst.activeFixtureIndex = idx;
          if (fix.matchState) {
            bs = clone(fix.matchState);
          } else {
            initializeBaseballTournamentMatch(fix.teamA, fix.teamB);
          }
        }
      });
    });
  }

  function initializeBaseballTournamentMatch(away, home) {
    bs = clone(defaultBaseballState);
    bs.active = true;
    bs.isTournamentMatch = true;
    bs.awayTeam = away;
    bs.homeTeam = home;
    bs.totalInnings = bst.totalInnings || 9;
    bs.extraInningsRule = "standard";
    bs.currentInning = 1;
    bs.isTopInning = true;
    bs.balls = 0;
    bs.strikes = 0;
    bs.outs = 0;
    bs.runners = { first: false, second: false, third: false };

    bs.awayInningRuns = new Array(bs.totalInnings).fill(null);
    bs.homeInningRuns = new Array(bs.totalInnings).fill(null);
    bs.awayInningRuns[0] = 0;

    saveBaseballState();
    window.location.hash = "#baseball-match";
  }

  function renderEditSetup() {
    if (els.editTeamsContainer) {
      els.editTeamsContainer.innerHTML = bst.teams.map((t, idx) => `
        <div class="setup-group">
          <label style="display: block; font-size: 0.85rem; color: var(--text-muted); margin-bottom: 4px; font-weight: 600;">Team ${idx + 1} Name</label>
          <input type="text" class="bs-edit-tteam-input" data-team-index="${idx}" value="${t.name}" autocomplete="off" style="width: 100%; height: 38px; background: rgba(0,0,0,0.25); border: 1px solid rgba(255,255,255,0.1); border-radius: 6px; color: var(--ink); padding: 0 12px; font-size: 0.9rem;" />
        </div>
      `).join("");
    }
  }

  if (els.editSaveBtn) {
    els.editSaveBtn.addEventListener("click", () => {
      const inputs = document.querySelectorAll(".bs-edit-tteam-input");
      const names = [];
      const unique = new Set();

      for (let i = 0; i < inputs.length; i++) {
        const val = inputs[i].value.trim() || `Team ${i + 1}`;
        if (unique.has(val.toLowerCase())) {
          triggerBsToast(`Duplicate name: "${val}"`);
          return;
        }
        unique.add(val.toLowerCase());
        names.push(val);
      }

      names.forEach((n, idx) => {
        const oldName = bst.teams[idx].name;
        bst.teams[idx].name = n;

        bst.fixtures.forEach(f => {
          if (f.teamA === oldName) f.teamA = n;
          if (f.teamB === oldName) f.teamB = n;
        });
      });

      saveBaseballState();
      triggerBsToast("Team names updated!");
      document.querySelector("#bs-tab-table").click();
    });
  }

  if (els.tresetBtn) {
    els.tresetBtn.addEventListener("click", () => {
      if (confirm("Are you sure you want to reset this baseball tournament? All match results and points will be erased.")) {
        bst = clone(defaultBstState);
        saveBaseballState();
        window.location.hash = "#baseball";
      }
    });
  }

  if (els.tdashboardBackBtn) {
    els.tdashboardBackBtn.addEventListener("click", () => {
      bst.active = false;
      saveBaseballState();
      window.location.hash = "#baseball";
    });
  }

  function renderTournamentDashboard() {
    if (els.tdashboardName) els.tdashboardName.textContent = bst.name;
    renderPointsTable();
  }

  // 11. INITIALIZE BASEBALL ROUTINGS
  loadBaseballState();

  if (window.location.hash.startsWith("#baseball")) {
    showBaseballPage(true);
  }

  window.addEventListener("hashchange", () => {
    if (window.location.hash.startsWith("#baseball")) {
      showBaseballPage(true);
    }
  });

  // Bind Home Sports Card button
  const baseballCardBtn = document.querySelector("[data-open-sport='baseball']");
  if (baseballCardBtn) {
    baseballCardBtn.addEventListener("click", () => {
      window.location.hash = "#baseball";
    });
  }

})();
