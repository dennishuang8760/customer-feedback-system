# Customer Feedback System

A demo web application featuring a **Feedback Collector** and **Feedback Management System**, with a learning game focused on chemical origins of life.

## Repository Structure

```
/
├── backend/          # Backend API server
├── frontend/         # Frontend web app
├── .github/
│   └── workflows/    # CI/CD pipelines
└── docker-compose.yml  # Local development environment
```

## Local Development

### Prerequisites

- [Docker](https://www.docker.com/) and Docker Compose
- Node.js (for frontend development outside Docker)
- Python 3.x or Node.js (for backend, depending on stack)

### Getting Started

1. Copy environment variables:
   ```bash
   cp .env.example .env
   # Fill in secrets from 1Password (Papercone vault)
   ```

2. Start all services:
   ```bash
   docker-compose up
   ```

3. Access:
   - Frontend: http://localhost:3000
   - Backend API: http://localhost:8000

### Backend health probes

The Hono API exposes:

- **`GET /health`** — liveness (always `200` JSON `{ "status": "ok" }` when the process is up).
- **`GET /ready`** — readiness (`200` when Postgres answers `SELECT 1`, else `503`).

The backend [`Dockerfile`](backend/Dockerfile) includes a `HEALTHCHECK` that hits `/health` inside the container. For Kubernetes-style readiness, point your probe at `/ready` on the same port (`8000` by default).

## Deployment

- **Frontend**: Cloudflare Pages
- **Backend**: Cloudflare Workers (or proxied via Cloudflare)
- **File Storage**: Impossible Cloud S3 (for feedback attachments)

## Secrets Management

All secrets are stored in 1Password (Papercone vault) and injected via:
- **Local dev**: `.env` file (never committed)
- **CI/CD**: GitHub Secrets
- **Production**: Environment variables in deployment targets

Never hard-code credentials. See `.env.example` for required variables.
