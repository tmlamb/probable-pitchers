module.exports = {
  extends: [
    "next",
    "next/core-web-vitals",
    "turbo",
    "prettier",
    "plugin:@typescript-eslint/recommended",
  ],
  rules: {
    "@next/next/no-html-link-for-pages": "off",
  },
  parser: "@typescript-eslint/parser",
  parserOptions: {
    project: "./tsconfig.json",
  },
  plugins: ["@typescript-eslint"],
  ignorePatterns: ["*.spec.ts", "**/test/**/*", "**/dist/**/*"],
};
