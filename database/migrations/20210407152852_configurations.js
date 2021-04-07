
exports.up = function(knex) {
  return knex.schema.createTable('configurations', (table) => {
    table.increments('id')
        .primary();

    table.string('name', 50)
        .notNullable()
        .unique();

    table.text('value')
        .notNullable();

    table.boolean('status')
        .notNullable()
        .defaultTo(false);

    table.timestamps();
  });
};

exports.down = function(knex) {
  return knex.schema.dropTable('configurations');
};
