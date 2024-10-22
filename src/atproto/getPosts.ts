import { WhtwndBlogEntryRecord, WhtwndBlogEntryView } from "src/types";
import { atpAgent } from "./agent";
import { whtwndBlogEntryRecordToView } from "./dataToView";

export const getPosts = async (cursor: string | undefined, skipCache?: boolean) => {
  const repo = process.env.ATP_IDENTIFIER!;
  const res = await atpAgent.com.atproto.repo.listRecords({
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

  return posts;
}
