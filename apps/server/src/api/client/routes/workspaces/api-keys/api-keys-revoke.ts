import { FastifyPluginCallbackZod } from 'fastify-type-provider-zod';
import { z } from 'zod/v4';

import { ApiErrorCode, apiErrorOutputSchema, apiKeyOutputSchema } from '@colanode/core';
import { database } from '@colanode/server/data/database';

export const workspaceApiKeysRevokeRoute: FastifyPluginCallbackZod = (
  instance,
  _,
  done
) => {
  instance.route({
    method: 'POST',
    url: '/:id/revoke',
    schema: {
      params: z.object({
        id: z.string(),
      }),
      response: {
        200: apiKeyOutputSchema,
        403: apiErrorOutputSchema,
        404: apiErrorOutputSchema,
      },
    },
    handler: async (request, reply) => {
      const workspace = request.workspace;

      if (workspace.user.role !== 'owner' && workspace.user.role !== 'admin') {
        return reply.code(403).send({
          code: ApiErrorCode.ApiKeyNoAccess,
          message:
            'You do not have access to revoke api keys in this workspace.',
        });
      }

      const apiKeyId = request.params.id;

      const apiKey = await database
        .selectFrom('api_keys')
        .selectAll()
        .where('id', '=', apiKeyId)
        .where('workspace_id', '=', workspace.id)
        .executeTakeFirst();

      if (!apiKey) {
        return reply.code(404).send({
          code: ApiErrorCode.ApiKeyNotFound,
          message: 'Api key not found.',
        });
      }

      const revokedAt = apiKey.revoked_at ?? new Date();

      if (!apiKey.revoked_at) {
        await database
          .updateTable('api_keys')
          .set({
            revoked_at: revokedAt,
            revoked_by: request.account.id,
          })
          .where('id', '=', apiKeyId)
          .execute();
      }

      return {
        id: apiKey.id,
        name: apiKey.name,
        workspaceId: apiKey.workspace_id,
        createdAt: apiKey.created_at.toISOString(),
        lastUsedAt: apiKey.last_used_at?.toISOString() ?? null,
        revokedAt: revokedAt.toISOString(),
      };
    },
  });

  done();
};
