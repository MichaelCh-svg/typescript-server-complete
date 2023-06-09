import { AuthToken } from "../../domain/AuthToken";
import { AuthorizedRequest } from "./AuthorizedRequest";

export class FollowingRequest extends AuthorizedRequest{

    followerAlias: string;
    limit: number;
    lastFolloweeAlias: string | null;

    constructor(followerAlias: string, token: AuthToken | null, limit: number, lastFolloweeAlias: string | null){
        super(token);
        this.followerAlias = followerAlias;
        this.limit = limit;
        this.lastFolloweeAlias = lastFolloweeAlias;
    }
}