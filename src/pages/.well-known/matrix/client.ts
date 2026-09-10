export const GET = () => {
  return Response.json({
    "m.homeserver": {
      base_url: "https://matrix.hayden.moe",
    },
    "org.matrix.msc4143.rtc_foci": [
      {
        type: "livekit",
        livekit_service_url: "https://livekit.hayden.moe",
      },
    ],
  });
}
