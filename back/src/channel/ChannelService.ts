import { ServerData } from '../server/Server';
import { Channel } from './Channel';

export interface ChannelService {
    add(channelName: string, description: string | null, server: ServerData): Channel;
    update(id: number, channelName: string, description: string | null): Channel;
    remove(id: number): Boolean;
    getAll(): Channel[];
    getById(id: number): Channel | null;
}