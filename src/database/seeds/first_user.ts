import { Knex } from 'knex';
import { hashSync } from 'bcrypt';

export async function seed(knex: Knex) {
  const now = new Date();
  const saltRounds = Number(process.env.SALT_ROUNDS) || 12;
  const password = hashSync('initialPassword', saltRounds);
  // Deletes ALL existing entries
  await knex('users').del();
  return await knex('users').insert([
    {
      id: 1,
      username: 'admin',
      password: password,
      is_active: true,
      has_mfa: false,
      secret_mfa: null,
      created_at: now,
      updated_at: now,
    },
  ]);
}
