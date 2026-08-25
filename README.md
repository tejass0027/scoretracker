# Multi-Sport Score Tracker & Tournament Standings Compiler

An offline-ready, self-contained dashboard application designed for tracking live match metrics and running round-robin tournament leagues for multiple sports.

## What It Does

This application provides real-time scoring trackers and tournament standing compilers for five distinct sports:

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
* Includes a graphical badminton court visualization situated next to the scoreboard.
* Compiles round-robin fixtures and standings ratios.
