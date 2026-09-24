import { useMutation } from '@tanstack/react-query';
import { toast } from 'sonner';

import { LocalCategoryNode } from '@colanode/client/types';
import { generateId, IdType } from '@colanode/core';
import {
  CategoryForm,
  CategoryFormValues,
} from '@colanode/ui/components/categories/category-form';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@colanode/ui/components/ui/dialog';
import { useWorkspace } from '@colanode/ui/contexts/workspace';

interface CategoryCreateDialogProps {
  spaceId: string;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export const CategoryCreateDialog = ({
  spaceId,
  open,
  onOpenChange,
}: CategoryCreateDialogProps) => {
  const workspace = useWorkspace();
  const { mutate } = useMutation({
    mutationFn: async (values: CategoryFormValues) => {
      const categoryId = generateId(IdType.Category);
      const nodes = workspace.collections.nodes;

      const category: LocalCategoryNode = {
        id: categoryId,
        type: 'category',
        name: values.name,
        parentId: spaceId,
        rootId: spaceId,
        createdAt: new Date().toISOString(),
        createdBy: workspace.userId,
        updatedAt: null,
        updatedBy: null,
        localRevision: '0',
        serverRevision: '0',
      };

      nodes.insert(category);
      return category;
    },
    onSuccess: () => {
      onOpenChange(false);
    },
    onError: (error) => {
      toast.error(error.message);
    },
  });

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Create category</DialogTitle>
          <DialogDescription>
            Group channels, pages and other items under a category
          </DialogDescription>
        </DialogHeader>
        <CategoryForm
          values={{
            name: '',
          }}
          submitText="Create"
          onCancel={() => {
            onOpenChange(false);
          }}
          onSubmit={(values) => {
            mutate(values);
          }}
        />
      </DialogContent>
    </Dialog>
  );
};
