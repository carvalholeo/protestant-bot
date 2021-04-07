
exports.up = function(knex) {
  return knex.schema.createTable('page', (table) => {
    table.increments('id')
        .primary();

    table.timestamps();
  });
};

exports.down = function(knex) {
  return knex.schema.dropTable('page');
};
