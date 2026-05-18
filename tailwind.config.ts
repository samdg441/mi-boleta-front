import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./src/**/*.{js,ts,jsx,tsx,mdx}"],
  theme: {
    extend: {
      fontFamily: {
        sans: [
          "var(--font-plus-jakarta)",
          "ui-sans-serif",
          "system-ui",
          "sans-serif",
        ],
      },
      colors: {
        brand: {
          primary: "#f97316",
          "primary-hover": "#ea580c",
          glow: "#fb923c",
          navy: "#0c1222",
          "navy-soft": "#151d33",
          cream: "#faf8f5",
        },
      },
      boxShadow: {
        soft: "0 4px 24px -4px rgba(15, 23, 42, 0.08), 0 8px 16px -8px rgba(15, 23, 42, 0.06)",
        lift: "0 12px 40px -12px rgba(15, 23, 42, 0.15), 0 4px 12px -4px rgba(249, 115, 22, 0.12)",
        innerGlow: "inset 0 1px 0 0 rgba(255,255,255,0.06)",
      },
      backgroundImage: {
        "mesh-light":
          "radial-gradient(at 40% 20%, rgba(251, 191, 36, 0.14) 0px, transparent 50%), radial-gradient(at 80% 0%, rgba(249, 115, 22, 0.1) 0px, transparent 45%), radial-gradient(at 0% 50%, rgba(59, 130, 246, 0.08) 0px, transparent 50%)",
        "mesh-auth":
          "radial-gradient(ellipse 80% 50% at 20% 40%, rgba(249, 115, 22, 0.25), transparent), radial-gradient(ellipse 60% 80% at 80% 20%, rgba(59, 130, 246, 0.12), transparent), linear-gradient(165deg, #0c1222 0%, #151d33 45%, #0f172a 100%)",
      },
    },
  },
  plugins: [],
};

export default config;
