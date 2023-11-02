import { Router } from 'express';
import { MessageController } from './MessageController';

export class MessageRouter {
    router = Router();

    constructor(private messageController: MessageController) {
        this.configureRoutes();
    }

    private configureRoutes(): void {

        // all
        this.router.get('/', async (req, res, next) => {
            try {
                const result = await this.messageController.getAll();
                res.status(200).json(result);
            } catch (error: unknown) {
                next(error);
            }
        });

        // get
        this.router.get('/:id', async (req, res, next) => {
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
        this.router.post('/', async (req, res, next) => {
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
        this.router.put('/:id', async (req, res, next) => {
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
        this.router.delete('/:id', async (req, res, next) => {
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
