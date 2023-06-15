import { AuthorizedRequest } from "../model/dao/net/Request";
import { Response } from "../model/dao/net/Response";


export const handler = async(event: AuthorizedRequest) => {
    // TODO implement
    let deseralizedRequest = AuthorizedRequest.fromJson(event);
    return new Response(true);
};