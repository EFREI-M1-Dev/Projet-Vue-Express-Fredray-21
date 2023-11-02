import { Router, Request, Response, NextFunction } from 'express';
import { UserController } from './UserController';

export class UserRouter {
    router = Router();

    constructor(private userController: UserController) {
        this.configureRoutes();
    }

    private configureRoutes(): void {
        // Add
        this.router.post('/', async (req: Request, res: Response, next: NextFunction) => {
            try {
                const result = await this.userController.add(
                    req.body.username,
                    req.body.email,
                    req.body.password,
                    req.body.avatarUrl,
                    req.body.bio,
                );
                res.status(200).json(result);
            } catch (error: unknown) {
                next(error);
            }
        });

        // Update
        this.router.put('/:id', async (req: Request, res: Response, next: NextFunction) => {
            try {
                const result = await this.userController.update(
                    Number(req.params.id),
                    req.body.username,
                    req.body.email,
                    req.body.password,
                    req.body.avatarUrl,
                    req.body.bio,
                );
                res.status(200).json(result);
            } catch (error: unknown) {
                next(error);
            }
        });

        // All
        this.router.get('/', async (req: Request, res: Response, next: NextFunction) => {
            try {
                const result = await this.userController.getAll();
                res.status(200).json(result);
            } catch (error: unknown) {
                next(error);
            }
        });

        // Delete
        this.router.delete('/:id', async (req: Request, res: Response, next: NextFunction) => {
            try {
                const result = await this.userController.remove(
                    Number(req.params.id),
                );
                res.status(200).json(result);
            } catch (error: unknown) {
                next(error);
            }
        });

        // Get
        this.router.get('/:id', async (req: Request, res: Response, next: NextFunction) => {
            try {
                const result = await this.userController.getById(
                    Number(req.params.id),
                );
                res.status(200).json(result);
            } catch (error: unknown) {
                next(error);
            }
        });
    }
}
