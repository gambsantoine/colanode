import { z } from 'zod/v4';

export const apiKeyCreateInputSchema = z.object({
  name: z.string().min(1).max(200),
});

export type ApiKeyCreateInput = z.infer<typeof apiKeyCreateInputSchema>;

export const apiKeyOutputSchema = z.object({
  id: z.string(),
  name: z.string(),
  workspaceId: z.string().nullable(),
  createdAt: z.string(),
  lastUsedAt: z.string().nullable(),
  revokedAt: z.string().nullable(),
});

export type ApiKeyOutput = z.infer<typeof apiKeyOutputSchema>;

export const apiKeyCreateOutputSchema = apiKeyOutputSchema.extend({
  token: z.string(),
});

export type ApiKeyCreateOutput = z.infer<typeof apiKeyCreateOutputSchema>;

export const apiKeyListOutputSchema = z.object({
  apiKeys: z.array(apiKeyOutputSchema),
});

export type ApiKeyListOutput = z.infer<typeof apiKeyListOutputSchema>;

export const apiKeyCreatorSchema = z.object({
  id: z.string(),
  name: z.string(),
  email: z.email(),
});

export type ApiKeyCreator = z.infer<typeof apiKeyCreatorSchema>;

export const apiKeyAuditOutputSchema = apiKeyOutputSchema.extend({
  creator: apiKeyCreatorSchema,
});

export type ApiKeyAuditOutput = z.infer<typeof apiKeyAuditOutputSchema>;

export const apiKeyAuditListOutputSchema = z.object({
  apiKeys: z.array(apiKeyAuditOutputSchema),
});

export type ApiKeyAuditListOutput = z.infer<typeof apiKeyAuditListOutputSchema>;
