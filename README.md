# Probable Pitcher

This monorepo contains several apps and packages used to build and distribute the Probable Pitcher app.

## Packages

### [db](packages/db)

Contains the prisma schema for the MySQL database and exports Prisma client for reuse in other packages/apps

### [api](packages/api)

Defines the tRPC backend API with nextauth, used by clients that interact with the database.

## Applications

### [expo](apps/expo)

React Native app using expo managed workflow, for distribution of "Probable Pitcher" app in android/ios app stores.

### [nextjs](apps/nextjs)

Web application for probablepitcher.com, providing users access to the subscription management online.

### [ingest](apps/ingest)

Worker/job that ingests pitcher and game data into the database.

## Other

### [infrastructure](infrastructure)

Pulumi infra as code that sets up nextjs and cronjob workloads on a kubernetes cluster, along with ingress config.

### [gitops](.github/workflows)

All deployment and release management workflows defined as github actions.
