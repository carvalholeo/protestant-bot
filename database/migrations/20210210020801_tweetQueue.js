'use strict';

exports.up = function (knex) {
  return knex.schema.createTable('tweet_queue', table => {
    table.increments('id')
      .primary();

    table.json('tweet')
      .notNullable()
      .unique();

    table.boolean('already_retweeted')
      .notNullable()
      .defautlTo(false);

    table.timestamps();
  })
};

exports.down = function (knex) {
  return knex.schema.dropTable('tweet_queue');
};
