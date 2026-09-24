import { sha256 } from 'js-sha256';

import { uuid } from '@colanode/server/lib/utils';

const API_KEY_TOKEN_PREFIX = 'cak_';

interface GenerateApiKeyTokenResult {
  token: string;
  salt: string;
  hash: string;
}

interface ApiKeyTokenData {
  apiKeyId: string;
  secret: string;
}

export const generateApiKeyToken = (
  apiKeyId: string
): GenerateApiKeyTokenResult => {
  const salt = uuid();
  const secret = uuid() + uuid();
  const hash = sha256(secret + salt);
  const token = API_KEY_TOKEN_PREFIX + apiKeyId + secret;

  return {
    token,
    salt,
    hash,
  };
};

export const parseApiKeyToken = (token: string): ApiKeyTokenData | null => {
  if (!token.startsWith(API_KEY_TOKEN_PREFIX)) {
    return null;
  }

  const tokenWithoutPrefix = token.slice(API_KEY_TOKEN_PREFIX.length);
  const apiKeyId = tokenWithoutPrefix.slice(0, 28);
  const secret = tokenWithoutPrefix.slice(28);

  if (!apiKeyId || !secret) {
    return null;
  }

  return {
    apiKeyId,
    secret,
  };
};

export const verifyApiKeySecret = (
  secret: string,
  salt: string,
  hash: string
): boolean => {
  const computedHash = sha256(secret + salt);
  return computedHash === hash;
};
