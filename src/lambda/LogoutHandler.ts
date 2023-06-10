import { AuthorizedRequest } from "../model/dao/net/request/AuthorizedRequest";
import { Response } from "../model/dao/net/response/Response";


export const handler = async(event: AuthorizedRequest) => {
    // TODO implement
    return new Response(true);
};