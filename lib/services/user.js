'use strict';

const { Service } = require('@hapipal/schmervice');
const Boom = require('@hapi/boom');
const Jwt = require('@hapi/jwt');


module.exports = class UserService extends Service {

    async create(user) {
        const { User } = this.server.models();
        const { mailService } = this.server.services();

        // Création de l'utilisateur
        const newUser = await User.query().insertAndFetch(user);

        // Envoi de l'e-mail de bienvenue
        await mailService.sendWelcomeEmail(newUser.email, newUser.firstName);

        return newUser;
    }

    findAll(){

        const { User } = this.server.models();

        return User.query();
    }

    delete(id){

        const { User } = this.server.models();

        return User.query().deleteById(id);
    }

    update(id, user){

        const { User } = this.server.models();

        return User.query().findById(id).patch(user);
    }

    async login(email, password) {

        const { User } = this.server.models();

        const user = await User.query().findOne({ email, password });

        if (!user) {
            throw Boom.unauthorized('Invalid credentials');
        }

        const token = Jwt.token.generate(
            {
                aud: 'urn:audience:iut',
                iss: 'urn:issuer:iut',
                firstName: user.firstName,
                lastName: user.lastName,
                email: user.email,
                scope: user.roles
            },
            {
                key: 'random_string',
                algorithm: 'HS512'
            },
            {
                ttlSec: 14400
            }
        );

        return token;
    }
    async setAdminAcess(id) {
        const { User } = this.server.models();
        const user = await User.query().findById(id);
        if (!user) {
            throw Boom.notFound("UTILISATEUR INTROUVABLE");
        }
        if (user.roles.includes('admin')) {
            throw Boom.badRequest("L'UTILISATEUR EST UN ADMINISTRATEUR");
        }
        await User.query()
            .findById(id)
            .patch({ roles: [...user.roles, 'admin'] });
        return { message: "L'utilisateur est maintenant administrateur" };
    }
}
