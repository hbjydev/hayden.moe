export const GET = () => {
  return Response.json({
    "m.homeserver": {
      base_url: "https://matrix.hayden.moe"
    }
  });
}
