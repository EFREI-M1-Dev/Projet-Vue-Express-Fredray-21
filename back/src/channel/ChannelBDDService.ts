import * as fs from 'fs';
import {openConnection} from '../../db/db';
import {User, UserData} from '../user/User';
import {UserBDDService} from '../user/UserBDDService';
import {ChannelService} from './ChannelService';
import {Channel, ChannelData} from './Channel';
import {Server, ServerData} from '../server/Server';
import {ServerBDDService} from '../server/ServerBDDService';

export class ChannelBDDService implements ChannelService {
    async add(channelName: string, description: string | null, server: ServerData): Promise<Channel> {
        const db = openConnection();
        const serverService = new ServerBDDService();

        try {
            const creationDate = new Date().getTime();
            const statement = db.prepare('INSERT INTO channels (channelName, description, serverId, creationDate) VALUES (?, ?, ?, ?)');
            const info = statement.run(channelName, description, server.serverId, creationDate);
            if (info.changes !== 1) throw new Error('Failed to insert channel');
            const channelId = Number(info.lastInsertRowid);

            const serverFormated = await serverService.getById(server.serverId);
            if (!serverFormated) throw new Error('Server not found');
            return new Channel(channelId, channelName, description || '', new Date(creationDate), serverFormated);
        } finally {
            db.close();
        }
    }

    async update(id: number, channelName: string, description: string | null): Promise<Channel> {
        const db = openConnection();
        try {
            const statement = db.prepare('UPDATE channels SET channelName = ?, description = ? WHERE channelId = ?');
            const info = statement.run(channelName, description, id);
            if (info.changes !== 1) throw new Error('Failed to update channel');
            const channel = await this.getById(id);
            if (!channel) throw new Error('Channel not found');
            return channel;
        } finally {
            db.close();
        }
    }

    async remove(id: number): Promise<boolean> {
        const db = openConnection();
        try {
            const statement = db.prepare('DELETE FROM channels WHERE channelId = ?');
            const info = statement.run(id);
            return info.changes > 0;
        } finally {
            db.close();
        }
    }

    async getAll(): Promise<Channel[]> {
        const channels: Channel[] = [];
        const db = openConnection();
        const serverService = new ServerBDDService();

        try {
            const statement = db.prepare('SELECT * FROM channels');
            const result = statement.all();
            for (const row of result) {
                const typedRow = row as ChannelData;
                const server = await serverService.getById(typedRow.serverId);
                if (!server) throw new Error('Server not found');
                channels.push(new Channel(typedRow.channelId, typedRow.channelName, typedRow.description, typedRow.creationDate, server));
            }
            return channels;
        } finally {
            db.close();
        }
    }

    async getById(id: number): Promise<Channel | null> {
        const db = openConnection();
        try {
            const statement = db.prepare('SELECT * FROM channels WHERE channelId = ?');
            const result = statement.get(id);
            if (result === undefined) {
                return null;
            }
            const typedRow = result as ChannelData;
            const serverService = new ServerBDDService();
            const server = await serverService.getById(typedRow.serverId);
            if (!server) throw new Error('Server not found');
            return new Channel(typedRow.channelId, typedRow.channelName, typedRow.description, typedRow.creationDate, server);
        } finally {
            db.close();
        }
    }

    async getByServer(serverId: number): Promise<Channel[]> {
        const channels: Channel[] = [];
        const db = openConnection();
        const serverService = new ServerBDDService();

        try {
            const statement = db.prepare('SELECT * FROM channels WHERE serverId = ?');
            const result = statement.all(serverId);
            for (const row of result) {
                const typedRow = row as ChannelData;
                const server = await serverService.getById(typedRow.serverId);
                if (!server) throw new Error('Server not found');
                channels.push(new Channel(typedRow.channelId, typedRow.channelName, typedRow.description, typedRow.creationDate, server));
            }
            return channels;
        } finally {
            db.close();
        }
    }
}
