'use strict';

const { Service } = require('@hapipal/schmervice');
const Boom = require('@hapi/boom');
const { Parser } = require('json2csv');
const fs = require('fs');
const path = require('path');

module.exports = class MovieService extends Service {

    async create(movie) {
        const { Movie } = this.server.models();
        const { mailService, userService } = this.server.services();
        const newMovie = await Movie.query().insertAndFetch(movie);
        const users = await userService.findAll();
        const emailPromises = users.map(user => mailService.sendNewMovie(user.email, user.firstName));
        await Promise.all(emailPromises);
        return newMovie;
    }

    async update(id, movieData) {
        const { Movie } = this.server.models();
        const { mailService, favoritesService } = this.server.services();

        const movie = await Movie.query().findById(id);
        if (!movie) {
            throw Boom.notFound('FILM INTROUVABLE');
        }

        const updatedMovie = await Movie.query().patchAndFetchById(id, movieData);

        const favorites = await favoritesService.getFavoritesByMovieId(id);
        if (!favorites || favorites.length === 0) {
            console.error('AUCUN FAVORI TROUVÉ POUR CE FILM');
            return { message: 'AUCUN FAVORI TROUVÉ POUR CE FILM' };
        }

        const emailPromises = favorites.map(favori => {
            const favoritesData = favori.toJSON ? favori.toJSON() : favori;
            if (favoritesData.firstName && favoritesData.email) {
                return mailService.modifyFavorite(favoritesData.email, favoritesData.firstName);
            } else {
                console.error('UTILISATEUR SANS EMAILS DANS LES FAVORIS', favoritesData);
                return Promise.resolve();
            }
        });

        await Promise.all(emailPromises);

        return updatedMovie;
    }

    async delete(id) {
        const { Movie } = this.server.models();
        const { mailService, favoritesService } = this.server.services();

        const movie = await Movie.query().findById(id);
        if (!movie) {
            throw Boom.notFound('FILM INTROUVABLE');
        }

        const favorites = await favoritesService.getFavoritesByMovieId(id);

        const emailPromises = favorites.map(favori => {
            const favoritesData = favori.toJSON ? favori.toJSON() : favori;
            if (favoritesData.firstName && favoritesData.email) {
                return mailService.deleteFavorite(favoritesData.email, favoritesData.firstName);
            } else {
                console.error('UTILISATEUR SANS EMAILS DANS LES FAVORIS', favoritesData);
                return Promise.resolve();
            }
        });

        await Promise.all(emailPromises);

        await Movie.query().deleteById(id);

        return { message: "Film supprimé" };
    }

    async getAll() {
        const { Movie } = this.server.models();
        return await Movie.query();
    }

    async exportMoviesToCSV() {
        const { Movie } = this.server.models();
        const movie = await Movie.query();

        if (!movie || movie.length === 0) {
            throw new Error("FILM INTROUVABLE");
        }

        const exportDir = path.join(__dirname, '../exports');
        if (!fs.existsSync(exportDir)) {
            fs.mkdirSync(exportDir, { recursive: true });
        }

        const parser = new Parser();
        const csv = parser.parse(movie);

        const filePath = path.join(exportDir, `films_${Date.now()}.csv`);
        fs.writeFileSync(filePath, csv);

        return filePath;
    }
};