
window.addEventListener("error", (e) => {
  alert(`Global Error: ${e.message} at ${e.filename}:${e.lineno}`);
});
console.log("ScoreTracker App loaded - version 208");

const STORAGE_KEY = "cricket-score-tracker-v1";

const els = {
  welcomePage: document.querySelector("#welcome-page"),
  navHomeBtn: document.querySelector("#nav-btn-home"),
  welcomeEnterBtn: document.querySelector("#welcome-enter-btn"),
  welcomeTournamentBtn: document.querySelector("#welcome-tournament-btn"),
  welcomeCricketBtn: document.querySelector("#welcome-cricket-btn"),
  sportsPage: document.querySelector("#sports-page"),
  reviewPage: document.querySelector("#review-page"),
  reviewBackBtn: document.querySelector("#review-back-btn"),
  formatPage: document.querySelector("#format-page"),
  cricketPage: document.querySelector("#cricket-page"),
  footballPage: document.querySelector("#football-page"),
  tennisPage: document.querySelector("#tennis-page"),
  badmintonPage: document.querySelector("#badminton-page"),
  hockeyPage: document.querySelector("#hockey-page"),
  volleyballPage: document.querySelector("#volleyball-page"),
  baseballPage: document.querySelector("#baseball-page"),
  rugbyPage: document.querySelector("#rugby-page"),
  kabaddiPage: document.querySelector("#kabaddi-page"),
  tabletennisPage: document.querySelector("#tabletennis-page"),
  golfPage: document.querySelector("#golf-page"),
  boxingPage: document.querySelector("#boxing-page"),
  mmaPage: document.querySelector("#mma-page"),
  pickleballPage: document.querySelector("#pickleball-page"),
  padelPage: document.querySelector("#padel-page"),
  squashPage: document.querySelector("#squash-page"),
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
  matchOverModal: document.querySelector("#match-over-modal"),
  closeMatchOverModal: document.querySelector("#close-match-over-modal"),
  matchOverWinnerTitle: document.querySelector("#match-over-winner-title"),
  matchOverResultBadge: document.querySelector("#match-over-result-badge"),
  matchOverScoresSummary: document.querySelector("#match-over-scores-summary"),
  btnPlayNextMatch: document.querySelector("#btn-play-next-match"),
  btnModalViewScorecard: document.querySelector("#btn-modal-view-scorecard"),
  btnModalDismiss: document.querySelector("#btn-modal-dismiss"),
  nextInningsModal: document.querySelector("#next-innings-modal"),
  closeNextInningsModal: document.querySelector("#close-next-innings-modal"),
  nextInningsModalTitle: document.querySelector("#next-innings-modal-title"),
  nextInningsModalSubtitle: document.querySelector("#next-innings-modal-subtitle"),
  nextInningsModalBadge: document.querySelector("#next-innings-modal-badge"),
  nextInningsModalSummary: document.querySelector("#next-innings-modal-summary"),
  btnModalNextInnings: document.querySelector("#btn-modal-next-innings"),
  btnNextInningsViewScorecard: document.querySelector("#btn-next-innings-view-scorecard"),
  btnNextInningsDismiss: document.querySelector("#btn-next-innings-dismiss"),
  scorecardModal: document.querySelector("#scorecard-modal"),
  closeScorecardModal: document.querySelector("#close-scorecard-modal"),
  btnTopScoreboard: document.querySelector("#btn-top-scoreboard"),
  btnActionScoreboard: document.querySelector("#btn-action-scoreboard"),
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
  overCompleteModal: document.querySelector("#over-complete-modal"),
  closeOverModal: document.querySelector("#close-over-modal"),
  btnOverModalContinue: document.querySelector("#btn-over-modal-continue"),
  btnRetireHurt: document.querySelector("#btn-retire-hurt"),
  retireHurtModal: document.querySelector("#retire-hurt-modal"),
  closeRetireHurtModal: document.querySelector("#close-retire-hurt-modal"),
  btnRetireStrikerChoice: document.querySelector("#btn-retire-striker-choice"),
  btnRetireNonstrikerChoice: document.querySelector("#btn-retire-nonstriker-choice"),
  btnCancelRetireHurt: document.querySelector("#btn-cancel-retire-hurt"),
};

let matchOverModalShownFor = null;
let nextInningsModalShownFor = null;

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
  scoringMode: null,
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
  setupOvers: null,
  setupTeamNames: []
};

let state = loadState();

function hideAllPages() {
  if (els.welcomePage) els.welcomePage.classList.add("hidden");
  if (els.sportsPage) els.sportsPage.classList.add("hidden");
  if (els.reviewPage) els.reviewPage.classList.add("hidden");
  if (els.formatPage) els.formatPage.classList.add("hidden");
  if (els.cricketPage) els.cricketPage.classList.add("hidden");
  if (els.customSetup) els.customSetup.classList.add("hidden");
  if (els.tournamentSetup) els.tournamentSetup.classList.add("hidden");
  if (els.tournamentDashboard) els.tournamentDashboard.classList.add("hidden");
  if (els.tournamentChoice) els.tournamentChoice.classList.add("hidden");
  if (els.footballPage) els.footballPage.classList.add("hidden");
  if (els.tennisPage) els.tennisPage.classList.add("hidden");
  if (els.badmintonPage) els.badmintonPage.classList.add("hidden");
  if (els.hockeyPage) els.hockeyPage.classList.add("hidden");
  if (els.volleyballPage) els.volleyballPage.classList.add("hidden");
  if (els.baseballPage) els.baseballPage.classList.add("hidden");
  if (els.rugbyPage) els.rugbyPage.classList.add("hidden");
  if (els.kabaddiPage) els.kabaddiPage.classList.add("hidden");
  if (els.tabletennisPage) els.tabletennisPage.classList.add("hidden");
  if (els.golfPage) els.golfPage.classList.add("hidden");
  if (els.boxingPage) els.boxingPage.classList.add("hidden");
  if (els.mmaPage) els.mmaPage.classList.add("hidden");
  if (els.pickleballPage) els.pickleballPage.classList.add("hidden");
  if (els.padelPage) els.padelPage.classList.add("hidden");
  if (els.squashPage) els.squashPage.classList.add("hidden");
}
window.hideAllPages = hideAllPages;

function showWelcomePage(fromHash = false) {
  if (!fromHash) window.location.hash = "#welcome";
  hideAllPages();
  if (els.welcomePage) els.welcomePage.classList.remove("hidden");
  
  if (els.navHomeBtn) els.navHomeBtn.classList.add("hidden");
  if (els.navSportsBtn) els.navSportsBtn.classList.remove("hidden");
  if (els.navFormatsBtn) els.navFormatsBtn.classList.add("hidden");
  if (els.navLiveIndicator) {
    if (typeof hasActiveCricketMatch === "function" && hasActiveCricketMatch()) {
      els.navLiveIndicator.classList.remove("hidden");
    } else {
      els.navLiveIndicator.classList.add("hidden");
    }
  }
  window.scrollTo({ top: 0, behavior: "smooth" });
}

function showSportsPage(fromHash = false) {
  if (!fromHash) window.location.hash = "#sports";
  hideAllPages();
  if (els.sportsPage) els.sportsPage.classList.remove("hidden");
  
  if (els.navHomeBtn) els.navHomeBtn.classList.remove("hidden");
  if (els.navSportsBtn) els.navSportsBtn.classList.add("hidden");
  if (els.navFormatsBtn) els.navFormatsBtn.classList.add("hidden");
  if (els.navLiveIndicator) {
    if (typeof hasActiveCricketMatch === "function" && hasActiveCricketMatch()) {
      els.navLiveIndicator.classList.remove("hidden");
    } else {
      els.navLiveIndicator.classList.add("hidden");
    }
  }
  if (typeof updateSportsHubCricketStatus === "function") {
    updateSportsHubCricketStatus();
  }
  window.scrollTo({ top: 0, behavior: "smooth" });
}

function showReviewPage(fromHash = false) {
  if (!fromHash) window.location.hash = "#review";
  hideAllPages();
  if (els.reviewPage) els.reviewPage.classList.remove("hidden");
  
  if (els.navHomeBtn) els.navHomeBtn.classList.remove("hidden");
  if (els.navSportsBtn) els.navSportsBtn.classList.remove("hidden");
  if (els.navFormatsBtn) els.navFormatsBtn.classList.add("hidden");
  if (els.navLiveIndicator) els.navLiveIndicator.classList.add("hidden");
  window.scrollTo({ top: 0, behavior: "instant" });
}
window.showReviewPage = showReviewPage;

function showFormatPage(fromHash = false) {
  if (!fromHash) window.location.hash = "#formats";
  hideAllPages();
  if (els.formatPage) els.formatPage.classList.remove("hidden");
  
  if (els.navHomeBtn) els.navHomeBtn.classList.remove("hidden");
  if (els.navSportsBtn) els.navSportsBtn.classList.remove("hidden");
  if (els.navFormatsBtn) els.navFormatsBtn.classList.add("hidden");
  if (els.navLiveIndicator) {
    if (typeof hasActiveCricketMatch === "function" && hasActiveCricketMatch()) {
      els.navLiveIndicator.classList.remove("hidden");
    } else {
      els.navLiveIndicator.classList.add("hidden");
    }
  }
  if (typeof updateActiveMatchBanner === "function") {
    updateActiveMatchBanner();
  }
  window.scrollTo({ top: 0, behavior: "smooth" });
}

function showCricketPage(fromHash = false) {
  if (!fromHash) window.location.hash = "#match";
  hideAllPages();
  if (els.cricketPage) els.cricketPage.classList.remove("hidden");
  
  if (els.navHomeBtn) els.navHomeBtn.classList.remove("hidden");
  if (els.navSportsBtn) els.navSportsBtn.classList.remove("hidden");
  if (els.navFormatsBtn) els.navFormatsBtn.classList.remove("hidden");
  if (els.navLiveIndicator) els.navLiveIndicator.classList.remove("hidden");
  render();
}
window.showCricketPage = showCricketPage;

function showFootballPage(fromHash = false) {
  if (!fromHash) window.location.hash = "#football";
  hideAllPages();
  if (els.footballPage) els.footballPage.classList.remove("hidden");
  
  if (els.navHomeBtn) els.navHomeBtn.classList.remove("hidden");
  if (els.navSportsBtn) els.navSportsBtn.classList.remove("hidden");
  if (els.navFormatsBtn) els.navFormatsBtn.classList.add("hidden");
  if (els.navLiveIndicator) els.navLiveIndicator.classList.add("hidden");
}
window.showFootballPage = showFootballPage;
window.showSportsPage = showSportsPage;
window.showFormatPage = showFormatPage;
window.showWelcomePage = showWelcomePage;

function showTournamentSetup(fromHash = false) {
  if (!fromHash) {
    window.location.hash = "#tsetup";
    state.setupTeamRosters = {};
    state.setupTeamNames = [];
    state.tournamentPlayersCount = undefined;
    state.scoringMode = null;
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
    els.tournamentOvers.value = "";
    els.tournamentOvers.placeholder = "e.g. 20";
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

function syncMobileBottomNav(route) {
  const items = document.querySelectorAll(".mobile-bottom-nav-item");
  if (!items || !items.length) return;

  const current = route || window.location.hash || "#welcome";
  items.forEach((item) => {
    const itemRoute = item.getAttribute("data-mobile-route");
    if (itemRoute === "#welcome") {
      if (current === "#welcome" || !current || current === "#") {
        item.classList.add("active");
      } else {
        item.classList.remove("active");
      }
    } else if (itemRoute === "#sports") {
      const isSportView = current === "#sports" ||
        current === "#match" ||
        current === "#tdashboard" ||
        current === "#tsetup" ||
        current === "#tchoice" ||
        current.startsWith("#football") ||
        current.startsWith("#basketball") ||
        current.startsWith("#tennis") ||
        current.startsWith("#badminton") ||
        current.startsWith("#hockey") ||
        current.startsWith("#volleyball") ||
        current.startsWith("#baseball") ||
        current.startsWith("#rugby") ||
        current.startsWith("#kabaddi") ||
        current.startsWith("#tabletennis") ||
        current.startsWith("#golf") ||
        current.startsWith("#boxing") ||
        current.startsWith("#mma") ||
        current.startsWith("#pickleball") ||
        current.startsWith("#padel") ||
        current.startsWith("#squash");

      if (isSportView) {
        item.classList.add("active");
      } else {
        item.classList.remove("active");
      }
    } else if (itemRoute === "#formats") {
      if (current === "#formats") {
        item.classList.add("active");
      } else {
        item.classList.remove("active");
      }
    } else if (itemRoute === "#review") {
      if (current === "#review") {
        item.classList.add("active");
      } else {
        item.classList.remove("active");
      }
    } else {
      item.classList.remove("active");
    }
  });
}
window.syncMobileBottomNav = syncMobileBottomNav;

function initMobileBottomNav() {
  const bottomNav = document.querySelector("#mobile-bottom-nav");
  if (!bottomNav) return;

  bottomNav.addEventListener("click", (e) => {
    const btn = e.target.closest(".mobile-bottom-nav-item");
    if (!btn) return;

    const action = btn.getAttribute("data-mobile-action");
    if (action === "vault") {
      if (window.AuthVault && typeof window.AuthVault.openVaultModal === "function") {
        window.AuthVault.openVaultModal("matches");
      }
      return;
    }

    const targetRoute = btn.getAttribute("data-mobile-route");
    if (!targetRoute) return;

    if (targetRoute === "#welcome") {
      showWelcomePage();
    } else if (targetRoute === "#sports") {
      showSportsPage();
    } else if (targetRoute === "#formats") {
      showFormatPage();
    } else if (targetRoute === "#review") {
      showReviewPage();
    }
    syncMobileBottomNav(targetRoute);
  });
}
window.initMobileBottomNav = initMobileBottomNav;

function navigateByHash(hash) {
  syncMobileBottomNav(hash);
  if (hash === "#welcome" || !hash) {
    showWelcomePage(true);
    return;
  }

  if (hash === "#review") {
    showReviewPage(true);
    return;
  }

  // Ensure all prior pages (especially welcome landing page) are hidden
  hideAllPages();
  if (els.welcomePage) els.welcomePage.classList.add("hidden");
  if (els.navHomeBtn) els.navHomeBtn.classList.remove("hidden");
  if (els.navSportsBtn) els.navSportsBtn.classList.remove("hidden");

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
  } else if (hash.startsWith("#badminton")) {
    if (typeof window.showBadmintonPage === "function") {
      window.showBadmintonPage(true);
    }
  } else if (hash.startsWith("#hockey")) {
    if (typeof window.showHockeyPage === "function") {
      window.showHockeyPage(true);
    }
  } else if (hash.startsWith("#volleyball")) {
    if (typeof window.showVolleyballPage === "function") {
      window.showVolleyballPage(true);
    }
  } else if (hash.startsWith("#baseball")) {
    if (typeof window.showBaseballPage === "function") {
      window.showBaseballPage(true);
    }
  } else if (hash.startsWith("#rugby")) {
    if (typeof window.showRugbyPage === "function") {
      window.showRugbyPage(true);
    }
  } else if (hash.startsWith("#kabaddi")) {
    if (typeof window.showKabaddiPage === "function") {
      window.showKabaddiPage(true);
    }
  } else if (hash.startsWith("#tabletennis")) {
    if (typeof window.showTableTennisPage === "function") {
      window.showTableTennisPage(true);
    }
  } else if (hash.startsWith("#golf")) {
    if (typeof window.showGolfPage === "function") {
      window.showGolfPage(true);
    }
  } else if (hash.startsWith("#boxing")) {
    if (typeof window.showBoxingPage === "function") {
      window.showBoxingPage(true);
    }
  } else if (hash.startsWith("#mma")) {
    if (typeof window.showMmaPage === "function") {
      window.showMmaPage(true);
    }
  } else if (hash.startsWith("#pickleball")) {
    if (typeof window.showPickleballPage === "function") {
      window.showPickleballPage(true);
    }
  } else if (hash.startsWith("#padel")) {
    if (typeof window.showPadelPage === "function") {
      window.showPadelPage(true);
    }
  } else if (hash.startsWith("#squash")) {
    if (typeof window.showSquashPage === "function") {
      window.showSquashPage(true);
    }
  } else if (hash === "#tdashboard" && state.tournamentActive) {
    showTournamentDashboard(true);
  } else if (hash === "#tsetup") {
    showTournamentSetup(true);
  } else if (hash === "#tchoice") {
    showTournamentChoice(true);
  } else if (hash === "#formats") {
    showFormatPage(true);
  } else if (hash === "#sports") {
    showSportsPage(true);
  } else {
    showWelcomePage(true);
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
  if (!state.scoringMode) {
    showToast("Please select a scoring mode (Simple Tracker or Advanced) to proceed.");
    highlightScoringModeButtons("tournament");
    return;
  }

  const oversVal = els.tournamentOvers ? els.tournamentOvers.value.trim() : "";
  if (!oversVal) {
    showToast("Please enter the number of overs.");
    if (els.tournamentOvers) els.tournamentOvers.focus();
    return;
  }
  const tournamentOversNum = Number(oversVal);
  if (isNaN(tournamentOversNum) || tournamentOversNum < 1 || tournamentOversNum > 50) {
    showToast("Overs per match must be a number between 1 and 50.");
    if (els.tournamentOvers) els.tournamentOvers.focus();
    return;
  }

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
  state.maxOvers = tournamentOversNum;
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
  nextState.setupOvers = nextState.setupOvers || null;
  nextState.setupTeamNames = nextState.setupTeamNames || [];
  nextState.customTeamAPlayers = nextState.customTeamAPlayers || [];
  nextState.customTeamBPlayers = nextState.customTeamBPlayers || [];
  nextState.scoringMode = (nextState.scoringMode === "simple" || nextState.scoringMode === "advanced") ? nextState.scoringMode : null;
  


  return nextState;
}

function saveState() {
  syncActiveTournamentToHistory();
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
    if (hasActiveCricketMatch()) {
      localStorage.setItem("cricket_active_match_backup", JSON.stringify(state));
    }
  } catch (e) {
    console.warn("Storage write failed", e);
  }
}

function hasActiveCricketMatch() {
  if (!state || !state.inningsData || !state.inningsData.length) return false;
  if (state.tournamentActive) return false; // Tournaments have their own fixture engine
  if (state.result) return false; // Match has ended
  const totalBalls = state.inningsData.reduce((acc, inn) => acc + (inn.balls ? inn.balls.length : 0), 0);
  const totalRuns = state.inningsData.reduce((acc, inn) => acc + (inn.runs || 0), 0);
  const totalWickets = state.inningsData.reduce((acc, inn) => acc + (inn.wickets || 0), 0);
  return totalBalls > 0 || totalRuns > 0 || totalWickets > 0;
}

function discardActiveCricketMatch() {
  state = {
    ...clone(defaultState),
    scoringMode: null
  };
  saveState();
  try {
    localStorage.removeItem("cricket_active_match_backup");
  } catch (e) {}
  updateActiveMatchBanner();
  updateSportsHubCricketStatus();
}

function updateActiveMatchBanner() {
  const banner = document.querySelector("#active-match-banner");
  if (!banner) return;
  
  if (hasActiveCricketMatch()) {
    banner.classList.remove("hidden");
    const teamsEl = document.querySelector("#active-match-teams");
    const summaryEl = document.querySelector("#active-match-summary");
    const inn = currentInnings();
    const ov = oversFromBalls(inn ? inn.legalBalls : 0);
    const totOv = state.maxOvers || (isTestMatch() ? 90 : 20);
    const crr = inn && inn.legalBalls ? (inn.runs / (inn.legalBalls / 6)).toFixed(2) : "0.00";
    const modeLabel = state.scoringMode === "advanced" ? "Advanced Mode" : "Normal Mode";
    const innLabel = inn ? `Innings ${inn.number}` : "1st Innings";
    
    if (teamsEl) {
      teamsEl.textContent = `${state.teamA} vs ${state.teamB}`;
    }
    if (summaryEl) {
      summaryEl.textContent = `${innLabel} • ${inn ? inn.runs : 0}/${inn ? inn.wickets : 0} (${ov}/${totOv} ov) • CRR: ${crr} • ${state.format || "Cricket"} • ${modeLabel}`;
    }
  } else {
    banner.classList.add("hidden");
  }
}

function updateSportsHubCricketStatus() {
  const cricketCard = document.querySelector("[data-open-sport='cricket']");
  if (!cricketCard) return;
  const statusTag = cricketCard.querySelector(".sport-status-tag");
  const footerAction = cricketCard.querySelector(".sport-card-footer span:first-child");
  if (hasActiveCricketMatch()) {
    const inn = currentInnings();
    if (statusTag) {
      statusTag.innerHTML = `🔴 In Progress`;
      statusTag.style.background = "rgba(239, 68, 68, 0.2)";
      statusTag.style.color = "#f87171";
      statusTag.style.borderColor = "rgba(239, 68, 68, 0.4)";
    }
    if (footerAction) {
      footerAction.textContent = `Resume (${inn ? inn.runs : 0}/${inn ? inn.wickets : 0})`;
    }
  } else {
    if (statusTag) {
      statusTag.innerHTML = `Ready`;
      statusTag.style.background = "";
      statusTag.style.color = "";
      statusTag.style.borderColor = "";
    }
    if (footerAction) {
      footerAction.textContent = "Score Match";
    }
  }
}

let pendingNewMatchCallback = null;

function promptOverwriteMatchConfirm(callback) {
  const modal = document.querySelector("#active-match-confirm-modal");
  const desc = document.querySelector("#confirm-overwrite-desc");
  if (!modal) {
    callback();
    return;
  }
  const inn = currentInnings();
  if (desc) {
    desc.textContent = `You have an ongoing match: "${state.teamA} vs ${state.teamB}" (${inn ? inn.runs : 0}/${inn ? inn.wickets : 0}, ${oversFromBalls(inn ? inn.legalBalls : 0)} ov). Starting a new match will replace it.`;
  }
  pendingNewMatchCallback = callback;
  modal.classList.remove("hidden");
}

function closeOverwriteModal() {
  const modal = document.querySelector("#active-match-confirm-modal");
  if (modal) modal.classList.add("hidden");
  pendingNewMatchCallback = null;
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
  } else {
    const batting = innings.team;
    const bowling = batting === 0 ? 1 : 0;
    if (inningsCount(batting) === 2 && inningsCount(bowling) === 2) {
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
  const total = state.maxOvers || (isTestMatch() ? 90 : 20);
  return `${innings.runs}/${innings.wickets} (${oversFromBalls(innings.legalBalls)}/${total} ov)`;
}

function target() {
  if (!isTestMatch()) {
    return state.innings === 1 && state.inningsData[0] ? state.inningsData[0].runs + 1 : null;
  }
  const current = currentInnings();
  if (!current) return null;
  const batting = current.team;
  const bowling = batting === 0 ? 1 : 0;
  const battingInnings = inningsCount(batting);
  const bowlingInnings = inningsCount(bowling);

  // In Test cricket, target ONLY exists in 4th innings (both teams in their 2nd innings)
  if (battingInnings === 2 && bowlingInnings === 2) {
    const batting1st = state.inningsData.find((i) => i.team === batting && i.number === 1);
    const batting1stRuns = batting1st ? batting1st.runs : 0;
    const targetRuns = teamTotal(bowling) - batting1stRuns + 1;
    return Math.max(1, targetRuns);
  }
  return null;
}

function winnerText() {
  if (state.result) return state.result;
  if (isTestMatch()) return testResult();

  const first = state.inningsData[0];
  const second = state.inningsData[1];

  if (state.innings === 0 || !isInningsClosed(second)) return "";
  const t = target() || (first.runs + 1);
  if (second.runs >= t) return `${teamName(second.team)} won by ${maxWicketsForTeam(second.team) - second.wickets} wickets.`;
  if (second.runs === first.runs) return "Match tied.";
  return `${teamName(first.team)} won by ${first.runs - second.runs} runs.`;
}

function isMatchFinishedTest() {
  const current = currentInnings();
  if (!current) return false;
  const batting = current.team;
  const bowling = batting === 0 ? 1 : 0;
  const battingTotal = teamTotal(batting);
  const bowlingTotal = teamTotal(bowling);
  const battingInnings = inningsCount(batting);
  const bowlingInnings = inningsCount(bowling);

  if (battingInnings === 2 && bowlingInnings === 2 && battingTotal > bowlingTotal) return true;
  if (isInningsClosed(current) && battingInnings === 2 && bowlingInnings === 2) return true;
  if (isInningsClosed(current) && battingInnings === 2 && bowlingInnings === 1 && battingTotal < bowlingTotal && current.wickets >= maxWicketsForTeam(current.team)) return true;
  return false;
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

  // 4th innings: Chasing team exceeded total
  if (battingInnings === 2 && bowlingInnings === 2 && battingTotal > bowlingTotal) {
    return `${teamName(batting)} won by ${maxWicketsForTeam(batting) - current.wickets} wickets.`;
  }
  // 4th innings: Chasing team all out with scores level -> Tie
  if (isInningsClosed(current) && battingInnings === 2 && bowlingInnings === 2 && battingTotal === bowlingTotal && current.wickets >= maxWicketsForTeam(current.team)) {
    return "Match tied.";
  }
  // 4th innings: Chasing team all out (or closed) while behind -> Defending team wins by runs
  if (isInningsClosed(current) && battingInnings === 2 && bowlingInnings === 2 && battingTotal < bowlingTotal) {
    return `${teamName(bowling)} won by ${bowlingTotal - battingTotal} runs.`;
  }
  // 3rd innings: Batting team all out while behind -> Defending team wins by innings and runs
  if (isInningsClosed(current) && battingInnings === 2 && bowlingInnings === 1 && battingTotal < bowlingTotal && current.wickets >= maxWicketsForTeam(current.team)) {
    return `${teamName(bowling)} won by an innings and ${bowlingTotal - battingTotal} runs.`;
  }
  // Match drawn on Day 5 if all innings finished or draw agreed
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
  if (!current || !isInningsClosed(current) || state.inningsData.length >= 4 || state.result || isMatchFinishedTest()) return null;
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
  if (!current) return "";
  const batting = current.team;
  const bowling = batting === 0 ? 1 : 0;
  const battingInnings = inningsCount(batting);
  const bowlingInnings = inningsCount(bowling);

  // 4th innings: Target chase
  if (battingInnings === 2 && bowlingInnings === 2) {
    const chaseTarget = target();
    if (chaseTarget !== null) {
      const needed = Math.max(0, chaseTarget - current.runs);
      if (needed === 0) return `${teamName(batting)} won the match!`;
      return `${teamName(batting)} need ${needed} run${needed === 1 ? "" : "s"} to win. Target ${chaseTarget}.`;
    }
  }

  // 1st innings of match
  if (battingInnings === 1 && bowlingInnings === 0) {
    return `${teamName(batting)} 1st innings`;
  }

  // 2nd or 3rd innings: Lead or Trail
  const diff = teamTotal(batting) - teamTotal(bowling);
  if (diff > 0) return `${teamName(batting)} lead by ${diff} run${diff === 1 ? "" : "s"}.`;
  if (diff < 0) return `${teamName(batting)} trail by ${Math.abs(diff)} run${Math.abs(diff) === 1 ? "" : "s"}.`;
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

  if (window.location.hash.startsWith("#football") || window.location.hash.startsWith("#basketball") || window.location.hash.startsWith("#tennis") || window.location.hash.startsWith("#badminton") || window.location.hash.startsWith("#hockey") || window.location.hash.startsWith("#volleyball") || window.location.hash.startsWith("#baseball") || window.location.hash.startsWith("#rugby") || window.location.hash.startsWith("#kabaddi") || window.location.hash.startsWith("#tabletennis") || window.location.hash.startsWith("#golf") || window.location.hash.startsWith("#boxing") || window.location.hash.startsWith("#mma")) {
    return;
  }
  els.teamA.value = state.teamA;
  els.teamB.value = state.teamB;
  els.maxOvers.value = state.maxOvers;
  if (els.playersTeamA) els.playersTeamA.value = state.playersTeamA || 11;
  if (els.playersTeamB) els.playersTeamB.value = state.playersTeamB || 11;
  els.matchDay.value = state.day;
  const totalOvers = state.maxOvers || (isTestMatch() ? 90 : 20);
  els.formatLabel.textContent = isTestMatch()
    ? `Test Match (${totalOvers} ov/day)`
    : `${state.format || "Cricket"} (${totalOvers} ov)`;

  const innings = currentInnings();
  const legalBalls = innings.legalBalls;
  const runRate = legalBalls ? (innings.runs / (legalBalls / 6)).toFixed(2) : "0.00";
  const chaseTarget = target();
  const required = chaseTarget
    ? Math.max(chaseTarget - (isTestMatch() ? innings.runs : teamTotal(innings.team)), 0)
    : null;
  const ballsLeft = !isTestMatch() && state.innings === 1 ? Math.max(state.maxOvers * 6 - innings.legalBalls, 0) : null;
  const result = winnerText();

  els.inningsLabel.textContent = `${teamName(innings.team)} ${innings.number}${innings.number === 1 ? "st" : "nd"} innings`;
  els.mainScore.textContent = `${innings.runs}/${innings.wickets}`;
  els.oversLabel.textContent = `${oversFromBalls(innings.legalBalls)} / ${totalOvers} overs`;
  els.runRate.textContent = runRate;
  els.targetLabel.textContent = chaseTarget || "-";
  els.needLabel.textContent = isTestMatch() ? (result || testIndicator() || "-") : result ? result : state.innings === 1 ? `${required} runs needed in ${ballsLeft} balls` : "-";
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
  if (els.cricketPage) {
    els.cricketPage.classList.toggle("mode-simple", isSimple);
    els.cricketPage.classList.toggle("mode-advanced", !isSimple);
  }
  if (isSimple) {
    if (els.liveBattersPanel) els.liveBattersPanel.classList.add("hidden");
    if (els.liveBatterSelectorRow) els.liveBatterSelectorRow.classList.add("hidden");
    if (els.liveBowlerSelectorRow) els.liveBowlerSelectorRow.classList.add("hidden");
    if (els.btnFullScorecard) els.btnFullScorecard.classList.add("hidden");
    const scoreboard = document.querySelector("#live-player-scoreboard");
    if (scoreboard) scoreboard.classList.add("hidden");
    if (els.btnChangeStriker) els.btnChangeStriker.classList.add("hidden");
    if (els.btnChangeNonStriker) els.btnChangeNonStriker.classList.add("hidden");
    if (els.btnChangeBowlerModal) els.btnChangeBowlerModal.classList.add("hidden");
    const strikerFooter = document.querySelector("#btn-striker-card .pitch-card-footer");
    const nonstrikerFooter = document.querySelector("#btn-nonstriker-card .pitch-card-footer");
    const bowlerFooter = document.querySelector("#btn-bowler-card .pitch-card-footer");
    if (strikerFooter) strikerFooter.classList.add("hidden");
    if (nonstrikerFooter) nonstrikerFooter.classList.add("hidden");
    if (bowlerFooter) bowlerFooter.classList.add("hidden");
  } else {
    if (els.liveBattersPanel) els.liveBattersPanel.classList.remove("hidden");
    if (els.liveBatterSelectorRow) els.liveBatterSelectorRow.classList.remove("hidden");
    if (els.liveBowlerSelectorRow) els.liveBowlerSelectorRow.classList.remove("hidden");
    if (els.btnFullScorecard) els.btnFullScorecard.classList.remove("hidden");
    const scoreboard = document.querySelector("#live-player-scoreboard");
    if (scoreboard) scoreboard.classList.remove("hidden");
    if (els.btnChangeStriker) els.btnChangeStriker.classList.remove("hidden");
    if (els.btnChangeNonStriker) els.btnChangeNonStriker.classList.remove("hidden");
    if (els.btnChangeBowlerModal) els.btnChangeBowlerModal.classList.remove("hidden");
    const strikerFooter = document.querySelector("#btn-striker-card .pitch-card-footer");
    const nonstrikerFooter = document.querySelector("#btn-nonstriker-card .pitch-card-footer");
    const bowlerFooter = document.querySelector("#btn-bowler-card .pitch-card-footer");
    if (strikerFooter) strikerFooter.classList.remove("hidden");
    if (nonstrikerFooter) nonstrikerFooter.classList.remove("hidden");
    if (bowlerFooter) bowlerFooter.classList.remove("hidden");
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
    els.matchNote.style.cursor = "pointer";
    els.matchNote.title = "Click to view match summary and play next match";
    if (matchOverModalShownFor !== result) {
      matchOverModalShownFor = result;
      showMatchOverModal(result);
    }
  } else {
    matchOverModalShownFor = null;
    els.matchNote.style.cursor = "";
    els.matchNote.title = "";
    if (els.matchOverModal) els.matchOverModal.classList.add("hidden");

    if (isTestMatch()) {
      els.matchNote.textContent = testIndicator() || `${battingTeam()} batting on day ${state.day}.`;
    } else if (state.innings === 1) {
      els.matchNote.textContent = `${battingTeam()} need ${required} runs in ${ballsLeft} balls.`;
    } else if (isInningsClosed(innings)) {
      els.matchNote.textContent = `${state.teamA} finished on ${innings.runs}/${innings.wickets}. Click Next Innings to start the chase.`;
      els.matchNote.style.cursor = "pointer";
      els.matchNote.title = "Click to open Next Innings pop-up";
      const inningsKey = `${state.innings}_${innings.runs}_${innings.wickets}_${innings.closed}`;
      if (nextInningsModalShownFor !== inningsKey) {
        nextInningsModalShownFor = inningsKey;
        showNextInningsModal();
      }
    } else {
      els.matchNote.textContent = `${battingTeam()} batting against ${bowlingTeam()}.`;
    }
    if (!isInningsClosed(innings)) {
      nextInningsModalShownFor = null;
      if (els.nextInningsModal) els.nextInningsModal.classList.add("hidden");
    }
  }

  // Render Man of the Match card (Only in Advanced Mode, disabled in Normal Mode)
  if (els.momCardContainer) {
    const isAdv = state.scoringMode === "advanced";
    if (isMatchOver && isAdv) {
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
        els.momCardContainer.innerHTML = "";
      }
    } else {
      els.momCardContainer.classList.add("hidden");
      els.momCardContainer.innerHTML = "";
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

  const maxOv = isTestMatch() ? 90 : (state.maxOvers || 20);
  const isMatchActive = !isInningsClosed(innings) && !winnerText() && (innings.legalBalls < (maxOv * 6));

  if (isMatchActive) {
    overs.push({
      number: Math.floor(legalBallsCount / 6) + 1,
      balls: currentOverBalls,
      isCurrent: true
    });
  } else if (currentOverBalls.length > 0) {
    overs.push({
      number: Math.floor(legalBallsCount / 6) + 1,
      balls: currentOverBalls,
      isCurrent: false
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

    if (over.isCurrent) {
      const legalInThisOver = over.balls.filter((b) => b.legal).length;
      const emptySlots = Math.max(0, 6 - legalInThisOver);
      for (let i = 0; i < emptySlots; i++) {
        const emptyItem = document.createElement("li");
        emptyItem.className = "ball-node ball-empty";
        emptyItem.textContent = "";
        ballsList.append(emptyItem);
      }
    }

    overRow.append(ballsList);
    els.recentBalls.append(overRow);
  });

  if (!displayOvers.length) {
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
    document.title = `${battingTeam()} ${innings.runs}/${innings.wickets} (${oversFromBalls(innings.legalBalls)}/${totalOvers} ov) • ScoreTracker`;
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

  // Update pitch hub striker card
  const strikerNameEl = document.querySelector("#live-striker-name");
  const strikerRunsEl = document.querySelector("#live-striker-runs");
  const strikerRatesEl = document.querySelector("#live-striker-rates");
  const strikerCard = document.querySelector("#btn-striker-card");

  // Update pitch hub non-striker card
  const nonstrikerNameEl = document.querySelector("#live-nonstriker-name");
  const nonstrikerRunsEl = document.querySelector("#live-nonstriker-runs");
  const nonstrikerRatesEl = document.querySelector("#live-nonstriker-rates");
  const nonstrikerCard = document.querySelector("#btn-nonstriker-card");

  const card1BadgeEl = document.querySelector("#live-card1-badge");
  const card2BadgeEl = document.querySelector("#live-card2-badge");
  const card1Header = document.querySelector("#card1-header");
  const card2Header = document.querySelector("#card2-header");
  const swapBtn = document.querySelector("#btn-swap-strike");
  const btnChange1 = document.querySelector("#btn-change-striker");
  const btnChange2 = document.querySelector("#btn-change-nonstriker");

  const isSlot2OnStrike = innings.currentStrikerIndex !== -1 && innings.currentStrikerIndex === innings.slot2BatterIndex;
  const isSlot1OnStrike = !isSlot2OnStrike;

  if (slot1Batter) {
    const sr = slot1Batter.balls > 0 ? ((slot1Batter.runs / slot1Batter.balls) * 100).toFixed(1) : "0.0";
    if (strikerNameEl) strikerNameEl.textContent = slot1Batter.name;
    if (strikerRunsEl) strikerRunsEl.innerHTML = `${slot1Batter.runs} <small>(${slot1Batter.balls})</small>`;
    if (strikerRatesEl) strikerRatesEl.textContent = `4s: ${slot1Batter.fours} • 6s: ${slot1Batter.sixes} • SR: ${sr}`;
  } else {
    const defaultLabel1 = state.scoringMode === "simple" ? (isSlot1OnStrike ? "Striker" : "Non-Striker") : (isSlot1OnStrike ? "Select Striker" : "Select Non-Striker");
    if (strikerNameEl) strikerNameEl.textContent = defaultLabel1;
    if (strikerRunsEl) strikerRunsEl.innerHTML = `0 <small>(0)</small>`;
    if (strikerRatesEl) strikerRatesEl.textContent = `4s: 0 • 6s: 0 • SR: 0.0`;
  }

  if (slot2Batter) {
    const sr = slot2Batter.balls > 0 ? ((slot2Batter.runs / slot2Batter.balls) * 100).toFixed(1) : "0.0";
    if (nonstrikerNameEl) nonstrikerNameEl.textContent = slot2Batter.name;
    if (nonstrikerRunsEl) nonstrikerRunsEl.innerHTML = `${slot2Batter.runs} <small>(${slot2Batter.balls})</small>`;
    if (nonstrikerRatesEl) nonstrikerRatesEl.textContent = `4s: ${slot2Batter.fours} • 6s: ${slot2Batter.sixes} • SR: ${sr}`;
  } else {
    const defaultLabel2 = state.scoringMode === "simple" ? (isSlot2OnStrike ? "Striker" : "Non-Striker") : (isSlot2OnStrike ? "Select Striker" : "Select Non-Striker");
    if (nonstrikerNameEl) nonstrikerNameEl.textContent = defaultLabel2;
    if (nonstrikerRunsEl) nonstrikerRunsEl.innerHTML = `0 <small>(0)</small>`;
    if (nonstrikerRatesEl) nonstrikerRatesEl.textContent = `4s: 0 • 6s: 0 • SR: 0.0`;
  }

  if (isSlot1OnStrike) {
    if (card1BadgeEl) card1BadgeEl.innerHTML = `<span class="pitch-role-badge striker-badge"><span class="pulse-indicator"></span> ON STRIKE</span>`;
    if (card2BadgeEl) card2BadgeEl.innerHTML = `<span class="pitch-role-badge nonstriker-badge" style="cursor: pointer;" title="Click to rotate strike">🏃 NON-STRIKER</span>`;
    if (strikerCard) {
      strikerCard.classList.add("active-strike");
      strikerCard.classList.add("striker");
      strikerCard.classList.remove("nonstriker");
      strikerCard.title = state.scoringMode === "simple" ? "Batter 1 (On Strike)" : "Batter 1 (On Strike) - Click to change batter";
    }
    if (nonstrikerCard) {
      nonstrikerCard.classList.remove("active-strike");
      nonstrikerCard.classList.add("nonstriker");
      nonstrikerCard.classList.remove("striker");
      nonstrikerCard.title = state.scoringMode === "simple" ? "Batter 2 (Non-Striker)" : "Batter 2 (Non-Striker) - Click to change batter";
    }
    if (swapBtn && card1Header && !card1Header.contains(swapBtn)) {
      card1Header.appendChild(swapBtn);
    }
    if (btnChange1) btnChange1.textContent = "Change Striker ▾";
    if (btnChange2) btnChange2.textContent = "Change Non-Striker ▾";
  } else {
    if (card1BadgeEl) card1BadgeEl.innerHTML = `<span class="pitch-role-badge nonstriker-badge" style="cursor: pointer;" title="Click to rotate strike">🏃 NON-STRIKER</span>`;
    if (card2BadgeEl) card2BadgeEl.innerHTML = `<span class="pitch-role-badge striker-badge"><span class="pulse-indicator"></span> ON STRIKE</span>`;
    if (strikerCard) {
      strikerCard.classList.remove("active-strike");
      strikerCard.classList.add("nonstriker");
      strikerCard.classList.remove("striker");
      strikerCard.title = state.scoringMode === "simple" ? "Batter 1 (Non-Striker)" : "Batter 1 (Non-Striker) - Click to change batter";
    }
    if (nonstrikerCard) {
      nonstrikerCard.classList.add("active-strike");
      nonstrikerCard.classList.add("striker");
      nonstrikerCard.classList.remove("nonstriker");
      nonstrikerCard.title = state.scoringMode === "simple" ? "Batter 2 (On Strike)" : "Batter 2 (On Strike) - Click to change batter";
    }
    if (swapBtn && card2Header && !card2Header.contains(swapBtn)) {
      card2Header.appendChild(swapBtn);
    }
    if (btnChange1) btnChange1.textContent = "Change Non-Striker ▾";
    if (btnChange2) btnChange2.textContent = "Change Striker ▾";
  }

  // Update pitch hub bowler card
  const bowlerNameEl = document.querySelector("#live-card-bowler-name");
  const bowlerFigsEl = document.querySelector("#live-bowler-figures");
  const bowlerEconEl = document.querySelector("#live-bowler-economy");
  const bowlerOverLabel = document.querySelector("#live-bowler-over-label");
  const bowlerCard = document.querySelector("#btn-bowler-card");
  if (bowlerCard) {
    bowlerCard.title = state.scoringMode === "simple" ? "Current Bowler" : "Current Bowler - Click to change bowler";
  }

  const currentOverNum = Math.floor(innings.legalBalls / 6) + 1;
  if (bowlerOverLabel) bowlerOverLabel.textContent = `Over ${currentOverNum}`;

  if (bowler) {
    const econ = bowler.ballsBowled > 0 ? (bowler.runsConceded / (bowler.ballsBowled / 6)).toFixed(2) : "0.00";
    if (bowlerNameEl) bowlerNameEl.textContent = state.scoringMode === "simple" ? "Bowler" : bowler.name;
    if (bowlerFigsEl) bowlerFigsEl.textContent = `${formatBowlerOvers(bowler.ballsBowled)}-${bowler.maidens || 0}-${bowler.runsConceded}-${bowler.wickets}`;
    if (bowlerEconEl) bowlerEconEl.textContent = `Econ: ${econ} RPO`;
  } else {
    if (bowlerNameEl) bowlerNameEl.textContent = state.scoringMode === "simple" ? "Bowler" : "Select Bowler";
    if (bowlerFigsEl) bowlerFigsEl.textContent = "0-0-0-0";
    if (bowlerEconEl) bowlerEconEl.textContent = "Econ: 0.00 RPO";
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

    const dismissalHTML = b.outInfo === "Retired Hurt"
      ? `<span style="color: #fb923c; font-weight: 600;">🩹 Retired Hurt</span>`
      : (b.outInfo === "Not Out" ? `<span style="color: #34d399; font-weight: 600;">not out</span>` : b.outInfo);

    html += `
      <tr style="border-bottom: 1px solid rgba(255,255,255,0.03);">
        <td style="padding: 10px 4px; font-weight: ${isStriker || isNonStriker ? '700' : 'normal'}; color: ${isStriker ? 'var(--gold)' : 'var(--ink)'};">${nameHTML}</td>
        <td style="padding: 10px 4px; color: var(--text-muted); font-size: 0.8rem;">${dismissalHTML}</td>
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

  const totalExtras = (innings.extras?.b || 0) + (innings.extras?.lb || 0) + (innings.extras?.wd || 0) + (innings.extras?.nb || 0);
  html += `
      <tr style="border-top: 1px solid rgba(255,255,255,0.06); font-size: 0.82rem;">
        <td colspan="2" style="padding: 8px 4px; color: var(--text-muted);">Extras</td>
        <td style="padding: 8px 4px; text-align: right; font-weight: 700;">${totalExtras}</td>
        <td colspan="4" style="padding: 8px 4px; text-align: right; color: var(--text-muted); font-size: 0.78rem;">(b ${innings.extras?.b || 0}, lb ${innings.extras?.lb || 0}, wd ${innings.extras?.wd || 0}, nb ${innings.extras?.nb || 0})</td>
      </tr>
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

  if (activeBowlers.length === 0) {
    html += `
      <tr>
        <td colspan="6" style="padding: 14px 4px; font-size: 0.82rem; color: var(--text-muted); font-style: italic; text-align: center;">
          No bowling figures recorded yet.
        </td>
      </tr>
    `;
  } else {
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
  }

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
    tabContainer.style.display = "grid";
    btnA.textContent = ctx.teamA || "Team 1";
    btnB.textContent = ctx.teamB || "Team 2";
    
    if (scorecardActiveTeamIndex === 0) {
      btnA.classList.add("active");
      btnB.classList.remove("active");
    } else {
      btnB.classList.add("active");
      btnA.classList.remove("active");
    }
  }

  const targetTeamName = scorecardActiveTeamIndex === 0 ? (ctx.teamA || "Team 1") : (ctx.teamB || "Team 2");
  const opponentTeamName = scorecardActiveTeamIndex === 0 ? (ctx.teamB || "Team 2") : (ctx.teamA || "Team 1");
  
  if (els.modalScorecardTitle) {
    els.modalScorecardTitle.textContent = `${targetTeamName} Scoreboard`;
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

  const battingInningsList = (ctx.inningsData || []).filter(inn => inn.team === scorecardActiveTeamIndex);
  if (battingContainer) {
    if (battingInningsList.length === 0) {
      battingContainer.innerHTML = `<div style="color: var(--text-muted); font-size: 0.85rem; font-style: italic; padding: 16px 8px; text-align: center;">Yet to bat.</div>`;
    } else {
      battingInningsList.forEach(innings => {
        battingContainer.innerHTML += generateBattingScorecardHtml(innings, ctx);
      });
    }
  }

  if (bowlingContainer) {
    if (battingInningsList.length === 0) {
      bowlingContainer.innerHTML = `<div style="color: var(--text-muted); font-size: 0.85rem; font-style: italic; padding: 16px 8px; text-align: center;">Yet to bowl.</div>`;
    } else {
      battingInningsList.forEach(innings => {
        bowlingContainer.innerHTML += generateBowlingScorecardHtml(innings, ctx);
      });
    }
  }
}

function showMatchOverModal(result) {
  if (!els.matchOverModal) return;

  let winnerTitle = "Match Completed!";
  let winnerEmoji = "🏆";
  let bannerBg = "rgba(255, 215, 0, 0.12)";
  let bannerBorder = "rgba(255, 215, 0, 0.3)";
  let bannerColor = "#ffdf79";

  if (result.includes(" won by ")) {
    const winnerName = result.split(" won by ")[0].trim();
    winnerTitle = `${winnerName} Won!`;
    winnerEmoji = "🏆";
  } else if (result.toLowerCase().includes("tied")) {
    winnerTitle = "Match Tied!";
    winnerEmoji = "🤝";
    bannerBg = "rgba(96, 165, 250, 0.12)";
    bannerBorder = "rgba(96, 165, 250, 0.3)";
    bannerColor = "#93c5fd";
  } else if (result.toLowerCase().includes("drawn")) {
    winnerTitle = "Match Drawn!";
    winnerEmoji = "🤝";
    bannerBg = "rgba(167, 139, 250, 0.12)";
    bannerBorder = "rgba(167, 139, 250, 0.3)";
    bannerColor = "#c4b5fd";
  }

  if (els.matchOverWinnerTitle) {
    els.matchOverWinnerTitle.textContent = `${winnerEmoji} ${winnerTitle}`;
  }
  if (els.matchOverResultBadge) {
    els.matchOverResultBadge.textContent = result;
    els.matchOverResultBadge.style.background = bannerBg;
    els.matchOverResultBadge.style.borderColor = bannerBorder;
    els.matchOverResultBadge.style.color = bannerColor;
  }

  if (els.matchOverScoresSummary) {
    const isTest = isTestMatch();
    const teamAInnings = (state.inningsData || []).filter(i => i.team === 0);
    const teamBInnings = (state.inningsData || []).filter(i => i.team === 1);

    const renderTeamScoreBlock = (teamName, teamColor, inningsList) => {
      const totalRuns = inningsList.reduce((sum, i) => sum + i.runs, 0);

      if (!isTest) {
        // Limited overs: Single clean line per team
        const inn = inningsList[0];
        const scoreStr = inn ? `${inn.runs}/${inn.wickets} <span style="font-size: 0.8rem; color: var(--text-muted); font-weight: normal;">(${oversFromBalls(inn.legalBalls)} ov)</span>` : "-";
        return `
          <div style="padding: 10px 14px; background: rgba(255,255,255,0.03); border-radius: 12px; border: 1px solid rgba(255,255,255,0.07); display: flex; justify-content: space-between; align-items: center;">
            <div style="font-weight: 700; color: ${teamColor}; display: flex; align-items: center; gap: 8px; font-size: 0.95rem;">
              <span>🏏</span> <span>${teamName}</span>
            </div>
            <div style="font-weight: 800; color: var(--ink); font-size: 0.95rem;">
              ${scoreStr}
            </div>
          </div>
        `;
      }

      // Test Match: Clean separate boxes for 1st Innings and 2nd Innings
      const inn1 = inningsList.find(i => i.number === 1);
      const inn2 = inningsList.find(i => i.number === 2);

      const inn1Str = inn1 ? `${inn1.runs}/${inn1.wickets} <span style="font-size: 0.75rem; color: var(--text-muted); font-weight: normal;">(${oversFromBalls(inn1.legalBalls)} ov)</span>` : `<span style="color: var(--text-muted); font-size: 0.8rem;">-</span>`;
      const inn2Str = inn2 ? `${inn2.runs}/${inn2.wickets} <span style="font-size: 0.75rem; color: var(--text-muted); font-weight: normal;">(${oversFromBalls(inn2.legalBalls)} ov)</span>` : `<span style="color: var(--text-muted); font-style: italic; font-size: 0.78rem;">Yet to bat</span>`;

      return `
        <div style="padding: 10px 12px; background: rgba(255,255,255,0.03); border-radius: 12px; border: 1px solid rgba(255,255,255,0.07); display: grid; gap: 6px;">
          <div style="display: flex; justify-content: space-between; align-items: center;">
            <div style="font-weight: 700; color: ${teamColor}; display: flex; align-items: center; gap: 8px; font-size: 0.95rem;">
              <span>🏏</span> <span>${teamName}</span>
            </div>
            <div style="font-weight: 800; color: #fff; font-size: 0.95rem;">
              ${totalRuns} <span style="font-size: 0.75rem; color: var(--text-muted); font-weight: 500;">Total</span>
            </div>
          </div>
          <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 8px;">
            <div style="background: rgba(255,255,255,0.04); padding: 6px 10px; border-radius: 8px; border: 1px solid rgba(255,255,255,0.06); text-align: left;">
              <div style="font-size: 0.68rem; color: var(--text-muted); text-transform: uppercase; font-weight: 700; letter-spacing: 0.5px; margin-bottom: 2px;">1st Innings</div>
              <div style="font-weight: 700; color: var(--ink); font-size: 0.88rem;">${inn1Str}</div>
            </div>
            <div style="background: rgba(255,255,255,0.04); padding: 6px 10px; border-radius: 8px; border: 1px solid rgba(255,255,255,0.06); text-align: left;">
              <div style="font-size: 0.68rem; color: var(--text-muted); text-transform: uppercase; font-weight: 700; letter-spacing: 0.5px; margin-bottom: 2px;">2nd Innings</div>
              <div style="font-weight: 700; color: var(--ink); font-size: 0.88rem;">${inn2Str}</div>
            </div>
          </div>
        </div>
      `;
    };

    els.matchOverScoresSummary.innerHTML = `
      <div style="display: grid; gap: 8px; width: 100%;">
        ${renderTeamScoreBlock(state.teamA, "var(--gold)", teamAInnings)}
        ${renderTeamScoreBlock(state.teamB, "#60a5fa", teamBInnings)}
      </div>
    `;
  }

  if (els.btnPlayNextMatch) {
    if (state.tournamentActive && state.tournamentActiveFixtureIndex !== -1) {
      els.btnPlayNextMatch.innerHTML = `<span>🏆</span> Submit & Next Fixture`;
    } else {
      els.btnPlayNextMatch.innerHTML = `<span>▶️</span> Play Next Match`;
    }
  }

  els.matchOverModal.classList.remove("hidden");
}

function showNextInningsModal() {
  if (!els.nextInningsModal) return;
  if (winnerText()) return;

  const innings = currentInnings();
  if (!innings) return;

  const isTest = isTestMatch();
  const currentTeamName = teamName(innings.team);
  const otherTeamName = teamName(innings.team === 0 ? 1 : 0);

  let nextTeamName = otherTeamName;
  let targetInfo = "";
  if (isTest) {
    const next = nextTeamForTest();
    if (next) {
      nextTeamName = teamName(next.team);
      if (next.number === 2 && inningsCount(0) >= 1 && inningsCount(1) >= 1) {
        const lead = teamTotal(innings.team) - teamTotal(next.team);
        if (lead > 0) {
          targetInfo = `${currentTeamName} leads by ${lead} runs`;
        } else if (lead < 0) {
          targetInfo = `${nextTeamName} trails by ${Math.abs(lead)} runs`;
        } else {
          targetInfo = `Scores are level`;
        }
      } else {
        targetInfo = `Test Match • Moving to ${nextTeamName}'s innings`;
      }
    } else {
      targetInfo = `Innings complete.`;
    }
  } else {
    const targetRuns = innings.runs + 1;
    const maxOv = state.maxOvers || 20;
    targetInfo = `Target: ${targetRuns} runs from ${maxOv} overs (${(targetRuns / maxOv).toFixed(2)} RPO)`;
  }

  if (els.nextInningsModalTitle) {
    els.nextInningsModalTitle.textContent = `🏏 ${innings.number}${innings.number === 1 ? "st" : "nd"} Innings Complete!`;
  }
  if (els.nextInningsModalSubtitle) {
    els.nextInningsModalSubtitle.textContent = `${currentTeamName} scored ${innings.runs}/${innings.wickets} in ${oversFromBalls(innings.legalBalls)} overs`;
  }
  if (els.nextInningsModalBadge) {
    els.nextInningsModalBadge.textContent = targetInfo;
  }
  if (els.nextInningsModalSummary) {
    const maxOv = state.maxOvers || (isTest ? 90 : 20);
    els.nextInningsModalSummary.innerHTML = `
      <div style="background: rgba(255, 255, 255, 0.04); border: 1px solid rgba(255, 255, 255, 0.08); border-radius: 12px; padding: 14px 16px; text-align: left; display: grid; gap: 8px;">
        <div style="display: flex; justify-content: space-between; align-items: center;">
          <span style="color: var(--text-muted); font-size: 0.85rem;">Total Runs</span>
          <strong style="font-size: 1.25rem; color: var(--gold);">${innings.runs} / ${innings.wickets}</strong>
        </div>
        <div style="display: flex; justify-content: space-between; align-items: center;">
          <span style="color: var(--text-muted); font-size: 0.85rem;">Overs Bowled</span>
          <span style="font-weight: 700; color: var(--ink);">${oversFromBalls(innings.legalBalls)} / ${maxOv} overs</span>
        </div>
        <div style="display: flex; justify-content: space-between; align-items: center;">
          <span style="color: var(--text-muted); font-size: 0.85rem;">Run Rate</span>
          <span style="font-weight: 700; color: #6ee7b7;">${innings.legalBalls ? (innings.runs / (innings.legalBalls / 6)).toFixed(2) : "0.00"}</span>
        </div>
        <div style="display: flex; justify-content: space-between; align-items: center;">
          <span style="color: var(--text-muted); font-size: 0.85rem;">Extras</span>
          <span style="font-size: 0.85rem; color: var(--text-muted);">${extrasTotal(innings)} (b ${innings.extras.b}, lb ${innings.extras.lb}, wd ${innings.extras.wd}, nb ${innings.extras.nb})</span>
        </div>
      </div>
      <div style="margin-top: 4px; padding: 10px 14px; background: rgba(59, 130, 246, 0.08); border: 1px solid rgba(59, 130, 246, 0.25); border-radius: 10px; font-size: 0.9rem; color: #93c5fd; text-align: center; font-weight: 600;">
        👉 Please click <strong>"Next Innings"</strong> below to begin ${nextTeamName}'s innings.
      </div>
    `;
  }
  if (els.btnModalNextInnings) {
    els.btnModalNextInnings.innerHTML = `<span>▶️</span> Click Next Innings (${nextTeamName})`;
  }

  els.nextInningsModal.classList.remove("hidden");
}

function showOverCompleteModal() {
  const innings = currentInnings();
  if (!innings) return;
  const modal = els.overCompleteModal || document.querySelector("#over-complete-modal");
  if (!modal) return;

  const overNum = Math.floor(innings.legalBalls / 6);
  const titleEl = document.querySelector("#over-modal-title");
  const subEl = document.querySelector("#over-modal-subtitle");
  const scoreEl = document.querySelector("#over-modal-score");
  const overRunsEl = document.querySelector("#over-modal-over-runs");
  const crrEl = document.querySelector("#over-modal-crr");
  const noteEl = document.querySelector("#over-modal-note");
  const btnContinue = els.btnOverModalContinue || document.querySelector("#btn-over-modal-continue");

  let runsInThisOver = 0;
  let legalCount = 0;
  for (let i = innings.balls.length - 1; i >= 0; i--) {
    const b = innings.balls[i];
    runsInThisOver += (b.runs || 0);
    if (b.legal) {
      legalCount++;
      if (legalCount === 6) break;
    }
  }

  const crr = innings.legalBalls > 0 ? (innings.runs / (innings.legalBalls / 6)).toFixed(2) : "0.00";
  const striker = innings.batters[innings.currentStrikerIndex];
  const strikerName = striker ? striker.name : "Batter";

  if (titleEl) titleEl.textContent = `Over ${overNum} Completed`;
  if (subEl) subEl.textContent = `${battingTeam()} batting`;
  if (scoreEl) scoreEl.textContent = `${innings.runs}/${innings.wickets}`;
  if (overRunsEl) overRunsEl.textContent = runsInThisOver;
  if (crrEl) crrEl.textContent = crr;
  if (noteEl) noteEl.textContent = `Strike rotated • ${strikerName} is now on strike.`;

  if (btnContinue) {
    btnContinue.innerHTML = `<span>▶</span> Start Next Over`;
  }

  modal.classList.remove("hidden");
}

function hideOverCompleteModal() {
  const modal = els.overCompleteModal || document.querySelector("#over-complete-modal");
  if (modal) modal.classList.add("hidden");
  render();
  const innings = currentInnings();
  if (state.scoringMode === "advanced" && innings && !isInningsClosed(innings) && !winnerText()) {
    promptNewBowler();
  }
}

function handleNextInnings() {
  if (els.nextInningsModal) {
    els.nextInningsModal.classList.add("hidden");
  }
  nextInningsModalShownFor = null;

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
    showToast(`${teamName(currentInnings().team)} start their innings.`);
    return;
  }

  if (state.innings === 1) return;
  remember();
  closeCurrentInnings();
  state.innings = 1;
  render();
  showToast(`${state.teamB} start their chase.`);
  if (state.scoringMode === "advanced" && currentInnings().currentStrikerIndex === -1) {
    setTimeout(() => { promptNewBatter("striker"); }, 100);
  }
}

function handlePlayNextMatch() {
  if (els.matchOverModal) {
    els.matchOverModal.classList.add("hidden");
  }
  matchOverModalShownFor = null;

  if (state.tournamentActive && state.tournamentActiveFixtureIndex !== -1) {
    submitTournamentMatchResult();
    return;
  }

  // Regular match reset for next match
  const keepSetup = {
    teamA: els.teamA ? (els.teamA.value.trim() || defaultState.teamA) : defaultState.teamA,
    teamB: els.teamB ? (els.teamB.value.trim() || defaultState.teamB) : defaultState.teamB,
    maxOvers: els.maxOvers ? Math.max(1, Math.min(100, Number(els.maxOvers.value) || 20)) : 20,
    playersTeamA: els.playersTeamA ? Math.max(2, Math.min(11, Number(els.playersTeamA.value) || 11)) : 11,
    playersTeamB: els.playersTeamB ? Math.max(2, Math.min(11, Number(els.playersTeamB.value) || 11)) : 11,
    format: state.format || "Custom",
    scoringMode: null,
    customTeamAPlayers: [],
    customTeamBPlayers: [],
  };
  state = { ...clone(defaultState), ...keepSetup, day: 1 };
  saveState();
  render();

  // Reset custom match setup container if visible so format cards are clearly visible
  if (els.customSetup) {
    els.customSetup.classList.add("hidden");
  }

  // Navigate to respective sport format & mode selection page
  showFormatPage();
  showToast("Select match format and mode to start next match.");
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
  if (state.scoringMode === "simple") return;
  const innings = currentInnings();
  if (!innings) return;

  const bwTeam = bowlingTeam();
  const teamBadge = document.querySelector("#modal-bowler-team-badge");
  if (teamBadge) teamBadge.textContent = `BOWLING: ${bwTeam}`;

  const currentBowlerIndex = innings.currentBowlerIndex;
  const currentOverNum = Math.floor(innings.legalBalls / 6) + 1;

  const searchInput = document.querySelector("#search-bowlers-input");
  if (searchInput) searchInput.value = "";

  const container = document.querySelector("#modal-bowlers-list");
  if (!container) return;

  const renderBowlerCards = (filterQuery = "") => {
    container.innerHTML = "";
    const q = filterQuery.trim().toLowerCase();

    let matchedCount = 0;
    innings.bowlers.forEach((b, idx) => {
      if (q && !b.name.toLowerCase().includes(q)) return;

      matchedCount++;
      const isJustBowled = idx === currentBowlerIndex && innings.legalBalls > 0;
      const econ = b.ballsBowled > 0 ? (b.runsConceded / (b.ballsBowled / 6)).toFixed(2) : "0.00";

      const btn = document.createElement("button");
      btn.type = "button";
      btn.className = "player-select-card";

      let statsHtml = "";
      if (isJustBowled) {
        btn.disabled = true;
        statsHtml = `<span style="color: #f87171; font-weight: 600;">⚠️ Just Bowled (Cannot bowl consecutive overs)</span>`;
      } else if (b.ballsBowled > 0) {
        statsHtml = `<span style="color: #60a5fa;">${formatBowlerOvers(b.ballsBowled)} ov • ${b.wickets} wkts / ${b.runsConceded} runs • Econ: ${econ}</span>`;
      } else {
        statsHtml = `<span style="color: #34d399; font-weight: 600;">⚡ Fresh Bowler • 0.0 overs</span>`;
      }

      btn.innerHTML = `
        <div class="psc-left">
          <span class="psc-num">#${idx + 1}</span>
          <div class="psc-info">
            <span class="psc-name">${b.name}</span>
            <span class="psc-stats">${statsHtml}</span>
          </div>
        </div>
        ${!isJustBowled ? `<span class="psc-btn" style="background: rgba(96,165,250,0.15); color: #60a5fa; border-color: rgba(96,165,250,0.3);">Select Bowler ➔</span>` : `<span style="font-size: 0.75rem; color: var(--text-muted); font-weight: 600;">Just Bowled</span>`}
      `;

      if (!isJustBowled) {
        btn.addEventListener("click", () => {
          innings.currentBowlerIndex = idx;
          saveState();
          render();
          if (els.bowlerSelectModal) {
            els.bowlerSelectModal.classList.add("hidden");
          }
        });
      }

      container.append(btn);
    });

    if (matchedCount === 0) {
      container.innerHTML = `
        <div style="text-align: center; padding: 24px 12px; color: var(--text-muted); font-size: 0.9rem;">
          No matching bowlers found.
        </div>
      `;
    }
  };

  renderBowlerCards("");

  if (searchInput) {
    searchInput.oninput = (e) => renderBowlerCards(e.target.value);
    setTimeout(() => searchInput.focus(), 150);
  }

  if (els.bowlerSelectModal) {
    els.bowlerSelectModal.classList.remove("hidden");
  }
}

let activeBatterSelectTarget = "striker";

function promptNewBatter(target = "striker") {
  if (state.scoringMode === "simple") return;
  activeBatterSelectTarget = target;
  const innings = currentInnings();
  if (!innings) return;

  const bTeam = battingTeam();
  const teamBadge = document.querySelector("#modal-batter-team-badge");
  if (teamBadge) teamBadge.textContent = `BATTING: ${bTeam}`;

  const titleEl = document.querySelector("#modal-batter-title");
  if (titleEl) {
    if (target === "striker") {
      titleEl.innerHTML = `Select Striker <span style="color:#f87171;">🔴</span>`;
    } else if (target === "nonstriker") {
      titleEl.innerHTML = `Select Non-Striker 🏃`;
    } else {
      titleEl.innerHTML = `Select Incoming Batter 🏏`;
    }
  }

  const searchInput = document.querySelector("#search-batters-input");
  if (searchInput) searchInput.value = "";

  const container = document.querySelector("#modal-batters-list");
  if (!container) return;

  const renderBatterCards = (filterQuery = "") => {
    container.innerHTML = "";
    const q = filterQuery.trim().toLowerCase();

    let matchedCount = 0;
    innings.batters.forEach((b, idx) => {
      const isCurrentlyBatting = idx === innings.currentStrikerIndex || idx === innings.currentNonStrikerIndex;
      const isRetiredHurt = b.outInfo === "Retired Hurt";
      const isOut = b.outInfo !== "Not Out" && !isRetiredHurt;

      if (q && !b.name.toLowerCase().includes(q)) return;

      matchedCount++;
      const btn = document.createElement("button");
      btn.type = "button";
      btn.className = "player-select-card";

      const sr = b.balls > 0 ? ((b.runs / b.balls) * 100).toFixed(1) : "0.0";
      let statsHtml = "";
      if (isOut) {
        btn.disabled = true;
        statsHtml = `<span style="color: #f87171; font-weight: 600;">Out: ${b.outInfo} (${b.runs} off ${b.balls}b)</span>`;
      } else if (isRetiredHurt) {
        statsHtml = `<span style="color: #fb923c; font-weight: 600;">🩹 Retired Hurt (${b.runs} off ${b.balls}b) • Available to Resume</span>`;
      } else if (isCurrentlyBatting) {
        btn.disabled = true;
        const role = idx === innings.currentStrikerIndex ? "Current Striker 🔴" : "Current Non-Striker 🏃";
        statsHtml = `<span style="color: var(--gold); font-weight: 600;">${role} • ${b.runs}* (${b.balls}b, SR ${sr})</span>`;
      } else if (b.balls > 0) {
        statsHtml = `<span style="color: #60a5fa;">${b.runs} runs (${b.balls}b) • 4s: ${b.fours} | 6s: ${b.sixes} • SR: ${sr}</span>`;
      } else {
        statsHtml = `<span style="color: #34d399; font-weight: 600;">⚡ Yet to Bat</span>`;
      }

      btn.innerHTML = `
        <div class="psc-left">
          <span class="psc-num">#${idx + 1}</span>
          <div class="psc-info">
            <span class="psc-name">${b.name}</span>
            <span class="psc-stats">${statsHtml}</span>
          </div>
        </div>
        ${(!isOut && !isCurrentlyBatting) ? `<span class="psc-btn">${isRetiredHurt ? 'Resume Batting ➔' : 'Select Batter ➔'}</span>` : `<span style="font-size: 0.75rem; color: var(--text-muted); font-weight: 600;">Unavailable</span>`}
      `;

      if (!isOut && !isCurrentlyBatting) {
        btn.addEventListener("click", () => {
          b.outInfo = "Not Out";
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
      }

      container.append(btn);
    });

    if (matchedCount === 0) {
      container.innerHTML = `
        <div style="text-align: center; padding: 24px 12px; color: var(--text-muted); font-size: 0.9rem;">
          No matching batters found.
        </div>
      `;
    }
  };

  renderBatterCards("");

  if (searchInput) {
    searchInput.oninput = (e) => renderBatterCards(e.target.value);
    setTimeout(() => searchInput.focus(), 150);
  }

  if (els.batterSelectModal) {
    els.batterSelectModal.classList.remove("hidden");
  }
}

function openRetireHurtModal() {
  const innings = currentInnings();
  if (!innings) {
    showToast("No active innings.");
    return;
  }

  const alreadyWon = winnerText();
  if (alreadyWon) {
    showToast(`🏆 Match complete: ${alreadyWon}`);
    return;
  }

  if (isInningsClosed(innings)) {
    showToast("Innings is complete.");
    return;
  }

  ensurePlayerStats(innings);

  const slot1 = innings.batters[innings.slot1BatterIndex];
  const slot2 = innings.batters[innings.slot2BatterIndex];
  const isSlot2OnStrike = innings.currentStrikerIndex !== -1 && innings.currentStrikerIndex === innings.slot2BatterIndex;

  const strikerBatter = isSlot2OnStrike ? slot2 : slot1;
  const nonStrikerBatter = isSlot2OnStrike ? slot1 : slot2;

  const isSimple = state.scoringMode === "simple";

  const strikerNameEl = document.querySelector("#retire-modal-striker-name");
  const strikerStatsEl = document.querySelector("#retire-modal-striker-stats");
  const nonstrikerNameEl = document.querySelector("#retire-modal-nonstriker-name");
  const nonstrikerStatsEl = document.querySelector("#retire-modal-nonstriker-stats");

  if (strikerNameEl) {
    strikerNameEl.textContent = isSimple ? "Striker" : (strikerBatter ? strikerBatter.name : "Striker");
  }
  if (strikerStatsEl) {
    strikerStatsEl.textContent = strikerBatter ? `${strikerBatter.runs} runs (${strikerBatter.balls} balls)` : "0 runs (0 balls)";
  }

  if (nonstrikerNameEl) {
    nonstrikerNameEl.textContent = isSimple ? "Non-Striker" : (nonStrikerBatter ? nonStrikerBatter.name : "Non-Striker");
  }
  if (nonstrikerStatsEl) {
    nonstrikerStatsEl.textContent = nonStrikerBatter ? `${nonStrikerBatter.runs} runs (${nonStrikerBatter.balls} balls)` : "0 runs (0 balls)";
  }

  const modal = els.retireHurtModal || document.querySelector("#retire-hurt-modal");
  if (modal) modal.classList.remove("hidden");
}

function closeRetireHurtModal() {
  const modal = els.retireHurtModal || document.querySelector("#retire-hurt-modal");
  if (modal) modal.classList.add("hidden");
}

function retireBatter(target) {
  const innings = currentInnings();
  if (!innings) return;
  if (isInningsClosed(innings) || winnerText()) return;

  remember();
  ensurePlayerStats(innings);

  const isSlot2OnStrike = innings.currentStrikerIndex !== -1 && innings.currentStrikerIndex === innings.slot2BatterIndex;

  let retiringIndex = -1;
  let isSlot1 = false;
  if (target === "striker") {
    retiringIndex = isSlot2OnStrike ? innings.slot2BatterIndex : innings.slot1BatterIndex;
    isSlot1 = !isSlot2OnStrike;
  } else {
    retiringIndex = isSlot2OnStrike ? innings.slot1BatterIndex : innings.slot2BatterIndex;
    isSlot1 = isSlot2OnStrike;
  }

  if (retiringIndex === -1 || !innings.batters[retiringIndex]) {
    closeRetireHurtModal();
    return;
  }

  const retiringBatter = innings.batters[retiringIndex];
  retiringBatter.outInfo = "Retired Hurt";

  closeRetireHurtModal();

  const isSimple = state.scoringMode === "simple";
  const batterDisplayName = isSimple ? (target === "striker" ? "Striker" : "Non-Striker") : retiringBatter.name;

  if (isSimple) {
    // In Simple/Normal mode: find the next available batter from innings.batters
    let nextIndex = -1;
    for (let i = 0; i < innings.batters.length; i++) {
      if (i !== innings.slot1BatterIndex && i !== innings.slot2BatterIndex && innings.batters[i].outInfo === "Not Out") {
        nextIndex = i;
        break;
      }
    }

    if (nextIndex !== -1) {
      if (isSlot1) {
        innings.slot1BatterIndex = nextIndex;
      } else {
        innings.slot2BatterIndex = nextIndex;
      }
      if (target === "striker") {
        innings.currentStrikerIndex = nextIndex;
      } else {
        innings.currentNonStrikerIndex = nextIndex;
      }
      showToast(`${batterDisplayName} retired hurt.`);
      render();
    } else {
      innings.closed = true;
      showToast(`${batterDisplayName} retired hurt. No more batters available. Innings closed.`);
      render();
      showNextInningsModal();
    }
  } else {
    // In Advanced mode: clear current slot and prompt user to select incoming batter
    if (isSlot1) {
      innings.slot1BatterIndex = -1;
    } else {
      innings.slot2BatterIndex = -1;
    }
    if (target === "striker") {
      innings.currentStrikerIndex = -1;
    } else {
      innings.currentNonStrikerIndex = -1;
    }

    // Check if any available batters remain in squad (either Not Out or Retired Hurt who can resume)
    const hasAvailable = innings.batters.some((b, i) =>
      i !== innings.slot1BatterIndex &&
      i !== innings.slot2BatterIndex &&
      (b.outInfo === "Not Out" || b.outInfo === "Retired Hurt")
    );

    if (!hasAvailable) {
      innings.closed = true;
      showToast(`${batterDisplayName} retired hurt. No more batters available. Innings closed.`);
      render();
      showNextInningsModal();
    } else {
      showToast(`${batterDisplayName} retired hurt. Please select incoming batter.`);
      render();
      setTimeout(() => {
        promptNewBatter(target);
      }, 150);
    }
  }
}

function highlightScoringModeButtons(type = "custom") {
  const btn1 = type === "tournament" ? els.btnTModeSimple : els.btnModeSimple;
  const btn2 = type === "tournament" ? els.btnTModeAdvanced : els.btnModeAdvanced;
  const group = type === "tournament" ? document.querySelector("#tournament-scoring-mode-group") : document.querySelector("#custom-scoring-mode-group");
  const targets = [btn1, btn2, group].filter(Boolean);
  targets.forEach(el => {
    el.classList.remove("mode-select-attention");
    void el.offsetWidth;
    el.classList.add("mode-select-attention");
  });
  if (btn1) {
    btn1.scrollIntoView({ behavior: "smooth", block: "center" });
  }
  setTimeout(() => {
    targets.forEach(el => el.classList.remove("mode-select-attention"));
  }, 1600);
}

function syncScoringModeUI() {
  const isSimple = state.scoringMode === "simple";
  const isAdv = state.scoringMode === "advanced";

  if (els.cricketPage) {
    els.cricketPage.classList.toggle("mode-simple", isSimple);
    els.cricketPage.classList.toggle("mode-advanced", !isSimple);
  }

  if (els.btnModeSimple && els.btnModeAdvanced) {
    if (isSimple) {
      els.btnModeSimple.classList.add("active");
      els.btnModeAdvanced.classList.remove("active");
      els.btnModeSimple.classList.remove("mode-select-attention");
      els.btnModeAdvanced.classList.remove("mode-select-attention");
      if (els.btnConfigurePlayersA) els.btnConfigurePlayersA.classList.add("hidden");
      if (els.btnConfigurePlayersB) els.btnConfigurePlayersB.classList.add("hidden");
      
      const containerA = document.querySelector("#custom-team-a-players-inputs");
      const containerB = document.querySelector("#custom-team-b-players-inputs");
      if (containerA) containerA.style.display = "none";
      if (containerB) containerB.style.display = "none";
    } else if (isAdv) {
      els.btnModeSimple.classList.remove("active");
      els.btnModeAdvanced.classList.add("active");
      els.btnModeSimple.classList.remove("mode-select-attention");
      els.btnModeAdvanced.classList.remove("mode-select-attention");
      if (els.btnConfigurePlayersA) {
        els.btnConfigurePlayersA.classList.remove("hidden");
        els.btnConfigurePlayersA.textContent = "Enter Player Names";
      }
      if (els.btnConfigurePlayersB) {
        els.btnConfigurePlayersB.classList.remove("hidden");
        els.btnConfigurePlayersB.textContent = "Enter Player Names";
      }
    } else {
      // Neither is pre-selected
      els.btnModeSimple.classList.remove("active");
      els.btnModeAdvanced.classList.remove("active");
      if (els.btnConfigurePlayersA) els.btnConfigurePlayersA.classList.add("hidden");
      if (els.btnConfigurePlayersB) els.btnConfigurePlayersB.classList.add("hidden");
      
      const containerA = document.querySelector("#custom-team-a-players-inputs");
      const containerB = document.querySelector("#custom-team-b-players-inputs");
      if (containerA) containerA.style.display = "none";
      if (containerB) containerB.style.display = "none";
    }
  }

  if (els.btnTModeSimple && els.btnTModeAdvanced) {
    if (isSimple) {
      els.btnTModeSimple.classList.add("active");
      els.btnTModeAdvanced.classList.remove("active");
      els.btnTModeSimple.classList.remove("mode-select-attention");
      els.btnTModeAdvanced.classList.remove("mode-select-attention");
    } else if (isAdv) {
      els.btnTModeSimple.classList.remove("active");
      els.btnTModeAdvanced.classList.add("active");
      els.btnTModeSimple.classList.remove("mode-select-attention");
      els.btnTModeAdvanced.classList.remove("mode-select-attention");
    } else {
      // Neither is pre-selected
      els.btnTModeSimple.classList.remove("active");
      els.btnTModeAdvanced.classList.remove("active");
    }
  }
}

function renderCustomPlayerInputs() {
  // Maintained as stub; player names are now collected via modal table pop-up on Start Match
}

function renderRosterModalTables() {
  const container = document.querySelector("#roster-tables-container");
  if (!container) return;

  const valStrA = els.customPlayersA ? els.customPlayersA.value.trim() : "";
  const valStrB = els.customPlayersB ? els.customPlayersB.value.trim() : "";
  const countA = Math.max(2, Math.min(11, Number(valStrA) || 11));
  const countB = Math.max(2, Math.min(11, Number(valStrB) || 11));

  const teamNameA = (els.customTeamA && els.customTeamA.value.trim()) || "Team 1";
  const teamNameB = (els.customTeamB && els.customTeamB.value.trim()) || "Team 2";
  const abbrA = getTeamAbbr(teamNameA);
  const abbrB = getTeamAbbr(teamNameB);

  if (!state.customTeamAPlayers) state.customTeamAPlayers = [];
  if (!state.customTeamBPlayers) state.customTeamBPlayers = [];

  const renderTeamTable = (teamName, count, abbr, teamKey, borderCol, titleCol) => {
    let rowsHtml = "";
    const rosterArr = teamKey === "A" ? (state.customRosterTeam1 || []) : (state.customRosterTeam2 || []);
    for (let i = 0; i < count; i++) {
      const existing = (rosterArr && rosterArr[i]) ? rosterArr[i] : "";
      const savedVal = (existing && !existing.toLowerCase().includes("player")) ? existing.replace(/"/g, "&quot;") : "";
      rowsHtml += `
        <tr style="border-bottom: 1px solid rgba(255,255,255,0.05);">
          <td style="padding: 7px 10px; color: var(--text-muted); font-size: 0.85rem; font-weight: 700; width: 36px; text-align: center;">${i + 1}</td>
          <td style="padding: 6px 8px;">
            <input type="text" class="roster-input-${teamKey.toLowerCase()}" data-index="${i}" value="${savedVal}" placeholder="Player ${i + 1} Name" maxlength="24" style="width: 100%; padding: 7px 12px; font-size: 0.88rem; background: rgba(0,0,0,0.35); border: 1px solid rgba(255,255,255,0.1); border-radius: 6px; color: var(--ink); font-family: inherit; outline: none; transition: border-color 0.2s;" onfocus="this.style.borderColor='${borderCol}'" onblur="this.style.borderColor='rgba(255,255,255,0.1)'" />
          </td>
        </tr>
      `;
    }
    return `
      <div style="background: rgba(255,255,255,0.02); border: 1.5px solid ${borderCol}; border-radius: 16px; padding: 16px; overflow: hidden; display: flex; flex-direction: column; gap: 12px;">
        <div style="display: flex; justify-content: space-between; align-items: center; border-bottom: 1px solid rgba(255,255,255,0.08); padding-bottom: 10px;">
          <strong style="color: ${titleCol}; font-size: 1.05rem; font-family: inherit;">${teamName}</strong>
          <span style="font-size: 0.78rem; font-weight: 700; background: rgba(255,255,255,0.06); padding: 3px 10px; border-radius: 999px; color: var(--text-muted);">${count} Players</span>
        </div>
        <div style="max-height: 340px; overflow-y: auto; padding-right: 4px;">
          <table style="width: 100%; border-collapse: collapse;">
            <thead>
              <tr style="border-bottom: 1px solid rgba(255,255,255,0.08); font-size: 0.75rem; text-transform: uppercase; color: var(--text-muted); letter-spacing: 0.5px;">
                <th style="padding: 6px 10px; text-align: center; width: 36px;">#</th>
                <th style="padding: 6px 8px; text-align: left;">Player Name</th>
              </tr>
            </thead>
            <tbody>
              ${rowsHtml}
            </tbody>
          </table>
        </div>
      </div>
    `;
  };

  container.innerHTML = `
    ${renderTeamTable(teamNameA, countA, abbrA, "A", "rgba(212,175,55,0.35)", "var(--gold)")}
    ${renderTeamTable(teamNameB, countB, abbrB, "B", "rgba(96,165,250,0.35)", "#60a5fa")}
  `;
}

function openPlayerRosterModal() {
  const modal = document.querySelector("#modal-player-roster-entry");
  if (!modal) return;
  renderRosterModalTables();
  modal.classList.remove("hidden");
  setTimeout(() => {
    const firstInput = modal.querySelector("input.roster-input-a");
    if (firstInput) firstInput.focus();
  }, 100);
}

function closePlayerRosterModal() {
  const modal = document.querySelector("#modal-player-roster-entry");
  if (modal) modal.classList.add("hidden");
}

let currentRosterAlertTarget = null;

function showRosterAlertModal(title, message, targetInput = null) {
  const modal = document.querySelector("#modal-roster-alert");
  if (!modal) {
    showToast(message);
    if (targetInput) targetInput.focus();
    return;
  }

  const titleEl = document.querySelector("#roster-alert-title");
  const msgEl = document.querySelector("#roster-alert-message");
  if (titleEl) titleEl.textContent = title || "Please Make a Change";
  if (msgEl) msgEl.textContent = message;

  currentRosterAlertTarget = targetInput;

  if (targetInput) {
    targetInput.classList.add("roster-input-error");
    const clearError = () => {
      targetInput.classList.remove("roster-input-error");
      targetInput.removeEventListener("input", clearError);
    };
    targetInput.addEventListener("input", clearError);
  }

  modal.classList.remove("hidden");

  const btnAction = document.querySelector("#btn-roster-alert-action");
  if (btnAction) {
    setTimeout(() => btnAction.focus(), 50);
  }
}

function closeRosterAlertModal() {
  const modal = document.querySelector("#modal-roster-alert");
  if (modal) modal.classList.add("hidden");

  if (currentRosterAlertTarget) {
    currentRosterAlertTarget.focus();
    if (typeof currentRosterAlertTarget.select === "function") {
      currentRosterAlertTarget.select();
    }
    currentRosterAlertTarget.scrollIntoView({ behavior: "smooth", block: "center" });
    currentRosterAlertTarget = null;
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

  const alreadyWon = winnerText();
  if (alreadyWon) {
    showToast(`🏆 Match complete: ${alreadyWon}`);
    showMatchOverModal(alreadyWon);
    return;
  }

  if (isInningsClosed(innings)) {
    showToast("Innings is complete. Click Next Innings to continue.");
    showNextInningsModal();
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
  let overJustCompleted = false;
  if (ball.legal && innings.legalBalls % 6 === 0 && innings.legalBalls > 0) {
    const temp = innings.currentStrikerIndex;
    innings.currentStrikerIndex = innings.currentNonStrikerIndex;
    innings.currentNonStrikerIndex = temp;

    if (state.scoringMode === "advanced" && !isInningsClosed(innings) && !winnerText()) {
      // Prompt bowler selection will open when over complete modal is continued/dismissed
    } else {
      // Cycle bowler automatically (user can manually change via select dropdown)
      if (innings.bowlers.length > 0) {
        innings.currentBowlerIndex = (innings.currentBowlerIndex + 1) % innings.bowlers.length;
      }
    }
    overJustCompleted = true;
    showToast("Over complete.");
  }

  const win = winnerText();
  if (win) {
    showToast(`🏆 ${win}`);
    matchOverModalShownFor = win;
    showMatchOverModal(win);
  } else if (isInningsClosed(innings)) {
    showToast("Innings complete. Click Next Innings to continue.");
    showNextInningsModal();
  } else if (overJustCompleted) {
    showOverCompleteModal();
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

const btnRetireHurtEl = document.querySelector("#btn-retire-hurt");
if (btnRetireHurtEl) {
  btnRetireHurtEl.addEventListener("click", () => {
    openRetireHurtModal();
  });
}

els.undoBtn.addEventListener("click", () => {
  if (els.matchOverModal) els.matchOverModal.classList.add("hidden");
  if (els.nextInningsModal) els.nextInningsModal.classList.add("hidden");
  if (els.overCompleteModal) els.overCompleteModal.classList.add("hidden");
  closeRetireHurtModal();
  matchOverModalShownFor = null;
  nextInningsModalShownFor = null;
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
  handleNextInnings();
});

els.declareBtn.addEventListener("click", () => {
  if (!isTestMatch() || isInningsClosed() || winnerText()) return;
  remember();
  closeCurrentInnings("declared");
  showToast(`${battingTeam()} declared. Click Next Innings to continue.`);
  render();
  const win = winnerText();
  if (win) {
    showMatchOverModal(win);
  } else {
    showNextInningsModal();
  }
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
    if (els.matchOverModal) els.matchOverModal.classList.add("hidden");
    if (els.nextInningsModal) els.nextInningsModal.classList.add("hidden");
    if (els.overCompleteModal) els.overCompleteModal.classList.add("hidden");
    closeRetireHurtModal();
    matchOverModalShownFor = null;
    nextInningsModalShownFor = null;
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

// Category Filter Pills on Modern Sports Hub
document.querySelectorAll(".filter-pill[data-sport-filter]").forEach((pill) => {
  pill.addEventListener("click", () => {
    document.querySelectorAll(".filter-pill[data-sport-filter]").forEach((p) => p.classList.remove("active"));
    pill.classList.add("active");

    const category = pill.getAttribute("data-sport-filter");
    document.querySelectorAll(".sports-grid .sport-card").forEach((card) => {
      const cardCat = card.getAttribute("data-category");
      if (category === "all" || cardCat === category) {
        card.classList.remove("sport-card-hidden");
      } else {
        card.classList.add("sport-card-hidden");
      }
    });
  });
});

const cricketBtn = document.querySelector("[data-open-sport='cricket']");
if (cricketBtn) {
  cricketBtn.addEventListener("click", () => {
    showFormatPage();
  });
}

let pendingFormat = "Custom";

document.querySelectorAll("[data-format]").forEach((button) => {
  button.addEventListener("click", () => {
    const format = button.dataset.format;
    const proceed = () => {
      pendingFormat = format;

      // Reset player rosters so a new match starts fresh
      state.customTeamAPlayers = [];
      state.customTeamBPlayers = [];
      state.scoringMode = null;

      // Prefill fields
      els.customTeamA.value = state.teamA;
      els.customTeamB.value = state.teamB;
      els.customOvers.value = "";
      els.customOvers.placeholder = format === "Test" ? "e.g. 90" : (format === "ODI" ? "e.g. 50" : "e.g. 20");
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
    };

    if (hasActiveCricketMatch()) {
      promptOverwriteMatchConfirm(proceed);
    } else {
      proceed();
    }
  });
});

els.customFormatBtn.addEventListener("click", () => {
  const proceed = () => {
    pendingFormat = "Custom";

    // Reset player rosters so a new match starts fresh
    state.customTeamAPlayers = [];
    state.customTeamBPlayers = [];
    state.scoringMode = null;

    // Prefill fields
    els.customTeamA.value = state.teamA;
    els.customTeamB.value = state.teamB;
    els.customOvers.value = "";
    els.customOvers.placeholder = "e.g. 20";
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
  };

  if (hasActiveCricketMatch()) {
    promptOverwriteMatchConfirm(proceed);
  } else {
    proceed();
  }
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
  if (!state.scoringMode) {
    showToast("Please select a scoring mode (Simple Tracker or Advanced) to proceed.");
    highlightScoringModeButtons("custom");
    return;
  }

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

  const oversVal = els.customOvers ? els.customOvers.value.trim() : "";
  if (!oversVal) {
    showToast("Please enter the number of overs.");
    if (els.customOvers) els.customOvers.focus();
    return;
  }
  const customOversNum = Number(oversVal);
  if (isNaN(customOversNum) || customOversNum < 1 || customOversNum > 100) {
    showToast("Number of overs must be a number between 1 and 100.");
    if (els.customOvers) els.customOvers.focus();
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
  if (state.scoringMode === "advanced") {
    openPlayerRosterModal();
    return;
  }

  // Simple tracker mode: no player names needed
  state.customTeamAPlayers = [];
  state.customTeamBPlayers = [];
  executeStartCustomMatch();
});

function executeStartCustomMatch() {
  const customPlayersA = Math.max(2, Math.min(11, Number(els.customPlayersA.value) || 11));
  const customPlayersB = Math.max(2, Math.min(11, Number(els.customPlayersB.value) || 11));
  const customOvers = Math.max(1, Math.min(100, Number(els.customOvers.value) || 20));

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
}

// Modal Roster Confirmation & Close Handlers
const btnConfirmRosterStart = document.querySelector("#btn-confirm-roster-start");
if (btnConfirmRosterStart) {
  btnConfirmRosterStart.addEventListener("click", () => {
    const customPlayersA = Math.max(2, Math.min(11, Number(els.customPlayersA.value) || 11));
    const customPlayersB = Math.max(2, Math.min(11, Number(els.customPlayersB.value) || 11));

    const inputsA = document.querySelectorAll(".roster-input-a");
    const inputsB = document.querySelectorAll(".roster-input-b");

    const tempA = Array.from(inputsA).map(inp => inp.value.trim());
    const tempB = Array.from(inputsB).map(inp => inp.value.trim());

    const teamNameA = (els.customTeamA && els.customTeamA.value.trim()) || "Team 1";
    const teamNameB = (els.customTeamB && els.customTeamB.value.trim()) || "Team 2";

    // Validate that all names are entered
    for (let i = 0; i < customPlayersA; i++) {
      const val = tempA[i];
      if (!val) {
        showRosterAlertModal(
          "Player Name Missing",
          `Player ${i + 1} of "${teamNameA}" has not been typed. Please make the change by entering the player's name.`,
          inputsA[i]
        );
        return;
      }
    }

    for (let i = 0; i < customPlayersB; i++) {
      const val = tempB[i];
      if (!val) {
        showRosterAlertModal(
          "Player Name Missing",
          `Player ${i + 1} of "${teamNameB}" has not been typed. Please make the change by entering the player's name.`,
          inputsB[i]
        );
        return;
      }
    }

    // Validate unique player names across both teams (no repeated names)
    const seenNames = new Map();
    for (let i = 0; i < customPlayersA; i++) {
      const val = tempA[i];
      const key = val.toLowerCase();
      if (seenNames.has(key)) {
        const prev = seenNames.get(key);
        showRosterAlertModal(
          "Player Name Repeated",
          `The name "${val}" is repeated (${prev.teamName} Player ${prev.playerNumber} and ${teamNameA} Player ${i + 1}). All player names must be unique. Please make the change.`,
          inputsA[i]
        );
        return;
      }
      seenNames.set(key, { name: val, input: inputsA[i], teamName: teamNameA, playerNumber: i + 1 });
    }

    for (let i = 0; i < customPlayersB; i++) {
      const val = tempB[i];
      const key = val.toLowerCase();
      if (seenNames.has(key)) {
        const prev = seenNames.get(key);
        showRosterAlertModal(
          "Player Name Repeated",
          `The name "${val}" is repeated (${prev.teamName} Player ${prev.playerNumber} and ${teamNameB} Player ${i + 1}). All player names must be unique. Please make the change.`,
          inputsB[i]
        );
        return;
      }
      seenNames.set(key, { name: val, input: inputsB[i], teamName: teamNameB, playerNumber: i + 1 });
    }

    // Save rosters for both teams
    state.customRosterTeam1 = tempA.slice(0, customPlayersA);
    state.customRosterTeam2 = tempB.slice(0, customPlayersB);

    const btnBat2 = document.querySelector("#btn-batfirst-2");
    const isTeam2BattingFirst = btnBat2 && btnBat2.classList.contains("active");

    if (isTeam2BattingFirst) {
      state.customTeamAPlayers = state.customRosterTeam2;
      state.customTeamBPlayers = state.customRosterTeam1;
    } else {
      state.customTeamAPlayers = state.customRosterTeam1;
      state.customTeamBPlayers = state.customRosterTeam2;
    }

    closePlayerRosterModal();
    executeStartCustomMatch();
  });
}

const btnCancelRosterModal = document.querySelector("#btn-cancel-roster-modal");
if (btnCancelRosterModal) {
  btnCancelRosterModal.addEventListener("click", closePlayerRosterModal);
}
const btnCloseRosterModal = document.querySelector("#close-roster-modal");
if (btnCloseRosterModal) {
  btnCloseRosterModal.addEventListener("click", closePlayerRosterModal);
}
const modalRosterOverlay = document.querySelector("#modal-player-roster-entry");
if (modalRosterOverlay) {
  modalRosterOverlay.addEventListener("click", (e) => {
    if (e.target === modalRosterOverlay) {
      closePlayerRosterModal();
    }
  });
}

// Alert Modal Handlers
const btnRosterAlertAction = document.querySelector("#btn-roster-alert-action");
if (btnRosterAlertAction) {
  btnRosterAlertAction.addEventListener("click", closeRosterAlertModal);
}
const closeRosterAlertBtn = document.querySelector("#close-roster-alert");
if (closeRosterAlertBtn) {
  closeRosterAlertBtn.addEventListener("click", closeRosterAlertModal);
}
const modalRosterAlertOverlay = document.querySelector("#modal-roster-alert");
if (modalRosterAlertOverlay) {
  modalRosterAlertOverlay.addEventListener("click", (e) => {
    if (e.target === modalRosterAlertOverlay) {
      closeRosterAlertModal();
    }
  });
}

els.backToSportsFromFormat.addEventListener("click", () => {
  showSportsPage();
});

els.backToFormats.addEventListener("click", () => {
  saveState();
  if (hasActiveCricketMatch()) {
    showToast("💾 Match saved! You can resume it anytime.");
  }
  if (state.tournamentActive) {
    showTournamentDashboard();
  } else {
    showFormatPage();
  }
});

if (els.tournamentFormatBtn) {
  els.tournamentFormatBtn.addEventListener("click", () => {
    const proceed = () => {
      showTournamentChoice();
    };
    if (hasActiveCricketMatch()) {
      promptOverwriteMatchConfirm(proceed);
    } else {
      proceed();
    }
  });
}

// Active Match In Progress Banner Actions
const btnResumeActiveMatch = document.querySelector("#btn-resume-active-match");
if (btnResumeActiveMatch) {
  btnResumeActiveMatch.addEventListener("click", () => {
    showCricketPage();
    render();
    showToast(`Resumed: ${state.teamA} vs ${state.teamB}`);
  });
}

const btnVaultActiveMatch = document.querySelector("#btn-vault-active-match");
if (btnVaultActiveMatch) {
  btnVaultActiveMatch.addEventListener("click", () => {
    if (window.AuthVault && typeof window.AuthVault.saveMatch === "function") {
      const inn = currentInnings();
      const summary = `${inn ? 'Innings ' + inn.number : 'Match'}: ${inn ? inn.runs : 0}/${inn ? inn.wickets : 0} (${oversFromBalls(inn ? inn.legalBalls : 0)} ov)`;
      window.AuthVault.saveMatch("cricket", "Cricket", state.teamA, state.teamB, summary, state);
      showToast("💾 Match saved to Cloud Vault!");
    } else {
      showToast("💾 Match saved locally!");
    }
  });
}

const btnDiscardActiveMatch = document.querySelector("#btn-discard-active-match");
if (btnDiscardActiveMatch) {
  btnDiscardActiveMatch.addEventListener("click", () => {
    if (confirm(`Are you sure you want to delete the match between "${state.teamA}" and "${state.teamB}"?`)) {
      discardActiveCricketMatch();
      showToast("Match deleted successfully.");
    }
  });
}

// Overwrite Confirmation Modal Actions
const btnConfirmResumeMatch = document.querySelector("#btn-confirm-resume-match");
if (btnConfirmResumeMatch) {
  btnConfirmResumeMatch.addEventListener("click", () => {
    closeOverwriteModal();
    showCricketPage();
    render();
    showToast(`Resumed: ${state.teamA} vs ${state.teamB}`);
  });
}

const btnConfirmSaveVaultFirst = document.querySelector("#btn-confirm-save-vault-first");
if (btnConfirmSaveVaultFirst) {
  btnConfirmSaveVaultFirst.addEventListener("click", () => {
    if (window.AuthVault && typeof window.AuthVault.saveMatch === "function") {
      const inn = currentInnings();
      const summary = `${inn ? 'Innings ' + inn.number : 'Match'}: ${inn ? inn.runs : 0}/${inn ? inn.wickets : 0} (${oversFromBalls(inn ? inn.legalBalls : 0)} ov)`;
      window.AuthVault.saveMatch("cricket", "Cricket", state.teamA, state.teamB, summary, state);
      showToast("💾 Saved to Vault!");
    }
    const cb = pendingNewMatchCallback;
    closeOverwriteModal();
    discardActiveCricketMatch();
    if (cb) cb();
  });
}

const btnConfirmDiscardNew = document.querySelector("#btn-confirm-discard-new");
if (btnConfirmDiscardNew) {
  btnConfirmDiscardNew.addEventListener("click", () => {
    const cb = pendingNewMatchCallback;
    closeOverwriteModal();
    discardActiveCricketMatch();
    if (cb) cb();
  });
}

const btnConfirmCancel = document.querySelector("#btn-confirm-cancel");
if (btnConfirmCancel) {
  btnConfirmCancel.addEventListener("click", closeOverwriteModal);
}

const overwriteModalOverlay = document.querySelector("#active-match-confirm-modal");
if (overwriteModalOverlay) {
  overwriteModalOverlay.addEventListener("click", (e) => {
    if (e.target === overwriteModalOverlay) {
      closeOverwriteModal();
    }
  });
}

// Header live indicator click binding
if (els.navLiveIndicator) {
  els.navLiveIndicator.style.cursor = "pointer";
  els.navLiveIndicator.addEventListener("click", () => {
    if (hasActiveCricketMatch()) {
      showCricketPage();
      showToast(`Resumed: ${state.teamA} vs ${state.teamB}`);
    }
  });
}

// Save active match state if user navigates away or closes tab
window.addEventListener("beforeunload", () => {
  if (hasActiveCricketMatch()) {
    saveState();
  }
});

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
    state.setupOvers = els.tournamentOvers.value ? Number(els.tournamentOvers.value) : null;
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

function openScorecardModal() {
  if (!els.scorecardModal) return;
  const current = currentInnings();
  scorecardSourceCtx = null;
  scorecardActiveTeamIndex = current ? current.team : 0;
  els.scorecardModal.classList.remove("hidden");
  renderFullScorecardModal();
}

if (els.btnTopScoreboard) {
  els.btnTopScoreboard.addEventListener("click", openScorecardModal);
}

if (els.btnActionScoreboard) {
  els.btnActionScoreboard.addEventListener("click", openScorecardModal);
}

if (els.btnFullScorecard) {
  els.btnFullScorecard.addEventListener("click", openScorecardModal);
}

if (els.closeScorecardModal) {
  els.closeScorecardModal.addEventListener("click", () => {
    if (els.scorecardModal) {
      els.scorecardModal.classList.add("hidden");
    }
  });
}

if (els.scorecardModal) {
  els.scorecardModal.addEventListener("click", (e) => {
    if (e.target === els.scorecardModal) {
      els.scorecardModal.classList.add("hidden");
    }
  });
}

if (els.closeMatchOverModal) {
  els.closeMatchOverModal.addEventListener("click", () => {
    if (els.matchOverModal) els.matchOverModal.classList.add("hidden");
  });
}

if (els.btnModalDismiss) {
  els.btnModalDismiss.addEventListener("click", () => {
    if (els.matchOverModal) els.matchOverModal.classList.add("hidden");
  });
}

if (els.btnPlayNextMatch) {
  els.btnPlayNextMatch.addEventListener("click", () => {
    handlePlayNextMatch();
  });
}

if (els.btnModalViewScorecard) {
  els.btnModalViewScorecard.addEventListener("click", () => {
    if (els.matchOverModal) els.matchOverModal.classList.add("hidden");
    if (els.scorecardModal) {
      const current = currentInnings();
      scorecardActiveTeamIndex = current ? current.team : 0;
      els.scorecardModal.classList.remove("hidden");
      renderFullScorecardModal();
    }
  });
}

if (els.matchOverModal) {
  els.matchOverModal.addEventListener("click", (e) => {
    if (e.target === els.matchOverModal) {
      els.matchOverModal.classList.add("hidden");
    }
  });
}

if (els.closeNextInningsModal) {
  els.closeNextInningsModal.addEventListener("click", () => {
    if (els.nextInningsModal) els.nextInningsModal.classList.add("hidden");
  });
}

if (els.btnNextInningsDismiss) {
  els.btnNextInningsDismiss.addEventListener("click", () => {
    if (els.nextInningsModal) els.nextInningsModal.classList.add("hidden");
  });
}

if (els.btnModalNextInnings) {
  els.btnModalNextInnings.addEventListener("click", () => {
    handleNextInnings();
  });
}

if (els.btnNextInningsViewScorecard) {
  els.btnNextInningsViewScorecard.addEventListener("click", () => {
    if (els.nextInningsModal) els.nextInningsModal.classList.add("hidden");
    if (els.scorecardModal) {
      const current = currentInnings();
      scorecardActiveTeamIndex = current ? current.team : 0;
      els.scorecardModal.classList.remove("hidden");
      renderFullScorecardModal();
    }
  });
}

if (els.nextInningsModal) {
  els.nextInningsModal.addEventListener("click", (e) => {
    if (e.target === els.nextInningsModal) {
      els.nextInningsModal.classList.add("hidden");
    }
  });
}

if (els.closeOverModal) {
  els.closeOverModal.addEventListener("click", () => {
    hideOverCompleteModal();
  });
}

if (els.btnOverModalContinue) {
  els.btnOverModalContinue.addEventListener("click", () => {
    hideOverCompleteModal();
  });
}

if (els.overCompleteModal) {
  els.overCompleteModal.addEventListener("click", (e) => {
    if (e.target === els.overCompleteModal) {
      hideOverCompleteModal();
    }
  });
}

if (els.matchNote) {
  els.matchNote.addEventListener("click", () => {
    const res = winnerText();
    if (res) {
      showMatchOverModal(res);
    } else if (isInningsClosed(currentInnings())) {
      showNextInningsModal();
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
if (els.navHomeBtn) {
  els.navHomeBtn.addEventListener("click", () => {
    showWelcomePage();
    render();
  });
}
const brandLogo = document.querySelector("#header-brand-logo");
if (brandLogo) {
  brandLogo.addEventListener("click", () => {
    showWelcomePage();
    render();
  });
  brandLogo.addEventListener("keydown", (e) => {
    if (e.key === "Enter" || e.key === " ") {
      e.preventDefault();
      showWelcomePage();
      render();
    }
  });
}
if (els.welcomeEnterBtn) {
  els.welcomeEnterBtn.addEventListener("click", () => {
    showSportsPage();
    render();
  });
}
if (els.welcomeTournamentBtn) {
  els.welcomeTournamentBtn.addEventListener("click", () => {
    showSportsPage();
    render();
  });
}
if (els.welcomeCricketBtn) {
  els.welcomeCricketBtn.addEventListener("click", () => {
    showFormatPage();
    render();
  });
}

// Welcome Quick-Launch Pill Handlers
function launchQuickSport(target) {
  if (!target || target === "all") {
    showSportsPage();
    render();
    return;
  }
  if (target === "cricket") {
    showFormatPage();
    render();
    return;
  }
  if (target === "football") {
    showFootballPage();
    render();
    return;
  }

  // Hide welcome landing page & ensure navigation header is accessible
  hideAllPages();
  if (els.welcomePage) els.welcomePage.classList.add("hidden");
  if (els.navHomeBtn) els.navHomeBtn.classList.remove("hidden");
  if (els.navSportsBtn) els.navSportsBtn.classList.remove("hidden");

  // Sport handler lookup
  const sportMethodMap = {
    basketball: window.showBasketballPage,
    tennis: window.showTennisPage,
    badminton: window.showBadmintonPage,
    hockey: window.showHockeyPage,
    volleyball: window.showVolleyballPage,
    baseball: window.showBaseballPage,
    rugby: window.showRugbyPage,
    kabaddi: window.showKabaddiPage,
    tabletennis: window.showTableTennisPage,
    golf: window.showGolfPage,
    boxing: window.showBoxingPage,
    mma: window.showMmaPage,
    pickleball: window.showPickleballPage,
    padel: window.showPadelPage,
    squash: window.showSquashPage
  };

  const showFn = sportMethodMap[target];
  if (typeof showFn === "function") {
    showFn();
  } else {
    const card = document.querySelector(`[data-open-sport='${target}']`);
    if (card) {
      card.click();
    } else {
      showSportsPage();
    }
  }

  const targetHash = `#${target}`;
  if (window.location.hash !== targetHash) {
    window.location.hash = targetHash;
  } else {
    navigateByHash(targetHash);
  }
  render();
}
window.launchQuickSport = launchQuickSport;

document.querySelectorAll(".welcome-quick-pill").forEach((pill) => {
  pill.addEventListener("click", () => {
    const target = pill.getAttribute("data-sport-target");
    launchQuickSport(target);
  });
});

const welcomeBottomEnterBtn = document.querySelector("#welcome-bottom-enter-btn");
if (welcomeBottomEnterBtn) {
  welcomeBottomEnterBtn.addEventListener("click", () => {
    showSportsPage();
    render();
  });
}

// Welcome Page Interactive Demo Simulator
let demoRuns = 164;
let demoWickets = 3;
let demoBalls = 100; // 16.4 overs = 16*6 + 4
const demoTarget = 185;
const demoTotalBalls = 120; // 20 overs

function updateDemoUI(msg = null, burstType = null) {
  const scoreEl = document.querySelector("#demo-score-display");
  const oversEl = document.querySelector("#demo-overs-display");
  const eqEl = document.querySelector("#demo-equation-text");
  const toastEl = document.querySelector("#demo-toast");

  const overs = Math.floor(demoBalls / 6);
  const ballsInOver = demoBalls % 6;
  const oversStr = `${overs}.${ballsInOver}`;
  const remainingBalls = Math.max(0, demoTotalBalls - demoBalls);
  const remainingRuns = Math.max(0, demoTarget - demoRuns);
  const crr = demoBalls > 0 ? ((demoRuns / demoBalls) * 6).toFixed(2) : "0.00";
  const rrr = remainingBalls > 0 ? ((remainingRuns / remainingBalls) * 6).toFixed(2) : "0.00";

  if (scoreEl) {
    scoreEl.textContent = `${demoRuns} / ${demoWickets}`;

    // Score pop animation reaction
    if (burstType) {
      scoreEl.classList.remove("score-pop-normal", "score-pop-four", "score-pop-six", "score-pop-wicket");
      void scoreEl.offsetWidth; // trigger DOM reflow for re-animation
      if (burstType === "1") scoreEl.classList.add("score-pop-normal");
      else if (burstType === "4") scoreEl.classList.add("score-pop-four");
      else if (burstType === "6") scoreEl.classList.add("score-pop-six");
      else if (burstType === "W") scoreEl.classList.add("score-pop-wicket");

      // Spawn floating celebration chip
      const scoreBox = document.querySelector(".welcome-demo-scorebox-cricket") || document.querySelector(".welcome-demo-scorebox");
      if (scoreBox) {
        const burst = document.createElement("div");
        burst.className = "demo-floating-burst";
        if (burstType === "1") {
          burst.textContent = "+1 Single";
          burst.style.background = "rgba(16, 185, 129, 0.28)";
          burst.style.color = "#34d399";
          burst.style.border = "1px solid rgba(16, 185, 129, 0.5)";
          burst.style.boxShadow = "0 0 16px rgba(16, 185, 129, 0.35)";
        } else if (burstType === "4") {
          burst.textContent = "🏏 4 FOUR!";
          burst.style.background = "rgba(59, 130, 246, 0.35)";
          burst.style.color = "#93c5fd";
          burst.style.border = "1px solid #60a5fa";
          burst.style.boxShadow = "0 0 22px rgba(59, 130, 246, 0.5)";
        } else if (burstType === "6") {
          burst.textContent = "🔥 6 MAXIMUM!";
          burst.style.background = "rgba(245, 158, 11, 0.35)";
          burst.style.color = "#fde047";
          burst.style.border = "1px solid #fbbf24";
          burst.style.boxShadow = "0 0 28px rgba(245, 158, 11, 0.6)";
        } else if (burstType === "W") {
          burst.textContent = "🔴 WICKET!";
          burst.style.background = "rgba(239, 68, 68, 0.35)";
          burst.style.color = "#fca5a5";
          burst.style.border = "1px solid #f87171";
          burst.style.boxShadow = "0 0 22px rgba(239, 68, 68, 0.5)";
        }
        scoreBox.style.position = "relative";
        burst.style.top = "-10px";
        burst.style.right = "0px";
        scoreBox.appendChild(burst);
        setTimeout(() => burst.remove(), 920);
      }
    }
  }
  if (oversEl) oversEl.textContent = `Overs: ${oversStr} / 20`;

  if (eqEl) {
    if (demoRuns >= demoTarget) {
      eqEl.innerHTML = `<span style="color:#34d399; font-weight:800;">🎉 Bengaluru Strikers won by ${10 - demoWickets} wickets!</span>`;
    } else if (demoWickets >= 10 || remainingBalls <= 0) {
      eqEl.innerHTML = `<span style="color:#f87171; font-weight:800;">Innings complete! Target was ${demoTarget}.</span>`;
    } else {
      eqEl.innerHTML = `Need <strong>${remainingRuns} runs</strong> from <strong>${remainingBalls} balls</strong> &bull; CRR: ${crr} &bull; RRR: ${rrr}`;
    }
  }

  if (toastEl && msg) {
    toastEl.textContent = msg;
    toastEl.classList.remove("hidden");
    clearTimeout(window._demoToastTimer);
    window._demoToastTimer = setTimeout(() => {
      toastEl.classList.add("hidden");
    }, 2200);
  }
}

const demoBtn1 = document.querySelector("#demo-btn-1");
const demoBtn4 = document.querySelector("#demo-btn-4");
const demoBtn6 = document.querySelector("#demo-btn-6");
const demoBtnWicket = document.querySelector("#demo-btn-wicket");
const demoBtnReset = document.querySelector("#demo-btn-reset");

if (demoBtn1) {
  demoBtn1.addEventListener("click", () => {
    if (demoRuns < demoTarget && demoWickets < 10 && demoBalls < demoTotalBalls) {
      demoRuns += 1;
      demoBalls += 1;
      updateDemoUI("Quick single taken! +1 run", "1");
    }
  });
}
if (demoBtn4) {
  demoBtn4.addEventListener("click", () => {
    if (demoRuns < demoTarget && demoWickets < 10 && demoBalls < demoTotalBalls) {
      demoRuns += 4;
      demoBalls += 1;
      updateDemoUI("CRACKING SHOT! 🏏 Boundary four (+4)!", "4");
    }
  });
}
if (demoBtn6) {
  demoBtn6.addEventListener("click", () => {
    if (demoRuns < demoTarget && demoWickets < 10 && demoBalls < demoTotalBalls) {
      demoRuns += 6;
      demoBalls += 1;
      updateDemoUI("HUGE MAXIMUM! 🔥 Six runs into the stands (+6)!", "6");
    }
  });
}
if (demoBtnWicket) {
  demoBtnWicket.addEventListener("click", () => {
    if (demoRuns < demoTarget && demoWickets < 10 && demoBalls < demoTotalBalls) {
      demoWickets += 1;
      demoBalls += 1;
      updateDemoUI("OUT! 🔴 Clean bowled! Wicket fell!", "W");
    }
  });
}
if (demoBtnReset) {
  demoBtnReset.addEventListener("click", () => {
    demoRuns = 164;
    demoWickets = 3;
    demoBalls = 100;
    updateDemoUI("Cricket simulator reset to starting match situation.");
  });
}

// 2. Football Interactive Demo Simulator
let fbHomeScore = 2;
let fbAwayScore = 1;
let fbMinute = 78;

function updateFbDemoUI(msg = null, burstText = null, burstClass = "goal") {
  const scoreEl = document.querySelector("#demo-fb-score-display");
  const clockEl = document.querySelector("#demo-fb-clock-display");
  const eqEl = document.querySelector("#demo-fb-equation-text");
  const badgeEl = document.querySelector("#demo-fb-lead-badge");
  const toastEl = document.querySelector("#demo-fb-toast");

  if (scoreEl) {
    scoreEl.textContent = `${fbHomeScore} - ${fbAwayScore}`;

    if (burstText) {
      scoreEl.classList.remove("score-pop-normal", "score-pop-four", "score-pop-six", "score-pop-wicket");
      void scoreEl.offsetWidth;
      scoreEl.classList.add("score-pop-four");

      const scoreBox = document.querySelector(".welcome-demo-scorebox-fb");
      if (scoreBox) {
        const burst = document.createElement("div");
        burst.className = "demo-floating-burst";
        burst.textContent = burstText;
        if (burstClass === "goal") {
          burst.style.background = "rgba(56, 189, 248, 0.35)";
          burst.style.color = "#bae6fd";
          burst.style.border = "1px solid #38bdf8";
          burst.style.boxShadow = "0 0 22px rgba(56, 189, 248, 0.5)";
        } else if (burstClass === "yellow") {
          burst.style.background = "rgba(234, 179, 8, 0.35)";
          burst.style.color = "#fef08a";
          burst.style.border = "1px solid #facc15";
          burst.style.boxShadow = "0 0 20px rgba(234, 179, 8, 0.5)";
        } else if (burstClass === "red") {
          burst.style.background = "rgba(239, 68, 68, 0.35)";
          burst.style.color = "#fca5a5";
          burst.style.border = "1px solid #f87171";
          burst.style.boxShadow = "0 0 22px rgba(239, 68, 68, 0.5)";
        } else if (burstClass === "var") {
          burst.style.background = "rgba(168, 85, 247, 0.35)";
          burst.style.color = "#e9d5ff";
          burst.style.border = "1px solid #c084fc";
          burst.style.boxShadow = "0 0 22px rgba(168, 85, 247, 0.5)";
        }
        scoreBox.style.position = "relative";
        burst.style.top = "-10px";
        burst.style.right = "0px";
        scoreBox.appendChild(burst);
        setTimeout(() => burst.remove(), 920);
      }
    }
  }

  if (clockEl) clockEl.textContent = `Minute: ${fbMinute}' / 90'`;

  const lead = fbHomeScore - fbAwayScore;
  if (badgeEl) {
    if (lead > 0) badgeEl.textContent = `vs Barcelona • Madrid +${lead}`;
    else if (lead < 0) badgeEl.textContent = `vs Barcelona • Barca +${Math.abs(lead)}`;
    else badgeEl.textContent = `vs Barcelona • Scores Level`;
  }

  if (eqEl) {
    if (fbMinute >= 90) {
      if (lead > 0) eqEl.innerHTML = `<span style="color:#38bdf8; font-weight:800;">🏆 Full Time! Real Madrid wins ${fbHomeScore} - ${fbAwayScore}!</span>`;
      else if (lead === 0) eqEl.innerHTML = `<span style="color:#fbbf24; font-weight:800;">Full Time Draw (${fbHomeScore} - ${fbAwayScore})! Extra Time next.</span>`;
      else eqEl.innerHTML = `<span style="color:#f87171; font-weight:800;">Full Time! Barcelona leads ${fbAwayScore} - ${fbHomeScore}!</span>`;
    } else {
      const rem = 90 - fbMinute;
      if (lead > 0) eqEl.innerHTML = `Real Madrid leading by ${lead} &bull; <strong>${rem} mins</strong> + stoppage remaining`;
      else if (lead === 0) eqEl.innerHTML = `Match tied at ${fbHomeScore}-${fbAwayScore} &bull; <strong>${rem} mins</strong> to find a winner`;
      else eqEl.innerHTML = `Barcelona ahead &bull; <strong>${rem} mins</strong> remaining in regulation`;
    }
  }

  if (toastEl && msg) {
    toastEl.textContent = msg;
    toastEl.classList.remove("hidden");
    clearTimeout(window._demoFbToastTimer);
    window._demoFbToastTimer = setTimeout(() => {
      toastEl.classList.add("hidden");
    }, 2200);
  }
}

const demoFbBtnGoal = document.querySelector("#demo-fb-btn-goal");
const demoFbBtnYellow = document.querySelector("#demo-fb-btn-yellow");
const demoFbBtnRed = document.querySelector("#demo-fb-btn-red");
const demoFbBtnVar = document.querySelector("#demo-fb-btn-var");
const demoFbBtnReset = document.querySelector("#demo-fb-btn-reset");

if (demoFbBtnGoal) {
  demoFbBtnGoal.addEventListener("click", () => {
    fbHomeScore += 1;
    fbMinute = Math.min(90, fbMinute + 2);
    updateFbDemoUI(`GOOOAL! Real Madrid scores! (Score: ${fbHomeScore} - ${fbAwayScore})`, "⚽ GOOOAL!", "goal");
  });
}
if (demoFbBtnYellow) {
  demoFbBtnYellow.addEventListener("click", () => {
    updateFbDemoUI("🟨 Tactical foul - Yellow card shown!", "🟨 YELLOW", "yellow");
  });
}
if (demoFbBtnRed) {
  demoFbBtnRed.addEventListener("click", () => {
    updateFbDemoUI("🟥 Straight Red Card! Player sent off to locker room!", "🟥 RED CARD", "red");
  });
}
if (demoFbBtnVar) {
  demoFbBtnVar.addEventListener("click", () => {
    updateFbDemoUI("📺 VAR Review Completed: Decision stands and confirmed!", "📺 VAR CHECK", "var");
  });
}
if (demoFbBtnReset) {
  demoFbBtnReset.addEventListener("click", () => {
    fbHomeScore = 2;
    fbAwayScore = 1;
    fbMinute = 78;
    updateFbDemoUI("Football simulator reset to 78' match situation.");
  });
}

// 3. Basketball Interactive Demo Simulator
let bbHomeScore = 98;
let bbAwayScore = 95;
let bbSecondsLeft = 105;

function updateBbDemoUI(msg = null, burstText = null, burstClass = "ft") {
  const scoreEl = document.querySelector("#demo-bb-score-display");
  const clockEl = document.querySelector("#demo-bb-clock-display");
  const eqEl = document.querySelector("#demo-bb-equation-text");
  const badgeEl = document.querySelector("#demo-bb-lead-badge");
  const toastEl = document.querySelector("#demo-bb-toast");

  if (scoreEl) {
    scoreEl.textContent = `${bbHomeScore} - ${bbAwayScore}`;

    if (burstText) {
      scoreEl.classList.remove("score-pop-normal", "score-pop-four", "score-pop-six", "score-pop-wicket");
      void scoreEl.offsetWidth;
      scoreEl.classList.add("score-pop-six");

      const scoreBox = document.querySelector(".welcome-demo-scorebox-bb");
      if (scoreBox) {
        const burst = document.createElement("div");
        burst.className = "demo-floating-burst";
        burst.textContent = burstText;
        if (burstClass === "three") {
          burst.style.background = "rgba(249, 115, 22, 0.35)";
          burst.style.color = "#ffedd5";
          burst.style.border = "1px solid #fb923c";
          burst.style.boxShadow = "0 0 24px rgba(249, 115, 22, 0.6)";
        } else if (burstClass === "two") {
          burst.style.background = "rgba(245, 158, 11, 0.35)";
          burst.style.color = "#fef08a";
          burst.style.border = "1px solid #fbbf24";
          burst.style.boxShadow = "0 0 20px rgba(245, 158, 11, 0.5)";
        } else if (burstClass === "ft") {
          burst.style.background = "rgba(16, 185, 129, 0.35)";
          burst.style.color = "#a7f3d0";
          burst.style.border = "1px solid #34d399";
          burst.style.boxShadow = "0 0 18px rgba(16, 185, 129, 0.4)";
        } else if (burstClass === "foul") {
          burst.style.background = "rgba(239, 68, 68, 0.35)";
          burst.style.color = "#fca5a5";
          burst.style.border = "1px solid #f87171";
          burst.style.boxShadow = "0 0 20px rgba(239, 68, 68, 0.5)";
        }
        scoreBox.style.position = "relative";
        burst.style.top = "-10px";
        burst.style.right = "0px";
        scoreBox.appendChild(burst);
        setTimeout(() => burst.remove(), 920);
      }
    }
  }

  const mins = Math.floor(bbSecondsLeft / 60);
  const secs = (bbSecondsLeft % 60).toString().padStart(2, "0");
  if (clockEl) clockEl.textContent = `Clock: Q4 • ${mins}:${secs}`;

  const lead = bbHomeScore - bbAwayScore;
  if (badgeEl) {
    if (lead > 0) badgeEl.textContent = `vs Warriors • Lakers +${lead}`;
    else if (lead < 0) badgeEl.textContent = `vs Warriors • GSW +${Math.abs(lead)}`;
    else badgeEl.textContent = `vs Warriors • Tied`;
  }

  if (eqEl) {
    if (bbSecondsLeft <= 0) {
      if (lead > 0) eqEl.innerHTML = `<span style="color:#fbbf24; font-weight:800;">🏆 Final Buzzer! LA Lakers win ${bbHomeScore} - ${bbAwayScore}!</span>`;
      else if (lead === 0) eqEl.innerHTML = `<span style="color:#38bdf8; font-weight:800;">Overtime! Tied at ${bbHomeScore}-${bbAwayScore}.</span>`;
      else eqEl.innerHTML = `<span style="color:#f87171; font-weight:800;">Final Buzzer! Golden State wins ${bbAwayScore} - ${bbHomeScore}!</span>`;
    } else {
      if (lead > 0) eqEl.innerHTML = `Lakers lead by ${lead} &bull; <strong>${bbSecondsLeft}s left</strong> &bull; Bonus active`;
      else if (lead === 0) eqEl.innerHTML = `Deadlocked at ${bbHomeScore} &bull; <strong>${bbSecondsLeft}s left</strong> in clutch time`;
      else eqEl.innerHTML = `Warriors up by ${Math.abs(lead)} &bull; <strong>${bbSecondsLeft}s left</strong> in regulation`;
    }
  }

  if (toastEl && msg) {
    toastEl.textContent = msg;
    toastEl.classList.remove("hidden");
    clearTimeout(window._demoBbToastTimer);
    window._demoBbToastTimer = setTimeout(() => {
      toastEl.classList.add("hidden");
    }, 2200);
  }
}

const demoBbBtn1 = document.querySelector("#demo-bb-btn-1");
const demoBbBtn2 = document.querySelector("#demo-bb-btn-2");
const demoBbBtn3 = document.querySelector("#demo-bb-btn-3");
const demoBbBtnFoul = document.querySelector("#demo-bb-btn-foul");
const demoBbBtnReset = document.querySelector("#demo-bb-btn-reset");

if (demoBbBtn1) {
  demoBbBtn1.addEventListener("click", () => {
    bbHomeScore += 1;
    bbSecondsLeft = Math.max(0, bbSecondsLeft - 5);
    updateBbDemoUI(`Swish! Free throw converted! (${bbHomeScore} - ${bbAwayScore})`, "🎯 +1 FT", "ft");
  });
}
if (demoBbBtn2) {
  demoBbBtn2.addEventListener("click", () => {
    bbHomeScore += 2;
    bbSecondsLeft = Math.max(0, bbSecondsLeft - 14);
    updateBbDemoUI(`Slams it down! 2-Point field goal! (${bbHomeScore} - ${bbAwayScore})`, "🏀 +2 DUNK", "two");
  });
}
if (demoBbBtn3) {
  demoBbBtn3.addEventListener("click", () => {
    bbHomeScore += 3;
    bbSecondsLeft = Math.max(0, bbSecondsLeft - 18);
    updateBbDemoUI(`BANG! Deep three-pointer from downtown! (${bbHomeScore} - ${bbAwayScore})`, "🔥 +3 THREE!", "three");
  });
}
if (demoBbBtnFoul) {
  demoBbBtnFoul.addEventListener("click", () => {
    updateBbDemoUI("Whistle blown: Defensive reaching foul (in the bonus)!", "⚠️ FOUL", "foul");
  });
}
if (demoBbBtnReset) {
  demoBbBtnReset.addEventListener("click", () => {
    bbHomeScore = 98;
    bbAwayScore = 95;
    bbSecondsLeft = 105;
    updateBbDemoUI("Basketball simulator reset to Q4 clutch time.");
  });
}

// Review Form Handler (Supports Standalone Review Page and Welcome Section)
(function initReviewSections() {
  const ratingDescriptions = {
    1: "⭐ 1 Star - Needs Improvement",
    2: "⭐⭐ 2 Stars - Fair",
    3: "⭐⭐⭐ 3 Stars - Good",
    4: "⭐⭐⭐⭐ 4 Stars - Great Experience!",
    5: "⭐⭐⭐⭐⭐ 5 Stars - Exceptional!"
  };

  function setupForm(formId, config) {
    const form = document.querySelector(formId);
    if (!form) return;

    let selectedRating = 5;
    const starBtns = form.querySelectorAll(".review-star-btn");
    const starFeedback = document.querySelector(config.feedbackId);
    const starsRow = form.querySelector(".review-stars-row");
    const submitBtn = document.querySelector(config.submitBtnId);
    const statusBox = document.querySelector(config.statusBoxId);

    function updateStars(val) {
      selectedRating = val;
      starBtns.forEach((btn) => {
        const r = parseInt(btn.getAttribute("data-rating"), 10);
        if (r <= val) {
          btn.classList.add("active");
        } else {
          btn.classList.remove("active");
        }
      });
      if (starFeedback) {
        starFeedback.textContent = ratingDescriptions[val] || `${val} Stars`;
      }
    }

    starBtns.forEach((btn) => {
      btn.addEventListener("click", () => {
        const r = parseInt(btn.getAttribute("data-rating"), 10);
        updateStars(r);
      });
      btn.addEventListener("mouseenter", () => {
        const r = parseInt(btn.getAttribute("data-rating"), 10);
        starBtns.forEach((b) => {
          const br = parseInt(b.getAttribute("data-rating"), 10);
          if (br <= r) b.classList.add("active");
          else b.classList.remove("active");
        });
      });
    });

    if (starsRow) {
      starsRow.addEventListener("mouseleave", () => {
        updateStars(selectedRating);
      });
    }

    form.addEventListener("submit", async (e) => {
      e.preventDefault();

      const nameInput = document.querySelector(config.nameInputId);
      const emailInput = document.querySelector(config.emailInputId);
      const categoryInput = document.querySelector(config.categoryInputId);
      const messageInput = document.querySelector(config.messageInputId);

      const name = (nameInput && nameInput.value.trim()) || "Anonymous Sports Fan";
      const email = (emailInput && emailInput.value.trim()) || "";
      const category = (categoryInput && categoryInput.value) || "General Experience";
      const message = (messageInput && messageInput.value.trim()) || "";

      if (!email || !email.includes("@")) {
        if (statusBox) {
          statusBox.className = "review-status-box error";
          statusBox.textContent = "Please enter a valid email address before submitting.";
          statusBox.classList.remove("hidden");
        }
        if (emailInput) emailInput.focus();
        return;
      }

      if (!message) {
        if (statusBox) {
          statusBox.className = "review-status-box error";
          statusBox.textContent = "Please enter your review message before submitting.";
          statusBox.classList.remove("hidden");
        }
        if (messageInput) messageInput.focus();
        return;
      }

      if (submitBtn) {
        submitBtn.disabled = true;
        submitBtn.innerHTML = "<span>⏳ Sending review to team...</span>";
      }
      if (statusBox) {
        statusBox.classList.add("hidden");
      }

      const payload = {
        _subject: `New ScoreTracker Review: ${selectedRating} Stars (${category}) from ${name}`,
        _template: "table",
        _captcha: "false",
        Rating: `${selectedRating} / 5 Stars`,
        Reviewer: name,
        Email: email,
        Category: category,
        Review: message,
        Timestamp: new Date().toLocaleString()
      };

      try {
        const response = await fetch("https://formsubmit.co/ajax/algobuilds@gmail.com", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "Accept": "application/json"
          },
          body: JSON.stringify(payload)
        });

        if (response.ok) {
          if (statusBox) {
            statusBox.className = "review-status-box success";
            statusBox.innerHTML = `
              🎉 <strong>Thank you for your review!</strong><br>
              Your ${selectedRating}-star feedback has been sent directly to our team.<br>
              <span style="font-size: 0.85rem; opacity: 0.9; margin-top: 6px; display: inline-block;">Taking you back to Sports Hub...</span>
            `;
            statusBox.classList.remove("hidden");
          }
          form.reset();
          updateStars(5);
          if (typeof showToast === "function") {
            showToast("Review submitted! Returning to Sports Hub...");
          }
          setTimeout(() => {
            showSportsPage();
          }, 1600);
        } else {
          throw new Error("Submission response not ok");
        }
      } catch (err) {
        // Fallback: provide direct mailto link
        const mailtoSubject = encodeURIComponent(`ScoreTracker Review: ${selectedRating} Stars (${category})`);
        const mailtoBody = encodeURIComponent(`Rating: ${selectedRating} / 5 Stars\nFrom: ${name} (${email})\nCategory: ${category}\n\nReview:\n${message}`);
        const mailtoUrl = `mailto:algobuilds@gmail.com?subject=${mailtoSubject}&body=${mailtoBody}`;

        if (statusBox) {
          statusBox.className = "review-status-box success";
          statusBox.innerHTML = `
            📬 <strong>Network blocked automatic delivery.</strong> You can send it directly with 1 tap:
            <br><br>
            <a href="${mailtoUrl}" style="color: #34d399; font-weight: 800; text-decoration: underline;">
              ✉️ Click here to send your review to our support team
            </a>
          `;
          statusBox.classList.remove("hidden");
        }
      } finally {
        if (submitBtn) {
          submitBtn.disabled = false;
          submitBtn.innerHTML = "<span>🚀 Submit Review</span>";
        }
      }
    });
  }

  // Standalone dedicated Review Page form
  setupForm("#standalone-review-form", {
    feedbackId: "#standalone-review-star-feedback",
    nameInputId: "#standalone-review-author-name",
    emailInputId: "#standalone-review-author-email",
    categoryInputId: "#standalone-review-sport-category",
    messageInputId: "#standalone-review-message",
    submitBtnId: "#standalone-review-submit-btn",
    statusBoxId: "#standalone-review-status-box"
  });

  // Welcome section review form
  setupForm("#welcome-review-form", {
    feedbackId: "#review-star-feedback",
    nameInputId: "#review-author-name",
    emailInputId: "#review-author-email",
    categoryInputId: "#review-sport-category",
    messageInputId: "#review-message",
    submitBtnId: "#review-submit-btn",
    statusBoxId: "#review-status-box"
  });
})();

// Open Standalone Review Page from anywhere (Sports Hub, navbar, floating button)
function openReviewSection() {
  showReviewPage();
}
window.openReviewSection = openReviewSection;

// Bind Review triggers in Sports Hub, navigation bar, and back button
const hubReviewBtn = document.querySelector("#sports-hub-review-btn");
if (hubReviewBtn) {
  hubReviewBtn.addEventListener("click", () => {
    openReviewSection();
  });
}
const floatingReviewBtn = document.querySelector("#sports-floating-review-btn");
if (floatingReviewBtn) {
  floatingReviewBtn.addEventListener("click", () => {
    openReviewSection();
  });
}
const navReviewBtn = document.querySelector("#nav-btn-review");
if (navReviewBtn) {
  navReviewBtn.addEventListener("click", () => {
    openReviewSection();
  });
}
const reviewBackBtn = document.querySelector("#review-back-btn");
if (reviewBackBtn) {
  reviewBackBtn.addEventListener("click", () => {
    showSportsPage();
  });
}

const reviewHomeBtn = document.querySelector("#review-home-btn");
if (reviewHomeBtn) {
  reviewHomeBtn.addEventListener("click", () => {
    showWelcomePage();
  });
}

const reviewCardSportsBtn = document.querySelector("#review-card-sports-btn");
if (reviewCardSportsBtn) {
  reviewCardSportsBtn.addEventListener("click", () => {
    showSportsPage();
  });
}

const reviewCardHomeBtn = document.querySelector("#review-card-home-btn");
if (reviewCardHomeBtn) {
  reviewCardHomeBtn.addEventListener("click", () => {
    showWelcomePage();
  });
}

// Terms & Conditions / Privacy Modal Logic
const termsModal = document.querySelector("#terms-modal");
const termsModalCloseIcon = document.querySelector("#terms-modal-close-icon");
const termsModalCloseBtn = document.querySelector("#terms-modal-close-btn");
const termsModalTitle = document.querySelector("#terms-modal-title");
const termsTabBtn = document.querySelector("#terms-tab-btn");
const privacyTabBtn = document.querySelector("#privacy-tab-btn");
const disclaimerTabBtn = document.querySelector("#disclaimer-tab-btn");
const termsContent = document.querySelector("#terms-content");
const privacyContent = document.querySelector("#privacy-content");
const disclaimerContent = document.querySelector("#disclaimer-content");

function openTermsModal(tab = "terms") {
  if (!termsModal) return;
  termsModal.classList.remove("hidden");
  switchTermsTab(tab);
}

function closeTermsModal() {
  if (!termsModal) return;
  termsModal.classList.add("hidden");
}

function switchTermsTab(tab) {
  if (!termsTabBtn || !privacyTabBtn || !disclaimerTabBtn) return;
  termsTabBtn.classList.remove("active");
  privacyTabBtn.classList.remove("active");
  disclaimerTabBtn.classList.remove("active");

  if (termsContent) termsContent.classList.add("hidden");
  if (privacyContent) privacyContent.classList.add("hidden");
  if (disclaimerContent) disclaimerContent.classList.add("hidden");

  if (tab === "terms") {
    termsTabBtn.classList.add("active");
    if (termsContent) termsContent.classList.remove("hidden");
    if (termsModalTitle) termsModalTitle.textContent = "Terms & Conditions";
  } else if (tab === "privacy") {
    privacyTabBtn.classList.add("active");
    if (privacyContent) privacyContent.classList.remove("hidden");
    if (termsModalTitle) termsModalTitle.textContent = "Privacy Policy";
  } else if (tab === "disclaimer") {
    disclaimerTabBtn.classList.add("active");
    if (disclaimerContent) disclaimerContent.classList.remove("hidden");
    if (termsModalTitle) termsModalTitle.textContent = "Fair-Use Disclaimer";
  }
}

if (termsModalCloseIcon) termsModalCloseIcon.addEventListener("click", closeTermsModal);
if (termsModalCloseBtn) termsModalCloseBtn.addEventListener("click", closeTermsModal);
if (termsModal) {
  termsModal.addEventListener("click", (e) => {
    if (e.target === termsModal) closeTermsModal();
  });
}

if (termsTabBtn) termsTabBtn.addEventListener("click", () => switchTermsTab("terms"));
if (privacyTabBtn) privacyTabBtn.addEventListener("click", () => switchTermsTab("privacy"));
if (disclaimerTabBtn) disclaimerTabBtn.addEventListener("click", () => switchTermsTab("disclaimer"));

document.querySelectorAll(".trigger-terms").forEach((btn) => {
  btn.addEventListener("click", () => openTermsModal("terms"));
});
document.querySelectorAll(".trigger-privacy").forEach((btn) => {
  btn.addEventListener("click", () => openTermsModal("privacy"));
});
document.querySelectorAll(".trigger-disclaimer").forEach((btn) => {
  btn.addEventListener("click", () => openTermsModal("disclaimer"));
});

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
      if (input.id === "players-team-a" || input.id === "players-team-b") {
        renderLivePagePlayerInputs();
      }
    });
  }
});

const liveTeamAEl = document.querySelector("#team-a");
const liveTeamBEl = document.querySelector("#team-b");
if (liveTeamAEl) liveTeamAEl.addEventListener("input", renderLivePagePlayerInputs);
if (liveTeamBEl) liveTeamBEl.addEventListener("input", renderLivePagePlayerInputs);



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

    for (let i = 0; i < selectedPlayersA.length; i++) {
      if (!selectedPlayersA[i]) {
        showRosterAlertModal("Player Name Missing", `A player name for ${fixture.teamA} has not been typed. Please make the change by entering the player's name.`);
        return;
      }
    }
    for (let i = 0; i < selectedPlayersB.length; i++) {
      if (!selectedPlayersB[i]) {
        showRosterAlertModal("Player Name Missing", `A player name for ${fixture.teamB} has not been typed. Please make the change by entering the player's name.`);
        return;
      }
    }

    const seenTournamentNames = new Set();
    for (let i = 0; i < selectedPlayersA.length; i++) {
      const k = selectedPlayersA[i].toLowerCase();
      if (seenTournamentNames.has(k)) {
        showRosterAlertModal("Player Name Repeated", `The name "${selectedPlayersA[i]}" is repeated. All player names must be unique. Please make the change.`);
        return;
      }
      seenTournamentNames.add(k);
    }
    for (let i = 0; i < selectedPlayersB.length; i++) {
      const k = selectedPlayersB[i].toLowerCase();
      if (seenTournamentNames.has(k)) {
        showRosterAlertModal("Player Name Repeated", `The name "${selectedPlayersB[i]}" is repeated. All player names must be unique. Please make the change.`);
        return;
      }
      seenTournamentNames.add(k);
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
  els.btnChangeBowlerModal.addEventListener("click", (e) => {
    e.stopPropagation();
    if (state.scoringMode === "simple") return;
    promptNewBowler();
  });
}

const btnBowlerCardEl = document.querySelector("#btn-bowler-card");
if (btnBowlerCardEl) {
  btnBowlerCardEl.addEventListener("click", (e) => {
    if (state.scoringMode === "simple") return;
    if (e.target.closest("#btn-change-bowler-modal")) return;
    promptNewBowler();
  });
}

function rotateStrike() {
  const inn = currentInnings();
  if (!inn) return;
  if (inn.currentStrikerIndex !== -1 && inn.currentNonStrikerIndex !== -1) {
    const temp = inn.currentStrikerIndex;
    inn.currentStrikerIndex = inn.currentNonStrikerIndex;
    inn.currentNonStrikerIndex = temp;
    saveState();
    render();
    showToast("Strike rotated.");
  }
}

const btnStrikerCardEl = document.querySelector("#btn-striker-card");
if (btnStrikerCardEl) {
  btnStrikerCardEl.addEventListener("click", (e) => {
    if (state.scoringMode === "simple") return;
    if (e.target.closest("#btn-change-striker") || e.target.closest("#btn-swap-strike") || e.target.closest("#live-card1-badge")) return;
    const inn = currentInnings();
    const isSlot1OnStrike = inn && inn.currentStrikerIndex === inn.slot1BatterIndex;
    promptNewBatter(isSlot1OnStrike ? "striker" : "nonstriker");
  });
}

if (els.btnChangeStriker) {
  els.btnChangeStriker.addEventListener("click", (e) => {
    e.stopPropagation();
    if (state.scoringMode === "simple") return;
    const inn = currentInnings();
    const isSlot1OnStrike = inn && inn.currentStrikerIndex === inn.slot1BatterIndex;
    promptNewBatter(isSlot1OnStrike ? "striker" : "nonstriker");
  });
}

if (els.btnChangeNonStriker) {
  els.btnChangeNonStriker.addEventListener("click", (e) => {
    e.stopPropagation();
    if (state.scoringMode === "simple") return;
    const inn = currentInnings();
    const isSlot1OnStrike = inn && inn.currentStrikerIndex === inn.slot1BatterIndex;
    promptNewBatter(isSlot1OnStrike ? "nonstriker" : "striker");
  });
}

const btnNonStrikerCardEl = document.querySelector("#btn-nonstriker-card");
if (btnNonStrikerCardEl) {
  btnNonStrikerCardEl.addEventListener("click", (e) => {
    if (state.scoringMode === "simple") return;
    if (e.target.closest("#btn-change-nonstriker") || e.target.closest("#btn-swap-strike") || e.target.closest("#live-card2-badge")) return;
    const inn = currentInnings();
    const isSlot1OnStrike = inn && inn.currentStrikerIndex === inn.slot1BatterIndex;
    promptNewBatter(isSlot1OnStrike ? "nonstriker" : "striker");
  });
}

const liveCard1Badge = document.querySelector("#live-card1-badge");
if (liveCard1Badge) {
  liveCard1Badge.addEventListener("click", (e) => {
    const inn = currentInnings();
    if (!inn) return;
    if (inn.currentStrikerIndex !== inn.slot1BatterIndex) {
      e.stopPropagation();
      rotateStrike();
    }
  });
}

const liveCard2Badge = document.querySelector("#live-card2-badge");
if (liveCard2Badge) {
  liveCard2Badge.addEventListener("click", (e) => {
    const inn = currentInnings();
    if (!inn) return;
    if (inn.currentStrikerIndex !== inn.slot2BatterIndex) {
      e.stopPropagation();
      rotateStrike();
    }
  });
}

const btnSwapStrikeEl = document.querySelector("#btn-swap-strike");
if (btnSwapStrikeEl) {
  btnSwapStrikeEl.addEventListener("click", (e) => {
    e.stopPropagation();
    rotateStrike();
  });
}

if (els.closeBowlerSelectModal) {
  els.closeBowlerSelectModal.addEventListener("click", () => {
    if (els.bowlerSelectModal) {
      els.bowlerSelectModal.classList.add("hidden");
    }
  });
}

if (els.bowlerSelectModal) {
  els.bowlerSelectModal.addEventListener("click", (e) => {
    if (e.target === els.bowlerSelectModal) {
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

if (els.batterSelectModal) {
  els.batterSelectModal.addEventListener("click", (e) => {
    if (e.target === els.batterSelectModal) {
      els.batterSelectModal.classList.add("hidden");
    }
  });
}

if (els.closeRetireHurtModal) {
  els.closeRetireHurtModal.addEventListener("click", () => {
    closeRetireHurtModal();
  });
}

if (els.btnCancelRetireHurt) {
  els.btnCancelRetireHurt.addEventListener("click", () => {
    closeRetireHurtModal();
  });
}

if (els.btnRetireStrikerChoice) {
  els.btnRetireStrikerChoice.addEventListener("click", () => {
    retireBatter("striker");
  });
}

if (els.btnRetireNonstrikerChoice) {
  els.btnRetireNonstrikerChoice.addEventListener("click", () => {
    retireBatter("nonstriker");
  });
}

if (els.retireHurtModal) {
  els.retireHurtModal.addEventListener("click", (e) => {
    if (e.target === els.retireHurtModal) {
      closeRetireHurtModal();
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

// Universal Cloud Vault bindings for Cricket
const btnSaveCricketVault = document.querySelector("#btn-save-cricket-vault");
if (btnSaveCricketVault) {
  btnSaveCricketVault.addEventListener("click", () => {
    if (window.AuthVault && typeof window.AuthVault.saveMatch === "function") {
      const summary = `${state.innings === 1 ? '1st Inn' : '2nd Inn'}: ${state.score}/${state.wickets} (${state.overs}.${state.balls} ov)`;
      window.AuthVault.saveMatch("cricket", "Cricket", state.battingTeam, state.bowlingTeam, summary, state);
    }
  });
}

const btnSaveCricketTournVault = document.querySelector("#btn-save-cricket-tourn-vault");
if (btnSaveCricketTournVault) {
  btnSaveCricketTournVault.addEventListener("click", () => {
    if (window.AuthVault && typeof window.AuthVault.saveTournament === "function") {
      const tournName = state.setupTournamentName || "Cricket Tournament";
      const teamCount = (state.tournamentTeams || []).length || 4;
      window.AuthVault.saveTournament("cricket", "Cricket", tournName, teamCount, state);
    }
  });
}

syncScoringModeUI();

// Initialize Adaptive Mobile Bottom Navigation
if (typeof initMobileBottomNav === "function") {
  initMobileBottomNav();
}

// Initialize Page state on reload/load:
// If the visitor has an active hash in the URL (refreshing on #sports, #match, #review, etc.), stay on that page!
// Otherwise (visiting the website without a hash or with #welcome), show the starting welcome page.
const currentHash = window.location.hash;
if (currentHash && currentHash !== "#welcome" && currentHash !== "#") {
  navigateByHash(currentHash);
} else {
  showWelcomePage(true);
}
if (typeof syncMobileBottomNav === "function") {
  syncMobileBottomNav(currentHash || "#welcome");
}
render();

// Initialize Hash Routing for subsequent interactions & back/forward navigation
window.addEventListener("hashchange", () => {
  navigateByHash(window.location.hash);
  render();
});

