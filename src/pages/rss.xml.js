import rss, { pagesGlobToRssItems } from "@astrojs/rss";

export async function GET(context) {
  return rss({
    title: "barra's blogs",
    description:
      "where I talk about software development and my opinion around technology.",
    site: context.site,
    items: await pagesGlobToRssItems(import.meta.glob("./blogs/*.mdx")),
    customData: `<language>en-US</language>`,
  });
}
