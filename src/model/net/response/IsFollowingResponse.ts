import { User } from "../../domain/User"
import { AuthToken } from "../../domain/AuthToken"
import { Response } from "./Response"

export class IsFollowingResponse extends Response{

    isFollowing: boolean
    
    constructor(success: boolean, isFollowing: boolean, message: String | null = null){
        super(success, message);
        this.isFollowing = isFollowing;
    }
}