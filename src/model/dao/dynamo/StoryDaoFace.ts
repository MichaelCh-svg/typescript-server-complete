import { Status } from "../../domain/Status";
import { IStoryDao } from "../IDaoFactory";
import { StatusListRequest } from "../net/request/StatusListRequest";
import { StoryDao } from "./StoryDao";

export class StoryDaoFace implements IStoryDao{
    private storyDao = new StoryDao();
    async getStatusList(request: StatusListRequest): Promise<[Status[], boolean]> {
        let [statusList, hasMorePages] = await this.storyDao.getStatusList(request.authorUser, request.limit, request.lastStatus);
        return[statusList, hasMorePages];
    }
    putStory(alias: string, timestamp: number, post: string): Promise<void> {
        return this.storyDao.putStory(alias, timestamp, post);
    }   
}