exports.up = function(knex) {
  return knex.schema.createTable('blocklist', (table) => {
    table.increments('id')
        .primary();

    table.string('screen_name')
        .notNullable()
        .unique();

    table.boolean('is_blocked_now')
        .notNullable()
        .defaultTo(true);

    table.timestamps();
  });
};

exports.down = function(knex) {
  return knex.schema.dropTable('blocklist');
};
