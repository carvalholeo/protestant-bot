import { Knex } from "knex";

export function up(knex: Knex) {
  return knex.schema.createTable('menu', (table) => {
    table.increments('id')
        .primary();

    table.string('page_name', 50)
        .notNullable()
        .unique();

    table.string('path', 50)
        .notNullable()
        .unique();

    table.integer('page_father', 50)
        .unsigned()
        .nullable()
        .defaultTo(null);

    table.boolean('status')
        .notNullable()
        .defaultTo(false);

    table.timestamps();

    table.foreign('page_father')
        .references('id')
        .inTable('menu')
        .onDelete('RESTRICT')
        .onUpdate('CASCADE');
  });
}

export function down(knex: Knex) {
  return knex.schema.dropTable('menu');
}
