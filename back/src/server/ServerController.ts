import { Channel } from '../channel/Channel';
import { User, UserData } from '../user/User';
import { Server } from './Server';
import { ServerService } from './ServerService';

export class ServerController {
    constructor(private serverService: ServerService) {}

    async add(serverName: string, description: string | null, owner: UserData): Promise<Server> {
        return await this.serverService.add(serverName, description, owner);
    }

    async update(id: number, serverName: string, description: string | null, imageUrl:string | null): Promise<Server> {
        return await this.serverService.update(id, serverName, description, imageUrl);
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

    async getUsersCountByServer(id: number): Promise<number> {
        return await this.serverService.getUsersCountByServer(id);
    }

    async getFirstChannelByServer(id: number): Promise<Channel> {
        return await this.serverService.getFirstChannelByServer(id);
    }


    async uploadImage(id: number, image: string, imageName: string): Promise<boolean> {
        if (image !== image.trim()) throw new Error("L'image ne peut pas être vide");
        if (imageName !== imageName.trim()) throw new Error("Le nom de l'image ne peut pas être vide");
        if (imageName.length > 255) throw new Error("Le nom de l'image ne peut pas dépasser 255 caractères");
        return await this.serverService.uploadImage(id, image, imageName);
    }

}
