import { StatusListRequest } from "../model/net/request/StatusListRequest";
import { getStory } from "../model/service/StatusService";

export const handler = async(event: StatusListRequest) => {
    // TODO implement
    return getStory(event);
};