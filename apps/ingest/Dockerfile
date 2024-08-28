########################
#        PRUNER        #
########################

FROM node:18-alpine AS pruner
# RUN apk add --no-cache libc6-compat openssl
RUN apk update

WORKDIR /probable-pitchers

RUN npm -g install turbo@^1

COPY . .

RUN turbo prune --scope=@probable/ingest --docker

########################
#        BUILDER       #
########################

FROM node:18-alpine AS builder
# RUN apk add --no-cache libc6-compat openssl
RUN apk update

WORKDIR /probable-pitchers

COPY .gitignore .gitignore
COPY turbo.json turbo.json
COPY tsconfig.json tsconfig.json
COPY patches/ patches/
COPY types/ types/
COPY --from=pruner /probable-pitchers/out/package-lock.json ./package-lock.json
COPY --from=pruner /probable-pitchers/out/full/ .

RUN npm install --package-lock=false

ARG INGEST_JOBS
ARG DATABASE_URL

ARG TURBO_TEAM
ENV TURBO_TEAM=$TURBO_TEAM
ARG TURBO_TOKEN
ENV TURBO_TOKEN=$TURBO_TOKEN

RUN npm run build -- --filter=ingest

########################
#        RUNNER        #
########################

FROM node:18-alpine AS runner
WORKDIR /probable-pitchers

ENV NODE_ENV production

RUN addgroup --system --gid 1001 ingest
RUN adduser --system --uid 1001 ingest
RUN apk add --no-cache curl

COPY --from=builder /probable-pitchers/apps/ingest/package.json ./apps/ingest/package.json
COPY --from=builder /probable-pitchers/package.json ./package.json
COPY --from=builder /probable-pitchers/node_modules ./node_modules

COPY --from=builder --chown=ingest:ingest /probable-pitchers/apps/ingest/dist/ ./apps/ingest/

USER ingest

CMD ["sh", "-c", "node apps/ingest/index.js ; curl http://localhost:9091/quitquitquit"]
