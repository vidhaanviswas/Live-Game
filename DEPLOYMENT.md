# Deployment Instructions

You can deploy **everything on Railway** (frontend + backend as two services), or deploy the backend on Railway and the frontend on Vercel/Netlify. The frontend must know the backend URL for WebSockets.

---

## 1. Railway-only (two services)

### 1.1 Backend service (Socket.IO)

1. **Sign up / log in** at [railway.app](https://railway.app).

2. **New project** → **Deploy from GitHub repo**.

3. **Root directory:** set to `server`.

4. **Build & start:**
   - Build: `npm install`
   - Start: `npm start`

5. **Variables:**
   - Add **`FRONTEND_URL`** = your Railway frontend service URL (you will get this after the frontend deploy).

6. **Deploy** and copy the backend public URL (e.g. `https://your-backend.up.railway.app`).

### 1.2 Frontend service (static site)

1. **Add a new service** in the same Railway project → **Deploy from GitHub repo**.

2. **Root directory:** set to `client`.

3. **Build & start:**
   - Build: `npm install && npm run build`
   - Start: `npm start`

4. **Variables:**
   - Add **`VITE_SOCKET_URL`** = your Railway backend URL (e.g. `https://your-backend.up.railway.app`).

5. **Deploy** and copy the frontend URL (e.g. `https://your-frontend.up.railway.app`).

6. **Backlink:** update the backend service `FRONTEND_URL` to the frontend URL so invite links point to the correct site.

---

## 2. Backend on Railway (if using Vercel or Netlify)

1. **Sign up / log in** at [railway.app](https://railway.app).

2. **New project** → **Deploy from GitHub repo** (or upload the project; ensure `server/` is at the repo root or adjust below).

3. **Root directory:** If the repo root is the project root (e.g. `memory-game/`), set:
   - **Root Directory** to `server` (so Railway runs `node index.js` from `server/`).

4. **Build & start:**
   - Build: leave empty or `npm install` (no build step needed for plain Node).
   - Start: `node index.js` or `npm start` (if `package.json` has `"start": "node index.js"`).

5. **Variables:**
   - Add `PORT` if Railway doesn’t set it (usually automatic).
   - Add **`FRONTEND_URL`** = your frontend URL (e.g. `https://your-app.vercel.app`). The server uses this to build the invite link.

6. **Deploy** and copy the public URL (e.g. `https://your-server.up.railway.app`). This is your **backend URL**.

---

## 3. Frontend on Vercel

1. **Import** the repo in [vercel.com](https://vercel.com) and set:
   - **Root Directory** to `client`.

2. **Build:**
   - Build command: `npm run build`
   - Output directory: `dist`

3. **Environment variable:**
   - Name: `VITE_SOCKET_URL`
   - Value: your Railway backend URL (e.g. `https://your-server.up.railway.app`). No trailing slash.

4. **Deploy.** The app will be at `https://your-project.vercel.app`.

5. **Invite links:** Ensure Railway has `FRONTEND_URL=https://your-project.vercel.app` so invite links point to the correct `/play?room=...` on the live frontend.

---

## 4. Frontend on Netlify (alternative)

1. **Add new site** from Git; set **Base directory** to `client`.

2. **Build settings:**
   - Build command: `npm run build`
   - Publish directory: `dist`

3. **Environment variable:**
   - Key: `VITE_SOCKET_URL`
   - Value: your Railway backend URL (e.g. `https://your-server.up.railway.app`).

4. **Deploy.** Set **FRONTEND_URL** on Railway to your Netlify URL (e.g. `https://your-site.netlify.app`) so invite links work.

---

## 5. Local / production behaviour

- **Development:** Frontend (Vite) proxies `/socket.io` to `http://localhost:3001`; no `VITE_SOCKET_URL` needed.
- **Production:** Frontend uses `VITE_SOCKET_URL` to connect to the Railway backend. If unset, it falls back to current `hostname`, which works only if frontend and backend share the same origin.

---

## 6. Checklist

- [ ] Backend deployed on Railway; public URL copied.
- [ ] Frontend deployed (Railway, Vercel, or Netlify) with root = `client`.
- [ ] `VITE_SOCKET_URL` set to the backend URL (no trailing slash).
- [ ] `FRONTEND_URL` on backend set to the live frontend URL.
- [ ] Open live frontend → Online → Create room → copy invite link → open in another tab/device and confirm join and play.
