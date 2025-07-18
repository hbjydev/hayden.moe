import type { WhtwndBlogEntryRecord, WhtwndBlogEntryView } from "src/types";
import { atpAgent } from "./agent";
import { whtwndBlogEntryRecordToView } from "./dataToView";
import { getCachedPost, setCachedPost } from "src/kv";

export const getPost = async (ctx: App.Locals, rkey: string, skipCache?: boolean) => {
  const cachedRes = await getCachedPost(ctx, rkey);
  if (!skipCache && cachedRes) {
    return cachedRes;
  }

  const repo = ctx.runtime.env.ATP_IDENTIFIER;
  const res = await atpAgent(ctx).com.atproto.repo.getRecord({
    collection: 'com.whtwnd.blog.entry',
    repo,
    rkey,
  });

  if (!res.success) {
    throw new Error('Failed to get post.');
  }

  const post = whtwndBlogEntryRecordToView({
    uri: res.data.uri,
    cid: res.data.cid?.toString() ?? '',
    value: res.data.value as WhtwndBlogEntryRecord,
  }) as WhtwndBlogEntryView;

  await setCachedPost(ctx, post);
  return post;
};
