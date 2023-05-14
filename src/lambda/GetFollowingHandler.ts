import { FollowingRequest } from "../model/net/request/FollowingRequest";
import { getFollowees } from "../model/service/FollowService";

export const handler = async(event: FollowingRequest) => {
    // TODO implement
    return getFollowees(event);
};