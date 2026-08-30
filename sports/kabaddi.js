/**
 * ==========================================================================
 * KABADDI SCORER & TOURNAMENT ENGINE
 * ==========================================================================
 * Modular Kabaddi tracker supporting Pro Kabaddi League (PKL) rules,
 * 7 on-mat player counters, Touch/Tackle/Bonus/Super Tackle points, All-Out Lona (+2),
 * 30-Second Raid Clock with buzzer, Do-or-Die tracking, and PKL Tournaments.
 */

(() => {
  "use strict";

  // 1. STATE & CONSTANTS
  const KB_STORAGE_KEY = "scoretracker_kabaddi_match_state";
  const KBT_STORAGE_KEY = "scoretracker_kabaddi_tournament_state";

  const defaultKabaddiState = {
    active: false,
    isTournamentMatch: false,
    team1: "Team 1",
    team2: "Team 2",
    halfDuration: 20, // minutes
    currentHalf: 1, // 1 or 2 or 3
    timerSeconds: 0,
    isTimerRunning: false,
    raidSeconds: 30,
    isRaidRunning: false,
    raidingTeam: 1, // 1 or 2
    emptyRaids1: 0, // 0, 1, 2
    emptyRaids2: 0,
    isDoOrDie: false,
    score1: 0,
    score2: 0,
    activePlayers1: 7, // 7 down to 0
    activePlayers2: 7,
    allOuts1: 0, // all-outs inflicted on team 2
    allOuts2: 0,
    superRaids1: 0,
    superRaids2: 0,
    superTackles1: 0,
    superTackles2: 0,
    timeline: [], // { text, score, time }
    history: [], // stack of previous states for undo
    matchCompleted: false,
    winner: null
  };

  const defaultKbtState = {
    active: false,
    name: "Pro Kabaddi Championship",
    teamCount: 4,
    halfDuration: 20,
    teams: [], // { name, played, wins, ties, losses, sf, sa, diff, ldp, pts }
    fixtures: [], // { round, teamA, teamB, scoreA, scoreB, pointsA, pointsB, status, matchState }
    activeFixtureIndex: -1
  };

  let kb = clone(defaultKabaddiState);
  let kbt = clone(defaultKbtState);
  let matchClockInterval = null;
  let raidClockInterval = null;

  function clone(obj) {
    return JSON.parse(JSON.stringify(obj));
  }

  // 2. DOM ELEMENTS SELECTORS
  const els = {
    // Page Wrappers
    kabaddiPage: document.querySelector("#kabaddi-page"),
    formatView: document.querySelector("#kb-format-view"),
    setupView: document.querySelector("#kb-setup-view"),
    dashboardView: document.querySelector("#kb-dashboard-view"),
    tsetupView: document.querySelector("#kb-tsetup-view"),
    tdashboardView: document.querySelector("#kb-tdashboard-view"),

    // Format selection buttons
    formatBackBtn: document.querySelector("#kb-format-back-btn"),
    formatCustomBtn: document.querySelector("#kb-format-custom-btn"),
    formatTournamentBtn: document.querySelector("#kb-format-tournament-btn"),

    // Setup
    setupBackBtn: document.querySelector("#kb-setup-back-btn"),
    team1Input: document.querySelector("#kb-team1-input"),
    team2Input: document.querySelector("#kb-team2-input"),
    durationSelect: document.querySelector("#kb-duration-select"),
    firstRaidSelect: document.querySelector("#kb-firstraid-select"),
    startBtn: document.querySelector("#kb-start-btn"),

    // Dashboard Header & Status
    dashboardBackBtn: document.querySelector("#kb-dashboard-back-btn"),
    resetMatchBtn: document.querySelector("#kb-reset-match-btn"),
    liveIndicator: document.querySelector("#kb-live-indicator"),
    halfBadge: document.querySelector("#kb-half-badge"),
    dodBadge: document.querySelector("#kb-dod-badge"),
    raidClock: document.querySelector("#kb-raid-clock"),
    matchTimer: document.querySelector("#kb-match-timer"),
    raidStartBtn: document.querySelector("#kb-raid-start-btn"),
    raidResetBtn: document.querySelector("#kb-raid-reset-btn"),
    timerToggleBtn: document.querySelector("#kb-timer-toggle-btn"),
    toggleRaiderBtn: document.querySelector("#kb-toggle-raider-btn"),

    // Big Scoreboard Displays
    team1NameDisplay: document.querySelector("#kb-team1-name-display"),
    team2NameDisplay: document.querySelector("#kb-team2-name-display"),
    team1ScoreDisplay: document.querySelector("#kb-team1-score-display"),
    team2ScoreDisplay: document.querySelector("#kb-team2-score-display"),
    t1RaidingBadge: document.querySelector("#kb-t1-raiding-badge"),
    t2RaidingBadge: document.querySelector("#kb-t2-raiding-badge"),
    t1ActiveCount: document.querySelector("#kb-t1-active-count"),
    t2ActiveCount: document.querySelector("#kb-t2-active-count"),
    t1PlayersMat: document.querySelector("#kb-t1-players-mat"),
    t2PlayersMat: document.querySelector("#kb-t2-players-mat"),
    t1ActionsTitle: document.querySelector("#kb-t1-actions-title"),
    t2ActionsTitle: document.querySelector("#kb-t2-actions-title"),

    // Control Buttons
    undoBtn: document.querySelector("#kb-undo-btn"),
    nextHalfBtn: document.querySelector("#kb-next-half-btn"),
    endMatchBtn: document.querySelector("#kb-end-match-btn"),
    submitResultBtn: document.querySelector("#kb-submit-result-btn"),
    timelineList: document.querySelector("#kb-timeline-list"),

    // Tournament Setup
    tsetupBackBtn: document.querySelector("#kb-tsetup-back-btn"),
    tnameInput: document.querySelector("#kb-tname-input"),
    tteamCount: document.querySelector("#kb-tteam-count"),
    tdurationSelect: document.querySelector("#kb-tduration-select"),
    tteamInputs: document.querySelector("#kb-tteam-inputs"),
    tcreateBtn: document.querySelector("#kb-tcreate-btn"),

    // Tournament Dashboard
    tdashboardBackBtn: document.querySelector("#kb-tdashboard-back-btn"),
    tresetBtn: document.querySelector("#kb-treset-btn"),
    tdashboardName: document.querySelector("#kb-tdashboard-name"),
    tabTable: document.querySelector("#kb-tab-table"),
    tabFixtures: document.querySelector("#kb-tab-fixtures"),
    tabEdit: document.querySelector("#kb-tab-edit"),
    tableView: document.querySelector("#kb-table-view"),
    fixturesView: document.querySelector("#kb-fixtures-view"),
    editView: document.querySelector("#kb-edit-view"),
    pointsTableBody: document.querySelector("#kb-points-table-body"),
    fixturesList: document.querySelector("#kb-fixtures-list"),
    editTeamsContainer: document.querySelector("#kb-edit-teams-container"),
    editSaveBtn: document.querySelector("#kb-edit-save-btn")
  };

  // 3. TOAST & AUDIO EFFECTS
  function triggerKbToast(message) {
    const existing = document.querySelector(".kb-toast-notification");
    if (existing) existing.remove();

    const toast = document.createElement("div");
    toast.className = "kb-toast-notification";
    toast.textContent = message;
    toast.style.position = "fixed";
    toast.style.bottom = "24px";
    toast.style.left = "50%";
    toast.style.transform = "translateX(-50%)";
    toast.style.background = "#f97316";
    toast.style.color = "#070a13";
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

  function playKabaddiAudio(type = "whistle") {
    try {
      const AudioCtx = window.AudioContext || window.webkitAudioContext;
      if (!AudioCtx) return;
      const ctx = new AudioCtx();
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      if (type === "buzzer") {
        osc.type = "sawtooth";
        osc.frequency.setValueAtTime(180, ctx.currentTime);
        osc.frequency.setValueAtTime(140, ctx.currentTime + 0.3);
        gain.gain.setValueAtTime(0.35, ctx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.8);
        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.start();
        osc.stop(ctx.currentTime + 0.8);
      } else {
        osc.type = "sine";
        osc.frequency.setValueAtTime(2200, ctx.currentTime);
        osc.frequency.setValueAtTime(2500, ctx.currentTime + 0.1);
        osc.frequency.setValueAtTime(2200, ctx.currentTime + 0.25);
        gain.gain.setValueAtTime(0.2, ctx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.45);
        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.start();
        osc.stop(ctx.currentTime + 0.45);
      }
    } catch (e) {
      console.warn("Audio not available", e);
    }
  }

  // 4. STORAGE PERSISTENCE
  function loadKabaddiState() {
    try {
      const stored = localStorage.getItem(KB_STORAGE_KEY);
      const storedT = localStorage.getItem(KBT_STORAGE_KEY);
      if (stored) kb = { ...clone(defaultKabaddiState), ...JSON.parse(stored) };
      if (storedT) kbt = { ...clone(defaultKbtState), ...JSON.parse(storedT) };
    } catch (e) {
      console.error("Failed to load kabaddi state", e);
    }
  }

  function saveKabaddiState() {
    try {
      localStorage.setItem(KB_STORAGE_KEY, JSON.stringify(kb));
      localStorage.setItem(KBT_STORAGE_KEY, JSON.stringify(kbt));
    } catch (e) {
      console.error("Failed to save kabaddi state", e);
    }
  }

  // 5. VIEW NAVIGATION
  function hideAllKbViews() {
    if (els.formatView) els.formatView.classList.add("hidden");
    if (els.setupView) els.setupView.classList.add("hidden");
    if (els.dashboardView) els.dashboardView.classList.add("hidden");
    if (els.tsetupView) els.tsetupView.classList.add("hidden");
    if (els.tdashboardView) els.tdashboardView.classList.add("hidden");
  }

  function showKabaddiPage(fromHash = false) {
    const pages = ["#cricket-page", "#football-page", "#basketball-page", "#tennis-page", "#badminton-page", "#hockey-page", "#volleyball-page", "#baseball-page", "#rugby-page", "#sports-page", "#format-page"];
    pages.forEach(p => {
      const el = document.querySelector(p);
      if (el) el.classList.add("hidden");
    });

    if (els.kabaddiPage) els.kabaddiPage.classList.remove("hidden");
    hideAllKbViews();

    const hash = window.location.hash;
    if (hash === "#kabaddi") {
      if (els.formatView) els.formatView.classList.remove("hidden");
    } else if (hash === "#kabaddi-custom") {
      if (els.setupView) els.setupView.classList.remove("hidden");
      if (els.team1Input) els.team1Input.value = "";
      if (els.team2Input) els.team2Input.value = "";
    } else if (hash === "#kabaddi-match") {
      if (els.dashboardView) els.dashboardView.classList.remove("hidden");
      renderKabaddiDashboard();
    } else if (hash === "#kabaddi-tsetup") {
      if (els.tsetupView) els.tsetupView.classList.remove("hidden");
      renderTournamentTeamInputs();
    } else if (hash === "#kabaddi-tdashboard") {
      if (els.tdashboardView) els.tdashboardView.classList.remove("hidden");
      renderTournamentDashboard();
    }
  }

  window.showKabaddiPage = showKabaddiPage;

  // 6. FORMAT CHOICE LISTENERS
  if (els.formatBackBtn) {
    els.formatBackBtn.addEventListener("click", () => {
      window.location.hash = "#sports";
    });
  }

  if (els.formatCustomBtn) {
    els.formatCustomBtn.addEventListener("click", () => {
      window.location.hash = "#kabaddi-custom";
    });
  }

  if (els.formatTournamentBtn) {
    els.formatTournamentBtn.addEventListener("click", () => {
      if (kbt.active) {
        window.location.hash = "#kabaddi-tdashboard";
      } else {
        window.location.hash = "#kabaddi-tsetup";
      }
    });
  }

  // 7. MATCH SETUP & START
  if (els.setupBackBtn) {
    els.setupBackBtn.addEventListener("click", () => {
      window.location.hash = "#kabaddi";
    });
  }

  if (els.startBtn) {
    els.startBtn.addEventListener("click", () => {
      const t1 = els.team1Input.value.trim() || "Patna Pirates";
      const t2 = els.team2Input.value.trim() || "Puneri Paltan";
      const duration = Number(els.durationSelect ? els.durationSelect.value : 20);
      const firstRaid = Number(els.firstRaidSelect ? els.firstRaidSelect.value : 1);

      if (t1.toLowerCase() === t2.toLowerCase()) {
        triggerKbToast("Team names must be different.");
        return;
      }

      initializeKabaddiMatch(t1, t2, duration, firstRaid);
    });
  }

  function initializeKabaddiMatch(t1, t2, duration = 20, firstRaid = 1) {
    kb = clone(defaultKabaddiState);
    kb.active = true;
    kb.isTournamentMatch = false;
    kb.team1 = t1;
    kb.team2 = t2;
    kb.halfDuration = duration;
    kb.currentHalf = 1;
    kb.raidingTeam = firstRaid;
    kb.activePlayers1 = 7;
    kb.activePlayers2 = 7;
    kb.timerSeconds = 0;
    kb.raidSeconds = 30;
    kb.isTimerRunning = false;
    kb.isRaidRunning = false;

    saveKabaddiState();
    window.location.hash = "#kabaddi-match";
  }

  // 8. SCORING & ALL-OUT ENGINE
  function saveToHistory() {
    kb.history.push({
      currentHalf: kb.currentHalf,
      timerSeconds: kb.timerSeconds,
      raidSeconds: kb.raidSeconds,
      raidingTeam: kb.raidingTeam,
      emptyRaids1: kb.emptyRaids1,
      emptyRaids2: kb.emptyRaids2,
      isDoOrDie: kb.isDoOrDie,
      score1: kb.score1,
      score2: kb.score2,
      activePlayers1: kb.activePlayers1,
      activePlayers2: kb.activePlayers2,
      allOuts1: kb.allOuts1,
      allOuts2: kb.allOuts2,
      superRaids1: kb.superRaids1,
      superRaids2: kb.superRaids2,
      superTackles1: kb.superTackles1,
      superTackles2: kb.superTackles2,
      matchCompleted: kb.matchCompleted,
      winner: kb.winner
    });
    if (kb.history.length > 30) kb.history.shift();
  }

  function logTimelineEvent(desc) {
    const timeStr = `${Math.floor(kb.timerSeconds / 60)}' (H${kb.currentHalf})`;
    const scoreStr = `${kb.team1} ${kb.score1} - ${kb.score2} ${kb.team2}`;

    kb.timeline.unshift({
      text: desc,
      score: scoreStr,
      time: timeStr
    });
  }

  function updateDoOrDieStatus() {
    const emptyCount = kb.raidingTeam === 1 ? kb.emptyRaids1 : kb.emptyRaids2;
    kb.isDoOrDie = (emptyCount === 2);
  }

  function switchRaidingTeam() {
    kb.raidingTeam = kb.raidingTeam === 1 ? 2 : 1;
    resetRaidTimer();
    updateDoOrDieStatus();
  }

  function checkAllOut() {
    if (kb.activePlayers1 <= 0) {
      // Team 2 inflicts All-Out on Team 1
      kb.score2 += 2;
      kb.allOuts2++;
      kb.activePlayers1 = 7;
      playKabaddiAudio("whistle");
      logTimelineEvent(`👑 ALL-OUT (+2) inflicted on ${kb.team1} by ${kb.team2}! All 7 players revived.`);
      triggerKbToast(`ALL-OUT! +2 Points for ${kb.team2}!`);
    }

    if (kb.activePlayers2 <= 0) {
      // Team 1 inflicts All-Out on Team 2
      kb.score1 += 2;
      kb.allOuts1++;
      kb.activePlayers2 = 7;
      playKabaddiAudio("whistle");
      logTimelineEvent(`👑 ALL-OUT (+2) inflicted on ${kb.team2} by ${kb.team1}! All 7 players revived.`);
      triggerKbToast(`ALL-OUT! +2 Points for ${kb.team1}!`);
    }
  }

  // Handle Scoring Action
  function handleKabaddiAction(teamNum, action, pts = 1) {
    if (kb.matchCompleted) return;
    saveToHistory();

    const teamName = teamNum === 1 ? kb.team1 : kb.team2;
    const oppName = teamNum === 1 ? kb.team2 : kb.team1;

    if (action === "touch") {
      playKabaddiAudio("whistle");
      if (teamNum === 1) {
        kb.score1 += pts;
        kb.activePlayers2 = Math.max(0, kb.activePlayers2 - pts);
        kb.activePlayers1 = Math.min(7, kb.activePlayers1 + pts);
        kb.emptyRaids1 = 0;
        if (pts >= 3) kb.superRaids1++;
      } else {
        kb.score2 += pts;
        kb.activePlayers1 = Math.max(0, kb.activePlayers1 - pts);
        kb.activePlayers2 = Math.min(7, kb.activePlayers2 + pts);
        kb.emptyRaids2 = 0;
        if (pts >= 3) kb.superRaids2++;
      }

      const raidLabel = pts >= 3 ? `🔥 SUPER RAID (+${pts} pts)` : `⚡ +${pts} Touch Point${pts > 1 ? 's' : ''}`;
      logTimelineEvent(`${raidLabel} by ${teamName}`);
      triggerKbToast(`${raidLabel} for ${teamName}!`);
      checkAllOut();
      switchRaidingTeam();

    } else if (action === "bonus") {
      playKabaddiAudio("whistle");
      if (teamNum === 1) {
        kb.score1 += 1;
        kb.emptyRaids1 = 0;
      } else {
        kb.score2 += 1;
        kb.emptyRaids2 = 0;
      }
      logTimelineEvent(`⭐ +1 Bonus Point scored by ${teamName}`);
      triggerKbToast(`Bonus Point for ${teamName}!`);

    } else if (action === "tackle") {
      playKabaddiAudio("whistle");
      if (teamNum === 1) {
        kb.score1 += 1;
        kb.activePlayers2 = Math.max(0, kb.activePlayers2 - 1); // Raider out
        kb.activePlayers1 = Math.min(7, kb.activePlayers1 + 1); // 1 defender revived
        kb.emptyRaids2 = 0;
      } else {
        kb.score2 += 1;
        kb.activePlayers1 = Math.max(0, kb.activePlayers1 - 1);
        kb.activePlayers2 = Math.min(7, kb.activePlayers2 + 1);
        kb.emptyRaids1 = 0;
      }
      logTimelineEvent(`🛡️ +1 Tackle Point for ${teamName} (Pinned raider)`);
      triggerKbToast(`Tackle Point for ${teamName}!`);
      checkAllOut();
      switchRaidingTeam();

    } else if (action === "supertackle") {
      playKabaddiAudio("whistle");
      if (teamNum === 1) {
        kb.score1 += 2;
        kb.activePlayers2 = Math.max(0, kb.activePlayers2 - 1);
        kb.activePlayers1 = Math.min(7, kb.activePlayers1 + 1);
        kb.superTackles1++;
        kb.emptyRaids2 = 0;
      } else {
        kb.score2 += 2;
        kb.activePlayers1 = Math.max(0, kb.activePlayers1 - 1);
        kb.activePlayers2 = Math.min(7, kb.activePlayers2 + 1);
        kb.superTackles2++;
        kb.emptyRaids1 = 0;
      }
      logTimelineEvent(`💥 SUPER TACKLE (+2 pts) by ${teamName}!`);
      triggerKbToast(`SUPER TACKLE for ${teamName}! (+2 pts)`);
      checkAllOut();
      switchRaidingTeam();

    } else if (action === "allout") {
      if (teamNum === 1) {
        kb.score1 += 2;
        kb.allOuts1++;
        kb.activePlayers2 = 7;
      } else {
        kb.score2 += 2;
        kb.allOuts2++;
        kb.activePlayers1 = 7;
      }
      logTimelineEvent(`👑 All-Out (+2 Lona) awarded to ${teamName}`);
      triggerKbToast(`All-Out +2 for ${teamName}`);

    } else if (action === "empty") {
      if (kb.isDoOrDie) {
        // Do or Die Raid Failed -> Raider is OUT! Opponent gets +1 Tackle point
        playKabaddiAudio("buzzer");
        if (teamNum === 1) {
          kb.score2 += 1;
          kb.activePlayers1 = Math.max(0, kb.activePlayers1 - 1);
          kb.activePlayers2 = Math.min(7, kb.activePlayers2 + 1);
          kb.emptyRaids1 = 0;
        } else {
          kb.score1 += 1;
          kb.activePlayers2 = Math.max(0, kb.activePlayers2 - 1);
          kb.activePlayers1 = Math.min(7, kb.activePlayers1 + 1);
          kb.emptyRaids2 = 0;
        }
        logTimelineEvent(`⚠️ Do-or-Die Raid Failed! ${teamName} raider out (+1 pt to ${oppName})`);
        triggerKbToast(`Do-or-Die Failed! +1 pt to ${oppName}`);
        checkAllOut();
      } else {
        if (teamNum === 1) kb.emptyRaids1++;
        else kb.emptyRaids2++;
        logTimelineEvent(`⏳ Empty raid by ${teamName}`);
        triggerKbToast(`Empty Raid`);
      }
      switchRaidingTeam();
    }

    saveKabaddiState();
    renderKabaddiDashboard();
  }

  // 30-Second Raid Clock
  function startRaidTimer() {
    if (kb.matchCompleted) return;

    if (kb.isRaidRunning) {
      clearInterval(raidClockInterval);
      kb.isRaidRunning = false;
      if (els.raidStartBtn) {
        els.raidStartBtn.textContent = "⏱️ Start Raid";
        els.raidStartBtn.classList.remove("active");
      }
    } else {
      kb.isRaidRunning = true;
      if (els.raidStartBtn) {
        els.raidStartBtn.textContent = "⏸ Pause Raid";
        els.raidStartBtn.classList.add("active");
      }

      raidClockInterval = setInterval(() => {
        kb.raidSeconds--;
        renderRaidClockDisplay();

        if (kb.raidSeconds <= 0) {
          clearInterval(raidClockInterval);
          kb.isRaidRunning = false;
          playKabaddiAudio("buzzer");
          triggerKbToast("30s Raid Time Expired!");
          if (els.raidStartBtn) els.raidStartBtn.textContent = "⏱️ Start Raid";
        }
      }, 1000);
    }
  }

  function resetRaidTimer() {
    if (raidClockInterval) clearInterval(raidClockInterval);
    kb.isRaidRunning = false;
    kb.raidSeconds = 30;
    if (els.raidStartBtn) {
      els.raidStartBtn.textContent = "⏱️ Start Raid";
      els.raidStartBtn.classList.remove("active");
    }
    renderRaidClockDisplay();
  }

  function renderRaidClockDisplay() {
    if (els.raidClock) {
      els.raidClock.textContent = String(kb.raidSeconds).padStart(2, '0');
      if (kb.raidSeconds <= 5) els.raidClock.className = "kb-raid-clock warning";
      else els.raidClock.className = "kb-raid-clock";
    }
  }

  // Match Stopwatch
  function toggleMatchTimer() {
    if (kb.matchCompleted) return;

    if (kb.isTimerRunning) {
      clearInterval(matchClockInterval);
      kb.isTimerRunning = false;
      if (els.timerToggleBtn) {
        els.timerToggleBtn.textContent = "▶ Match Clock";
        els.timerToggleBtn.classList.remove("active");
      }
    } else {
      kb.isTimerRunning = true;
      if (els.timerToggleBtn) {
        els.timerToggleBtn.textContent = "⏸ Pause Clock";
        els.timerToggleBtn.classList.add("active");
      }

      matchClockInterval = setInterval(() => {
        kb.timerSeconds++;
        renderMatchTimerDisplay();

        const maxSecs = kb.halfDuration * 60;
        if (kb.timerSeconds === maxSecs) {
          playKabaddiAudio("whistle");
          triggerKbToast(`${kb.currentHalf === 1 ? '1st Half' : '2nd Half'} Time Expired!`);
        }
      }, 1000);
    }
    saveKabaddiState();
  }

  function renderMatchTimerDisplay() {
    if (els.matchTimer) {
      const m = Math.floor(kb.timerSeconds / 60);
      const s = kb.timerSeconds % 60;
      els.matchTimer.textContent = `${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`;
    }
  }

  function advanceHalf() {
    if (kb.matchCompleted) return;
    saveToHistory();

    if (kb.isTimerRunning) toggleMatchTimer();
    resetRaidTimer();
    playKabaddiAudio("whistle");

    if (kb.currentHalf === 1) {
      kb.currentHalf = 2;
      kb.timerSeconds = 0;
      // Switch initial raiding team for 2nd half
      kb.raidingTeam = kb.raidingTeam === 1 ? 2 : 1;
      logTimelineEvent("--- 2nd Half Started ---");
      triggerKbToast("2nd Half Started!");
    } else if (kb.currentHalf === 2) {
      if (kb.score1 === kb.score2 && confirm("Scores are tied. Do you want to play Golden Raid / Extra Time?")) {
        kb.currentHalf = 3;
        kb.timerSeconds = 0;
        logTimelineEvent("--- Extra Time Kickoff ---");
        triggerKbToast("Extra Time Started!");
      } else {
        finishKabaddiMatch();
        return;
      }
    } else {
      finishKabaddiMatch();
      return;
    }

    saveKabaddiState();
    renderKabaddiDashboard();
  }

  function finishKabaddiMatch() {
    kb.matchCompleted = true;
    if (kb.isTimerRunning) toggleMatchTimer();
    resetRaidTimer();

    if (kb.score1 > kb.score2) kb.winner = kb.team1;
    else if (kb.score2 > kb.score1) kb.winner = kb.team2;
    else kb.winner = null; // Tie

    playKabaddiAudio("whistle");
    if (kb.winner) {
      logTimelineEvent(`🏁 FULL TIME - ${kb.winner} wins (${kb.score1} - ${kb.score2})!`);
      triggerKbToast(`🎉 FULL TIME - ${kb.winner} Wins!`);
    } else {
      logTimelineEvent(`🏁 FULL TIME - Match tied (${kb.score1} - ${kb.score2})!`);
      triggerKbToast(`FULL TIME - Match Tied!`);
    }

    saveKabaddiState();
    renderKabaddiDashboard();
  }

  // Undo
  function undoKabaddiEvent() {
    if (!kb.history || kb.history.length === 0) {
      triggerKbToast("No actions to undo.");
      return;
    }
    const prev = kb.history.pop();
    kb.currentHalf = prev.currentHalf;
    kb.timerSeconds = prev.timerSeconds;
    kb.raidSeconds = prev.raidSeconds;
    kb.raidingTeam = prev.raidingTeam;
    kb.emptyRaids1 = prev.emptyRaids1;
    kb.emptyRaids2 = prev.emptyRaids2;
    kb.isDoOrDie = prev.isDoOrDie;
    kb.score1 = prev.score1;
    kb.score2 = prev.score2;
    kb.activePlayers1 = prev.activePlayers1;
    kb.activePlayers2 = prev.activePlayers2;
    kb.allOuts1 = prev.allOuts1;
    kb.allOuts2 = prev.allOuts2;
    kb.superRaids1 = prev.superRaids1;
    kb.superRaids2 = prev.superRaids2;
    kb.superTackles1 = prev.superTackles1;
    kb.superTackles2 = prev.superTackles2;
    kb.matchCompleted = prev.matchCompleted;
    kb.winner = prev.winner;

    if (kb.timeline.length > 0) kb.timeline.shift();

    saveKabaddiState();
    renderKabaddiDashboard();
    triggerKbToast("Last raid event undone.");
  }

  // Render Dashboard
  function renderKabaddiDashboard() {
    if (!els.dashboardView) return;

    if (els.team1NameDisplay) els.team1NameDisplay.textContent = kb.team1;
    if (els.team2NameDisplay) els.team2NameDisplay.textContent = kb.team2;
    if (els.t1ActionsTitle) els.t1ActionsTitle.textContent = `${kb.team1} Scoring`;
    if (els.t2ActionsTitle) els.t2ActionsTitle.textContent = `${kb.team2} Scoring`;

    if (els.team1ScoreDisplay) els.team1ScoreDisplay.textContent = kb.score1;
    if (els.team2ScoreDisplay) els.team2ScoreDisplay.textContent = kb.score2;

    if (els.t1ActiveCount) els.t1ActiveCount.textContent = kb.activePlayers1;
    if (els.t2ActiveCount) els.t2ActiveCount.textContent = kb.activePlayers2;

    // Raiding Badge Indicators
    if (els.t1RaidingBadge) {
      if (!kb.matchCompleted && kb.raidingTeam === 1) els.t1RaidingBadge.classList.remove("hidden");
      else els.t1RaidingBadge.classList.add("hidden");
    }
    if (els.t2RaidingBadge) {
      if (!kb.matchCompleted && kb.raidingTeam === 2) els.t2RaidingBadge.classList.remove("hidden");
      else els.t2RaidingBadge.classList.add("hidden");
    }

    // Do or Die Badge
    updateDoOrDieStatus();
    if (els.dodBadge) {
      if (!kb.matchCompleted && kb.isDoOrDie) els.dodBadge.classList.remove("hidden");
      else els.dodBadge.classList.add("hidden");
    }

    // Render 7-Player Mat Dots
    renderPlayerMatDots(els.t1PlayersMat, kb.activePlayers1, false);
    renderPlayerMatDots(els.t2PlayersMat, kb.activePlayers2, true);

    // Half Badge
    if (els.halfBadge) {
      if (kb.matchCompleted) {
        els.halfBadge.textContent = kb.winner ? `FULL TIME • ${kb.winner} WINS` : "FULL TIME • TIE";
        els.halfBadge.style.color = "#10b981";
      } else {
        els.halfBadge.textContent = kb.currentHalf === 1 ? "1st Half" : kb.currentHalf === 2 ? "2nd Half" : "Extra Time";
        els.halfBadge.style.color = "var(--kb-primary)";
      }
    }

    renderRaidClockDisplay();
    renderMatchTimerDisplay();

    // Live Indicator
    if (els.liveIndicator) {
      if (kb.matchCompleted) els.liveIndicator.classList.add("hidden");
      else els.liveIndicator.classList.remove("hidden");
    }

    // Tournament Result button
    if (els.submitResultBtn) {
      if (kb.isTournamentMatch && kb.matchCompleted) els.submitResultBtn.classList.remove("hidden");
      else els.submitResultBtn.classList.add("hidden");
    }

    // Render Timeline Log
    if (els.timelineList) {
      if (kb.timeline.length === 0) {
        els.timelineList.innerHTML = `<p style="color: var(--text-muted); font-style: italic; font-size: 0.9rem; margin: 0;">No raid events logged yet.</p>`;
      } else {
        els.timelineList.innerHTML = kb.timeline.map(item => `
          <div class="kb-log-item">
            <div>
              <div style="font-weight: 700;">${item.text}</div>
              <div style="font-size: 0.75rem; color: var(--text-muted); margin-top: 2px;">${item.score}</div>
            </div>
            <div style="font-family: monospace; font-size: 0.75rem; color: var(--kb-primary); font-weight:700;">${item.time}</div>
          </div>
        `).join("");
      }
    }
  }

  function renderPlayerMatDots(container, activeCount, isTeam2 = false) {
    if (!container) return;
    let html = "";
    for (let i = 1; i <= 7; i++) {
      const isActive = i <= activeCount;
      const teamCls = isTeam2 ? "team2" : "";
      html += `<div class="kb-player-dot ${isActive ? `active ${teamCls}` : 'out'}" title="Player ${i}"></div>`;
    }
    container.innerHTML = html;
  }

  // 9. DASHBOARD EVENT LISTENERS
  if (els.dashboardBackBtn) {
    els.dashboardBackBtn.addEventListener("click", () => {
      if (matchClockInterval) clearInterval(matchClockInterval);
      if (raidClockInterval) clearInterval(raidClockInterval);
      if (kb.isTournamentMatch) {
        window.location.hash = "#kabaddi-tdashboard";
      } else {
        window.location.hash = "#kabaddi";
      }
    });
  }

  if (els.resetMatchBtn) {
    els.resetMatchBtn.addEventListener("click", () => {
      if (confirm("Reset current Kabaddi match? All points and raids will be erased.")) {
        if (matchClockInterval) clearInterval(matchClockInterval);
        if (raidClockInterval) clearInterval(raidClockInterval);
        initializeKabaddiMatch(kb.team1, kb.team2, kb.halfDuration, kb.raidingTeam);
      }
    });
  }

  if (els.raidStartBtn) els.raidStartBtn.addEventListener("click", startRaidTimer);
  if (els.raidResetBtn) els.raidResetBtn.addEventListener("click", resetRaidTimer);
  if (els.timerToggleBtn) els.timerToggleBtn.addEventListener("click", toggleMatchTimer);

  if (els.toggleRaiderBtn) {
    els.toggleRaiderBtn.addEventListener("click", () => {
      switchRaidingTeam();
      saveKabaddiState();
      renderKabaddiDashboard();
      triggerKbToast(`Raiding: ${kb.raidingTeam === 1 ? kb.team1 : kb.team2}`);
    });
  }

  if (els.nextHalfBtn) els.nextHalfBtn.addEventListener("click", advanceHalf);
  if (els.endMatchBtn) els.endMatchBtn.addEventListener("click", finishKabaddiMatch);
  if (els.undoBtn) els.undoBtn.addEventListener("click", undoKabaddiEvent);

  document.querySelectorAll("[data-kb-action]").forEach(btn => {
    btn.addEventListener("click", (e) => {
      const teamNum = Number(e.currentTarget.getAttribute("data-kb-team"));
      const action = e.currentTarget.getAttribute("data-kb-action");
      const pts = Number(e.currentTarget.getAttribute("data-kb-pts") || 1);
      handleKabaddiAction(teamNum, action, pts);
    });
  });

  // Submit Result for Tournament Match
  if (els.submitResultBtn) {
    els.submitResultBtn.addEventListener("click", () => {
      if (kbt.active && kbt.activeFixtureIndex >= 0) {
        const fix = kbt.fixtures[kbt.activeFixtureIndex];
        if (fix) {
          fix.scoreA = `${kb.score1} (${kb.allOuts1} All-Outs, ${kb.superRaids1} SR)`;
          fix.scoreB = `${kb.score2} (${kb.allOuts2} All-Outs, ${kb.superRaids2} SR)`;
          fix.pointsA = kb.score1;
          fix.pointsB = kb.score2;
          fix.status = "completed";
          fix.matchState = clone(kb);
          saveKabaddiState();
          triggerKbToast("Tournament match result submitted!");
          window.location.hash = "#kabaddi-tdashboard";
        }
      }
    });
  }

  // 10. TOURNAMENT ENGINE
  if (els.tsetupBackBtn) {
    els.tsetupBackBtn.addEventListener("click", () => {
      window.location.hash = "#kabaddi";
    });
  }

  if (els.tteamCount) {
    els.tteamCount.addEventListener("change", renderTournamentTeamInputs);
  }

  function renderTournamentTeamInputs() {
    if (!els.tteamInputs) return;
    const count = Number(els.tteamCount ? els.tteamCount.value : 4);
    const defaultKabaddiTeams = ["Patna Pirates", "Puneri Paltan", "Jaipur Pink Panthers", "Dabang Delhi K.C.", "Bengal Warriors", "U Mumba", "Bengaluru Bulls", "Tamil Thalaivas"];

    els.tteamInputs.innerHTML = "";
    for (let i = 0; i < count; i++) {
      const defName = defaultKabaddiTeams[i] || `Team ${i + 1}`;
      const div = document.createElement("div");
      div.innerHTML = `
        <label style="display: block; font-size: 0.8rem; color: var(--text-muted); margin-bottom: 4px; font-weight: 600;">Team ${i + 1} Name</label>
        <input type="text" class="kabaddi-tteam-name-input" value="${defName}" autocomplete="off" style="width: 100%; height: 38px; background: rgba(0,0,0,0.25); border: 1px solid rgba(255,255,255,0.1); border-radius: 6px; color: var(--ink); padding: 0 12px; font-size: 0.9rem;" />
      `;
      els.tteamInputs.appendChild(div);
    }
  }

  if (els.tcreateBtn) {
    els.tcreateBtn.addEventListener("click", () => {
      const name = els.tnameInput.value.trim() || "Pro Kabaddi League";
      const teamCount = Number(els.tteamCount.value) || 4;
      const duration = Number(els.tdurationSelect ? els.tdurationSelect.value : 20);

      const teamInputs = document.querySelectorAll(".kabaddi-tteam-name-input");
      const teamNames = [];
      const uniqueNames = new Set();

      for (let i = 0; i < teamInputs.length; i++) {
        const tName = teamInputs[i].value.trim() || `Team ${i + 1}`;
        const nameKey = tName.toLowerCase();
        if (uniqueNames.has(nameKey)) {
          triggerKbToast(`Team names must be unique. Duplicate found: "${tName}"`);
          return;
        }
        uniqueNames.add(nameKey);
        teamNames.push(tName);
      }

      kbt = clone(defaultKbtState);
      kbt.active = true;
      kbt.name = name;
      kbt.teamCount = teamCount;
      kbt.halfDuration = duration;

      kbt.teams = teamNames.map(t => ({
        name: t,
        played: 0,
        wins: 0,
        ties: 0,
        losses: 0,
        sf: 0,
        sa: 0,
        diff: 0,
        ldp: 0,
        pts: 0
      }));

      // Generate round-robin schedule
      kbt.fixtures = [];
      const list = [...teamNames];
      const rounds = teamCount - 1;
      const halfSize = teamCount / 2;

      for (let r = 0; r < rounds; r++) {
        for (let i = 0; i < halfSize; i++) {
          const home = list[i];
          const away = list[teamCount - 1 - i];
          kbt.fixtures.push({
            round: r + 1,
            teamA: home,
            teamB: away,
            scoreA: "",
            scoreB: "",
            pointsA: 0,
            pointsB: 0,
            status: "pending",
            matchState: null
          });
        }
        list.splice(1, 0, list.pop());
      }

      saveKabaddiState();
      window.location.hash = "#kabaddi-tdashboard";
    });
  }

  // Tournament Tabs
  const kbTabs = ["table", "fixtures", "edit"];
  kbTabs.forEach(tab => {
    const btn = document.querySelector(`#kb-tab-${tab}`);
    if (btn) {
      btn.addEventListener("click", () => {
        kbTabs.forEach(t => {
          const b = document.querySelector(`#kb-tab-${t}`);
          const v = document.querySelector(`#kb-${t}-view`);
          if (b) b.classList.remove("active");
          if (v) v.classList.add("hidden");
        });
        btn.classList.add("active");
        const activeView = document.querySelector(`#kb-${tab}-view`);
        if (activeView) activeView.classList.remove("hidden");

        if (tab === "table") renderPointsTable();
        else if (tab === "fixtures") renderFixtures();
        else if (tab === "edit") renderEditSetup();
      });
    }
  });

  // PKL Standings Table Calculation
  function renderPointsTable() {
    if (!kbt.active) return;

    kbt.teams.forEach(t => {
      t.played = 0; t.wins = 0; t.ties = 0; t.losses = 0; t.sf = 0; t.sa = 0; t.diff = 0; t.ldp = 0; t.pts = 0;
    });

    kbt.fixtures.forEach(f => {
      if (f.status === "completed" && f.matchState) {
        const tA = kbt.teams.find(t => t.name === f.teamA);
        const tB = kbt.teams.find(t => t.name === f.teamB);
        if (tA && tB) {
          tA.played++;
          tB.played++;
          tA.sf += f.pointsA;
          tA.sa += f.pointsB;
          tB.sf += f.pointsB;
          tB.sa += f.pointsA;

          if (f.pointsA > f.pointsB) {
            tA.wins++;
            tA.pts += 5; // PKL Win = 5 pts
            tB.losses++;
            // Losing Deficit Point (lost by <= 7 pts = +1 pt)
            if (f.pointsA - f.pointsB <= 7) { tB.ldp++; tB.pts += 1; }
          } else if (f.pointsB > f.pointsA) {
            tB.wins++;
            tB.pts += 5;
            tA.losses++;
            if (f.pointsB - f.pointsA <= 7) { tA.ldp++; tA.pts += 1; }
          } else {
            tA.ties++;
            tB.ties++;
            tA.pts += 3; // PKL Tie = 3 pts
            tB.pts += 3;
          }
        }
      }
    });

    kbt.teams.forEach(t => {
      t.diff = t.sf - t.sa;
    });

    const sorted = [...kbt.teams].sort((a, b) => {
      if (b.pts !== a.pts) return b.pts - a.pts;
      if (b.diff !== a.diff) return b.diff - a.diff;
      return b.sf - a.sf;
    });

    if (els.pointsTableBody) {
      els.pointsTableBody.innerHTML = sorted.map((t, idx) => `
        <tr style="border-bottom: 1px solid rgba(255,255,255,0.05);">
          <td style="padding: 10px 8px; font-weight:700; color: var(--kb-primary);">${idx + 1}</td>
          <td style="padding: 10px 8px; font-weight:700; color:#fff;">${t.name}</td>
          <td style="padding: 10px 8px; text-align:center;">${t.played}</td>
          <td style="padding: 10px 8px; text-align:center; color: #10b981;">${t.wins}</td>
          <td style="padding: 10px 8px; text-align:center; color: #f59e0b;">${t.ties}</td>
          <td style="padding: 10px 8px; text-align:center; color: #f87171;">${t.losses}</td>
          <td style="padding: 10px 8px; text-align:center;">${t.sf}</td>
          <td style="padding: 10px 8px; text-align:center;">${t.sa}</td>
          <td style="padding: 10px 8px; text-align:center; color: ${t.diff >= 0 ? '#10b981' : '#f87171'};">${t.diff >= 0 ? '+' : ''}${t.diff}</td>
          <td style="padding: 10px 8px; text-align:center; color: #38bdf8; font-weight:700;">${t.ldp}</td>
          <td style="padding: 10px 8px; font-weight:900; text-align:right; color: var(--kb-primary);">${t.pts}</td>
        </tr>
      `).join("");
    }
  }

  function renderFixtures() {
    if (!els.fixturesList) return;
    els.fixturesList.innerHTML = "";

    kbt.fixtures.forEach((f, idx) => {
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
          <span style="font-size: 0.75rem; color: var(--kb-primary); font-weight:700; text-transform:uppercase;">Round ${f.round}</span>
          <div style="font-weight: 700; font-size:1.05rem; margin-top:4px; color:#fff;">
            ${f.teamA} <span style="color:var(--text-muted); font-size:0.85rem; font-weight:normal; margin:0 6px;">vs</span> ${f.teamB}
          </div>
        </div>
      `;

      let rightSide = "";
      if (f.status === "completed") {
        rightSide = `
          <div style="display:flex; align-items:center; gap:16px;">
            <div style="font-family: monospace; font-size:1.4rem; font-weight:900; color:var(--kb-primary);">${f.pointsA} - ${f.pointsB}</div>
            <span style="background: rgba(16,185,129,0.15); color:#10b981; font-size:0.75rem; padding:4px 8px; border-radius:6px; font-weight:700; text-transform:uppercase;">Full Time</span>
          </div>
        `;
      } else {
        rightSide = `
          <button class="start-custom" type="button" data-kb-fixture-index="${idx}" style="margin:0; padding:8px 16px; font-size:0.8rem; border-radius:6px; font-weight:700;">🤼 Play Match</button>
        `;
      }

      card.innerHTML = leftSide + rightSide;
      els.fixturesList.appendChild(card);
    });

    document.querySelectorAll("[data-kb-fixture-index]").forEach(btn => {
      btn.addEventListener("click", (e) => {
        const idx = Number(e.currentTarget.getAttribute("data-kb-fixture-index"));
        const fix = kbt.fixtures[idx];

        if (fix) {
          kbt.activeFixtureIndex = idx;
          if (fix.matchState) {
            kb = clone(fix.matchState);
          } else {
            initializeKabaddiTournamentMatch(fix.teamA, fix.teamB);
          }
        }
      });
    });
  }

  function initializeKabaddiTournamentMatch(t1, t2) {
    kb = clone(defaultKabaddiState);
    kb.active = true;
    kb.isTournamentMatch = true;
    kb.team1 = t1;
    kb.team2 = t2;
    kb.halfDuration = kbt.halfDuration || 20;
    kb.currentHalf = 1;
    kb.raidingTeam = 1;
    kb.activePlayers1 = 7;
    kb.activePlayers2 = 7;
    kb.timerSeconds = 0;
    kb.raidSeconds = 30;
    kb.isTimerRunning = false;
    kb.isRaidRunning = false;

    saveKabaddiState();
    window.location.hash = "#kabaddi-match";
  }

  function renderEditSetup() {
    if (els.editTeamsContainer) {
      els.editTeamsContainer.innerHTML = kbt.teams.map((t, idx) => `
        <div class="setup-group">
          <label style="display: block; font-size: 0.85rem; color: var(--text-muted); margin-bottom: 4px; font-weight: 600;">Team ${idx + 1} Name</label>
          <input type="text" class="kb-edit-tteam-input" data-team-index="${idx}" value="${t.name}" autocomplete="off" style="width: 100%; height: 38px; background: rgba(0,0,0,0.25); border: 1px solid rgba(255,255,255,0.1); border-radius: 6px; color: var(--ink); padding: 0 12px; font-size: 0.9rem;" />
        </div>
      `).join("");
    }
  }

  if (els.editSaveBtn) {
    els.editSaveBtn.addEventListener("click", () => {
      const inputs = document.querySelectorAll(".kb-edit-tteam-input");
      const names = [];
      const unique = new Set();

      for (let i = 0; i < inputs.length; i++) {
        const val = inputs[i].value.trim() || `Team ${i + 1}`;
        if (unique.has(val.toLowerCase())) {
          triggerKbToast(`Duplicate name: "${val}"`);
          return;
        }
        unique.add(val.toLowerCase());
        names.push(val);
      }

      names.forEach((n, idx) => {
        const oldName = kbt.teams[idx].name;
        kbt.teams[idx].name = n;

        kbt.fixtures.forEach(f => {
          if (f.teamA === oldName) f.teamA = n;
          if (f.teamB === oldName) f.teamB = n;
        });
      });

      saveKabaddiState();
      triggerKbToast("Team names updated!");
      document.querySelector("#kb-tab-table").click();
    });
  }

  if (els.tresetBtn) {
    els.tresetBtn.addEventListener("click", () => {
      if (confirm("Are you sure you want to reset this kabaddi tournament? All match results and points will be erased.")) {
        kbt = clone(defaultKbtState);
        saveKabaddiState();
        window.location.hash = "#kabaddi";
      }
    });
  }

  if (els.tdashboardBackBtn) {
    els.tdashboardBackBtn.addEventListener("click", () => {
      kbt.active = false;
      saveKabaddiState();
      window.location.hash = "#kabaddi";
    });
  }

  function renderTournamentDashboard() {
    if (els.tdashboardName) els.tdashboardName.textContent = kbt.name;
    renderPointsTable();
  }

  // 11. INITIALIZE KABADDI ROUTINGS
  loadKabaddiState();

  if (window.location.hash.startsWith("#kabaddi")) {
    showKabaddiPage(true);
  }

  window.addEventListener("hashchange", () => {
    if (window.location.hash.startsWith("#kabaddi")) {
      showKabaddiPage(true);
    }
  });

  // Bind Home Sports Card button
  const kabaddiCardBtn = document.querySelector("[data-open-sport='kabaddi']");
  if (kabaddiCardBtn) {
    kabaddiCardBtn.addEventListener("click", () => {
      window.location.hash = "#kabaddi";
    });
  }

})();
