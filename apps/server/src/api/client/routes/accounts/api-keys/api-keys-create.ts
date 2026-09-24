import { FastifyPluginCallbackZod } from 'fastify-type-provider-zod';

import {
  apiErrorOutputSchema,
  apiKeyCreateInputSchema,
  ApiKeyCreateOutput,
  apiKeyCreateOutputSchema,
  generateId,
  IdType,
} from '@colanode/core';
import { database } from '@colanode/server/data/database';
import { generateApiKeyToken } from '@colanode/server/lib/api-key-tokens';

export const accountApiKeysCreateRoute: FastifyPluginCallbackZod = (
  instance,
  _,
  done
) => {
  instance.route({
    method: 'POST',
    url: '/me/api-keys',
    schema: {
      body: apiKeyCreateInputSchema,
      response: {
        200: apiKeyCreateOutputSchema,
        400: apiErrorOutputSchema,
      },
    },
    handler: async (request) => {
      const input = request.body;
      const apiKeyId = generateId(IdType.ApiKey);
      const { token, salt, hash } = generateApiKeyToken(apiKeyId);

      const apiKey = await database
        .insertInto('api_keys')
        .returningAll()
        .values({
          id: apiKeyId,
          account_id: request.account.id,
          workspace_id: null,
          name: input.name,
          token_hash: hash,
          token_salt: salt,
          created_at: new Date(),
        })
        .executeTakeFirstOrThrow();

      const output: ApiKeyCreateOutput = {
        id: apiKey.id,
        name: apiKey.name,
        workspaceId: apiKey.workspace_id,
        createdAt: apiKey.created_at.toISOString(),
        lastUsedAt: null,
        revokedAt: null,
        token,
      };

      return output;
    },
  });

  done();
};
