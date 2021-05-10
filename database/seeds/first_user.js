// @ts-check

const bcrypt = require('bcrypt');
exports.seed = function(knex) {
  const now = new Date();
  const saltRounds = process.env.SALT_ROUNDS ?? 12;
  const password = bcrypt.hashSync('initialPassword', saltRounds);
  // Deletes ALL existing entries
  return knex('users').del()
      .then(function() {
        // Inserts seed entries
        return knex('users').insert([
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
      });
};
