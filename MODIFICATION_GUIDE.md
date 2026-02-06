# Live Modification Cheat Sheet

Use this when an interviewer asks you to change behaviour. Each item lists **what** to change, **where**, and **how**.

---

## 1. Change scoring logic

**Goal:** e.g. change starting score to 80 or penalty to 6.

**Where:**  
- **Client:** `client/src/gameLogic/config.js`  
- **Server:** `server/gameManager.js` (top: `GAME_CONFIG`)

**What:**  
- In both files, adjust `GAME_CONFIG.startingScore` and/or `GAME_CONFIG.penalty`.  
- Client engine and store use the client config; server uses its own. Keep them in sync (or share a single config in a monorepo).

**Function:** No single “scoring function” — scores are updated in:
- Client: `client/src/gameLogic/engine.js` → `processFlip` (builds `newScores`).
- Server: `server/gameManager.js` → `applyFlip` (updates `room.players[currentIdx].score`).

---

## 2. Add a timer (e.g. to Solo)

**Goal:** Show a countdown or “time taken” in solo mode.

**Where:**  
- **Page:** `client/src/pages/Solo.jsx`  
- **Store (optional):** `client/src/store/gameStore.js` if you want `startTime`/`endTime` in global state.

**What:**  
- Solo already has `startTime` and computes `elapsedSeconds`. To add a **countdown** (e.g. 60s): add state like `timeLeft = 60`, decrement every second in a `setInterval`; when `timeLeft <= 0` set `gameOver` and optionally freeze the board.  
- To show “Time taken” only: keep current logic; it’s already in the end-game modal.

**Function:** Same `Solo.jsx` `useEffect` that runs the interval; when `timeLeft <= 0`, call a small helper that sets game over in the store (e.g. a new `setGameOver()` in the store).

---

## 3. Increase number of players (e.g. Local: 3 or 4)

**Goal:** Support 3 or 4 players on the same device.

**Where:**  
- **Config:** `client/src/gameLogic/config.js` — no change unless you want more pairs.  
- **Engine:** `client/src/gameLogic/engine.js` — `processFlip` already uses `scores.length` and `(currentPlayerIndex + 1) % scores.length`, so it works for N players.  
- **Store:** `client/src/store/gameStore.js` — in `initLocal`, change `getInitialScores(2)` to `getInitialScores(3)` or `4`, and `playerNames` to `['Player 1', 'Player 2', 'Player 3']` (etc.).  
- **UI:** `client/src/pages/Local.jsx` and `client/src/components/ScorePanel.jsx` — they iterate over `playerNames`/`scores`, so they scale if you add more names/scores in the store.

**Function:** `initLocal` in `gameStore.js`; `processFlip` in `engine.js` (already generic).

---

## 4. Add a leaderboard

**Goal:** Show top scores (e.g. solo) after the game.

**Where:**  
- **Backend:** Add a simple store (e.g. in-memory array or a JSON file) and an HTTP endpoint like `GET /leaderboard` and `POST /leaderboard` (name + score).  
- **Frontend:** New component e.g. `Leaderboard.jsx`; call the API from Solo end-game modal or a dedicated “Leaderboard” page.  
- **Server:** `server/index.js` — add `app.get('/leaderboard', ...)` and `app.post('/leaderboard', ...)`.

**What:**  
- On game end (solo), POST `{ name, score }`.  
- Leaderboard page or modal GETs list, sorts by score, shows top 10.  
- For “no DB”: keep an in-memory array; it resets on restart. For persistence, add SQLite or a hosted DB later.

**Function:** New handlers in `server/index.js`; new component + API calls in client.

---

## 5. Add difficulty levels

**Goal:** Easy (e.g. 6 pairs), Medium (8), Hard (12).

**Where:**  
- **Config:** `client/src/gameLogic/config.js` — you can add `difficultyLevels: { easy: 6, medium: 8, hard: 12 }` or keep only `totalPairs` and set it per difficulty.  
- **Engine:** `client/src/gameLogic/engine.js` — `createDeck(pairs)` already takes a number; pass the value for the chosen difficulty.  
- **UI:** Home or a “New game” screen: add buttons or a select for Easy/Medium/Hard; pass selected pairs to `initSolo`/`initLocal`.  
- **Store:** `initSolo(pairs)` / `initLocal(pairs)` — extend so they call `createDeck(pairs)` with the chosen value.

**What:**  
- Add state (e.g. `difficulty`) on Home or in the store.  
- When starting solo/local, call `createDeck(difficultyPairs[difficulty])` and pass that deck (and same `scores` length) into the store.  
- Server online mode: could add a “room options” object with `pairs` and use it in `createDeck` when the room is created or when the second player joins.

**Function:** `createDeck` in `engine.js` and in `server/gameManager.js`; `initSolo`/`initLocal` in `gameStore.js`; new UI for difficulty selection.

---

## Summary table

| Change            | File(s)                                      | Function / area          |
|-------------------|-----------------------------------------------|---------------------------|
| Scoring           | `client/src/gameLogic/config.js`, `server/gameManager.js` | `GAME_CONFIG`, `processFlip`, `applyFlip` |
| Timer (solo)      | `client/src/pages/Solo.jsx`, optional store   | `useEffect` interval, game over |
| More players      | `client/src/store/gameStore.js`, engine       | `initLocal`, `processFlip` |
| Leaderboard       | `server/index.js`, new component + API        | New GET/POST routes, UI   |
| Difficulty        | `config.js`, `engine.js`, `gameManager.js`, UI | `createDeck`, init flows, Home/Solo/Local UI |
