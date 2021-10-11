import { Knex } from "knex";

export function up(knex: Knex) {
  return knex.schema.createTable('page', (table) => {
    table.increments('id')
        .primary();

    table.timestamps();
  });
}

export function down(knex: Knex) {
  return knex.schema.dropTable('page');
}
