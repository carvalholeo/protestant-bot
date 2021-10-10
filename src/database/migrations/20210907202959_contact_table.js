// @ts-check

exports.up = function(knex) {
  return knex.schema.createTable('contact', (table) => {
    table.increments('id')
        .primary();

    table.string('name', 50)
        .nullable();

    table.string('email', 100)
        .nullable();

    table.string('twitter', 30)
        .nullable();

    table.text('message')
        .notNullable();

    table.timestamps();
  });
};

exports.down = function(knex) {
  return knex.schema.dropTable('contact');
};
