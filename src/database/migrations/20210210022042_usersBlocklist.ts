import { Knex } from "knex";

export function up(knex: Knex) {
  return knex.schema.createTable('blocklist', (table) => {
    table.increments('id')
        .primary();

    table.string('screen_name')
        .notNullable()
        .unique();

    table.boolean('is_blocked_now')
        .notNullable()
        .defaultTo(true);

    table.timestamps();
  });
}

export function down(knex: Knex) {
  return knex.schema.dropTable('blocklist');
}
