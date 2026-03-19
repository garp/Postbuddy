# Postbuddy

Postbuddy is a social posting assistant split into three parts: a **Next.js** marketing/dashboard web app, a **Node.js** API backend, and a **browser extension** (React + Webpack) that injects into sites like Instagram, X, Facebook, WhatsApp, YouTube, Outlook, Reddit, and LinkedIn.

## Repository layout

| Directory | Stack | Role |
|-----------|--------|------|
| `postbuddy-web` | Next.js 14, TypeScript, Mantine, Tailwind | Public web app and authenticated UI |
| `postbuddy-backend` | Express, MongoDB (Mongoose), ES modules | API, auth, comments, AI/email/payment integrations |
| `postbuddy-extension` | React, TypeScript, Webpack, Tailwind | Chrome-style extension (content scripts + options) |

Each folder is its own Node project with its own `package.json`.

## Prerequisites

- **Node.js** 18+ (20 LTS recommended)
- **MongoDB** (or connection string) for the backend
- **npm** or **yarn** (web app includes a `yarn.lock`; backend and extension use npm locks)

## Quick start

### Backend (`postbuddy-backend`)

```bash
cd postbuddy-backend
# Create .env with MongoDB URI, secrets, and service keys (see team docs)
npm install
npm run dev            # nodemon on index.js (default port from `PORT` in `.env`, else 4000)
```

The server loads configuration from `postbuddy-backend/.env` (see `dotenv` in `index.js`). Set variables for MongoDB, JWT, CORS, email (SendGrid / SES / ZeptoMail), AI providers, Razorpay, etc., as required by your deployment.

### Web app (`postbuddy-web`)

```bash
cd postbuddy-web
npm install            # or: yarn
# Add .env with variables required by the Next app
npm run dev            # Next.js dev server (default http://localhost:3000)
```

Useful scripts: `npm run build`, `npm run start`, `npm run format`.

### Extension (`postbuddy-extension`)

```bash
cd postbuddy-extension
npm install
npm run dev            # webpack in watch mode
# or: npm run build    # one-off production bundle → dist/
```

Load the unpacked extension from `postbuddy-extension/dist/` in Chrome (or another Chromium browser) via **Extensions → Load unpacked**. Ensure `dist/` is built first; it is ignored at the monorepo root so it is not committed by mistake.

Configure API base URLs and any keys in the extension’s env/build setup as documented in that package (e.g. `src/api/BASEURL.js`).

## Environment variables

- **Backend**: `postbuddy-backend/.env` — required for database, auth, and third-party services.
- **Web**: `postbuddy-web/.env` — Next.js public/private env vars as used by the app.

Do not commit `.env` files; they are listed in the root `.gitignore`.

## License

See each subproject for license details if specified.
