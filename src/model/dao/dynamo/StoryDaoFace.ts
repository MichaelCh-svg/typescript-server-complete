import { PostStatusRequest, Status, StoryFeedRequest } from "../../entities";
import { IStoryDao } from "../IDaoFactory";
import { PostStatusToSQSRequest } from "./PostStatusToSQSRequest";
import { postStatusToSQSFromSQSService } from "./SQSService";
import { StoryDao } from "./StoryDAO";
import { UserDao } from "./UserDAO";

export class StoryDaoFace implements IStoryDao{

    private getStoryDao() {return new StoryDao() };
    private getUserDao() { return new UserDao()};

    async getStoryList(request: StoryFeedRequest, username: string): Promise<[Status[], boolean]> {
        let user = await this.getUserDao().getUser(username);
        let [statusList, hasMorePages] = await this.getStoryDao().getStatusList(user, request.limit, request.lastItem);
        return[statusList, hasMorePages];
    }
    async putStory(event: PostStatusRequest, username: string): Promise<void> {
        await postStatusToSQSFromSQSService(event, username);
        return;
    }   
}