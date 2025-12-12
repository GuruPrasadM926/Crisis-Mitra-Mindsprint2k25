# Crisis-Mitra

React + Vite web application for connecting donors, volunteers and people in need.

This repository contains a frontend built with React and Vite. The app supports three main roles:
- Donors — donate or register donations
- Volunteers — add skills and help
- Needy — request and track help

The UI uses a small local storage based mock database (see `src/TempDB.js`) so you can run the app entirely on the frontend during development. Further integration to a database is acheived through Firebase.

## Tech stack
- React 19
- Vite
- CSS modules
- Local storage (temporary mock database)
- Optional libraries included: React, Vite, Node.js, Firebase packages (no server scaffolding included)

## Features
- Authentication (signup/login) with mock data persisted to localStorage
- Role-based dashboards for Donor, Volunteer, and Needy users
- Donor form and donation registration
- Volunteer skill management and profile
- Simple, mobile-friendly UI components

## Getting Started
Prerequisites: Node.js 18+ and npm/yarn installed.

1. Open a terminal and change to the frontend directory:

```bash
cd crisis-mitra
```

2. Install dependencies:

```bash
npm install
```

3. Run the dev server:

```bash
npm run dev
```

4. Open the site in your browser at the URL printed by Vite (usually http://localhost:5173).

## Build & Preview
- Build a production bundle:

```bash
npm run build
```

- Preview the production build locally:

```bash
npm run preview
```

## Linting
- Run ESLint across the codebase:

```bash
npm run lint
```

## Project Structure
- `crisis-mitra/` — frontend app
	- `src/` — React components and styles
	- `public/` — static assets
	- `package.json` — scripts and dependencies
- `README.md` — this file

## Backend / API
This project includes `express`, `mongodb`, and `mongoose` in the dependencies, but does not contain a backend server. If you decide to add a backend:

- Create a server directory (e.g., `api/` or `server/`) and implement REST endpoints using Express.
- Connect to MongoDB using Mongoose (or use the included TempDB for quick local testing).

## Contributingh

- Fork the repo or create a feature branch from `main`.
- Add tests if needed, create a PR, and describe the change.

## License
This project does not include a license file. Add a LICENSE if you plan to open-source it.

---
If you'd like, I can also add a short CONTRIBUTING.md, a detailed architecture doc, or a server scaffold for the backend. What would you like next?
