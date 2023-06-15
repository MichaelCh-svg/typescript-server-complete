import { OtherUserRequest } from "../model/dao/net/Request";
import { getFollowService } from "./factory/factory";


export const handler = async(event: OtherUserRequest) => {
    // TODO implement
    let deseralizedRequest = OtherUserRequest.fromJson(event);
    console.log('deserialized is following handler OtherUserRequest ' + JSON.stringify(deseralizedRequest));
    console.log('is following handler OtherUserRequest ' + JSON.stringify(event));
    return getFollowService().isFollowingFromService(deseralizedRequest);
};