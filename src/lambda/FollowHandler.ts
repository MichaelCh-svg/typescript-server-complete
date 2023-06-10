import { getFollowService } from "./factory/factory";
import { FollowUnfollowRequest } from "../model/dao/net/request/FollowUnfollowRequest";


export const handler = async(event: FollowUnfollowRequest) => {
    // TODO implement
    return getFollowService().follow(event);
};