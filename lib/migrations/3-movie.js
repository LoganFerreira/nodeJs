exports.up = function(knex) {
    return knex.schema.createTable('movie', function(table) {
        table.increments('id').primary();
        table.string('title').notNullable();
        table.text('description').notNullable();
        table.date('releaseDate').notNullable();
        table.string('director').notNullable();
        table.timestamp('createdAt').defaultTo(knex.fn.now());
        table.timestamp('updatedAt').defaultTo(knex.fn.now());
    });
};

exports.down = function(knex) {
    return knex.schema.dropTable('movie');
};
