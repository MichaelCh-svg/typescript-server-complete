import { IDaoFactory, IFollowDao, IUserDao } from "../dao/IDaoFactory";
import { FollowUnfollowRequest } from "../dao/net/request/FollowUnfollowRequest";
import { FollowerFollowingCountRequest } from "../dao/net/request/FollowerFollowingCountRequest";
import { FollowingRequest } from "../dao/net/request/FollowingRequest";
import { IsFollowRequest } from "../dao/net/request/IsFollowRequest";
import { FollowerFollowingCountResponse } from "../dao/net/response/FollowerFollowingCountResponse";
import { FollowingResponse } from "../dao/net/response/FollowingResponse";
import { IsFollowingResponse } from "../dao/net/response/IsFollowingResponse";
import { Response } from "../dao/net/response/Response";

export class FollowService{
    private userDao : IUserDao;
    private followDao: IFollowDao;
    constructor(daoFactory: IDaoFactory){
        this.userDao = daoFactory.getUserDao();
        this.followDao = daoFactory.getFollowDao();
    }
    async isFollowingFromService(event: IsFollowRequest){
        let following = await this.followDao.isFollowing(event.followerAlias, event.followeeAlias);
        return new IsFollowingResponse(true, following);
    }
    async getFollowersCount(event: FollowerFollowingCountRequest){
        let count = await this.userDao.getUserFollowersCount(event.alias);
        return new FollowerFollowingCountResponse(true, count);
    }
    async getFollowingCount(event: FollowerFollowingCountRequest){
        let count = await this.userDao.getUserFollowingCount(event.alias);
        return new FollowerFollowingCountResponse(true, count);
    }
    async unfollow(event: FollowUnfollowRequest){
        await Promise.all([this.followDao.deleteFollow(event.alias, event.aliasToFollow), this.userDao.decrementFollowersCount(event.aliasToFollow), this.userDao.decrementFollowingCount(event.alias)]);
        return new Response(true);
    }
    async follow(event: FollowUnfollowRequest){
        await Promise.all([this.followDao.putFollow(event.alias, event.aliasToFollow), this.userDao.incrementFollowersCount(event.aliasToFollow), this.userDao.incrementFollowingCount(event.alias)]);
        return new Response(true);
    }
    async getFollowees(event: FollowingRequest){
        
        if(event.followerAlias == null) {
            throw new Error("[Bad Request] Request needs to have a follower alias");
        } else if(event.limit <= 0) {
            throw new Error("[Bad Request] Request needs to have a positive limit");
        }
        let [users, hasMorePages] = await this.followDao.getDAOFollowees(event.followerAlias, event.limit, event.lastFolloweeAlias);
        return new FollowingResponse(true, users, hasMorePages);
    }
    async getFollowers(event: FollowingRequest){
        
        if(event.followerAlias == null) {
            throw new Error("[Bad Request] Request needs to have a follower alias");
        } else if(event.limit <= 0) {
            throw new Error("[Bad Request] Request needs to have a positive limit");
        }
        let [users, hasMorePages] = await this.followDao.getDAOFollowers(event.followerAlias, event.limit, event.lastFolloweeAlias);
  
        return new FollowingResponse(true, users, hasMorePages) ;
    }
}
