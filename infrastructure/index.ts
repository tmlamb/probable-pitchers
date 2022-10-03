import * as gcp from "@pulumi/gcp";
import * as k8s from "@pulumi/kubernetes";
import * as pulumi from "@pulumi/pulumi";
import { containerRegistry } from "./config";

const config = new pulumi.Config();
const env = pulumi.getStack();

const domains = config.requireObject<string[]>("domains");

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

const appLabels = { app: `probable-nextjs-${env}` };

const deployment = new k8s.apps.v1.Deployment(
  appLabels.app,
  {
    metadata: {
      namespace: namespaceName,
    },
    spec: {
      selector: { matchLabels: appLabels },
      replicas: 1,
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

const ingestLabels = { app: `probable-ingest-${env}` };

const cronjob = new k8s.batch.v1.CronJob(
  ingestLabels.app,
  {
    metadata: {
      namespace: namespaceName,
    },
    spec: {
      schedule: "0 10 * * *",
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

const ipAddress = new gcp.compute.GlobalAddress(`probable-ip-${env}`, {
  project: gcp.config.project,
  addressType: "EXTERNAL",
});

const managedCertificate = new k8s.apiextensions.CustomResource(
  `probable-cert-${env}`,
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
                    name: service.metadata.apply((m) => m.name),
                    port: {
                      number: service.spec.ports[0].apply((p) => p.port),
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
