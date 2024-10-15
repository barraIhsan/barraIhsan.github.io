import rss from "@astrojs/rss";
import { getCollection } from "astro:content";
import sanitizeHtml from "sanitize-html";
import MarkdownIt from "markdown-it";
const parser = new MarkdownIt();

export async function GET(context) {
  const blogs = await getCollection("blogs");
  return rss({
    title: "barra's blogs",
    description:
      "where I talk about software development and my opinion around technology.",
    site: context.site,
    items: blogs.map((blog) => ({
      title: blog.data.title,
      description: blog.data.desc,
      pubDate: blog.data.pubDate,
      link: `/blog/${blog.slug}`,
      content: sanitizeHtml(parser.render(blog.body), {
        allowedTags: sanitizeHtml.defaults.allowedTags.concat(["img", "h2"]),
      }),
    })),
    customData: `<language>en-US</language>`,
    stylesheet: "/rss/styles.xsl",
  });
}
