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
      typography: (theme) => ({
        DEFAULT: {
          css: {
            // make `inline code` have the same style as Github's
            "code::before": {
              content: "",
            },
            "code::after": {
              content: "",
            },
            code: {
              paddingInlineStart: ".4em",
              paddingInlineEnd: ".4em",
              paddingTop: ".2em",
              paddingBottom: ".2em",
              borderRadius: ".4em",
              backgroundColor: theme("colors.gray.800"),
            },
            // no quote inside blockquote
            "blockquote p:first-of-type::before": {
              content: "",
            },
            "blockquote p:last-of-type::after": {
              content: "",
            },
            // hover and already visited link style
            "a:hover": {
              color: theme("colors.gray.300"),
            },
            ":not(sup) > a:visited": {
              color: theme("colors.gray.400"),
            },
          },
        },
      }),
    },
  },
  plugins: [
    require("@lostisworld/tailwind-mask"),
    require("@tailwindcss/typography"),
  ],
};
