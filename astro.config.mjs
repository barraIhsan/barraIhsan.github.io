import { defineConfig } from "astro/config";

import tailwind from "@astrojs/tailwind";
import mdx from "@astrojs/mdx";
import sitemap from "@astrojs/sitemap";
import icon from "astro-icon";

// https://astro.build/config
export default defineConfig({
  integrations: [
    tailwind({ applyBaseStyles: false }),
    mdx(),
    sitemap(),
    icon(),
  ],
  site: "https://barraIhsan.github.io",
  base: "",
});
