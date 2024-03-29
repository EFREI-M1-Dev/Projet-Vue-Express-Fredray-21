import { Channel } from '../channel/Channel';
import { User, UserData } from '../user/User';
import { Server } from './Server';

export interface ServerService {
    add(serverName: string, description: string | null, owner: UserData): Promise<Server>;
    update(id: number, serverName: string, description: string | null, imageUrl: string | null): Promise<Server>;
    remove(id: number): Promise<boolean>;
    getAll(): Promise<Server[]>;
    getById(id: number): Promise<Server | null>;
    getUsersByServer(id: number): Promise<User[]>;
    getUsersCountByServer(id: number): Promise<number>;
    getFirstChannelByServer(id: number): Promise<Channel>;
    uploadImage(id: number, image: string, imageName: string): Promise<boolean>;
}
