import { Knex } from "knex";

export function up(knex: Knex) {
  return knex.schema.createTable('configuration', (table) => {
    table.increments('id')
        .primary();

    table.string('key', 30)
        .notNullable()
        .unique();

    table.text('value')
        .notNullable();

    table.timestamps();
  });
}

export function down(knex: Knex) {
  return knex.schema.dropTable('configuration');
}
