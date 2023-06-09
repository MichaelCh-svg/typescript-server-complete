import { AuthToken } from "../../domain/AuthToken";
import { Status } from "../../domain/Status";
import { User } from "../../domain/User";
import { AuthorizedRequest } from "./AuthorizedRequest";

export class FollowerFollowingCountRequest extends AuthorizedRequest{

    alias: string

    constructor(alias: string, token: AuthToken | null){
        super(token);
        this.alias = alias;
    }
}