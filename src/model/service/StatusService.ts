import { IFeedDao, IDaoFactory, IStoryDao } from "../dao/IDaoFactory";
import { StoryFeedRequest, PostStatusRequest } from "../dao/net/Request";
import { StoryFeedResponse, Response } from "../dao/net/Response";
import { User } from "../domain/User";


export class StatusService{
    private storyDao : IStoryDao;
    private feedDao: IFeedDao;
    constructor(daoFactory: IDaoFactory){
        this.storyDao = daoFactory.getStoryDao();;
        this.feedDao = daoFactory.getFeedDao();
    }
    async getFeed(event: StoryFeedRequest){

        let [statusList, hasMorePages] = await this.feedDao.getFeedList(event.user.alias, event.lastStatus, event.limit);
        return new StoryFeedResponse(true, hasMorePages, statusList, 'feed');
    }
    
    async getStory(event: StoryFeedRequest){
    
        let [statusList, hasMorePages] = await this.storyDao.getStatusList(event);
        return new StoryFeedResponse(true, hasMorePages, statusList, 'story');
    }
    
   
    async postStatus(event: PostStatusRequest){
        await this.storyDao.putStory(event);
        return new Response(true, event.user.alias + " posted " + event.post);
    }
}
