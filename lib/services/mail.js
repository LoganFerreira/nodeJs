'use strict';

const { Service } = require('@hapipal/schmervice');
const nodemailer = require('nodemailer');

module.exports = class MailService extends Service {

    constructor(...args) {
        super(...args);

        this.transporter = nodemailer.createTransport({
            host: process.env.EMAIL_HOST,
            port: process.env.EMAIL_PORT,
            secure: false,
            auth: {
                user: process.env.EMAIL_USER,
                pass: process.env.EMAIL_PASS
            }
        });
    }

    async sendWelcomeEmail(email, firstName) {
        try {
            await this.transporter.sendMail({
                from: '"Filmothèque" <no-reply@filmotheque.com>',
                to: email,
                subject: "Nouvel Utilisateur de la Filmothèque",
                text: `Bonjour ${firstName},\n\nVous êtes un nouvel utilisateur sur la Filmothèque\n`,
                html: `<p>Bonjour <strong>${firstName}</strong>,</p><p>Vous êtes un nouvel utilisateur sur la Filmothèque</p>`
            });
        } catch (error) {
            console.error("IMPOSSIBLE D ENVOYER LE MAIL", error);
        }
    }

    async sendNewMovie(email, firstName) {
        try {
            await this.transporter.sendMail({
                from: '"Filmothèque" <no-reply@filmotheque.com>',
                to: email,
                subject: "Film ajouté dans la filmothèque!",
                text: `Bonjour ${firstName},\n\nUn nouveau film a été ajouté\n`,
                html: `<p>Bonjour <strong>${firstName}</strong>,</p><p>Un nouveau film a été ajouté</p>`
            });
        } catch (error) {
            console.error("IMPOSSIBLE D ENVOYER LE MAIL", error);
        }
    }

    async modifyFavorite(email, firstName) {
        try {
            await this.transporter.sendMail({
                from: '"Filmothèque" <no-reply@filmotheque.com>',
                to: email,
                subject: "Film modifié dans vos favoris",
                text: `Bonjour ${firstName},\n\nUn film a été modifié dans vos favoris\n`,
                html: `<p>Bonjour <strong>${firstName}</strong>,</p><p>Un film a été modifié dans vos favorisi.</p>`
            });
        } catch (error) {
            console.error("IMPOSSIBLE D ENVOYER LE MAIL", error);
        }
    }

    async deleteFavorite(email, firstName) {
        try {
            await this.transporter.sendMail({
                from: '"Filmothèque" <no-reply@filmotheque.com>',
                to: email,
                subject: "Film supprimé dans vos favoris",
                text: `Bonjour ${firstName},\n\nUn film a été supprimé dans vos favoris\n`,
                html: `<p>Bonjour <strong>${firstName}</strong>,</p><p>Un film a été supprimé dans vos favoris</p>`
            });
        } catch (error) {
            console.error("IMPOSSIBLE D ENVOYER LE MAIL", error);
        }
    }

    async sendCSVByEmail(email, filePath) {
        try {
            await this.transporter.sendMail({
                from: '"Filmothèque" <no-reply@filmotheque.com>',
                to: email,
                subject: "CSV",
                text: "Films de la  Filmothèque en pièce jointe",
                attachments: [{ filename: 'films.csv', path: filePath }]
            });
        } catch (error) {
            console.error("IMPOSSIBLE D ENVOYER LE MAIL", error);
        }
    }
};