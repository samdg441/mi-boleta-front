import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./src/**/*.{js,ts,jsx,tsx,mdx}"],
  theme: {
    extend: {
      colors: {
        brand: {
          primary: "#f97316",
          "primary-hover": "#ea580c",
          navy: "#0f172a",
          "navy-muted": "#1e293b",
        },
      },
    },
  },
  plugins: [],
};

export default config;
