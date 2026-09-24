import { FastifyPluginCallback } from 'fastify';

import { workspaceApiKeysCreateRoute } from './api-keys-create';
import { workspaceApiKeysListRoute } from './api-keys-list';
import { workspaceApiKeysRevokeRoute } from './api-keys-revoke';

export const workspaceApiKeyRoutes: FastifyPluginCallback = (
  instance,
  _,
  done
) => {
  instance.register(workspaceApiKeysCreateRoute);
  instance.register(workspaceApiKeysListRoute);
  instance.register(workspaceApiKeysRevokeRoute);

  done();
};
