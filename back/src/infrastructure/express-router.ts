import { Router } from 'express';
import passport from './auth/express-auth';
import { generateAuthToken } from './auth/authUtils';

import { Request, Response } from 'express';
import { UserService } from '../user/UserService';
import { UserRouter } from '../user/UserRouter';
import { UserController } from '../user/UserController';

import { ServerService } from '../server/ServerService';
import { ServerRouter } from '../server/ServerRouter';
import { ServerController } from '../server/ServerController';

import { ChannelService } from '../channel/ChannelService';
import { ChannelRouter } from '../channel/ChannelRouter';
import { ChannelController } from '../channel/ChannelController';

import { MessageService } from '../message/MessageService';
import { MessageRouter } from '../message/MessageRouter';
import { MessageController } from '../message/MessageController';
import { User } from '../user/User';

export class ExpressRouter {
    router = Router();
    private userController!: UserController;
    private userRouter!: UserRouter;

    private serverRouter!: ServerRouter;
    private serverController!: ServerController;

    private channelRouter!: ChannelRouter;
    private channelController!: ChannelController;

    private messageRouter!: MessageRouter;
    private messageController!: MessageController;

    constructor(
        private userService: UserService,
        private serverService: ServerService,
        private channelService: ChannelService,
        private messageService: MessageService
    ) {
        this.configureControllers();
        this.configureRouters();
        this.configureRoutes();
        this.configureAuthRoutes();
    }

    private configureControllers(): void {
        this.userController = new UserController(this.userService);
        this.serverController = new ServerController(this.serverService);
        this.channelController = new ChannelController(this.channelService);
        this.messageController = new MessageController(this.messageService);
    }

    private configureRouters(): void {
        this.userRouter = new UserRouter(this.userController);
        this.serverRouter = new ServerRouter(this.serverController);
        this.channelRouter = new ChannelRouter(this.channelController);
        this.messageRouter = new MessageRouter(this.messageController);
    }

    private configureRoutes(): void {
        this.router.use('/user', this.userRouter.router);
        this.router.use('/server', this.serverRouter.router);
        this.router.use('/channel', this.channelRouter.router);
        this.router.use('/message', this.messageRouter.router);
    }

    private configureAuthRoutes(): void {
        // Route de connexion
        this.router.post('/login', (req, res, next) => {
            passport.authenticate('local', (err : any, user: User, info: any) => {
                if (err) {
                    return res.status(500).json({ error: 'Une erreur s\'est produite' });
                }
                if (!user) {
                    return res.status(401).json({ error: 'Nom d\'utilisateur ou mot de passe incorrect' });
                }

                // Vous pouvez ajouter d'autres informations ici, telles qu'un jeton d'authentification
                const token = generateAuthToken(user);

                //httpOnly: false, secure: false pour pouvoir accéder au cookie en front suelement en http
                //httpOnly: true, secure: true pour pouvoir accéder au cookie en front et back en https
                // res.cookie("tokenDEFOU", token, { httpOnly: false, secure: false }).status(200).json({
                //     success: true,
                //     user: user.getId(),
                // });

                return res.status(200).json({token: token, user: user.getId()});


            })(req, res, next);
        });

        // Route de déconnexion
        this.router.get('/logout', (req: Request, res: Response) => {
            req.logout((err) => {
                if (err) {
                    // Gérez l'erreur ici, par exemple, en renvoyant une réponse d'erreur
                    res.status(500).send('Erreur lors de la déconnexion');
                } else {
                    // Redirigez vers la page d'accueil ou une autre page appropriée après la déconnexion réussie
                    res.redirect('/');
                }
            });
        });
    }
}
