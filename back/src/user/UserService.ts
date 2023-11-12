import { User } from './User';
import { Server } from '../server/Server';

export interface UserService {
    add(username: string, email: string, password: string, avatarUrl: string | null, bio: string | null): Promise<User>;
    update(id: number, username: string, email: string, password: string, avatarUrl: string | null, bio: string | null): Promise<User>;
    remove(id: number): Promise<boolean>;
    getAll(): Promise<User[]>;
    getById(id: number): Promise<User | null>;
    findUserByUsername(username: string): Promise<User | null>;
    getServersByUser(username: string): Promise<Server[]>;
}