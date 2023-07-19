import { PostStatusRequest, Status, StoryFeedRequest } from "../../entities";
import { IStoryDao } from "../IDaoFactory";
import { postStatusToSQSFromSQSService } from "./SQSService";
import { StoryDao } from "./StoryDAO";

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