import { LoaderFunction } from "@remix-run/cloudflare";
import { Feed } from "feed";
import { getPosts } from "src/atproto/getPosts";

export const loader: LoaderFunction = async ({ context }) => {
  const posts = await getPosts(context, undefined);

  const postsFiltered = posts.filter(p => !p.content?.startsWith('NOT_LIVE'));

  const postsShortened = postsFiltered.map(p => {
    if (p.content?.length! > 200) {
      p.content = p.content?.slice(0, 200).trimEnd() + '...';
    }
    return p;
  });

  const blogLink = 'https://hayden.moe/posts';
  const feed = new Feed({
    id: blogLink,
    title: 'hayden@web ~/posts',
    description: 'The blog of a lowly DevOps Engineer from the UK. Federated on atproto!',
    link: blogLink,
    language: 'en',
    updated: postsShortened.length > 0 ? new Date(postsShortened[0].createdAt) : new Date(),
    generator: 'https://github.com/jpmonette/feed',
    copyright: '© Hayden Young',
  });

  postsShortened.forEach(post => feed.addItem({
    id: `${blogLink}/${post.rkey}/`,
    title: post.title,
    link: `${blogLink}/${post.rkey}/`,
    date: new Date(post.createdAt),
    description: post.content,
  }));

  return new Response(feed.rss2(), {
    headers: { 'Content-Type': 'application/xml' },
  });
};
