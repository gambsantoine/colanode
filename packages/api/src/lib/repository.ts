export type ApiKeyVerifyResult = {
  accountId: string;
  workspaceId: string | null;
};

export interface ApiRepository {
  verifyApiKey(
    apiKeyId: string,
    secret: string
  ): Promise<ApiKeyVerifyResult | null>;
  touchApiKeyLastUsed(apiKeyId: string): Promise<void>;
}
