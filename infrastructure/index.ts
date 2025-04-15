import * as gcp from "@pulumi/gcp";
import * as k8s from "@pulumi/kubernetes";
import * as pulumi from "@pulumi/pulumi";
import { containerRegistry } from "./config";
import { generateSecret } from "./apple";

const config = new pulumi.Config();
const env = pulumi.getStack();
const imageTag = process.env.DEPLOY_COMMIT_TAG || "latest";
const changedNextjs = process.env.CHANGED_NEXTJS === "true" || false;
const changedIngest = process.env.CHANGED_INGEST === "true" || false;
const changedDatabase = process.env.CHANGED_DB === "true" || false;
const isProd = env === "production";

const domains = config.requireObject<string[]>("domains");
const replicas = config.requireNumber("nextjsReplicas");

const projectCloudSqlLegacy = new gcp.projects.Service(
  `probable-legacy-cloudsql-api`,
  {
    service: "sqladmin.googleapis.com",
    project: gcp.config.project,
  }
);

const gsaLegacy = new gcp.serviceaccount.Account(
  `probable-legacy-service-account`,
  {
    accountId: `probable-legacy-sa`,
    project: gcp.config.project,
  }
);

const databaseInstanceLegacy = new gcp.sql.DatabaseInstance(
  `probable-legacy-db-instance`,
  {
    name: `probable-legacy-db-instance`,
    databaseVersion: "MYSQL_8_0",
    region: "us-west1",
    settings: {
      tier: "db-f1-micro",
      availabilityType: isProd ? "REGIONAL" : "ZONAL",
      backupConfiguration: {
        enabled: true,
        binaryLogEnabled: true,
        location: "us-east1",
      },
    },
  }
);

const databaseUserLegacy = new gcp.sql.User(`probable-legacy-db-user`, {
  name: `probable-legacy-db-user`,
  instance: databaseInstanceLegacy.name,
  password: config.requireSecret("databasePassword"),
});

const databaseLegacy = new gcp.sql.Database(`probable-legacy-db`, {
  name: `probable-legacy-db`,
  instance: databaseInstanceLegacy.name,
  charset: "utf8",
});

const databaseUrlLegacy = pulumi
  .all([
    databaseInstanceLegacy.publicIpAddress,
    databaseLegacy.name,
    databaseUserLegacy.name,
    databaseUserLegacy.password,
  ])
  .apply(([ipAddress, database, username, password]) => {
    return `mysql://${username}:${password}@${ipAddress}/${database}`;
  });

export const clusterProviderLegacy = new k8s.Provider(
  `probable-pitchers-legacy`,
  {
    kubeconfig: process.env.KUBECONFIG,
  }
);

export const namespace = new k8s.core.v1.Namespace(
  `probable-legacy`,
  {},
  { provider: clusterProviderLegacy }
);

const namespaceName = namespace.metadata.name;

const ksaLegacy = new k8s.core.v1.ServiceAccount(
  `probable-legacy-gke-service-account`,
  {
    metadata: {
      name: `probable-legacy-gke-service-account`,
      namespace: namespaceName,
    },
  },
  { provider: clusterProviderLegacy }
);

pulumi
  .all([
    gsaLegacy.email,
    gsaLegacy.name,
    gsaLegacy.member,
    ksaLegacy.metadata.name,
    namespaceName,
  ])
  .apply(([email, gsaName, member, ksaName, namespaceName]) => {
    const gsaAnnotationLegacy = new k8s.core.v1.ServiceAccountPatch(
      `probable-legacy-gke-service-account-annotation`,
      {
        metadata: {
          namespace: namespaceName,
          name: ksaName,
          annotations: {
            "iam.gke.io/gcp-service-account": email,
          },
        },
      },
      { provider: clusterProviderLegacy }
    );

    const ksaIamMemberLegacy = new gcp.serviceaccount.IAMMember(
      `probable-gke-service-account-iam`,
      {
        serviceAccountId: gsaName,
        role: "roles/iam.workloadIdentityUser",
        member: pulumi.concat(
          `serviceAccount:`,
          gcp.config.project,
          ".svc.id.goog[",
          namespaceName,
          "/",
          ksaLegacy.metadata.name,
          "]"
        ),
      }
    );

    const gsaIamMemberLegacy = new gcp.projects.IAMMember(
      `probable-legacy-gcp-service-account-iam`,
      {
        project: gcp.config.project!,
        role: "roles/cloudsql.admin",
        member: member,
      }
    );
  });

export const regcredLegacy = new k8s.core.v1.Secret(
  `probable-legacy-regcred`,
  {
    metadata: {
      namespace: namespaceName,
    },
    type: "kubernetes.io/dockerconfigjson",
    stringData: {
      ".dockerconfigjson": pulumi
        .all([
          containerRegistry.host,
          containerRegistry.user,
          containerRegistry.password,
          containerRegistry.email,
        ])
        .apply(([server, username, password, email]) => {
          return JSON.stringify({
            auths: {
              [server]: {
                auth: Buffer.from(username + ":" + password).toString("base64"),
                username: username,
                email: email,
                password: password,
              },
            },
          });
        }),
    },
  },
  { provider: clusterProviderLegacy }
);

const dbcredLegacy = new k8s.core.v1.Secret(
  `probable-legacy-dbcred`,
  {
    metadata: {
      namespace: namespaceName,
    },
    type: "Opaque",
    data: pulumi
      .all([
        databaseUserLegacy.name,
        databaseUserLegacy.password,
        databaseLegacy.name,
      ])
      .apply(([username, password, databaseName]) => ({
        username: btoa(username),
        password: btoa(password!),
        database: btoa(databaseName),
        databaseUrl: btoa(
          `mysql://${username}:${password}@127.0.0.1:3306/${databaseName}`
        ),
      })),
  },
  { provider: clusterProviderLegacy }
);

const migrationLabels = { app: `probable-legacy-migration` };

const migrationJobLegacy = new k8s.batch.v1.Job(
  migrationLabels.app,
  {
    metadata: {
      namespace: namespaceName,
    },
    spec: {
      activeDeadlineSeconds: 20 * 60,
      backoffLimit: 3,
      parallelism: 1,
      completions: 1,
      template: {
        spec: {
          restartPolicy: "OnFailure",
          imagePullSecrets: [
            { name: regcredLegacy.metadata.apply((m) => m.name) },
          ],
          serviceAccountName: ksaLegacy.metadata.apply((m) => m.name),
          containers: [
            {
              name: migrationLabels.app,

              image: `ghcr.io/tmlamb/probable-pitchers-migration:${
                changedDatabase ? imageTag : "latest"
              }`,
              env: [
                {
                  name: "DATABASE_URL",
                  valueFrom: {
                    secretKeyRef: {
                      name: dbcredLegacy.metadata.apply((m) => m.name),
                      key: "databaseUrl",
                    },
                  },
                },
              ],

              command: ["sh", "-c"],
              args: [
                "npm run db-migrate; curl -s http://localhost:9091/quitquitquit",
              ],

              resources: {
                limits: {
                  cpu: "250m",
                  memory: "512Mi",
                  "ephemeral-storage": "1Gi",
                },
              },
            },
            {
              name: "cloudsql-proxy",
              image: "gcr.io/cloud-sql-connectors/cloud-sql-proxy:2.13.0",
              args: [
                "--port=3306",
                databaseInstanceLegacy.connectionName,
                "--quitquitquit",
                "--exit-zero-on-sigterm",
              ],
              securityContext: {
                runAsNonRoot: true,
              },
              resources: {
                limits: {
                  cpu: "250m",
                  memory: "512Mi",
                  "ephemeral-storage": "1Gi",
                },
              },
            },
          ],
        },
      },
    },
  },
  {
    provider: clusterProviderLegacy,
  }
);

const seedLabels = { app: `probable-legacy-seed` };

const seedJobLegacy = new k8s.batch.v1.CronJob(
  seedLabels.app,
  {
    metadata: {
      namespace: namespaceName,
    },
    spec: {
      schedule: "0 0 1 2,3,4 *",
      jobTemplate: {
        spec: {
          activeDeadlineSeconds: 20 * 60,
          backoffLimit: 3,
          parallelism: 1,
          completions: 1,
          template: {
            spec: {
              restartPolicy: "OnFailure",
              imagePullSecrets: [
                { name: regcredLegacy.metadata.apply((m) => m.name) },
              ],
              serviceAccountName: ksaLegacy.metadata.apply((m) => m.name),
              containers: [
                {
                  name: seedLabels.app,

                  image: `ghcr.io/tmlamb/probable-pitchers-ingest:${
                    changedIngest ? imageTag : "latest"
                  }`,
                  env: [
                    {
                      name: "DATABASE_URL",
                      valueFrom: {
                        secretKeyRef: {
                          name: dbcredLegacy.metadata.apply((m) => m.name),
                          key: "databaseUrl",
                        },
                      },
                    },
                    {
                      name: "INGEST_JOBS",
                      value: "teams,pitchers",
                    },
                  ],

                  command: ["sh", "-c"],
                  args: [
                    "node apps/ingest/index.js; curl -s http://localhost:9091/quitquitquit",
                  ],

                  resources: {
                    limits: {
                      cpu: "250m",
                      memory: "512Mi",
                      "ephemeral-storage": "1Gi",
                    },
                  },
                },
                {
                  name: "cloudsql-proxy",
                  image: "gcr.io/cloud-sql-connectors/cloud-sql-proxy:2.13.0",
                  args: [
                    "--port=3306",
                    databaseInstanceLegacy.connectionName,
                    "--quitquitquit",
                    "--exit-zero-on-sigterm",
                  ],
                  securityContext: {
                    runAsNonRoot: true,
                  },
                  resources: {
                    limits: {
                      cpu: "250m",
                      memory: "512Mi",
                      "ephemeral-storage": "1Gi",
                    },
                  },
                },
              ],
            },
          },
        },
      },
    },
  },
  {
    provider: clusterProviderLegacy,
    dependsOn: [migrationJobLegacy],
  }
);

const playerLabels = { app: `probable-legacy-player` };

const playerJobLegacy = new k8s.batch.v1.CronJob(
  playerLabels.app,
  {
    metadata: {
      namespace: namespaceName,
    },
    spec: {
      schedule: "0 6 * 2,3,4,5,6,7,8,9,10,11,12 *",
      jobTemplate: {
        spec: {
          activeDeadlineSeconds: 20 * 60,
          backoffLimit: 3,
          parallelism: 1,
          completions: 1,
          template: {
            spec: {
              restartPolicy: "OnFailure",
              imagePullSecrets: [
                { name: regcredLegacy.metadata.apply((m) => m.name) },
              ],
              serviceAccountName: ksaLegacy.metadata.apply((m) => m.name),
              containers: [
                {
                  name: playerLabels.app,

                  image: `ghcr.io/tmlamb/probable-pitchers-ingest:${
                    changedIngest ? imageTag : "latest"
                  }`,
                  env: [
                    {
                      name: "DATABASE_URL",
                      valueFrom: {
                        secretKeyRef: {
                          name: dbcredLegacy.metadata.apply((m) => m.name),
                          key: "databaseUrl",
                        },
                      },
                    },
                    {
                      name: "INGEST_JOBS",
                      value: "pitchers,games",
                    },
                  ],

                  command: ["sh", "-c"],
                  args: [
                    "node apps/ingest/index.js; curl -s http://localhost:9091/quitquitquit",
                  ],

                  resources: {
                    limits: {
                      cpu: "250m",
                      memory: "512Mi",
                      "ephemeral-storage": "1Gi",
                    },
                  },
                },
                {
                  name: "cloudsql-proxy",
                  image: "gcr.io/cloud-sql-connectors/cloud-sql-proxy:2.13.0",
                  args: [
                    "--port=3306",
                    databaseInstanceLegacy.connectionName,
                    "--quitquitquit",
                    "--exit-zero-on-sigterm",
                  ],
                  securityContext: {
                    runAsNonRoot: true,
                  },
                  resources: {
                    limits: {
                      cpu: "250m",
                      memory: "512Mi",
                      "ephemeral-storage": "1Gi",
                    },
                  },
                },
              ],
            },
          },
        },
      },
    },
  },
  {
    provider: clusterProviderLegacy,
    dependsOn: [migrationJobLegacy],
  }
);

const notifyLabels = { app: `probable-legacy-notify` };

const notifyJobLegacy = new k8s.batch.v1.CronJob(
  notifyLabels.app,
  {
    metadata: {
      namespace: namespaceName,
    },
    spec: {
      schedule: "0,30 * * 2,3,4,5,6,7,8,9,10,11,12 *",
      jobTemplate: {
        spec: {
          activeDeadlineSeconds: 20 * 60,
          backoffLimit: 3,
          parallelism: 1,
          completions: 1,
          template: {
            spec: {
              restartPolicy: "OnFailure",
              imagePullSecrets: [
                { name: regcredLegacy.metadata.apply((m) => m.name) },
              ],
              serviceAccountName: ksaLegacy.metadata.apply((m) => m.name),
              containers: [
                {
                  name: notifyLabels.app,

                  image: `ghcr.io/tmlamb/probable-pitchers-ingest:${
                    changedIngest ? imageTag : "latest"
                  }`,
                  env: [
                    {
                      name: "DATABASE_URL",
                      valueFrom: {
                        secretKeyRef: {
                          name: dbcredLegacy.metadata.apply((m) => m.name),
                          key: "databaseUrl",
                        },
                      },
                    },
                    {
                      name: "INGEST_JOBS",
                      value: "games,notifications",
                    },
                  ],

                  command: ["sh", "-c"],
                  args: [
                    "node apps/ingest/index.js; curl -s http://localhost:9091/quitquitquit",
                  ],

                  resources: {
                    limits: {
                      cpu: "250m",
                      memory: "512Mi",
                      "ephemeral-storage": "1Gi",
                    },
                  },
                },
                {
                  name: "cloudsql-proxy",
                  image: "gcr.io/cloud-sql-connectors/cloud-sql-proxy:2.13.0",
                  args: [
                    "--port=3306",
                    databaseInstanceLegacy.connectionName,
                    "--quitquitquit",
                    "--exit-zero-on-sigterm",
                  ],
                  securityContext: {
                    runAsNonRoot: true,
                  },
                  resources: {
                    limits: {
                      cpu: "250m",
                      memory: "512Mi",
                      "ephemeral-storage": "1Gi",
                    },
                  },
                },
              ],
            },
          },
        },
      },
    },
  },
  {
    provider: clusterProviderLegacy,
    dependsOn: [migrationJobLegacy],
  }
);

const appleClientSecret = pulumi
  .all([
    config.requireSecret("appleTeamId"),
    config.requireSecret("appleKeyId"),
    config.requireSecret("applePrivateKey"),
    config.requireSecret("appleClientId"),
  ])
  .apply(([teamId, keyId, privateKey, clientId]) =>
    generateSecret({ teamId, keyId, privateKey, clientId })
  );

const appLabels = { app: `probable-legacy-nextjs` };

const deploymentLegacy = new k8s.apps.v1.Deployment(
  appLabels.app,
  {
    metadata: {
      namespace: namespaceName,
    },
    spec: {
      strategy: {
        type: "RollingUpdate",
        rollingUpdate: {
          maxSurge: 1,
          maxUnavailable: 1,
        },
      },
      selector: { matchLabels: appLabels },
      replicas: replicas,
      template: {
        metadata: { labels: appLabels },
        spec: {
          imagePullSecrets: [
            { name: regcredLegacy.metadata.apply((m) => m.name) },
          ],
          serviceAccountName: ksaLegacy.metadata.apply((m) => m.name),
          containers: [
            {
              name: appLabels.app,
              image: `ghcr.io/tmlamb/probable-pitchers-nextjs:${
                changedNextjs ? imageTag : "latest"
              }`,

              ports: [{ name: "http", containerPort: 3000 }],
              resources: {
                requests: {
                  cpu: "250m",
                  memory: "512Mi",
                  "ephemeral-storage": "1Gi",
                },
              },
              livenessProbe: {
                httpGet: { path: "/", port: "http" },
              },
              env: [
                {
                  name: "DATABASE_URL",
                  valueFrom: {
                    secretKeyRef: {
                      name: dbcredLegacy.metadata.apply((m) => m.name),
                      key: "databaseUrl",
                    },
                  },
                },
                {
                  name: "AUTH_GOOGLE_CLIENT_ID",
                  value: config.requireSecret("authGoogleClientId"),
                },
                {
                  name: "AUTH_GOOGLE_CLIENT_SECRET",
                  value: config.requireSecret("authGoogleClientSecret"),
                },
                {
                  name: "APPLE_CLIENT_ID",
                  value: config.requireSecret("appleClientId"),
                },
                {
                  name: "APPLE_CLIENT_SECRET",
                  value: appleClientSecret,
                },
                {
                  name: "APPLE_WEB_CLIENT_ID",
                  value: config.requireSecret("appleWebClientId"),
                },
                {
                  name: "APPLE_WEB_CLIENT_SECRET",
                  value: config.requireSecret("appleWebClientSecret"),
                },
                {
                  name: "NEXTAUTH_SECRET",
                  value: config.requireSecret("nextAuthSecret"),
                },
                {
                  name: "NEXTAUTH_URL",
                  value: config.requireSecret("nextAuthUrl"),
                },
                {
                  name: "NEXTAUTH_EXPO_URL",
                  value: config.requireSecret("nextAuthExpoUrl"),
                },
              ],
            },
            {
              name: "cloudsql-proxy",
              image: "gcr.io/cloud-sql-connectors/cloud-sql-proxy:2.13.0",
              args: ["--port=3306", databaseInstanceLegacy.connectionName],
              securityContext: {
                runAsNonRoot: true,
              },
              resources: {
                limits: {
                  cpu: "250m",
                  memory: "512Mi",
                  "ephemeral-storage": "1Gi",
                },
              },
            },
          ],
        },
      },
    },
  },
  {
    provider: clusterProviderLegacy,
    dependsOn: [migrationJobLegacy],
  }
);

const serviceLegacy = new k8s.core.v1.Service(
  appLabels.app,
  {
    metadata: {
      namespace: namespaceName,
    },
    spec: {
      ports: [
        {
          port: 80,
          targetPort: 3000,
        },
      ],
      selector: {
        app: appLabels.app,
      },
    },
  },
  {
    provider: clusterProviderLegacy,
  }
);

const ipAddressLegacy = new gcp.compute.GlobalAddress(
  `probable-legacy-address`,
  {
    project: gcp.config.project,
    addressType: "EXTERNAL",
  }
);

const managedCertificateLegacy = new k8s.apiextensions.CustomResource(
  `probable-legacy-certificate`,
  {
    apiVersion: "networking.gke.io/v1",
    kind: "ManagedCertificate",
    metadata: {
      namespace: namespaceName,
    },
    spec: {
      domains: domains,
    },
  },
  {
    provider: clusterProviderLegacy,
  }
);

const httpsRedirectLegacy = new k8s.apiextensions.CustomResource(
  `probable-legacy-https-redirect`,
  {
    apiVersion: "networking.gke.io/v1beta1",
    kind: "FrontendConfig",
    metadata: {
      namespace: namespaceName,
    },
    spec: {
      redirectToHttps: {
        enabled: true,
        responseCodeName: "MOVED_PERMANENTLY_DEFAULT",
      },
    },
  },
  {
    provider: clusterProviderLegacy,
  }
);

const ingressLegacy = new k8s.networking.v1.Ingress(
  `probable-lgeacy-ingress`,
  {
    metadata: {
      namespace: namespaceName,
      annotations: {
        "kubernetes.io/ingress.class": "gce",
        "kubernetes.io/ingress.global-static-ip-name": ipAddressLegacy.name,
        "networking.gke.io/managed-certificates":
          managedCertificateLegacy.metadata.apply((m) => m.name),
        "networking.gke.io/v1beta1.FrontendConfig":
          httpsRedirectLegacy.metadata.apply((m) => m.name),
      },
    },
    spec: {
      rules: domains.map((domain) => {
        const rule = {
          host: domain,
          http: {
            paths: [
              {
                path: "/",
                pathType: "Prefix",
                backend: {
                  service: {
                    name: serviceLegacy?.metadata?.apply((m) => m?.name),
                    port: {
                      number: serviceLegacy?.spec?.ports?.[0].apply(
                        (p) => p?.port
                      ),
                    },
                  },
                },
              },
            ],
          },
        };
        return rule;
      }),
    },
  },
  {
    provider: clusterProviderLegacy,
  }
);
