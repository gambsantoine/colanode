import { FastifyReply, FastifyRequest } from 'fastify';

import { ApiErrorCode } from '@colanode/core';

export const DEFAULT_API_VERSION = '1';

type VersionedHandler = (
  request: FastifyRequest,
  reply: FastifyReply
) => unknown;

export const withVersion = (handlers: Record<string, VersionedHandler>): any => {
  return async (request: FastifyRequest, reply: FastifyReply) => {
    const query = request.query as { version?: string } | undefined;
    const version = query?.version ?? DEFAULT_API_VERSION;
    const handler = handlers[version];

    if (!handler) {
      return reply.code(400).send({
        code: ApiErrorCode.UnsupportedApiVersion,
        message: `Unsupported api version "${version}".`,
      });
    }

    return handler(request, reply);
  };
};
