import { PostStatusRequest } from "../model/entities";
import { getStatusService } from "./factory/factory";



export const handler = async(event: PostStatusRequest) => {
    // TODO implement
    let deseralizedRequest = PostStatusRequest.fromJson(event);
    return getStatusService().postStatus(deseralizedRequest);
};