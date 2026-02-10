import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      // Full-width grid; minimal side gutters so content uses viewport (no narrow strip)
      spacing: {
        figmaGutter: "16px",
        figmaGap: "24px",
      },
      colors: {
        // Figma design: pure black surface, cyan/blue accents
        surface: "#000000",
        surfaceElevated: "#111111",
        accent: "#06b6d4",
        accentMuted: "#0891b2",
      },
      fontFamily: {
        sans: ["var(--font-space-mono)", "Space Mono", "monospace"],
        mono: ["var(--font-space-mono)", "Space Mono", "monospace"],
      },
    },
  },
  plugins: [],
};
export default config;
