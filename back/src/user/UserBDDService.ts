import {User, UserData} from './User';
import {UserService} from './UserService';
import {openConnection} from '../../db';

export class UserBDDService implements UserService {
    async add(username: string, email: string, password: string, avatarUrl: string | null, bio: string | null): Promise<User> {
        const db = openConnection();
        try {
            const creationDate = new Date().getTime();
            const statement = db.prepare('INSERT INTO users (username, email, password, creationDate, avatarUrl, bio) VALUES (?, ?, ?, ?, ?, ?)');
            const info = await statement.run(username, email, password, creationDate, avatarUrl, bio);
            if (info.changes !== 1) throw new Error('Failed to insert user');
            const userId = Number(info.lastInsertRowid);
            const user = await this.getById(userId);
            if (!user) throw new Error('User not found');
            return user;
        } finally {
            db.close();
        }
    }

    async update(id: number, username: string, email: string, password: string, avatarUrl: string | null, bio: string | null): Promise<User> {
        const db = openConnection();
        try {
            const statement = db.prepare('UPDATE users SET username = ?, email = ?, password = ?, avatarUrl = ?, bio = ? WHERE userId = ?');
            const result = await statement.run(username, email, password, avatarUrl, bio, id);
            if (result.changes === 0) {
                throw new Error('User not found');
            }
            const user = await this.getById(id);
            if (!user) throw new Error('User not found');
            return user;
        } finally {
            db.close();
        }
    }

    async remove(id: number): Promise<boolean> {
        const db = openConnection();
        try {
            const statement = db.prepare('DELETE FROM users WHERE userId = ?');
            const result = await statement.run(id);
            return result.changes > 0;
        } finally {
            db.close();
        }
    }

    async getById(id: number): Promise<User | null> {
        const db = openConnection();
        try {
            const statement = db.prepare('SELECT * FROM users WHERE userId = ?');
            const result = await statement.get(id);
            if (result === undefined) {
                return null;
            }
            const typedResult = result as UserData;
            return new User(typedResult.userId, typedResult.username, typedResult.email, typedResult.password, typedResult.creationDate, typedResult.avatarUrl, typedResult.bio);
        } finally {
            db.close();
        }
    }

    async getAll(): Promise<User[]> {
        const users: User[] = [];
        const db = openConnection();
        try {
            const statement = db.prepare('SELECT * FROM users');

            for await (const row of statement.iterate()) {
                const typedRow = row as UserData;
                users.push(new User(typedRow.userId, typedRow.username, typedRow.email, typedRow.password, typedRow.creationDate, typedRow.avatarUrl, typedRow.bio));
            }

            return users;
        } finally {
            db.close();
        }
    }

    // findUserByUsername
    async findUserByUsername(username: string): Promise<User | null> {
        const db = openConnection();
        try {
            const statement = db.prepare('SELECT * FROM users WHERE username = ?');
            const result = await statement.get(username);
            if (result === undefined) {
                return null;
            }
            const typedResult = result as UserData;
            return new User(typedResult.userId, typedResult.username, typedResult.email, typedResult.password, typedResult.creationDate, typedResult.avatarUrl, typedResult.bio);
        } finally {
            db.close();
        }
    }
}
