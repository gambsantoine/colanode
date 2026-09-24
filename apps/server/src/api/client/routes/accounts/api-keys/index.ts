import { FastifyPluginCallback } from 'fastify';

import { accountApiKeysCreateRoute } from './api-keys-create';
import { accountApiKeysListRoute } from './api-keys-list';
import { accountApiKeysRevokeRoute } from './api-keys-revoke';

export const accountApiKeyRoutes: FastifyPluginCallback = (
  instance,
  _,
  done
) => {
  instance.register(accountApiKeysCreateRoute);
  instance.register(accountApiKeysListRoute);
  instance.register(accountApiKeysRevokeRoute);

  done();
};
