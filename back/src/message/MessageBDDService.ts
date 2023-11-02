import * as fs from 'fs';
import { openConnection } from '../../db';
import { UserBDDService } from '../user/UserBDDService';
import { ServerBDDService } from '../server/ServerBDDService';
import { ChannelBDDService } from '../channel/ChannelBDDService';
import { User, UserData } from '../user/User';
import { ServerData } from '../server/Server';
import { ChannelData } from '../channel/Channel';
import { Message, MessageData } from './Message';
import { MessageService } from './MessageService';

export class MessageBDDService implements MessageService {
    async add(owner: UserData, content: string, server: ServerData, channel: ChannelData): Promise<Message> {
        const db = openConnection();
        const userService = new UserBDDService();
        const serverService = new ServerBDDService();
        const channelService = new ChannelBDDService();

        try {
            const creationDate = new Date().getTime();
            const statement = db.prepare('INSERT INTO messages (owner, content, serverId, channelId, creationDate) VALUES (?, ?, ?, ?, ?)');
            const info = statement.run(owner.userId, content, server.serverId, channel.channelId, creationDate);
            if (info.changes !== 1) throw new Error('Failed to insert message');
            const messageId = Number(info.lastInsertRowid);

            const ownerFormated = await userService.getById(owner.userId);
            if (!ownerFormated) throw new Error('Owner not found');
            const serverFormated = await serverService.getById(server.serverId);
            if (!serverFormated) throw new Error('Server not found');
            const channelFormated = await channelService.getById(channel.channelId);
            if (!channelFormated) throw new Error('Channel not found');

            const message = await this.getById(messageId);
            if (!message) throw new Error('Message not found');
            return message;
        } finally {
            db.close();
        }
    }

    async update(id: number, content: string): Promise<Message> {
        throw new Error('Method not implemented.');
    }

    async remove(id: number): Promise<boolean> {
        const db = openConnection();
        try {
            const statement = db.prepare('DELETE FROM messages WHERE messageId = ?');
            const info = statement.run(id);
            return info.changes > 0;
        } finally {
            db.close();
        }
    }

    async getAll(): Promise<Message[]> {
        const messages: Message[] = [];
        const db = openConnection();
        const serverService = new ServerBDDService();
        const userService = new UserBDDService();
        const channelService = new ChannelBDDService();

        try {
            const statement = db.prepare('SELECT * FROM messages');
            const result = statement.all();
            for (const row of result) {
                const typedRow = row as MessageData;
                const server = await serverService.getById(typedRow.serverId);
                if (!server) throw new Error('Server not found');
                const user = await userService.getById(typedRow.owner);
                if (!user) throw new Error('User not found');
                const channel = await channelService.getById(typedRow.channelId);
                if (!channel) throw new Error('Channel not found');

                messages.push(new Message(typedRow.messageId, user, typedRow.creationDate, typedRow.content, server, channel));
            }
            return messages;
        } finally {
            db.close();
        }
    }

    async getById(id: number): Promise<Message | null> {
        const db = openConnection();
        const serverService = new ServerBDDService();
        const userService = new UserBDDService();
        const channelService = new ChannelBDDService();

        try {
            const statement = db.prepare('SELECT * FROM messages WHERE messageId = ?');
            const result = statement.get(id);
            if (!result) return null;
            const typedRow = result as MessageData;
            const server = await serverService.getById(typedRow.serverId);
            if (!server) throw new Error('Server not found');
            const user = await userService.getById(typedRow.owner);
            if (!user) throw new Error('User not found');
            const channel = await channelService.getById(typedRow.channelId);
            if (!channel) throw new Error('Channel not found');

            return new Message(typedRow.messageId, user, new Date(typedRow.creationDate), typedRow.content, server, channel);
        } finally {
            db.close();
        }
    }
}
