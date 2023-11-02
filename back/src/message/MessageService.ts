import { ChannelData } from '../channel/Channel';
import { ServerData } from '../server/Server';
import { UserData } from '../user/User';
import { Message, MessageData } from './Message';

export interface MessageService {
    add(owner: UserData, content: string, server: ServerData, channel: ChannelData): Promise<Message>;

    update(id: number, content: string): Promise<Message>;

    remove(id: number): Promise<boolean>;

    getAll(): Promise<Message[]>;

    getById(id: number): Promise<Message | null>;
}
