import { AtpAgent } from '@atproto/api';

export const atpAgent = (locals: App.Locals) => new AtpAgent({
  service: locals.runtime.env.ATP_SERVICE,
});
