import { StoryFeedRequest } from "../model/dao/net/Request";
import { getStatusService } from "./factory/factory";

export const handler = async(event: StoryFeedRequest) => {
    // TODO implement
    let deseralizedRequest = StoryFeedRequest.fromJson(event);
    return getStatusService().getFeed(deseralizedRequest);
};