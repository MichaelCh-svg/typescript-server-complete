import { IFeedDao, IDaoFactory, IStoryDao } from "../dao/IDaoFactory";
import { PostStatusRequest, Response, StoryFeedRequest, StoryFeedResponse } from "../entities";
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

        await this.tokenService.validateToken(event.token);

        let [statusList, hasMorePages] = await this.feedDao.getFeedList(event.user.alias, event.lastStatus, event.limit);
        return new StoryFeedResponse(true, hasMorePages, statusList, 'feed');
    }
    
    async getStory(event: StoryFeedRequest){
    
        await this.tokenService.validateToken(event.token);

        let [statusList, hasMorePages] = await this.storyDao.getStoryList(event);
        return new StoryFeedResponse(true, hasMorePages, statusList, 'story');
    }
    
   
    async postStatus(event: PostStatusRequest){
        
        await this.tokenService.validateToken(event.token);
        
        await this.storyDao.putStory(event);
        return new Response(true, event.user.alias + " posted " + event.post);
    }
}
