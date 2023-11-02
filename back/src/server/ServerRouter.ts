import { Router, Request, Response, NextFunction } from 'express';
import { ServerController } from './ServerController';

export class ServerRouter {
    router = Router();

    constructor(private serverController: ServerController) {
        this.configureRoutes();
    }

    private configureRoutes(): void {
        // All
        this.router.get('/', async (req: Request, res: Response, next: NextFunction) => {
            try {
                const result = await this.serverController.getAll();
                res.status(200).json(result);
            } catch (error: unknown) {
                next(error);
            }
        });

        // Get
        this.router.get('/:id', async (req: Request, res: Response, next: NextFunction) => {
            try {
                const result = await this.serverController.getById(Number(req.params.id));
                res.status(200).json(result);
            } catch (error: unknown) {
                next(error);
            }
        });

        // Add
        this.router.post('/', async (req: Request, res: Response, next: NextFunction) => {
            try {
                const result = await this.serverController.add(req.body.serverName, req.body.description, req.body.owner);
                res.status(200).json(result);
            } catch (error: unknown) {
                next(error);
            }
        });

        // Update
        this.router.put('/:id', async (req: Request, res: Response, next: NextFunction) => {
            try {
                const result = await this.serverController.update(
                    Number(req.params.id),
                    req.body.serverName,
                    req.body.description
                );
                res.status(200).json(result);
            } catch (error: unknown) {
                next(error);
            }
        });

        // Delete
        this.router.delete('/:id', async (req: Request, res: Response, next: NextFunction) => {
            try {
                const result = await this.serverController.remove(Number(req.params.id));
                res.status(200).json(result);
            } catch (error: unknown) {
                next(error);
            }
        });
    }
}
