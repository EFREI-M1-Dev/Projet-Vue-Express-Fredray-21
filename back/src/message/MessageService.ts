import {ChannelData} from '../channel/Channel';
import {ServerData} from '../server/Server';
import {UserData} from '../user/User';
import {Message, MessageData} from './Message';

export interface MessageService {
    add(owner: UserData, content: string, server: ServerData, channel: ChannelData): Message;

    update(id: number, content: string): Message;

    remove(id: number): Boolean;

    getAll(): Message[];

    getById(id: number): Message | null;
}