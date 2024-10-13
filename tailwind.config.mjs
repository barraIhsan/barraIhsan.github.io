/** @type {import('tailwindcss').Config} */
export default {
  content: ["./src/**/*.{astro,html,js,jsx,md,mdx,svelte,ts,tsx,vue}"],
  theme: {
    extend: {
      fontFamily: {
        mono: ["Jetbrains Mono", "Courier New", "Courier", "monospace"],
      },
      keyframes: {
        scroll: {
          "100%": {
            transform: "translate(calc(-50% - var(--gap) / 2))",
          },
        },
      },
      animation: {
        scroll:
          "scroll var(--duration, 30s) var(--direction, forwards) linear infinite",
      },
    },
  },
  plugins: [
    require("@lostisworld/tailwind-mask"),
    require("@tailwindcss/typography"),
  ],
};
