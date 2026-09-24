import { ApiKeyCreateOutput } from '@colanode/core';

export type ApiKeyCreateWorkspaceMutationInput = {
  type: 'api.key.create.workspace';
  userId: string;
  name: string;
};

export type ApiKeyCreateWorkspaceMutationOutput = ApiKeyCreateOutput;

declare module '@colanode/client/mutations' {
  interface MutationMap {
    'api.key.create.workspace': {
      input: ApiKeyCreateWorkspaceMutationInput;
      output: ApiKeyCreateWorkspaceMutationOutput;
    };
  }
}
