import { WhtwndBlogEntryRecord, WhtwndBlogEntryView } from "src/types";
import { atpAgent } from "./agent";
import { whtwndBlogEntryRecordToView } from "./dataToView";

export const getPost = async (rkey: string, skipCache?: boolean) => {
  const repo = process.env.ATP_IDENTIFIER!;

  const res = await atpAgent.com.atproto.repo.getRecord({
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

  return post;
};
