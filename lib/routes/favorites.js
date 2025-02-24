'use strict';

const Joi = require('joi');

const routes = [
    {
        method: 'POST',
        path: '/favorites',
        options: {
            tags: ['api'],
            auth: { mode: 'required' },
            validate: {
                payload: Joi.object({
                    userId: Joi.number().integer().required().min(1).description('id de l utilisateur '),
                    movieId: Joi.number().integer().required().min(1).description('id du film')
                })
            }
        },
        handler: async (request, h) => {
            try {
                const { favoritesService } = request.services();
                const { userId, movieId } = request.payload;

                await favoritesService.addFavorites(userId, movieId);
                return h.response({ message: 'Film ajouté aux favoris' }).code(201);
            } catch (error) {
                console.error('IMPOSSIBLE d AJOUTER LE FILM EN FAVORIS', error);
                return h.response({ error: 'IMPOSSIBLE d AJOUTER LE FILM EN FAVORIS' }).code(500);
            }
        }
    },
    {
        method: 'DELETE',
        path: '/favorites/{movieId}',
        options: {
            tags: ['api'],
            auth: { mode: 'required' },
            validate: {
                params: Joi.object({
                    movieId: Joi.number().integer().required().min(1).description('id du film')
                }),
                payload: Joi.object({
                    userId: Joi.number().integer().required().min(1).description('id de l utilisateur ')
                })
            }
        },
        handler: async (request, h) => {
            try {
                const { favoritesService } = request.services();
                const { userId } = request.payload;
                const { movieId } = request.params;

                await favoritesService.removeFavorites(userId, movieId);
                return h.response({ message: 'Film retiré des favoris' }).code(200);
            } catch (error) {
                console.error('IMPOSSIBLE DE RETIRER LE FILM DES FAVORIS', error);
                return h.response({ error: 'IMPOSSIBLE DE RETIRER LE FILM DES FAVORIS' }).code(500);
            }
        }
    }
];

module.exports = routes;