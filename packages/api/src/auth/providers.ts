export const nativeProviders = {
  google: "google-expo",
} as const;

export const isValidProvider = (
  k: string
): k is keyof typeof nativeProviders => {
  return k in nativeProviders;
};

export const nativeDiscoveryUrls = {
  google: {
    authorizationEndpoint: "https://accounts.google.com/o/oauth2/auth",
    tokenEndpoint: "https://accounts.google.com/o/oauth2/token",
    revocationEndpoint: "https://accounts.google.com/o/oauth2/revoke",
  },
};

export const getDiscoveryUrls = (provider: keyof typeof nativeProviders) => {
  if (!isValidProvider(provider))
    throw new Error(
      `Could not find discovery for ${provider} or the provider provided is not correct. Have you typed it in correctly? If you need to add a provider discovery check 'packages/server/src/auth/providers.ts'`
    );
  return nativeDiscoveryUrls[provider];
};
