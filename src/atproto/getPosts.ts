import type { WhtwndBlogEntryRecord, WhtwndBlogEntryView } from "src/types";
import { atpAgent } from "./agent";
import { whtwndBlogEntryRecordToView } from "./dataToView";
import { getCachedPosts, setCachedPost, setCachedPosts } from "src/kv";

export const getPosts = async (ctx: App.Locals, cursor: string | undefined, skipCache?: boolean) => {
  const cachedRes = await getCachedPosts(ctx);
  if (!skipCache && cachedRes) {
    return cachedRes;
  }

  const repo = ctx.runtime.env.ATP_IDENTIFIER;
  const res = await atpAgent(ctx).com.atproto.repo.listRecords({
    collection: 'com.whtwnd.blog.entry',
    repo,
    cursor,
  });

  if (!res.success) {
    throw new Error('Failed to get posts.');
  }

  const posts = res.data.records.map(data => whtwndBlogEntryRecordToView({
    uri: data.uri,
    cid: data.cid?.toString() ?? '',
    value: data.value as WhtwndBlogEntryRecord,
  })) as WhtwndBlogEntryView[];

  for (const post of posts) {
    await setCachedPost(ctx, post);
  }
  await setCachedPosts(ctx, posts);

  return posts;
}
