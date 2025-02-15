import { LoaderFunctionArgs, MetaFunction } from 'react-router';
import { useLoaderData } from 'react-router';
import { getPost } from 'src/atproto/getPost';
import { FormattedDate } from '../components/formatted-date';
import Markdown from 'react-markdown';

export const meta: MetaFunction<typeof loader> = ({ data }) => {
  if (data) {
    const desc = data.post.content?.slice(0, 100).trimEnd();
    const url = `https://hayden.moe/${data.post.rkey}`;

    return [
      // HTML Meta
      { title: data.post.title },
      { name: 'description', content: desc },

      // OG Meta
      { property: 'og:url', content: url },
      { property: 'og:type', content: 'website' },
      { property: 'og:title', content: data.post.title },
      { property: 'og:description', content: desc },

      // Twitter Meta
      { name: 'twitter:card', content: 'summary_large_image' },
      { property: 'twitter:domain', content: 'hayden.moe' },
      { property: 'twitter:url', content: url },
      { name: 'twitter:title', content: data.post.title },
      { name: 'twitter:description', content: desc },
    ];
  } else {
    return [
      { title: 'Not found' },
      { name: 'description', content: "This post doesn't exist!" },
    ];
  }
}

export const loader = async ({ params, context }: LoaderFunctionArgs) => {
  const { rkey } = params;
  try {
    const post = await getPost(context, rkey!);
    return { post };
  } catch(e) {
    throw new Response(null, {
      status: 404,
      statusText: 'Post not found.',
    });
  }
};

export default () => {
  const { post } = useLoaderData<typeof loader>();

  return (
    <>
      <header className="-mx-5 px-5">
        <h1 className="font-bold before-hash-1">{post.title}</h1>
        <span className="text-base03">
          <FormattedDate date={new Date(Date.parse(post.createdAt))} />
        </span>
      </header>

      <Markdown className="prose max-w-5xl pb-5">
        {post.content}
      </Markdown>
    </>
  );
}
