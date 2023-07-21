import { LoginRequest } from "../model/entities";
import { getUserService } from "./factory/factory";



export const handler = async(event: LoginRequest) => {

    return getUserService().loginFromService(event);
};