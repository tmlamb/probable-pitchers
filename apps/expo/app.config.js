import * as dotenv from 'dotenv'
dotenv.config({path: '../../.env'});

const { APP_ENV, NEXTAUTH_URL, SENTRY_PUBLIC_DSN } = process.env;

export default ({ config }) => {
  const appConfig = {
    ...config,
    ios: {
      ...config.ios,
      bundleIdentifier: `${config.ios.bundleIdentifier}${
        APP_ENV !== 'production' ? `.${APP_ENV}` : ''
      }`
    },
    android: {
      ...config.android,
      package: `${config.android.package}${
        APP_ENV !== 'production' ? `.${APP_ENV}` : ''
      }`
    },
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
