/* ==========================================================================
   PICKLEBALL SCORE TRACKER & TOURNAMENT MODULE - OFFICIAL USA PICKLEBALL RULES
   ========================================================================== */

console.log("ScoreTracker Pickleball Module loaded - version 210");

(function () {
  // 1. STORAGE KEYS & DEFAULTS
  const PB_STORAGE_KEY = "pickleball-score-tracker-v1";
  const PBT_STORAGE_KEY = "pickleball-tournament-tracker-v1";

  const defaultPickleballState = {
    active: false,
    isTournamentMatch: false,
    matchType: "doubles", // "singles" or "doubles"
    p1Name: "Team 1",
    p2Name: "Team 2",
    targetScore: 11, // 11, 15, or 21 (win by 2)
    gamesLength: 3,  // Best of 3 or 1

    // Live match scores
    score1: 0,
    score2: 0,
    gamesWon1: 0,
    gamesWon2: 0,
    currentGameIndex: 0,
    gameHistory: [], // [{score1, score2, winner}]

    // Serving state (Official USA Pickleball: Starts at 0-0-2 on 2nd server)
    servingTeam: 1,  // 1 or 2
    serverNumber: 2, // 1 or 2 (First server of match starts as server 2)
    isFirstServeOfGame: true, // Only 1 server for first service turn of game

    // Match status
    matchCompleted: false,
    winner: null,
    timeline: [],
    history: []
  };

  const defaultPbtState = {
    active: false,
    name: "Pickleball Championship Cup",
    teamCount: 4,
    targetScore: 11,
    gamesLength: 3,
    teams: [],
    fixtures: [],
    activeFixtureIndex: -1
  };

  let pb = clone(defaultPickleballState);
  let pbt = clone(defaultPbtState);

  function clone(obj) {
    return JSON.parse(JSON.stringify(obj));
  }

  // 2. DOM SELECTORS
  const els = {
    page: document.querySelector("#pickleball-page"),
    formatView: document.querySelector("#pb-format-view"),
    setupView: document.querySelector("#pb-setup-view"),
    matchView: document.querySelector("#pb-match-view"),
    tsetupView: document.querySelector("#pb-tsetup-view"),
    tdashboardView: document.querySelector("#pb-tdashboard-view"),

    // Format View Buttons
    formatBackBtn: document.querySelector("#pb-format-back-btn"),
    formatCustomBtn: document.querySelector("#pb-format-custom-btn"),
    formatTournamentBtn: document.querySelector("#pb-format-tournament-btn"),

    // Setup View Elements
    setupBackBtn: document.querySelector("#pb-setup-back-btn"),
    team1Input: document.querySelector("#pb-team1-input"),
    team2Input: document.querySelector("#pb-team2-input"),
    typeSelect: document.querySelector("#pb-type-select"),
    pointsSelect: document.querySelector("#pb-points-select"),
    gamesSelect: document.querySelector("#pb-games-select"),
    startBtn: document.querySelector("#pb-start-btn"),

    // Live Match Elements
    matchBackBtn: document.querySelector("#pb-match-back-btn"),
    resetMatchBtn: document.querySelector("#pb-reset-match-btn"),
    calloutDigits: document.querySelector("#pb-callout-digits"),
    team1NameDisplay: document.querySelector("#pb-team1-name-display"),
    team2NameDisplay: document.querySelector("#pb-team2-name-display"),
    team1ScoreDisplay: document.querySelector("#pb-team1-score-display"),
    team2ScoreDisplay: document.querySelector("#pb-team2-score-display"),
    team1GamesDisplay: document.querySelector("#pb-team1-games-display"),
    team2GamesDisplay: document.querySelector("#pb-team2-games-display"),
    team1ServerBadge: document.querySelector("#pb-team1-server-badge"),
    team2ServerBadge: document.querySelector("#pb-team2-server-badge"),
    servingTeamIndicator: document.querySelector("#pb-serving-team-indicator"),

    // Rally / Point Buttons
    rallyWinBtn1: document.querySelector("#pb-rally-win-btn1"),
    rallyWinBtn2: document.querySelector("#pb-rally-win-btn2"),
    kitchenFaultBtn: document.querySelector("#pb-kitchen-fault-btn"),
    undoBtn: document.querySelector("#pb-undo-btn"),
    saveVaultBtn: document.querySelector("#pb-save-vault-btn"),
    timelineList: document.querySelector("#pb-timeline-list"),

    // Tournament Elements
    tsetupBackBtn: document.querySelector("#pb-tsetup-back-btn"),
    tnameInput: document.querySelector("#pb-tname-input"),
    tcountSelect: document.querySelector("#pb-tcount-select"),
    tteamInputs: document.querySelector("#pb-tteam-inputs"),
    tstartBtn: document.querySelector("#pb-tstart-btn"),
    tdashboardBackBtn: document.querySelector("#pb-tdashboard-back-btn"),
    tdashboardTitle: document.querySelector("#pb-tdashboard-title"),
    tstandingsBody: document.querySelector("#pb-tstandings-body"),
    tfixturesList: document.querySelector("#pb-tfixtures-list"),
    tresetBtn: document.querySelector("#pb-treset-btn")
  };

  // 3. PERSISTENCE
  function saveState() {
    localStorage.setItem(PB_STORAGE_KEY, JSON.stringify(pb));
    localStorage.setItem(PBT_STORAGE_KEY, JSON.stringify(pbt));
  }

  function loadState() {
    try {
      const savedPb = localStorage.getItem(PB_STORAGE_KEY);
      if (savedPb) pb = Object.assign(clone(defaultPickleballState), JSON.parse(savedPb));
      const savedPbt = localStorage.getItem(PBT_STORAGE_KEY);
      if (savedPbt) pbt = Object.assign(clone(defaultPbtState), JSON.parse(savedPbt));
    } catch (e) {
      console.error("Error loading Pickleball state", e);
    }
  }

  // Audio helper
  function playBeep(freq = 600, duration = 0.15) {
    try {
      const ctx = new (window.AudioContext || window.webkitAudioContext)();
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = "sine";
      osc.frequency.value = freq;
      gain.gain.setValueAtTime(0.2, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + duration);
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start();
      osc.stop(ctx.currentTime + duration);
    } catch (e) {}
  }

  // Toast notification
  function showToast(msg) {
    let t = document.querySelector("#pb-toast");
    if (!t) {
      t = document.createElement("div");
      t.id = "pb-toast";
      t.style.cssText = "position:fixed; bottom:80px; left:50%; transform:translateX(-50%); background:#84cc16; color:#0b0f19; font-weight:800; padding:10px 22px; border-radius:999px; box-shadow:0 6px 20px rgba(0,0,0,0.4); z-index:99999; font-size:0.9rem; pointer-events:none; transition:opacity 0.3s ease;";
      document.body.appendChild(t);
    }
    t.textContent = msg;
    t.style.opacity = "1";
    setTimeout(() => { t.style.opacity = "0"; }, 2500);
  }

  // 4. PICKLEBALL SCORING LOGIC (Side-Out System)
  function recordRallyResult(rallyWinnerTeam) {
    if (pb.matchCompleted) return;

    // Snapshot for Undo
    pb.history.push({
      score1: pb.score1,
      score2: pb.score2,
      gamesWon1: pb.gamesWon1,
      gamesWon2: pb.gamesWon2,
      currentGameIndex: pb.currentGameIndex,
      servingTeam: pb.servingTeam,
      serverNumber: pb.serverNumber,
      isFirstServeOfGame: pb.isFirstServeOfGame,
      gameHistory: clone(pb.gameHistory),
      timeline: clone(pb.timeline)
    });
    if (pb.history.length > 30) pb.history.shift();

    if (rallyWinnerTeam === pb.servingTeam) {
      // Serving team won rally -> SCORES 1 POINT!
      if (pb.servingTeam === 1) pb.score1++;
      else pb.score2++;

      playBeep(750, 0.12);
      pb.timeline.unshift({
        text: `${pb.servingTeam === 1 ? pb.p1Name : pb.p2Name} won point on serve (${getCalloutString()})`,
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      });

      checkGameWin();
    } else {
      // Receiving team won rally -> FAULT on serving side! No point scored.
      playBeep(350, 0.2);

      if (pb.matchType === "singles") {
        // Singles: Instant Side-Out!
        pb.servingTeam = pb.servingTeam === 1 ? 2 : 1;
        pb.serverNumber = 1;
        pb.timeline.unshift({
          text: `Side-Out! Service turns to ${pb.servingTeam === 1 ? pb.p1Name : pb.p2Name}`,
          time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
        });
        showToast(`Side-Out! ${pb.servingTeam === 1 ? pb.p1Name : pb.p2Name} serves.`);
      } else {
        // Doubles:
        if (pb.isFirstServeOfGame) {
          // Game starts on Server 2: Fault immediately causes Side-Out!
          pb.isFirstServeOfGame = false;
          pb.servingTeam = pb.servingTeam === 1 ? 2 : 1;
          pb.serverNumber = 1;
          pb.timeline.unshift({
            text: `Side-Out! Service to ${pb.servingTeam === 1 ? pb.p1Name : pb.p2Name} (Server 1)`,
            time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
          });
          showToast(`Side-Out! ${pb.servingTeam === 1 ? pb.p1Name : pb.p2Name} Server 1.`);
        } else if (pb.serverNumber === 1) {
          // 1st server faulted -> Switch to 2nd server on same team
          pb.serverNumber = 2;
          pb.timeline.unshift({
            text: `${pb.servingTeam === 1 ? pb.p1Name : pb.p2Name} Server 1 Fault. Now Server 2!`,
            time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
          });
          showToast(`Second Server! Server 2 now serving.`);
        } else {
          // 2nd server faulted -> SIDE OUT!
          pb.servingTeam = pb.servingTeam === 1 ? 2 : 1;
          pb.serverNumber = 1;
          pb.timeline.unshift({
            text: `Side-Out! Service to ${pb.servingTeam === 1 ? pb.p1Name : pb.p2Name} (Server 1)`,
            time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
          });
          showToast(`Side-Out! ${pb.servingTeam === 1 ? pb.p1Name : pb.p2Name} Server 1.`);
        }
      }
    }

    renderMatchUI();
    saveState();
  }

  function getCalloutString() {
    const s1 = pb.servingTeam === 1 ? pb.score1 : pb.score2;
    const s2 = pb.servingTeam === 1 ? pb.score2 : pb.score1;
    if (pb.matchType === "singles") {
      return `${s1} - ${s2}`;
    }
    return `${s1} - ${s2} - ${pb.serverNumber}`;
  }

  function checkGameWin() {
    const s1 = pb.score1;
    const s2 = pb.score2;
    const target = pb.targetScore;

    if ((s1 >= target && s1 - s2 >= 2) || (s2 >= target && s2 - s1 >= 2)) {
      const gameWinner = s1 > s2 ? 1 : 2;
      const winnerName = gameWinner === 1 ? pb.p1Name : pb.p2Name;

      if (gameWinner === 1) pb.gamesWon1++;
      else pb.gamesWon2++;

      pb.gameHistory.push({ score1: s1, score2: s2, winner: gameWinner });
      showToast(`${winnerName} wins Game ${pb.currentGameIndex + 1} (${s1}-${s2})!`);
      playBeep(900, 0.3);

      const requiredGames = Math.ceil(pb.gamesLength / 2);
      if (pb.gamesWon1 >= requiredGames || pb.gamesWon2 >= requiredGames) {
        pb.matchCompleted = true;
        pb.winner = pb.gamesWon1 > pb.gamesWon2 ? pb.p1Name : pb.p2Name;
        showToast(`🏆 ${pb.winner} WINS THE MATCH!`);
      } else {
        // Next Game
        pb.currentGameIndex++;
        pb.score1 = 0;
        pb.score2 = 0;
        // Game starts on Server 2
        pb.servingTeam = gameWinner;
        pb.serverNumber = 2;
        pb.isFirstServeOfGame = true;
      }
    }
  }

  function handleKitchenFault() {
    if (pb.matchCompleted) return;
    // Kitchen fault is a fault by the serving team or receiving team
    // If serving team committed kitchen fault -> fault happens
    const nonServingTeam = pb.servingTeam === 1 ? 2 : 1;
    pb.timeline.unshift({
      text: `⚠️ Non-Volley Zone (Kitchen) Fault called!`,
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    });
    recordRallyResult(nonServingTeam);
  }

  function undoLastAction() {
    if (!pb.history || pb.history.length === 0) {
      showToast("Nothing to undo!");
      return;
    }
    const prev = pb.history.pop();
    pb.score1 = prev.score1;
    pb.score2 = prev.score2;
    pb.gamesWon1 = prev.gamesWon1;
    pb.gamesWon2 = prev.gamesWon2;
    pb.currentGameIndex = prev.currentGameIndex;
    pb.servingTeam = prev.servingTeam;
    pb.serverNumber = prev.serverNumber;
    pb.isFirstServeOfGame = prev.isFirstServeOfGame;
    pb.gameHistory = prev.gameHistory;
    pb.timeline = prev.timeline;
    pb.matchCompleted = false;
    pb.winner = null;
    showToast("Last rally undone.");
    renderMatchUI();
    saveState();
  }

  // 5. RENDER UI
  function renderMatchUI() {
    if (!els.page) return;
    if (els.calloutDigits) els.calloutDigits.textContent = getCalloutString();
    if (els.team1NameDisplay) els.team1NameDisplay.textContent = pb.p1Name;
    if (els.team2NameDisplay) els.team2NameDisplay.textContent = pb.p2Name;
    if (els.team1ScoreDisplay) els.team1ScoreDisplay.textContent = pb.score1;
    if (els.team2ScoreDisplay) els.team2ScoreDisplay.textContent = pb.score2;
    if (els.team1GamesDisplay) els.team1GamesDisplay.textContent = pb.gamesWon1;
    if (els.team2GamesDisplay) els.team2GamesDisplay.textContent = pb.gamesWon2;

    // Service Badges
    if (els.team1ServerBadge) {
      if (pb.servingTeam === 1) {
        els.team1ServerBadge.style.display = "inline-flex";
        els.team1ServerBadge.textContent = pb.matchType === "singles" ? "SERVING" : `SERVER ${pb.serverNumber}`;
      } else {
        els.team1ServerBadge.style.display = "none";
      }
    }
    if (els.team2ServerBadge) {
      if (pb.servingTeam === 2) {
        els.team2ServerBadge.style.display = "inline-flex";
        els.team2ServerBadge.textContent = pb.matchType === "singles" ? "SERVING" : `SERVER ${pb.serverNumber}`;
      } else {
        els.team2ServerBadge.style.display = "none";
      }
    }

    if (els.servingTeamIndicator) {
      const sName = pb.servingTeam === 1 ? pb.p1Name : pb.p2Name;
      els.servingTeamIndicator.textContent = `${sName} Serving • Call: ${getCalloutString()}`;
    }

    // Timeline
    if (els.timelineList) {
      els.timelineList.innerHTML = pb.timeline.slice(0, 8).map(t => `
        <div class="pb-log-item">
          <span>${t.text}</span>
          <span style="color:var(--text-muted); font-size:0.75rem;">${t.time}</span>
        </div>
      `).join("") || `<p style="text-align:center; color:var(--text-muted); font-size:0.85rem; margin:10px 0;">No points scored yet.</p>`;
    }
  }

  // 6. TOURNAMENT ENGINE
  function generateTournament() {
    const teams = [];
    const count = parseInt(pbt.teamCount) || 4;
    for (let i = 1; i <= count; i++) {
      const input = document.querySelector(`#pb-tteam-${i}`);
      const tName = (input && input.value.trim()) || `Pickle Squad ${i}`;
      teams.push({
        id: i,
        name: tName,
        played: 0,
        won: 0,
        lost: 0,
        ptsWon: 0,
        ptsLost: 0,
        ptsDiff: 0,
        pts: 0
      });
    }
    pbt.teams = teams;

    // Round-robin fixtures
    const fixtures = [];
    let round = 1;
    for (let i = 0; i < teams.length; i++) {
      for (let j = i + 1; j < teams.length; j++) {
        fixtures.push({
          round: round++,
          teamA: teams[i].name,
          teamB: teams[j].name,
          scoreA: 0,
          scoreB: 0,
          completed: false,
          winner: null
        });
      }
    }
    pbt.fixtures = fixtures;
    pbt.active = true;
    renderTournamentDashboard();
    saveState();
  }

  function renderTournamentDashboard() {
    if (!els.tdashboardView) return;
    if (els.tdashboardTitle) els.tdashboardTitle.textContent = pbt.name;

    // Standings
    if (els.tstandingsBody) {
      const sorted = [...pbt.teams].sort((a, b) => b.pts - a.pts || b.ptsDiff - a.ptsDiff);
      els.tstandingsBody.innerHTML = sorted.map((t, idx) => `
        <tr style="border-bottom: 1px solid rgba(255,255,255,0.06);">
          <td style="padding:10px 14px; font-weight:800; color:${idx === 0 ? 'var(--pb-primary)' : '#fff'};">${idx + 1}</td>
          <td style="padding:10px 14px; font-weight:700;">${t.name}</td>
          <td style="padding:10px 14px; text-align:center;">${t.played}</td>
          <td style="padding:10px 14px; text-align:center; color:#34d399;">${t.won}</td>
          <td style="padding:10px 14px; text-align:center; color:#f87171;">${t.lost}</td>
          <td style="padding:10px 14px; text-align:center;">${t.ptsDiff > 0 ? '+' : ''}${t.ptsDiff}</td>
          <td style="padding:10px 14px; text-align:center; font-weight:900; color:var(--pb-primary);">${t.pts}</td>
        </tr>
      `).join("");
    }

    // Fixtures
    if (els.tfixturesList) {
      els.tfixturesList.innerHTML = pbt.fixtures.map((f, idx) => `
        <div style="background:rgba(255,255,255,0.02); border:1px solid rgba(255,255,255,0.08); border-radius:14px; padding:12px 18px; display:flex; justify-content:space-between; align-items:center;">
          <div>
            <span style="font-size:0.75rem; color:var(--text-muted); font-weight:800;">ROUND ${f.round}</span>
            <div style="font-weight:700; font-size:0.95rem; margin-top:2px;">
              <span style="${f.completed && f.winner === f.teamA ? 'color:var(--pb-primary); font-weight:800;' : ''}">${f.teamA}</span>
              <span style="color:var(--text-muted); margin:0 6px;">vs</span>
              <span style="${f.completed && f.winner === f.teamB ? 'color:var(--pb-primary); font-weight:800;' : ''}">${f.teamB}</span>
            </div>
          </div>
          <div>
            ${f.completed ? `
              <span style="font-family:monospace; font-weight:900; font-size:1.1rem; color:var(--pb-primary);">${f.scoreA} - ${f.scoreB}</span>
            ` : `
              <button class="pb-play-fixture-btn sport-tab active" data-fixture-index="${idx}" style="padding:6px 14px; font-size:0.8rem; border-radius:8px;">Play Match &rarr;</button>
            `}
          </div>
        </div>
      `).join("");

      // Bind Play Fixture buttons
      document.querySelectorAll(".pb-play-fixture-btn").forEach(btn => {
        btn.addEventListener("click", (e) => {
          const fIdx = parseInt(e.currentTarget.getAttribute("data-fixture-index"));
          startTournamentFixture(fIdx);
        });
      });
    }
  }

  function startTournamentFixture(idx) {
    const f = pbt.fixtures[idx];
    if (!f || f.completed) return;
    pbt.activeFixtureIndex = idx;
    pb = clone(defaultPickleballState);
    pb.active = true;
    pb.isTournamentMatch = true;
    pb.p1Name = f.teamA;
    pb.p2Name = f.teamB;
    pb.targetScore = pbt.targetScore;
    pb.gamesLength = pbt.gamesLength;

    showView("match");
    renderMatchUI();
    saveState();
  }

  // 7. VIEW ROUTING & INITIALIZATION
  function showView(view) {
    if (els.formatView) els.formatView.classList.add("hidden");
    if (els.setupView) els.setupView.classList.add("hidden");
    if (els.matchView) els.matchView.classList.add("hidden");
    if (els.tsetupView) els.tsetupView.classList.add("hidden");
    if (els.tdashboardView) els.tdashboardView.classList.add("hidden");

    if (view === "format" && els.formatView) els.formatView.classList.remove("hidden");
    if (view === "setup" && els.setupView) els.setupView.classList.remove("hidden");
    if (view === "match" && els.matchView) els.matchView.classList.remove("hidden");
    if (view === "tsetup" && els.tsetupView) els.tsetupView.classList.remove("hidden");
    if (view === "tdashboard" && els.tdashboardView) els.tdashboardView.classList.remove("hidden");
  }

  function showPickleballPage() {
    document.querySelectorAll(".sports-page, .format-page, .welcome-page, .tracker-page").forEach(p => p.classList.add("hidden"));
    if (els.page) els.page.classList.remove("hidden");

    if (pb.active) {
      showView("match");
      renderMatchUI();
    } else if (pbt.active) {
      showView("tdashboard");
      renderTournamentDashboard();
    } else {
      showView("format");
    }
  }
  window.showPickleballPage = showPickleballPage;

  // 8. ATTACH EVENT LISTENERS
  function initListeners() {
    // Navigation
    if (els.formatBackBtn) {
      els.formatBackBtn.addEventListener("click", () => { window.location.hash = "#sports"; });
    }
    if (els.formatCustomBtn) {
      els.formatCustomBtn.addEventListener("click", () => { showView("setup"); });
    }
    if (els.formatTournamentBtn) {
      els.formatTournamentBtn.addEventListener("click", () => {
        if (pbt.active) {
          showView("tdashboard");
          renderTournamentDashboard();
        } else {
          showView("tsetup");
        }
      });
    }
    if (els.setupBackBtn) {
      els.setupBackBtn.addEventListener("click", () => { showView("format"); });
    }
    if (els.tsetupBackBtn) {
      els.tsetupBackBtn.addEventListener("click", () => { showView("format"); });
    }
    if (els.matchBackBtn) {
      els.matchBackBtn.addEventListener("click", () => {
        if (pb.isTournamentMatch && pbt.active) {
          pb.active = false;
          saveState();
          showView("tdashboard");
          renderTournamentDashboard();
        } else {
          showView("format");
        }
      });
    }

    // Start Custom Match
    if (els.startBtn) {
      els.startBtn.addEventListener("click", () => {
        const t1 = (els.team1Input && els.team1Input.value.trim()) || "Team 1";
        const t2 = (els.team2Input && els.team2Input.value.trim()) || "Team 2";
        const type = (els.typeSelect && els.typeSelect.value) || "doubles";
        const pts = parseInt(els.pointsSelect && els.pointsSelect.value) || 11;
        const gms = parseInt(els.gamesSelect && els.gamesSelect.value) || 3;

        pb = clone(defaultPickleballState);
        pb.active = true;
        pb.isTournamentMatch = false;
        pb.p1Name = t1;
        pb.p2Name = t2;
        pb.matchType = type;
        pb.targetScore = pts;
        pb.gamesLength = gms;

        showView("match");
        renderMatchUI();
        saveState();
      });
    }

    // Scoring Actions
    if (els.rallyWinBtn1) {
      els.rallyWinBtn1.addEventListener("click", () => { recordRallyResult(1); });
    }
    if (els.rallyWinBtn2) {
      els.rallyWinBtn2.addEventListener("click", () => { recordRallyResult(2); });
    }
    if (els.kitchenFaultBtn) {
      els.kitchenFaultBtn.addEventListener("click", handleKitchenFault);
    }
    if (els.undoBtn) {
      els.undoBtn.addEventListener("click", undoLastAction);
    }
    if (els.resetMatchBtn) {
      els.resetMatchBtn.addEventListener("click", () => {
        if (confirm("Reset current Pickleball match score?")) {
          pb.score1 = 0;
          pb.score2 = 0;
          pb.gamesWon1 = 0;
          pb.gamesWon2 = 0;
          pb.currentGameIndex = 0;
          pb.servingTeam = 1;
          pb.serverNumber = 2;
          pb.isFirstServeOfGame = true;
          pb.matchCompleted = false;
          pb.winner = null;
          pb.timeline = [];
          pb.history = [];
          renderMatchUI();
          saveState();
          showToast("Match reset.");
        }
      });
    }

    // Tournament Team Count Select
    if (els.tcountSelect) {
      els.tcountSelect.addEventListener("change", (e) => {
        const count = parseInt(e.target.value);
        if (els.tteamInputs) {
          els.tteamInputs.innerHTML = "";
          for (let i = 1; i <= count; i++) {
            els.tteamInputs.innerHTML += `
              <div>
                <label style="display:block; font-size:0.8rem; color:var(--text-muted); margin-bottom:4px; font-weight:600;">Team ${i} Name</label>
                <input id="pb-tteam-${i}" type="text" maxlength="24" value="Pickle Squad ${i}" style="width:100%; height:40px; background:rgba(0,0,0,0.2); border:1px solid rgba(255,255,255,0.1); border-radius:8px; color:var(--ink); padding:0 12px; font-size:0.9rem;" />
              </div>
            `;
          }
        }
      });
    }

    // Tournament Start
    if (els.tstartBtn) {
      els.tstartBtn.addEventListener("click", () => {
        pbt.name = (els.tnameInput && els.tnameInput.value.trim()) || "Pickleball Championship Cup";
        pbt.teamCount = parseInt(els.tcountSelect && els.tcountSelect.value) || 4;
        generateTournament();
        showView("tdashboard");
      });
    }

    // Tournament Reset
    if (els.tresetBtn) {
      els.tresetBtn.addEventListener("click", () => {
        if (confirm("Reset Pickleball Tournament? All fixtures and results will be cleared.")) {
          pbt = clone(defaultPbtState);
          pb.active = false;
          saveState();
          showView("format");
        }
      });
    }

    // Bind Home Sports Card button
    const cardBtn = document.querySelector("[data-open-sport='pickleball']");
    if (cardBtn) {
      cardBtn.addEventListener("click", () => {
        window.location.hash = "#pickleball";
      });
    }
  }

  // Hash Router
  loadState();

  if (window.location.hash.startsWith("#pickleball")) {
    showPickleballPage();
  }

  window.addEventListener("hashchange", () => {
    if (window.location.hash.startsWith("#pickleball")) {
      showPickleballPage();
    }
  });

  document.addEventListener("DOMContentLoaded", () => {
    initListeners();
  });
  // Also run if DOMContentLoaded has already fired
  if (document.readyState === "complete" || document.readyState === "interactive") {
    initListeners();
  }

})();
