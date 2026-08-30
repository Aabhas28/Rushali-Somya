import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/app/**/*.{ts,tsx}",
    "./src/components/**/*.{ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        // Light dusty-rose palette
        rosebg: "#DCB5B0", // primary background
        rosebglight: "#E5C4BC", // secondary background
        rosepale: "#F2E1DD", // pale top tint for gradients
        rosedark: "#D4AEA9", // dark rose background
        roseaccent: "#BE9690", // accent rose
        roseline: "#9F7A75", // decorative line / rose
        ink: "#372A2A", // primary text
        ink2: "#624C49", // secondary text
        inkdark: "#1E181D", // darkest elements
        // Back-compat aliases (mapped onto the new palette)
        blush: "#F2E1DD",
        rose: "#DCB5B0",
        burgundy: "#372A2A",
        wine: "#624C49",
        gold: "#9F7A75",
        goldlight: "#9F7A75",
        ivory: "#372A2A",
        champagne: "#E5C4BC",
      },
      fontFamily: {
        display: ["var(--font-script)", "cursive"],
        script: ["var(--font-script)", "cursive"],
        serif: ["var(--font-serif)", "Georgia", "serif"],
        body: ["var(--font-serif)", "Georgia", "serif"],
        sans: ["var(--font-inter)", "system-ui", "sans-serif"],
      },
      keyframes: {
        floaty: {
          "0%,100%": { transform: "translateY(0)" },
          "50%": { transform: "translateY(-10px)" },
        },
        shimmer: {
          "0%": { backgroundPosition: "-200% center" },
          "100%": { backgroundPosition: "200% center" },
        },
      },
      animation: {
        floaty: "floaty 6s ease-in-out infinite",
        shimmer: "shimmer 3s linear infinite",
      },
    },
  },
  plugins: [],
};

export default config;
