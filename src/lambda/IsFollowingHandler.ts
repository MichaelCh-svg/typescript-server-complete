import { OtherUserRequest } from "../model/dao/net/Request";
import { getFollowService } from "./factory/factory";


export const handler = async(event: OtherUserRequest) => {
    // TODO implement
    let deseralizedRequest = OtherUserRequest.fromJson(event);
    return getFollowService().isFollowingFromService(deseralizedRequest);
};