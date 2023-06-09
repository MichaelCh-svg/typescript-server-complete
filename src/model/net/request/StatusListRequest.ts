import { AuthToken } from "../../domain/AuthToken";
import { Status } from "../../domain/Status";
import { User } from "../../domain/User";
import { AuthorizedRequest } from "./AuthorizedRequest";

export class StatusListRequest extends AuthorizedRequest{

    authorUser: User;
    lastStatus: Status | null;
    limit: number;

    constructor(authorUser: User, lastStatus: Status | null, token: AuthToken | null, limit: number){
        super(token);
        this.authorUser = authorUser;
        this.lastStatus = lastStatus
        this.limit = limit;
    }
}