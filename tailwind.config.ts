import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/data/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        // Legacy names, kept so existing utilities resolve to the new palette.
        swiss: {
          bg: "rgb(var(--paper) / <alpha-value>)",
          fg: "rgb(var(--ink) / <alpha-value>)",
          muted: "rgb(var(--paper-elevated) / <alpha-value>)",
          accent: "rgb(var(--accent) / <alpha-value>)",
          border: "rgb(var(--ink) / <alpha-value>)",
        },
        paper: "rgb(var(--paper) / <alpha-value>)",
        "paper-elevated": "rgb(var(--paper-elevated) / <alpha-value>)",
        ink: "rgb(var(--ink) / <alpha-value>)",
        accent: "rgb(var(--accent) / <alpha-value>)",
        // Light "sheet" surfaces (folders, spec cards) and the ink printed on them.
        sheet: "rgb(var(--sheet) / <alpha-value>)",
        "sheet-grey": "rgb(var(--sheet-grey) / <alpha-value>)",
        "on-sheet": "rgb(var(--on-sheet) / <alpha-value>)",
        // Tala's gold.
        solar: "rgb(var(--solar) / <alpha-value>)",
      },
      fontFamily: {
        sans: ["var(--font-sans)", "Helvetica Neue", "Arial", "sans-serif"],
        // Alias of sans — existing `font-swiss` utilities pick up the body face.
        swiss: ["var(--font-sans)", "Helvetica Neue", "Arial", "sans-serif"],
        display: ["var(--font-display)", "Georgia", "serif"],
        mono: ["var(--font-mono)", "ui-monospace", "SFMono-Regular", "Menlo", "monospace"],
        hand: ["var(--font-hand)", "cursive"],
      },
      borderRadius: {
        none: "0",
        sm: "4px",
        md: "6px",
        lg: "10px",
        xl: "14px",
      },
      fontSize: {
        display: ["clamp(3rem, 7vw, 7.5rem)", { lineHeight: "0.95", letterSpacing: "-0.035em" }],
      },
      transitionDuration: {
        instant: "100ms",
        fast: "160ms",
        normal: "240ms",
        slow: "600ms",
      },
      transitionTimingFunction: {
        standard: "cubic-bezier(.4,0,.2,1)",
        out: "cubic-bezier(.16,1,.3,1)",
        "out-back": "cubic-bezier(.34,1.2,.64,1)",
      },
      animation: {
        "slide-up": "slideUp 0.2s ease-out forwards",
        "fade-in": "fadeIn 0.2s ease-out forwards",
        "route-progress": "routeProgress 800ms cubic-bezier(0.16, 1, 0.3, 1) forwards",
        "fade-out": "fadeOut 200ms ease-out forwards",
        shimmer: "shimmer 2s ease-in-out infinite",
        ticker: "ticker 28s linear infinite",
      },
      keyframes: {
        slideUp: {
          "0%": { opacity: "0", transform: "translateY(4px)" },
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
        routeProgress: {
          "0%": { transform: "scaleX(0)", transformOrigin: "left" },
          "50%": { transform: "scaleX(1)", transformOrigin: "left" },
          "50.01%": { transformOrigin: "right" },
          "100%": { transform: "scaleX(0)", transformOrigin: "right" },
        },
        fadeOut: {
          from: { opacity: "1" },
          to: { opacity: "0" },
        },
        ticker: {
          "0%": { transform: "translateX(0)" },
          "100%": { transform: "translateX(-50%)" },
        },
      },
    },
  },
  plugins: [],
};
export default config;
