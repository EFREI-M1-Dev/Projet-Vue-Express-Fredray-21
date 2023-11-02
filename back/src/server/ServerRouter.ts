import { Router } from 'express';
import { ServerController } from './ServerController';

export class ServerRouter {
    router = Router();

    constructor(private serverController: ServerController) {
        this.configureRoutes();
    }

    private configureRoutes(): void {

        //all
        this.router.get('/', (req, res,next) => {
            try {
                const result = this.serverController.getAll();
                res.status(200).json(result);
            } catch (error: unknown) {
                next(error);
            }
        });

        //get
        this.router.get('/:id', (req, res,next) => {
            try {
                const result = this.serverController.getById(
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
                const result = this.serverController.add(
                    req.body.serverName,
                    req.body.description,
                    req.body.owner,
                );
                res.status(200).json(result);
            } catch (error: unknown) {
                next(error);
            }
        });

        //update
        this.router.put('/:id', (req, res,next) => {
            try {
                const result = this.serverController.update(
                    Number(req.params.id),
                    req.body.serverName,
                    req.body.description,
                );
                res.status(200).json(result);
            } catch (error: unknown) {
                next(error);
            }
        });

        //delete
        this.router.delete('/:id', (req, res,next) => {
            try {
                const result = this.serverController.remove(
                    Number(req.params.id),
                );
                res.status(200).json(result);
            } catch (error: unknown) {
                next(error);
            }
        });

    }
}
