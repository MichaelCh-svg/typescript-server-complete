import { StoryFeedRequest } from "../model/entities";
import { getStatusService } from "./factory/factory";

export const handler = async(event: StoryFeedRequest) => {
    // TODO implement
    console.log('get feed request:\n' + JSON.stringify(event));
    let deseralizedRequest = StoryFeedRequest.fromJson(event);
    console.log('get feed deserialized request:\n' + JSON.stringify(deseralizedRequest));
    return getStatusService().getFeed(deseralizedRequest);
};