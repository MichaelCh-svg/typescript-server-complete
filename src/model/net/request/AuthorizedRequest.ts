import { AuthToken } from "../../domain/AuthToken";

export class AuthorizedRequest{
    token: AuthToken | null
    constructor(token: AuthToken | null){
        this.token = token;
    }
}