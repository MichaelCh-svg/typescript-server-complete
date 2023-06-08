import { StoryRequest } from "../model/net/request/StoryRequest";
import { getStory } from "../model/service/StatusService";

export const handler = async(event: StoryRequest) => {
    // TODO implement
    return getStory(event);
};