import express from 'express';
import routes from './routes';
import http from 'http';
import * as core from 'express-serve-static-core';

let app: core.Express;
let server: http.Server;
const port = 5555;

export const startRestServer = () => {
    if (!app) {
        app = express();

        app.use(express.json({limit: '50mb'}));
        app.use(express.urlencoded({limit: '50mb', extended: true}));
        app.use(routes);

        server = app.listen(port, '0.0.0.0', () => {
            console.log(`Running server on port ${port}`);
        }).on('error', err => {
            console.error(err);
            process.exit(1);
        });
    }
};

export const closeRestServer = () => {
    server.close(err => {
        if (err) {
            console.error(`Express server cannot be closed, ${err.message}`);
            process.exit(1);
        }
        console.info('Express server closed successfully');
    });
}