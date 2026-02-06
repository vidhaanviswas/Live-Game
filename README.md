# Memory Card Game

Live link: https://card-game.up.railway.app/

A modern web-based Memory Card Game with **Solo**, **Local Multiplayer**, and **Online Multiplayer** modes — built for real-time play and clear explainability (e.g. eLitmus Management Trainee evaluation).

---

## Product Overview

Users can:

- **Play Solo** — Single player, score-based completion with timer and moves counter.
- **Play Local Multiplayer** — Two players on the same device; turns alternate after each wrong match; scores and active player are clearly shown.
- **Play Online** — Create a room and share a unique link, or join a **random public match**. Real-time card flips and turn-based rules; only the active player can flip to prevent cheating.

The game uses **Greek alphabet symbols** on the cards (each symbol appears exactly twice). It is designed to feel polished and shareable, with smooth animations and immediate feedback.

---

## Game Modes

| Mode   | Description |
|--------|-------------|
| **Solo** | One player, 100 starting points, −4 per wrong match. Timer and moves shown. Game ends when all pairs are matched or score hits 0. |
| **Local** | Two players, same device. Turn switches after a wrong match. Same scoring; UI shows active player and both scores. |
| **Online** | **Invite via link:** Create room → get URL → friend opens link and joins. **Random match:** Click “Play random match” to be paired with another waiting player. Real-time sync; turn-based; connection status and player names shown. |

---

## Core Rules (Non-Negotiable)

- Cards are face down; each has a Greek letter; each symbol appears **exactly twice**.
- Player flips two cards: **Match** → cards stay open. **No match** → cards flip back after a short delay.
- **Scoring:** Each player starts at **100 points**. Every wrong match **deducts 4 points**.
- **Game ends when:** All cards are matched **or** any player’s score reaches **0**.

---

## Tech Stack & Why

| Layer    | Choice | Reason |
|----------|--------|--------|
| **Frontend** | React (Vite), Tailwind CSS, Zustand | Fast dev experience, simple state, easy to explain and modify. |
| **Backend**  | Node.js, Express, Socket.IO | Standard stack; WebSockets for real-time multiplayer without a database. |
| **State**    | Zustand | Lightweight; game state and UI state live in one store; easy to trace. |
| **Deployment** | Vercel/Netlify (frontend), Railway (backend) | Free tiers, simple env vars; interview-friendly. |

---

## Multiplayer Architecture

- **Rooms:** In-memory on the server (no DB). Each room has a unique ID and holds: players, deck, flipped indices, current turn, scores.
- **Create room:** Client emits `create-room` → server creates room, host joins → client gets `roomId` and **invite link**.
- **Join room:** Client emits `join-room` with `roomId` (parsed from URL if user pastes full link) → server adds second player and sets game to “playing”.
- **Random match:** Client emits `join-random` → if someone is waiting, they are paired and game starts; otherwise current user is added to a waiting queue and waits for the next `join-random`.
- **Sync:** Every flip is emitted as `flip-card`; server validates turn and applies move, then **broadcasts** `game-state` to the room so both clients stay in sync.
- **Disconnects:** On disconnect, server marks room as finished and sets `winnerByDisconnect` so the remaining player sees “You win” / “Opponent left”.

---

## Scoring Logic

- Central config (shared idea across client and server):

```js
const GAME_CONFIG = {
  startingScore: 100,
  penalty: 4,
  totalPairs: 8,
  flipDelay: 800
};
```

- **Solo / Local:** Pure functions in `client/src/gameLogic/engine.js` apply flips and score changes; Zustand store holds deck, scores, and turn.
- **Online:** Server `gameManager.js` applies the same rules; clients receive updated room state after each flip.

---

## Project Structure

```
/memory-game
├── client/
│   ├── src/
│   │   ├── components/   # Card, Board, ScorePanel, TurnIndicator, EndGameModal
│   │   ├── pages/       # Home, Solo, Local, Online, Play
│   │   ├── gameLogic/   # config.js, engine.js (pure game logic)
│   │   ├── socket/      # socket.js (Socket.IO client)
│   │   ├── store/       # gameStore.js (Zustand)
│   │   └── App.jsx
│   └── index.html
├── server/
│   ├── index.js         # Express + Socket.IO, room events
│   └── gameManager.js   # Create/join rooms, apply flips, disconnect handling
├── README.md
├── DEPLOYMENT.md
├── INTERVIEW_SCRIPT.md
├── MODIFICATION_GUIDE.md
└── package.json
```

---

## Design Decisions

- **Single GAME_CONFIG:** One place to change starting score, penalty, pairs, and flip delay so behaviour stays consistent in solo, local, and online.
- **Game logic separation:** `engine.js` is pure (no DOM, no I/O). UI and sockets only read/update state; this makes testing and live changes easier.
- **No database:** In-memory rooms keep the demo simple and deployable without DB setup; suitable for interviews and MVPs.
- **Invite link + random match:** Covers “play with a friend” and “quick game” without extra complexity.

---

## Trade-offs

- **In-memory rooms:** Rooms and waiting queue are lost on server restart; no persistence or match history.
- **No auth:** Players are identified by socket id and optional display name; no accounts.
- **Single server:** No horizontal scaling of game state; sufficient for small/medium traffic.

---

## Future Enhancements (Mentioned, Not Implemented)

- **Spectator mode:** Allow a third connection to watch a match without flipping.
- **Match history:** Persist finished games (e.g. in DB) and show recent results.
- **Ranked matchmaking:** Elo or similar; queue by skill.
- **Mobile responsiveness:** Layout and touch targets already considered; can be refined further.
- **Accessibility:** Keyboard navigation and improved color contrast for low vision.

---

## How AI Was Used

- AI helped with project scaffolding, React + Zustand structure, and Socket.IO event design.
- Game rules and config were specified by the requirements; AI implemented them and kept logic in one place.
- README, deployment steps, and modification guide were drafted with AI and then aligned with the actual codebase and interview needs.

---

## Quick Start

1. **Install**

   ```bash
   npm run install:all
   ```

2. **Run**

   - Terminal 1: `npm run dev:server` (backend, default port 3001)
   - Terminal 2: `npm run dev:client` (frontend, default port 5173)

   Or use `npm run dev` if you have `concurrently` (see root `package.json`).

3. **Play**

   - Open `http://localhost:5173`, choose Solo, Local, or Online, and follow the UI.

---

## Deployment

See **[DEPLOYMENT.md](./DEPLOYMENT.md)** for step-by-step instructions (Railway for backend, Vercel or Netlify for frontend).

---

## Interview Readiness

- **2–3 minute explanation:** See **[INTERVIEW_SCRIPT.md](./INTERVIEW_SCRIPT.md)**.
- **Live code changes:** See **[MODIFICATION_GUIDE.md](./MODIFICATION_GUIDE.md)** for where to change scoring, timer, players, leaderboard, and difficulty.
