export const nativeProviders = {
  google: "google-expo",
  apple: "apple-expo",
} as const;

export const isValidProvider = (
  k: string
): k is keyof typeof nativeProviders => {
  return k in nativeProviders;
};
