
exports.up = function(knex) {
  return knex.schema.createTable('configuration', (table) => {
    table.increments('id')
        .primary();

    table.string('key', 30)
        .notNullable()
        .unique();

    table.text('value')
        .notNullable();

    table.timestamps();
  });
};

exports.down = function(knex) {
  return knex.schema.dropTable('configuration');
};
