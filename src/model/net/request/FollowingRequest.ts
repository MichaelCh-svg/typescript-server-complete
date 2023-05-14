import { AuthToken } from "../../domain/AuthToken";

export class FollowingRequest{

    followerAlias: String | null;
    authToken: AuthToken | null;
    limit: number;
    lastFolloweeAlias: String | null;

    constructor(followerAlias: String | null, authToken: AuthToken | null, limit: number, lastFolloweeAlias: String | null){
        this.followerAlias = followerAlias;
        this.authToken = authToken;
        this.limit = limit;
        this.lastFolloweeAlias = lastFolloweeAlias;
    }
}