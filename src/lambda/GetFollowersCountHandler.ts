import { FollowerFollowingCountRequest } from "../model/net/request/FollowerFollowingCountRequest";
import { getFollowersCount } from "../model/service/FollowService";

export const handler = async(event: FollowerFollowingCountRequest) => {
    // TODO implement
    return getFollowersCount(event);
};