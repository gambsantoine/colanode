import { FastifyPluginCallbackZod } from 'fastify-type-provider-zod';
import { z } from 'zod/v4';

import { withVersion } from '../lib/versioning';

const meOutputSchemaV1 = z.object({
  accountId: z.string(),
  workspaceId: z.string().nullable(),
});

export const meRoute: FastifyPluginCallbackZod = (instance, _, done) => {
  instance.route({
    method: 'GET',
    url: '/me',
    schema: {
      querystring: z.object({
        version: z.string().optional(),
      }),
      response: {
        200: meOutputSchemaV1,
      },
    },
    handler: withVersion({
      '1': (request) => {
        const context = request.apiKeyContext;
        return {
          accountId: context.accountId,
          workspaceId: context.workspaceId,
        };
      },
    }),
  });

  done();
};
