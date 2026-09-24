import { ApiKeyOutput } from '@colanode/core';

export type ApiKeyRevokeWorkspaceMutationInput = {
  type: 'api.key.revoke.workspace';
  userId: string;
  id: string;
};

export type ApiKeyRevokeWorkspaceMutationOutput = ApiKeyOutput;

declare module '@colanode/client/mutations' {
  interface MutationMap {
    'api.key.revoke.workspace': {
      input: ApiKeyRevokeWorkspaceMutationInput;
      output: ApiKeyRevokeWorkspaceMutationOutput;
    };
  }
}
