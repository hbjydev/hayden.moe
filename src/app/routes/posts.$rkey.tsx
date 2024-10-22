import { json, LoaderFunctionArgs } from '@remix-run/cloudflare';
import { useLoaderData } from '@remix-run/react';
import { getPost } from 'src/atproto/getPost';
import { WhtwndBlogEntryView } from 'src/types';
import { FormattedDate } from '../components/formatted-date';
import Markdown from 'react-markdown';

export const loader = async ({ params }: LoaderFunctionArgs) => {
  const { rkey } = params;
  const post = await getPost(rkey!);
  return json({ post });
};

export default () => {
  const { post } = useLoaderData<{
    post: WhtwndBlogEntryView;
  }>();

  return (
  <>
    <header className="-mx-5 px-5 border-b border-muted pb-5">
      <h1 className="font-bold">{post.title}</h1>
      <span className="text-[var(--base03)]">
        <FormattedDate date={new Date(Date.parse(post.createdAt))} />
      </span>
    </header>

    <Markdown className="prose max-w-5xl py-5">
      {post.content}
    </Markdown>
  </>);
}
