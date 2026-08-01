/* ==========================================================================
   FOOTBALL SCORE TRACKER & TOURNAMENT LEAGUE MODULE - CORE ENGINE
   ========================================================================== */

console.log("Football Module loaded - version 204");

(function () {
  // 1. STORAGE KEYS & DEFAULT STATES
  const FB_STORAGE_KEY = "football-score-tracker-v1";
  const FBT_STORAGE_KEY = "football-tournament-tracker-v1";
  let fbTimelineSignature = null;

  const defaultFbState = {
    active: false,
    isTournamentMatch: false,
    scoringMode: "simple", // simple or advanced
    teamA: "",
    teamB: "",
    fullDuration: 90,
    halfDuration: 45,
    halftimeDuration: 15,
    quarterBreaks: false,
    maxSubs: 5,
    knockoutMode: false,
    etDuration: 15,
    playersCount: 11,
    rosterA: [],
    rosterB: [],
    period: "1st-half", // 1st-quarter, 1st-quarter-break, 2nd-quarter, halftime, 3rd-quarter, 3rd-quarter-break, 4th-quarter, completed, et-1st-half, et-halftime, et-2nd-half, shootout
    scoreA: 0,
    scoreB: 0,
    matchTimer: {
      seconds: 0,
      etSeconds: 0,
      running: false,
      stoppageTime: 0,
      breakSecondsRemaining: undefined,
      stoppageTime1stHalf: 0,
      stoppageTime2ndHalf: 0,
      stoppageTimeET1stHalf: 0,
      stoppageTimeET2ndHalf: 0
    },
    goals: [], // { scorer, assist, team, minute, ownGoal }
    cards: [], // { player, team, type, minute }
    subs: [],  // { playerOff, playerOn, team, minute }
    penalties: [], // { team, scorer, result, minute }
    shootout: {
      kicksA: [], // Array of 'scored' or 'missed'
      kicksB: [],
      winner: null
    }
  };

  const defaultFbtState = {
    active: false,
    name: "",
    teamCount: 4,
    fullDuration: 90,
    halfDuration: 45,
    halftimeDuration: 15,
    quarterBreaks: false,
    maxSubs: 5,
    scoringMode: "simple",
    teams: [], // { name, players: [] }
    fixtures: [], // { round, teamA, teamB, status, scoreA, scoreB, matchState }
    activeFixtureIndex: -1
  };

  // Local state references loaded on initialization
  let fb = clone(defaultFbState);
  let fbt = clone(defaultFbtState);
  let fbIntervalId = null;

  // 2. DOM ELEMENT SELECTORS
  const els = {
    footballPage: document.querySelector("#football-page"),
    
    // View sections
    formatView: document.querySelector("#fb-format-view"),
    setupView: document.querySelector("#fb-setup-view"),
    dashboardView: document.querySelector("#fb-dashboard-view"),
    tsetupView: document.querySelector("#fb-tsetup-view"),
    tdashboardView: document.querySelector("#fb-tdashboard-view"),
    
    // Format Selection Buttons
    formatBackBtn: document.querySelector("#fb-format-back-btn"),
    formatCustomBtn: document.querySelector("#fb-format-custom-btn"),
    formatTournamentBtn: document.querySelector("#fb-format-tournament-btn"),

    // Custom Match Setup Inputs
    modeSimple: document.querySelector("#fb-mode-simple"),
    modeAdvanced: document.querySelector("#fb-mode-advanced"),
    teamAInput: document.querySelector("#fb-teamA-input"),
    teamBInput: document.querySelector("#fb-teamB-input"),
    durationInput: document.querySelector("#fb-duration-input"),
    subsInput: document.querySelector("#fb-subs-input"),
    playersInput: document.querySelector("#fb-players-input"),
    halftimeDurationInput: document.querySelector("#fb-halftime-duration-input"),
    etOptionNo: document.querySelector("#fb-et-option-no"),
    etOptionYes: document.querySelector("#fb-et-option-yes"),
    quarterBreaksInput: document.querySelector("#fb-quarter-breaks-input"),
    etDurationInput: document.querySelector("#fb-et-duration-input"),
    etSetupContainer: document.querySelector("#fb-et-setup-container"),
    startBtn: document.querySelector("#fb-start-btn"),
    backBtns: document.querySelectorAll(".fb-back-btn"),

    // Custom Dashboard score/timer strings
    periodBadge: document.querySelector("#fb-period-badge"),
    teamAName: document.querySelector("#fb-teamA-name"),
    teamBName: document.querySelector("#fb-teamB-name"),
    scoreA: document.querySelector("#fb-scoreA"),
    scoreB: document.querySelector("#fb-scoreB"),
    timerString: document.querySelector("#fb-timer-string"),
    timerPanel: document.querySelector("#fb-timer-panel"),
    timerBreakLabel: document.querySelector("#fb-timer-break-label"),
    stoppageBadge: document.querySelector("#fb-stoppage-badge"),
    timerToggleBtn: document.querySelector("#fb-timer-toggle-btn"),
    periodTransitionBtn: document.querySelector("#fb-period-transition-btn"),
    resetMatchBtn: document.querySelector("#fb-reset-match-btn"),
    submitResultBtn: document.querySelector("#fb-submit-result-btn"),

    extraDecBtn: document.querySelector("#fb-extra-dec-btn"),
    extraIncBtn: document.querySelector("#fb-extra-inc-btn"),
    extraVal: document.querySelector("#fb-extra-val"),

    // Simple / Advanced Panel layouts
    simpleControls: document.querySelector("#fb-simple-controls"),
    simpleTeamALabel: document.querySelector("#fb-simple-teamA-label"),
    simpleTeamBLabel: document.querySelector("#fb-simple-teamB-label"),
    simpleGoalABtn: document.querySelector("#fb-simple-goalA-btn"),
    simpleGoalADecBtn: document.querySelector("#fb-simple-goalA-dec-btn"),
    simpleGoalBBtn: document.querySelector("#fb-simple-goalB-btn"),
    simpleGoalBDecBtn: document.querySelector("#fb-simple-goalB-dec-btn"),

    advancedControls: document.querySelector("#fb-advanced-controls"),
    advTeamALabel: document.querySelector("#fb-adv-teamA-label"),
    advTeamBLabel: document.querySelector("#fb-adv-teamB-label"),
    advGoalABtn: document.querySelector("#fb-adv-goalA-btn"),
    advCardABtn: document.querySelector("#fb-adv-cardA-btn"),
    advSubABtn: document.querySelector("#fb-adv-subA-btn"),
    advPenaltyABtn: document.querySelector("#fb-adv-penaltyA-btn"),
    advGoalBBtn: document.querySelector("#fb-adv-goalB-btn"),
    advCardBBtn: document.querySelector("#fb-adv-cardB-btn"),
    advSubBBtn: document.querySelector("#fb-adv-subB-btn"),
    advPenaltyBBtn: document.querySelector("#fb-adv-penaltyB-btn"),

    // Shootout Panel
    shootoutPanel: document.querySelector("#fb-shootout-panel"),
    shootoutTeamAName: document.querySelector("#fb-shootout-teamA-name"),
    shootoutTeamBName: document.querySelector("#fb-shootout-teamB-name"),
    shootoutKicksA: document.querySelector("#fb-shootout-kicksA"),
    shootoutKicksB: document.querySelector("#fb-shootout-kicksB"),
    shootoutScoreABtn: document.querySelector("#fb-shootout-scoreA-btn"),
    shootoutMissABtn: document.querySelector("#fb-shootout-missA-btn"),
    shootoutScoreBBtn: document.querySelector("#fb-shootout-scoreB-btn"),
    shootoutMissBBtn: document.querySelector("#fb-shootout-missB-btn"),

    // Timeline Log List
    timelineList: document.querySelector("#fb-timeline-list"),

    // Tournament setup elements
    tsetupBackBtn: document.querySelector("#fb-tsetup-back-btn"),
    tmodeSimple: document.querySelector("#fb-tmode-simple"),
    tmodeAdvanced: document.querySelector("#fb-tmode-advanced"),
    tnameInput: document.querySelector("#fb-tname-input"),
    tteamCount: document.querySelector("#fb-tteam-count"),
    tdurationInput: document.querySelector("#fb-tduration-input"),
    tsubsInput: document.querySelector("#fb-tsubs-input"),
    thalftimeDurationInput: document.querySelector("#fb-thalftime-duration-input"),
    tquarterBreaksInput: document.querySelector("#fb-tquarter-breaks-input"),
    tteamInputs: document.querySelector("#fb-tteam-inputs"),
    tcreateBtn: document.querySelector("#fb-tcreate-btn"),

    // Tournament dashboard elements
    tdashboardTitle: document.querySelector("#fb-tdashboard-title"),
    tresetBtn: document.querySelector("#fb-treset-btn"),
    tabTable: document.querySelector("#fb-tab-table"),
    tabFixtures: document.querySelector("#fb-tab-fixtures"),
    tabStats: document.querySelector("#fb-tab-stats"),
    tabInfo: document.querySelector("#fb-tab-info"),
    tabEdit: document.querySelector("#fb-tab-edit"),
    tableView: document.querySelector("#fb-table-view"),
    fixturesView: document.querySelector("#fb-fixtures-view"),
    statsView: document.querySelector("#fb-stats-view"),
    infoView: document.querySelector("#fb-info-view"),
    editView: document.querySelector("#fb-edit-view"),
    pointsTableBody: document.querySelector("#fb-points-table-body"),
    fixturesList: document.querySelector("#fb-fixtures-list"),
    statsScorers: document.querySelector("#fb-stats-scorers"),
    statsAssists: document.querySelector("#fb-stats-assists"),
    statsDiscipline: document.querySelector("#fb-stats-discipline"),
    infoTeamsContainer: document.querySelector("#fb-info-teams-container"),
    editDuration: document.querySelector("#fb-edit-duration"),
    editSubs: document.querySelector("#fb-edit-subs"),
    editTeamsContainer: document.querySelector("#fb-edit-teams-container"),
    editSaveBtn: document.querySelector("#fb-edit-save-btn"),

    // MODAL OVERLAYS
    goalModal: document.querySelector("#fb-goal-modal"),
    goalScorerSelect: document.querySelector("#fb-goal-scorer-select"),
    goalAssistSelect: document.querySelector("#fb-goal-assist-select"),
    goalOgCheckbox: document.querySelector("#fb-goal-og-checkbox"),
    goalCancelBtn: document.querySelector("#fb-goal-cancel-btn"),
    goalSubmitBtn: document.querySelector("#fb-goal-submit-btn"),

    cardModal: document.querySelector("#fb-card-modal"),
    cardPlayerSelect: document.querySelector("#fb-card-player-select"),
    cardYellowBtn: document.querySelector("#fb-card-yellow-btn"),
    cardRedBtn: document.querySelector("#fb-card-red-btn"),
    cardCancelBtn: document.querySelector("#fb-card-cancel-btn"),
    cardSubmitBtn: document.querySelector("#fb-card-submit-btn"),

    subModal: document.querySelector("#fb-sub-modal"),
    subOffSelect: document.querySelector("#fb-sub-off-select"),
    subOnSelect: document.querySelector("#fb-sub-on-select"),
    subCancelBtn: document.querySelector("#fb-sub-cancel-btn"),
    subSubmitBtn: document.querySelector("#fb-sub-submit-btn"),

    squadModal: document.querySelector("#fb-squad-modal"),
    squadTitle: document.querySelector("#fb-squad-title"),
    squadSubtitle: document.querySelector("#fb-squad-subtitle"),
    squadTeamALabel: document.querySelector("#fb-squad-teamA-label"),
    squadTeamBLabel: document.querySelector("#fb-squad-teamB-label"),
    squadTeamAInputs: document.querySelector("#fb-squad-teamA-inputs"),
    squadTeamBInputs: document.querySelector("#fb-squad-teamB-inputs"),
    squadSaveBtn: document.querySelector("#fb-squad-save-btn"),

    scorecardModal: document.querySelector("#fb-scorecard-modal"),
    closeScorecardModal: document.querySelector("#close-fb-scorecard-modal"),
    modalTitle: document.querySelector("#fb-modal-title"),
    modalSubtitle: document.querySelector("#fb-modal-subtitle"),
    modalTeamAName: document.querySelector("#fb-modal-teamA-name"),
    modalTeamBName: document.querySelector("#fb-modal-teamB-name"),
    modalScoreA: document.querySelector("#fb-modal-scoreA"),
    modalScoreB: document.querySelector("#fb-modal-scoreB"),
    modalGoalsTimeline: document.querySelector("#fb-modal-goals-timeline"),
    modalCardsList: document.querySelector("#fb-modal-cards-list")
  };

  // 3. REFEREE WHISTLE SOUND wave synthesizer (Web Audio API)
  function playFbWhistleSound(isDouble = false) {
    try {
      const AudioCtx = window.AudioContext || window.webkitAudioContext;
      if (!AudioCtx) return;
      const ctx = new AudioCtx();

      const blow = (delay, duration) => {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();

        osc.type = "sine";
        osc.frequency.setValueAtTime(1250, ctx.currentTime + delay);
        osc.frequency.exponentialRampToValueAtTime(1550, ctx.currentTime + delay + duration);

        gain.gain.setValueAtTime(0, ctx.currentTime + delay);
        gain.gain.linearRampToValueAtTime(0.35, ctx.currentTime + delay + 0.04);
        gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + delay + duration);

        const filter = ctx.createBiquadFilter();
        filter.type = "highpass";
        filter.frequency.value = 1000;

        osc.connect(filter);
        filter.connect(gain);
        gain.connect(ctx.destination);

        osc.start(ctx.currentTime + delay);
        osc.stop(ctx.currentTime + delay + duration);
      };

      if (isDouble) {
        blow(0, 0.22);
        blow(0.26, 0.38);
      } else {
        blow(0, 0.48);
      }
    } catch (e) {
      console.warn("Audio Context blocked or not supported: ", e);
    }
  }

  // Helper deep cloner
  function clone(obj) {
    return JSON.parse(JSON.stringify(obj));
  }

  // Break duration in seconds for a given period. The configured break
  // duration applies in full to every break — 1st-quarter, halftime, and
  // 3rd-quarter all get the same length when quarter breaks are enabled;
  // with quarter breaks off, the only break (halftime) also uses it in full.
  function getFbBreakSeconds(period) {
    if (period === "et-halftime") return 300;
    return fb.halftimeDuration * 60;
  }

  // Normal-duration boundary (in seconds) for a given period, before any
  // added/stoppage time. Used to detect when a period has entered its
  // live "Extra Timer" phase.
  function getPeriodTargetSecs(period) {
    if (period === "1st-half") return fb.halfDuration * 60;
    if (period === "1st-quarter") return fb.fullDuration * 15;
    if (period === "2nd-quarter") return fb.fullDuration * 30;
    if (period === "3rd-quarter") return fb.fullDuration * 45;
    if (period === "2nd-half" || period === "4th-quarter") return fb.fullDuration * 60;
    return 0;
  }

  // Live added-time value (seconds) once a normal period has passed its
  // duration: counts up from 0 as play continues past the mark. The
  // period auto-ends once this reaches the recorded stoppage time, so
  // e.g. an 8s recording plays out as 0,1,2...8 then stops there.
  function getLiveExtraTimeSeconds(period) {
    const targetSecs = getPeriodTargetSecs(period);
    if (targetSecs <= 0 || fb.matchTimer.seconds < targetSecs) return null;
    return fb.matchTimer.seconds - targetSecs;
  }

  // Global toast trigger fallback helper
  function triggerFbToast(msg) {
    if (typeof showToast === "function") {
      showToast(msg);
    } else {
      alert(msg);
    }
  }

  // 4. TIMER COUNTDOWN & TICK RULES ENGINE
  function startFbTimer() {
    if (fbIntervalId) clearInterval(fbIntervalId);

    fbIntervalId = setInterval(() => {
      if (!fb || !fb.matchTimer) {
        stopFbTimer();
        return;
      }

      const isBreak = ["halftime", "1st-quarter-break", "3rd-quarter-break"].includes(fb.period);

      if (isBreak) {
        if (fb.matchTimer.breakSecondsRemaining === undefined) {
          fb.matchTimer.breakSecondsRemaining = getFbBreakSeconds(fb.period);
        }

        fb.matchTimer.breakSecondsRemaining--;

        if (fb.matchTimer.breakSecondsRemaining <= 0) {
          // Play resume whistle
          playFbWhistleSound(false);

          // Transition to next period
          if (fb.period === "1st-quarter-break") {
            fb.period = "2nd-quarter";
            fb.matchTimer.seconds = fb.fullDuration * 15;
          } else if (fb.period === "halftime") {
            fb.period = fb.quarterBreaks ? "3rd-quarter" : "2nd-half";
            fb.matchTimer.seconds = fb.quarterBreaks ? fb.fullDuration * 30 : fb.halfDuration * 60;
          } else if (fb.period === "3rd-quarter-break") {
            fb.period = "4th-quarter";
            fb.matchTimer.seconds = fb.fullDuration * 45;
          }
          fb.matchTimer.stoppageTime = 0;
          fb.matchTimer.running = true;
          fb.matchTimer.breakSecondsRemaining = undefined;
        }

        saveFbState();
        renderFbDashboard();
      } else if (fb.matchTimer.running) {
        const isExtraTime = fb.period === "et-1st-half" || fb.period === "et-2nd-half";
        if (isExtraTime) {
          fb.matchTimer.etSeconds++;
        } else {
          fb.matchTimer.seconds++;
        }

        // Determine target period bounds
        let targetSecs = 0;
        if (fb.period === "1st-half") targetSecs = fb.halfDuration * 60;
        else if (fb.period === "1st-quarter") targetSecs = fb.fullDuration * 15;
        else if (fb.period === "2nd-quarter") targetSecs = fb.fullDuration * 30;
        else if (fb.period === "3rd-quarter") targetSecs = fb.fullDuration * 45;
        else if (fb.period === "2nd-half" || fb.period === "4th-quarter") targetSecs = fb.fullDuration * 60;
        else if (fb.period === "et-1st-half") targetSecs = (fb.etDuration || 15) * 60;
        else if (fb.period === "et-2nd-half") targetSecs = ((fb.etDuration || 15) * 2) * 60;

        const currentPeriodSecs = isExtraTime ? fb.matchTimer.etSeconds : fb.matchTimer.seconds;

        // Once duration is reached, the display switches to a live "Extra
        // Timer" counting up (see renderFbDashboard). The period auto-ends
        // exactly when that live count reaches the recorded stoppage time
        // (e.g. 8s recorded -> extra timer stops the period at 8s), same
        // as before duration was reached — it doesn't run indefinitely.
        if (targetSecs > 0 && currentPeriodSecs >= (targetSecs + fb.matchTimer.stoppageTime)) {
          // Play end whistle
          playFbWhistleSound(true);

          if (fb.period === "1st-half") {
            fb.matchTimer.stoppageTime1stHalf = fb.matchTimer.stoppageTime;
            fb.period = "halftime";
            fb.matchTimer.breakSecondsRemaining = fb.halftimeDuration * 60;
          } else if (fb.period === "1st-quarter") {
            fb.period = "1st-quarter-break";
            fb.matchTimer.breakSecondsRemaining = getFbBreakSeconds(fb.period);
          } else if (fb.period === "2nd-quarter") {
            fb.matchTimer.stoppageTime1stHalf = fb.matchTimer.stoppageTime;
            fb.period = "halftime";
            fb.matchTimer.breakSecondsRemaining = fb.halftimeDuration * 60;
          } else if (fb.period === "3rd-quarter") {
            fb.period = "3rd-quarter-break";
            fb.matchTimer.breakSecondsRemaining = getFbBreakSeconds(fb.period);
          } else if (fb.period === "2nd-half" || fb.period === "4th-quarter") {
            fb.matchTimer.stoppageTime2ndHalf = fb.matchTimer.stoppageTime;
            fb.matchTimer.running = false;
            if (fb.knockoutMode && fb.scoreA === fb.scoreB) {
              fb.period = "full-time-pending";
            } else {
              fb.period = "completed";
            }
          } else if (fb.period === "et-1st-half") {
            fb.matchTimer.stoppageTimeET1stHalf = fb.matchTimer.stoppageTime;
            fb.matchTimer.stoppageTime = 0;
            fb.period = "et-2nd-half";
          } else if (fb.period === "et-2nd-half") {
            fb.matchTimer.stoppageTimeET2ndHalf = fb.matchTimer.stoppageTime;
            fb.matchTimer.running = false;
            if (fb.scoreA === fb.scoreB) {
              fb.period = "et-full-time-pending";
            } else {
              fb.period = "completed";
            }
          }
        }

        saveFbState();
        renderFbDashboard();
      } else {
        stopFbTimer();
      }
    }, 1000);
  }

  function stopFbTimer() {
    if (fbIntervalId) {
      clearInterval(fbIntervalId);
      fbIntervalId = null;
    }
  }

  // Helper formatter for clock display
  function formatFootballTime(seconds, period, halfDuration) {
    const min = Math.floor(seconds / 60);
    const sec = seconds % 60;
    const secStr = sec.toString().padStart(2, '0');

    if (period === "halftime") {
      return `${halfDuration}:00`;
    } else if (period === "1st-quarter-break") {
      return `${Math.ceil(halfDuration / 2)}:00`;
    } else if (period === "3rd-quarter-break") {
      return `${halfDuration + Math.ceil(halfDuration / 2)}:00`;
    } else if (period === "full-time-pending" || period === "completed") {
      return `${halfDuration * 2}:00`;
    } else if (period === "et-halftime") {
      return `${halfDuration * 2 + 15}:00`;
    }

    return `${min.toString().padStart(2, '0')}:${secStr}`;
  }

  // 5. VIEW TOGGLES & NAVIGATION LOGIC
  function hideAllFbViews() {
    if (els.formatView) els.formatView.classList.add("hidden");
    if (els.setupView) els.setupView.classList.add("hidden");
    if (els.dashboardView) els.dashboardView.classList.add("hidden");
    if (els.tsetupView) els.tsetupView.classList.add("hidden");
    if (els.tdashboardView) els.tdashboardView.classList.add("hidden");
  }

  function handleFootballNavigation() {
    const hash = window.location.hash;
    if (!hash.startsWith("#football")) return;

    hideAllFbViews();

    if (hash === "#football") {
      // Default entry point: format selection
      if (els.formatView) els.formatView.classList.remove("hidden");
    } else if (hash === "#football-custom-setup") {
      if (els.setupView) els.setupView.classList.remove("hidden");
    } else if (hash === "#football-match") {
      if (els.dashboardView) els.dashboardView.classList.remove("hidden");
      renderFbDashboard();
    } else if (hash === "#football-tsetup") {
      if (els.tsetupView) els.tsetupView.classList.remove("hidden");
      renderFootballTournamentTeamInputs();
    } else if (hash === "#football-tdashboard") {
      if (els.tdashboardView) els.tdashboardView.classList.remove("hidden");
      renderFootballTournamentDashboard();
    }
  }

  // 6. LOCAL PERSISTENCE SYNC
  function loadFbState() {
    try {
      const storedFb = localStorage.getItem(FB_STORAGE_KEY);
      const storedFbt = localStorage.getItem(FBT_STORAGE_KEY);

      if (storedFb) fb = JSON.parse(storedFb);
      if (storedFbt) fbt = JSON.parse(storedFbt);
    } catch (e) {
      console.error("Failed to load football states: ", e);
    }
  }

  function saveFbState() {
    try {
      localStorage.setItem(FB_STORAGE_KEY, JSON.stringify(fb));
      localStorage.setItem(FBT_STORAGE_KEY, JSON.stringify(fbt));
    } catch (e) {
      console.error("Failed to save football states: ", e);
    }
  }

  // 7. CUSTOM MATCH CONTROLS & EVENT LOGGERS
  if (els.startBtn) {
    els.startBtn.addEventListener("click", () => {
      const tA = els.teamAInput.value.trim();
      const tB = els.teamBInput.value.trim();
      const durationVal = els.durationInput.value.trim();
      const subsVal = els.subsInput.value.trim();
      const playersVal = els.playersInput.value.trim();
      const halftimeVal = els.halftimeDurationInput.value.trim();

      // STRICT BLANK INPUT VALIDATION
      if (!tA || !tB || !durationVal || !subsVal || !playersVal || !halftimeVal) {
        triggerFbToast("Please fill in all setup fields before starting!");
        return;
      }

      // STRICT UNIQUE TEAM NAME VALIDATION
      if (tA.toLowerCase() === tB.toLowerCase()) {
        triggerFbToast("Team names must be unique!");
        return;
      }

      // STRICT RANGE VALIDATION
      if (Number(durationVal) < 2 || Number(durationVal) > 90) {
        triggerFbToast("Match duration must be between 2 and 90 minutes.");
        return;
      }
      if (Number(playersVal) < 5 || Number(playersVal) > 11) {
        triggerFbToast("Players per team must be between 5 and 11.");
        return;
      }

      const isAdv = els.modeAdvanced.classList.contains("active");
      const fullDur = Math.max(2, Math.min(90, Number(durationVal)));
      const halfDur = Math.ceil(fullDur / 2);
      const maxSubs = Math.max(1, Math.min(11, Number(subsVal)));
      const playersCount = Math.max(5, Math.min(11, Number(playersVal)));
      const halftimeDur = Math.max(1, Math.min(45, Number(halftimeVal)));
      const qb = els.quarterBreaksInput.checked;
      const ko = els.etOptionYes ? els.etOptionYes.classList.contains("active") : false;

      // EXTRA TIME DURATION VALIDATION
      let etDuration = 15; // default
      if (ko) {
        const etDurationVal = els.etDurationInput.value.trim();
        if (!etDurationVal) {
          triggerFbToast("Please fill in the Extra Time duration field!");
          return;
        }
        if (Number(etDurationVal) < 1 || Number(etDurationVal) > 45) {
          triggerFbToast("Extra Time duration must be between 1 and 45 minutes.");
          return;
        }
        etDuration = Math.max(1, Math.min(45, Number(etDurationVal)));
      }

      // Construct Initial Roster Arrays
      const rosterA = [];
      const rosterB = [];
      for (let i = 0; i < playersCount; i++) {
        rosterA.push({ name: `${tA} Player ${i + 1}`, number: i + 1, active: true });
        rosterB.push({ name: `${tB} Player ${i + 1}`, number: i + 1, active: true });
      }

      // Initialize match state
      fb = clone(defaultFbState);
      fb.active = true;
      fb.isTournamentMatch = false;
      fb.scoringMode = isAdv ? "advanced" : "simple";
      fb.teamA = tA;
      fb.teamB = tB;
      fb.fullDuration = fullDur;
      fb.halfDuration = halfDur;
      fb.halftimeDuration = halftimeDur;
      fb.quarterBreaks = qb;
      fb.maxSubs = maxSubs;
      fb.knockoutMode = ko;
      fb.etDuration = etDuration;
      fb.playersCount = playersCount;
      fb.rosterA = rosterA;
      fb.rosterB = rosterB;
      fb.period = qb ? "1st-quarter" : "1st-half";

      saveFbState();
      
      // If advanced mode, open Squad modal first to register names
      if (isAdv) {
        openSquadRegisterModal(tA, tB, playersCount, () => {
          window.location.hash = "#football-match";
        });
      } else {
        window.location.hash = "#football-match";
      }
    });
  }

  // Setup views format toggle clicks
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

  // Toggle Extra Time duration input based on Extra Time option button clicks
  if (els.etOptionNo && els.etOptionYes && els.etSetupContainer) {
    els.etOptionNo.addEventListener("click", () => {
      els.etOptionNo.classList.add("active");
      els.etOptionYes.classList.remove("active");
      els.etSetupContainer.style.display = "none";
    });
    els.etOptionYes.addEventListener("click", () => {
      els.etOptionYes.classList.add("active");
      els.etOptionNo.classList.remove("active");
      els.etSetupContainer.style.display = "block";
    });
  }

  function getMatchCurrentMinute() {
    if (!fb || !fb.matchTimer) return 1;
    if (fb.period === "et-1st-half" || fb.period === "et-2nd-half") {
      return fb.fullDuration + Math.floor(fb.matchTimer.etSeconds / 60) + 1;
    }
    return Math.min(fb.fullDuration, Math.floor(fb.matchTimer.seconds / 60) + 1);
  }

  // Render match dashboard scorecard views
  function renderFbDashboard() {
    if (!fb.active) return;

    if (els.teamAName) els.teamAName.textContent = fb.teamA;
    if (els.teamBName) els.teamBName.textContent = fb.teamB;
    if (els.scoreA) els.scoreA.textContent = fb.scoreA;
    if (els.scoreB) els.scoreB.textContent = fb.scoreB;

    // Period displays
    const periodMap = {
      "1st-half": "1st Half",
      "halftime": "Halftime",
      "2nd-half": "2nd Half",
      "1st-quarter": "1st Quarter",
      "1st-quarter-break": "Water Break",
      "2nd-quarter": "2nd Quarter",
      "3rd-quarter": "3rd Quarter",
      "3rd-quarter-break": "Water Break",
      "4th-quarter": "4th Quarter",
      "full-time-pending": "Full Time",
      "et-1st-half": "ET 1st Half",
      "et-halftime": "ET Halftime",
      "et-2nd-half": "ET 2nd Half",
      "et-full-time-pending": "ET Full Time",
      "shootout": "Penalties",
      "completed": "Completed"
    };
    if (els.periodBadge) {
      els.periodBadge.textContent = periodMap[fb.period] || fb.period;
    }

    // Timer layout
    if (els.timerString) {
      const isBreak = ["halftime", "1st-quarter-break", "3rd-quarter-break"].includes(fb.period);
      if (isBreak) {
        const breakSecs = fb.matchTimer.breakSecondsRemaining !== undefined ? fb.matchTimer.breakSecondsRemaining : getFbBreakSeconds(fb.period);
        const m = Math.floor(breakSecs / 60);
        const s = breakSecs % 60;
        els.timerString.textContent = `${m}:${s.toString().padStart(2, '0')}`;
        if (els.timerBreakLabel) {
          const breakWords = {
            "halftime": "Half Time",
            "1st-quarter-break": "Water Break",
            "3rd-quarter-break": "Water Break",
            "et-halftime": "Extra Time Half Time"
          };
          els.timerBreakLabel.textContent = breakWords[fb.period] || "Break";
          els.timerBreakLabel.style.display = "block";
        }
      } else if (fb.period === "et-1st-half" || fb.period === "et-2nd-half") {
        const etM = Math.floor(fb.matchTimer.etSeconds / 60);
        const etS = fb.matchTimer.etSeconds % 60;
        els.timerString.textContent = `${etM}:${etS.toString().padStart(2, '0')}`;
        if (els.timerBreakLabel) {
          els.timerBreakLabel.textContent = "Extra Time";
          els.timerBreakLabel.style.display = "block";
        }
      } else if (getLiveExtraTimeSeconds(fb.period) !== null) {
        const liveExtra = getLiveExtraTimeSeconds(fb.period);
        const exM = Math.floor(liveExtra / 60);
        const exS = liveExtra % 60;
        els.timerString.textContent = `${exM}:${exS.toString().padStart(2, '0')}`;
        if (els.timerBreakLabel) {
          els.timerBreakLabel.textContent = "Extra Timer";
          els.timerBreakLabel.style.display = "block";
        }
      } else {
        els.timerString.textContent = formatFootballTime(fb.matchTimer.seconds, fb.period, fb.halfDuration);
        if (els.timerBreakLabel) els.timerBreakLabel.style.display = "none";
      }
    }

    // Toggle button texts
    if (els.timerToggleBtn) {
      const isRunning = fb.matchTimer.running;
      const isExtraTime = fb.period === "et-1st-half" || fb.period === "et-2nd-half";
      const clockSecs = isExtraTime ? fb.matchTimer.etSeconds : fb.matchTimer.seconds;
      els.timerToggleBtn.textContent = isRunning ? "Pause Clock" : (clockSecs === 0 ? (isExtraTime ? "Start Extra Time" : "Kick Off") : "Resume Clock");
      if (els.timerPanel) els.timerPanel.classList.toggle("is-running", isRunning);
    }

    // Stoppage time displays. Hidden once the big timer switches to the
    // live Extra Timer, since that already shows this value (and keeps
    // growing) — showing both would just be a stale duplicate.
    const isPeriodAllowsStoppage = ["1st-half", "2nd-half", "1st-quarter", "2nd-quarter", "3rd-quarter", "4th-quarter", "et-1st-half", "et-2nd-half"].includes(fb.period);
    const inLiveExtraTime = getLiveExtraTimeSeconds(fb.period) !== null;
    if (els.stoppageBadge) {
      if (fb.matchTimer.stoppageTime > 0 && isPeriodAllowsStoppage && !inLiveExtraTime) {
        const stM = Math.floor(fb.matchTimer.stoppageTime / 60);
        const stS = fb.matchTimer.stoppageTime % 60;
        els.stoppageBadge.textContent = `+${stM}:${stS.toString().padStart(2, '0')} stoppage`;
        els.stoppageBadge.style.display = "inline-block";
      } else {
        els.stoppageBadge.style.display = "none";
      }
    }
    // Extra time adjuster display
    if (els.extraVal) {
      const exM = Math.floor(fb.matchTimer.stoppageTime / 60);
      const exS = fb.matchTimer.stoppageTime % 60;
      els.extraVal.textContent = `${exM}:${exS.toString().padStart(2, '0')}`;
    }

    // Transition Button label updates
    if (els.periodTransitionBtn) {
      let transLabel = "";
      let hideTrans = false;

      if (fb.period === "1st-half") {
        transLabel = "End 1st Half";
      } else if (fb.period === "1st-quarter") {
        transLabel = "End 1st Quarter";
      } else if (fb.period === "1st-quarter-break") {
        transLabel = "Start 2nd Quarter";
      } else if (fb.period === "2nd-quarter") {
        transLabel = "End 1st Half";
      } else if (fb.period === "halftime") {
        transLabel = fb.quarterBreaks ? "Start 3rd Quarter" : "Start 2nd Half";
      } else if (fb.period === "3rd-quarter") {
        transLabel = "End 3rd Quarter";
      } else if (fb.period === "3rd-quarter-break") {
        transLabel = "Start 4th Quarter";
      } else if (fb.period === "2nd-half" || fb.period === "4th-quarter") {
        transLabel = fb.knockoutMode && fb.scoreA === fb.scoreB ? "End Match (ET)" : "End Match";
      } else if (fb.period === "full-time-pending") {
        transLabel = "Start Extra Time";
      } else if (fb.period === "et-1st-half") {
        transLabel = "End ET 1st Half";
      } else if (fb.period === "et-halftime") {
        transLabel = "Start ET 2nd Half";
      } else if (fb.period === "et-2nd-half") {
        transLabel = fb.scoreA === fb.scoreB ? "End ET (Shootout)" : "End Match";
      } else if (fb.period === "et-full-time-pending") {
        transLabel = "Start Shootout";
      } else {
        hideTrans = true;
      }

      if (hideTrans) {
        els.periodTransitionBtn.style.display = "none";
      } else {
        els.periodTransitionBtn.style.display = "inline-block";
        els.periodTransitionBtn.textContent = transLabel;
      }
    }

    // Toggle panels simple vs advanced
    if (fb.scoringMode === "simple") {
      if (els.simpleControls) els.simpleControls.classList.remove("hidden");
      if (els.advancedControls) els.advancedControls.classList.add("hidden");
      
      if (els.simpleTeamALabel) els.simpleTeamALabel.textContent = fb.teamA;
      if (els.simpleTeamBLabel) els.simpleTeamBLabel.textContent = fb.teamB;
    } else {
      if (els.simpleControls) els.simpleControls.classList.add("hidden");
      if (els.advancedControls) els.advancedControls.classList.remove("hidden");

      if (els.advTeamALabel) els.advTeamALabel.textContent = fb.teamA;
      if (els.advTeamBLabel) els.advTeamBLabel.textContent = fb.teamB;
    }

    // Shootout panel toggle
    if (fb.period === "shootout" && els.shootoutPanel) {
      els.shootoutPanel.classList.remove("hidden");
      if (els.shootoutTeamAName) els.shootoutTeamAName.textContent = fb.teamA;
      if (els.shootoutTeamBName) els.shootoutTeamBName.textContent = fb.teamB;
      renderShootoutStatus();
    } else if (els.shootoutPanel) {
      els.shootoutPanel.classList.add("hidden");
    }

    // Toggle submit results button if tournament fixture
    if (els.submitResultBtn) {
      if (fbt.active && fbt.activeFixtureIndex !== -1 && (fb.period === "completed" || fb.period === "shootout")) {
        els.submitResultBtn.classList.remove("hidden");
      } else {
        els.submitResultBtn.classList.add("hidden");
      }
    }

    // Render logged match timeline events list
    renderFbTimeline();
  }

  // Render shootout kicks dots indicators
  function renderShootoutStatus() {
    if (!els.shootoutKicksA || !els.shootoutKicksB) return;

    const renderDots = (kicks, container) => {
      container.innerHTML = "";
      for (let i = 0; i < Math.max(5, kicks.length + 1); i++) {
        const span = document.createElement("span");
        span.style.width = "18px";
        span.style.height = "18px";
        span.style.borderRadius = "50%";
        span.style.display = "inline-block";
        span.style.border = "1.5px solid rgba(255,255,255,0.2)";

        const val = kicks[i];
        if (val === "scored") {
          span.style.background = "#34d399";
          span.style.borderColor = "#34d399";
        } else if (val === "missed") {
          span.style.background = "#ef4444";
          span.style.borderColor = "#ef4444";
        } else {
          span.style.background = "rgba(255,255,255,0.03)";
        }
        container.appendChild(span);
      }
    };

    renderDots(fb.shootout.kicksA, els.shootoutKicksA);
    renderDots(fb.shootout.kicksB, els.shootoutKicksB);
  }

  // Handle penalty shootout log score/miss clicks
  if (els.shootoutScoreABtn) els.shootoutScoreABtn.addEventListener("click", () => logShootoutKick("A", "scored"));
  if (els.shootoutMissABtn) els.shootoutMissABtn.addEventListener("click", () => logShootoutKick("A", "missed"));
  if (els.shootoutScoreBBtn) els.shootoutScoreBBtn.addEventListener("click", () => logShootoutKick("B", "scored"));
  if (els.shootoutMissBBtn) els.shootoutMissBBtn.addEventListener("click", () => logShootoutKick("B", "missed"));

  function logShootoutKick(team, result) {
    const k = fb.shootout;
    if (team === "A") {
      if (k.kicksA.length <= k.kicksB.length) {
        k.kicksA.push(result);
      }
    } else {
      if (k.kicksB.length < k.kicksA.length) {
        k.kicksB.push(result);
      }
    }

    // Check shootout termination conditions (min 5 kicks each, or sudden death)
    const lenA = k.kicksA.length;
    const lenB = k.kicksB.length;
    const scoreA = k.kicksA.filter(r => r === "scored").length;
    const scoreB = k.kicksB.filter(r => r === "scored").length;

    const remainingA = 5 - lenA;
    const remainingB = 5 - lenB;

    let shootoutOver = false;

    if (lenA === lenB) {
      if (lenA >= 5 && scoreA !== scoreB) {
        shootoutOver = true;
      } else if (lenA < 5) {
        if (scoreA > scoreB + remainingB || scoreB > scoreA + remainingA) {
          shootoutOver = true;
        }
      }
    } else {
      // Team A just kicked, check if B can catch up
      if (lenA < 5) {
        if (scoreA > scoreB + remainingB || scoreB > scoreA + remainingA) {
          shootoutOver = true;
        }
      } else {
        // Sudden death kicks check
        if (lenA > 5 && scoreA > scoreB) {
          // B must kick next, if B misses, A wins
        }
      }
    }

    // If both finished sudden death round
    if (lenA === lenB && lenA > 5 && scoreA !== scoreB) {
      shootoutOver = true;
    }

    if (shootoutOver) {
      k.winner = scoreA > scoreB ? fb.teamA : fb.teamB;
      fb.period = "completed";
      triggerFbToast(`Shootout finished! Winner: ${k.winner} (${scoreA}-${scoreB})`);
    }

    saveFbState();
    renderFbDashboard();
  }

  // Render events timeline logs
  function renderFbTimeline() {
    if (!els.timelineList) return;

    // Combine all logging events
    const timeline = [];
    fb.goals.forEach(g => {
      timeline.push({
        type: "goal",
        minute: g.minute,
        desc: `<strong>⚽ Goal!</strong> ${g.ownGoal ? "Own Goal" : g.scorer} ${g.assist ? `(Assist: ${g.assist})` : ""}`,
        team: g.team
      });
    });

    fb.cards.forEach(c => {
      timeline.push({
        type: "card",
        minute: c.minute,
        desc: `<strong style="color: ${c.type === 'yellow' ? '#eab308' : '#ef4444'};">${c.type === 'yellow' ? '🟨' : '🟥'} Card</strong> ${c.player}`,
        team: c.team
      });
    });

    fb.subs.forEach(s => {
      timeline.push({
        type: "sub",
        minute: s.minute,
        desc: `🔄 Sub: ${s.playerOff} ➔ ${s.playerOn}`,
        team: s.team
      });
    });

    fb.penalties.forEach(p => {
      timeline.push({
        type: "penalty",
        minute: p.minute,
        desc: `🥅 Penalty Kick by ${p.scorer} - <strong>${p.result.toUpperCase()}</strong>`,
        team: p.team
      });
    });

    timeline.sort((a, b) => b.minute - a.minute);

    const signature = JSON.stringify(timeline);
    if (signature === fbTimelineSignature) return;
    fbTimelineSignature = signature;

    if (timeline.length === 0) {
      els.timelineList.innerHTML = `<p style="color: var(--text-muted); font-style: italic; font-size: 0.9rem;">No events logged yet.</p>`;
      return;
    }

    els.timelineList.innerHTML = timeline.map(e => `
      <div class="fb-timeline-card">
        <span class="event-type">${e.desc}</span>
        <span style="color: var(--text-muted); font-weight: 700;">${e.minute}' (${e.team})</span>
      </div>
    `).join("");
  }

  const FB_BREAK_PERIODS = ["halftime", "1st-quarter-break", "3rd-quarter-break"];

  function isBreakPeriod() {
    return FB_BREAK_PERIODS.includes(fb.period);
  }

  function isMatchClockStarted() {
    return fb.matchTimer.running;
  }

  function goalBlockMessage() {
    if (isBreakPeriod()) return "Cannot log a goal during a break!";
    return "Resume the clock before logging a goal!";
  }

  // Simple goals event adjustments
  if (els.simpleGoalABtn) {
    els.simpleGoalABtn.addEventListener("click", () => {
      if (!isMatchClockStarted() || isBreakPeriod()) {
        triggerFbToast(goalBlockMessage());
        return;
      }
      fb.scoreA++;
      fb.goals.push({ scorer: "Team 1", assist: "", team: fb.teamA, minute: getMatchCurrentMinute(), ownGoal: false });
      saveFbState();
      renderFbDashboard();
    });
  }
  if (els.simpleGoalADecBtn) {
    els.simpleGoalADecBtn.addEventListener("click", () => {
      if (fb.scoreA > 0) {
        fb.scoreA--;
        fb.goals = fb.goals.filter(g => g.team !== fb.teamA);
        saveFbState();
        renderFbDashboard();
      }
    });
  }
  if (els.simpleGoalBBtn) {
    els.simpleGoalBBtn.addEventListener("click", () => {
      if (!isMatchClockStarted() || isBreakPeriod()) {
        triggerFbToast(goalBlockMessage());
        return;
      }
      fb.scoreB++;
      fb.goals.push({ scorer: "Team 2", assist: "", team: fb.teamB, minute: getMatchCurrentMinute(), ownGoal: false });
      saveFbState();
      renderFbDashboard();
    });
  }
  if (els.simpleGoalBDecBtn) {
    els.simpleGoalBDecBtn.addEventListener("click", () => {
      if (fb.scoreB > 0) {
        fb.scoreB--;
        fb.goals = fb.goals.filter(g => g.team !== fb.teamB);
        saveFbState();
        renderFbDashboard();
      }
    });
  }

  // Extra time adjuster: manually increase/decrease stoppage time by 1
  // minute per click.
  if (els.extraDecBtn) {
    els.extraDecBtn.addEventListener("click", () => {
      if (!fb.active) return;
      fb.matchTimer.stoppageTime = Math.max(0, fb.matchTimer.stoppageTime - 60);
      saveFbState();
      renderFbDashboard();
    });
  }
  if (els.extraIncBtn) {
    els.extraIncBtn.addEventListener("click", () => {
      if (!fb.active) return;
      fb.matchTimer.stoppageTime += 60;
      saveFbState();
      renderFbDashboard();
    });
  }

  // Match dashboard clock toggle
  if (els.timerToggleBtn) {
    els.timerToggleBtn.addEventListener("click", () => {
      if (!fb.active) return;
      fb.matchTimer.running = !fb.matchTimer.running;
      if (fb.matchTimer.running) {
        startFbTimer();
      } else {
        stopFbTimer();
      }
      saveFbState();
      renderFbDashboard();
    });
  }

  // Period manual transitions trigger
  if (els.periodTransitionBtn) {
    els.periodTransitionBtn.addEventListener("click", () => {
      if (!fb.active) return;

      if (fb.period === "1st-half") {
        const liveExtra = getLiveExtraTimeSeconds(fb.period);
        if (liveExtra !== null) fb.matchTimer.stoppageTime = liveExtra;
        fb.matchTimer.stoppageTime1stHalf = fb.matchTimer.stoppageTime;
        fb.period = "halftime";
        fb.matchTimer.breakSecondsRemaining = fb.halftimeDuration * 60;
        fb.matchTimer.running = true;
        playFbWhistleSound(true); // End of period double whistle
        startFbTimer();
      } else if (fb.period === "1st-quarter") {
        const liveExtraQ1 = getLiveExtraTimeSeconds(fb.period);
        if (liveExtraQ1 !== null) fb.matchTimer.stoppageTime = liveExtraQ1;
        fb.period = "1st-quarter-break";
        fb.matchTimer.breakSecondsRemaining = getFbBreakSeconds(fb.period);
        fb.matchTimer.running = true;
        playFbWhistleSound(true); // End of period double whistle
        startFbTimer();
      } else if (fb.period === "1st-quarter-break") {
        fb.period = "2nd-quarter";
        fb.matchTimer.seconds = fb.fullDuration * 15;
        fb.matchTimer.stoppageTime = 0;
        fb.matchTimer.breakSecondsRemaining = undefined;
        fb.matchTimer.running = true;
        playFbWhistleSound(false); // Start of period single whistle
        startFbTimer();
      } else if (fb.period === "2nd-quarter") {
        const liveExtraQ = getLiveExtraTimeSeconds(fb.period);
        if (liveExtraQ !== null) fb.matchTimer.stoppageTime = liveExtraQ;
        fb.matchTimer.stoppageTime1stHalf = fb.matchTimer.stoppageTime;
        fb.period = "halftime";
        fb.matchTimer.breakSecondsRemaining = fb.halftimeDuration * 60;
        fb.matchTimer.running = true;
        playFbWhistleSound(true); // End of period double whistle
        startFbTimer();
      } else if (fb.period === "halftime") {
        fb.period = fb.quarterBreaks ? "3rd-quarter" : "2nd-half";
        fb.matchTimer.seconds = fb.quarterBreaks ? fb.fullDuration * 30 : fb.halfDuration * 60;
        fb.matchTimer.stoppageTime = 0;
        fb.matchTimer.breakSecondsRemaining = undefined;
        fb.matchTimer.running = true;
        playFbWhistleSound(false); // Start of period single whistle
        startFbTimer();
      } else if (fb.period === "3rd-quarter") {
        const liveExtraQ3 = getLiveExtraTimeSeconds(fb.period);
        if (liveExtraQ3 !== null) fb.matchTimer.stoppageTime = liveExtraQ3;
        fb.period = "3rd-quarter-break";
        fb.matchTimer.breakSecondsRemaining = getFbBreakSeconds(fb.period);
        fb.matchTimer.running = true;
        playFbWhistleSound(true); // End of period double whistle
        startFbTimer();
      } else if (fb.period === "3rd-quarter-break") {
        fb.period = "4th-quarter";
        fb.matchTimer.seconds = fb.fullDuration * 45;
        fb.matchTimer.stoppageTime = 0;
        fb.matchTimer.breakSecondsRemaining = undefined;
        fb.matchTimer.running = true;
        playFbWhistleSound(false); // Start of period single whistle
        startFbTimer();
      } else if (fb.period === "2nd-half" || fb.period === "4th-quarter") {
        const liveExtra2 = getLiveExtraTimeSeconds(fb.period);
        if (liveExtra2 !== null) fb.matchTimer.stoppageTime = liveExtra2;
        fb.matchTimer.stoppageTime2ndHalf = fb.matchTimer.stoppageTime;
        fb.matchTimer.running = false;
        playFbWhistleSound(true); // End of period double whistle
        stopFbTimer();
        if (fb.knockoutMode && fb.scoreA === fb.scoreB) {
          fb.period = "full-time-pending";
        } else {
          fb.period = "completed";
        }
      } else if (fb.period === "full-time-pending") {
        fb.period = "et-1st-half";
        fb.matchTimer.etSeconds = 0;
        fb.matchTimer.stoppageTime = 0;
        fb.matchTimer.running = false;
        playFbWhistleSound(false); // Start of period single whistle
      } else if (fb.period === "et-1st-half") {
        fb.matchTimer.stoppageTimeET1stHalf = fb.matchTimer.stoppageTime;
        fb.matchTimer.stoppageTime = 0;
        fb.period = "et-2nd-half";
        fb.matchTimer.running = true;
        playFbWhistleSound(true); // End whistle
        setTimeout(() => playFbWhistleSound(false), 300); // Start next half whistle
        startFbTimer();
      } else if (fb.period === "et-2nd-half") {
        fb.matchTimer.stoppageTimeET2ndHalf = fb.matchTimer.stoppageTime;
        fb.matchTimer.running = false;
        playFbWhistleSound(true); // End of period double whistle
        stopFbTimer();
        if (fb.scoreA === fb.scoreB) {
          fb.period = "et-full-time-pending";
        } else {
          fb.period = "completed";
        }
      } else if (fb.period === "et-full-time-pending") {
        fb.period = "shootout";
        fb.matchTimer.running = false;
        playFbWhistleSound(false); // Start of shootout whistle
        stopFbTimer();
      }

      saveFbState();
      renderFbDashboard();
    });
  }

  // Reset Match
  if (els.resetMatchBtn) {
    els.resetMatchBtn.addEventListener("click", () => {
      if (confirm("Are you sure you want to reset this match? All stats will be wiped.")) {
        fb.period = fb.quarterBreaks ? "1st-quarter" : "1st-half";
        fb.scoreA = 0;
        fb.scoreB = 0;
        fb.matchTimer.seconds = 0;
        fb.matchTimer.etSeconds = 0;
        fb.matchTimer.running = false;
        fb.matchTimer.stoppageTime = 0;
        fb.matchTimer.breakSecondsRemaining = undefined;
        fb.goals = [];
        fb.cards = [];
        fb.subs = [];
        fb.penalties = [];
        fb.shootout = { kicksA: [], kicksB: [], winner: null };

        stopFbTimer();
        saveFbState();
        renderFbDashboard();
      }
    });
  }

  // 8. MODAL FORMS TRIGGER LOGIC (ADVANCED MODE ACTIONS)
  
  // Register players squad modal trigger
  function openSquadRegisterModal(tA, tB, playersCount, callback) {
    if (!els.squadModal) return;

    if (els.squadTitle) els.squadTitle.textContent = "Team Squad Rosters Setup";
    if (els.squadSubtitle) els.squadSubtitle.textContent = `Enter roster names for ${tA} and ${tB}`;
    if (els.squadTeamALabel) els.squadTeamALabel.textContent = tA;
    if (els.squadTeamBLabel) els.squadTeamBLabel.textContent = tB;

    // Generate input forms matching exactly playersCount + maxSubs
    const maxSubs = (fb && fb.maxSubs) ? fb.maxSubs : 5;

    if (els.squadTeamAInputs) {
      els.squadTeamAInputs.innerHTML = "";
      for (let i = 0; i < playersCount + maxSubs; i++) {
        const isPlaying = i < playersCount;
        const placeholderText = isPlaying ? `${tA} Player ${i + 1} (Playing)` : `${tA} Sub ${i - playersCount + 1} (Bench)`;
        const div = document.createElement("div");
        div.innerHTML = `<input type="text" class="fb-rosterA-input" placeholder="${placeholderText}" value="" style="width: 100%; height: 36px; background: rgba(0,0,0,0.25); border: 1px solid var(--fb-border); border-radius: 6px; color: var(--ink); padding: 0 10px; font-size: 0.85rem;" />`;
        els.squadTeamAInputs.appendChild(div);
      }
    }

    if (els.squadTeamBInputs) {
      els.squadTeamBInputs.innerHTML = "";
      for (let i = 0; i < playersCount + maxSubs; i++) {
        const isPlaying = i < playersCount;
        const placeholderText = isPlaying ? `${tB} Player ${i + 1} (Playing)` : `${tB} Sub ${i - playersCount + 1} (Bench)`;
        const div = document.createElement("div");
        div.innerHTML = `<input type="text" class="fb-rosterB-input" placeholder="${placeholderText}" value="" style="width: 100%; height: 36px; background: rgba(0,0,0,0.25); border: 1px solid var(--fb-border); border-radius: 6px; color: var(--ink); padding: 0 10px; font-size: 0.85rem;" />`;
        els.squadTeamBInputs.appendChild(div);
      }
    }

    if (els.squadSaveBtn) {
      // Clear previous listeners
      const newBtn = els.squadSaveBtn.cloneNode(true);
      els.squadSaveBtn.parentNode.replaceChild(newBtn, els.squadSaveBtn);
      els.squadSaveBtn = newBtn;

      els.squadSaveBtn.addEventListener("click", () => {
        const inputsA = document.querySelectorAll(".fb-rosterA-input");
        const inputsB = document.querySelectorAll(".fb-rosterB-input");

        let allFilled = true;
        inputsA.forEach((input) => {
          if (!input.value.trim()) allFilled = false;
        });
        inputsB.forEach((input) => {
          if (!input.value.trim()) allFilled = false;
        });

        if (!allFilled) {
          triggerFbToast("Please enter names for all playing players and substitutes!");
          return;
        }

        // Validate unique player names
        const allNames = new Set();
        let duplicatePlayer = null;

        inputsA.forEach((input) => {
          const val = input.value.trim();
          const key = val.toLowerCase();
          if (allNames.has(key)) {
            duplicatePlayer = val;
          }
          allNames.add(key);
        });

        inputsB.forEach((input) => {
          const val = input.value.trim();
          const key = val.toLowerCase();
          if (allNames.has(key)) {
            duplicatePlayer = val;
          }
          allNames.add(key);
        });

        if (duplicatePlayer) {
          triggerFbToast(`All player names must be unique. Duplicate found: "${duplicatePlayer}"`);
          return;
        }

        const rosterA = [];
        inputsA.forEach((input, index) => {
          rosterA.push({ name: input.value.trim(), number: index + 1, active: index < playersCount });
        });

        const rosterB = [];
        inputsB.forEach((input, index) => {
          rosterB.push({ name: input.value.trim(), number: index + 1, active: index < playersCount });
        });

        fb.rosterA = rosterA;
        fb.rosterB = rosterB;
        saveFbState();
        els.squadModal.classList.add("hidden");
        if (callback) callback();
      });
    }

    els.squadModal.classList.remove("hidden");
  }

  // Log Advanced Goal action click triggers
  let activeLogGoalTeam = "";
  if (els.advGoalABtn) {
    els.advGoalABtn.addEventListener("click", () => {
      if (!isMatchClockStarted() || isBreakPeriod()) {
        triggerFbToast(goalBlockMessage());
        return;
      }
      activeLogGoalTeam = "A";
      openGoalLoggerModal(fb.teamA, fb.teamB, fb.rosterA, fb.rosterB);
    });
  }
  if (els.advGoalBBtn) {
    els.advGoalBBtn.addEventListener("click", () => {
      if (!isMatchClockStarted() || isBreakPeriod()) {
        triggerFbToast(goalBlockMessage());
        return;
      }
      activeLogGoalTeam = "B";
      openGoalLoggerModal(fb.teamB, fb.teamA, fb.rosterB, fb.rosterA);
    });
  }

  function openGoalLoggerModal(teamName, oppTeamName, activeRoster, oppRoster) {
    if (!els.goalModal) return;

    if (els.goalScorerSelect) {
      els.goalScorerSelect.innerHTML = activeRoster
        .filter(p => p.active)
        .map(p => `<option value="${p.name}">${p.name} (#${p.number})</option>`).join("");
      els.goalScorerSelect.innerHTML += `<option value="Other">Other / Unknown</option>`;
    }

    if (els.goalAssistSelect) {
      els.goalAssistSelect.innerHTML = `<option value="None">None</option>`;
      els.goalAssistSelect.innerHTML += activeRoster
        .filter(p => p.active)
        .map(p => `<option value="${p.name}">${p.name} (#${p.number})</option>`).join("");
    }

    if (els.goalOgCheckbox) {
      els.goalOgCheckbox.checked = false;

      // Handle own goal check
      els.goalOgCheckbox.addEventListener("change", (e) => {
        if (e.target.checked) {
          // Scorer list shifts to opponent team players
          els.goalScorerSelect.innerHTML = oppRoster
            .filter(p => p.active)
            .map(p => `<option value="${p.name}">${p.name} (#${p.number})</option>`).join("");
          els.goalAssistSelect.disabled = true;
        } else {
          els.goalScorerSelect.innerHTML = activeRoster
            .filter(p => p.active)
            .map(p => `<option value="${p.name}">${p.name} (#${p.number})</option>`).join("");
          els.goalAssistSelect.disabled = false;
        }
      });
    }

    els.goalModal.classList.remove("hidden");
  }

  if (els.goalCancelBtn) {
    els.goalCancelBtn.addEventListener("click", () => {
      if (els.goalModal) els.goalModal.classList.add("hidden");
    });
  }

  if (els.goalSubmitBtn) {
    els.goalSubmitBtn.addEventListener("click", () => {
      const scorer = els.goalScorerSelect.value;
      const assist = els.goalAssistSelect.value;
      const isOg = els.goalOgCheckbox.checked;

      const team = activeLogGoalTeam === "A" ? fb.teamA : fb.teamB;

      if (activeLogGoalTeam === "A") {
        fb.scoreA++;
      } else {
        fb.scoreB++;
      }

      fb.goals.push({
        scorer,
        assist: isOg ? "" : (assist === "None" ? "" : assist),
        team,
        minute: getMatchCurrentMinute(),
        ownGoal: isOg
      });

      saveFbState();
      renderFbDashboard();
      if (els.goalModal) els.goalModal.classList.add("hidden");
    });
  }

  // Cards logger triggers
  let activeLogCardTeam = "";
  if (els.advCardABtn) {
    els.advCardABtn.addEventListener("click", () => {
      activeLogCardTeam = "A";
      openCardLoggerModal(fb.rosterA);
    });
  }
  if (els.advCardBBtn) {
    els.advCardBBtn.addEventListener("click", () => {
      activeLogCardTeam = "B";
      openCardLoggerModal(fb.rosterB);
    });
  }

  let selectedCardType = "yellow";
  if (els.cardYellowBtn && els.cardRedBtn) {
    els.cardYellowBtn.addEventListener("click", () => {
      selectedCardType = "yellow";
      els.cardYellowBtn.classList.add("active");
      els.cardRedBtn.classList.remove("active");
    });
    els.cardRedBtn.addEventListener("click", () => {
      selectedCardType = "red";
      els.cardRedBtn.classList.add("active");
      els.cardYellowBtn.classList.remove("active");
    });
  }

  function openCardLoggerModal(roster) {
    if (!els.cardModal) return;

    if (els.cardPlayerSelect) {
      els.cardPlayerSelect.innerHTML = roster
        .filter(p => p.active)
        .map(p => `<option value="${p.name}">${p.name} (#${p.number})</option>`).join("");
    }

    selectedCardType = "yellow";
    if (els.cardYellowBtn) els.cardYellowBtn.classList.add("active");
    if (els.cardRedBtn) els.cardRedBtn.classList.remove("active");

    els.cardModal.classList.remove("hidden");
  }

  if (els.cardCancelBtn) {
    els.cardCancelBtn.addEventListener("click", () => {
      if (els.cardModal) els.cardModal.classList.add("hidden");
    });
  }

  if (els.cardSubmitBtn) {
    els.cardSubmitBtn.addEventListener("click", () => {
      const player = els.cardPlayerSelect.value;
      const team = activeLogCardTeam === "A" ? fb.teamA : fb.teamB;

      fb.cards.push({
        player,
        team,
        type: selectedCardType,
        minute: getMatchCurrentMinute()
      });

      saveFbState();
      renderFbDashboard();
      if (els.cardModal) els.cardModal.classList.add("hidden");
    });
  }

  // Subs logger triggers
  let activeLogSubTeam = "";
  if (els.advSubABtn) {
    els.advSubABtn.addEventListener("click", () => {
      activeLogSubTeam = "A";
      openSubLoggerModal(fb.rosterA);
    });
  }
  if (els.advSubBBtn) {
    els.advSubBBtn.addEventListener("click", () => {
      activeLogSubTeam = "B";
      openSubLoggerModal(fb.rosterB);
    });
  }

  function openSubLoggerModal(roster) {
    if (!els.subModal) return;

    const onField = roster.filter(p => p.active);
    const bench = roster.filter(p => !p.active);

    if (onField.length === 0 || bench.length === 0) {
      triggerFbToast("No players available to substitute!");
      return;
    }

    if (els.subOffSelect) {
      els.subOffSelect.innerHTML = onField
        .map(p => `<option value="${p.name}">${p.name} (#${p.number})</option>`).join("");
    }

    if (els.subOnSelect) {
      els.subOnSelect.innerHTML = bench
        .map(p => `<option value="${p.name}">${p.name} (#${p.number})</option>`).join("");
    }

    els.subModal.classList.remove("hidden");
  }

  if (els.subCancelBtn) {
    els.subCancelBtn.addEventListener("click", () => {
      if (els.subModal) els.subModal.classList.add("hidden");
    });
  }

  if (els.subSubmitBtn) {
    els.subSubmitBtn.addEventListener("click", () => {
      const offName = els.subOffSelect.value;
      const onName = els.subOnSelect.value;
      const roster = activeLogSubTeam === "A" ? fb.rosterA : fb.rosterB;
      const team = activeLogSubTeam === "A" ? fb.teamA : fb.teamB;

      // Swap on-field and bench active flags
      roster.forEach(p => {
        if (p.name === offName) p.active = false;
        if (p.name === onName) p.active = true;
      });

      fb.subs.push({
        playerOff: offName,
        playerOn: onName,
        team,
        minute: getMatchCurrentMinute()
      });

      saveFbState();
      renderFbDashboard();
      if (els.subModal) els.subModal.classList.add("hidden");
    });
  }

  // Penalties logger triggers
  if (els.advPenaltyABtn) {
    els.advPenaltyABtn.addEventListener("click", () => logPenaltyKick("A"));
  }
  if (els.advPenaltyBBtn) {
    els.advPenaltyBBtn.addEventListener("click", () => logPenaltyKick("B"));
  }

  function logPenaltyKick(teamLetter) {
    const team = teamLetter === "A" ? fb.teamA : fb.teamB;
    const roster = teamLetter === "A" ? fb.rosterA : fb.rosterB;

    const scorer = prompt(`Enter Penalty Taker Name (from ${team}):`, roster[0] ? roster[0].name : "");
    if (!scorer) return;

    const scored = confirm("Did they SCORE the penalty?");
    const result = scored ? "scored" : "missed";

    if (scored) {
      if (teamLetter === "A") fb.scoreA++;
      else fb.scoreB++;

      fb.goals.push({
        scorer,
        assist: "",
        team,
        minute: getMatchCurrentMinute(),
        ownGoal: false
      });
    }

    fb.penalties.push({
      team,
      scorer,
      result,
      minute: getMatchCurrentMinute()
    });

    saveFbState();
    renderFbDashboard();
  }

  // 9. TOURNAMENT LEAGUE RULES ENGINE & GENERATOR
  function renderFootballTournamentTeamInputs() {
    if (!els.tteamInputs) return;
    els.tteamInputs.innerHTML = "";

    const count = els.tteamCount ? Number(els.tteamCount.value) : 4;
    for (let i = 0; i < count; i++) {
      const div = document.createElement("div");
      div.className = "setup-group";
      div.innerHTML = `
        <label style="display: block; font-size: 0.8rem; color: var(--text-muted); margin-bottom: 6px; font-weight: 600;">Team ${i + 1} Name</label>
        <input type="text" class="football-tteam-name-input" placeholder="Enter Team ${i + 1} Name" style="width: 100%; height: 40px; background: rgba(0,0,0,0.2); border: 1px solid rgba(255,255,255,0.1); border-radius: 8px; color: var(--ink); padding: 0 12px; font-family: inherit; font-size: 0.9rem;" />
      `;
      els.tteamInputs.appendChild(div);
    }
  }

  if (els.tteamCount) {
    els.tteamCount.addEventListener("change", renderFootballTournamentTeamInputs);
  }

  // Create Tournament league click handler
  if (els.tcreateBtn) {
    els.tcreateBtn.addEventListener("click", () => {
      const tName = els.tnameInput.value.trim();
      const tDuration = els.tdurationInput.value.trim();
      const tSubs = els.tsubsInput.value.trim();
      const tHt = els.thalftimeDurationInput.value.trim();

      // STRICT VALIDATION
      if (!tName || !tDuration || !tSubs || !tHt) {
        triggerFbToast("Please fill in all tournament setup fields!");
        return;
      }

      // STRICT RANGE VALIDATION
      if (Number(tDuration) < 2 || Number(tDuration) > 90) {
        triggerFbToast("Match duration must be between 2 and 90 minutes.");
        return;
      }

      const teamInputs = document.querySelectorAll(".football-tteam-name-input");
      let missingTeamName = false;
      teamInputs.forEach(input => {
        if (!input.value.trim()) missingTeamName = true;
      });

      if (missingTeamName) {
        triggerFbToast("Please fill in all team names!");
        return;
      }

      // STRICT UNIQUE TEAM NAME VALIDATION
      const teamNames = new Set();
      let duplicateTeam = null;
      teamInputs.forEach(input => {
        const name = input.value.trim();
        const key = name.toLowerCase();
        if (teamNames.has(key)) {
          duplicateTeam = name;
        }
        teamNames.add(key);
      });

      if (duplicateTeam) {
        triggerFbToast(`Team names must be unique. Duplicate found: "${duplicateTeam}"`);
        return;
      }

      const count = Number(els.tteamCount.value);
      const isAdv = els.tmodeAdvanced.classList.contains("active");
      const fullDur = Math.max(2, Math.min(90, Number(tDuration)));
      const halfDur = Math.ceil(fullDur / 2);
      const maxSubs = Math.max(1, Math.min(11, Number(tSubs)));
      const halftimeDur = Math.max(1, Math.min(45, Number(tHt)));
      const qb = els.tquarterBreaksInput.checked;

      const teams = [];
      teamInputs.forEach((input, idx) => {
        const roster = [];
        const tNameText = input.value.trim();
        for (let i = 0; i < 11 + 3; i++) {
          roster.push({ name: `${tNameText} Player ${i + 1}`, number: i + 1, active: i < 11 });
        }
        teams.push({
          name: tNameText,
          players: roster
        });
      });

      // Generate round robin league fixtures schedule
      const fixtures = [];
      const numTeams = teams.length;
      const rounds = numTeams - 1;
      const halfSize = numTeams / 2;

      const teamList = teams.map(t => t.name);

      for (let r = 0; r < rounds; r++) {
        for (let i = 0; i < halfSize; i++) {
          const home = teamList[i];
          const away = teamList[numTeams - 1 - i];

          fixtures.push({
            round: r + 1,
            teamA: home,
            teamB: away,
            status: "scheduled", // scheduled, live, completed
            scoreA: null,
            scoreB: null,
            matchState: null
          });
        }
        // Rotate roster list
        teamList.splice(1, 0, teamList.pop());
      }

      // Shuffle fixtures round groupings slightly for natural sequence
      fixtures.sort(() => Math.random() - 0.5);

      fbt = {
        active: true,
        name: tName,
        teamCount: count,
        fullDuration: fullDur,
        halfDuration: halfDur,
        halftimeDuration: halftimeDur,
        quarterBreaks: qb,
        maxSubs: maxSubs,
        scoringMode: isAdv ? "advanced" : "simple",
        teams,
        fixtures,
        activeFixtureIndex: -1
      };

      saveFbState();
      window.location.hash = "#football-tdashboard";
    });
  }

  // Setup mode selection triggers
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

  // Render tournament league points table, fixtures and stats
  function renderFootballTournamentDashboard() {
    if (!fbt.active) return;

    if (els.tdashboardTitle) els.tdashboardTitle.textContent = fbt.name;

    // Reset default active tab view layouts
    const tabs = ["table", "fixtures", "stats", "info", "edit"];
    tabs.forEach(t => {
      const btn = document.querySelector(`#fb-tab-${t}`);
      const view = document.querySelector(`#fb-${t === 'table' ? 'table' : t}-view`);
      if (btn && view) {
        if (btn.classList.contains("active")) {
          view.classList.remove("hidden");
        } else {
          view.classList.add("hidden");
        }
      }
    });

    renderFootballPointsTable();
    renderFootballFixtures();
    renderFootballStats();
    renderFootballInfo();
    renderFootballEditSetup();
  }

  // Points table calculation (3 pts Win, 1 pt Draw, 0 pt Loss)
  function renderFootballPointsTable() {
    if (!els.pointsTableBody) return;

    const stats = {};
    fbt.teams.forEach(t => {
      stats[t.name] = { name: t.name, played: 0, won: 0, drawn: 0, lost: 0, gf: 0, ga: 0, gd: 0, pts: 0 };
    });

    fbt.fixtures.forEach(f => {
      if (f.status === "completed") {
        const sA = f.scoreA || 0;
        const sB = f.scoreB || 0;

        stats[f.teamA].played++;
        stats[f.teamB].played++;

        stats[f.teamA].gf += sA;
        stats[f.teamA].ga += sB;
        stats[f.teamB].gf += sB;
        stats[f.teamB].ga += sA;

        if (sA > sB) {
          stats[f.teamA].won++;
          stats[f.teamB].lost++;
          stats[f.teamA].pts += 3;
        } else if (sB > sA) {
          stats[f.teamB].won++;
          stats[f.teamA].lost++;
          stats[f.teamB].pts += 3;
        } else {
          stats[f.teamA].drawn++;
          stats[f.teamB].drawn++;
          stats[f.teamA].pts += 1;
          stats[f.teamB].pts += 1;
        }
      }
    });

    const rows = Object.values(stats);
    rows.forEach(r => {
      r.gd = r.gf - r.ga;
    });

    // Sorting point priorities: Points -> Goal Difference -> Goals For -> Alphabetical
    rows.sort((a, b) => {
      if (b.pts !== a.pts) return b.pts - a.pts;
      if (b.gd !== a.gd) return b.gd - a.gd;
      if (b.gf !== a.gf) return b.gf - a.gf;
      return a.name.localeCompare(b.name);
    });

    els.pointsTableBody.innerHTML = rows.map((r, i) => `
      <tr>
        <td style="padding: 10px; font-weight: 700;">${i + 1}</td>
        <td style="padding: 10px; font-weight: 700;">${r.name}</td>
        <td style="padding: 10px; text-align: center;">${r.played}</td>
        <td style="padding: 10px; text-align: center;">${r.won}</td>
        <td style="padding: 10px; text-align: center;">${r.drawn}</td>
        <td style="padding: 10px; text-align: center;">${r.lost}</td>
        <td style="padding: 10px; text-align: center; color: ${r.gd > 0 ? '#34d399' : (r.gd < 0 ? '#f87171' : 'var(--text-muted)')}; font-weight: 700;">${r.gd > 0 ? '+' : ''}${r.gd}</td>
        <td style="padding: 10px; text-align: center; color: var(--gold); font-weight: 900;">${r.pts}</td>
      </tr>
    `).join("");
  }

  // Renders round robin fixtures cards list
  function renderFootballFixtures() {
    if (!els.fixturesList) return;

    if (fbt.fixtures.length === 0) {
      els.fixturesList.innerHTML = `<p style="color: var(--text-muted); font-style: italic; font-size: 0.9rem;">No fixtures loaded.</p>`;
      return;
    }

    els.fixturesList.innerHTML = fbt.fixtures.map((f, idx) => {
      let actionBtn = "";
      if (f.status === "scheduled") {
        actionBtn = `<button class="fixture-btn play-fixture-btn" data-index="${idx}">Play Match</button>`;
      } else if (f.status === "live") {
        actionBtn = `<button class="fixture-btn play-fixture-btn" data-index="${idx}" style="border-color: #34d399; color: #34d399;">Resume</button>`;
      } else {
        actionBtn = `<button class="fixture-btn view-scorecard-btn" data-index="${idx}">View Stats</button>`;
      }

      return `
        <div class="fb-fixture-card">
          <div class="teams-row">
            <span class="team-name">${f.teamA}</span>
            <span class="fixture-score">${f.status === "completed" ? `${f.scoreA} - ${f.scoreB}` : "VS"}</span>
            <span class="team-name">${f.teamB}</span>
          </div>
          <div class="status-row">
            <span class="status-badge ${f.status}">${f.status}</span>
            ${actionBtn}
          </div>
        </div>
      `;
    }).join("");
  }

  // Compile stats leaderboards on-the-fly from completed matches
  function renderFootballStats() {
    if (!els.statsScorers || !els.statsAssists || !els.statsDiscipline) return;

    const scorers = {};
    const assists = {};
    const cards = {};

    fbt.fixtures.forEach(f => {
      if (f.status === "completed" && f.matchState) {
        const ms = f.matchState;
        
        // Goals scorer/assist compilations
        (ms.goals || []).forEach(g => {
          if (!g.ownGoal && g.scorer) {
            const key = g.scorer;
            if (!scorers[key]) scorers[key] = { name: key, team: g.team, count: 0 };
            scorers[key].count++;
          }
          if (g.assist) {
            const key = g.assist;
            if (!assists[key]) assists[key] = { name: key, team: g.team, count: 0 };
            assists[key].count++;
          }
        });

        // Cards compilations
        (ms.cards || []).forEach(c => {
          if (c.player) {
            const key = c.player;
            if (!cards[key]) cards[key] = { name: key, team: c.team, yellow: 0, red: 0 };
            if (c.type === "yellow") cards[key].yellow++;
            else cards[key].red++;
          }
        });
      }
    });

    const sortedScorers = Object.values(scorers).sort((a,b) => b.count - a.count).slice(0, 5);
    const sortedAssists = Object.values(assists).sort((a,b) => b.count - a.count).slice(0, 5);
    const sortedCards = Object.values(cards).sort((a,b) => (b.red * 2 + b.yellow) - (a.red * 2 + a.yellow)).slice(0, 5);

    const renderLeaderboard = (list, container, countLabel, defaultMsg) => {
      if (list.length === 0) {
        container.innerHTML = `<p style="color: var(--text-muted); font-style: italic; font-size: 0.85rem;">${defaultMsg}</p>`;
        return;
      }
      container.innerHTML = list.map((item, idx) => `
        <div class="fb-stat-row">
          <div class="rank-name">
            <span class="rank-num">#${idx + 1}</span>
            <div>
              <span class="player-details">${item.name}</span>
              <div class="player-team">${item.team}</div>
            </div>
          </div>
          <span class="fb-stat-val">${item.count !== undefined ? `${item.count} ${countLabel}` : (item.red > 0 ? `${item.yellow}🟨 ${item.red}🟥` : `${item.yellow}🟨`)}</span>
        </div>
      `).join("");
    };

    renderLeaderboard(sortedScorers, els.statsScorers, "Goals", "No goals logged yet.");
    renderLeaderboard(sortedAssists, els.statsAssists, "Assists", "No assists logged yet.");
    renderLeaderboard(sortedCards, els.statsDiscipline, "", "No cards registered yet.");
  }

  // Renders Squad rosters info list
  function renderFootballInfo() {
    if (!els.infoTeamsContainer) return;

    if (fbt.teams.length === 0) {
      els.infoTeamsContainer.innerHTML = `<p style="color: var(--text-muted); font-style: italic; font-size: 0.9rem;">No squads registered.</p>`;
      return;
    }

    els.infoTeamsContainer.innerHTML = fbt.teams.map(t => `
      <div style="background: rgba(255,255,255,0.02); border: 1px solid rgba(255,255,255,0.06); padding: 18px; border-radius: 12px;">
        <h3 style="margin: 0 0 10px; font-size: 1rem; color: #34d399; font-weight: 800; border-bottom: 1px solid rgba(255,255,255,0.06); padding-bottom: 6px;">${t.name}</h3>
        <div style="display: grid; gap: 6px; max-height: 180px; overflow-y: auto;">
          ${(t.players || []).map(p => `
            <div style="font-size: 0.85rem; display: flex; justify-content: space-between;">
              <span>${p.name}</span>
              <span style="color: var(--text-muted);">#${p.number}</span>
            </div>
          `).join("")}
        </div>
      </div>
    `).join("");
  }

  // Render edit tournament details
  function renderFootballEditSetup() {
    if (!els.editDuration || !els.editSubs || !els.editTeamsContainer) return;

    els.editDuration.value = fbt.fullDuration;
    els.editSubs.value = fbt.maxSubs;

    els.editTeamsContainer.innerHTML = fbt.teams.map((t, idx) => `
      <div class="setup-group">
        <label style="display: block; font-size: 0.8rem; color: var(--text-muted); margin-bottom: 6px;">Rename ${t.name}</label>
        <input type="text" class="fb-edit-team-name-input" data-index="${idx}" value="${t.name}" style="width: 100%; height: 36px; background: rgba(0,0,0,0.2); border: 1px solid rgba(255,255,255,0.1); border-radius: 6px; color: var(--ink); padding: 0 10px; font-size: 0.85rem;" />
      </div>
    `).join("");
  }

  // Save Settings edit click handler
  if (els.editSaveBtn) {
    els.editSaveBtn.addEventListener("click", () => {
      const durationVal = els.editDuration.value.trim();
      const subsVal = els.editSubs.value.trim();

      if (!durationVal || !subsVal) {
        triggerFbToast("Please fill in duration and max subs fields!");
        return;
      }

      // STRICT RANGE VALIDATION
      if (Number(durationVal) < 2 || Number(durationVal) > 90) {
        triggerFbToast("Match duration must be between 2 and 90 minutes.");
        return;
      }

      fbt.fullDuration = Math.max(2, Math.min(90, Number(durationVal)));
      fbt.halfDuration = Math.ceil(fbt.fullDuration / 2);
      fbt.maxSubs = Math.max(1, Math.min(11, Number(subsVal)));

      const teamInputs = document.querySelectorAll(".fb-edit-team-name-input");
      
      // STRICT UNIQUE TEAM NAME VALIDATION
      const teamNames = new Set();
      let duplicateTeam = null;
      teamInputs.forEach(input => {
        const name = input.value.trim() || `Team ${Number(input.dataset.index) + 1}`;
        const key = name.toLowerCase();
        if (teamNames.has(key)) {
          duplicateTeam = name;
        }
        teamNames.add(key);
      });

      if (duplicateTeam) {
        triggerFbToast(`Team names must be unique. Duplicate found: "${duplicateTeam}"`);
        return;
      }

      teamInputs.forEach(input => {
        const idx = Number(input.dataset.index);
        const oldName = fbt.teams[idx].name;
        const newName = input.value.trim() || `Team ${idx + 1}`;

        fbt.teams[idx].name = newName;

        // Sync renamed teams inside fixtures list
        fbt.fixtures.forEach(f => {
          if (f.teamA === oldName) f.teamA = newName;
          if (f.teamB === oldName) f.teamB = newName;
        });
      });

      saveFbState();
      triggerFbToast("Settings updated successfully!");
      renderFootballTournamentDashboard();
    });
  }

  // Handle Play/Resume click from tournament fixtures list
  if (els.fixturesList) {
    els.fixturesList.addEventListener("click", (e) => {
      const btn = e.target.closest(".play-fixture-btn");
      if (!btn) return;

      const idx = Number(btn.dataset.index);
      const fix = fbt.fixtures[idx];

      fbt.activeFixtureIndex = idx;

      if (fix.status === "scheduled") {
        // Start new tournament match setup
        fb = clone(defaultFbState);
        fb.active = true;
        fb.isTournamentMatch = true;
        fb.scoringMode = fbt.scoringMode;
        fb.teamA = fix.teamA;
        fb.teamB = fix.teamB;
        fb.fullDuration = fbt.fullDuration;
        fb.halfDuration = fbt.halfDuration;
        fb.halftimeDuration = fbt.halftimeDuration;
        fb.quarterBreaks = fbt.quarterBreaks;
        fb.maxSubs = fbt.maxSubs;
        fb.playersCount = 11;
        fb.period = fbt.quarterBreaks ? "1st-quarter" : "1st-half";

        // Pull registered squad players lists if advanced mode
        const teamAObj = fbt.teams.find(t => t.name === fix.teamA);
        const teamBObj = fbt.teams.find(t => t.name === fix.teamB);

        fb.rosterA = teamAObj ? clone(teamAObj.players) : [];
        fb.rosterB = teamBObj ? clone(teamBObj.players) : [];

        fix.status = "live";
      } else {
        // Load live match state
        fb = clone(fix.matchState);
        fb.active = true;
      }

      saveFbState();
      window.location.hash = "#football-match";
    });
  }

  // Handle View Stats click for completed matches
  if (els.fixturesList) {
    els.fixturesList.addEventListener("click", (e) => {
      const btn = e.target.closest(".view-scorecard-btn");
      if (!btn) return;

      const idx = Number(btn.dataset.index);
      const fix = fbt.fixtures[idx];
      const ms = fix.matchState;

      if (!ms) return;

      if (els.modalTitle) els.modalTitle.textContent = `${fix.teamA} vs ${fix.teamB} Match Stats`;
      if (els.modalTeamAName) els.modalTeamAName.textContent = fix.teamA;
      if (els.modalTeamBName) els.modalTeamBName.textContent = fix.teamB;
      if (els.modalScoreA) els.modalScoreA.textContent = fix.scoreA;
      if (els.modalScoreB) els.modalScoreB.textContent = fix.scoreB;

      // Populate completed match stats timeline
      if (els.modalGoalsTimeline) {
        const goals = ms.goals || [];
        if (goals.length === 0) {
          els.modalGoalsTimeline.innerHTML = `<div style="color: var(--text-muted);">No goals scored.</div>`;
        } else {
          els.modalGoalsTimeline.innerHTML = goals.map(g => `
            <div style="padding: 6px 10px; background: rgba(255,255,255,0.02); border-radius: 6px; display: flex; justify-content: space-between; align-items: center;">
              <strong>${g.scorer} ${g.ownGoal ? '(OG)' : ''}</strong>
              <span style="color: #34d399;">${g.minute}' ${g.assist ? `(Assist: ${g.assist})` : ''}</span>
            </div>
          `).join("");
        }
      }

      if (els.modalCardsList) {
        const cards = ms.cards || [];
        if (cards.length === 0) {
          els.modalCardsList.innerHTML = `<div style="color: var(--text-muted);">No cards issued.</div>`;
        } else {
          els.modalCardsList.innerHTML = cards.map(c => `
            <div style="padding: 6px 10px; background: rgba(255,255,255,0.02); border-radius: 6px; display: flex; justify-content: space-between; align-items: center;">
              <span>${c.player}</span>
              <span style="padding: 2px 6px; border-radius: 4px; font-weight: 800; font-size: 0.75rem; background: ${c.type === 'yellow' ? '#eab308' : '#ef4444'}; color: ${c.type === 'yellow' ? '#000' : '#fff'};">
                ${c.type.toUpperCase()} at ${c.minute}'
              </span>
            </div>
          `).join("");
        }
      }

      if (els.scorecardModal) els.scorecardModal.classList.remove("hidden");
    });
  }

  if (els.closeScorecardModal) {
    els.closeScorecardModal.addEventListener("click", () => {
      if (els.scorecardModal) els.scorecardModal.classList.add("hidden");
    });
  }

  // Submit match result (updates the tournament fixtures log)
  if (els.submitResultBtn) {
    els.submitResultBtn.addEventListener("click", () => {
      if (!fbt.active || fbt.activeFixtureIndex === -1) return;

      const idx = fbt.activeFixtureIndex;
      const fix = fbt.fixtures[idx];

      fb.matchTimer.running = false;
      stopFbTimer();

      fix.status = "completed";
      fix.scoreA = fb.scoreA;
      fix.scoreB = fb.scoreB;
      fix.matchState = clone(fb);

      fb.active = false;
      fbt.activeFixtureIndex = -1;

      saveFbState();
      triggerFbToast("Match result submitted successfully!");
      window.location.hash = "#football-tdashboard";
    });
  }

  // Reset tournament league session
  if (els.tresetBtn) {
    els.tresetBtn.addEventListener("click", () => {
      if (confirm("Are you sure you want to reset this tournament? All league scores will be lost.")) {
        fbt = clone(defaultFbtState);
        saveFbState();
        window.location.hash = "#football";
      }
    });
  }

  // Handle format selections back clicks
  if (els.formatBackBtn) {
    els.formatBackBtn.addEventListener("click", () => {
      window.location.hash = "#sports";
    });
  }
  if (els.tsetupBackBtn) {
    els.tsetupBackBtn.addEventListener("click", () => {
      window.location.hash = "#football";
    });
  }

  if (els.formatCustomBtn) {
    els.formatCustomBtn.addEventListener("click", () => {
      if (fb.active) {
        window.location.hash = "#football-match";
      } else {
        window.location.hash = "#football-custom-setup";
      }
    });
  }

  if (els.formatTournamentBtn) {
    els.formatTournamentBtn.addEventListener("click", () => {
      if (fbt.active) {
        window.location.hash = "#football-tdashboard";
      } else {
        window.location.hash = "#football-tsetup";
      }
    });
  }

  // Back button selectors for dashboard setup clicks
  if (els.backBtns && els.backBtns.length > 0) {
    els.backBtns.forEach(btn => {
      btn.addEventListener("click", () => {
        if (fb.active) {
          fb.matchTimer.running = false;
          stopFbTimer();
        }
        if (fb.active && fb.isTournamentMatch && fbt.active && fbt.activeFixtureIndex !== -1) {
          // Save current live state back to its tournament fixture
          fbt.fixtures[fbt.activeFixtureIndex].matchState = clone(fb);
          fb.active = false;
          saveFbState();
          window.location.hash = "#football-tdashboard";
        } else {
          fb.active = false;
          saveFbState();
          window.location.hash = "#football";
        }
      });
    });
  }

  // Tab View Links click selectors inside tournament dashboard
  const tabNames = ["table", "fixtures", "stats", "info", "edit"];
  tabNames.forEach(t => {
    const tabBtn = document.querySelector(`#fb-tab-${t}`);
    if (tabBtn) {
      tabBtn.addEventListener("click", () => {
        tabNames.forEach(t2 => {
          const btn2 = document.querySelector(`#fb-tab-${t2}`);
          const view2 = document.querySelector(`#fb-${t2 === 'table' ? 'table' : t2}-view`);
          if (btn2 && view2) {
            if (t === t2) {
              btn2.classList.add("active");
              view2.classList.remove("hidden");
            } else {
              btn2.classList.remove("active");
              view2.classList.add("hidden");
            }
          }
        });
        renderFootballTournamentDashboard();
      });
    }
  });

  // Bind the Football card button from home sports page
  const fbCardBtn = document.querySelector("[data-open-sport='football']");
  if (fbCardBtn) {
    fbCardBtn.addEventListener("click", () => {
      window.location.hash = "#football";
    });
  }

  // 10. INITIALIZATION
  window.addEventListener("hashchange", () => {
    handleFootballNavigation();
  });

  // Load existing session states on startup
  loadFbState();

  // If match was left running before a page refresh, stop it instead of
  // silently resuming — the user must explicitly resume the clock.
  if (fb.active && fb.matchTimer && fb.matchTimer.running) {
    fb.matchTimer.running = false;
    saveFbState();
    triggerFbToast("Match timer was stopped because the page refreshed. Press Resume Clock to continue.");
  }

  // Handle first load checks. app.js resets location.hash to "#sports" on
  // every load (showSportsPage()) before this code runs. Only restore the
  // original hash (captured before app.js ran) when it was an active
  // tracker view — a refresh on the live match/tournament dashboard stays
  // there; a refresh anywhere else (format picker, setup forms) falls
  // through to the all-sports page as normal.
  const trackerHashes = ["#football-match", "#football-tdashboard"];
  const originalHash = window.__initialHash || window.location.hash;
  if (trackerHashes.includes(originalHash)) {
    if (window.location.hash !== originalHash) {
      window.location.hash = originalHash;
    } else {
      handleFootballNavigation();
    }
  }
})();
