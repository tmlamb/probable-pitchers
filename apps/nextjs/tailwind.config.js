// eslint-disable-next-line @typescript-eslint/no-var-requires
const colors = require("tailwindcss/colors");

module.exports = {
  content: ["./src/**/*.{ts,tsx}"],
  theme: {
    extend: {
      fontFamily: {
        sans: ["Inter var"],
      },
    },
    colors: {
      ...colors,
      green: {
        DEFAULT: "#789d7c",
      },
      blue: {
        DEFAULT: "#439ae0",
      },
    },
  },
  plugins: [],
};
