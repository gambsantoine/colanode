import { eq, useLiveQuery } from '@tanstack/react-db';
import { X } from 'lucide-react';
import { useEffect, useId, useMemo, useState } from 'react';

import { LocalPageNode } from '@colanode/client/types';
import { normalizeTag } from '@colanode/core';
import { Badge } from '@colanode/ui/components/ui/badge';
import { useWorkspace } from '@colanode/ui/contexts/workspace';

interface PageHeaderProps {
  page: LocalPageNode;
  canEdit: boolean;
}

export const PageHeader = ({ page, canEdit }: PageHeaderProps) => {
  const workspace = useWorkspace();
  const suggestionsId = useId();

  const [title, setTitle] = useState(page.name);
  const [newTag, setNewTag] = useState('');

  useEffect(() => {
    setTitle(page.name);
  }, [page.name]);

  // Tags belong to the workspace: the ones already used in it are suggested.
  const pagesQuery = useLiveQuery(
    (q) =>
      q
        .from({ nodes: workspace.collections.nodes })
        .where(({ nodes }) => eq(nodes.type, 'page')),
    [workspace.userId]
  );

  const tags = useMemo(() => page.tags ?? [], [page.tags]);
  const suggestions = useMemo(() => {
    const used = new Set<string>();
    for (const node of pagesQuery.data) {
      if (node.type === 'page') {
        node.tags?.forEach((tag) => used.add(tag));
      }
    }

    return [...used].filter((tag) => !tags.includes(tag)).sort();
  }, [pagesQuery.data, tags]);

  const updatePage = (update: (draft: LocalPageNode) => void) => {
    const nodes = workspace.collections.nodes;
    if (!nodes.has(page.id)) {
      return;
    }

    nodes.update(page.id, (draft) => {
      if (draft.type === 'page') {
        update(draft);
      }
    });
  };

  const saveTitle = () => {
    const name = title.trim();
    if (!name) {
      setTitle(page.name);
      return;
    }

    if (name !== page.name) {
      updatePage((draft) => {
        draft.name = name;
      });
    }
  };

  const addTag = () => {
    const tag = normalizeTag(newTag);
    setNewTag('');
    if (tag && !tags.includes(tag)) {
      updatePage((draft) => {
        draft.tags = [...tags, tag];
      });
    }
  };

  const removeTag = (tag: string) => {
    updatePage((draft) => {
      draft.tags = tags.filter((value) => value !== tag);
    });
  };

  return (
    <div className="flex flex-col gap-2 pt-4 pb-2">
      <input
        value={title}
        readOnly={!canEdit}
        aria-label="Page title"
        placeholder="Untitled"
        onChange={(event) => setTitle(event.target.value)}
        onBlur={saveTitle}
        onKeyDown={(event) => {
          if (event.key === 'Enter') {
            event.currentTarget.blur();
          }
        }}
        className="w-full bg-transparent text-4xl font-bold outline-none placeholder:text-muted-foreground"
      />
      {(canEdit || tags.length > 0) && (
        <div className="flex flex-wrap items-center gap-1.5">
          {tags.map((tag) => (
            <Badge key={tag} variant="secondary">
              #{tag}
              {canEdit && (
                <button
                  type="button"
                  aria-label={`Remove ${tag}`}
                  className="cursor-pointer"
                  onClick={() => removeTag(tag)}
                >
                  <X className="size-3" />
                </button>
              )}
            </Badge>
          ))}
          {canEdit && (
            <>
              <input
                value={newTag}
                list={suggestionsId}
                aria-label="Add a tag"
                placeholder="Add a tag..."
                onChange={(event) => setNewTag(event.target.value)}
                onBlur={addTag}
                onKeyDown={(event) => {
                  if (event.key === 'Enter' || event.key === ',') {
                    event.preventDefault();
                    addTag();
                  }
                }}
                className="w-28 bg-transparent text-xs outline-none placeholder:text-muted-foreground"
              />
              <datalist id={suggestionsId}>
                {suggestions.map((tag) => (
                  <option key={tag} value={tag} />
                ))}
              </datalist>
            </>
          )}
        </div>
      )}
    </div>
  );
};
