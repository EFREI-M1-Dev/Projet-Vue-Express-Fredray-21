import {Server, ServerData} from './Server';
import {ServerService} from './ServerService';

import * as fs from 'fs';
import {openConnection} from "../../db";
import {User, UserData} from '../user/User';
import {UserBDDService} from '../user/UserBDDService';
import { Channel, ChannelData } from '../channel/Channel';
import path from 'path';

export class ServerBDDService implements ServerService {

    async add(serverName: string, description: string | null, owner: UserData): Promise<Server> {
        const db = openConnection();
        const userService = new UserBDDService();

        try {
            const ownerFormated = await userService.findUserByUsername(owner.username);
            if (!ownerFormated) throw new Error('Owner not found');
            const creationDate = new Date().getTime();
            const statement = db.prepare('INSERT INTO servers (serverName, description, owner, creationDate) VALUES (?, ?, ?, ?)');
            const info = statement.run(serverName, description, ownerFormated.getId(), creationDate);
            if (info.changes !== 1) throw new Error('Failed to insert server');
            const serverId = Number(info.lastInsertRowid);
            const server = await this.getById(serverId);
            if (!server) throw new Error('Server not found');

            const statement2 = db.prepare('INSERT INTO memberships (userId, serverId) VALUES (?, ?)');
            const info2 = statement2.run(ownerFormated.getId(), server.getId());
            if (info2.changes !== 1) throw new Error('Failed to insert membership');

            return server;
        } finally {
            db.close();
        }
    }

    async update(id: number, serverName: string, description: string | null, imageUrl: string | null): Promise<Server> {
        const db = openConnection();
        try {
            const statement = db.prepare('UPDATE servers SET serverName = ?, description = ?, imageUrl = ? WHERE serverId = ?');
            const info = statement.run(serverName, description, imageUrl, id);
            if (info.changes !== 1) throw new Error('Failed to update server');
            const server = await this.getById(id);
            if (!server) throw new Error('Server not found');
            return server;
        } finally {
            db.close();
        }
    }

    async remove(id: number): Promise<boolean> {
        const db = openConnection();
        try {
            const statement = db.prepare('DELETE FROM servers WHERE serverId = ?');
            const info = statement.run(id);
            return info.changes > 0;
        } finally {
            db.close();
        }
    }

    async getAll(): Promise<Server[]> {
        const servers: Server[] = [];
        const db = openConnection();
        const userService = new UserBDDService();

        try {
            const statement = db.prepare('SELECT * FROM servers');

            for (const row of statement.iterate()) {
                const typedRow = row as ServerData;

                const owner = await userService.getById(typedRow.owner); // Utilisez await ici
                if (!owner) throw new Error('Owner not found');
                servers.push(new Server(typedRow.serverId, owner, typedRow.creationDate, typedRow.serverName, typedRow.description, typedRow.imageUrl));
            }

            return servers;
        } finally {
            db.close();
        }
    }

    async getById(id: number): Promise<Server | null> {
        const db = openConnection();
        try {
            const statement = db.prepare('SELECT * FROM servers WHERE serverId = ?');
            const result = statement.get(id);
            if (result === undefined) {
                return null;
            }
            const typedResult = result as ServerData;
            const userService = new UserBDDService();
            const owner = await userService.getById(typedResult.owner); // Utilisez await ici
            if (!owner) throw new Error('Owner not found');
            return new Server(typedResult.serverId, owner, typedResult.creationDate, typedResult.serverName, typedResult.description, typedResult.imageUrl);
        } finally {
            db.close();
        }
    }

    // get all servers by user =  db.prepare('SELECT servers.* FROM servers INNER JOIN memberships ON servers.serverId = memberships.serverId INNER JOIN users ON memberships.userId = users.userId WHERE users.username = ?');
    // get all users by server :
    async getUsersByServer(id: number): Promise<User[]> {
        const users: User[] = [];
        const db = openConnection();
        const userService = new UserBDDService();

        try {
            const statement = db.prepare('SELECT users.* FROM users INNER JOIN memberships ON users.userId = memberships.userId INNER JOIN servers ON memberships.serverId = servers.serverId WHERE servers.serverId = ?');
            for (const row of statement.iterate(id)) {
                const typedRow = row as UserData;

                users.push(new User(typedRow.userId, typedRow.username, typedRow.email, typedRow.password, typedRow.creationDate, typedRow.avatarUrl, typedRow.bio));
            }

            return users;
        } finally {
            db.close();
        }
    }

    // getUsersCountByServer
    async getUsersCountByServer(id: number): Promise<number> {
        const db = openConnection();
        try {
            const statement = db.prepare('SELECT COUNT(*) AS count FROM users INNER JOIN memberships ON users.userId = memberships.userId INNER JOIN servers ON memberships.serverId = servers.serverId WHERE servers.serverId = ?');
            const result = statement.get(id);
            if (result === undefined) {
                return 0;
            }
            const typedResult = result as {count: number};
            return typedResult.count;
        } finally {
            db.close();
        }
    }

    // get first channel of server
    async getFirstChannelByServer(id: number): Promise<Channel> {
        const db = openConnection();
        try {
            const statement = db.prepare('SELECT * FROM channels WHERE serverId = ? LIMIT 1');
            const result = statement.get(id);
            if (result === undefined) {
                throw new Error('No channel found');
            }
            const typedResult = result as ChannelData;
            const server = await this.getById(typedResult.serverId);
            if (!server) throw new Error('Server not found');
            return new Channel(typedResult.channelId, typedResult.channelName, typedResult.description, typedResult.creationDate, server);
        } finally {
            db.close();
        }
    }

    async uploadImage(id: number, image: string, imageName: string): Promise<boolean> {
            try {
                const base64Data = image.replace(/^data:image\/\w+;base64,/, '');
                const buffer = Buffer.from(base64Data, 'base64');
                const folderPath = 'public/images/';

                if (!fs.existsSync(folderPath)) {
                    fs.mkdirSync(folderPath, { recursive: true });
                }

                const filePath = path.join(folderPath, imageName);

                fs.writeFileSync(filePath, buffer);

                return true;
            } catch (error) {
                console.error('Erreur lors de l\'upload de l\'image:', error);
                throw new Error('Erreur lors de l\'upload de l\'image');
                return false;
            }
    }
}
