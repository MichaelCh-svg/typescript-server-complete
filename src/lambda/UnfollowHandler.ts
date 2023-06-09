import { FollowUnfollowRequest } from "../model/net/request/FollowUnfollowRequest";
import { unfollow } from "../model/service/FollowService";

export const handler = async(event: FollowUnfollowRequest) => {
    // TODO implement
    return unfollow(event);
};