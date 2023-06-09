import { FollowUnfollowRequest } from "../model/net/request/FollowUnfollowRequest";
import { follow } from "../model/service/FollowService";

export const handler = async(event: FollowUnfollowRequest) => {
    // TODO implement
    return follow(event);
};