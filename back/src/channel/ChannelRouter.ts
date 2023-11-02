import { Router } from 'express';
import { ChannelController } from './ChannelController';

export class ChannelRouter {
    router = Router();

    constructor(private channelController: ChannelController) {
        this.configureRoutes();
    }

    private configureRoutes(): void {

        //all
        this.router.get('/', (req, res,next) => {
            try {
                const result = this.channelController.getAll();
                res.status(200).json(result);
            } catch (error: unknown) {
                next(error);
            }
        });

        //get
        this.router.get('/:id', (req, res,next) => {
            try {
                const result = this.channelController.getById(
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
                const result = this.channelController.add(
                    req.body.channelName,
                    req.body.description,
                    req.body.server,
                );
                res.status(200).json(result);
            } catch (error: unknown) {
                next(error);
            }
        });

        //update
        this.router.put('/:id', (req, res,next) => {
            try {
                const result = this.channelController.update(
                    Number(req.params.id),
                    req.body.channelName,
                    req.body.description
                );
                res.status(200).json(result);
            } catch (error: unknown) {
                next(error);
            }
        });

        //delete
        this.router.delete('/:id', (req, res,next) => {
            try {
                const result = this.channelController.remove(
                    Number(req.params.id),
                );
                res.status(200).json(result);
            } catch (error: unknown) {
                next(error);
            }
        });

    }
}
