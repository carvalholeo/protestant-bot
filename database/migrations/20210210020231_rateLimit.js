'use strict';

exports.up = function (knex) {
  return knex.schema.createTable('rate_limit', table => {
    table.increments('id')
      .primary();

    table.integer('limit')
      .notNullable()
      .defaultTo(0);

    table.string('resource', 100)
      .notNullable()
      .defaultTo('statuses/retweet');

    table.timestamps();
  });
};

exports.down = function (knex) {
  return knex.schema.dropTable('rate_limit');
};
