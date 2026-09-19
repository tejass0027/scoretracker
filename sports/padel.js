/* ==========================================================================
   PADEL SCORE TRACKER & TOURNAMENT MODULE - OFFICIAL FIP & WPT RULES
   ========================================================================== */

console.log("ScoreTracker Padel Module loaded - version 210");

(function () {
  // 1. STORAGE KEYS & DEFAULTS
  const PDL_STORAGE_KEY = "padel-score-tracker-v1";
  const PDLT_STORAGE_KEY = "padel-tournament-tracker-v1";

  const defaultPadelState = {
    active: false,
    isTournamentMatch: false,
    t1Name: "Pair 1 (Team A)",
    t2Name: "Pair 2 (Team B)",
    goldenPoint: true, // Punto de Oro at 40-40 (Standard World Padel Tour rule)
    setsToWin: 2, // Best of 3 sets

    // Live match points (0, 1, 2, 3 correspond to 0, 15, 30, 40)
    point1: 0,
    point2: 0,
    adv: null, // "t1", "t2", or null
    isTiebreak: false,
    tbPoint1: 0,
    tbPoint2: 0,

    // Sets & Games Matrix (index 0, 1, 2 for sets 1, 2, 3)
    currentSetIndex: 0,
    sets1: [0, 0, 0],
    sets2: [0, 0, 0],
    setsWon1: 0,
    setsWon2: 0,

    // Serving indicator
    servingTeam: 1, // 1 or 2
    matchCompleted: false,
    winner: null,
    timeline: [],
    history: []
  };

  const defaultPdltState = {
    active: false,
    name: "Premier Padel Championship Cup",
    teamCount: 4,
    goldenPoint: true,
    setsToWin: 2,
    teams: [],
    fixtures: [],
    activeFixtureIndex: -1
  };

  let pdl = clone(defaultPadelState);
  let pdlt = clone(defaultPdltState);

  function clone(obj) {
    return JSON.parse(JSON.stringify(obj));
  }

  // 2. DOM SELECTORS
  const els = {
    page: document.querySelector("#padel-page"),
    formatView: document.querySelector("#pdl-format-view"),
    setupView: document.querySelector("#pdl-setup-view"),
    matchView: document.querySelector("#pdl-match-view"),
    tsetupView: document.querySelector("#pdl-tsetup-view"),
    tdashboardView: document.querySelector("#pdl-tdashboard-view"),

    // Format View Buttons
    formatBackBtn: document.querySelector("#pdl-format-back-btn"),
    formatCustomBtn: document.querySelector("#pdl-format-custom-btn"),
    formatTournamentBtn: document.querySelector("#pdl-format-tournament-btn"),

    // Setup View Elements
    setupBackBtn: document.querySelector("#pdl-setup-back-btn"),
    team1Input: document.querySelector("#pdl-team1-input"),
    team2Input: document.querySelector("#pdl-team2-input"),
    goldenPointSelect: document.querySelector("#pdl-golden-point-select"),
    setsSelect: document.querySelector("#pdl-sets-select"),
    startBtn: document.querySelector("#pdl-start-btn"),

    // Live Match Elements
    matchBackBtn: document.querySelector("#pdl-match-back-btn"),
    resetMatchBtn: document.querySelector("#pdl-reset-match-btn"),
    goldenPointBadge: document.querySelector("#pdl-golden-point-badge"),
    team1NameDisplay: document.querySelector("#pdl-team1-name-display"),
    team2NameDisplay: document.querySelector("#pdl-team2-name-display"),
    team1PointDisplay: document.querySelector("#pdl-team1-point-display"),
    team2PointDisplay: document.querySelector("#pdl-team2-point-display"),
    team1ServerBadge: document.querySelector("#pdl-team1-server-badge"),
    team2ServerBadge: document.querySelector("#pdl-team2-server-badge"),
    servingIndicator: document.querySelector("#pdl-serving-indicator"),

    // Set Cells
    t1Set1: document.querySelector("#pdl-t1-set1"),
    t1Set2: document.querySelector("#pdl-t1-set2"),
    t1Set3: document.querySelector("#pdl-t1-set3"),
    t2Set1: document.querySelector("#pdl-t2-set1"),
    t2Set2: document.querySelector("#pdl-t2-set2"),
    t2Set3: document.querySelector("#pdl-t2-set3"),

    // Point Buttons
    pointBtn1: document.querySelector("#pdl-point-btn1"),
    pointBtn2: document.querySelector("#pdl-point-btn2"),
    undoBtn: document.querySelector("#pdl-undo-btn"),
    saveVaultBtn: document.querySelector("#pdl-save-vault-btn"),
    timelineList: document.querySelector("#pdl-timeline-list"),

    // Tournament Elements
    tsetupBackBtn: document.querySelector("#pdl-tsetup-back-btn"),
    tnameInput: document.querySelector("#pdl-tname-input"),
    tcountSelect: document.querySelector("#pdl-tcount-select"),
    tteamInputs: document.querySelector("#pdl-tteam-inputs"),
    tstartBtn: document.querySelector("#pdl-tstart-btn"),
    tdashboardBackBtn: document.querySelector("#pdl-tdashboard-back-btn"),
    tdashboardTitle: document.querySelector("#pdl-tdashboard-title"),
    tstandingsBody: document.querySelector("#pdl-tstandings-body"),
    tfixturesList: document.querySelector("#pdl-tfixtures-list"),
    tresetBtn: document.querySelector("#pdl-treset-btn")
  };

  // 3. PERSISTENCE
  function saveState() {
    localStorage.setItem(PDL_STORAGE_KEY, JSON.stringify(pdl));
    localStorage.setItem(PDLT_STORAGE_KEY, JSON.stringify(pdlt));
  }

  function loadState() {
    try {
      const savedPdl = localStorage.getItem(PDL_STORAGE_KEY);
      if (savedPdl) pdl = Object.assign(clone(defaultPadelState), JSON.parse(savedPdl));
      const savedPdlt = localStorage.getItem(PDLT_STORAGE_KEY);
      if (savedPdlt) pdlt = Object.assign(clone(defaultPdltState), JSON.parse(savedPdlt));
    } catch (e) {
      console.error("Error loading Padel state", e);
    }
  }

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

  function showToast(msg) {
    let t = document.querySelector("#pdl-toast");
    if (!t) {
      t = document.createElement("div");
      t.id = "pdl-toast";
      t.style.cssText = "position:fixed; bottom:80px; left:50%; transform:translateX(-50%); background:#0ea5e9; color:#fff; font-weight:800; padding:10px 22px; border-radius:999px; box-shadow:0 6px 20px rgba(0,0,0,0.4); z-index:99999; font-size:0.9rem; pointer-events:none; transition:opacity 0.3s ease;";
      document.body.appendChild(t);
    }
    t.textContent = msg;
    t.style.opacity = "1";
    setTimeout(() => { t.style.opacity = "0"; }, 2500);
  }

  const padelPointsMap = ["0", "15", "30", "40"];

  function getScoreDisplay(team) {
    if (pdl.isTiebreak) {
      return team === 1 ? String(pdl.tbPoint1) : String(pdl.tbPoint2);
    }
    if (pdl.point1 >= 3 && pdl.point2 >= 3) {
      if (pdl.goldenPoint) {
        return "40"; // Punto de oro sudden death
      }
      if (pdl.point1 === pdl.point2) return "40"; // Deuce
      if (pdl.adv === "t1") return team === 1 ? "Adv" : "40";
      if (pdl.adv === "t2") return team === 2 ? "Adv" : "40";
    }
    return team === 1 ? padelPointsMap[pdl.point1] || "40" : padelPointsMap[pdl.point2] || "40";
  }

  // 4. SCORING LOGIC
  function addPoint(scoringTeam) {
    if (pdl.matchCompleted) return;

    // Snapshot for undo
    pdl.history.push({
      point1: pdl.point1,
      point2: pdl.point2,
      adv: pdl.adv,
      isTiebreak: pdl.isTiebreak,
      tbPoint1: pdl.tbPoint1,
      tbPoint2: pdl.tbPoint2,
      currentSetIndex: pdl.currentSetIndex,
      sets1: [...pdl.sets1],
      sets2: [...pdl.sets2],
      setsWon1: pdl.setsWon1,
      setsWon2: pdl.setsWon2,
      servingTeam: pdl.servingTeam,
      timeline: clone(pdl.timeline)
    });
    if (pdl.history.length > 30) pdl.history.shift();

    playBeep(700, 0.12);

    // TIEBREAK SCORING
    if (pdl.isTiebreak) {
      if (scoringTeam === 1) pdl.tbPoint1++;
      else pdl.tbPoint2++;

      // Switch serve every 2 points (after 1st point)
      const totalTbPoints = pdl.tbPoint1 + pdl.tbPoint2;
      if (totalTbPoints % 2 === 1) {
        pdl.servingTeam = pdl.servingTeam === 1 ? 2 : 1;
      }

      pdl.timeline.unshift({
        text: `Tiebreak: ${scoringTeam === 1 ? pdl.t1Name : pdl.t2Name} point (${pdl.tbPoint1} - ${pdl.tbPoint2})`,
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      });

      // Tiebreak win condition: 7 points and win by 2
      if ((pdl.tbPoint1 >= 7 && pdl.tbPoint1 - pdl.tbPoint2 >= 2) ||
          (pdl.tbPoint2 >= 7 && pdl.tbPoint2 - pdl.tbPoint1 >= 2)) {
        winGame(scoringTeam);
      }
      renderMatchUI();
      saveState();
      return;
    }

    // REGULAR GAME SCORING
    if (pdl.point1 >= 3 && pdl.point2 >= 3) {
      // Deuce situation
      if (pdl.goldenPoint) {
        // Punto de Oro! Next point wins game directly!
        winGame(scoringTeam);
        renderMatchUI();
        saveState();
        return;
      }

      // Traditional Advantage mode
      if (pdl.point1 === pdl.point2) {
        pdl.adv = scoringTeam === 1 ? "t1" : "t2";
        pdl.timeline.unshift({
          text: `Advantage ${scoringTeam === 1 ? pdl.t1Name : pdl.t2Name}`,
          time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
        });
      } else if ((pdl.adv === "t1" && scoringTeam === 1) || (pdl.adv === "t2" && scoringTeam === 2)) {
        winGame(scoringTeam);
      } else {
        // Back to deuce
        pdl.adv = null;
        pdl.timeline.unshift({
          text: `Back to Deuce (40-40)`,
          time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
        });
      }
    } else {
      if (scoringTeam === 1) {
        if (pdl.point1 === 3) {
          winGame(1);
        } else {
          pdl.point1++;
          pdl.timeline.unshift({
            text: `${pdl.t1Name} point (${getScoreDisplay(1)}-${getScoreDisplay(2)})`,
            time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
          });
        }
      } else {
        if (pdl.point2 === 3) {
          winGame(2);
        } else {
          pdl.point2++;
          pdl.timeline.unshift({
            text: `${pdl.t2Name} point (${getScoreDisplay(1)}-${getScoreDisplay(2)})`,
            time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
          });
        }
      }
    }

    renderMatchUI();
    saveState();
  }

  function winGame(gameWinnerTeam) {
    pdl.point1 = 0;
    pdl.point2 = 0;
    pdl.adv = null;
    pdl.isTiebreak = false;
    pdl.tbPoint1 = 0;
    pdl.tbPoint2 = 0;

    // Alternate service
    pdl.servingTeam = pdl.servingTeam === 1 ? 2 : 1;

    const sIdx = pdl.currentSetIndex;
    if (gameWinnerTeam === 1) pdl.sets1[sIdx]++;
    else pdl.sets2[sIdx]++;

    const g1 = pdl.sets1[sIdx];
    const g2 = pdl.sets2[sIdx];
    const winnerName = gameWinnerTeam === 1 ? pdl.t1Name : pdl.t2Name;

    showToast(`Game won by ${winnerName}! (${g1}-${g2})`);
    playBeep(850, 0.25);

    pdl.timeline.unshift({
      text: `🏆 GAME: ${winnerName} (${g1} - ${g2} in Set ${sIdx + 1})`,
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    });

    // Check Set Win
    if ((g1 >= 6 && g1 - g2 >= 2) || (g2 >= 6 && g2 - g1 >= 2) || g1 === 7 || g2 === 7) {
      if (g1 > g2) pdl.setsWon1++;
      else pdl.setsWon2++;

      showToast(`⭐ ${winnerName} WINS SET ${sIdx + 1}!`);
      pdl.timeline.unshift({
        text: `⭐ SET WON: ${winnerName} won Set ${sIdx + 1} (${g1}-${g2})!`,
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      });

      if (pdl.setsWon1 >= pdl.setsToWin || pdl.setsWon2 >= pdl.setsToWin) {
        pdl.matchCompleted = true;
        pdl.winner = pdl.setsWon1 > pdl.setsWon2 ? pdl.t1Name : pdl.t2Name;
        showToast(`🏆 ${pdl.winner} WINS THE PADEL MATCH!`);
      } else {
        pdl.currentSetIndex++;
      }
    } else if (g1 === 6 && g2 === 6) {
      // 6-6 -> Tiebreak
      pdl.isTiebreak = true;
      showToast("TIEBREAK! First to 7 points (win by 2)");
      pdl.timeline.unshift({
        text: `⚡ Tiebreak started in Set ${sIdx + 1}!`,
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      });
    }
  }

  function undoLastAction() {
    if (!pdl.history || pdl.history.length === 0) {
      showToast("Nothing to undo!");
      return;
    }
    const prev = pdl.history.pop();
    pdl.point1 = prev.point1;
    pdl.point2 = prev.point2;
    pdl.adv = prev.adv;
    pdl.isTiebreak = prev.isTiebreak;
    pdl.tbPoint1 = prev.tbPoint1;
    pdl.tbPoint2 = prev.tbPoint2;
    pdl.currentSetIndex = prev.currentSetIndex;
    pdl.sets1 = prev.sets1;
    pdl.sets2 = prev.sets2;
    pdl.setsWon1 = prev.setsWon1;
    pdl.setsWon2 = prev.setsWon2;
    pdl.servingTeam = prev.servingTeam;
    pdl.timeline = prev.timeline;
    pdl.matchCompleted = false;
    pdl.winner = null;
    showToast("Last point undone.");
    renderMatchUI();
    saveState();
  }

  // 5. RENDER UI
  function renderMatchUI() {
    if (!els.page) return;
    if (els.team1NameDisplay) els.team1NameDisplay.textContent = pdl.t1Name;
    if (els.team2NameDisplay) els.team2NameDisplay.textContent = pdl.t2Name;
    if (els.team1PointDisplay) els.team1PointDisplay.textContent = getScoreDisplay(1);
    if (els.team2PointDisplay) els.team2PointDisplay.textContent = getScoreDisplay(2);

    // Golden point indicator
    if (els.goldenPointBadge) {
      const is40All = (pdl.point1 === 3 && pdl.point2 === 3 && !pdl.isTiebreak);
      if (is40All && pdl.goldenPoint) {
        els.goldenPointBadge.style.display = "inline-flex";
      } else {
        els.goldenPointBadge.style.display = "none";
      }
    }

    // Serving Badges
    if (els.team1ServerBadge) {
      els.team1ServerBadge.style.display = pdl.servingTeam === 1 ? "inline-flex" : "none";
    }
    if (els.team2ServerBadge) {
      els.team2ServerBadge.style.display = pdl.servingTeam === 2 ? "inline-flex" : "none";
    }
    if (els.servingIndicator) {
      const sName = pdl.servingTeam === 1 ? pdl.t1Name : pdl.t2Name;
      els.servingIndicator.textContent = `${sName} Serving • Set ${pdl.currentSetIndex + 1} ${pdl.isTiebreak ? '(Tiebreak)' : ''}`;
    }

    // Set Cells
    if (els.t1Set1) els.t1Set1.textContent = pdl.sets1[0];
    if (els.t1Set2) els.t1Set2.textContent = pdl.sets1[1];
    if (els.t1Set3) els.t1Set3.textContent = pdl.sets1[2];
    if (els.t2Set1) els.t2Set1.textContent = pdl.sets2[0];
    if (els.t2Set2) els.t2Set2.textContent = pdl.sets2[1];
    if (els.t2Set3) els.t2Set3.textContent = pdl.sets2[2];

    // Highlight current set cell
    [els.t1Set1, els.t1Set2, els.t1Set3, els.t2Set1, els.t2Set2, els.t2Set3].forEach((c, idx) => {
      if (c) {
        const setNum = (idx % 3);
        if (setNum === pdl.currentSetIndex && !pdl.matchCompleted) {
          c.classList.add("current");
        } else {
          c.classList.remove("current");
        }
      }
    });

    // Timeline
    if (els.timelineList) {
      els.timelineList.innerHTML = pdl.timeline.slice(0, 8).map(t => `
        <div class="pdl-log-item">
          <span>${t.text}</span>
          <span style="color:var(--text-muted); font-size:0.75rem;">${t.time}</span>
        </div>
      `).join("") || `<p style="text-align:center; color:var(--text-muted); font-size:0.85rem; margin:10px 0;">Match ready to begin.</p>`;
    }
  }

  // 6. TOURNAMENT ENGINE
  function generateTournament() {
    const teams = [];
    const count = parseInt(pdlt.teamCount) || 4;
    for (let i = 1; i <= count; i++) {
      const input = document.querySelector(`#pdl-tteam-${i}`);
      const tName = (input && input.value.trim()) || `Padel Pair ${i}`;
      teams.push({
        id: i,
        name: tName,
        played: 0,
        won: 0,
        lost: 0,
        setsWon: 0,
        setsLost: 0,
        setsDiff: 0,
        pts: 0
      });
    }
    pdlt.teams = teams;

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
    pdlt.fixtures = fixtures;
    pdlt.active = true;
    renderTournamentDashboard();
    saveState();
  }

  function renderTournamentDashboard() {
    if (!els.tdashboardView) return;
    if (els.tdashboardTitle) els.tdashboardTitle.textContent = pdlt.name;

    if (els.tstandingsBody) {
      const sorted = [...pdlt.teams].sort((a, b) => b.pts - a.pts || b.setsDiff - a.setsDiff);
      els.tstandingsBody.innerHTML = sorted.map((t, idx) => `
        <tr style="border-bottom: 1px solid rgba(255,255,255,0.06);">
          <td style="padding:10px 14px; font-weight:800; color:${idx === 0 ? 'var(--pdl-primary)' : '#fff'};">${idx + 1}</td>
          <td style="padding:10px 14px; font-weight:700;">${t.name}</td>
          <td style="padding:10px 14px; text-align:center;">${t.played}</td>
          <td style="padding:10px 14px; text-align:center; color:#34d399;">${t.won}</td>
          <td style="padding:10px 14px; text-align:center; color:#f87171;">${t.lost}</td>
          <td style="padding:10px 14px; text-align:center;">${t.setsDiff > 0 ? '+' : ''}${t.setsDiff}</td>
          <td style="padding:10px 14px; text-align:center; font-weight:900; color:var(--pdl-primary);">${t.pts}</td>
        </tr>
      `).join("");
    }

    if (els.tfixturesList) {
      els.tfixturesList.innerHTML = pdlt.fixtures.map((f, idx) => `
        <div style="background:rgba(255,255,255,0.02); border:1px solid rgba(255,255,255,0.08); border-radius:14px; padding:12px 18px; display:flex; justify-content:space-between; align-items:center;">
          <div>
            <span style="font-size:0.75rem; color:var(--text-muted); font-weight:800;">ROUND ${f.round}</span>
            <div style="font-weight:700; font-size:0.95rem; margin-top:2px;">
              <span style="${f.completed && f.winner === f.teamA ? 'color:var(--pdl-primary); font-weight:800;' : ''}">${f.teamA}</span>
              <span style="color:var(--text-muted); margin:0 6px;">vs</span>
              <span style="${f.completed && f.winner === f.teamB ? 'color:var(--pdl-primary); font-weight:800;' : ''}">${f.teamB}</span>
            </div>
          </div>
          <div>
            ${f.completed ? `
              <span style="font-family:monospace; font-weight:900; font-size:1.1rem; color:var(--pdl-primary);">${f.scoreA} - ${f.scoreB} Sets</span>
            ` : `
              <button class="pdl-play-fixture-btn sport-tab active" data-fixture-index="${idx}" style="padding:6px 14px; font-size:0.8rem; border-radius:8px;">Play Match &rarr;</button>
            `}
          </div>
        </div>
      `).join("");

      document.querySelectorAll(".pdl-play-fixture-btn").forEach(btn => {
        btn.addEventListener("click", (e) => {
          const fIdx = parseInt(e.currentTarget.getAttribute("data-fixture-index"));
          startTournamentFixture(fIdx);
        });
      });
    }
  }

  function startTournamentFixture(idx) {
    const f = pdlt.fixtures[idx];
    if (!f || f.completed) return;
    pdlt.activeFixtureIndex = idx;
    pdl = clone(defaultPadelState);
    pdl.active = true;
    pdl.isTournamentMatch = true;
    pdl.t1Name = f.teamA;
    pdl.t2Name = f.teamB;
    pdl.goldenPoint = pdlt.goldenPoint;
    pdl.setsToWin = pdlt.setsToWin;

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

  function showPadelPage() {
    document.querySelectorAll(".sports-page, .format-page, .welcome-page, .tracker-page").forEach(p => p.classList.add("hidden"));
    if (els.page) els.page.classList.remove("hidden");

    if (pdl.active) {
      showView("match");
      renderMatchUI();
    } else if (pdlt.active) {
      showView("tdashboard");
      renderTournamentDashboard();
    } else {
      showView("format");
    }
  }
  window.showPadelPage = showPadelPage;

  function initListeners() {
    if (els.formatBackBtn) {
      els.formatBackBtn.addEventListener("click", () => { window.location.hash = "#sports"; });
    }
    if (els.formatCustomBtn) {
      els.formatCustomBtn.addEventListener("click", () => { showView("setup"); });
    }
    if (els.formatTournamentBtn) {
      els.formatTournamentBtn.addEventListener("click", () => {
        if (pdlt.active) {
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
        if (pdl.isTournamentMatch && pdlt.active) {
          pdl.active = false;
          saveState();
          showView("tdashboard");
          renderTournamentDashboard();
        } else {
          showView("format");
        }
      });
    }

    if (els.startBtn) {
      els.startBtn.addEventListener("click", () => {
        const t1 = (els.team1Input && els.team1Input.value.trim()) || "Pair 1 (Team A)";
        const t2 = (els.team2Input && els.team2Input.value.trim()) || "Pair 2 (Team B)";
        const gp = els.goldenPointSelect ? els.goldenPointSelect.value === "true" : true;
        const sets = parseInt(els.setsSelect && els.setsSelect.value) || 2;

        pdl = clone(defaultPadelState);
        pdl.active = true;
        pdl.isTournamentMatch = false;
        pdl.t1Name = t1;
        pdl.t2Name = t2;
        pdl.goldenPoint = gp;
        pdl.setsToWin = sets;

        showView("match");
        renderMatchUI();
        saveState();
      });
    }

    if (els.pointBtn1) {
      els.pointBtn1.addEventListener("click", () => { addPoint(1); });
    }
    if (els.pointBtn2) {
      els.pointBtn2.addEventListener("click", () => { addPoint(2); });
    }
    if (els.undoBtn) {
      els.undoBtn.addEventListener("click", undoLastAction);
    }
    if (els.resetMatchBtn) {
      els.resetMatchBtn.addEventListener("click", () => {
        if (confirm("Reset current Padel match score?")) {
          pdl.point1 = 0;
          pdl.point2 = 0;
          pdl.adv = null;
          pdl.isTiebreak = false;
          pdl.tbPoint1 = 0;
          pdl.tbPoint2 = 0;
          pdl.currentSetIndex = 0;
          pdl.sets1 = [0, 0, 0];
          pdl.sets2 = [0, 0, 0];
          pdl.setsWon1 = 0;
          pdl.setsWon2 = 0;
          pdl.matchCompleted = false;
          pdl.winner = null;
          pdl.timeline = [];
          pdl.history = [];
          renderMatchUI();
          saveState();
          showToast("Match reset.");
        }
      });
    }

    if (els.tcountSelect) {
      els.tcountSelect.addEventListener("change", (e) => {
        const count = parseInt(e.target.value);
        if (els.tteamInputs) {
          els.tteamInputs.innerHTML = "";
          for (let i = 1; i <= count; i++) {
            els.tteamInputs.innerHTML += `
              <div>
                <label style="display:block; font-size:0.8rem; color:var(--text-muted); margin-bottom:4px; font-weight:600;">Pair ${i} Names</label>
                <input id="pdl-tteam-${i}" type="text" maxlength="24" value="Padel Pair ${i}" style="width:100%; height:40px; background:rgba(0,0,0,0.2); border:1px solid rgba(255,255,255,0.1); border-radius:8px; color:var(--ink); padding:0 12px; font-size:0.9rem;" />
              </div>
            `;
          }
        }
      });
    }

    if (els.tstartBtn) {
      els.tstartBtn.addEventListener("click", () => {
        pdlt.name = (els.tnameInput && els.tnameInput.value.trim()) || "Premier Padel Championship Cup";
        pdlt.teamCount = parseInt(els.tcountSelect && els.tcountSelect.value) || 4;
        generateTournament();
        showView("tdashboard");
      });
    }

    if (els.tresetBtn) {
      els.tresetBtn.addEventListener("click", () => {
        if (confirm("Reset Padel Tournament? All fixtures and results will be cleared.")) {
          pdlt = clone(defaultPdltState);
          pdl.active = false;
          saveState();
          showView("format");
        }
      });
    }

    const cardBtn = document.querySelector("[data-open-sport='padel']");
    if (cardBtn) {
      cardBtn.addEventListener("click", () => {
        window.location.hash = "#padel";
      });
    }
  }

  loadState();

  if (window.location.hash.startsWith("#padel")) {
    showPadelPage();
  }

  window.addEventListener("hashchange", () => {
    if (window.location.hash.startsWith("#padel")) {
      showPadelPage();
    }
  });

  document.addEventListener("DOMContentLoaded", () => {
    initListeners();
  });
  if (document.readyState === "complete" || document.readyState === "interactive") {
    initListeners();
  }

})();
