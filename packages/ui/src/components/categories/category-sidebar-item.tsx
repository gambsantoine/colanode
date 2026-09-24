import { eq, useLiveQuery } from '@tanstack/react-db';
import { ChevronRight } from 'lucide-react';
import { useState } from 'react';

import { LocalCategoryNode, LocalNode } from '@colanode/client/types';
import { NodeRole } from '@colanode/core';
import { CategorySidebarDropdown } from '@colanode/ui/components/categories/category-sidebar-dropdown';
import { SidebarItem } from '@colanode/ui/components/layouts/sidebars/sidebar-item';
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from '@colanode/ui/components/ui/collapsible';
import { useWorkspace } from '@colanode/ui/contexts/workspace';
import { cn } from '@colanode/ui/lib/utils';

interface CategorySidebarItemProps {
  category: LocalCategoryNode;
  role: NodeRole | null;
}

export const CategorySidebarItem = ({
  category,
  role,
}: CategorySidebarItemProps) => {
  const workspace = useWorkspace();
  const [open, setOpen] = useState(true);

  const childrenQuery = useLiveQuery(
    (q) =>
      q
        .from({ nodes: workspace.collections.nodes })
        .where(({ nodes }) => eq(nodes.parentId, category.id))
        .orderBy(({ nodes }) => nodes.id, 'asc'),
    [workspace.userId, category.id]
  );

  const children = (childrenQuery.data ?? []) as LocalNode[];

  return (
    <Collapsible
      open={open}
      onOpenChange={setOpen}
      className="group/category-item w-full"
    >
      <div
        className={cn(
          'group/category-row flex h-6 min-w-0 items-center gap-1 rounded-md px-2 text-xs font-semibold uppercase tracking-wide text-muted-foreground hover:text-sidebar-foreground cursor-pointer select-none'
        )}
      >
        <CollapsibleTrigger asChild>
          <button
            className="flex flex-1 min-w-0 items-center gap-1 cursor-pointer"
            onClick={() => setOpen((value) => !value)}
          >
            <ChevronRight
              className={cn(
                'size-3 shrink-0 transition-transform duration-200',
                open && 'rotate-90'
              )}
            />
            <span className="line-clamp-1 text-left">{category.name}</span>
          </button>
        </CollapsibleTrigger>
        <CategorySidebarDropdown category={category} />
      </div>
      <CollapsibleContent>
        <ul className="flex min-w-0 flex-col gap-0.5 py-0.5">
          {children.map((child) => (
            <li key={child.id}>
              <SidebarItem node={child} role={role} />
            </li>
          ))}
        </ul>
      </CollapsibleContent>
    </Collapsible>
  );
};
