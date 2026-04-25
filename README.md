# Chess Web App

A full-stack chess game in the browser. Sign up, play a real game of chess with drag-and-drop, save your board, load it later, and track wins on a shared scoreboard.

**Stack:** JavaScript · Node.js · Express · HTML5 · CSS3 · REST · JSON · Vitest

<!-- TODO: replace with a gameplay screenshot or a short demo GIF. -->
<p align="center">
  <img src="frontend/images/white_knight.png" alt="White knight" width="120" />
  <img src="frontend/images/black_knight.png" alt="Black knight" width="120" />
</p>

---

## Features

- **Account system** — sign-up and sign-in backed by an Express REST API.
- **Real chess** — every piece moves by the real rules. Boundaries, captures, and win detection are all checked on the board.
- **Drag-and-drop** — pick up a piece, drop it on a legal square, and the board updates live.
- **Save / load / delete games** — pick up right where you left off. Saves live on the server, tied to your account.
- **Scoreboard** — every finished match is logged with players and winner, shared across users.
- **Tested** — Vitest unit tests cover the server-side helpers.

## Why this project is interesting

One project, three different angles a recruiter can read it through:

**Algorithmic thinking — quant-ish:**
The board is an 8×8 matrix of piece objects. Each piece type has its own move rules (bishop diagonals, knight L-shapes, pawn first-move + capture, etc.). Every attempted move is validated against position, boundaries, and the state of other pieces on the board. Win detection runs on every move.

**Data handling — data-analyst-ish:**
Clean CRUD over three JSON stores: `users.json` (accounts), `boards.json` (saved games per user), and `scoreboard.json` (match history). Simple schema, simple queries, but the pattern is the same pattern you'd use against a real database.

**Game development:**
Client-side state machine for the game loop, drag-and-drop UX with hover animations, and client/server sync so a saved game on one device comes back correctly on the next.

## Architecture

```
 Browser (HTML/CSS/JS)          Node/Express server          JSON files
 ───────────────────────        ──────────────────────       ───────────────
 chessgame.js  ─┐                                             users.json
 savegame.js    │── fetch ──►   /api/users                    boards.json
 loadgame.js    │── fetch ──►   /api/boards                   scoreboard.json
 scoreboard.js ─┘── fetch ──►   /api/scores
```

The Express server is thin — it reads and writes those three JSON files and speaks REST to the frontend. No framework on the frontend; it's vanilla JS talking to the DOM directly.

### REST endpoints

| Method | Path                                    | What it does                            |
| ------ | --------------------------------------- | --------------------------------------- |
| GET    | `/`                                     | Health check                            |
| POST   | `/api/users`                            | Create a new account                    |
| GET    | `/api/users/:email`                     | Look up a user                          |
| GET    | `/api/verify_user/:email/:password`     | Verify credentials on sign-in           |
| GET    | `/api/boards/:email`                    | Load a saved game                       |
| POST   | `/api/boards`                           | Save / overwrite a game                 |
| DELETE | `/api/boards`                           | Delete a saved game                     |
| POST   | `/api/scores`                           | Record a finished match                 |
| GET    | `/api/scores`                           | Fetch the scoreboard                    |

## Getting started

You need Node.js 18+ and npm.

```bash
git clone https://github.com/KevinDang12/web-project.git
cd web-project/backend
npm install
npm run dev        # uses nodemon; or: node server.js
```

The server listens on **http://localhost:5000**.

Then open `frontend/html/login.html` in **Chrome or Edge** (see note on Firefox below). Create an account — any email in the form `username@example.com` works — and play.

## Testing

```bash
cd backend
npx vitest
```

Known quirk: if you run the test suite first and then start the server in the same terminal, `Ctrl+C` sometimes can't stop the server. Close the terminal to stop it cleanly.

## Project structure

```
web-project/
├── backend/
│   ├── server.js          # Express app + routes
│   ├── server.test.js     # Vitest tests
│   ├── test/              # test fixtures
│   └── package.json
├── frontend/
│   ├── html/              # login, mainmenu, chessgame, savegame, loadgame, scoreboard
│   ├── css/               # per-page styles
│   ├── js/                # auth, chessgame, savegame, loadgame, scoreboard, navigate, logout
│   └── images/            # piece sprites + profile icon
└── README/
    └── notes.txt          # original team notes
```

## Known issues

- **Firefox breaks session storage** — the site assumes session data behaves the way Chrome/Edge implement it. Firefox does not cooperate, so use a Chromium-based browser.
- **JSON storage is not production-ready** — passwords are stored in plain JSON. That's fine for a class project; see the roadmap for what a real version would do.

## Roadmap

- Swap the JSON files for **PostgreSQL** with hashed passwords (bcrypt).
- Add a **Dockerfile** and a one-command deploy to Render / Fly / Railway.
- **WebSocket multiplayer** so two people can play each other in real time.
- Full **move history** with algebraic notation and a "replay game" view — natural hook into analytics.

## Contributors

This is a team project. Three people worked on it:

- <!-- TODO: your name --> — chess engine work: 8×8 piece matrix, per-piece movement rules, boundary and capture logic, drag-and-drop, win detection, localStorage-backed game state. _GitHub: TODO · LinkedIn: TODO_
- **Kevin Dang** ([@KevinDang12](https://github.com/KevinDang12)) — Node/Express server, sign-in and sign-up, save / load / delete endpoints, scoreboard API, Vitest tests. Repo owner.
- **Hasan Iqbal** ([@redhasanh1](https://github.com/redhasanh1)) — co-contributor on the frontend per the original team notes.

### My contributions in this repo

<!-- TODO: expand with 3-5 short bullets in your own words. Recruiters read this. Examples you can steal: -->
- Built the chess engine: modeled the board as an 8×8 matrix and implemented movement rules for every piece type.
- Wrote the drag-and-drop interaction layer, including hover animations and legal-move feedback.
- Handled game state: saving to `localStorage` between moves and syncing to the server on explicit save.

## License

MIT — see [`LICENSE`](LICENSE).
