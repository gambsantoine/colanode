import { FastifyPluginCallback } from 'fastify';

import { ApiRepository } from '../lib/repository';
import { createApiKeyAuthenticator } from '../plugins/api-key-auth';

import { meRoute } from './me';

export const createApiRoutes = (
  repository: ApiRepository
): FastifyPluginCallback => {
  return (instance, _, done) => {
    instance.register(createApiKeyAuthenticator(repository));
    instance.register(meRoute);

    done();
  };
};
