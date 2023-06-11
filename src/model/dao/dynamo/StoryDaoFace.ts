import { Status } from "../../domain/Status";
import { IStoryDao } from "../IDaoFactory";
import { StatusListRequest } from "../net/request/StatusListRequest";
import { StoryDao } from "./StoryDao";

export class StoryDaoFace implements IStoryDao{
    private storyDao = new StoryDao();
    async getStatusList(request: StatusListRequest): Promise<[Status[], boolean, Status | null]> {
        let [statusList, hasMorePages, lastEvaluatedStatus] = await this.storyDao.getStatusList(request.authorUser, request.limit, request.lastStatus);
        return[statusList, hasMorePages, lastEvaluatedStatus];
    }
    putStory(alias: string, timestamp: number, post: string): Promise<void> {
        return this.storyDao.putStory(alias, timestamp, post);
    }   
}