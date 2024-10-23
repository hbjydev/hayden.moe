import { json, LoaderFunctionArgs, MetaFunction } from '@remix-run/cloudflare';
import { useLoaderData } from '@remix-run/react';
import { getPosts } from 'src/atproto/getPosts';
import { WhtwndBlogEntryView } from 'src/types';
import { FormattedDate } from '../components/formatted-date';
import Markdown from 'react-markdown';

export const meta: MetaFunction = () => [
  { title: 'hayden@web ~/posts' },
];

export const loader = async ({ context }: LoaderFunctionArgs) => {
  const posts = await getPosts(context, undefined);

  const postsFiltered = posts.filter(p => !p.content?.startsWith('NOT_LIVE'));

  const postsShortened = postsFiltered.map(p => {
    if (p.content?.length! > 200) {
      p.content = p.content?.slice(0, 200).trimEnd() + '...';
    }
    return p;
  });

  return json({ posts: postsShortened });
};

export default () => {
  const { posts } = useLoaderData<{
    posts: WhtwndBlogEntryView[];
  }>();

  return (
    <div className="-mx-5 flex flex-col">
      <header className="flex flex-col border-b border-muted pb-5 px-5">
        <h1 className="font-bold">Posts</h1>
        <p className="text-[var(--base03)]">
          Showing {posts.length} posts of {posts.length}.
        </p>
      </header>

      <div>
        {posts.map((post, idx) => (
          <div className="px-5 py-4 border-b border-muted" key={idx}>
            <article>
              <header>
                <h2 className="text-pink font-bold">
                  <a href={`/posts/${post.rkey}/`}>{post.title}</a>
                </h2>
                <p className="text-[var(--base03)]">
                  <span className="date">
                    <FormattedDate date={new Date(Date.parse(post.createdAt))} />
                  </span>
                </p>
              </header>
            </article>

            <section className="post__summary prose max-w-6xl">
              <Markdown>
                { post.content }
              </Markdown>
            </section>
          </div>
        ))}
      </div>
    </div>
  );
};
