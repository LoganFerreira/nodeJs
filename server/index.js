'use strict';

const Glue = require('@hapi/glue');
const Exiting = require('exiting');
const Manifest = require('./manifest');
const consumeMessages = require('../lib/services/messageConsumer');

exports.deployment = async ({ start } = {}) => {
    const manifest = Manifest.get('/', process.env);
    const server = await Glue.compose(manifest, { relativeTo: __dirname });

    if (start) {
        await Exiting.createManager(server).start();
        server.log(['start'], `Server started at ${server.info.uri}`);
        consumeMessages(server).catch(console.error);
        return server;
    }

    await server.initialize();
    return server;
};

if (require.main === module) {
    exports.deployment({ start: true });

    process.on('unhandledRejection', (err) => {
        console.error('Unhandled rejection:', err);
        process.exit(1);
    });
}