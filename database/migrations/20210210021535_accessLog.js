'use strict';

exports.up = function (knex) {
  return knex.schema.createTable('access_log', table => {
    table.increments('id')
      .primary();

    table.timestamps();
  });
};

exports.down = function (knex) {
  return knex.schema.dropTable('access_log');
};
