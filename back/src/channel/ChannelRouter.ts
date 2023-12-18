import { Router } from 'express';
import { ChannelController } from './ChannelController';
import {verifyTokenMiddleware} from '../infrastructure/auth/authUtils';

export class ChannelRouter {
    router = Router();

    constructor(private channelController: ChannelController) {
        this.configureRoutes();
    }

    private configureRoutes(): void {

        // all
        this.router.get('/', verifyTokenMiddleware, async (req, res, next) => {
            try {
                const result = await this.channelController.getAll();
                res.status(200).json(result);
            } catch (error: unknown) {
                next(error);
            }
        });

        // get
        this.router.get('/:id', verifyTokenMiddleware, async (req, res, next) => {
            try {
                const result = await this.channelController.getById(Number(req.params.id));
                res.status(200).json(result);
            } catch (error: unknown) {
                next(error);
            }
        });

        // add
        this.router.post('/', verifyTokenMiddleware, async (req, res, next) => {
            try {
                const result = await this.channelController.add(
                    req.body.channelName,
                    req.body.description,
                    req.body.server,
                );
                res.status(200).json(result);
            } catch (error: unknown) {
                next(error);
            }
        });

        // update
        this.router.put('/:id', verifyTokenMiddleware, async (req, res, next) => {
            try {
                const result = await this.channelController.update(
                    Number(req.params.id),
                    req.body.channelName,
                    req.body.description,
                );
                res.status(200).json(result);
            } catch (error: unknown) {
                next(error);
            }
        });

        // delete
        this.router.delete('/:id', verifyTokenMiddleware, async (req, res, next) => {
            try {
                const result = await this.channelController.remove(Number(req.params.id));
                res.status(200).json(result);
            } catch (error: unknown) {
                next(error);
            }
        });


        // get channel by server
        this.router.get('/server/:id', verifyTokenMiddleware, async (req, res, next) => {
            try {
                const result = await this.channelController.getByServer(Number(req.params.id));
                res.status(200).json(result);
            } catch (error: unknown) {
                next(error);
            }
        });
    }
}
