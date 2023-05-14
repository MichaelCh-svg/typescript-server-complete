import { RegisterRequest } from "../model/net/request/RegisterRequest";
import { register } from "../model/service/UserService"


export const handler = async(event: RegisterRequest) => {
    // TODO implement
    return register(event);
};