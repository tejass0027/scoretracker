/* ==========================================================================
   SQUASH SCORE TRACKER & TOURNAMENT MODULE - OFFICIAL PSA PAR SCORING
   ========================================================================== */

console.log("ScoreTracker Squash Module loaded - version 210");

(function () {
  // 1. STORAGE KEYS & DEFAULTS
  const SQ_STORAGE_KEY = "squash-score-tracker-v1";
  const SQT_STORAGE_KEY = "squash-tournament-tracker-v1";

  const defaultSquashState = {
    active: false,
    isTournamentMatch: false,
    p1Name: "Player 1",
    p2Name: "Player 2",
    targetScore: 11, // Standard PAR-11
    bestOfGames: 5,  // Best of 5 (first to 3) or Best of 3 (first to 2)

    // Live match scores
    score1: 0,
    score2: 0,
    gamesWon1: 0,
    gamesWon2: 0,
    currentGameIndex: 1,
    gameScores: [], // [{game: 1, p1: 11, p2: 8, winner: 1}]

    // Serving state
    server: 1, // 1 or 2
    serviceSide: "R", // 'L' or 'R'

    // Status
    matchCompleted: false,
    winner: null,
    lastDecision: null, // "let", "stroke-p1", "stroke-p2", "nolet"
    timeline: [],
    history: []
  };

  const defaultSqtState = {
    active: false,
    name: "PSA Squash Open Championship",
    playerCount: 4,
    bestOfGames: 5,
    players: [],
    fixtures: [],
    activeFixtureIndex: -1
  };

  let sq = clone(defaultSquashState);
  let sqt = clone(defaultSqtState);

  function clone(obj) {
    return JSON.parse(JSON.stringify(obj));
  }

  // 2. DOM SELECTORS
  const els = {
    page: document.querySelector("#squash-page"),
    formatView: document.querySelector("#sq-format-view"),
    setupView: document.querySelector("#sq-setup-view"),
    matchView: document.querySelector("#sq-match-view"),
    tsetupView: document.querySelector("#sq-tsetup-view"),
    tdashboardView: document.querySelector("#sq-tdashboard-view"),

    // Format View Buttons
    formatBackBtn: document.querySelector("#sq-format-back-btn"),
    formatCustomBtn: document.querySelector("#sq-format-custom-btn"),
    formatTournamentBtn: document.querySelector("#sq-format-tournament-btn"),

    // Setup View Elements
    setupBackBtn: document.querySelector("#sq-setup-back-btn"),
    p1Input: document.querySelector("#sq-p1-input"),
    p2Input: document.querySelector("#sq-p2-input"),
    bestOfSelect: document.querySelector("#sq-bestof-select"),
    startBtn: document.querySelector("#sq-start-btn"),

    // Match View Elements
    matchBackBtn: document.querySelector("#sq-match-back-btn"),
    resetMatchBtn: document.querySelector("#sq-reset-match-btn"),
    gameStatusBadge: document.querySelector("#sq-game-status-badge"),
    p1NameDisplay: document.querySelector("#sq-p1-name-display"),
    p2NameDisplay: document.querySelector("#sq-p2-name-display"),
    p1ScoreDisplay: document.querySelector("#sq-p1-score-display"),
    p2ScoreDisplay: document.querySelector("#sq-p2-score-display"),
    p1GamesBadge: document.querySelector("#sq-p1-games-badge"),
    p2GamesBadge: document.querySelector("#sq-p2-games-badge"),
    p1ServerBadge: document.querySelector("#sq-p1-server-badge"),
    p2ServerBadge: document.querySelector("#sq-p2-server-badge"),
    p1SideIndicator: document.querySelector("#sq-p1-side-indicator"),
    p2SideIndicator: document.querySelector("#sq-p2-side-indicator"),

    // Point Buttons
    p1PointBtn: document.querySelector("#sq-p1-point-btn"),
    p2PointBtn: document.querySelector("#sq-p2-point-btn"),

    // Decisions
    decisionLetBtn: document.querySelector("#sq-decision-let-btn"),
    decisionStrokeP1Btn: document.querySelector("#sq-decision-stroke-p1-btn"),
    decisionStrokeP2Btn: document.querySelector("#sq-decision-stroke-p2-btn"),
    decisionNoLetBtn: document.querySelector("#sq-decision-nolet-btn"),

    undoBtn: document.querySelector("#sq-undo-btn"),
    saveVaultBtn: document.querySelector("#sq-save-vault-btn"),
    timelineList: document.querySelector("#sq-timeline-list"),
    gameMatrixList: document.querySelector("#sq-game-matrix-list"),

    // Tournament
    tsetupBackBtn: document.querySelector("#sq-tsetup-back-btn"),
    tnameInput: document.querySelector("#sq-tname-input"),
    tcountSelect: document.querySelector("#sq-tcount-select"),
    tbestofSelect: document.querySelector("#sq-tbestof-select"),
    tplayerInputs: document.querySelector("#sq-tplayer-inputs"),
    tstartBtn: document.querySelector("#sq-tstart-btn"),
    tdashboardBackBtn: document.querySelector("#sq-tdashboard-back-btn"),
    tdashboardTitle: document.querySelector("#sq-tdashboard-title"),
    tstandingsBody: document.querySelector("#sq-tstandings-body"),
    tfixturesList: document.querySelector("#sq-tfixtures-list"),
    tresetBtn: document.querySelector("#sq-treset-btn")
  };

  // 3. PERSISTENCE
  function saveState() {
    localStorage.setItem(SQ_STORAGE_KEY, JSON.stringify(sq));
    localStorage.setItem(SQT_STORAGE_KEY, JSON.stringify(sqt));
  }

  function loadState() {
    try {
      const savedSq = localStorage.getItem(SQ_STORAGE_KEY);
      if (savedSq) sq = Object.assign(clone(defaultSquashState), JSON.parse(savedSq));
      const savedSqt = localStorage.getItem(SQT_STORAGE_KEY);
      if (savedSqt) sqt = Object.assign(clone(defaultSqtState), JSON.parse(savedSqt));
    } catch (e) {
      console.error("Error loading Squash state", e);
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

  function saveSnapshot() {
    if (!sq.history) sq.history = [];
    const snapshot = {
      score1: sq.score1,
      score2: sq.score2,
      gamesWon1: sq.gamesWon1,
      gamesWon2: sq.gamesWon2,
      currentGameIndex: sq.currentGameIndex,
      gameScores: clone(sq.gameScores),
      server: sq.server,
      serviceSide: sq.serviceSide,
      matchCompleted: sq.matchCompleted,
      winner: sq.winner,
      lastDecision: sq.lastDecision,
      timeline: clone(sq.timeline)
    };
    sq.history.push(snapshot);
    if (sq.history.length > 40) sq.history.shift();
  }

  function showView(viewName) {
    const views = ["format", "setup", "match", "tsetup", "tdashboard"];
    views.forEach(v => {
      const el = els[v + "View"];
      if (el) {
        if (v === viewName) {
          el.classList.remove("hidden");
          el.style.display = "block";
        } else {
          el.classList.add("hidden");
          el.style.display = "none";
        }
      }
    });
  }

  // 4. SQUASH PSA SCORING LOGIC (PAR-11, Win by 2)
  function recordPoint(winnerPlayer, reason = "Rally won") {
    if (sq.matchCompleted) return;
    saveSnapshot();

    // Check if server won or hand-out
    if (sq.server === winnerPlayer) {
      // Server holds serve -> switches service box (L -> R, R -> L)
      sq.serviceSide = sq.serviceSide === "R" ? "L" : "R";
    } else {
      // Hand-out! Winner becomes new server and may choose initial side (defaults to R)
      sq.server = winnerPlayer;
      sq.serviceSide = "R";
    }

    if (winnerPlayer === 1) {
      sq.score1++;
    } else {
      sq.score2++;
    }

    const winnerName = winnerPlayer === 1 ? sq.p1Name : sq.p2Name;
    sq.timeline.unshift({
      time: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit", second: "2-digit" }),
      text: `${winnerName} point (${reason}) -> ${sq.score1}-${sq.score2}`,
      type: "point",
      player: winnerPlayer
    });

    playBeep(winnerPlayer === 1 ? 750 : 620, 0.12);
    checkGameStatus();
    renderMatchView();
    saveState();
  }

  function checkGameStatus() {
    const target = sq.targetScore || 11;
    const s1 = sq.score1;
    const s2 = sq.score2;
    const gamesToWin = Math.ceil((sq.bestOfGames || 5) / 2);

    // Standard PAR: Win by 2 (11, 12-10, 13-11, etc. No ceiling)
    if ((s1 >= target || s2 >= target) && Math.abs(s1 - s2) >= 2) {
      const gameWinner = s1 > s2 ? 1 : 2;
      const gameWinnerName = gameWinner === 1 ? sq.p1Name : sq.p2Name;

      sq.gameScores.push({
        game: sq.currentGameIndex,
        p1: s1,
        p2: s2,
        winner: gameWinner
      });

      if (gameWinner === 1) {
        sq.gamesWon1++;
      } else {
        sq.gamesWon2++;
      }

      sq.timeline.unshift({
        time: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit", second: "2-digit" }),
        text: `🏁 GAME ${sq.currentGameIndex} WON by ${gameWinnerName} (${s1}-${s2})`,
        type: "game-won",
        player: gameWinner
      });

      // Check Match Won
      if (sq.gamesWon1 >= gamesToWin || sq.gamesWon2 >= gamesToWin) {
        sq.matchCompleted = true;
        sq.winner = sq.gamesWon1 > sq.gamesWon2 ? 1 : 2;
        const matchWinnerName = sq.winner === 1 ? sq.p1Name : sq.p2Name;

        sq.timeline.unshift({
          time: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit", second: "2-digit" }),
          text: `🏆 MATCH WON by ${matchWinnerName} (${sq.gamesWon1}-${sq.gamesWon2})!`,
          type: "match-won",
          player: sq.winner
        });

        playBeep(920, 0.4);

        if (sq.isTournamentMatch && sqt.activeFixtureIndex >= 0) {
          syncTournamentResult();
        }

        setTimeout(() => {
          alert(`🏆 Match Over! ${matchWinnerName} wins the match ${sq.gamesWon1} - ${sq.gamesWon2}!`);
        }, 120);
      } else {
        // Next Game
        sq.currentGameIndex++;
        sq.score1 = 0;
        sq.score2 = 0;
        // Winner of game serves first in next game
        sq.server = gameWinner;
        sq.serviceSide = "R";
        playBeep(820, 0.25);
      }
    }
  }

  // 5. REFEREE DECISIONS
  function handleLet() {
    if (sq.matchCompleted) return;
    saveSnapshot();
    sq.lastDecision = "let";
    sq.timeline.unshift({
      time: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit", second: "2-digit" }),
      text: `🔄 REFEREE CALL: YES LET (Rally replayed - no point awarded)`,
      type: "decision"
    });
    playBeep(520, 0.15);
    renderMatchView();
    saveState();
  }

  function handleStroke(awardedPlayer) {
    if (sq.matchCompleted) return;
    const awardedName = awardedPlayer === 1 ? sq.p1Name : sq.p2Name;
    recordPoint(awardedPlayer, `STROKE awarded to ${awardedName}`);
  }

  function handleNoLet() {
    if (sq.matchCompleted) return;
    // No let means appeal rejected; point to non-appealing player.
    // If server was striking and denied let, point to receiver. If receiver denied let, point to server.
    const nonServer = sq.server === 1 ? 2 : 1;
    const oppName = nonServer === 1 ? sq.p1Name : sq.p2Name;
    recordPoint(nonServer, `NO LET - point to ${oppName}`);
  }

  function undoLastAction() {
    if (!sq.history || sq.history.length === 0) {
      alert("No actions to undo!");
      return;
    }
    const prev = sq.history.pop();
    sq.score1 = prev.score1;
    sq.score2 = prev.score2;
    sq.gamesWon1 = prev.gamesWon1;
    sq.gamesWon2 = prev.gamesWon2;
    sq.currentGameIndex = prev.currentGameIndex;
    sq.gameScores = prev.gameScores;
    sq.server = prev.server;
    sq.serviceSide = prev.serviceSide;
    sq.matchCompleted = prev.matchCompleted;
    sq.winner = prev.winner;
    sq.lastDecision = prev.lastDecision;
    sq.timeline = prev.timeline;

    playBeep(450, 0.1);
    renderMatchView();
    saveState();
  }

  // 6. RENDER MATCH VIEW
  function renderMatchView() {
    if (!els.matchView) return;

    if (els.p1NameDisplay) els.p1NameDisplay.textContent = sq.p1Name || "Player 1";
    if (els.p2NameDisplay) els.p2NameDisplay.textContent = sq.p2Name || "Player 2";

    if (els.p1ScoreDisplay) els.p1ScoreDisplay.textContent = sq.score1;
    if (els.p2ScoreDisplay) els.p2ScoreDisplay.textContent = sq.score2;

    if (els.p1GamesBadge) els.p1GamesBadge.textContent = sq.gamesWon1;
    if (els.p2GamesBadge) els.p2GamesBadge.textContent = sq.gamesWon2;

    const gamesNeeded = Math.ceil((sq.bestOfGames || 5) / 2);
    if (els.gameStatusBadge) {
      if (sq.matchCompleted) {
        const winName = sq.winner === 1 ? sq.p1Name : sq.p2Name;
        els.gameStatusBadge.textContent = `FINAL • ${winName.toUpperCase()} WON (${sq.gamesWon1}-${sq.gamesWon2})`;
        els.gameStatusBadge.style.color = "#10b981";
      } else {
        const isGamePoint = (sq.score1 >= (sq.targetScore - 1) || sq.score2 >= (sq.targetScore - 1)) && Math.abs(sq.score1 - sq.score2) >= 1;
        const isTiebreak = sq.score1 >= 10 && sq.score2 >= 10;
        let note = `GAME ${sq.currentGameIndex} (BEST OF ${sq.bestOfGames} - FIRST TO ${gamesNeeded})`;
        if (isTiebreak) note += " • TIEBREAK (WIN BY 2)";
        else if (isGamePoint) note += " • GAME POINT";
        els.gameStatusBadge.textContent = note;
        els.gameStatusBadge.style.color = isGamePoint ? "#f59e0b" : "var(--muted)";
      }
    }

    // Serving Badges & Side
    if (els.p1ServerBadge) {
      els.p1ServerBadge.style.display = sq.server === 1 ? "inline-flex" : "none";
      if (els.p1SideIndicator) els.p1SideIndicator.textContent = sq.server === 1 ? `BOX: ${sq.serviceSide}` : "";
    }
    if (els.p2ServerBadge) {
      els.p2ServerBadge.style.display = sq.server === 2 ? "inline-flex" : "none";
      if (els.p2SideIndicator) els.p2SideIndicator.textContent = sq.server === 2 ? `BOX: ${sq.serviceSide}` : "";
    }

    // Game Matrix (Previous games)
    if (els.gameMatrixList) {
      if (!sq.gameScores || sq.gameScores.length === 0) {
        els.gameMatrixList.innerHTML = `<span style="font-size: 0.85rem; color: var(--muted);">No completed games yet</span>`;
      } else {
        els.gameMatrixList.innerHTML = sq.gameScores.map(g => {
          const p1Bold = g.winner === 1 ? "font-weight:900; color:var(--sq-primary);" : "color:var(--muted);";
          const p2Bold = g.winner === 2 ? "font-weight:900; color:var(--sq-primary);" : "color:var(--muted);";
          return `
            <div style="display:inline-flex; align-items:center; gap:6px; background:rgba(255,255,255,0.04); border:1px solid rgba(255,255,255,0.08); padding:4px 10px; border-radius:8px; font-family:monospace; font-size:0.86rem;">
              <span style="color:var(--muted);">G${g.game}:</span>
              <span style="${p1Bold}">${g.p1}</span>-<span style="${p2Bold}">${g.p2}</span>
            </div>
          `;
        }).join("");
      }
    }

    // Timeline List
    if (els.timelineList) {
      if (!sq.timeline || sq.timeline.length === 0) {
        els.timelineList.innerHTML = `<p style="text-align:center; color:var(--muted); font-size:0.85rem; margin:16px 0;">No rally events yet. Tap Point or Referee call to begin.</p>`;
      } else {
        els.timelineList.innerHTML = sq.timeline.slice(0, 25).map(item => `
          <div class="sq-log-item">
            <span>${item.text}</span>
            <span style="color:var(--muted); font-size:0.75rem; font-family:monospace;">${item.time}</span>
          </div>
        `).join("");
      }
    }
  }

  // 7. TOURNAMENT ENGINE
  function generateTournament() {
    sqt.fixtures = [];
    const n = sqt.players.length;
    for (let i = 0; i < n; i++) {
      for (let j = i + 1; j < n; j++) {
        sqt.fixtures.push({
          id: `sq-fix-${i}-${j}`,
          p1: sqt.players[i],
          p2: sqt.players[j],
          p1Games: 0,
          p2Games: 0,
          scoreSummary: "",
          status: "pending", // pending, active, completed
          winner: null
        });
      }
    }
    saveState();
    renderTournamentDashboard();
  }

  function syncTournamentResult() {
    if (sqt.activeFixtureIndex < 0 || sqt.activeFixtureIndex >= sqt.fixtures.length) return;
    const fix = sqt.fixtures[sqt.activeFixtureIndex];
    fix.p1Games = sq.gamesWon1;
    fix.p2Games = sq.gamesWon2;
    fix.winner = sq.winner === 1 ? fix.p1 : fix.p2;
    fix.status = "completed";
    fix.scoreSummary = sq.gameScores.map(g => `${g.p1}-${g.p2}`).join(", ");
    saveState();
    renderTournamentDashboard();
  }

  function renderTournamentDashboard() {
    if (!els.tdashboardView) return;
    if (els.tdashboardTitle) els.tdashboardTitle.textContent = sqt.name || "Squash Tournament";

    // Build Standings table
    const stats = {};
    sqt.players.forEach(p => {
      stats[p] = { played: 0, won: 0, lost: 0, gamesFor: 0, gamesAgainst: 0, points: 0 };
    });

    sqt.fixtures.forEach(f => {
      if (f.status === "completed") {
        if (stats[f.p1]) {
          stats[f.p1].played++;
          stats[f.p1].gamesFor += f.p1Games;
          stats[f.p1].gamesAgainst += f.p2Games;
          if (f.winner === f.p1) {
            stats[f.p1].won++;
            stats[f.p1].points += 3;
          } else {
            stats[f.p1].lost++;
          }
        }
        if (stats[f.p2]) {
          stats[f.p2].played++;
          stats[f.p2].gamesFor += f.p2Games;
          stats[f.p2].gamesAgainst += f.p1Games;
          if (f.winner === f.p2) {
            stats[f.p2].won++;
            stats[f.p2].points += 3;
          } else {
            stats[f.p2].lost++;
          }
        }
      }
    });

    const sortedPlayers = [...sqt.players].sort((a, b) => {
      if (stats[b].points !== stats[a].points) return stats[b].points - stats[a].points;
      const diffA = stats[a].gamesFor - stats[a].gamesAgainst;
      const diffB = stats[b].gamesFor - stats[b].gamesAgainst;
      return diffB - diffA;
    });

    if (els.tstandingsBody) {
      els.tstandingsBody.innerHTML = sortedPlayers.map((name, idx) => {
        const s = stats[name];
        const rankMedal = idx === 0 ? "🥇 " : idx === 1 ? "🥈 " : idx === 2 ? "🥉 " : `${idx + 1}. `;
        return `
          <tr style="border-bottom: 1px solid rgba(255,255,255,0.06);">
            <td style="padding: 10px 14px; font-weight:700;">${rankMedal}${name}</td>
            <td style="padding: 10px 14px; text-align:center;">${s.played}</td>
            <td style="padding: 10px 14px; text-align:center; color:#10b981;">${s.won}</td>
            <td style="padding: 10px 14px; text-align:center; color:#ef4444;">${s.lost}</td>
            <td style="padding: 10px 14px; text-align:center; font-family:monospace;">${s.gamesFor}-${s.gamesAgainst}</td>
            <td style="padding: 10px 14px; text-align:center; font-weight:900; color:var(--sq-primary); font-size:1.1rem;">${s.points}</td>
          </tr>
        `;
      }).join("");
    }

    // Fixtures List
    if (els.tfixturesList) {
      els.tfixturesList.innerHTML = sqt.fixtures.map((f, i) => {
        const isDone = f.status === "completed";
        return `
          <div style="background:rgba(255,255,255,0.02); border:1px solid rgba(255,255,255,0.07); border-radius:12px; padding:14px; display:flex; justify-content:space-between; align-items:center; flex-wrap:wrap; gap:10px;">
            <div>
              <div style="font-weight:800; font-size:1.02rem;">
                <span style="${isDone && f.winner === f.p1 ? 'color:var(--sq-primary);' : ''}">${f.p1}</span>
                <span style="color:var(--muted); margin:0 8px;">vs</span>
                <span style="${isDone && f.winner === f.p2 ? 'color:var(--sq-primary);' : ''}">${f.p2}</span>
              </div>
              <div style="font-size:0.8rem; color:var(--muted); margin-top:3px;">
                ${isDone ? `Result: ${f.p1Games}-${f.p2Games} (${f.scoreSummary})` : 'Status: Ready to play'}
              </div>
            </div>
            <div>
              <button class="btn btn-secondary sq-play-fixture-btn" data-fix-idx="${i}" style="padding:8px 16px; font-size:0.86rem; border-radius:10px;">
                ${isDone ? 'Re-Score' : 'Score Match'}
              </button>
            </div>
          </div>
        `;
      }).join("");

      document.querySelectorAll(".sq-play-fixture-btn").forEach(btn => {
        btn.addEventListener("click", () => {
          const idx = parseInt(btn.getAttribute("data-fix-idx"));
          startTournamentMatch(idx);
        });
      });
    }
  }

  function startTournamentMatch(fixIdx) {
    sqt.activeFixtureIndex = fixIdx;
    const fix = sqt.fixtures[fixIdx];
    sq = clone(defaultSquashState);
    sq.active = true;
    sq.isTournamentMatch = true;
    sq.p1Name = fix.p1;
    sq.p2Name = fix.p2;
    sq.bestOfGames = sqt.bestOfGames || 5;
    saveState();
    renderMatchView();
    showView("match");
  }

  function showSquashPage() {
    document.querySelectorAll("main").forEach(p => {
      p.classList.add("hidden");
      p.style.display = "none";
    });
    if (els.page) {
      els.page.classList.remove("hidden");
      els.page.style.display = "block";
    }

    if (sq.active) {
      renderMatchView();
      showView("match");
    } else if (sqt.active) {
      renderTournamentDashboard();
      showView("tdashboard");
    } else {
      showView("format");
    }
  }
  window.showSquashPage = showSquashPage;

  // 8. INITIALIZE LISTENERS
  function initListeners() {
    // Format View
    if (els.formatBackBtn) {
      els.formatBackBtn.addEventListener("click", () => {
        window.location.hash = "#sports";
      });
    }
    if (els.formatCustomBtn) {
      els.formatCustomBtn.addEventListener("click", () => {
        showView("setup");
      });
    }
    if (els.formatTournamentBtn) {
      els.formatTournamentBtn.addEventListener("click", () => {
        if (sqt.active && sqt.fixtures.length > 0) {
          renderTournamentDashboard();
          showView("tdashboard");
        } else {
          showView("tsetup");
        }
      });
    }

    // Setup View
    if (els.setupBackBtn) {
      els.setupBackBtn.addEventListener("click", () => {
        showView("format");
      });
    }
    if (els.startBtn) {
      els.startBtn.addEventListener("click", () => {
        const p1 = (els.p1Input && els.p1Input.value.trim()) || "Player 1";
        const p2 = (els.p2Input && els.p2Input.value.trim()) || "Player 2";
        const bestOf = parseInt(els.bestOfSelect && els.bestOfSelect.value) || 5;

        sq = clone(defaultSquashState);
        sq.active = true;
        sq.isTournamentMatch = false;
        sq.p1Name = p1;
        sq.p2Name = p2;
        sq.bestOfGames = bestOf;
        saveState();
        renderMatchView();
        showView("match");
      });
    }

    // Match Back / Reset
    if (els.matchBackBtn) {
      els.matchBackBtn.addEventListener("click", () => {
        if (sq.isTournamentMatch) {
          renderTournamentDashboard();
          showView("tdashboard");
        } else {
          showView("format");
        }
      });
    }
    if (els.resetMatchBtn) {
      els.resetMatchBtn.addEventListener("click", () => {
        if (confirm("Reset current match scores?")) {
          const p1 = sq.p1Name;
          const p2 = sq.p2Name;
          const bestOf = sq.bestOfGames;
          const isTourney = sq.isTournamentMatch;

          sq = clone(defaultSquashState);
          sq.active = true;
          sq.isTournamentMatch = isTourney;
          sq.p1Name = p1;
          sq.p2Name = p2;
          sq.bestOfGames = bestOf;
          saveState();
          renderMatchView();
        }
      });
    }

    // Point Buttons
    if (els.p1PointBtn) {
      els.p1PointBtn.addEventListener("click", () => recordPoint(1, "Rally won"));
    }
    if (els.p2PointBtn) {
      els.p2PointBtn.addEventListener("click", () => recordPoint(2, "Rally won"));
    }

    // Referee Decisions
    if (els.decisionLetBtn) {
      els.decisionLetBtn.addEventListener("click", () => handleLet());
    }
    if (els.decisionStrokeP1Btn) {
      els.decisionStrokeP1Btn.addEventListener("click", () => handleStroke(1));
    }
    if (els.decisionStrokeP2Btn) {
      els.decisionStrokeP2Btn.addEventListener("click", () => handleStroke(2));
    }
    if (els.decisionNoLetBtn) {
      els.decisionNoLetBtn.addEventListener("click", () => handleNoLet());
    }

    // Undo
    if (els.undoBtn) {
      els.undoBtn.addEventListener("click", () => undoLastAction());
    }

    // Save to Vault
    if (els.saveVaultBtn) {
      els.saveVaultBtn.addEventListener("click", () => {
        if (!sq.timeline || sq.timeline.length === 0) {
          alert("Play at least one rally before saving to Vault!");
          return;
        }
        const record = {
          id: "sq-" + Date.now(),
          sport: "Squash",
          date: new Date().toLocaleDateString(),
          player1: sq.p1Name,
          player2: sq.p2Name,
          score: `${sq.gamesWon1} - ${sq.gamesWon2}`,
          gamesBreakdown: sq.gameScores.map(g => `${g.p1}-${g.p2}`).join(", "),
          winner: sq.winner === 1 ? sq.p1Name : sq.winner === 2 ? sq.p2Name : "In Progress"
        };
        try {
          const vault = JSON.parse(localStorage.getItem("match_vault") || "[]");
          vault.unshift(record);
          localStorage.setItem("match_vault", JSON.stringify(vault));
          playBeep(990, 0.2);
          alert("Squash match saved to Vault!");
        } catch (e) {
          alert("Match saved locally!");
        }
      });
    }

    // Tournament Setup View
    if (els.tsetupBackBtn) {
      els.tsetupBackBtn.addEventListener("click", () => {
        showView("format");
      });
    }
    if (els.tdashboardBackBtn) {
      els.tdashboardBackBtn.addEventListener("click", () => {
        showView("format");
      });
    }

    // Dynamically render player inputs in tsetup
    if (els.tcountSelect && els.tplayerInputs) {
      const renderPlayerInputs = () => {
        const count = parseInt(els.tcountSelect.value) || 4;
        let html = "";
        for (let i = 1; i <= count; i++) {
          html += `
            <div>
              <label class="form-label" style="font-size:0.85rem; color:var(--muted); margin-bottom:4px; display:block;">Player ${i} Name</label>
              <input type="text" class="input-field sq-player-name-in" data-idx="${i}" value="Player ${i}" placeholder="Enter name">
            </div>
          `;
        }
        els.tplayerInputs.innerHTML = html;
      };
      els.tcountSelect.addEventListener("change", renderPlayerInputs);
      renderPlayerInputs();
    }

    // Tournament Start
    if (els.tstartBtn) {
      els.tstartBtn.addEventListener("click", () => {
        const name = (els.tnameInput && els.tnameInput.value.trim()) || "PSA Squash Open Championship";
        const inputs = document.querySelectorAll(".sq-player-name-in");
        const players = [];
        inputs.forEach(inp => {
          const val = inp.value.trim();
          if (val) players.push(val);
        });
        if (players.length < 2) {
          alert("Please enter at least 2 players!");
          return;
        }

        sqt = clone(defaultSqtState);
        sqt.active = true;
        sqt.name = name;
        sqt.players = players;
        sqt.playerCount = players.length;
        sqt.bestOfGames = parseInt(els.tbestofSelect && els.tbestofSelect.value) || 5;
        generateTournament();
        showView("tdashboard");
      });
    }

    // Tournament Reset
    if (els.tresetBtn) {
      els.tresetBtn.addEventListener("click", () => {
        if (confirm("Reset Squash Tournament? All fixtures and results will be cleared.")) {
          sqt = clone(defaultSqtState);
          sq.active = false;
          saveState();
          showView("format");
        }
      });
    }

    // Bind Home Sports Card button
    const cardBtn = document.querySelector("[data-open-sport='squash']");
    if (cardBtn) {
      cardBtn.addEventListener("click", () => {
        window.location.hash = "#squash";
      });
    }
  }

  // Hash Router
  loadState();

  if (window.location.hash.startsWith("#squash")) {
    showSquashPage();
  }

  window.addEventListener("hashchange", () => {
    if (window.location.hash.startsWith("#squash")) {
      showSquashPage();
    }
  });

  document.addEventListener("DOMContentLoaded", () => {
    initListeners();
  });
  if (document.readyState === "complete" || document.readyState === "interactive") {
    initListeners();
  }

})();
