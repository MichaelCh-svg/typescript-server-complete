import { PostStatusRequest } from "../model/dao/net/Request";
import { getStatusService } from "./factory/factory";



export const handler = async(event: PostStatusRequest) => {
    // TODO implement
    let deseralizedRequest = PostStatusRequest.fromJson(event);
    return getStatusService().postStatus(deseralizedRequest);
};