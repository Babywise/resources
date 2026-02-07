# Client

This is the frontend portion of the client-server template.

## Tech Stack

- **React 19** - UI library
- **TypeScript** - Type safety
- **Vite** - Build tool and dev server
- **Tailwind CSS v4** - Utility-first styling with theme system
- **React Router** - Client-side routing
- **Vitest** - Testing framework
- **Testing Library** - React component testing utilities

## Project Structure

```
client/
├── src/
│   ├── components/         # Reusable UI components
│   │   └── ErrorBoundary/  # Error boundary for catching React errors
│   ├── pages/              # Page components (one folder per page)
│   │   ├── HomePage/       # Landing page
│   │   ├── AppPage/        # Main app page with server status
│   │   └── NotFoundPage/   # 404 page
│   ├── __tests__/          # Test files (mirrors src structure)
│   ├── App.tsx             # Root component with routing
│   ├── main.tsx            # Entry point
│   └── index.css           # Global styles & CSS theme variables
├── public/                 # Static assets
├── vite.config.ts          # Vite configuration
├── eslint.config.js        # ESLint configuration (flat config)
├── tsconfig.json           # TypeScript configuration
└── package.json
```

## Key Files

| File | Purpose |
|------|---------|
| `vite.config.ts` | Dev server, build settings, proxy to backend |
| `eslint.config.js` | Linting rules for React + TypeScript |
| `index.css` | Theme variables (colors, spacing, etc.) |
| `App.tsx` | Route definitions and error boundary |

## Scripts

```bash
npm run dev        # Start dev server (http://localhost:5173)
npm run build      # Build for production
npm run preview    # Preview production build
npm run test       # Run tests
npm run lint       # Lint code
npm run lint:fix   # Fix lint issues
npm run format     # Format with Prettier
```

## Environment Variables

| Variable | Description | Default |
|----------|-------------|---------|
| `VITE_API_URL` | Backend API URL | `http://localhost:3000` |
| `VITE_DEV_PORT` | Dev server port | `5173` |
| `VITE_PREVIEW_PORT` | Preview server port | `4173` |

## Features

- Hot Module Replacement (HMR)
- Path aliases (`@/` → `src/`)
- CSS theming with variables
- API proxy to backend during development
- Error boundary for graceful error handling
- 404 page for unknown routes
