import { User, UserData } from '../user/User';
import {Server} from './Server';
import {ServerService} from './ServerService';

export class ServerController {
    constructor(private serverService: ServerService) {
    }

    add(serverName: string, description: string | null, owner: UserData): Server {
        return this.serverService.add(serverName, description, owner);
    }

    update(id: number, serverName: string, description: string | null): Server {
        return this.serverService.update(id, serverName, description);
    }

    getById(id: number): Server | null {
        return this.serverService.getById(id);
    }

    remove(id: number): Boolean {
        return this.serverService.remove(id);
    }


    getAll(): Server[] {
        return this.serverService.getAll();
    }

}
