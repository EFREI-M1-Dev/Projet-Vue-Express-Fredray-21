import { Router } from 'express';

import { UserService } from '../user/UserService';
import { UserRouter } from '../user/UserRouter';
import { UserController } from '../user/UserController';

import { ServerService } from '../server/ServerService';
import { ServerRouter } from '../server/ServerRouter';
import { ServerController } from '../server/ServerController';

import { ChannelService } from '../channel/ChannelService';
import { ChannelRouter } from '../channel/ChannelRouter';
import { ChannelController } from '../channel/ChannelController';

export class ExpressRouter {
    router = Router();
    private userController!: UserController;
    private userRouter!: UserRouter;

    private serverRouter!: ServerRouter;
    private serverController!: ServerController;

    private channelRouter!: ChannelRouter;
    private channelController!: ChannelController;

    constructor(private UserService: UserService, private ServerService: ServerService, private ChannelService: ChannelService) {
        this.configureControllers();
        this.configureRouters();
        this.configureRoutes();
    }

    private configureControllers(): void {
        this.userController = new UserController(this.UserService);
        this.serverController = new ServerController(this.ServerService);
        this.channelController = new ChannelController(this.ChannelService);
    }

    private configureRouters(): void {
        this.userRouter = new UserRouter(this.userController);
        this.serverRouter = new ServerRouter(this.serverController);
        this.channelRouter = new ChannelRouter(this.channelController);
    }

    private configureRoutes(): void {
        this.router.use('/user', this.userRouter.router);
        this.router.use('/server', this.serverRouter.router);
        this.router.use('/channel', this.channelRouter.router);
    }
}
