// @ts-check

exports.up = function(knex) {
  return knex.schema.createTable('users', (table) => {
    table.increments('id')
        .primary();

    table.string('username', 30)
        .notNullable()
        .unique();

    table.string('password')
        .notNullable();

    table.boolean('is_active')
        .notNullable();

    table.boolean('has_mfa')
        .nullable()
        .defaultTo(false);

    table.string('secret_mfa')
        .nullable()
        .defaultTo(null);

    table.timestamps();
  });
};

exports.down = function(knex) {
  return knex.schema.dropTable('users');
};
