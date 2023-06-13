
import { Status } from "../../../domain/Status";
import { PagedResponse } from "./PagedResponse";

export class StoryFeedResponse extends PagedResponse{
    statusList: Status[];
    constructor(success: boolean, statusList: Status[], hasMorePages: boolean, message: String | null = null){
        super(success, hasMorePages, message);
        this.statusList = statusList;
    }
}