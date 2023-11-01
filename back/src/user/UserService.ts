import { User } from './User';

export interface UserService {
    add(username: string, email: string, password: string): User;
    remove(id: number): Boolean;
    getAll(): User[];
    getAllTest(): User[];
    getById(id: number): User | null;
}