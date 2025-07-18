import rss from '@astrojs/rss';
import type { APIContext } from "astro";
import { getPosts } from '~/atproto/getPosts';

export const prerender = false;

export const GET = async (context: APIContext) => {
  const posts = await getPosts(context.locals, undefined);

  const postsFiltered = posts.filter(p => !p.content?.startsWith('NOT_LIVE'));

  const postsShortened = postsFiltered.map(p => {
    if (p.content?.length! > 200) {
      p.content = p.content?.slice(0, 200).trimEnd() + '...';
    }
    return p;
  });

  return rss({
    title: 'Hayden\'s Blog',
    description: 'The blog of a lowly DevOps Engineer from the UK. Federated on atproto!',
    site: context.site,

    items: postsShortened.map(post => ({
      id: `${context.site}posts/${post.rkey}/`,
      title: post.title,
      link: `${context.site}posts/${post.rkey}/`,
      date: new Date(post.createdAt),
      description: post.content,
    })),
  });
};
