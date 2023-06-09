import { StatusListRequest } from "../model/net/request/StatusListRequest";
import { getFeed } from "../model/service/StatusService";

export const handler = async(event: StatusListRequest) => {
    // TODO implement
    return getFeed(event);
};