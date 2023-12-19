import express from 'express';
import {ExpressRouter} from './express-router';
import cors from 'cors';
import session from 'express-session';
import passport from './auth/express-auth'
import path from 'path';

export class ExpressServer {
    private express = express();

    constructor(
        private expressRouter: ExpressRouter,
        private port: string,
    ) {
        this.setupMiddleware();
        this.configureRoutes();
        this.configureStaticFiles();
    }

    bootstrap(): void {
        this.express.listen(this.port, () => {
            console.log(`> Listening on port ${this.port}`);
        });
    }

    private configureRoutes(): void {
        this.express.use('/api', this.expressRouter.router);
    }

    private setupMiddleware(): void {
        // Middleware pour analyser les données du formulaire
        this.express.use(express.urlencoded({extended: false}));

        // Middleware pour analyser les données JSON
        this.express.use(express.json());

        // Utilise le middleware CORS pour autoriser les requêtes depuis http://localhost:5173
        this.express.use(
            cors({
                origin: 'http://localhost:5173', // Replace with the origin of your frontend app
                methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
                credentials: true, // If you need to allow cookies and credentials
            })
        );

        this.express.use(passport.initialize()); // Initialise passport

        // Utilise le middleware session pour stocker l'état de l'authentification
        this.express.use(
            session({
                secret: "7f61758ea7ea7a5c6309828d593fbf9aadc45e67c8fc4995ca05461aec596f36", // secret key en brut car c'est un projet de cours (à ne pas faire en prod) a metre dans le fichier .env
                resave: false,
                saveUninitialized: false,
            })
        );
    }

    private configureStaticFiles(): void {
        const imagesPath = path.resolve(__dirname, '../../public/images');
        this.express.use('/images', express.static(imagesPath));
    }
}
