/**
 * ==========================================================================
 * TABLE TENNIS (PING PONG) SCORER & TOURNAMENT ENGINE
 * ==========================================================================
 * Modular Table Tennis tracker supporting official ITTF rules:
 * Best of 3/5/7 games, 11-point games with win-by-2 deuce rule,
 * 2-point service rotation (1-point in deuce), 60s tactical timeout clock,
 * Game/Match Point alerts, and ITTF League Standings (Game/Point ratios).
 */

(() => {
  "use strict";

  // 1. STATE & CONSTANTS
  const TT_STORAGE_KEY = "scoretracker_tabletennis_match_state";
  const TTT_STORAGE_KEY = "scoretracker_tabletennis_tournament_state";

  const defaultTableTennisState = {
    active: false,
    isTournamentMatch: false,
    player1: "Player 1",
    player2: "Player 2",
    format: 5, // Best of 3, 5, or 7
    targetGames: 3, // First to 2, 3, or 4
    currentGame: 1,
    score1: 0,
    score2: 0,
    gamesWon1: 0,
    gamesWon2: 0,
    gameScores: [], // ["11-9", "8-11", ...]
    firstServer: 1, // 1 or 2 (match start)
    gameFirstServer: 1, // who serves first in current game
    currentServer: 1, // 1 or 2
    servesRemaining: 2, // 1 or 2
    isGamePoint: false,
    isMatchPoint: false,
    pointLeader: null, // 1 or 2
    timeoutSeconds: 60,
    isTimeoutRunning: false,
    timeline: [], // { text, score, game }
    history: [], // stack of previous states for undo
    matchCompleted: false,
    winner: null
  };

  const defaultTttState = {
    active: false,
    name: "World Table Tennis Championship",
    teamCount: 4,
    format: 5,
    teams: [], // { name, played, wins, losses, gw, gl, gratio, pw, pl, pratio, pts }
    fixtures: [], // { round, teamA, teamB, scoreA, scoreB, gamesA, gamesB, status, matchState }
    activeFixtureIndex: -1
  };

  let tt = clone(defaultTableTennisState);
  let ttt = clone(defaultTttState);
  let timeoutInterval = null;

  function clone(obj) {
    return JSON.parse(JSON.stringify(obj));
  }

  // 2. DOM ELEMENTS SELECTORS
  const els = {
    // Page Wrappers
    tabletennisPage: document.querySelector("#tabletennis-page"),
    formatView: document.querySelector("#tt-format-view"),
    setupView: document.querySelector("#tt-setup-view"),
    dashboardView: document.querySelector("#tt-dashboard-view"),
    tsetupView: document.querySelector("#tt-tsetup-view"),
    tdashboardView: document.querySelector("#tt-tdashboard-view"),

    // Format selection buttons
    formatBackBtn: document.querySelector("#tt-format-back-btn"),
    formatCustomBtn: document.querySelector("#tt-format-custom-btn"),
    formatTournamentBtn: document.querySelector("#tt-format-tournament-btn"),

    // Setup
    setupBackBtn: document.querySelector("#tt-setup-back-btn"),
    player1Input: document.querySelector("#tt-player1-input"),
    player2Input: document.querySelector("#tt-player2-input"),
    formatSelect: document.querySelector("#tt-format-select"),
    firstServeSelect: document.querySelector("#tt-firstserve-select"),
    startBtn: document.querySelector("#tt-start-btn"),

    // Dashboard Header & Status
    dashboardBackBtn: document.querySelector("#tt-dashboard-back-btn"),
    resetMatchBtn: document.querySelector("#tt-reset-match-btn"),
    liveIndicator: document.querySelector("#tt-live-indicator"),
    gameNumberBadge: document.querySelector("#tt-game-number-badge"),
    pointBadge: document.querySelector("#tt-point-badge"),
    gameChipsList: document.querySelector("#tt-game-chips-list"),
    timeoutPanel: document.querySelector("#tt-timeout-panel"),
    timeoutClock: document.querySelector("#tt-timeout-clock"),
    timeoutStartBtn: document.querySelector("#tt-timeout-start-btn"),
    switchServerBtn: document.querySelector("#tt-switch-server-btn"),

    // Big Scoreboard Displays
    player1NameDisplay: document.querySelector("#tt-player1-name-display"),
    player2NameDisplay: document.querySelector("#tt-player2-name-display"),
    player1ScoreDisplay: document.querySelector("#tt-player1-score-display"),
    player2ScoreDisplay: document.querySelector("#tt-player2-score-display"),
    p1ServingBadge: document.querySelector("#tt-p1-serving-badge"),
    p2ServingBadge: document.querySelector("#tt-p2-serving-badge"),
    p1ServeCount: document.querySelector("#tt-p1-serve-count"),
    p2ServeCount: document.querySelector("#tt-p2-serve-count"),
    p1GamesCount: document.querySelector("#tt-p1-games-count"),
    p2GamesCount: document.querySelector("#tt-p2-games-count"),

    // Action Buttons
    p1PointBtn: document.querySelector("#tt-p1-point-btn"),
    p2PointBtn: document.querySelector("#tt-p2-point-btn"),
    p1BtnName: document.querySelector("#tt-p1-btn-name"),
    p2BtnName: document.querySelector("#tt-p2-btn-name"),

    // Control Buttons
    undoBtn: document.querySelector("#tt-undo-btn"),
    nextGameBtn: document.querySelector("#tt-next-game-btn"),
    endMatchBtn: document.querySelector("#tt-end-match-btn"),
    submitResultBtn: document.querySelector("#tt-submit-result-btn"),
    timelineList: document.querySelector("#tt-timeline-list"),

    // Tournament Setup
    tsetupBackBtn: document.querySelector("#tt-tsetup-back-btn"),
    tnameInput: document.querySelector("#tt-tname-input"),
    tteamCount: document.querySelector("#tt-tteam-count"),
    tformatSelect: document.querySelector("#tt-tformat-select"),
    tteamInputs: document.querySelector("#tt-tteam-inputs"),
    tcreateBtn: document.querySelector("#tt-tcreate-btn"),

    // Tournament Dashboard
    tdashboardBackBtn: document.querySelector("#tt-tdashboard-back-btn"),
    tresetBtn: document.querySelector("#tt-treset-btn"),
    tdashboardName: document.querySelector("#tt-tdashboard-name"),
    tabTable: document.querySelector("#tt-tab-table"),
    tabFixtures: document.querySelector("#tt-tab-fixtures"),
    tabEdit: document.querySelector("#tt-tab-edit"),
    tableView: document.querySelector("#tt-table-view"),
    fixturesView: document.querySelector("#tt-fixtures-view"),
    editView: document.querySelector("#tt-edit-view"),
    pointsTableBody: document.querySelector("#tt-points-table-body"),
    fixturesList: document.querySelector("#tt-fixtures-list"),
    editTeamsContainer: document.querySelector("#tt-edit-teams-container"),
    editSaveBtn: document.querySelector("#tt-edit-save-btn")
  };

  // 3. TOAST & AUDIO EFFECTS
  function triggerTtToast(message) {
    const existing = document.querySelector(".tt-toast-notification");
    if (existing) existing.remove();

    const toast = document.createElement("div");
    toast.className = "tt-toast-notification";
    toast.textContent = message;
    toast.style.position = "fixed";
    toast.style.bottom = "24px";
    toast.style.left = "50%";
    toast.style.transform = "translateX(-50%)";
    toast.style.background = "#06b6d4";
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

  function playTableTennisAudio(type = "hit") {
    try {
      const AudioCtx = window.AudioContext || window.webkitAudioContext;
      if (!AudioCtx) return;
      const ctx = new AudioCtx();
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      if (type === "buzzer") {
        osc.type = "sawtooth";
        osc.frequency.setValueAtTime(220, ctx.currentTime);
        osc.frequency.setValueAtTime(180, ctx.currentTime + 0.3);
        gain.gain.setValueAtTime(0.35, ctx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.8);
        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.start();
        osc.stop(ctx.currentTime + 0.8);
      } else if (type === "win") {
        osc.type = "sine";
        osc.frequency.setValueAtTime(523.25, ctx.currentTime); // C5
        osc.frequency.setValueAtTime(659.25, ctx.currentTime + 0.12); // E5
        osc.frequency.setValueAtTime(783.99, ctx.currentTime + 0.24); // G5
        osc.frequency.setValueAtTime(1046.50, ctx.currentTime + 0.36); // C6
        gain.gain.setValueAtTime(0.25, ctx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.6);
        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.start();
        osc.stop(ctx.currentTime + 0.6);
      } else {
        // Ping pong paddle hit sound
        osc.type = "triangle";
        osc.frequency.setValueAtTime(800, ctx.currentTime);
        osc.frequency.exponentialRampToValueAtTime(300, ctx.currentTime + 0.08);
        gain.gain.setValueAtTime(0.3, ctx.currentTime);
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
  function loadTableTennisState() {
    try {
      const stored = localStorage.getItem(TT_STORAGE_KEY);
      const storedT = localStorage.getItem(TTT_STORAGE_KEY);
      if (stored) tt = { ...clone(defaultTableTennisState), ...JSON.parse(stored) };
      if (storedT) ttt = { ...clone(defaultTttState), ...JSON.parse(storedT) };
    } catch (e) {
      console.error("Failed to load table tennis state", e);
    }
  }

  function saveTableTennisState() {
    try {
      localStorage.setItem(TT_STORAGE_KEY, JSON.stringify(tt));
      localStorage.setItem(TTT_STORAGE_KEY, JSON.stringify(ttt));
    } catch (e) {
      console.error("Failed to save table tennis state", e);
    }
  }

  // 5. VIEW NAVIGATION
  function hideAllTtViews() {
    if (els.formatView) els.formatView.classList.add("hidden");
    if (els.setupView) els.setupView.classList.add("hidden");
    if (els.dashboardView) els.dashboardView.classList.add("hidden");
    if (els.tsetupView) els.tsetupView.classList.add("hidden");
    if (els.tdashboardView) els.tdashboardView.classList.add("hidden");
  }

  function showTableTennisPage(fromHash = false) {
    const pages = ["#cricket-page", "#football-page", "#basketball-page", "#tennis-page", "#badminton-page", "#hockey-page", "#volleyball-page", "#baseball-page", "#rugby-page", "#kabaddi-page", "#sports-page", "#format-page"];
    pages.forEach(p => {
      const el = document.querySelector(p);
      if (el) el.classList.add("hidden");
    });

    if (els.tabletennisPage) els.tabletennisPage.classList.remove("hidden");
    hideAllTtViews();

    const hash = window.location.hash;
    if (hash === "#tabletennis") {
      if (els.formatView) els.formatView.classList.remove("hidden");
    } else if (hash === "#tabletennis-custom") {
      if (els.setupView) els.setupView.classList.remove("hidden");
      if (els.player1Input) els.player1Input.value = "";
      if (els.player2Input) els.player2Input.value = "";
    } else if (hash === "#tabletennis-match") {
      if (els.dashboardView) els.dashboardView.classList.remove("hidden");
      renderTableTennisDashboard();
    } else if (hash === "#tabletennis-tsetup") {
      if (els.tsetupView) els.tsetupView.classList.remove("hidden");
      renderTournamentTeamInputs();
    } else if (hash === "#tabletennis-tdashboard") {
      if (els.tdashboardView) els.tdashboardView.classList.remove("hidden");
      renderTournamentDashboard();
    }
  }

  window.showTableTennisPage = showTableTennisPage;

  // 6. FORMAT CHOICE LISTENERS
  if (els.formatBackBtn) {
    els.formatBackBtn.addEventListener("click", () => {
      window.location.hash = "#sports";
    });
  }

  if (els.formatCustomBtn) {
    els.formatCustomBtn.addEventListener("click", () => {
      window.location.hash = "#tabletennis-custom";
    });
  }

  if (els.formatTournamentBtn) {
    els.formatTournamentBtn.addEventListener("click", () => {
      if (ttt.active) {
        window.location.hash = "#tabletennis-tdashboard";
      } else {
        window.location.hash = "#tabletennis-tsetup";
      }
    });
  }

  // 7. MATCH SETUP & START
  if (els.setupBackBtn) {
    els.setupBackBtn.addEventListener("click", () => {
      window.location.hash = "#tabletennis";
    });
  }

  if (els.startBtn) {
    els.startBtn.addEventListener("click", () => {
      const p1 = els.player1Input.value.trim() || "Ma Long";
      const p2 = els.player2Input.value.trim() || "Fan Zhendong";
      const format = Number(els.formatSelect ? els.formatSelect.value : 5);
      const firstServe = Number(els.firstServeSelect ? els.firstServeSelect.value : 1);

      if (p1.toLowerCase() === p2.toLowerCase()) {
        triggerTtToast("Player names must be different.");
        return;
      }

      initializeTableTennisMatch(p1, p2, format, firstServe);
    });
  }

  function initializeTableTennisMatch(p1, p2, format = 5, firstServe = 1) {
    tt = clone(defaultTableTennisState);
    tt.active = true;
    tt.isTournamentMatch = false;
    tt.player1 = p1;
    tt.player2 = p2;
    tt.format = format;
    tt.targetGames = Math.ceil(format / 2); // 2 for Bo3, 3 for Bo5, 4 for Bo7
    tt.firstServer = firstServe;
    tt.gameFirstServer = firstServe;
    tt.currentServer = firstServe;
    tt.servesRemaining = 2;
    tt.currentGame = 1;
    tt.score1 = 0;
    tt.score2 = 0;
    tt.gamesWon1 = 0;
    tt.gamesWon2 = 0;
    tt.gameScores = [];

    calculateServiceAndAlerts();
    saveTableTennisState();
    window.location.hash = "#tabletennis-match";
  }

  // 8. ITTF SCORING & SERVICE ROTATION PHYSICS
  function saveToHistory() {
    tt.history.push({
      currentGame: tt.currentGame,
      score1: tt.score1,
      score2: tt.score2,
      gamesWon1: tt.gamesWon1,
      gamesWon2: tt.gamesWon2,
      gameScores: [...tt.gameScores],
      gameFirstServer: tt.gameFirstServer,
      currentServer: tt.currentServer,
      servesRemaining: tt.servesRemaining,
      isGamePoint: tt.isGamePoint,
      isMatchPoint: tt.isMatchPoint,
      pointLeader: tt.pointLeader,
      matchCompleted: tt.matchCompleted,
      winner: tt.winner
    });
    if (tt.history.length > 30) tt.history.shift();
  }

  function calculateServiceAndAlerts() {
    const totalPoints = tt.score1 + tt.score2;
    const isDeuce = tt.score1 >= 10 && tt.score2 >= 10;

    if (!isDeuce) {
      // 2 points rotation
      const turns = Math.floor(totalPoints / 2);
      tt.currentServer = (tt.gameFirstServer + turns - 1) % 2 + 1;
      tt.servesRemaining = 2 - (totalPoints % 2);
    } else {
      // 1 point rotation in deuce
      const deucePoints = totalPoints - 20;
      // Server who was serving at 10-10
      const serverAtTen = (tt.gameFirstServer + 10 - 1) % 2 + 1;
      tt.currentServer = (serverAtTen + deucePoints - 1) % 2 + 1;
      tt.servesRemaining = 1;
    }

    // Deciding game end switch reminder at 5 points
    const isDecidingGame = (tt.gamesWon1 === tt.targetGames - 1 && tt.gamesWon2 === tt.targetGames - 1);
    if (isDecidingGame && (tt.score1 === 5 || tt.score2 === 5) && totalPoints === 5) {
      triggerTtToast("Deciding Game: Players Change Ends!");
    }

    // Game Point / Match Point calculation
    tt.isGamePoint = false;
    tt.isMatchPoint = false;
    tt.pointLeader = null;

    if (!tt.matchCompleted) {
      if ((tt.score1 >= 10 || tt.score2 >= 10) && Math.abs(tt.score1 - tt.score2) >= 1) {
        const leader = tt.score1 > tt.score2 ? 1 : 2;
        const leaderGames = leader === 1 ? tt.gamesWon1 : tt.gamesWon2;

        tt.pointLeader = leader;
        if (leaderGames === tt.targetGames - 1) {
          tt.isMatchPoint = true;
        } else {
          tt.isGamePoint = true;
        }
      }
    }
  }

  function logTimelinePoint(desc) {
    const scoreStr = `G${tt.currentGame}: ${tt.player1} ${tt.score1} - ${tt.score2} ${tt.player2}`;
    tt.timeline.unshift({
      text: desc,
      score: scoreStr,
      game: `Game ${tt.currentGame}`
    });
  }

  function addPointToPlayer(playerNum) {
    if (tt.matchCompleted) return;
    saveToHistory();
    playTableTennisAudio("hit");

    const scorerName = playerNum === 1 ? tt.player1 : tt.player2;

    if (playerNum === 1) tt.score1++;
    else tt.score2++;

    logTimelinePoint(`Point scored by ${scorerName}`);

    // Check Game Over (11 points, win by 2)
    if ((tt.score1 >= 11 || tt.score2 >= 11) && Math.abs(tt.score1 - tt.score2) >= 2) {
      concludeGame();
      return;
    }

    calculateServiceAndAlerts();
    saveTableTennisState();
    renderTableTennisDashboard();
  }

  function concludeGame() {
    playTableTennisAudio("win");
    const gameWinner = tt.score1 > tt.score2 ? 1 : 2;
    const winnerName = gameWinner === 1 ? tt.player1 : tt.player2;
    const scoreStr = `${tt.score1}-${tt.score2}`;

    tt.gameScores.push(scoreStr);
    if (gameWinner === 1) tt.gamesWon1++;
    else tt.gamesWon2++;

    logTimelinePoint(`🏆 ${winnerName} wins Game ${tt.currentGame} (${scoreStr})!`);
    triggerTtToast(`${winnerName} wins Game ${tt.currentGame} (${scoreStr})!`);

    // Check Match Win
    if (tt.gamesWon1 >= tt.targetGames) {
      tt.matchCompleted = true;
      tt.winner = tt.player1;
      logTimelinePoint(`🎉 MATCH WON by ${tt.player1} (${tt.gamesWon1} - ${tt.gamesWon2})!`);
      triggerTtToast(`🎉 MATCH WON by ${tt.player1}!`);
    } else if (tt.gamesWon2 >= tt.targetGames) {
      tt.matchCompleted = true;
      tt.winner = tt.player2;
      logTimelinePoint(`🎉 MATCH WON by ${tt.player2} (${tt.gamesWon2} - ${tt.gamesWon1})!`);
      triggerTtToast(`🎉 MATCH WON by ${tt.player2}!`);
    } else {
      // Advance to next game
      tt.currentGame++;
      tt.score1 = 0;
      tt.score2 = 0;
      // Alternate first server for new game
      tt.gameFirstServer = tt.gameFirstServer === 1 ? 2 : 1;
    }

    calculateServiceAndAlerts();
    saveTableTennisState();
    renderTableTennisDashboard();
  }

  function forceAdvanceGame() {
    if (tt.matchCompleted) return;
    if (tt.score1 === 0 && tt.score2 === 0) {
      triggerTtToast("Score is currently 0-0.");
      return;
    }
    concludeGame();
  }

  function finishMatchManually() {
    tt.matchCompleted = true;
    if (tt.gamesWon1 > tt.gamesWon2) tt.winner = tt.player1;
    else if (tt.gamesWon2 > tt.gamesWon1) tt.winner = tt.player2;
    else tt.winner = null;

    playTableTennisAudio("win");
    logTimelinePoint(`🏁 Match ended manually (${tt.gamesWon1} - ${tt.gamesWon2})`);
    triggerTtToast("Match Concluded!");

    calculateServiceAndAlerts();
    saveTableTennisState();
    renderTableTennisDashboard();
  }

  // 60-Second Tactical Timeout
  function startTimeoutTimer() {
    if (tt.matchCompleted) return;

    if (els.timeoutPanel) els.timeoutPanel.classList.remove("hidden");

    if (tt.isTimeoutRunning) {
      clearInterval(timeoutInterval);
      tt.isTimeoutRunning = false;
      if (els.timeoutStartBtn) els.timeoutStartBtn.textContent = "⏱️ 60s Timeout";
    } else {
      tt.isTimeoutRunning = true;
      tt.timeoutSeconds = 60;
      if (els.timeoutStartBtn) els.timeoutStartBtn.textContent = "⏸ Pause Timeout";

      timeoutInterval = setInterval(() => {
        tt.timeoutSeconds--;
        renderTimeoutDisplay();

        if (tt.timeoutSeconds <= 0) {
          clearInterval(timeoutInterval);
          tt.isTimeoutRunning = false;
          playTableTennisAudio("buzzer");
          triggerTtToast("60s Timeout Over - Resume Play!");
          if (els.timeoutStartBtn) els.timeoutStartBtn.textContent = "⏱️ 60s Timeout";
        }
      }, 1000);
    }
  }

  function renderTimeoutDisplay() {
    if (els.timeoutClock) {
      els.timeoutClock.textContent = `${String(tt.timeoutSeconds).padStart(2, '0')}s`;
      if (tt.timeoutSeconds <= 10) els.timeoutClock.className = "tt-timeout-display warning";
      else els.timeoutClock.className = "tt-timeout-display";
    }
  }

  // Undo
  function undoTableTennisPoint() {
    if (!tt.history || tt.history.length === 0) {
      triggerTtToast("No points to undo.");
      return;
    }
    const prev = tt.history.pop();
    tt.currentGame = prev.currentGame;
    tt.score1 = prev.score1;
    tt.score2 = prev.score2;
    tt.gamesWon1 = prev.gamesWon1;
    tt.gamesWon2 = prev.gamesWon2;
    tt.gameScores = [...prev.gameScores];
    tt.gameFirstServer = prev.gameFirstServer;
    tt.currentServer = prev.currentServer;
    tt.servesRemaining = prev.servesRemaining;
    tt.isGamePoint = prev.isGamePoint;
    tt.isMatchPoint = prev.isMatchPoint;
    tt.pointLeader = prev.pointLeader;
    tt.matchCompleted = prev.matchCompleted;
    tt.winner = prev.winner;

    if (tt.timeline.length > 0) tt.timeline.shift();

    calculateServiceAndAlerts();
    saveTableTennisState();
    renderTableTennisDashboard();
    triggerTtToast("Last point undone.");
  }

  // Render Dashboard
  function renderTableTennisDashboard() {
    if (!els.dashboardView) return;

    if (els.player1NameDisplay) els.player1NameDisplay.textContent = tt.player1;
    if (els.player2NameDisplay) els.player2NameDisplay.textContent = tt.player2;
    if (els.p1BtnName) els.p1BtnName.textContent = tt.player1;
    if (els.p2BtnName) els.p2BtnName.textContent = tt.player2;

    if (els.player1ScoreDisplay) els.player1ScoreDisplay.textContent = tt.score1;
    if (els.player2ScoreDisplay) els.player2ScoreDisplay.textContent = tt.score2;
    if (els.p1GamesCount) els.p1GamesCount.textContent = tt.gamesWon1;
    if (els.p2GamesCount) els.p2GamesCount.textContent = tt.gamesWon2;

    // Service indicators
    if (els.p1ServingBadge && els.p2ServingBadge) {
      if (!tt.matchCompleted && tt.currentServer === 1) {
        els.p1ServingBadge.classList.remove("hidden");
        els.p2ServingBadge.classList.add("hidden");
        if (els.p1ServeCount) els.p1ServeCount.textContent = `${tt.servesRemaining}/2`;
      } else if (!tt.matchCompleted && tt.currentServer === 2) {
        els.p2ServingBadge.classList.remove("hidden");
        els.p1ServingBadge.classList.add("hidden");
        if (els.p2ServeCount) els.p2ServeCount.textContent = `${tt.servesRemaining}/2`;
      } else {
        els.p1ServingBadge.classList.add("hidden");
        els.p2ServingBadge.classList.add("hidden");
      }
    }

    // Game Number Badge
    if (els.gameNumberBadge) {
      if (tt.matchCompleted) {
        els.gameNumberBadge.textContent = tt.winner ? `FINAL • ${tt.winner} WINS` : "MATCH CONCLUDED";
        els.gameNumberBadge.style.color = "#10b981";
      } else {
        els.gameNumberBadge.textContent = `Game ${tt.currentGame} (Best of ${tt.format})`;
        els.gameNumberBadge.style.color = "var(--tt-primary)";
      }
    }

    // Game / Match Point Alert Badge
    if (els.pointBadge) {
      if (!tt.matchCompleted && (tt.isMatchPoint || tt.isGamePoint)) {
        els.pointBadge.classList.remove("hidden");
        const leaderName = tt.pointLeader === 1 ? tt.player1 : tt.player2;
        if (tt.isMatchPoint) {
          els.pointBadge.textContent = `🔥 MATCH POINT (${leaderName})`;
          els.pointBadge.style.borderColor = "#ef4444";
          els.pointBadge.style.color = "#f87171";
        } else {
          els.pointBadge.textContent = `⚡ GAME POINT (${leaderName})`;
          els.pointBadge.style.borderColor = "var(--tt-primary)";
          els.pointBadge.style.color = "var(--tt-primary)";
        }
      } else {
        els.pointBadge.classList.add("hidden");
      }
    }

    // Previous Game Score Chips
    if (els.gameChipsList) {
      els.gameChipsList.innerHTML = tt.gameScores.map((s, idx) => `
        <span class="tt-game-chip">G${idx + 1}: ${s}</span>
      `).join("");
    }

    // Live Indicator
    if (els.liveIndicator) {
      if (tt.matchCompleted) els.liveIndicator.classList.add("hidden");
      else els.liveIndicator.classList.remove("hidden");
    }

    // Tournament Result button
    if (els.submitResultBtn) {
      if (tt.isTournamentMatch && tt.matchCompleted) els.submitResultBtn.classList.remove("hidden");
      else els.submitResultBtn.classList.add("hidden");
    }

    // Render Timeline Log
    if (els.timelineList) {
      if (tt.timeline.length === 0) {
        els.timelineList.innerHTML = `<p style="color: var(--text-muted); font-style: italic; font-size: 0.9rem; margin: 0;">No points scored yet.</p>`;
      } else {
        els.timelineList.innerHTML = tt.timeline.map(item => `
          <div class="tt-log-item">
            <div>
              <div style="font-weight: 700;">${item.text}</div>
              <div style="font-size: 0.75rem; color: var(--text-muted); margin-top: 2px;">${item.score}</div>
            </div>
            <div style="font-family: monospace; font-size: 0.75rem; color: var(--tt-primary); font-weight:700;">${item.game}</div>
          </div>
        `).join("");
      }
    }
  }

  // 9. DASHBOARD EVENT LISTENERS
  if (els.dashboardBackBtn) {
    els.dashboardBackBtn.addEventListener("click", () => {
      if (timeoutInterval) clearInterval(timeoutInterval);
      if (tt.isTournamentMatch) {
        window.location.hash = "#tabletennis-tdashboard";
      } else {
        window.location.hash = "#tabletennis";
      }
    });
  }

  if (els.resetMatchBtn) {
    els.resetMatchBtn.addEventListener("click", () => {
      if (confirm("Reset current Table Tennis match? All points and games will be cleared.")) {
        if (timeoutInterval) clearInterval(timeoutInterval);
        initializeTableTennisMatch(tt.player1, tt.player2, tt.format, tt.firstServer);
      }
    });
  }

  if (els.p1PointBtn) els.p1PointBtn.addEventListener("click", () => addPointToPlayer(1));
  if (els.p2PointBtn) els.p2PointBtn.addEventListener("click", () => addPointToPlayer(2));

  if (els.switchServerBtn) {
    els.switchServerBtn.addEventListener("click", () => {
      tt.currentServer = tt.currentServer === 1 ? 2 : 1;
      saveTableTennisState();
      renderTableTennisDashboard();
      triggerTtToast(`Server switched: ${tt.currentServer === 1 ? tt.player1 : tt.player2}`);
    });
  }

  if (els.timeoutStartBtn) els.timeoutStartBtn.addEventListener("click", startTimeoutTimer);
  if (els.undoBtn) els.undoBtn.addEventListener("click", undoTableTennisPoint);
  if (els.nextGameBtn) els.nextGameBtn.addEventListener("click", forceAdvanceGame);
  if (els.endMatchBtn) els.endMatchBtn.addEventListener("click", finishMatchManually);

  // Submit Result for Tournament Match
  if (els.submitResultBtn) {
    els.submitResultBtn.addEventListener("click", () => {
      if (ttt.active && ttt.activeFixtureIndex >= 0) {
        const fix = ttt.fixtures[ttt.activeFixtureIndex];
        if (fix) {
          fix.scoreA = `${tt.gamesWon1} (${tt.gameScores.join(", ")})`;
          fix.scoreB = `${tt.gamesWon2}`;
          fix.gamesA = tt.gamesWon1;
          fix.gamesB = tt.gamesWon2;
          fix.status = "completed";
          fix.matchState = clone(tt);
          saveTableTennisState();
          triggerTtToast("Tournament match result submitted!");
          window.location.hash = "#tabletennis-tdashboard";
        }
      }
    });
  }

  // 10. TOURNAMENT ENGINE
  if (els.tsetupBackBtn) {
    els.tsetupBackBtn.addEventListener("click", () => {
      window.location.hash = "#tabletennis";
    });
  }

  if (els.tteamCount) {
    els.tteamCount.addEventListener("change", renderTournamentTeamInputs);
  }

  function renderTournamentTeamInputs() {
    if (!els.tteamInputs) return;
    const count = Number(els.tteamCount ? els.tteamCount.value : 4);
    const defaultPlayers = ["Ma Long", "Fan Zhendong", "Wang Chuqin", "Hugo Calderano", "Felix Lebrun", "Lin Yun-Ju", "Dimitrij Ovtcharov", "Tomokazu Harimoto"];

    els.tteamInputs.innerHTML = "";
    for (let i = 0; i < count; i++) {
      const defName = defaultPlayers[i] || `Player ${i + 1}`;
      const div = document.createElement("div");
      div.innerHTML = `
        <label style="display: block; font-size: 0.8rem; color: var(--text-muted); margin-bottom: 4px; font-weight: 600;">Player ${i + 1} Name</label>
        <input type="text" class="tt-tteam-name-input" value="${defName}" autocomplete="off" style="width: 100%; height: 38px; background: rgba(0,0,0,0.25); border: 1px solid rgba(255,255,255,0.1); border-radius: 6px; color: var(--ink); padding: 0 12px; font-size: 0.9rem;" />
      `;
      els.tteamInputs.appendChild(div);
    }
  }

  if (els.tcreateBtn) {
    els.tcreateBtn.addEventListener("click", () => {
      const name = els.tnameInput.value.trim() || "ITTF Table Tennis Championship";
      const teamCount = Number(els.tteamCount.value) || 4;
      const format = Number(els.tformatSelect ? els.tformatSelect.value : 5);

      const teamInputs = document.querySelectorAll(".tt-tteam-name-input");
      const teamNames = [];
      const uniqueNames = new Set();

      for (let i = 0; i < teamInputs.length; i++) {
        const tName = teamInputs[i].value.trim() || `Player ${i + 1}`;
        const nameKey = tName.toLowerCase();
        if (uniqueNames.has(nameKey)) {
          triggerTtToast(`Player names must be unique. Duplicate found: "${tName}"`);
          return;
        }
        uniqueNames.add(nameKey);
        teamNames.push(tName);
      }

      ttt = clone(defaultTttState);
      ttt.active = true;
      ttt.name = name;
      ttt.teamCount = teamCount;
      ttt.format = format;

      ttt.teams = teamNames.map(t => ({
        name: t,
        played: 0,
        wins: 0,
        losses: 0,
        gw: 0,
        gl: 0,
        gratio: "0.000",
        pw: 0,
        pl: 0,
        pratio: "0.000",
        pts: 0
      }));

      // Generate round-robin schedule
      ttt.fixtures = [];
      const list = [...teamNames];
      const rounds = teamCount - 1;
      const halfSize = teamCount / 2;

      for (let r = 0; r < rounds; r++) {
        for (let i = 0; i < halfSize; i++) {
          const home = list[i];
          const away = list[teamCount - 1 - i];
          ttt.fixtures.push({
            round: r + 1,
            teamA: home,
            teamB: away,
            scoreA: "",
            scoreB: "",
            gamesA: 0,
            gamesB: 0,
            status: "pending",
            matchState: null
          });
        }
        list.splice(1, 0, list.pop());
      }

      saveTableTennisState();
      window.location.hash = "#tabletennis-tdashboard";
    });
  }

  // Tournament Tabs
  const ttTabs = ["table", "fixtures", "edit"];
  ttTabs.forEach(tab => {
    const btn = document.querySelector(`#tt-tab-${tab}`);
    if (btn) {
      btn.addEventListener("click", () => {
        ttTabs.forEach(t => {
          const b = document.querySelector(`#tt-tab-${t}`);
          const v = document.querySelector(`#tt-${t}-view`);
          if (b) b.classList.remove("active");
          if (v) v.classList.add("hidden");
        });
        btn.classList.add("active");
        const activeView = document.querySelector(`#tt-${tab}-view`);
        if (activeView) activeView.classList.remove("hidden");

        if (tab === "table") renderPointsTable();
        else if (tab === "fixtures") renderFixtures();
        else if (tab === "edit") renderEditSetup();
      });
    }
  });

  // ITTF Standings Table Calculation
  function renderPointsTable() {
    if (!ttt.active) return;

    ttt.teams.forEach(t => {
      t.played = 0; t.wins = 0; t.losses = 0; t.gw = 0; t.gl = 0; t.pw = 0; t.pl = 0; t.pts = 0;
    });

    ttt.fixtures.forEach(f => {
      if (f.status === "completed" && f.matchState) {
        const tA = ttt.teams.find(t => t.name === f.teamA);
        const tB = ttt.teams.find(t => t.name === f.teamB);
        if (tA && tB) {
          tA.played++;
          tB.played++;
          tA.gw += f.gamesA;
          tA.gl += f.gamesB;
          tB.gw += f.gamesB;
          tB.gl += f.gamesA;

          // Points won/lost in game scores
          if (f.matchState.gameScores) {
            f.matchState.gameScores.forEach(gs => {
              const parts = gs.split("-").map(Number);
              if (parts.length === 2 && !isNaN(parts[0]) && !isNaN(parts[1])) {
                tA.pw += parts[0];
                tA.pl += parts[1];
                tB.pw += parts[1];
                tB.pl += parts[0];
              }
            });
          }

          if (f.gamesA > f.gamesB) {
            tA.wins++;
            tA.pts += 2; // ITTF Win = 2 pts
            tB.losses++;
            tB.pts += 1; // ITTF Loss = 1 pt
          } else if (f.gamesB > f.gamesA) {
            tB.wins++;
            tB.pts += 2;
            tA.losses++;
            tA.pts += 1;
          }
        }
      }
    });

    ttt.teams.forEach(t => {
      t.gratio = t.gl === 0 ? (t.gw > 0 ? "MAX" : "0.000") : (t.gw / t.gl).toFixed(3);
      t.pratio = t.pl === 0 ? (t.pw > 0 ? "MAX" : "0.000") : (t.pw / t.pl).toFixed(3);
    });

    const sorted = [...ttt.teams].sort((a, b) => {
      if (b.pts !== a.pts) return b.pts - a.pts;
      const grA = a.gratio === "MAX" ? 9999 : Number(a.gratio);
      const grB = b.gratio === "MAX" ? 9999 : Number(b.gratio);
      if (grB !== grA) return grB - grA;
      const prA = a.pratio === "MAX" ? 9999 : Number(a.pratio);
      const prB = b.pratio === "MAX" ? 9999 : Number(b.pratio);
      return prB - prA;
    });

    if (els.pointsTableBody) {
      els.pointsTableBody.innerHTML = sorted.map((t, idx) => `
        <tr style="border-bottom: 1px solid rgba(255,255,255,0.05);">
          <td style="padding: 10px 8px; font-weight:700; color: var(--tt-primary);">${idx + 1}</td>
          <td style="padding: 10px 8px; font-weight:700; color:#fff;">${t.name}</td>
          <td style="padding: 10px 8px; text-align:center;">${t.played}</td>
          <td style="padding: 10px 8px; text-align:center; color: #10b981;">${t.wins}</td>
          <td style="padding: 10px 8px; text-align:center; color: #f87171;">${t.losses}</td>
          <td style="padding: 10px 8px; text-align:center;">${t.gw} - ${t.gl}</td>
          <td style="padding: 10px 8px; text-align:center; font-family:monospace; color: #38bdf8;">${t.gratio}</td>
          <td style="padding: 10px 8px; text-align:center;">${t.pw} - ${t.pl}</td>
          <td style="padding: 10px 8px; text-align:center; font-family:monospace; color: #f59e0b;">${t.pratio}</td>
          <td style="padding: 10px 8px; font-weight:900; text-align:right; color: var(--tt-primary);">${t.pts}</td>
        </tr>
      `).join("");
    }
  }

  function renderFixtures() {
    if (!els.fixturesList) return;
    els.fixturesList.innerHTML = "";

    ttt.fixtures.forEach((f, idx) => {
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
          <span style="font-size: 0.75rem; color: var(--tt-primary); font-weight:700; text-transform:uppercase;">Round ${f.round}</span>
          <div style="font-weight: 700; font-size:1.05rem; margin-top:4px; color:#fff;">
            ${f.teamA} <span style="color:var(--text-muted); font-size:0.85rem; font-weight:normal; margin:0 6px;">vs</span> ${f.teamB}
          </div>
        </div>
      `;

      let rightSide = "";
      if (f.status === "completed") {
        rightSide = `
          <div style="display:flex; align-items:center; gap:16px;">
            <div style="font-family: monospace; font-size:1.4rem; font-weight:900; color:var(--tt-primary);">${f.gamesA} - ${f.gamesB}</div>
            <span style="background: rgba(16,185,129,0.15); color:#10b981; font-size:0.75rem; padding:4px 8px; border-radius:6px; font-weight:700; text-transform:uppercase;">Full Time</span>
          </div>
        `;
      } else {
        rightSide = `
          <button class="start-custom" type="button" data-tt-fixture-index="${idx}" style="margin:0; padding:8px 16px; font-size:0.8rem; border-radius:6px; font-weight:700;">🏓 Play Match</button>
        `;
      }

      card.innerHTML = leftSide + rightSide;
      els.fixturesList.appendChild(card);
    });

    document.querySelectorAll("[data-tt-fixture-index]").forEach(btn => {
      btn.addEventListener("click", (e) => {
        const idx = Number(e.currentTarget.getAttribute("data-tt-fixture-index"));
        const fix = ttt.fixtures[idx];

        if (fix) {
          ttt.activeFixtureIndex = idx;
          if (fix.matchState) {
            tt = clone(fix.matchState);
          } else {
            initializeTableTennisTournamentMatch(fix.teamA, fix.teamB);
          }
        }
      });
    });
  }

  function initializeTableTennisTournamentMatch(p1, p2) {
    tt = clone(defaultTableTennisState);
    tt.active = true;
    tt.isTournamentMatch = true;
    tt.player1 = p1;
    tt.player2 = p2;
    tt.format = ttt.format || 5;
    tt.targetGames = Math.ceil(tt.format / 2);
    tt.firstServer = 1;
    tt.gameFirstServer = 1;
    tt.currentServer = 1;
    tt.servesRemaining = 2;
    tt.currentGame = 1;
    tt.score1 = 0;
    tt.score2 = 0;
    tt.gamesWon1 = 0;
    tt.gamesWon2 = 0;
    tt.gameScores = [];

    calculateServiceAndAlerts();
    saveTableTennisState();
    window.location.hash = "#tabletennis-match";
  }

  function renderEditSetup() {
    if (els.editTeamsContainer) {
      els.editTeamsContainer.innerHTML = ttt.teams.map((t, idx) => `
        <div class="setup-group">
          <label style="display: block; font-size: 0.85rem; color: var(--text-muted); margin-bottom: 4px; font-weight: 600;">Player ${idx + 1} Name</label>
          <input type="text" class="tt-edit-tteam-input" data-team-index="${idx}" value="${t.name}" autocomplete="off" style="width: 100%; height: 38px; background: rgba(0,0,0,0.25); border: 1px solid rgba(255,255,255,0.1); border-radius: 6px; color: var(--ink); padding: 0 12px; font-size: 0.9rem;" />
        </div>
      `).join("");
    }
  }

  if (els.editSaveBtn) {
    els.editSaveBtn.addEventListener("click", () => {
      const inputs = document.querySelectorAll(".tt-edit-tteam-input");
      const names = [];
      const unique = new Set();

      for (let i = 0; i < inputs.length; i++) {
        const val = inputs[i].value.trim() || `Player ${i + 1}`;
        if (unique.has(val.toLowerCase())) {
          triggerTtToast(`Duplicate name: "${val}"`);
          return;
        }
        unique.add(val.toLowerCase());
        names.push(val);
      }

      names.forEach((n, idx) => {
        const oldName = ttt.teams[idx].name;
        ttt.teams[idx].name = n;

        ttt.fixtures.forEach(f => {
          if (f.teamA === oldName) f.teamA = n;
          if (f.teamB === oldName) f.teamB = n;
        });
      });

      saveTableTennisState();
      triggerTtToast("Player names updated!");
      document.querySelector("#tt-tab-table").click();
    });
  }

  if (els.tresetBtn) {
    els.tresetBtn.addEventListener("click", () => {
      if (confirm("Are you sure you want to reset this Table Tennis tournament? All match results will be cleared.")) {
        ttt = clone(defaultTttState);
        saveTableTennisState();
        window.location.hash = "#tabletennis";
      }
    });
  }

  if (els.tdashboardBackBtn) {
    els.tdashboardBackBtn.addEventListener("click", () => {
      ttt.active = false;
      saveTableTennisState();
      window.location.hash = "#tabletennis";
    });
  }

  function renderTournamentDashboard() {
    if (els.tdashboardName) els.tdashboardName.textContent = ttt.name;
    renderPointsTable();
  }

  // 11. INITIALIZE TABLE TENNIS ROUTINGS
  loadTableTennisState();

  if (window.location.hash.startsWith("#tabletennis")) {
    showTableTennisPage(true);
  }

  window.addEventListener("hashchange", () => {
    if (window.location.hash.startsWith("#tabletennis")) {
      showTableTennisPage(true);
    }
  });

  // Bind Home Sports Card button
  const tabletennisCardBtn = document.querySelector("[data-open-sport='tabletennis']");
  if (tabletennisCardBtn) {
    tabletennisCardBtn.addEventListener("click", () => {
      window.location.hash = "#tabletennis";
    });
  }

})();
