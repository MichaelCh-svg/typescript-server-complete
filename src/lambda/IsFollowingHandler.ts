import { IsFollowRequest } from "../model/dao/net/request/IsFollowRequest";
import { getFollowService } from "./factory/factory";


export const handler = async(event: IsFollowRequest) => {
    // TODO implement
    return getFollowService().isFollowingFromService(event);
};