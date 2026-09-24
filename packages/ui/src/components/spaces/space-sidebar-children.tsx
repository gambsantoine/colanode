import { eq, useLiveQuery } from '@tanstack/react-db';

import { LocalSpaceNode } from '@colanode/client/types';
import { NodeRole } from '@colanode/core';
import { SidebarItem } from '@colanode/ui/components/layouts/sidebars/sidebar-item';
import { useWorkspace } from '@colanode/ui/contexts/workspace';
import { sortSpaceChildren } from '@colanode/ui/lib/spaces';

interface SpaceSidebarChildrenProps {
  space: LocalSpaceNode;
  role: NodeRole | null;
}

export const SpaceSidebarChildren = ({
  space,
  role,
}: SpaceSidebarChildrenProps) => {
  const workspace = useWorkspace();

  const nodeChildrenGetQuery = useLiveQuery(
    (q) =>
      q
        .from({ nodes: workspace.collections.nodes })
        .where(({ nodes }) => eq(nodes.parentId, space.id)),
    [workspace.userId, space.id]
  );

  const children = sortSpaceChildren(space, nodeChildrenGetQuery.data);

  return (
    <ul className="flex min-w-0 flex-col gap-0.5 py-0.5">
      {children.map((child) => (
        <li key={child.id}>
          <SidebarItem node={child} role={role} />
        </li>
      ))}
    </ul>
  );
};
