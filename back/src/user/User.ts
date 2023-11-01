export interface UserData {
    userId: number;
    username: string;
    email: string;
    password: string;
    creationDate: Date;
    avatarUrl: string;
    bio: string;
}
export class User {
    constructor(
        private userId: number,
        private username: string,
        private email: string,
        private password: string,
        private creationDate: Date,
        private avatarUrl: string,
        private bio: string,
    ) {
    }


    getId(): number {
        return this.userId;
    }

    getUsername(): string {
        return this.username;
    }

    getEmail(): string {
        return this.email;
    }

    getPassword(): string {
        return this.password;
    }

    getCreationDate(): Date {
        return this.creationDate;
    }

    getAvatarUrl(): string {
        return this.avatarUrl;
    }

    getBio(): string {
        return this.bio;
    }


}
