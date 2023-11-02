import { Server } from "../server/Server";

export interface ChannelData {
    channelId: number;
    channelName: string;
    description: string;
    creationDate: Date;
    serverId: number;
}
export class Channel {
    constructor(
        private channelId: number,
        private channelName : string,
        private description: string,
        private creationDate: Date,
        private server: Server
    ) {
    }

}
