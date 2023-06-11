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
    private userDao: IUserDao;
    private followDao: IFollowDao;
    constructor(daoFactory: IDaoFactory){
        this.storyDao = daoFactory.getStoryDao();;
        this.feedDao = daoFactory.getFeedDao();
        this.userDao = daoFactory.getUserDao();
        this.followDao = daoFactory.getFollowDao();
    }
    async getFeed(event: StatusListRequest){

        //since serializaing and deserializing an object disables the 'get' function for the alias, the alias cannot be retrieved from the lambda event.
        let targetUser = User.FromJson(JSON.stringify(event.authorUser));
        if(targetUser == null) throw new Error('get Feed user json could not be converted to user object\nuser: ' + JSON.stringify(event.authorUser));
        let [statusList, hasMorePages, lastEvaluatedStatus] = await this.feedDao.getFeedList(targetUser.alias, event.lastStatus, event.limit);
        return new StoryFeedResponse(true, statusList, hasMorePages, lastEvaluatedStatus);
    }
    
    async getStory(event: StatusListRequest){
    
        //since serializaing and deserializing an object disables the 'get' function for the alias, the alias cannot be retrieved from the lambda event.
        let targetUser = User.FromJson(JSON.stringify(event.authorUser));
        if(targetUser == null) throw new Error('get Feed user json could not be converted to user object\nuser: ' + JSON.stringify(event.authorUser));
        event.authorUser = targetUser;
        if(event.lastStatus != null){
            let lastStatusUser = User.FromJson(JSON.stringify(event.lastStatus.user));
            if(lastStatusUser != null) event.lastStatus.user = lastStatusUser;
            else throw new Error("get Feed last status\'s user json could not be converted to user object\nstatus: " + JSON.stringify(event.lastStatus));
        }
        let [statusList, hasMorePages, lastEvaluatedStatus] = await this.storyDao.getStatusList(event);
        return new StoryFeedResponse(true, statusList, hasMorePages, lastEvaluatedStatus);
    }
    
    async postStatusToSQS(event: PostStatusRequest){
        await postStatusToSQSFromSQSService(event);
        return new Response(true, event.alias + " posted " + event.post);
    }
    async postStatus(event: PostStatusToSQSRequest){
        await this.storyDao.putStory(event.alias, event.timestamp, event.post);
        await this.feedDao.putFeeds(event.alias, event.post, event.timestamp);
    
        return new Response(true, event.alias + " posted " + event.post + " at " + event.timestamp);
    }
    // async postStatusToFeed(event: PostFeedToSQSRequest){
    //     await this.feedDao.putFeeds(event.authorAlias, event.post, event.followerAliasList, event.timestamp);
    
    //     return new Response(true, event.authorAlias + " posted " + event.post + " at " + event.timestamp);
    // }
}
