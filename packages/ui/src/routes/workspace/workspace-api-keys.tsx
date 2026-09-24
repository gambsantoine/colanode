import { createRoute, redirect } from '@tanstack/react-router';

import { WorkspaceApiKeysContainer } from '@colanode/ui/components/workspaces/workspace-api-keys-container';
import { WorkspaceApiKeysTab } from '@colanode/ui/components/workspaces/workspace-api-keys-tab';
import { getWorkspaceUserId } from '@colanode/ui/routes/utils';
import {
  workspaceRoute,
  workspaceMaskRoute,
} from '@colanode/ui/routes/workspace';

export const workspaceApiKeysRoute = createRoute({
  getParentRoute: () => workspaceRoute,
  path: '/api-keys',
  component: WorkspaceApiKeysContainer,
  context: () => {
    return {
      tab: <WorkspaceApiKeysTab />,
    };
  },
});

export const workspaceApiKeysMaskRoute = createRoute({
  getParentRoute: () => workspaceMaskRoute,
  path: '/api-keys',
  component: () => null,
  beforeLoad: (ctx) => {
    const userId = getWorkspaceUserId(ctx.params.workspaceId);
    if (userId) {
      throw redirect({
        to: '/workspace/$userId/api-keys',
        params: { userId },
        replace: true,
      });
    }
  },
});
