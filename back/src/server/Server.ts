import {User} from "../user/User";

export interface ServerData {
    serverId: number;
    owner: number;
    creationDate: Date;
    serverName: string;
    description: string;
    imageUrl: string;
}

export class Server {
    constructor(
        private serverId: number,
        private owner: User,
        private creationDate: Date,
        private serverName: string,
        private description: string,
        private imageUrl: string
    ) {
    }

    getId(): number {
        return this.serverId;
    }

    getOwner(): User {
        return this.owner;
    }

    getCreationDate(): Date {
        return this.creationDate;
    }

    getServerName(): string {
        return this.serverName;
    }

    getDescription(): string {
        return this.description;
    }

    getImageUrl(): string {
        return this.imageUrl;
    }
}
