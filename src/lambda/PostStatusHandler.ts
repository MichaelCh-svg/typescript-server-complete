import { PostStatusRequest } from "../model/net/request/PostStatusRequest";
import { postStatus } from "../model/service/StatusService";


export const handler = async(event: PostStatusRequest) => {
    // TODO implement
    return postStatus(event);
};