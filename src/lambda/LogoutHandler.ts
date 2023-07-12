import { AuthorizedRequest } from "../model/dao/net/Request";
import { Response } from "../model/dao/net/Response";
import { getUserService } from "./factory/factory";


export const handler = async(event: AuthorizedRequest) => {
    // TODO implement
    let deseralizedRequest = AuthorizedRequest.fromJson(event);
    await getUserService().logout(deseralizedRequest);
    return new Response(true);
};