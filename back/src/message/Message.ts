import {Channel} from "../channel/Channel";
import {Server} from "../server/Server";
import {User} from "../user/User";

export interface MessageData {
    messageId: number;
    creationDate: Date;
    owner: number;
    content: string;
    serverId: number;
    channelId: number;
}

export class Message {
    constructor(
        private messageId: number,
        private owner: User,
        private creationDate: Date,
        private content: string,
        private server: Server,
        private channel: Channel,
    ) {
    }

}
