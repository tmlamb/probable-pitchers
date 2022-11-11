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

const swapFn = <T extends Record<string, S>, S extends string>(obj: T) => {
  const res = {} as any; // I'm not worried about impl safety
  Object.entries(obj).forEach(([key, value]) => {
    res[value] = key;
  });
  return res as { [K in keyof T as T[K]]: K };
};

export const webProviders = swapFn(nativeProviders);

export const providerPairs = { ...nativeProviders, ...webProviders };

export const isValidProvider = (k: string): k is keyof typeof providerPairs => {
  return k in providerPairs;
};
