import { parseApiError } from '@colanode/client/lib/ky';
import { MutationHandler } from '@colanode/client/lib/types';
import { MutationError, MutationErrorCode } from '@colanode/client/mutations';
import {
  ApiKeyCreateMutationInput,
  ApiKeyCreateMutationOutput,
} from '@colanode/client/mutations/api-keys/api-key-create';
import { AppService } from '@colanode/client/services/app-service';
import { ApiKeyCreateInput, ApiKeyCreateOutput } from '@colanode/core';

export class ApiKeyCreateMutationHandler
  implements MutationHandler<ApiKeyCreateMutationInput>
{
  private readonly app: AppService;

  constructor(app: AppService) {
    this.app = app;
  }

  async handleMutation(
    input: ApiKeyCreateMutationInput
  ): Promise<ApiKeyCreateMutationOutput> {
    const accountService = this.app.getAccount(input.accountId);
    if (!accountService) {
      throw new MutationError(
        MutationErrorCode.AccountNotFound,
        'Account not found or has been logged out already. Try closing the app and opening it again.'
      );
    }

    try {
      const body: ApiKeyCreateInput = { name: input.name };
      return await accountService.client
        .post('v1/accounts/me/api-keys', { json: body })
        .json<ApiKeyCreateOutput>();
    } catch (error) {
      const apiError = await parseApiError(error);
      throw new MutationError(MutationErrorCode.ApiError, apiError.message);
    }
  }
}
