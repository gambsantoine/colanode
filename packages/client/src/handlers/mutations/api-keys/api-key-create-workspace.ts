import { WorkspaceMutationHandlerBase } from '@colanode/client/handlers/mutations/workspace-mutation-handler-base';
import { parseApiError } from '@colanode/client/lib/ky';
import { MutationHandler } from '@colanode/client/lib/types';
import { MutationError, MutationErrorCode } from '@colanode/client/mutations';
import {
  ApiKeyCreateWorkspaceMutationInput,
  ApiKeyCreateWorkspaceMutationOutput,
} from '@colanode/client/mutations/api-keys/api-key-create-workspace';
import { ApiKeyCreateInput, ApiKeyCreateOutput } from '@colanode/core';

export class ApiKeyCreateWorkspaceMutationHandler
  extends WorkspaceMutationHandlerBase
  implements MutationHandler<ApiKeyCreateWorkspaceMutationInput>
{
  async handleMutation(
    input: ApiKeyCreateWorkspaceMutationInput
  ): Promise<ApiKeyCreateWorkspaceMutationOutput> {
    const workspace = this.getWorkspace(input.userId);

    try {
      const body: ApiKeyCreateInput = { name: input.name };
      return await workspace.account.client
        .post(`v1/workspaces/${workspace.workspaceId}/api-keys`, {
          json: body,
        })
        .json<ApiKeyCreateOutput>();
    } catch (error) {
      const apiError = await parseApiError(error);
      throw new MutationError(MutationErrorCode.ApiError, apiError.message);
    }
  }
}
