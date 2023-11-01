import { Router } from 'express';

import { UserService } from '../user/UserService';
import { UserRouter } from '../user/UserRouter';
import { UserController } from '../user/UserController';

import { ServerService } from '../servers/ServerService';
import {ServerRouter } from '../servers/ServerRouter';
import { ServerController } from '../servers/ServerController';

export class ExpressRouter {
    router = Router();
    private userController!: UserController;
    private userRouter!: UserRouter;

    private serverRouter!: ServerRouter;
    private serverController!: ServerController;

    constructor(private UserService: UserService, private ServerService: ServerService) {
        this.configureControllers();
        this.configureRouters();
        this.configureRoutes();
    }

    private configureControllers(): void {
        this.userController = new UserController(this.UserService);
        this.serverController = new ServerController(this.ServerService);

    }

    private configureRouters(): void {
        this.userRouter = new UserRouter(this.userController);
        this.serverRouter = new ServerRouter(this.serverController);
    }

    private configureRoutes(): void {
        this.router.use('/user', this.userRouter.router);
        this.router.use('/server', this.serverRouter.router);
    }
}
