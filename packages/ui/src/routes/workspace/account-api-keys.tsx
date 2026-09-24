import { createRoute, redirect } from '@tanstack/react-router';

import { AccountApiKeysContainer } from '@colanode/ui/components/accounts/account-api-keys-container';
import { AccountApiKeysTab } from '@colanode/ui/components/accounts/account-api-keys-tab';
import { getWorkspaceUserId } from '@colanode/ui/routes/utils';
import {
  workspaceRoute,
  workspaceMaskRoute,
} from '@colanode/ui/routes/workspace';

export const accountApiKeysRoute = createRoute({
  getParentRoute: () => workspaceRoute,
  path: '/account/api-keys',
  component: AccountApiKeysContainer,
  context: () => {
    return {
      tab: <AccountApiKeysTab />,
    };
  },
});

export const accountApiKeysMaskRoute = createRoute({
  getParentRoute: () => workspaceMaskRoute,
  path: '/account/api-keys',
  component: () => null,
  beforeLoad: (ctx) => {
    const userId = getWorkspaceUserId(ctx.params.workspaceId);
    if (userId) {
      throw redirect({
        to: '/workspace/$userId/account/api-keys',
        params: { userId },
        replace: true,
      });
    }
  },
});
