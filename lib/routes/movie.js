'use strict';

const Joi = require('joi');
const MessageBroker = require('../services/messageBroker');

const routes = [
    {
        method: 'POST',
        path: '/movie',
        options: {
            tags: ['api'],
            auth: {scope: ['admin']},
            validate: {
                payload: Joi.object({
                    title: Joi.string().required().example('Film').description("Titre"),
                    description: Joi.string().required().example("Description du film").description("Description"),
                    releaseDate: Joi.date().required().example('2025-05-05').description("Date de sortie"),
                    director: Joi.string().required().example("Auteur du film").description("Auteur")
                })
            }
        },
        handler: async (request, h) => {
            const { movieService } = request.services();
            return await movieService.create(request.payload);
        }
    },
    {
        method: 'PATCH',
        path: '/movie/{id}',
        options: {
            tags: ['api'],
            validate: {
                params: Joi.object({
                    id: Joi.number().integer().required().min(1).description("id du film")
                }),
                payload: Joi.object({
                    title: Joi.string().min(2).example('Film modifié').description("Titre"),
                    description: Joi.string().example("Description du film moddifié").description("Description"),
                    releaseDate: Joi.date().iso().example('2025-05-05').description("Date de sortie"),
                    director: Joi.string().example("Auteur du film modifié").description("Auteur")
                }).min(1)
            }
        },
        handler: async (request, h) => {
            try {
                const { movieService } = request.services();
                return await movieService.update(request.params.id, request.payload);
            } catch (error) {
                console.error("IMPOSSIBLE DE METTRE A JOUR LE FILM", error);
                return h.response({ error: 'IMPOSSIBLE DE METTRE A JOUR LE FILM' }).code(500);
            }
        }
    },
    {
        method: 'DELETE',
        path: '/movie/{id}',
        options: {
            tags: ['api'],
            auth: { scope: ['admin'] },
            validate: {
                params: Joi.object({
                    id: Joi.number().integer().required().min(1).description("id du film")
                })
            }
        },
        handler: async (request, h) => {
            try {
                const { movieService } = request.services();
                return await movieService.delete(request.params.id);
            } catch (error) {
                console.error("IMPOSSIBLE DDE SUPPRIMER LE FILM", error);
                return h.response({ error: 'IMPOSSIBLE DDE SUPPRIMER LE FILM' }).code(500);
            }
        }
    },
    {
        method: 'GET',
        path: '/movie',
        options: {
            tags: ['api'],
            auth: { mode: 'optional' }
        },
        handler: async (request, h) => {
            const { movieService } = request.services();
            return await movieService.getAll();
        }
    },
    {
        method: 'POST',
        path: '/movie/export',
        options: {
            tags: ['api'],
            auth: {scope: ['admin']},
            handler: async (request, h) => {
                try {
                    const {movieService} = request.services();
                    const filePath = await movieService.exportMoviesToCSV();
                    await MessageBroker.sendMessage('csv_exports', {filePath, email: request.auth.credentials.email});
                    return h.response({message: "Exportation, pensez à regarder vos mails"}).code(202);
                } catch (error) {
                    console.error("IMPOSSIBLE D EXPORTER", error);
                    return h.response({error: "IMPOSSIBLE D EXPORTER"}).code(500);
                }
            }
        }
    }
];

module.exports = routes;