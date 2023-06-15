import { Status } from "../../domain/Status";
import { IStoryDao } from "../IDaoFactory";
import { StoryFeedRequest, PostStatusRequest } from "../net/Request";
import { postStatusToSQSFromSQSService } from "./SQSService";
import { StoryDao } from "./StoryDao";

export class StoryDaoFace implements IStoryDao{
    private storyDao = new StoryDao();
    async getStoryList(request: StoryFeedRequest): Promise<[Status[], boolean]> {
        let [statusList, hasMorePages] = await this.storyDao.getStatusList(request.user, request.limit, request.lastStatus);
        return[statusList, hasMorePages];
    }
    async putStory(event: PostStatusRequest): Promise<void> {
        await postStatusToSQSFromSQSService(event);
        return;
    }   
}