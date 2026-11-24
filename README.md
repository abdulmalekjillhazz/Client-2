# Client-2 · RoyalCity

RoyalCity is a villa discovery and booking app built with Next.js App Router, React, Tailwind CSS, and an Express API.

## Requirements

- Node.js 20.19+ (or 22.12+)
- npm

## Run locally

```bash
npm install
cp .env.example .env
npm run dev
```

Open <http://localhost:3000>. The app serves the Next.js frontend and existing Express API from one server. Google sign-in needs OAuth credentials; local email/password auth can be used without them. `SESSION_SECRET` has a development fallback, but set a strong random value before deployment.

## Production build

```bash
npm run build
npm start
```

Set `SESSION_SECRET`, `GOOGLE_CLIENT_ID`, `GOOGLE_CLIENT_SECRET`, and `GOOGLE_CALLBACK_URL` in the deployment environment. The current data store is local JSON files, so production hosting needs persistent storage or a database migration before scaling across multiple instances.

## Routes

- `/` home
- `/villas` villa directory and filters
- `/villa/[id]` villa details
- `/aboutus`, `/contact`, `/termsandconditions`
- `/login`, `/register`, `/profile`, `/manage`, `/notes`
