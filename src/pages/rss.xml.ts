import rss from '@astrojs/rss';
import { type APIContext } from 'astro';
import { getCollection } from 'astro:content';
import sanitizeHtml from 'sanitize-html';
import MarkdownIt from 'markdown-it';
const parser = new MarkdownIt();

export async function GET(context: APIContext) {
  const posts = await getCollection('posts', (post) => !post.data.unlisted);

  return rss({
    title: 'hayden@web',
    description: 'Hayden\'s blog post feed',
    site: context.site!,
    stylesheet: '/pretty-feed-v3.xsl',
    items: posts
      .sort((a, b) => b.id.localeCompare(a.id))
      .map((post) => ({
        title: post.data.title,
        pubDate: post.data.pubDate,
        author: 'Hayden',
        description: post.data.description,
        content: sanitizeHtml(parser.render(post.body!), {
          allowedTags: sanitizeHtml.defaults.allowedTags.concat(['img']),
        }),
        link: `/posts/${post.id}/`,
      })),
  });
}
