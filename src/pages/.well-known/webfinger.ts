export const GET = () => {
  return Response.json({
    subject: 'acct:hayden@hayden.moe',
    links: [
      {
        rel: "http://openid.net/specs/connect/1.0/issuer",
        href: "https://id.hayden.moe/realms/haydenmoe/"
      }
    ]
  });
}
