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

const domains = config.requireObject<string[]>("domains");
const replicas = config.requireNumber("nextjsReplicas");

const clusterProvider = new k8s.Provider(`probable-pitchers-${env}`, {
  kubeconfig: process.env.KUBECONFIG,
});

const ns = new k8s.core.v1.Namespace(
  `probable-${env}`,
  {},
  { provider: clusterProvider }
);

export const namespaceName = ns.metadata.name;

const regcred = new k8s.core.v1.Secret(
  `probable-regcred-${env}`,
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
  { provider: clusterProvider }
);

const seedLabels = { app: `probable-seed-${env}` };

const seedJob = new k8s.batch.v1.CronJob(
  seedLabels.app,
  {
    metadata: {
      namespace: namespaceName,
    },
    spec: {
      schedule: "0 0 1 2,3,4 *",
      jobTemplate: {
        spec: {
          template: {
            spec: {
              imagePullSecrets: [
                { name: regcred.metadata.apply((m) => m.name) },
              ],
              containers: [
                {
                  name: seedLabels.app,

                  image: `ghcr.io/tmlamb/probable-pitchers-ingest:${
                    changedIngest ? imageTag : "latest"
                  }`,
                  env: [
                    {
                      name: "TURSO_DATABASE_URL",
                      value: config.requireSecret("dbUrl"),
                    },
                    {
                      name: "TURSO_AUTH_TOKEN",
                      value: config.requireSecret("dbToken"),
                    },
                    {
                      name: "INGEST_JOBS",
                      value: "teams,pitchers",
                    },
                  ],
                  resources: {
                    requests: {
                      cpu: "250m",
                      memory: "256Mi",
                    },
                  },
                },
              ],
              restartPolicy: "OnFailure",
            },
          },
        },
      },
    },
  },
  {
    provider: clusterProvider,
  }
);

const playerLabels = { app: `probable-player-${env}` };

const playerJob = new k8s.batch.v1.CronJob(
  playerLabels.app,
  {
    metadata: {
      namespace: namespaceName,
    },
    spec: {
      schedule: "0 6 * 2,3,4,5,6,7,8,9,10,11,12 *",
      jobTemplate: {
        spec: {
          template: {
            spec: {
              imagePullSecrets: [
                { name: regcred.metadata.apply((m) => m.name) },
              ],
              containers: [
                {
                  name: playerLabels.app,

                  image: `ghcr.io/tmlamb/probable-pitchers-ingest:${
                    changedIngest ? imageTag : "latest"
                  }`,
                  env: [
                    {
                      name: "TURSO_DATABASE_URL",
                      value: config.requireSecret("dbUrl"),
                    },
                    {
                      name: "TURSO_AUTH_TOKEN",
                      value: config.requireSecret("dbToken"),
                    },
                    {
                      name: "INGEST_JOBS",
                      value: "pitchers,games",
                    },
                  ],
                  resources: {
                    requests: {
                      cpu: "250m",
                      memory: "256Mi",
                    },
                  },
                },
              ],
              restartPolicy: "OnFailure",
            },
          },
        },
      },
    },
  },
  {
    provider: clusterProvider,
  }
);

const notifyLabels = { app: `probable-notify-${env}` };

const notifyJob = new k8s.batch.v1.CronJob(
  notifyLabels.app,
  {
    metadata: {
      namespace: namespaceName,
    },
    spec: {
      schedule: "0,30 * * 2,3,4,5,6,7,8,9,10,11,12 *",
      jobTemplate: {
        spec: {
          template: {
            spec: {
              imagePullSecrets: [
                { name: regcred.metadata.apply((m) => m.name) },
              ],
              containers: [
                {
                  name: notifyLabels.app,

                  image: `ghcr.io/tmlamb/probable-pitchers-ingest:${
                    changedIngest ? imageTag : "latest"
                  }`,
                  env: [
                    {
                      name: "TURSO_DATABASE_URL",
                      value: config.requireSecret("dbUrl"),
                    },
                    {
                      name: "TURSO_AUTH_TOKEN",
                      value: config.requireSecret("dbToken"),
                    },
                    {
                      name: "INGEST_JOBS",
                      value: "games,notifications",
                    },
                  ],
                  resources: {
                    requests: {
                      cpu: "250m",
                      memory: "256Mi",
                    },
                  },
                },
              ],
              restartPolicy: "OnFailure",
            },
          },
        },
      },
    },
  },
  {
    provider: clusterProvider,
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

const appLabels = { app: `probable-nextjs-${env}` };

const deployment = new k8s.apps.v1.Deployment(
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
          imagePullSecrets: [{ name: regcred.metadata.apply((m) => m.name) }],
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
                  memory: "256Mi",
                },
              },
              livenessProbe: {
                httpGet: { path: "/", port: "http" },
              },
              env: [
                {
                  name: "TURSO_DATABASE_URL",
                  value: config.requireSecret("dbUrl"),
                },
                {
                  name: "TURSO_AUTH_TOKEN",
                  value: config.requireSecret("dbToken"),
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
          ],
        },
      },
    },
  },
  { provider: clusterProvider }
);

const service = new k8s.core.v1.Service(
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
    provider: clusterProvider,
  }
);

const ipAddress = new gcp.compute.GlobalAddress(`probable-address-${env}`, {
  project: gcp.config.project,
  addressType: "EXTERNAL",
});

const managedCertificate = new k8s.apiextensions.CustomResource(
  `probable-certificate-${env}`,
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
    provider: clusterProvider,
  }
);

const httpsRedirect = new k8s.apiextensions.CustomResource(
  `probable-https-redirect-${env}`,
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
    provider: clusterProvider,
  }
);

const ingress = new k8s.networking.v1.Ingress(
  `probable-ingress-${env}`,
  {
    metadata: {
      namespace: namespaceName,
      annotations: {
        "kubernetes.io/ingress.class": "gce",
        "kubernetes.io/ingress.global-static-ip-name": ipAddress.name,
        "networking.gke.io/managed-certificates":
          managedCertificate.metadata.apply((m) => m.name),
        "networking.gke.io/v1beta1.FrontendConfig":
          httpsRedirect.metadata.apply((m) => m.name),
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
                    name: service?.metadata?.apply((m) => m?.name),
                    port: {
                      number: service?.spec?.ports?.[0].apply((p) => p?.port),
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
    provider: clusterProvider,
  }
);

//const podMon = new k8s.apiextensions.CustomResource(
//  `probable-pod-mon-${env}`,
//  {
//    apiVersion: "monitoring.googleapis.com/v1",
//    kind: "PodMonitoring",
//    metadata: {
//      namespace: namespaceName,
//    },
//    spec: {
//      selector: {
//        matchLabels: {
//          app: service.metadata.apply((m) => m.name),
//        },
//      },
//      endpoints: [
//        {
//          port: 80,
//          path: "/api/metrics",
//          interval: "30s",
//        },
//      ],
//    },
//  },
//  {
//    provider: clusterProvider,
//  }
//);
