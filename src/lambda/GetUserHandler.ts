import { GetUserRequest } from "../model/dao/net/Request";
import { getUserService } from "./factory/factory";


export const handler = async(event: GetUserRequest) => {
    // TODO implement
    let deseralizedRequest = GetUserRequest.fromJson(event);
    return getUserService().getUserFromService(deseralizedRequest);
};