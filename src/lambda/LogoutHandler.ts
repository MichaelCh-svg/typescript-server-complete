import { AuthorizedRequest } from "../model/net/request/AuthorizedRequest";
import { Response } from "../model/net/response/Response";

export const handler = async(event: AuthorizedRequest) => {
    // TODO implement
    return new Response(true);
};