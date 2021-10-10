
exports.up = function(knex) {
  return knex.schema.table('retweet_log', (table) => {
    table.string('tweet_id', 50)
        .nullable()
        .defaultTo(null)
        .unique()
        .after('id');

    table.string('screen_name', 16)
        .nullable()
        .defaultTo(null)
        .after('tweet_id');

    table.text('tweet')
        .nullable()
        .defaultTo(null)
        .after('screen_name');

    table.string('comment')
        .nullable()
        .defaultTo('Sem razão específica')
        .after('tweet');

    table.boolean('was_undone')
        .nullable()
        .defaultTo(false)
        .after('comment');
  });
};

exports.down = function(knex) {
  return knex.schema.table('retweet_log', (table) => {
    table.dropColumns('tweet_id',
        'screen_name',
        'tweet',
        'comment',
        'was_undone');
  });
};
