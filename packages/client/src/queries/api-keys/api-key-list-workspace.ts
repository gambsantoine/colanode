import { ApiKeyAuditListOutput } from '@colanode/core';

export type ApiKeyListWorkspaceQueryInput = {
  type: 'api.key.list.workspace';
  userId: string;
};

declare module '@colanode/client/queries' {
  interface QueryMap {
    'api.key.list.workspace': {
      input: ApiKeyListWorkspaceQueryInput;
      output: ApiKeyAuditListOutput;
    };
  }
}
