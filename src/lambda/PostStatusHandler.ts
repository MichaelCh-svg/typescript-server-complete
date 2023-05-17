import { PostStatusRequest } from "../model/net/request/PostStatusRequest";
import { postStatusToSQS } from "../model/service/StatusService";


export const handler = async(event: PostStatusRequest) => {
    // TODO implement
    return postStatusToSQS(event);
};