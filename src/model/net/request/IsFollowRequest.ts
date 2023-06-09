import { AuthToken } from "../../domain/AuthToken";
import { AuthorizedRequest } from "./AuthorizedRequest";

export class IsFollowRequest extends AuthorizedRequest{

    followerAlias: string;
    followeeAlias: string;

    constructor(followerAlias: string, followeeAlias: string, token: AuthToken | null){
        super(token);
        this.followerAlias = followerAlias;
        this.followeeAlias = followeeAlias;
    }
}