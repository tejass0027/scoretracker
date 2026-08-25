
window.addEventListener("error", (e) => {
  alert(`Global Error: ${e.message} at ${e.filename}:${e.lineno}`);
});
console.log("ScoreTracker App loaded - version 208");

const STORAGE_KEY = "cricket-score-tracker-v1";

const els = {
  sportsPage: document.querySelector("#sports-page"),
  formatPage: document.querySelector("#format-page"),
  cricketPage: document.querySelector("#cricket-page"),
  footballPage: document.querySelector("#football-page"),
  tennisPage: document.querySelector("#tennis-page"),
  customSetup: document.querySelector("#custom-setup"),
  customFormatBtn: document.querySelector("#custom-format-btn"),
  startCustomMatch: document.querySelector("#start-custom-match"),
  customTeamA: document.querySelector("#custom-team-a"),
  customTeamB: document.querySelector("#custom-team-b"),
  customOvers: document.querySelector("#custom-overs"),
  backToSportsFromFormat: document.querySelector("#back-to-sports-from-format"),
  backToFormats: document.querySelector("#back-to-formats"),
  formatLabel: document.querySelector("#format-label"),
  teamA: document.querySelector("#team-a"),
  teamB: document.querySelector("#team-b"),
  maxOvers: document.querySelector("#max-overs"),
  matchDay: document.querySelector("#match-day"),
  inningsLabel: document.querySelector("#innings-label"),
  mainScore: document.querySelector("#main-score"),
  oversLabel: document.querySelector("#overs-label"),
  runRate: document.querySelector("#run-rate"),
  targetLabel: document.querySelector("#target-label"),
  needLabel: document.querySelector("#need-label"),
  matchNote: document.querySelector("#match-note"),
  battingName: document.querySelector("#batting-name"),
  bowlingName: document.querySelector("#bowling-name"),
  dayName: document.querySelector("#day-name"),
  extrasName: document.querySelector("#extras-name"),
  recentBalls: document.querySelector("#recent-balls"),
  inningsSummary: document.querySelector("#innings-summary"),
  declareBtn: document.querySelector("#declare-btn"),
  followOnBtn: document.querySelector("#follow-on-btn"),
  undoBtn: document.querySelector("#undo-btn"),
  inningsBtn: document.querySelector("#innings-btn"),
  drawBtn: document.querySelector("#draw-btn"),
  resetBtn: document.querySelector("#reset-btn"),
  toast: document.querySelector("#toast"),
  momCardContainer: document.querySelector("#mom-card-container"),
  tournamentSeriesMomContainer: document.querySelector("#stats-series-mom-content"),
  navSportsBtn: document.querySelector("#nav-btn-sports"),
  navFormatsBtn: document.querySelector("#nav-btn-formats"),
  navLiveIndicator: document.querySelector("#nav-live-indicator"),
  playersTeamA: document.querySelector("#players-team-a"),
  playersTeamB: document.querySelector("#players-team-b"),
  customPlayersA: document.querySelector("#custom-players-a"),
  customPlayersB: document.querySelector("#custom-players-b"),
  dayEditorContainer: document.querySelector("#day-editor-container"),
  daySidebarContainer: document.querySelector("#day-sidebar-container"),
  tournamentSetup: document.querySelector("#tournament-setup"),
  tournamentDashboard: document.querySelector("#tournament-dashboard"),
  tournamentFormatBtn: document.querySelector("#tournament-format-btn"),
  startTournamentBtn: document.querySelector("#start-tournament"),
  tournamentTeamCount: document.querySelector("#tournament-team-count"),
  tournamentOvers: document.querySelector("#tournament-overs"),
  tournamentTeamInputs: document.querySelector("#tournament-team-inputs"),
  resetTournamentBtn: document.querySelector("#reset-tournament-btn"),
  tabPointsTable: document.querySelector("#tab-points-table"),
  tabFixtures: document.querySelector("#tab-fixtures"),
  tableView: document.querySelector("#tournament-table-view"),
  fixturesView: document.querySelector("#tournament-fixtures-view"),
  pointsTableBody: document.querySelector("#points-table-body"),
  fixturesList: document.querySelector("#fixtures-list"),
  submitTournamentBtn: document.querySelector("#submit-tournament-btn"),
  backToFormatsFromTsetup: document.querySelector("#back-to-formats-from-tsetup"),
  tournamentNameInput: document.querySelector("#tournament-name-input"),
  tournamentDashboardTitle: document.querySelector("#tournament-dashboard-title"),
  tournamentChoice: document.querySelector("#tournament-choice"),
  choiceOldTournamentName: document.querySelector("#choice-old-tournament-name"),
  choiceOldTournamentDesc: document.querySelector("#choice-old-tournament-desc"),
  btnResumeTournament: document.querySelector("#btn-resume-tournament"),
  btnNewTournamentChoice: document.querySelector("#btn-new-tournament-choice"),
  backToFormatsFromTchoice: document.querySelector("#back-to-formats-from-tchoice"),
  pastTournamentsList: document.querySelector("#past-tournaments-list"),
  activeTournamentBox: document.querySelector("#active-tournament-box"),
  tabStats: document.querySelector("#tab-stats"),
  statsView: document.querySelector("#tournament-stats-view"),
  tabInfo: document.querySelector("#tab-info"),
  infoView: document.querySelector("#tournament-info-view"),
  statsOrangeCap: document.querySelector("#stats-orange-cap"),
  statsPurpleCap: document.querySelector("#stats-purple-cap"),
  tabEdit: document.querySelector("#tab-edit"),
  editTournamentView: document.querySelector("#tournament-edit-view"),
  editTournamentOvers: document.querySelector("#edit-tournament-overs"),
  editTournamentPlayersCount: document.querySelector("#edit-tournament-players-count"),
  editTournamentTeamsContainer: document.querySelector("#edit-tournament-teams-container"),
  btnSaveTournamentEdits: document.querySelector("#btn-save-tournament-edits"),
  squadEditShortcutBtn: document.querySelector("#squad-edit-shortcut-btn"),
  statsRecords: document.querySelector("#stats-records"),
  btnFullScorecard: document.querySelector("#btn-full-scorecard"),
  scorecardModal: document.querySelector("#scorecard-modal"),
  closeScorecardModal: document.querySelector("#close-scorecard-modal"),
  selectStriker: document.querySelector("#select-striker"),
  selectNonStriker: document.querySelector("#select-nonstriker"),
  selectBowler: document.querySelector("#select-bowler"),
  strikerStats: document.querySelector("#striker-stats"),
  nonStrikerStats: document.querySelector("#nonstriker-stats"),
  bowlerStats: document.querySelector("#bowler-stats"),
  modalBattingTbody: document.querySelector("#modal-batting-tbody"),
  modalBowlingTbody: document.querySelector("#modal-bowling-tbody"),
  modalScorecardTitle: document.querySelector("#modal-scorecard-title"),
  modalScorecardSubtitle: document.querySelector("#modal-scorecard-subtitle"),
  modalBattingHeader: document.querySelector("#modal-batting-header"),
  modalBowlingHeader: document.querySelector("#modal-bowling-header"),
  btnConfigurePlayersA: document.querySelector("#btn-configure-players-a"),
  btnConfigurePlayersB: document.querySelector("#btn-configure-players-b"),
  btnLiveConfigurePlayersA: document.querySelector("#btn-live-configure-players-a"),
  btnLiveConfigurePlayersB: document.querySelector("#btn-live-configure-players-b"),
  btnStrikerCard: document.querySelector("#btn-striker-card"),
  btnNonStrikerCard: document.querySelector("#btn-nonstriker-card"),
  liveCardStrikerContent: document.querySelector("#live-card-striker-content"),
  liveCardNonStrikerContent: document.querySelector("#live-card-nonstriker-content"),
  btnModeSimple: document.querySelector("#btn-mode-simple"),
  btnModeAdvanced: document.querySelector("#btn-mode-advanced"),
  btnTModeSimple: document.querySelector("#btn-tmode-simple"),
  btnTModeAdvanced: document.querySelector("#btn-tmode-advanced"),
  liveBattersPanel: document.querySelector("#live-batters-panel"),
  squadModal: document.querySelector("#squad-modal"),
  closeSquadModal: document.querySelector("#close-squad-modal"),
  modalSquadTitle: document.querySelector("#modal-squad-title"),
  modalSquadTeamAHeader: document.querySelector("#modal-squad-teamA-header"),
  modalSquadTeamBHeader: document.querySelector("#modal-squad-teamB-header"),
  modalSquadTeamAInputs: document.querySelector("#modal-squad-teamA-inputs"),
  modalSquadTeamBInputs: document.querySelector("#modal-squad-teamB-inputs"),
  btnSquadPlay: document.querySelector("#btn-squad-play"),
  btnSquadTossTeamA: document.querySelector("#btn-squad-toss-teama"),
  btnSquadTossTeamB: document.querySelector("#btn-squad-toss-teamb"),
  tournamentPlayersCount: document.querySelector("#tournament-players-count"),
  liveBowlersTbody: document.querySelector("#live-bowlers-tbody"),
  liveBowlerSelectorRow: document.querySelector("#live-bowler-selector-row"),
  bowlerSelectModal: document.querySelector("#bowler-select-modal"),
  modalBowlersList: document.querySelector("#modal-bowlers-list"),
  btnChangeBowlerModal: document.querySelector("#btn-change-bowler-modal"),
  liveBatterSelectorRow: document.querySelector("#live-batter-selector-row"),
  btnChangeStriker: document.querySelector("#btn-change-striker"),
  btnChangeNonStriker: document.querySelector("#btn-change-nonstriker"),
  batterSelectModal: document.querySelector("#batter-select-modal"),
  modalBattersList: document.querySelector("#modal-batters-list"),
  modalBatterTitle: document.querySelector("#modal-batter-title"),
  modalBatterSubtitle: document.querySelector("#modal-batter-subtitle"),
  closeBowlerSelectModal: document.querySelector("#close-bowler-select-modal"),
  closeBatterSelectModal: document.querySelector("#close-batter-select-modal"),
};

const defaultState = {
  teamA: "Bengaluru Strikers",
  teamB: "Mumbai Royals",
  maxOvers: 20,
  playersTeamA: 11,
  playersTeamB: 11,
  day: 1,
  format: "T20",
  innings: 0,
  result: "",
  followOnAvailable: false,
  followOnEnforced: false,
  customTeamAPlayers: [],
  customTeamBPlayers: [],
  scoringMode: "simple",
  inningsData: [
    { team: 0, number: 1, runs: 0, wickets: 0, legalBalls: 0, balls: [], extras: { b: 0, lb: 0, wd: 0, nb: 0 }, declared: false, followOn: false, closed: false },
    { team: 1, number: 1, runs: 0, wickets: 0, legalBalls: 0, balls: [], extras: { b: 0, lb: 0, wd: 0, nb: 0 }, declared: false, followOn: false, closed: false },
  ],
  history: [],
  tournamentActive: false,
  tournamentName: "IPL 2026",
  tournamentCount: 1,
  tournamentTeams: [],
  tournamentFixtures: [],
  tournamentHistory: [],
  tournamentActiveFixtureIndex: -1,
  setupTournamentName: "IPL 2026",
  setupTeamCount: 4,
  setupOvers: 20,
  setupTeamNames: []
};

let state = loadState();

function hideAllPages() {
  if (els.sportsPage) els.sportsPage.classList.add("hidden");
  if (els.formatPage) els.formatPage.classList.add("hidden");
  if (els.cricketPage) els.cricketPage.classList.add("hidden");
  if (els.customSetup) els.customSetup.classList.add("hidden");
  if (els.tournamentSetup) els.tournamentSetup.classList.add("hidden");
  if (els.tournamentDashboard) els.tournamentDashboard.classList.add("hidden");
  if (els.tournamentChoice) els.tournamentChoice.classList.add("hidden");
  if (els.footballPage) els.footballPage.classList.add("hidden");
  if (els.tennisPage) els.tennisPage.classList.add("hidden");
}

function showSportsPage(fromHash = false) {
  if (!fromHash) window.location.hash = "#sports";
  hideAllPages();
  if (els.sportsPage) els.sportsPage.classList.remove("hidden");
  
  if (els.navSportsBtn) els.navSportsBtn.classList.add("hidden");
  if (els.navFormatsBtn) els.navFormatsBtn.classList.add("hidden");
  if (els.navLiveIndicator) els.navLiveIndicator.classList.add("hidden");
}

function showFormatPage(fromHash = false) {
  if (!fromHash) window.location.hash = "#formats";
  hideAllPages();
  if (els.formatPage) els.formatPage.classList.remove("hidden");
  
  if (els.navSportsBtn) els.navSportsBtn.classList.remove("hidden");
  if (els.navFormatsBtn) els.navFormatsBtn.classList.add("hidden");
  if (els.navLiveIndicator) els.navLiveIndicator.classList.add("hidden");
}

function showCricketPage(fromHash = false) {
  if (!fromHash) window.location.hash = "#match";
  hideAllPages();
  if (els.cricketPage) els.cricketPage.classList.remove("hidden");
  
  if (els.navSportsBtn) els.navSportsBtn.classList.remove("hidden");
  if (els.navFormatsBtn) els.navFormatsBtn.classList.remove("hidden");
  if (els.navLiveIndicator) els.navLiveIndicator.classList.remove("hidden");
}

function showFootballPage(fromHash = false) {
  if (!fromHash) window.location.hash = "#football";
  hideAllPages();
  if (els.footballPage) els.footballPage.classList.remove("hidden");
  
  if (els.navSportsBtn) els.navSportsBtn.classList.remove("hidden");
  if (els.navFormatsBtn) els.navFormatsBtn.classList.add("hidden");
  if (els.navLiveIndicator) els.navLiveIndicator.classList.add("hidden");
}

function showTournamentSetup(fromHash = false) {
  if (!fromHash) {
    window.location.hash = "#tsetup";
    state.setupTeamRosters = {};
    state.setupTeamNames = [];
    state.tournamentPlayersCount = undefined;
  }
  hideAllPages();
  if (els.tournamentSetup) els.tournamentSetup.classList.remove("hidden");
  syncScoringModeUI();

  if (els.navSportsBtn) els.navSportsBtn.classList.remove("hidden");
  if (els.navFormatsBtn) els.navFormatsBtn.classList.remove("hidden");
  if (els.navLiveIndicator) els.navLiveIndicator.classList.add("hidden");

  if (els.tournamentNameInput) {
    els.tournamentNameInput.value = state.setupTournamentName || "IPL 2026";
  }
  if (els.tournamentTeamCount) {
    els.tournamentTeamCount.value = state.setupTeamCount || 4;
  }
  if (els.tournamentOvers) {
    els.tournamentOvers.value = state.setupOvers || 20;
  }
  if (els.tournamentPlayersCount) {
    els.tournamentPlayersCount.value = "";
  }
  renderTournamentTeamInputs();
}

function showTournamentDashboard(fromHash = false) {
  if (!fromHash) window.location.hash = "#tdashboard";
  hideAllPages();
  if (els.tournamentDashboard) els.tournamentDashboard.classList.remove("hidden");

  if (els.navSportsBtn) els.navSportsBtn.classList.remove("hidden");
  if (els.navFormatsBtn) els.navFormatsBtn.classList.remove("hidden");
  if (els.navLiveIndicator) els.navLiveIndicator.classList.add("hidden");

  if (!fromHash) {
    if (els.tabPointsTable) els.tabPointsTable.classList.add("active");
    if (els.tabFixtures) els.tabFixtures.classList.remove("active");
    if (els.tabStats) els.tabStats.classList.remove("active");
    if (els.tabEdit) els.tabEdit.classList.remove("active");
    
    if (els.tableView) els.tableView.classList.remove("hidden");
    if (els.fixturesView) els.fixturesView.classList.add("hidden");
    if (els.statsView) els.statsView.classList.add("hidden");
    if (els.editTournamentView) els.editTournamentView.classList.add("hidden");
  }

  renderTournamentDashboard();
}

let selectedHistoryIndex = -1;

function showTournamentChoice(fromHash = false) {
  if (!fromHash) window.location.hash = "#tchoice";
  hideAllPages();
  if (els.tournamentChoice) els.tournamentChoice.classList.remove("hidden");

  if (els.navSportsBtn) els.navSportsBtn.classList.remove("hidden");
  if (els.navFormatsBtn) els.navFormatsBtn.classList.remove("hidden");
  if (els.navLiveIndicator) els.navLiveIndicator.classList.add("hidden");

  // Pre-select active tournament on fresh load
  if (!fromHash) {
    selectedHistoryIndex = state.activeTournamentHistoryIndex;
  }

  // Render Tournaments List
  if (els.pastTournamentsList) {
    els.pastTournamentsList.innerHTML = "";
    const history = state.tournamentHistory || [];
    
    if (history.length === 0) {
      els.pastTournamentsList.innerHTML = `
        <div style="text-align: center; color: var(--text-muted); font-size: 0.85rem; padding: 24px; border: 1px dashed rgba(255,255,255,0.08); border-radius: 12px;">
          No tournaments recorded yet.
        </div>
      `;
    } else {
      history.forEach((past, index) => {
        if (index === selectedHistoryIndex) {
          // Expanded accordion item
          const container = document.createElement("div");
          container.className = "fixture-btn expanded";
          container.style.padding = "0";
          container.style.display = "grid";
          container.style.borderColor = "var(--gold)";
          container.style.background = "rgba(245, 158, 11, 0.04)";
          container.style.overflow = "hidden";
          container.style.margin = "0";
          container.style.cursor = "default";
          
          container.innerHTML = `
            <!-- Header part to toggle collapse -->
            <div style="padding: 12px 16px; display: flex; justify-content: space-between; align-items: center; cursor: pointer; font-weight: 700; width: 100%;">
              <span>${past.name}</span>
              <span style="font-size: 0.75rem; color: var(--gold); font-weight: 600;">${past.teams.length} Teams</span>
            </div>
            <!-- Dropdown actions area -->
            <div style="padding: 0 16px 16px; display: grid; grid-template-columns: 1fr 1fr; gap: 12px; border-top: 1px solid rgba(255,255,255,0.06); margin-top: 4px;">
              <button class="start-custom btn-resume-acc" type="button" style="width: 100%; margin: 8px 0 0; background: var(--gold) !important; color: #000 !important; font-weight: 700; border-color: var(--gold) !important; padding: 8px 16px; font-size: 0.9rem; border-radius: 8px;">Resume</button>
              <button class="start-custom btn-delete-acc" type="button" style="width: 100%; margin: 8px 0 0; background: rgba(239, 68, 68, 0.1) !important; color: rgb(248, 113, 113) !important; border: 1px solid rgba(239, 68, 68, 0.2) !important; padding: 8px 16px; font-size: 0.9rem; border-radius: 8px; cursor: pointer;">Delete</button>
            </div>
          `;
          
          // Bind header click to collapse
          container.firstElementChild.addEventListener("click", () => {
            selectedHistoryIndex = -1;
            showTournamentChoice(true);
          });
          
          // Bind resume button click
          container.querySelector(".btn-resume-acc").addEventListener("click", () => {
            resumeSelectedTournament();
          });

          // Bind delete button click and hover effects
          const delBtn = container.querySelector(".btn-delete-acc");
          delBtn.addEventListener("mouseenter", () => {
            delBtn.style.background = "rgba(239, 68, 68, 0.2)";
          });
          delBtn.addEventListener("mouseleave", () => {
            delBtn.style.background = "rgba(239, 68, 68, 0.1)";
          });
          delBtn.addEventListener("click", () => {
            deleteTournamentAt(index);
          });
          
          els.pastTournamentsList.append(container);
        } else {
          // Collapsed normal button item
          const itemBtn = document.createElement("button");
          itemBtn.className = "fixture-btn";
          itemBtn.type = "button";
          itemBtn.style.textAlign = "left";
          itemBtn.style.padding = "12px 16px";
          itemBtn.style.display = "flex";
          itemBtn.style.justifyContent = "space-between";
          itemBtn.style.alignItems = "center";
          itemBtn.style.margin = "0";
          itemBtn.style.width = "100%";
          itemBtn.innerHTML = `
            <span style="font-weight: 700;">${past.name}</span>
            <span style="font-size: 0.75rem; color: var(--gold); font-weight: 600;">${past.teams.length} Teams</span>
          `;
          itemBtn.addEventListener("click", () => {
            selectedHistoryIndex = index;
            showTournamentChoice(true);
          });
          els.pastTournamentsList.append(itemBtn);
        }
      });
    }
  }
}

function resumeSelectedTournament() {
  if (selectedHistoryIndex === -1) return;
  const history = state.tournamentHistory || [];
  const selected = history[selectedHistoryIndex];
  if (!selected) return;

  state.activeTournamentHistoryIndex = selectedHistoryIndex;
  state.tournamentActive = true;
  state.tournamentName = selected.name;
  state.tournamentTeams = clone(selected.teams);
  state.tournamentFixtures = clone(selected.fixtures);
  state.maxOvers = selected.maxOvers || 20;
  state.tournamentPlayersCount = selected.tournamentPlayersCount || 11;
  state.isResumedTournament = true;

  saveState();
  showTournamentDashboard();
  showToast(`Resumed: ${selected.name}`);
}

function deleteTournamentAt(index) {
  if (!confirm("Are you sure you want to delete this tournament? This will permanently wipe all its matches and points table.")) {
    return;
  }
  
  state.tournamentHistory.splice(index, 1);
  
  if (state.activeTournamentHistoryIndex === index) {
    state.tournamentActive = false;
    state.activeTournamentHistoryIndex = -1;
    state.tournamentTeams = [];
    state.tournamentFixtures = [];
    state.tournamentActiveFixtureIndex = -1;
  } else if (state.activeTournamentHistoryIndex > index) {
    state.activeTournamentHistoryIndex--;
  }
  
  saveState();
  selectedHistoryIndex = -1;
  showTournamentChoice(true);
  showToast("Tournament deleted.");
}

function syncActiveTournamentToHistory() {
  if (state && state.tournamentActive && state.tournamentTeams && state.tournamentTeams.length > 0) {
    if (!state.tournamentHistory) state.tournamentHistory = [];
    
    let index = state.activeTournamentHistoryIndex;
    if (index === -1 || index === undefined) {
      index = state.tournamentHistory.findIndex(t => t.name === state.tournamentName);
    }
    
    const tournamentData = {
      id: index !== -1 ? (state.tournamentHistory[index].id || state.tournamentCount) : state.tournamentCount,
      name: state.tournamentName,
      teams: clone(state.tournamentTeams),
      fixtures: clone(state.tournamentFixtures),
      maxOvers: state.maxOvers || 20,
      tournamentPlayersCount: state.tournamentPlayersCount || 11
    };

    if (index !== -1 && index < state.tournamentHistory.length) {
      state.tournamentHistory[index] = tournamentData;
      state.activeTournamentHistoryIndex = index;
    } else {
      state.tournamentHistory.push(tournamentData);
      state.activeTournamentHistoryIndex = state.tournamentHistory.length - 1;
    }
  }
}

function archiveCurrentTournament() {
  syncActiveTournamentToHistory();
}

function navigateByHash(hash) {
  if (hash === "#match") {
    showCricketPage(true);
  } else if (hash.startsWith("#football")) {
    showFootballPage(true);
  } else if (hash.startsWith("#basketball")) {
    if (typeof window.showBasketballPage === "function") {
      window.showBasketballPage(true);
    }
  } else if (hash.startsWith("#tennis")) {
    if (typeof window.showTennisPage === "function") {
      window.showTennisPage(true);
    }
  } else if (hash === "#tdashboard" && state.tournamentActive) {
    showTournamentDashboard(true);
  } else if (hash === "#tsetup") {
    showTournamentSetup(true);
  } else if (hash === "#tchoice") {
    showTournamentChoice(true);
  } else if (hash === "#formats") {
    showFormatPage(true);
  } else {
    showSportsPage(true);
  }
}

const IPL_TEAM_NAMES = [
  "Mumbai Indians",
  "Chennai Super Kings",
  "Royal Challengers Bengaluru",
  "Kolkata Knight Riders",
  "Rajasthan Royals",
  "Gujarat Titans",
  "Delhi Capitals",
  "Lucknow Super Giants",
  "Punjab Kings",
  "Sunrisers Hyderabad"
];

function renderTournamentTeamInputs() {
  if (!els.tournamentTeamInputs) return;
  const count = Number(els.tournamentTeamCount.value) || 4;
  const playersCount = Number(els.tournamentPlayersCount.value) || 11;
  const isAdv = state.scoringMode === "advanced";
  
  els.tournamentTeamInputs.innerHTML = "";
  
  // Make sure setupTeamRosters is initialized
  if (!state.setupTeamRosters) state.setupTeamRosters = {};
  
  for (let i = 0; i < count; i++) {
    const savedName = state.setupTeamNames && state.setupTeamNames[i] !== undefined ? state.setupTeamNames[i] : (IPL_TEAM_NAMES[i] || 'Team ' + (i+1));
    const abbr = getTeamAbbr(savedName);
    
    if (!state.setupTeamRosters[i]) state.setupTeamRosters[i] = [];
    while (state.setupTeamRosters[i].length < playersCount) {
      state.setupTeamRosters[i].push("");
    }
    
    const card = document.createElement("div");
    card.className = "team-setup-card";
    card.style.background = "rgba(255,255,255,0.015)";
    card.style.border = "1px solid rgba(255,255,255,0.08)";
    card.style.borderRadius = "12px";
    card.style.padding = "16px";
    card.style.display = "flex";
    card.style.flexDirection = "column";
    card.style.gap = "12px";
    
    let playersHTML = "";
    if (isAdv) {
      const roster = state.setupTeamRosters[i];
      playersHTML = `
        <div class="team-players-setup-section" style="display: flex; flex-direction: column; gap: 8px; border-top: 1px solid rgba(255,255,255,0.06); padding-top: 12px;">
          <span style="font-size: 0.8rem; color: var(--gold); font-weight: 700; font-family: inherit;">Players Roster:</span>
          <div class="team-players-list-inputs" style="display: grid; gap: 8px; max-height: 180px; overflow-y: auto; padding: 10px; background: rgba(212, 175, 55, 0.03); border: 1px solid rgba(212, 175, 55, 0.2); border-radius: 8px;">
      `;
      for (let p = 0; p < roster.length; p++) {
        playersHTML += `
          <div style="display: flex; align-items: center; gap: 6px;">
            <span style="font-size: 0.75rem; color: var(--text-muted); min-width: 20px; font-family: inherit;">#${p + 1}</span>
            <input type="text" class="tournament-player-name-input" data-team-index="${i}" data-player-index="${p}" value="${roster[p]}" style="flex: 1; padding: 6px 10px; font-size: 0.8rem; background: rgba(0,0,0,0.3); border: 1px solid rgba(255,255,255,0.08); border-radius: 6px; color: var(--ink); font-family: inherit;" />
          </div>
        `;
      }
      playersHTML += `
          </div>
          <button class="add-player-row-btn" data-team-index="${i}" type="button" style="background: rgba(212,175,55,0.08); border: 1px solid rgba(212,175,55,0.3); color: var(--gold); font-weight: 600; font-size: 0.75rem; padding: 4px 10px; border-radius: 6px; cursor: pointer; align-self: flex-start; font-family: inherit;">+ Add Player</button>
        </div>
      `;
    }
    
    card.innerHTML = `
      <label style="font-weight: 700; font-size: 0.9rem; font-family: inherit;">
        Team ${i + 1} Name
        <input type="text" class="tournament-team-name-input" data-team-index="${i}" value="${savedName}" style="margin-top: 6px; padding: 6px 12px; font-size: 0.85rem; background: rgba(255,255,255,0.02); border: 1px solid rgba(255,255,255,0.08); border-radius: 6px; color: var(--ink); width: 100%; font-family: inherit;" />
      </label>
      ${playersHTML}
    `;
    els.tournamentTeamInputs.append(card);
  }
  
  // Bind listeners
  els.tournamentTeamInputs.querySelectorAll(".tournament-team-name-input").forEach((input) => {
    input.addEventListener("input", (e) => {
      const idx = Number(e.target.dataset.teamIndex);
      if (!state.setupTeamNames) state.setupTeamNames = [];
      state.setupTeamNames[idx] = e.target.value;
      saveState();
    });
  });
  
  if (isAdv) {
    els.tournamentTeamInputs.querySelectorAll(".tournament-player-name-input").forEach((input) => {
      input.addEventListener("input", (e) => {
        const teamIdx = Number(e.target.dataset.teamIndex);
        const playerIdx = Number(e.target.dataset.playerIndex);
        state.setupTeamRosters[teamIdx][playerIdx] = e.target.value;
        saveState();
      });
    });
    
    els.tournamentTeamInputs.querySelectorAll(".add-player-row-btn").forEach((btn) => {
      btn.addEventListener("click", (e) => {
        const teamIdx = Number(btn.dataset.teamIndex);
        if (!state.setupTeamRosters[teamIdx]) state.setupTeamRosters[teamIdx] = [];
        const newIdx = state.setupTeamRosters[teamIdx].length;
        if (newIdx >= 25) {
          showToast("Maximum 25 players allowed in squad roster.");
          return;
        }
        state.setupTeamRosters[teamIdx].push("");
        saveState();
        renderTournamentTeamInputs();
      });
    });
  }
}

function generateTournament() {
  const playersCountVal = els.tournamentPlayersCount ? els.tournamentPlayersCount.value.trim() : "";
  if (!playersCountVal) {
    showToast("Please enter the number of players.");
    return;
  }
  const playersCount = Number(playersCountVal);
  if (isNaN(playersCount) || playersCount < 2 || playersCount > 11) {
    showToast("Players per team must be a number between 2 and 11.");
    return;
  }

  const isAdv = state.scoringMode === "advanced";
  const count = Number(els.tournamentTeamCount.value) || 4;

  // Validate unique team names
  const teamNames = new Set();
  for (let i = 0; i < count; i++) {
    const teamInput = document.querySelector(`.tournament-team-name-input[data-team-index="${i}"]`);
    const teamName = teamInput ? teamInput.value.trim() || `Team ${i + 1}` : `Team ${i + 1}`;
    const teamKey = teamName.toLowerCase();
    if (teamNames.has(teamKey)) {
      showToast(`Team names must be unique. Duplicate found: "${teamName}"`);
      return;
    }
    teamNames.add(teamKey);
  }

  if (isAdv) {
    const allNames = new Set();
    
    for (let i = 0; i < count; i++) {
      const teamInput = document.querySelector(`.tournament-team-name-input[data-team-index="${i}"]`);
      const teamName = teamInput ? teamInput.value.trim() || `Team ${i + 1}` : `Team ${i + 1}`;
      
      const playerInputs = document.querySelectorAll(`.tournament-player-name-input[data-team-index="${i}"]`);
      if (playerInputs.length < playersCount) {
        showToast(`Roster size is short! Please add players to: ${teamName}`);
        return;
      }
      
      for (let p = 0; p < playerInputs.length; p++) {
        const val = playerInputs[p].value.trim();
        if (!val || val === "") {
          showToast("Please fill all the player names first.");
          return;
        }
        
        const nameKey = val.toLowerCase();
        if (allNames.has(nameKey)) {
          showToast(`All player names must be unique. Duplicate found: "${val}"`);
          return;
        }
        allNames.add(nameKey);
      }
    }
  }

  const inputs = document.querySelectorAll(".tournament-team-name-input");
  const teams = [];
  inputs.forEach((input, index) => {
    const name = input.value.trim() || `Team ${index + 1}`;
    let players = [];
    if (isAdv) {
      const playerInputs = document.querySelectorAll(`.tournament-player-name-input[data-team-index="${index}"]`);
      players = Array.from(playerInputs).map(inp => inp.value.trim());
    }
    teams.push({
      id: index,
      name: name,
      played: 0,
      won: 0,
      lost: 0,
      points: 0,
      runsScored: 0,
      oversFaced: 0,
      runsConceded: 0,
      oversBowled: 0,
      nrr: 0.00,
      players: players
    });
  });

  // Generate Fixtures using Round-Robin (Circle Method)
  const fixtures = [];
  const teamCount = teams.length;
  const tempTeams = [...teams];
  let fixtureId = 0;

  // Round Robin Schedule Generation
  for (let round = 0; round < teamCount - 1; round++) {
    for (let i = 0; i < teamCount / 2; i++) {
      const teamA = tempTeams[i];
      const teamB = tempTeams[teamCount - 1 - i];
      if (teamA && teamB) {
        fixtures.push({
          id: fixtureId++,
          teamA: teamA.name,
          teamB: teamB.name,
          teamAId: teamA.id,
          teamBId: teamB.id,
          status: "scheduled", // scheduled, live, completed
          scoreA: "",
          scoreB: "",
          winner: "",
          matchState: null // to store full state of that match
        });
      }
    }
    // Rotate teams (keep index 0 fixed)
    tempTeams.splice(1, 0, tempTeams.pop());
  }

  state.tournamentActive = true;
  const serialNo = state.tournamentCount || 1;
  const nameVal = els.tournamentNameInput ? els.tournamentNameInput.value.trim() || "IPL 2026" : "IPL 2026";
  state.tournamentName = `#${serialNo} ${nameVal}`;
  state.tournamentTeams = teams;
  state.tournamentFixtures = fixtures;
  state.tournamentActiveFixtureIndex = -1;
  state.maxOvers = Number(els.tournamentOvers.value) || 20;
  state.tournamentPlayersCount = Math.max(2, Math.min(11, Number(els.tournamentPlayersCount.value) || 11));
  state.isResumedTournament = false;

  if (!state.tournamentHistory) state.tournamentHistory = [];
  state.tournamentHistory.push({
    id: serialNo,
    name: state.tournamentName,
    teams: clone(state.tournamentTeams),
    fixtures: clone(state.tournamentFixtures),
    maxOvers: state.maxOvers,
    tournamentPlayersCount: state.tournamentPlayersCount
  });
  state.activeTournamentHistoryIndex = state.tournamentHistory.length - 1;

  saveState();
  showTournamentDashboard();
}

function renderTournamentDashboard() {
  if (!state.tournamentActive) return;

  if (els.tournamentDashboardTitle) {
    els.tournamentDashboardTitle.textContent = state.tournamentName || "IPL Tournament";
  }

  if (els.resetTournamentBtn) {
    els.resetTournamentBtn.style.display = state.isResumedTournament ? "none" : "";
  }

  // Render Points Table (sorted by Points, then NRR)
  if (els.pointsTableBody) {
    els.pointsTableBody.innerHTML = "";
    
    // Sort teams clone
    const sortedTeams = [...state.tournamentTeams].sort((a, b) => {
      if (b.points !== a.points) {
        return b.points - a.points;
      }
      return b.nrr - a.nrr;
    });

    sortedTeams.forEach((team, index) => {
      const row = document.createElement("tr");
      row.style.borderBottom = "1px solid rgba(255, 255, 255, 0.05)";
      row.innerHTML = `
        <td style="padding: 12px 16px; font-weight: 700; color: ${index < 4 ? 'var(--gold)' : 'var(--text-muted)'}">${index + 1}</td>
        <td style="padding: 12px 16px; font-weight: 700;">${team.name}</td>
        <td style="padding: 12px 16px; text-align: center;">${team.played}</td>
        <td style="padding: 12px 16px; text-align: center; color: var(--field);">${team.won}</td>
        <td style="padding: 12px 16px; text-align: center; color: var(--red);">${team.lost}</td>
        <td style="padding: 12px 16px; text-align: center; font-weight: 600;">${team.nrr > 0 ? '+' : ''}${team.nrr.toFixed(3)}</td>
        <td style="padding: 12px 16px; text-align: center; font-weight: 800; color: var(--gold);">${team.points}</td>
      `;
      els.pointsTableBody.append(row);
    });
  }

  // Render Fixtures List
  if (els.fixturesList) {
    els.fixturesList.innerHTML = "";
    
    state.tournamentFixtures.forEach((fixture, index) => {
      const card = document.createElement("div");
      card.className = "fixture-card";
      
      let statusLabel = fixture.status;
      let scoreDisplayA = fixture.scoreA || "-";
      let scoreDisplayB = fixture.scoreB || "-";
      let btnLabel = "Track Match";
      let btnDisabled = false;

      let actionButtonsHTML = `
        <button class="fixture-btn" type="button" data-fixture-index="${index}" ${btnDisabled ? 'disabled' : ''}>${btnLabel}</button>
      `;

      if (fixture.status === "completed") {
        actionButtonsHTML = `
          <button class="fixture-btn" type="button" disabled style="background: rgba(255,255,255,0.05); color: var(--text-muted); cursor: not-allowed; border-color: rgba(255,255,255,0.05);">Completed</button>
          <button class="fixture-btn btn-view-completed-scorecard" type="button" data-fixture-index="${index}" style="margin-top: 8px; background: rgba(212,175,55,0.1); border: 1.5px solid rgba(212,175,55,0.3); color: var(--gold);">View Scorecard</button>
        `;
      }

      card.innerHTML = `
        <div class="fixture-header">
          <span>MATCH ${index + 1}</span>
          <span class="fixture-status ${fixture.status}">${statusLabel}</span>
        </div>
        <div class="fixture-teams">
          <div class="fixture-team-row">
            <span class="fixture-team-name">${fixture.teamA}</span>
            <span class="fixture-team-score">${scoreDisplayA}</span>
          </div>
          <div class="fixture-team-row">
            <span class="fixture-team-name">${fixture.teamB}</span>
            <span class="fixture-team-score">${scoreDisplayB}</span>
          </div>
        </div>
        <div style="display: flex; flex-direction: column; gap: 4px;">
          ${actionButtonsHTML}
        </div>
      `;
      els.fixturesList.append(card);
    });

  }
}

function renderTournamentStats() {
  if (!state.tournamentActive) return;

  const teamStats = {};
  state.tournamentTeams.forEach((t) => {
    teamStats[t.name] = {
      name: t.name,
      runs: 0,
      wicketsTaken: 0,
      fours: 0,
      sixes: 0
    };
  });

  let highestInnings = { runs: -1, wickets: -1, team: "", opponent: "" };
  let lowestInnings = { runs: Infinity, wickets: Infinity, team: "", opponent: "" };
  let completedCount = 0;

  const playerStats = {};

  state.tournamentFixtures.forEach((fixture) => {
    if (fixture.status === "completed" && fixture.matchState && fixture.matchState.inningsData) {
      completedCount++;
      const first = fixture.matchState.inningsData[0];
      const second = fixture.matchState.inningsData[1];

      // Innings 1
      if (first) {
        let inn1Fours = 0;
        let inn1Sixes = 0;
        (first.balls || []).forEach((b) => {
          if (b.runs === 4 && b.legal && !b.extra) inn1Fours++;
          if (b.runs === 6 && b.legal && !b.extra) inn1Sixes++;
        });

        if (teamStats[fixture.teamA]) {
          teamStats[fixture.teamA].runs += first.runs;
          teamStats[fixture.teamA].fours += inn1Fours;
          teamStats[fixture.teamA].sixes += inn1Sixes;
        }
        if (teamStats[fixture.teamB]) {
          teamStats[fixture.teamB].wicketsTaken += first.wickets;
        }

        if (first.runs > highestInnings.runs) {
          highestInnings = { runs: first.runs, wickets: first.wickets, team: fixture.teamA, opponent: fixture.teamB };
        }
        if (first.runs < lowestInnings.runs) {
          lowestInnings = { runs: first.runs, wickets: first.wickets, team: fixture.teamA, opponent: fixture.teamB };
        }
      }

      // Innings 2
      if (second) {
        let inn2Fours = 0;
        let inn2Sixes = 0;
        (second.balls || []).forEach((b) => {
          if (b.runs === 4 && b.legal && !b.extra) inn2Fours++;
          if (b.runs === 6 && b.legal && !b.extra) inn2Sixes++;
        });

        if (teamStats[fixture.teamB]) {
          teamStats[fixture.teamB].runs += second.runs;
          teamStats[fixture.teamB].fours += inn2Fours;
          teamStats[fixture.teamB].sixes += inn2Sixes;
        }
        if (teamStats[fixture.teamA]) {
          teamStats[fixture.teamA].wicketsTaken += second.wickets;
        }

        if (second.runs > highestInnings.runs) {
          highestInnings = { runs: second.runs, wickets: second.wickets, team: fixture.teamB, opponent: fixture.teamA };
        }
        if (second.runs < lowestInnings.runs) {
          lowestInnings = { runs: second.runs, wickets: second.wickets, team: fixture.teamB, opponent: fixture.teamA };
        }
      }

      // Determine all players who played in this match
      const playersInThisMatch = {}; // name -> teamName
      
      if (first) {
        const batTeam = first.team === 0 ? fixture.teamA : fixture.teamB;
        const bowlTeam = first.team === 0 ? fixture.teamB : fixture.teamA;
        if (first.batters) {
          first.batters.forEach(b => {
            if (b.name) playersInThisMatch[b.name] = batTeam;
          });
        }
        if (first.bowlers) {
          first.bowlers.forEach(b => {
            if (b.name) playersInThisMatch[b.name] = bowlTeam;
          });
        }
      }
      
      if (second) {
        const batTeam = second.team === 0 ? fixture.teamA : fixture.teamB;
        const bowlTeam = second.team === 0 ? fixture.teamB : fixture.teamA;
        if (second.batters) {
          second.batters.forEach(b => {
            if (b.name) playersInThisMatch[b.name] = batTeam;
          });
        }
        if (second.bowlers) {
          second.bowlers.forEach(b => {
            if (b.name) playersInThisMatch[b.name] = bowlTeam;
          });
        }
      }

      // Record participation and aggregate player stats
      Object.entries(playersInThisMatch).forEach(([pName, pTeam]) => {
        if (!playerStats[pName]) {
          playerStats[pName] = {
            name: pName,
            team: pTeam,
            runs: 0,
            balls: 0,
            fours: 0,
            sixes: 0,
            wickets: 0,
            ballsBowled: 0,
            runsConceded: 0,
            matchesPlayed: 0
          };
        }
        playerStats[pName].matchesPlayed += 1;
      });

      // Sum batting data
      if (first && first.batters) {
        first.batters.forEach(b => {
          if (!b.name || !playerStats[b.name]) return;
          playerStats[b.name].runs += b.runs || 0;
          playerStats[b.name].balls += b.balls || 0;
          playerStats[b.name].fours += b.fours || 0;
          playerStats[b.name].sixes += b.sixes || 0;
        });
      }
      if (second && second.batters) {
        second.batters.forEach(b => {
          if (!b.name || !playerStats[b.name]) return;
          playerStats[b.name].runs += b.runs || 0;
          playerStats[b.name].balls += b.balls || 0;
          playerStats[b.name].fours += b.fours || 0;
          playerStats[b.name].sixes += b.sixes || 0;
        });
      }

      // Sum bowling data
      if (first && first.bowlers) {
        first.bowlers.forEach(b => {
          if (!b.name || !playerStats[b.name]) return;
          playerStats[b.name].wickets += b.wickets || 0;
          playerStats[b.name].ballsBowled += b.ballsBowled || 0;
          playerStats[b.name].runsConceded += b.runsConceded || 0;
        });
      }
      if (second && second.bowlers) {
        second.bowlers.forEach(b => {
          if (!b.name || !playerStats[b.name]) return;
          playerStats[b.name].wickets += b.wickets || 0;
          playerStats[b.name].ballsBowled += b.ballsBowled || 0;
          playerStats[b.name].runsConceded += b.runsConceded || 0;
        });
      }
    }
  });

  const sortedBattersRuns = Object.values(playerStats)
    .filter(p => p.runs > 0)
    .sort((a, b) => b.runs - a.runs);
    
  const sortedBowlersWkts = Object.values(playerStats)
    .filter(p => p.wickets > 0)
    .sort((a, b) => b.wickets - a.wickets);

  // For Strike Rate, filter minimum 10 runs to prevent 1-ball 6-run anomalies
  const sortedBattersSR = Object.values(playerStats)
    .filter(p => p.runs >= 10 && p.balls > 0)
    .sort((a, b) => {
      const srA = (a.runs / a.balls) * 100;
      const srB = (b.runs / b.balls) * 100;
      return srB - srA;
    });

  const sortedBattersFours = Object.values(playerStats)
    .filter(p => p.fours > 0)
    .sort((a, b) => b.fours - a.fours);

  const sortedBattersSixes = Object.values(playerStats)
    .filter(p => p.sixes > 0)
    .sort((a, b) => b.sixes - a.sixes);

  // Populate Orange Cap (Runs)
  if (els.statsOrangeCap) {
    els.statsOrangeCap.innerHTML = "";
    if (completedCount === 0 || sortedBattersRuns.length === 0) {
      els.statsOrangeCap.innerHTML = `<div style="text-align: center; color: var(--text-muted); font-size: 0.85rem; padding: 12px;">No runs recorded yet.</div>`;
    } else {
      const topBatters = sortedBattersRuns.slice(0, 5);
      topBatters.forEach((item, index) => {
        const row = document.createElement("div");
        row.style.display = "flex";
        row.style.justifyContent = "space-between";
        row.style.alignItems = "center";
        row.style.padding = "10px 14px";
        row.style.borderRadius = "8px";
        row.style.background = index === 0 ? "rgba(245,158,11,0.06)" : "rgba(255,255,255,0.01)";
        row.style.border = index === 0 ? "1px solid var(--gold)" : "1px solid rgba(255,255,255,0.04)";
        row.innerHTML = `
          <div style="display: flex; align-items: center; gap: 10px; flex: 1; min-width: 0;">
            <span style="font-weight: 700; color: ${index === 0 ? 'var(--gold)' : 'var(--text-muted)'}; min-width: 16px;">#${index + 1}</span>
            <div style="min-width: 0; overflow: hidden; text-overflow: ellipsis; white-space: nowrap;">
              <strong style="color: var(--ink); display: block; font-size: 0.9rem; white-space: nowrap; overflow: hidden; text-overflow: ellipsis;">${item.name}</strong>
              <span style="font-size: 0.75rem; color: var(--text-muted); display: block; white-space: nowrap; overflow: hidden; text-overflow: ellipsis;">${item.team}</span>
            </div>
          </div>
          <div style="display: flex; gap: 16px; text-align: right; font-size: 0.82rem; font-weight: 600; align-items: center;">
            <div style="width: 40px;">
              <span style="display: block; font-size: 0.65rem; color: var(--text-muted); text-transform: uppercase; font-weight: 500; letter-spacing: 0.5px;">Mat</span>
              <span style="color: var(--ink);">${item.matchesPlayed}</span>
            </div>
            <div style="width: 60px;">
              <span style="display: block; font-size: 0.65rem; color: var(--text-muted); text-transform: uppercase; font-weight: 500; letter-spacing: 0.5px;">Runs</span>
              <strong style="color: ${index === 0 ? 'var(--gold)' : 'var(--ink)'}; font-size: 0.95rem;">${item.runs}</strong>
            </div>
          </div>
        `;
        els.statsOrangeCap.append(row);
      });
    }
  }

  // Populate Purple Cap (Wickets)
  if (els.statsPurpleCap) {
    els.statsPurpleCap.innerHTML = "";
    if (completedCount === 0 || sortedBowlersWkts.length === 0) {
      els.statsPurpleCap.innerHTML = `<div style="text-align: center; color: var(--text-muted); font-size: 0.85rem; padding: 12px;">No wickets recorded yet.</div>`;
    } else {
      const topBowlers = sortedBowlersWkts.slice(0, 5);
      topBowlers.forEach((item, index) => {
        const row = document.createElement("div");
        row.style.display = "flex";
        row.style.justifyContent = "space-between";
        row.style.alignItems = "center";
        row.style.padding = "10px 14px";
        row.style.borderRadius = "8px";
        row.style.background = index === 0 ? "rgba(167,139,250,0.06)" : "rgba(255,255,255,0.01)";
        row.style.border = index === 0 ? "1px solid #a78bfa" : "1px solid rgba(255,255,255,0.04)";
        row.innerHTML = `
          <div style="display: flex; align-items: center; gap: 10px; flex: 1; min-width: 0;">
            <span style="font-weight: 700; color: ${index === 0 ? '#a78bfa' : 'var(--text-muted)'}; min-width: 16px;">#${index + 1}</span>
            <div style="min-width: 0; overflow: hidden; text-overflow: ellipsis; white-space: nowrap;">
              <strong style="color: var(--ink); display: block; font-size: 0.9rem; white-space: nowrap; overflow: hidden; text-overflow: ellipsis;">${item.name}</strong>
              <span style="font-size: 0.75rem; color: var(--text-muted); display: block; white-space: nowrap; overflow: hidden; text-overflow: ellipsis;">${item.team}</span>
            </div>
          </div>
          <div style="display: flex; gap: 16px; text-align: right; font-size: 0.82rem; font-weight: 600; align-items: center;">
            <div style="width: 40px;">
              <span style="display: block; font-size: 0.65rem; color: var(--text-muted); text-transform: uppercase; font-weight: 500; letter-spacing: 0.5px;">Mat</span>
              <span style="color: var(--ink);">${item.matchesPlayed}</span>
            </div>
            <div style="width: 60px;">
              <span style="display: block; font-size: 0.65rem; color: var(--text-muted); text-transform: uppercase; font-weight: 500; letter-spacing: 0.5px;">Wkts</span>
              <strong style="color: ${index === 0 ? '#a78bfa' : 'var(--ink)'}; font-size: 0.95rem;">${item.wickets}</strong>
            </div>
          </div>
        `;
        els.statsPurpleCap.append(row);
      });
    }
  }

  // Populate Strike Rate Leaders
  const statsStrikeRate = document.querySelector("#stats-strike-rate");
  if (statsStrikeRate) {
    statsStrikeRate.innerHTML = "";
    if (completedCount === 0 || sortedBattersSR.length === 0) {
      statsStrikeRate.innerHTML = `<div style="text-align: center; color: var(--text-muted); font-size: 0.85rem; padding: 12px;">No strike rate data (min 10 runs).</div>`;
    } else {
      const topSR = sortedBattersSR.slice(0, 5);
      topSR.forEach((item, index) => {
        const srVal = item.balls ? ((item.runs / item.balls) * 100).toFixed(2) : "0.00";
        const row = document.createElement("div");
        row.style.display = "flex";
        row.style.justifyContent = "space-between";
        row.style.alignItems = "center";
        row.style.padding = "10px 14px";
        row.style.borderRadius = "8px";
        row.style.background = index === 0 ? "rgba(52,211,153,0.06)" : "rgba(255,255,255,0.01)";
        row.style.border = index === 0 ? "1px solid #34d399" : "1px solid rgba(255,255,255,0.04)";
        row.innerHTML = `
          <div style="display: flex; align-items: center; gap: 10px; flex: 1; min-width: 0;">
            <span style="font-weight: 700; color: ${index === 0 ? '#34d399' : 'var(--text-muted)'}; min-width: 16px;">#${index + 1}</span>
            <div style="min-width: 0; overflow: hidden; text-overflow: ellipsis; white-space: nowrap;">
              <strong style="color: var(--ink); display: block; font-size: 0.9rem; white-space: nowrap; overflow: hidden; text-overflow: ellipsis;">${item.name}</strong>
              <span style="font-size: 0.75rem; color: var(--text-muted); display: block; white-space: nowrap; overflow: hidden; text-overflow: ellipsis;">${item.team} (${item.runs} runs)</span>
            </div>
          </div>
          <div style="display: flex; gap: 16px; text-align: right; font-size: 0.82rem; font-weight: 600; align-items: center;">
            <div style="width: 40px;">
              <span style="display: block; font-size: 0.65rem; color: var(--text-muted); text-transform: uppercase; font-weight: 500; letter-spacing: 0.5px;">Mat</span>
              <span style="color: var(--ink);">${item.matchesPlayed}</span>
            </div>
            <div style="width: 65px;">
              <span style="display: block; font-size: 0.65rem; color: var(--text-muted); text-transform: uppercase; font-weight: 500; letter-spacing: 0.5px;">SR</span>
              <strong style="color: ${index === 0 ? '#34d399' : 'var(--ink)'}; font-size: 0.95rem;">${srVal}</strong>
            </div>
          </div>
        `;
        statsStrikeRate.append(row);
      });
    }
  }

  // Populate Fours Leaders
  const statsFours = document.querySelector("#stats-fours");
  if (statsFours) {
    statsFours.innerHTML = "";
    if (completedCount === 0 || sortedBattersFours.length === 0) {
      statsFours.innerHTML = `<div style="text-align: center; color: var(--text-muted); font-size: 0.85rem; padding: 12px;">No fours recorded yet.</div>`;
    } else {
      const topFours = sortedBattersFours.slice(0, 5);
      topFours.forEach((item, index) => {
        const row = document.createElement("div");
        row.style.display = "flex";
        row.style.justifyContent = "space-between";
        row.style.alignItems = "center";
        row.style.padding = "10px 14px";
        row.style.borderRadius = "8px";
        row.style.background = index === 0 ? "rgba(96,165,250,0.06)" : "rgba(255,255,255,0.01)";
        row.style.border = index === 0 ? "1px solid #60a5fa" : "1px solid rgba(255,255,255,0.04)";
        row.innerHTML = `
          <div style="display: flex; align-items: center; gap: 10px; flex: 1; min-width: 0;">
            <span style="font-weight: 700; color: ${index === 0 ? '#60a5fa' : 'var(--text-muted)'}; min-width: 16px;">#${index + 1}</span>
            <div style="min-width: 0; overflow: hidden; text-overflow: ellipsis; white-space: nowrap;">
              <strong style="color: var(--ink); display: block; font-size: 0.9rem; white-space: nowrap; overflow: hidden; text-overflow: ellipsis;">${item.name}</strong>
              <span style="font-size: 0.75rem; color: var(--text-muted); display: block; white-space: nowrap; overflow: hidden; text-overflow: ellipsis;">${item.team}</span>
            </div>
          </div>
          <div style="display: flex; gap: 16px; text-align: right; font-size: 0.82rem; font-weight: 600; align-items: center;">
            <div style="width: 40px;">
              <span style="display: block; font-size: 0.65rem; color: var(--text-muted); text-transform: uppercase; font-weight: 500; letter-spacing: 0.5px;">Mat</span>
              <span style="color: var(--ink);">${item.matchesPlayed}</span>
            </div>
            <div style="width: 60px;">
              <span style="display: block; font-size: 0.65rem; color: var(--text-muted); text-transform: uppercase; font-weight: 500; letter-spacing: 0.5px;">Fours</span>
              <strong style="color: ${index === 0 ? '#60a5fa' : 'var(--ink)'}; font-size: 0.95rem;">${item.fours}</strong>
            </div>
          </div>
        `;
        statsFours.append(row);
      });
    }
  }

  // Populate Sixes Leaders
  const statsSixes = document.querySelector("#stats-sixes");
  if (statsSixes) {
    statsSixes.innerHTML = "";
    if (completedCount === 0 || sortedBattersSixes.length === 0) {
      statsSixes.innerHTML = `<div style="text-align: center; color: var(--text-muted); font-size: 0.85rem; padding: 12px;">No sixes recorded yet.</div>`;
    } else {
      const topSixes = sortedBattersSixes.slice(0, 5);
      topSixes.forEach((item, index) => {
        const row = document.createElement("div");
        row.style.display = "flex";
        row.style.justifyContent = "space-between";
        row.style.alignItems = "center";
        row.style.padding = "10px 14px";
        row.style.borderRadius = "8px";
        row.style.background = index === 0 ? "rgba(245,158,11,0.06)" : "rgba(255,255,255,0.01)";
        row.style.border = index === 0 ? "1px solid #f59e0b" : "1px solid rgba(255,255,255,0.04)";
        row.innerHTML = `
          <div style="display: flex; align-items: center; gap: 10px; flex: 1; min-width: 0;">
            <span style="font-weight: 700; color: ${index === 0 ? '#f59e0b' : 'var(--text-muted)'}; min-width: 16px;">#${index + 1}</span>
            <div style="min-width: 0; overflow: hidden; text-overflow: ellipsis; white-space: nowrap;">
              <strong style="color: var(--ink); display: block; font-size: 0.9rem; white-space: nowrap; overflow: hidden; text-overflow: ellipsis;">${item.name}</strong>
              <span style="font-size: 0.75rem; color: var(--text-muted); display: block; white-space: nowrap; overflow: hidden; text-overflow: ellipsis;">${item.team}</span>
            </div>
          </div>
          <div style="display: flex; gap: 16px; text-align: right; font-size: 0.82rem; font-weight: 600; align-items: center;">
            <div style="width: 40px;">
              <span style="display: block; font-size: 0.65rem; color: var(--text-muted); text-transform: uppercase; font-weight: 500; letter-spacing: 0.5px;">Mat</span>
              <span style="color: var(--ink);">${item.matchesPlayed}</span>
            </div>
            <div style="width: 60px;">
              <span style="display: block; font-size: 0.65rem; color: var(--text-muted); text-transform: uppercase; font-weight: 500; letter-spacing: 0.5px;">Sixes</span>
              <strong style="color: ${index === 0 ? '#f59e0b' : 'var(--ink)'}; font-size: 0.95rem;">${item.sixes}</strong>
            </div>
          </div>
        `;
        statsSixes.append(row);
      });
    }
  }

  // Populate Innings Records
  if (els.statsRecords) {
    els.statsRecords.innerHTML = "";
    if (completedCount === 0) {
      els.statsRecords.innerHTML = `<div style="text-align: center; color: var(--text-muted); font-size: 0.85rem; padding: 12px;">No matches completed yet.</div>`;
    } else {
      els.statsRecords.innerHTML = `
        <div style="display: flex; justify-content: space-between; align-items: center; padding: 12px 16px; background: rgba(255,255,255,0.01); border: 1px solid rgba(255,255,255,0.04); border-radius: 12px; margin-bottom: 12px;">
          <div>
            <div style="font-size: 0.75rem; color: var(--text-muted); margin-bottom: 2px;">HIGHEST TEAM SCORE</div>
            <strong style="color: var(--gold); font-size: 1.1rem;">${highestInnings.runs}/${highestInnings.wickets}</strong>
            <span style="font-size: 0.8rem; color: var(--text-muted);">by ${highestInnings.team}</span>
          </div>
          <div style="font-size: 0.8rem; color: var(--text-muted); text-align: right;">vs ${highestInnings.opponent}</div>
        </div>
        
        <div style="display: flex; justify-content: space-between; align-items: center; padding: 12px 16px; background: rgba(255,255,255,0.01); border: 1px solid rgba(255,255,255,0.04); border-radius: 12px;">
          <div>
            <div style="font-size: 0.75rem; color: var(--text-muted); margin-bottom: 2px;">LOWEST TEAM SCORE</div>
            <strong style="color: rgb(248, 113, 113); font-size: 1.1rem;">${lowestInnings.runs}/${lowestInnings.wickets}</strong>
            <span style="font-size: 0.8rem; color: var(--text-muted);">by ${lowestInnings.team}</span>
          </div>
          <div style="font-size: 0.8rem; color: var(--text-muted); text-align: right;">vs ${lowestInnings.opponent}</div>
        </div>
      `;
    }
  }

  // Render Player of the Series card
  if (els.tournamentSeriesMomContainer) {
    const isAdv = state.scoringMode === "advanced";
    const totalFixtures = (state.tournamentFixtures || []).length;
    const isAllCompleted = totalFixtures > 0 && completedCount === totalFixtures;
    
    if (!isAdv) {
      els.tournamentSeriesMomContainer.innerHTML = `
        <div style="text-align: center; color: var(--text-muted); font-size: 0.85rem; padding: 12px; font-style: italic;">
          Simple Mode: Player of the Series is only tracked in Advanced Mode.
        </div>
      `;
    } else if (!isAllCompleted) {
      els.tournamentSeriesMomContainer.innerHTML = `
        <div style="text-align: center; color: var(--text-muted); font-size: 0.85rem; padding: 12px; font-style: italic; display: flex; flex-direction: column; align-items: center; gap: 8px;">
          <span style="font-size: 1.5rem;">🔒</span>
          <span>Player of the Series will be shown after all matches are over.</span>
        </div>
      `;
    } else {
      const seriesPlayers = compileTournamentSeriesStats();
      const scoredSeriesPlayers = seriesPlayers
        .map(p => calculateSeriesImpactScore(p))
        .sort((a, b) => b.total - a.total);
        
      if (scoredSeriesPlayers.length > 0) {
        const maxScore = scoredSeriesPlayers[0].total;
        const winners = scoredSeriesPlayers.filter(sp => sp.total === maxScore);
        const runnersUp = scoredSeriesPlayers.filter(sp => sp.total < maxScore).slice(0, 5);
        
        const winnersHtml = winners.map(w => {
          const p = w.player;
          const batAvg = p.dismissals > 0 ? (p.runs / p.dismissals).toFixed(1) : p.runs.toFixed(1);
          const sr = p.balls > 0 ? ((p.runs / p.balls) * 100).toFixed(1) : "0.0";
          const econ = p.ballsBowled > 0 ? (p.runsConceded / (p.ballsBowled / 6)).toFixed(2) : "0.00";
          const bowlAvg = p.wickets > 0 ? (p.runsConceded / p.wickets).toFixed(1) : "-";
          
          const highlights = [];
          if (p.runs > 0) highlights.push(`${p.runs} Runs @ ${batAvg} (SR ${sr})`);
          if (p.wickets > 0) highlights.push(`${p.wickets} Wkts @ ${bowlAvg} (Econ ${econ})`);
          const fielding = p.catches + p.stumpings + p.runOuts;
          if (fielding > 0) highlights.push(`${fielding} Dismissals`);
          if (p.momAwards > 0) highlights.push(`${p.momAwards} MoM`);
          
          return `
            <div style="background: rgba(255, 215, 0, 0.08); border: 1.5px solid rgba(255, 215, 0, 0.3); border-radius: 16px; padding: 20px; position: relative; overflow: hidden; display: grid; gap: 12px; margin-bottom: 8px;">
              <div style="position: absolute; right: -15px; top: -15px; opacity: 0.12; font-size: 6rem; pointer-events: none;">🏆</div>
              <div style="display: flex; align-items: center; gap: 16px;">
                <div style="font-size: 2.2rem; background: rgba(255, 215, 0, 0.15); width: 56px; height: 56px; display: flex; align-items: center; justify-content: center; border-radius: 50%; border: 2px solid var(--gold);">👑</div>
                <div>
                  <h3 style="margin: 0; color: var(--gold); font-size: 1.3rem; font-weight: 800; text-transform: uppercase; letter-spacing: 0.5px;">Player of the Series</h3>
                  <strong style="font-size: 1.5rem; color: var(--ink);">${p.name}</strong>
                  <span style="font-size: 0.8rem; color: var(--text-muted); display: block;">${p.teamName}</span>
                </div>
              </div>
              
              <div style="display: flex; flex-wrap: wrap; gap: 8px; margin-top: 4px;">
                ${highlights.map(hl => `
                  <div style="background: rgba(212, 175, 55, 0.1); border: 1px solid rgba(212, 175, 55, 0.25); border-radius: 8px; padding: 6px 12px; font-size: 0.85rem; font-weight: 700; color: var(--gold);">${hl}</div>
                `).join("")}
              </div>
            </div>
          `;
        }).join("");
        
        let runnersUpHtml = "";
        if (runnersUp.length > 0) {
          const listItems = runnersUp.map((ru, idx) => {
            const p = ru.player;
            const statsParts = [];
            if (p.runs > 0) statsParts.push(`${p.runs} Runs`);
            if (p.wickets > 0) statsParts.push(`${p.wickets} Wkts`);
            const f = p.catches + p.stumpings + p.runOuts;
            if (f > 0) statsParts.push(`${f} Dismissals`);
            const statsSummary = statsParts.join(" • ") || "No contributions";
            
            return `
              <div style="padding: 10px 0; border-bottom: 1px solid rgba(255,255,255,0.06); display: flex; justify-content: space-between; align-items: center;">
                <div>
                  <strong style="color: var(--ink); font-size: 0.95rem;">#${idx + 2} ${p.name}</strong>
                  <span style="font-size: 0.75rem; color: var(--text-muted); display: block;">${p.teamName} • ${statsSummary}</span>
                </div>
                <div style="text-align: right;">
                  <strong style="color: var(--gold); font-size: 1rem;">${ru.total} pts</strong>
                  <span style="font-size: 0.7rem; color: var(--text-muted); display: block;">${p.momAwards} MoM</span>
                </div>
              </div>
            `;
          }).join("");
          
          runnersUpHtml = `
            <details style="background: rgba(255,255,255,0.01); border: 1px solid rgba(255,255,255,0.06); border-radius: 16px; padding: 16px; margin-top: 12px;">
              <summary style="font-size: 0.9rem; font-weight: 700; color: var(--ink); cursor: pointer; outline: none; user-select: none;">
                📊 Candidate Leaderboard (Top Contenders)
              </summary>
              <div style="margin-top: 12px; display: grid;">
                ${listItems}
              </div>
            </details>
          `;
        }
        
        els.tournamentSeriesMomContainer.innerHTML = winnersHtml + runnersUpHtml;
      } else {
        els.tournamentSeriesMomContainer.innerHTML = `<div style="text-align: center; color: var(--text-muted); font-size: 0.85rem; padding: 12px;">No stats available.</div>`;
      }
    }
  }
}



function renderTournamentEditView() {
  if (!els.editTournamentTeamsContainer) return;
  const isAdv = state.scoringMode === "advanced";
  els.editTournamentTeamsContainer.innerHTML = "";
  
  if (els.editTournamentOvers) {
    els.editTournamentOvers.value = state.maxOvers || 20;
  }
  if (els.editTournamentPlayersCount) {
    els.editTournamentPlayersCount.value = state.tournamentPlayersCount || 11;
  }
  
  state.tournamentTeams.forEach((team, teamIdx) => {
    const savedName = team.name;
    const card = document.createElement("div");
    card.className = "team-setup-card";
    card.style.background = "rgba(255,255,255,0.015)";
    card.style.border = "1px solid rgba(255,255,255,0.08)";
    card.style.borderRadius = "12px";
    card.style.padding = "16px";
    card.style.display = "flex";
    card.style.flexDirection = "column";
    card.style.gap = "12px";
    
    let playersHTML = "";
    if (isAdv) {
      const roster = team.players || [];
      const minPlayers = state.tournamentPlayersCount || 11;
      while (roster.length < minPlayers) {
        roster.push("");
      }
      playersHTML = `
        <div class="team-players-setup-section" style="display: flex; flex-direction: column; gap: 8px; border-top: 1px solid rgba(255,255,255,0.06); padding-top: 12px;">
          <span style="font-size: 0.8rem; color: var(--gold); font-weight: 700; font-family: inherit;">Players Roster:</span>
          <div class="team-players-list-inputs-edit" data-team-index="${teamIdx}" style="display: grid; gap: 8px; max-height: 180px; overflow-y: auto; padding: 10px; background: rgba(212, 175, 55, 0.03); border: 1px solid rgba(212, 175, 55, 0.2); border-radius: 8px;">
      `;
      for (let p = 0; p < roster.length; p++) {
        playersHTML += `
          <div style="display: flex; align-items: center; gap: 6px;">
            <span style="font-size: 0.75rem; color: var(--text-muted); min-width: 20px; font-family: inherit;">#${p + 1}</span>
            <input type="text" class="edit-tournament-player-input" data-team-index="${teamIdx}" data-player-index="${p}" value="${roster[p]}" style="flex: 1; padding: 6px 10px; font-size: 0.8rem; background: rgba(0,0,0,0.3); border: 1px solid rgba(255,255,255,0.08); border-radius: 6px; color: var(--ink); font-family: inherit;" />
          </div>
        `;
      }
      playersHTML += `
          </div>
          <button class="edit-add-player-row-btn" data-team-index="${teamIdx}" type="button" style="background: rgba(212,175,55,0.08); border: 1px solid rgba(212,175,55,0.3); color: var(--gold); font-weight: 600; font-size: 0.75rem; padding: 4px 10px; border-radius: 6px; cursor: pointer; align-self: flex-start; font-family: inherit;">+ Add Player</button>
        </div>
      `;
    }
    
    card.innerHTML = `
      <label style="font-weight: 700; font-size: 0.9rem; font-family: inherit;">
        Team ${teamIdx + 1} Name
        <input type="text" class="edit-tournament-team-name-input" data-team-index="${teamIdx}" value="${savedName}" style="margin-top: 6px; padding: 6px 12px; font-size: 0.85rem; background: rgba(255,255,255,0.02); border: 1px solid rgba(255,255,255,0.08); border-radius: 6px; color: var(--ink); width: 100%; font-family: inherit;" />
      </label>
      ${playersHTML}
    `;
    els.editTournamentTeamsContainer.append(card);
  });
  
  // Bind roster editing listeners to update in-memory
  els.editTournamentTeamsContainer.querySelectorAll(".edit-tournament-team-name-input").forEach((input) => {
    input.addEventListener("input", (e) => {
      const teamIdx = Number(e.target.dataset.teamIndex);
      state.tournamentTeams[teamIdx].name = e.target.value;
    });
  });
  
  if (isAdv) {
    els.editTournamentTeamsContainer.querySelectorAll(".edit-tournament-player-input").forEach((input) => {
      input.addEventListener("input", (e) => {
        const teamIdx = Number(e.target.dataset.teamIndex);
        const playerIdx = Number(e.target.dataset.playerIndex);
        state.tournamentTeams[teamIdx].players[playerIdx] = e.target.value;
      });
    });
    
    els.editTournamentTeamsContainer.querySelectorAll(".edit-add-player-row-btn").forEach((btn) => {
      btn.addEventListener("click", (e) => {
        const teamIdx = Number(btn.dataset.teamIndex);
        const currentTeam = state.tournamentTeams[teamIdx];
        if (!currentTeam.players) currentTeam.players = [];
        const newIdx = currentTeam.players.length;
        if (newIdx >= 25) {
          showToast("Maximum 25 players allowed in squad roster.");
          return;
        }
        currentTeam.players.push("");
        renderTournamentEditView();
      });
    });
  }
}

function renderTournamentInfoView() {
  const grid = document.querySelector("#info-teams-grid");
  if (!grid) return;
  grid.innerHTML = "";
  
  if (!state.tournamentTeams || state.tournamentTeams.length === 0) {
    grid.innerHTML = `<div style="text-align: center; color: var(--text-muted); font-size: 0.9rem; padding: 24px; grid-column: 1 / -1;">No teams configured yet.</div>`;
    return;
  }
  
  const isAdv = state.scoringMode === "advanced";
  
  state.tournamentTeams.forEach((team) => {
    const card = document.createElement("div");
    card.style.background = "rgba(255,255,255,0.02)";
    card.style.border = "1px solid rgba(255,255,255,0.08)";
    card.style.borderRadius = "16px";
    card.style.padding = "20px";
    card.style.display = "grid";
    card.style.gap = "12px";
    
    let playersContent = "";
    if (isAdv) {
      const roster = team.players || [];
      if (roster.length === 0) {
        playersContent = `<div style="color: var(--text-muted); font-size: 0.82rem; font-style: italic;">No players registered.</div>`;
      } else {
        playersContent = `
          <div style="display: flex; flex-direction: column; gap: 8px; max-height: 250px; overflow-y: auto; padding: 8px; background: rgba(255,255,255,0.01); border-radius: 8px; border: 1px solid rgba(255,255,255,0.04);">
        `;
        roster.forEach((player, index) => {
          playersContent += `
            <div style="display: flex; align-items: center; gap: 10px; padding: 6px 10px; background: rgba(255,255,255,0.02); border-radius: 6px;">
              <span style="font-size: 0.75rem; font-weight: 700; color: var(--gold); min-width: 16px;">#${index + 1}</span>
              <span style="font-size: 0.85rem; color: var(--ink); font-weight: 500;">${player || '<span style="color: var(--text-muted); font-style: italic;">Unnamed Player</span>'}</span>
            </div>
          `;
        });
        playersContent += `</div>`;
      }
    } else {
      playersContent = `<div style="color: var(--text-muted); font-size: 0.82rem; font-style: italic;">Simple Mode: No rosters enabled.</div>`;
    }
    
    const pCount = isAdv ? (team.players || []).length : (state.tournamentPlayersCount || 11);
    const pLabel = pCount === 1 ? "Player" : "Players";
    
    card.innerHTML = `
      <h3 style="margin: 0; font-size: 1.1rem; color: var(--gold); display: flex; align-items: center; justify-content: space-between; gap: 12px;">
        <span>🛡️ ${team.name}</span>
        <span style="font-size: 0.8rem; background: rgba(212,175,55,0.1); border: 1px solid rgba(212,175,55,0.25); color: var(--gold); padding: 4px 10px; border-radius: 6px; font-weight: 600;">${pCount} ${pLabel}</span>
      </h3>
      ${playersContent}
    `;
    grid.append(card);
  });
}

if (els.editTournamentPlayersCount) {
  els.editTournamentPlayersCount.addEventListener("input", () => {
    validatePlayersInput(els.editTournamentPlayersCount, document.querySelector("#error-edit-tournament-players-count"));
    const valStr = els.editTournamentPlayersCount.value.trim();
    if (valStr === "") return;
    
    const val = Math.max(2, Math.min(11, Number(valStr) || 11));
    state.tournamentPlayersCount = val;
    
    state.tournamentTeams.forEach(team => {
      if (!team.players) team.players = [];
      if (team.players.length < val) {
        while (team.players.length < val) {
          team.players.push("");
        }
      } else if (team.players.length > val) {
        const isAllEmpty = team.players.every(name => !name || name.trim() === "");
        if (isAllEmpty) {
          team.players.splice(val);
        }
      }
    });
    
    renderTournamentEditView();
  });
}

if (els.btnSaveTournamentEdits) {
  els.btnSaveTournamentEdits.addEventListener("click", () => {
    const newOvers = Number(els.editTournamentOvers.value) || 20;
    const newPlayersCount = els.editTournamentPlayersCount ? Math.max(2, Math.min(11, Number(els.editTournamentPlayersCount.value) || 11)) : 11;
    const isAdv = state.scoringMode === "advanced";
    
    // Validate unique team names
    const teamNames = new Set();
    const tempTeamNames = [];
    for (let i = 0; i < state.tournamentTeams.length; i++) {
      const teamInput = els.editTournamentTeamsContainer.querySelector(`.edit-tournament-team-name-input[data-team-index="${i}"]`);
      const teamName = teamInput ? teamInput.value.trim() : state.tournamentTeams[i].name.trim();
      if (!teamName || teamName === "") {
        showToast("Team name cannot be blank.");
        return;
      }
      const teamKey = teamName.toLowerCase();
      if (teamNames.has(teamKey)) {
        showToast(`Team names must be unique. Duplicate found: "${teamName}"`);
        return;
      }
      teamNames.add(teamKey);
      tempTeamNames.push(teamName);
    }
    
    // Validate roster size matches target players count
    if (isAdv) {
      const shortTeams = [];
      for (let i = 0; i < state.tournamentTeams.length; i++) {
        const rosterInputs = els.editTournamentTeamsContainer.querySelectorAll(`.edit-tournament-player-input[data-team-index="${i}"]`);
        if (rosterInputs.length < newPlayersCount) {
          const diff = newPlayersCount - rosterInputs.length;
          shortTeams.push(`${tempTeamNames[i]} (add ${diff})`);
        }
      }
      if (shortTeams.length > 0) {
        showToast(`Roster size is short! Please add players to: ${shortTeams.join(", ")}`);
        return;
      }
    }
    
    // Validate unique player names
    const tempRosters = [];
    if (isAdv) {
      const allNames = new Set();
      for (let i = 0; i < state.tournamentTeams.length; i++) {
        const rosterInputs = els.editTournamentTeamsContainer.querySelectorAll(`.edit-tournament-player-input[data-team-index="${i}"]`);
        const roster = [];
        for (let p = 0; p < rosterInputs.length; p++) {
          const val = rosterInputs[p].value.trim();
          if (!val || val === "") {
            showToast("Please fill all the player names first.");
            return;
          }
          const nameKey = val.toLowerCase();
          if (allNames.has(nameKey)) {
            showToast(`All player names must be unique. Duplicate found: "${val}"`);
            return;
          }
          allNames.add(nameKey);
          roster.push(val);
        }
        tempRosters.push(roster);
      }
    }
    
    // Apply edits
    state.maxOvers = newOvers;
    state.setupOvers = newOvers;
    state.tournamentPlayersCount = newPlayersCount;
    
    // Helper to adjust player counts in match structures dynamically
    function adjustMatchPlayersCount(s, countVal) {
      if (!s) return;
      s.playersTeamA = countVal;
      s.playersTeamB = countVal;
      if (s.inningsData) {
        s.inningsData.forEach(innings => {
          const batTeamName = teamName(innings.team, s);
          const bowlTeamName = teamName(1 - innings.team, s);
          const batAbbr = getTeamAbbr(batTeamName);
          const bowlAbbr = getTeamAbbr(bowlTeamName);
          
          if (!innings.batters) innings.batters = [];
          if (innings.batters.length > countVal) {
            innings.batters = innings.batters.slice(0, countVal);
          } else {
            const savedList = innings.team === 0 ? s.customTeamAPlayers : s.customTeamBPlayers;
            while (innings.batters.length < countVal) {
              const i = innings.batters.length;
              const name = savedList && savedList[i] !== undefined && savedList[i] !== "" ? savedList[i] : `${batAbbr} Batter ${i + 1}`;
              innings.batters.push({
                name: name,
                runs: 0,
                balls: 0,
                fours: 0,
                sixes: 0,
                outInfo: "Not Out"
              });
            }
          }

          if (!innings.bowlers) innings.bowlers = [];
          if (innings.bowlers.length > countVal) {
            innings.bowlers = innings.bowlers.slice(0, countVal);
          } else {
            const savedList = innings.team === 0 ? s.customTeamBPlayers : s.customTeamAPlayers;
            while (innings.bowlers.length < countVal) {
              const i = innings.bowlers.length;
              const name = savedList && savedList[i] !== undefined && savedList[i] !== "" ? savedList[i] : `${bowlAbbr} Bowler ${i + 1}`;
              innings.bowlers.push({
                name: name,
                ballsBowled: 0,
                maidens: 0,
                runsConceded: 0,
                wickets: 0
              });
            }
          }
        });
      }
    }

    // Apply adjustments to active live state and all fixture states
    adjustMatchPlayersCount(state, newPlayersCount);
    state.tournamentFixtures.forEach((fix) => {
      if (fix.matchState) {
        adjustMatchPlayersCount(fix.matchState, newPlayersCount);
      }
    });

    for (let i = 0; i < state.tournamentTeams.length; i++) {
      state.tournamentTeams[i].name = tempTeamNames[i];
      if (isAdv) {
        state.tournamentTeams[i].players = tempRosters[i];
      }
    }
    
    // Update team names in all tournament fixtures based on teamAId / teamBId
    state.tournamentFixtures.forEach((fix) => {
      fix.teamA = state.tournamentTeams[fix.teamAId].name;
      fix.teamB = state.tournamentTeams[fix.teamBId].name;
    });
    
    // Update defaults in setup name mapping
    state.setupTeamNames = tempTeamNames;
    if (isAdv) {
      state.setupTeamRosters = {};
      tempRosters.forEach((roster, i) => {
        state.setupTeamRosters[i] = roster;
      });
    }
    
    // Update history
    if (state.tournamentHistory && state.activeTournamentHistoryIndex !== -1) {
      const hist = state.tournamentHistory[state.activeTournamentHistoryIndex];
      if (hist) {
        hist.teams = clone(state.tournamentTeams);
        hist.fixtures = clone(state.tournamentFixtures);
        hist.maxOvers = state.maxOvers;
        hist.tournamentPlayersCount = state.tournamentPlayersCount;
      }
    }
    
    saveState();
    render();
    showToast("Tournament updated successfully!");
    
    // Navigate back to points table tab
    if (els.tabPointsTable) els.tabPointsTable.click();
  });
}

function loadTournamentFixture(index, batFirst = 0, playersCount) {
  const fixture = state.tournamentFixtures[index];
  if (!fixture) return;

  state.tournamentActiveFixtureIndex = index;
  
  if (fixture.matchState) {
    // Resume match
    state = { ...state, ...fixture.matchState };
  } else {
    // Initialize new match
    const actualPlayersCount = playersCount || state.tournamentPlayersCount || 11;
    const isAdv = state.scoringMode === "advanced";
    const initialStriker = isAdv ? -1 : 0;
    const initialNonStriker = isAdv ? -1 : 1;
    const newMatchSetup = {
      teamA: fixture.teamA,
      teamB: fixture.teamB,
      playersTeamA: actualPlayersCount,
      playersTeamB: actualPlayersCount,
      format: "T20",
      scoringMode: state.scoringMode || "simple",
      innings: 0,
      result: "",
      inningsData: [
        { team: batFirst, number: 1, runs: 0, wickets: 0, legalBalls: 0, balls: [], extras: { b: 0, lb: 0, wd: 0, nb: 0 }, declared: false, followOn: false, closed: false, batters: [], bowlers: [], currentStrikerIndex: initialStriker, currentNonStrikerIndex: initialNonStriker, slot1BatterIndex: initialStriker, slot2BatterIndex: initialNonStriker, currentBowlerIndex: isAdv ? -1 : 0 },
        { team: 1 - batFirst, number: 1, runs: 0, wickets: 0, legalBalls: 0, balls: [], extras: { b: 0, lb: 0, wd: 0, nb: 0 }, declared: false, followOn: false, closed: false, batters: [], bowlers: [], currentStrikerIndex: initialStriker, currentNonStrikerIndex: initialNonStriker, slot1BatterIndex: initialStriker, slot2BatterIndex: initialNonStriker, currentBowlerIndex: isAdv ? -1 : 0 },
      ],
      history: []
    };
    state = { ...state, ...newMatchSetup };
    fixture.status = "live";
  }

  saveState();
  render();
  showCricketPage();
  showToast(`Live tracking: ${fixture.teamA} vs ${fixture.teamB}`);

  if (state.scoringMode === "advanced" && state.inningsData[state.innings].currentStrikerIndex === -1) {
    promptNewBatter("striker");
  }
}

function submitTournamentMatchResult() {
  const index = state.tournamentActiveFixtureIndex;
  const fixture = state.tournamentFixtures[index];
  if (!fixture) return;

  const first = state.inningsData[0];
  const second = state.inningsData[1];

  // Map scores correctly to teamA (index 0) and teamB (index 1)
  const scoreTeamA = first.team === 0 ? first : second;
  const scoreTeamB = first.team === 1 ? first : second;

  fixture.scoreA = `${scoreTeamA.runs}/${scoreTeamA.wickets} (${oversFromBalls(scoreTeamA.legalBalls)} ov)`;
  fixture.scoreB = `${scoreTeamB.runs}/${scoreTeamB.wickets} (${oversFromBalls(scoreTeamB.legalBalls)} ov)`;
  fixture.status = "completed";
  
  fixture.matchState = {
    innings: state.innings,
    inningsData: clone(state.inningsData),
    result: state.result || winnerText()
  };

  // Determine winner and calculate team stats for NRR
  let winnerId = null;
  let loserId = null;
  let isTie = false;

  if (second.runs >= target()) {
    // Chasing team (second) wins
    if (second.team === 0) {
      winnerId = fixture.teamAId;
      loserId = fixture.teamBId;
    } else {
      winnerId = fixture.teamBId;
      loserId = fixture.teamAId;
    }
  } else if (second.runs < first.runs) {
    // Defending team (first) wins
    if (first.team === 0) {
      winnerId = fixture.teamAId;
      loserId = fixture.teamBId;
    } else {
      winnerId = fixture.teamBId;
      loserId = fixture.teamAId;
    }
  } else {
    isTie = true;
  }

  // Update Team stats in points table
  const teamAObj = state.tournamentTeams.find(t => t.id === fixture.teamAId);
  const teamBObj = state.tournamentTeams.find(t => t.id === fixture.teamBId);

  if (teamAObj && teamBObj) {
    teamAObj.played += 1;
    teamBObj.played += 1;

    if (isTie) {
      teamAObj.points += 1;
      teamBObj.points += 1;
    } else {
      if (winnerId === fixture.teamAId) {
        teamAObj.won += 1;
        teamAObj.points += 2;
        teamBObj.lost += 1;
      } else {
        teamBObj.won += 1;
        teamBObj.points += 2;
        teamAObj.lost += 1;
      }
    }

    // NRR Math:
    // NRR = (Total Runs Scored / Total Overs Faced) - (Total Runs Conceded / Total Overs Bowled)
    // If a team is all out, we use their maximum overs (state.maxOvers) as overs faced/bowled!
    
    // Team A (index 0) stats
    const teamAOversFaced = scoreTeamA.wickets >= maxWicketsForTeam(0) ? state.maxOvers : (scoreTeamA.legalBalls / 6);
    teamAObj.runsScored += scoreTeamA.runs;
    teamAObj.oversFaced += teamAOversFaced;
    teamBObj.runsConceded += scoreTeamA.runs;
    teamBObj.oversBowled += teamAOversFaced;

    // Team B (index 1) stats
    const teamBOversFaced = scoreTeamB.wickets >= maxWicketsForTeam(1) ? state.maxOvers : (scoreTeamB.legalBalls / 6);
    teamBObj.runsScored += scoreTeamB.runs;
    teamBObj.oversFaced += teamBOversFaced;
    teamAObj.runsConceded += scoreTeamB.runs;
    teamAObj.oversBowled += teamBOversFaced;

    // Recompute NRR
    if (teamAObj.oversFaced > 0 && teamAObj.oversBowled > 0) {
      teamAObj.nrr = (teamAObj.runsScored / teamAObj.oversFaced) - (teamAObj.runsConceded / teamAObj.oversBowled);
    }
    if (teamBObj.oversFaced > 0 && teamBObj.oversBowled > 0) {
      teamBObj.nrr = (teamBObj.runsScored / teamBObj.oversFaced) - (teamBObj.runsConceded / teamBObj.oversBowled);
    }
  }

  // Update in history list to prevent desync
  if (state.activeTournamentHistoryIndex !== -1 && state.tournamentHistory[state.activeTournamentHistoryIndex]) {
    const activePast = state.tournamentHistory[state.activeTournamentHistoryIndex];
    activePast.teams = clone(state.tournamentTeams);
    activePast.fixtures = clone(state.tournamentFixtures);
  }

  // Deactivate active fixture index and reset score state
  state.tournamentActiveFixtureIndex = -1;
  
  // Re-save state
  saveState();
  
  // Show Tournament dashboard
  showTournamentDashboard();
  showToast("Match result submitted to Tournament.");
}

function maxWicketsForTeam(teamIndex, s = state) {
  const players = teamIndex === 0 ? (s.playersTeamA || 11) : (s.playersTeamB || 11);
  return players - 1;
}

function startFormat(format, overs, setup = {}) {
  const keepSetup = {
    teamA: setup.teamA || state.teamA,
    teamB: setup.teamB || state.teamB,
    playersTeamA: setup.playersTeamA || state.playersTeamA || 11,
    playersTeamB: setup.playersTeamB || state.playersTeamB || 11,
    scoringMode: state.scoringMode,
    customTeamAPlayers: state.customTeamAPlayers,
    customTeamBPlayers: state.customTeamBPlayers,
  };
  state = {
    ...clone(defaultState),
    ...keepSetup,
    format,
    maxOvers: overs,
    day: 1,
  };
  if (format === "Test" && !overs) {
    state.maxOvers = 90;
  }
  if (state.scoringMode === "advanced") {
    setTimeout(() => {
      promptNewBatter("striker");
    }, 100);
  }
}

function clone(value) {
  return JSON.parse(JSON.stringify(value));
}

function loadState() {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    const parsed = stored ? { ...clone(defaultState), ...JSON.parse(stored) } : clone(defaultState);
    return normalizeState(parsed);
  } catch (e) {
    console.error("Failed to load state, reverting to defaultState:", e);
    return clone(defaultState);
  }
}

function createInnings(team, number, followOn = false, scoringMode = (state ? state.scoringMode : "simple")) {
  const isAdv = scoringMode === "advanced";
  return {
    team,
    number,
    runs: 0,
    wickets: 0,
    legalBalls: 0,
    balls: [],
    extras: { b: 0, lb: 0, wd: 0, nb: 0 },
    declared: false,
    followOn,
    closed: false,
    batters: [],
    bowlers: [],
    currentStrikerIndex: isAdv ? -1 : 0,
    currentNonStrikerIndex: isAdv ? -1 : 1,
    slot1BatterIndex: isAdv ? -1 : 0,
    slot2BatterIndex: isAdv ? -1 : 1,
    currentBowlerIndex: isAdv ? -1 : 0
  };
}

function getTeamAbbr(name) {
  if (!name) return "TEAM";
  const words = name.trim().split(/\s+/);
  if (words.length > 1) {
    return words.map(w => w[0]).join("").toUpperCase().slice(0, 3);
  }
  return name.slice(0, 3).toUpperCase();
}

function ensurePlayerStats(innings, s = state) {
  if (!innings) return;
  if (!innings.batters) innings.batters = [];
  if (!innings.bowlers) innings.bowlers = [];
  
  const batTeamName = teamName(innings.team, s);
  const bowlTeamName = teamName(1 - innings.team, s);
  const batAbbr = getTeamAbbr(batTeamName);
  const bowlAbbr = getTeamAbbr(bowlTeamName);
  
  const batPlayerCount = innings.team === 0 ? (s.playersTeamA || 11) : (s.playersTeamB || 11);
  const bowlPlayerCount = innings.team === 0 ? (s.playersTeamB || 11) : (s.playersTeamA || 11);

  // Initialize batters if empty
  if (innings.batters.length === 0) {
    const savedList = innings.team === 0 ? s.customTeamAPlayers : s.customTeamBPlayers;
    for (let i = 0; i < batPlayerCount; i++) {
      const name = savedList && savedList[i] !== undefined && savedList[i] !== "" ? savedList[i] : `${batAbbr} Batter ${i + 1}`;
      innings.batters.push({
        name: name,
        runs: 0,
        balls: 0,
        fours: 0,
        sixes: 0,
        outInfo: "Not Out"
      });
    }
  }

  // Initialize bowlers if empty
  if (innings.bowlers.length === 0) {
    const savedList = innings.team === 0 ? s.customTeamBPlayers : s.customTeamAPlayers;
    for (let i = 0; i < bowlPlayerCount; i++) {
      const name = savedList && savedList[i] !== undefined && savedList[i] !== "" ? savedList[i] : `${bowlAbbr} Bowler ${i + 1}`;
      innings.bowlers.push({
        name: name,
        ballsBowled: 0,
        maidens: 0,
        runsConceded: 0,
        wickets: 0
      });
    }
  }

  // Initialize indices if missing
  const isAdv = s && s.scoringMode === "advanced";
  if (innings.currentStrikerIndex === undefined || innings.currentStrikerIndex === null) {
    innings.currentStrikerIndex = isAdv ? -1 : 0;
  }
  if (innings.currentNonStrikerIndex === undefined || innings.currentNonStrikerIndex === null) {
    innings.currentNonStrikerIndex = isAdv ? -1 : (innings.batters.length > 1 ? 1 : 0);
  }
  if (innings.slot1BatterIndex === undefined || innings.slot1BatterIndex === null) {
    innings.slot1BatterIndex = innings.currentStrikerIndex;
  }
  if (innings.slot2BatterIndex === undefined || innings.slot2BatterIndex === null) {
    innings.slot2BatterIndex = innings.currentNonStrikerIndex;
  }
  if (innings.currentBowlerIndex === undefined || innings.currentBowlerIndex === null) {
    innings.currentBowlerIndex = isAdv ? -1 : 0;
  }
}

function normalizeState(nextState) {
  nextState.inningsData = (nextState.inningsData || []).map((innings, index) => {
    const updated = {
      ...createInnings(index % 2, Math.floor(index / 2) + 1, false, nextState.scoringMode),
      ...innings,
      team: Number.isInteger(innings.team) ? innings.team : index % 2,
      number: innings.number || Math.floor(index / 2) + 1,
      extras: { b: 0, lb: 0, wd: 0, nb: 0, ...(innings.extras || {}) },
      closed: Boolean(innings.closed || innings.declared || innings.wickets >= maxWicketsForTeam(index % 2, nextState)),
    };
    ensurePlayerStats(updated, nextState);
    return updated;
  });
  if (!nextState.inningsData.length) {
    nextState.inningsData = clone(defaultState.inningsData);
  }
  nextState.innings = Math.max(0, Math.min(nextState.inningsData.length - 1, Number(nextState.innings) || 0));
  nextState.activeTournamentHistoryIndex = Math.max(-1, Math.min((nextState.tournamentHistory || []).length - 1, Number(nextState.activeTournamentHistoryIndex) || -1));
  nextState.tournamentActiveFixtureIndex = Math.max(-1, Math.min((nextState.tournamentFixtures || []).length - 1, Number(nextState.tournamentActiveFixtureIndex) || -1));
  nextState.day = Math.max(1, Math.min(5, Number(nextState.day) || 1));
  nextState.result = nextState.result || "";
  nextState.tournamentHistory = nextState.tournamentHistory || [];
  nextState.tournamentCount = nextState.tournamentCount || 1;
  nextState.setupTournamentName = nextState.setupTournamentName || "IPL 2026";
  nextState.setupTeamCount = nextState.setupTeamCount || 4;
  nextState.setupOvers = nextState.setupOvers || 20;
  nextState.setupTeamNames = nextState.setupTeamNames || [];
  nextState.customTeamAPlayers = nextState.customTeamAPlayers || [];
  nextState.customTeamBPlayers = nextState.customTeamBPlayers || [];
  nextState.scoringMode = nextState.scoringMode || "simple";
  


  return nextState;
}

function saveState() {
  syncActiveTournamentToHistory();
  localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
}

function compileTournamentSeriesStats() {
  const players = {};
  
  const getPlayer = (name, teamName) => {
    if (!players[name]) {
      players[name] = {
        name,
        teamName,
        runs: 0,
        balls: 0,
        fours: 0,
        sixes: 0,
        dismissals: 0,
        highestScore: 0,
        centuries: 0,
        fifties: 0,
        wickets: 0,
        ballsBowled: 0,
        runsConceded: 0,
        maidens: 0,
        bestWickets: 0,
        bestRunsConceded: Infinity,
        catches: 0,
        stumpings: 0,
        runOuts: 0,
        momAwards: 0,
        matchImpactScores: [],
        matchPerformances: [],
        matchesPlayed: 0
      };
    }
    return players[name];
  };

  state.tournamentFixtures.forEach(fixture => {
    if (fixture.status === "completed" && fixture.matchState) {
      const matchStateCtx = {
        ...fixture.matchState,
        teamA: fixture.teamA,
        teamB: fixture.teamB,
        format: state.format || "Custom",
        scoringMode: state.scoringMode || "advanced",
        playersTeamA: state.tournamentPlayersCount || 11,
        playersTeamB: state.tournamentPlayersCount || 11
      };

      const matchStats = compilePlayerMatchStats(matchStateCtx);
      
      const res = matchStateCtx.result || "";
      let matchWinnerName = "";
      if (res.includes(" won by ")) {
        matchWinnerName = res.split(" won by ")[0].trim();
      }
      
      const scoredPlayers = Object.values(matchStats)
        .map(p => calculateImpactScore(p, matchWinnerName))
        .filter(sp => sp.player.didBat || sp.player.didBowl || sp.total > 0)
        .sort((a, b) => b.total - a.total);

      let matchMomNames = [];
      if (scoredPlayers.length > 0) {
        const maxScore = scoredPlayers[0].total;
        matchMomNames = scoredPlayers.filter(sp => sp.total === maxScore).map(sp => sp.player.name);
      }

      const playersInThisMatch = {};
      (matchStateCtx.inningsData || []).forEach(innings => {
        const isTeamA = innings.team === 0;
        const batTeam = isTeamA ? fixture.teamA : fixture.teamB;
        const bowlTeam = isTeamA ? fixture.teamB : fixture.teamA;
        
        (innings.batters || []).forEach(b => { if (b.name) playersInThisMatch[b.name] = batTeam; });
        (innings.bowlers || []).forEach(b => { if (b.name) playersInThisMatch[b.name] = bowlTeam; });
      });

      Object.entries(playersInThisMatch).forEach(([pName, pTeam]) => {
        const p = getPlayer(pName, pTeam);
        p.matchesPlayed += 1;
        
        const sp = scoredPlayers.find(x => x.player.name === pName);
        const score = sp ? sp.total : 0;
        p.matchImpactScores.push(score);

        let runsInMatch = 0;
        let wicketsInMatch = 0;
        if (sp) {
          runsInMatch = sp.player.runs || 0;
          wicketsInMatch = sp.player.wickets || 0;
        }
        p.matchPerformances.push({ runs: runsInMatch, wickets: wicketsInMatch });

        if (matchMomNames.includes(pName)) {
          p.momAwards += 1;
        }
      });

      (matchStateCtx.inningsData || []).forEach(innings => {
        const isTeamA = innings.team === 0;
        const battingTeamName = isTeamA ? fixture.teamA : fixture.teamB;
        const bowlingTeamName = isTeamA ? fixture.teamB : fixture.teamA;

        (innings.batters || []).forEach(b => {
          const p = getPlayer(b.name, battingTeamName);
          p.runs += b.runs || 0;
          p.balls += b.balls || 0;
          p.fours += b.fours || 0;
          p.sixes += b.sixes || 0;
          
          if (b.outInfo !== "Not Out") {
            p.dismissals += 1;
          }
          if (b.runs > p.highestScore) {
            p.highestScore = b.runs;
          }
          if (b.runs >= 100) {
            p.centuries += 1;
          } else if (b.runs >= 50) {
            p.fifties += 1;
          }
        });

        (innings.bowlers || []).forEach(bw => {
          const p = getPlayer(bw.name, bowlingTeamName);
          p.wickets += bw.wickets || 0;
          p.ballsBowled += bw.ballsBowled || 0;
          p.runsConceded += bw.runsConceded || 0;
          p.maidens += bw.maidens || 0;

          if (bw.wickets > p.bestWickets) {
            p.bestWickets = bw.wickets;
            p.bestRunsConceded = bw.runsConceded;
          } else if (bw.wickets === p.bestWickets && bw.runsConceded < p.bestRunsConceded) {
            p.bestRunsConceded = bw.runsConceded;
          }
        });

        (innings.batters || []).forEach(b => {
          if (b.outInfo && b.outInfo !== "Not Out") {
            const info = b.outInfo.trim();
            if (info.startsWith("c ") && info.includes(" b ")) {
              const fielderPart = info.substring(2, info.indexOf(" b ")).trim();
              if (fielderPart) {
                const fPlayer = getPlayer(fielderPart, bowlingTeamName);
                fPlayer.catches += 1;
              }
            }
            else if (info.startsWith("st ") && info.includes(" b ")) {
              const fielderPart = info.substring(3, info.indexOf(" b ")).trim();
              if (fielderPart) {
                const fPlayer = getPlayer(fielderPart, bowlingTeamName);
                fPlayer.stumpings += 1;
              }
            }
            else if (info.includes("run out")) {
              let fielderPart = "";
              if (info.includes("(") && info.includes(")")) {
                fielderPart = info.substring(info.indexOf("(") + 1, info.indexOf(")")).trim();
              } else {
                fielderPart = info.replace("run out", "").trim();
              }
              if (fielderPart) {
                const fPlayer = getPlayer(fielderPart, bowlingTeamName);
                fPlayer.runOuts += 1;
              }
            }
          }
        });
      });
    }
  });

  return Object.values(players);
}

function calculateSeriesImpactScore(player) {
  let totalImpact = player.matchImpactScores.reduce((sum, val) => sum + val, 0);
  
  let consistencyCount = 0;
  player.matchPerformances.forEach(perf => {
    if (perf.runs >= 30 || perf.wickets >= 2) {
      consistencyCount += 1;
    }
  });
  
  let consistencyBonus = 0;
  if (consistencyCount >= 2) {
    consistencyBonus = consistencyCount * 10;
  }
  
  const momBonus = player.momAwards * 15;
  
  const completedCount = state.tournamentFixtures.filter(f => f.status === "completed").length;
  const avgImpact = player.matchesPlayed > 0 ? (totalImpact / player.matchesPlayed) : 0;

  let finalScore = totalImpact + consistencyBonus + momBonus;
  finalScore += player.matchesPlayed * 5;

  return {
    player,
    total: Math.round(finalScore * 10) / 10,
    totalImpact: Math.round(totalImpact * 10) / 10,
    consistencyBonus,
    momBonus,
    avgImpact: Math.round(avgImpact * 10) / 10
  };
}

function compilePlayerMatchStats(s = state) {
  const stats = {};
  
  const getPlayer = (name, teamName) => {
    if (!stats[name]) {
      stats[name] = {
        name,
        teamName,
        runs: 0,
        balls: 0,
        fours: 0,
        sixes: 0,
        wickets: 0,
        ballsBowled: 0,
        runsConceded: 0,
        maidens: 0,
        catches: 0,
        stumpings: 0,
        runOuts: 0,
        didBat: false,
        didBowl: false,
        lowScoringInningsCount: 0,
        tightChaseContribution: false
      };
    }
    return stats[name];
  };

  const result = winnerText();
  let isTightMatch = false;
  if (result) {
    const runsMatch = result.match(/won by (\d+) runs/i);
    if (runsMatch && Number(runsMatch[1]) <= 15) {
      isTightMatch = true;
    }
    const wicketsMatch = result.match(/won by (\d+) wickets/i);
    if (wicketsMatch && Number(wicketsMatch[1]) <= 2) {
      isTightMatch = true;
    }
  }

  (s.inningsData || []).forEach((innings, idx) => {
    const isTeamA = innings.team === 0;
    const battingTeamName = isTeamA ? s.teamA : s.teamB;
    const bowlingTeamName = isTeamA ? s.teamB : s.teamA;
    
    const isLowScoring = innings.runs < 150 && innings.closed;

    (innings.batters || []).forEach(b => {
      const p = getPlayer(b.name, battingTeamName);
      if (b.balls > 0 || b.outInfo !== "Not Out") {
        p.didBat = true;
      }
      p.runs += b.runs || 0;
      p.balls += b.balls || 0;
      p.fours += b.fours || 0;
      p.sixes += b.sixes || 0;
      
      if (isLowScoring && b.runs >= 15) {
        p.lowScoringInningsCount += 1;
      }
      
      const isChasingInnings = (!isTestMatch() && idx === 1) || (isTestMatch() && idx === 3);
      if (isTightMatch && isChasingInnings && b.runs >= 10) {
        p.tightChaseContribution = true;
      }
    });

    (innings.bowlers || []).forEach(bw => {
      const p = getPlayer(bw.name, bowlingTeamName);
      if (bw.ballsBowled > 0) {
        p.didBowl = true;
      }
      p.wickets += bw.wickets || 0;
      p.ballsBowled += bw.ballsBowled || 0;
      p.runsConceded += bw.runsConceded || 0;
      p.maidens += bw.maidens || 0;
    });

    (innings.batters || []).forEach(b => {
      if (b.outInfo && b.outInfo !== "Not Out") {
        const info = b.outInfo.trim();
        if (info.startsWith("c ") && info.includes(" b ")) {
          const fielderPart = info.substring(2, info.indexOf(" b ")).trim();
          if (fielderPart) {
            const fPlayer = getPlayer(fielderPart, bowlingTeamName);
            fPlayer.catches += 1;
          }
        }
        else if (info.startsWith("st ") && info.includes(" b ")) {
          const fielderPart = info.substring(3, info.indexOf(" b ")).trim();
          if (fielderPart) {
            const fPlayer = getPlayer(fielderPart, bowlingTeamName);
            fPlayer.stumpings += 1;
          }
        }
        else if (info.includes("run out")) {
          let fielderPart = "";
          if (info.includes("(") && info.includes(")")) {
            fielderPart = info.substring(info.indexOf("(") + 1, info.indexOf(")")).trim();
          } else {
            fielderPart = info.replace("run out", "").trim();
          }
          if (fielderPart) {
            const fPlayer = getPlayer(fielderPart, bowlingTeamName);
            fPlayer.runOuts += 1;
          }
        }
      }
    });
  });

  return stats;
}

function calculateImpactScore(player, winnerName = "") {
  let batting = 0;
  let bowling = 0;
  let fielding = 0;
  
  const battingBreakdown = [];
  const bowlingBreakdown = [];
  const fieldingBreakdown = [];

  if (player.didBat) {
    batting += player.runs * 1;
    battingBreakdown.push(`${player.runs} runs`);
    
    const sr = player.balls > 0 ? (player.runs / player.balls) * 100 : 0;
    if (sr > 60 && player.runs >= 10) {
      const srBonus = Math.min(15, (sr - 60) * 0.25);
      batting += srBonus;
      battingBreakdown.push(`SR bonus (+${srBonus.toFixed(1)})`);
    }
    
    if (player.lowScoringInningsCount > 0) {
      const lowScoringBonus = player.lowScoringInningsCount * 10;
      batting += lowScoringBonus;
      battingBreakdown.push(`Low-scoring bonus (+${lowScoringBonus})`);
    }

    if (player.tightChaseContribution) {
      batting += 15;
      battingBreakdown.push(`Tight chase bonus (+15)`);
    }
  }

  if (player.didBowl) {
    bowling += player.wickets * 20;
    bowlingBreakdown.push(`${player.wickets} wickets`);
    
    if (player.ballsBowled >= 12) {
      const econ = player.runsConceded / (player.ballsBowled / 6);
      if (econ < 3.0) {
        const econBonus = (3.0 - econ) * 10;
        bowling += econBonus;
        bowlingBreakdown.push(`Econ under 3 bonus (+${econBonus.toFixed(1)})`);
      }
    }
    
    if (player.maidens > 0) {
      const maidensBonus = player.maidens * 5;
      bowling += maidensBonus;
      bowlingBreakdown.push(`${player.maidens} maidens (+${maidensBonus})`);
    }
  }

  if (player.catches > 0) {
    fielding += player.catches * 10;
    fieldingBreakdown.push(`${player.catches} catches (+${player.catches * 10})`);
  }
  if (player.stumpings > 0) {
    fielding += player.stumpings * 15;
    fieldingBreakdown.push(`${player.stumpings} stumpings (+${player.stumpings * 15})`);
  }
  if (player.runOuts > 0) {
    fielding += player.runOuts * 15;
    fieldingBreakdown.push(`${player.runOuts} run outs (+${player.runOuts * 15})`);
  }

  let total = batting + bowling + fielding;
  let multiplier = 1.0;
  
  if (winnerName && player.teamName === winnerName) {
    multiplier = 1.1;
    total *= multiplier;
  }

  return {
    player,
    total: Math.round(total * 10) / 10,
    batting: Math.round(batting * 10) / 10,
    bowling: Math.round(bowling * 10) / 10,
    fielding: Math.round(fielding * 10) / 10,
    multiplier,
    breakdown: {
      batting: battingBreakdown.join(", ") || "None",
      bowling: bowlingBreakdown.join(", ") || "None",
      fielding: fieldingBreakdown.join(", ") || "None"
    }
  };
}

function currentInnings() {
  return state.inningsData[state.innings];
}

function oversFromBalls(balls) {
  return `${Math.floor(balls / 6)}.${balls % 6}`;
}

function formatBall(ball) {
  if (ball.kind === "wicket") return "W";
  if (ball.kind === "wide") return "Wd";
  if (ball.kind === "noball") return "Nb";
  if (ball.kind === "bye") return `${ball.runs}B`;
  if (ball.kind === "legbye") return `${ball.runs}LB`;
  return String(ball.runs);
}

function battingTeam() {
  return teamName(currentInnings().team);
}

function bowlingTeam() {
  return teamName(currentInnings().team === 0 ? 1 : 0);
}

function isInningsClosed(innings = currentInnings()) {
  if (innings.closed || innings.declared) return true;
  if (innings.wickets >= maxWicketsForTeam(innings.team)) return true;
  if (!isTestMatch()) {
    if (innings.legalBalls >= state.maxOvers * 6) return true;
    if (state.innings === 1 && innings === state.inningsData[1]) {
      const chaseTarget = target();
      if (chaseTarget && innings.runs >= chaseTarget) return true;
    }
  }
  return false;
}

function isTestMatch() {
  return state.format === "Test";
}

function teamName(team, s = state) {
  return team === 0 ? s.teamA : s.teamB;
}

function teamTotal(team) {
  return state.inningsData.filter((innings) => innings.team === team).reduce((total, innings) => total + innings.runs, 0);
}

function inningsCount(team) {
  return state.inningsData.filter((innings) => innings.team === team).length;
}

function extrasTotal(innings = currentInnings()) {
  return Object.values(innings.extras || {}).reduce((total, value) => total + value, 0);
}

function scoreText(innings = currentInnings()) {
  return `${innings.runs}/${innings.wickets} (${oversFromBalls(innings.legalBalls)} ov)`;
}

function target() {
  if (!isTestMatch()) return state.inningsData[0].runs + 1;
  const batting = currentInnings().team;
  const other = batting === 0 ? 1 : 0;
  return inningsCount(batting) === 2 && teamTotal(batting) <= teamTotal(other) ? teamTotal(other) + 1 : null;
}

function winnerText() {
  if (state.result) return state.result;
  if (isTestMatch()) return testResult();

  const first = state.inningsData[0];
  const second = state.inningsData[1];

  if (state.innings === 0 || !isInningsClosed(second)) return "";
  if (second.runs >= target()) return `${state.teamB} won by ${maxWicketsForTeam(1) - second.wickets} wickets.`;
  if (second.runs === first.runs) return "Match tied.";
  return `${state.teamA} won by ${first.runs - second.runs} runs.`;
}

function testResult() {
  const current = currentInnings();
  if (!current) return "";
  const batting = current.team;
  const bowling = batting === 0 ? 1 : 0;
  const battingTotal = teamTotal(batting);
  const bowlingTotal = teamTotal(bowling);
  const battingInnings = inningsCount(batting);
  const bowlingInnings = inningsCount(bowling);

  if (battingInnings === 2 && bowlingInnings === 2 && battingTotal > bowlingTotal) {
    return `${teamName(batting)} won by ${maxWicketsForTeam(batting) - current.wickets} wickets.`;
  }
  if (isInningsClosed(current) && battingInnings === 2 && bowlingInnings === 2 && battingTotal === bowlingTotal && current.wickets >= maxWicketsForTeam(current.team)) {
    return "Match tied.";
  }
  if (isInningsClosed(current) && battingInnings === 2 && battingTotal < bowlingTotal) {
    return `${teamName(bowling)} won by ${bowlingTotal - battingTotal} runs.`;
  }
  if (state.day >= 5 && isInningsClosed(current) && !nextTeamForTest()) {
    return "Match drawn.";
  }
  return "";
}

function canEnforceFollowOn() {
  if (!isTestMatch() || state.followOnEnforced || state.inningsData.length !== 2) return false;
  const first = state.inningsData[0];
  const second = state.inningsData[1];
  return state.innings === 1 && isInningsClosed(second) && first.team === 0 && second.team === 1 && first.runs - second.runs >= 200;
}

function nextTeamForTest() {
  if (!isTestMatch()) return null;
  const current = currentInnings();
  if (!current || !isInningsClosed(current) || state.inningsData.length >= 4 || state.result) return null;
  const order = state.inningsData.map((innings) => innings.team).join("");

  if (state.innings < state.inningsData.length - 1) return { existing: state.innings + 1 };
  if (order === "01") return { team: 0, number: 2 };
  if (order === "010") return { team: 1, number: 2 };
  if (order === "011") return { team: 0, number: 2 };
  return null;
}

function closeCurrentInnings(reason = "closed") {
  const innings = currentInnings();
  innings.closed = true;
  if (reason === "declared") innings.declared = true;
}

function inningsStatus(innings) {
  if (innings.declared) return "declared";
  if (innings.followOn) return "follow-on";
  if (innings.wickets >= maxWicketsForTeam(innings.team)) return "all out";
  if (innings.closed) return "closed";
  return "batting";
}

function testIndicator() {
  if (!isTestMatch()) return "";
  const current = currentInnings();
  const batting = current.team;
  const other = batting === 0 ? 1 : 0;
  const lead = teamTotal(batting) - teamTotal(other);
  const chaseTarget = target();

  if (inningsCount(batting) === 2 && chaseTarget) {
    return `${teamName(batting)} need ${chaseTarget - teamTotal(batting)} runs to win. Target ${chaseTarget}.`;
  }
  if (lead > 0) return `${teamName(batting)} lead by ${lead} runs.`;
  if (lead < 0) return `${teamName(batting)} trail by ${Math.abs(lead)} runs.`;
  return "Scores level.";
}

function syncInputs() {
  state.teamA = els.teamA.value.trim() || defaultState.teamA;
  state.teamB = els.teamB.value.trim() || defaultState.teamB;
  state.maxOvers = Math.max(1, Math.min(100, Number(els.maxOvers.value) || 20));
  state.playersTeamA = Math.max(2, Math.min(11, Number(els.playersTeamA.value) || 11));
  state.playersTeamB = Math.max(2, Math.min(11, Number(els.playersTeamB.value) || 11));
  state.day = Math.max(1, Math.min(5, Number(els.matchDay.value) || 1));
}

function render() {
  // Hide skeleton loader on initial render
  const loader = document.querySelector("#skeleton-loader");
  if (loader) {
    loader.classList.add("fade-out");
    setTimeout(() => loader.remove(), 400);
  }

  if (window.location.hash.startsWith("#football") || window.location.hash.startsWith("#basketball") || window.location.hash.startsWith("#tennis")) {
    return;
  }
  els.teamA.value = state.teamA;
  els.teamB.value = state.teamB;
  els.maxOvers.value = state.maxOvers;
  if (els.playersTeamA) els.playersTeamA.value = state.playersTeamA || 11;
  if (els.playersTeamB) els.playersTeamB.value = state.playersTeamB || 11;
  els.matchDay.value = state.day;
  els.formatLabel.textContent = `${state.format || "Cricket"} tracker`;

  const innings = currentInnings();
  const legalBalls = innings.legalBalls;
  const runRate = legalBalls ? (innings.runs / (legalBalls / 6)).toFixed(2) : "0.00";
  const chaseTarget = target();
  const required = chaseTarget ? Math.max(chaseTarget - teamTotal(innings.team), 0) : null;
  const ballsLeft = state.innings === 1 ? Math.max(state.maxOvers * 6 - innings.legalBalls, 0) : null;
  const result = winnerText();

  els.inningsLabel.textContent = `${teamName(innings.team)} ${innings.number}${innings.number === 1 ? "st" : "nd"} innings`;
  els.mainScore.textContent = `${innings.runs}/${innings.wickets}`;
  els.oversLabel.textContent = `${oversFromBalls(innings.legalBalls)} ov`;
  els.runRate.textContent = runRate;
  els.targetLabel.textContent = chaseTarget || "-";
  els.needLabel.textContent = isTestMatch() ? testIndicator() || "-" : state.innings === 1 ? `${required} runs needed in ${ballsLeft} balls` : "-";
  els.battingName.textContent = battingTeam();
  els.bowlingName.textContent = bowlingTeam();
  els.dayName.textContent = `${state.day} of 5`;
  els.extrasName.textContent = `${extrasTotal(innings)} (b ${innings.extras.b}, lb ${innings.extras.lb}, wd ${innings.extras.wd}, nb ${innings.extras.nb})`;
  els.inningsBtn.disabled = isTestMatch() ? !nextTeamForTest() : state.innings === 1;
  els.followOnBtn.disabled = !canEnforceFollowOn();
  els.declareBtn.disabled = !isTestMatch() || isInningsClosed(innings) || Boolean(result);
  els.drawBtn.disabled = !isTestMatch() || Boolean(result);

  // Toggle Test match only controls
  if (isTestMatch()) {
    els.declareBtn.classList.remove("hidden");
    els.followOnBtn.classList.remove("hidden");
    els.drawBtn.classList.remove("hidden");
    if (els.dayEditorContainer) els.dayEditorContainer.classList.remove("hidden");
    if (els.daySidebarContainer) els.daySidebarContainer.classList.remove("hidden");
  } else {
    els.declareBtn.classList.add("hidden");
    els.followOnBtn.classList.add("hidden");
    els.drawBtn.classList.add("hidden");
    if (els.dayEditorContainer) els.dayEditorContainer.classList.add("hidden");
    if (els.daySidebarContainer) els.daySidebarContainer.classList.add("hidden");
  }

  // Toggle Scoring Mode elements (Simple vs. Advanced)
  const isSimple = state.scoringMode === "simple";
  if (isSimple) {
    if (els.liveBattersPanel) els.liveBattersPanel.classList.add("hidden");
    if (els.liveBatterSelectorRow) els.liveBatterSelectorRow.classList.add("hidden");
    if (els.liveBowlerSelectorRow) els.liveBowlerSelectorRow.classList.add("hidden");
    if (els.btnFullScorecard) els.btnFullScorecard.classList.add("hidden");
    const scoreboard = document.querySelector("#live-player-scoreboard");
    if (scoreboard) scoreboard.classList.add("hidden");
  } else {
    if (els.liveBattersPanel) els.liveBattersPanel.classList.remove("hidden");
    if (els.liveBatterSelectorRow) els.liveBatterSelectorRow.classList.remove("hidden");
    if (els.liveBowlerSelectorRow) els.liveBowlerSelectorRow.classList.remove("hidden");
    if (els.btnFullScorecard) els.btnFullScorecard.classList.remove("hidden");
    const scoreboard = document.querySelector("#live-player-scoreboard");
    if (scoreboard) scoreboard.classList.remove("hidden");
  }

  // Manage Tournament submit button
  const isMatchOver = Boolean(result);
  if (state.tournamentActive && state.tournamentActiveFixtureIndex !== -1 && isMatchOver) {
    if (els.submitTournamentBtn) els.submitTournamentBtn.classList.remove("hidden");
  } else {
    if (els.submitTournamentBtn) els.submitTournamentBtn.classList.add("hidden");
  }

  if (els.backToFormats) {
    els.backToFormats.textContent = state.tournamentActive ? "Tournament" : "Formats";
  }

  if (result) {
    els.matchNote.textContent = result;
  } else if (isTestMatch()) {
    els.matchNote.textContent = testIndicator() || `${battingTeam()} batting on day ${state.day}.`;
  } else if (state.innings === 1) {
    els.matchNote.textContent = `${battingTeam()} need ${required} runs in ${ballsLeft} balls.`;
  } else if (isInningsClosed()) {
    els.matchNote.textContent = `${state.teamA} finished on ${innings.runs}/${innings.wickets}. Start the chase when ready.`;
  } else {
    els.matchNote.textContent = `${battingTeam()} batting against ${bowlingTeam()}.`;
  }

  // Render Man of the Match card
  if (els.momCardContainer) {
    if (isMatchOver) {
      const playerStats = compilePlayerMatchStats();
      const playersList = Object.values(playerStats);
      
      const getMatchWinnerName = () => {
        const res = winnerText();
        if (!res) return "";
        if (res.includes(" won by ")) {
          return res.split(" won by ")[0].trim();
        }
        return "";
      };
      
      const winnerName = getMatchWinnerName();
      const scoredPlayers = playersList
        .map(p => calculateImpactScore(p, winnerName))
        .filter(sp => sp.player.didBat || sp.player.didBowl || sp.total > 0)
        .sort((a, b) => b.total - a.total);

      if (scoredPlayers.length > 0) {
        els.momCardContainer.classList.remove("hidden");
        
        const maxScore = scoredPlayers[0].total;
        const winners = scoredPlayers.filter(sp => sp.total === maxScore);
        
        const winnersHtml = winners.map(w => {
          const statsParts = [];
          if (w.player.runs > 0) statsParts.push(`${w.player.runs} Runs`);
          if (w.player.wickets > 0) statsParts.push(`${w.player.wickets} Wkts`);
          const f = w.player.catches + w.player.stumpings + w.player.runOuts;
          if (f > 0) statsParts.push(`${f} Dismissals`);
          const statsSummary = statsParts.join(" • ");
          
          return `
            <div style="background: rgba(255, 215, 0, 0.08); border: 1px solid rgba(255, 215, 0, 0.3); border-radius: 12px; padding: 16px; position: relative; overflow: hidden; display: grid; gap: 10px;">
              <div style="position: absolute; right: -10px; top: -10px; opacity: 0.1; font-size: 5rem; pointer-events: none;">🏆</div>
              <div style="display: flex; align-items: center; gap: 12px;">
                <div style="font-size: 1.8rem; background: rgba(255, 215, 0, 0.15); width: 44px; height: 44px; display: flex; align-items: center; justify-content: center; border-radius: 50%; border: 1.5px solid var(--gold);">🏆</div>
                <div>
                  <h3 style="margin: 0; color: var(--gold); font-size: 1.2rem; font-weight: 800;">Suggested Man of the Match</h3>
                  <strong style="font-size: 1.3rem; color: var(--ink);">${w.player.name}</strong>
                  <span style="font-size: 0.75rem; color: var(--text-muted); display: block;">${w.player.teamName}</span>
                </div>
              </div>
              
              <div style="background: rgba(255,255,255,0.03); border-radius: 8px; padding: 8px 12px; border: 1px solid rgba(255,255,255,0.04); font-size: 0.95rem; font-weight: 700; color: var(--gold); width: fit-content;">
                ${statsSummary || "Did not bat or bowl"}
              </div>
            </div>
          `;
        }).join("");

        els.momCardContainer.innerHTML = winnersHtml;
      } else {
        els.momCardContainer.classList.add("hidden");
      }
    } else {
      els.momCardContainer.classList.add("hidden");
    }
  }

  els.recentBalls.innerHTML = "";
  const overs = [];
  let currentOverBalls = [];
  let legalBallsCount = 0;

  innings.balls.forEach((ball) => {
    currentOverBalls.push(ball);
    if (ball.legal) {
      legalBallsCount++;
      if (legalBallsCount % 6 === 0) {
        overs.push({
          number: Math.floor(legalBallsCount / 6),
          balls: currentOverBalls
        });
        currentOverBalls = [];
      }
    }
  });

  if (currentOverBalls.length > 0) {
    overs.push({
      number: Math.floor(legalBallsCount / 6) + 1,
      balls: currentOverBalls
    });
  }

  const displayOvers = [...overs].reverse();
  displayOvers.forEach((over) => {
    const overRow = document.createElement("div");
    overRow.className = "over-row";

    const label = document.createElement("span");
    label.className = "over-row-label";
    label.textContent = `Over ${over.number}`;
    overRow.append(label);

    const ballsList = document.createElement("ul");
    ballsList.className = "over-row-balls";

    over.balls.forEach((ball) => {
      const item = document.createElement("li");
      item.textContent = formatBall(ball);
      item.className = "ball-node";
      if (ball.wicket) {
        item.classList.add("ball-wicket");
      } else if (ball.runs === 4 || ball.runs === 6) {
        item.classList.add("ball-boundary");
        item.classList.add(`ball-run-${ball.runs}`);
      } else if (ball.extra) {
        item.classList.add("ball-extra");
      } else {
        item.classList.add("ball-dot-or-run");
      }
      ballsList.append(item);
    });

    overRow.append(ballsList);
    els.recentBalls.append(overRow);
  });

  if (!innings.balls.length) {
    const emptyNote = document.createElement("div");
    emptyNote.className = "over-row-empty";
    emptyNote.textContent = "No balls bowled yet.";
    els.recentBalls.append(emptyNote);
  }

  els.inningsSummary.innerHTML = "";
  state.inningsData.forEach((item, index) => {
    const row = document.createElement("div");
    row.className = "summary-row";
    const team = document.createElement("span");
    const score = document.createElement("strong");
    team.textContent = `${teamName(item.team)} ${item.number}${item.number === 1 ? "st" : "nd"}`;
    score.textContent = `${scoreText(item)} - ${inningsStatus(item)}`;
    row.append(team, score);
    els.inningsSummary.append(row);
  });



  // Update dynamic tab title based on score
  if (!els.cricketPage.classList.contains("hidden")) {
    document.title = `${battingTeam()} ${innings.runs}/${innings.wickets} (${oversFromBalls(innings.legalBalls)} ov) • ScoreTracker`;
  } else {
    document.title = "ScoreTracker • Live Sports Score Tracker";
  }

  renderLivePlayerStats(innings);
  saveState();
}

function renderLivePlayerStats(innings) {
  ensurePlayerStats(innings);
  populatePlayerSelects(innings);

  const slot1Batter = innings.batters[innings.slot1BatterIndex];
  const slot2Batter = innings.batters[innings.slot2BatterIndex];
  const bowler = innings.bowlers[innings.currentBowlerIndex];

  const bowlerNameEl = document.querySelector("#live-card-bowler-name");
  if (bowlerNameEl) {
    bowlerNameEl.textContent = bowler ? bowler.name : "Select Bowler";
  }

  if (els.liveCardStrikerContent) {
    if (slot1Batter) {
      const sr = slot1Batter.balls > 0 ? ((slot1Batter.runs / slot1Batter.balls) * 100).toFixed(1) : "0.0";
      const isOnStrike = innings.currentStrikerIndex === innings.slot1BatterIndex;
      const strikeIndicator = `<span style="margin-right: 8px; font-size: 1.1rem; vertical-align: middle; visibility: ${isOnStrike ? 'visible' : 'hidden'};">🔴</span>`;
      els.liveCardStrikerContent.innerHTML = `
        ${strikeIndicator}
        <span style="font-weight: 700; color: var(--gold); vertical-align: middle;">${slot1Batter.name}</span>
        <span style="margin-left: 8px; margin-right: 8px; font-weight: 700; color: var(--ink); vertical-align: middle;">:</span>
        <span style="font-weight: 700; color: var(--ink); vertical-align: middle;">${slot1Batter.runs} (${slot1Batter.balls})</span>
        <span style="font-size: 0.85rem; color: var(--text-muted); font-weight: normal; margin-left: 12px; vertical-align: middle;">[SR: ${sr}]</span>
      `;
    } else {
      els.liveCardStrikerContent.innerHTML = `
        <span style="margin-right: 8px; font-size: 1.1rem; vertical-align: middle;">🔴</span>
        <span style="font-weight: 700; color: var(--gold); vertical-align: middle;">Select Striker</span>
      `;
    }
  }

  if (els.liveCardNonStrikerContent) {
    if (slot2Batter) {
      const sr = slot2Batter.balls > 0 ? ((slot2Batter.runs / slot2Batter.balls) * 100).toFixed(1) : "0.0";
      const isOnStrike = innings.currentStrikerIndex === innings.slot2BatterIndex;
      const strikeIndicator = `<span style="margin-right: 8px; font-size: 1.1rem; vertical-align: middle; visibility: ${isOnStrike ? 'visible' : 'hidden'};">🔴</span>`;
      els.liveCardNonStrikerContent.innerHTML = `
        ${strikeIndicator}
        <span style="font-weight: 700; color: var(--gold); vertical-align: middle;">${slot2Batter.name}</span>
        <span style="margin-left: 8px; margin-right: 8px; font-weight: 700; color: var(--ink); vertical-align: middle;">:</span>
        <span style="font-weight: 700; color: var(--ink); vertical-align: middle;">${slot2Batter.runs} (${slot2Batter.balls})</span>
        <span style="font-size: 0.85rem; color: var(--text-muted); font-weight: normal; margin-left: 12px; vertical-align: middle;">[SR: ${sr}]</span>
      `;
    } else {
      els.liveCardNonStrikerContent.innerHTML = `
        <span style="margin-right: 8px; font-size: 1.1rem; vertical-align: middle; visibility: hidden;">🔴</span>
        <span style="font-weight: 700; color: var(--gold); vertical-align: middle;">Select Non-Striker</span>
      `;
    }
  }

  if (els.strikerStats) {
    if (slot1Batter) {
      const sr = slot1Batter.balls > 0 ? ((slot1Batter.runs / slot1Batter.balls) * 100).toFixed(1) : "0.0";
      els.strikerStats.textContent = `${slot1Batter.runs} (${slot1Batter.balls}b) 4x${slot1Batter.fours} 6x${slot1Batter.sixes} [SR: ${sr}]`;
    } else {
      els.strikerStats.textContent = "Select Striker batsman stats";
    }
  }

  if (els.nonStrikerStats) {
    if (slot2Batter) {
      const sr = slot2Batter.balls > 0 ? ((slot2Batter.runs / slot2Batter.balls) * 100).toFixed(1) : "0.0";
      els.nonStrikerStats.textContent = `${slot2Batter.runs} (${slot2Batter.balls}b) 4x${slot2Batter.fours} 6x${slot2Batter.sixes} [SR: ${sr}]`;
    } else {
      els.nonStrikerStats.textContent = "Select Non-Striker batsman stats";
    }
  }

  if (els.bowlerStats) {
    if (bowler) {
      const econ = bowler.ballsBowled > 0 ? (bowler.runsConceded / (bowler.ballsBowled / 6)).toFixed(2) : "0.00";
      els.bowlerStats.textContent = `${formatBowlerOvers(bowler.ballsBowled)}-${bowler.maidens || 0}-${bowler.runsConceded}-${bowler.wickets} [Econ: ${econ}]`;
    } else {
      els.bowlerStats.textContent = "0.0-0-0-0 [Econ: 0.00]";
    }
  }

  if (els.liveBowlersTbody) {
    els.liveBowlersTbody.innerHTML = "";
    const activeBowlers = innings.bowlers.filter(b => b.ballsBowled > 0);
    
    if (activeBowlers.length === 0) {
      const tr = document.createElement("tr");
      tr.innerHTML = `
        <td colspan="5" style="padding: 12px 4px; text-align: center; color: var(--text-muted); font-size: 0.8rem; font-family: inherit; border: 1px solid rgba(255,255,255,0.18);">No bowler has bowled yet.</td>
      `;
      els.liveBowlersTbody.append(tr);
    } else {
      activeBowlers.forEach(b => {
        const econ = b.ballsBowled > 0 ? ((b.runsConceded / (b.ballsBowled / 6)).toFixed(2)) : "0.00";
        const tr = document.createElement("tr");
        tr.innerHTML = `
          <td style="padding: 6px 8px; border: 1px solid rgba(255,255,255,0.18); font-weight: 700; color: var(--gold); font-family: inherit;">${b.name}</td>
          <td style="padding: 6px 8px; border: 1px solid rgba(255,255,255,0.18); text-align: right; color: var(--ink); font-family: inherit;">${formatBowlerOvers(b.ballsBowled)}</td>
          <td style="padding: 6px 8px; border: 1px solid rgba(255,255,255,0.18); text-align: right; color: var(--ink); font-family: inherit;">${b.wickets}</td>
          <td style="padding: 6px 8px; border: 1px solid rgba(255,255,255,0.18); text-align: right; color: var(--ink); font-family: inherit;">${b.runsConceded}</td>
          <td style="padding: 6px 8px; border: 1px solid rgba(255,255,255,0.18); text-align: right; color: var(--ink); font-family: inherit;">${econ}</td>
        `;
        els.liveBowlersTbody.append(tr);
      });
    }
  }
}

function populatePlayerSelects(innings) {
  // Striker
  if (els.selectStriker) {
    const selectedVal = innings.currentStrikerIndex;
    els.selectStriker.innerHTML = "";
    innings.batters.forEach((b, idx) => {
      if (idx === selectedVal || (idx !== innings.currentNonStrikerIndex && b.outInfo === "Not Out")) {
        const opt = document.createElement("option");
        opt.value = idx;
        opt.textContent = b.name;
        opt.selected = (idx === selectedVal);
        els.selectStriker.append(opt);
      }
    });
  }
  
  // Non-striker
  if (els.selectNonStriker) {
    const selectedVal = innings.currentNonStrikerIndex;
    els.selectNonStriker.innerHTML = "";
    innings.batters.forEach((b, idx) => {
      if (idx === selectedVal || (idx !== innings.currentStrikerIndex && b.outInfo === "Not Out")) {
        const opt = document.createElement("option");
        opt.value = idx;
        opt.textContent = b.name;
        opt.selected = (idx === selectedVal);
        els.selectNonStriker.append(opt);
      }
    });
  }

  // Bowler
  if (els.selectBowler) {
    const selectedVal = innings.currentBowlerIndex;
    els.selectBowler.innerHTML = "";
    innings.bowlers.forEach((b, idx) => {
      const opt = document.createElement("option");
      opt.value = idx;
      opt.textContent = b.name;
      opt.selected = (idx === selectedVal);
      els.selectBowler.append(opt);
    });
  }
}

let scorecardActiveTeamIndex = 0;
let scorecardSourceCtx = null;

function generateBattingScorecardHtml(innings, s = state) {
  ensurePlayerStats(innings, s);
  let html = `
    <div style="margin-top: 10px;">
      <h4 style="margin: 0 0 6px; font-size: 0.85rem; color: var(--gold); font-family: inherit;">Innings ${innings.number}</h4>
      <div style="overflow-x: auto;">
        <table style="width: 100%; border-collapse: collapse; text-align: left; font-size: 0.85rem; font-family: inherit; margin-bottom: 12px;">
          <thead>
            <tr style="color: var(--text-muted); border-bottom: 1px solid rgba(255,255,255,0.04);">
              <th style="padding: 8px 4px;">Batter</th>
              <th style="padding: 8px 4px;">Status</th>
              <th style="padding: 8px 4px; text-align: right;">R</th>
              <th style="padding: 8px 4px; text-align: right;">B</th>
              <th style="padding: 8px 4px; text-align: right;">4s</th>
              <th style="padding: 8px 4px; text-align: right;">6s</th>
              <th style="padding: 8px 4px; text-align: right;">SR</th>
            </tr>
          </thead>
          <tbody style="color: var(--ink);">
  `;

  const activeBatters = innings.batters.filter(b => {
    const isStriker = b === innings.batters[innings.currentStrikerIndex] && b.outInfo === "Not Out";
    const isNonStriker = b === innings.batters[innings.currentNonStrikerIndex] && b.outInfo === "Not Out";
    return b.balls > 0 || b.outInfo !== "Not Out" || isStriker || isNonStriker;
  });

  const dnbBatters = innings.batters.filter(b => {
    const isStriker = b === innings.batters[innings.currentStrikerIndex] && b.outInfo === "Not Out";
    const isNonStriker = b === innings.batters[innings.currentNonStrikerIndex] && b.outInfo === "Not Out";
    return b.balls === 0 && b.outInfo === "Not Out" && !isStriker && !isNonStriker;
  });

  activeBatters.forEach((b) => {
    const sr = b.balls > 0 ? ((b.runs / b.balls) * 100).toFixed(1) : "0.0";
    const isStriker = b === innings.batters[innings.currentStrikerIndex] && b.outInfo === "Not Out";
    const isNonStriker = b === innings.batters[innings.currentNonStrikerIndex] && b.outInfo === "Not Out";
    let nameHTML = b.name;
    if (isStriker) nameHTML = `🏏 ${b.name}*`;

    html += `
      <tr style="border-bottom: 1px solid rgba(255,255,255,0.03);">
        <td style="padding: 10px 4px; font-weight: ${isStriker || isNonStriker ? '700' : 'normal'}; color: ${isStriker ? 'var(--gold)' : 'var(--ink)'};">${nameHTML}</td>
        <td style="padding: 10px 4px; color: var(--text-muted); font-size: 0.8rem;">${b.outInfo}</td>
        <td style="padding: 10px 4px; text-align: right; font-weight: 700;">${b.runs}</td>
        <td style="padding: 10px 4px; text-align: right; color: var(--text-muted);">${b.balls}</td>
        <td style="padding: 10px 4px; text-align: right; color: var(--text-muted);">${b.fours}</td>
        <td style="padding: 10px 4px; text-align: right; color: var(--text-muted);">${b.sixes}</td>
        <td style="padding: 10px 4px; text-align: right; color: var(--text-muted);">${sr}</td>
      </tr>
    `;
  });

  if (dnbBatters.length > 0) {
    html += `
      <tr>
        <td colspan="7" style="padding: 12px 4px; font-size: 0.85rem; color: var(--text-muted); border-top: 1px solid rgba(255,255,255,0.06);">
          <strong>Yet to Bat:</strong> ${dnbBatters.map(b => b.name).join(", ")}
        </td>
      </tr>
    `;
  }

  html += `
      <tr style="border-top: 1.5px solid rgba(255,255,255,0.1); font-weight: 700;">
        <td colspan="2" style="padding: 10px 4px;">Total</td>
        <td style="padding: 10px 4px; text-align: right; font-weight: 800; color: var(--gold);">${innings.runs}/${innings.wickets}</td>
        <td colspan="4" style="padding: 10px 4px; text-align: right; color: var(--text-muted);">${oversFromBalls(innings.legalBalls)} overs</td>
      </tr>
    </tbody>
  </table>
</div>
</div>
  `;
  return html;
}

function generateBowlingScorecardHtml(innings, s = state) {
  ensurePlayerStats(innings, s);
  let html = `
    <div style="margin-top: 10px;">
      <h4 style="margin: 0 0 6px; font-size: 0.85rem; color: var(--gold); font-family: inherit;">Innings ${innings.number}</h4>
      <div style="overflow-x: auto;">
        <table style="width: 100%; border-collapse: collapse; text-align: left; font-size: 0.85rem; font-family: inherit; margin-bottom: 12px;">
          <thead>
            <tr style="color: var(--text-muted); border-bottom: 1px solid rgba(255,255,255,0.04);">
              <th style="padding: 8px 4px;">Bowler</th>
              <th style="padding: 8px 4px; text-align: right;">O</th>
              <th style="padding: 8px 4px; text-align: right;">M</th>
              <th style="padding: 8px 4px; text-align: right;">R</th>
              <th style="padding: 8px 4px; text-align: right;">W</th>
              <th style="padding: 8px 4px; text-align: right;">ECON</th>
            </tr>
          </thead>
          <tbody style="color: var(--ink);">
  `;

  const activeBowlers = innings.bowlers.filter(b => b.ballsBowled > 0 || b === innings.bowlers[innings.currentBowlerIndex]);

  activeBowlers.forEach((b) => {
    const econ = b.ballsBowled > 0 ? (b.runsConceded / (b.ballsBowled / 6)).toFixed(1) : "0.0";
    const isCurrent = b === innings.bowlers[innings.currentBowlerIndex];

    html += `
      <tr style="border-bottom: 1px solid rgba(255,255,255,0.03);">
        <td style="padding: 10px 4px; font-weight: ${isCurrent ? '700' : 'normal'}; color: ${isCurrent ? 'var(--gold)' : 'var(--ink)'};">${b.name} ${isCurrent ? '(current)' : ''}</td>
        <td style="padding: 10px 4px; text-align: right;">${formatBowlerOvers(b.ballsBowled)}</td>
        <td style="padding: 10px 4px; text-align: right;">${b.maidens || 0}</td>
        <td style="padding: 10px 4px; text-align: right;">${b.runsConceded}</td>
        <td style="padding: 10px 4px; text-align: right; font-weight: 700;">${b.wickets}</td>
        <td style="padding: 10px 4px; text-align: right; color: var(--text-muted);">${econ}</td>
      </tr>
    `;
  });

  html += `
          </tbody>
        </table>
      </div>
    </div>
  `;
  return html;
}

function renderFullScorecardModal() {
  const ctx = scorecardSourceCtx || state;
  const isAdv = ctx.scoringMode === "advanced";
  
  const tabContainer = document.querySelector("#modal-scorecard-tabs");
  const btnA = document.querySelector("#btn-scorecard-team-a");
  const btnB = document.querySelector("#btn-scorecard-team-b");
  
  if (tabContainer && btnA && btnB) {
    if (isAdv) {
      tabContainer.style.display = "grid";
      btnA.textContent = ctx.teamA;
      btnB.textContent = ctx.teamB;
      
      if (scorecardActiveTeamIndex === 0) {
        btnA.classList.add("active");
        btnB.classList.remove("active");
      } else {
        btnB.classList.add("active");
        btnA.classList.remove("active");
      }
    } else {
      tabContainer.style.display = "none";
    }
  }

  const targetTeamName = scorecardActiveTeamIndex === 0 ? ctx.teamA : ctx.teamB;
  const opponentTeamName = scorecardActiveTeamIndex === 0 ? ctx.teamB : ctx.teamA;
  
  if (els.modalScorecardTitle) {
    els.modalScorecardTitle.textContent = isAdv ? `${targetTeamName} Scorecard` : "Full Scorecard";
  }
  if (els.modalScorecardSubtitle) {
    els.modalScorecardSubtitle.textContent = ctx.result || (isAdv ? `Match Statistics` : `Innings Statistics`);
  }
  
  if (els.modalBattingHeader) {
    els.modalBattingHeader.textContent = `Batting - ${targetTeamName}`;
  }
  if (els.modalBowlingHeader) {
    els.modalBowlingHeader.textContent = `Bowling - ${opponentTeamName}`;
  }

  const battingContainer = document.querySelector("#modal-batting-container");
  const bowlingContainer = document.querySelector("#modal-bowling-container");

  if (battingContainer) battingContainer.innerHTML = "";
  if (bowlingContainer) bowlingContainer.innerHTML = "";

  if (isAdv) {
    const battingInningsList = (ctx.inningsData || []).filter(inn => inn.team === scorecardActiveTeamIndex);
    if (battingContainer) {
      if (battingInningsList.length === 0) {
        battingContainer.innerHTML = `<div style="color: var(--text-muted); font-size: 0.82rem; font-style: italic; padding: 8px;">Yet to bat.</div>`;
      } else {
        battingInningsList.forEach(innings => {
          battingContainer.innerHTML += generateBattingScorecardHtml(innings, ctx);
        });
      }
    }

    if (bowlingContainer) {
      if (battingInningsList.length === 0) {
        bowlingContainer.innerHTML = `<div style="color: var(--text-muted); font-size: 0.82rem; font-style: italic; padding: 8px;">Yet to bowl.</div>`;
      } else {
        battingInningsList.forEach(innings => {
          bowlingContainer.innerHTML += generateBowlingScorecardHtml(innings, ctx);
        });
      }
    }
  } else {
    // Simple Mode: fall back to current active innings scorecard
    const innings = ctx.inningsData[ctx.innings || 0] || ctx.inningsData[0];
    if (battingContainer) {
      battingContainer.innerHTML = generateBattingScorecardHtml(innings, ctx);
    }
    if (bowlingContainer) {
      bowlingContainer.innerHTML = generateBowlingScorecardHtml(innings, ctx);
    }
  }
}

function formatBowlerOvers(balls) {
  const overs = Math.floor(balls / 6);
  const extraBalls = balls % 6;
  return `${overs}.${extraBalls}`;
}

function updateSquadSelectionCounters() {
  const count = Math.max(2, Math.min(11, state.tournamentPlayersCount || 11));
  const selectedA = document.querySelectorAll(".squad-checkbox-a:checked").length;
  const selectedB = document.querySelectorAll(".squad-checkbox-b:checked").length;
  
  const fixture = state.tournamentFixtures[activeSquadFixtureIndex];
  if (fixture) {
    if (els.modalSquadTeamAHeader) {
      els.modalSquadTeamAHeader.textContent = `${fixture.teamA} (${selectedA}/${count})`;
    }
    if (els.modalSquadTeamBHeader) {
      els.modalSquadTeamBHeader.textContent = `${fixture.teamB} (${selectedB}/${count})`;
    }
  }
}

let activeSquadFixtureIndex = -1;
let squadBatFirstTeam = -1;

function renderSquadPlayersInputs(abbrA, abbrB) {
  const count = Math.max(2, Math.min(11, state.tournamentPlayersCount || 11));
  
  const fixture = state.tournamentFixtures[activeSquadFixtureIndex];
  const teamObjA = fixture ? state.tournamentTeams.find(t => t.name === fixture.teamA) : null;
  const teamObjB = fixture ? state.tournamentTeams.find(t => t.name === fixture.teamB) : null;
  
  if (els.modalSquadTeamAInputs) {
    els.modalSquadTeamAInputs.innerHTML = "";
    const rosterA = teamObjA && teamObjA.players ? teamObjA.players : [];
    const displayCountA = Math.max(count, rosterA.length);
    for (let i = 0; i < displayCountA; i++) {
      const val = rosterA[i] || `${abbrA} Player ${i + 1}`;
      const div = document.createElement("div");
      div.style.display = "flex";
      div.style.alignItems = "center";
      div.style.gap = "12px";
      div.innerHTML = `
        <span style="font-size: 0.8rem; color: var(--text-muted); min-width: 24px; font-family: inherit;">#${i + 1}</span>
        <input class="squad-input-a" type="text" value="${val}" readonly style="flex: 1; padding: 6px 12px; font-size: 0.85rem; background: rgba(255,255,255,0.01); border: 1px solid rgba(255,255,255,0.04); border-radius: 6px; color: var(--ink); cursor: default; font-family: inherit;" />
        <input type="checkbox" class="squad-checkbox-a squad-checkbox-round" data-index="${i}" />
      `;
      els.modalSquadTeamAInputs.append(div);
    }
    
    els.modalSquadTeamAInputs.querySelectorAll(".squad-checkbox-a").forEach(cb => {
      cb.addEventListener("change", updateSquadSelectionCounters);
    });
  }

  if (els.modalSquadTeamBInputs) {
    els.modalSquadTeamBInputs.innerHTML = "";
    const rosterB = teamObjB && teamObjB.players ? teamObjB.players : [];
    const displayCountB = Math.max(count, rosterB.length);
    for (let i = 0; i < displayCountB; i++) {
      const val = rosterB[i] || `${abbrB} Player ${i + 1}`;
      const div = document.createElement("div");
      div.style.display = "flex";
      div.style.alignItems = "center";
      div.style.gap = "12px";
      div.innerHTML = `
        <span style="font-size: 0.8rem; color: var(--text-muted); min-width: 24px; font-family: inherit;">#${i + 1}</span>
        <input class="squad-input-b" type="text" value="${val}" readonly style="flex: 1; padding: 6px 12px; font-size: 0.85rem; background: rgba(255,255,255,0.01); border: 1px solid rgba(255,255,255,0.04); border-radius: 6px; color: var(--ink); cursor: default; font-family: inherit;" />
        <input type="checkbox" class="squad-checkbox-b squad-checkbox-round" data-index="${i}" />
      `;
      els.modalSquadTeamBInputs.append(div);
    }
    
    els.modalSquadTeamBInputs.querySelectorAll(".squad-checkbox-b").forEach(cb => {
      cb.addEventListener("change", updateSquadSelectionCounters);
    });
  }

  updateSquadSelectionCounters();
}

function openSquadModal(fixtureIndex) {
  activeSquadFixtureIndex = fixtureIndex;
  squadBatFirstTeam = -1;
  const fixture = state.tournamentFixtures[fixtureIndex];
  if (!fixture) return;

  const teamA = fixture.teamA;
  const teamB = fixture.teamB;
  const abbrA = getTeamAbbr(teamA);
  const abbrB = getTeamAbbr(teamB);

  if (els.modalSquadTitle) {
    els.modalSquadTitle.textContent = `Squad Setup: ${teamA} vs ${teamB}`;
  }
  if (els.modalSquadTeamAHeader) {
    els.modalSquadTeamAHeader.textContent = `${teamA} Lineup`;
  }
  if (els.modalSquadTeamBHeader) {
    els.modalSquadTeamBHeader.textContent = `${teamB} Lineup`;
  }

  if (els.btnSquadTossTeamA) {
    els.btnSquadTossTeamA.textContent = teamA;
    els.btnSquadTossTeamA.classList.remove("active");
  }
  if (els.btnSquadTossTeamB) {
    els.btnSquadTossTeamB.textContent = teamB;
    els.btnSquadTossTeamB.classList.remove("active");
  }

  renderSquadPlayersInputs(abbrA, abbrB);

  if (els.squadModal) {
    els.squadModal.classList.remove("hidden");
  }
}

function promptNewBowler() {
  const innings = currentInnings();
  if (!innings) return;

  const currentBowlerIndex = innings.currentBowlerIndex;

  if (els.modalBowlersList) {
    els.modalBowlersList.innerHTML = "";
    
    innings.bowlers.forEach((b, idx) => {
      const btn = document.createElement("button");
      btn.type = "button";
      btn.style.width = "100%";
      btn.style.margin = "0";
      btn.style.textAlign = "left";
      btn.style.padding = "8px 12px";
      btn.style.fontSize = "0.95rem";
      btn.style.background = "transparent";
      btn.style.border = "none";
      btn.style.borderBottom = "1px solid rgba(255,255,255,0.06)";
      btn.style.cursor = idx === currentBowlerIndex ? "not-allowed" : "pointer";
      btn.style.color = idx === currentBowlerIndex ? "var(--text-muted)" : "var(--ink)";
      
      if (idx === currentBowlerIndex) {
        btn.disabled = true;
        btn.innerHTML = `<span style="font-weight: 700; color: var(--gold); font-family: inherit;">${b.name}</span> <span style="font-size: 0.75rem; color: var(--text-muted); margin-left: 8px; font-family: inherit;">(just bowled)</span>`;
      } else {
        btn.innerHTML = `<span style="font-weight: 700; color: var(--gold); font-family: inherit;">${b.name}</span>`;
      }

      btn.addEventListener("click", () => {
        innings.currentBowlerIndex = idx;
        saveState();
        render();
        if (els.bowlerSelectModal) {
          els.bowlerSelectModal.classList.add("hidden");
        }
      });

      els.modalBowlersList.append(btn);
    });
  }

  if (els.bowlerSelectModal) {
    els.bowlerSelectModal.classList.remove("hidden");
  }
}

let activeBatterSelectTarget = "striker";

function promptNewBatter(target = "striker") {
  activeBatterSelectTarget = target;
  const innings = currentInnings();
  if (!innings) return;

  if (els.modalBatterTitle) {
    if (target === "striker") {
      els.modalBatterTitle.textContent = "Select Striker";
      if (els.modalBatterSubtitle) els.modalBatterSubtitle.textContent = "Choose the striker batsman";
    } else if (target === "nonstriker") {
      els.modalBatterTitle.textContent = "Select Non-Striker";
      if (els.modalBatterSubtitle) els.modalBatterSubtitle.textContent = "Choose the non-striker batsman";
    } else {
      els.modalBatterTitle.textContent = "Select Next Batter";
      if (els.modalBatterSubtitle) els.modalBatterSubtitle.textContent = "Choose the incoming batter";
    }
  }

  if (els.modalBattersList) {
    els.modalBattersList.innerHTML = "";
    
    innings.batters.forEach((b, idx) => {
      const isCurrentlyBatting = idx === innings.currentStrikerIndex || idx === innings.currentNonStrikerIndex;
      const isOut = b.outInfo !== "Not Out";
      
      if (!isCurrentlyBatting && !isOut) {
        const btn = document.createElement("button");
        btn.type = "button";
        btn.style.width = "100%";
        btn.style.margin = "0";
        btn.style.textAlign = "left";
        btn.style.padding = "8px 12px";
        btn.style.fontSize = "0.95rem";
        btn.style.background = "transparent";
        btn.style.border = "none";
        btn.style.borderBottom = "1px solid rgba(255,255,255,0.06)";
        btn.style.cursor = "pointer";
        btn.style.color = "var(--ink)";
        
        btn.innerHTML = `<span style="font-weight: 700; color: var(--gold); font-family: inherit;">${b.name}</span>`;

        btn.addEventListener("click", () => {
          if (activeBatterSelectTarget === "striker") {
            if (innings.slot1BatterIndex === innings.currentStrikerIndex || innings.slot1BatterIndex === -1) {
              innings.slot1BatterIndex = idx;
            } else {
              innings.slot2BatterIndex = idx;
            }
            innings.currentStrikerIndex = idx;
          } else {
            if (innings.slot2BatterIndex === innings.currentNonStrikerIndex || innings.slot2BatterIndex === -1) {
              innings.slot2BatterIndex = idx;
            } else {
              innings.slot1BatterIndex = idx;
            }
            innings.currentNonStrikerIndex = idx;
          }
          saveState();
          render();
          if (els.batterSelectModal) {
            els.batterSelectModal.classList.add("hidden");
          }
          
          // Auto-prompt sequence: Striker -> Non-Striker -> Bowler
          if (innings.currentStrikerIndex === -1) {
            setTimeout(() => {
              promptNewBatter("striker");
            }, 300);
          } else if (innings.currentNonStrikerIndex === -1) {
            setTimeout(() => {
              promptNewBatter("nonstriker");
            }, 300);
          } else if (innings.currentBowlerIndex === -1) {
            setTimeout(() => {
              promptNewBowler();
            }, 300);
          }
        });

        els.modalBattersList.append(btn);
      }
    });
  }

  if (els.batterSelectModal) {
    els.batterSelectModal.classList.remove("hidden");
  }
}

function syncScoringModeUI() {
  const isSimple = state.scoringMode === "simple";
  if (els.btnModeSimple && els.btnModeAdvanced) {
    if (isSimple) {
      els.btnModeSimple.classList.add("active");
      els.btnModeAdvanced.classList.remove("active");
      if (els.btnConfigurePlayersA) els.btnConfigurePlayersA.classList.add("hidden");
      if (els.btnConfigurePlayersB) els.btnConfigurePlayersB.classList.add("hidden");
      
      const containerA = document.querySelector("#custom-team-a-players-inputs");
      const containerB = document.querySelector("#custom-team-b-players-inputs");
      if (containerA) containerA.style.display = "none";
      if (containerB) containerB.style.display = "none";
    } else {
      els.btnModeSimple.classList.remove("active");
      els.btnModeAdvanced.classList.add("active");
      if (els.btnConfigurePlayersA) {
        els.btnConfigurePlayersA.classList.remove("hidden");
        els.btnConfigurePlayersA.textContent = "Enter Player Names";
      }
      if (els.btnConfigurePlayersB) {
        els.btnConfigurePlayersB.classList.remove("hidden");
        els.btnConfigurePlayersB.textContent = "Enter Player Names";
      }
    }
  }

  if (els.btnTModeSimple && els.btnTModeAdvanced) {
    if (isSimple) {
      els.btnTModeSimple.classList.add("active");
      els.btnTModeAdvanced.classList.remove("active");
    } else {
      els.btnTModeSimple.classList.remove("active");
      els.btnTModeAdvanced.classList.add("active");
    }
  }
}

function renderCustomPlayerInputs() {
  const containerA = document.querySelector("#custom-team-a-players-inputs");
  const containerB = document.querySelector("#custom-team-b-players-inputs");

  if (!els.customPlayersA || !els.customPlayersB) return;

  const valStrA = els.customPlayersA.value.trim();
  const valStrB = els.customPlayersB.value.trim();
  const countA = valStrA !== "" ? Math.max(2, Math.min(11, Number(valStrA) || 2)) : 0;
  const countB = valStrB !== "" ? Math.max(2, Math.min(11, Number(valStrB) || 2)) : 0;

  if (!state.customTeamAPlayers) state.customTeamAPlayers = [];
  if (!state.customTeamBPlayers) state.customTeamBPlayers = [];

  const teamNameA = els.customTeamA.value.trim() || "Team 1";
  const abbrA = getTeamAbbr(teamNameA);

  if (containerA) {
    containerA.innerHTML = "";
    for (let i = 0; i < countA; i++) {
      const label = document.createElement("label");
      label.style.fontSize = "0.85rem";
      label.style.marginTop = "6px";
      const savedVal = state.customTeamAPlayers[i] !== undefined ? state.customTeamAPlayers[i] : `${abbrA} Player ${i + 1}`;
      label.innerHTML = `
        Player ${i + 1} Name
        <input type="text" class="custom-team-a-player-input" data-index="${i}" maxlength="24" value="${savedVal}" style="margin-top: 4px;" />
      `;
      containerA.append(label);
    }
    
    // Bind listeners
    containerA.querySelectorAll(".custom-team-a-player-input").forEach(inp => {
      inp.addEventListener("input", (e) => {
        const idx = Number(e.target.dataset.index);
        state.customTeamAPlayers[idx] = e.target.value;
        saveState();
      });
    });
  }

  const teamNameB = els.customTeamB.value.trim() || "Team 2";
  const abbrB = getTeamAbbr(teamNameB);

  if (containerB) {
    containerB.innerHTML = "";
    for (let i = 0; i < countB; i++) {
      const label = document.createElement("label");
      label.style.fontSize = "0.85rem";
      label.style.marginTop = "6px";
      const savedVal = state.customTeamBPlayers[i] !== undefined ? state.customTeamBPlayers[i] : `${abbrB} Player ${i + 1}`;
      label.innerHTML = `
        Player ${i + 1} Name
        <input type="text" class="custom-team-b-player-input" data-index="${i}" maxlength="24" value="${savedVal}" style="margin-top: 4px;" />
      `;
      containerB.append(label);
    }
    
    // Bind listeners
    containerB.querySelectorAll(".custom-team-b-player-input").forEach(inp => {
      inp.addEventListener("input", (e) => {
        const idx = Number(e.target.dataset.index);
        state.customTeamBPlayers[idx] = e.target.value;
        saveState();
      });
    });
  }
}

function renderLivePagePlayerInputs() {
  const containerA = document.querySelector("#team-a-players-inputs");
  const containerB = document.querySelector("#team-b-players-inputs");

  if (!els.playersTeamA || !els.playersTeamB) return;

  const countA = Math.max(2, Math.min(11, Number(els.playersTeamA.value) || 11));
  const countB = Math.max(2, Math.min(11, Number(els.playersTeamB.value) || 11));

  if (!state.customTeamAPlayers) state.customTeamAPlayers = [];
  if (!state.customTeamBPlayers) state.customTeamBPlayers = [];

  const teamNameA = els.teamA.value.trim() || "Team 1";
  const abbrA = getTeamAbbr(teamNameA);

  if (containerA) {
    containerA.innerHTML = "";
    for (let i = 0; i < countA; i++) {
      const label = document.createElement("label");
      label.style.fontSize = "0.85rem";
      label.style.marginTop = "6px";
      const savedVal = state.customTeamAPlayers[i] !== undefined ? state.customTeamAPlayers[i] : `${abbrA} Player ${i + 1}`;
      label.innerHTML = `
        Player ${i + 1} Name
        <input type="text" class="live-team-a-player-input" data-index="${i}" maxlength="24" value="${savedVal}" style="margin-top: 4px;" />
      `;
      containerA.append(label);
    }
    containerA.querySelectorAll(".live-team-a-player-input").forEach(inp => {
      inp.addEventListener("input", (e) => {
        const idx = Number(e.target.dataset.index);
        state.customTeamAPlayers[idx] = e.target.value;
        updateLiveInningsPlayerNames(0, idx, e.target.value);
        saveState();
        render();
      });
    });
  }

  const teamNameB = els.teamB.value.trim() || "Team 2";
  const abbrB = getTeamAbbr(teamNameB);

  if (containerB) {
    containerB.innerHTML = "";
    for (let i = 0; i < countB; i++) {
      const label = document.createElement("label");
      label.style.fontSize = "0.85rem";
      label.style.marginTop = "6px";
      const savedVal = state.customTeamBPlayers[i] !== undefined ? state.customTeamBPlayers[i] : `${abbrB} Player ${i + 1}`;
      label.innerHTML = `
        Player ${i + 1} Name
        <input type="text" class="live-team-b-player-input" data-index="${i}" maxlength="24" value="${savedVal}" style="margin-top: 4px;" />
      `;
      containerB.append(label);
    }
    containerB.querySelectorAll(".live-team-b-player-input").forEach(inp => {
      inp.addEventListener("input", (e) => {
        const idx = Number(e.target.dataset.index);
        state.customTeamBPlayers[idx] = e.target.value;
        updateLiveInningsPlayerNames(1, idx, e.target.value);
        saveState();
        render();
      });
    });
  }
}

function updateLiveInningsPlayerNames(teamIndex, playerIndex, newName) {
  if (!state.inningsData) return;
  state.inningsData.forEach(innings => {
    if (innings.team === teamIndex && innings.batters && innings.batters[playerIndex]) {
      innings.batters[playerIndex].name = newName;
    }
    if (1 - innings.team === teamIndex && innings.bowlers && innings.bowlers[playerIndex]) {
      innings.bowlers[playerIndex].name = newName;
    }
  });
}

function remember() {
  const flatState = clone(state);
  flatState.history = [];
  state.history.push(flatState);
  if (state.history.length > 80) state.history.shift();
}

function addBall(ball) {
  syncInputs();
  const innings = currentInnings();

  if (isInningsClosed(innings) || winnerText()) {
    showToast("This innings is complete. Move to the next innings or reset the match.");
    return;
  }

  if (state.scoringMode === "advanced") {
    if (innings.currentStrikerIndex === -1) {
      showToast("Please select a striker batsman first.");
      promptNewBatter("striker");
      return;
    }
    if (innings.currentNonStrikerIndex === -1) {
      showToast("Please select a non-striker batsman first.");
      promptNewBatter("nonstriker");
      return;
    }
    if (innings.currentBowlerIndex === -1) {
      showToast("Please select a bowler first.");
      promptNewBowler();
      return;
    }
  }

  remember();

  ensurePlayerStats(innings);

  const striker = innings.batters[innings.currentStrikerIndex];
  const bowler = innings.bowlers[innings.currentBowlerIndex];

  // Update batter stats
  if (ball.kind !== "wide") {
    if (striker) {
      striker.balls += 1;
      if (ball.kind === "run") {
        striker.runs += ball.runs;
        if (ball.runs === 4) striker.fours += 1;
        if (ball.runs === 6) striker.sixes += 1;
      }
    }
  }

  // Update bowler stats
  if (bowler) {
    if (ball.kind !== "bye" && ball.kind !== "legbye") {
      bowler.runsConceded += ball.runs;
    }
    if (ball.kind !== "wide" && ball.kind !== "noball") {
      bowler.ballsBowled += 1;
    }
    if (ball.wicket) {
      bowler.wickets += 1;
    }
  }

  if (ball.wicket && striker) {
    striker.outInfo = bowler ? `b ${bowler.name}` : "Out";
  }

  innings.runs += ball.runs;
  innings.wickets += ball.wicket ? 1 : 0;
  innings.legalBalls += ball.legal ? 1 : 0;
  if (ball.extra) innings.extras[ball.extra] += ball.runs;
  innings.balls.push(ball);

  // Bring next batsman in if wicket fell (unless all out)
  if (ball.wicket && innings.wickets < maxWicketsForTeam(innings.team)) {
    if (state.scoringMode === "advanced") {
      promptNewBatter("striker");
    } else {
      let nextIndex = -1;
      for (let i = 0; i < innings.batters.length; i++) {
        if (i !== innings.currentStrikerIndex && i !== innings.currentNonStrikerIndex && innings.batters[i].outInfo === "Not Out") {
          nextIndex = i;
          break;
        }
      }
      if (nextIndex !== -1) {
        if (innings.slot1BatterIndex === innings.currentStrikerIndex) {
          innings.slot1BatterIndex = nextIndex;
        } else {
          innings.slot2BatterIndex = nextIndex;
        }
        innings.currentStrikerIndex = nextIndex;
      }
    }
  }

  if (isInningsClosed(innings)) innings.closed = true;

  // Swap ends on odd runs scored off bat, bye or legbye
  if ((ball.kind === "run" || ball.kind === "bye" || ball.kind === "legbye") && (ball.runs % 2 === 1)) {
    const temp = innings.currentStrikerIndex;
    innings.currentStrikerIndex = innings.currentNonStrikerIndex;
    innings.currentNonStrikerIndex = temp;
  }

  // Swap ends at the end of the over
  if (ball.legal && innings.legalBalls % 6 === 0 && innings.legalBalls > 0) {
    const temp = innings.currentStrikerIndex;
    innings.currentStrikerIndex = innings.currentNonStrikerIndex;
    innings.currentNonStrikerIndex = temp;

    if (state.scoringMode === "advanced" && !isInningsClosed(innings) && !winnerText()) {
      promptNewBowler();
    } else {
      // Cycle bowler automatically (user can manually change via select dropdown)
      if (innings.bowlers.length > 0) {
        innings.currentBowlerIndex = (innings.currentBowlerIndex + 1) % innings.bowlers.length;
      }
    }
    showToast("Over complete.");
  }

  if (winnerText()) {
    showToast(winnerText());
  } else if (isInningsClosed(innings)) {
    showToast("Innings complete.");
  }

  render();
}

function showToast(message) {
  els.toast.textContent = message;
  els.toast.classList.add("show");
  window.clearTimeout(showToast.timer);
  showToast.timer = window.setTimeout(() => els.toast.classList.remove("show"), 2300);
}

document.querySelectorAll("[data-run]").forEach((button) => {
  button.addEventListener("click", () => {
    const runs = Number(button.dataset.run);
    addBall({ kind: "run", runs, legal: true, wicket: false });
  });
});

document.querySelector("[data-extra='wd']").addEventListener("click", () => {
  addBall({ kind: "wide", runs: 1, legal: false, wicket: false, extra: "wd" });
});

document.querySelector("[data-extra='nb']").addEventListener("click", () => {
  addBall({ kind: "noball", runs: 1, legal: false, wicket: false, extra: "nb" });
});

document.querySelector("[data-extra='b']").addEventListener("click", () => {
  addBall({ kind: "bye", runs: 1, legal: true, wicket: false, extra: "b" });
});

document.querySelector("[data-extra='lb']").addEventListener("click", () => {
  addBall({ kind: "legbye", runs: 1, legal: true, wicket: false, extra: "lb" });
});

document.querySelector("[data-wicket]").addEventListener("click", () => {
  addBall({ kind: "wicket", runs: 0, legal: true, wicket: true });
});

els.undoBtn.addEventListener("click", () => {
  const currentHistory = state.history;
  const previous = currentHistory.pop();
  if (!previous) {
    showToast("Nothing to undo yet.");
    return;
  }
  state = previous;
  state.history = currentHistory;
  render();
});

els.inningsBtn.addEventListener("click", () => {
  syncInputs();
  if (isTestMatch()) {
    const next = nextTeamForTest();
    if (!next) {
      showToast("Close this innings first, or the match has a result.");
      return;
    }
    remember();
    if (Number.isInteger(next.existing)) {
      state.innings = next.existing;
    } else {
      state.inningsData.push(createInnings(next.team, next.number));
      state.innings = state.inningsData.length - 1;
    }
    render();
    if (state.scoringMode === "advanced" && currentInnings().currentStrikerIndex === -1) {
      setTimeout(() => { promptNewBatter("striker"); }, 100);
    }
    return;
  }
  if (state.innings === 1) return;
  remember();
  closeCurrentInnings();
  state.innings = 1;
  showToast(`${state.teamB} start their chase.`);
  render();
  if (state.scoringMode === "advanced" && currentInnings().currentStrikerIndex === -1) {
    setTimeout(() => { promptNewBatter("striker"); }, 100);
  }
});

els.declareBtn.addEventListener("click", () => {
  if (!isTestMatch() || isInningsClosed() || winnerText()) return;
  remember();
  closeCurrentInnings("declared");
  showToast(`${battingTeam()} declared.`);
  render();
});

els.followOnBtn.addEventListener("click", () => {
  if (!canEnforceFollowOn()) return;
  remember();
  closeCurrentInnings("follow-on");
  currentInnings().followOn = true;
  state.followOnEnforced = true;
  state.inningsData.push(createInnings(1, 2, true));
  state.innings = state.inningsData.length - 1;
  showToast(`${state.teamA} enforced the follow-on.`);
  render();
});

els.drawBtn.addEventListener("click", () => {
  if (!isTestMatch() || winnerText()) return;
  remember();
  state.result = "Match drawn.";
  render();
});

if (els.resetBtn) {
  els.resetBtn.addEventListener("click", () => {
    const keepSetup = {
      teamA: els.teamA.value.trim() || defaultState.teamA,
      teamB: els.teamB.value.trim() || defaultState.teamB,
      maxOvers: Math.max(1, Math.min(100, Number(els.maxOvers.value) || 20)),
      playersTeamA: Math.max(2, Math.min(11, Number(els.playersTeamA.value) || 11)),
      playersTeamB: Math.max(2, Math.min(11, Number(els.playersTeamB.value) || 11)),
      day: Math.max(1, Math.min(5, Number(els.matchDay.value) || 1)),
      format: state.format,
    };
    state = { ...clone(defaultState), ...keepSetup, day: 1 };
    showToast("Match reset.");
    render();
  });
}

[els.teamA, els.teamB, els.maxOvers, els.playersTeamA, els.playersTeamB, els.matchDay].forEach((input) => {
  if (input) {
    input.addEventListener("input", () => {
      syncInputs();
      render();
    });
  }
});

document.querySelectorAll("[data-soon]").forEach((button) => {
  button.addEventListener("click", () => {
    showToast(`${button.dataset.soon} tracking can be added next. Cricket is active now.`);
  });
});

document.querySelector("[data-open-sport='cricket']").addEventListener("click", () => {
  showFormatPage();
});

let pendingFormat = "Custom";

document.querySelectorAll("[data-format]").forEach((button) => {
  button.addEventListener("click", () => {
    const format = button.dataset.format;
    pendingFormat = format;

    // Reset player rosters so a new match starts fresh
    state.customTeamAPlayers = [];
    state.customTeamBPlayers = [];

    // Prefill fields
    els.customTeamA.value = state.teamA;
    els.customTeamB.value = state.teamB;
    els.customOvers.value = format === "Test" ? 90 : 20;
    els.customPlayersA.value = "";
    els.customPlayersB.value = "";

    const setupTitle = document.querySelector("#setup-title");
    if (setupTitle) {
      setupTitle.textContent = `${format} Match Setup`;
    }

    els.customSetup.classList.remove("hidden");
    syncScoringModeUI();
    renderCustomPlayerInputs();
    updateCustomBatFirstOptions();
    els.customSetup.scrollIntoView({ behavior: "smooth" });
  });
});

els.customFormatBtn.addEventListener("click", () => {
  pendingFormat = "Custom";

  // Reset player rosters so a new match starts fresh
  state.customTeamAPlayers = [];
  state.customTeamBPlayers = [];

  // Prefill fields
  els.customTeamA.value = state.teamA;
  els.customTeamB.value = state.teamB;
  els.customOvers.value = state.maxOvers;
  els.customPlayersA.value = "";
  els.customPlayersB.value = "";

  const setupTitle = document.querySelector("#setup-title");
  if (setupTitle) {
    setupTitle.textContent = "Custom Match Setup";
  }

  els.customSetup.classList.remove("hidden");
  syncScoringModeUI();
  renderCustomPlayerInputs();
  updateCustomBatFirstOptions();
  els.customSetup.scrollIntoView({ behavior: "smooth" });
});

const updateCustomBatFirstOptions = () => {
  const nameA = els.customTeamA.value.trim() || "Team 1";
  const nameB = els.customTeamB.value.trim() || "Team 2";
  const btn1 = document.querySelector("#btn-batfirst-1");
  const btn2 = document.querySelector("#btn-batfirst-2");
  if (btn1) btn1.textContent = nameA;
  if (btn2) btn2.textContent = nameB;
};

const btnBatFirst1 = document.querySelector("#btn-batfirst-1");
const btnBatFirst2 = document.querySelector("#btn-batfirst-2");
if (btnBatFirst1 && btnBatFirst2) {
  btnBatFirst1.addEventListener("click", () => {
    btnBatFirst1.classList.add("active");
    btnBatFirst2.classList.remove("active");
  });
  btnBatFirst2.addEventListener("click", () => {
    btnBatFirst2.classList.add("active");
    btnBatFirst1.classList.remove("active");
  });
}

if (els.customTeamA) els.customTeamA.addEventListener("input", updateCustomBatFirstOptions);
if (els.customTeamB) els.customTeamB.addEventListener("input", updateCustomBatFirstOptions);

els.startCustomMatch.addEventListener("click", () => {
  const btn1 = document.querySelector("#btn-batfirst-1");
  const btn2 = document.querySelector("#btn-batfirst-2");
  const isSelected = (btn1 && btn1.classList.contains("active")) || (btn2 && btn2.classList.contains("active"));
  if (!isSelected) {
    showToast("Please select who is batting first.");
    return;
  }

  const tAVal = els.customTeamA ? els.customTeamA.value.trim() : "";
  const tBVal = els.customTeamB ? els.customTeamB.value.trim() : "";
  if (tAVal && tBVal && tAVal.toLowerCase() === tBVal.toLowerCase()) {
    showToast("Team names must be unique. Please use different names for the two teams.");
    return;
  }

  const valA = els.customPlayersA ? els.customPlayersA.value.trim() : "";
  const valB = els.customPlayersB ? els.customPlayersB.value.trim() : "";
  if (!valA || !valB) {
    showToast("Please enter the number of players.");
    return;
  }
  const customPlayersA = Number(valA);
  const customPlayersB = Number(valB);
  if (isNaN(customPlayersA) || customPlayersA < 2 || customPlayersA > 11 || isNaN(customPlayersB) || customPlayersB < 2 || customPlayersB > 11) {
    showToast("Players per team must be a number between 2 and 11.");
    return;
  }
  const customOvers = Math.max(1, Math.min(100, Number(els.customOvers.value) || 20));

  if (state.scoringMode === "advanced") {
    const inputsA = document.querySelectorAll(".custom-team-a-player-input");
    const inputsB = document.querySelectorAll(".custom-team-b-player-input");

    const tempA = Array.from(inputsA).map(inp => inp.value.trim());
    const tempB = Array.from(inputsB).map(inp => inp.value.trim());

    let okA = tempA.length >= customPlayersA;
    if (okA) {
      for (let i = 0; i < customPlayersA; i++) {
        const val = tempA[i];
        if (!val || val === "" || val.toLowerCase().includes("player")) {
          okA = false;
          break;
        }
      }
    }

    let okB = tempB.length >= customPlayersB;
    if (okB) {
      for (let i = 0; i < customPlayersB; i++) {
        const val = tempB[i];
        if (!val || val === "" || val.toLowerCase().includes("player")) {
          okB = false;
          break;
        }
      }
    }

    if (!okA || !okB) {
      showToast("Please fill all the player names first.");
      
      const containerA = document.querySelector("#custom-team-a-players-inputs");
      if (containerA && containerA.style.display === "none") {
        containerA.style.display = "grid";
        if (els.btnConfigurePlayersA) els.btnConfigurePlayersA.textContent = "Hide Player Names";
        renderCustomPlayerInputs();
      }
      const containerB = document.querySelector("#custom-team-b-players-inputs");
      if (containerB && containerB.style.display === "none") {
        containerB.style.display = "grid";
        if (els.btnConfigurePlayersB) els.btnConfigurePlayersB.textContent = "Hide Player Names";
        renderCustomPlayerInputs();
      }
      return;
    }

    // Validate unique player names
    const allNames = new Set();
    for (let i = 0; i < customPlayersA; i++) {
      const val = tempA[i];
      const valKey = val.toLowerCase();
      if (allNames.has(valKey)) {
        showToast(`All player names must be unique. Duplicate found: "${val}". Please edit.`);
        return;
      }
      allNames.add(valKey);
    }
    for (let i = 0; i < customPlayersB; i++) {
      const val = tempB[i];
      const valKey = val.toLowerCase();
      if (allNames.has(valKey)) {
        showToast(`All player names must be unique. Duplicate found: "${val}". Please edit.`);
        return;
      }
      allNames.add(valKey);
    }

    const btnBat2 = document.querySelector("#btn-batfirst-2");
    const isTeam2BattingFirst = btnBat2 && btnBat2.classList.contains("active");
    
    if (isTeam2BattingFirst) {
      state.customTeamAPlayers = tempB;
      state.customTeamBPlayers = tempA;
    } else {
      state.customTeamAPlayers = tempA;
      state.customTeamBPlayers = tempB;
    }
  }

  const btnBat2 = document.querySelector("#btn-batfirst-2");
  const isTeam2BattingFirst = btnBat2 && btnBat2.classList.contains("active");
  
  const finalTeamA = isTeam2BattingFirst ? (els.customTeamB.value.trim() || defaultState.teamB) : (els.customTeamA.value.trim() || defaultState.teamA);
  const finalTeamB = isTeam2BattingFirst ? (els.customTeamA.value.trim() || defaultState.teamA) : (els.customTeamB.value.trim() || defaultState.teamB);
  const finalPlayersA = isTeam2BattingFirst ? customPlayersB : customPlayersA;
  const finalPlayersB = isTeam2BattingFirst ? customPlayersA : customPlayersB;

  startFormat(pendingFormat, customOvers, {
    teamA: finalTeamA,
    teamB: finalTeamB,
    playersTeamA: finalPlayersA,
    playersTeamB: finalPlayersB,
  });
  saveState();
  render();
  showCricketPage();
  showToast(`${state.format} match started.`);
});

els.backToSportsFromFormat.addEventListener("click", () => {
  showSportsPage();
});

els.backToFormats.addEventListener("click", () => {
  if (state.tournamentActive) {
    showTournamentDashboard();
  } else {
    showFormatPage();
  }
});

if (els.tournamentFormatBtn) {
  els.tournamentFormatBtn.addEventListener("click", () => {
    showTournamentChoice();
  });
}

if (els.btnResumeTournament) {
  els.btnResumeTournament.addEventListener("click", () => {
    resumeSelectedTournament();
  });
}

if (els.btnNewTournamentChoice) {
  els.btnNewTournamentChoice.addEventListener("click", () => {
    archiveCurrentTournament();
    state.tournamentActive = false;
    state.activeTournamentHistoryIndex = -1;
    state.tournamentTeams = [];
    state.tournamentFixtures = [];
    state.tournamentActiveFixtureIndex = -1;
    state.tournamentCount = (state.tournamentCount || 1) + 1;
    saveState();
    showTournamentSetup();
    showToast("Create a new tournament.");
  });
}

if (els.backToFormatsFromTchoice) {
  els.backToFormatsFromTchoice.addEventListener("click", () => {
    showFormatPage();
  });
}

if (els.backToFormatsFromTsetup) {
  els.backToFormatsFromTsetup.addEventListener("click", () => {
    showTournamentChoice();
  });
}

if (els.tournamentTeamCount) {
  els.tournamentTeamCount.addEventListener("change", () => {
    state.setupTeamCount = Number(els.tournamentTeamCount.value) || 4;
    renderTournamentTeamInputs();
    saveState();
  });
}

if (els.tournamentNameInput) {
  els.tournamentNameInput.addEventListener("input", () => {
    state.setupTournamentName = els.tournamentNameInput.value;
    saveState();
  });
}

if (els.tournamentOvers) {
  els.tournamentOvers.addEventListener("input", () => {
    state.setupOvers = Number(els.tournamentOvers.value) || 20;
    saveState();
  });
}

if (els.tournamentPlayersCount) {
  els.tournamentPlayersCount.addEventListener("input", () => {
    validatePlayersInput(els.tournamentPlayersCount, document.querySelector("#error-tournament-players-count"));
    const count = Math.max(2, Math.min(11, Number(els.tournamentPlayersCount.value) || 11));
    state.tournamentPlayersCount = count;
    
    if (state.setupTeamRosters) {
      for (const key in state.setupTeamRosters) {
        const roster = state.setupTeamRosters[key];
        const savedName = state.setupTeamNames && state.setupTeamNames[key] !== undefined ? state.setupTeamNames[key] : (IPL_TEAM_NAMES[key] || 'Team ' + (Number(key)+1));
        const abbr = getTeamAbbr(savedName);
        
        if (roster.length < count) {
          while (roster.length < count) {
            roster.push("");
          }
        } else if (roster.length > count) {
          const isAllEmpty = roster.every(name => !name || name.trim() === "");
          if (isAllEmpty) {
            roster.splice(count);
          }
        }
      }
    }
    saveState();
    renderTournamentTeamInputs();
  });
}

if (els.startTournamentBtn) {
  els.startTournamentBtn.addEventListener("click", () => {
    generateTournament();
  });
}

if (els.resetTournamentBtn) {
  els.resetTournamentBtn.addEventListener("click", () => {
    archiveCurrentTournament();
    state.tournamentActive = false;
    state.activeTournamentHistoryIndex = -1;
    state.tournamentTeams = [];
    state.tournamentFixtures = [];
    state.tournamentActiveFixtureIndex = -1;
    state.tournamentCount = (state.tournamentCount || 1) + 1;
    state.setupTeamRosters = {};
    state.setupTeamNames = [];
    saveState();
    showTournamentSetup();
    showToast("Tournament archived & reset.");
  });
}

if (els.tabPointsTable) {
  els.tabPointsTable.addEventListener("click", () => {
    state = loadState();
    els.tabPointsTable.classList.add("active");
    if (els.tabFixtures) els.tabFixtures.classList.remove("active");
    if (els.tabStats) els.tabStats.classList.remove("active");
    if (els.tabInfo) els.tabInfo.classList.remove("active");
    if (els.tabEdit) els.tabEdit.classList.remove("active");
    if (els.tableView) els.tableView.classList.remove("hidden");
    if (els.fixturesView) els.fixturesView.classList.add("hidden");
    if (els.statsView) els.statsView.classList.add("hidden");
    if (els.infoView) els.infoView.classList.add("hidden");
    if (els.editTournamentView) els.editTournamentView.classList.add("hidden");
    renderTournamentDashboard();
  });
}

if (els.tabFixtures) {
  els.tabFixtures.addEventListener("click", () => {
    state = loadState();
    els.tabFixtures.classList.add("active");
    if (els.tabPointsTable) els.tabPointsTable.classList.remove("active");
    if (els.tabStats) els.tabStats.classList.remove("active");
    if (els.tabInfo) els.tabInfo.classList.remove("active");
    if (els.tabEdit) els.tabEdit.classList.remove("active");
    if (els.fixturesView) els.fixturesView.classList.remove("hidden");
    if (els.tableView) els.tableView.classList.add("hidden");
    if (els.statsView) els.statsView.classList.add("hidden");
    if (els.infoView) els.infoView.classList.add("hidden");
    if (els.editTournamentView) els.editTournamentView.classList.add("hidden");
    renderTournamentDashboard();
  });
}

if (els.tabStats) {
  els.tabStats.addEventListener("click", () => {
    state = loadState();
    els.tabStats.classList.add("active");
    if (els.tabPointsTable) els.tabPointsTable.classList.remove("active");
    if (els.tabFixtures) els.tabFixtures.classList.remove("active");
    if (els.tabInfo) els.tabInfo.classList.remove("active");
    if (els.tabEdit) els.tabEdit.classList.remove("active");
    if (els.statsView) els.statsView.classList.remove("hidden");
    if (els.tableView) els.tableView.classList.add("hidden");
    if (els.fixturesView) els.fixturesView.classList.add("hidden");
    if (els.infoView) els.infoView.classList.add("hidden");
    if (els.editTournamentView) els.editTournamentView.classList.add("hidden");
    renderTournamentStats();
  });
}

if (els.tabInfo) {
  els.tabInfo.addEventListener("click", () => {
    state = loadState();
    els.tabInfo.classList.add("active");
    if (els.tabPointsTable) els.tabPointsTable.classList.remove("active");
    if (els.tabFixtures) els.tabFixtures.classList.remove("active");
    if (els.tabStats) els.tabStats.classList.remove("active");
    if (els.tabEdit) els.tabEdit.classList.remove("active");
    if (els.infoView) els.infoView.classList.remove("hidden");
    if (els.tableView) els.tableView.classList.add("hidden");
    if (els.fixturesView) els.fixturesView.classList.add("hidden");
    if (els.statsView) els.statsView.classList.add("hidden");
    if (els.editTournamentView) els.editTournamentView.classList.add("hidden");
    renderTournamentInfoView();
  });
}

if (els.tabEdit) {
  els.tabEdit.addEventListener("click", () => {
    els.tabEdit.classList.add("active");
    if (els.tabPointsTable) els.tabPointsTable.classList.remove("active");
    if (els.tabFixtures) els.tabFixtures.classList.remove("active");
    if (els.tabStats) els.tabStats.classList.remove("active");
    if (els.tabInfo) els.tabInfo.classList.remove("active");
    if (els.editTournamentView) els.editTournamentView.classList.remove("hidden");
    if (els.tableView) els.tableView.classList.add("hidden");
    if (els.fixturesView) els.fixturesView.classList.add("hidden");
    if (els.statsView) els.statsView.classList.add("hidden");
    if (els.infoView) els.infoView.classList.add("hidden");
    renderTournamentEditView();
  });
}

const btnCloseTournamentEdit = document.querySelector("#btn-close-tournament-edit");
if (btnCloseTournamentEdit) {
  btnCloseTournamentEdit.addEventListener("click", () => {
    state = loadState();
    if (els.tabPointsTable) els.tabPointsTable.click();
  });
}


if (els.submitTournamentBtn) {
  els.submitTournamentBtn.addEventListener("click", () => {
    submitTournamentMatchResult();
  });
}

if (els.btnFullScorecard) {
  els.btnFullScorecard.addEventListener("click", () => {
    if (els.scorecardModal) {
      const current = currentInnings();
      scorecardActiveTeamIndex = current ? current.team : 0;
      els.scorecardModal.classList.remove("hidden");
      renderFullScorecardModal();
    }
  });
}

if (els.closeScorecardModal) {
  els.closeScorecardModal.addEventListener("click", () => {
    if (els.scorecardModal) {
      els.scorecardModal.classList.add("hidden");
    }
  });
}

const scorecardTeamABtn = document.querySelector("#btn-scorecard-team-a");
const scorecardTeamBBtn = document.querySelector("#btn-scorecard-team-b");
if (scorecardTeamABtn) {
  scorecardTeamABtn.addEventListener("click", () => {
    scorecardActiveTeamIndex = 0;
    renderFullScorecardModal();
  });
}
if (scorecardTeamBBtn) {
  scorecardTeamBBtn.addEventListener("click", () => {
    scorecardActiveTeamIndex = 1;
    renderFullScorecardModal();
  });
}

if (els.selectStriker) {
  els.selectStriker.addEventListener("change", (e) => {
    const innings = currentInnings();
    const nextVal = Number(e.target.value);
    if (innings.slot1BatterIndex === innings.currentStrikerIndex) {
      innings.slot1BatterIndex = nextVal;
    } else {
      innings.slot2BatterIndex = nextVal;
    }
    innings.currentStrikerIndex = nextVal;
    saveState();
    render();
  });
}

if (els.selectNonStriker) {
  els.selectNonStriker.addEventListener("change", (e) => {
    const innings = currentInnings();
    const nextVal = Number(e.target.value);
    if (innings.slot1BatterIndex === innings.currentNonStrikerIndex) {
      innings.slot1BatterIndex = nextVal;
    } else {
      innings.slot2BatterIndex = nextVal;
    }
    innings.currentNonStrikerIndex = nextVal;
    saveState();
    render();
  });
}

if (els.selectBowler) {
  els.selectBowler.addEventListener("change", (e) => {
    const innings = currentInnings();
    innings.currentBowlerIndex = Number(e.target.value);
    saveState();
    render();
  });
}

// CricPulse Helpers & Timers



// Nav Header Button Event Listeners
if (els.navSportsBtn) {
  els.navSportsBtn.addEventListener("click", () => {
    showSportsPage();
    render();
  });
}
if (els.navFormatsBtn) {
  els.navFormatsBtn.addEventListener("click", () => {
    showFormatPage();
    render();
  });
}

// Theme toggle logic
const themeToggleBtn = document.querySelector("#theme-toggle");
const themeLabel = document.querySelector("#theme-switch-label");

function initTheme() {
  const storedTheme = localStorage.getItem("scoretracker-theme");
  const isLight = storedTheme === "light";
  setTheme(isLight);
}

function setTheme(isLight) {
  if (isLight) {
    document.documentElement.classList.add("light-theme");
    if (themeToggleBtn) themeToggleBtn.setAttribute("aria-checked", "false");
    if (themeLabel) themeLabel.textContent = "Light Mode";
    localStorage.setItem("scoretracker-theme", "light");
  } else {
    document.documentElement.classList.remove("light-theme");
    if (themeToggleBtn) themeToggleBtn.setAttribute("aria-checked", "true");
    if (themeLabel) themeLabel.textContent = "Dark Mode";
    localStorage.setItem("scoretracker-theme", "dark");
  }
}

if (themeToggleBtn) {
  themeToggleBtn.addEventListener("click", () => {
    const isCurrentlyLight = document.documentElement.classList.contains("light-theme");
    setTheme(!isCurrentlyLight);
  });
}
initTheme();

// Player inputs max limit validations
function validatePlayersInput(inputEl, errorEl) {
  if (!inputEl) return;
  const val = Number(inputEl.value);
  if (val > 11) {
    inputEl.value = 11;
    if (errorEl) {
      errorEl.classList.remove("hidden");
      clearTimeout(errorEl.timer);
      errorEl.timer = setTimeout(() => {
        errorEl.classList.add("hidden");
      }, 2500);
    }
  } else if (errorEl && val <= 11) {
    errorEl.classList.add("hidden");
  }
}

const inputsToValidate = [
  { input: document.querySelector("#custom-players-a"), error: document.querySelector("#error-custom-players-a") },
  { input: document.querySelector("#custom-players-b"), error: document.querySelector("#error-custom-players-b") },
  { input: document.querySelector("#players-team-a"), error: document.querySelector("#error-players-team-a") },
  { input: document.querySelector("#players-team-b"), error: document.querySelector("#error-players-team-b") }
];

inputsToValidate.forEach(({ input, error }) => {
  if (input) {
    input.addEventListener("input", () => {
      validatePlayersInput(input, error);
      if (input.id === "custom-players-a" || input.id === "custom-players-b") {
        renderCustomPlayerInputs();
      } else if (input.id === "players-team-a" || input.id === "players-team-b") {
        renderLivePagePlayerInputs();
      }
    });
  }
});

// Bind listeners for team name inputs to dynamically update abbreviations
const customTeamAEl = document.querySelector("#custom-team-a");
const customTeamBEl = document.querySelector("#custom-team-b");
if (customTeamAEl) customTeamAEl.addEventListener("input", renderCustomPlayerInputs);
if (customTeamBEl) customTeamBEl.addEventListener("input", renderCustomPlayerInputs);

const liveTeamAEl = document.querySelector("#team-a");
const liveTeamBEl = document.querySelector("#team-b");
if (liveTeamAEl) liveTeamAEl.addEventListener("input", renderLivePagePlayerInputs);
if (liveTeamBEl) liveTeamBEl.addEventListener("input", renderLivePagePlayerInputs);

// Bind player name configuration toggle buttons
if (els.btnConfigurePlayersA) {
  els.btnConfigurePlayersA.addEventListener("click", () => {
    const container = document.querySelector("#custom-team-a-players-inputs");
    if (container) {
      const isHidden = container.style.display === "none";
      container.style.display = isHidden ? "grid" : "none";
      els.btnConfigurePlayersA.textContent = isHidden ? "Hide Player Names" : "Enter Player Names";
      if (isHidden) renderCustomPlayerInputs();
    }
  });
}

if (els.btnConfigurePlayersB) {
  els.btnConfigurePlayersB.addEventListener("click", () => {
    const container = document.querySelector("#custom-team-b-players-inputs");
    if (container) {
      const isHidden = container.style.display === "none";
      container.style.display = isHidden ? "grid" : "none";
      els.btnConfigurePlayersB.textContent = isHidden ? "Hide Player Names" : "Enter Player Names";
      if (isHidden) renderCustomPlayerInputs();
    }
  });
}



if (els.btnModeSimple) {
  els.btnModeSimple.addEventListener("click", () => {
    state.scoringMode = "simple";
    saveState();
    syncScoringModeUI();
  });
}

if (els.btnModeAdvanced) {
  els.btnModeAdvanced.addEventListener("click", () => {
    state.scoringMode = "advanced";
    saveState();
    syncScoringModeUI();
  });
}

if (els.btnTModeSimple) {
  els.btnTModeSimple.addEventListener("click", () => {
    state.scoringMode = "simple";
    saveState();
    syncScoringModeUI();
    renderTournamentTeamInputs();
  });
}

if (els.btnTModeAdvanced) {
  els.btnTModeAdvanced.addEventListener("click", () => {
    state.scoringMode = "advanced";
    saveState();
    syncScoringModeUI();
    renderTournamentTeamInputs();
  });
}

if (els.closeSquadModal) {
  els.closeSquadModal.addEventListener("click", () => {
    if (els.squadModal) {
      els.squadModal.classList.add("hidden");
    }
    activeSquadFixtureIndex = -1;
  });
}

if (els.squadEditShortcutBtn) {
  els.squadEditShortcutBtn.addEventListener("click", () => {
    if (els.squadModal) {
      els.squadModal.classList.add("hidden");
    }
    activeSquadFixtureIndex = -1;
    if (els.tabEdit) {
      els.tabEdit.click();
    }
  });
}

if (els.btnSquadTossTeamA) {
  els.btnSquadTossTeamA.addEventListener("click", () => {
    squadBatFirstTeam = 0;
    els.btnSquadTossTeamA.classList.add("active");
    els.btnSquadTossTeamB.classList.remove("active");
  });
}

if (els.btnSquadTossTeamB) {
  els.btnSquadTossTeamB.addEventListener("click", () => {
    squadBatFirstTeam = 1;
    els.btnSquadTossTeamA.classList.remove("active");
    els.btnSquadTossTeamB.classList.add("active");
  });
}

if (els.btnSquadPlay) {
  els.btnSquadPlay.addEventListener("click", () => {
    if (activeSquadFixtureIndex === -1) return;

    if (squadBatFirstTeam === -1) {
      showToast("Please select who is batting first.");
      return;
    }

    const fixture = state.tournamentFixtures[activeSquadFixtureIndex];
    if (!fixture) return;

    const count = Math.max(2, Math.min(11, state.tournamentPlayersCount || 11));

    const checkboxesA = document.querySelectorAll(".squad-checkbox-a");
    const inputsA = document.querySelectorAll(".squad-input-a");
    const selectedPlayersA = [];
    checkboxesA.forEach((cb, idx) => {
      if (cb.checked) {
        selectedPlayersA.push(inputsA[idx].value.trim());
      }
    });

    const checkboxesB = document.querySelectorAll(".squad-checkbox-b");
    const inputsB = document.querySelectorAll(".squad-input-b");
    const selectedPlayersB = [];
    checkboxesB.forEach((cb, idx) => {
      if (cb.checked) {
        selectedPlayersB.push(inputsB[idx].value.trim());
      }
    });

    if (selectedPlayersA.length !== count) {
      showToast(`Please select exactly ${count} players for ${fixture.teamA}. Currently selected: ${selectedPlayersA.length}`);
      return;
    }
    if (selectedPlayersB.length !== count) {
      showToast(`Please select exactly ${count} players for ${fixture.teamB}. Currently selected: ${selectedPlayersB.length}`);
      return;
    }

    state.customTeamAPlayers = selectedPlayersA;
    state.customTeamBPlayers = selectedPlayersB;
    state.playersTeamA = count;
    state.playersTeamB = count;

    if (els.squadModal) {
      els.squadModal.classList.add("hidden");
    }

    loadTournamentFixture(activeSquadFixtureIndex, squadBatFirstTeam, count);
    activeSquadFixtureIndex = -1;
  });
}

if (els.btnChangeBowlerModal) {
  els.btnChangeBowlerModal.addEventListener("click", () => {
    promptNewBowler();
  });
}

if (els.btnChangeStriker) {
  els.btnChangeStriker.addEventListener("click", () => {
    promptNewBatter("striker");
  });
}

if (els.btnChangeNonStriker) {
  els.btnChangeNonStriker.addEventListener("click", () => {
    promptNewBatter("nonstriker");
  });
}

if (els.closeBowlerSelectModal) {
  els.closeBowlerSelectModal.addEventListener("click", () => {
    if (els.bowlerSelectModal) {
      els.bowlerSelectModal.classList.add("hidden");
    }
  });
}

if (els.closeBatterSelectModal) {
  els.closeBatterSelectModal.addEventListener("click", () => {
    if (els.batterSelectModal) {
      els.batterSelectModal.classList.add("hidden");
    }
  });
}

// Delegate fixture button clicks to prevent multiple stacking listeners
if (els.fixturesList) {
  els.fixturesList.addEventListener("click", (e) => {
    const viewScorecardBtn = e.target.closest(".btn-view-completed-scorecard");
    if (viewScorecardBtn) {
      const index = Number(viewScorecardBtn.dataset.fixtureIndex);
      if (state.tournamentFixtures && state.tournamentFixtures[index]) {
        const fixture = state.tournamentFixtures[index];
        if (fixture.matchState) {
          scorecardSourceCtx = {
            ...fixture.matchState,
            teamA: fixture.teamA,
            teamB: fixture.teamB,
            scoringMode: state.scoringMode || "advanced",
            result: fixture.matchState.result || `${fixture.teamA} vs ${fixture.teamB}`
          };
          scorecardActiveTeamIndex = scorecardSourceCtx.inningsData[0].team;
          if (els.scorecardModal) {
            els.scorecardModal.classList.remove("hidden");
            renderFullScorecardModal();
          }
        }
      }
      return;
    }

    const btn = e.target.closest(".fixture-btn");
    if (!btn) return;
    
    const index = Number(btn.dataset.fixtureIndex);
    if (!state.tournamentFixtures || !state.tournamentFixtures[index]) return;
    
    const fixture = state.tournamentFixtures[index];
    const isNewMatch = !fixture.matchState;
    const isAdvanced = state.scoringMode === "advanced";
    if (isNewMatch && isAdvanced) {
      openSquadModal(index);
    } else {
      loadTournamentFixture(index);
    }
  });
}

syncScoringModeUI();

// Initialize Hash Routing
window.addEventListener("hashchange", () => {
  navigateByHash(window.location.hash);
  render();
});

// Initialize Page state on reload/load
showSportsPage();
render();
