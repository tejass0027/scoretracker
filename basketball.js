/* ==========================================================================
   BASKETBALL SCORE TRACKER & TOURNAMENT LEAGUE MODULE - CORE ENGINE
   ========================================================================== */

console.log("ScoreTracker Basketball Module loaded - version 209");

(function () {
  // 1. STORAGE KEYS & DEFAULT STATES
  const BB_STORAGE_KEY = "basketball-score-tracker-v1";
  const BBT_STORAGE_KEY = "basketball-tournament-tracker-v1";

  const defaultBbState = {
    active: false,
    isTournamentMatch: false,
    scoringMode: "simple", // simple or advanced
    teamA: "",
    teamB: "",
    quarterDuration: 10, // minutes
    timeoutsLimit: 5,
    foulOutLimit: 5,
    overtimeEnabled: true,
    otDuration: 5, // minutes
    scoreA: 0,
    scoreB: 0,
    foulsA: 0,
    foulsB: 0,
    timeoutsA: 5,
    timeoutsB: 5,
    rosterA: [], // { name, number, pts, ast, rebOff, rebDef, stl, blk, fouls, active (on-court) }
    rosterB: [],
    period: "1st-quarter", // 1st-quarter, 2nd-quarter, halftime, 3rd-quarter, 4th-quarter, completed, ot
    matchTimer: {
      seconds: 0,
      running: false,
      breakSecondsRemaining: undefined
    },
    timeline: [] // { period, time, team, type, detail }
  };

  const defaultBbtState = {
    active: false,
    name: "",
    teamCount: 4,
    scoringMode: "simple",
    teams: [], // { name, played, wins, losses, pf (points for), pa (points against), diff, pts, players: [] }
    fixtures: [], // { round, teamA, teamB, scoreA, scoreB, status, matchState }
    activeFixtureIndex: -1
  };

  let bb = clone(defaultBbState);
  let bbt = clone(defaultBbtState);
  let bbTimerInterval = null;
  let activeSelectedPlayer = null; // { team: "A"|"B", index }

  // 2. CORE DOM SELECTORS
  const els = {
    // Page Wrappers
    basketballPage: document.querySelector("#basketball-page"),
    setupView: document.querySelector("#bb-setup-view"),
    dashboardView: document.querySelector("#bb-dashboard-view"),
    tsetupView: document.querySelector("#bb-tsetup-view"),
    tdashboardView: document.querySelector("#bb-tdashboard-view"),
    
    // Setup View inputs
    setupBackBtn: document.querySelector("#bb-setup-back-btn"),
    modeSimple: document.querySelector("#bb-mode-simple"),
    modeAdvanced: document.querySelector("#bb-mode-advanced"),
    teamAInput: document.querySelector("#bb-teamA-input"),
    teamBInput: document.querySelector("#bb-teamB-input"),
    quarterDurationInput: document.querySelector("#bb-quarter-duration-input"),
    timeoutsInput: document.querySelector("#bb-timeouts-input"),
    foulLimitInput: document.querySelector("#bb-foul-limit-input"),
    overtimeInput: document.querySelector("#bb-overtime-input"),
    otDurationInput: document.querySelector("#bb-ot-duration-input"),
    otSetupContainer: document.querySelector("#bb-ot-setup-container"),
    startBtn: document.querySelector("#bb-start-btn"),

    // Scorer Dashboard
    dashboardBackBtn: document.querySelector("#bb-dashboard-back-btn"),
    clockPeriod: document.querySelector("#bb-clock-period"),
    clockTime: document.querySelector("#bb-clock-time"),
    resetMatchBtn: document.querySelector("#bb-reset-match-btn"),
    teamAName: document.querySelector("#bb-teamA-name"),
    teamBName: document.querySelector("#bb-teamB-name"),
    teamAScore: document.querySelector("#bb-teamA-score"),
    teamBScore: document.querySelector("#bb-teamB-score"),
    teamAFouls: document.querySelector("#bb-teamA-fouls"),
    teamBFouls: document.querySelector("#bb-teamB-fouls"),
    teamATimeouts: document.querySelector("#bb-teamA-timeouts"),
    teamBTimeouts: document.querySelector("#bb-teamB-timeouts"),
    liveIndicator: document.querySelector("#bb-live-indicator"),
    timerToggleBtn: document.querySelector("#bb-timer-toggle-btn"),
    periodTransitionBtn: document.querySelector("#bb-period-transition-btn"),
    timeoutCountdown: document.querySelector("#bb-timeout-countdown"),
    timeoutABtn: document.querySelector("#bb-timeout-A-btn"),
    timeoutBBtn: document.querySelector("#bb-timeout-B-btn"),
    submitResultBtn: document.querySelector("#bb-submit-result-btn"),
    timelineList: document.querySelector("#bb-timeline-list"),

    // Scorer simple mode buttons
    simpleScorerPanel: document.querySelector("#bb-simple-scorer-panel"),
    simpleA1pt: document.querySelector("#bb-simple-A-1pt"),
    simpleA2pt: document.querySelector("#bb-simple-A-2pt"),
    simpleA3pt: document.querySelector("#bb-simple-A-3pt"),
    simpleAFoul: document.querySelector("#bb-simple-A-foul"),
    simpleB1pt: document.querySelector("#bb-simple-B-1pt"),
    simpleB2pt: document.querySelector("#bb-simple-B-2pt"),
    simpleB3pt: document.querySelector("#bb-simple-B-3pt"),
    simpleBFoul: document.querySelector("#bb-simple-B-foul"),

    // Scorer advanced mode layout
    advancedScorerPanel: document.querySelector("#bb-advanced-scorer-panel"),
    courtPlayersContainer: document.querySelector("#bb-court-players-container"),
    subAShortcut: document.querySelector("#bb-subA-shortcut"),
    subBShortcut: document.querySelector("#bb-subB-shortcut"),

    // Tournament Setup
    tsetupBackBtn: document.querySelector("#bb-tsetup-back-btn"),
    tmodeSimple: document.querySelector("#bb-tmode-simple"),
    tmodeAdvanced: document.querySelector("#bb-tmode-advanced"),
    tnameInput: document.querySelector("#bb-tname-input"),
    tteamCount: document.querySelector("#bb-tteam-count"),
    tdurationInput: document.querySelector("#bb-tduration-input"),
    tteamInputs: document.querySelector("#bb-tteam-inputs"),
    tcreateBtn: document.querySelector("#bb-tcreate-btn"),

    // Tournament Dashboard
    tdashboardBackBtn: document.querySelector("#bb-tdashboard-back-btn"),
    tresetBtn: document.querySelector("#bb-treset-btn"),
    tdashboardName: document.querySelector("#bb-tdashboard-name"),
    tabTable: document.querySelector("#bb-tab-table"),
    tabFixtures: document.querySelector("#bb-tab-fixtures"),
    tabStats: document.querySelector("#bb-tab-stats"),
    tabInfo: document.querySelector("#bb-tab-info"),
    tabEdit: document.querySelector("#bb-tab-edit"),
    tableView: document.querySelector("#bb-table-view"),
    fixturesView: document.querySelector("#bb-fixtures-view"),
    statsView: document.querySelector("#bb-stats-view"),
    infoView: document.querySelector("#bb-info-view"),
    editView: document.querySelector("#bb-edit-view"),
    pointsTableBody: document.querySelector("#bb-points-table-body"),
    fixturesList: document.querySelector("#bb-fixtures-list"),
    leaderPoints: document.querySelector("#bb-leader-points"),
    leaderAssists: document.querySelector("#bb-leader-assists"),
    leaderRebounds: document.querySelector("#bb-leader-rebounds"),
    leaderDefense: document.querySelector("#bb-leader-defense"),
    infoTeamsContainer: document.querySelector("#bb-info-teams-container"),
    editTeamsContainer: document.querySelector("#bb-edit-teams-container"),
    editDuration: document.querySelector("#bb-edit-duration"),
    editSaveBtn: document.querySelector("#bb-edit-save-btn"),

    // Modals
    actionModal: document.querySelector("#bb-action-modal"),
    closeActionModal: document.querySelector("#bb-close-action-modal"),
    modalPlayerTitle: document.querySelector("#bb-modal-player-title"),
    modalPlayerSubtitle: document.querySelector("#bb-modal-player-subtitle"),
    action1pt: document.querySelector("#bb-action-1pt"),
    action2pt: document.querySelector("#bb-action-2pt"),
    action3pt: document.querySelector("#bb-action-3pt"),
    actionAssist: document.querySelector("#bb-action-assist"),
    actionRebound: document.querySelector("#bb-action-rebound"),
    actionSteal: document.querySelector("#bb-action-steal"),
    actionBlock: document.querySelector("#bb-action-block"),
    actionFoul: document.querySelector("#bb-action-foul"),
    actionSub: document.querySelector("#bb-action-sub"),
    
    subModal: document.querySelector("#bb-sub-modal"),
    closeSubModal: document.querySelector("#bb-close-sub-modal"),
    subOffSelect: document.querySelector("#bb-sub-off-select"),
    subOnSelect: document.querySelector("#bb-sub-on-select"),
    subConfirmBtn: document.querySelector("#bb-sub-confirm-btn"),

    squadModal: document.querySelector("#bb-squad-modal"),
    closeSquadModal: document.querySelector("#bb-close-squad-modal"),
    squadTeamAHeader: document.querySelector("#bb-squad-teamA-header"),
    squadTeamBHeader: document.querySelector("#bb-squad-teamB-header"),
    squadTeamAInputs: document.querySelector("#bb-squad-teamA-inputs"),
    squadTeamBInputs: document.querySelector("#bb-squad-teamB-inputs"),
    squadSaveBtn: document.querySelector("#bb-squad-save-btn")
  };

  // 3. SOUND SYNTHESIZER (Web Audio API)
  function playBbBuzzerSound() {
    try {
      const audioCtx = new (window.AudioContext || window.webkitAudioContext)();
      const osc = audioCtx.createOscillator();
      const gainNode = audioCtx.createGain();

      osc.type = "sawtooth";
      osc.frequency.setValueAtTime(180, audioCtx.currentTime); // Low raspy buzzer frequency
      gainNode.gain.setValueAtTime(0.3, audioCtx.currentTime);
      gainNode.gain.exponentialRampToValueAtTime(0.01, audioCtx.currentTime + 1.2);

      osc.connect(gainNode);
      gainNode.connect(audioCtx.destination);
      osc.start();
      osc.stop(audioCtx.currentTime + 1.2);
    } catch (e) {
      console.warn("Buzzer sound synthesize failed: ", e);
    }
  }

  // Helper deep cloner
  function clone(obj) {
    return JSON.parse(JSON.stringify(obj));
  }

  // 4. HELPER UTILS
  function triggerBbToast(msg) {
    if (typeof showToast === "function") {
      showToast(msg);
    } else {
      alert(msg);
    }
  }

  // Get countdown duration in seconds
  function getPeriodSeconds(period, quarterDuration, otDuration) {
    if (period === "ot") return otDuration * 60;
    return quarterDuration * 60;
  }

  function getBreakSeconds(period) {
    if (period === "halftime") return 15 * 60;
    return 2 * 60; // Quarter break (2 mins)
  }

  function getPeriodDisplayLabel(period) {
    switch (period) {
      case "1st-quarter": return "1st Quarter";
      case "1st-quarter-break": return "Quarter Break";
      case "2nd-quarter": return "2nd Quarter";
      case "halftime": return "Halftime";
      case "3rd-quarter": return "3rd Quarter";
      case "3rd-quarter-break": return "Quarter Break";
      case "4th-quarter": return "4th Quarter";
      case "ot": return "Overtime";
      case "completed": return "Match Completed";
      default: return period;
    }
  }

  // 5. NAVIGATION & GENERAL ROUTING
  function hideAllBbViews() {
    const views = [
      els.setupView,
      els.dashboardView,
      els.tsetupView,
      els.tdashboardView
    ];
    views.forEach(v => {
      if (v) v.classList.add("hidden");
    });
  }

  window.showBasketballPage = function (fromHash = false) {
    if (!fromHash) window.location.hash = "#basketball";

    // Hide cricket and football wrapper pages
    const cp = document.querySelector("#cricket-page");
    const fp = document.querySelector("#football-page");
    const sp = document.querySelector("#sports-page");
    const fop = document.querySelector("#format-page");
    if (cp) cp.classList.add("hidden");
    if (fp) fp.classList.add("hidden");
    if (sp) sp.classList.add("hidden");
    if (fop) fop.classList.add("hidden");

    if (els.basketballPage) els.basketballPage.classList.remove("hidden");

    hideAllBbViews();

    const hash = window.location.hash;
    if (hash === "#basketball") {
      if (els.setupView) els.setupView.classList.remove("hidden");
      // Clear inputs
      if (els.teamAInput) els.teamAInput.value = "";
      if (els.teamBInput) els.teamBInput.value = "";
      if (els.modeSimple) els.modeSimple.classList.add("active");
      if (els.modeAdvanced) els.modeAdvanced.classList.remove("active");
    } else if (hash === "#basketball-match") {
      if (els.dashboardView) els.dashboardView.classList.remove("hidden");
      renderBbDashboard();
    } else if (hash === "#basketball-tsetup") {
      if (els.tsetupView) els.tsetupView.classList.remove("hidden");
      renderTournamentTeamInputs();
    } else if (hash === "#basketball-tdashboard") {
      if (els.tdashboardView) els.tdashboardView.classList.remove("hidden");
      renderTournamentDashboard();
    }
  };

  // Local storage loaders
  function loadBbState() {
    try {
      const stored = localStorage.getItem(BB_STORAGE_KEY);
      const storedT = localStorage.getItem(BBT_STORAGE_KEY);

      if (stored) {
        bb = { ...clone(defaultBbState), ...JSON.parse(stored) };
        if (bb.matchTimer) {
          bb.matchTimer = { ...clone(defaultBbState.matchTimer), ...bb.matchTimer };
        }
      }
      if (storedT) {
        bbt = { ...clone(defaultBbtState), ...JSON.parse(storedT) };
      }
    } catch (e) {
      console.error("Failed to load basketball states: ", e);
    }
  }

  function saveBbState() {
    try {
      localStorage.setItem(BB_STORAGE_KEY, JSON.stringify(bb));
      localStorage.setItem(BBT_STORAGE_KEY, JSON.stringify(bbt));
    } catch (e) {
      console.error("Failed to save basketball states: ", e);
    }
  }

  // 6. GAME CLOCK TIMER LOOP
  function startBbTimer() {
    if (bbTimerInterval) clearInterval(bbTimerInterval);
    bbTimerInterval = setInterval(() => {
      if (!bb.active || !bb.matchTimer.running) {
        clearInterval(bbTimerInterval);
        return;
      }

      const totalTargetSecs = getPeriodSeconds(bb.period, bb.quarterDuration, bb.otDuration);

      if (bb.matchTimer.breakSecondsRemaining !== undefined) {
        // Countdown breaks
        bb.matchTimer.breakSecondsRemaining--;
        if (bb.matchTimer.breakSecondsRemaining <= 0) {
          bb.matchTimer.breakSecondsRemaining = undefined;
          bb.matchTimer.running = false;
          playBbBuzzerSound();
          
          // Switch to next active quarter/period
          if (bb.period === "1st-quarter-break") {
            bb.period = "2nd-quarter";
            bb.matchTimer.seconds = 0;
          } else if (bb.period === "halftime") {
            bb.period = "3rd-quarter";
            bb.matchTimer.seconds = 0;
            // Reset team fouls for new half
            bb.foulsA = 0;
            bb.foulsB = 0;
          } else if (bb.period === "3rd-quarter-break") {
            bb.period = "4th-quarter";
            bb.matchTimer.seconds = 0;
          }
          triggerBbToast("Break finished! Resume play.");
        }
      } else {
        // Ticking active game time
        bb.matchTimer.seconds++;
        
        if (bb.matchTimer.seconds >= totalTargetSecs) {
          bb.matchTimer.running = false;
          playBbBuzzerSound();

          // End of period routing
          if (bb.period === "1st-quarter") {
            bb.period = "1st-quarter-break";
            bb.matchTimer.breakSecondsRemaining = getBreakSeconds(bb.period);
          } else if (bb.period === "2nd-quarter") {
            bb.period = "halftime";
            bb.matchTimer.breakSecondsRemaining = getBreakSeconds(bb.period);
          } else if (bb.period === "3rd-quarter") {
            bb.period = "3rd-quarter-break";
            bb.matchTimer.breakSecondsRemaining = getBreakSeconds(bb.period);
          } else if (bb.period === "4th-quarter") {
            if (bb.overtimeEnabled && bb.scoreA === bb.scoreB) {
              bb.period = "ot";
              bb.matchTimer.seconds = 0;
              triggerBbToast("Regulation tied! Heading to Overtime!");
            } else {
              bb.period = "completed";
              triggerBbToast("Match finished!");
            }
          } else if (bb.period === "ot") {
            if (bb.scoreA === bb.scoreB) {
              // Play another overtime if still tied
              bb.matchTimer.seconds = 0;
              triggerBbToast("Overtime tied! Heading to double Overtime!");
            } else {
              bb.period = "completed";
              triggerBbToast("Match finished!");
            }
          }
        }
      }

      saveBbState();
      renderBbDashboard();
    }, 1000);
  }

  function stopBbTimer() {
    if (bbTimerInterval) clearInterval(bbTimerInterval);
    bb.matchTimer.running = false;
    saveBbState();
    renderBbDashboard();
  }

  function formatTimeDisplay(seconds) {
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  }

  // 7. SETUP EVENT LISTENERS
  if (els.setupBackBtn) {
    els.setupBackBtn.addEventListener("click", () => {
      window.location.hash = "#sports";
    });
  }

  // Toggle Scoring Modes
  if (els.modeSimple && els.modeAdvanced) {
    els.modeSimple.addEventListener("click", () => {
      els.modeSimple.classList.add("active");
      els.modeAdvanced.classList.remove("active");
    });
    els.modeAdvanced.addEventListener("click", () => {
      els.modeAdvanced.classList.add("active");
      els.modeSimple.classList.remove("active");
    });
  }

  if (els.overtimeInput && els.otSetupContainer) {
    els.overtimeInput.addEventListener("change", () => {
      els.otSetupContainer.style.display = els.overtimeInput.checked ? "block" : "none";
    });
  }

  // Start match
  if (els.startBtn) {
    els.startBtn.addEventListener("click", () => {
      const tA = els.teamAInput.value.trim() || "Team 1";
      const tB = els.teamBInput.value.trim() || "Team 2";

      if (tA.toLowerCase() === tB.toLowerCase()) {
        triggerBbToast("Team names must be unique. Please use different names.");
        return;
      }

      const isAdv = els.modeAdvanced.classList.contains("active");
      const qDuration = Math.max(1, Math.min(20, Number(els.quarterDurationInput.value) || 10));
      const tLimit = Math.max(1, Math.min(10, Number(els.timeoutsInput.value) || 5));
      const fLimit = Math.max(3, Math.min(8, Number(els.foulLimitInput.value) || 5));
      const otEnabled = els.overtimeInput.checked;
      const otDuration = Math.max(1, Math.min(15, Number(els.otDurationInput.value) || 5));

      if (isAdv) {
        // Trigger Advanced Squad Roster modal
        openSquadRegisterModal(tA, tB, 5, 5, (rosterA, rosterB) => {
          initializeBbMatch(tA, tB, "advanced", qDuration, tLimit, fLimit, otEnabled, otDuration, rosterA, rosterB);
        });
      } else {
        initializeBbMatch(tA, tB, "simple", qDuration, tLimit, fLimit, otEnabled, otDuration, [], []);
      }
    });
  }

  function initializeBbMatch(teamA, teamB, mode, qDuration, tLimit, fLimit, otEnabled, otDuration, rosterA, rosterB) {
    bb = clone(defaultBbState);
    bb.active = true;
    bb.isTournamentMatch = false;
    bb.scoringMode = mode;
    bb.teamA = teamA;
    bb.teamB = teamB;
    bb.quarterDuration = qDuration;
    bb.timeoutsLimit = tLimit;
    bb.foulOutLimit = fLimit;
    bb.overtimeEnabled = otEnabled;
    bb.otDuration = otDuration;
    
    bb.timeoutsA = tLimit;
    bb.timeoutsB = tLimit;
    
    bb.rosterA = rosterA;
    bb.rosterB = rosterB;
    bb.period = "1st-quarter";

    saveBbState();
    window.location.hash = "#basketball-match";
  }

  // 8. SCORER DASHBOARD VIEWS & TRIGGERS
  function logEvent(type, team, detail) {
    const isBreak = bb.matchTimer.breakSecondsRemaining !== undefined;
    const currentSecs = isBreak ? bb.matchTimer.breakSecondsRemaining : bb.matchTimer.seconds;
    const timeDisplay = formatTimeDisplay(currentSecs);
    const quarterLabel = getPeriodDisplayLabel(bb.period);
    
    bb.timeline.unshift({
      period: quarterLabel,
      time: timeDisplay,
      team: team || "N/A",
      type,
      detail
    });
  }

  function addPointsSimple(team, pts) {
    if (team === "A") {
      bb.scoreA += pts;
      logEvent("score", bb.teamA, `+${pts} Points (Score: ${bb.scoreA}-${bb.scoreB})`);
    } else {
      bb.scoreB += pts;
      logEvent("score", bb.teamB, `+${pts} Points (Score: ${bb.scoreA}-${bb.scoreB})`);
    }
    saveBbState();
    renderBbDashboard();
  }

  function recordFoulSimple(team) {
    if (team === "A") {
      bb.foulsA++;
      logEvent("foul", bb.teamA, `Team Foul #${bb.foulsA}`);
      if (bb.foulsA >= 4) triggerBbToast(`Bonus free throws active for ${bb.teamB}!`);
    } else {
      bb.foulsB++;
      logEvent("foul", bb.teamB, `Team Foul #${bb.foulsB}`);
      if (bb.foulsB >= 4) triggerBbToast(`Bonus free throws active for ${bb.teamA}!`);
    }
    saveBbState();
    renderBbDashboard();
  }

  function callTimeout(team) {
    if (bb.matchTimer.breakSecondsRemaining !== undefined) return; // Cannot call during a break
    
    if (team === "A") {
      if (bb.timeoutsA <= 0) {
        triggerBbToast("No timeouts remaining for Team A!");
        return;
      }
      bb.timeoutsA--;
      logEvent("timeout", bb.teamA, `Timeout called (${bb.timeoutsA} left)`);
    } else {
      if (bb.timeoutsB <= 0) {
        triggerBbToast("No timeouts remaining for Team B!");
        return;
      }
      bb.timeoutsB--;
      logEvent("timeout", bb.teamB, `Timeout called (${bb.timeoutsB} left)`);
    }

    // Stop match timer, launch 60-second timeout timer
    stopBbTimer();
    bb.matchTimer.breakSecondsRemaining = 60; // 60s timeout
    bb.matchTimer.running = true;
    startBbTimer();
  }

  // Bind simple buttons
  if (els.simpleA1pt) els.simpleA1pt.addEventListener("click", () => addPointsSimple("A", 1));
  if (els.simpleA2pt) els.simpleA2pt.addEventListener("click", () => addPointsSimple("A", 2));
  if (els.simpleA3pt) els.simpleA3pt.addEventListener("click", () => addPointsSimple("A", 3));
  if (els.simpleAFoul) els.simpleAFoul.addEventListener("click", () => recordFoulSimple("A"));

  if (els.simpleB1pt) els.simpleB1pt.addEventListener("click", () => addPointsSimple("B", 1));
  if (els.simpleB2pt) els.simpleB2pt.addEventListener("click", () => addPointsSimple("B", 2));
  if (els.simpleB3pt) els.simpleB3pt.addEventListener("click", () => addPointsSimple("B", 3));
  if (els.simpleBFoul) els.simpleBFoul.addEventListener("click", () => recordFoulSimple("B"));

  if (els.timeoutABtn) els.timeoutABtn.addEventListener("click", () => callTimeout("A"));
  if (els.timeoutBBtn) els.timeoutBBtn.addEventListener("click", () => callTimeout("B"));

  // Timer play / pause
  if (els.timerToggleBtn) {
    els.timerToggleBtn.addEventListener("click", () => {
      if (bb.period === "completed") return;
      if (bb.matchTimer.running) {
        stopBbTimer();
      } else {
        bb.matchTimer.running = true;
        els.timerToggleBtn.textContent = "⏸️ Pause Clock";
        els.timerToggleBtn.style.background = "#f59e0b !important";
        startBbTimer();
      }
    });
  }

  // Period transitions
  if (els.periodTransitionBtn) {
    els.periodTransitionBtn.addEventListener("click", () => {
      if (bb.period === "completed") return;

      bb.matchTimer.running = false;
      stopBbTimer();

      // Force transition
      if (bb.period === "1st-quarter") {
        bb.period = "1st-quarter-break";
        bb.matchTimer.breakSecondsRemaining = getBreakSeconds(bb.period);
      } else if (bb.period === "1st-quarter-break") {
        bb.period = "2nd-quarter";
        bb.matchTimer.seconds = 0;
        bb.matchTimer.breakSecondsRemaining = undefined;
      } else if (bb.period === "2nd-quarter") {
        bb.period = "halftime";
        bb.matchTimer.breakSecondsRemaining = getBreakSeconds(bb.period);
      } else if (bb.period === "halftime") {
        bb.period = "3rd-quarter";
        bb.matchTimer.seconds = 0;
        bb.matchTimer.breakSecondsRemaining = undefined;
        bb.foulsA = 0;
        bb.foulsB = 0;
      } else if (bb.period === "3rd-quarter") {
        bb.period = "3rd-quarter-break";
        bb.matchTimer.breakSecondsRemaining = getBreakSeconds(bb.period);
      } else if (bb.period === "3rd-quarter-break") {
        bb.period = "4th-quarter";
        bb.matchTimer.seconds = 0;
        bb.matchTimer.breakSecondsRemaining = undefined;
      } else if (bb.period === "4th-quarter" || bb.period === "ot") {
        if (bb.overtimeEnabled && bb.scoreA === bb.scoreB) {
          bb.period = "ot";
          bb.matchTimer.seconds = 0;
          bb.matchTimer.breakSecondsRemaining = undefined;
        } else {
          bb.period = "completed";
        }
      }

      saveBbState();
      renderBbDashboard();
    });
  }

  // Reset match
  if (els.resetMatchBtn) {
    els.resetMatchBtn.addEventListener("click", () => {
      if (confirm("Are you sure you want to reset this match? All stats will be wiped.")) {
        stopBbTimer();
        
        bb.scoreA = 0;
        bb.scoreB = 0;
        bb.foulsA = 0;
        bb.foulsB = 0;
        bb.timeoutsA = bb.timeoutsLimit;
        bb.timeoutsB = bb.timeoutsLimit;
        bb.period = "1st-quarter";
        bb.matchTimer.seconds = 0;
        bb.matchTimer.breakSecondsRemaining = undefined;
        bb.timeline = [];
        
        // Reset player advanced stats
        bb.rosterA.forEach(p => {
          p.pts = 0; p.ast = 0; p.rebOff = 0; p.rebDef = 0; p.stl = 0; p.blk = 0; p.fouls = 0;
        });
        bb.rosterB.forEach(p => {
          p.pts = 0; p.ast = 0; p.rebOff = 0; p.rebDef = 0; p.stl = 0; p.blk = 0; p.fouls = 0;
        });

        saveBbState();
        renderBbDashboard();
      }
    });
  }

  if (els.dashboardBackBtn) {
    els.dashboardBackBtn.addEventListener("click", () => {
      stopBbTimer();
      if (bb.isTournamentMatch && bbt.active && bbt.activeFixtureIndex !== -1) {
        bbt.fixtures[bbt.activeFixtureIndex].matchState = clone(bb);
        bb.active = false;
        saveBbState();
        window.location.hash = "#basketball-tdashboard";
      } else {
        bb.active = false;
        saveBbState();
        window.location.hash = "#basketball";
      }
    });
  }

  // 9. ADVANCED MODE INTERACTIVE COURT RENDERING
  function renderAdvancedCourt() {
    if (!els.courtPlayersContainer) return;
    els.courtPlayersContainer.innerHTML = "";

    // Render Team A court positions (Left Half)
    const onCourtA = bb.rosterA.filter(p => p.active);
    onCourtA.forEach((p, idx) => {
      // 5 typical basketball court spots:
      // Point Guard (Center), Shooting Guard (Top), Small Forward (Bottom), Power Forward (Mid-Inner Top), Center (Inner Bottom)
      const positions = [
        { y: 50, x: 28 }, // PG
        { y: 22, x: 26 }, // SG
        { y: 78, x: 26 }, // SF
        { y: 35, x: 12 }, // PF
        { y: 65, x: 12 }  // C
      ];
      const pos = positions[idx] || { y: 50, x: 20 };
      
      const div = document.createElement("div");
      div.className = "bb-court-player teamA";
      div.style.top = `${pos.y}%`;
      div.style.left = `${pos.x}%`;
      div.textContent = p.number;
      div.title = `${p.name} (Jersey #${p.number})`;
      
      div.addEventListener("click", () => openActionModal("A", p.number));
      els.courtPlayersContainer.appendChild(div);
    });

    // Render Team B court positions (Right Half - Mirrored)
    const onCourtB = bb.rosterB.filter(p => p.active);
    onCourtB.forEach((p, idx) => {
      const positions = [
        { y: 50, x: 72 }, // PG
        { y: 22, x: 74 }, // SG
        { y: 78, x: 74 }, // SF
        { y: 35, x: 88 }, // PF
        { y: 65, x: 88 }  // C
      ];
      const pos = positions[idx] || { y: 50, x: 80 };

      const div = document.createElement("div");
      div.className = "bb-court-player teamB";
      div.style.top = `${pos.y}%`;
      div.style.left = `${pos.x}%`;
      div.textContent = p.number;
      div.title = `${p.name} (Jersey #${p.number})`;

      div.addEventListener("click", () => openActionModal("B", p.number));
      els.courtPlayersContainer.appendChild(div);
    });
  }

  // 10. MODAL HANDLING & ACTIONS CONFIGURATION
  function openActionModal(team, number) {
    activeSelectedPlayer = { team, number };
    const roster = team === "A" ? bb.rosterA : bb.rosterB;
    const player = roster.find(p => p.number === number);
    if (!player) return;

    if (els.modalPlayerTitle) {
      els.modalPlayerTitle.textContent = `${player.name} (${team === "A" ? bb.teamA : bb.teamB})`;
    }
    if (els.modalPlayerSubtitle) {
      els.modalPlayerSubtitle.textContent = `Jersey #${player.number} • Fouls: ${player.fouls}/${bb.foulOutLimit} • Points: ${player.pts}`;
    }

    // Disable Action Buttons if player is fouled out
    const isFouledOut = player.fouls >= bb.foulOutLimit;
    const actionBtns = [els.action1pt, els.action2pt, els.action3pt, els.actionAssist, els.actionRebound, els.actionSteal, els.actionBlock];
    actionBtns.forEach(btn => {
      if (btn) {
        btn.disabled = isFouledOut;
        btn.style.opacity = isFouledOut ? "0.4" : "1";
      }
    });

    if (els.actionModal) els.actionModal.classList.remove("hidden");
  }

  if (els.closeActionModal) {
    els.closeActionModal.addEventListener("click", () => {
      if (els.actionModal) els.actionModal.classList.add("hidden");
      activeSelectedPlayer = null;
    });
  }

  // Action Menu stats logging listeners
  function applyPlayerStat(type, scoreVal = 0) {
    if (!activeSelectedPlayer) return;
    const { team, number } = activeSelectedPlayer;
    const roster = team === "A" ? bb.rosterA : bb.rosterB;
    const p = roster.find(player => player.number === number);
    if (!p) return;

    const tName = team === "A" ? bb.teamA : bb.teamB;

    if (type === "pts") {
      p.pts = (p.pts || 0) + scoreVal;
      if (team === "A") bb.scoreA += scoreVal;
      else bb.scoreB += scoreVal;
      
      logEvent("score", tName, `${p.name} (#${p.number}) scored ${scoreVal} PTs (Score: ${bb.scoreA}-${bb.scoreB})`);
    } else if (type === "ast") {
      p.ast = (p.ast || 0) + 1;
      logEvent("assist", tName, `Assist by ${p.name}`);
    } else if (type === "reb") {
      p.rebDef = (p.rebDef || 0) + 1;
      logEvent("rebound", tName, `Rebound by ${p.name}`);
    } else if (type === "stl") {
      p.stl = (p.stl || 0) + 1;
      logEvent("steal", tName, `Steal by ${p.name}`);
    } else if (type === "blk") {
      p.blk = (p.blk || 0) + 1;
      logEvent("block", tName, `Block by ${p.name}`);
    } else if (type === "foul") {
      p.fouls = (p.fouls || 0) + 1;
      logEvent("foul", tName, `Personal Foul on ${p.name} (#${p.fouls}/${bb.foulOutLimit})`);
      
      // Increment Team fouls
      if (team === "A") {
        bb.foulsA++;
        if (bb.foulsA >= 4) triggerBbToast(`Bonus free throws active for ${bb.teamB}!`);
      } else {
        bb.foulsB++;
        if (bb.foulsB >= 4) triggerBbToast(`Bonus free throws active for ${bb.teamA}!`);
      }

      if (p.fouls >= bb.foulOutLimit) {
        triggerBbToast(`🚨 ${p.name} has fouled out of the match! Substitution required.`);
        p.active = false; // Player leaves court
      }
    }

    saveBbState();
    renderBbDashboard();
    if (els.actionModal) els.actionModal.classList.add("hidden");
    activeSelectedPlayer = null;
  }

  if (els.action1pt) els.action1pt.addEventListener("click", () => applyPlayerStat("pts", 1));
  if (els.action2pt) els.action2pt.addEventListener("click", () => applyPlayerStat("pts", 2));
  if (els.action3pt) els.action3pt.addEventListener("click", () => applyPlayerStat("pts", 3));
  if (els.actionAssist) els.actionAssist.addEventListener("click", () => applyPlayerStat("ast"));
  if (els.actionRebound) els.actionRebound.addEventListener("click", () => applyPlayerStat("reb"));
  if (els.actionSteal) els.actionSteal.addEventListener("click", () => applyPlayerStat("stl"));
  if (els.actionBlock) els.actionBlock.addEventListener("click", () => applyPlayerStat("blk"));
  if (els.actionFoul) els.actionFoul.addEventListener("click", () => applyPlayerStat("foul"));
  
  // Substitutions modal triggers
  function launchSubModal(team) {
    const roster = team === "A" ? bb.rosterA : bb.rosterB;
    const court = roster.filter(p => p.active);
    const bench = roster.filter(p => !p.active && p.fouls < bb.foulOutLimit);

    if (els.subOffSelect && els.subOnSelect) {
      els.subOffSelect.innerHTML = court.map(p => `<option value="${p.number}">${p.name} (#${p.number})</option>`).join("");
      els.subOnSelect.innerHTML = bench.map(p => `<option value="${p.number}">${p.name} (#${p.number})</option>`).join("");
    }

    if (bench.length === 0) {
      triggerBbToast("No eligible players remaining on the bench!");
      return;
    }

    if (els.subModal) els.subModal.classList.remove("hidden");
    
    // Save target team flag temporarily
    els.subConfirmBtn.setAttribute("data-sub-team", team);
  }

  if (els.actionSub) {
    els.actionSub.addEventListener("click", () => {
      if (els.actionModal) els.actionModal.classList.add("hidden");
      if (activeSelectedPlayer) {
        launchSubModal(activeSelectedPlayer.team);
      }
    });
  }

  if (els.closeSubModal) {
    els.closeSubModal.addEventListener("click", () => {
      if (els.subModal) els.subModal.classList.add("hidden");
    });
  }

  if (els.subAShortcut) els.subAShortcut.addEventListener("click", () => launchSubModal("A"));
  if (els.subBShortcut) els.subBShortcut.addEventListener("click", () => launchSubModal("B"));

  if (els.subConfirmBtn) {
    els.subConfirmBtn.addEventListener("click", () => {
      const team = els.subConfirmBtn.getAttribute("data-sub-team");
      const numOff = Number(els.subOffSelect.value);
      const numOn = Number(els.subOnSelect.value);

      const roster = team === "A" ? bb.rosterA : bb.rosterB;
      const pOff = roster.find(p => p.number === numOff);
      const pOn = roster.find(p => p.number === numOn);

      if (pOff && pOn) {
        pOff.active = false;
        pOn.active = true;
        logEvent("sub", team === "A" ? bb.teamA : bb.teamB, `🔄 Swap: ${pOn.name} enters for ${pOff.name}`);
        triggerBbToast(`Substitution complete! ${pOn.name} is now on court.`);
      }

      saveBbState();
      renderBbDashboard();
      if (els.subModal) els.subModal.classList.add("hidden");
    });
  }

  // 11. SQUAD REGISTER MODAL LOGIC
  function openSquadRegisterModal(tA, tB, activeCount, totalCount, callback) {
    if (!els.squadModal) return;

    if (els.squadTeamAHeader) els.squadTeamAHeader.textContent = `${tA} Players (5 active, remaining bench)`;
    if (els.squadTeamBHeader) els.squadTeamBHeader.textContent = `${tB} Players (5 active, remaining bench)`;

    if (els.squadTeamAInputs && els.squadTeamBInputs) {
      els.squadTeamAInputs.innerHTML = "";
      els.squadTeamBInputs.innerHTML = "";
      
      const count = 8; // Default 8 players total per team (5 active, 3 bench)
      for (let i = 0; i < count; i++) {
        // Team A Player Row
        const divA = document.createElement("div");
        divA.style.display = "flex"; divA.style.gap = "10px";
        divA.innerHTML = `
          <input type="number" class="bb-rosterA-num-input" placeholder="#" value="${i + 1}" style="width: 60px; height: 36px; background: rgba(0,0,0,0.25); border: 1px solid rgba(255,255,255,0.1); border-radius: 6px; color:#fff; text-align:center; font-size:0.85rem;" />
          <input type="text" class="bb-rosterA-name-input" placeholder="Player ${i + 1} Name" style="flex:1; height:36px; background: rgba(0,0,0,0.25); border: 1px solid rgba(255,255,255,0.1); border-radius: 6px; color:#fff; padding: 0 10px; font-size:0.85rem;" />
        `;
        els.squadTeamAInputs.appendChild(divA);

        // Team B Player Row
        const divB = document.createElement("div");
        divB.style.display = "flex"; divB.style.gap = "10px";
        divB.innerHTML = `
          <input type="number" class="bb-rosterB-num-input" placeholder="#" value="${i + 1}" style="width: 60px; height: 36px; background: rgba(0,0,0,0.25); border: 1px solid rgba(255,255,255,0.1); border-radius: 6px; color:#fff; text-align:center; font-size:0.85rem;" />
          <input type="text" class="bb-rosterB-name-input" placeholder="Player ${i + 1} Name" style="flex:1; height:36px; background: rgba(0,0,0,0.25); border: 1px solid rgba(255,255,255,0.1); border-radius: 6px; color:#fff; padding: 0 10px; font-size:0.85rem;" />
        `;
        els.squadTeamBInputs.appendChild(divB);
      }
    }

    if (els.squadModal) els.squadModal.classList.remove("hidden");

    // Rebind save listener
    const saveBtn = els.squadSaveBtn;
    const newBtn = saveBtn.cloneNode(true);
    saveBtn.parentNode.replaceChild(newBtn, saveBtn);
    els.squadSaveBtn = newBtn;

    els.squadSaveBtn.addEventListener("click", () => {
      const inputsNumA = document.querySelectorAll(".bb-rosterA-num-input");
      const inputsNameA = document.querySelectorAll(".bb-rosterA-name-input");
      const inputsNumB = document.querySelectorAll(".bb-rosterB-num-input");
      const inputsNameB = document.querySelectorAll(".bb-rosterB-name-input");

      const rosterA = [];
      const rosterB = [];

      // Validate uniqueness
      const uniqueNames = new Set();
      const uniqueNums = new Set();

      for (let i = 0; i < inputsNameA.length; i++) {
        const name = inputsNameA[i].value.trim();
        const num = Number(inputsNumA[i].value);

        if (!name) {
          triggerBbToast("Please fill all player names first.");
          return;
        }

        const nameKey = name.toLowerCase();
        if (uniqueNames.has(nameKey) || uniqueNums.has(num)) {
          triggerBbToast(`Jersey numbers and names must be unique! Duplicate: ${name} (#${num})`);
          return;
        }
        uniqueNames.add(nameKey);
        uniqueNums.add(num);

        rosterA.push({
          name,
          number: num,
          pts: 0, ast: 0, rebOff: 0, rebDef: 0, stl: 0, blk: 0, fouls: 0,
          active: i < 5 // First 5 on-court
        });
      }

      uniqueNames.clear();
      uniqueNums.clear();

      for (let i = 0; i < inputsNameB.length; i++) {
        const name = inputsNameB[i].value.trim();
        const num = Number(inputsNumB[i].value);

        if (!name) {
          triggerBbToast("Please fill all player names first.");
          return;
        }

        const nameKey = name.toLowerCase();
        if (uniqueNames.has(nameKey) || uniqueNums.has(num)) {
          triggerBbToast(`Jersey numbers and names must be unique! Duplicate: ${name} (#${num})`);
          return;
        }
        uniqueNames.add(nameKey);
        uniqueNums.add(num);

        rosterB.push({
          name,
          number: num,
          pts: 0, ast: 0, rebOff: 0, rebDef: 0, stl: 0, blk: 0, fouls: 0,
          active: i < 5 // First 5 on-court
        });
      }

      if (els.squadModal) els.squadModal.classList.add("hidden");
      callback(rosterA, rosterB);
    });
  }

  if (els.closeSquadModal) {
    els.closeSquadModal.addEventListener("click", () => {
      if (els.squadModal) els.squadModal.classList.add("hidden");
    });
  }

  // 12. RENDER DASHBOARD INTERACTIVE DETAILS
  function renderBbDashboard() {
    if (!bb.active) return;

    if (els.teamAName) els.teamAName.textContent = bb.teamA;
    if (els.teamBName) els.teamBName.textContent = bb.teamB;
    if (els.teamAScore) els.teamAScore.textContent = bb.scoreA;
    if (els.teamBScore) els.teamBScore.textContent = bb.scoreB;
    if (els.teamAFouls) {
      els.teamAFouls.textContent = bb.foulsA;
      els.teamAFouls.className = bb.foulsA >= 4 ? "bb-team-foul-badge bonus" : "bb-team-foul-badge";
    }
    if (els.teamBFouls) {
      els.teamBFouls.textContent = bb.foulsB;
      els.teamBFouls.className = bb.foulsB >= 4 ? "bb-team-foul-badge bonus" : "bb-team-foul-badge";
    }
    if (els.teamATimeouts) els.teamATimeouts.textContent = bb.timeoutsA;
    if (els.teamBTimeouts) els.teamBTimeouts.textContent = bb.timeoutsB;

    if (els.clockPeriod) els.clockPeriod.textContent = getPeriodDisplayLabel(bb.period);

    // Active Timer display
    if (els.clockTime) {
      if (bb.matchTimer.breakSecondsRemaining !== undefined) {
        els.clockTime.textContent = formatTimeDisplay(bb.matchTimer.breakSecondsRemaining);
        els.clockTime.style.color = "#f87171"; // Red countdown for timeouts/breaks
      } else {
        const targetLimit = getPeriodSeconds(bb.period, bb.quarterDuration, bb.otDuration);
        const remSecs = Math.max(0, targetLimit - bb.matchTimer.seconds);
        els.clockTime.textContent = formatTimeDisplay(remSecs);
        els.clockTime.style.color = "#fff";
      }
    }

    if (els.liveIndicator) {
      els.liveIndicator.style.display = bb.matchTimer.running ? "inline-flex" : "none";
    }

    if (els.timerToggleBtn) {
      els.timerToggleBtn.textContent = bb.matchTimer.running ? "⏸️ Pause Clock" : "⏱️ Start Clock";
    }

    // Toggle button transition text
    if (els.periodTransitionBtn) {
      let labelText = "End Quarter";
      if (bb.period === "1st-quarter-break") labelText = "Start 2nd Quarter";
      else if (bb.period === "2nd-quarter") labelText = "Halftime Break";
      else if (bb.period === "halftime") labelText = "Start 3rd Quarter";
      else if (bb.period === "3rd-quarter-break") labelText = "Start 4th Quarter";
      else if (bb.period === "4th-quarter") {
        labelText = (bb.overtimeEnabled && bb.scoreA === bb.scoreB) ? "End Regulation (OT)" : "End Match";
      } else if (bb.period === "ot") {
        labelText = bb.scoreA === bb.scoreB ? "End OT (Tied)" : "End Match";
      } else if (bb.period === "completed") {
        labelText = "Match Completed";
      }
      els.periodTransitionBtn.textContent = labelText;
      els.periodTransitionBtn.disabled = bb.period === "completed";
      els.periodTransitionBtn.style.opacity = bb.period === "completed" ? "0.4" : "1";
    }

    // Scoring mode switches
    const isAdv = bb.scoringMode === "advanced";
    if (els.simpleScorerPanel) els.simpleScorerPanel.style.display = isAdv ? "none" : "grid";
    if (els.advancedScorerPanel) els.advancedScorerPanel.style.display = isAdv ? "grid" : "none";

    if (els.submitResultBtn) {
      if (bb.isTournamentMatch) {
        els.submitResultBtn.classList.remove("hidden");
      } else {
        els.submitResultBtn.classList.add("hidden");
      }
    }

    if (isAdv) {
      renderAdvancedCourt();
    }

    // Render Timeline Log Event
    if (els.timelineList) {
      if (bb.timeline.length === 0) {
        els.timelineList.innerHTML = `<p style="color: var(--text-muted); font-style: italic; font-size: 0.9rem; margin: 0;">No events logged yet.</p>`;
      } else {
        els.timelineList.innerHTML = bb.timeline.map(e => `
          <div style="background: rgba(255,255,255,0.01); border: 1px solid rgba(255,255,255,0.03); border-radius: 8px; padding: 10px; display: flex; justify-content: space-between; font-size: 0.85rem;">
            <div>
              <span style="color: var(--gold); font-weight: 700;">[${e.period}]</span>
              <span style="color: var(--text-muted); font-family: monospace; margin: 0 6px;">${e.time}</span>
              <span style="color: #fff; font-weight: 700;">${e.team}:</span>
              <span style="color: var(--ink); margin-left: 4px;">${e.detail}</span>
            </div>
          </div>
        `).join("");
      }
    }
  }

  // 13. BASKETBALL TOURNAMENT LEAGUE RULES ENGINE
  function renderTournamentTeamInputs() {
    if (!els.tteamInputs) return;
    els.tteamInputs.innerHTML = "";

    const count = els.tteamCount ? Number(els.tteamCount.value) : 4;
    for (let i = 0; i < count; i++) {
      const div = document.createElement("div");
      div.className = "setup-group";
      div.innerHTML = `
        <label style="display: block; font-size: 0.8rem; color: var(--text-muted); margin-bottom: 6px; font-weight: 600;">Team ${i + 1} Name</label>
        <input type="text" class="basketball-tteam-name-input" placeholder="Enter Team ${i + 1} Name" autocomplete="off" style="width: 100%; height: 40px; background: rgba(0,0,0,0.2); border: 1px solid rgba(255,255,255,0.1); border-radius: 8px; color: var(--ink); padding: 0 12px; font-family: inherit; font-size: 0.9rem;" />
      `;
      els.tteamInputs.appendChild(div);
    }
  }

  if (els.tteamCount) {
    els.tteamCount.addEventListener("change", renderTournamentTeamInputs);
  }

  if (els.tsetupBackBtn) {
    els.tsetupBackBtn.addEventListener("click", () => {
      window.location.hash = "#basketball";
    });
  }

  if (els.tmodeSimple && els.tmodeAdvanced) {
    els.tmodeSimple.addEventListener("click", () => {
      els.tmodeSimple.classList.add("active");
      els.tmodeAdvanced.classList.remove("active");
    });
    els.tmodeAdvanced.addEventListener("click", () => {
      els.tmodeAdvanced.classList.add("active");
      els.tmodeSimple.classList.remove("active");
    });
  }

  if (els.tcreateBtn) {
    els.tcreateBtn.addEventListener("click", () => {
      const name = els.tnameInput.value.trim() || "Basketball Tournament Cup";
      const teamCount = Number(els.tteamCount.value) || 4;
      const duration = Math.max(1, Math.min(20, Number(els.tdurationInput.value) || 10));
      const isAdv = els.tmodeAdvanced.classList.contains("active");

      // Validate unique names
      const teamInputs = document.querySelectorAll(".basketball-tteam-name-input");
      const teamNames = [];
      const uniqueNames = new Set();

      for (let i = 0; i < teamInputs.length; i++) {
        const tName = teamInputs[i].value.trim() || `Team ${i + 1}`;
        const nameKey = tName.toLowerCase();
        if (uniqueNames.has(nameKey)) {
          triggerBbToast(`Team names must be unique. Duplicate found: "${tName}"`);
          return;
        }
        uniqueNames.add(nameKey);
        teamNames.push(tName);
      }

      bbt = clone(defaultBbtState);
      bbt.active = true;
      bbt.name = name;
      bbt.teamCount = teamCount;
      bbt.scoringMode = isAdv ? "advanced" : "simple";
      
      bbt.teams = teamNames.map(t => ({
        name: t,
        played: 0,
        wins: 0,
        losses: 0,
        pf: 0, // points for
        pa: 0, // points against
        diff: 0,
        pts: 0, // 2 points for win, 0 for loss
        players: []
      }));

      // Generate round-robin fixtures schedule
      bbt.fixtures = [];
      const rounds = teamCount - 1;
      const halfSize = teamCount / 2;
      const list = [...teamNames];

      for (let r = 0; r < rounds * 2; r++) { // Double round-robin
        for (let i = 0; i < halfSize; i++) {
          const home = list[i];
          const away = list[teamCount - 1 - i];
          bbt.fixtures.push({
            round: r + 1,
            teamA: r % 2 === 0 ? home : away,
            teamB: r % 2 === 0 ? away : home,
            scoreA: 0,
            scoreB: 0,
            status: "scheduled",
            matchState: null
          });
        }
        // Rotate roster list
        const last = list.pop();
        list.splice(1, 0, last);
      }

      saveBbState();
      window.location.hash = "#basketball-tdashboard";
    });
  }

  // Tournament dashboard tab navigation
  const tabNames = ["table", "fixtures", "stats", "info", "edit"];
  tabNames.forEach(tab => {
    const btn = document.querySelector(`#bb-tab-${tab}`);
    if (btn) {
      btn.addEventListener("click", () => {
        tabNames.forEach(t => {
          const btn2 = document.querySelector(`#bb-tab-${t}`);
          const view2 = document.querySelector(`#bb-${t}-view`);
          if (btn2 && view2) {
            btn2.classList.remove("active");
            view2.classList.add("hidden");
          }
        });
        btn.classList.add("active");
        const activeView = document.querySelector(`#bb-${tab}-view`);
        if (activeView) activeView.classList.remove("hidden");

        if (tab === "table") renderPointsTable();
        else if (tab === "fixtures") renderFixtures();
        else if (tab === "stats") renderStats();
        else if (tab === "info") renderInfo();
        else if (tab === "edit") renderEditSetup();
      });
    }
  });

  // Table computations
  function renderPointsTable() {
    if (!bbt.active) return;
    
    // Reset table scores
    bbt.teams.forEach(t => {
      t.played = 0; t.wins = 0; t.losses = 0; t.pf = 0; t.pa = 0; t.diff = 0; t.pts = 0;
    });

    bbt.fixtures.forEach(f => {
      if (f.status === "completed") {
        const tA = bbt.teams.find(t => t.name === f.teamA);
        const tB = bbt.teams.find(t => t.name === f.teamB);
        if (tA && tB) {
          tA.played++;
          tB.played++;
          tA.pf += f.scoreA;
          tA.pa += f.scoreB;
          tB.pf += f.scoreB;
          tB.pa += f.scoreA;

          if (f.scoreA > f.scoreB) {
            tA.wins++;
            tA.pts += 2; // Basketball standard points: Win=2, Loss=0
            tB.losses++;
          } else {
            tB.wins++;
            tB.pts += 2;
            tA.losses++;
          }
        }
      }
    });

    bbt.teams.forEach(t => {
      t.diff = t.pf - t.pa;
    });

    // Sort: Pts DESC, Diff DESC, PF DESC
    const sorted = [...bbt.teams].sort((a, b) => {
      if (b.pts !== a.pts) return b.pts - a.pts;
      if (b.diff !== a.diff) return b.diff - a.diff;
      return b.pf - a.pf;
    });

    if (els.pointsTableBody) {
      els.pointsTableBody.innerHTML = sorted.map((t, idx) => `
        <tr style="border-bottom: 1px solid rgba(255,255,255,0.05); hover: background: rgba(255,255,255,0.01);">
          <td style="padding: 10px 8px; font-weight:700; color: var(--gold);">${idx + 1}</td>
          <td style="padding: 10px 8px; font-weight:700; color:#fff;">${t.name}</td>
          <td style="padding: 10px 8px;">${t.played}</td>
          <td style="padding: 10px 8px; color: #10b981;">${t.wins}</td>
          <td style="padding: 10px 8px; color: #f87171;">${t.losses}</td>
          <td style="padding: 10px 8px;">${t.pf}</td>
          <td style="padding: 10px 8px;">${t.pa}</td>
          <td style="padding: 10px 8px; color: ${t.diff >= 0 ? '#10b981' : '#f87171'};">${t.diff >= 0 ? '+' : ''}${t.diff}</td>
          <td style="padding: 10px 8px; font-weight:900; text-align:right; color: var(--bb-primary);">${t.pts}</td>
        </tr>
      `).join("");
    }
  }

  // Renders fixtures list
  function renderFixtures() {
    if (!els.fixturesList) return;
    els.fixturesList.innerHTML = "";

    bbt.fixtures.forEach((f, idx) => {
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
            <div style="font-family: monospace; font-size:1.6rem; font-weight:900; color:var(--bb-primary);">${f.scoreA} - ${f.scoreB}</div>
            <span style="background: rgba(16,185,129,0.15); color:#10b981; font-size:0.75rem; padding:4px 8px; border-radius:6px; font-weight:700; text-transform:uppercase;">Played</span>
          </div>
        `;
      } else {
        rightSide = `
          <button class="start-custom" type="button" data-fixture-index="${idx}" style="margin:0; padding:8px 16px; font-size:0.8rem; border-radius:6px; font-weight:700;">⏱️ Play Match</button>
        `;
      }

      card.innerHTML = leftSide + rightSide;
      els.fixturesList.appendChild(card);
    });

    // Bind play match listeners
    document.querySelectorAll("[data-fixture-index]").forEach(btn => {
      btn.addEventListener("click", (e) => {
        const idx = Number(e.currentTarget.getAttribute("data-fixture-index"));
        const fix = bbt.fixtures[idx];

        if (fix) {
          bbt.activeFixtureIndex = idx;
          if (fix.matchState) {
            bb = clone(fix.matchState);
          } else {
            // First time launching this fixture
            const tA = fix.teamA;
            const tB = fix.teamB;

            if (bbt.scoringMode === "advanced") {
              // Standard auto-filled rosters for league play (or squad popup can be launched)
              const rosterA = [];
              const rosterB = [];
              for (let i = 0; i < 8; i++) {
                rosterA.push({ name: `${tA} Player ${i + 1}`, number: i + 1, pts: 0, ast: 0, rebOff: 0, rebDef: 0, stl: 0, blk: 0, fouls: 0, active: i < 5 });
                rosterB.push({ name: `${tB} Player ${i + 1}`, number: i + 1, pts: 0, ast: 0, rebOff: 0, rebDef: 0, stl: 0, blk: 0, fouls: 0, active: i < 5 });
              }
              initializeBbTournamentMatch(tA, tB, "advanced", rosterA, rosterB);
            } else {
              initializeBbTournamentMatch(tA, tB, "simple", [], []);
            }
          }
        }
      });
    });
  }

  function initializeBbTournamentMatch(tA, tB, mode, rosterA, rosterB) {
    bb = clone(defaultBbState);
    bb.active = true;
    bb.isTournamentMatch = true;
    bb.scoringMode = mode;
    bb.teamA = tA;
    bb.teamB = tB;
    bb.quarterDuration = 10;
    bb.timeoutsLimit = 5;
    bb.foulOutLimit = 5;
    bb.overtimeEnabled = true;
    bb.otDuration = 5;
    bb.timeoutsA = 5;
    bb.timeoutsB = 5;
    bb.rosterA = rosterA;
    bb.rosterB = rosterB;
    bb.period = "1st-quarter";

    saveBbState();
    window.location.hash = "#basketball-match";
  }

  // Compile and render advanced tournament stats leaders
  function renderStats() {
    if (bbt.scoringMode !== "advanced") {
      if (els.leaderPoints) els.leaderPoints.innerHTML = `<p style="color:var(--text-muted); font-style:italic; font-size:0.85rem;">Stat tracking is only supported in Advanced Mode.</p>`;
      if (els.leaderAssists) els.leaderAssists.innerHTML = "";
      if (els.leaderRebounds) els.leaderRebounds.innerHTML = "";
      if (els.leaderDefense) els.leaderDefense.innerHTML = "";
      return;
    }

    const playersStats = {}; // name -> stats

    bbt.fixtures.forEach(f => {
      if (f.status === "completed" && f.matchState) {
        const ms = f.matchState;
        
        // Sum A
        ms.rosterA.forEach(p => {
          const key = p.name;
          if (!playersStats[key]) playersStats[key] = { name: p.name, team: ms.teamA, pts: 0, ast: 0, reb: 0, defense: 0 };
          playersStats[key].pts += (p.pts || 0);
          playersStats[key].ast += (p.ast || 0);
          playersStats[key].reb += ((p.rebDef || 0) + (p.rebOff || 0));
          playersStats[key].defense += ((p.blk || 0) + (p.stl || 0));
        });

        // Sum B
        ms.rosterB.forEach(p => {
          const key = p.name;
          if (!playersStats[key]) playersStats[key] = { name: p.name, team: ms.teamB, pts: 0, ast: 0, reb: 0, defense: 0 };
          playersStats[key].pts += (p.pts || 0);
          playersStats[key].ast += (p.ast || 0);
          playersStats[key].reb += ((p.rebDef || 0) + (p.rebOff || 0));
          playersStats[key].defense += ((p.blk || 0) + (p.stl || 0));
        });
      }
    });

    const list = Object.values(playersStats);
    
    // Sort and render leaders
    const topPts = [...list].sort((a,b) => b.pts - a.pts).slice(0, 5);
    const topAst = [...list].sort((a,b) => b.ast - a.ast).slice(0, 5);
    const topReb = [...list].sort((a,b) => b.reb - a.reb).slice(0, 5);
    const topDef = [...list].sort((a,b) => b.defense - a.defense).slice(0, 5);

    if (els.leaderPoints) {
      els.leaderPoints.innerHTML = topPts.length === 0 ? `<p style="color:var(--text-muted); font-size:0.8rem; font-style:italic;">No matches played yet.</p>` :
        topPts.map((p, idx) => `<div style="display:flex; justify-content:space-between; font-size:0.85rem; padding:4px 0;"><span>${idx+1}. ${p.name} (${p.team})</span><strong style="color:var(--gold);">${p.pts} PTS</strong></div>`).join("");
    }
    if (els.leaderAssists) {
      els.leaderAssists.innerHTML = topAst.length === 0 ? `<p style="color:var(--text-muted); font-size:0.8rem; font-style:italic;">No matches played yet.</p>` :
        topAst.map((p, idx) => `<div style="display:flex; justify-content:space-between; font-size:0.85rem; padding:4px 0;"><span>${idx+1}. ${p.name} (${p.team})</span><strong style="color:#10b981;">${p.ast} AST</strong></div>`).join("");
    }
    if (els.leaderRebounds) {
      els.leaderRebounds.innerHTML = topReb.length === 0 ? `<p style="color:var(--text-muted); font-size:0.8rem; font-style:italic;">No matches played yet.</p>` :
        topReb.map((p, idx) => `<div style="display:flex; justify-content:space-between; font-size:0.85rem; padding:4px 0;"><span>${idx+1}. ${p.name} (${p.team})</span><strong style="color:var(--gold);">${p.reb} REB</strong></div>`).join("");
    }
    if (els.leaderDefense) {
      els.leaderDefense.innerHTML = topDef.length === 0 ? `<p style="color:var(--text-muted); font-size:0.8rem; font-style:italic;">No matches played yet.</p>` :
        topDef.map((p, idx) => `<div style="display:flex; justify-content:space-between; font-size:0.85rem; padding:4px 0;"><span>${idx+1}. ${p.name} (${p.team})</span><strong style="color:#3b82f6;">${p.defense} BLK/STL</strong></div>`).join("");
    }
  }

  // Info tab
  function renderInfo() {
    if (!els.infoTeamsContainer) return;
    els.infoTeamsContainer.innerHTML = bbt.teams.map(t => `
      <div style="background: rgba(255,255,255,0.02); border: 1px solid rgba(255,255,255,0.08); border-radius: 12px; padding: 16px;">
        <h3 style="margin:0 0 10px; font-size:1.05rem; color:var(--gold);">${t.name}</h3>
        <div style="font-size:0.85rem; color:var(--text-muted);">
          Played: ${t.played} | Wins: ${t.wins} | Losses: ${t.losses}
        </div>
      </div>
    `).join("");
  }

  // Edit setup tab
  function renderEditSetup() {
    if (els.editDuration) els.editDuration.value = bbt.fixtures[0] ? (bbt.fixtures[0].matchState ? bbt.fixtures[0].matchState.quarterDuration : 10) : 10;
    
    if (els.editTeamsContainer) {
      els.editTeamsContainer.innerHTML = bbt.teams.map((t, idx) => `
        <div class="setup-group">
          <label style="display: block; font-size: 0.85rem; color: var(--text-muted); margin-bottom: 4px; font-weight: 600;">Team ${idx + 1} Name</label>
          <input type="text" class="bb-edit-tteam-input" data-team-index="${idx}" value="${t.name}" autocomplete="off" style="width: 100%; height: 38px; background: rgba(0,0,0,0.25); border: 1px solid rgba(255,255,255,0.1); border-radius: 6px; color: var(--ink); padding: 0 12px; font-size: 0.9rem;" />
        </div>
      `).join("");
    }
  }

  if (els.editSaveBtn) {
    els.editSaveBtn.addEventListener("click", () => {
      const inputs = document.querySelectorAll(".bb-edit-tteam-input");
      const tempNames = [];
      const uniqueNames = new Set();

      for (let i = 0; i < inputs.length; i++) {
        const tName = inputs[i].value.trim();
        if (!tName) {
          triggerBbToast("Team name cannot be blank!");
          return;
        }
        const nameKey = tName.toLowerCase();
        if (uniqueNames.has(nameKey)) {
          triggerBbToast(`Team names must be unique. Duplicate found: "${tName}"`);
          return;
        }
        uniqueNames.add(nameKey);
        tempNames.push({ index: Number(inputs[i].getAttribute("data-team-index")), name: tName });
      }

      // Rename team names in mappings
      tempNames.forEach(item => {
        const oldName = bbt.teams[item.index].name;
        const newName = item.name;

        if (oldName !== newName) {
          bbt.teams[item.index].name = newName;
          
          // Rename in fixtures
          bbt.fixtures.forEach(f => {
            if (f.teamA === oldName) f.teamA = newName;
            if (f.teamB === oldName) f.teamB = newName;
            if (f.matchState) {
              if (f.matchState.teamA === oldName) f.matchState.teamA = newName;
              if (f.matchState.teamB === oldName) f.matchState.teamB = newName;
            }
          });
        }
      });

      triggerBbToast("Tournament settings saved successfully!");
      saveBbState();
      renderPointsTable();
    });
  }

  // End of match score submission
  window.submitBbTournamentMatchResult = function () {
    if (!bbt.active || bbt.activeFixtureIndex === -1) return;

    const idx = bbt.activeFixtureIndex;
    const fix = bbt.fixtures[idx];

    bb.matchTimer.running = false;
    stopBbTimer();

    fix.status = "completed";
    fix.scoreA = bb.scoreA;
    fix.scoreB = bb.scoreB;
    fix.matchState = clone(bb);

    bb.active = false;
    bbt.activeFixtureIndex = -1;

    saveBbState();
    triggerBbToast("Match score submitted successfully!");
    window.location.hash = "#basketball-tdashboard";
    renderPointsTable();
  };

  if (els.submitResultBtn) {
    els.submitResultBtn.addEventListener("click", () => {
      window.submitBbTournamentMatchResult();
    });
  }

  // Reset tournament
  if (els.tresetBtn) {
    els.tresetBtn.addEventListener("click", () => {
      if (confirm("Are you sure you want to reset this tournament? All league scores will be lost.")) {
        bbt = clone(defaultBbtState);
        saveBbState();
        window.location.hash = "#basketball";
      }
    });
  }

  if (els.tdashboardBackBtn) {
    els.tdashboardBackBtn.addEventListener("click", () => {
      bbt.active = false;
      saveBbState();
      window.location.hash = "#basketball";
    });
  }

  // 14. INITIALIZE APP ROUTINGS
  loadBbState();

  // If initial hash was basketball, route it
  if (window.location.hash.startsWith("#basketball")) {
    showBasketballPage(true);
  }

  window.addEventListener("hashchange", () => {
    if (window.location.hash.startsWith("#basketball")) {
      showBasketballPage(true);
    }
  });

})();
