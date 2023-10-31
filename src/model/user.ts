export class User {
    id: number;
    name: string;
    email: string;
    password: string;
    role: string;
    token: string;
    constructor() {
        this.id = 0;
        this.name = '';
        this.email = '';
        this.password = '';
        this.role = '';
        this.token = '';
    }
}