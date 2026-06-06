# CareerPilot AI Frontend

Responsive Next.js frontend for CareerPilot AI's authentication and resume analysis workspace.

## Setup

Requirements: Node.js 20+ and the CareerPilot FastAPI backend.

```bash
npm install
```

Create `.env.local` from `.env.example`:

```env
NEXT_PUBLIC_API_URL=http://localhost:8000
```

Start the backend on port `8000`, then run:

```bash
npm run dev
```

Open `http://localhost:3000`.

## Commands

```bash
npm run dev
npm run lint
npm run build
npm run start
```

## Structure

- `app/page.tsx`: public marketing landing page.
- `app/login/page.tsx`: validated login form and token persistence.
- `app/signup/page.tsx`: validated signup form and login redirect.
- `app/dashboard/page.tsx`: protected workspace and logout flow.
- `components/`: reusable branding, form, loading, and status components.
- `src/lib/api.ts`: Axios client, authorization interceptor, and API error handling.
- `src/lib/auth.ts`: browser-safe local storage authentication helpers.
