// @ts-check

const bcrypt = require('bcrypt');
exports.seed = function(knex) {
  const now = new Date();
  const password = bcrypt.hashSync('initialPassword', 12);
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
