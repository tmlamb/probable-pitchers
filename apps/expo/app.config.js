const { APP_ENV, API_BASE_URL, NEXTAUTH_URL } = process.env;

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
    },
  };
  return appConfig;
};
