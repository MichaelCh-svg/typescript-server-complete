import { IFeedDao, IDaoFactory, IStoryDao, IUserDao, IFollowDao } from "../dao/IDaoFactory";
import { PostFeedToSQSRequest } from "../dao/dynamo/PostFeedToSQSRequest";
import { PostStatusToSQSRequest } from "../dao/dynamo/PostStatusToSQSRequest";
import { postStatusToSQSFromSQSService, postFeedToSQSFromSQSService } from "../dao/dynamo/SQSService";
import { PostStatusRequest } from "../dao/net/request/PostStatusRequest";
import { StatusListRequest } from "../dao/net/request/StatusListRequest";
import { Response } from "../dao/net/response/Response";
import { StoryFeedResponse } from "../dao/net/response/StoryFeedResponse";
import { User } from "../domain/User";


export class StatusService{
    private storyDao : IStoryDao;
    private feedDao: IFeedDao;
    constructor(daoFactory: IDaoFactory){
        this.storyDao = daoFactory.getStoryDao();;
        this.feedDao = daoFactory.getFeedDao();
    }
    async getFeed(event: StatusListRequest){

        //since serializaing and deserializing an object disables the 'get' function for the alias, the alias cannot be retrieved from the lambda event.
        let targetUser = User.FromJson(JSON.stringify(event.authorUser));
        if(targetUser == null) throw new Error('get Feed user json could not be converted to user object\nuser: ' + JSON.stringify(event.authorUser));
        let [statusList, hasMorePages] = await this.feedDao.getFeedList(targetUser.alias, event.lastStatus, event.limit);
        return new StoryFeedResponse(true, statusList, hasMorePages, 'feed');
    }
    
    async getStory(event: StatusListRequest){
    
        //since serializaing and deserializing an object disables the 'get' function for the alias, the alias cannot be retrieved from the lambda event.
        let targetUser = User.FromJson(JSON.stringify(event.authorUser));
        if(targetUser == null) throw new Error('get Story user json could not be converted to user object\nuser: ' + JSON.stringify(event.authorUser));
        event.authorUser = targetUser;
        if(event.lastStatus != null){
            let lastStatusUser = User.FromJson(JSON.stringify(event.lastStatus.user));
            if(lastStatusUser != null) event.lastStatus.user = lastStatusUser;
            else throw new Error("get Story last status\'s user json could not be converted to user object\nstatus: " + JSON.stringify(event.lastStatus));
        }
        let [statusList, hasMorePages] = await this.storyDao.getStatusList(event);
        return new StoryFeedResponse(true, statusList, hasMorePages, 'story');
    }
    
   
    async postStatus(event: PostStatusRequest){
        await this.storyDao.putStory(event);
        return new Response(true, event.alias + " posted " + event.post);
    }
}
