'use strict';

exports.up = function(knex) {
  return knex.schema.createTable('error_log', (table) => {
    table.increments('id')
        .primary();

    table.text('message')
        .notNullable();

    table.timestamps();
  });
};

exports.down = function(knex) {
  return knex.schema.dropTable('error_log');
};
