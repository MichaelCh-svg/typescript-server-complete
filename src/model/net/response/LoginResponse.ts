import { User } from "../../domain/User"
import { AuthToken } from "../../domain/AuthToken"
import { Response } from "./Response"
export class LoginResponse extends Response{

    user: User | null;
    authToken: AuthToken | null;
    
    constructor(success: boolean, user: User | null, authToken: AuthToken | null, message: String | null = null){
        super(success, message);
        this.user = user;
        this.authToken = authToken;
    }
}