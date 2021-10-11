import { Knex } from "knex";

export function up(knex: Knex) {
  return knex.schema.createTable('access_log', (table) => {
    table.increments('id')
        .primary();

    table.text('message')
        .notNullable();

    table.timestamps();
  });
}

export function down(knex: Knex) {
  return knex.schema.dropTable('access_log');
}
