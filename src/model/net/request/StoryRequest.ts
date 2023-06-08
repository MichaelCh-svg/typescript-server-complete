import { AuthToken } from "../../domain/AuthToken";
import { Status } from "../../domain/Status";
import { User } from "../../domain/User";

export class StoryRequest{

    authorUser: User;
    lastStatus: Status;
    authToken: AuthToken | null;
    limit: number;

    constructor(authorUser: User, lastStatus: Status, authToken: AuthToken | null, limit: number){
        this.authorUser = authorUser;
        this.lastStatus = lastStatus
        this.authToken = authToken;
        this.limit = limit;
    }
}