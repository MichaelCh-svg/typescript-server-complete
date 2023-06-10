import { StatusListRequest } from "../model/dao/net/request/StatusListRequest";
import { getStatusService } from "./factory/factory";


export const handler = async(event: StatusListRequest) => {
    // TODO implement
    return getStatusService().getStory(event);
};