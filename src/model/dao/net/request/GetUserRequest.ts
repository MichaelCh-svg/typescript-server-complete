
import { AuthToken } from "../../../domain/AuthToken";
import { AuthorizedRequest } from "./AuthorizedRequest";

export class GetUserRequest extends AuthorizedRequest{

    alias: string

    constructor(alias: string, token: AuthToken | null){
        super(token);
        this.alias = alias;
    }
}