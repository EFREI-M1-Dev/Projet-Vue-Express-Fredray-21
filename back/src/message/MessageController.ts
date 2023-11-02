import {ChannelData} from '../channel/Channel';
import {ServerData} from '../server/Server';
import {UserData} from '../user/User';
import {Message} from './Message';
import {MessageService} from './MessageService';

export class MessageController {
    constructor(private messageService: MessageService) {
    }

    add(owner: UserData, content: string, server: ServerData, channel: ChannelData): Message {
        return this.messageService.add(owner, content, server, channel);
    }

    update(id: number, content: string): Message {
        return this.messageService.update(id, content);
    }

    getById(id: number): Message | null {
        return this.messageService.getById(id);
    }

    remove(id: number): Boolean {
        return this.messageService.remove(id);
    }

    getAll(): Message[] {
        return this.messageService.getAll();
    }

}
