'use strict';

const { Service } = require('@hapipal/schmervice');
const Boom = require('@hapi/boom');

module.exports = class FavoritesService extends Service {

    async addFavorites(userId, movieId) {
        const { Favorites, Movie } = this.server.models();

        const movie = await Movie.query().findById(movieId);
        if (!movie) {
            throw Boom.notFound('FILM INTROUVABLE');
        }

        const existingFavorites = await Favorites.query().findOne({ userId, movieId });
        if (existingFavorites) {
            throw Boom.conflict('LE FILM EST DÉJA EN FAVORIS');
        }

        await Favorites.query().insert({ userId, movieId });
    }

    async removeFavorites(userId, movieId) {
        const { Favorites } = this.server.models();
        const favorites = await Favorites.query().findOne({ userId, movieId });
        if (!favorites) {
            console.error("FILM INTROUVABLE DANS LES FAVORIS", userId);
            throw Boom.notFound('FILM INTROUVABLE DANS LES FAVORIS');
        }
        await Favorites.query().delete().where({ userId, movieId });
    }
    async getFavoritesByMovieId(movieID) {
        const { Favorites, User } = this.server.models();

        const favorites = await Favorites.query()
            .join('user', 'favorites.userId', '=', 'user.id')
            .where('favorites.movieID', movieID)
            .select('user.email', 'user.firstName');

        if (!favorites || favorites.length === 0) {
            console.error('Aucun favori trouvé pour ce film');
            return [];
        }
        const favoritesData = favorites.map(favorites => favorites.toJSON ? favorites.toJSON() : favorites);
        return favoritesData;
    }
};