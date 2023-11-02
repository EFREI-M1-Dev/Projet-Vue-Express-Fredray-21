import { ServerData } from '../server/Server';
import { User, UserData } from '../user/User';
import { Channel } from './Channel';
import { ChannelService } from './ChannelService';

export class ChannelController {
    constructor(private channelService: ChannelService) {
    }

    add(channelName: string, description: string | null, server: ServerData): Channel {
        return this.channelService.add(channelName, description, server);
    }

    update(id: number, channelName: string, description: string | null): Channel {
        return this.channelService.update(id, channelName, description);
    }

    getById(id: number): Channel | null {
        return this.channelService.getById(id);
    }

    remove(id: number): Boolean {
        return this.channelService.remove(id);
    }

    getAll(): Channel[] {
        return this.channelService.getAll();
    }

}
