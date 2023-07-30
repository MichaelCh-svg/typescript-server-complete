import { IFeedDao, IDaoFactory, IStoryDao } from "../dao/IDaoFactory";
import { PostStatusRequest, TweeterResponse, StoryFeedRequest, StoryFeedResponse } from "../entities";
import { TokenService } from "./TokenService";


export class StatusService{

    private storyDao : IStoryDao;
    private feedDao: IFeedDao;
    private tokenService: TokenService;

    constructor(daoFactory: IDaoFactory){
        this.storyDao = daoFactory.getStoryDao();;
        this.feedDao = daoFactory.getFeedDao();
        this.tokenService = new TokenService(daoFactory);
    }
    async getFeed(event: StoryFeedRequest){

        let username = await this.tokenService.validateToken(event.token);

        let [statusList, hasMorePages] = await this.feedDao.getFeedList(username, event.lastItem, event.limit);
        return new StoryFeedResponse(true, hasMorePages, statusList, 'feed');
    }
    
    async getStory(event: StoryFeedRequest){
    
        await this.tokenService.validateToken(event.token);

        let [statusList, hasMorePages] = await this.storyDao.getStoryList(event, event.username);
        return new StoryFeedResponse(true, hasMorePages, statusList, 'story');
    }
    
   
    async postStatus(event: PostStatusRequest){
        
        let username = await this.tokenService.validateToken(event.token);
        
        await this.storyDao.putStory(event, username);
        return new TweeterResponse(true, username + " posted " + event.post);
    }
}
