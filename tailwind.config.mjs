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
            // visited link color & hover effect
            "a:hover": {
              textDecorationThickness: "1.3px",
            },
            ":not(sup) > a:visited": {
              color: "var(--tw-prose-invert-links-visited)",
            },
            // slighly more thick strikethrough
            del: {
              textDecorationThickness: "1.5px",
            },
          },
        },
        cyan: {
          css: {
            // white -> gray.50
            "--tw-prose-invert-headings": theme("colors.gray[50]"),
            "--tw-prose-invert-bold": theme("colors.gray[50]"),
            "--tw-prose-invert-kbd": theme("colors.gray[50]"),
            "--tw-prose-invert-code": theme("colors.gray[50]"),

            // links -> cyan
            "--tw-prose-invert-links": theme("colors.cyan[500]"),
            "--tw-prose-invert-links-visited": theme("colors.cyan[600]"),
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
