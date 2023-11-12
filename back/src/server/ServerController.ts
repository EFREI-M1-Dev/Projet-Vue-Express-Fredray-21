import { User, UserData } from '../user/User';
import { Server } from './Server';
import { ServerService } from './ServerService';

export class ServerController {
    constructor(private serverService: ServerService) {}

    async add(serverName: string, description: string | null, owner: UserData): Promise<Server> {
        return await this.serverService.add(serverName, description, owner);
    }

    async update(id: number, serverName: string, description: string | null): Promise<Server> {
        return await this.serverService.update(id, serverName, description);
    }

    async getById(id: number): Promise<Server | null> {
        return await this.serverService.getById(id);
    }

    async remove(id: number): Promise<boolean> {
        return await this.serverService.remove(id);
    }

    async getAll(): Promise<Server[]> {
        return await this.serverService.getAll();
    }

    async getUsersByServer(id: number): Promise<User[]> {
        return await this.serverService.getUsersByServer(id);
    }

}
