import { Migration } from 'kysely';

export const createApiKeysTable: Migration = {
  up: async (db) => {
    await db.schema
      .createTable('api_keys')
      .addColumn('id', 'varchar(30)', (col) => col.notNull().primaryKey())
      .addColumn('account_id', 'varchar(30)', (col) => col.notNull())
      .addColumn('workspace_id', 'varchar(30)')
      .addColumn('name', 'varchar(200)', (col) => col.notNull())
      .addColumn('token_hash', 'varchar(100)', (col) => col.notNull())
      .addColumn('token_salt', 'varchar(100)', (col) => col.notNull())
      .addColumn('created_at', 'timestamptz', (col) => col.notNull())
      .addColumn('last_used_at', 'timestamptz')
      .addColumn('revoked_at', 'timestamptz')
      .addColumn('revoked_by', 'varchar(30)')
      .execute();

    await db.schema
      .createIndex('api_keys_account_id_idx')
      .on('api_keys')
      .column('account_id')
      .execute();

    await db.schema
      .createIndex('api_keys_workspace_id_idx')
      .on('api_keys')
      .column('workspace_id')
      .execute();
  },
  down: async (db) => {
    await db.schema.dropIndex('api_keys_workspace_id_idx').execute();
    await db.schema.dropIndex('api_keys_account_id_idx').execute();
    await db.schema.dropTable('api_keys').execute();
  },
};
