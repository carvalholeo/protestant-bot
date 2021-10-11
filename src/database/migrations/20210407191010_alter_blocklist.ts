import { Knex } from "knex";

export function up(knex: Knex) {
  return knex.schema.table('blocklist', (table) => {
    table.boolean('blocked_by_admin')
        .nullable()
        .defaultTo(false)
        .after('is_blocked_now');

    table.string('comment')
        .nullable()
        .defaultTo('Sem razão específica')
        .after('blocked_by_admin');
  });
}

export function down(knex: Knex) {
  return knex.schema.table('blocklist', (table) => {
    table.dropColumns('blocked_by_admin', 'comment');
  });
}
