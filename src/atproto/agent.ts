import { AtpAgent } from '@atproto/api';
import { AppLoadContext } from '@remix-run/cloudflare';

export const atpAgent = (ctx: AppLoadContext) => new AtpAgent({
  service: ctx.cloudflare.env.ATP_SERVICE,
});
