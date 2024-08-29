########################
#         DEPS         #
########################

# Install dependencies only when needed
# TODO: re-evaluate if emulation is still necessary on arm64 after moving to node 18
FROM --platform=linux/amd64 node:18-alpine AS deps
# Check https://github.com/nodejs/docker-node/tree/b4117f9333da4138b03a546ec926ef50a31506c3#nodealpine to understand why libc6-compat might be needed.
# RUN apk add --no-cache libc6-compat openssl
WORKDIR /probable-pitchers

COPY packages/db ./packages/db

# Install dependencies based on the preferred package manager
COPY package.json  package-lock.json ./
COPY turbo.json ./turbo.json

RUN apk add --no-cache curl

RUN \
  if [ -f package-lock.json ]; then npm ci; \
  else echo "Lockfile not found." && exit 1; \
  fi

########################
#      DB MIGRATE      #
########################

FROM deps AS db_migrate
USER root
RUN chmod 777 ./node_modules/.prisma/client/index.js

ARG DATABASE_URL

WORKDIR /probable-pitchers/packages/db
CMD ["npm", "run", "db-migrate"]
