import { IsFollowRequest } from "../model/net/request/IsFollowRequest";
import { isFollowingFromService } from "../model/service/FollowService";

export const handler = async(event: IsFollowRequest) => {
    // TODO implement
    return isFollowingFromService(event);
};