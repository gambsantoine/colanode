import { parseApiError } from '@colanode/client/lib/ky';
import { ChangeCheckResult, QueryHandler } from '@colanode/client/lib/types';
import { QueryError, QueryErrorCode } from '@colanode/client/queries';
import { ApiKeyListWorkspaceQueryInput } from '@colanode/client/queries/api-keys/api-key-list-workspace';
import { AppService } from '@colanode/client/services/app-service';
import { Event } from '@colanode/client/types/events';
import { ApiKeyAuditListOutput } from '@colanode/core';

export class ApiKeyListWorkspaceQueryHandler
  implements QueryHandler<ApiKeyListWorkspaceQueryInput>
{
  private readonly app: AppService;

  constructor(app: AppService) {
    this.app = app;
  }

  async handleQuery(
    input: ApiKeyListWorkspaceQueryInput
  ): Promise<ApiKeyAuditListOutput> {
    const workspace = this.app.getWorkspace(input.userId);
    if (!workspace) {
      throw new QueryError(
        QueryErrorCode.WorkspaceNotFound,
        'Workspace not found or has been deleted.'
      );
    }

    try {
      return await workspace.account.client
        .get(`v1/workspaces/${workspace.workspaceId}/api-keys`)
        .json<ApiKeyAuditListOutput>();
    } catch (error) {
      const apiError = await parseApiError(error);
      throw new QueryError(QueryErrorCode.ApiError, apiError.message);
    }
  }

  async checkForChanges(
    _event: Event,
    _input: ApiKeyListWorkspaceQueryInput,
    _output: ApiKeyAuditListOutput
  ): Promise<ChangeCheckResult<ApiKeyListWorkspaceQueryInput>> {
    return { hasChanges: false };
  }
}
