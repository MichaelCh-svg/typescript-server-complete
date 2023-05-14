import { LoginRequest } from "../model/net/request/LoginRequest";
import { login } from "../model/service/UserService"


export const handler = async(event: LoginRequest) => {
    // TODO implement
    return login(event);
};