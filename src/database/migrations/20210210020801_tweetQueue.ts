import { Knex } from "knex";

export function up(knex: Knex) {
  return knex.schema.createTable('tweet_queue', (table) => {
    table.increments('id')
        .primary();

    table.json('tweet')
        .notNullable();

    table.boolean('already_retweeted')
        .notNullable()
        .defaultTo(false);

    table.timestamps();
  });
}

export function down(knex: Knex) {
  return knex.schema.dropTable('tweet_queue');
}
