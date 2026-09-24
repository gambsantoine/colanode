import { FastifyPluginCallbackZod } from 'fastify-type-provider-zod';

import {
  ApiErrorCode,
  apiErrorOutputSchema,
  apiKeyAuditListOutputSchema,
} from '@colanode/core';
import { database } from '@colanode/server/data/database';

export const workspaceApiKeysListRoute: FastifyPluginCallbackZod = (
  instance,
  _,
  done
) => {
  instance.route({
    method: 'GET',
    url: '/',
    schema: {
      response: {
        200: apiKeyAuditListOutputSchema,
        403: apiErrorOutputSchema,
      },
    },
    handler: async (request, reply) => {
      const workspace = request.workspace;

      if (workspace.user.role !== 'owner' && workspace.user.role !== 'admin') {
        return reply.code(403).send({
          code: ApiErrorCode.ApiKeyNoAccess,
          message:
            'You do not have access to view the api keys of this workspace.',
        });
      }

      const rows = await database
        .selectFrom('api_keys')
        .innerJoin('accounts', 'accounts.id', 'api_keys.account_id')
        .select([
          'api_keys.id as id',
          'api_keys.name as name',
          'api_keys.workspace_id as workspace_id',
          'api_keys.created_at as created_at',
          'api_keys.last_used_at as last_used_at',
          'api_keys.revoked_at as revoked_at',
          'accounts.id as creator_id',
          'accounts.name as creator_name',
          'accounts.email as creator_email',
        ])
        .where('api_keys.workspace_id', '=', workspace.id)
        .orderBy('api_keys.created_at', 'desc')
        .execute();

      return {
        apiKeys: rows.map((row) => ({
          id: row.id,
          name: row.name,
          workspaceId: row.workspace_id,
          createdAt: row.created_at.toISOString(),
          lastUsedAt: row.last_used_at?.toISOString() ?? null,
          revokedAt: row.revoked_at?.toISOString() ?? null,
          creator: {
            id: row.creator_id,
            name: row.creator_name,
            email: row.creator_email,
          },
        })),
      };
    },
  });

  done();
};
