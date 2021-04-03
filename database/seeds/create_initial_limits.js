
exports.seed = function(knex) {
  const now = new Date();
  const reset = Date.now();
  // Deletes ALL existing entries
  return knex('rate_limit').del()
      .then(function() {
      // Inserts seed entries
        return knex('rate_limit').insert([
          {
            id: 1,
            limit: 75,
            resource: 'statuses/retweet',
            next_reset: reset,
            created_at: now,
            updated_at: now,
          },
          {
            id: 2,
            limit: 1000,
            resource: 'favorites/create',
            next_reset: reset,
            created_at: now,
            updated_at: now,
          },
        ]);
      });
};
