import { PostStatusRequest } from "../model/dao/net/request/PostStatusRequest";
import { getStatusService } from "./factory/factory";



export const handler = async(event: PostStatusRequest) => {
    // TODO implement
    return getStatusService().postStatusToSQS(event);
};