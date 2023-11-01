import { User } from "../user/User";

export interface ServerData {
    serverId: number;
    owner: number;
    creationDate: Date;
    serverName: string;
    description: string;
}
export class Server {
    constructor(
        private serverId: number,
        private owner : User,
        private creationDate: Date,
        private serverName: string,
        private description: string
    ) {
    }





}
