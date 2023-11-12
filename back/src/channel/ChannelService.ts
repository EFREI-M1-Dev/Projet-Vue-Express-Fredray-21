import { ServerData } from '../server/Server';
import { Channel } from './Channel';

export interface ChannelService {
    add(channelName: string, description: string | null, server: ServerData): Promise<Channel>;
    update(id: number, channelName: string, description: string | null): Promise<Channel>;
    remove(id: number): Promise<boolean>;
    getAll(): Promise<Channel[]>;
    getById(id: number): Promise<Channel | null>;
    getByServer(serverId: number): Promise<Channel[]>;
}
