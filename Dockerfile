# syntax=docker/dockerfile:1.7
# Next.js standalone image for Swarm stack portfolio-natee-v3 (service: web).
# Bun 1.2 to match portfolio-natee-v3-api. Build env (NEXT_PUBLIC_* + build-time
# server keys) comes from a BuildKit secret mounted as .env.production.local,
# so it never lands in an image layer:
#   docker build --secret id=buildenv,src=.env -t portfolio-v3-web .

FROM oven/bun:1.2-alpine AS deps
WORKDIR /app
COPY package.json bun.lock ./
RUN bun install --frozen-lockfile

FROM oven/bun:1.2-alpine AS builder
WORKDIR /app
ENV NEXT_TELEMETRY_DISABLED=1 NODE_ENV=production
COPY --from=deps /app/node_modules ./node_modules
COPY . .
# --webpack: Turbopack's chunk loader crashes under Bun 1.2 ("Expected CommonJS module
# to have a function wrapper"), both at prerender and at runtime under `bun server.js`.
RUN --mount=type=secret,id=buildenv,target=/app/.env.production.local,required=false \
  bun run build --webpack

FROM oven/bun:1.2-alpine AS runner
WORKDIR /app
ENV NODE_ENV=production NEXT_TELEMETRY_DISABLED=1 PORT=3000 HOSTNAME=0.0.0.0
COPY --from=builder --chown=bun:bun /app/public ./public
# src/lib/mdx.ts reads content/ via process.cwd() at runtime
COPY --from=builder --chown=bun:bun /app/content ./content
COPY --from=builder --chown=bun:bun /app/.next/standalone ./
COPY --from=builder --chown=bun:bun /app/.next/static ./.next/static
USER bun
EXPOSE 3000
HEALTHCHECK --interval=30s --timeout=10s --start-period=30s --retries=5 \
  CMD bun -e "fetch('http://127.0.0.1:3000/favicon.ico').then(r=>process.exit(r.ok?0:1)).catch(()=>process.exit(1))"
CMD ["bun", "server.js"]
