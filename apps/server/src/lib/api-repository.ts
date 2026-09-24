import { ApiKeyVerifyResult, ApiRepository } from '@colanode/api';
import { database } from '@colanode/server/data/database';
import { verifyApiKeySecret } from '@colanode/server/lib/api-key-tokens';

export const apiRepository: ApiRepository = {
  verifyApiKey: async (
    apiKeyId: string,
    secret: string
  ): Promise<ApiKeyVerifyResult | null> => {
    const apiKey = await database
      .selectFrom('api_keys')
      .selectAll()
      .where('id', '=', apiKeyId)
      .executeTakeFirst();

    if (!apiKey || apiKey.revoked_at) {
      return null;
    }

    if (!verifyApiKeySecret(secret, apiKey.token_salt, apiKey.token_hash)) {
      return null;
    }

    return {
      accountId: apiKey.account_id,
      workspaceId: apiKey.workspace_id,
    };
  },
  touchApiKeyLastUsed: async (apiKeyId: string): Promise<void> => {
    await database
      .updateTable('api_keys')
      .set({ last_used_at: new Date() })
      .where('id', '=', apiKeyId)
      .execute();
  },
};
