import type { Config } from "tailwindcss";

const config: Config = {
  darkMode: ["class"],
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        // Executive Dashboard Palette
        navy: {
          50:  "#eef2f7",
          100: "#d5e0ee",
          200: "#abbfdd",
          300: "#7a96c8",
          400: "#506db0",
          500: "#2d4d94",
          600: "#1e3a78",
          700: "#162d60",
          800: "#0f1f45",
          900: "#0a1530",
          950: "#060d1f",
        },
        gold: {
          400: "#f5c842",
          500: "#e6b820",
          600: "#c99b00",
        },
        slate: {
          muted: "#8892a4",
        },
      },
      fontFamily: {
        display: ["var(--font-display)", "Georgia", "serif"],
        body: ["var(--font-body)", "system-ui", "sans-serif"],
      },
      backgroundImage: {
        "navy-gradient": "linear-gradient(135deg, #0a1530 0%, #162d60 50%, #0f1f45 100%)",
        "card-shine": "linear-gradient(135deg, rgba(255,255,255,0.05) 0%, rgba(255,255,255,0) 100%)",
      },
      boxShadow: {
        "card": "0 4px 24px rgba(0,0,0,0.35), inset 0 1px 0 rgba(255,255,255,0.07)",
        "card-hover": "0 8px 40px rgba(0,0,0,0.5), inset 0 1px 0 rgba(255,255,255,0.1)",
        "glow-gold": "0 0 30px rgba(230,184,32,0.25)",
      },
      animation: {
        "fade-up": "fadeUp 0.6s ease forwards",
        "fade-in": "fadeIn 0.4s ease forwards",
        "shimmer": "shimmer 2s infinite",
        "pulse-slow": "pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite",
      },
      keyframes: {
        fadeUp: {
          "0%": { opacity: "0", transform: "translateY(20px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
        fadeIn: {
          "0%": { opacity: "0" },
          "100%": { opacity: "1" },
        },
        shimmer: {
          "0%": { backgroundPosition: "-200% 0" },
          "100%": { backgroundPosition: "200% 0" },
        },
      },
    },
  },
  plugins: [require("tailwindcss-animate")],
};

export default config;
