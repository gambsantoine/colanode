export const MAX_TAG_LENGTH = 40;

// Tags are compared as typed in a search (`#my-tag`): lowercase, without
// spaces. Returns null when nothing usable is left.
export const normalizeTag = (value: string): string | null => {
  const tag = value
    .trim()
    .replace(/^#+/, '')
    .toLowerCase()
    .replace(/\s+/g, '-')
    .slice(0, MAX_TAG_LENGTH);

  return tag.length > 0 ? tag : null;
};
