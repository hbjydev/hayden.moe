import type { WhtwndBlogEntryView } from "src/types";

export const getCachedPosts = async (context: App.Locals) => {
  const res = await context.runtime.env.CACHE.get('post:all', 'json');
  if (!res) {
    return null;
  }
  return res as WhtwndBlogEntryView[];
};

export const setCachedPosts = async (context: App.Locals, posts: WhtwndBlogEntryView[]) => {
  await context.runtime.env.CACHE.put(
    'post:all',
    JSON.stringify(posts),
    { expirationTtl: 60 },
  );
};

export const getCachedPost = async (context: App.Locals, rkey: string) => {
  const res = await context.runtime.env.CACHE.get(`post:${rkey}`, 'json');
  if (!res) {
    return null;
  }
  return res as WhtwndBlogEntryView;
};

export const setCachedPost = async (context: App.Locals, post: WhtwndBlogEntryView) => {
  await context.runtime.env.CACHE.put(
    `post:${post.rkey}`,
    JSON.stringify(post),
    { expirationTtl: 60 * 10 },
  );
};
