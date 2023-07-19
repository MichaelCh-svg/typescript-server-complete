import { AuthorizedRequest } from "../model/entities";
import { getFollowService } from "./factory/factory";


export const handler = async(event: AuthorizedRequest) => {
    // TODO implement
    let deseralizedRequest = AuthorizedRequest.fromJson(event);
    return getFollowService().getFollowingCount(deseralizedRequest);
};