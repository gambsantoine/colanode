import { WorkspaceMutationHandlerBase } from '@colanode/client/handlers/mutations/workspace-mutation-handler-base';
import { parseApiError } from '@colanode/client/lib/ky';
import { MutationHandler } from '@colanode/client/lib/types';
import { MutationError, MutationErrorCode } from '@colanode/client/mutations';
import {
  ApiKeyRevokeWorkspaceMutationInput,
  ApiKeyRevokeWorkspaceMutationOutput,
} from '@colanode/client/mutations/api-keys/api-key-revoke-workspace';
import { ApiKeyOutput } from '@colanode/core';

export class ApiKeyRevokeWorkspaceMutationHandler
  extends WorkspaceMutationHandlerBase
  implements MutationHandler<ApiKeyRevokeWorkspaceMutationInput>
{
  async handleMutation(
    input: ApiKeyRevokeWorkspaceMutationInput
  ): Promise<ApiKeyRevokeWorkspaceMutationOutput> {
    const workspace = this.getWorkspace(input.userId);

    try {
      return await workspace.account.client
        .post(
          `v1/workspaces/${workspace.workspaceId}/api-keys/${input.id}/revoke`
        )
        .json<ApiKeyOutput>();
    } catch (error) {
      const apiError = await parseApiError(error);
      throw new MutationError(MutationErrorCode.ApiError, apiError.message);
    }
  }
}
