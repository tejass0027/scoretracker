/**
 * ==========================================================================
 * HOCKEY SCORING & TOURNAMENT ENGINE
 * ==========================================================================
 * Modular Field Hockey tracker supporting 4 Quarters, PC/PS counters,
 * Card suspensions (Green 2m, Yellow 5m/10m, Red), Shootouts, and Tournaments.
 */

(() => {
  "use strict";

  // 1. STATE & CONSTANTS
  const HOC_STORAGE_KEY = "scoretracker_hockey_match_state";
  const HOCT_STORAGE_KEY = "scoretracker_hockey_tournament_state";

  const defaultHockeyState = {
    active: false,
    isTournamentMatch: false,
    team1: "Team 1",
    team2: "Team 2",
    score1: 0,
    score2: 0,
    quarterDuration: 15, // in minutes
    tiebreaker: "shootout",
    period: "q1", // "q1", "q1-break", "q2", "halftime", "q3", "q3-break", "q4", "shootout", "completed"
    timerSeconds: 15 * 60,
    timerRunning: false,
    t1PC: 0,
    t1PS: 0,
    t2PC: 0,
    t2PS: 0,
    cards: [], // { id, team: 1|2, cardType: "green"|"yellow5"|"yellow10"|"red", secondsLeft: number, text: string }
    timeline: [], // { text, score, time }
    history: [], // stack of previous states for undo
    matchCompleted: false
  };

  const defaultHoctState = {
    active: false,
    name: "Hockey World Cup",
    teamCount: 4,
    quarterDuration: 15,
    teams: [], // { name, played, wins, draws, losses, gf, ga, gd, pts }
    fixtures: [], // { round, teamA, teamB, scoreA, scoreB, status, matchState }
    activeFixtureIndex: -1
  };

  let hoc = clone(defaultHockeyState);
  let hoct = clone(defaultHoctState);
  let timerInterval = null;

  function clone(obj) {
    return JSON.parse(JSON.stringify(obj));
  }

  // 2. DOM ELEMENTS SELECTORS
  const els = {
    // Page Wrappers
    hockeyPage: document.querySelector("#hockey-page"),
    formatView: document.querySelector("#hoc-format-view"),
    setupView: document.querySelector("#hoc-setup-view"),
    dashboardView: document.querySelector("#hoc-dashboard-view"),
    tsetupView: document.querySelector("#hoc-tsetup-view"),
    tdashboardView: document.querySelector("#hoc-tdashboard-view"),

    // Format selection buttons
    formatBackBtn: document.querySelector("#hoc-format-back-btn"),
    formatCustomBtn: document.querySelector("#hoc-format-custom-btn"),
    formatTournamentBtn: document.querySelector("#hoc-format-tournament-btn"),

    // Match Setup
    setupBackBtn: document.querySelector("#hoc-setup-back-btn"),
    team1Input: document.querySelector("#hoc-team1-input"),
    team2Input: document.querySelector("#hoc-team2-input"),
    durationSelect: document.querySelector("#hoc-duration-select"),
    tiebreakerSelect: document.querySelector("#hoc-tiebreaker-select"),
    startBtn: document.querySelector("#hoc-start-btn"),

    // Scorer Dashboard
    dashboardBackBtn: document.querySelector("#hoc-dashboard-back-btn"),
    resetMatchBtn: document.querySelector("#hoc-reset-match-btn"),
    liveIndicator: document.querySelector("#hoc-live-indicator"),
    statusBadge: document.querySelector("#hoc-status-badge"),

    // Period Pills
    pillQ1: document.querySelector("#hoc-pill-q1"),
    pillQ2: document.querySelector("#hoc-pill-q2"),
    pillHalf: document.querySelector("#hoc-pill-half"),
    pillQ3: document.querySelector("#hoc-pill-q3"),
    pillQ4: document.querySelector("#hoc-pill-q4"),
    pillSO: document.querySelector("#hoc-pill-so"),
    pillFT: document.querySelector("#hoc-pill-ft"),

    // Timer
    timerDisplay: document.querySelector("#hoc-timer-display"),
    timerToggleBtn: document.querySelector("#hoc-timer-toggle-btn"),
    timerResetBtn: document.querySelector("#hoc-timer-reset-btn"),

    // Scores & Stats
    team1NameDisplay: document.querySelector("#hoc-team1-name-display"),
    team2NameDisplay: document.querySelector("#hoc-team2-name-display"),
    team1Score: document.querySelector("#hoc-team1-score"),
    team2Score: document.querySelector("#hoc-team2-score"),
    team1CardsContainer: document.querySelector("#hoc-team1-cards-container"),
    team2CardsContainer: document.querySelector("#hoc-team2-cards-container"),
    t1PC: document.querySelector("#hoc-t1-pc"),
    t1PS: document.querySelector("#hoc-t1-ps"),
    t2PC: document.querySelector("#hoc-t2-pc"),
    t2PS: document.querySelector("#hoc-t2-ps"),

    // Action Buttons
    t1GoalBtn: document.querySelector("#hoc-t1-goal-btn"),
    t2GoalBtn: document.querySelector("#hoc-t2-goal-btn"),
    t1PCBtn: document.querySelector("#hoc-t1-pc-btn"),
    t1PSBtn: document.querySelector("#hoc-t1-ps-btn"),
    t2PCBtn: document.querySelector("#hoc-t2-pc-btn"),
    t2PSBtn: document.querySelector("#hoc-t2-ps-btn"),
    openCardsBtn: document.querySelector("#hoc-open-cards-btn"),
    undoBtn: document.querySelector("#hoc-undo-btn"),
    periodTransitionBtn: document.querySelector("#hoc-period-transition-btn"),
    submitResultBtn: document.querySelector("#hoc-submit-result-btn"),

    // Suspensions & Timeline
    suspensionsCard: document.querySelector("#hoc-suspensions-card"),
    suspensionsList: document.querySelector("#hoc-suspensions-list"),
    timelineList: document.querySelector("#hoc-timeline-list"),

    // Cards Modal
    cardsModal: document.querySelector("#hoc-cards-modal"),
    closeCardsModal: document.querySelector("#hoc-close-cards-modal"),
    cardTeamSelect: document.querySelector("#hoc-card-team-select"),

    // Tournament Setup
    tsetupBackBtn: document.querySelector("#hoc-tsetup-back-btn"),
    tnameInput: document.querySelector("#hoc-tname-input"),
    tteamCount: document.querySelector("#hoc-tteam-count"),
    tdurationSelect: document.querySelector("#hoc-tduration-select"),
    tteamInputs: document.querySelector("#hoc-tteam-inputs"),
    tcreateBtn: document.querySelector("#hoc-tcreate-btn"),

    // Tournament Dashboard
    tdashboardBackBtn: document.querySelector("#hoc-tdashboard-back-btn"),
    tresetBtn: document.querySelector("#hoc-treset-btn"),
    tdashboardName: document.querySelector("#hoc-tdashboard-name"),
    tabTable: document.querySelector("#hoc-tab-table"),
    tabFixtures: document.querySelector("#hoc-tab-fixtures"),
    tabEdit: document.querySelector("#hoc-tab-edit"),
    tableView: document.querySelector("#hoc-table-view"),
    fixturesView: document.querySelector("#hoc-fixtures-view"),
    editView: document.querySelector("#hoc-edit-view"),
    pointsTableBody: document.querySelector("#hoc-points-table-body"),
    fixturesList: document.querySelector("#hoc-fixtures-list"),
    editTeamsContainer: document.querySelector("#hoc-edit-teams-container"),
    editSaveBtn: document.querySelector("#hoc-edit-save-btn")
  };

  // 3. TOAST & AUDIO BUZZER
  function triggerHocToast(message) {
    const existing = document.querySelector(".hoc-toast-notification");
    if (existing) existing.remove();

    const toast = document.createElement("div");
    toast.className = "hoc-toast-notification";
    toast.textContent = message;
    toast.style.position = "fixed";
    toast.style.bottom = "24px";
    toast.style.left = "50%";
    toast.style.transform = "translateX(-50%)";
    toast.style.background = "#f59e0b";
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

  function playHockeyBuzzer() {
    try {
      const AudioCtx = window.AudioContext || window.webkitAudioContext;
      if (!AudioCtx) return;
      const ctx = new AudioCtx();
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      osc.type = "sawtooth";
      osc.frequency.setValueAtTime(440, ctx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(150, ctx.currentTime + 0.8);

      gain.gain.setValueAtTime(0.3, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.8);

      osc.connect(gain);
      gain.connect(ctx.destination);

      osc.start();
      osc.stop(ctx.currentTime + 0.8);
    } catch (e) {
      console.warn("Audio buzzer not available", e);
    }
  }

  // 4. STORAGE PERSISTENCE
  function loadHockeyState() {
    try {
      const stored = localStorage.getItem(HOC_STORAGE_KEY);
      const storedT = localStorage.getItem(HOCT_STORAGE_KEY);
      if (stored) hoc = { ...clone(defaultHockeyState), ...JSON.parse(stored) };
      if (storedT) hoct = { ...clone(defaultHoctState), ...JSON.parse(storedT) };
    } catch (e) {
      console.error("Failed to load hockey state", e);
    }
  }

  function saveHockeyState() {
    try {
      localStorage.setItem(HOC_STORAGE_KEY, JSON.stringify(hoc));
      localStorage.setItem(HOCT_STORAGE_KEY, JSON.stringify(hoct));
    } catch (e) {
      console.error("Failed to save hockey state", e);
    }
  }

  // 5. VIEW NAVIGATION
  function hideAllHocViews() {
    if (els.formatView) els.formatView.classList.add("hidden");
    if (els.setupView) els.setupView.classList.add("hidden");
    if (els.dashboardView) els.dashboardView.classList.add("hidden");
    if (els.tsetupView) els.tsetupView.classList.add("hidden");
    if (els.tdashboardView) els.tdashboardView.classList.add("hidden");
  }

  function showHockeyPage(fromHash = false) {
    const cp = document.querySelector("#cricket-page");
    const fp = document.querySelector("#football-page");
    const bp = document.querySelector("#basketball-page");
    const tp = document.querySelector("#tennis-page");
    const badp = document.querySelector("#badminton-page");
    const sp = document.querySelector("#sports-page");
    const fop = document.querySelector("#format-page");

    if (cp) cp.classList.add("hidden");
    if (fp) fp.classList.add("hidden");
    if (bp) bp.classList.add("hidden");
    if (tp) tp.classList.add("hidden");
    if (badp) badp.classList.add("hidden");
    if (sp) sp.classList.add("hidden");
    if (fop) fop.classList.add("hidden");

    if (els.hockeyPage) els.hockeyPage.classList.remove("hidden");
    hideAllHocViews();

    const hash = window.location.hash;
    if (hash === "#hockey") {
      if (els.formatView) els.formatView.classList.remove("hidden");
    } else if (hash === "#hockey-custom") {
      if (els.setupView) els.setupView.classList.remove("hidden");
      if (els.team1Input) els.team1Input.value = "";
      if (els.team2Input) els.team2Input.value = "";
    } else if (hash === "#hockey-match") {
      if (els.dashboardView) els.dashboardView.classList.remove("hidden");
      renderHockeyDashboard();
    } else if (hash === "#hockey-tsetup") {
      if (els.tsetupView) els.tsetupView.classList.remove("hidden");
      renderTournamentTeamInputs();
    } else if (hash === "#hockey-tdashboard") {
      if (els.tdashboardView) els.tdashboardView.classList.remove("hidden");
      renderTournamentDashboard();
    }
  }

  window.showHockeyPage = showHockeyPage;

  // 6. FORMAT CHOICE LISTENERS
  if (els.formatBackBtn) {
    els.formatBackBtn.addEventListener("click", () => {
      window.location.hash = "#sports";
    });
  }

  if (els.formatCustomBtn) {
    els.formatCustomBtn.addEventListener("click", () => {
      window.location.hash = "#hockey-custom";
    });
  }

  if (els.formatTournamentBtn) {
    els.formatTournamentBtn.addEventListener("click", () => {
      if (hoct.active) {
        window.location.hash = "#hockey-tdashboard";
      } else {
        window.location.hash = "#hockey-tsetup";
      }
    });
  }

  // 7. MATCH SETUP & START
  if (els.setupBackBtn) {
    els.setupBackBtn.addEventListener("click", () => {
      window.location.hash = "#hockey";
    });
  }

  if (els.startBtn) {
    els.startBtn.addEventListener("click", () => {
      const t1 = els.team1Input.value.trim() || "India";
      const t2 = els.team2Input.value.trim() || "Australia";
      const duration = Number(els.durationSelect ? els.durationSelect.value : 15);
      const tiebreaker = els.tiebreakerSelect ? els.tiebreakerSelect.value : "shootout";

      if (t1.toLowerCase() === t2.toLowerCase()) {
        triggerHocToast("Team names must be different.");
        return;
      }

      initializeHockeyMatch(t1, t2, duration, tiebreaker);
    });
  }

  function initializeHockeyMatch(t1, t2, duration = 15, tiebreaker = "shootout") {
    hoc = clone(defaultHockeyState);
    hoc.active = true;
    hoc.isTournamentMatch = false;
    hoc.team1 = t1;
    hoc.team2 = t2;
    hoc.quarterDuration = duration;
    hoc.timerSeconds = duration * 60;
    hoc.tiebreaker = tiebreaker;
    hoc.period = "q1";

    saveHockeyState();
    window.location.hash = "#hockey-match";
  }

  // 8. SCORING & TIMER ENGINE
  function saveToHistory() {
    hoc.history.push({
      score1: hoc.score1,
      score2: hoc.score2,
      period: hoc.period,
      timerSeconds: hoc.timerSeconds,
      t1PC: hoc.t1PC,
      t1PS: hoc.t1PS,
      t2PC: hoc.t2PC,
      t2PS: hoc.t2PS,
      cards: clone(hoc.cards),
      matchCompleted: hoc.matchCompleted
    });
    if (hoc.history.length > 25) hoc.history.shift();
  }

  function logTimelineEvent(desc) {
    const min = Math.floor(hoc.timerSeconds / 60);
    const sec = hoc.timerSeconds % 60;
    const timeStr = `${String(min).padStart(2, '0')}:${String(sec).padStart(2, '0')}`;
    const periodLabel = getPeriodLabel(hoc.period);

    hoc.timeline.unshift({
      text: desc,
      score: `${hoc.team1} ${hoc.score1} - ${hoc.score2} ${hoc.team2}`,
      time: `${periodLabel} (${timeStr})`
    });
  }

  function getPeriodLabel(period) {
    switch (period) {
      case "q1": return "Q1";
      case "q1-break": return "Q1 Break";
      case "q2": return "Q2";
      case "halftime": return "Halftime";
      case "q3": return "Q3";
      case "q3-break": return "Q3 Break";
      case "q4": return "Q4";
      case "shootout": return "Shootout";
      case "completed": return "Full Time";
      default: return period.toUpperCase();
    }
  }

  // Timer Tick
  function startHockeyTimer() {
    if (timerInterval) clearInterval(timerInterval);
    hoc.timerRunning = true;
    timerInterval = setInterval(() => {
      if (hoc.timerSeconds > 0) {
        hoc.timerSeconds--;
        tickCards();
        renderTimer();
      } else {
        clearInterval(timerInterval);
        hoc.timerRunning = false;
        playHockeyBuzzer();
        triggerHocToast(`Quarter ended!`);
        logTimelineEvent(`End of ${getPeriodLabel(hoc.period)}`);
        saveHockeyState();
        renderHockeyDashboard();
      }
    }, 1000);
    renderTimer();
  }

  function pauseHockeyTimer() {
    if (timerInterval) clearInterval(timerInterval);
    hoc.timerRunning = false;
    renderTimer();
    saveHockeyState();
  }

  function tickCards() {
    if (!hoc.cards || hoc.cards.length === 0) return;
    hoc.cards.forEach(c => {
      if (c.secondsLeft > 0) {
        c.secondsLeft--;
        if (c.secondsLeft === 0) {
          triggerHocToast(`⏳ Suspension ended for ${c.team === 1 ? hoc.team1 : hoc.team2} player!`);
          logTimelineEvent(`Suspension expired for ${c.team === 1 ? hoc.team1 : hoc.team2}`);
        }
      }
    });
  }

  function renderTimer() {
    if (!els.timerDisplay) return;
    const min = Math.floor(hoc.timerSeconds / 60);
    const sec = hoc.timerSeconds % 60;
    els.timerDisplay.textContent = `${String(min).padStart(2, '0')}:${String(sec).padStart(2, '0')}`;

    if (els.timerToggleBtn) {
      if (hoc.timerRunning) {
        els.timerToggleBtn.textContent = "⏸ Pause";
        els.timerToggleBtn.style.background = "#ef4444";
        els.timerToggleBtn.style.color = "#fff";
      } else {
        els.timerToggleBtn.textContent = "▶ Start";
        els.timerToggleBtn.style.background = "var(--hoc-primary)";
        els.timerToggleBtn.style.color = "#070a13";
      }
    }
  }

  // Goal & Event Actions
  function addGoal(teamNum) {
    if (hoc.matchCompleted) return;
    saveToHistory();
    if (teamNum === 1) hoc.score1++;
    else hoc.score2++;

    const teamName = teamNum === 1 ? hoc.team1 : hoc.team2;
    logTimelineEvent(`🏑 GOAL for ${teamName}!`);
    triggerHocToast(`Goal for ${teamName}!`);
    saveHockeyState();
    renderHockeyDashboard();
  }

  function addPC(teamNum) {
    if (hoc.matchCompleted) return;
    saveToHistory();
    if (teamNum === 1) hoc.t1PC++;
    else hoc.t2PC++;
    const teamName = teamNum === 1 ? hoc.team1 : hoc.team2;
    logTimelineEvent(`🚩 Penalty Corner awarded to ${teamName}`);
    saveHockeyState();
    renderHockeyDashboard();
  }

  function addPS(teamNum) {
    if (hoc.matchCompleted) return;
    saveToHistory();
    if (teamNum === 1) hoc.t1PS++;
    else hoc.t2PS++;
    const teamName = teamNum === 1 ? hoc.team1 : hoc.team2;
    logTimelineEvent(`🎯 Penalty Stroke awarded to ${teamName}`);
    saveHockeyState();
    renderHockeyDashboard();
  }

  // Cards & Suspensions
  function issueCard(teamNum, cardType) {
    if (hoc.matchCompleted) return;
    saveToHistory();

    let durationSec = 0;
    let desc = "";

    if (cardType === "green") {
      durationSec = 2 * 60;
      desc = "🟢 Green Card (2 min suspension)";
    } else if (cardType === "yellow5") {
      durationSec = 5 * 60;
      desc = "🟡 Yellow Card (5 min suspension)";
    } else if (cardType === "yellow10") {
      durationSec = 10 * 60;
      desc = "🟡 Yellow Card (10 min suspension)";
    } else if (cardType === "red") {
      durationSec = 99999;
      desc = "🔴 Red Card (Permanent Ejection)";
    }

    const teamName = teamNum === 1 ? hoc.team1 : hoc.team2;
    hoc.cards.push({
      id: Date.now(),
      team: teamNum,
      cardType: cardType,
      secondsLeft: durationSec,
      text: `${desc} - ${teamName}`
    });

    logTimelineEvent(`Card issued: ${desc} to ${teamName}`);
    triggerHocToast(`Card issued to ${teamName}`);

    if (els.cardsModal) els.cardsModal.classList.add("hidden");
    saveHockeyState();
    renderHockeyDashboard();
  }

  // Period Transition Logic
  function advanceQuarter() {
    if (hoc.matchCompleted) return;
    saveToHistory();
    pauseHockeyTimer();

    const p = hoc.period;
    const durSec = hoc.quarterDuration * 60;

    if (p === "q1") {
      hoc.period = "q2";
      hoc.timerSeconds = durSec;
    } else if (p === "q2") {
      hoc.period = "halftime";
      hoc.timerSeconds = 5 * 60;
    } else if (p === "halftime") {
      hoc.period = "q3";
      hoc.timerSeconds = durSec;
    } else if (p === "q3") {
      hoc.period = "q4";
      hoc.timerSeconds = durSec;
    } else if (p === "q4") {
      if (hoc.score1 === hoc.score2 && hoc.tiebreaker === "shootout") {
        hoc.period = "shootout";
        hoc.timerSeconds = 8; // 8-second 1v1 shootout clock
        triggerHocToast("Regulation ended tied! Entering Penalty Shootout.");
        logTimelineEvent("End of Q4 (Tied). Proceeding to Shootouts.");
      } else {
        hoc.period = "completed";
        hoc.matchCompleted = true;
        triggerHocToast("Match Completed!");
        logTimelineEvent("🏁 Full Time - Match Ended");
      }
    } else if (p === "shootout") {
      hoc.period = "completed";
      hoc.matchCompleted = true;
      triggerHocToast("Shootout Completed!");
      logTimelineEvent("🏁 Match Completed via Shootouts");
    }

    saveHockeyState();
    renderHockeyDashboard();
  }

  // Undo
  function undoHockeyEvent() {
    if (!hoc.history || hoc.history.length === 0) {
      triggerHocToast("No actions to undo.");
      return;
    }
    const prev = hoc.history.pop();
    hoc.score1 = prev.score1;
    hoc.score2 = prev.score2;
    hoc.period = prev.period;
    hoc.timerSeconds = prev.timerSeconds;
    hoc.t1PC = prev.t1PC;
    hoc.t1PS = prev.t1PS;
    hoc.t2PC = prev.t2PC;
    hoc.t2PS = prev.t2PS;
    hoc.cards = clone(prev.cards);
    hoc.matchCompleted = prev.matchCompleted;

    if (hoc.timeline.length > 0) hoc.timeline.shift();

    pauseHockeyTimer();
    saveHockeyState();
    renderHockeyDashboard();
    triggerHocToast("Last event undone.");
  }

  // Render Dashboard
  function renderHockeyDashboard() {
    if (!els.dashboardView) return;

    if (els.team1NameDisplay) els.team1NameDisplay.textContent = hoc.team1;
    if (els.team2NameDisplay) els.team2NameDisplay.textContent = hoc.team2;
    if (els.team1Score) els.team1Score.textContent = hoc.score1;
    if (els.team2Score) els.team2Score.textContent = hoc.score2;

    if (els.t1PC) els.t1PC.textContent = hoc.t1PC;
    if (els.t1PS) els.t1PS.textContent = hoc.t1PS;
    if (els.t2PC) els.t2PC.textContent = hoc.t2PC;
    if (els.t2PS) els.t2PS.textContent = hoc.t2PS;

    if (els.liveIndicator) {
      if (hoc.matchCompleted) els.liveIndicator.classList.add("hidden");
      else els.liveIndicator.classList.remove("hidden");
    }

    if (els.statusBadge) {
      els.statusBadge.textContent = getPeriodLabel(hoc.period);
    }

    // Period pills active highlighting
    [els.pillQ1, els.pillQ2, els.pillHalf, els.pillQ3, els.pillQ4, els.pillSO, els.pillFT].forEach(p => {
      if (p) p.classList.remove("active");
    });

    if (hoc.period === "q1" && els.pillQ1) els.pillQ1.classList.add("active");
    else if (hoc.period === "q2" && els.pillQ2) els.pillQ2.classList.add("active");
    else if (hoc.period === "halftime" && els.pillHalf) els.pillHalf.classList.add("active");
    else if (hoc.period === "q3" && els.pillQ3) els.pillQ3.classList.add("active");
    else if (hoc.period === "q4" && els.pillQ4) els.pillQ4.classList.add("active");
    else if (hoc.period === "shootout" && els.pillSO) {
      els.pillSO.style.display = "inline-block";
      els.pillSO.classList.add("active");
    } else if (hoc.period === "completed" && els.pillFT) els.pillFT.classList.add("active");

    // Action button labels
    if (els.periodTransitionBtn) {
      if (hoc.period === "q1") els.periodTransitionBtn.textContent = "Start Q2 →";
      else if (hoc.period === "q2") els.periodTransitionBtn.textContent = "Halftime Break →";
      else if (hoc.period === "halftime") els.periodTransitionBtn.textContent = "Start Q3 →";
      else if (hoc.period === "q3") els.periodTransitionBtn.textContent = "Start Q4 →";
      else if (hoc.period === "q4") els.periodTransitionBtn.textContent = hoc.score1 === hoc.score2 && hoc.tiebreaker === "shootout" ? "Start Shootouts →" : "End Match";
      else if (hoc.period === "shootout") els.periodTransitionBtn.textContent = "End Match";
      else els.periodTransitionBtn.textContent = "Match Ended";

      els.periodTransitionBtn.disabled = hoc.matchCompleted;
    }

    if (els.submitResultBtn) {
      if (hoc.isTournamentMatch && hoc.matchCompleted) els.submitResultBtn.classList.remove("hidden");
      else els.submitResultBtn.classList.add("hidden");
    }

    // Active Card Suspensions
    renderSuspensions();

    // Render Timeline Log
    if (els.timelineList) {
      if (hoc.timeline.length === 0) {
        els.timelineList.innerHTML = `<p style="color: var(--text-muted); font-style: italic; font-size: 0.9rem; margin: 0;">No events logged yet.</p>`;
      } else {
        els.timelineList.innerHTML = hoc.timeline.map(item => `
          <div class="hoc-log-item">
            <div>
              <div style="font-weight: 700;">${item.text}</div>
              <div style="font-size: 0.75rem; color: var(--text-muted); margin-top: 2px;">${item.score}</div>
            </div>
            <div style="font-family: monospace; font-size: 0.75rem; color: var(--hoc-primary); font-weight:700;">${item.time}</div>
          </div>
        `).join("");
      }
    }

    renderTimer();
  }

  function renderSuspensions() {
    if (!els.suspensionsCard || !els.suspensionsList) return;
    const activeCards = (hoc.cards || []).filter(c => c.secondsLeft > 0);

    if (activeCards.length === 0) {
      els.suspensionsCard.classList.add("hidden");
      return;
    }

    els.suspensionsCard.classList.remove("hidden");
    els.suspensionsList.innerHTML = activeCards.map(c => {
      const min = Math.floor(c.secondsLeft / 60);
      const sec = c.secondsLeft % 60;
      const timeRemaining = c.cardType === "red" ? "Ejected" : `${min}:${String(sec).padStart(2, '0')} min left`;
      return `
        <div class="hoc-suspension-item">
          <div>
            <strong>${c.text}</strong>
          </div>
          <div style="font-family: monospace; font-weight: 800; color: #eab308;">${timeRemaining}</div>
        </div>
      `;
    }).join("");
  }

  // 9. DASHBOARD EVENT LISTENERS
  if (els.dashboardBackBtn) {
    els.dashboardBackBtn.addEventListener("click", () => {
      pauseHockeyTimer();
      if (hoc.isTournamentMatch) {
        window.location.hash = "#hockey-tdashboard";
      } else {
        window.location.hash = "#hockey";
      }
    });
  }

  if (els.resetMatchBtn) {
    els.resetMatchBtn.addEventListener("click", () => {
      if (confirm("Reset current Hockey match? All logged goals and cards will be lost.")) {
        pauseHockeyTimer();
        initializeHockeyMatch(hoc.team1, hoc.team2, hoc.quarterDuration, hoc.tiebreaker);
      }
    });
  }

  if (els.timerToggleBtn) {
    els.timerToggleBtn.addEventListener("click", () => {
      if (hoc.timerRunning) pauseHockeyTimer();
      else startHockeyTimer();
    });
  }

  if (els.timerResetBtn) {
    els.timerResetBtn.addEventListener("click", () => {
      pauseHockeyTimer();
      hoc.timerSeconds = hoc.quarterDuration * 60;
      renderTimer();
      saveHockeyState();
    });
  }

  if (els.t1GoalBtn) els.t1GoalBtn.addEventListener("click", () => addGoal(1));
  if (els.t2GoalBtn) els.t2GoalBtn.addEventListener("click", () => addGoal(2));
  if (els.t1PCBtn) els.t1PCBtn.addEventListener("click", () => addPC(1));
  if (els.t1PSBtn) els.t1PSBtn.addEventListener("click", () => addPS(1));
  if (els.t2PCBtn) els.t2PCBtn.addEventListener("click", () => addPC(2));
  if (els.t2PSBtn) els.t2PSBtn.addEventListener("click", () => addPS(2));
  if (els.undoBtn) els.undoBtn.addEventListener("click", undoHockeyEvent);
  if (els.periodTransitionBtn) els.periodTransitionBtn.addEventListener("click", advanceQuarter);

  // Cards Modal Listeners
  if (els.openCardsBtn) {
    els.openCardsBtn.addEventListener("click", () => {
      if (els.cardTeamSelect) {
        els.cardTeamSelect.innerHTML = `
          <option value="1">${hoc.team1}</option>
          <option value="2">${hoc.team2}</option>
        `;
      }
      if (els.cardsModal) els.cardsModal.classList.remove("hidden");
    });
  }

  if (els.closeCardsModal) {
    els.closeCardsModal.addEventListener("click", () => {
      if (els.cardsModal) els.cardsModal.classList.add("hidden");
    });
  }

  document.querySelectorAll(".hoc-issue-card-btn").forEach(btn => {
    btn.addEventListener("click", (e) => {
      const cardType = e.currentTarget.getAttribute("data-card");
      const teamNum = Number(els.cardTeamSelect ? els.cardTeamSelect.value : 1);
      issueCard(teamNum, cardType);
    });
  });

  // Submit Result for Tournament Match
  if (els.submitResultBtn) {
    els.submitResultBtn.addEventListener("click", () => {
      if (hoct.active && hoct.activeFixtureIndex >= 0) {
        const fix = hoct.fixtures[hoct.activeFixtureIndex];
        if (fix) {
          fix.scoreA = hoc.score1;
          fix.scoreB = hoc.score2;
          fix.status = "completed";
          fix.matchState = clone(hoc);
          saveHockeyState();
          triggerHocToast("Tournament match result submitted!");
          window.location.hash = "#hockey-tdashboard";
        }
      }
    });
  }

  // 10. TOURNAMENT ENGINE
  if (els.tsetupBackBtn) {
    els.tsetupBackBtn.addEventListener("click", () => {
      window.location.hash = "#hockey";
    });
  }

  if (els.tteamCount) {
    els.tteamCount.addEventListener("change", renderTournamentTeamInputs);
  }

  function renderTournamentTeamInputs() {
    if (!els.tteamInputs) return;
    const count = Number(els.tteamCount ? els.tteamCount.value : 4);
    const defaultHockeyTeams = ["India", "Australia", "Belgium", "Netherlands", "Germany", "England", "Argentina", "Spain"];

    els.tteamInputs.innerHTML = "";
    for (let i = 0; i < count; i++) {
      const defName = defaultHockeyTeams[i] || `Team ${i + 1}`;
      const div = document.createElement("div");
      div.innerHTML = `
        <label style="display: block; font-size: 0.8rem; color: var(--text-muted); margin-bottom: 4px; font-weight: 600;">Team ${i + 1} Name</label>
        <input type="text" class="hockey-tteam-name-input" value="${defName}" autocomplete="off" style="width: 100%; height: 38px; background: rgba(0,0,0,0.25); border: 1px solid rgba(255,255,255,0.1); border-radius: 6px; color: var(--ink); padding: 0 12px; font-size: 0.9rem;" />
      `;
      els.tteamInputs.appendChild(div);
    }
  }

  if (els.tcreateBtn) {
    els.tcreateBtn.addEventListener("click", () => {
      const name = els.tnameInput.value.trim() || "Hockey Championship";
      const teamCount = Number(els.tteamCount.value) || 4;
      const duration = Number(els.tdurationSelect ? els.tdurationSelect.value : 15);

      const teamInputs = document.querySelectorAll(".hockey-tteam-name-input");
      const teamNames = [];
      const uniqueNames = new Set();

      for (let i = 0; i < teamInputs.length; i++) {
        const tName = teamInputs[i].value.trim() || `Team ${i + 1}`;
        const nameKey = tName.toLowerCase();
        if (uniqueNames.has(nameKey)) {
          triggerHocToast(`Team names must be unique. Duplicate found: "${tName}"`);
          return;
        }
        uniqueNames.add(nameKey);
        teamNames.push(tName);
      }

      hoct = clone(defaultHoctState);
      hoct.active = true;
      hoct.name = name;
      hoct.teamCount = teamCount;
      hoct.quarterDuration = duration;

      hoct.teams = teamNames.map(t => ({
        name: t,
        played: 0,
        wins: 0,
        draws: 0,
        losses: 0,
        gf: 0,
        ga: 0,
        gd: 0,
        pts: 0
      }));

      // Generate round-robin schedule
      hoct.fixtures = [];
      const list = [...teamNames];
      const rounds = teamCount - 1;
      const halfSize = teamCount / 2;

      for (let r = 0; r < rounds; r++) {
        for (let i = 0; i < halfSize; i++) {
          const home = list[i];
          const away = list[teamCount - 1 - i];
          hoct.fixtures.push({
            round: r + 1,
            teamA: home,
            teamB: away,
            scoreA: 0,
            scoreB: 0,
            status: "pending",
            matchState: null
          });
        }
        // Rotate teams (keep first fixed)
        list.splice(1, 0, list.pop());
      }

      saveHockeyState();
      window.location.hash = "#hockey-tdashboard";
    });
  }

  // Tournament Tabs
  const hocTabs = ["table", "fixtures", "edit"];
  hocTabs.forEach(tab => {
    const btn = document.querySelector(`#hoc-tab-${tab}`);
    if (btn) {
      btn.addEventListener("click", () => {
        hocTabs.forEach(t => {
          const b = document.querySelector(`#hoc-tab-${t}`);
          const v = document.querySelector(`#hoc-${t}-view`);
          if (b) b.classList.remove("active");
          if (v) v.classList.add("hidden");
        });
        btn.classList.add("active");
        const activeView = document.querySelector(`#hoc-${tab}-view`);
        if (activeView) activeView.classList.remove("hidden");

        if (tab === "table") renderPointsTable();
        else if (tab === "fixtures") renderFixtures();
        else if (tab === "edit") renderEditSetup();
      });
    }
  });

  // Table Standings Calculation
  function renderPointsTable() {
    if (!hoct.active) return;

    hoct.teams.forEach(t => {
      t.played = 0; t.wins = 0; t.draws = 0; t.losses = 0; t.gf = 0; t.ga = 0; t.gd = 0; t.pts = 0;
    });

    hoct.fixtures.forEach(f => {
      if (f.status === "completed") {
        const tA = hoct.teams.find(t => t.name === f.teamA);
        const tB = hoct.teams.find(t => t.name === f.teamB);
        if (tA && tB) {
          tA.played++;
          tB.played++;
          tA.gf += f.scoreA;
          tA.ga += f.scoreB;
          tB.gf += f.scoreB;
          tB.ga += f.scoreA;

          if (f.scoreA > f.scoreB) {
            tA.wins++;
            tA.pts += 3;
            tB.losses++;
          } else if (f.scoreB > f.scoreA) {
            tB.wins++;
            tB.pts += 3;
            tA.losses++;
          } else {
            tA.draws++;
            tB.draws++;
            tA.pts += 1;
            tB.pts += 1;
          }
        }
      }
    });

    hoct.teams.forEach(t => {
      t.gd = t.gf - t.ga;
    });

    const sorted = [...hoct.teams].sort((a, b) => {
      if (b.pts !== a.pts) return b.pts - a.pts;
      if (b.gd !== a.gd) return b.gd - a.gd;
      return b.gf - a.gf;
    });

    if (els.pointsTableBody) {
      els.pointsTableBody.innerHTML = sorted.map((t, idx) => `
        <tr style="border-bottom: 1px solid rgba(255,255,255,0.05);">
          <td style="padding: 10px 8px; font-weight:700; color: var(--hoc-primary);">${idx + 1}</td>
          <td style="padding: 10px 8px; font-weight:700; color:#fff;">${t.name}</td>
          <td style="padding: 10px 8px; text-align:center;">${t.played}</td>
          <td style="padding: 10px 8px; text-align:center; color: #10b981;">${t.wins}</td>
          <td style="padding: 10px 8px; text-align:center; color: #eab308;">${t.draws}</td>
          <td style="padding: 10px 8px; text-align:center; color: #f87171;">${t.losses}</td>
          <td style="padding: 10px 8px; text-align:center;">${t.gf}</td>
          <td style="padding: 10px 8px; text-align:center;">${t.ga}</td>
          <td style="padding: 10px 8px; text-align:center; color: ${t.gd >= 0 ? '#10b981' : '#f87171'};">${t.gd >= 0 ? '+' : ''}${t.gd}</td>
          <td style="padding: 10px 8px; font-weight:900; text-align:right; color: var(--hoc-primary);">${t.pts}</td>
        </tr>
      `).join("");
    }
  }

  function renderFixtures() {
    if (!els.fixturesList) return;
    els.fixturesList.innerHTML = "";

    hoct.fixtures.forEach((f, idx) => {
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
          <span style="font-size: 0.75rem; color: var(--hoc-primary); font-weight:700; text-transform:uppercase;">Round ${f.round}</span>
          <div style="font-weight: 700; font-size:1.05rem; margin-top:4px; color:#fff;">
            ${f.teamA} <span style="color:var(--text-muted); font-size:0.85rem; font-weight:normal; margin:0 6px;">vs</span> ${f.teamB}
          </div>
        </div>
      `;

      let rightSide = "";
      if (f.status === "completed") {
        rightSide = `
          <div style="display:flex; align-items:center; gap:16px;">
            <div style="font-family: monospace; font-size:1.5rem; font-weight:900; color:var(--hoc-primary);">${f.scoreA} - ${f.scoreB}</div>
            <span style="background: rgba(16,185,129,0.15); color:#10b981; font-size:0.75rem; padding:4px 8px; border-radius:6px; font-weight:700; text-transform:uppercase;">Played</span>
          </div>
        `;
      } else {
        rightSide = `
          <button class="start-custom" type="button" data-hoc-fixture-index="${idx}" style="margin:0; padding:8px 16px; font-size:0.8rem; border-radius:6px; font-weight:700;">⏱️ Play Match</button>
        `;
      }

      card.innerHTML = leftSide + rightSide;
      els.fixturesList.appendChild(card);
    });

    document.querySelectorAll("[data-hoc-fixture-index]").forEach(btn => {
      btn.addEventListener("click", (e) => {
        const idx = Number(e.currentTarget.getAttribute("data-hoc-fixture-index"));
        const fix = hoct.fixtures[idx];

        if (fix) {
          hoct.activeFixtureIndex = idx;
          if (fix.matchState) {
            hoc = clone(fix.matchState);
          } else {
            initializeHockeyTournamentMatch(fix.teamA, fix.teamB);
          }
        }
      });
    });
  }

  function initializeHockeyTournamentMatch(t1, t2) {
    hoc = clone(defaultHockeyState);
    hoc.active = true;
    hoc.isTournamentMatch = true;
    hoc.team1 = t1;
    hoc.team2 = t2;
    hoc.quarterDuration = hoct.quarterDuration || 15;
    hoc.timerSeconds = hoc.quarterDuration * 60;
    hoc.tiebreaker = "draw";

    saveHockeyState();
    window.location.hash = "#hockey-match";
  }

  function renderEditSetup() {
    if (els.editTeamsContainer) {
      els.editTeamsContainer.innerHTML = hoct.teams.map((t, idx) => `
        <div class="setup-group">
          <label style="display: block; font-size: 0.85rem; color: var(--text-muted); margin-bottom: 4px; font-weight: 600;">Team ${idx + 1} Name</label>
          <input type="text" class="hoc-edit-tteam-input" data-team-index="${idx}" value="${t.name}" autocomplete="off" style="width: 100%; height: 38px; background: rgba(0,0,0,0.25); border: 1px solid rgba(255,255,255,0.1); border-radius: 6px; color: var(--ink); padding: 0 12px; font-size: 0.9rem;" />
        </div>
      `).join("");
    }
  }

  if (els.editSaveBtn) {
    els.editSaveBtn.addEventListener("click", () => {
      const inputs = document.querySelectorAll(".hoc-edit-tteam-input");
      const names = [];
      const unique = new Set();

      for (let i = 0; i < inputs.length; i++) {
        const val = inputs[i].value.trim() || `Team ${i + 1}`;
        if (unique.has(val.toLowerCase())) {
          triggerHocToast(`Duplicate name: "${val}"`);
          return;
        }
        unique.add(val.toLowerCase());
        names.push(val);
      }

      names.forEach((n, idx) => {
        const oldName = hoct.teams[idx].name;
        hoct.teams[idx].name = n;

        hoct.fixtures.forEach(f => {
          if (f.teamA === oldName) f.teamA = n;
          if (f.teamB === oldName) f.teamB = n;
        });
      });

      saveHockeyState();
      triggerHocToast("Team names updated!");
      document.querySelector("#hoc-tab-table").click();
    });
  }

  if (els.tresetBtn) {
    els.tresetBtn.addEventListener("click", () => {
      if (confirm("Are you sure you want to reset this tournament? All match results and points will be erased.")) {
        hoct = clone(defaultHoctState);
        saveHockeyState();
        window.location.hash = "#hockey";
      }
    });
  }

  if (els.tdashboardBackBtn) {
    els.tdashboardBackBtn.addEventListener("click", () => {
      hoct.active = false;
      saveHockeyState();
      window.location.hash = "#hockey";
    });
  }

  function renderTournamentDashboard() {
    if (els.tdashboardName) els.tdashboardName.textContent = hoct.name;
    renderPointsTable();
  }

  // 11. INITIALIZE HOCKEY ROUTINGS
  loadHockeyState();

  if (window.location.hash.startsWith("#hockey")) {
    showHockeyPage(true);
  }

  window.addEventListener("hashchange", () => {
    if (window.location.hash.startsWith("#hockey")) {
      showHockeyPage(true);
    }
  });

  // Bind Home Sports Card button
  const hockeyCardBtn = document.querySelector("[data-open-sport='hockey']");
  if (hockeyCardBtn) {
    hockeyCardBtn.addEventListener("click", () => {
      window.location.hash = "#hockey";
    });
  }

})();
