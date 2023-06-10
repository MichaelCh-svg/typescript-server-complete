import { LoginRequest } from "../model/dao/net/request/LoginRequest";
import { getUserService } from "./factory/factory";



export const handler = async(event: LoginRequest) => {
    // TODO implement
    return getUserService().loginFromService(event);
};