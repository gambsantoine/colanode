import { FastifyPluginCallback } from 'fastify';
import fp from 'fastify-plugin';

import { ApiErrorCode } from '@colanode/core';

import { ApiRepository } from '../lib/repository';

const API_KEY_TOKEN_PREFIX = 'cak_';
const API_KEY_ID_LENGTH = 28;

export type ApiKeyContext = {
  apiKeyId: string;
  accountId: string;
  workspaceId: string | null;
};

declare module 'fastify' {
  interface FastifyRequest {
    apiKeyContext: ApiKeyContext;
  }
}

const parseApiKeyToken = (
  token: string
): { apiKeyId: string; secret: string } | null => {
  if (!token.startsWith(API_KEY_TOKEN_PREFIX)) {
    return null;
  }

  const tokenWithoutPrefix = token.slice(API_KEY_TOKEN_PREFIX.length);
  const apiKeyId = tokenWithoutPrefix.slice(0, API_KEY_ID_LENGTH);
  const secret = tokenWithoutPrefix.slice(API_KEY_ID_LENGTH);

  if (!apiKeyId || !secret) {
    return null;
  }

  return { apiKeyId, secret };
};

export const createApiKeyAuthenticator = (
  repository: ApiRepository
): FastifyPluginCallback => {
  const apiKeyAuthenticatorCallback: FastifyPluginCallback = (
    fastify,
    _,
    done
  ) => {
    if (!fastify.hasRequestDecorator('apiKeyContext')) {
      fastify.decorateRequest('apiKeyContext');
    }

    fastify.addHook('onRequest', async (request, reply) => {
      const auth = request.headers.authorization;
      if (!auth) {
        return reply.code(401).send({
          code: ApiErrorCode.TokenMissing,
          message: 'No api key provided',
        });
      }

      const parts = auth.split(' ');
      const token = parts.length === 2 ? parts[1] : parts[0];

      const tokenData = token ? parseApiKeyToken(token) : null;
      if (!tokenData) {
        return reply.code(401).send({
          code: ApiErrorCode.TokenInvalid,
          message: 'Api key is invalid',
        });
      }

      const result = await repository.verifyApiKey(
        tokenData.apiKeyId,
        tokenData.secret
      );

      if (!result) {
        return reply.code(401).send({
          code: ApiErrorCode.TokenInvalid,
          message: 'Api key is invalid or has been revoked',
        });
      }

      request.apiKeyContext = {
        apiKeyId: tokenData.apiKeyId,
        accountId: result.accountId,
        workspaceId: result.workspaceId,
      };

      void repository.touchApiKeyLastUsed(tokenData.apiKeyId);
    });

    done();
  };

  return fp(apiKeyAuthenticatorCallback);
};
