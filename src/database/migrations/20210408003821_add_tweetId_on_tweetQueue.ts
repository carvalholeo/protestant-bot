import { Knex } from "knex";

export function up(knex: Knex) {
  return knex.schema.table('tweet_queue', (table) => {
    table.string('tweet_id', 50)
        .nullable()
        .defaultTo(null)
        .unique()
        .after('id');
  });
}

export function down(knex: Knex) {
  return knex.schema.table('tweet_queue', (table) => {
    table.dropColumns('tweet_id');
  });
}
