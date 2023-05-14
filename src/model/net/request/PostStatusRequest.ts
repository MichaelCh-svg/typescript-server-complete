import { Status } from "../../domain/Status";
import { AuthToken } from "../../domain/AuthToken";

export class PostStatusRequest{

    status: Status;
    authToken: AuthToken | null;

    constructor(authToken: AuthToken | null, status: Status){
        this.authToken = authToken;
        this.status = status;
    }
}