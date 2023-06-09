import { FollowerFollowingCountRequest } from "../model/net/request/FollowerFollowingCountRequest";
import { getFollowingCount } from "../model/service/FollowService";

export const handler = async(event: FollowerFollowingCountRequest) => {
    // TODO implement
    return getFollowingCount(event);
};