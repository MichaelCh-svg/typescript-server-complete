import { RegisterRequest } from "../model/entities";
import { getUserService } from "./factory/factory";


export const handler = async(event: RegisterRequest) => {
    // TODO implement
    return getUserService().register(event);
};