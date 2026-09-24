import { FastifyPluginCallback } from 'fastify';

import { accountAuthenticator } from '@colanode/server/api/client/plugins/account-auth';

import { accountSyncRoute } from './account-sync';
import { accountUpdateRoute } from './account-update';
import { accountApiKeyRoutes } from './api-keys';

export const accountRoutes: FastifyPluginCallback = (instance, _, done) => {
  instance.register((subInstance) => {
    subInstance.register(accountAuthenticator);

    subInstance.register(accountSyncRoute);
    subInstance.register(accountUpdateRoute);
    subInstance.register(accountApiKeyRoutes);
  });

  done();
};
