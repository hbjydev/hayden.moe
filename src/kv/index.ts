import { AppLoadContext } from "@remix-run/cloudflare";
import { WhtwndBlogEntryView } from "src/types";

export const getCachedPosts = async (context: AppLoadContext) => {
  const res = await context.cloudflare.env.CACHE.get('post:all', 'json');
  if (!res) {
    return null;
  }
  return res as WhtwndBlogEntryView[];
};

export const setCachedPosts = async (context: AppLoadContext, posts: WhtwndBlogEntryView[]) => {
  await context.cloudflare.env.CACHE.put(
    'post:all',
    JSON.stringify(posts),
    { expirationTtl: 60 },
  );
};

export const getCachedPost = async (context: AppLoadContext, rkey: string) => {
  const res = await context.cloudflare.env.CACHE.get(`post:${rkey}`, 'json');
  if (!res) {
    return null;
  }
  return res as WhtwndBlogEntryView;
};

export const setCachedPost = async (context: AppLoadContext, post: WhtwndBlogEntryView) => {
  await context.cloudflare.env.CACHE.put(
    `post:${post.rkey}`,
    JSON.stringify(post),
    { expirationTtl: 60 * 10 },
  );
};
