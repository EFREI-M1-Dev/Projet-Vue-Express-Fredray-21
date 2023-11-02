import * as fs from 'fs';
import {openConnection} from "../../db";
import {User, UserData} from '../user/User';
import {UserBDDService} from '../user/UserBDDService';
import {Server, ServerData} from '../server/Server';
import {ServerBDDService} from '../server/ServerBDDService';
import { MessageService } from './MessageService';
import { Message, MessageData } from './Message';
import { ChannelData } from '../channel/Channel';
import { ChannelBDDService } from '../channel/ChannelBDDService';


export class MessageBDDService implements MessageService {

    add(owner: UserData, content: string, server: ServerData, channel: ChannelData): Message {
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

            const ownerFormated = userService.getById(owner.userId);
            if (!ownerFormated) throw new Error('Owner not found');
            const serverFormated = serverService.getById(server.serverId);
            if (!serverFormated) throw new Error('Server not found');
            const channelFormated = channelService.getById(channel.channelId);
            if (!channelFormated) throw new Error('Channel not found');
            return new Message(messageId, ownerFormated, new Date(creationDate), content, serverFormated, channelFormated);
        } finally {
            db.close();
        }
    }

    update(id: number, content: string): Message {
        throw new Error('Method not implemented.');
    }

    remove(id: number): Boolean {
        const db = openConnection();
        try {
            const statement = db.prepare('DELETE FROM messages WHERE messageId = ?');
            const info = statement.run(id);
            return info.changes > 0;
            return true;
        } finally {
            db.close();
        }
    }

    getAll(): Message[] {
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
                const server = serverService.getById(typedRow.serverId);
                if (!server) throw new Error('Server not found');
                const user = userService.getById(typedRow.owner);
                if (!user) throw new Error('User not found');
                const channel = channelService.getById(typedRow.channelId);
                if (!channel) throw new Error('Channel not found');

                messages.push(new Message(typedRow.messageId, user, typedRow.creationDate, typedRow.content, server, channel));
            }
            return messages;

        } finally {
            db.close();
        }
    }

    getById(id: number): Message | null {
        const db = openConnection();
        const serverService = new ServerBDDService();
        const userService = new UserBDDService();
        const channelService = new ChannelBDDService();

        try {
            const statement = db.prepare('SELECT * FROM messages WHERE messageId = ?');
            const result = statement.get(id);
            if (!result) return null;
            const typedRow = result as MessageData;
            const server = serverService.getById(typedRow.serverId);
            if (!server) throw new Error('Server not found');
            const user = userService.getById(typedRow.owner);
            if (!user) throw new Error('User not found');
            const channel = channelService.getById(typedRow.channelId);
            if (!channel) throw new Error('Channel not found');

            return new Message(typedRow.messageId, user, new Date(typedRow.creationDate), typedRow.content, server, channel);
        } finally {
            db.close();
        }
    }
}
