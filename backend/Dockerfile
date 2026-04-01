FROM node:20-alpine

WORKDIR /app

COPY package*.json ./
RUN npm install

COPY . .

EXPOSE 8000

# Orchestrators: map liveness to GET /health, readiness to GET /ready (Postgres check).
HEALTHCHECK --interval=30s --timeout=3s --start-period=10s --retries=3 \
  CMD wget -q --spider http://127.0.0.1:8000/health || exit 1

CMD ["npm", "run", "dev"]
