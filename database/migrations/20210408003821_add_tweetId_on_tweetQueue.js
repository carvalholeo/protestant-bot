
exports.up = function(knex) {
  return knex.schema.table('tweet_queue', (table) => {
    table.string('tweet_id', 50)
        .nullable()
        .defaultTo(null)
        .unique()
        .after('id');
  });
};

exports.down = function(knex) {
  return knex.schema.table('tweet_queue', (table) => {
    table.dropColumns('tweet_id');
  });
};
