import { FastifyPluginCallbackZod } from 'fastify-type-provider-zod';

import { apiErrorOutputSchema, apiKeyListOutputSchema } from '@colanode/core';
import { database } from '@colanode/server/data/database';

export const accountApiKeysListRoute: FastifyPluginCallbackZod = (
  instance,
  _,
  done
) => {
  instance.route({
    method: 'GET',
    url: '/me/api-keys',
    schema: {
      response: {
        200: apiKeyListOutputSchema,
        400: apiErrorOutputSchema,
      },
    },
    handler: async (request) => {
      const apiKeys = await database
        .selectFrom('api_keys')
        .selectAll()
        .where('account_id', '=', request.account.id)
        .orderBy('created_at', 'desc')
        .execute();

      return {
        apiKeys: apiKeys.map((apiKey) => ({
          id: apiKey.id,
          name: apiKey.name,
          workspaceId: apiKey.workspace_id,
          createdAt: apiKey.created_at.toISOString(),
          lastUsedAt: apiKey.last_used_at?.toISOString() ?? null,
          revokedAt: apiKey.revoked_at?.toISOString() ?? null,
        })),
      };
    },
  });

  done();
};
