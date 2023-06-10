import { FollowUnfollowRequest } from "../model/dao/net/request/FollowUnfollowRequest";
import { getFollowService } from "./factory/factory";


export const handler = async(event: FollowUnfollowRequest) => {
    // TODO implement
    return getFollowService().unfollow(event);
};