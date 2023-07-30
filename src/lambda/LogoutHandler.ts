import { AuthorizedRequest, TweeterResponse } from "../model/entities";
import { getUserService } from "./factory/factory";


export const handler = async(event: AuthorizedRequest) => {
    // TODO implement
    let deseralizedRequest = AuthorizedRequest.fromJson(event);
    await getUserService().logout(deseralizedRequest);
    return new TweeterResponse(true);
};