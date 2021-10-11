import { Knex } from "knex";

export function up(knex: Knex) {
  return knex.schema.createTable('retweet_log', (table) => {
    table.increments('id')
        .primary();

    table.text('message')
        .notNullable();

    table.timestamps();
  });
}

export function down(knex: Knex) {
  return knex.schema.dropTable('retweet_log');
}
