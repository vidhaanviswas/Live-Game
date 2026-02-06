# 2–3 Minute Explanation Script

Use this as a concise script to explain the project in an interview.

---

## Why these modes

- **Solo:** Lets users play without anyone else; good for practice and for demonstrating core mechanics (scoring, timer, moves).
- **Local:** Same device, two players — no network. Highlights turn-taking and fairness (clear active player and scores).
- **Online:** Covers real-world use: play with a friend via link, or get a quick game via random match. Shows real-time sync and simple anti-cheat (only active player can flip).

---

## Why this architecture

- **Central config (`GAME_CONFIG`):** One place for starting score, penalty, pairs, and flip delay. Changing rules doesn’t require hunting through UI code.
- **Game logic separation:** Pure functions in `gameLogic/engine.js` handle deck creation and flip outcome. The UI and the server only read/update state. That makes the game testable and easy to change in a live demo.
- **Multiplayer sync:** Server is the source of truth. Every flip is sent to the server; it validates turn, applies the move, and broadcasts the new state. Clients just render what they receive, so we avoid desync and cheating.

---

## How AI accelerated work

- AI helped scaffold the repo (client/server split, routes, components), implement Socket.IO events and room flow, and align the game rules with the spec.
- Logic and config were kept in a few files so that a human (or interviewer) can quickly follow and modify them. AI was used for speed and structure, not to hide how the system works.

---

## How you validated correctness

- **Rules:** Starting score 100, −4 per wrong match, game end at 0 or all matched — implemented in both client engine and server gameManager and checked against the spec.
- **Solo/Local:** Played through games to confirm turn switch (local), timer and moves (solo), and end-game modal.
- **Online:** Created room, joined via link and via random match, verified both players see the same board and turns, and that disconnect gives the remaining player a win.

You can add: “I’d add unit tests for `processFlip` and server `applyFlip` next to lock behaviour before adding features.”
