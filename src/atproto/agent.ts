import { AtpAgent } from '@atproto/api';

export const atpAgent = new AtpAgent({
  service: process.env.ATP_SERVICE!,
})
