import { WorkspaceQueryHandlerBase } from '@colanode/client/handlers/queries/workspace-query-handler-base';
import { ChangeCheckResult, QueryHandler } from '@colanode/client/lib';
import { mapNode } from '@colanode/client/lib/mappers';
import {
  buildSearchMatchQuery,
  listTaggedPages,
  matchesTagFilters,
  parseSearchQuery,
  searchWorkspaceTexts,
} from '@colanode/client/lib/search';
import {
  WorkspaceSearchQueryInput,
  WorkspaceSearchResult,
} from '@colanode/client/queries/search/workspace-search';
import { Event } from '@colanode/client/types/events';

const DEFAULT_LIMIT = 50;
// Tag filters apply after the text search: it must return enough candidates.
const TAG_FILTER_CANDIDATES = 1000;

export class WorkspaceSearchQueryHandler
  extends WorkspaceQueryHandlerBase
  implements QueryHandler<WorkspaceSearchQueryInput>
{
  public async handleQuery(
    input: WorkspaceSearchQueryInput
  ): Promise<WorkspaceSearchResult[]> {
    const { text, tags } = parseSearchQuery(input.searchQuery);
    const matchQuery = buildSearchMatchQuery(text);
    if (!matchQuery && tags.length === 0) {
      return [];
    }

    const workspace = this.getWorkspace(input.userId);
    const limit = input.limit ?? DEFAULT_LIMIT;

    if (!matchQuery) {
      const rows = await listTaggedPages(workspace.database);
      return this.filterByTags(
        rows.map((row) => ({ node: mapNode(row), snippet: null })),
        tags
      ).slice(0, limit);
    }

    const rows = await searchWorkspaceTexts(
      workspace.database,
      matchQuery,
      tags.length > 0 ? TAG_FILTER_CANDIDATES : limit
    );

    return this.filterByTags(
      rows.map((row) => ({ node: mapNode(row), snippet: row.snippet })),
      tags
    ).slice(0, limit);
  }

  private filterByTags(
    results: WorkspaceSearchResult[],
    tags: string[]
  ): WorkspaceSearchResult[] {
    if (tags.length === 0) {
      return results;
    }

    return results.filter(
      ({ node }) => node.type === 'page' && matchesTagFilters(node.tags, tags)
    );
  }

  public async checkForChanges(
    event: Event,
    input: WorkspaceSearchQueryInput,
    _: WorkspaceSearchResult[]
  ): Promise<ChangeCheckResult<WorkspaceSearchQueryInput>> {
    if (
      event.type === 'workspace.deleted' &&
      event.workspace.userId === input.userId
    ) {
      return {
        hasChanges: true,
        result: [],
      };
    }

    return {
      hasChanges: false,
    };
  }
}
