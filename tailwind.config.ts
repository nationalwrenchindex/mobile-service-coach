import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        base: "#080E14",
        navy: "#0D1B2A",
        card: "#112236",
        teal: {
          DEFAULT: "#00B4D8",
          hover: "#0096C7",
        },
        brand: {
          border: "#1e3a52",
          muted: "#8BAABB",
        },
      },
      fontFamily: {
        syne: ["Syne", "sans-serif"],
        dm: ["DM Sans", "sans-serif"],
      },
      borderColor: {
        DEFAULT: "#1e3a52",
      },
    },
  },
  plugins: [],
};
export default config;
