import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        swiss: {
          bg: "#0B0B0C",
          fg: "#F5F5F5",
          muted: "#1B1B1E",
          accent: "#FF4C29",
          border: "#F5F5F5",
        },
        // Semantic material tokens — opacity-composable via rgb(var(..) / <alpha-value>)
        paper: "rgb(var(--paper) / <alpha-value>)",
        ink: "rgb(var(--ink) / <alpha-value>)",
        surface: "rgb(var(--surface-1) / <alpha-value>)",
        accent: "rgb(var(--accent) / <alpha-value>)",
        glow: "rgb(var(--glow) / <alpha-value>)",
      },
      fontFamily: {
        swiss: ["var(--font-inter)", "Helvetica Neue", "Helvetica", "Arial", "sans-serif"],
        mono: ["var(--font-mono)", "ui-monospace", "SFMono-Regular", "Menlo", "monospace"],
      },
      borderRadius: {
        none: "0",
        md: "10px",
        lg: "16px",
        xl: "22px",
      },
      fontSize: {
        display: ["clamp(2.75rem, 6.5vw, 7rem)", { lineHeight: "0.92", letterSpacing: "-0.03em" }],
      },
      transitionDuration: {
        instant: "100ms",
        fast: "160ms",
        normal: "240ms",
        slow: "420ms",
      },
      transitionTimingFunction: {
        standard: "cubic-bezier(.4,0,.2,1)",
        "out-back": "cubic-bezier(.34,1.2,.64,1)",
      },
      animation: {
        "slide-up": "slideUp 0.2s ease-out forwards",
        "fade-in": "fadeIn 0.2s ease-out forwards",
        "route-progress": "routeProgress 800ms cubic-bezier(0.16, 1, 0.3, 1) forwards",
        "fade-out": "fadeOut 200ms ease-out forwards",
        shimmer: "shimmer 2s ease-in-out infinite",
        drift: "drift 60s ease-in-out infinite alternate",
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
        drift: {
          "0%": { transform: "translate3d(0,0,0)" },
          "100%": { transform: "translate3d(1.5%, -1.5%, 0)" },
        },
      },
    },
  },
  plugins: [],
};
export default config;
