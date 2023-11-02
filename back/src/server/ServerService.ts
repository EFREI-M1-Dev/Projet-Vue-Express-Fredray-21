import { User, UserData } from '../user/User';
import { Server } from './Server';

export interface ServerService {
    add(serverName: string, description: string | null, owner: UserData): Server;
    update(id: number, serverName: string, description: string | null): Server;
    remove(id: number): Boolean;
    getAll(): Server[];
    getById(id: number): Server | null;
}