# 📋 QUICK INTERVIEW CHECKLIST

Use this before your interview to verify everything is working.

---

## ✅ PRE-INTERVIEW VERIFICATION (5 minutes)

### **1. Install & Run**
```bash
npm run install:all
npm run dev
```
- [ ] Terminal 1: Backend starts on port 3001
- [ ] Terminal 2: Frontend starts on port 5173
- [ ] No errors in console

### **2. Test Solo Mode**
- [ ] Click "Solo" on home page
- [ ] See 16 cards arranged in 4x4 grid
- [ ] Click a card → flips with animation
- [ ] Click another card → see symbol
  - [ ] If match: cards stay open, green highlight
  - [ ] If no match: cards flip back after delay
- [ ] Score decreases by 4 on wrong match
- [ ] Timer shows elapsed time
- [ ] Moves counter increments per 2-card attempt
- [ ] Game ends when score hits 0 or all pairs matched
- [ ] End-game modal shows final stats

### **3. Test Local Multiplayer**
- [ ] Click "Local" on home page
- [ ] See two score panels with "Player 1" and "Player 2"
- [ ] "Player 1 to play" shown at top (highlighted)
- [ ] Player 1 flips 2 cards
  - [ ] If no match: score decreases by 4, switches to "Player 2 to play"
  - [ ] If match: cards stay open, stays as Player 1
- [ ] Switch back and forth between players
- [ ] Verify each player's score tracks independently
- [ ] Game ends, modal shows who won

### **4. Test Online Multiplayer - Room Invite**
- [ ] Click "Online" on home page
- [ ] Enter player name (e.g., "Alice")
- [ ] Click "Create room & get invite link"
  - [ ] See "Waiting for opponent…" message
  - [ ] See invite link (e.g., `http://localhost:5173/play?room=room-1234...`)
- [ ] Copy link, open in **new tab/window**
- [ ] New tab shows same URL with room ID
- [ ] Enter name in join form (e.g., "Bob"), click join
  - [ ] Both tabs now show game board
  - [ ] "Alice to play" shown
  - [ ] Both see same card layout
- [ ] Alice flips 2 cards → Bob immediately sees flip
- [ ] Continue playing; turns switch correctly
- [ ] Verify winner announced correctly

### **5. Test Online Multiplayer - Random Match**
- [ ] Create 2 browser windows (or tabs in incognito + normal)
- [ ] Window 1: Click "Online" → enter name → "Play random match"
  - [ ] Shows "Waiting for opponent…"
- [ ] Window 2: Click "Online" → enter name → "Play random match"
  - [ ] Both windows immediately show game board
  - [ ] Same deck and room ID visible
- [ ] Play a few moves to verify sync
- [ ] Verify connection indicator shows "● Connected" in both

### **6. Test Disconnect Handling**
- [ ] Start online game with 2 windows
- [ ] Close one window/tab mid-game
- [ ] Other window should show "You win!" or "Opponent disconnected"
- [ ] Check console for any errors

### **7. Verify UI Polish**
- [ ] [ ] Cards have smooth flip animation
- [ ] [ ] Hover over card → slight scale up
- [ ] [ ] Score display has color coding (green/amber/red)
- [ ] [ ] All buttons have hover effects
- [ ] [ ] Modal appears with fade-in animation
- [ ] [ ] No console errors (press F12)
- [ ] [ ] Responsive on mobile size (F12 device emulation)

---

## 🗣️ EXPLANATION TALKING POINTS (Memorize These)

### **Opening (30 seconds)**
"I built a Memory Card Game with three modes. Solo for core mechanics, Local Multiplayer to show turn-based fairness, and Online with real-time sync and anti-cheat. It demonstrates architecture thinking, clean code, and realistic multiplayer patterns."

### **Architecture (1 minute)**
"The core is simple: a single `GAME_CONFIG` object controls all rules. The game logic is pure functions with no side effects—very testable. For UI, I use Zustand for simple state. For multiplayer, the server is the source of truth; clients emit moves, server validates, then broadcasts updated state. This prevents cheating and desync."

### **If Asked "Why No Database?"**
"In-memory rooms are perfect for a demo. We generate a unique room ID, store it in a Map, and clean it up after 60 seconds. For production, I'd add PostgreSQL for match history and leaderboards, and Redis for real-time state synchronization across multiple servers."

### **If Asked "How Do You Prevent Cheating?"**
"Every move goes through the server. Before accepting a flip, we check `isCurrentTurn(room, playerId)`. Only the active player can flip. The client can't modify the room state directly—it's read-only. All game logic (scoring, turns, win conditions) runs on the server."

### **If Asked "What If Someone Disconnects?"**
"We detect disconnect via Socket.IO's disconnect event. We mark the room as finished, set the remaining player as the winner, and schedule room cleanup in 60 seconds. The remaining player sees a clear 'You win' message."

---

## 🛠️ LIVE MODIFICATION EXAMPLES (Be Ready)

If asked to modify code **live**, here are the easiest changes:

### **Change 1: Double the Starting Score (100 → 200)**
```javascript
// File: client/src/gameLogic/config.js
// Line: 6
- startingScore: 100,
+ startingScore: 200,

// File: server/gameManager.js
// Line: 8
- startingScore: 100,
+ startingScore: 200,
```
**Time:** < 30 seconds  
**Impact:** All modes immediately use 200 starting score

---

### **Change 2: Increase Penalty from 4 to 6**
```javascript
// File: client/src/gameLogic/config.js
// Line: 7
- penalty: 4,
+ penalty: 6,

// File: server/gameManager.js
// Line: 9
- penalty: 4,
+ penalty: 6,
```
**Time:** < 30 seconds

---

### **Change 3: Add More Card Pairs (8 → 12)**
```javascript
// File: client/src/gameLogic/config.js
// Line: 8
- totalPairs: 8,
+ totalPairs: 12,

// File: server/gameManager.js
// Line: 10
- totalPairs: 8,
+ totalPairs: 12,
```
**Time:** < 30 seconds  
**Note:** Game board auto-adjusts to 4 columns (grows down)

---

### **Change 4: Support 3 Players in Local Mode**
```javascript
// File: client/src/store/gameStore.js
// Around line 48
initLocal: () =>
  set({
    mode: 'local',
    deck: createDeck(),
    flippedIndices: [],
    currentPlayerIndex: 0,
-   scores: getInitialScores(2),
-   playerNames: ['Player 1', 'Player 2'],
+   scores: getInitialScores(3),
+   playerNames: ['Player 1', 'Player 2', 'Player 3'],
    // ... rest unchanged
  }),
```
**Time:** 1 minute  
**Why it works:** `processFlip()` uses `(currentPlayerIndex + 1) % scores.length`, so it automatically cycles through 3 players

---

### **Change 5: Faster Card Flip Animation (800ms → 400ms)**
```javascript
// File: client/src/gameLogic/config.js
// Line: 9
- flipDelay: 800,
+ flipDelay: 400,

// File: server/gameManager.js
// Line: 11
- flipDelay: 800,
+ flipDelay: 400,
```
**Time:** < 30 seconds  
**Impact:** Cards flip back faster, game feels snappier

---

## 🎯 KEY FILES TO REFERENCE

| If Asked About... | Look At... |
|---|---|
| Game rules | `client/src/gameLogic/config.js` |
| Game logic | `client/src/gameLogic/engine.js` |
| State management | `client/src/store/gameStore.js` |
| Solo UI | `client/src/pages/Solo.jsx` |
| Multiplayer sync | `server/gameManager.js` + `applyFlip()` |
| Socket events | `server/index.js` |
| Animations | `client/src/index.css` + `tailwind.config.js` |
| Deployment | `DEPLOYMENT.md` |

---

## ⚠️ GOTCHAS TO AVOID

1. **If backend doesn't start:** Make sure port 3001 is free. If not, set `PORT=3002 npm run dev:server`
2. **If online mode shows "Disconnected":** Check browser console. `VITE_SOCKET_URL` env var might not be set (OK for local dev).
3. **If cards don't flip:** Check browser console for JS errors (shouldn't be any after the import fix).
4. **If random match doesn't work:** Click "Play random match" in one tab, wait 2-3 seconds, click in another. Timing matters!
5. **If invited friend can't join:** Make sure they have the full URL including `?room=...` part. Copy from invite box, don't retype.

---

## 📝 WHAT TO SUBMIT / SHOW

1. ✅ **Live demo:** Run the game and show all 3 modes
2. ✅ **Code walkthrough:** Open files mentioned above
3. ✅ **Modification:** If asked, make a small change and show it works
4. ✅ **Documentation:** Reference README, DEPLOYMENT, INTERVIEW_SCRIPT

---

## 🎓 CONFIDENCE BOOSTERS

- ✅ You've verified everything works
- ✅ You know the architecture (config → logic → UI → socket)
- ✅ You can explain trade-offs (in-memory vs DB, etc.)
- ✅ You can live-code simple changes
- ✅ You have talking points ready
- ✅ No critical bugs remain

**You're ready! 💪**

---

## Last-Minute Checklist

- [ ] Backend running: `npm run dev:server` in terminal
- [ ] Frontend running: `npm run dev:client` in terminal
- [ ] Browser open to http://localhost:5173
- [ ] Console open (F12) showing no errors
- [ ] All 3 game modes tested
- [ ] Talking points memorized or printed
- [ ] INTERVIEW_SCRIPT.md visible on second monitor (if available)
- [ ] Modification guide bookmarked
- [ ] No open tabs with sensitive info visible

**Go ace your interview! 🚀**
