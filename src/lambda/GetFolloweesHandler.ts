import { FollowListRequest } from "../model/entities";
import { getFollowService } from "./factory/factory";



export const handler = async(event: FollowListRequest) => {
    // TODO implement
    let deseralizedRequest = FollowListRequest.fromJson(event);
    return getFollowService().getFollowees(deseralizedRequest);
};