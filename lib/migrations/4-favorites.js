exports.up = function(knex) {
    return knex.schema.createTable('favorites', function(table) {
        table.increments('id').primary();
        table.integer('userId').unsigned().notNullable();
        table.integer('movieId').unsigned().notNullable();
        table.timestamp('createdAt').defaultTo(knex.fn.now());
        table.foreign('userId').references('id').inTable('user').onDelete('CASCADE');
        table.foreign('movieId').references('id').inTable('movie').onDelete('CASCADE');
        table.unique(['userId', 'movieId']);
    });
};

exports.down = function(knex) {
    return knex.schema.dropTable('favorites');
};
