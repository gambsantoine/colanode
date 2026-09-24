import { LocalSpaceNode } from '@colanode/client/types';
import { Avatar } from '@colanode/ui/components/avatars/avatar';
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from '@colanode/ui/components/ui/tooltip';
import { cn } from '@colanode/ui/lib/utils';

interface SidebarSpaceIconProps {
  space: LocalSpaceNode;
  isActive: boolean;
  onClick: () => void;
}

export const SidebarSpaceIcon = ({
  space,
  isActive,
  onClick,
}: SidebarSpaceIconProps) => {
  return (
    <Tooltip>
      <TooltipTrigger asChild>
        <div
          className="group w-10 h-10 flex items-center justify-center cursor-pointer relative shrink-0"
          onClick={onClick}
        >
          <div
            className={cn(
              'absolute -left-2 h-2 w-1 rounded-r-full bg-foreground transition-all duration-150',
              isActive ? 'h-5 opacity-100' : 'h-2 opacity-0 group-hover:opacity-60'
            )}
          />
          <Avatar
            id={space.id}
            avatar={space.avatar}
            name={space.name}
            className={cn(
              'size-10 rounded-full transition-[border-radius] duration-150',
              !isActive && 'rounded-2xl'
            )}
          />
        </div>
      </TooltipTrigger>
      <TooltipContent side="right">{space.name}</TooltipContent>
    </Tooltip>
  );
};
