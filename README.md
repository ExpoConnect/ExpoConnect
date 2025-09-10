# 🚀 Startup Project

This repository contains both **backend** (ASP.NET Core Web API) and **frontend** (React + Vite + TypeScript) code for the project.  
The repo is organized as a **monorepo** with two main folders: `backend/` and `frontend/`.

---

## 📂 Project Structure
```
.
├── backend/           # .NET 8 Web API
│   └── Startup.Api/
│
├── frontend/          # React + Vite + TypeScript
│   ├── src/
│   └── public/
│
├── .github/workflows/ # CI/CD pipelines (GitHub Actions)
├── .gitignore
└── README.md
```

---

## 🛠️ Development Setup

### 1. Prerequisites
- [Git](https://git-scm.com/downloads)
- [Node.js 20+](https://nodejs.org/) and npm
- [.NET 8 SDK](https://dotnet.microsoft.com/en-us/download)
- (optional) [Visual Studio Code](https://code.visualstudio.com/) or Visual Studio 2022

---

### 2. Backend (ASP.NET Core Web API)
```bash
cd backend/Startup.Api
dotnet restore
dotnet run
```

- The API will run at `http://localhost:5000` (check console output for exact port).
- Test endpoints:
  - `/ping` → returns `"pong"`
  - `/healthz` → returns status JSON

---

### 3. Frontend (React + Vite)
```bash
cd frontend
npm install
npm run dev
```

- The React app will run at `http://localhost:5173`
- It fetches `/ping` from the backend (configured via `.env.local`).

---

### 4. Environment Variables
Frontend uses environment variables prefixed with `VITE_`. Example:
```
VITE_API_BASE=http://localhost:5000
```

Create a `.env.local` inside `frontend/` and adjust `VITE_API_BASE` to match your backend port.

---

### 5. CI/CD (GitHub Actions)
- Workflows are defined under `.github/workflows/`.
- Currently, a minimal pipeline runs on each `push` and `pull_request`.
- Later, we will add full build steps for backend and frontend.

---

## 🤝 Contribution Workflow
1. Create a new branch for your feature:
   ```bash
   git checkout -b feature/my-feature
   ```
2. Commit changes with clear messages.
3. Push branch and open a Pull Request.

---

## 📌 Roadmap
- [x] Setup monorepo structure
- [x] Add `.gitignore`
- [x] Add minimal CI pipeline
- [ ] Scaffold backend with .NET Web API
- [ ] Scaffold frontend with React + Vite
- [ ] Connect backend ↔ frontend
- [ ] Setup database (Postgres)
- [ ] Add deployment scripts

---

## 📜 License
This project is currently private. License terms TBD.
