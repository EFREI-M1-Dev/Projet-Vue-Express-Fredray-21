import { Router } from 'express';
import { MessageController } from './MessageController';

export class MessageRouter {
    router = Router();

    constructor(private messageController: MessageController) {
        this.configureRoutes();
    }

    private configureRoutes(): void {

        //all
        this.router.get('/', (req, res,next) => {
            try {
                const result = this.messageController.getAll();
                res.status(200).json(result);
            } catch (error: unknown) {
                next(error);
            }
        });

        //get
        this.router.get('/:id', (req, res,next) => {
            try {
                const result = this.messageController.getById(
                    Number(req.params.id),
                );
                res.status(200).json(result);
            } catch (error: unknown) {
                next(error);
            }
        });


        //add
        this.router.post('/', (req, res,next) => {
            try {
                const result = this.messageController.add(
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

        //update
        this.router.put('/:id', (req, res,next) => {
            try {
                const result = this.messageController.update(
                    Number(req.params.id),
                    req.body.content,
                );
                res.status(200).json(result);
            } catch (error: unknown) {
                next(error);
            }
        });

        //delete
        this.router.delete('/:id', (req, res,next) => {
            try {
                const result = this.messageController.remove(
                    Number(req.params.id),
                );
                res.status(200).json(result);
            } catch (error: unknown) {
                next(error);
            }
        });

    }
}
