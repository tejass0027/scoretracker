# Multi-Sport Score Tracker & Tournament Standings Compiler

An offline-ready, self-contained dashboard application designed for tracking live match metrics and running round-robin tournament leagues for multiple sports.

## What It Does

This application provides real-time scoring trackers and tournament standing compilers for fourteen distinct sports:

### 1. 🏏 Cricket Scorer
* Tracks runs, wickets, overs, balls, and run-rates.
* Handles custom match configurations (overs, players limit).
* Features interactive batter and bowler stats toggles and detailed ball-by-ball summaries.
* Generates full round-robin tournament schedules, compiled team standings (wins, net run rate), and individual player statistic leaderboards (highest runs, wickets).

### 2. ⚽ Football Scorer
* Tracks goals, halves, elapsed match time, corner kicks, and goal kicks.
* Includes warning card logging (Yellow/Red) and max substitutions tracking.
* Runs league tournaments with automatic win/loss point standing tables and fixture logs.

### 3. 🏀 Basketball Scorer
* Tracks game periods (regulation quarters and overtimes) with custom period durations.
* Incorporates a live match countdown timer, timeout countdowns, and synthesized raspy referee buzzers.
* Features a graphical court visualization displaying the on-court player lineup.
* Logs standard basketball points (+1 FT, +2 FG, +3 3PT) and tracks team/personal fouls.
* Compiles tournament stands based on score differences.

### 4. 🎾 Tennis Scorer
* Implements standard tennis point progression (0, 15, 30, 40, Deuce, Advantage, Game).
* Supports custom sets structures (Best of 3 vs Best of 5), Advantage sets (no-tiebreak), and standard 7-Point Tiebreakers at 6-6.
* Features server indicators, point-by-point history log timelines, and tournament fixtures standing tables.

### 5. 🏸 Badminton Scorer
* Tracks point-by-point rallies up to 21 points (standard) or 11 points (short).
* Follows setting rules (deuce setting at 20-20 or 10-10) with a capped maximum limit of 30 or 15 points.
* Compiles round-robin fixtures and standings ratios.

### 6. 🏑 Hockey Scorer
* Tracks goals, 4 Quarters, Halftimes, and Shootout tiebreakers.
* Live period countdown timer with audio buzzer alerts.
* Tracks Penalty Corners (PC) and Penalty Strokes (PS) counters for each team.
* Includes Sin Bin card suspensions with active countdown timers: Green Card (2m), Yellow Card (5m/10m), and Red Card (ejection).
* Compiles round-robin league fixtures and points standing tables (with Goal Difference, Goals For, and Goals Against).

### 7. 🏐 Volleyball Scorer
* Supports Best of 3 Sets or Best of 5 Sets (Standard FIVB).
* Implements FIVB rally scoring (25 points for sets 1-4, 15 points for deciding set, win-by-2 deuce rule).
* Features serving team indicators and rotation tracking.
* Incorporates a 30-second timeout clock with synthesized buzzer alerts and timeout limit trackers (2 per set).
* Compiles round-robin tournament standings based on FIVB league points (3-0/3-1 = 3pts, 3-2 = 2pts, 2-3 = 1pt), Sets ratios, and Points ratios.

### 8. ⚾ Baseball Scorer
* Supports 9, 7, 5, or 3 regulation innings with extra innings support.
* Inning-by-inning box line score tracking with Runs (R), Hits (H), and Errors (E).
* Visual interactive Base Diamond showing active base runners (1st, 2nd, 3rd Base) with automatic runner advance physics.
* Ball, Strike, and Out (B-S-O) pitch counts with automatic walks on 4 balls and strikeouts/half-inning change on 3 outs.
* Compiles round-robin league standings with Win PCT, Runs Scored, Runs Allowed, and Run Differentials.

### 9. 🏉 Rugby Scorer
* Supports Rugby Union (15s) and Rugby Sevens (7s).
* Tracks World Rugby point progression: Try (+5), Conversion (+2), Penalty Goal (+3), and Drop Goal (+3).
* Displays live scoring breakdown chips (T - C - P - DG).
* Interactive live match stopwatch with synthesized referee whistles.
* Sin Bin disciplinary management with live countdown timers: Yellow Card (10m in 15s, 2m in 7s) and Red Card (Send Off).
* Compiles World Rugby bonus points standings (4 pts win, 2 pts draw, +1 Try Bonus for 4+ tries, +1 Losing Bonus for &le; 7 pts deficit).

### 10. 🤼 Kabaddi Scorer
* Implements Pro Kabaddi League (PKL) scoring system.
* Features Touch Points (+1 to +4), Bonus Points (+1), Tackle Points (+1), and Super Tackles (+2).
* Visual on-mat active player dots tracking (7 to 0) with automatic All-Out (Lona +2) detection and full-team revival.
* Interactive 30-Second Raid Clock with buzzer alerts and consecutive empty raid / Do-or-Die raid tracking.
* Compiles PKL 5-point tournament standings (5 pts win, 3 pts tie, 1 pt for loss by &le; 7 points).

### 11. 🏓 Table Tennis (Ping Pong) Scorer
* Follows official ITTF scoring: Best of 3, 5, or 7 games (11 points, win-by-2 deuce).
* Dynamic service rotation: 2-point rotation in standard play and 1-point rotation in deuce (10-10+).
* Server indicators with remaining serve counter (1/2, 2/2) and deciding game end-change alerts (at 5 points).
* Real-time Game Point and Match Point visual alerts.
* 60-second tactical timeout clock with audio buzzer.
* Compiles ITTF tournament standings based on Match Points (2 pts win, 1 pt loss), Game ratios, and Point ratios.

### 12. ⛳ Golf Scorer
* Follows official USGA / PGA Tour rules for Stroke Play (To Par / Gross Strokes) and Modified Stableford points.
* Supports 18-Hole (Front 9 OUT, Back 9 IN, Total) and 9-Hole group rounds (1 to 4 players).
* Features Par 3, 4, and 5 hole configurations with Eagle (-2), Birdie (-1), Par (E), Bogey (+1), and Double Bogey+ (+2+) quick stroke chips.
* Interactive full course scorecard with standard circle (Eagle/Birdie) and square (Bogey/Double) highlights.
* Real-time PGA Tour Leaderboard with official ranking, ties calculation (Pos: 1, T2, T2, 4), To Par (+/-), Thru holes, and Gross Strokes.

### 13. 🥊 Boxing Scorer
* Follows official 10-Point Must scoring rules (WBC, WBA, IBF, WBO) across 4 to 12 Championship rounds.
* Features Compubox-style live punch tracking: Jabs, Power Punches, Knockdowns (KD), and referee foul point deductions (-1).
* Live round countdown clock with synthesized Boxing Bell audio (3 gong rings) and 10-second wood tap clapper warnings.
* Official 3-Judge Scorecard table with automated decision outcomes: Unanimous Decision (UD), Split Decision (SD), Majority Decision (MD), or Draw.
* Supports stoppage declarations: KO (Knockout), TKO (Technical Knockout), and RTD (Corner Retirement).
* Compiles Championship Tournament bout cards, boxer records (W-L-D, KOs), and title points standings.

### 14. 🥋 MMA (Mixed Martial Arts / UFC) Scorer
* Follows official Unified Rules of MMA across 3 or 5 five-minute rounds.
* Features live UFC fight metrics tracking: Significant Strikes, Takedowns (TD), Control Time, Knockdowns (KD), Submission Attempts, and foul deductions (-1).
* Live 5:00 round countdown clock with synthesized Octagon Horn / Buzzer audio and 10-second wood clapper warnings.
* Official 3-Judge Scorecard table with automated decision outcomes: Unanimous Decision (UD), Split Decision (SD), Majority Decision (MD), or Draw.
* Comprehensive finish methods: KO/TKO (Head Kick, Flying Knee, Ground & Pound) and Submission (Rear Naked Choke, Guillotine, Armbar, Triangle).
* Compiles Grand Prix Championship fight cards, fighter records (W-L-D, KOs, SUBs), and division standings.
