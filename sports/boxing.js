/**
 * ==========================================================================
 * BOXING SCORER & CHAMPIONSHIP ENGINE
 * ==========================================================================
 * Modular Boxing tracker supporting official WBC / WBA / IBF / WBO standards:
 * 10-Point Must scoring system, 3-Judge scorecard table (UD, SD, MD, Draw),
 * Compubox-style punch statistics (Jabs, Power Punches, Knockdowns, Fouls),
 * 3-Minute live countdown timer with Boxing Bell audio, KO/TKO stoppage system,
 * and Boxing Championship Tournament engine.
 */

(() => {
  "use strict";

  // 1. STATE & CONSTANTS
  const BX_STORAGE_KEY = "scoretracker_boxing_match_state";
  const BXT_STORAGE_KEY = "scoretracker_boxing_tournament_state";

  const defaultBoxingState = {
    active: false,
    isTournamentMatch: false,
    redName: "Tyson Fury",
    blueName: "Oleksandr Usyk",
    totalRounds: 12,
    roundDuration: 180, // 3 mins in seconds
    currentRound: 1,
    timerSeconds: 180,
    timerRunning: false,
    isRestPeriod: false,
    weightDivision: "Heavyweight",
    rounds: [], // { roundNum, redJ1, redJ2, redJ3, blueJ1, blueJ2, blueJ3, redJabs, redPower, blueJabs, bluePower, redKd, blueKd, redFoul, blueFoul, scored }
    redTotals: { scoreJ1: 0, scoreJ2: 0, scoreJ3: 0, jabs: 0, power: 0, kd: 0, fouls: 0, avgScore: 0 },
    blueTotals: { scoreJ1: 0, scoreJ2: 0, scoreJ3: 0, jabs: 0, power: 0, kd: 0, fouls: 0, avgScore: 0 },
    boutCompleted: false,
    winner: null,
    decisionType: null, // "UD", "SD", "MD", "KO", "TKO", "RTD", "DQ", "Draw"
    timeline: [], // { text, round, time }
    history: []
  };

  const defaultBxtState = {
    active: false,
    name: "World Heavyweight Super Six Championship",
    boxerCount: 4,
    roundsPerBout: 12,
    boxers: [], // { name, bouts: 0, wins: 0, losses: 0, draws: 0, kos: 0, pts: 0 }
    fixtures: [], // { id, red, blue, completed, resultText, winner }
    activeFixtureId: null
  };

  let bx = clone(defaultBoxingState);
  let bxt = clone(defaultBxtState);
  let timerInterval = null;

  function clone(obj) {
    return JSON.parse(JSON.stringify(obj));
  }

  // 2. DOM ELEMENTS SELECTORS
  const els = {
    // Page Wrappers
    boxingPage: document.querySelector("#boxing-page"),
    formatView: document.querySelector("#bx-format-view"),
    setupView: document.querySelector("#bx-setup-view"),
    dashboardView: document.querySelector("#bx-dashboard-view"),
    tsetupView: document.querySelector("#bx-tsetup-view"),
    tdashboardView: document.querySelector("#bx-tdashboard-view"),

    // Format selection buttons
    formatBackBtn: document.querySelector("#bx-format-back-btn"),
    formatCustomBtn: document.querySelector("#bx-format-custom-btn"),
    formatTournamentBtn: document.querySelector("#bx-format-tournament-btn"),

    // Setup
    setupBackBtn: document.querySelector("#bx-setup-back-btn"),
    redInput: document.querySelector("#bx-red-input"),
    blueInput: document.querySelector("#bx-blue-input"),
    roundsSelect: document.querySelector("#bx-rounds-select"),
    durationSelect: document.querySelector("#bx-duration-select"),
    weightSelect: document.querySelector("#bx-weight-select"),
    startBtn: document.querySelector("#bx-start-btn"),

    // Dashboard Header & Status
    dashboardBackBtn: document.querySelector("#bx-dashboard-back-btn"),
    resetMatchBtn: document.querySelector("#bx-reset-match-btn"),
    liveIndicator: document.querySelector("#bx-live-indicator"),
    roundTitle: document.querySelector("#bx-round-title"),
    decisionBadge: document.querySelector("#bx-decision-badge"),
    roundClock: document.querySelector("#bx-round-clock"),
    timerToggleBtn: document.querySelector("#bx-timer-toggle-btn"),
    bellBtn: document.querySelector("#bx-bell-btn"),
    resetClockBtn: document.querySelector("#bx-reset-clock-btn"),

    // Corner Displays
    redNameDisplay: document.querySelector("#bx-red-name-display"),
    redScoreDisplay: document.querySelector("#bx-red-score-display"),
    redKdCount: document.querySelector("#bx-red-kd-count"),
    redTotalPunches: document.querySelector("#bx-red-total-punches"),
    redJabsCount: document.querySelector("#bx-red-jabs-count"),
    redPowerCount: document.querySelector("#bx-red-power-count"),

    blueNameDisplay: document.querySelector("#bx-blue-name-display"),
    blueScoreDisplay: document.querySelector("#bx-blue-score-display"),
    blueKdCount: document.querySelector("#bx-blue-kd-count"),
    blueTotalPunches: document.querySelector("#bx-blue-total-punches"),
    blueJabsCount: document.querySelector("#bx-blue-jabs-count"),
    bluePowerCount: document.querySelector("#bx-blue-power-count"),

    // 10-Point Must Quick Buttons
    score109Red: document.querySelector("#bx-score-10-9-red"),
    score108Red: document.querySelector("#bx-score-10-8-red"),
    score1010Even: document.querySelector("#bx-score-10-10-even"),
    score109Blue: document.querySelector("#bx-score-10-9-blue"),
    score108Blue: document.querySelector("#bx-score-10-8-blue"),

    stoppageKoBtn: document.querySelector("#bx-stoppage-ko-btn"),
    stoppageRtdBtn: document.querySelector("#bx-stoppage-rtd-btn"),
    nextRoundBtn: document.querySelector("#bx-next-round-btn"),

    // 3-Judge Scorecard Table
    scorecardTableBody: document.querySelector("#bx-scorecard-table-body"),
    scorecardTableFoot: document.querySelector("#bx-scorecard-table-foot"),

    // Control Buttons
    undoBtn: document.querySelector("#bx-undo-btn"),
    endBoutBtn: document.querySelector("#bx-end-bout-btn"),
    submitResultBtn: document.querySelector("#bx-submit-result-btn"),
    timelineList: document.querySelector("#bx-timeline-list"),

    // Tournament Setup
    tsetupBackBtn: document.querySelector("#bx-tsetup-back-btn"),
    tnameInput: document.querySelector("#bx-tname-input"),
    tteamCount: document.querySelector("#bx-tteam-count"),
    troundsSelect: document.querySelector("#bx-trounds-select"),
    tteamInputs: document.querySelector("#bx-tteam-inputs"),
    tcreateBtn: document.querySelector("#bx-tcreate-btn"),

    // Tournament Dashboard
    tdashboardBackBtn: document.querySelector("#bx-tdashboard-back-btn"),
    tresetBtn: document.querySelector("#bx-treset-btn"),
    tdashboardName: document.querySelector("#bx-tdashboard-name"),
    tabTable: document.querySelector("#bx-tab-table"),
    tabFixtures: document.querySelector("#bx-tab-fixtures"),
    tabEdit: document.querySelector("#bx-tab-edit"),
    tableView: document.querySelector("#bx-table-view"),
    fixturesView: document.querySelector("#bx-fixtures-view"),
    editView: document.querySelector("#bx-edit-view"),
    pointsTableBody: document.querySelector("#bx-points-table-body"),
    fixturesList: document.querySelector("#bx-fixtures-list"),
    editTeamsContainer: document.querySelector("#bx-edit-teams-container"),
    editSaveBtn: document.querySelector("#bx-edit-save-btn")
  };

  // 3. TOAST & AUDIO EFFECTS
  function triggerBxToast(message) {
    const existing = document.querySelector(".bx-toast-notification");
    if (existing) existing.remove();

    const toast = document.createElement("div");
    toast.className = "bx-toast-notification";
    toast.textContent = message;
    toast.style.position = "fixed";
    toast.style.bottom = "24px";
    toast.style.left = "50%";
    toast.style.transform = "translateX(-50%)";
    toast.style.background = "#f59e0b";
    toast.style.color = "#090d16";
    toast.style.padding = "10px 20px";
    toast.style.borderRadius = "30px";
    toast.style.fontWeight = "900";
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

  function playBoxingAudio(type = "bell") {
    try {
      const AudioCtx = window.AudioContext || window.webkitAudioContext;
      if (!AudioCtx) return;
      const ctx = new AudioCtx();

      if (type === "bell") {
        // Classic Boxing Bell: 3 sharp metallic ring dings
        for (let i = 0; i < 3; i++) {
          const osc = ctx.createOscillator();
          const gain = ctx.createGain();
          const startTime = ctx.currentTime + (i * 0.28);

          osc.type = "sine";
          osc.frequency.setValueAtTime(1480, startTime);
          osc.frequency.exponentialRampToValueAtTime(1200, startTime + 0.4);

          gain.gain.setValueAtTime(0.35, startTime);
          gain.gain.exponentialRampToValueAtTime(0.001, startTime + 0.45);

          osc.connect(gain);
          gain.connect(ctx.destination);
          osc.start(startTime);
          osc.stop(startTime + 0.45);
        }
      } else if (type === "kd") {
        // Heavy Knockdown Impact Sound
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = "sawtooth";
        osc.frequency.setValueAtTime(160, ctx.currentTime);
        osc.frequency.exponentialRampToValueAtTime(40, ctx.currentTime + 0.35);

        gain.gain.setValueAtTime(0.4, ctx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.35);

        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.start();
        osc.stop(ctx.currentTime + 0.35);
      } else if (type === "punch") {
        // Glove Pop Sound
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = "triangle";
        osc.frequency.setValueAtTime(320, ctx.currentTime);
        osc.frequency.exponentialRampToValueAtTime(110, ctx.currentTime + 0.08);

        gain.gain.setValueAtTime(0.25, ctx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.08);

        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.start();
        osc.stop(ctx.currentTime + 0.08);
      }
    } catch (e) {
      console.warn("Audio not available", e);
    }
  }

  // 4. STORAGE PERSISTENCE
  function loadBoxingState() {
    try {
      const stored = localStorage.getItem(BX_STORAGE_KEY);
      const storedT = localStorage.getItem(BXT_STORAGE_KEY);
      if (stored) bx = { ...clone(defaultBoxingState), ...JSON.parse(stored) };
      if (storedT) bxt = { ...clone(defaultBxtState), ...JSON.parse(storedT) };
    } catch (e) {
      console.error("Failed to load boxing state", e);
    }
  }

  function saveBoxingState() {
    try {
      localStorage.setItem(BX_STORAGE_KEY, JSON.stringify(bx));
      localStorage.setItem(BXT_STORAGE_KEY, JSON.stringify(bxt));
    } catch (e) {
      console.error("Failed to save boxing state", e);
    }
  }

  // 5. VIEW NAVIGATION
  function hideAllBxViews() {
    if (els.formatView) els.formatView.classList.add("hidden");
    if (els.setupView) els.setupView.classList.add("hidden");
    if (els.dashboardView) els.dashboardView.classList.add("hidden");
    if (els.tsetupView) els.tsetupView.classList.add("hidden");
    if (els.tdashboardView) els.tdashboardView.classList.add("hidden");
  }

  function showBoxingPage(fromHash = false) {
    const pages = ["#cricket-page", "#football-page", "#basketball-page", "#tennis-page", "#badminton-page", "#hockey-page", "#volleyball-page", "#baseball-page", "#rugby-page", "#kabaddi-page", "#tabletennis-page", "#golf-page", "#sports-page", "#format-page"];
    pages.forEach(p => {
      const el = document.querySelector(p);
      if (el) el.classList.add("hidden");
    });

    if (els.boxingPage) els.boxingPage.classList.remove("hidden");
    hideAllBxViews();

    const hash = window.location.hash;
    if (hash === "#boxing") {
      if (els.formatView) els.formatView.classList.remove("hidden");
    } else if (hash === "#boxing-custom") {
      if (els.setupView) els.setupView.classList.remove("hidden");
    } else if (hash === "#boxing-match") {
      if (els.dashboardView) els.dashboardView.classList.remove("hidden");
      renderBoxingDashboard();
    } else if (hash === "#boxing-tsetup") {
      if (els.tsetupView) els.tsetupView.classList.remove("hidden");
      renderTournamentFighterInputs();
    } else if (hash === "#boxing-tdashboard") {
      if (els.tdashboardView) els.tdashboardView.classList.remove("hidden");
      renderTournamentDashboard();
    }
  }

  window.showBoxingPage = showBoxingPage;

  // 6. FORMAT CHOICE LISTENERS
  if (els.formatBackBtn) {
    els.formatBackBtn.addEventListener("click", () => {
      window.location.hash = "#sports";
    });
  }

  if (els.formatCustomBtn) {
    els.formatCustomBtn.addEventListener("click", () => {
      window.location.hash = "#boxing-custom";
    });
  }

  if (els.formatTournamentBtn) {
    els.formatTournamentBtn.addEventListener("click", () => {
      if (bxt.active) {
        window.location.hash = "#boxing-tdashboard";
      } else {
        window.location.hash = "#boxing-tsetup";
      }
    });
  }

  // 7. SETUP VIEW & START
  if (els.setupBackBtn) {
    els.setupBackBtn.addEventListener("click", () => {
      window.location.hash = "#boxing";
    });
  }

  if (els.startBtn) {
    els.startBtn.addEventListener("click", () => {
      const redName = (els.redInput ? els.redInput.value.trim() : "") || "Tyson Fury";
      const blueName = (els.blueInput ? els.blueInput.value.trim() : "") || "Oleksandr Usyk";
      const totalRounds = Number(els.roundsSelect ? els.roundsSelect.value : 12);
      const duration = Number(els.durationSelect ? els.durationSelect.value : 180);
      const weight = (els.weightSelect ? els.weightSelect.value : "Heavyweight");

      if (redName.toLowerCase() === blueName.toLowerCase()) {
        triggerBxToast("Red corner and Blue corner boxers must have distinct names!");
        return;
      }

      initializeBoxingBout(redName, blueName, totalRounds, duration, weight);
    });
  }

  function initializeBoxingBout(redName, blueName, totalRounds = 12, duration = 180, weight = "Heavyweight") {
    stopRoundTimer();

    bx = clone(defaultBoxingState);
    bx.active = true;
    bx.isTournamentMatch = false;
    bx.redName = redName;
    bx.blueName = blueName;
    bx.totalRounds = totalRounds;
    bx.roundDuration = duration;
    bx.timerSeconds = duration;
    bx.weightDivision = weight;
    bx.currentRound = 1;

    // Initialize round slots
    bx.rounds = [];
    for (let r = 1; r <= totalRounds; r++) {
      bx.rounds.push({
        roundNum: r,
        redJ1: null, redJ2: null, redJ3: null,
        blueJ1: null, blueJ2: null, blueJ3: null,
        redJabs: 0, redPower: 0,
        blueJabs: 0, bluePower: 0,
        redKd: 0, blueKd: 0,
        redFoul: 0, blueFoul: 0,
        scored: false
      });
    }

    recalculateBoutTotals();
    saveBoxingState();
    playBoxingAudio("bell");
    window.location.hash = "#boxing-match";
  }

  // 8. SCORING & BOUT LOGIC
  function saveToHistory() {
    bx.history.push({
      currentRound: bx.currentRound,
      timerSeconds: bx.timerSeconds,
      isRestPeriod: bx.isRestPeriod,
      rounds: clone(bx.rounds),
      boutCompleted: bx.boutCompleted,
      winner: bx.winner,
      decisionType: bx.decisionType
    });
    if (bx.history.length > 30) bx.history.shift();
  }

  function recalculateBoutTotals() {
    let rJ1 = 0, rJ2 = 0, rJ3 = 0, rJabs = 0, rPower = 0, rKd = 0, rFouls = 0;
    let bJ1 = 0, bJ2 = 0, bJ3 = 0, bJabs = 0, bPower = 0, bKd = 0, bFouls = 0;

    bx.rounds.forEach(r => {
      if (r.scored) {
        rJ1 += (r.redJ1 || 0);
        rJ2 += (r.redJ2 || 0);
        rJ3 += (r.redJ3 || 0);

        bJ1 += (r.blueJ1 || 0);
        bJ2 += (r.blueJ2 || 0);
        bJ3 += (r.blueJ3 || 0);
      }
      rJabs += (r.redJabs || 0);
      rPower += (r.redPower || 0);
      rKd += (r.redKd || 0);
      rFouls += (r.redFoul || 0);

      bJabs += (r.blueJabs || 0);
      bPower += (r.bluePower || 0);
      bKd += (r.blueKd || 0);
      bFouls += (r.blueFoul || 0);
    });

    const rTotalScore = Math.round((rJ1 + rJ2 + rJ3) / 3);
    const bTotalScore = Math.round((bJ1 + bJ2 + bJ3) / 3);

    bx.redTotals = { scoreJ1: rJ1, scoreJ2: rJ2, scoreJ3: rJ3, jabs: rJabs, power: rPower, kd: rKd, fouls: rFouls, avgScore: rTotalScore };
    bx.blueTotals = { scoreJ1: bJ1, scoreJ2: bJ2, scoreJ3: bJ3, jabs: bJabs, power: bPower, kd: bKd, fouls: bFouls, avgScore: bTotalScore };
  }

  function logStrike(corner, punchType) {
    if (bx.boutCompleted) return;
    saveToHistory();

    const roundIdx = bx.currentRound - 1;
    const r = bx.rounds[roundIdx];

    if (corner === "red") {
      if (punchType === "jab") r.redJabs++;
      else if (punchType === "power") r.redPower++;
    } else {
      if (punchType === "jab") r.blueJabs++;
      else if (punchType === "power") r.bluePower++;
    }

    playBoxingAudio("punch");
    recalculateBoutTotals();
    saveBoxingState();
    renderBoxingDashboard();
  }

  function logKnockdown(corner) {
    if (bx.boutCompleted) return;
    saveToHistory();

    const roundIdx = bx.currentRound - 1;
    const r = bx.rounds[roundIdx];

    if (corner === "red") {
      r.redKd++;
      logTimelineEvent(`⚡ KNOCKDOWN! ${bx.redName} drops ${bx.blueName} in Round ${bx.currentRound}!`);
      triggerBxToast(`⚡ KNOCKDOWN for ${bx.redName}!`);
    } else {
      r.blueKd++;
      logTimelineEvent(`⚡ KNOCKDOWN! ${bx.blueName} drops ${bx.redName} in Round ${bx.currentRound}!`);
      triggerBxToast(`⚡ KNOCKDOWN for ${bx.blueName}!`);
    }

    playBoxingAudio("kd");
    recalculateBoutTotals();
    saveBoxingState();
    renderBoxingDashboard();
  }

  function logFoul(corner) {
    if (bx.boutCompleted) return;
    saveToHistory();

    const roundIdx = bx.currentRound - 1;
    const r = bx.rounds[roundIdx];

    if (corner === "red") {
      r.redFoul++;
      logTimelineEvent(`⚠️ FOUL: Referee deducts 1 point from ${bx.redName} in Round ${bx.currentRound}`);
      triggerBxToast(`⚠️ Foul: -1 Point for ${bx.redName}`);
    } else {
      r.blueFoul++;
      logTimelineEvent(`⚠️ FOUL: Referee deducts 1 point from ${bx.blueName} in Round ${bx.currentRound}`);
      triggerBxToast(`⚠️ Foul: -1 Point for ${bx.blueName}`);
    }

    recalculateBoutTotals();
    saveBoxingState();
    renderBoxingDashboard();
  }

  function assignRoundScore(redScore, blueScore) {
    if (bx.boutCompleted) return;
    saveToHistory();

    const roundIdx = bx.currentRound - 1;
    const r = bx.rounds[roundIdx];

    // Subtract fouls
    const finalRed = Math.max(6, redScore - r.redFoul);
    const finalBlue = Math.max(6, blueScore - r.blueFoul);

    // Apply to all 3 judges (or simulate realistic slight split if desired)
    r.redJ1 = finalRed; r.redJ2 = finalRed; r.redJ3 = finalRed;
    r.blueJ1 = finalBlue; r.blueJ2 = finalBlue; r.blueJ3 = finalBlue;
    r.scored = true;

    logTimelineEvent(`Round ${bx.currentRound} Scored: ${bx.redName} ${finalRed} - ${finalBlue} ${bx.blueName}`);
    triggerBxToast(`Round ${bx.currentRound}: ${finalRed} - ${finalBlue}`);

    recalculateBoutTotals();
    saveBoxingState();
    renderBoxingDashboard();
  }

  function nextRound() {
    if (bx.boutCompleted) return;

    const roundIdx = bx.currentRound - 1;
    const r = bx.rounds[roundIdx];

    if (!r.scored) {
      // Auto score 10-9 based on KD / punches if not manually set
      if (r.redKd > r.blueKd) {
        assignRoundScore(10, 8);
      } else if (r.blueKd > r.redKd) {
        assignRoundScore(8, 10);
      } else if ((r.redJabs + r.redPower) > (r.blueJabs + r.bluePower)) {
        assignRoundScore(10, 9);
      } else if ((r.blueJabs + r.bluePower) > (r.redJabs + r.redPower)) {
        assignRoundScore(9, 10);
      } else {
        assignRoundScore(10, 10);
      }
    }

    if (bx.currentRound < bx.totalRounds) {
      stopRoundTimer();
      bx.currentRound++;
      bx.timerSeconds = bx.roundDuration;
      bx.isRestPeriod = false;
      playBoxingAudio("bell");
      saveBoxingState();
      renderBoxingDashboard();
      triggerBxToast(`🔔 Round ${bx.currentRound} Begins!`);
    } else {
      endBoutForDecision();
    }
  }

  function declareStoppage(type = "KO", winningCorner = "red") {
    saveToHistory();
    stopRoundTimer();

    bx.boutCompleted = true;
    bx.winner = winningCorner === "red" ? bx.redName : bx.blueName;
    bx.decisionType = type;

    playBoxingAudio("bell");
    logTimelineEvent(`🏆 BOUT ENDED: ${bx.winner} wins by ${type} in Round ${bx.currentRound}!`);
    triggerBxToast(`🏆 Winner: ${bx.winner} by ${type}!`);

    saveBoxingState();
    renderBoxingDashboard();
  }

  function endBoutForDecision() {
    saveToHistory();
    stopRoundTimer();
    recalculateBoutTotals();

    bx.boutCompleted = true;

    // Calculate 3-Judge Official Decision
    let redJudgeWins = 0;
    let blueJudgeWins = 0;
    let drawJudges = 0;

    // Judge 1
    if (bx.redTotals.scoreJ1 > bx.blueTotals.scoreJ1) redJudgeWins++;
    else if (bx.blueTotals.scoreJ1 > bx.redTotals.scoreJ1) blueJudgeWins++;
    else drawJudges++;

    // Judge 2
    if (bx.redTotals.scoreJ2 > bx.blueTotals.scoreJ2) redJudgeWins++;
    else if (bx.blueTotals.scoreJ2 > bx.redTotals.scoreJ2) blueJudgeWins++;
    else drawJudges++;

    // Judge 3
    if (bx.redTotals.scoreJ3 > bx.blueTotals.scoreJ3) redJudgeWins++;
    else if (bx.blueTotals.scoreJ3 > bx.redTotals.scoreJ3) blueJudgeWins++;
    else drawJudges++;

    if (redJudgeWins === 3) {
      bx.winner = bx.redName;
      bx.decisionType = "UD"; // Unanimous Decision
    } else if (redJudgeWins === 2 && blueJudgeWins === 1) {
      bx.winner = bx.redName;
      bx.decisionType = "SD"; // Split Decision
    } else if (redJudgeWins === 2 && drawJudges === 1) {
      bx.winner = bx.redName;
      bx.decisionType = "MD"; // Majority Decision
    } else if (blueJudgeWins === 3) {
      bx.winner = bx.blueName;
      bx.decisionType = "UD";
    } else if (blueJudgeWins === 2 && redJudgeWins === 1) {
      bx.winner = bx.blueName;
      bx.decisionType = "SD";
    } else if (blueJudgeWins === 2 && drawJudges === 1) {
      bx.winner = bx.blueName;
      bx.decisionType = "MD";
    } else {
      bx.winner = null;
      bx.decisionType = "Draw";
    }

    playBoxingAudio("bell");
    if (bx.winner) {
      logTimelineEvent(`🏆 OFFICIAL DECISION: ${bx.winner} wins by ${bx.decisionType} (${bx.redTotals.avgScore}-${bx.blueTotals.avgScore})`);
      triggerBxToast(`🏆 Winner: ${bx.winner} by ${bx.decisionType}!`);
    } else {
      logTimelineEvent(`🏆 OFFICIAL DECISION: Majority / Split DRAW!`);
      triggerBxToast("🏆 Bout Result: DRAW!");
    }

    saveBoxingState();
    renderBoxingDashboard();
  }

  function logTimelineEvent(text) {
    bx.timeline.unshift({
      text,
      round: `R${bx.currentRound}`
    });
  }

  // Timer Controls
  function toggleRoundTimer() {
    if (bx.timerRunning) {
      stopRoundTimer();
    } else {
      startRoundTimer();
    }
  }

  function startRoundTimer() {
    if (bx.timerRunning) return;
    bx.timerRunning = true;
    if (els.timerToggleBtn) {
      els.timerToggleBtn.textContent = "⏸ Pause Clock";
      els.timerToggleBtn.style.background = "#eab308";
      els.timerToggleBtn.style.color = "#000";
    }

    timerInterval = setInterval(() => {
      if (bx.timerSeconds > 0) {
        bx.timerSeconds--;
        if (bx.timerSeconds === 10) {
          playBoxingAudio("punch"); // 10s warning
        }
        updateClockDisplay();
      } else {
        // Round Time Expired
        playBoxingAudio("bell");
        stopRoundTimer();
        triggerBxToast(`🔔 End of Round ${bx.currentRound}!`);
      }
    }, 1000);
  }

  function stopRoundTimer() {
    bx.timerRunning = false;
    if (timerInterval) {
      clearInterval(timerInterval);
      timerInterval = null;
    }
    if (els.timerToggleBtn) {
      els.timerToggleBtn.textContent = "▶ Start Round";
      els.timerToggleBtn.style.background = "";
      els.timerToggleBtn.style.color = "";
    }
  }

  function resetRoundClock() {
    stopRoundTimer();
    bx.timerSeconds = bx.roundDuration;
    updateClockDisplay();
    saveBoxingState();
  }

  function updateClockDisplay() {
    if (!els.roundClock) return;
    const mins = Math.floor(bx.timerSeconds / 60);
    const secs = bx.timerSeconds % 60;
    els.roundClock.textContent = `${String(mins).padStart(2, "0")}:${String(secs).padStart(2, "0")}`;

    if (bx.timerSeconds <= 10 && bx.timerSeconds > 0) {
      els.roundClock.classList.add("warning");
    } else {
      els.roundClock.classList.remove("warning");
    }
  }

  // Undo
  function undoBoxingEvent() {
    if (!bx.history || bx.history.length === 0) {
      triggerBxToast("No actions to undo.");
      return;
    }
    const prev = bx.history.pop();
    bx.currentRound = prev.currentRound;
    bx.timerSeconds = prev.timerSeconds;
    bx.isRestPeriod = prev.isRestPeriod;
    bx.rounds = clone(prev.rounds);
    bx.boutCompleted = prev.boutCompleted;
    bx.winner = prev.winner;
    bx.decisionType = prev.decisionType;

    if (bx.timeline.length > 0) bx.timeline.shift();

    recalculateBoutTotals();
    saveBoxingState();
    renderBoxingDashboard();
    triggerBxToast("Last action undone.");
  }

  // Render Dashboard
  function renderBoxingDashboard() {
    if (!els.dashboardView) return;

    if (els.roundTitle) els.roundTitle.textContent = `Round ${bx.currentRound} of ${bx.totalRounds} • ${bx.weightDivision}`;
    if (els.redNameDisplay) els.redNameDisplay.textContent = bx.redName;
    if (els.blueNameDisplay) els.blueNameDisplay.textContent = bx.blueName;

    if (els.redScoreDisplay) els.redScoreDisplay.textContent = bx.redTotals.avgScore;
    if (els.blueScoreDisplay) els.blueScoreDisplay.textContent = bx.blueTotals.avgScore;

    if (els.redKdCount) els.redKdCount.textContent = bx.redTotals.kd;
    if (els.blueKdCount) els.blueKdCount.textContent = bx.blueTotals.kd;

    if (els.redTotalPunches) els.redTotalPunches.textContent = bx.redTotals.jabs + bx.redTotals.power;
    if (els.blueTotalPunches) els.blueTotalPunches.textContent = bx.blueTotals.jabs + bx.blueTotals.power;

    const roundIdx = bx.currentRound - 1;
    const currentRoundData = bx.rounds[roundIdx] || {};

    if (els.redJabsCount) els.redJabsCount.textContent = `${currentRoundData.redJabs || 0} Landed (Total ${bx.redTotals.jabs})`;
    if (els.redPowerCount) els.redPowerCount.textContent = `${currentRoundData.redPower || 0} Landed (Total ${bx.redTotals.power})`;

    if (els.blueJabsCount) els.blueJabsCount.textContent = `${currentRoundData.blueJabs || 0} Landed (Total ${bx.blueTotals.jabs})`;
    if (els.bluePowerCount) els.bluePowerCount.textContent = `${currentRoundData.bluePower || 0} Landed (Total ${bx.blueTotals.power})`;

    updateClockDisplay();

    // Result badge
    if (els.decisionBadge) {
      if (bx.boutCompleted) {
        els.decisionBadge.classList.remove("hidden");
        if (bx.winner) {
          els.decisionBadge.textContent = `🏆 ${bx.winner} WINS (${bx.decisionType})`;
        } else {
          els.decisionBadge.textContent = `🏆 BOUT DRAW (${bx.decisionType})`;
        }
      } else {
        els.decisionBadge.classList.add("hidden");
      }
    }

    // Live Indicator
    if (els.liveIndicator) {
      if (bx.boutCompleted) els.liveIndicator.classList.add("hidden");
      else els.liveIndicator.classList.remove("hidden");
    }

    // Submit Tournament button
    if (els.submitResultBtn) {
      if (bx.isTournamentMatch && bx.boutCompleted) els.submitResultBtn.classList.remove("hidden");
      else els.submitResultBtn.classList.add("hidden");
    }

    // Render 3-Judge Scorecard Table
    renderScorecardTable();

    // Render Timeline List
    if (els.timelineList) {
      if (bx.timeline.length === 0) {
        els.timelineList.innerHTML = `<p style="color: var(--text-muted); font-style: italic; font-size: 0.9rem; margin: 0;">No strikes or rounds scored yet.</p>`;
      } else {
        els.timelineList.innerHTML = bx.timeline.map(item => `
          <div class="bx-log-item">
            <div style="font-weight: 700;">${item.text}</div>
            <div style="font-family: monospace; font-size: 0.75rem; color: var(--bx-gold); font-weight:800;">${item.round}</div>
          </div>
        `).join("");
      }
    }
  }

  function renderScorecardTable() {
    if (!els.scorecardTableBody || !els.scorecardTableFoot) return;

    els.scorecardTableBody.innerHTML = bx.rounds.map(r => {
      const isCurrent = (r.roundNum === bx.currentRound);
      const rowStyle = isCurrent ? "background: rgba(245,158,11,0.05); font-weight:800;" : "";

      return `
        <tr style="border-bottom: 1px solid rgba(255,255,255,0.04); ${rowStyle}">
          <td style="font-weight:900; color:var(--bx-gold); font-family:monospace;">${r.roundNum}</td>
          <td style="color:var(--bx-red); font-weight:800; font-family:monospace;">${r.scored ? r.redJ1 : '-'}</td>
          <td style="color:var(--bx-blue); font-weight:800; font-family:monospace;">${r.scored ? r.blueJ1 : '-'}</td>
          <td style="color:var(--bx-red); font-weight:800; font-family:monospace; border-left:1px solid rgba(255,255,255,0.08);">${r.scored ? r.redJ2 : '-'}</td>
          <td style="color:var(--bx-blue); font-weight:800; font-family:monospace;">${r.scored ? r.blueJ2 : '-'}</td>
          <td style="color:var(--bx-red); font-weight:800; font-family:monospace; border-left:1px solid rgba(255,255,255,0.08);">${r.scored ? r.redJ3 : '-'}</td>
          <td style="color:var(--bx-blue); font-weight:800; font-family:monospace;">${r.scored ? r.blueJ3 : '-'}</td>
        </tr>
      `;
    }).join("");

    els.scorecardTableFoot.innerHTML = `
      <tr style="background: rgba(255,255,255,0.03); font-weight:900; font-family:monospace;">
        <td style="color:#fff; padding: 10px 6px;">TOTAL</td>
        <td style="color:var(--bx-red); font-size:1rem;">${bx.redTotals.scoreJ1}</td>
        <td style="color:var(--bx-blue); font-size:1rem;">${bx.blueTotals.scoreJ1}</td>
        <td style="color:var(--bx-red); font-size:1rem; border-left:1px solid rgba(255,255,255,0.08);">${bx.redTotals.scoreJ2}</td>
        <td style="color:var(--bx-blue); font-size:1rem;">${bx.blueTotals.scoreJ2}</td>
        <td style="color:var(--bx-red); font-size:1rem; border-left:1px solid rgba(255,255,255,0.08);">${bx.redTotals.scoreJ3}</td>
        <td style="color:var(--bx-blue); font-size:1rem;">${bx.blueTotals.scoreJ3}</td>
      </tr>
    `;
  }

  // 9. DASHBOARD EVENT LISTENERS
  if (els.dashboardBackBtn) {
    els.dashboardBackBtn.addEventListener("click", () => {
      stopRoundTimer();
      if (bx.isTournamentMatch) {
        window.location.hash = "#boxing-tdashboard";
      } else {
        window.location.hash = "#boxing";
      }
    });
  }

  if (els.resetMatchBtn) {
    els.resetMatchBtn.addEventListener("click", () => {
      if (confirm("Reset current Boxing bout? All strikes and scores will be cleared.")) {
        initializeBoxingBout(bx.redName, bx.blueName, bx.totalRounds, bx.roundDuration, bx.weightDivision);
      }
    });
  }

  if (els.timerToggleBtn) els.timerToggleBtn.addEventListener("click", toggleRoundTimer);
  if (els.bellBtn) els.bellBtn.addEventListener("click", () => playBoxingAudio("bell"));
  if (els.resetClockBtn) els.resetClockBtn.addEventListener("click", resetRoundClock);

  // Strike Action buttons
  document.querySelectorAll("[data-bx-punch]").forEach(btn => {
    btn.addEventListener("click", (e) => {
      const corner = e.currentTarget.getAttribute("data-bx-corner");
      const punch = e.currentTarget.getAttribute("data-bx-punch");
      logStrike(corner, punch);
    });
  });

  document.querySelectorAll("[data-bx-action]").forEach(btn => {
    btn.addEventListener("click", (e) => {
      const corner = e.currentTarget.getAttribute("data-bx-corner");
      const action = e.currentTarget.getAttribute("data-bx-action");
      if (action === "kd") logKnockdown(corner);
      else if (action === "foul") logFoul(corner);
    });
  });

  // 10-Point Must Quick Buttons
  if (els.score109Red) els.score109Red.addEventListener("click", () => assignRoundScore(10, 9));
  if (els.score108Red) els.score108Red.addEventListener("click", () => assignRoundScore(10, 8));
  if (els.score1010Even) els.score1010Even.addEventListener("click", () => assignRoundScore(10, 10));
  if (els.score109Blue) els.score109Blue.addEventListener("click", () => assignRoundScore(9, 10));
  if (els.score108Blue) els.score108Blue.addEventListener("click", () => assignRoundScore(8, 10));

  if (els.nextRoundBtn) els.nextRoundBtn.addEventListener("click", nextRound);
  if (els.undoBtn) els.undoBtn.addEventListener("click", undoBoxingEvent);
  if (els.endBoutBtn) els.endBoutBtn.addEventListener("click", endBoutForDecision);

  // Stoppage buttons
  if (els.stoppageKoBtn) {
    els.stoppageKoBtn.addEventListener("click", () => {
      const winnerCorner = prompt(`Enter winning corner for KO / TKO (type 'red' for ${bx.redName} or 'blue' for ${bx.blueName}):`, "red");
      if (winnerCorner && (winnerCorner.toLowerCase().includes("red") || winnerCorner.toLowerCase().includes(bx.redName.toLowerCase()))) {
        declareStoppage("KO", "red");
      } else if (winnerCorner && (winnerCorner.toLowerCase().includes("blue") || winnerCorner.toLowerCase().includes(bx.blueName.toLowerCase()))) {
        declareStoppage("KO", "blue");
      }
    });
  }

  if (els.stoppageRtdBtn) {
    els.stoppageRtdBtn.addEventListener("click", () => {
      const winnerCorner = prompt(`Corner Retirement (RTD). Who wins? (type 'red' for ${bx.redName} or 'blue' for ${bx.blueName}):`, "red");
      if (winnerCorner && (winnerCorner.toLowerCase().includes("red") || winnerCorner.toLowerCase().includes(bx.redName.toLowerCase()))) {
        declareStoppage("RTD", "red");
      } else if (winnerCorner && (winnerCorner.toLowerCase().includes("blue") || winnerCorner.toLowerCase().includes(bx.blueName.toLowerCase()))) {
        declareStoppage("RTD", "blue");
      }
    });
  }

  // Submit Result for Tournament Match
  if (els.submitResultBtn) {
    els.submitResultBtn.addEventListener("click", () => {
      if (bxt.active && bxt.activeFixtureId !== null) {
        const fixture = bxt.fixtures.find(f => f.id === bxt.activeFixtureId);
        if (fixture) {
          fixture.completed = true;
          fixture.winner = bx.winner;
          fixture.resultText = bx.winner ? `${bx.winner} won by ${bx.decisionType}` : `Draw (${bx.decisionType})`;

          // Update records
          const redFighter = bxt.boxers.find(f => f.name === fixture.red);
          const blueFighter = bxt.boxers.find(f => f.name === fixture.blue);

          if (redFighter && blueFighter) {
            redFighter.bouts++;
            blueFighter.bouts++;

            if (bx.winner === redFighter.name) {
              redFighter.wins++;
              redFighter.pts += 3;
              blueFighter.losses++;
              if (bx.decisionType === "KO" || bx.decisionType === "TKO") redFighter.kos++;
            } else if (bx.winner === blueFighter.name) {
              blueFighter.wins++;
              blueFighter.pts += 3;
              redFighter.losses++;
              if (bx.decisionType === "KO" || bx.decisionType === "TKO") blueFighter.kos++;
            } else {
              redFighter.draws++;
              blueFighter.draws++;
              redFighter.pts += 1;
              blueFighter.pts += 1;
            }
          }

          saveBoxingState();
          triggerBxToast("Championship Bout Result Saved!");
          window.location.hash = "#boxing-tdashboard";
        }
      }
    });
  }

  // 10. TOURNAMENT ENGINE (CHAMPIONSHIP BRACKET & STANDINGS)
  if (els.tsetupBackBtn) {
    els.tsetupBackBtn.addEventListener("click", () => {
      window.location.hash = "#boxing";
    });
  }

  if (els.tteamCount) {
    els.tteamCount.addEventListener("change", renderTournamentFighterInputs);
  }

  function renderTournamentFighterInputs() {
    if (!els.tteamInputs) return;
    const count = Number(els.tteamCount ? els.tteamCount.value : 4);
    const defaultFighters = ["Tyson Fury", "Oleksandr Usyk", "Anthony Joshua", "Deontay Wilder", "Joseph Parker", "Zhilei Zhang", "Daniel Dubois", "Agit Kabayel"];

    els.tteamInputs.innerHTML = "";
    for (let i = 0; i < count; i++) {
      const defName = defaultFighters[i] || `Fighter ${i + 1}`;
      const div = document.createElement("div");
      div.innerHTML = `
        <label style="display: block; font-size: 0.8rem; color: var(--text-muted); margin-bottom: 4px; font-weight: 600;">Fighter ${i + 1} Name</label>
        <input type="text" class="bx-tfighter-name-input" value="${defName}" autocomplete="off" style="width: 100%; height: 38px; background: rgba(0,0,0,0.25); border: 1px solid rgba(255,255,255,0.1); border-radius: 6px; color: var(--ink); padding: 0 12px; font-size: 0.9rem;" />
      `;
      els.tteamInputs.appendChild(div);
    }
  }

  if (els.tcreateBtn) {
    els.tcreateBtn.addEventListener("click", () => {
      const name = els.tnameInput.value.trim() || "World Heavyweight Championship";
      const count = Number(els.tteamCount.value) || 4;
      const rounds = Number(els.troundsSelect ? els.troundsSelect.value : 12);

      const inputs = document.querySelectorAll(".bx-tfighter-name-input");
      const fighterNames = [];
      const unique = new Set();

      for (let i = 0; i < inputs.length; i++) {
        const fName = inputs[i].value.trim() || `Fighter ${i + 1}`;
        if (unique.has(fName.toLowerCase())) {
          triggerBxToast(`Fighter names must be unique. Duplicate: "${fName}"`);
          return;
        }
        unique.add(fName.toLowerCase());
        fighterNames.push(fName);
      }

      bxt = clone(defaultBxtState);
      bxt.active = true;
      bxt.name = name;
      bxt.boxerCount = count;
      bxt.roundsPerBout = rounds;

      bxt.boxers = fighterNames.map(n => ({
        name: n,
        bouts: 0,
        wins: 0,
        losses: 0,
        draws: 0,
        kos: 0,
        pts: 0
      }));

      // Generate Round Robin Championship Bout Cards
      bxt.fixtures = [];
      let fixId = 1;
      for (let i = 0; i < fighterNames.length; i++) {
        for (let j = i + 1; j < fighterNames.length; j++) {
          bxt.fixtures.push({
            id: fixId++,
            red: fighterNames[i],
            blue: fighterNames[j],
            completed: false,
            resultText: "Scheduled",
            winner: null
          });
        }
      }

      saveBoxingState();
      window.location.hash = "#boxing-tdashboard";
    });
  }

  // Tournament Tabs
  const bxTabs = ["table", "fixtures", "edit"];
  bxTabs.forEach(tab => {
    const btn = document.querySelector(`#bx-tab-${tab}`);
    if (btn) {
      btn.addEventListener("click", () => {
        bxTabs.forEach(t => {
          const b = document.querySelector(`#bx-tab-${t}`);
          const v = document.querySelector(`#bx-${t}-view`);
          if (b) b.classList.remove("active");
          if (v) v.classList.add("hidden");
        });
        btn.classList.add("active");
        const activeView = document.querySelector(`#bx-${tab}-view`);
        if (activeView) activeView.classList.remove("hidden");

        if (tab === "table") renderPointsTable();
        else if (tab === "fixtures") renderTournamentFixturesList();
        else if (tab === "edit") renderEditSetup();
      });
    }
  });

  function renderPointsTable() {
    if (!bxt.active) return;

    // Sort by PTS > Wins > KOs
    const sorted = [...bxt.boxers].sort((a, b) => {
      if (b.pts !== a.pts) return b.pts - a.pts;
      if (b.wins !== a.wins) return b.wins - a.wins;
      return b.kos - a.kos;
    });

    if (els.pointsTableBody) {
      els.pointsTableBody.innerHTML = sorted.map((f, idx) => `
        <tr style="border-bottom: 1px solid rgba(255,255,255,0.05);">
          <td style="padding: 10px 8px; font-weight:800; color: var(--bx-gold);">${idx + 1}</td>
          <td style="padding: 10px 8px; font-weight:800; color:#fff;">${f.name}</td>
          <td style="padding: 10px 8px; text-align:center; font-family:monospace;">${f.bouts}</td>
          <td style="padding: 10px 8px; text-align:center; font-family:monospace; color:#10b981; font-weight:800;">${f.wins}</td>
          <td style="padding: 10px 8px; text-align:center; font-family:monospace; color:#f87171;">${f.losses}</td>
          <td style="padding: 10px 8px; text-align:center; font-family:monospace; color:#f59e0b;">${f.draws}</td>
          <td style="padding: 10px 8px; text-align:center; font-family:monospace; color:var(--bx-gold); font-weight:900;">${f.kos}</td>
          <td style="padding: 10px 8px; font-weight:900; text-align:right; font-family:monospace; color:var(--bx-gold);">${f.pts}</td>
        </tr>
      `).join("");
    }
  }

  function renderTournamentFixturesList() {
    if (!els.fixturesList) return;
    els.fixturesList.innerHTML = "";

    bxt.fixtures.forEach(fix => {
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
          <span style="font-size: 0.75rem; color: var(--bx-gold); font-weight:700; text-transform:uppercase;">Bout #${fix.id} • ${bxt.roundsPerBout} Rounds</span>
          <div style="font-weight: 800; font-size:1.1rem; margin-top:4px;">
            <span style="color:var(--bx-red);">${fix.red}</span>
            <span style="color:var(--text-muted); font-size:0.85rem; margin:0 6px;">vs</span>
            <span style="color:var(--bx-blue);">${fix.blue}</span>
          </div>
        </div>
      `;

      let rightSide = "";
      if (fix.completed) {
        rightSide = `
          <div style="text-align:right;">
            <div style="font-weight:800; color:var(--bx-gold); font-size:0.9rem;">${fix.resultText}</div>
            <span style="background: rgba(16,185,129,0.15); color:#10b981; font-size:0.75rem; padding:3px 8px; border-radius:6px; font-weight:700; text-transform:uppercase;">Official</span>
          </div>
        `;
      } else {
        rightSide = `
          <button class="start-custom" type="button" data-bx-bout="${fix.id}" style="margin:0; padding:8px 16px; font-size:0.8rem; border-radius:6px; font-weight:700;">🥊 Score Bout</button>
        `;
      }

      card.innerHTML = leftSide + rightSide;
      els.fixturesList.appendChild(card);
    });

    document.querySelectorAll("[data-bx-bout]").forEach(btn => {
      btn.addEventListener("click", (e) => {
        const fId = Number(e.currentTarget.getAttribute("data-bx-bout"));
        const fix = bxt.fixtures.find(f => f.id === fId);

        if (fix) {
          bxt.activeFixtureId = fId;
          initializeTournamentBout(fix.red, fix.blue, bxt.roundsPerBout);
        }
      });
    });
  }

  function initializeTournamentBout(redName, blueName, totalRounds) {
    initializeBoxingBout(redName, blueName, totalRounds, 180, "Championship");
    bx.isTournamentMatch = true;
    saveBoxingState();
  }

  function renderEditSetup() {
    if (els.editTeamsContainer) {
      els.editTeamsContainer.innerHTML = bxt.boxers.map((f, idx) => `
        <div class="setup-group">
          <label style="display: block; font-size: 0.85rem; color: var(--text-muted); margin-bottom: 4px; font-weight: 600;">Fighter ${idx + 1} Name</label>
          <input type="text" class="bx-edit-tfighter-input" data-fighter-index="${idx}" value="${f.name}" autocomplete="off" style="width: 100%; height: 38px; background: rgba(0,0,0,0.25); border: 1px solid rgba(255,255,255,0.1); border-radius: 6px; color: var(--ink); padding: 0 12px; font-size: 0.9rem;" />
        </div>
      `).join("");
    }
  }

  if (els.editSaveBtn) {
    els.editSaveBtn.addEventListener("click", () => {
      const inputs = document.querySelectorAll(".bx-edit-tfighter-input");
      const names = [];
      const unique = new Set();

      for (let i = 0; i < inputs.length; i++) {
        const val = inputs[i].value.trim() || `Fighter ${i + 1}`;
        if (unique.has(val.toLowerCase())) {
          triggerBxToast(`Duplicate name: "${val}"`);
          return;
        }
        unique.add(val.toLowerCase());
        names.push(val);
      }

      names.forEach((n, idx) => {
        const oldName = bxt.boxers[idx].name;
        bxt.boxers[idx].name = n;

        // Update in fixtures
        bxt.fixtures.forEach(fix => {
          if (fix.red === oldName) fix.red = n;
          if (fix.blue === oldName) fix.blue = n;
        });
      });

      saveBoxingState();
      triggerBxToast("Fighter names updated!");
      document.querySelector("#bx-tab-table").click();
    });
  }

  if (els.tresetBtn) {
    els.tresetBtn.addEventListener("click", () => {
      if (confirm("Are you sure you want to reset this Boxing championship? All bouts will be cleared.")) {
        bxt = clone(defaultBxtState);
        saveBoxingState();
        window.location.hash = "#boxing";
      }
    });
  }

  if (els.tdashboardBackBtn) {
    els.tdashboardBackBtn.addEventListener("click", () => {
      bxt.active = false;
      saveBoxingState();
      window.location.hash = "#boxing";
    });
  }

  function renderTournamentDashboard() {
    if (els.tdashboardName) els.tdashboardName.textContent = bxt.name;
    renderPointsTable();
  }

  // 11. INITIALIZE BOXING ROUTINGS
  loadBoxingState();

  if (window.location.hash.startsWith("#boxing")) {
    showBoxingPage(true);
  }

  window.addEventListener("hashchange", () => {
    if (window.location.hash.startsWith("#boxing")) {
      showBoxingPage(true);
    }
  });

  // Bind Home Sports Card button
  const boxingCardBtn = document.querySelector("[data-open-sport='boxing']");
  if (boxingCardBtn) {
    boxingCardBtn.addEventListener("click", () => {
      window.location.hash = "#boxing";
    });
  }

})();
