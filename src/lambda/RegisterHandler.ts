import { RegisterRequest } from "../model/dao/net/request/RegisterRequest";
import { getUserService } from "./factory/factory";


export const handler = async(event: RegisterRequest) => {
    // TODO implement
    return getUserService().register(event);
};