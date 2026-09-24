import { ApiKeyCreateOutput } from '@colanode/core';

export type ApiKeyCreateMutationInput = {
  type: 'api.key.create';
  accountId: string;
  name: string;
};

export type ApiKeyCreateMutationOutput = ApiKeyCreateOutput;

declare module '@colanode/client/mutations' {
  interface MutationMap {
    'api.key.create': {
      input: ApiKeyCreateMutationInput;
      output: ApiKeyCreateMutationOutput;
    };
  }
}
