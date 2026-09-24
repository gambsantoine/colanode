import { ApiKeyOutput } from '@colanode/core';

export type ApiKeyRevokeMutationInput = {
  type: 'api.key.revoke';
  accountId: string;
  id: string;
};

export type ApiKeyRevokeMutationOutput = ApiKeyOutput;

declare module '@colanode/client/mutations' {
  interface MutationMap {
    'api.key.revoke': {
      input: ApiKeyRevokeMutationInput;
      output: ApiKeyRevokeMutationOutput;
    };
  }
}
