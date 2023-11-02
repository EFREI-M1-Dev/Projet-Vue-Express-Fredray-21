import { ChannelData } from '../channel/Channel';
import { ServerData } from '../server/Server';
import { UserData } from '../user/User';
import { Message } from './Message';
import { MessageService } from './MessageService';

export class MessageController {
    constructor(private messageService: MessageService) {
    }

    async add(owner: UserData, content: string, server: ServerData, channel: ChannelData): Promise<Message> {
        return await this.messageService.add(owner, content, server, channel);
    }

    async update(id: number, content: string): Promise<Message> {
        return await this.messageService.update(id, content);
    }

    async getById(id: number): Promise<Message | null> {
        return await this.messageService.getById(id);
    }

    async remove(id: number): Promise<boolean> {
        return await this.messageService.remove(id);
    }

    async getAll(): Promise<Message[]> {
        return await this.messageService.getAll();
    }
}
