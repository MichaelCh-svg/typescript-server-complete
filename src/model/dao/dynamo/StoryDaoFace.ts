import { Status } from "../../domain/Status";
import { IStoryDao } from "../IDaoFactory";
import { PostStatusRequest } from "../net/request/PostStatusRequest";
import { StatusListRequest } from "../net/request/StatusListRequest";
import { postStatusToSQSFromSQSService } from "./SQSService";
import { StoryDao } from "./StoryDao";

export class StoryDaoFace implements IStoryDao{
    private storyDao = new StoryDao();
    async getStatusList(request: StatusListRequest): Promise<[Status[], boolean]> {
        let [statusList, hasMorePages] = await this.storyDao.getStatusList(request.authorUser, request.limit, request.lastStatus);
        return[statusList, hasMorePages];
    }
    async putStory(event: PostStatusRequest): Promise<void> {
        await postStatusToSQSFromSQSService(event);
        return;
    }   
}