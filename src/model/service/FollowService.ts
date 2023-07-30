import { IDaoFactory, IFollowDao, IUserDao } from "../dao/IDaoFactory";
import { FollowCountResponse, FollowListRequest, FollowListResponse, IsFollowingResponse, OtherUserRequest, TweeterResponse } from "../entities";
import { TokenService } from "./TokenService";

export class FollowService{

    private userDao : IUserDao;
    private followDao: IFollowDao;
    private tokenService: TokenService;

    constructor(daoFactory: IDaoFactory){
        this.userDao = daoFactory.getUserDao();
        this.followDao = daoFactory.getFollowDao();
        this.tokenService = new TokenService(daoFactory);
    }

    async isFollowingFromService(event: OtherUserRequest){
        let username = await this.tokenService.validateToken(event.token);

        let following = await this.followDao.isFollowing(username, event.username);
        return new IsFollowingResponse(true, following);
    }
    async getFollowersCount(event: OtherUserRequest){

        await this.tokenService.validateToken(event.token);

        let count = await this.userDao.getUserFollowersCount(event.username);
        return new FollowCountResponse(true, count);
    }
    async getFollowingCount(event: OtherUserRequest){

        await this.tokenService.validateToken(event.token);

        let count = await this.userDao.getUserFollowingCount(event.username);
        return new FollowCountResponse(true, count);
    }
    async unfollow(event: OtherUserRequest){

        let username = await this.tokenService.validateToken(event.token);

        await Promise.all([this.followDao.deleteFollow(username, event.username), this.userDao.decrementFollowersCount(event.username), this.userDao.decrementFollowingCount(username)]);
        return new TweeterResponse(true);
    }
    async follow(event: OtherUserRequest){

        let username = await this.tokenService.validateToken(event.token);

        await Promise.all([this.followDao.putFollow(username, event.username), this.userDao.incrementFollowersCount(event.username), this.userDao.incrementFollowingCount(username)]);
        return new TweeterResponse(true);
    }
    async getFollowees(event: FollowListRequest){
        
        await this.tokenService.validateToken(event.token);

        if(event.username == null) {
            throw new Error("[Bad Request] Request needs to have a follower alias");
        } else if(event.limit <= 0) {
            throw new Error("[Bad Request] Request needs to have a positive limit");
        }
        let [users, hasMorePages] = await this.followDao.getFollowees(event.username, event.limit, event.lastItem == null ? null : event.lastItem.alias);
        return new FollowListResponse(true, hasMorePages, users);
    }
    async getFollowers(event: FollowListRequest){
        
        await this.tokenService.validateToken(event.token);
        
        if(event.username == null) {
            throw new Error("[Bad Request] Request needs to have a follower alias");
        } else if(event.limit <= 0) {
            throw new Error("[Bad Request] Request needs to have a positive limit");
        }
        let [users, hasMorePages] = await this.followDao.getFollowers(event.username, event.limit, event.lastItem == null ? null : event.lastItem.alias);
  
        return new FollowListResponse(true, hasMorePages, users) ;
    }
}
