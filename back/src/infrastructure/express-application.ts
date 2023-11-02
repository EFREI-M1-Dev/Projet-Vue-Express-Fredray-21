import { ExpressServer } from './express-server';
import * as dotenv from 'dotenv';
import { ExpressRouter } from './express-router';

import { UserService } from '../user/UserService';
import { UserBDDService } from '../user/UserBDDService';

import { ServerService } from '../server/ServerService';
import { ServerBDDService } from '../server/ServerBDDService';
import { ChannelService } from '../channel/ChannelService';
import { ChannelBDDService } from '../channel/ChannelBDDService';
import { MessageService } from '../message/MessageService';
import { MessageBDDService } from '../message/MessageBDDService';

export class ExpressApplication {
    private server!: ExpressServer;
    private expressRouter!: ExpressRouter;
    private port!: string;

    private userService!: UserService;
    private serverService!: ServerService;
    private channelService!: ChannelService;
    private messageService!: MessageService;

    constructor() {
        this.configureApplication();
    }

    bootstrap(): void {
        this.server.bootstrap();
    }

    private configureApplication(): void {
        // Configure application here
        this.configureEnvironment();
        this.configureServerPort();
        this.configureServices();
        this.configureExpressRouter();
        this.configureServer();
    }

    private configureEnvironment(): void {
        dotenv.config({
            path: '.env',
        });
    }

    private configureServerPort(): void {
        this.port = this.getPort();
    }

    private configureServices(): void {
        this.userService = new UserBDDService();
        this.serverService = new ServerBDDService();
        this.channelService = new ChannelBDDService();
        this.messageService = new MessageBDDService();
    }

    private configureExpressRouter(): void {
        this.expressRouter = new ExpressRouter(this.userService, this.serverService, this.channelService, this.messageService);
    }

    private configureServer(): void {
        this.server = new ExpressServer(this.expressRouter, this.port);
    }

    private getPort(): string {
        const port = process.env.PORT;
        if (!port) throw new Error('No port was found in env file.');
        return port;
    }
}
