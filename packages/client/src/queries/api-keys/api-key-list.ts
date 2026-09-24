import { ApiKeyListOutput } from '@colanode/core';

export type ApiKeyListQueryInput = {
  type: 'api.key.list';
  accountId: string;
};

declare module '@colanode/client/queries' {
  interface QueryMap {
    'api.key.list': {
      input: ApiKeyListQueryInput;
      output: ApiKeyListOutput;
    };
  }
}
