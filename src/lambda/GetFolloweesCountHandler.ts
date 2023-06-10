import { getFollowService } from "./factory/factory";
import { FollowerFollowingCountRequest } from "../model/dao/net/request/FollowerFollowingCountRequest";


export const handler = async(event: FollowerFollowingCountRequest) => {
    // TODO implement
    return getFollowService().getFollowingCount(event);
};