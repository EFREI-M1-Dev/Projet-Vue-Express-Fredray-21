import {Server, ServerData} from './Server';
import {ServerService} from './ServerService';

import * as fs from 'fs';
import {openConnection} from "../../db";
import {User, UserData} from '../user/User';
import { UserBDDService } from '../user/UserBDDService';

export class ServerBDDService implements ServerService {

    add(serverName: string, description: string | null, owner: UserData): Server {
        const db = openConnection();
        const userService = new UserBDDService();

        try {
            const creationDate = new Date().getTime();
            const statement = db.prepare('INSERT INTO servers (serverName, description, owner, creationDate) VALUES (?, ?, ?, ?)');
            const info = statement.run(serverName, description, owner.userId, creationDate);
            if (info.changes !== 1) throw new Error('Failed to insert server');
            const serverId = Number(info.lastInsertRowid);

            const ownerFormated = userService.getById(owner.userId);
            if (!ownerFormated) throw new Error('Owner not found');
            return new Server(serverId, ownerFormated, new Date(creationDate), serverName, description || '');
        } finally {
            db.close();
        }
    }

    update(id: number, serverName: string, description: string | null): Server {
        const db = openConnection();
        try {
            const statement = db.prepare('UPDATE servers SET serverName = ?, description = ? WHERE serverId = ?');
            const info = statement.run(serverName, description, id);
            if (info.changes !== 1) throw new Error('Failed to update server');
            const server = this.getById(id);
            if (!server) throw new Error('Server not found');
            return server;
        } finally {
            db.close();
        }
    }

    remove(id: number): Boolean {
        const db = openConnection();
        try {
            const statement = db.prepare('DELETE FROM servers WHERE serverId = ?');
            const info = statement.run(id);
            return info.changes > 0;
            return true;
        } finally {
            db.close();
        }
    }

    getAll(): Server[] {
        const servers: Server[] = [];
        const db = openConnection();
        const userService = new UserBDDService();

        try {
            const statement = db.prepare('SELECT * FROM servers');

            for (const row of statement.iterate()) {
                const typedRow = row as ServerData;

                const owner = userService.getById(typedRow.owner);
                if (!owner) throw new Error('Owner not found');
                servers.push(new Server(typedRow.serverId, owner, typedRow.creationDate, typedRow.serverName, typedRow.description));
            }

            return servers;
        } finally {
            db.close();
        }
    }

    getById(id: number): Server | null {
        const db = openConnection();
        try {
            const statement = db.prepare('SELECT * FROM servers WHERE serverId = ?');
            const result = statement.get(id);
            if (result === undefined) {
                return null;
            }
            const typedResult = result as ServerData;
            const userService = new UserBDDService();
            const owner = userService.getById(typedResult.owner);
            if (!owner) throw new Error('Owner not found');
            return new Server(typedResult.serverId, owner, typedResult.creationDate, typedResult.serverName, typedResult.description);
        } finally {
            db.close();
        }
    }
}
