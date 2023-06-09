import { Status } from "../../domain/Status";
import { PagedResponse } from "./PagedResponse";

export class StoryFeedResponse extends PagedResponse{
    statusList: Status[];
    lastStatus: Status | null;
    constructor(success: boolean, statusList: Status[], hasMorePages: boolean, lastStatus: Status | null, message: String | null = null){
        super(success, hasMorePages, message);
        this.statusList = statusList;
        this.lastStatus = lastStatus;
    }
}