import { AuthToken } from "../../domain/AuthToken";
import { AuthorizedRequest } from "./AuthorizedRequest";

export class FollowUnfollowRequest extends AuthorizedRequest{

    alias: string;
    aliasToFollow: string;

    constructor(alias: string, aliasToFollow: string, token: AuthToken | null){
        super(token);
        this.alias = alias;
        this.aliasToFollow = aliasToFollow
    }
}