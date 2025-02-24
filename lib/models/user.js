'use strict';

const Joi = require('joi');
const { Model } = require('@hapipal/schwifty');

class User extends Model {
    static get tableName() {
        return 'user';
    }

    static get joiSchema() {
        return Joi.object({
            id: Joi.number().integer().greater(0),
            firstName: Joi.string().min(3).example('John').description('Prénom de l utilisateur'),
            lastName: Joi.string().min(3).example('Doe').description('Nom de l utilisateur'),
            email: Joi.string().email(),
            password: Joi.string(),
            username: Joi.string(),
            roles: Joi.array().items(Joi.string()).default(['user']),
            createdAt: Joi.date(),
            updatedAt: Joi.date()
        });
    }

    $beforeInsert() {
        this.updatedAt = new Date();
        this.createdAt = this.updatedAt;
    }

    $beforeUpdate() {
    }

    static get jsonAttributes() {
        return ['roles'];
    }
}

module.exports = User;