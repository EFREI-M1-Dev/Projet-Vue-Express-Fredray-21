import {User} from './User';
import {Server} from '../server/Server';
import {UserService} from './UserService';
import * as bcrypt from 'bcrypt';

export class UserController {
    constructor(private userService: UserService) {
    }

    async add(username: string, email: string, password: string, avatarUrl: string | null, bio: string | null): Promise<User> {
        this.checkUsername(username);
        this.checkEmail(email);
        this.checkPassword(password);

        const saltRounds = 10;
        const passwordHashed = bcrypt.hashSync(password, saltRounds);

        return this.userService.add(username, email, passwordHashed, avatarUrl, bio);
    }

    async update(id: number, username: string, email: string, password: string, avatarUrl: string | null, bio: string | null): Promise<User> {
        this.checkId(id);
        this.checkUsername(username);
        this.checkEmail(email);
        this.checkPassword(password);

        return this.userService.update(id, username, email, password, avatarUrl, bio);
    }

    async getById(id: number): Promise<User | null> {
        this.checkId(id);

        return this.userService.getById(id);
    }

    async remove(id: number): Promise<boolean> {
        this.checkId(id);

        return this.userService.remove(id);
    }

    async getAll(): Promise<User[]> {
        return this.userService.getAll();
    }


    // 1. id est un entier positif
    private checkId(id: number): void {
        const idRegex = /^(0|[1-9]\d*)$/;
        if (!idRegex.test(String(id))) {
            throw new Error('Id is not valid, must be a positive integer');
        }
    }

    // 2. username n'est pas vide
    private checkUsername(username: string): void {
        const usernameRegex = /^\s*$/;
        if (usernameRegex.test(username)) {
            throw new Error('Username is empty');
        }
    }

    // 3. email est valide
    private checkEmail(email: string): void {
        const emailRegex = /^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,4}$/;
        if (!emailRegex.test(email)) {
            throw new Error('Email is not valid');
        }
    }

    // 4. password est assez fort (au moins 8 caractères, une majuscule, une minuscule et un chiffre)
    private checkPassword(password: string): void {
        const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).{8,}$/;
        if (!passwordRegex.test(password)) {
            throw new Error('Password is not strong enough');
        }
    }

    // findUserByUsername
    async findUserByUsername(username: string): Promise<User | null> {
        this.checkUsername(username);
        return this.userService.findUserByUsername(username);
    }

    // getServersByUser
    async getServersByUser(username: string): Promise<Server[]> {
        this.checkUsername(username);
        return this.userService.getServersByUser(username);
    }

    //getFirstServerByUser
    async getFirstServerByUser(username: string): Promise<Server | null> {
        this.checkUsername(username);
        return this.userService.getFirstServerByUser(username);
    }


}
