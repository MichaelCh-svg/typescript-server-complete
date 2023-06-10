import { GetUserRequest } from "../model/dao/net/request/GetUserRequest";
import { getUserService } from "./factory/factory";


export const handler = async(event: GetUserRequest) => {
    // TODO implement
    return getUserService().getUserFromService(event);
};