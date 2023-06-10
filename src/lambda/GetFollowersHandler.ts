import { FollowingRequest } from "../model/dao/net/request/FollowingRequest";
import { getFollowService } from "./factory/factory";


export const handler = async(event: FollowingRequest) => {
    // TODO implement
    return getFollowService().getFollowers(event);
};