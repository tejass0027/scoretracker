/**
 * ==========================================================================
 * GOLF SCORER & PGA TOURNAMENT ENGINE
 * ==========================================================================
 * Modular Golf tracker supporting official USGA / PGA standards:
 * Stroke Play (To Par / Gross Strokes), Stableford points scoring,
 * 18-Hole (Front 9 OUT, Back 9 IN, Total) and 9-Hole group scorecards (1-4 players),
 * Par 3/4/5 holes, Eagle/Birdie/Par/Bogey/Double badges, and PGA Tour Leaderboard.
 */

(() => {
  "use strict";

  // 1. STATE & CONSTANTS
  const GF_STORAGE_KEY = "scoretracker_golf_match_state";
  const GFT_STORAGE_KEY = "scoretracker_golf_tournament_state";

  const COURSE_18_HOLES = [
    { hole: 1, par: 4, yards: 410 },
    { hole: 2, par: 5, yards: 545 },
    { hole: 3, par: 4, yards: 390 },
    { hole: 4, par: 3, yards: 175 },
    { hole: 5, par: 4, yards: 435 },
    { hole: 6, par: 4, yards: 400 },
    { hole: 7, par: 3, yards: 195 },
    { hole: 8, par: 5, yards: 520 },
    { hole: 9, par: 4, yards: 425 }, // Front 9 Par 36
    { hole: 10, par: 4, yards: 440 },
    { hole: 11, par: 4, yards: 415 },
    { hole: 12, par: 3, yards: 160 },
    { hole: 13, par: 5, yards: 510 },
    { hole: 14, par: 4, yards: 430 },
    { hole: 15, par: 5, yards: 530 },
    { hole: 16, par: 3, yards: 185 },
    { hole: 17, par: 4, yards: 420 },
    { hole: 18, par: 4, yards: 465 }  // Back 9 Par 36, Total 72
  ];

  const defaultGolfState = {
    active: false,
    isTournamentMatch: false,
    holesCount: 18,
    scoringType: "stroke", // "stroke" or "stableford"
    currentHole: 1,
    players: [
      { name: "Tiger Woods", scores: Array(18).fill(null), totalStrokes: 0, toPar: 0, stablefordPts: 0, thru: 0 },
      { name: "Rory McIlroy", scores: Array(18).fill(null), totalStrokes: 0, toPar: 0, stablefordPts: 0, thru: 0 }
    ],
    timeline: [], // { text, hole, time }
    history: [], // stack of previous states for undo
    roundCompleted: false,
    winner: null
  };

  const defaultGftState = {
    active: false,
    name: "The Masters Tournament",
    playerCount: 4,
    roundsCount: 1, // 1, 2, 4
    currentRound: 1,
    players: [], // { name, r1: null, r2: null, r3: null, r4: null, totalStrokes: 0, toPar: 0, thru: 0, pos: "1" }
    rounds: [], // { roundNum, completed, playerScores: [] }
    activeRoundPlayerIndex: 0
  };

  let gf = clone(defaultGolfState);
  let gft = clone(defaultGftState);

  function clone(obj) {
    return JSON.parse(JSON.stringify(obj));
  }

  // 2. DOM ELEMENTS SELECTORS
  const els = {
    // Page Wrappers
    golfPage: document.querySelector("#golf-page"),
    formatView: document.querySelector("#gf-format-view"),
    setupView: document.querySelector("#gf-setup-view"),
    dashboardView: document.querySelector("#gf-dashboard-view"),
    tsetupView: document.querySelector("#gf-tsetup-view"),
    tdashboardView: document.querySelector("#gf-tdashboard-view"),

    // Format selection buttons
    formatBackBtn: document.querySelector("#gf-format-back-btn"),
    formatCustomBtn: document.querySelector("#gf-format-custom-btn"),
    formatTournamentBtn: document.querySelector("#gf-format-tournament-btn"),

    // Setup
    setupBackBtn: document.querySelector("#gf-setup-back-btn"),
    holesSelect: document.querySelector("#gf-holes-select"),
    scoringSelect: document.querySelector("#gf-scoring-select"),
    playerCountSelect: document.querySelector("#gf-player-count-select"),
    playerInputsContainer: document.querySelector("#gf-player-inputs-container"),
    startBtn: document.querySelector("#gf-start-btn"),

    // Dashboard Header & Status
    dashboardBackBtn: document.querySelector("#gf-dashboard-back-btn"),
    resetMatchBtn: document.querySelector("#gf-reset-match-btn"),
    liveIndicator: document.querySelector("#gf-live-indicator"),
    holeTitle: document.querySelector("#gf-hole-title"),
    holePar: document.querySelector("#gf-hole-par"),
    holeYards: document.querySelector("#gf-hole-yards"),
    prevHoleBtn: document.querySelector("#gf-prev-hole-btn"),
    nextHoleBtn: document.querySelector("#gf-next-hole-btn"),

    // Active Hole Scoring Panels & Leaderboard
    holeScoringPanels: document.querySelector("#gf-hole-scoring-panels"),
    groupThru: document.querySelector("#gf-group-thru"),
    groupLeaderboard: document.querySelector("#gf-group-leaderboard"),
    fullScorecardTableContainer: document.querySelector("#gf-full-scorecard-table-container"),

    // Control Buttons
    undoBtn: document.querySelector("#gf-undo-btn"),
    finishRoundBtn: document.querySelector("#gf-finish-round-btn"),
    submitResultBtn: document.querySelector("#gf-submit-result-btn"),
    timelineList: document.querySelector("#gf-timeline-list"),

    // Tournament Setup
    tsetupBackBtn: document.querySelector("#gf-tsetup-back-btn"),
    tnameInput: document.querySelector("#gf-tname-input"),
    tteamCount: document.querySelector("#gf-tteam-count"),
    troundsSelect: document.querySelector("#gf-trounds-select"),
    tteamInputs: document.querySelector("#gf-tteam-inputs"),
    tcreateBtn: document.querySelector("#gf-tcreate-btn"),

    // Tournament Dashboard
    tdashboardBackBtn: document.querySelector("#gf-tdashboard-back-btn"),
    tresetBtn: document.querySelector("#gf-treset-btn"),
    tdashboardName: document.querySelector("#gf-tdashboard-name"),
    tabTable: document.querySelector("#gf-tab-table"),
    tabRounds: document.querySelector("#gf-tab-rounds"),
    tabEdit: document.querySelector("#gf-tab-edit"),
    tableView: document.querySelector("#gf-table-view"),
    roundsView: document.querySelector("#gf-rounds-view"),
    editView: document.querySelector("#gf-edit-view"),
    leaderboardBody: document.querySelector("#gf-leaderboard-body"),
    roundsList: document.querySelector("#gf-rounds-list"),
    editTeamsContainer: document.querySelector("#gf-edit-teams-container"),
    editSaveBtn: document.querySelector("#gf-edit-save-btn")
  };

  // 3. TOAST & AUDIO EFFECTS
  function triggerGfToast(message) {
    const existing = document.querySelector(".gf-toast-notification");
    if (existing) existing.remove();

    const toast = document.createElement("div");
    toast.className = "gf-toast-notification";
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

  function playGolfAudio(type = "cup") {
    try {
      const AudioCtx = window.AudioContext || window.webkitAudioContext;
      if (!AudioCtx) return;
      const ctx = new AudioCtx();
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      if (type === "birdie" || type === "eagle") {
        // Cheerful golf chime
        osc.type = "sine";
        osc.frequency.setValueAtTime(587.33, ctx.currentTime); // D5
        osc.frequency.setValueAtTime(880.00, ctx.currentTime + 0.12); // A5
        osc.frequency.setValueAtTime(1174.66, ctx.currentTime + 0.24); // D6
        gain.gain.setValueAtTime(0.2, ctx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.55);
        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.start();
        osc.stop(ctx.currentTime + 0.55);
      } else {
        // Golf ball cup drop sound
        osc.type = "triangle";
        osc.frequency.setValueAtTime(450, ctx.currentTime);
        osc.frequency.exponentialRampToValueAtTime(180, ctx.currentTime + 0.1);
        gain.gain.setValueAtTime(0.3, ctx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.1);
        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.start();
        osc.stop(ctx.currentTime + 0.1);
      }
    } catch (e) {
      console.warn("Audio not available", e);
    }
  }

  // 4. STORAGE PERSISTENCE
  function loadGolfState() {
    try {
      const stored = localStorage.getItem(GF_STORAGE_KEY);
      const storedT = localStorage.getItem(GFT_STORAGE_KEY);
      if (stored) gf = { ...clone(defaultGolfState), ...JSON.parse(stored) };
      if (storedT) gft = { ...clone(defaultGftState), ...JSON.parse(storedT) };
    } catch (e) {
      console.error("Failed to load golf state", e);
    }
  }

  function saveGolfState() {
    try {
      localStorage.setItem(GF_STORAGE_KEY, JSON.stringify(gf));
      localStorage.setItem(GFT_STORAGE_KEY, JSON.stringify(gft));
    } catch (e) {
      console.error("Failed to save golf state", e);
    }
  }

  // 5. VIEW NAVIGATION
  function hideAllGfViews() {
    if (els.formatView) els.formatView.classList.add("hidden");
    if (els.setupView) els.setupView.classList.add("hidden");
    if (els.dashboardView) els.dashboardView.classList.add("hidden");
    if (els.tsetupView) els.tsetupView.classList.add("hidden");
    if (els.tdashboardView) els.tdashboardView.classList.add("hidden");
  }

  function showGolfPage(fromHash = false) {
    const pages = ["#cricket-page", "#football-page", "#basketball-page", "#tennis-page", "#badminton-page", "#hockey-page", "#volleyball-page", "#baseball-page", "#rugby-page", "#kabaddi-page", "#tabletennis-page", "#sports-page", "#format-page"];
    pages.forEach(p => {
      const el = document.querySelector(p);
      if (el) el.classList.add("hidden");
    });

    if (els.golfPage) els.golfPage.classList.remove("hidden");
    hideAllGfViews();

    const hash = window.location.hash;
    if (hash === "#golf") {
      if (els.formatView) els.formatView.classList.remove("hidden");
    } else if (hash === "#golf-custom") {
      if (els.setupView) els.setupView.classList.remove("hidden");
      renderPlayerSetupInputs();
    } else if (hash === "#golf-match") {
      if (els.dashboardView) els.dashboardView.classList.remove("hidden");
      renderGolfDashboard();
    } else if (hash === "#golf-tsetup") {
      if (els.tsetupView) els.tsetupView.classList.remove("hidden");
      renderTournamentPlayerInputs();
    } else if (hash === "#golf-tdashboard") {
      if (els.tdashboardView) els.tdashboardView.classList.remove("hidden");
      renderTournamentDashboard();
    }
  }

  window.showGolfPage = showGolfPage;

  // 6. FORMAT CHOICE LISTENERS
  if (els.formatBackBtn) {
    els.formatBackBtn.addEventListener("click", () => {
      window.location.hash = "#sports";
    });
  }

  if (els.formatCustomBtn) {
    els.formatCustomBtn.addEventListener("click", () => {
      window.location.hash = "#golf-custom";
    });
  }

  if (els.formatTournamentBtn) {
    els.formatTournamentBtn.addEventListener("click", () => {
      if (gft.active) {
        window.location.hash = "#golf-tdashboard";
      } else {
        window.location.hash = "#golf-tsetup";
      }
    });
  }

  // 7. SETUP VIEW & START
  if (els.setupBackBtn) {
    els.setupBackBtn.addEventListener("click", () => {
      window.location.hash = "#golf";
    });
  }

  if (els.playerCountSelect) {
    els.playerCountSelect.addEventListener("change", renderPlayerSetupInputs);
  }

  function renderPlayerSetupInputs() {
    if (!els.playerInputsContainer) return;
    const count = Number(els.playerCountSelect ? els.playerCountSelect.value : 2);
    const defaultNames = ["Tiger Woods", "Rory McIlroy", "Scottie Scheffler", "Jon Rahm"];

    els.playerInputsContainer.innerHTML = "";
    for (let i = 0; i < count; i++) {
      const defName = defaultNames[i] || `Player ${i + 1}`;
      const div = document.createElement("div");
      div.innerHTML = `
        <label style="display: block; font-size: 0.8rem; color: var(--text-muted); margin-bottom: 4px; font-weight: 600;">Player ${i + 1} Name</label>
        <input type="text" class="gf-player-name-input" value="${defName}" maxlength="24" autocomplete="off" style="width: 100%; height: 38px; background: rgba(0,0,0,0.25); border: 1px solid rgba(255,255,255,0.1); border-radius: 6px; color: var(--ink); padding: 0 12px; font-size: 0.9rem;" />
      `;
      els.playerInputsContainer.appendChild(div);
    }
  }

  if (els.startBtn) {
    els.startBtn.addEventListener("click", () => {
      const holesCount = Number(els.holesSelect ? els.holesSelect.value : 18);
      const scoringType = els.scoringSelect ? els.scoringSelect.value : "stroke";

      const inputs = document.querySelectorAll(".gf-player-name-input");
      const playerNames = [];
      const unique = new Set();

      for (let i = 0; i < inputs.length; i++) {
        const pName = inputs[i].value.trim() || `Player ${i + 1}`;
        if (unique.has(pName.toLowerCase())) {
          triggerGfToast(`Player names must be unique. Duplicate: "${pName}"`);
          return;
        }
        unique.add(pName.toLowerCase());
        playerNames.push(pName);
      }

      initializeGolfRound(playerNames, holesCount, scoringType);
    });
  }

  function initializeGolfRound(playerNames, holesCount = 18, scoringType = "stroke") {
    gf = clone(defaultGolfState);
    gf.active = true;
    gf.isTournamentMatch = false;
    gf.holesCount = holesCount;
    gf.scoringType = scoringType;
    gf.currentHole = 1;

    gf.players = playerNames.map(name => ({
      name,
      scores: Array(holesCount).fill(null),
      totalStrokes: 0,
      toPar: 0,
      stablefordPts: 0,
      thru: 0
    }));

    recalculateRoundTotals();
    saveGolfState();
    window.location.hash = "#golf-match";
  }

  // 8. SCORING & GOLF LOGIC
  function saveToHistory() {
    gf.history.push({
      currentHole: gf.currentHole,
      players: clone(gf.players),
      roundCompleted: gf.roundCompleted,
      winner: gf.winner
    });
    if (gf.history.length > 30) gf.history.shift();
  }

  function recalculateRoundTotals() {
    let maxThru = 0;

    gf.players.forEach(p => {
      let totalStrokes = 0;
      let totalPar = 0;
      let thru = 0;
      let stableford = 0;

      for (let i = 0; i < gf.holesCount; i++) {
        const score = p.scores[i];
        const par = COURSE_18_HOLES[i].par;

        if (score !== null && score > 0) {
          totalStrokes += score;
          totalPar += par;
          thru++;

          // Stableford points calculation
          const diff = score - par;
          if (diff <= -3) stableford += 5; // Double eagle / albatross
          else if (diff === -2) stableford += 4; // Eagle
          else if (diff === -1) stableford += 3; // Birdie
          else if (diff === 0) stableford += 2; // Par
          else if (diff === 1) stableford += 1; // Bogey
          else stableford += 0; // Double bogey or worse
        }
      }

      p.totalStrokes = totalStrokes;
      p.toPar = totalStrokes - totalPar;
      p.stablefordPts = stableford;
      p.thru = thru;
      if (thru > maxThru) maxThru = thru;
    });

    if (els.groupThru) els.groupThru.textContent = maxThru;
  }

  function formatToParString(toPar, thru) {
    if (thru === 0) return "E";
    if (toPar < 0) return `${toPar}`;
    if (toPar === 0) return "E";
    return `+${toPar}`;
  }

  function setPlayerHoleScore(playerIndex, strokes) {
    if (gf.roundCompleted) return;
    saveToHistory();

    const holeIdx = gf.currentHole - 1;
    const par = COURSE_18_HOLES[holeIdx].par;
    const player = gf.players[playerIndex];

    player.scores[holeIdx] = strokes;

    const diff = strokes - par;
    let label = "Par";
    let sound = "cup";

    if (diff <= -2) { label = "Eagle"; sound = "eagle"; }
    else if (diff === -1) { label = "Birdie"; sound = "birdie"; }
    else if (diff === 0) { label = "Par"; sound = "cup"; }
    else if (diff === 1) { label = "Bogey"; sound = "cup"; }
    else if (diff >= 2) { label = "Double Bogey+"; sound = "cup"; }

    playGolfAudio(sound);
    recalculateRoundTotals();

    const toParStr = formatToParString(player.toPar, player.thru);
    logTimelineHole(`${player.name} scored ${strokes} (${label}) on Hole ${gf.currentHole} [${toParStr}]`);
    triggerGfToast(`${player.name}: ${label} (${strokes}) on Hole ${gf.currentHole}`);

    saveGolfState();
    renderGolfDashboard();
  }

  function adjustPlayerHoleScore(playerIndex, delta) {
    if (gf.roundCompleted) return;
    saveToHistory();

    const holeIdx = gf.currentHole - 1;
    const par = COURSE_18_HOLES[holeIdx].par;
    const player = gf.players[playerIndex];
    let current = player.scores[holeIdx] || par;

    current = Math.max(1, Math.min(15, current + delta));
    player.scores[holeIdx] = current;

    playGolfAudio("cup");
    recalculateRoundTotals();
    saveGolfState();
    renderGolfDashboard();
  }

  function logTimelineHole(desc) {
    const timeStr = `Hole ${gf.currentHole}`;
    gf.timeline.unshift({
      text: desc,
      hole: timeStr
    });
  }

  function advanceHole(delta) {
    const next = gf.currentHole + delta;
    if (next >= 1 && next <= gf.holesCount) {
      gf.currentHole = next;
      saveGolfState();
      renderGolfDashboard();
    }
  }

  function finishGolfRound() {
    recalculateRoundTotals();
    gf.roundCompleted = true;

    // Determine winner
    if (gf.scoringType === "stableford") {
      const sorted = [...gf.players].sort((a, b) => b.stablefordPts - a.stablefordPts);
      if (sorted.length > 1 && sorted[0].stablefordPts === sorted[1].stablefordPts) {
        gf.winner = null; // Tie
      } else {
        gf.winner = sorted[0].name;
      }
    } else {
      const sorted = [...gf.players].sort((a, b) => a.totalStrokes - b.totalStrokes);
      if (sorted.length > 1 && sorted[0].totalStrokes === sorted[1].totalStrokes) {
        gf.winner = null; // Tie
      } else {
        gf.winner = sorted[0].name;
      }
    }

    playGolfAudio("birdie");
    if (gf.winner) {
      logTimelineHole(`🏁 ROUND COMPLETED - ${gf.winner} wins!`);
      triggerGfToast(`🎉 ROUND FINISHED - ${gf.winner} Wins!`);
    } else {
      logTimelineHole("🏁 ROUND COMPLETED - Tied match!");
      triggerGfToast("Round Finished - Tied!");
    }

    saveGolfState();
    renderGolfDashboard();
  }

  // Undo
  function undoGolfScore() {
    if (!gf.history || gf.history.length === 0) {
      triggerGfToast("No scores to undo.");
      return;
    }
    const prev = gf.history.pop();
    gf.currentHole = prev.currentHole;
    gf.players = clone(prev.players);
    gf.roundCompleted = prev.roundCompleted;
    gf.winner = prev.winner;

    if (gf.timeline.length > 0) gf.timeline.shift();

    recalculateRoundTotals();
    saveGolfState();
    renderGolfDashboard();
    triggerGfToast("Last score undone.");
  }

  // Render Dashboard
  function renderGolfDashboard() {
    if (!els.dashboardView) return;

    const holeIdx = gf.currentHole - 1;
    const holeData = COURSE_18_HOLES[holeIdx] || { hole: 1, par: 4, yards: 410 };

    if (els.holeTitle) els.holeTitle.textContent = `Hole ${holeData.hole}`;
    if (els.holePar) els.holePar.textContent = holeData.par;
    if (els.holeYards) els.holeYards.textContent = holeData.yards;

    if (els.prevHoleBtn) els.prevHoleBtn.disabled = (gf.currentHole <= 1);
    if (els.nextHoleBtn) els.nextHoleBtn.disabled = (gf.currentHole >= gf.holesCount);

    // Render Active Hole Scoring Panels for Players in Group
    renderHoleScoringPanels(holeData);

    // Render Group Leaderboard Mini Strip
    renderGroupLeaderboard();

    // Render Full 18-Hole Interactive Scorecard
    renderFullScorecardTable();

    // Live Indicator
    if (els.liveIndicator) {
      if (gf.roundCompleted) els.liveIndicator.classList.add("hidden");
      else els.liveIndicator.classList.remove("hidden");
    }

    // Tournament Result button
    if (els.submitResultBtn) {
      if (gf.isTournamentMatch && gf.roundCompleted) els.submitResultBtn.classList.remove("hidden");
      else els.submitResultBtn.classList.add("hidden");
    }

    // Render Timeline Log
    if (els.timelineList) {
      if (gf.timeline.length === 0) {
        els.timelineList.innerHTML = `<p style="color: var(--text-muted); font-style: italic; font-size: 0.9rem; margin: 0;">No hole scores recorded yet.</p>`;
      } else {
        els.timelineList.innerHTML = gf.timeline.map(item => `
          <div class="gf-log-item">
            <div style="font-weight: 700;">${item.text}</div>
            <div style="font-family: monospace; font-size: 0.75rem; color: var(--gf-primary); font-weight:700;">${item.hole}</div>
          </div>
        `).join("");
      }
    }
  }

  function renderHoleScoringPanels(holeData) {
    if (!els.holeScoringPanels) return;
    const holeIdx = gf.currentHole - 1;
    const par = holeData.par;

    els.holeScoringPanels.innerHTML = gf.players.map((p, pIdx) => {
      const currentScore = p.scores[holeIdx];
      const scoreDisplay = currentScore !== null ? currentScore : "-";
      const toParStr = formatToParString(p.toPar, p.thru);

      let badgeCls = "par";
      if (currentScore !== null) {
        const diff = currentScore - par;
        if (diff <= -2) badgeCls = "eagle";
        else if (diff === -1) badgeCls = "birdie";
        else if (diff === 0) badgeCls = "par";
        else if (diff === 1) badgeCls = "bogey";
        else badgeCls = "double";
      }

      return `
        <div style="background: rgba(255,255,255,0.02); border: 1px solid rgba(255,255,255,0.08); border-radius: 16px; padding: 20px; display: grid; gap: 14px;">
          <div style="display: flex; justify-content: space-between; align-items: center;">
            <div>
              <h3 style="margin: 0; font-size: 1.15rem; font-weight: 800; color: #fff;">${p.name}</h3>
              <div style="font-size: 0.8rem; color: var(--text-muted); margin-top: 2px;">
                Total: <span style="color:#fff; font-weight:700;">${p.totalStrokes}</span> • To Par: <span style="color:var(--gf-primary); font-weight:900;">${toParStr}</span> ${gf.scoringType === "stableford" ? `• Pts: ${p.stablefordPts}` : ''}
              </div>
            </div>
            <div style="display: flex; align-items: center; gap: 8px;">
              <button class="sport-tab" type="button" data-gf-adjust="${pIdx}" data-gf-delta="-1" style="margin:0; padding: 6px 12px; font-weight:900;">-</button>
              <div class="gf-cell-badge ${badgeCls}" style="width: 42px; height: 42px; font-size: 1.3rem;">${scoreDisplay}</div>
              <button class="sport-tab" type="button" data-gf-adjust="${pIdx}" data-gf-delta="1" style="margin:0; padding: 6px 12px; font-weight:900;">+</button>
            </div>
          </div>

          <!-- Quick Stroke Selector Buttons -->
          <div style="display: grid; grid-template-columns: repeat(5, 1fr); gap: 6px;">
            <button class="gf-stroke-btn eagle" data-gf-score="${pIdx}" data-gf-strokes="${par - 2}" type="button">
              <span>${par - 2}</span><span style="font-size:0.65rem; opacity:0.8;">Eagle</span>
            </button>
            <button class="gf-stroke-btn birdie" data-gf-score="${pIdx}" data-gf-strokes="${par - 1}" type="button">
              <span>${par - 1}</span><span style="font-size:0.65rem; opacity:0.8;">Birdie</span>
            </button>
            <button class="gf-stroke-btn par" data-gf-score="${pIdx}" data-gf-strokes="${par}" type="button">
              <span>${par}</span><span style="font-size:0.65rem; opacity:0.8;">Par</span>
            </button>
            <button class="gf-stroke-btn bogey" data-gf-score="${pIdx}" data-gf-strokes="${par + 1}" type="button">
              <span>${par + 1}</span><span style="font-size:0.65rem; opacity:0.8;">Bogey</span>
            </button>
            <button class="gf-stroke-btn double" data-gf-score="${pIdx}" data-gf-strokes="${par + 2}" type="button">
              <span>${par + 2}</span><span style="font-size:0.65rem; opacity:0.8;">Dbl Bogey</span>
            </button>
          </div>
        </div>
      `;
    }).join("");

    // Bind event listeners for quick scoring buttons
    document.querySelectorAll("[data-gf-score]").forEach(btn => {
      btn.addEventListener("click", (e) => {
        const pIdx = Number(e.currentTarget.getAttribute("data-gf-score"));
        const strokes = Number(e.currentTarget.getAttribute("data-gf-strokes"));
        setPlayerHoleScore(pIdx, strokes);
      });
    });

    document.querySelectorAll("[data-gf-adjust]").forEach(btn => {
      btn.addEventListener("click", (e) => {
        const pIdx = Number(e.currentTarget.getAttribute("data-gf-adjust"));
        const delta = Number(e.currentTarget.getAttribute("data-gf-delta"));
        adjustPlayerHoleScore(pIdx, delta);
      });
    });
  }

  function renderGroupLeaderboard() {
    if (!els.groupLeaderboard) return;

    const sorted = [...gf.players].sort((a, b) => {
      if (gf.scoringType === "stableford") return b.stablefordPts - a.stablefordPts;
      return a.toPar - b.toPar;
    });

    els.groupLeaderboard.innerHTML = sorted.map((p, idx) => {
      const toParStr = formatToParString(p.toPar, p.thru);
      let badgeCls = "even";
      if (p.toPar < 0 && p.thru > 0) badgeCls = "under";
      else if (p.toPar > 0 && p.thru > 0) badgeCls = "over";

      return `
        <div style="background: rgba(255,255,255,0.02); border: 1px solid rgba(255,255,255,0.05); border-radius: 10px; padding: 10px 14px; display: flex; justify-content: space-between; align-items: center;">
          <div>
            <div style="font-weight: 800; font-size: 0.9rem; color: #fff;">${idx + 1}. ${p.name}</div>
            <div style="font-size: 0.75rem; color: var(--text-muted);">Thru ${p.thru} • ${p.totalStrokes} Strokes</div>
          </div>
          <span class="gf-topar-badge ${badgeCls}">${toParStr}</span>
        </div>
      `;
    }).join("");
  }

  function renderFullScorecardTable() {
    if (!els.fullScorecardTableContainer) return;
    const is18 = gf.holesCount === 18;

    let tableHtml = `
      <table style="width: 100%; border-collapse: collapse; text-align: center; font-size: 0.8rem; font-family: monospace;">
        <thead>
          <tr style="border-bottom: 1px solid rgba(255,255,255,0.1); color: var(--text-muted);">
            <th style="text-align: left; padding: 8px 6px; width: 140px; font-family: inherit;">HOLE</th>
    `;

    for (let h = 1; h <= 9; h++) {
      tableHtml += `<th style="padding: 8px 4px; ${gf.currentHole === h ? 'color:var(--gf-primary); font-weight:900;' : ''}">${h}</th>`;
    }
    tableHtml += `<th style="padding: 8px 4px; color:#fff; font-weight:900; background:rgba(255,255,255,0.03);">OUT</th>`;

    if (is18) {
      for (let h = 10; h <= 18; h++) {
        tableHtml += `<th style="padding: 8px 4px; ${gf.currentHole === h ? 'color:var(--gf-primary); font-weight:900;' : ''}">${h}</th>`;
      }
      tableHtml += `<th style="padding: 8px 4px; color:#fff; font-weight:900; background:rgba(255,255,255,0.03);">IN</th>`;
    }

    tableHtml += `<th style="padding: 8px 6px; color:var(--gf-primary); font-weight:900; background:rgba(16,185,129,0.1);">TOT</th>`;
    tableHtml += `<th style="padding: 8px 6px; color:var(--gf-primary); font-weight:900;">+/-</th></tr>`;

    // Par Row
    tableHtml += `<tr style="border-bottom: 1px solid rgba(255,255,255,0.08); color: rgba(255,255,255,0.6);"><td style="text-align:left; padding: 6px; font-weight:700; font-family: inherit;">PAR</td>`;
    let frontPar = 0;
    for (let h = 0; h < 9; h++) {
      const p = COURSE_18_HOLES[h].par;
      frontPar += p;
      tableHtml += `<td>${p}</td>`;
    }
    tableHtml += `<td style="font-weight:900; background:rgba(255,255,255,0.03);">${frontPar}</td>`;

    let backPar = 0;
    if (is18) {
      for (let h = 9; h < 18; h++) {
        const p = COURSE_18_HOLES[h].par;
        backPar += p;
        tableHtml += `<td>${p}</td>`;
      }
      tableHtml += `<td style="font-weight:900; background:rgba(255,255,255,0.03);">${backPar}</td>`;
    }
    tableHtml += `<td style="font-weight:900; color:var(--gf-primary); background:rgba(16,185,129,0.1);">${frontPar + backPar}</td><td>E</td></tr></thead><tbody>`;

    // Player Rows
    gf.players.forEach(player => {
      tableHtml += `<tr style="border-bottom: 1px solid rgba(255,255,255,0.05);"><td style="text-align:left; padding: 8px 6px; font-weight:800; color:#fff; font-family: inherit;">${player.name}</td>`;
      
      let outSum = 0;
      for (let h = 0; h < 9; h++) {
        const s = player.scores[h];
        const par = COURSE_18_HOLES[h].par;
        let badge = "-";
        if (s !== null) {
          outSum += s;
          const diff = s - par;
          let cls = diff <= -2 ? "eagle" : diff === -1 ? "birdie" : diff === 0 ? "par" : diff === 1 ? "bogey" : "double";
          badge = `<span class="gf-cell-badge ${cls}">${s}</span>`;
        }
        tableHtml += `<td>${badge}</td>`;
      }
      tableHtml += `<td style="font-weight:900; background:rgba(255,255,255,0.03);">${outSum || '-'}</td>`;

      let inSum = 0;
      if (is18) {
        for (let h = 9; h < 18; h++) {
          const s = player.scores[h];
          const par = COURSE_18_HOLES[h].par;
          let badge = "-";
          if (s !== null) {
            inSum += s;
            const diff = s - par;
            let cls = diff <= -2 ? "eagle" : diff === -1 ? "birdie" : diff === 0 ? "par" : diff === 1 ? "bogey" : "double";
            badge = `<span class="gf-cell-badge ${cls}">${s}</span>`;
          }
          tableHtml += `<td>${badge}</td>`;
        }
        tableHtml += `<td style="font-weight:900; background:rgba(255,255,255,0.03);">${inSum || '-'}</td>`;
      }

      const totalStrokes = outSum + inSum;
      const toParStr = formatToParString(player.toPar, player.thru);
      tableHtml += `<td style="font-weight:900; color:var(--gf-primary); background:rgba(16,185,129,0.1);">${totalStrokes || '-'}</td>`;
      tableHtml += `<td style="font-weight:900; color:var(--gf-primary);">${toParStr}</td></tr>`;
    });

    tableHtml += `</tbody></table>`;
    els.fullScorecardTableContainer.innerHTML = tableHtml;
  }

  // 9. DASHBOARD EVENT LISTENERS
  if (els.dashboardBackBtn) {
    els.dashboardBackBtn.addEventListener("click", () => {
      if (gf.isTournamentMatch) {
        window.location.hash = "#golf-tdashboard";
      } else {
        window.location.hash = "#golf";
      }
    });
  }

  if (els.resetMatchBtn) {
    els.resetMatchBtn.addEventListener("click", () => {
      if (confirm("Reset current Golf round? All scores will be cleared.")) {
        initializeGolfRound(gf.players.map(p => p.name), gf.holesCount, gf.scoringType);
      }
    });
  }

  if (els.prevHoleBtn) els.prevHoleBtn.addEventListener("click", () => advanceHole(-1));
  if (els.nextHoleBtn) els.nextHoleBtn.addEventListener("click", () => advanceHole(1));
  if (els.undoBtn) els.undoBtn.addEventListener("click", undoGolfScore);
  if (els.finishRoundBtn) els.finishRoundBtn.addEventListener("click", finishGolfRound);

  // Submit Result for Tournament Match
  if (els.submitResultBtn) {
    els.submitResultBtn.addEventListener("click", () => {
      if (gft.active && gft.activeRoundPlayerIndex >= 0) {
        const p = gft.players[gft.activeRoundPlayerIndex];
        if (p) {
          const rKey = `r${gft.currentRound}`;
          p[rKey] = gf.players[0].totalStrokes;
          recalculateTournamentLeaderboard();
          saveGolfState();
          triggerGfToast(`Round ${gft.currentRound} score saved for ${p.name}!`);
          window.location.hash = "#golf-tdashboard";
        }
      }
    });
  }

  // 10. TOURNAMENT ENGINE (PGA TOUR LEADERBOARD)
  if (els.tsetupBackBtn) {
    els.tsetupBackBtn.addEventListener("click", () => {
      window.location.hash = "#golf";
    });
  }

  if (els.tteamCount) {
    els.tteamCount.addEventListener("change", renderTournamentPlayerInputs);
  }

  function renderTournamentPlayerInputs() {
    if (!els.tteamInputs) return;
    const count = Number(els.tteamCount ? els.tteamCount.value : 4);
    const defaultPgaPlayers = ["Tiger Woods", "Rory McIlroy", "Scottie Scheffler", "Jon Rahm", "Brooks Koepka", "Collin Morikawa", "Viktor Hovland", "Jordan Spieth"];

    els.tteamInputs.innerHTML = "";
    for (let i = 0; i < count; i++) {
      const defName = defaultPgaPlayers[i] || `Player ${i + 1}`;
      const div = document.createElement("div");
      div.innerHTML = `
        <label style="display: block; font-size: 0.8rem; color: var(--text-muted); margin-bottom: 4px; font-weight: 600;">Player ${i + 1} Name</label>
        <input type="text" class="gf-tplayer-name-input" value="${defName}" autocomplete="off" style="width: 100%; height: 38px; background: rgba(0,0,0,0.25); border: 1px solid rgba(255,255,255,0.1); border-radius: 6px; color: var(--ink); padding: 0 12px; font-size: 0.9rem;" />
      `;
      els.tteamInputs.appendChild(div);
    }
  }

  if (els.tcreateBtn) {
    els.tcreateBtn.addEventListener("click", () => {
      const name = els.tnameInput.value.trim() || "The Masters Tournament";
      const count = Number(els.tteamCount.value) || 4;
      const rounds = Number(els.troundsSelect ? els.troundsSelect.value : 1);

      const inputs = document.querySelectorAll(".gf-tplayer-name-input");
      const playerNames = [];
      const unique = new Set();

      for (let i = 0; i < inputs.length; i++) {
        const pName = inputs[i].value.trim() || `Player ${i + 1}`;
        if (unique.has(pName.toLowerCase())) {
          triggerGfToast(`Player names must be unique. Duplicate: "${pName}"`);
          return;
        }
        unique.add(pName.toLowerCase());
        playerNames.push(pName);
      }

      gft = clone(defaultGftState);
      gft.active = true;
      gft.name = name;
      gft.playerCount = count;
      gft.roundsCount = rounds;
      gft.currentRound = 1;

      gft.players = playerNames.map((n, idx) => ({
        name: n,
        r1: null,
        r2: null,
        r3: null,
        r4: null,
        totalStrokes: 0,
        toPar: 0,
        thru: 0,
        pos: `${idx + 1}`
      }));

      saveGolfState();
      window.location.hash = "#golf-tdashboard";
    });
  }

  // Tournament Tabs
  const gfTabs = ["table", "rounds", "edit"];
  gfTabs.forEach(tab => {
    const btn = document.querySelector(`#gf-tab-${tab}`);
    if (btn) {
      btn.addEventListener("click", () => {
        gfTabs.forEach(t => {
          const b = document.querySelector(`#gf-tab-${t}`);
          const v = document.querySelector(`#gf-${t}-view`);
          if (b) b.classList.remove("active");
          if (v) v.classList.add("hidden");
        });
        btn.classList.add("active");
        const activeView = document.querySelector(`#gf-${tab}-view`);
        if (activeView) activeView.classList.remove("hidden");

        if (tab === "table") renderLeaderboardTable();
        else if (tab === "rounds") renderTournamentRoundsList();
        else if (tab === "edit") renderEditSetup();
      });
    }
  });

  function recalculateTournamentLeaderboard() {
    const parPerRound = 72;

    gft.players.forEach(p => {
      let total = 0;
      let playedRounds = 0;
      for (let r = 1; r <= gft.roundsCount; r++) {
        const val = p[`r${r}`];
        if (val !== null && val > 0) {
          total += val;
          playedRounds++;
        }
      }
      p.totalStrokes = total;
      p.thru = playedRounds * 18;
      p.toPar = total > 0 ? total - (playedRounds * parPerRound) : 0;
    });

    // Sort by toPar ascending (lowest score wins in golf)
    const sorted = [...gft.players].sort((a, b) => {
      if (a.thru === 0 && b.thru > 0) return 1;
      if (b.thru === 0 && a.thru > 0) return -1;
      if (a.toPar !== b.toPar) return a.toPar - b.toPar;
      return a.totalStrokes - b.totalStrokes;
    });

    // Assign PGA Positions with Ties (T1, T1, T3, 4, etc.)
    for (let i = 0; i < sorted.length; i++) {
      if (sorted[i].thru === 0) {
        sorted[i].pos = "-";
        continue;
      }
      const sameBefore = i > 0 && sorted[i - 1].toPar === sorted[i].toPar && sorted[i - 1].thru === sorted[i].thru;
      const sameAfter = i < sorted.length - 1 && sorted[i + 1].toPar === sorted[i].toPar && sorted[i + 1].thru === sorted[i].thru;

      if (sameBefore || sameAfter) {
        // Find first index with this score
        let firstIdx = i;
        while (firstIdx > 0 && sorted[firstIdx - 1].toPar === sorted[i].toPar && sorted[firstIdx - 1].thru === sorted[i].thru) {
          firstIdx--;
        }
        sorted[i].pos = `T${firstIdx + 1}`;
      } else {
        sorted[i].pos = `${i + 1}`;
      }
    }
  }

  function renderLeaderboardTable() {
    if (!gft.active) return;
    recalculateTournamentLeaderboard();

    const sorted = [...gft.players].sort((a, b) => {
      if (a.thru === 0 && b.thru > 0) return 1;
      if (b.thru === 0 && a.thru > 0) return -1;
      if (a.toPar !== b.toPar) return a.toPar - b.toPar;
      return a.totalStrokes - b.totalStrokes;
    });

    if (els.leaderboardBody) {
      els.leaderboardBody.innerHTML = sorted.map(p => {
        const toParStr = formatToParString(p.toPar, p.thru);
        let badgeCls = "even";
        if (p.toPar < 0 && p.thru > 0) badgeCls = "under";
        else if (p.toPar > 0 && p.thru > 0) badgeCls = "over";

        const roundScores = [];
        for (let r = 1; r <= gft.roundsCount; r++) {
          roundScores.push(p[`r${r}`] || '-');
        }

        return `
          <tr style="border-bottom: 1px solid rgba(255,255,255,0.05);">
            <td style="padding: 10px 8px; font-weight:800; color: var(--gf-primary);">${p.pos}</td>
            <td style="padding: 10px 8px; font-weight:800; color:#fff;">${p.name}</td>
            <td style="padding: 10px 8px; text-align:center;"><span class="gf-topar-badge ${badgeCls}">${toParStr}</span></td>
            <td style="padding: 10px 8px; text-align:center; font-family:monospace;">${p.thru > 0 ? `F (${p.thru})` : '-'}</td>
            <td style="padding: 10px 8px; text-align:center; font-family:monospace;">${p[`r${gft.currentRound}`] || '-'}</td>
            <td style="padding: 10px 8px; text-align:center; font-family:monospace; color:var(--text-muted);">${roundScores.join(" / ")}</td>
            <td style="padding: 10px 8px; font-weight:900; text-align:right; font-family:monospace; color:#fff;">${p.totalStrokes || '-'}</td>
          </tr>
        `;
      }).join("");
    }
  }

  function renderTournamentRoundsList() {
    if (!els.roundsList) return;
    els.roundsList.innerHTML = "";

    gft.players.forEach((p, pIdx) => {
      const card = document.createElement("div");
      card.style.background = "rgba(255,255,255,0.02)";
      card.style.border = "1px solid rgba(255,255,255,0.08)";
      card.style.borderRadius = "12px";
      card.style.padding = "16px";
      card.style.display = "flex";
      card.style.justifyContent = "space-between";
      card.style.alignItems = "center";

      const rKey = `r${gft.currentRound}`;
      const score = p[rKey];

      const leftSide = `
        <div>
          <span style="font-size: 0.75rem; color: var(--gf-primary); font-weight:700; text-transform:uppercase;">Round ${gft.currentRound} of ${gft.roundsCount}</span>
          <div style="font-weight: 800; font-size:1.1rem; margin-top:4px; color:#fff;">${p.name}</div>
        </div>
      `;

      let rightSide = "";
      if (score !== null && score > 0) {
        const diff = score - 72;
        const diffStr = diff < 0 ? `${diff}` : diff === 0 ? "E" : `+${diff}`;
        rightSide = `
          <div style="display:flex; align-items:center; gap:16px;">
            <div style="font-family: monospace; font-size:1.4rem; font-weight:900; color:var(--gf-primary);">${score} (${diffStr})</div>
            <span style="background: rgba(16,185,129,0.15); color:#10b981; font-size:0.75rem; padding:4px 8px; border-radius:6px; font-weight:700; text-transform:uppercase;">Round Complete</span>
          </div>
        `;
      } else {
        rightSide = `
          <button class="start-custom" type="button" data-gf-player-round="${pIdx}" style="margin:0; padding:8px 16px; font-size:0.8rem; border-radius:6px; font-weight:700;">⛳ Play Round</button>
        `;
      }

      card.innerHTML = leftSide + rightSide;
      els.roundsList.appendChild(card);
    });

    document.querySelectorAll("[data-gf-player-round]").forEach(btn => {
      btn.addEventListener("click", (e) => {
        const pIdx = Number(e.currentTarget.getAttribute("data-gf-player-round"));
        const p = gft.players[pIdx];

        if (p) {
          gft.activeRoundPlayerIndex = pIdx;
          initializeGolfTournamentRound(p.name);
        }
      });
    });
  }

  function initializeGolfTournamentRound(playerName) {
    gf = clone(defaultGolfState);
    gf.active = true;
    gf.isTournamentMatch = true;
    gf.holesCount = 18;
    gf.scoringType = "stroke";
    gf.currentHole = 1;
    gf.players = [{
      name: playerName,
      scores: Array(18).fill(null),
      totalStrokes: 0,
      toPar: 0,
      stablefordPts: 0,
      thru: 0
    }];

    recalculateRoundTotals();
    saveGolfState();
    window.location.hash = "#golf-match";
  }

  function renderEditSetup() {
    if (els.editTeamsContainer) {
      els.editTeamsContainer.innerHTML = gft.players.map((p, idx) => `
        <div class="setup-group">
          <label style="display: block; font-size: 0.85rem; color: var(--text-muted); margin-bottom: 4px; font-weight: 600;">Player ${idx + 1} Name</label>
          <input type="text" class="gf-edit-tplayer-input" data-player-index="${idx}" value="${p.name}" autocomplete="off" style="width: 100%; height: 38px; background: rgba(0,0,0,0.25); border: 1px solid rgba(255,255,255,0.1); border-radius: 6px; color: var(--ink); padding: 0 12px; font-size: 0.9rem;" />
        </div>
      `).join("");
    }
  }

  if (els.editSaveBtn) {
    els.editSaveBtn.addEventListener("click", () => {
      const inputs = document.querySelectorAll(".gf-edit-tplayer-input");
      const names = [];
      const unique = new Set();

      for (let i = 0; i < inputs.length; i++) {
        const val = inputs[i].value.trim() || `Player ${i + 1}`;
        if (unique.has(val.toLowerCase())) {
          triggerGfToast(`Duplicate name: "${val}"`);
          return;
        }
        unique.add(val.toLowerCase());
        names.push(val);
      }

      names.forEach((n, idx) => {
        gft.players[idx].name = n;
      });

      saveGolfState();
      triggerGfToast("Player names updated!");
      document.querySelector("#gf-tab-table").click();
    });
  }

  if (els.tresetBtn) {
    els.tresetBtn.addEventListener("click", () => {
      if (confirm("Are you sure you want to reset this Golf tournament? All rounds will be cleared.")) {
        gft = clone(defaultGftState);
        saveGolfState();
        window.location.hash = "#golf";
      }
    });
  }

  if (els.tdashboardBackBtn) {
    els.tdashboardBackBtn.addEventListener("click", () => {
      gft.active = false;
      saveGolfState();
      window.location.hash = "#golf";
    });
  }

  function renderTournamentDashboard() {
    if (els.tdashboardName) els.tdashboardName.textContent = gft.name;
    renderLeaderboardTable();
  }

  // 11. INITIALIZE GOLF ROUTINGS
  loadGolfState();

  if (window.location.hash.startsWith("#golf")) {
    showGolfPage(true);
  }

  window.addEventListener("hashchange", () => {
    if (window.location.hash.startsWith("#golf")) {
      showGolfPage(true);
    }
  });

  // Bind Home Sports Card button
  const golfCardBtn = document.querySelector("[data-open-sport='golf']");
  if (golfCardBtn) {
    golfCardBtn.addEventListener("click", () => {
      window.location.hash = "#golf";
    });
  }

})();
