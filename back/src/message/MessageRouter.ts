import { Router } from 'express';
import { MessageController } from './MessageController';
import {verifyTokenMiddleware} from '../infrastructure/auth/authUtils';

export class MessageRouter {
    router = Router();

    constructor(private messageController: MessageController) {
        this.configureRoutes();
    }

    private configureRoutes(): void {

        // all
        this.router.get('/', verifyTokenMiddleware, async (req, res, next) => {
            try {
                const result = await this.messageController.getAll();
                res.status(200).json(result);
            } catch (error: unknown) {
                next(error);
            }
        });

        // get by server and channel
        this.router.get('/server/:server/channel/:channel', verifyTokenMiddleware, async (req, res, next) => {
            try {
                const result = await this.messageController.getByServerAndChannel(
                    Number(req.params.server),
                    Number(req.params.channel),
                );
                res.status(200).json(result);
            } catch (error: unknown) {
                next(error);
            }
        });

        // get
        this.router.get('/:id', verifyTokenMiddleware, async (req, res, next) => {
            try {
                const result = await this.messageController.getById(
                    Number(req.params.id),
                );
                res.status(200).json(result);
            } catch (error: unknown) {
                next(error);
            }
        });

        // add
        this.router.post('/', verifyTokenMiddleware, async (req, res, next) => {
            try {
                const result = await this.messageController.add(
                    req.body.owner,
                    req.body.content,
                    req.body.server,
                    req.body.channel,
                );
                res.status(200).json(result);
            } catch (error: unknown) {
                next(error);
            }
        });

        // update
        this.router.put('/:id', verifyTokenMiddleware, async (req, res, next) => {
            try {
                const result = await this.messageController.update(
                    Number(req.params.id),
                    req.body.content,
                );
                res.status(200).json(result);
            } catch (error: unknown) {
                next(error);
            }
        });

        // delete
        this.router.delete('/:id', verifyTokenMiddleware, async (req, res, next) => {
            try {
                const result = await this.messageController.remove(
                    Number(req.params.id),
                );
                res.status(200).json(result);
            } catch (error: unknown) {
                next(error);
            }
        });

    }
}
