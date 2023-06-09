import { AuthToken } from "../../domain/AuthToken";

export class FollowUnfollowRequest{

    alias: string;
    aliasToFollow: string;
    token: AuthToken | null;

    constructor(alias: string, aliasToFollow: string, token: AuthToken | null){
        this.alias = alias;
        this.aliasToFollow = aliasToFollow
        this.token = token;
    }
}