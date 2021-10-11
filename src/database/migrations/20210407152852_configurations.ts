import { Knex } from "knex";

export function up(knex: Knex) {
  return knex.schema.createTable('configurations', (table) => {
    table.increments('id')
        .primary();

    table.string('name', 50)
        .notNullable()
        .unique();

    table.text('value')
        .notNullable();

    table.boolean('status')
        .notNullable()
        .defaultTo(false);

    table.timestamps();
  });
}

export function down(knex: Knex) {
  return knex.schema.dropTable('configurations');
}
