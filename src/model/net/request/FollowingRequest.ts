import { AuthToken } from "../../domain/AuthToken";

export class FollowingRequest{

    followerAlias: string;
    authToken: AuthToken | null;
    limit: number;
    lastFolloweeAlias: string | null;

    constructor(followerAlias: string, authToken: AuthToken | null, limit: number, lastFolloweeAlias: string | null){
        this.followerAlias = followerAlias;
        this.authToken = authToken;
        this.limit = limit;
        this.lastFolloweeAlias = lastFolloweeAlias;
    }
}