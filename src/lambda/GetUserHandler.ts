import { FollowUnfollowRequest } from "../model/net/request/FollowUnfollowRequest";
import { GetUserRequest } from "../model/net/request/GetUserRequest";
import { follow } from "../model/service/FollowService";
import { getUserFromService } from "../model/service/UserService";

export const handler = async(event: GetUserRequest) => {
    // TODO implement
    return getUserFromService(event);
};