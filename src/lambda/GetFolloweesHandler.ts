import { FollowListRequest } from "../model/dao/net/Request";
import { getFollowService } from "./factory/factory";



export const handler = async(event: FollowListRequest) => {
    // TODO implement
    let deseralizedRequest = FollowListRequest.fromJson(event);
    return getFollowService().getFollowees(deseralizedRequest);
};