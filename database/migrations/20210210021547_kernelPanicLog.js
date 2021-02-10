'use strict';

exports.up = function (knex) {
  return knex.schema.createTable('kernel_panic_log', table => {
    table.increments('id')
      .primary();

    table.timestamps();
  });
};

exports.down = function (knex) {
  return knex.schema.dropTable('kernel_panic_log');
};
