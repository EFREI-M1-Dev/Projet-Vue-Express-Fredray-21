import {Router, Request, Response, NextFunction} from 'express';
import {verifyTokenMiddleware} from '../infrastructure/auth/authUtils';
import {UserController} from './UserController';

export class UserRouter {
    router = Router();

    constructor(private userController: UserController) {
        this.configureRoutes();
    }

    private configureRoutes(): void {

        // get all servers by user
        this.router.get('/:username/servers', verifyTokenMiddleware, async (req: Request, res: Response, next: NextFunction) => {
            try {
                const result = await this.userController.getServersByUser(
                    req.params.username,
                );
                res.status(200).json(result);
            } catch (error: unknown) {
                next(error);
            }
        });

        // get first server by user
        this.router.get('/:username/firstServer', verifyTokenMiddleware, async (req: Request, res: Response, next: NextFunction) => {
            try {
                const result = await this.userController.getFirstServerByUser(
                    req.params.username,
                );
                res.status(200).json(result);
            } catch (error: unknown) {
                next(error);
            }
        });

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
        this.router.put('/:id', verifyTokenMiddleware, async (req: Request, res: Response, next: NextFunction) => {
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
        this.router.get('/', verifyTokenMiddleware, async (req: Request, res: Response, next: NextFunction) => {
            try {

                //console.log("req: ",req.user);

                const result = await this.userController.getAll();
                res.status(200).json(result);
            } catch (error: unknown) {
                next(error);
            }
        });

        // Delete
        this.router.delete('/:id', verifyTokenMiddleware, async (req: Request, res: Response, next: NextFunction) => {
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
        this.router.get('/:id', verifyTokenMiddleware, async (req: Request, res: Response, next: NextFunction) => {
            try {
                const result = await this.userController.getById(
                    Number(req.params.id),
                );
                res.status(200).json(result);
            } catch (error: unknown) {
                next(error);
            }
        });

        // check if username exists
        this.router.get('/username/:username', async (req: Request, res: Response, next: NextFunction) => {
                try {
                    const result = await this.userController.findUserByUsername(
                        req.params.username,
                    );
                    res.status(200).json((result !== null && result.getId() !== undefined) ? true : false);
                } catch (error: unknown) {
                    next(error);
                }
            }
        );



    }
}
