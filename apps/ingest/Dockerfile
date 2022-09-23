########################
#         DEPS         #
########################

# Install dependencies only when needed
# TODO: re-evaluate if emulation is still necessary on arm64 after moving to node 18
FROM --platform=linux/amd64 node:16-alpine AS deps
# Check https://github.com/nodejs/docker-node/tree/b4117f9333da4138b03a546ec926ef50a31506c3#nodealpine to understand why libc6-compat might be needed.
RUN apk add --no-cache libc6-compat openssl
WORKDIR /probable-pitchers

COPY packages/db ./packages/db

# Install dependencies based on the preferred package manager
COPY package.json  package-lock.json ./
COPY apps/ingest/package.json ./apps/ingest/package.json
COPY turbo.json ./turbo.json
RUN \
  if [ -f package-lock.json ]; then npm ci; \
  else echo "Lockfile not found." && exit 1; \
  fi

########################
#        BUILDER       #
########################

# Rebuild the source code only when needed
# TODO: re-evaluate if emulation is still necessary on arm64 after moving to node 18
FROM --platform=linux/amd64 node:16-alpine AS builder

ARG INGEST_JOBS
ARG API_URL

WORKDIR /probable-pitchers
COPY --from=deps /probable-pitchers/node_modules ./node_modules
COPY . .

# Next.js collects completely anonymous telemetry data about general usage.
# Learn more here: https://nextjs.org/telemetry
# Uncomment the following line in case you want to disable telemetry during the build.
# ENV NEXT_TELEMETRY_DISABLED 1

RUN \
  if [ -f package-lock.json ]; then npm run build -- --filter=ingest; \
  else echo "Lockfile not found." && exit 1; \
  fi

########################
#        RUNNER        #
########################

# Production image, copy all the files and run next
# TODO: re-evaluate if emulation is still necessary after moving to node 18
FROM --platform=linux/amd64 node:16-alpine AS runner
WORKDIR /probable-pitchers

ENV NODE_ENV production
# Uncomment the following line in case you want to disable telemetry during runtime.
# ENV NEXT_TELEMETRY_DISABLED 1

RUN addgroup --system --gid 1001 ingest
RUN adduser --system --uid 1001 ingest

COPY --from=builder /probable-pitchers/apps/ingest/package.json ./apps/ingest/package.json
COPY --from=builder /probable-pitchers/package.json ./package.json
COPY --from=builder /probable-pitchers/node_modules ./node_modules

# Automatically leverage output traces to reduce image size
# https://nextjs.org/docs/advanced-features/output-file-tracing
COPY --from=builder --chown=ingest:ingest /probable-pitchers/apps/ingest/dist/ ./apps/ingest/

USER ingest

EXPOSE 3000

ENV PORT 3000

CMD ["node", "apps/ingest/index.js"]