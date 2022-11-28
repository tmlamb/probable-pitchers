const { APP_ENV, API_BASE_URL, NEXTAUTH_URL, SENTRY_PUBLIC_DSN } = process.env;

export default ({ config }) => {
  const appConfig = {
    ...config,
    name: `${config.name}${APP_ENV !== "production" ? ` (${APP_ENV})` : ""}`,
    ios: {
      ...config.ios,
      bundleIdentifier: `${config.ios.bundleIdentifier}${
        APP_ENV !== "production" ? `.${APP_ENV}` : ""
      }`,
    },
    android: {
      ...config.android,
      package: `${config.android.package}${
        APP_ENV !== "production" ? `.${APP_ENV}` : ""
      }`,
    },
    extra: {
      ...config.extra,
      apiBaseUrl: API_BASE_URL,
      nextAuthUrl: NEXTAUTH_URL,
      sentryPublicDsn: SENTRY_PUBLIC_DSN,
      appEnv: APP_ENV,
    },
  };
  return appConfig;
};
