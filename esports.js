/**
 * ==========================================================================
 * ESPORTS (COMPETITIVE GAMING / FPS & MOBA) SCORER & PRO LEAGUE ENGINE
 * ==========================================================================
 * Modular Esports tracker supporting Tactical FPS (Valorant / CS2 - MR12/MR15),
 * Halves side switch, 45s Spike/Bomb plant timer with synthesized beeping audio,
 * Multi-map series (Bo1 / Bo3 / Bo5), Ace! / Team Wipe fanfare, and
 * Esports Pro League Championship Tournament standings engine.
 */

(() => {
  "use strict";

  // 1. STATE & CONSTANTS
  const ES_STORAGE_KEY = "scoretracker_esports_match_state";
  const EST_STORAGE_KEY = "scoretracker_esports_tournament_state";

  const defaultEsportsState = {
    active: false,
    isTournamentMatch: false,
    teamA: "Sentinels",
    teamB: "Fnatic",
    discipline: "fps", // "fps", "moba", "generic"
    seriesFormat: 3, // 1, 3, 5
    roundsToWin: 13, // 13 (MR12), 16 (MR15), 1 (MOBA)
    currentMapIndex: 0,
    maps: [
      { mapName: "Haven", teamAScore: 0, teamBScore: 0, completed: false, winner: null, teamAKills: 0, teamBKills: 0, currentHalf: 1 },
      { mapName: "Ascent", teamAScore: 0, teamBScore: 0, completed: false, winner: null, teamAKills: 0, teamBKills: 0, currentHalf: 1 },
      { mapName: "Bind", teamAScore: 0, teamBScore: 0, completed: false, winner: null, teamAKills: 0, teamBKills: 0, currentHalf: 1 }
    ],
    teamASide: "atk", // "atk" or "def"
    teamBSide: "def",
    spikePlanted: false,
    spikeSeconds: 45.0,
    matchCompleted: false,
    seriesWinner: null,
    timeline: [], // { text, map, round }
    history: []
  };

  const defaultEsportstState = {
    active: false,
    name: "VCT Champions Pro League",
    teamCount: 4,
    seriesFormat: 3,
    teams: [], // { name, matches: 0, wins: 0, losses: 0, mapsWon: 0, mapsLost: 0, roundDiff: 0, pts: 0 }
    fixtures: [], // { id, teamA, teamB, completed, resultText, winner, scoreText }
    activeFixtureId: null
  };

  let es = clone(defaultEsportsState);
  let est = clone(defaultEsportstState);
  let spikeInterval = null;

  function clone(obj) {
    return JSON.parse(JSON.stringify(obj));
  }

  // 2. DOM ELEMENTS SELECTORS
  const els = {
    // Page Wrappers
    esportsPage: document.querySelector("#esports-page"),
    formatView: document.querySelector("#esports-format-view"),
    setupView: document.querySelector("#esports-setup-view"),
    dashboardView: document.querySelector("#esports-dashboard-view"),
    tsetupView: document.querySelector("#esports-tsetup-view"),
    tdashboardView: document.querySelector("#esports-tdashboard-view"),

    // Format selection buttons
    formatBackBtn: document.querySelector("#esports-format-back-btn"),
    formatCustomBtn: document.querySelector("#esports-format-custom-btn"),
    formatTournamentBtn: document.querySelector("#esports-format-tournament-btn"),

    // Setup
    setupBackBtn: document.querySelector("#esports-setup-back-btn"),
    teamAInput: document.querySelector("#esports-team-a-input"),
    teamBInput: document.querySelector("#esports-team-b-input"),
    disciplineSelect: document.querySelector("#esports-discipline-select"),
    seriesSelect: document.querySelector("#esports-series-select"),
    roundsSelect: document.querySelector("#esports-rounds-select"),
    startBtn: document.querySelector("#esports-start-btn"),

    // Dashboard Header & Status
    dashboardBackBtn: document.querySelector("#esports-dashboard-back-btn"),
    resetMatchBtn: document.querySelector("#esports-reset-match-btn"),
    liveIndicator: document.querySelector("#esports-live-indicator"),
    seriesTracker: document.querySelector("#esports-series-tracker"),
    mapBanner: document.querySelector("#esports-map-banner"),
    halfIndicator: document.querySelector("#esports-half-indicator"),
    pointBadge: document.querySelector("#esports-point-badge"),
    spikeWidget: document.querySelector("#esports-spike-widget"),
    spikeClock: document.querySelector("#esports-spike-clock"),
    swapSidesBtn: document.querySelector("#esports-swap-sides-btn"),

    // Team A Displays
    teamASide: document.querySelector("#esports-team-a-side"),
    teamANameDisplay: document.querySelector("#esports-team-a-name-display"),
    teamAScoreDisplay: document.querySelector("#esports-team-a-score-display"),
    teamAKills: document.querySelector("#esports-team-a-kills"),
    teamAMaps: document.querySelector("#esports-team-a-maps"),
    teamAActionsTitle: document.querySelector("#esports-team-a-actions-title"),

    // Team B Displays
    teamBSide: document.querySelector("#esports-team-b-side"),
    teamBNameDisplay: document.querySelector("#esports-team-b-name-display"),
    teamBScoreDisplay: document.querySelector("#esports-team-b-score-display"),
    teamBKills: document.querySelector("#esports-team-b-kills"),
    teamBMaps: document.querySelector("#esports-team-b-maps"),
    teamBActionsTitle: document.querySelector("#esports-team-b-actions-title"),

    // Controls
    undoBtn: document.querySelector("#esports-undo-btn"),
    timeoutBtn: document.querySelector("#esports-timeout-btn"),
    nextMapBtn: document.querySelector("#esports-next-map-btn"),
    submitResultBtn: document.querySelector("#esports-submit-result-btn"),
    timelineList: document.querySelector("#esports-timeline-list"),

    // Tournament Setup
    tsetupBackBtn: document.querySelector("#esports-tsetup-back-btn"),
    tnameInput: document.querySelector("#esports-tname-input"),
    tteamCount: document.querySelector("#esports-tteam-count"),
    tseriesSelect: document.querySelector("#esports-tseries-select"),
    tteamInputs: document.querySelector("#esports-tteam-inputs"),
    tcreateBtn: document.querySelector("#esports-tcreate-btn"),

    // Tournament Dashboard
    tdashboardBackBtn: document.querySelector("#esports-tdashboard-back-btn"),
    tresetBtn: document.querySelector("#esports-treset-btn"),
    tdashboardName: document.querySelector("#esports-tdashboard-name"),
    tabTable: document.querySelector("#esports-tab-table"),
    tabFixtures: document.querySelector("#esports-tab-fixtures"),
    tabEdit: document.querySelector("#esports-tab-edit"),
    tableView: document.querySelector("#esports-table-view"),
    fixturesView: document.querySelector("#esports-fixtures-view"),
    editView: document.querySelector("#esports-edit-view"),
    pointsTableBody: document.querySelector("#esports-points-table-body"),
    fixturesList: document.querySelector("#esports-fixtures-list"),
    editTeamsContainer: document.querySelector("#esports-edit-teams-container"),
    editSaveBtn: document.querySelector("#esports-edit-save-btn")
  };

  // 3. TOAST & SYNTHESIZED AUDIO
  function triggerEsportsToast(message) {
    const existing = document.querySelector(".es-toast-notification");
    if (existing) existing.remove();

    const toast = document.createElement("div");
    toast.className = "es-toast-notification";
    toast.textContent = message;
    toast.style.position = "fixed";
    toast.style.bottom = "24px";
    toast.style.left = "50%";
    toast.style.transform = "translateX(-50%)";
    toast.style.background = "#06b6d4";
    toast.style.color = "#050811";
    toast.style.padding = "10px 22px";
    toast.style.borderRadius = "30px";
    toast.style.fontWeight = "900";
    toast.style.fontSize = "0.9rem";
    toast.style.boxShadow = "0 8px 24px rgba(6,182,212,0.4)";
    toast.style.zIndex = "99999";
    toast.style.animation = "fadeIn 0.2s ease";

    document.body.appendChild(toast);
    setTimeout(() => {
      toast.style.opacity = "0";
      toast.style.transition = "opacity 0.3s";
      setTimeout(() => toast.remove(), 300);
    }, 2500);
  }

  function playEsportsAudio(type = "win") {
    try {
      const AudioCtx = window.AudioContext || window.webkitAudioContext;
      if (!AudioCtx) return;
      const ctx = new AudioCtx();

      if (type === "spike_beep") {
        // Fast High-Pitch Spike Pulse Beep
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = "sine";
        osc.frequency.setValueAtTime(880, ctx.currentTime);
        gain.gain.setValueAtTime(0.3, ctx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.08);

        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.start();
        osc.stop(ctx.currentTime + 0.08);
      } else if (type === "defuse") {
        // Defusal Harmonic Success Sound
        const osc1 = ctx.createOscillator();
        const osc2 = ctx.createOscillator();
        const gain = ctx.createGain();

        osc1.type = "sine";
        osc1.frequency.setValueAtTime(523.25, ctx.currentTime); // C5
        osc1.frequency.setValueAtTime(659.25, ctx.currentTime + 0.1); // E5
        osc1.frequency.setValueAtTime(783.99, ctx.currentTime + 0.2); // G5

        osc2.type = "triangle";
        osc2.frequency.setValueAtTime(1046.50, ctx.currentTime + 0.2); // C6

        gain.gain.setValueAtTime(0.3, ctx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.4);

        osc1.connect(gain);
        osc2.connect(gain);
        gain.connect(ctx.destination);

        osc1.start();
        osc2.start();
        osc1.stop(ctx.currentTime + 0.4);
        osc2.stop(ctx.currentTime + 0.4);
      } else if (type === "ace") {
        // Cyberpunk ACE! Fanfare Chords
        const freqs = [440, 554.37, 659.25, 880];
        freqs.forEach((f, i) => {
          const osc = ctx.createOscillator();
          const gain = ctx.createGain();
          osc.type = "sawtooth";
          osc.frequency.setValueAtTime(f, ctx.currentTime + (i * 0.08));

          gain.gain.setValueAtTime(0.2, ctx.currentTime + (i * 0.08));
          gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.6);

          osc.connect(gain);
          gain.connect(ctx.destination);
          osc.start(ctx.currentTime + (i * 0.08));
          osc.stop(ctx.currentTime + 0.6);
        });
      } else if (type === "win") {
        // Round / Map Victory Synth Horn
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = "square";
        osc.frequency.setValueAtTime(220, ctx.currentTime);
        osc.frequency.exponentialRampToValueAtTime(440, ctx.currentTime + 0.2);

        gain.gain.setValueAtTime(0.25, ctx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.4);

        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.start();
        osc.stop(ctx.currentTime + 0.4);
      }
    } catch (e) {
      console.warn("Audio not available", e);
    }
  }

  // 4. STORAGE PERSISTENCE
  function loadEsportsState() {
    try {
      const stored = localStorage.getItem(ES_STORAGE_KEY);
      const storedT = localStorage.getItem(EST_STORAGE_KEY);
      if (stored) es = { ...clone(defaultEsportsState), ...JSON.parse(stored) };
      if (storedT) est = { ...clone(defaultEsportstState), ...JSON.parse(storedT) };
    } catch (e) {
      console.error("Failed to load esports state", e);
    }
  }

  function saveEsportsState() {
    try {
      localStorage.setItem(ES_STORAGE_KEY, JSON.stringify(es));
      localStorage.setItem(EST_STORAGE_KEY, JSON.stringify(est));
    } catch (e) {
      console.error("Failed to save esports state", e);
    }
  }

  // 5. VIEW NAVIGATION
  function hideAllEsportsViews() {
    if (els.formatView) els.formatView.classList.add("hidden");
    if (els.setupView) els.setupView.classList.add("hidden");
    if (els.dashboardView) els.dashboardView.classList.add("hidden");
    if (els.tsetupView) els.tsetupView.classList.add("hidden");
    if (els.tdashboardView) els.tdashboardView.classList.add("hidden");
  }

  function showEsportsPage(fromHash = false) {
    const pages = ["#cricket-page", "#football-page", "#basketball-page", "#tennis-page", "#badminton-page", "#hockey-page", "#volleyball-page", "#baseball-page", "#rugby-page", "#kabaddi-page", "#tabletennis-page", "#golf-page", "#boxing-page", "#mma-page", "#sports-page", "#format-page"];
    pages.forEach(p => {
      const el = document.querySelector(p);
      if (el) el.classList.add("hidden");
    });

    if (els.esportsPage) els.esportsPage.classList.remove("hidden");
    hideAllEsportsViews();

    const hash = window.location.hash;
    if (hash === "#esports") {
      if (els.formatView) els.formatView.classList.remove("hidden");
    } else if (hash === "#esports-custom") {
      if (els.setupView) els.setupView.classList.remove("hidden");
    } else if (hash === "#esports-match") {
      if (els.dashboardView) els.dashboardView.classList.remove("hidden");
      renderEsportsDashboard();
    } else if (hash === "#esports-tsetup") {
      if (els.tsetupView) els.tsetupView.classList.remove("hidden");
      renderTournamentTeamInputs();
    } else if (hash === "#esports-tdashboard") {
      if (els.tdashboardView) els.tdashboardView.classList.remove("hidden");
      renderTournamentDashboard();
    }
  }

  window.showEsportsPage = showEsportsPage;

  // 6. FORMAT CHOICE LISTENERS
  if (els.formatBackBtn) {
    els.formatBackBtn.addEventListener("click", () => {
      window.location.hash = "#sports";
    });
  }

  if (els.formatCustomBtn) {
    els.formatCustomBtn.addEventListener("click", () => {
      window.location.hash = "#esports-custom";
    });
  }

  if (els.formatTournamentBtn) {
    els.formatTournamentBtn.addEventListener("click", () => {
      if (est.active) {
        window.location.hash = "#esports-tdashboard";
      } else {
        window.location.hash = "#esports-tsetup";
      }
    });
  }

  // 7. SETUP VIEW & START
  if (els.setupBackBtn) {
    els.setupBackBtn.addEventListener("click", () => {
      window.location.hash = "#esports";
    });
  }

  if (els.startBtn) {
    els.startBtn.addEventListener("click", () => {
      const teamA = (els.teamAInput ? els.teamAInput.value.trim() : "") || "Sentinels";
      const teamB = (els.teamBInput ? els.teamBInput.value.trim() : "") || "Fnatic";
      const discipline = (els.disciplineSelect ? els.disciplineSelect.value : "fps");
      const series = Number(els.seriesSelect ? els.seriesSelect.value : 3);
      const rounds = Number(els.roundsSelect ? els.roundsSelect.value : 13);

      if (teamA.toLowerCase() === teamB.toLowerCase()) {
        triggerEsportsToast("Team names must be distinct!");
        return;
      }

      initializeEsportsMatch(teamA, teamB, series, rounds, discipline);
    });
  }

  function initializeEsportsMatch(teamA, teamB, seriesFormat = 3, roundsToWin = 13, discipline = "fps") {
    stopSpikeTimer();

    es = clone(defaultEsportsState);
    es.active = true;
    es.isTournamentMatch = false;
    es.teamA = teamA;
    es.teamB = teamB;
    es.discipline = discipline;
    es.seriesFormat = seriesFormat;
    es.roundsToWin = roundsToWin;
    es.currentMapIndex = 0;
    es.teamASide = "atk";
    es.teamBSide = "def";

    // Pool of standard competitive maps
    const mapPool = discipline === "fps" ? ["Haven", "Ascent", "Bind", "Split", "Lotus"] : ["Game 1", "Game 2", "Game 3", "Game 4", "Game 5"];
    es.maps = [];
    for (let i = 0; i < seriesFormat; i++) {
      es.maps.push({
        mapName: mapPool[i] || `Map ${i + 1}`,
        teamAScore: 0,
        teamBScore: 0,
        completed: false,
        winner: null,
        teamAKills: 0,
        teamBKills: 0,
        currentHalf: 1
      });
    }

    saveEsportsState();
    playEsportsAudio("win");
    window.location.hash = "#esports-match";
  }

  // 8. LIVE SCORING ENGINE
  function saveToHistory() {
    es.history.push({
      currentMapIndex: es.currentMapIndex,
      maps: clone(es.maps),
      teamASide: es.teamASide,
      teamBSide: es.teamBSide,
      matchCompleted: es.matchCompleted,
      seriesWinner: es.seriesWinner
    });
    if (es.history.length > 30) es.history.shift();
  }

  function scoreRound(winningTeam, method = "Elimination") {
    if (es.matchCompleted) return;
    saveToHistory();
    stopSpikeTimer();

    const currMap = es.maps[es.currentMapIndex];
    if (currMap.completed) return;

    if (winningTeam === "a") {
      currMap.teamAScore++;
      playEsportsAudio("win");
      logTimelineEvent(`🏆 ${es.teamA} wins round (${method}) • Score: ${currMap.teamAScore}-${currMap.teamBScore}`);
      triggerEsportsToast(`Round for ${es.teamA}!`);
    } else {
      currMap.teamBScore++;
      playEsportsAudio("win");
      logTimelineEvent(`🏆 ${es.teamB} wins round (${method}) • Score: ${currMap.teamAScore}-${currMap.teamBScore}`);
      triggerEsportsToast(`Round for ${es.teamB}!`);
    }

    // Check Halves Switch (Round 12 in MR12, Round 15 in MR15)
    const totalRoundsPlayed = currMap.teamAScore + currMap.teamBScore;
    const switchThreshold = es.roundsToWin === 16 ? 15 : 12;

    if (totalRoundsPlayed === switchThreshold) {
      currMap.currentHalf = 2;
      swapSides(true); // Halves switch
      logTimelineEvent(`🔄 HALFTIME: Teams swap sides! ${es.teamA} (${es.teamASide.toUpperCase()}) vs ${es.teamB} (${es.teamBSide.toUpperCase()})`);
      triggerEsportsToast("🔄 Halftime! Sides Swapped.");
    } else if (totalRoundsPlayed >= (switchThreshold * 2) && (currMap.teamAScore === currMap.teamBScore)) {
      currMap.currentHalf = 3; // Overtime
      triggerEsportsToast("⚡ OVERTIME (OT): Win by 2!");
      logTimelineEvent("⚡ OVERTIME: Teams enter OT deuce!");
    }

    // Check Map Win Condition
    checkMapWinCondition();

    saveEsportsState();
    renderEsportsDashboard();
  }

  function logKill(team) {
    if (es.matchCompleted) return;
    saveToHistory();
    const currMap = es.maps[es.currentMapIndex];

    if (team === "a") {
      currMap.teamAKills++;
      triggerEsportsToast(`🎯 Kill for ${es.teamA}!`);
    } else {
      currMap.teamBKills++;
      triggerEsportsToast(`🎯 Kill for ${es.teamB}!`);
    }

    saveEsportsState();
    renderEsportsDashboard();
  }

  function triggerAce(team) {
    if (es.matchCompleted) return;
    saveToHistory();
    stopSpikeTimer();

    const currMap = es.maps[es.currentMapIndex];
    if (team === "a") {
      currMap.teamAKills += 5;
      currMap.teamAScore++;
      playEsportsAudio("ace");
      logTimelineEvent(`☠️ TEAM ACE! ${es.teamA} wipes the entire enemy squad!`);
      triggerEsportsToast(`☠️ ACE! ${es.teamA} (+1 Round)`);
    } else {
      currMap.teamBKills += 5;
      currMap.teamBScore++;
      playEsportsAudio("ace");
      logTimelineEvent(`☠️ TEAM ACE! ${es.teamB} wipes the entire enemy squad!`);
      triggerEsportsToast(`☠️ ACE! ${es.teamB} (+1 Round)`);
    }

    checkMapWinCondition();
    saveEsportsState();
    renderEsportsDashboard();
  }

  function startSpikePlant(team) {
    if (es.matchCompleted || es.spikePlanted) return;
    es.spikePlanted = true;
    es.spikeSeconds = 45.0;

    logTimelineEvent(`💣 SPIKE PLANTED by ${team === "a" ? es.teamA : es.teamB}!`);
    triggerEsportsToast(`💣 Spike Planted! 45s Countdown`);

    if (els.spikeWidget) els.spikeWidget.classList.remove("hidden");

    spikeInterval = setInterval(() => {
      if (es.spikeSeconds > 0) {
        es.spikeSeconds = Math.max(0, +(es.spikeSeconds - 0.1).toFixed(1));
        if (els.spikeClock) els.spikeClock.textContent = `${es.spikeSeconds.toFixed(1)}s`;

        // Pulse audio beeps
        if (Math.floor(es.spikeSeconds * 10) % 10 === 0) {
          playEsportsAudio("spike_beep");
        }
      } else {
        // Spike Exploded! Attacking team gets the round
        stopSpikeTimer();
        playEsportsAudio("win");
        const plantWinner = (es.teamASide === "atk") ? "a" : "b";
        scoreRound(plantWinner, "Spike Detonation");
      }
    }, 100);
  }

  function defuseSpike(team) {
    if (!es.spikePlanted) return;
    stopSpikeTimer();
    playEsportsAudio("defuse");

    logTimelineEvent(`🛡️ SPIKE DEFUSED by ${team === "a" ? es.teamA : es.teamB}!`);
    triggerEsportsToast(`🛡️ Spike Defused! Round Won.`);

    scoreRound(team, "Spike Defusal");
  }

  function stopSpikeTimer() {
    es.spikePlanted = false;
    if (spikeInterval) {
      clearInterval(spikeInterval);
      spikeInterval = null;
    }
    if (els.spikeWidget) els.spikeWidget.classList.add("hidden");
  }

  function swapSides(isAutomatic = false) {
    saveToHistory();
    const prevA = es.teamASide;
    es.teamASide = (prevA === "atk") ? "def" : "atk";
    es.teamBSide = (es.teamASide === "atk") ? "def" : "atk";

    if (!isAutomatic) {
      triggerEsportsToast(`🔄 Sides Swapped: ${es.teamA} is now ${es.teamASide.toUpperCase()}`);
    }
    saveEsportsState();
    renderEsportsDashboard();
  }

  function checkMapWinCondition() {
    const currMap = es.maps[es.currentMapIndex];
    const target = es.roundsToWin;

    // Normal Win or OT Win by 2
    let mapWon = false;
    let winner = null;

    if (currMap.teamAScore >= target && (currMap.teamAScore - currMap.teamBScore >= 2)) {
      mapWon = true;
      winner = es.teamA;
    } else if (currMap.teamBScore >= target && (currMap.teamBScore - currMap.teamAScore >= 2)) {
      mapWon = true;
      winner = es.teamB;
    }

    if (mapWon) {
      currMap.completed = true;
      currMap.winner = winner;
      playEsportsAudio("win");
      logTimelineEvent(`👑 MAP VICTORY: ${winner} wins ${currMap.mapName} (${currMap.teamAScore} - ${currMap.teamBScore})!`);
      triggerEsportsToast(`👑 ${winner} wins ${currMap.mapName}!`);

      // Check Series Win
      checkSeriesWinCondition();
    }
  }

  function checkSeriesWinCondition() {
    const mapsNeeded = Math.ceil(es.seriesFormat / 2);
    let aWins = 0;
    let bWins = 0;

    es.maps.forEach(m => {
      if (m.completed) {
        if (m.winner === es.teamA) aWins++;
        if (m.winner === es.teamB) bWins++;
      }
    });

    if (aWins >= mapsNeeded) {
      es.matchCompleted = true;
      es.seriesWinner = es.teamA;
      playEsportsAudio("ace");
      logTimelineEvent(`🏆 SERIES VICTORY: ${es.teamA} wins the series (${aWins} - ${bWins})!`);
      triggerEsportsToast(`🏆 ${es.teamA} WINS THE SERIES!`);
    } else if (bWins >= mapsNeeded) {
      es.matchCompleted = true;
      es.seriesWinner = es.teamB;
      playEsportsAudio("ace");
      logTimelineEvent(`🏆 SERIES VICTORY: ${es.teamB} wins the series (${bWins} - ${aWins})!`);
      triggerEsportsToast(`🏆 ${es.teamB} WINS THE SERIES!`);
    }
  }

  function nextMap() {
    if (es.matchCompleted) return;

    const currMap = es.maps[es.currentMapIndex];
    if (!currMap.completed) {
      if (!confirm(`Map ${currMap.mapName} is not finished yet. Force finish and move to next map?`)) return;
      currMap.completed = true;
      currMap.winner = currMap.teamAScore > currMap.teamBScore ? es.teamA : es.teamB;
      checkSeriesWinCondition();
    }

    if (es.currentMapIndex < es.maps.length - 1 && !es.matchCompleted) {
      es.currentMapIndex++;
      es.teamASide = "atk";
      es.teamBSide = "def";
      stopSpikeTimer();
      playEsportsAudio("win");
      triggerEsportsToast(`🎮 Moving to Map ${es.currentMapIndex + 1}: ${es.maps[es.currentMapIndex].mapName}`);
      saveEsportsState();
      renderEsportsDashboard();
    }
  }

  function logTimelineEvent(text) {
    const currMap = es.maps[es.currentMapIndex] || {};
    es.timeline.unshift({
      text,
      map: currMap.mapName || `Map ${es.currentMapIndex + 1}`
    });
  }

  // Undo
  function undoEsportsAction() {
    if (!es.history || es.history.length === 0) {
      triggerEsportsToast("No rounds to undo.");
      return;
    }
    stopSpikeTimer();
    const prev = es.history.pop();
    es.currentMapIndex = prev.currentMapIndex;
    es.maps = clone(prev.maps);
    es.teamASide = prev.teamASide;
    es.teamBSide = prev.teamBSide;
    es.matchCompleted = prev.matchCompleted;
    es.seriesWinner = prev.seriesWinner;

    if (es.timeline.length > 0) es.timeline.shift();

    saveEsportsState();
    renderEsportsDashboard();
    triggerEsportsToast("Last round undone.");
  }

  // Render Dashboard
  function renderEsportsDashboard() {
    if (!els.dashboardView) return;

    const currMap = es.maps[es.currentMapIndex] || { mapName: "Map 1", teamAScore: 0, teamBScore: 0, teamAKills: 0, teamBKills: 0, currentHalf: 1 };

    // Series Map Score
    let aMapWins = 0, bMapWins = 0;
    es.maps.forEach(m => {
      if (m.completed) {
        if (m.winner === es.teamA) aMapWins++;
        if (m.winner === es.teamB) bMapWins++;
      }
    });

    if (els.teamANameDisplay) els.teamANameDisplay.textContent = es.teamA;
    if (els.teamBNameDisplay) els.teamBNameDisplay.textContent = es.teamB;

    if (els.teamAScoreDisplay) els.teamAScoreDisplay.textContent = currMap.teamAScore;
    if (els.teamBScoreDisplay) els.teamBScoreDisplay.textContent = currMap.teamBScore;

    if (els.teamAKills) els.teamAKills.textContent = currMap.teamAKills;
    if (els.teamBKills) els.teamBKills.textContent = currMap.teamBKills;

    if (els.teamAMaps) els.teamAMaps.textContent = aMapWins;
    if (els.teamBMaps) els.teamBMaps.textContent = bMapWins;

    // Sides Display
    if (els.teamASide) {
      els.teamASide.className = `es-side-badge ${es.teamASide}`;
      els.teamASide.textContent = es.teamASide === "atk" ? "⚔️ ATTACKING" : "🛡️ DEFENDING";
    }
    if (els.teamBSide) {
      els.teamBSide.className = `es-side-badge ${es.teamBSide}`;
      els.teamBSide.textContent = es.teamBSide === "atk" ? "⚔️ ATTACKING" : "🛡️ DEFENDING";
    }

    // Map Banner & Halves Info
    if (els.mapBanner) {
      els.mapBanner.textContent = `Map ${es.currentMapIndex + 1}: ${currMap.mapName} (Bo${es.seriesFormat})`;
    }

    if (els.halfIndicator) {
      if (currMap.currentHalf === 1) els.halfIndicator.textContent = `First Half • Round ${currMap.teamAScore + currMap.teamBScore + 1}`;
      else if (currMap.currentHalf === 2) els.halfIndicator.textContent = `Second Half • Round ${currMap.teamAScore + currMap.teamBScore + 1}`;
      else els.halfIndicator.textContent = `⚡ OVERTIME • Round ${currMap.teamAScore + currMap.teamBScore + 1}`;
    }

    // Match / Map Point Badge
    if (els.pointBadge) {
      const needed = es.roundsToWin;
      if (es.matchCompleted) {
        els.pointBadge.classList.remove("hidden");
        els.pointBadge.textContent = `🏆 ${es.seriesWinner} WINS SERIES!`;
      } else if (currMap.teamAScore === needed - 1 && currMap.teamBScore < needed - 1) {
        els.pointBadge.classList.remove("hidden");
        els.pointBadge.textContent = `MAP POINT (${es.teamA})`;
      } else if (currMap.teamBScore === needed - 1 && currMap.teamAScore < needed - 1) {
        els.pointBadge.classList.remove("hidden");
        els.pointBadge.textContent = `MAP POINT (${es.teamB})`;
      } else {
        els.pointBadge.classList.add("hidden");
      }
    }

    // Live Indicator
    if (els.liveIndicator) {
      if (es.matchCompleted) els.liveIndicator.classList.add("hidden");
      else els.liveIndicator.classList.remove("hidden");
    }

    // Series Tracker Badges
    if (els.seriesTracker) {
      els.seriesTracker.innerHTML = es.maps.map((m, idx) => {
        let chipClass = "es-map-chip";
        let statusText = `${m.teamAScore}-${m.teamBScore}`;

        if (idx === es.currentMapIndex) chipClass += " current";
        if (m.completed) {
          if (m.winner === es.teamA) chipClass += " won-a";
          else if (m.winner === es.teamB) chipClass += " won-b";
        }

        return `
          <div class="${chipClass}">
            <span>${idx + 1}. ${m.mapName}</span>
            <span style="font-family:monospace; font-weight:900;">${statusText}</span>
          </div>
        `;
      }).join("");
    }

    // Tournament Submit button
    if (els.submitResultBtn) {
      if (es.isTournamentMatch && es.matchCompleted) els.submitResultBtn.classList.remove("hidden");
      else els.submitResultBtn.classList.add("hidden");
    }

    // Render Timeline List
    if (els.timelineList) {
      if (es.timeline.length === 0) {
        els.timelineList.innerHTML = `<p style="color: var(--text-muted); font-style: italic; font-size: 0.9rem; margin: 0;">No rounds scored yet.</p>`;
      } else {
        els.timelineList.innerHTML = es.timeline.map(item => `
          <div class="es-log-item">
            <div style="font-weight: 700;">${item.text}</div>
            <div style="font-family: monospace; font-size: 0.75rem; color: var(--es-cyan); font-weight:800;">${item.map}</div>
          </div>
        `).join("");
      }
    }
  }

  // 9. DASHBOARD EVENT LISTENERS
  if (els.dashboardBackBtn) {
    els.dashboardBackBtn.addEventListener("click", () => {
      stopSpikeTimer();
      if (es.isTournamentMatch) {
        window.location.hash = "#esports-tdashboard";
      } else {
        window.location.hash = "#esports";
      }
    });
  }

  if (els.resetMatchBtn) {
    els.resetMatchBtn.addEventListener("click", () => {
      if (confirm("Reset current esports match? All map scores will be cleared.")) {
        initializeEsportsMatch(es.teamA, es.teamB, es.seriesFormat, es.roundsToWin, es.discipline);
      }
    });
  }

  if (els.swapSidesBtn) els.swapSidesBtn.addEventListener("click", () => swapSides(false));
  if (els.undoBtn) els.undoBtn.addEventListener("click", undoEsportsAction);
  if (els.nextMapBtn) els.nextMapBtn.addEventListener("click", nextMap);

  if (els.timeoutBtn) {
    els.timeoutBtn.addEventListener("click", () => {
      playEsportsAudio("win");
      logTimelineEvent("⏱️ TACTICAL TIMEOUT called (60 seconds)");
      triggerEsportsToast("⏱️ Tactical Timeout Called!");
    });
  }

  // Action Buttons Handler
  document.querySelectorAll("[data-es-action]").forEach(btn => {
    btn.addEventListener("click", (e) => {
      const team = e.currentTarget.getAttribute("data-es-team");
      const action = e.currentTarget.getAttribute("data-es-action");

      if (team && action) {
        if (action === "win") scoreRound(team, "Elimination");
        else if (action === "kill") logKill(team);
        else if (action === "ace") triggerAce(team);
        else if (action === "plant") startSpikePlant(team);
        else if (action === "defuse") defuseSpike(team);
      }
    });
  });

  // Submit Result for Tournament Match
  if (els.submitResultBtn) {
    els.submitResultBtn.addEventListener("click", () => {
      if (est.active && est.activeFixtureId !== null) {
        const fixture = est.fixtures.find(f => f.id === est.activeFixtureId);
        if (fixture) {
          fixture.completed = true;
          fixture.winner = es.seriesWinner;

          let aMaps = 0, bMaps = 0, aRounds = 0, bRounds = 0;
          es.maps.forEach(m => {
            aRounds += m.teamAScore;
            bRounds += m.teamBScore;
            if (m.winner === es.teamA) aMaps++;
            if (m.winner === es.teamB) bMaps++;
          });

          fixture.scoreText = `${aMaps} - ${bMaps}`;
          fixture.resultText = `${es.seriesWinner} won (${aMaps}-${bMaps})`;

          // Update records
          const teamAObj = est.teams.find(t => t.name === fixture.teamA);
          const teamBObj = est.teams.find(t => t.name === fixture.teamB);

          if (teamAObj && teamBObj) {
            teamAObj.matches++;
            teamBObj.matches++;
            teamAObj.mapsWon += aMaps;
            teamAObj.mapsLost += bMaps;
            teamAObj.roundDiff += (aRounds - bRounds);

            teamBObj.mapsWon += bMaps;
            teamBObj.mapsLost += aMaps;
            teamBObj.roundDiff += (bRounds - aRounds);

            if (es.seriesWinner === teamAObj.name) {
              teamAObj.wins++;
              teamAObj.pts += 3;
              teamBObj.losses++;
            } else {
              teamBObj.wins++;
              teamBObj.pts += 3;
              teamAObj.losses++;
            }
          }

          saveEsportsState();
          triggerEsportsToast("Pro League Match Result Saved!");
          window.location.hash = "#esports-tdashboard";
        }
      }
    });
  }

  // 10. TOURNAMENT ENGINE (PRO LEAGUE STANDINGS & FIXTURES)
  if (els.tsetupBackBtn) {
    els.tsetupBackBtn.addEventListener("click", () => {
      window.location.hash = "#esports";
    });
  }

  if (els.tteamCount) {
    els.tteamCount.addEventListener("change", renderTournamentTeamInputs);
  }

  function renderTournamentTeamInputs() {
    if (!els.tteamInputs) return;
    const count = Number(els.tteamCount ? els.tteamCount.value : 4);
    const defaultTeams = ["Sentinels", "Fnatic", "Paper Rex", "Team Liquid", "LOUD", "NRG", "DRX", "Evil Geniuses"];

    els.tteamInputs.innerHTML = "";
    for (let i = 0; i < count; i++) {
      const defName = defaultTeams[i] || `Team ${i + 1}`;
      const div = document.createElement("div");
      div.innerHTML = `
        <label style="display: block; font-size: 0.8rem; color: var(--text-muted); margin-bottom: 4px; font-weight: 600;">Team ${i + 1} Name</label>
        <input type="text" class="es-tteam-name-input" value="${defName}" autocomplete="off" style="width: 100%; height: 38px; background: rgba(0,0,0,0.25); border: 1px solid rgba(255,255,255,0.1); border-radius: 6px; color: var(--ink); padding: 0 12px; font-size: 0.9rem;" />
      `;
      els.tteamInputs.appendChild(div);
    }
  }

  if (els.tcreateBtn) {
    els.tcreateBtn.addEventListener("click", () => {
      const name = els.tnameInput.value.trim() || "VCT Pro League Championship";
      const count = Number(els.tteamCount.value) || 4;
      const series = Number(els.tseriesSelect ? els.tseriesSelect.value : 3);

      const inputs = document.querySelectorAll(".es-tteam-name-input");
      const teamNames = [];
      const unique = new Set();

      for (let i = 0; i < inputs.length; i++) {
        const tName = inputs[i].value.trim() || `Team ${i + 1}`;
        if (unique.has(tName.toLowerCase())) {
          triggerEsportsToast(`Team names must be unique. Duplicate: "${tName}"`);
          return;
        }
        unique.add(tName.toLowerCase());
        teamNames.push(tName);
      }

      est = clone(defaultEsportstState);
      est.active = true;
      est.name = name;
      est.teamCount = count;
      est.seriesFormat = series;

      est.teams = teamNames.map(n => ({
        name: n,
        matches: 0,
        wins: 0,
        losses: 0,
        mapsWon: 0,
        mapsLost: 0,
        roundDiff: 0,
        pts: 0
      }));

      // Generate Round Robin Match Schedule
      est.fixtures = [];
      let fixId = 1;
      for (let i = 0; i < teamNames.length; i++) {
        for (let j = i + 1; j < teamNames.length; j++) {
          est.fixtures.push({
            id: fixId++,
            teamA: teamNames[i],
            teamB: teamNames[j],
            completed: false,
            resultText: "Scheduled",
            scoreText: "vs",
            winner: null
          });
        }
      }

      saveEsportsState();
      window.location.hash = "#esports-tdashboard";
    });
  }

  // Tournament Tabs
  const esTabs = ["table", "fixtures", "edit"];
  esTabs.forEach(tab => {
    const btn = document.querySelector(`#esports-tab-${tab}`);
    if (btn) {
      btn.addEventListener("click", () => {
        esTabs.forEach(t => {
          const b = document.querySelector(`#esports-tab-${t}`);
          const v = document.querySelector(`#esports-${t}-view`);
          if (b) b.classList.remove("active");
          if (v) v.classList.add("hidden");
        });
        btn.classList.add("active");
        const activeView = document.querySelector(`#esports-${tab}-view`);
        if (activeView) activeView.classList.remove("hidden");

        if (tab === "table") renderPointsTable();
        else if (tab === "fixtures") renderTournamentFixturesList();
        else if (tab === "edit") renderEditSetup();
      });
    }
  });

  function renderPointsTable() {
    if (!est.active) return;

    // Sort by PTS > Matches Won > Map Diff (MW - ML) > Round Diff
    const sorted = [...est.teams].sort((a, b) => {
      if (b.pts !== a.pts) return b.pts - a.pts;
      if (b.wins !== a.wins) return b.wins - a.wins;
      const aMapDiff = a.mapsWon - a.mapsLost;
      const bMapDiff = b.mapsWon - b.mapsLost;
      if (bMapDiff !== aMapDiff) return bMapDiff - aMapDiff;
      return b.roundDiff - a.roundDiff;
    });

    if (els.pointsTableBody) {
      els.pointsTableBody.innerHTML = sorted.map((t, idx) => `
        <tr style="border-bottom: 1px solid rgba(255,255,255,0.05);">
          <td style="padding: 10px 8px; font-weight:800; color: var(--es-cyan);">${idx + 1}</td>
          <td style="padding: 10px 8px; font-weight:800; color:#fff;">${t.name}</td>
          <td style="padding: 10px 8px; text-align:center; font-family:monospace;">${t.matches}</td>
          <td style="padding: 10px 8px; text-align:center; font-family:monospace; color:#10b981; font-weight:800;">${t.wins}</td>
          <td style="padding: 10px 8px; text-align:center; font-family:monospace; color:#f87171;">${t.losses}</td>
          <td style="padding: 10px 8px; text-align:center; font-family:monospace; color:var(--es-cyan); font-weight:800;">${t.mapsWon} - ${t.mapsLost}</td>
          <td style="padding: 10px 8px; text-align:center; font-family:monospace; color:${t.roundDiff >= 0 ? '#10b981' : '#f87171'}; font-weight:800;">${t.roundDiff >= 0 ? '+' : ''}${t.roundDiff}</td>
          <td style="padding: 10px 8px; font-weight:900; text-align:right; font-family:monospace; color:var(--es-cyan);">${t.pts}</td>
        </tr>
      `).join("");
    }
  }

  function renderTournamentFixturesList() {
    if (!els.fixturesList) return;
    els.fixturesList.innerHTML = "";

    est.fixtures.forEach(fix => {
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
          <span style="font-size: 0.75rem; color: var(--es-cyan); font-weight:700; text-transform:uppercase;">Match #${fix.id} • Bo${est.seriesFormat} Series</span>
          <div style="font-weight: 800; font-size:1.1rem; margin-top:4px;">
            <span style="color:var(--es-cyan);">${fix.teamA}</span>
            <span style="color:var(--text-muted); font-size:0.85rem; margin:0 6px;">${fix.scoreText}</span>
            <span style="color:var(--es-magenta);">${fix.teamB}</span>
          </div>
        </div>
      `;

      let rightSide = "";
      if (fix.completed) {
        rightSide = `
          <div style="text-align:right;">
            <div style="font-weight:800; color:var(--es-gold); font-size:0.9rem;">${fix.resultText}</div>
            <span style="background: rgba(16,185,129,0.15); color:#10b981; font-size:0.75rem; padding:3px 8px; border-radius:6px; font-weight:700; text-transform:uppercase;">Official</span>
          </div>
        `;
      } else {
        rightSide = `
          <button class="start-custom" type="button" data-es-match="${fix.id}" style="margin:0; padding:8px 16px; font-size:0.8rem; border-radius:6px; font-weight:700;">🎮 Score Series</button>
        `;
      }

      card.innerHTML = leftSide + rightSide;
      els.fixturesList.appendChild(card);
    });

    document.querySelectorAll("[data-es-match]").forEach(btn => {
      btn.addEventListener("click", (e) => {
        const fId = Number(e.currentTarget.getAttribute("data-es-match"));
        const fix = est.fixtures.find(f => f.id === fId);

        if (fix) {
          est.activeFixtureId = fId;
          initializeTournamentMatch(fix.teamA, fix.teamB, est.seriesFormat);
        }
      });
    });
  }

  function initializeTournamentMatch(teamA, teamB, seriesFormat) {
    initializeEsportsMatch(teamA, teamB, seriesFormat, 13, "fps");
    es.isTournamentMatch = true;
    saveEsportsState();
  }

  function renderEditSetup() {
    if (els.editTeamsContainer) {
      els.editTeamsContainer.innerHTML = est.teams.map((t, idx) => `
        <div class="setup-group">
          <label style="display: block; font-size: 0.85rem; color: var(--text-muted); margin-bottom: 4px; font-weight: 600;">Team ${idx + 1} Name</label>
          <input type="text" class="es-edit-tteam-input" data-team-index="${idx}" value="${t.name}" autocomplete="off" style="width: 100%; height: 38px; background: rgba(0,0,0,0.25); border: 1px solid rgba(255,255,255,0.1); border-radius: 6px; color: var(--ink); padding: 0 12px; font-size: 0.9rem;" />
        </div>
      `).join("");
    }
  }

  if (els.editSaveBtn) {
    els.editSaveBtn.addEventListener("click", () => {
      const inputs = document.querySelectorAll(".es-edit-tteam-input");
      const names = [];
      const unique = new Set();

      for (let i = 0; i < inputs.length; i++) {
        const val = inputs[i].value.trim() || `Team ${i + 1}`;
        if (unique.has(val.toLowerCase())) {
          triggerEsportsToast(`Duplicate name: "${val}"`);
          return;
        }
        unique.add(val.toLowerCase());
        names.push(val);
      }

      names.forEach((n, idx) => {
        const oldName = est.teams[idx].name;
        est.teams[idx].name = n;

        // Update in fixtures
        est.fixtures.forEach(fix => {
          if (fix.teamA === oldName) fix.teamA = n;
          if (fix.teamB === oldName) fix.teamB = n;
        });
      });

      saveEsportsState();
      triggerEsportsToast("Team names updated!");
      document.querySelector("#esports-tab-table").click();
    });
  }

  if (els.tresetBtn) {
    els.tresetBtn.addEventListener("click", () => {
      if (confirm("Are you sure you want to reset this Pro League? All match records will be cleared.")) {
        est = clone(defaultEsportstState);
        saveEsportsState();
        window.location.hash = "#esports";
      }
    });
  }

  if (els.tdashboardBackBtn) {
    els.tdashboardBackBtn.addEventListener("click", () => {
      est.active = false;
      saveEsportsState();
      window.location.hash = "#esports";
    });
  }

  function renderTournamentDashboard() {
    if (els.tdashboardName) els.tdashboardName.textContent = est.name;
    renderPointsTable();
  }

  // 11. INITIALIZE ROUTINGS
  loadEsportsState();

  if (window.location.hash.startsWith("#esports")) {
    showEsportsPage(true);
  }

  window.addEventListener("hashchange", () => {
    if (window.location.hash.startsWith("#esports")) {
      showEsportsPage(true);
    }
  });

  // Bind Home Sports Card button
  const esportsCardBtn = document.querySelector("[data-open-sport='esports']");
  if (esportsCardBtn) {
    esportsCardBtn.addEventListener("click", () => {
      window.location.hash = "#esports";
    });
  }

})();
