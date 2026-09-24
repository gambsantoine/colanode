import { Check, ChevronDown, Copy } from 'lucide-react';
import { useState } from 'react';
import { toast } from 'sonner';

import { Workspace } from '@colanode/client/types';
import { Button } from '@colanode/ui/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@colanode/ui/components/ui/dialog';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@colanode/ui/components/ui/dropdown-menu';
import { Field, FieldLabel } from '@colanode/ui/components/ui/field';
import { Input } from '@colanode/ui/components/ui/input';
import { Spinner } from '@colanode/ui/components/ui/spinner';
import { useMutation } from '@colanode/ui/hooks/use-mutation';

interface ApiKeyCreateDialogProps {
  accountId: string;
  workspaces: Workspace[];
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onCreated: () => void;
}

type ScopeOption = { label: string; workspace: Workspace | null };

export const ApiKeyCreateDialog = ({
  accountId,
  workspaces,
  open,
  onOpenChange,
  onCreated,
}: ApiKeyCreateDialogProps) => {
  const { mutate, isPending } = useMutation();
  const [name, setName] = useState('');
  const [scope, setScope] = useState<ScopeOption>({
    label: 'Global (all workspaces)',
    workspace: null,
  });
  const [createdToken, setCreatedToken] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);

  const reset = () => {
    setName('');
    setScope({ label: 'Global (all workspaces)', workspace: null });
    setCreatedToken(null);
    setCopied(false);
  };

  const handleOpenChange = (value: boolean) => {
    if (!value) {
      reset();
      if (createdToken) {
        onCreated();
      }
    }
    onOpenChange(value);
  };

  const handleSubmit = () => {
    if (isPending || !name.trim()) {
      return;
    }

    if (scope.workspace) {
      mutate({
        input: {
          type: 'api.key.create.workspace',
          userId: scope.workspace.userId,
          name: name.trim(),
        },
        onSuccess(output) {
          setCreatedToken(output.token);
        },
        onError(error) {
          toast.error(error.message);
        },
      });
    } else {
      mutate({
        input: {
          type: 'api.key.create',
          accountId,
          name: name.trim(),
        },
        onSuccess(output) {
          setCreatedToken(output.token);
        },
        onError(error) {
          toast.error(error.message);
        },
      });
    }
  };

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogContent>
        {createdToken ? (
          <>
            <DialogHeader>
              <DialogTitle>Api key created</DialogTitle>
              <DialogDescription>
                Copy this key now — you won&apos;t be able to see it again.
              </DialogDescription>
            </DialogHeader>
            <div className="flex items-center gap-2 rounded-md border bg-muted p-2 font-mono text-sm break-all">
              <span className="flex-1">{createdToken}</span>
              <Button
                type="button"
                variant="outline"
                size="icon"
                className="shrink-0"
                onClick={() => {
                  navigator.clipboard.writeText(createdToken).then(() => {
                    setCopied(true);
                  });
                }}
              >
                {copied ? (
                  <Check className="size-4" />
                ) : (
                  <Copy className="size-4" />
                )}
              </Button>
            </div>
            <DialogFooter>
              <Button type="button" onClick={() => handleOpenChange(false)}>
                Done
              </Button>
            </DialogFooter>
          </>
        ) : (
          <>
            <DialogHeader>
              <DialogTitle>Create api key</DialogTitle>
              <DialogDescription>
                Create a new api key to authenticate requests to the
                Colanode api.
              </DialogDescription>
            </DialogHeader>
            <Field>
              <FieldLabel htmlFor="api-key-name">Name</FieldLabel>
              <Input
                id="api-key-name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="e.g. My script"
              />
            </Field>
            <Field>
              <FieldLabel>Scope</FieldLabel>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button
                    type="button"
                    variant="outline"
                    className="justify-between"
                  >
                    {scope.label}
                    <ChevronDown className="size-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent className="w-64">
                  <DropdownMenuItem
                    onSelect={() =>
                      setScope({
                        label: 'Global (all workspaces)',
                        workspace: null,
                      })
                    }
                  >
                    Global (all workspaces)
                  </DropdownMenuItem>
                  {workspaces.map((workspace) => (
                    <DropdownMenuItem
                      key={workspace.workspaceId}
                      onSelect={() =>
                        setScope({ label: workspace.name, workspace })
                      }
                    >
                      {workspace.name}
                    </DropdownMenuItem>
                  ))}
                </DropdownMenuContent>
              </DropdownMenu>
            </Field>
            <DialogFooter>
              <Button
                type="button"
                variant="outline"
                onClick={() => handleOpenChange(false)}
              >
                Cancel
              </Button>
              <Button
                type="button"
                disabled={isPending || !name.trim()}
                onClick={handleSubmit}
              >
                {isPending && <Spinner className="mr-1" />}
                Create
              </Button>
            </DialogFooter>
          </>
        )}
      </DialogContent>
    </Dialog>
  );
};
