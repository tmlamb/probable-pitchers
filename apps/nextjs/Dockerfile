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
COPY apps/nextjs/package.json ./apps/nextjs/package.json
COPY turbo.json ./turbo.json
COPY patches ./patches
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

ARG DATABASE_URL
ARG AUTH_GOOGLE_CLIENT_ID
ARG AUTH_GOOGLE_CLIENT_SECRET
ARG WEB_AUTH_GOOGLE_CLIENT_ID
ARG WEB_AUTH_GOOGLE_CLIENT_SECRET
ARG NEXTAUTH_SECRET
ARG NEXTAUTH_URL
ARG NEXTAUTH_EXPO_URL

WORKDIR /probable-pitchers
COPY --from=deps /probable-pitchers/node_modules ./node_modules
COPY . .

# Next.js collects completely anonymous telemetry data about general usage.
# Learn more here: https://nextjs.org/telemetry
# Uncomment the following line in case you want to disable telemetry during the build.
# ENV NEXT_TELEMETRY_DISABLED 1

RUN \
  if [ -f package-lock.json ]; then npm run build -- --filter=nextjs; \
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

RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 nextjs

COPY --from=builder /probable-pitchers/apps/nextjs/next.config.mjs ./apps/nextjs/next.config.mjs
COPY --from=builder /probable-pitchers/apps/nextjs/public ./apps/nextjs/public
COPY --from=builder /probable-pitchers/apps/nextjs/package.json ./apps/nextjs/package.json
COPY --from=builder /probable-pitchers/package.json ./package.json
COPY --from=builder /probable-pitchers/node_modules ./node_modules

# Automatically leverage output traces to reduce image size
# https://nextjs.org/docs/advanced-features/output-file-tracing
COPY --from=builder --chown=nextjs:nodejs /probable-pitchers/apps/nextjs/.next/standalone ./apps/nextjs/
COPY --from=builder --chown=nextjs:nodejs /probable-pitchers/apps/nextjs/.next/static ./apps/nextjs/.next/static

USER nextjs

EXPOSE 3000

ENV PORT 3000

CMD ["node", "apps/nextjs/server.js"]