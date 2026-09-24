import { parseApiError } from '@colanode/client/lib/ky';
import { MutationHandler } from '@colanode/client/lib/types';
import { MutationError, MutationErrorCode } from '@colanode/client/mutations';
import {
  ApiKeyRevokeMutationInput,
  ApiKeyRevokeMutationOutput,
} from '@colanode/client/mutations/api-keys/api-key-revoke';
import { AppService } from '@colanode/client/services/app-service';
import { ApiKeyOutput } from '@colanode/core';

export class ApiKeyRevokeMutationHandler
  implements MutationHandler<ApiKeyRevokeMutationInput>
{
  private readonly app: AppService;

  constructor(app: AppService) {
    this.app = app;
  }

  async handleMutation(
    input: ApiKeyRevokeMutationInput
  ): Promise<ApiKeyRevokeMutationOutput> {
    const accountService = this.app.getAccount(input.accountId);
    if (!accountService) {
      throw new MutationError(
        MutationErrorCode.AccountNotFound,
        'Account not found or has been logged out already. Try closing the app and opening it again.'
      );
    }

    try {
      return await accountService.client
        .post(`v1/accounts/me/api-keys/${input.id}/revoke`)
        .json<ApiKeyOutput>();
    } catch (error) {
      const apiError = await parseApiError(error);
      throw new MutationError(MutationErrorCode.ApiError, apiError.message);
    }
  }
}
