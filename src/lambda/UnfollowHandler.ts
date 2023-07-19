import { OtherUserRequest } from "../model/entities";
import { getFollowService } from "./factory/factory";


export const handler = async(event: OtherUserRequest) => {
    // TODO implement
    let deseralizedRequest = OtherUserRequest.fromJson(event);
    return getFollowService().unfollow(deseralizedRequest);
};