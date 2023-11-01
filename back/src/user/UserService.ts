import { User } from './User';

export interface UserService {
    add(username: string, email: string, password: string, avatarUrl: string | null, bio: string | null): User;
    update(id: number, username: string, email: string, password: string, avatarUrl: string | null, bio: string | null): User;
    remove(id: number): Boolean;
    getAll(): User[];
    getById(id: number): User | null;
}