import { Knex } from "knex";

export function up(knex: Knex) {
  return knex.schema.createTable('rate_limit', (table) => {
    table.increments('id')
      .primary();

    table.integer('limit')
      .notNullable()
      .defaultTo(0);

    table.string('resource', 100)
      .notNullable()
      .defaultTo('statuses/retweet');

    table.bigInteger('next_reset')
      .notNullable()
      .defaultTo(15);

    table.timestamps();
  });
}

export function down(knex: Knex) {
  return knex.schema.dropTable('rate_limit');
}
