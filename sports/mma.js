/**
 * ==========================================================================
 * MMA (UFC / MIXED MARTIAL ARTS) SCORER & GRAND PRIX ENGINE
 * ==========================================================================
 * Modular MMA tracker supporting official Unified Rules of MMA:
 * 10-Point Must scoring system, 3-Judge scorecard table (UD, SD, MD, Draw),
 * Compustrike fight metrics (Sig. Strikes, Takedowns, Sub Attempts, Knockdowns, Control Time),
 * 5:00 live countdown timer with UFC Octagon horn audio, KO/TKO/Submission finish system,
 * and MMA Grand Prix Championship Tournament engine.
 */

(() => {
  "use strict";

  // 1. STATE & CONSTANTS
  const MMA_STORAGE_KEY = "scoretracker_mma_match_state";
  const MMAT_STORAGE_KEY = "scoretracker_mma_tournament_state";

  const defaultMmaState = {
    active: false,
    isTournamentMatch: false,
    redName: "Islam Makhachev",
    blueName: "Alexander Volkanovski",
    totalRounds: 5,
    roundDuration: 300, // 5 mins in seconds
    currentRound: 1,
    timerSeconds: 300,
    timerRunning: false,
    weightDivision: "Lightweight",
    rounds: [], // { roundNum, redJ1, redJ2, redJ3, blueJ1, blueJ2, blueJ3, redStrikes, redTd, redKd, redSub, redCtrl, blueStrikes, blueTd, blueKd, blueSub, blueCtrl, redFoul, blueFoul, scored }
    redTotals: { scoreJ1: 0, scoreJ2: 0, scoreJ3: 0, strikes: 0, td: 0, kd: 0, sub: 0, ctrl: 0, fouls: 0, avgScore: 0 },
    blueTotals: { scoreJ1: 0, scoreJ2: 0, scoreJ3: 0, strikes: 0, td: 0, kd: 0, sub: 0, ctrl: 0, fouls: 0, avgScore: 0 },
    boutCompleted: false,
    winner: null,
    decisionType: null, // "UD", "SD", "MD", "KO", "TKO", "SUB", "DQ", "Draw"
    finishSubtype: null, // "Rear Naked Choke", "Guillotine", "Armbar", "Triangle", "Head Kick KO", "Punches TKO"
    timeline: [], // { text, round, time }
    history: []
  };

  const defaultMmatState = {
    active: false,
    name: "UFC Lightweight World Grand Prix",
    fighterCount: 4,
    roundsPerBout: 3,
    fighters: [], // { name, bouts: 0, wins: 0, losses: 0, draws: 0, kos: 0, subs: 0, pts: 0 }
    fixtures: [], // { id, red, blue, completed, resultText, winner }
    activeFixtureId: null
  };

  let mma = clone(defaultMmaState);
  let mmat = clone(defaultMmatState);
  let timerInterval = null;

  function clone(obj) {
    return JSON.parse(JSON.stringify(obj));
  }

  // 2. DOM ELEMENTS SELECTORS
  const els = {
    // Page Wrappers
    mmaPage: document.querySelector("#mma-page"),
    formatView: document.querySelector("#mma-format-view"),
    setupView: document.querySelector("#mma-setup-view"),
    dashboardView: document.querySelector("#mma-dashboard-view"),
    tsetupView: document.querySelector("#mma-tsetup-view"),
    tdashboardView: document.querySelector("#mma-tdashboard-view"),

    // Format selection buttons
    formatBackBtn: document.querySelector("#mma-format-back-btn"),
    formatCustomBtn: document.querySelector("#mma-format-custom-btn"),
    formatTournamentBtn: document.querySelector("#mma-format-tournament-btn"),

    // Setup
    setupBackBtn: document.querySelector("#mma-setup-back-btn"),
    redInput: document.querySelector("#mma-red-input"),
    blueInput: document.querySelector("#mma-blue-input"),
    roundsSelect: document.querySelector("#mma-rounds-select"),
    weightSelect: document.querySelector("#mma-weight-select"),
    startBtn: document.querySelector("#mma-start-btn"),

    // Dashboard Header & Status
    dashboardBackBtn: document.querySelector("#mma-dashboard-back-btn"),
    resetMatchBtn: document.querySelector("#mma-reset-match-btn"),
    liveIndicator: document.querySelector("#mma-live-indicator"),
    roundTitle: document.querySelector("#mma-round-title"),
    decisionBadge: document.querySelector("#mma-decision-badge"),
    roundClock: document.querySelector("#mma-round-clock"),
    timerToggleBtn: document.querySelector("#mma-timer-toggle-btn"),
    hornBtn: document.querySelector("#mma-horn-btn"),
    resetClockBtn: document.querySelector("#mma-reset-clock-btn"),

    // Corner Displays
    redNameDisplay: document.querySelector("#mma-red-name-display"),
    redScoreDisplay: document.querySelector("#mma-red-score-display"),
    redTdCount: document.querySelector("#mma-red-td-count"),
    redCtrlTime: document.querySelector("#mma-red-ctrl-time"),
    redStrikesCount: document.querySelector("#mma-red-strikes-count"),
    redTdBtnCount: document.querySelector("#mma-red-td-btn-count"),

    blueNameDisplay: document.querySelector("#mma-blue-name-display"),
    blueScoreDisplay: document.querySelector("#mma-blue-score-display"),
    blueTdCount: document.querySelector("#mma-blue-td-count"),
    blueCtrlTime: document.querySelector("#mma-blue-ctrl-time"),
    blueStrikesCount: document.querySelector("#mma-blue-strikes-count"),
    blueTdBtnCount: document.querySelector("#mma-blue-td-btn-count"),

    // 10-Point Must Quick Buttons
    score109Red: document.querySelector("#mma-score-10-9-red"),
    score108Red: document.querySelector("#mma-score-10-8-red"),
    score1010Even: document.querySelector("#mma-score-10-10-even"),
    score109Blue: document.querySelector("#mma-score-10-9-blue"),
    score108Blue: document.querySelector("#mma-score-10-8-blue"),

    stoppageKoBtn: document.querySelector("#mma-stoppage-ko-btn"),
    stoppageSubBtn: document.querySelector("#mma-stoppage-sub-btn"),
    nextRoundBtn: document.querySelector("#mma-next-round-btn"),

    // 3-Judge Scorecard Table
    scorecardTableBody: document.querySelector("#mma-scorecard-table-body"),
    scorecardTableFoot: document.querySelector("#mma-scorecard-table-foot"),

    // Control Buttons
    undoBtn: document.querySelector("#mma-undo-btn"),
    endBoutBtn: document.querySelector("#mma-end-bout-btn"),
    submitResultBtn: document.querySelector("#mma-submit-result-btn"),
    timelineList: document.querySelector("#mma-timeline-list"),

    // Tournament Setup
    tsetupBackBtn: document.querySelector("#mma-tsetup-back-btn"),
    tnameInput: document.querySelector("#mma-tname-input"),
    tteamCount: document.querySelector("#mma-tteam-count"),
    troundsSelect: document.querySelector("#mma-trounds-select"),
    tteamInputs: document.querySelector("#mma-tteam-inputs"),
    tcreateBtn: document.querySelector("#mma-tcreate-btn"),

    // Tournament Dashboard
    tdashboardBackBtn: document.querySelector("#mma-tdashboard-back-btn"),
    tresetBtn: document.querySelector("#mma-treset-btn"),
    tdashboardName: document.querySelector("#mma-tdashboard-name"),
    tabTable: document.querySelector("#mma-tab-table"),
    tabFixtures: document.querySelector("#mma-tab-fixtures"),
    tabEdit: document.querySelector("#mma-tab-edit"),
    tableView: document.querySelector("#mma-table-view"),
    fixturesView: document.querySelector("#mma-fixtures-view"),
    editView: document.querySelector("#mma-edit-view"),
    pointsTableBody: document.querySelector("#mma-points-table-body"),
    fixturesList: document.querySelector("#mma-fixtures-list"),
    editTeamsContainer: document.querySelector("#mma-edit-teams-container"),
    editSaveBtn: document.querySelector("#mma-edit-save-btn")
  };

  // 3. TOAST & AUDIO EFFECTS
  function triggerMmaToast(message) {
    const existing = document.querySelector(".mma-toast-notification");
    if (existing) existing.remove();

    const toast = document.createElement("div");
    toast.className = "mma-toast-notification";
    toast.textContent = message;
    toast.style.position = "fixed";
    toast.style.bottom = "24px";
    toast.style.left = "50%";
    toast.style.transform = "translateX(-50%)";
    toast.style.background = "#eab308";
    toast.style.color = "#080c14";
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

  function playMmaAudio(type = "horn") {
    try {
      const AudioCtx = window.AudioContext || window.webkitAudioContext;
      if (!AudioCtx) return;
      const ctx = new AudioCtx();

      if (type === "horn") {
        // Deep UFC Octagon Airhorn / Buzzer sound
        const osc1 = ctx.createOscillator();
        const osc2 = ctx.createOscillator();
        const gain = ctx.createGain();

        osc1.type = "sawtooth";
        osc1.frequency.setValueAtTime(140, ctx.currentTime);
        osc2.type = "sawtooth";
        osc2.frequency.setValueAtTime(146, ctx.currentTime);

        gain.gain.setValueAtTime(0.35, ctx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.65);

        osc1.connect(gain);
        osc2.connect(gain);
        gain.connect(ctx.destination);

        osc1.start();
        osc2.start();
        osc1.stop(ctx.currentTime + 0.65);
        osc2.stop(ctx.currentTime + 0.65);
      } else if (type === "td" || type === "kd") {
        // Heavy Mat Slam Impact
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = "sine";
        osc.frequency.setValueAtTime(110, ctx.currentTime);
        osc.frequency.exponentialRampToValueAtTime(30, ctx.currentTime + 0.3);

        gain.gain.setValueAtTime(0.4, ctx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.3);

        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.start();
        osc.stop(ctx.currentTime + 0.3);
      } else if (type === "strike") {
        // Crisp Strike Impact
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = "triangle";
        osc.frequency.setValueAtTime(280, ctx.currentTime);
        osc.frequency.exponentialRampToValueAtTime(90, ctx.currentTime + 0.08);

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
  function loadMmaState() {
    try {
      const stored = localStorage.getItem(MMA_STORAGE_KEY);
      const storedT = localStorage.getItem(MMAT_STORAGE_KEY);
      if (stored) mma = { ...clone(defaultMmaState), ...JSON.parse(stored) };
      if (storedT) mmat = { ...clone(defaultMmatState), ...JSON.parse(storedT) };
    } catch (e) {
      console.error("Failed to load mma state", e);
    }
  }

  function saveMmaState() {
    try {
      localStorage.setItem(MMA_STORAGE_KEY, JSON.stringify(mma));
      localStorage.setItem(MMAT_STORAGE_KEY, JSON.stringify(mmat));
    } catch (e) {
      console.error("Failed to save mma state", e);
    }
  }

  // 5. VIEW NAVIGATION
  function hideAllMmaViews() {
    if (els.formatView) els.formatView.classList.add("hidden");
    if (els.setupView) els.setupView.classList.add("hidden");
    if (els.dashboardView) els.dashboardView.classList.add("hidden");
    if (els.tsetupView) els.tsetupView.classList.add("hidden");
    if (els.tdashboardView) els.tdashboardView.classList.add("hidden");
  }

  function showMmaPage(fromHash = false) {
    const pages = ["#cricket-page", "#football-page", "#basketball-page", "#tennis-page", "#badminton-page", "#hockey-page", "#volleyball-page", "#baseball-page", "#rugby-page", "#kabaddi-page", "#tabletennis-page", "#golf-page", "#boxing-page", "#sports-page", "#format-page"];
    pages.forEach(p => {
      const el = document.querySelector(p);
      if (el) el.classList.add("hidden");
    });

    if (els.mmaPage) els.mmaPage.classList.remove("hidden");
    hideAllMmaViews();

    const hash = window.location.hash;
    if (hash === "#mma") {
      if (els.formatView) els.formatView.classList.remove("hidden");
    } else if (hash === "#mma-custom") {
      if (els.setupView) els.setupView.classList.remove("hidden");
    } else if (hash === "#mma-match") {
      if (els.dashboardView) els.dashboardView.classList.remove("hidden");
      renderMmaDashboard();
    } else if (hash === "#mma-tsetup") {
      if (els.tsetupView) els.tsetupView.classList.remove("hidden");
      renderTournamentFighterInputs();
    } else if (hash === "#mma-tdashboard") {
      if (els.tdashboardView) els.tdashboardView.classList.remove("hidden");
      renderTournamentDashboard();
    }
  }

  window.showMmaPage = showMmaPage;

  // 6. FORMAT CHOICE LISTENERS
  if (els.formatBackBtn) {
    els.formatBackBtn.addEventListener("click", () => {
      window.location.hash = "#sports";
    });
  }

  if (els.formatCustomBtn) {
    els.formatCustomBtn.addEventListener("click", () => {
      window.location.hash = "#mma-custom";
    });
  }

  if (els.formatTournamentBtn) {
    els.formatTournamentBtn.addEventListener("click", () => {
      if (mmat.active) {
        window.location.hash = "#mma-tdashboard";
      } else {
        window.location.hash = "#mma-tsetup";
      }
    });
  }

  // 7. SETUP VIEW & START
  if (els.setupBackBtn) {
    els.setupBackBtn.addEventListener("click", () => {
      window.location.hash = "#mma";
    });
  }

  if (els.startBtn) {
    els.startBtn.addEventListener("click", () => {
      const redName = (els.redInput ? els.redInput.value.trim() : "") || "Islam Makhachev";
      const blueName = (els.blueInput ? els.blueInput.value.trim() : "") || "Alexander Volkanovski";
      const totalRounds = Number(els.roundsSelect ? els.roundsSelect.value : 5);
      const weight = (els.weightSelect ? els.weightSelect.value : "Lightweight");

      if (redName.toLowerCase() === blueName.toLowerCase()) {
        triggerMmaToast("Red corner and Blue corner fighters must have distinct names!");
        return;
      }

      initializeMmaBout(redName, blueName, totalRounds, 300, weight);
    });
  }

  function initializeMmaBout(redName, blueName, totalRounds = 5, duration = 300, weight = "Lightweight") {
    stopRoundTimer();

    mma = clone(defaultMmaState);
    mma.active = true;
    mma.isTournamentMatch = false;
    mma.redName = redName;
    mma.blueName = blueName;
    mma.totalRounds = totalRounds;
    mma.roundDuration = duration;
    mma.timerSeconds = duration;
    mma.weightDivision = weight;
    mma.currentRound = 1;

    // Initialize round slots
    mma.rounds = [];
    for (let r = 1; r <= totalRounds; r++) {
      mma.rounds.push({
        roundNum: r,
        redJ1: null, redJ2: null, redJ3: null,
        blueJ1: null, blueJ2: null, blueJ3: null,
        redStrikes: 0, redTd: 0, redKd: 0, redSub: 0, redCtrl: 0,
        blueStrikes: 0, blueTd: 0, blueKd: 0, blueSub: 0, blueCtrl: 0,
        redFoul: 0, blueFoul: 0,
        scored: false
      });
    }

    recalculateBoutTotals();
    saveMmaState();
    playMmaAudio("horn");
    window.location.hash = "#mma-match";
  }

  // 8. SCORING & FIGHT LOGIC
  function saveToHistory() {
    mma.history.push({
      currentRound: mma.currentRound,
      timerSeconds: mma.timerSeconds,
      rounds: clone(mma.rounds),
      boutCompleted: mma.boutCompleted,
      winner: mma.winner,
      decisionType: mma.decisionType,
      finishSubtype: mma.finishSubtype
    });
    if (mma.history.length > 30) mma.history.shift();
  }

  function recalculateBoutTotals() {
    let rJ1 = 0, rJ2 = 0, rJ3 = 0, rStrikes = 0, rTd = 0, rKd = 0, rSub = 0, rCtrl = 0, rFouls = 0;
    let bJ1 = 0, bJ2 = 0, bJ3 = 0, bStrikes = 0, bTd = 0, bKd = 0, bSub = 0, bCtrl = 0, bFouls = 0;

    mma.rounds.forEach(r => {
      if (r.scored) {
        rJ1 += (r.redJ1 || 0);
        rJ2 += (r.redJ2 || 0);
        rJ3 += (r.redJ3 || 0);

        bJ1 += (r.blueJ1 || 0);
        bJ2 += (r.blueJ2 || 0);
        bJ3 += (r.blueJ3 || 0);
      }
      rStrikes += (r.redStrikes || 0);
      rTd += (r.redTd || 0);
      rKd += (r.redKd || 0);
      rSub += (r.redSub || 0);
      rCtrl += (r.redCtrl || 0);
      rFouls += (r.redFoul || 0);

      bStrikes += (r.blueStrikes || 0);
      bTd += (r.blueTd || 0);
      bKd += (r.blueKd || 0);
      bSub += (r.blueSub || 0);
      bCtrl += (r.blueCtrl || 0);
      bFouls += (r.blueFoul || 0);
    });

    const rTotalScore = Math.round((rJ1 + rJ2 + rJ3) / 3);
    const bTotalScore = Math.round((bJ1 + bJ2 + bJ3) / 3);

    mma.redTotals = { scoreJ1: rJ1, scoreJ2: rJ2, scoreJ3: rJ3, strikes: rStrikes, td: rTd, kd: rKd, sub: rSub, ctrl: rCtrl, fouls: rFouls, avgScore: rTotalScore };
    mma.blueTotals = { scoreJ1: bJ1, scoreJ2: bJ2, scoreJ3: bJ3, strikes: bStrikes, td: bTd, kd: bKd, sub: bSub, ctrl: bCtrl, fouls: bFouls, avgScore: bTotalScore };
  }

  function formatTimeMinutes(seconds) {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${String(secs).padStart(2, "0")}`;
  }

  function logAction(corner, actionType) {
    if (mma.boutCompleted) return;
    saveToHistory();

    const roundIdx = mma.currentRound - 1;
    const r = mma.rounds[roundIdx];

    if (corner === "red") {
      if (actionType === "strike") {
        r.redStrikes++;
        playMmaAudio("strike");
      } else if (actionType === "td") {
        r.redTd++;
        playMmaAudio("td");
        logTimelineEvent(`🤼 TAKEDOWN! ${mma.redName} takes down ${mma.blueName} in Round ${mma.currentRound}!`);
        triggerMmaToast(`🤼 Takedown for ${mma.redName}!`);
      } else if (actionType === "kd") {
        r.redKd++;
        playMmaAudio("kd");
        logTimelineEvent(`⚡ KNOCKDOWN! ${mma.redName} drops ${mma.blueName} with a heavy strike in Round ${mma.currentRound}!`);
        triggerMmaToast(`⚡ Knockdown for ${mma.redName}!`);
      } else if (actionType === "sub") {
        r.redSub++;
        logTimelineEvent(`🥋 SUBMISSION ATTEMPT! ${mma.redName} locks in a deep submission hold!`);
        triggerMmaToast(`🥋 Sub Attempt by ${mma.redName}!`);
      } else if (actionType === "ctrl") {
        r.redCtrl += 30;
        triggerMmaToast(`⏱️ +30s Control for ${mma.redName}`);
      } else if (actionType === "foul") {
        r.redFoul++;
        logTimelineEvent(`⚠️ FOUL: Referee deducts 1 point from ${mma.redName} in Round ${mma.currentRound}`);
        triggerMmaToast(`⚠️ Foul: -1 Point for ${mma.redName}`);
      }
    } else {
      if (actionType === "strike") {
        r.blueStrikes++;
        playMmaAudio("strike");
      } else if (actionType === "td") {
        r.blueTd++;
        playMmaAudio("td");
        logTimelineEvent(`🤼 TAKEDOWN! ${mma.blueName} takes down ${mma.redName} in Round ${mma.currentRound}!`);
        triggerMmaToast(`🤼 Takedown for ${mma.blueName}!`);
      } else if (actionType === "kd") {
        r.blueKd++;
        playMmaAudio("kd");
        logTimelineEvent(`⚡ KNOCKDOWN! ${mma.blueName} drops ${mma.redName} with a heavy strike in Round ${mma.currentRound}!`);
        triggerMmaToast(`⚡ Knockdown for ${mma.blueName}!`);
      } else if (actionType === "sub") {
        r.blueSub++;
        logTimelineEvent(`🥋 SUBMISSION ATTEMPT! ${mma.blueName} locks in a deep submission hold!`);
        triggerMmaToast(`🥋 Sub Attempt by ${mma.blueName}!`);
      } else if (actionType === "ctrl") {
        r.blueCtrl += 30;
        triggerMmaToast(`⏱️ +30s Control for ${mma.blueName}`);
      } else if (actionType === "foul") {
        r.blueFoul++;
        logTimelineEvent(`⚠️ FOUL: Referee deducts 1 point from ${mma.blueName} in Round ${mma.currentRound}`);
        triggerMmaToast(`⚠️ Foul: -1 Point for ${mma.blueName}`);
      }
    }

    recalculateBoutTotals();
    saveMmaState();
    renderMmaDashboard();
  }

  function assignRoundScore(redScore, blueScore) {
    if (mma.boutCompleted) return;
    saveToHistory();

    const roundIdx = mma.currentRound - 1;
    const r = mma.rounds[roundIdx];

    // Subtract fouls
    const finalRed = Math.max(6, redScore - r.redFoul);
    const finalBlue = Math.max(6, blueScore - r.blueFoul);

    r.redJ1 = finalRed; r.redJ2 = finalRed; r.redJ3 = finalRed;
    r.blueJ1 = finalBlue; r.blueJ2 = finalBlue; r.blueJ3 = finalBlue;
    r.scored = true;

    logTimelineEvent(`Round ${mma.currentRound} Scored: ${mma.redName} ${finalRed} - ${finalBlue} ${mma.blueName}`);
    triggerMmaToast(`Round ${mma.currentRound}: ${finalRed} - ${finalBlue}`);

    recalculateBoutTotals();
    saveMmaState();
    renderMmaDashboard();
  }

  function nextRound() {
    if (mma.boutCompleted) return;

    const roundIdx = mma.currentRound - 1;
    const r = mma.rounds[roundIdx];

    if (!r.scored) {
      // Auto score 10-9 based on KD / Strikes / TD if not manually set
      const redScoreSum = (r.redKd * 3) + (r.redTd * 2) + r.redStrikes + (r.redCtrl / 30);
      const blueScoreSum = (r.blueKd * 3) + (r.blueTd * 2) + r.blueStrikes + (r.blueCtrl / 30);

      if (r.redKd > 0 && r.blueKd === 0) {
        assignRoundScore(10, 8);
      } else if (r.blueKd > 0 && r.redKd === 0) {
        assignRoundScore(8, 10);
      } else if (redScoreSum > blueScoreSum) {
        assignRoundScore(10, 9);
      } else if (blueScoreSum > redScoreSum) {
        assignRoundScore(9, 10);
      } else {
        assignRoundScore(10, 10);
      }
    }

    if (mma.currentRound < mma.totalRounds) {
      stopRoundTimer();
      mma.currentRound++;
      mma.timerSeconds = mma.roundDuration;
      playMmaAudio("horn");
      saveMmaState();
      renderMmaDashboard();
      triggerMmaToast(`📢 Round ${mma.currentRound} Begins!`);
    } else {
      endBoutForDecision();
    }
  }

  function declareFinish(type = "KO", winningCorner = "red", subtype = "") {
    saveToHistory();
    stopRoundTimer();

    mma.boutCompleted = true;
    mma.winner = winningCorner === "red" ? mma.redName : mma.blueName;
    mma.decisionType = type;
    mma.finishSubtype = subtype || type;

    playMmaAudio("horn");
    logTimelineEvent(`🏆 FIGHT FINISHED: ${mma.winner} wins by ${type} (${subtype || type}) in Round ${mma.currentRound}!`);
    triggerMmaToast(`🏆 Winner: ${mma.winner} by ${type}!`);

    saveMmaState();
    renderMmaDashboard();
  }

  function endBoutForDecision() {
    saveToHistory();
    stopRoundTimer();
    recalculateBoutTotals();

    mma.boutCompleted = true;

    // Calculate 3-Judge Official Decision
    let redJudgeWins = 0;
    let blueJudgeWins = 0;
    let drawJudges = 0;

    // Judge 1
    if (mma.redTotals.scoreJ1 > mma.blueTotals.scoreJ1) redJudgeWins++;
    else if (mma.blueTotals.scoreJ1 > mma.redTotals.scoreJ1) blueJudgeWins++;
    else drawJudges++;

    // Judge 2
    if (mma.redTotals.scoreJ2 > mma.blueTotals.scoreJ2) redJudgeWins++;
    else if (mma.blueTotals.scoreJ2 > mma.redTotals.scoreJ2) blueJudgeWins++;
    else drawJudges++;

    // Judge 3
    if (mma.redTotals.scoreJ3 > mma.blueTotals.scoreJ3) redJudgeWins++;
    else if (mma.blueTotals.scoreJ3 > mma.redTotals.scoreJ3) blueJudgeWins++;
    else drawJudges++;

    if (redJudgeWins === 3) {
      mma.winner = mma.redName;
      mma.decisionType = "UD"; // Unanimous Decision
    } else if (redJudgeWins === 2 && blueJudgeWins === 1) {
      mma.winner = mma.redName;
      mma.decisionType = "SD"; // Split Decision
    } else if (redJudgeWins === 2 && drawJudges === 1) {
      mma.winner = mma.redName;
      mma.decisionType = "MD"; // Majority Decision
    } else if (blueJudgeWins === 3) {
      mma.winner = mma.blueName;
      mma.decisionType = "UD";
    } else if (blueJudgeWins === 2 && redJudgeWins === 1) {
      mma.winner = mma.blueName;
      mma.decisionType = "SD";
    } else if (blueJudgeWins === 2 && drawJudges === 1) {
      mma.winner = mma.blueName;
      mma.decisionType = "MD";
    } else {
      mma.winner = null;
      mma.decisionType = "Draw";
    }

    playMmaAudio("horn");
    if (mma.winner) {
      logTimelineEvent(`🏆 OFFICIAL DECISION: ${mma.winner} wins by ${mma.decisionType} (${mma.redTotals.avgScore}-${mma.blueTotals.avgScore})`);
      triggerMmaToast(`🏆 Winner: ${mma.winner} by ${mma.decisionType}!`);
    } else {
      logTimelineEvent(`🏆 OFFICIAL DECISION: Majority / Split DRAW!`);
      triggerMmaToast("🏆 Bout Result: DRAW!");
    }

    saveMmaState();
    renderMmaDashboard();
  }

  function logTimelineEvent(text) {
    mma.timeline.unshift({
      text,
      round: `R${mma.currentRound}`
    });
  }

  // Timer Controls
  function toggleRoundTimer() {
    if (mma.timerRunning) {
      stopRoundTimer();
    } else {
      startRoundTimer();
    }
  }

  function startRoundTimer() {
    if (mma.timerRunning) return;
    mma.timerRunning = true;
    if (els.timerToggleBtn) {
      els.timerToggleBtn.textContent = "⏸ Pause Clock";
      els.timerToggleBtn.style.background = "#eab308";
      els.timerToggleBtn.style.color = "#000";
    }

    timerInterval = setInterval(() => {
      if (mma.timerSeconds > 0) {
        mma.timerSeconds--;
        if (mma.timerSeconds === 10) {
          playMmaAudio("strike"); // 10s warning clapper
        }
        updateClockDisplay();
      } else {
        // Round Time Expired
        playMmaAudio("horn");
        stopRoundTimer();
        triggerMmaToast(`📢 End of Round ${mma.currentRound}!`);
      }
    }, 1000);
  }

  function stopRoundTimer() {
    mma.timerRunning = false;
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
    mma.timerSeconds = mma.roundDuration;
    updateClockDisplay();
    saveMmaState();
  }

  function updateClockDisplay() {
    if (!els.roundClock) return;
    const mins = Math.floor(mma.timerSeconds / 60);
    const secs = mma.timerSeconds % 60;
    els.roundClock.textContent = `${String(mins).padStart(2, "0")}:${String(secs).padStart(2, "0")}`;

    if (mma.timerSeconds <= 10 && mma.timerSeconds > 0) {
      els.roundClock.classList.add("warning");
    } else {
      els.roundClock.classList.remove("warning");
    }
  }

  // Undo
  function undoMmaAction() {
    if (!mma.history || mma.history.length === 0) {
      triggerMmaToast("No actions to undo.");
      return;
    }
    const prev = mma.history.pop();
    mma.currentRound = prev.currentRound;
    mma.timerSeconds = prev.timerSeconds;
    mma.rounds = clone(prev.rounds);
    mma.boutCompleted = prev.boutCompleted;
    mma.winner = prev.winner;
    mma.decisionType = prev.decisionType;
    mma.finishSubtype = prev.finishSubtype;

    if (mma.timeline.length > 0) mma.timeline.shift();

    recalculateBoutTotals();
    saveMmaState();
    renderMmaDashboard();
    triggerMmaToast("Last action undone.");
  }

  // Render Dashboard
  function renderMmaDashboard() {
    if (!els.dashboardView) return;

    if (els.roundTitle) els.roundTitle.textContent = `Round ${mma.currentRound} of ${mma.totalRounds} • ${mma.weightDivision} Title`;
    if (els.redNameDisplay) els.redNameDisplay.textContent = mma.redName;
    if (els.blueNameDisplay) els.blueNameDisplay.textContent = mma.blueName;

    if (els.redScoreDisplay) els.redScoreDisplay.textContent = mma.redTotals.avgScore;
    if (els.blueScoreDisplay) els.blueScoreDisplay.textContent = mma.blueTotals.avgScore;

    if (els.redTdCount) els.redTdCount.textContent = mma.redTotals.td;
    if (els.blueTdCount) els.blueTdCount.textContent = mma.blueTotals.td;

    if (els.redCtrlTime) els.redCtrlTime.textContent = formatTimeMinutes(mma.redTotals.ctrl);
    if (els.blueCtrlTime) els.blueCtrlTime.textContent = formatTimeMinutes(mma.blueTotals.ctrl);

    const roundIdx = mma.currentRound - 1;
    const currentRoundData = mma.rounds[roundIdx] || {};

    if (els.redStrikesCount) els.redStrikesCount.textContent = `${currentRoundData.redStrikes || 0} Landed (Total ${mma.redTotals.strikes})`;
    if (els.redTdBtnCount) els.redTdBtnCount.textContent = `${currentRoundData.redTd || 0} Landed`;

    if (els.blueStrikesCount) els.blueStrikesCount.textContent = `${currentRoundData.blueStrikes || 0} Landed (Total ${mma.blueTotals.strikes})`;
    if (els.blueTdBtnCount) els.blueTdBtnCount.textContent = `${currentRoundData.blueTd || 0} Landed`;

    updateClockDisplay();

    // Result badge
    if (els.decisionBadge) {
      if (mma.boutCompleted) {
        els.decisionBadge.classList.remove("hidden");
        if (mma.winner) {
          els.decisionBadge.textContent = `🏆 ${mma.winner} WINS (${mma.decisionType} ${mma.finishSubtype ? `• ${mma.finishSubtype}` : ''})`;
        } else {
          els.decisionBadge.textContent = `🏆 BOUT DRAW (${mma.decisionType})`;
        }
      } else {
        els.decisionBadge.classList.add("hidden");
      }
    }

    // Live Indicator
    if (els.liveIndicator) {
      if (mma.boutCompleted) els.liveIndicator.classList.add("hidden");
      else els.liveIndicator.classList.remove("hidden");
    }

    // Submit Tournament button
    if (els.submitResultBtn) {
      if (mma.isTournamentMatch && mma.boutCompleted) els.submitResultBtn.classList.remove("hidden");
      else els.submitResultBtn.classList.add("hidden");
    }

    // Render 3-Judge Scorecard Table
    renderScorecardTable();

    // Render Timeline List
    if (els.timelineList) {
      if (mma.timeline.length === 0) {
        els.timelineList.innerHTML = `<p style="color: var(--text-muted); font-style: italic; font-size: 0.9rem; margin: 0;">No strikes or rounds scored yet.</p>`;
      } else {
        els.timelineList.innerHTML = mma.timeline.map(item => `
          <div class="mma-log-item">
            <div style="font-weight: 700;">${item.text}</div>
            <div style="font-family: monospace; font-size: 0.75rem; color: var(--mma-gold); font-weight:800;">${item.round}</div>
          </div>
        `).join("");
      }
    }
  }

  function renderScorecardTable() {
    if (!els.scorecardTableBody || !els.scorecardTableFoot) return;

    els.scorecardTableBody.innerHTML = mma.rounds.map(r => {
      const isCurrent = (r.roundNum === mma.currentRound);
      const rowStyle = isCurrent ? "background: rgba(234,179,8,0.05); font-weight:800;" : "";

      return `
        <tr style="border-bottom: 1px solid rgba(255,255,255,0.04); ${rowStyle}">
          <td style="font-weight:900; color:var(--mma-gold); font-family:monospace;">${r.roundNum}</td>
          <td style="color:var(--mma-red); font-weight:800; font-family:monospace;">${r.scored ? r.redJ1 : '-'}</td>
          <td style="color:var(--mma-blue); font-weight:800; font-family:monospace;">${r.scored ? r.blueJ1 : '-'}</td>
          <td style="color:var(--mma-red); font-weight:800; font-family:monospace; border-left:1px solid rgba(255,255,255,0.08);">${r.scored ? r.redJ2 : '-'}</td>
          <td style="color:var(--mma-blue); font-weight:800; font-family:monospace;">${r.scored ? r.blueJ2 : '-'}</td>
          <td style="color:var(--mma-red); font-weight:800; font-family:monospace; border-left:1px solid rgba(255,255,255,0.08);">${r.scored ? r.redJ3 : '-'}</td>
          <td style="color:var(--mma-blue); font-weight:800; font-family:monospace;">${r.scored ? r.blueJ3 : '-'}</td>
        </tr>
      `;
    }).join("");

    els.scorecardTableFoot.innerHTML = `
      <tr style="background: rgba(255,255,255,0.03); font-weight:900; font-family:monospace;">
        <td style="color:#fff; padding: 10px 6px;">TOTAL</td>
        <td style="color:var(--mma-red); font-size:1rem;">${mma.redTotals.scoreJ1}</td>
        <td style="color:var(--mma-blue); font-size:1rem;">${mma.blueTotals.scoreJ1}</td>
        <td style="color:var(--mma-red); font-size:1rem; border-left:1px solid rgba(255,255,255,0.08);">${mma.redTotals.scoreJ2}</td>
        <td style="color:var(--mma-blue); font-size:1rem;">${mma.blueTotals.scoreJ2}</td>
        <td style="color:var(--mma-red); font-size:1rem; border-left:1px solid rgba(255,255,255,0.08);">${mma.redTotals.scoreJ3}</td>
        <td style="color:var(--mma-blue); font-size:1rem;">${mma.blueTotals.scoreJ3}</td>
      </tr>
    `;
  }

  // 9. DASHBOARD EVENT LISTENERS
  if (els.dashboardBackBtn) {
    els.dashboardBackBtn.addEventListener("click", () => {
      stopRoundTimer();
      if (mma.isTournamentMatch) {
        window.location.hash = "#mma-tdashboard";
      } else {
        window.location.hash = "#mma";
      }
    });
  }

  if (els.resetMatchBtn) {
    els.resetMatchBtn.addEventListener("click", () => {
      if (confirm("Reset current MMA bout? All strikes and rounds will be cleared.")) {
        initializeMmaBout(mma.redName, mma.blueName, mma.totalRounds, mma.roundDuration, mma.weightDivision);
      }
    });
  }

  if (els.timerToggleBtn) els.timerToggleBtn.addEventListener("click", toggleRoundTimer);
  if (els.hornBtn) els.hornBtn.addEventListener("click", () => playMmaAudio("horn"));
  if (els.resetClockBtn) els.resetClockBtn.addEventListener("click", resetRoundClock);

  // Strike & Grappling Action buttons
  document.querySelectorAll("[data-mma-action]").forEach(btn => {
    btn.addEventListener("click", (e) => {
      const corner = e.currentTarget.getAttribute("data-mma-corner");
      const action = e.currentTarget.getAttribute("data-mma-action");
      if (corner && action) {
        logAction(corner, action);
      }
    });
  });

  // 10-Point Must Quick Buttons
  if (els.score109Red) els.score109Red.addEventListener("click", () => assignRoundScore(10, 9));
  if (els.score108Red) els.score108Red.addEventListener("click", () => assignRoundScore(10, 8));
  if (els.score1010Even) els.score1010Even.addEventListener("click", () => assignRoundScore(10, 10));
  if (els.score109Blue) els.score109Blue.addEventListener("click", () => assignRoundScore(9, 10));
  if (els.score108Blue) els.score108Blue.addEventListener("click", () => assignRoundScore(8, 10));

  if (els.nextRoundBtn) els.nextRoundBtn.addEventListener("click", nextRound);
  if (els.undoBtn) els.undoBtn.addEventListener("click", undoMmaAction);
  if (els.endBoutBtn) els.endBoutBtn.addEventListener("click", endBoutForDecision);

  // Finish / Stoppage buttons
  if (els.stoppageKoBtn) {
    els.stoppageKoBtn.addEventListener("click", () => {
      const winnerCorner = prompt(`Enter winning corner for KO / TKO (type 'red' for ${mma.redName} or 'blue' for ${mma.blueName}):`, "red");
      const method = prompt("Enter specific finish (e.g. Head Kick KO, Flying Knee, Ground & Pound TKO):", "Ground & Pound TKO");
      if (winnerCorner && (winnerCorner.toLowerCase().includes("red") || winnerCorner.toLowerCase().includes(mma.redName.toLowerCase()))) {
        declareFinish("KO/TKO", "red", method || "KO/TKO");
      } else if (winnerCorner && (winnerCorner.toLowerCase().includes("blue") || winnerCorner.toLowerCase().includes(mma.blueName.toLowerCase()))) {
        declareFinish("KO/TKO", "blue", method || "KO/TKO");
      }
    });
  }

  if (els.stoppageSubBtn) {
    els.stoppageSubBtn.addEventListener("click", () => {
      const winnerCorner = prompt(`Enter winning corner for Submission (type 'red' for ${mma.redName} or 'blue' for ${mma.blueName}):`, "red");
      const subMethod = prompt("Enter submission hold (e.g. Rear Naked Choke, Guillotine, Armbar, Triangle Choke, D'Arce Choke):", "Rear Naked Choke");
      if (winnerCorner && (winnerCorner.toLowerCase().includes("red") || winnerCorner.toLowerCase().includes(mma.redName.toLowerCase()))) {
        declareFinish("SUB", "red", subMethod || "Submission");
      } else if (winnerCorner && (winnerCorner.toLowerCase().includes("blue") || winnerCorner.toLowerCase().includes(mma.blueName.toLowerCase()))) {
        declareFinish("SUB", "blue", subMethod || "Submission");
      }
    });
  }

  // Submit Result for Tournament Match
  if (els.submitResultBtn) {
    els.submitResultBtn.addEventListener("click", () => {
      if (mmat.active && mmat.activeFixtureId !== null) {
        const fixture = mmat.fixtures.find(f => f.id === mmat.activeFixtureId);
        if (fixture) {
          fixture.completed = true;
          fixture.winner = mma.winner;
          fixture.resultText = mma.winner ? `${mma.winner} won by ${mma.decisionType}` : `Draw (${mma.decisionType})`;

          // Update records
          const redFighter = mmat.fighters.find(f => f.name === fixture.red);
          const blueFighter = mmat.fighters.find(f => f.name === fixture.blue);

          if (redFighter && blueFighter) {
            redFighter.bouts++;
            blueFighter.bouts++;

            if (mma.winner === redFighter.name) {
              redFighter.wins++;
              redFighter.pts += 3;
              blueFighter.losses++;
              if (mma.decisionType && mma.decisionType.includes("KO")) redFighter.kos++;
              if (mma.decisionType && mma.decisionType.includes("SUB")) redFighter.subs++;
            } else if (mma.winner === blueFighter.name) {
              blueFighter.wins++;
              blueFighter.pts += 3;
              redFighter.losses++;
              if (mma.decisionType && mma.decisionType.includes("KO")) blueFighter.kos++;
              if (mma.decisionType && mma.decisionType.includes("SUB")) blueFighter.subs++;
            } else {
              redFighter.draws++;
              blueFighter.draws++;
              redFighter.pts += 1;
              blueFighter.pts += 1;
            }
          }

          saveMmaState();
          triggerMmaToast("Grand Prix Bout Result Saved!");
          window.location.hash = "#mma-tdashboard";
        }
      }
    });
  }

  // 10. TOURNAMENT ENGINE (GRAND PRIX BRACKET & STANDINGS)
  if (els.tsetupBackBtn) {
    els.tsetupBackBtn.addEventListener("click", () => {
      window.location.hash = "#mma";
    });
  }

  if (els.tteamCount) {
    els.tteamCount.addEventListener("change", renderTournamentFighterInputs);
  }

  function renderTournamentFighterInputs() {
    if (!els.tteamInputs) return;
    const count = Number(els.tteamCount ? els.tteamCount.value : 4);
    const defaultFighters = ["Islam Makhachev", "Alexander Volkanovski", "Charles Oliveira", "Justin Gaethje", "Dustin Poirier", "Michael Chandler", "Arman Tsarukyan", "Beneil Dariush"];

    els.tteamInputs.innerHTML = "";
    for (let i = 0; i < count; i++) {
      const defName = defaultFighters[i] || `Fighter ${i + 1}`;
      const div = document.createElement("div");
      div.innerHTML = `
        <label style="display: block; font-size: 0.8rem; color: var(--text-muted); margin-bottom: 4px; font-weight: 600;">Fighter ${i + 1} Name</label>
        <input type="text" class="mma-tfighter-name-input" value="${defName}" autocomplete="off" style="width: 100%; height: 38px; background: rgba(0,0,0,0.25); border: 1px solid rgba(255,255,255,0.1); border-radius: 6px; color: var(--ink); padding: 0 12px; font-size: 0.9rem;" />
      `;
      els.tteamInputs.appendChild(div);
    }
  }

  if (els.tcreateBtn) {
    els.tcreateBtn.addEventListener("click", () => {
      const name = els.tnameInput.value.trim() || "UFC World Grand Prix";
      const count = Number(els.tteamCount.value) || 4;
      const rounds = Number(els.troundsSelect ? els.troundsSelect.value : 3);

      const inputs = document.querySelectorAll(".mma-tfighter-name-input");
      const fighterNames = [];
      const unique = new Set();

      for (let i = 0; i < inputs.length; i++) {
        const fName = inputs[i].value.trim() || `Fighter ${i + 1}`;
        if (unique.has(fName.toLowerCase())) {
          triggerMmaToast(`Fighter names must be unique. Duplicate: "${fName}"`);
          return;
        }
        unique.add(fName.toLowerCase());
        fighterNames.push(fName);
      }

      mmat = clone(defaultMmatState);
      mmat.active = true;
      mmat.name = name;
      mmat.fighterCount = count;
      mmat.roundsPerBout = rounds;

      mmat.fighters = fighterNames.map(n => ({
        name: n,
        bouts: 0,
        wins: 0,
        losses: 0,
        draws: 0,
        kos: 0,
        subs: 0,
        pts: 0
      }));

      // Generate Round Robin Grand Prix Fight Cards
      mmat.fixtures = [];
      let fixId = 1;
      for (let i = 0; i < fighterNames.length; i++) {
        for (let j = i + 1; j < fighterNames.length; j++) {
          mmat.fixtures.push({
            id: fixId++,
            red: fighterNames[i],
            blue: fighterNames[j],
            completed: false,
            resultText: "Scheduled",
            winner: null
          });
        }
      }

      saveMmaState();
      window.location.hash = "#mma-tdashboard";
    });
  }

  // Tournament Tabs
  const mmaTabs = ["table", "fixtures", "edit"];
  mmaTabs.forEach(tab => {
    const btn = document.querySelector(`#mma-tab-${tab}`);
    if (btn) {
      btn.addEventListener("click", () => {
        mmaTabs.forEach(t => {
          const b = document.querySelector(`#mma-tab-${t}`);
          const v = document.querySelector(`#mma-${t}-view`);
          if (b) b.classList.remove("active");
          if (v) v.classList.add("hidden");
        });
        btn.classList.add("active");
        const activeView = document.querySelector(`#mma-${tab}-view`);
        if (activeView) activeView.classList.remove("hidden");

        if (tab === "table") renderPointsTable();
        else if (tab === "fixtures") renderTournamentFixturesList();
        else if (tab === "edit") renderEditSetup();
      });
    }
  });

  function renderPointsTable() {
    if (!mmat.active) return;

    // Sort by PTS > Wins > KOs > SUBs
    const sorted = [...mmat.fighters].sort((a, b) => {
      if (b.pts !== a.pts) return b.pts - a.pts;
      if (b.wins !== a.wins) return b.wins - a.wins;
      if (b.kos !== a.kos) return b.kos - a.kos;
      return b.subs - a.subs;
    });

    if (els.pointsTableBody) {
      els.pointsTableBody.innerHTML = sorted.map((f, idx) => `
        <tr style="border-bottom: 1px solid rgba(255,255,255,0.05);">
          <td style="padding: 10px 8px; font-weight:800; color: var(--mma-gold);">${idx + 1}</td>
          <td style="padding: 10px 8px; font-weight:800; color:#fff;">${f.name}</td>
          <td style="padding: 10px 8px; text-align:center; font-family:monospace;">${f.bouts}</td>
          <td style="padding: 10px 8px; text-align:center; font-family:monospace; color:#10b981; font-weight:800;">${f.wins}</td>
          <td style="padding: 10px 8px; text-align:center; font-family:monospace; color:#f87171;">${f.losses}</td>
          <td style="padding: 10px 8px; text-align:center; font-family:monospace; color:#f59e0b;">${f.draws}</td>
          <td style="padding: 10px 8px; text-align:center; font-family:monospace; color:var(--mma-red); font-weight:900;">${f.kos}</td>
          <td style="padding: 10px 8px; text-align:center; font-family:monospace; color:var(--mma-gold); font-weight:900;">${f.subs}</td>
          <td style="padding: 10px 8px; font-weight:900; text-align:right; font-family:monospace; color:var(--mma-gold);">${f.pts}</td>
        </tr>
      `).join("");
    }
  }

  function renderTournamentFixturesList() {
    if (!els.fixturesList) return;
    els.fixturesList.innerHTML = "";

    mmat.fixtures.forEach(fix => {
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
          <span style="font-size: 0.75rem; color: var(--mma-gold); font-weight:700; text-transform:uppercase;">Fight #${fix.id} • ${mmat.roundsPerBout} Rounds</span>
          <div style="font-weight: 800; font-size:1.1rem; margin-top:4px;">
            <span style="color:var(--mma-red);">${fix.red}</span>
            <span style="color:var(--text-muted); font-size:0.85rem; margin:0 6px;">vs</span>
            <span style="color:var(--mma-blue);">${fix.blue}</span>
          </div>
        </div>
      `;

      let rightSide = "";
      if (fix.completed) {
        rightSide = `
          <div style="text-align:right;">
            <div style="font-weight:800; color:var(--mma-gold); font-size:0.9rem;">${fix.resultText}</div>
            <span style="background: rgba(16,185,129,0.15); color:#10b981; font-size:0.75rem; padding:3px 8px; border-radius:6px; font-weight:700; text-transform:uppercase;">Official</span>
          </div>
        `;
      } else {
        rightSide = `
          <button class="start-custom" type="button" data-mma-bout="${fix.id}" style="margin:0; padding:8px 16px; font-size:0.8rem; border-radius:6px; font-weight:700;">🥋 Score Fight</button>
        `;
      }

      card.innerHTML = leftSide + rightSide;
      els.fixturesList.appendChild(card);
    });

    document.querySelectorAll("[data-mma-bout]").forEach(btn => {
      btn.addEventListener("click", (e) => {
        const fId = Number(e.currentTarget.getAttribute("data-mma-bout"));
        const fix = mmat.fixtures.find(f => f.id === fId);

        if (fix) {
          mmat.activeFixtureId = fId;
          initializeTournamentFight(fix.red, fix.blue, mmat.roundsPerBout);
        }
      });
    });
  }

  function initializeTournamentFight(redName, blueName, totalRounds) {
    initializeMmaBout(redName, blueName, totalRounds, 300, "Grand Prix Title");
    mma.isTournamentMatch = true;
    saveMmaState();
  }

  function renderEditSetup() {
    if (els.editTeamsContainer) {
      els.editTeamsContainer.innerHTML = mmat.fighters.map((f, idx) => `
        <div class="setup-group">
          <label style="display: block; font-size: 0.85rem; color: var(--text-muted); margin-bottom: 4px; font-weight: 600;">Fighter ${idx + 1} Name</label>
          <input type="text" class="mma-edit-tfighter-input" data-fighter-index="${idx}" value="${f.name}" autocomplete="off" style="width: 100%; height: 38px; background: rgba(0,0,0,0.25); border: 1px solid rgba(255,255,255,0.1); border-radius: 6px; color: var(--ink); padding: 0 12px; font-size: 0.9rem;" />
        </div>
      `).join("");
    }
  }

  if (els.editSaveBtn) {
    els.editSaveBtn.addEventListener("click", () => {
      const inputs = document.querySelectorAll(".mma-edit-tfighter-input");
      const names = [];
      const unique = new Set();

      for (let i = 0; i < inputs.length; i++) {
        const val = inputs[i].value.trim() || `Fighter ${i + 1}`;
        if (unique.has(val.toLowerCase())) {
          triggerMmaToast(`Duplicate name: "${val}"`);
          return;
        }
        unique.add(val.toLowerCase());
        names.push(val);
      }

      names.forEach((n, idx) => {
        const oldName = mmat.fighters[idx].name;
        mmat.fighters[idx].name = n;

        // Update in fixtures
        mmat.fixtures.forEach(fix => {
          if (fix.red === oldName) fix.red = n;
          if (fix.blue === oldName) fix.blue = n;
        });
      });

      saveMmaState();
      triggerMmaToast("Fighter names updated!");
      document.querySelector("#mma-tab-table").click();
    });
  }

  if (els.tresetBtn) {
    els.tresetBtn.addEventListener("click", () => {
      if (confirm("Are you sure you want to reset this MMA Grand Prix? All fight cards will be cleared.")) {
        mmat = clone(defaultMmatState);
        saveMmaState();
        window.location.hash = "#mma";
      }
    });
  }

  if (els.tdashboardBackBtn) {
    els.tdashboardBackBtn.addEventListener("click", () => {
      mmat.active = false;
      saveMmaState();
      window.location.hash = "#mma";
    });
  }

  function renderTournamentDashboard() {
    if (els.tdashboardName) els.tdashboardName.textContent = mmat.name;
    renderPointsTable();
  }

  // 11. INITIALIZE MMA ROUTINGS
  loadMmaState();

  if (window.location.hash.startsWith("#mma")) {
    showMmaPage(true);
  }

  window.addEventListener("hashchange", () => {
    if (window.location.hash.startsWith("#mma")) {
      showMmaPage(true);
    }
  });

  // Bind Home Sports Card button
  const mmaCardBtn = document.querySelector("[data-open-sport='mma']");
  if (mmaCardBtn) {
    mmaCardBtn.addEventListener("click", () => {
      window.location.hash = "#mma";
    });
  }

})();
