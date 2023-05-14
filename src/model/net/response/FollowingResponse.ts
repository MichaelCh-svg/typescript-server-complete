import { User } from "../../domain/User";
import { PagedResponse } from "./PagedResponse";

export class FollowingResponse extends PagedResponse{
    followers: User[];
    constructor(success: boolean, followers: User[], hasMorePages: boolean, message: String | null = null){
        super(success, hasMorePages, message);
        this.followers = followers;
    }
}