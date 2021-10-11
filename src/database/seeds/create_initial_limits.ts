import { Knex } from "knex";

export async function seed(knex: Knex) {
  const now = new Date();
  const reset = Date.now();
  // Deletes ALL existing entries
  await knex('rate_limit').del();
  return await knex('rate_limit').insert([
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
}
