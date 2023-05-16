import { Status } from "../../domain/Status";
import { AuthToken } from "../../domain/AuthToken";

export class PostStatusRequest{

    alias: string;
    post: string;
    token: AuthToken | null;

    constructor(alias: string, post: string, token: AuthToken | null){
        this.alias = alias;
        this.post = post;
        this.token = token;
    }
}