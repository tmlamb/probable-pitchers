import * as k8s from "@pulumi/kubernetes";
import * as pulumi from "@pulumi/pulumi";
import { containerRegistry } from "./config";

const config = new pulumi.Config();

const clusterProvider = new k8s.Provider("probable-pitchers", {
  kubeconfig: process.env.KUBECONFIG,
});

const ns = new k8s.core.v1.Namespace(
  "probable",
  {},
  { provider: clusterProvider }
);

export const namespaceName = ns.metadata.name;

// const quota = new k8s.core.v1.ResourceQuota(
//   "probable-quota",
//   {
//     metadata: { namespace: namespaceName },
//     spec: {
//       hard: {
//         cpu: "20",
//         memory: "1Gi",
//         pods: "10",
//         resourcequotas: "1",
//         services: "5",
//       },
//     },
//   },
//   {
//     provider: clusterProvider,
//   }
// );

const regcred = new k8s.core.v1.Secret(
  "probable-regcred",
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

const appLabels = { app: "probable-nextjs" };

const deployment = new k8s.apps.v1.Deployment(
  appLabels.app,
  {
    metadata: {
      namespace: namespaceName,
    },
    spec: {
      selector: { matchLabels: appLabels },
      replicas: 2,
      template: {
        metadata: { labels: appLabels },
        spec: {
          imagePullSecrets: [{ name: regcred.metadata.apply((m) => m.name) }],
          containers: [
            {
              name: appLabels.app,
              image: "ghcr.io/tmlamb/probable-pitchers-nextjs:latest",
              ports: [{ name: "http", containerPort: 3000 }],
              livenessProbe: {
                httpGet: { path: "/", port: "http" },
              },
              env: [
                {
                  name: "DATABASE_URL",
                  value: config.requireSecret("dbUrl"),
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

const ingestLabels = { app: "probable-ingest" };

const cronjob = new k8s.batch.v1.CronJob(
  ingestLabels.app,
  {
    metadata: {
      namespace: namespaceName,
    },
    spec: {
      schedule: "0 * * * *",
      jobTemplate: {
        spec: {
          template: {
            spec: {
              imagePullSecrets: [
                { name: regcred.metadata.apply((m) => m.name) },
              ],
              containers: [
                {
                  name: ingestLabels.app,

                  image: "ghcr.io/tmlamb/probable-pitchers-ingest:latest",
                  imagePullPolicy: "Always",
                  env: [
                    {
                      name: "DATABASE_URL",
                      value: config.requireSecret("dbUrl"),
                    },
                    {
                      name: "INGEST_JOBS",
                      value: "daily-games",
                    },
                  ],
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
