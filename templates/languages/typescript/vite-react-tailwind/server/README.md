# Server

This is the backend portion of the client-server template.

## Tech Stack

- **Express 5** - Web framework
- **TypeScript** - Type safety
- **Helmet** - Security headers
- **Compression** - Response compression
- **CORS** - Cross-origin resource sharing
- **Vitest** - Testing framework
- **Supertest** - HTTP assertion library

## Project Structure

```
server/
├── src/
│   ├── config/             # Configuration files
│   │   └── config.ts       # Centralized configuration
│   ├── routes/             # API route handlers
│   │   └── health.ts       # Health check endpoint
│   ├── middleware/         # Custom Express middleware
│   │   └── middleware.ts   # Request logger and future middleware
│   ├── __tests__/          # Test files (mirrors src structure)
│   ├── app.ts              # Express app configuration
│   └── index.ts            # Server entry point with lifecycle management
├── dist/                   # Compiled JavaScript (after build)
├── eslint.config.js        # ESLint configuration (flat config)
├── tsconfig.json           # TypeScript configuration
├── vitest.config.ts        # Vitest configuration
└── package.json
```

## Key Files

| File                       | Purpose                                            |
| -------------------------- | -------------------------------------------------- |
| `index.ts`                 | Server startup, graceful shutdown, signal handling |
| `app.ts`                   | Express middleware stack and route mounting        |
| `middleware/middleware.ts` | Custom middleware (logging, auth, etc.)            |
| `routes/health.ts`         | Health check endpoint for monitoring               |

## Scripts

```bash
npm run dev        # Start dev server with hot reload (tsx watch)
npm run build      # Compile TypeScript to JavaScript
npm run start      # Run compiled server (production)
npm run test       # Run tests
npm run lint       # Lint code
npm run lint:fix   # Fix lint issues
npm run format     # Format with Prettier
```

## Environment Variables

| Variable   | Description | Default       |
| ---------- | ----------- | ------------- |
| `PORT`     | Server port | `3000`        |
| `NODE_ENV` | Environment | `development` |

## API Endpoints

| Method | Endpoint      | Description                             |
| ------ | ------------- | --------------------------------------- |
| GET    | `/health`     | Basic health check (for load balancers) |
| GET    | `/api/health` | Detailed health check with uptime       |

## Middleware Stack

Middleware executes in this order:

1. **Helmet** - Security headers
2. **CORS** - Cross-origin requests
3. **Compression** - Gzip responses
4. **Request Logger** - Log incoming requests
5. **Body Parsers** - JSON and URL-encoded
6. **Routes** - API handlers

## Features

- Graceful shutdown on SIGTERM/SIGINT
- Startup banner with server info
- Security headers via Helmet
- Response compression
- Request logging
- Factory function for testing (`createApp()`)
