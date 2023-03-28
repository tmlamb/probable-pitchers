########################
#        PRUNER        #
########################

FROM node:16-alpine AS pruner
RUN apk add --no-cache libc6-compat openssl
RUN apk update

WORKDIR /probable-pitchers

RUN npm -g install turbo

COPY . .

RUN turbo prune --scope=@probable/nextjs --docker

########################
#        BUILDER       #
########################

FROM node:16-alpine AS builder
RUN apk add --no-cache libc6-compat openssl
RUN apk update

WORKDIR /probable-pitchers

RUN npm -g install turbo

COPY .gitignore .gitignore
COPY turbo.json turbo.json
COPY tsconfig.json tsconfig.json
COPY patches/ patches/
COPY types/ types/
COPY --from=pruner /probable-pitchers/out/package-lock.json ./package-lock.json
COPY --from=pruner /probable-pitchers/out/full/ . 

RUN npm ci

ARG DATABASE_URL
ARG AUTH_GOOGLE_CLIENT_ID
ARG AUTH_GOOGLE_CLIENT_SECRET
ARG APPLE_CLIENT_ID
ARG APPLE_CLIENT_SECRET
ARG NEXTAUTH_SECRET
ARG NEXTAUTH_URL
ARG NEXTAUTH_EXPO_URL

ARG TURBO_TEAM
ENV TURBO_TEAM=$TURBO_TEAM
ARG TURBO_TOKEN
ENV TURBO_TOKEN=$TURBO_TOKEN

# Next.js collects completely anonymous telemetry data about general usage.
# Learn more here: https://nextjs.org/telemetry
# Uncomment the following line in case you want to disable telemetry during the build.
# ENV NEXT_TELEMETRY_DISABLED 1

RUN npm run build -- --filter=nextjs

########################
#        RUNNER        #
########################

# Production image, copy all the files and run next
FROM node:16-alpine AS runner
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
