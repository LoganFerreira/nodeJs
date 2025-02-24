'use strict';

const Joi = require('joi');
const { Model } = require('@hapipal/schwifty');

class Movie extends Model {
    static get tableName() {
        return 'movie';
    }

    static get joiSchema() {
        return Joi.object({
            movieId: Joi.number().integer().greater(0),
            title: Joi.string().required().min(2).example('Film modifié'),
            description: Joi.string().required().min(10).example('Description du film modifié'),
            releaseDate: Joi.date().required().example('2025-05-05'),
            director: Joi.string().required().example('Auteur du film modifié'),
            createdAt: Joi.date(),
            updatedAt: Joi.date()
        });
    }

    $beforeInsert() {
        this.createdAt = new Date();
        this.updatedAt = this.createdAt;
    }

    $beforeUpdate() {
        this.updatedAt = new Date();
    }
}

module.exports = Movie;