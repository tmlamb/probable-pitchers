import * as dotenv from 'dotenv'
dotenv.config({path: '../../.env'});

const { APP_ENV, NEXTAUTH_URL, SENTRY_PUBLIC_DSN } = process.env;

export default ({ config }) => {
  const appConfig = {
    ...config,
    name: `${config.name}${APP_ENV !== "production" ? ` (${APP_ENV})` : ""}`,
    extra: {
      ...config.extra,
      apiBaseUrl: NEXTAUTH_URL,
      nextAuthUrl: NEXTAUTH_URL,
      sentryPublicDsn: SENTRY_PUBLIC_DSN,
      appEnv: APP_ENV,
    },
  };
  return appConfig;
};
