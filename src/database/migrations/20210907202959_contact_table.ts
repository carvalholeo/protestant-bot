import { Knex } from "knex";

export function up(knex: Knex) {
  return knex.schema.createTable('contact', (table) => {
    table.increments('id')
        .primary();

    table.string('name', 50)
        .nullable();

    table.string('email', 100)
        .nullable();

    table.string('twitter', 30)
        .nullable();

    table.text('message')
        .notNullable();

    table.timestamps();
  });
}

export function down(knex: Knex) {
  return knex.schema.dropTable('contact');
}
