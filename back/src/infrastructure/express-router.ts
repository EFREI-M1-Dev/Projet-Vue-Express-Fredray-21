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

import { MessageService } from '../message/MessageService';
import { MessageRouter } from '../message/MessageRouter';
import { MessageController } from '../message/MessageController';

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

    constructor(private UserService: UserService, private ServerService: ServerService, private ChannelService: ChannelService, private MessageService: MessageService) {
        this.configureControllers();
        this.configureRouters();
        this.configureRoutes();
    }

    private configureControllers(): void {
        this.userController = new UserController(this.UserService);
        this.serverController = new ServerController(this.ServerService);
        this.channelController = new ChannelController(this.ChannelService);
        this.messageController = new MessageController(this.MessageService);
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
}
