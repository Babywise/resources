# Vite React Tailwind Template

## Environment Configuration

This project uses a single `.env` file in the root directory for both client and server configuration.

### Setup

1. Copy the example environment file:
   ```bash
   cp .env.example .env
   ```

2. Edit `.env` with your values.

The root `.env` file contains variables for:
- **Client**: Variables prefixed with `VITE_` (e.g., `VITE_API_URL`, `VITE_DEV_PORT`)
- **Server**: Standard variables (e.g., `NODE_ENV`, `PORT`)

> **Note**: Never commit `.env` to version control.
