const app = require('./app');
const config = require('./config/config');
const logger = require('./config/logger');
const db = require('./models');


let server;

db.sequelize.authenticate()
    .then(() => {
        logger.info('Connected to database');
        server = app.listen(config.port, ()=> {
            logger.info(`Listening on port ${config.port}`);
        });
    })
    .catch((error)=> {
        logger.error(`Error connecting to database ${error}`);
    })

const exitHandler = () => {
    if (server) {
        server.close(() => {
            logger.info('Server closed');
            process.exit(1);
        });
    } else {
        process.exit(1);
    }
};

const unexpectedErrorHandler = (error) => {
    logger.error(error);
    exitHandler();
};

process.on('uncaughtException', unexpectedErrorHandler);
process.on('unhandledRejection', unexpectedErrorHandler);

process.on('SIGTERM', () => {
    logger.info('SIGTERM received');
    if (server) {
        server.close();
    }
});
