import { parseApiError } from '@colanode/client/lib/ky';
import { ChangeCheckResult, QueryHandler } from '@colanode/client/lib/types';
import { QueryError, QueryErrorCode } from '@colanode/client/queries';
import { ApiKeyListQueryInput } from '@colanode/client/queries/api-keys/api-key-list';
import { AppService } from '@colanode/client/services/app-service';
import { Event } from '@colanode/client/types/events';
import { ApiKeyListOutput } from '@colanode/core';

export class ApiKeyListQueryHandler
  implements QueryHandler<ApiKeyListQueryInput>
{
  private readonly app: AppService;

  constructor(app: AppService) {
    this.app = app;
  }

  async handleQuery(input: ApiKeyListQueryInput): Promise<ApiKeyListOutput> {
    const accountService = this.app.getAccount(input.accountId);
    if (!accountService) {
      throw new QueryError(
        QueryErrorCode.AccountNotFound,
        'Account not found or has been logged out already. Try closing the app and opening it again.'
      );
    }

    try {
      return await accountService.client
        .get('v1/accounts/me/api-keys')
        .json<ApiKeyListOutput>();
    } catch (error) {
      const apiError = await parseApiError(error);
      throw new QueryError(QueryErrorCode.ApiError, apiError.message);
    }
  }

  async checkForChanges(
    _event: Event,
    _input: ApiKeyListQueryInput,
    _output: ApiKeyListOutput
  ): Promise<ChangeCheckResult<ApiKeyListQueryInput>> {
    return { hasChanges: false };
  }
}
