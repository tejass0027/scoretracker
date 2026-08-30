/**
 * ==========================================================================
 * RUGBY SCORING & TOURNAMENT ENGINE
 * ==========================================================================
 * Modular Rugby tracker supporting Rugby Union (15s) and Rugby Sevens (7s),
 * T-C-P-DG breakdowns, Halves match stopwatch, Sin Bin cards, and World Rugby Tournaments.
 */

(() => {
  "use strict";

  // 1. STATE & CONSTANTS
  const RG_STORAGE_KEY = "scoretracker_rugby_match_state";
  const RGT_STORAGE_KEY = "scoretracker_rugby_tournament_state";

  const defaultRugbyState = {
    active: false,
    isTournamentMatch: false,
    team1: "Team 1",
    team2: "Team 2",
    format: "union", // union (15s) or sevens (7s)
    halfDuration: 40, // minutes
    currentHalf: 1, // 1 = 1st Half, 2 = 2nd Half, 3 = Extra Time
    timerSeconds: 0,
    isTimerRunning: false,
    score1: 0,
    score2: 0,
    tries1: 0,
    conv1: 0,
    pen1: 0,
    dg1: 0,
    tries2: 0,
    conv2: 0,
    pen2: 0,
    dg2: 0,
    cards1: [], // { type, player, timeLeft, id }
    cards2: [],
    timeline: [], // { text, score, time }
    history: [], // stack of previous states for undo
    matchCompleted: false,
    winner: null
  };

  const defaultRgtState = {
    active: false,
    name: "Six Nations Championship",
    teamCount: 4,
    format: "union",
    halfDuration: 40,
    teams: [], // { name, played, wins, draws, losses, pf, pa, diff, tbp, lbp, pts }
    fixtures: [], // { round, teamA, teamB, scoreA, scoreB, pointsA, pointsB, triesA, triesB, status, matchState }
    activeFixtureIndex: -1
  };

  let rg = clone(defaultRugbyState);
  let rgt = clone(defaultRgtState);
  let matchClockInterval = null;

  function clone(obj) {
    return JSON.parse(JSON.stringify(obj));
  }

  // 2. DOM ELEMENTS SELECTORS
  const els = {
    // Page Wrappers
    rugbyPage: document.querySelector("#rugby-page"),
    formatView: document.querySelector("#rg-format-view"),
    setupView: document.querySelector("#rg-setup-view"),
    dashboardView: document.querySelector("#rg-dashboard-view"),
    tsetupView: document.querySelector("#rg-tsetup-view"),
    tdashboardView: document.querySelector("#rg-tdashboard-view"),

    // Format selection buttons
    formatBackBtn: document.querySelector("#rg-format-back-btn"),
    formatCustomBtn: document.querySelector("#rg-format-custom-btn"),
    formatTournamentBtn: document.querySelector("#rg-format-tournament-btn"),

    // Setup
    setupBackBtn: document.querySelector("#rg-setup-back-btn"),
    team1Input: document.querySelector("#rg-team1-input"),
    team2Input: document.querySelector("#rg-team2-input"),
    formatSelect: document.querySelector("#rg-format-select"),
    durationSelect: document.querySelector("#rg-duration-select"),
    startBtn: document.querySelector("#rg-start-btn"),

    // Dashboard Header & Status
    dashboardBackBtn: document.querySelector("#rg-dashboard-back-btn"),
    resetMatchBtn: document.querySelector("#rg-reset-match-btn"),
    liveIndicator: document.querySelector("#rg-live-indicator"),
    halfBadge: document.querySelector("#rg-half-badge"),
    matchTimer: document.querySelector("#rg-match-timer"),
    timerToggleBtn: document.querySelector("#rg-timer-toggle-btn"),
    timerPlusBtn: document.querySelector("#rg-timer-plus-btn"),
    nextHalfBtn: document.querySelector("#rg-next-half-btn"),

    // Big Scoreboard Displays
    team1NameDisplay: document.querySelector("#rg-team1-name-display"),
    team2NameDisplay: document.querySelector("#rg-team2-name-display"),
    team1ScoreDisplay: document.querySelector("#rg-team1-score-display"),
    team2ScoreDisplay: document.querySelector("#rg-team2-score-display"),
    t1ActionsTitle: document.querySelector("#rg-t1-actions-title"),
    t2ActionsTitle: document.querySelector("#rg-t2-actions-title"),

    // Breakdown Stats Chips
    t1TChip: document.querySelector("#rg-t1-t-chip"),
    t1CChip: document.querySelector("#rg-t1-c-chip"),
    t1PChip: document.querySelector("#rg-t1-p-chip"),
    t1DgChip: document.querySelector("#rg-t1-dg-chip"),
    t2TChip: document.querySelector("#rg-t2-t-chip"),
    t2CChip: document.querySelector("#rg-t2-c-chip"),
    t2PChip: document.querySelector("#rg-t2-p-chip"),
    t2DgChip: document.querySelector("#rg-t2-dg-chip"),

    // Sin Bin Lists
    t1SinbinList: document.querySelector("#rg-t1-sinbin-list"),
    t2SinbinList: document.querySelector("#rg-t2-sinbin-list"),

    // Control Buttons
    undoBtn: document.querySelector("#rg-undo-btn"),
    endMatchBtn: document.querySelector("#rg-end-match-btn"),
    submitResultBtn: document.querySelector("#rg-submit-result-btn"),
    timelineList: document.querySelector("#rg-timeline-list"),

    // Tournament Setup
    tsetupBackBtn: document.querySelector("#rg-tsetup-back-btn"),
    tnameInput: document.querySelector("#rg-tname-input"),
    tteamCount: document.querySelector("#rg-tteam-count"),
    tformatSelect: document.querySelector("#rg-tformat-select"),
    tteamInputs: document.querySelector("#rg-tteam-inputs"),
    tcreateBtn: document.querySelector("#rg-tcreate-btn"),

    // Tournament Dashboard
    tdashboardBackBtn: document.querySelector("#rg-tdashboard-back-btn"),
    tresetBtn: document.querySelector("#rg-treset-btn"),
    tdashboardName: document.querySelector("#rg-tdashboard-name"),
    tabTable: document.querySelector("#rg-tab-table"),
    tabFixtures: document.querySelector("#rg-tab-fixtures"),
    tabEdit: document.querySelector("#rg-tab-edit"),
    tableView: document.querySelector("#rg-table-view"),
    fixturesView: document.querySelector("#rg-fixtures-view"),
    editView: document.querySelector("#rg-edit-view"),
    pointsTableBody: document.querySelector("#rg-points-table-body"),
    fixturesList: document.querySelector("#rg-fixtures-list"),
    editTeamsContainer: document.querySelector("#rg-edit-teams-container"),
    editSaveBtn: document.querySelector("#rg-edit-save-btn")
  };

  // 3. TOAST & AUDIO EFFECTS
  function triggerRgToast(message) {
    const existing = document.querySelector(".rg-toast-notification");
    if (existing) existing.remove();

    const toast = document.createElement("div");
    toast.className = "rg-toast-notification";
    toast.textContent = message;
    toast.style.position = "fixed";
    toast.style.bottom = "24px";
    toast.style.left = "50%";
    toast.style.transform = "translateX(-50%)";
    toast.style.background = "#10b981";
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

  function playRugbyWhistle() {
    try {
      const AudioCtx = window.AudioContext || window.webkitAudioContext;
      if (!AudioCtx) return;
      const ctx = new AudioCtx();
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      osc.type = "sine";
      osc.frequency.setValueAtTime(2400, ctx.currentTime);
      osc.frequency.setValueAtTime(2600, ctx.currentTime + 0.1);
      osc.frequency.setValueAtTime(2400, ctx.currentTime + 0.25);

      gain.gain.setValueAtTime(0.2, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.5);

      osc.connect(gain);
      gain.connect(ctx.destination);

      osc.start();
      osc.stop(ctx.currentTime + 0.5);
    } catch (e) {
      console.warn("Audio whistle not available", e);
    }
  }

  // 4. STORAGE PERSISTENCE
  function loadRugbyState() {
    try {
      const stored = localStorage.getItem(RG_STORAGE_KEY);
      const storedT = localStorage.getItem(RGT_STORAGE_KEY);
      if (stored) rg = { ...clone(defaultRugbyState), ...JSON.parse(stored) };
      if (storedT) rgt = { ...clone(defaultRgtState), ...JSON.parse(storedT) };
    } catch (e) {
      console.error("Failed to load rugby state", e);
    }
  }

  function saveRugbyState() {
    try {
      localStorage.setItem(RG_STORAGE_KEY, JSON.stringify(rg));
      localStorage.setItem(RGT_STORAGE_KEY, JSON.stringify(rgt));
    } catch (e) {
      console.error("Failed to save rugby state", e);
    }
  }

  // 5. VIEW NAVIGATION
  function hideAllRgViews() {
    if (els.formatView) els.formatView.classList.add("hidden");
    if (els.setupView) els.setupView.classList.add("hidden");
    if (els.dashboardView) els.dashboardView.classList.add("hidden");
    if (els.tsetupView) els.tsetupView.classList.add("hidden");
    if (els.tdashboardView) els.tdashboardView.classList.add("hidden");
  }

  function showRugbyPage(fromHash = false) {
    const pages = ["#cricket-page", "#football-page", "#basketball-page", "#tennis-page", "#badminton-page", "#hockey-page", "#volleyball-page", "#baseball-page", "#sports-page", "#format-page"];
    pages.forEach(p => {
      const el = document.querySelector(p);
      if (el) el.classList.add("hidden");
    });

    if (els.rugbyPage) els.rugbyPage.classList.remove("hidden");
    hideAllRgViews();

    const hash = window.location.hash;
    if (hash === "#rugby") {
      if (els.formatView) els.formatView.classList.remove("hidden");
    } else if (hash === "#rugby-custom") {
      if (els.setupView) els.setupView.classList.remove("hidden");
      if (els.team1Input) els.team1Input.value = "";
      if (els.team2Input) els.team2Input.value = "";
    } else if (hash === "#rugby-match") {
      if (els.dashboardView) els.dashboardView.classList.remove("hidden");
      renderRugbyDashboard();
    } else if (hash === "#rugby-tsetup") {
      if (els.tsetupView) els.tsetupView.classList.remove("hidden");
      renderTournamentTeamInputs();
    } else if (hash === "#rugby-tdashboard") {
      if (els.tdashboardView) els.tdashboardView.classList.remove("hidden");
      renderTournamentDashboard();
    }
  }

  window.showRugbyPage = showRugbyPage;

  // 6. FORMAT CHOICE LISTENERS
  if (els.formatBackBtn) {
    els.formatBackBtn.addEventListener("click", () => {
      window.location.hash = "#sports";
    });
  }

  if (els.formatCustomBtn) {
    els.formatCustomBtn.addEventListener("click", () => {
      window.location.hash = "#rugby-custom";
    });
  }

  if (els.formatTournamentBtn) {
    els.formatTournamentBtn.addEventListener("click", () => {
      if (rgt.active) {
        window.location.hash = "#rugby-tdashboard";
      } else {
        window.location.hash = "#rugby-tsetup";
      }
    });
  }

  // 7. MATCH SETUP & START
  if (els.setupBackBtn) {
    els.setupBackBtn.addEventListener("click", () => {
      window.location.hash = "#rugby";
    });
  }

  if (els.startBtn) {
    els.startBtn.addEventListener("click", () => {
      const t1 = els.team1Input.value.trim() || "New Zealand All Blacks";
      const t2 = els.team2Input.value.trim() || "South Africa Springboks";
      const format = els.formatSelect ? els.formatSelect.value : "union";
      const duration = Number(els.durationSelect ? els.durationSelect.value : 40);

      if (t1.toLowerCase() === t2.toLowerCase()) {
        triggerRgToast("Team names must be different.");
        return;
      }

      initializeRugbyMatch(t1, t2, format, duration);
    });
  }

  function initializeRugbyMatch(t1, t2, format = "union", duration = 40) {
    rg = clone(defaultRugbyState);
    rg.active = true;
    rg.isTournamentMatch = false;
    rg.team1 = t1;
    rg.team2 = t2;
    rg.format = format;
    rg.halfDuration = duration;
    rg.currentHalf = 1;
    rg.timerSeconds = 0;
    rg.isTimerRunning = false;

    saveRugbyState();
    window.location.hash = "#rugby-match";
  }

  // 8. SCORING & SIN BIN ENGINE
  function saveToHistory() {
    rg.history.push({
      currentHalf: rg.currentHalf,
      timerSeconds: rg.timerSeconds,
      score1: rg.score1,
      score2: rg.score2,
      tries1: rg.tries1,
      conv1: rg.conv1,
      pen1: rg.pen1,
      dg1: rg.dg1,
      tries2: rg.tries2,
      conv2: rg.conv2,
      pen2: rg.pen2,
      dg2: rg.dg2,
      cards1: clone(rg.cards1),
      cards2: clone(rg.cards2),
      matchCompleted: rg.matchCompleted,
      winner: rg.winner
    });
    if (rg.history.length > 30) rg.history.shift();
  }

  function logTimelineEvent(desc) {
    const timeStr = `${Math.floor(rg.timerSeconds / 60)}' (H${rg.currentHalf})`;
    const scoreStr = `${rg.team1} ${rg.score1} - ${rg.score2} ${rg.team2}`;

    rg.timeline.unshift({
      text: desc,
      score: scoreStr,
      time: timeStr
    });
  }

  function addScoreEvent(teamNum, type) {
    if (rg.matchCompleted) return;
    saveToHistory();

    const teamName = teamNum === 1 ? rg.team1 : rg.team2;
    let pts = 0;
    let desc = "";

    if (type === "try") {
      pts = 5;
      if (teamNum === 1) rg.tries1++; else rg.tries2++;
      desc = `🏉 TRY scored by ${teamName} (+5)`;
      triggerRgToast(`TRY for ${teamName}! (+5 pts)`);
    } else if (type === "conv") {
      pts = 2;
      if (teamNum === 1) rg.conv1++; else rg.conv2++;
      desc = `🎯 CONVERSION kicked by ${teamName} (+2)`;
      triggerRgToast(`Conversion for ${teamName}! (+2 pts)`);
    } else if (type === "pen") {
      pts = 3;
      if (teamNum === 1) rg.pen1++; else rg.pen2++;
      desc = `🥅 PENALTY GOAL kicked by ${teamName} (+3)`;
      triggerRgToast(`Penalty Goal for ${teamName}! (+3 pts)`);
    } else if (type === "dg") {
      pts = 3;
      if (teamNum === 1) rg.dg1++; else rg.dg2++;
      desc = `👟 DROP GOAL scored by ${teamName} (+3)`;
      triggerRgToast(`Drop Goal for ${teamName}! (+3 pts)`);
    }

    if (teamNum === 1) rg.score1 += pts;
    else rg.score2 += pts;

    logTimelineEvent(desc);
    saveRugbyState();
    renderRugbyDashboard();
  }

  function assignCard(teamNum, cardType) {
    if (rg.matchCompleted) return;
    saveToHistory();

    const teamName = teamNum === 1 ? rg.team1 : rg.team2;
    const playerPrompt = prompt(`Enter player name or jersey # for ${cardType.toUpperCase()} card on ${teamName}:`, "#10");
    const playerName = playerPrompt ? playerPrompt.trim() : "Player";

    // 10 mins suspension for 15s, 2 mins for 7s
    const suspensionSeconds = rg.format === "sevens" ? 120 : 600;

    const cardObj = {
      type: cardType,
      player: playerName,
      timeLeft: cardType === "yellow" ? suspensionSeconds : null,
      id: Date.now() + Math.random()
    };

    if (teamNum === 1) rg.cards1.push(cardObj);
    else rg.cards2.push(cardObj);

    playRugbyWhistle();
    const cardEmoji = cardType === "yellow" ? "🟡" : "🔴";
    const actionLabel = cardType === "yellow" ? `Yellow Card (Sin Bin ${suspensionSeconds / 60}m)` : "Red Card (Sent Off)";
    logTimelineEvent(`${cardEmoji} ${actionLabel} - ${playerName} (${teamName})`);
    triggerRgToast(`${actionLabel} for ${playerName}`);

    saveRugbyState();
    renderRugbyDashboard();
  }

  // Match Clock & Stopwatch
  function toggleTimer() {
    if (rg.matchCompleted) return;

    if (rg.isTimerRunning) {
      clearInterval(matchClockInterval);
      rg.isTimerRunning = false;
      if (els.timerToggleBtn) {
        els.timerToggleBtn.textContent = "▶ Start";
        els.timerToggleBtn.classList.remove("active");
      }
    } else {
      rg.isTimerRunning = true;
      if (els.timerToggleBtn) {
        els.timerToggleBtn.textContent = "⏸ Pause";
        els.timerToggleBtn.classList.add("active");
      }

      matchClockInterval = setInterval(() => {
        rg.timerSeconds++;

        // Decrement Yellow Card Sin Bin Timers
        decrementSinBins(rg.cards1);
        decrementSinBins(rg.cards2);

        renderTimerDisplay();
        renderSinBinBadges();

        // Check half time completion
        const maxSecs = rg.halfDuration * 60;
        if (rg.timerSeconds === maxSecs) {
          playRugbyWhistle();
          triggerRgToast(`${rg.currentHalf === 1 ? '1st Half' : '2nd Half'} Time Expired!`);
        }
      }, 1000);
    }
    saveRugbyState();
  }

  function decrementSinBins(cardsList) {
    for (let i = cardsList.length - 1; i >= 0; i--) {
      const c = cardsList[i];
      if (c.type === "yellow" && c.timeLeft !== null) {
        c.timeLeft--;
        if (c.timeLeft <= 0) {
          cardsList.splice(i, 1);
          playRugbyWhistle();
          triggerRgToast(`Sin Bin Ended: ${c.player} returns to the pitch!`);
          logTimelineEvent(`🔄 Sin Bin Over - ${c.player} returns to pitch`);
        }
      }
    }
  }

  function advanceHalf() {
    if (rg.matchCompleted) return;
    saveToHistory();

    if (rg.isTimerRunning) toggleTimer();

    playRugbyWhistle();

    if (rg.currentHalf === 1) {
      rg.currentHalf = 2;
      rg.timerSeconds = 0;
      logTimelineEvent("--- 2nd Half Kickoff ---");
      triggerRgToast("2nd Half Started!");
    } else if (rg.currentHalf === 2) {
      if (rg.score1 === rg.score2 && confirm("Scores are tied. Do you want to play Extra Time?")) {
        rg.currentHalf = 3;
        rg.timerSeconds = 0;
        logTimelineEvent("--- Extra Time Kickoff ---");
        triggerRgToast("Extra Time Started!");
      } else {
        finishRugbyMatch();
        return;
      }
    } else {
      finishRugbyMatch();
      return;
    }

    saveRugbyState();
    renderRugbyDashboard();
  }

  function finishRugbyMatch() {
    rg.matchCompleted = true;
    if (rg.isTimerRunning) toggleTimer();

    if (rg.score1 > rg.score2) rg.winner = rg.team1;
    else if (rg.score2 > rg.score1) rg.winner = rg.team2;
    else rg.winner = null; // Draw

    playRugbyWhistle();
    if (rg.winner) {
      logTimelineEvent(`🏁 FULL TIME - ${rg.winner} wins (${rg.score1} - ${rg.score2})!`);
      triggerRgToast(`🎉 FULL TIME - ${rg.winner} Wins!`);
    } else {
      logTimelineEvent(`🏁 FULL TIME - Match drawn (${rg.score1} - ${rg.score2})!`);
      triggerRgToast(`FULL TIME - Match Drawn!`);
    }

    saveRugbyState();
    renderRugbyDashboard();
  }

  // Undo
  function undoRugbyEvent() {
    if (!rg.history || rg.history.length === 0) {
      triggerRgToast("No actions to undo.");
      return;
    }
    const prev = rg.history.pop();
    rg.currentHalf = prev.currentHalf;
    rg.timerSeconds = prev.timerSeconds;
    rg.score1 = prev.score1;
    rg.score2 = prev.score2;
    rg.tries1 = prev.tries1;
    rg.conv1 = prev.conv1;
    rg.pen1 = prev.pen1;
    rg.dg1 = prev.dg1;
    rg.tries2 = prev.tries2;
    rg.conv2 = prev.conv2;
    rg.pen2 = prev.pen2;
    rg.dg2 = prev.dg2;
    rg.cards1 = clone(prev.cards1);
    rg.cards2 = clone(prev.cards2);
    rg.matchCompleted = prev.matchCompleted;
    rg.winner = prev.winner;

    if (rg.timeline.length > 0) rg.timeline.shift();

    saveRugbyState();
    renderRugbyDashboard();
    triggerRgToast("Last rugby event undone.");
  }

  // Render Dashboard
  function renderRugbyDashboard() {
    if (!els.dashboardView) return;

    if (els.team1NameDisplay) els.team1NameDisplay.textContent = rg.team1;
    if (els.team2NameDisplay) els.team2NameDisplay.textContent = rg.team2;
    if (els.t1ActionsTitle) els.t1ActionsTitle.textContent = `${rg.team1} Scoring`;
    if (els.t2ActionsTitle) els.t2ActionsTitle.textContent = `${rg.team2} Scoring`;

    if (els.team1ScoreDisplay) els.team1ScoreDisplay.textContent = rg.score1;
    if (els.team2ScoreDisplay) els.team2ScoreDisplay.textContent = rg.score2;

    // Breakdown Chips
    if (els.t1TChip) els.t1TChip.textContent = `${rg.tries1} T`;
    if (els.t1CChip) els.t1CChip.textContent = `${rg.conv1} C`;
    if (els.t1PChip) els.t1PChip.textContent = `${rg.pen1} P`;
    if (els.t1DgChip) els.t1DgChip.textContent = `${rg.dg1} DG`;

    if (els.t2TChip) els.t2TChip.textContent = `${rg.tries2} T`;
    if (els.t2CChip) els.t2CChip.textContent = `${rg.conv2} C`;
    if (els.t2PChip) els.t2PChip.textContent = `${rg.pen2} P`;
    if (els.t2DgChip) els.t2DgChip.textContent = `${rg.dg2} DG`;

    // Halves Badge
    if (els.halfBadge) {
      if (rg.matchCompleted) {
        els.halfBadge.textContent = rg.winner ? `FULL TIME • ${rg.winner} WINS` : "FULL TIME • DRAW";
        els.halfBadge.style.color = "#10b981";
      } else {
        els.halfBadge.textContent = rg.currentHalf === 1 ? "1st Half" : rg.currentHalf === 2 ? "2nd Half" : "Extra Time";
        els.halfBadge.style.color = "var(--rg-primary)";
      }
    }

    renderTimerDisplay();
    renderSinBinBadges();

    // Live Indicator
    if (els.liveIndicator) {
      if (rg.matchCompleted) els.liveIndicator.classList.add("hidden");
      else els.liveIndicator.classList.remove("hidden");
    }

    // Tournament Result button
    if (els.submitResultBtn) {
      if (rg.isTournamentMatch && rg.matchCompleted) els.submitResultBtn.classList.remove("hidden");
      else els.submitResultBtn.classList.add("hidden");
    }

    // Render Timeline Log
    if (els.timelineList) {
      if (rg.timeline.length === 0) {
        els.timelineList.innerHTML = `<p style="color: var(--text-muted); font-style: italic; font-size: 0.9rem; margin: 0;">No scoring events logged yet.</p>`;
      } else {
        els.timelineList.innerHTML = rg.timeline.map(item => `
          <div class="rg-log-item">
            <div>
              <div style="font-weight: 700;">${item.text}</div>
              <div style="font-size: 0.75rem; color: var(--text-muted); margin-top: 2px;">${item.score}</div>
            </div>
            <div style="font-family: monospace; font-size: 0.75rem; color: var(--rg-primary); font-weight:700;">${item.time}</div>
          </div>
        `).join("");
      }
    }
  }

  function renderTimerDisplay() {
    if (els.matchTimer) {
      const m = Math.floor(rg.timerSeconds / 60);
      const s = rg.timerSeconds % 60;
      els.matchTimer.textContent = `${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`;
    }
  }

  function renderSinBinBadges() {
    renderSinBinContainer(els.t1SinbinList, rg.cards1);
    renderSinBinContainer(els.t2SinbinList, rg.cards2);
  }

  function renderSinBinContainer(container, list) {
    if (!container) return;
    if (!list || list.length === 0) {
      container.innerHTML = "";
      return;
    }
    container.innerHTML = list.map(c => {
      if (c.type === "yellow") {
        const m = Math.floor(c.timeLeft / 60);
        const s = c.timeLeft % 60;
        return `<span class="rg-sinbin-badge" title="Yellow Card Suspension">🟡 ${c.player} (${String(m).padStart(2,'0')}:${String(s).padStart(2,'0')})</span>`;
      } else {
        return `<span class="rg-sinbin-badge red" title="Red Card Expulsion">🔴 ${c.player} (Out)</span>`;
      }
    }).join("");
  }

  // 9. DASHBOARD EVENT LISTENERS
  if (els.dashboardBackBtn) {
    els.dashboardBackBtn.addEventListener("click", () => {
      if (matchClockInterval) clearInterval(matchClockInterval);
      if (rg.isTournamentMatch) {
        window.location.hash = "#rugby-tdashboard";
      } else {
        window.location.hash = "#rugby";
      }
    });
  }

  if (els.resetMatchBtn) {
    els.resetMatchBtn.addEventListener("click", () => {
      if (confirm("Reset current Rugby match? All points, cards, and elapsed time will be erased.")) {
        if (matchClockInterval) clearInterval(matchClockInterval);
        initializeRugbyMatch(rg.team1, rg.team2, rg.format, rg.halfDuration);
      }
    });
  }

  if (els.timerToggleBtn) els.timerToggleBtn.addEventListener("click", toggleTimer);
  if (els.timerPlusBtn) {
    els.timerPlusBtn.addEventListener("click", () => {
      rg.timerSeconds += 60;
      renderTimerDisplay();
      triggerRgToast("+1 Minute added to clock");
    });
  }
  if (els.nextHalfBtn) els.nextHalfBtn.addEventListener("click", advanceHalf);
  if (els.endMatchBtn) els.endMatchBtn.addEventListener("click", finishRugbyMatch);
  if (els.undoBtn) els.undoBtn.addEventListener("click", undoRugbyEvent);

  document.querySelectorAll("[data-type]").forEach(btn => {
    btn.addEventListener("click", (e) => {
      const teamNum = Number(e.currentTarget.getAttribute("data-team"));
      const scoreType = e.currentTarget.getAttribute("data-type");
      addScoreEvent(teamNum, scoreType);
    });
  });

  document.querySelectorAll("[data-card]").forEach(btn => {
    btn.addEventListener("click", (e) => {
      const teamNum = Number(e.currentTarget.getAttribute("data-team"));
      const cardType = e.currentTarget.getAttribute("data-card");
      assignCard(teamNum, cardType);
    });
  });

  // Submit Result for Tournament Match
  if (els.submitResultBtn) {
    els.submitResultBtn.addEventListener("click", () => {
      if (rgt.active && rgt.activeFixtureIndex >= 0) {
        const fix = rgt.fixtures[rgt.activeFixtureIndex];
        if (fix) {
          fix.scoreA = `${rg.score1} (${rg.tries1}T, ${rg.conv1}C, ${rg.pen1}P)`;
          fix.scoreB = `${rg.score2} (${rg.tries2}T, ${rg.conv2}C, ${rg.pen2}P)`;
          fix.pointsA = rg.score1;
          fix.pointsB = rg.score2;
          fix.triesA = rg.tries1;
          fix.triesB = rg.tries2;
          fix.status = "completed";
          fix.matchState = clone(rg);
          saveRugbyState();
          triggerRgToast("Tournament match result submitted!");
          window.location.hash = "#rugby-tdashboard";
        }
      }
    });
  }

  // 10. TOURNAMENT ENGINE
  if (els.tsetupBackBtn) {
    els.tsetupBackBtn.addEventListener("click", () => {
      window.location.hash = "#rugby";
    });
  }

  if (els.tteamCount) {
    els.tteamCount.addEventListener("change", renderTournamentTeamInputs);
  }

  function renderTournamentTeamInputs() {
    if (!els.tteamInputs) return;
    const count = Number(els.tteamCount ? els.tteamCount.value : 4);
    const defaultRugbyTeams = ["New Zealand All Blacks", "South Africa Springboks", "England", "France", "Ireland", "Australia Wallabies", "Wales", "Scotland"];

    els.tteamInputs.innerHTML = "";
    for (let i = 0; i < count; i++) {
      const defName = defaultRugbyTeams[i] || `Team ${i + 1}`;
      const div = document.createElement("div");
      div.innerHTML = `
        <label style="display: block; font-size: 0.8rem; color: var(--text-muted); margin-bottom: 4px; font-weight: 600;">Team ${i + 1} Name</label>
        <input type="text" class="rugby-tteam-name-input" value="${defName}" autocomplete="off" style="width: 100%; height: 38px; background: rgba(0,0,0,0.25); border: 1px solid rgba(255,255,255,0.1); border-radius: 6px; color: var(--ink); padding: 0 12px; font-size: 0.9rem;" />
      `;
      els.tteamInputs.appendChild(div);
    }
  }

  if (els.tcreateBtn) {
    els.tcreateBtn.addEventListener("click", () => {
      const name = els.tnameInput.value.trim() || "Rugby Championship";
      const teamCount = Number(els.tteamCount.value) || 4;
      const format = els.tformatSelect ? els.tformatSelect.value : "union";
      const duration = format === "sevens" ? 7 : 40;

      const teamInputs = document.querySelectorAll(".rugby-tteam-name-input");
      const teamNames = [];
      const uniqueNames = new Set();

      for (let i = 0; i < teamInputs.length; i++) {
        const tName = teamInputs[i].value.trim() || `Team ${i + 1}`;
        const nameKey = tName.toLowerCase();
        if (uniqueNames.has(nameKey)) {
          triggerRgToast(`Team names must be unique. Duplicate found: "${tName}"`);
          return;
        }
        uniqueNames.add(nameKey);
        teamNames.push(tName);
      }

      rgt = clone(defaultRgtState);
      rgt.active = true;
      rgt.name = name;
      rgt.teamCount = teamCount;
      rgt.format = format;
      rgt.halfDuration = duration;

      rgt.teams = teamNames.map(t => ({
        name: t,
        played: 0,
        wins: 0,
        draws: 0,
        losses: 0,
        pf: 0,
        pa: 0,
        diff: 0,
        tbp: 0,
        lbp: 0,
        pts: 0
      }));

      // Generate round-robin schedule
      rgt.fixtures = [];
      const list = [...teamNames];
      const rounds = teamCount - 1;
      const halfSize = teamCount / 2;

      for (let r = 0; r < rounds; r++) {
        for (let i = 0; i < halfSize; i++) {
          const home = list[i];
          const away = list[teamCount - 1 - i];
          rgt.fixtures.push({
            round: r + 1,
            teamA: home,
            teamB: away,
            scoreA: "",
            scoreB: "",
            pointsA: 0,
            pointsB: 0,
            triesA: 0,
            triesB: 0,
            status: "pending",
            matchState: null
          });
        }
        list.splice(1, 0, list.pop());
      }

      saveRugbyState();
      window.location.hash = "#rugby-tdashboard";
    });
  }

  // Tournament Tabs
  const rgTabs = ["table", "fixtures", "edit"];
  rgTabs.forEach(tab => {
    const btn = document.querySelector(`#rg-tab-${tab}`);
    if (btn) {
      btn.addEventListener("click", () => {
        rgTabs.forEach(t => {
          const b = document.querySelector(`#rg-tab-${t}`);
          const v = document.querySelector(`#rg-${t}-view`);
          if (b) b.classList.remove("active");
          if (v) v.classList.add("hidden");
        });
        btn.classList.add("active");
        const activeView = document.querySelector(`#rg-${tab}-view`);
        if (activeView) activeView.classList.remove("hidden");

        if (tab === "table") renderPointsTable();
        else if (tab === "fixtures") renderFixtures();
        else if (tab === "edit") renderEditSetup();
      });
    }
  });

  // World Rugby Standings Table Calculation
  function renderPointsTable() {
    if (!rgt.active) return;

    rgt.teams.forEach(t => {
      t.played = 0; t.wins = 0; t.draws = 0; t.losses = 0; t.pf = 0; t.pa = 0; t.diff = 0; t.tbp = 0; t.lbp = 0; t.pts = 0;
    });

    rgt.fixtures.forEach(f => {
      if (f.status === "completed" && f.matchState) {
        const tA = rgt.teams.find(t => t.name === f.teamA);
        const tB = rgt.teams.find(t => t.name === f.teamB);
        if (tA && tB) {
          tA.played++;
          tB.played++;
          tA.pf += f.pointsA;
          tA.pa += f.pointsB;
          tB.pf += f.pointsB;
          tB.pa += f.pointsA;

          // Try Bonus Points (4+ Tries scored = +1 pt)
          if (f.triesA >= 4) { tA.tbp++; tA.pts += 1; }
          if (f.triesB >= 4) { tB.tbp++; tB.pts += 1; }

          if (f.pointsA > f.pointsB) {
            tA.wins++;
            tA.pts += 4; // Win = 4 pts
            tB.losses++;
            // Losing Bonus Points (lost by <= 7 pts = +1 pt)
            if (f.pointsA - f.pointsB <= 7) { tB.lbp++; tB.pts += 1; }
          } else if (f.pointsB > f.pointsA) {
            tB.wins++;
            tB.pts += 4;
            tA.losses++;
            if (f.pointsB - f.pointsA <= 7) { tA.lbp++; tA.pts += 1; }
          } else {
            tA.draws++;
            tB.draws++;
            tA.pts += 2; // Draw = 2 pts
            tB.pts += 2;
          }
        }
      }
    });

    rgt.teams.forEach(t => {
      t.diff = t.pf - t.pa;
    });

    const sorted = [...rgt.teams].sort((a, b) => {
      if (b.pts !== a.pts) return b.pts - a.pts;
      if (b.diff !== a.diff) return b.diff - a.diff;
      return b.pf - a.pf;
    });

    if (els.pointsTableBody) {
      els.pointsTableBody.innerHTML = sorted.map((t, idx) => `
        <tr style="border-bottom: 1px solid rgba(255,255,255,0.05);">
          <td style="padding: 10px 8px; font-weight:700; color: var(--rg-primary);">${idx + 1}</td>
          <td style="padding: 10px 8px; font-weight:700; color:#fff;">${t.name}</td>
          <td style="padding: 10px 8px; text-align:center;">${t.played}</td>
          <td style="padding: 10px 8px; text-align:center; color: #10b981;">${t.wins}</td>
          <td style="padding: 10px 8px; text-align:center; color: #f59e0b;">${t.draws}</td>
          <td style="padding: 10px 8px; text-align:center; color: #f87171;">${t.losses}</td>
          <td style="padding: 10px 8px; text-align:center;">${t.pf}</td>
          <td style="padding: 10px 8px; text-align:center;">${t.pa}</td>
          <td style="padding: 10px 8px; text-align:center; color: ${t.diff >= 0 ? '#10b981' : '#f87171'};">${t.diff >= 0 ? '+' : ''}${t.diff}</td>
          <td style="padding: 10px 8px; text-align:center; color: #38bdf8; font-weight:700;">${t.tbp}</td>
          <td style="padding: 10px 8px; text-align:center; color: #c084fc; font-weight:700;">${t.lbp}</td>
          <td style="padding: 10px 8px; font-weight:900; text-align:right; color: var(--rg-primary);">${t.pts}</td>
        </tr>
      `).join("");
    }
  }

  function renderFixtures() {
    if (!els.fixturesList) return;
    els.fixturesList.innerHTML = "";

    rgt.fixtures.forEach((f, idx) => {
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
          <span style="font-size: 0.75rem; color: var(--rg-primary); font-weight:700; text-transform:uppercase;">Round ${f.round}</span>
          <div style="font-weight: 700; font-size:1.05rem; margin-top:4px; color:#fff;">
            ${f.teamA} <span style="color:var(--text-muted); font-size:0.85rem; font-weight:normal; margin:0 6px;">vs</span> ${f.teamB}
          </div>
        </div>
      `;

      let rightSide = "";
      if (f.status === "completed") {
        rightSide = `
          <div style="display:flex; align-items:center; gap:16px;">
            <div style="font-family: monospace; font-size:1.4rem; font-weight:900; color:var(--rg-primary);">${f.pointsA} - ${f.pointsB}</div>
            <span style="background: rgba(16,185,129,0.15); color:#10b981; font-size:0.75rem; padding:4px 8px; border-radius:6px; font-weight:700; text-transform:uppercase;">Full Time</span>
          </div>
        `;
      } else {
        rightSide = `
          <button class="start-custom" type="button" data-rg-fixture-index="${idx}" style="margin:0; padding:8px 16px; font-size:0.8rem; border-radius:6px; font-weight:700;">🏉 Play Match</button>
        `;
      }

      card.innerHTML = leftSide + rightSide;
      els.fixturesList.appendChild(card);
    });

    document.querySelectorAll("[data-rg-fixture-index]").forEach(btn => {
      btn.addEventListener("click", (e) => {
        const idx = Number(e.currentTarget.getAttribute("data-rg-fixture-index"));
        const fix = rgt.fixtures[idx];

        if (fix) {
          rgt.activeFixtureIndex = idx;
          if (fix.matchState) {
            rg = clone(fix.matchState);
          } else {
            initializeRugbyTournamentMatch(fix.teamA, fix.teamB);
          }
        }
      });
    });
  }

  function initializeRugbyTournamentMatch(t1, t2) {
    rg = clone(defaultRugbyState);
    rg.active = true;
    rg.isTournamentMatch = true;
    rg.team1 = t1;
    rg.team2 = t2;
    rg.format = rgt.format || "union";
    rg.halfDuration = rgt.halfDuration || 40;
    rg.currentHalf = 1;
    rg.timerSeconds = 0;
    rg.isTimerRunning = false;

    saveRugbyState();
    window.location.hash = "#rugby-match";
  }

  function renderEditSetup() {
    if (els.editTeamsContainer) {
      els.editTeamsContainer.innerHTML = rgt.teams.map((t, idx) => `
        <div class="setup-group">
          <label style="display: block; font-size: 0.85rem; color: var(--text-muted); margin-bottom: 4px; font-weight: 600;">Team ${idx + 1} Name</label>
          <input type="text" class="rg-edit-tteam-input" data-team-index="${idx}" value="${t.name}" autocomplete="off" style="width: 100%; height: 38px; background: rgba(0,0,0,0.25); border: 1px solid rgba(255,255,255,0.1); border-radius: 6px; color: var(--ink); padding: 0 12px; font-size: 0.9rem;" />
        </div>
      `).join("");
    }
  }

  if (els.editSaveBtn) {
    els.editSaveBtn.addEventListener("click", () => {
      const inputs = document.querySelectorAll(".rg-edit-tteam-input");
      const names = [];
      const unique = new Set();

      for (let i = 0; i < inputs.length; i++) {
        const val = inputs[i].value.trim() || `Team ${i + 1}`;
        if (unique.has(val.toLowerCase())) {
          triggerRgToast(`Duplicate name: "${val}"`);
          return;
        }
        unique.add(val.toLowerCase());
        names.push(val);
      }

      names.forEach((n, idx) => {
        const oldName = rgt.teams[idx].name;
        rgt.teams[idx].name = n;

        rgt.fixtures.forEach(f => {
          if (f.teamA === oldName) f.teamA = n;
          if (f.teamB === oldName) f.teamB = n;
        });
      });

      saveRugbyState();
      triggerRgToast("Team names updated!");
      document.querySelector("#rg-tab-table").click();
    });
  }

  if (els.tresetBtn) {
    els.tresetBtn.addEventListener("click", () => {
      if (confirm("Are you sure you want to reset this rugby tournament? All match results and points will be erased.")) {
        rgt = clone(defaultRgtState);
        saveRugbyState();
        window.location.hash = "#rugby";
      }
    });
  }

  if (els.tdashboardBackBtn) {
    els.tdashboardBackBtn.addEventListener("click", () => {
      rgt.active = false;
      saveRugbyState();
      window.location.hash = "#rugby";
    });
  }

  function renderTournamentDashboard() {
    if (els.tdashboardName) els.tdashboardName.textContent = rgt.name;
    renderPointsTable();
  }

  // 11. INITIALIZE RUGBY ROUTINGS
  loadRugbyState();

  if (window.location.hash.startsWith("#rugby")) {
    showRugbyPage(true);
  }

  window.addEventListener("hashchange", () => {
    if (window.location.hash.startsWith("#rugby")) {
      showRugbyPage(true);
    }
  });

  // Bind Home Sports Card button
  const rugbyCardBtn = document.querySelector("[data-open-sport='rugby']");
  if (rugbyCardBtn) {
    rugbyCardBtn.addEventListener("click", () => {
      window.location.hash = "#rugby";
    });
  }

})();
