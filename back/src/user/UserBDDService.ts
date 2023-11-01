import {User, UserData} from './User';
import {UserService} from './UserService';
import * as fs from 'fs';
import {openConnection} from "../../db";

export class UserBDDService implements UserService {

    add(username: string, email: string, password: string, avatarUrl: string | null, bio: string | null): User {
        const db = openConnection();
        try {
            const creationDate = new Date().getTime();
            const statement = db.prepare('INSERT INTO users (username, email, password, creationDate, avatarUrl, bio) VALUES (?, ?, ?, ?, ?, ?)');
            const info = statement.run(username, email, password, creationDate, avatarUrl, bio);
            if (info.changes !== 1) throw new Error('Failed to insert user');
            const userId = Number(info.lastInsertRowid);
            return new User(userId, username, email, password, new Date(creationDate), avatarUrl || '', bio || '');
        } finally {
            db.close();
        }
    }

    update(id: number, username: string, email: string, password: string, avatarUrl: string | null, bio: string | null): User {
        const db = openConnection();
        try {
            const statement = db.prepare('UPDATE users SET username = ?, email = ?, password = ?, avatarUrl = ?, bio = ? WHERE userId = ?');
            const result = statement.run(username, email, password, avatarUrl, bio, id);
            if (result.changes === 0) {
                throw new Error('User not found');
            }
            return new User(id, username, email, password, new Date(), avatarUrl || '', bio || '');
        } finally {
            db.close();
        }
    }

    remove(id: number): Boolean {
        const db = openConnection();
        try {
            const statement = db.prepare('DELETE FROM users WHERE userId = ?');
            const result = statement.run(id);
            return result.changes > 0;
        } finally {
            db.close();
        }
    }


    getById(id: number): User | null {
        const db = openConnection();
        try {
            const statement = db.prepare('SELECT * FROM users WHERE userId = ?');
            const result = statement.get(id);
            if (result === undefined) {
                return null;
            }
            const typedResult = result as UserData;
            return new User(typedResult.userId, typedResult.username, typedResult.email, typedResult.password, typedResult.creationDate, typedResult.avatarUrl, typedResult.bio);
        } finally {
            db.close();
        }
    }

    getAll(): User[] {
        const users: User[] = [];
        const db = openConnection();
        try {
            const statement = db.prepare('SELECT * FROM users');

            for (const row of statement.iterate()) {
                const typedRow = row as UserData;
                users.push(new User(typedRow.userId, typedRow.username, typedRow.email, typedRow.password, typedRow.creationDate, typedRow.avatarUrl, typedRow.bio));
            }

            return users;
        } finally {
            db.close();
        }
    }

}
