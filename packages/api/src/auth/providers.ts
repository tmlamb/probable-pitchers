export const nativeProviders = {
  google: "google-expo",
  apple: "apple-expo",
} as const;

export const providerLabels = {
  "google-expo": "Google",
  google: "Google",
  "apple-expo": "Apple",
  apple: "Apple",
};

export const isValidProvider = (
  k: string
): k is keyof typeof nativeProviders => {
  return k in nativeProviders;
};
