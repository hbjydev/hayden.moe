import type { APIContext } from "astro";

export const prerender = false;

export const GET = async (c: APIContext) => {
  const res = c.url.searchParams.get('resource');
  if (!res) {
    return Response.json({ error: 'missing resource query' }, { status: 400 });
  }

  if (!res.startsWith('acct:')) {
    return Response.json({ error: 'this endpoint only supports acct: resources' }, { status: 400 });
  }

  return Response.json({
    subject: res,
    links: [
      {
        rel: "http://openid.net/specs/connect/1.0/issuer",
        href: "https://sso.hayden.moe/application/o/tailscale/"
      }
    ]
  });
}
