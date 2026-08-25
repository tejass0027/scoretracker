/**
 * ==========================================================================
 * VOLLEYBALL SCORING & TOURNAMENT ENGINE
 * ==========================================================================
 * Modular FIVB Volleyball tracker supporting Best of 3 / 5 Sets,
 * Rally point scoring with win-by-2, 30s Timeouts, Server indicator, and Tournaments.
 */

(() => {
  "use strict";

  // 1. STATE & CONSTANTS
  const VB_STORAGE_KEY = "scoretracker_volleyball_match_state";
  const VBT_STORAGE_KEY = "scoretracker_volleyball_tournament_state";

  const defaultVolleyballState = {
    active: false,
    isTournamentMatch: false,
    team1: "Team 1",
    team2: "Team 2",
    setsFormat: 3, // 3 (Best of 3) or 5 (Best of 5) or 1
    pointsPerSet: 25, // Standard 25 or 21 or 15
    decidingSetPoints: 15,
    currentSetIndex: 0, // 0 for Set 1, 1 for Set 2, etc.
    setsWon1: 0,
    setsWon2: 0,
    setScores: [[0, 0], [0, 0], [0, 0], [0, 0], [0, 0]],
    currentPts1: 0,
    currentPts2: 0,
    servingTeam: 1, // 1 or 2
    t1TimeoutsLeft: 2,
    t2TimeoutsLeft: 2,
    timeline: [], // { text, score, time }
    history: [], // stack of previous states for undo
    matchCompleted: false,
    winner: null
  };

  const defaultVbtState = {
    active: false,
    name: "Nations Volleyball League",
    teamCount: 4,
    setsFormat: 3,
    teams: [], // { name, played, wins, losses, sw, sl, pw, pl, pts }
    fixtures: [], // { round, teamA, teamB, scoreA, scoreB, setsWonA, setsWonB, status, matchState }
    activeFixtureIndex: -1
  };

  let vb = clone(defaultVolleyballState);
  let vbt = clone(defaultVbtState);
  let timeoutInterval = null;
  let timeoutSeconds = 30;

  function clone(obj) {
    return JSON.parse(JSON.stringify(obj));
  }

  // 2. DOM ELEMENTS SELECTORS
  const els = {
    // Page & Views
    volleyballPage: document.querySelector("#volleyball-page"),
    formatView: document.querySelector("#vb-format-view"),
    setupView: document.querySelector("#vb-setup-view"),
    dashboardView: document.querySelector("#vb-dashboard-view"),
    tsetupView: document.querySelector("#vb-tsetup-view"),
    tdashboardView: document.querySelector("#vb-tdashboard-view"),

    // Format selection buttons
    formatBackBtn: document.querySelector("#vb-format-back-btn"),
    formatCustomBtn: document.querySelector("#vb-format-custom-btn"),
    formatTournamentBtn: document.querySelector("#vb-format-tournament-btn"),

    // Setup
    setupBackBtn: document.querySelector("#vb-setup-back-btn"),
    team1Input: document.querySelector("#vb-team1-input"),
    team2Input: document.querySelector("#vb-team2-input"),
    setsSelect: document.querySelector("#vb-sets-select"),
    pointsSelect: document.querySelector("#vb-points-select"),
    startBtn: document.querySelector("#vb-start-btn"),

    // Dashboard Header & Status
    dashboardBackBtn: document.querySelector("#vb-dashboard-back-btn"),
    resetMatchBtn: document.querySelector("#vb-reset-match-btn"),
    liveIndicator: document.querySelector("#vb-live-indicator"),

    // Scorecard Table
    tableTeam1: document.querySelector("#vb-table-team1"),
    tableTeam2: document.querySelector("#vb-table-team2"),
    t1ServingDot: document.querySelector("#vb-t1-serving-dot"),
    t2ServingDot: document.querySelector("#vb-t2-serving-dot"),
    t1SetsWon: document.querySelector("#vb-t1-sets-won"),
    t2SetsWon: document.querySelector("#vb-t2-sets-won"),
    thS1: document.querySelector("#vb-th-s1"),
    thS2: document.querySelector("#vb-th-s2"),
    thS3: document.querySelector("#vb-th-s3"),
    thS4: document.querySelector("#vb-th-s4"),
    thS5: document.querySelector("#vb-th-s5"),
    t1S1: document.querySelector("#vb-t1-s1"),
    t1S2: document.querySelector("#vb-t1-s2"),
    t1S3: document.querySelector("#vb-t1-s3"),
    t1S4: document.querySelector("#vb-t1-s4"),
    t1S5: document.querySelector("#vb-t1-s5"),
    t2S1: document.querySelector("#vb-t2-s1"),
    t2S2: document.querySelector("#vb-t2-s2"),
    t2S3: document.querySelector("#vb-t2-s3"),
    t2S4: document.querySelector("#vb-t2-s4"),
    t2S5: document.querySelector("#vb-t2-s5"),

    // Rally Score Display
    team1NameDisplay: document.querySelector("#vb-team1-name-display"),
    team2NameDisplay: document.querySelector("#vb-team2-name-display"),
    team1Pts: document.querySelector("#vb-team1-pts"),
    team2Pts: document.querySelector("#vb-team2-pts"),
    currentSetBadge: document.querySelector("#vb-current-set-badge"),
    targetBadge: document.querySelector("#vb-target-badge"),
    toggleServerBtn: document.querySelector("#vb-toggle-server-btn"),

    // Timeouts
    t1TO1: document.querySelector("#vb-t1-to-1"),
    t1TO2: document.querySelector("#vb-t1-to-2"),
    t2TO1: document.querySelector("#vb-t2-to-1"),
    t2TO2: document.querySelector("#vb-t2-to-2"),
    timeoutClockPanel: document.querySelector("#vb-timeout-clock-panel"),
    timeoutCallerLabel: document.querySelector("#vb-timeout-caller-label"),
    timeoutTimerDisplay: document.querySelector("#vb-timeout-timer-display"),
    cancelTimeoutBtn: document.querySelector("#vb-cancel-timeout-btn"),

    // Action Buttons
    t1PointBtn: document.querySelector("#vb-t1-point-btn"),
    t2PointBtn: document.querySelector("#vb-t2-point-btn"),
    t1TimeoutBtn: document.querySelector("#vb-t1-timeout-btn"),
    t2TimeoutBtn: document.querySelector("#vb-t2-timeout-btn"),
    undoBtn: document.querySelector("#vb-undo-btn"),
    manualSetBtn: document.querySelector("#vb-manual-set-btn"),
    submitResultBtn: document.querySelector("#vb-submit-result-btn"),
    timelineList: document.querySelector("#vb-timeline-list"),

    // Tournament Setup
    tsetupBackBtn: document.querySelector("#vb-tsetup-back-btn"),
    tnameInput: document.querySelector("#vb-tname-input"),
    tteamCount: document.querySelector("#vb-tteam-count"),
    tsetsSelect: document.querySelector("#vb-tsets-select"),
    tteamInputs: document.querySelector("#vb-tteam-inputs"),
    tcreateBtn: document.querySelector("#vb-tcreate-btn"),

    // Tournament Dashboard
    tdashboardBackBtn: document.querySelector("#vb-tdashboard-back-btn"),
    tresetBtn: document.querySelector("#vb-treset-btn"),
    tdashboardName: document.querySelector("#vb-tdashboard-name"),
    tabTable: document.querySelector("#vb-tab-table"),
    tabFixtures: document.querySelector("#vb-tab-fixtures"),
    tabEdit: document.querySelector("#vb-tab-edit"),
    tableView: document.querySelector("#vb-table-view"),
    fixturesView: document.querySelector("#vb-fixtures-view"),
    editView: document.querySelector("#vb-edit-view"),
    pointsTableBody: document.querySelector("#vb-points-table-body"),
    fixturesList: document.querySelector("#vb-fixtures-list"),
    editTeamsContainer: document.querySelector("#vb-edit-teams-container"),
    editSaveBtn: document.querySelector("#vb-edit-save-btn")
  };

  // 3. TOAST & AUDIO BUZZER
  function triggerVbToast(message) {
    const existing = document.querySelector(".vb-toast-notification");
    if (existing) existing.remove();

    const toast = document.createElement("div");
    toast.className = "vb-toast-notification";
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

  function playVolleyballBuzzer() {
    try {
      const AudioCtx = window.AudioContext || window.webkitAudioContext;
      if (!AudioCtx) return;
      const ctx = new AudioCtx();
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      osc.type = "square";
      osc.frequency.setValueAtTime(520, ctx.currentTime);
      osc.frequency.setValueAtTime(440, ctx.currentTime + 0.3);

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
  function loadVolleyballState() {
    try {
      const stored = localStorage.getItem(VB_STORAGE_KEY);
      const storedT = localStorage.getItem(VBT_STORAGE_KEY);
      if (stored) vb = { ...clone(defaultVolleyballState), ...JSON.parse(stored) };
      if (storedT) vbt = { ...clone(defaultVbtState), ...JSON.parse(storedT) };
    } catch (e) {
      console.error("Failed to load volleyball state", e);
    }
  }

  function saveVolleyballState() {
    try {
      localStorage.setItem(VB_STORAGE_KEY, JSON.stringify(vb));
      localStorage.setItem(VBT_STORAGE_KEY, JSON.stringify(vbt));
    } catch (e) {
      console.error("Failed to save volleyball state", e);
    }
  }

  // 5. VIEW NAVIGATION
  function hideAllVbViews() {
    if (els.formatView) els.formatView.classList.add("hidden");
    if (els.setupView) els.setupView.classList.add("hidden");
    if (els.dashboardView) els.dashboardView.classList.add("hidden");
    if (els.tsetupView) els.tsetupView.classList.add("hidden");
    if (els.tdashboardView) els.tdashboardView.classList.add("hidden");
  }

  function showVolleyballPage(fromHash = false) {
    const cp = document.querySelector("#cricket-page");
    const fp = document.querySelector("#football-page");
    const bp = document.querySelector("#basketball-page");
    const tp = document.querySelector("#tennis-page");
    const badp = document.querySelector("#badminton-page");
    const hp = document.querySelector("#hockey-page");
    const sp = document.querySelector("#sports-page");
    const fop = document.querySelector("#format-page");

    if (cp) cp.classList.add("hidden");
    if (fp) fp.classList.add("hidden");
    if (bp) bp.classList.add("hidden");
    if (tp) tp.classList.add("hidden");
    if (badp) badp.classList.add("hidden");
    if (hp) hp.classList.add("hidden");
    if (sp) sp.classList.add("hidden");
    if (fop) fop.classList.add("hidden");

    if (els.volleyballPage) els.volleyballPage.classList.remove("hidden");
    hideAllVbViews();

    const hash = window.location.hash;
    if (hash === "#volleyball") {
      if (els.formatView) els.formatView.classList.remove("hidden");
    } else if (hash === "#volleyball-custom") {
      if (els.setupView) els.setupView.classList.remove("hidden");
      if (els.team1Input) els.team1Input.value = "";
      if (els.team2Input) els.team2Input.value = "";
    } else if (hash === "#volleyball-match") {
      if (els.dashboardView) els.dashboardView.classList.remove("hidden");
      renderVolleyballDashboard();
    } else if (hash === "#volleyball-tsetup") {
      if (els.tsetupView) els.tsetupView.classList.remove("hidden");
      renderTournamentTeamInputs();
    } else if (hash === "#volleyball-tdashboard") {
      if (els.tdashboardView) els.tdashboardView.classList.remove("hidden");
      renderTournamentDashboard();
    }
  }

  window.showVolleyballPage = showVolleyballPage;

  // 6. FORMAT CHOICE LISTENERS
  if (els.formatBackBtn) {
    els.formatBackBtn.addEventListener("click", () => {
      window.location.hash = "#sports";
    });
  }

  if (els.formatCustomBtn) {
    els.formatCustomBtn.addEventListener("click", () => {
      window.location.hash = "#volleyball-custom";
    });
  }

  if (els.formatTournamentBtn) {
    els.formatTournamentBtn.addEventListener("click", () => {
      if (vbt.active) {
        window.location.hash = "#volleyball-tdashboard";
      } else {
        window.location.hash = "#volleyball-tsetup";
      }
    });
  }

  // 7. MATCH SETUP & START
  if (els.setupBackBtn) {
    els.setupBackBtn.addEventListener("click", () => {
      window.location.hash = "#volleyball";
    });
  }

  if (els.startBtn) {
    els.startBtn.addEventListener("click", () => {
      const t1 = els.team1Input.value.trim() || "Brazil";
      const t2 = els.team2Input.value.trim() || "Poland";
      const setsFormat = Number(els.setsSelect ? els.setsSelect.value : 3);
      const points = Number(els.pointsSelect ? els.pointsSelect.value : 25);

      if (t1.toLowerCase() === t2.toLowerCase()) {
        triggerVbToast("Team names must be different.");
        return;
      }

      initializeVolleyballMatch(t1, t2, setsFormat, points);
    });
  }

  function initializeVolleyballMatch(t1, t2, setsFormat = 3, points = 25) {
    vb = clone(defaultVolleyballState);
    vb.active = true;
    vb.isTournamentMatch = false;
    vb.team1 = t1;
    vb.team2 = t2;
    vb.setsFormat = setsFormat;
    vb.pointsPerSet = points;
    vb.decidingSetPoints = 15;
    vb.currentSetIndex = 0;
    vb.setScores = [[0, 0], [0, 0], [0, 0], [0, 0], [0, 0]];
    vb.currentPts1 = 0;
    vb.currentPts2 = 0;
    vb.servingTeam = 1;
    vb.t1TimeoutsLeft = 2;
    vb.t2TimeoutsLeft = 2;

    saveVolleyballState();
    window.location.hash = "#volleyball-match";
  }

  // 8. SCORING ENGINE
  function saveToHistory() {
    vb.history.push({
      currentSetIndex: vb.currentSetIndex,
      setsWon1: vb.setsWon1,
      setsWon2: vb.setsWon2,
      setScores: clone(vb.setScores),
      currentPts1: vb.currentPts1,
      currentPts2: vb.currentPts2,
      servingTeam: vb.servingTeam,
      t1TimeoutsLeft: vb.t1TimeoutsLeft,
      t2TimeoutsLeft: vb.t2TimeoutsLeft,
      matchCompleted: vb.matchCompleted,
      winner: vb.winner
    });
    if (vb.history.length > 30) vb.history.shift();
  }

  function logTimelineEvent(desc) {
    const setNum = vb.currentSetIndex + 1;
    const scoreStr = `Set ${setNum}: ${vb.team1} ${vb.currentPts1} - ${vb.currentPts2} ${vb.team2} (Sets: ${vb.setsWon1}-${vb.setsWon2})`;

    vb.timeline.unshift({
      text: desc,
      score: scoreStr,
      time: `Set ${setNum}`
    });
  }

  function getTargetPointsForSet(setIdx) {
    const isDecider = (vb.setsFormat === 3 && setIdx === 2) || (vb.setsFormat === 5 && setIdx === 4);
    return isDecider ? vb.decidingSetPoints : vb.pointsPerSet;
  }

  function addPoint(teamNum, attribution = "") {
    if (vb.matchCompleted) return;
    saveToHistory();

    if (teamNum === 1) {
      vb.currentPts1++;
      vb.servingTeam = 1;
    } else {
      vb.currentPts2++;
      vb.servingTeam = 2;
    }

    const scoringTeam = teamNum === 1 ? vb.team1 : vb.team2;
    const attrText = attribution ? ` via ${attribution}` : "";
    logTimelineEvent(`Point for ${scoringTeam}${attrText}`);

    // Update live set score
    vb.setScores[vb.currentSetIndex] = [vb.currentPts1, vb.currentPts2];

    // Check Set Win Condition
    const target = getTargetPointsForSet(vb.currentSetIndex);
    const p1 = vb.currentPts1;
    const p2 = vb.currentPts2;

    if ((p1 >= target && p1 - p2 >= 2) || (p2 >= target && p2 - p1 >= 2)) {
      const setWinnerNum = p1 > p2 ? 1 : 2;
      finishSet(setWinnerNum);
    } else {
      saveVolleyballState();
      renderVolleyballDashboard();
    }
  }

  function finishSet(winnerNum) {
    const setWinnerName = winnerNum === 1 ? vb.team1 : vb.team2;
    const setNum = vb.currentSetIndex + 1;

    if (winnerNum === 1) vb.setsWon1++;
    else vb.setsWon2++;

    vb.setScores[vb.currentSetIndex] = [vb.currentPts1, vb.currentPts2];
    logTimelineEvent(`🏆 ${setWinnerName} wins Set ${setNum} (${vb.currentPts1}-${vb.currentPts2})!`);
    playVolleyballBuzzer();
    triggerVbToast(`${setWinnerName} wins Set ${setNum}!`);

    const setsToWin = Math.ceil(vb.setsFormat / 2);

    if (vb.setsWon1 >= setsToWin || vb.setsWon2 >= setsToWin) {
      vb.matchCompleted = true;
      vb.winner = vb.setsWon1 > vb.setsWon2 ? vb.team1 : vb.team2;
      logTimelineEvent(`🏁 MATCH WON by ${vb.winner} (${vb.setsWon1}-${vb.setsWon2} Sets)!`);
      triggerVbToast(`🎉 MATCH WON by ${vb.winner}!`);
    } else {
      // Advance to next set
      vb.currentSetIndex++;
      vb.currentPts1 = 0;
      vb.currentPts2 = 0;
      vb.t1TimeoutsLeft = 2;
      vb.t2TimeoutsLeft = 2;
    }

    saveVolleyballState();
    renderVolleyballDashboard();
  }

  // Timeouts Manager
  function callTimeout(teamNum) {
    if (vb.matchCompleted) return;

    if (teamNum === 1) {
      if (vb.t1TimeoutsLeft <= 0) {
        triggerVbToast(`${vb.team1} has no timeouts left this set.`);
        return;
      }
      vb.t1TimeoutsLeft--;
    } else {
      if (vb.t2TimeoutsLeft <= 0) {
        triggerVbToast(`${vb.team2} has no timeouts left this set.`);
        return;
      }
      vb.t2TimeoutsLeft--;
    }

    const teamName = teamNum === 1 ? vb.team1 : vb.team2;
    logTimelineEvent(`⏱️ Timeout called by ${teamName}`);
    saveVolleyballState();
    renderVolleyballDashboard();

    startTimeoutTimer(teamName);
  }

  function startTimeoutTimer(callerName) {
    if (timeoutInterval) clearInterval(timeoutInterval);
    timeoutSeconds = 30;

    if (els.timeoutClockPanel) els.timeoutClockPanel.classList.remove("hidden");
    if (els.timeoutCallerLabel) els.timeoutCallerLabel.textContent = `${callerName} Timeout`;

    renderTimeoutTimer();

    timeoutInterval = setInterval(() => {
      timeoutSeconds--;
      renderTimeoutTimer();
      if (timeoutSeconds <= 0) {
        clearInterval(timeoutInterval);
        if (els.timeoutClockPanel) els.timeoutClockPanel.classList.add("hidden");
        playVolleyballBuzzer();
        triggerVbToast("Timeout ended! Ready to play.");
      }
    }, 1000);
  }

  function renderTimeoutTimer() {
    if (els.timeoutTimerDisplay) {
      els.timeoutTimerDisplay.textContent = `00:${String(timeoutSeconds).padStart(2, '0')}`;
    }
  }

  if (els.cancelTimeoutBtn) {
    els.cancelTimeoutBtn.addEventListener("click", () => {
      if (timeoutInterval) clearInterval(timeoutInterval);
      if (els.timeoutClockPanel) els.timeoutClockPanel.classList.add("hidden");
      triggerVbToast("Timeout ended early.");
    });
  }

  // Undo
  function undoVolleyballEvent() {
    if (!vb.history || vb.history.length === 0) {
      triggerVbToast("No actions to undo.");
      return;
    }
    const prev = vb.history.pop();
    vb.currentSetIndex = prev.currentSetIndex;
    vb.setsWon1 = prev.setsWon1;
    vb.setsWon2 = prev.setsWon2;
    vb.setScores = clone(prev.setScores);
    vb.currentPts1 = prev.currentPts1;
    vb.currentPts2 = prev.currentPts2;
    vb.servingTeam = prev.servingTeam;
    vb.t1TimeoutsLeft = prev.t1TimeoutsLeft;
    vb.t2TimeoutsLeft = prev.t2TimeoutsLeft;
    vb.matchCompleted = prev.matchCompleted;
    vb.winner = prev.winner;

    if (vb.timeline.length > 0) vb.timeline.shift();

    saveVolleyballState();
    renderVolleyballDashboard();
    triggerVbToast("Last rally point undone.");
  }

  // Render Dashboard
  function renderVolleyballDashboard() {
    if (!els.dashboardView) return;

    if (els.team1NameDisplay) els.team1NameDisplay.textContent = vb.team1;
    if (els.team2NameDisplay) els.team2NameDisplay.textContent = vb.team2;
    if (els.tableTeam1) els.tableTeam1.textContent = vb.team1;
    if (els.tableTeam2) els.tableTeam2.textContent = vb.team2;

    if (els.team1Pts) els.team1Pts.textContent = vb.currentPts1;
    if (els.team2Pts) els.team2Pts.textContent = vb.currentPts2;
    if (els.t1SetsWon) els.t1SetsWon.textContent = vb.setsWon1;
    if (els.t2SetsWon) els.t2SetsWon.textContent = vb.setsWon2;

    // Serving Ball Indicator
    if (els.t1ServingDot) {
      if (vb.servingTeam === 1) els.t1ServingDot.classList.remove("hidden");
      else els.t1ServingDot.classList.add("hidden");
    }
    if (els.t2ServingDot) {
      if (vb.servingTeam === 2) els.t2ServingDot.classList.remove("hidden");
      else els.t2ServingDot.classList.add("hidden");
    }

    // Set Scores in Table
    const scoreCells = [
      [els.t1S1, els.t2S1],
      [els.t1S2, els.t2S2],
      [els.t1S3, els.t2S3],
      [els.t1S4, els.t2S4],
      [els.t1S5, els.t2S5]
    ];

    const thHeaders = [els.thS1, els.thS2, els.thS3, els.thS4, els.thS5];

    for (let i = 0; i < 5; i++) {
      const isVisible = i < vb.setsFormat;
      if (thHeaders[i]) thHeaders[i].style.display = isVisible ? "" : "none";
      if (scoreCells[i][0]) scoreCells[i][0].style.display = isVisible ? "" : "none";
      if (scoreCells[i][1]) scoreCells[i][1].style.display = isVisible ? "" : "none";

      if (isVisible) {
        if (i < vb.currentSetIndex) {
          scoreCells[i][0].textContent = vb.setScores[i][0];
          scoreCells[i][1].textContent = vb.setScores[i][1];
          scoreCells[i][0].style.color = "#fff";
          scoreCells[i][1].style.color = "#fff";
        } else if (i === vb.currentSetIndex) {
          scoreCells[i][0].textContent = vb.currentPts1;
          scoreCells[i][1].textContent = vb.currentPts2;
          scoreCells[i][0].style.color = "var(--vb-primary)";
          scoreCells[i][1].style.color = "var(--vb-blue)";
        } else {
          scoreCells[i][0].textContent = "-";
          scoreCells[i][1].textContent = "-";
          scoreCells[i][0].style.color = "var(--text-muted)";
          scoreCells[i][1].style.color = "var(--text-muted)";
        }
      }
    }

    // Badges & Targets
    if (els.currentSetBadge) {
      if (vb.matchCompleted) {
        els.currentSetBadge.textContent = `MATCH WON BY ${vb.winner}`;
        els.currentSetBadge.style.color = "#10b981";
      } else {
        els.currentSetBadge.textContent = `SET ${vb.currentSetIndex + 1}`;
        els.currentSetBadge.style.color = "var(--vb-primary)";
      }
    }

    if (els.targetBadge) {
      const target = getTargetPointsForSet(vb.currentSetIndex);
      const isDeuce = (vb.currentPts1 >= target - 1 && vb.currentPts2 >= target - 1);
      if (vb.matchCompleted) {
        els.targetBadge.textContent = `Final Score: ${vb.setsWon1} - ${vb.setsWon2} Sets`;
      } else if (isDeuce) {
        els.targetBadge.textContent = `DEUCE! Must win by 2 points`;
        els.targetBadge.style.color = "#f87171";
      } else {
        els.targetBadge.textContent = `Target: ${target} pts (Win by 2)`;
        els.targetBadge.style.color = "var(--text-muted)";
      }
    }

    // Timeouts Left Indicators
    renderTimeoutDots();

    // Live Indicator
    if (els.liveIndicator) {
      if (vb.matchCompleted) els.liveIndicator.classList.add("hidden");
      else els.liveIndicator.classList.remove("hidden");
    }

    // Tournament Result button
    if (els.submitResultBtn) {
      if (vb.isTournamentMatch && vb.matchCompleted) els.submitResultBtn.classList.remove("hidden");
      else els.submitResultBtn.classList.add("hidden");
    }

    // Render Timeline Log
    if (els.timelineList) {
      if (vb.timeline.length === 0) {
        els.timelineList.innerHTML = `<p style="color: var(--text-muted); font-style: italic; font-size: 0.9rem; margin: 0;">No rally events logged yet.</p>`;
      } else {
        els.timelineList.innerHTML = vb.timeline.map(item => `
          <div class="vb-log-item">
            <div>
              <div style="font-weight: 700;">${item.text}</div>
              <div style="font-size: 0.75rem; color: var(--text-muted); margin-top: 2px;">${item.score}</div>
            </div>
            <div style="font-family: monospace; font-size: 0.75rem; color: var(--vb-primary); font-weight:700;">${item.time}</div>
          </div>
        `).join("");
      }
    }
  }

  function renderTimeoutDots() {
    if (els.t1TO1) els.t1TO1.className = `vb-timeout-dot ${vb.t1TimeoutsLeft >= 1 ? 'available' : 'used'}`;
    if (els.t1TO2) els.t1TO2.className = `vb-timeout-dot ${vb.t1TimeoutsLeft >= 2 ? 'available' : 'used'}`;
    if (els.t2TO1) els.t2TO1.className = `vb-timeout-dot ${vb.t2TimeoutsLeft >= 1 ? 'available' : 'used'}`;
    if (els.t2TO2) els.t2TO2.className = `vb-timeout-dot ${vb.t2TimeoutsLeft >= 2 ? 'available' : 'used'}`;
  }

  // 9. DASHBOARD EVENT LISTENERS
  if (els.dashboardBackBtn) {
    els.dashboardBackBtn.addEventListener("click", () => {
      if (timeoutInterval) clearInterval(timeoutInterval);
      if (vb.isTournamentMatch) {
        window.location.hash = "#volleyball-tdashboard";
      } else {
        window.location.hash = "#volleyball";
      }
    });
  }

  if (els.resetMatchBtn) {
    els.resetMatchBtn.addEventListener("click", () => {
      if (confirm("Reset current Volleyball match? All set scores and rally points will be erased.")) {
        if (timeoutInterval) clearInterval(timeoutInterval);
        initializeVolleyballMatch(vb.team1, vb.team2, vb.setsFormat, vb.pointsPerSet);
      }
    });
  }

  if (els.toggleServerBtn) {
    els.toggleServerBtn.addEventListener("click", () => {
      vb.servingTeam = vb.servingTeam === 1 ? 2 : 1;
      saveVolleyballState();
      renderVolleyballDashboard();
      triggerVbToast(`Serving: ${vb.servingTeam === 1 ? vb.team1 : vb.team2}`);
    });
  }

  if (els.t1PointBtn) els.t1PointBtn.addEventListener("click", () => addPoint(1));
  if (els.t2PointBtn) els.t2PointBtn.addEventListener("click", () => addPoint(2));

  document.querySelectorAll(".vb-cat-btn").forEach(btn => {
    btn.addEventListener("click", (e) => {
      const cat = e.currentTarget.getAttribute("data-cat");
      const label = cat === "spike" ? "Spike / Kill" : cat === "ace" ? "Service Ace" : cat === "block" ? "Block Point" : "Opponent Error";
      addPoint(vb.servingTeam, label);
    });
  });

  if (els.t1TimeoutBtn) els.t1TimeoutBtn.addEventListener("click", () => callTimeout(1));
  if (els.t2TimeoutBtn) els.t2TimeoutBtn.addEventListener("click", () => callTimeout(2));
  if (els.undoBtn) els.undoBtn.addEventListener("click", undoVolleyballEvent);

  if (els.manualSetBtn) {
    els.manualSetBtn.addEventListener("click", () => {
      if (vb.matchCompleted) return;
      const winner = vb.currentPts1 > vb.currentPts2 ? 1 : 2;
      if (confirm(`Manually end Set ${vb.currentSetIndex + 1} with winner ${winner === 1 ? vb.team1 : vb.team2}?`)) {
        finishSet(winner);
      }
    });
  }

  // Submit Result for Tournament Match
  if (els.submitResultBtn) {
    els.submitResultBtn.addEventListener("click", () => {
      if (vbt.active && vbt.activeFixtureIndex >= 0) {
        const fix = vbt.fixtures[vbt.activeFixtureIndex];
        if (fix) {
          fix.scoreA = `${vb.setsWon1} (${vb.setScores.map(s => s[0]).slice(0, vb.currentSetIndex + 1).join(",")})`;
          fix.scoreB = `${vb.setsWon2} (${vb.setScores.map(s => s[1]).slice(0, vb.currentSetIndex + 1).join(",")})`;
          fix.setsWonA = vb.setsWon1;
          fix.setsWonB = vb.setsWon2;
          fix.status = "completed";
          fix.matchState = clone(vb);
          saveVolleyballState();
          triggerVbToast("Tournament match result submitted!");
          window.location.hash = "#volleyball-tdashboard";
        }
      }
    });
  }

  // 10. TOURNAMENT ENGINE
  if (els.tsetupBackBtn) {
    els.tsetupBackBtn.addEventListener("click", () => {
      window.location.hash = "#volleyball";
    });
  }

  if (els.tteamCount) {
    els.tteamCount.addEventListener("change", renderTournamentTeamInputs);
  }

  function renderTournamentTeamInputs() {
    if (!els.tteamInputs) return;
    const count = Number(els.tteamCount ? els.tteamCount.value : 4);
    const defaultVolleyballTeams = ["Brazil", "Poland", "Italy", "USA", "Japan", "France", "Argentina", "Serbia"];

    els.tteamInputs.innerHTML = "";
    for (let i = 0; i < count; i++) {
      const defName = defaultVolleyballTeams[i] || `Team ${i + 1}`;
      const div = document.createElement("div");
      div.innerHTML = `
        <label style="display: block; font-size: 0.8rem; color: var(--text-muted); margin-bottom: 4px; font-weight: 600;">Team ${i + 1} Name</label>
        <input type="text" class="volleyball-tteam-name-input" value="${defName}" autocomplete="off" style="width: 100%; height: 38px; background: rgba(0,0,0,0.25); border: 1px solid rgba(255,255,255,0.1); border-radius: 6px; color: var(--ink); padding: 0 12px; font-size: 0.9rem;" />
      `;
      els.tteamInputs.appendChild(div);
    }
  }

  if (els.tcreateBtn) {
    els.tcreateBtn.addEventListener("click", () => {
      const name = els.tnameInput.value.trim() || "Volleyball Championship";
      const teamCount = Number(els.tteamCount.value) || 4;
      const setsFormat = Number(els.tsetsSelect ? els.tsetsSelect.value : 3);

      const teamInputs = document.querySelectorAll(".volleyball-tteam-name-input");
      const teamNames = [];
      const uniqueNames = new Set();

      for (let i = 0; i < teamInputs.length; i++) {
        const tName = teamInputs[i].value.trim() || `Team ${i + 1}`;
        const nameKey = tName.toLowerCase();
        if (uniqueNames.has(nameKey)) {
          triggerVbToast(`Team names must be unique. Duplicate found: "${tName}"`);
          return;
        }
        uniqueNames.add(nameKey);
        teamNames.push(tName);
      }

      vbt = clone(defaultVbtState);
      vbt.active = true;
      vbt.name = name;
      vbt.teamCount = teamCount;
      vbt.setsFormat = setsFormat;

      vbt.teams = teamNames.map(t => ({
        name: t,
        played: 0,
        wins: 0,
        losses: 0,
        sw: 0,
        sl: 0,
        pw: 0,
        pl: 0,
        pts: 0
      }));

      // Generate round-robin schedule
      vbt.fixtures = [];
      const list = [...teamNames];
      const rounds = teamCount - 1;
      const halfSize = teamCount / 2;

      for (let r = 0; r < rounds; r++) {
        for (let i = 0; i < halfSize; i++) {
          const home = list[i];
          const away = list[teamCount - 1 - i];
          vbt.fixtures.push({
            round: r + 1,
            teamA: home,
            teamB: away,
            scoreA: "",
            scoreB: "",
            setsWonA: 0,
            setsWonB: 0,
            status: "pending",
            matchState: null
          });
        }
        list.splice(1, 0, list.pop());
      }

      saveVolleyballState();
      window.location.hash = "#volleyball-tdashboard";
    });
  }

  // Tournament Tabs
  const vbTabs = ["table", "fixtures", "edit"];
  vbTabs.forEach(tab => {
    const btn = document.querySelector(`#vb-tab-${tab}`);
    if (btn) {
      btn.addEventListener("click", () => {
        vbTabs.forEach(t => {
          const b = document.querySelector(`#vb-tab-${t}`);
          const v = document.querySelector(`#vb-${t}-view`);
          if (b) b.classList.remove("active");
          if (v) v.classList.add("hidden");
        });
        btn.classList.add("active");
        const activeView = document.querySelector(`#vb-${tab}-view`);
        if (activeView) activeView.classList.remove("hidden");

        if (tab === "table") renderPointsTable();
        else if (tab === "fixtures") renderFixtures();
        else if (tab === "edit") renderEditSetup();
      });
    }
  });

  // FIVB Table Standings Calculation
  function renderPointsTable() {
    if (!vbt.active) return;

    vbt.teams.forEach(t => {
      t.played = 0; t.wins = 0; t.losses = 0; t.sw = 0; t.sl = 0; t.pw = 0; t.pl = 0; t.pts = 0;
    });

    vbt.fixtures.forEach(f => {
      if (f.status === "completed" && f.matchState) {
        const tA = vbt.teams.find(t => t.name === f.teamA);
        const tB = vbt.teams.find(t => t.name === f.teamB);
        if (tA && tB) {
          tA.played++;
          tB.played++;
          tA.sw += f.setsWonA;
          tA.sl += f.setsWonB;
          tB.sw += f.setsWonB;
          tB.sl += f.setsWonA;

          // Compute total rally points
          (f.matchState.setScores || []).forEach(score => {
            tA.pw += score[0] || 0;
            tA.pl += score[1] || 0;
            tB.pw += score[1] || 0;
            tB.pl += score[0] || 0;
          });

          if (f.setsWonA > f.setsWonB) {
            tA.wins++;
            tB.losses++;
            // FIVB points: 3-0 or 3-1 = 3pts, 3-2 = 2pts (1pt to loser)
            if (f.setsWonB === 0 || f.setsWonB === 1) {
              tA.pts += 3;
            } else {
              tA.pts += 2;
              tB.pts += 1;
            }
          } else {
            tB.wins++;
            tA.losses++;
            if (f.setsWonA === 0 || f.setsWonA === 1) {
              tB.pts += 3;
            } else {
              tB.pts += 2;
              tA.pts += 1;
            }
          }
        }
      }
    });

    const sorted = [...vbt.teams].sort((a, b) => {
      if (b.pts !== a.pts) return b.pts - a.pts;
      if (b.wins !== a.wins) return b.wins - a.wins;
      const ratioA = a.sw / (a.sl || 1);
      const ratioB = b.sw / (b.sl || 1);
      if (ratioB !== ratioA) return ratioB - ratioA;
      return (b.pw - b.pl) - (a.pw - a.pl);
    });

    if (els.pointsTableBody) {
      els.pointsTableBody.innerHTML = sorted.map((t, idx) => `
        <tr style="border-bottom: 1px solid rgba(255,255,255,0.05);">
          <td style="padding: 10px 8px; font-weight:700; color: var(--vb-primary);">${idx + 1}</td>
          <td style="padding: 10px 8px; font-weight:700; color:#fff;">${t.name}</td>
          <td style="padding: 10px 8px; text-align:center;">${t.played}</td>
          <td style="padding: 10px 8px; text-align:center; color: #10b981;">${t.wins}</td>
          <td style="padding: 10px 8px; text-align:center; color: #f87171;">${t.losses}</td>
          <td style="padding: 10px 8px; text-align:center;">${t.sw}</td>
          <td style="padding: 10px 8px; text-align:center;">${t.sl}</td>
          <td style="padding: 10px 8px; text-align:center;">${t.pw}</td>
          <td style="padding: 10px 8px; text-align:center;">${t.pl}</td>
          <td style="padding: 10px 8px; font-weight:900; text-align:right; color: var(--vb-primary);">${t.pts}</td>
        </tr>
      `).join("");
    }
  }

  function renderFixtures() {
    if (!els.fixturesList) return;
    els.fixturesList.innerHTML = "";

    vbt.fixtures.forEach((f, idx) => {
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
          <span style="font-size: 0.75rem; color: var(--vb-primary); font-weight:700; text-transform:uppercase;">Round ${f.round}</span>
          <div style="font-weight: 700; font-size:1.05rem; margin-top:4px; color:#fff;">
            ${f.teamA} <span style="color:var(--text-muted); font-size:0.85rem; font-weight:normal; margin:0 6px;">vs</span> ${f.teamB}
          </div>
        </div>
      `;

      let rightSide = "";
      if (f.status === "completed") {
        rightSide = `
          <div style="display:flex; align-items:center; gap:16px;">
            <div style="font-family: monospace; font-size:1.4rem; font-weight:900; color:var(--vb-primary);">${f.setsWonA} - ${f.setsWonB} Sets</div>
            <span style="background: rgba(16,185,129,0.15); color:#10b981; font-size:0.75rem; padding:4px 8px; border-radius:6px; font-weight:700; text-transform:uppercase;">Played</span>
          </div>
        `;
      } else {
        rightSide = `
          <button class="start-custom" type="button" data-vb-fixture-index="${idx}" style="margin:0; padding:8px 16px; font-size:0.8rem; border-radius:6px; font-weight:700;">⏱️ Play Match</button>
        `;
      }

      card.innerHTML = leftSide + rightSide;
      els.fixturesList.appendChild(card);
    });

    document.querySelectorAll("[data-vb-fixture-index]").forEach(btn => {
      btn.addEventListener("click", (e) => {
        const idx = Number(e.currentTarget.getAttribute("data-vb-fixture-index"));
        const fix = vbt.fixtures[idx];

        if (fix) {
          vbt.activeFixtureIndex = idx;
          if (fix.matchState) {
            vb = clone(fix.matchState);
          } else {
            initializeVolleyballTournamentMatch(fix.teamA, fix.teamB);
          }
        }
      });
    });
  }

  function initializeVolleyballTournamentMatch(t1, t2) {
    vb = clone(defaultVolleyballState);
    vb.active = true;
    vb.isTournamentMatch = true;
    vb.team1 = t1;
    vb.team2 = t2;
    vb.setsFormat = vbt.setsFormat || 3;
    vb.pointsPerSet = 25;
    vb.decidingSetPoints = 15;
    vb.currentSetIndex = 0;
    vb.setScores = [[0, 0], [0, 0], [0, 0], [0, 0], [0, 0]];
    vb.currentPts1 = 0;
    vb.currentPts2 = 0;
    vb.servingTeam = 1;
    vb.t1TimeoutsLeft = 2;
    vb.t2TimeoutsLeft = 2;

    saveVolleyballState();
    window.location.hash = "#volleyball-match";
  }

  function renderEditSetup() {
    if (els.editTeamsContainer) {
      els.editTeamsContainer.innerHTML = vbt.teams.map((t, idx) => `
        <div class="setup-group">
          <label style="display: block; font-size: 0.85rem; color: var(--text-muted); margin-bottom: 4px; font-weight: 600;">Team ${idx + 1} Name</label>
          <input type="text" class="vb-edit-tteam-input" data-team-index="${idx}" value="${t.name}" autocomplete="off" style="width: 100%; height: 38px; background: rgba(0,0,0,0.25); border: 1px solid rgba(255,255,255,0.1); border-radius: 6px; color: var(--ink); padding: 0 12px; font-size: 0.9rem;" />
        </div>
      `).join("");
    }
  }

  if (els.editSaveBtn) {
    els.editSaveBtn.addEventListener("click", () => {
      const inputs = document.querySelectorAll(".vb-edit-tteam-input");
      const names = [];
      const unique = new Set();

      for (let i = 0; i < inputs.length; i++) {
        const val = inputs[i].value.trim() || `Team ${i + 1}`;
        if (unique.has(val.toLowerCase())) {
          triggerVbToast(`Duplicate name: "${val}"`);
          return;
        }
        unique.add(val.toLowerCase());
        names.push(val);
      }

      names.forEach((n, idx) => {
        const oldName = vbt.teams[idx].name;
        vbt.teams[idx].name = n;

        vbt.fixtures.forEach(f => {
          if (f.teamA === oldName) f.teamA = n;
          if (f.teamB === oldName) f.teamB = n;
        });
      });

      saveVolleyballState();
      triggerVbToast("Team names updated!");
      document.querySelector("#vb-tab-table").click();
    });
  }

  if (els.tresetBtn) {
    els.tresetBtn.addEventListener("click", () => {
      if (confirm("Are you sure you want to reset this volleyball tournament? All match results and points will be erased.")) {
        vbt = clone(defaultVbtState);
        saveVolleyballState();
        window.location.hash = "#volleyball";
      }
    });
  }

  if (els.tdashboardBackBtn) {
    els.tdashboardBackBtn.addEventListener("click", () => {
      vbt.active = false;
      saveVolleyballState();
      window.location.hash = "#volleyball";
    });
  }

  function renderTournamentDashboard() {
    if (els.tdashboardName) els.tdashboardName.textContent = vbt.name;
    renderPointsTable();
  }

  // 11. INITIALIZE VOLLEYBALL ROUTINGS
  loadVolleyballState();

  if (window.location.hash.startsWith("#volleyball")) {
    showVolleyballPage(true);
  }

  window.addEventListener("hashchange", () => {
    if (window.location.hash.startsWith("#volleyball")) {
      showVolleyballPage(true);
    }
  });

  // Bind Home Sports Card button
  const volleyballCardBtn = document.querySelector("[data-open-sport='volleyball']");
  if (volleyballCardBtn) {
    volleyballCardBtn.addEventListener("click", () => {
      window.location.hash = "#volleyball";
    });
  }

})();
