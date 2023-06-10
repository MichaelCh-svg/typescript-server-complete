import { getFollowService } from "./factory/factory";
import { FollowingRequest } from "../model/dao/net/request/FollowingRequest";



export const handler = async(event: FollowingRequest) => {
    // TODO implement
    return getFollowService().getFollowees(event);
};