import { User } from "../../domain/User"
import { AuthToken } from "../../domain/AuthToken"
import { Response } from "./Response"
export class GetUserResponse extends Response{

    user: User;
    
    constructor(success: boolean, user: User, message: String | null = null){
        super(success, message);
        this.user = user;
    }
}