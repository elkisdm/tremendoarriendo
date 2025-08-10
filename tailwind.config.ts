import type { Config } from "tailwindcss";
import plugin from "tailwindcss/plugin";
import forms from "@tailwindcss/forms";

export default {
  content: ["./app/**/*.{ts,tsx}", "./components/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        // Brand accents for gradients and CTAs
        brand: {
          violet: "#8B6CFF",
          aqua: "#00E6B3",
        },
        // Map CSS variables to Tailwind tokens for consistency in class usage
        bg: "var(--bg)",
        surface: "var(--surface)",
        soft: "var(--soft)",
        text: "var(--text)",
        subtext: "var(--subtext)",
        ring: "var(--ring)",
      },
      boxShadow: {
        glass: "0 1px 2px rgba(255,255,255,0.06), 0 8px 24px rgba(0,0,0,0.25)",
      },
      backdropBlur: {
        xs: "2px",
      },
      borderColor: ({ theme }) => ({
        DEFAULT: "color-mix(in oklab, white 12%, transparent)",
        ring: theme("colors.ring"),
      }),
    },
  },
  plugins: [
    forms,
    plugin(function ({ addUtilities, theme }) {
      addUtilities({
        ".glass": {
          backgroundColor: "color-mix(in oklab, white 6%, transparent)",
          border: "1px solid color-mix(in oklab, white 10%, transparent)",
          backdropFilter: "blur(8px)",
          boxShadow: theme("boxShadow.glass") as string,
        },
        ".glass-strong": {
          backgroundColor: "color-mix(in oklab, white 8%, transparent)",
          border: "1px solid color-mix(in oklab, white 14%, transparent)",
          backdropFilter: "blur(12px)",
          boxShadow: theme("boxShadow.glass") as string,
        },
      });
    }),
  ],
} satisfies Config;
