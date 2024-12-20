import { AtpAgent } from '@atproto/api';
import { AppLoadContext } from '@react-router';

export const atpAgent = (ctx: AppLoadContext) => new AtpAgent({
  service: ctx.cloudflare.env.ATP_SERVICE,
});
