import {Router, Request, Response, NextFunction} from 'express';
import {ServerController} from './ServerController';
import {verifyTokenMiddleware} from '../infrastructure/auth/authUtils';


export class ServerRouter {
    router = Router();

    constructor(private serverController: ServerController) {
        this.configureRoutes();
    }

    private configureRoutes(): void {
        // All
        this.router.get('/', verifyTokenMiddleware, async (req: Request, res: Response, next: NextFunction) => {
            try {
                const result = await this.serverController.getAll();
                res.status(200).json(result);
            } catch (error: unknown) {
                next(error);
            }
        });

        // get all users by server
        this.router.get('/:id/users', verifyTokenMiddleware, async (req: Request, res: Response, next: NextFunction) => {
            try {
                const result = await this.serverController.getUsersByServer(
                    Number(req.params.id),
                );
                res.status(200).json(result);
            } catch (error: unknown) {
                next(error);
            }
        });

        //get number of users by server
        this.router.get('/:id/users/count', verifyTokenMiddleware, async (req: Request, res: Response, next: NextFunction) => {
            try {
                const result = await this.serverController.getUsersCountByServer(
                    Number(req.params.id),
                );
                res.status(200).json(result);
            } catch (error: unknown) {
                next(error);
            }
        });

        //get fist channel of server
        this.router.get('/:id/firstChannel', verifyTokenMiddleware, async (req: Request, res: Response, next: NextFunction) => {
            try {
                const result = await this.serverController.getFirstChannelByServer(
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
                const result = await this.serverController.getById(Number(req.params.id));
                res.status(200).json(result);
            } catch (error: unknown) {
                next(error);
            }
        });

        // Add
        this.router.post('/', verifyTokenMiddleware, async (req: Request, res: Response, next: NextFunction) => {
            try {
                const result = await this.serverController.add(req.body.serverName, req.body.description, req.body.owner);
                res.status(200).json(result);
            } catch (error: unknown) {
                next(error);
            }
        });

        // Update
        this.router.put('/:id', verifyTokenMiddleware, async (req: Request, res: Response, next: NextFunction) => {
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
        this.router.delete('/:id', verifyTokenMiddleware, async (req: Request, res: Response, next: NextFunction) => {
            try {
                const result = await this.serverController.remove(Number(req.params.id));
                res.status(200).json(result);
            } catch (error: unknown) {
                next(error);
            }
        });




    }
}
