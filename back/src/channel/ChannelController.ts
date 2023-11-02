import { ServerData } from '../server/Server';
import { User, UserData } from '../user/User';
import { Channel } from './Channel';
import { ChannelService } from './ChannelService';

export class ChannelController {
    constructor(private channelService: ChannelService) {
    }

    async add(channelName: string, description: string | null, server: ServerData): Promise<Channel> {
        return this.channelService.add(channelName, description, server);
    }

    async update(id: number, channelName: string, description: string | null): Promise<Channel> {
        return this.channelService.update(id, channelName, description);
    }

    async getById(id: number): Promise<Channel | null> {
        return this.channelService.getById(id);
    }

    async remove(id: number): Promise<boolean> {
        return this.channelService.remove(id);
    }

    async getAll(): Promise<Channel[]> {
        return this.channelService.getAll();
    }
}
