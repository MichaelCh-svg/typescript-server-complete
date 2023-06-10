import { User } from "../../domain/User"
import { AuthToken } from "../../domain/AuthToken"
import { Response } from "./Response"

export class IsFollowingResponse extends Response{

    follows: boolean
    
    constructor(success: boolean, follows: boolean, message: String | null = null){
        super(success, message);
        this.follows = follows;
    }
}