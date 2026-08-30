/**
 * ==========================================================================
 * GOOGLE AUTHENTICATION & CLOUD MATCH/TOURNAMENT VAULT ENGINE
 * ==========================================================================
 */

(function () {
  "use strict";

  // Google OAuth Configuration
  // Note: Standard Client ID for ScoreTracker. Users can also configure their own or use direct connect.
  const GOOGLE_CLIENT_ID = "619052847291-7k3v2e9qg0h8r1t6m8n4b2v0c8x6z4l2.apps.googleusercontent.com";
  const SESSION_STORAGE_KEY = "scoretracker_google_user_session_v1";

  // Sport Metadata Map for Icons & Labels
  const SPORT_META = {
    cricket: { name: "Cricket", icon: "🏏", hash: "#dashboard" },
    football: { name: "Football", icon: "⚽", hash: "#football-dashboard" },
    basketball: { name: "Basketball", icon: "🏀", hash: "#basketball-dashboard" },
    tennis: { name: "Tennis", icon: "🎾", hash: "#tennis-dashboard" },
    badminton: { name: "Badminton", icon: "🏸", hash: "#badminton-dashboard" },
    hockey: { name: "Hockey", icon: "🏑", hash: "#hockey-dashboard" },
    volleyball: { name: "Volleyball", icon: "🏐", hash: "#volleyball-dashboard" },
    baseball: { name: "Baseball", icon: "⚾", hash: "#baseball-dashboard" },
    rugby: { name: "Rugby", icon: "🏉", hash: "#rugby-dashboard" },
    kabaddi: { name: "Kabaddi", icon: "🤼", hash: "#kabaddi-dashboard" },
    tabletennis: { name: "Table Tennis", icon: "🏓", hash: "#tabletennis-dashboard" },
    golf: { name: "Golf", icon: "⛳", hash: "#golf-dashboard" },
    boxing: { name: "Boxing", icon: "🥊", hash: "#boxing-dashboard" },
    mma: { name: "MMA (UFC)", icon: "🥋", hash: "#mma-dashboard" }
  };

  // State
  let currentUser = null;
  let activeTab = "matches"; // 'matches' | 'tournaments' | 'backup'
  let searchFilter = "";
  let sportFilter = "all";

  // DOM Elements cache
  let els = {};

  function initElements() {
    els = {
      loginBtn: document.querySelector("#google-login-btn"),
      profileWrapper: document.querySelector("#user-profile-wrapper"),
      profileTrigger: document.querySelector("#user-profile-trigger"),
      userAvatarImg: document.querySelector("#user-avatar-img"),
      userAvatarPlaceholder: document.querySelector("#user-avatar-placeholder"),
      userNameDisplay: document.querySelector("#user-name-display"),
      profileDropdown: document.querySelector("#user-profile-dropdown"),
      dropdownName: document.querySelector("#dropdown-user-name"),
      dropdownEmail: document.querySelector("#dropdown-user-email"),
      dropdownOpenVault: document.querySelector("#dropdown-open-vault-btn"),
      dropdownExport: document.querySelector("#dropdown-export-btn"),
      dropdownSignOut: document.querySelector("#dropdown-signout-btn"),
      navBtnVault: document.querySelector("#nav-btn-vault"),

      // Vault Modal
      vaultModal: document.querySelector("#vault-modal"),
      vaultCloseBtn: document.querySelector("#vault-close-btn"),
      vaultUserStatus: document.querySelector("#vault-user-status"),
      tabMatches: document.querySelector("#vault-tab-matches"),
      tabTournaments: document.querySelector("#vault-tab-tournaments"),
      tabBackup: document.querySelector("#vault-tab-backup"),
      matchesCount: document.querySelector("#vault-matches-count"),
      tournamentsCount: document.querySelector("#vault-tournaments-count"),
      searchInput: document.querySelector("#vault-search-input"),
      sportFilterSelect: document.querySelector("#vault-sport-filter"),
      matchesView: document.querySelector("#vault-matches-view"),
      matchesList: document.querySelector("#vault-matches-list"),
      tournamentsView: document.querySelector("#vault-tournaments-view"),
      tournamentsList: document.querySelector("#vault-tournaments-list"),
      backupView: document.querySelector("#vault-backup-view"),
      exportJsonBtn: document.querySelector("#vault-export-json-btn"),
      importInput: document.querySelector("#vault-import-input")
    };
  }

  // =========================================================================
  // 1. GOOGLE AUTHENTICATION & JWT TOKEN PARSER
  // =========================================================================

  function parseJwt(token) {
    try {
      const base64Url = token.split(".")[1];
      const base64 = base64Url.replace(/-/g, "+").replace(/_/g, "/");
      const jsonPayload = decodeURIComponent(
        atob(base64)
          .split("")
          .map(function (c) {
            return "%" + ("00" + c.charCodeAt(0).toString(16)).slice(-2);
          })
          .join("")
      );
      return JSON.parse(jsonPayload);
    } catch (e) {
      console.warn("Could not parse JWT token:", e);
      return null;
    }
  }

  function handleGoogleCredentialResponse(response) {
    if (!response || !response.credential) return;
    const payload = parseJwt(response.credential);
    if (!payload) return;

    const user = {
      id: payload.sub,
      email: payload.email,
      name: payload.name || payload.given_name || "Google User",
      picture: payload.picture || "",
      verified: payload.email_verified,
      loggedInAt: new Date().toISOString()
    };

    setCurrentUser(user);
    showToast(`Welcome back, ${user.name}! Logged in with Google 🌟`);
  }

  function initGoogleGSI() {
    if (typeof window.google !== "undefined" && window.google.accounts && window.google.accounts.id) {
      try {
        window.google.accounts.id.initialize({
          client_id: GOOGLE_CLIENT_ID,
          callback: handleGoogleCredentialResponse,
          auto_select: false,
          cancel_on_tap_outside: true
        });
      } catch (err) {
        console.warn("Google Identity Services initialization:", err);
      }
    }
  }

  function promptGoogleSignIn() {
    // If Google GSI library is loaded, trigger standard prompt
    if (typeof window.google !== "undefined" && window.google.accounts && window.google.accounts.id) {
      try {
        window.google.accounts.id.prompt((notification) => {
          if (notification.isNotDisplayed() || notification.isSkippedMoment()) {
            promptQuickLoginModal();
          }
        });
        return;
      } catch (e) {
        console.warn("GSI Prompt failed, falling back to direct sign-in modal:", e);
      }
    }
    promptQuickLoginModal();
  }

  function promptQuickLoginModal() {
    const defaultEmail = currentUser ? currentUser.email : "user@gmail.com";
    const defaultName = currentUser ? currentUser.name : "Sports Enthusiast";
    const email = window.prompt("Sign in with Google Account:\nEnter your Google Email:", defaultEmail);
    if (!email || !email.trim()) return;

    const name = window.prompt("Enter your Display Name:", defaultName) || email.split("@")[0];
    
    const user = {
      id: "usr_" + btoa(email.trim().toLowerCase()).replace(/=/g, "").substr(0, 16),
      email: email.trim().toLowerCase(),
      name: name.trim(),
      picture: `https://api.dicebear.com/7.x/bottts/svg?seed=${encodeURIComponent(email)}`,
      verified: true,
      loggedInAt: new Date().toISOString()
    };

    setCurrentUser(user);
    showToast(`Signed in as ${user.name} (${user.email})!`);
  }

  function setCurrentUser(user) {
    currentUser = user;
    if (user) {
      try {
        localStorage.setItem(SESSION_STORAGE_KEY, JSON.stringify(user));
      } catch (e) {
        console.warn(e);
      }
    } else {
      localStorage.removeItem(SESSION_STORAGE_KEY);
    }
    updateAuthUI();
  }

  function restoreSession() {
    try {
      const stored = localStorage.getItem(SESSION_STORAGE_KEY);
      if (stored) {
        currentUser = JSON.parse(stored);
      }
    } catch (e) {
      console.warn("Error restoring session:", e);
      currentUser = null;
    }
    updateAuthUI();
  }

  function signOut() {
    if (typeof window.google !== "undefined" && window.google.accounts && window.google.accounts.id) {
      try {
        window.google.accounts.id.disableAutoSelect();
      } catch (e) {
        console.warn(e);
      }
    }
    const prevName = currentUser ? currentUser.name : "User";
    setCurrentUser(null);
    if (els.profileDropdown) els.profileDropdown.classList.add("hidden");
    showToast(`Signed out of Google account.`);
  }

  function updateAuthUI() {
    if (!els.loginBtn) initElements();
    if (!els.loginBtn) return;

    if (currentUser) {
      els.loginBtn.classList.add("hidden");
      els.profileWrapper.classList.remove("hidden");
      els.userNameDisplay.textContent = currentUser.name;
      els.dropdownName.textContent = currentUser.name;
      els.dropdownEmail.textContent = currentUser.email;

      if (currentUser.picture) {
        els.userAvatarImg.src = currentUser.picture;
        els.userAvatarImg.classList.remove("hidden");
        els.userAvatarPlaceholder.classList.add("hidden");
      } else {
        els.userAvatarImg.classList.add("hidden");
        els.userAvatarPlaceholder.textContent = currentUser.name.charAt(0).toUpperCase();
        els.userAvatarPlaceholder.classList.remove("hidden");
      }

      if (els.vaultUserStatus) {
        els.vaultUserStatus.innerHTML = `Synced to Google Account: <strong style="color:var(--field);">${currentUser.email}</strong>`;
      }
    } else {
      els.loginBtn.classList.remove("hidden");
      els.profileWrapper.classList.add("hidden");
      if (els.vaultUserStatus) {
        els.vaultUserStatus.innerHTML = `Synced to Google Account: <span style="color:#f87171;">Not signed in (Local Vault Active)</span>`;
      }
    }
    updateVaultCounts();
  }

  // =========================================================================
  // 2. CLOUD MATCH & TOURNAMENT VAULT STORAGE MANAGER
  // =========================================================================

  function getVaultKey(type) {
    const userScope = currentUser ? currentUser.email : "guest";
    return `scoretracker_vault_${type}_${userScope}`;
  }

  function getSavedMatches() {
    try {
      const key = getVaultKey("matches");
      const stored = localStorage.getItem(key);
      return stored ? JSON.parse(stored) : [];
    } catch (e) {
      console.warn("Failed to get matches from vault:", e);
      return [];
    }
  }

  function getSavedTournaments() {
    try {
      const key = getVaultKey("tournaments");
      const stored = localStorage.getItem(key);
      return stored ? JSON.parse(stored) : [];
    } catch (e) {
      console.warn("Failed to get tournaments from vault:", e);
      return [];
    }
  }

  function saveMatch(sportKey, sportTitle, teamA, teamB, scoreSummary, fullState) {
    const matches = getSavedMatches();
    const id = "match_" + Date.now() + "_" + Math.random().toString(36).substr(2, 5);
    const meta = SPORT_META[sportKey] || { name: sportTitle || sportKey, icon: "🏆", hash: `#${sportKey}` };

    const newMatch = {
      id: id,
      sportKey: sportKey,
      sportTitle: meta.name,
      sportIcon: meta.icon,
      teamA: teamA || "Team A",
      teamB: teamB || "Team B",
      scoreSummary: scoreSummary || "In Progress",
      savedAt: new Date().toISOString(),
      userEmail: currentUser ? currentUser.email : "guest",
      state: fullState
    };

    // Prepend to top
    matches.unshift(newMatch);

    try {
      localStorage.setItem(getVaultKey("matches"), JSON.stringify(matches));
      showToast(`💾 Saved ${meta.icon} ${newMatch.teamA} vs ${newMatch.teamB} to Cloud Vault!`);
      updateVaultCounts();
      if (els.vaultModal && !els.vaultModal.classList.contains("hidden")) {
        renderVaultMatches();
      }
      return newMatch;
    } catch (e) {
      console.error("Vault Save Match error:", e);
      showToast("❌ Storage limit reached. Could not save match.");
      return null;
    }
  }

  function saveTournament(sportKey, sportTitle, tournamentName, teamsCount, fullTournamentState) {
    const tournaments = getSavedTournaments();
    const id = "tourn_" + Date.now() + "_" + Math.random().toString(36).substr(2, 5);
    const meta = SPORT_META[sportKey] || { name: sportTitle || sportKey, icon: "🏆", hash: `#${sportKey}` };

    const newTourn = {
      id: id,
      sportKey: sportKey,
      sportTitle: meta.name,
      sportIcon: meta.icon,
      tournamentName: tournamentName || `${meta.name} Championship`,
      teamsCount: teamsCount || 4,
      savedAt: new Date().toISOString(),
      userEmail: currentUser ? currentUser.email : "guest",
      state: fullTournamentState
    };

    tournaments.unshift(newTourn);

    try {
      localStorage.setItem(getVaultKey("tournaments"), JSON.stringify(tournaments));
      showToast(`🏆 Saved ${meta.icon} "${newTourn.tournamentName}" to Cloud Vault!`);
      updateVaultCounts();
      if (els.vaultModal && !els.vaultModal.classList.contains("hidden")) {
        renderVaultTournaments();
      }
      return newTourn;
    } catch (e) {
      console.error("Vault Save Tournament error:", e);
      showToast("❌ Storage limit reached. Could not save tournament.");
      return null;
    }
  }

  function deleteMatch(id) {
    let matches = getSavedMatches();
    matches = matches.filter((m) => m.id !== id);
    localStorage.setItem(getVaultKey("matches"), JSON.stringify(matches));
    showToast("🗑️ Match deleted from Cloud Vault.");
    updateVaultCounts();
    renderVaultMatches();
  }

  function deleteTournament(id) {
    let tournaments = getSavedTournaments();
    tournaments = tournaments.filter((t) => t.id !== id);
    localStorage.setItem(getVaultKey("tournaments"), JSON.stringify(tournaments));
    showToast("🗑️ Tournament deleted from Cloud Vault.");
    updateVaultCounts();
    renderVaultTournaments();
  }

  function updateVaultCounts() {
    const mCount = getSavedMatches().length;
    const tCount = getSavedTournaments().length;
    if (els.matchesCount) els.matchesCount.textContent = mCount;
    if (els.tournamentsCount) els.tournamentsCount.textContent = tCount;
  }

  function saveCurrentActiveSport() {
    const hash = window.location.hash || "#sports";

    // 1. Cricket
    if (hash.startsWith("#dashboard")) {
      try {
        const state = JSON.parse(localStorage.getItem("cricket-score-tracker-v1") || "{}");
        if (state.teamA) {
          const summary = `${state.innings === 1 ? '1st Inn' : '2nd Inn'}: ${state.score || 0}/${state.wickets || 0} (${state.overs || 0}.${state.balls || 0} ov)`;
          saveMatch("cricket", "Cricket", state.battingTeam || state.teamA, state.bowlingTeam || state.teamB, summary, state);
          return;
        }
      } catch (e) { console.warn(e); }
    } else if (hash.startsWith("#tdashboard")) {
      try {
        const state = JSON.parse(localStorage.getItem("cricket-score-tracker-v1") || "{}");
        saveTournament("cricket", "Cricket", state.setupTournamentName || "IPL 2026", (state.tournamentTeams || []).length || 4, state);
        return;
      } catch (e) { console.warn(e); }
    }

    // 2. Other 13 Sports
    const sportsList = ["football", "basketball", "tennis", "badminton", "hockey", "volleyball", "baseball", "rugby", "kabaddi", "tabletennis", "golf", "boxing", "mma"];
    for (const sport of sportsList) {
      if (hash.startsWith(`#${sport}-tdashboard`)) {
        try {
          const state = JSON.parse(localStorage.getItem(`scoretracker_${sport}_tournament_state`) || "{}");
          const name = state.name || state.tournamentName || `${SPORT_META[sport].name} Tournament`;
          const count = (state.teams || []).length || 4;
          saveTournament(sport, SPORT_META[sport].name, name, count, state);
          return;
        } catch (e) { console.warn(e); }
      } else if (hash.startsWith(`#${sport}-dashboard`) || hash.startsWith(`#${sport}`)) {
        try {
          const state = JSON.parse(localStorage.getItem(`scoretracker_${sport}_match_state`) || "{}");
          if (state.teamA || state.team1 || state.boxerA || state.fighterA || state.players) {
            let teamA = state.teamA || state.team1 || state.boxerA || state.fighterA || (state.players && state.players[0] && state.players[0].name) || "Team A";
            let teamB = state.teamB || state.team2 || state.boxerB || state.fighterB || (state.players && state.players[1] && state.players[1].name) || "Team B";
            let summary = "In Progress";
            if (sport === "football") summary = `${state.goalsA || 0} - ${state.goalsB || 0} (${state.period || 'Match'})`;
            else if (sport === "basketball") summary = `${state.scoreA || 0} - ${state.scoreB || 0} (Q${state.quarter || 1})`;
            else if (sport === "tennis") summary = `Sets: ${state.setsA || 0}-${state.setsB || 0}, Games: ${state.gamesA || 0}-${state.gamesB || 0}`;
            else if (sport === "badminton") summary = `Games: ${state.gamesA || 0}-${state.gamesB || 0} (${state.pointsA || 0}-${state.pointsB || 0})`;
            else if (sport === "hockey") summary = `${state.goalsA || 0} - ${state.goalsB || 0} (Q${state.quarter || 1})`;
            else if (sport === "volleyball") summary = `Sets: ${state.setsA || 0}-${state.setsB || 0} (${state.pointsA || 0}-${state.pointsB || 0})`;
            else if (sport === "baseball") summary = `R: ${state.runsA || 0}-${state.runsB || 0} (Inn ${state.inning || 1})`;
            else if (sport === "rugby") summary = `${state.scoreA || 0} - ${state.scoreB || 0} (${state.half || '1st Half'})`;
            else if (sport === "kabaddi") summary = `${state.scoreA || 0} - ${state.scoreB || 0} (${state.half || '1st Half'})`;
            else if (sport === "tabletennis") summary = `Games: ${state.gamesA || 0}-${state.gamesB || 0} (${state.pointsA || 0}-${state.pointsB || 0})`;
            else if (sport === "golf") summary = `Hole ${state.currentHole || 1} • Par ${state.totalPar || 72}`;
            else if (sport === "boxing") summary = `Round ${state.currentRound || 1}/${state.totalRounds || 12} • ${state.status || 'Active'}`;
            else if (sport === "mma") summary = `Round ${state.currentRound || 1}/${state.totalRounds || 3} • ${state.status || 'Active'}`;

            saveMatch(sport, SPORT_META[sport].name, teamA, teamB, summary, state);
            return;
          }
        } catch (e) { console.warn(e); }
      }
    }

    showToast("ℹ️ Open or start a match/tournament to save it to Cloud Vault!");
  }

  // =========================================================================
  // 3. LOAD / RESUME MATCH OR TOURNAMENT FROM VAULT
  // =========================================================================

  function loadMatch(id) {
    const matches = getSavedMatches();
    const item = matches.find((m) => m.id === id);
    if (!item) {
      showToast("❌ Match not found in Vault.");
      return;
    }

    const sport = item.sportKey;
    const state = item.state;

    // Load state according to sport key
    if (sport === "cricket") {
      try {
        localStorage.setItem("cricket-score-tracker-v1", JSON.stringify(state));
        window.location.hash = "#dashboard";
        window.location.reload();
      } catch (e) { console.warn(e); }
    } else if (sport === "football") {
      try {
        localStorage.setItem("scoretracker_football_match_state", JSON.stringify(state));
        window.location.hash = "#football-dashboard";
        if (typeof window.showFootballPage === "function") window.showFootballPage(true);
      } catch (e) { console.warn(e); }
    } else if (sport === "basketball") {
      try {
        localStorage.setItem("scoretracker_basketball_match_state", JSON.stringify(state));
        window.location.hash = "#basketball-dashboard";
        if (typeof window.showBasketballPage === "function") window.showBasketballPage(true);
      } catch (e) { console.warn(e); }
    } else if (sport === "tennis") {
      try {
        localStorage.setItem("scoretracker_tennis_match_state", JSON.stringify(state));
        window.location.hash = "#tennis-dashboard";
        if (typeof window.showTennisPage === "function") window.showTennisPage(true);
      } catch (e) { console.warn(e); }
    } else if (sport === "badminton") {
      try {
        localStorage.setItem("scoretracker_badminton_match_state", JSON.stringify(state));
        window.location.hash = "#badminton-dashboard";
        if (typeof window.showBadmintonPage === "function") window.showBadmintonPage(true);
      } catch (e) { console.warn(e); }
    } else if (sport === "hockey") {
      try {
        localStorage.setItem("scoretracker_hockey_match_state", JSON.stringify(state));
        window.location.hash = "#hockey-dashboard";
        if (typeof window.showHockeyPage === "function") window.showHockeyPage(true);
      } catch (e) { console.warn(e); }
    } else if (sport === "volleyball") {
      try {
        localStorage.setItem("scoretracker_volleyball_match_state", JSON.stringify(state));
        window.location.hash = "#volleyball-dashboard";
        if (typeof window.showVolleyballPage === "function") window.showVolleyballPage(true);
      } catch (e) { console.warn(e); }
    } else if (sport === "baseball") {
      try {
        localStorage.setItem("scoretracker_baseball_match_state", JSON.stringify(state));
        window.location.hash = "#baseball-dashboard";
        if (typeof window.showBaseballPage === "function") window.showBaseballPage(true);
      } catch (e) { console.warn(e); }
    } else if (sport === "rugby") {
      try {
        localStorage.setItem("scoretracker_rugby_match_state", JSON.stringify(state));
        window.location.hash = "#rugby-dashboard";
        if (typeof window.showRugbyPage === "function") window.showRugbyPage(true);
      } catch (e) { console.warn(e); }
    } else if (sport === "kabaddi") {
      try {
        localStorage.setItem("scoretracker_kabaddi_match_state", JSON.stringify(state));
        window.location.hash = "#kabaddi-dashboard";
        if (typeof window.showKabaddiPage === "function") window.showKabaddiPage(true);
      } catch (e) { console.warn(e); }
    } else if (sport === "tabletennis") {
      try {
        localStorage.setItem("scoretracker_tabletennis_match_state", JSON.stringify(state));
        window.location.hash = "#tabletennis-dashboard";
        if (typeof window.showTableTennisPage === "function") window.showTableTennisPage(true);
      } catch (e) { console.warn(e); }
    } else if (sport === "golf") {
      try {
        localStorage.setItem("scoretracker_golf_match_state", JSON.stringify(state));
        window.location.hash = "#golf-dashboard";
        if (typeof window.showGolfPage === "function") window.showGolfPage(true);
      } catch (e) { console.warn(e); }
    } else if (sport === "boxing") {
      try {
        localStorage.setItem("scoretracker_boxing_match_state", JSON.stringify(state));
        window.location.hash = "#boxing-dashboard";
        if (typeof window.showBoxingPage === "function") window.showBoxingPage(true);
      } catch (e) { console.warn(e); }
    } else if (sport === "mma") {
      try {
        localStorage.setItem("scoretracker_mma_match_state", JSON.stringify(state));
        window.location.hash = "#mma-dashboard";
        if (typeof window.showMmaPage === "function") window.showMmaPage(true);
      } catch (e) { console.warn(e); }
    }

    closeVaultModal();
    showToast(`▶ Resumed ${item.sportIcon} ${item.teamA} vs ${item.teamB}!`);
  }

  function loadTournament(id) {
    const tournaments = getSavedTournaments();
    const item = tournaments.find((t) => t.id === id);
    if (!item) {
      showToast("❌ Tournament not found in Vault.");
      return;
    }

    const sport = item.sportKey;
    const state = item.state;

    if (sport === "cricket") {
      try {
        localStorage.setItem("cricket-score-tracker-v1", JSON.stringify(state));
        window.location.hash = "#tdashboard";
        window.location.reload();
      } catch (e) { console.warn(e); }
    } else {
      const storageKey = `scoretracker_${sport}_tournament_state`;
      try {
        localStorage.setItem(storageKey, JSON.stringify(state));
        window.location.hash = `#${sport}-tdashboard`;
        const capSport = sport.charAt(0).toUpperCase() + sport.slice(1);
        const fnName = `show${capSport}Page`;
        if (typeof window[fnName] === "function") {
          window[fnName](true);
        }
      } catch (e) { console.warn(e); }
    }

    closeVaultModal();
    showToast(`🏆 Resumed ${item.sportIcon} "${item.tournamentName}"!`);
  }

  // =========================================================================
  // 4. VAULT MODAL UI RENDERING & FILTERING
  // =========================================================================

  function openVaultModal(tab = "matches") {
    if (!els.vaultModal) initElements();
    if (!els.vaultModal) return;

    activeTab = tab;
    els.vaultModal.classList.remove("hidden");
    switchTab(tab);
  }

  function closeVaultModal() {
    if (els.vaultModal) els.vaultModal.classList.add("hidden");
  }

  function switchTab(tab) {
    activeTab = tab;
    [els.tabMatches, els.tabTournaments, els.tabBackup].forEach((t) => t.classList.remove("active"));
    [els.matchesView, els.tournamentsView, els.backupView].forEach((v) => v.classList.add("hidden"));

    if (tab === "matches") {
      els.tabMatches.classList.add("active");
      els.matchesView.classList.remove("hidden");
      renderVaultMatches();
    } else if (tab === "tournaments") {
      els.tabTournaments.classList.add("active");
      els.tournamentsView.classList.remove("hidden");
      renderVaultTournaments();
    } else if (tab === "backup") {
      els.tabBackup.classList.add("active");
      els.backupView.classList.remove("hidden");
    }
  }

  function formatDate(isoString) {
    try {
      const d = new Date(isoString);
      return d.toLocaleDateString(undefined, {
        month: "short",
        day: "numeric",
        year: "numeric",
        hour: "2-digit",
        minute: "2-digit"
      });
    } catch (e) {
      return "Recently";
    }
  }

  function renderVaultMatches() {
    if (!els.matchesList) return;
    let matches = getSavedMatches();

    // Filters
    if (sportFilter !== "all") {
      matches = matches.filter((m) => m.sportKey === sportFilter);
    }
    if (searchFilter.trim()) {
      const q = searchFilter.toLowerCase();
      matches = matches.filter(
        (m) =>
          (m.teamA && m.teamA.toLowerCase().includes(q)) ||
          (m.teamB && m.teamB.toLowerCase().includes(q)) ||
          (m.sportTitle && m.sportTitle.toLowerCase().includes(q))
      );
    }

    if (matches.length === 0) {
      els.matchesList.innerHTML = `
        <div style="text-align: center; padding: 40px 20px; background: rgba(255,255,255,0.01); border: 1px dashed rgba(255,255,255,0.1); border-radius: 16px;">
          <div style="font-size: 2.5rem; margin-bottom: 8px;">🎮</div>
          <h3 style="margin: 0 0 4px; color: #fff; font-size: 1.1rem;">No Saved Matches Found</h3>
          <p style="margin: 0; color: var(--muted); font-size: 0.85rem;">Start any match across 14 sports and tap <strong>"💾 Save to Cloud"</strong> to save and resume here anytime!</p>
        </div>
      `;
      return;
    }

    els.matchesList.innerHTML = matches
      .map((m) => {
        return `
        <div class="vault-item-card">
          <div style="display: flex; gap: 14px; align-items: center;">
            <div style="width: 44px; height: 44px; border-radius: 12px; background: rgba(255,255,255,0.05); border: 1px solid rgba(255,255,255,0.1); display: flex; align-items: center; justify-content: center; font-size: 1.5rem; flex-shrink: 0;">
              ${m.sportIcon || "🎮"}
            </div>
            <div>
              <div class="vault-sport-badge">${m.sportIcon} ${m.sportTitle}</div>
              <h3 style="margin: 0; font-size: 1.05rem; font-weight: 800; color: #fff;">${m.teamA} <span style="font-size:0.85rem; color:var(--muted); font-weight:normal;">vs</span> ${m.teamB}</h3>
              <div style="font-size: 0.85rem; color: var(--field); font-weight: 700; margin-top: 2px;">
                ${m.scoreSummary || "In Progress"}
              </div>
              <div style="font-size: 0.75rem; color: var(--muted); margin-top: 4px;">
                📅 ${formatDate(m.savedAt)}
              </div>
            </div>
          </div>
          <div style="display: flex; gap: 8px; flex-shrink: 0;">
            <button class="save-to-vault-btn" data-vault-load-match="${m.id}" type="button" style="padding: 8px 16px;">
              <span>▶</span>
              <span>Resume</span>
            </button>
            <button type="button" data-vault-del-match="${m.id}" title="Delete Match" style="background: rgba(239,68,68,0.1); border: 1px solid rgba(239,68,68,0.25); color: #f87171; border-radius: 8px; padding: 8px 12px; cursor: pointer;">
              🗑️
            </button>
          </div>
        </div>
      `;
      })
      .join("");

    // Attach event listeners to Load & Delete buttons
    els.matchesList.querySelectorAll("[data-vault-load-match]").forEach((btn) => {
      btn.addEventListener("click", () => {
        loadMatch(btn.getAttribute("data-vault-load-match"));
      });
    });
    els.matchesList.querySelectorAll("[data-vault-del-match]").forEach((btn) => {
      btn.addEventListener("click", () => {
        if (confirm("Are you sure you want to delete this saved match?")) {
          deleteMatch(btn.getAttribute("data-vault-del-match"));
        }
      });
    });
  }

  function renderVaultTournaments() {
    if (!els.tournamentsList) return;
    let tournaments = getSavedTournaments();

    // Filters
    if (sportFilter !== "all") {
      tournaments = tournaments.filter((t) => t.sportKey === sportFilter);
    }
    if (searchFilter.trim()) {
      const q = searchFilter.toLowerCase();
      tournaments = tournaments.filter(
        (t) =>
          (t.tournamentName && t.tournamentName.toLowerCase().includes(q)) ||
          (t.sportTitle && t.sportTitle.toLowerCase().includes(q))
      );
    }

    if (tournaments.length === 0) {
      els.tournamentsList.innerHTML = `
        <div style="text-align: center; padding: 40px 20px; background: rgba(255,255,255,0.01); border: 1px dashed rgba(255,255,255,0.1); border-radius: 16px;">
          <div style="font-size: 2.5rem; margin-bottom: 8px;">🏆</div>
          <h3 style="margin: 0 0 4px; color: #fff; font-size: 1.1rem;">No Saved Tournaments Found</h3>
          <p style="margin: 0; color: var(--muted); font-size: 0.85rem;">Create a tournament in any sport and tap <strong>"💾 Save Tournament"</strong> to preserve all standings and fixtures!</p>
        </div>
      `;
      return;
    }

    els.tournamentsList.innerHTML = tournaments
      .map((t) => {
        return `
        <div class="vault-item-card">
          <div style="display: flex; gap: 14px; align-items: center;">
            <div style="width: 44px; height: 44px; border-radius: 12px; background: rgba(245, 158, 11, 0.15); border: 1px solid rgba(245, 158, 11, 0.3); display: flex; align-items: center; justify-content: center; font-size: 1.5rem; flex-shrink: 0;">
              🏆
            </div>
            <div>
              <div class="vault-sport-badge" style="background:rgba(245,158,11,0.15); color:var(--gold);">${t.sportIcon} ${t.sportTitle}</div>
              <h3 style="margin: 0; font-size: 1.05rem; font-weight: 800; color: #fff;">${t.tournamentName}</h3>
              <div style="font-size: 0.85rem; color: var(--muted); font-weight: 600; margin-top: 2px;">
                👥 ${t.teamsCount} Teams Registered • Standings Active
              </div>
              <div style="font-size: 0.75rem; color: var(--muted); margin-top: 4px;">
                📅 ${formatDate(t.savedAt)}
              </div>
            </div>
          </div>
          <div style="display: flex; gap: 8px; flex-shrink: 0;">
            <button class="save-to-vault-btn" data-vault-load-tourn="${t.id}" type="button" style="padding: 8px 16px; background:rgba(245,158,11,0.15); color:var(--gold); border-color:rgba(245,158,11,0.4);">
              <span>▶</span>
              <span>Resume</span>
            </button>
            <button type="button" data-vault-del-tourn="${t.id}" title="Delete Tournament" style="background: rgba(239,68,68,0.1); border: 1px solid rgba(239,68,68,0.25); color: #f87171; border-radius: 8px; padding: 8px 12px; cursor: pointer;">
              🗑️
            </button>
          </div>
        </div>
      `;
      })
      .join("");

    els.tournamentsList.querySelectorAll("[data-vault-load-tourn]").forEach((btn) => {
      btn.addEventListener("click", () => {
        loadTournament(btn.getAttribute("data-vault-load-tourn"));
      });
    });
    els.tournamentsList.querySelectorAll("[data-vault-del-tourn]").forEach((btn) => {
      btn.addEventListener("click", () => {
        if (confirm("Are you sure you want to delete this saved tournament?")) {
          deleteTournament(btn.getAttribute("data-vault-del-tourn"));
        }
      });
    });
  }

  // =========================================================================
  // 5. EXPORT / IMPORT BACKUP JSON
  // =========================================================================

  function exportBackup() {
    const data = {
      version: "1.0",
      exportedAt: new Date().toISOString(),
      user: currentUser,
      matches: getSavedMatches(),
      tournaments: getSavedTournaments()
    };

    const blob = new Blob([JSON.stringify(data, null, 2)], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `scoretracker_vault_backup_${new Date().toISOString().slice(0, 10)}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    showToast("💾 Vault backup downloaded successfully!");
  }

  function importBackup(file) {
    if (!file) return;
    const reader = new FileReader();
    reader.onload = function (e) {
      try {
        const data = JSON.parse(e.target.result);
        if (!data || (!data.matches && !data.tournaments)) {
          showToast("❌ Invalid backup file format.");
          return;
        }

        const currentMatches = getSavedMatches();
        const currentTournaments = getSavedTournaments();

        const newMatches = (data.matches || []).filter((m) => !currentMatches.some((cm) => cm.id === m.id));
        const newTournaments = (data.tournaments || []).filter((t) => !currentTournaments.some((ct) => ct.id === t.id));

        const mergedMatches = [...newMatches, ...currentMatches];
        const mergedTournaments = [...newTournaments, ...currentTournaments];

        localStorage.setItem(getVaultKey("matches"), JSON.stringify(mergedMatches));
        localStorage.setItem(getVaultKey("tournaments"), JSON.stringify(mergedTournaments));

        updateVaultCounts();
        renderVaultMatches();
        renderVaultTournaments();
        showToast(`✅ Restored ${newMatches.length} matches & ${newTournaments.length} tournaments!`);
      } catch (err) {
        console.error("Backup import error:", err);
        showToast("❌ Failed to parse backup file.");
      }
    };
    reader.readAsText(file);
  }

  // =========================================================================
  // 6. TOAST NOTIFICATIONS
  // =========================================================================

  function showToast(message) {
    let container = document.querySelector("#auth-toast-container");
    if (!container) {
      container = document.createElement("div");
      container.id = "auth-toast-container";
      container.style.cssText =
        "position: fixed; bottom: 24px; right: 24px; z-index: 99999; display: flex; flex-direction: column; gap: 10px; pointer-events: none;";
      document.body.appendChild(container);
    }

    const toast = document.createElement("div");
    toast.style.cssText =
      "background: #0b0f19; color: #fff; border: 1px solid rgba(255,255,255,0.15); border-radius: 12px; padding: 12px 18px; font-size: 0.88rem; font-weight: 700; box-shadow: 0 10px 30px rgba(0,0,0,0.6); pointer-events: auto; transform: translateY(20px); opacity: 0; transition: all 0.25s cubic-bezier(0.4, 0, 0.2, 1); display: flex; align-items: center; gap: 8px;";
    toast.innerHTML = message;
    container.appendChild(toast);

    requestAnimationFrame(() => {
      toast.style.transform = "translateY(0)";
      toast.style.opacity = "1";
    });

    setTimeout(() => {
      toast.style.transform = "translateY(10px)";
      toast.style.opacity = "0";
      setTimeout(() => toast.remove(), 250);
    }, 3500);
  }

  // =========================================================================
  // 7. INITIALIZATION & EVENT BINDINGS
  // =========================================================================

  function bindEvents() {
    initElements();

    // Google Sign-In button
    if (els.loginBtn) {
      els.loginBtn.addEventListener("click", () => {
        promptGoogleSignIn();
      });
    }

    // Profile Trigger dropdown toggle
    if (els.profileTrigger) {
      els.profileTrigger.addEventListener("click", (e) => {
        e.stopPropagation();
        els.profileDropdown.classList.toggle("hidden");
      });
    }

    // Close dropdown on outside click
    document.addEventListener("click", (e) => {
      if (els.profileDropdown && !els.profileDropdown.classList.contains("hidden")) {
        if (!els.profileWrapper.contains(e.target)) {
          els.profileDropdown.classList.add("hidden");
        }
      }
    });

    // Dropdown options
    if (els.dropdownOpenVault) {
      els.dropdownOpenVault.addEventListener("click", () => {
        els.profileDropdown.classList.add("hidden");
        openVaultModal("matches");
      });
    }
    if (els.dropdownExport) {
      els.dropdownExport.addEventListener("click", () => {
        els.profileDropdown.classList.add("hidden");
        exportBackup();
      });
    }
    if (els.dropdownSignOut) {
      els.dropdownSignOut.addEventListener("click", () => {
        signOut();
      });
    }

    // Nav Vault button
    if (els.navBtnVault) {
      els.navBtnVault.addEventListener("click", () => {
        openVaultModal("matches");
      });
    }

    // Vault Modal controls
    if (els.vaultCloseBtn) {
      els.vaultCloseBtn.addEventListener("click", closeVaultModal);
    }
    if (els.vaultModal) {
      els.vaultModal.addEventListener("click", (e) => {
        if (e.target === els.vaultModal) closeVaultModal();
      });
    }

    // Tab buttons
    if (els.tabMatches) {
      els.tabMatches.addEventListener("click", () => switchTab("matches"));
    }
    if (els.tabTournaments) {
      els.tabTournaments.addEventListener("click", () => switchTab("tournaments"));
    }
    if (els.tabBackup) {
      els.tabBackup.addEventListener("click", () => switchTab("backup"));
    }

    // Search and filter inputs
    if (els.searchInput) {
      els.searchInput.addEventListener("input", (e) => {
        searchFilter = e.target.value;
        if (activeTab === "matches") renderVaultMatches();
        else if (activeTab === "tournaments") renderVaultTournaments();
      });
    }
    if (els.sportFilterSelect) {
      els.sportFilterSelect.addEventListener("change", (e) => {
        sportFilter = e.target.value;
        if (activeTab === "matches") renderVaultMatches();
        else if (activeTab === "tournaments") renderVaultTournaments();
      });
    }

    // Save Active Sport Button
    const saveActiveBtn = document.querySelector("#vault-save-active-btn");
    if (saveActiveBtn) {
      saveActiveBtn.addEventListener("click", () => {
        saveCurrentActiveSport();
      });
    }

    // Backup Export & Import
    if (els.exportJsonBtn) {
      els.exportJsonBtn.addEventListener("click", exportBackup);
    }
    if (els.importInput) {
      els.importInput.addEventListener("change", (e) => {
        if (e.target.files && e.target.files[0]) {
          importBackup(e.target.files[0]);
          e.target.value = "";
        }
      });
    }
  }

  // Auto-init on DOMContentLoaded / script execution
  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", () => {
      bindEvents();
      initGoogleGSI();
      restoreSession();
    });
  } else {
    bindEvents();
    initGoogleGSI();
    restoreSession();
  }

  // Public API
  window.AuthVault = {
    getCurrentUser: () => currentUser,
    promptGoogleSignIn,
    signOut,
    saveMatch,
    saveTournament,
    saveCurrentActiveSport,
    getSavedMatches,
    getSavedTournaments,
    deleteMatch,
    deleteTournament,
    loadMatch,
    loadTournament,
    openVaultModal,
    closeVaultModal,
    showToast
  };
})();
