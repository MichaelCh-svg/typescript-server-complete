import { FollowingRequest } from "../model/net/request/FollowingRequest";
import { getFollowers } from "../model/service/FollowService";

export const handler = async(event: FollowingRequest) => {
    // TODO implement
    return await getFollowers(event);
};