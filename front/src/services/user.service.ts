import {User} from "@/model/user";
import axios from "axios";

export class UserService {
    async addUser(username: string, passowrd: string, email: string): Promise<User> {
        return await axios.post('http://localhost:3000/api/user/', {
            username: username,
            password: passowrd,
            email: email
        })
    }

}