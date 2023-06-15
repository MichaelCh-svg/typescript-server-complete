import { IDaoFactory, IFollowDao, IUserDao } from "../dao/IDaoFactory";
import { OtherUserRequest, FollowListRequest, AuthorizedRequest } from "../dao/net/Request";
import { IsFollowingResponse, FollowCountResponse, Response, FollowListResponse } from "../dao/net/Response";

export class FollowService{

    private userDao : IUserDao;
    private followDao: IFollowDao;

    constructor(daoFactory: IDaoFactory){
        this.userDao = daoFactory.getUserDao();
        this.followDao = daoFactory.getFollowDao();
    }

    async isFollowingFromService(event: OtherUserRequest){
        let following = await this.followDao.isFollowing(event.user.alias, event.otherUser.alias);
        return new IsFollowingResponse(true, following);
    }
    async getFollowersCount(event: AuthorizedRequest){
        let count = await this.userDao.getUserFollowersCount(event.user.alias);
        return new FollowCountResponse(true, count);
    }
    async getFollowingCount(event: AuthorizedRequest){
        let count = await this.userDao.getUserFollowingCount(event.user.alias);
        return new FollowCountResponse(true, count);
    }
    async unfollow(event: OtherUserRequest){
        await Promise.all([this.followDao.deleteFollow(event.user.alias, event.otherUser.alias), this.userDao.decrementFollowersCount(event.otherUser.alias), this.userDao.decrementFollowingCount(event.user.alias)]);
        return new Response(true);
    }
    async follow(event: OtherUserRequest){
        await Promise.all([this.followDao.putFollow(event.user.alias, event.otherUser.alias), this.userDao.incrementFollowersCount(event.otherUser.alias), this.userDao.incrementFollowingCount(event.user.alias)]);
        return new Response(true);
    }
    async getFollowees(event: FollowListRequest){
        
        if(event.user == null) {
            throw new Error("[Bad Request] Request needs to have a follower alias");
        } else if(event.limit <= 0) {
            throw new Error("[Bad Request] Request needs to have a positive limit");
        }
        let [users, hasMorePages] = await this.followDao.getDAOFollowees(event.user.alias, event.limit, event.lastFollowUser == null ? null : event.lastFollowUser.alias);
        return new FollowListResponse(true, hasMorePages, users);
    }
    async getFollowers(event: FollowListRequest){
        
        if(event.user == null) {
            throw new Error("[Bad Request] Request needs to have a follower alias");
        } else if(event.limit <= 0) {
            throw new Error("[Bad Request] Request needs to have a positive limit");
        }
        let [users, hasMorePages] = await this.followDao.getDAOFollowers(event.user.alias, event.limit, event.lastFollowUser == null ? null : event.lastFollowUser.alias);
  
        return new FollowListResponse(true, hasMorePages, users) ;
    }
}
