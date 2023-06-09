import { deleteFollow, getDAOFolloweesAliases, getDAOFollowersAliases, isFollowing, putFollow } from "../dao/FollowDAO";
import { decrementFollowersCount, decrementFollowingCount, getUserFollowersCount, getUserFollowingCount, getUsersFromAliases, incrementFollowersCount, incrementFollowingCount } from "../dao/UserDAO";
import { FollowUnfollowRequest } from "../net/request/FollowUnfollowRequest";
import { FollowerFollowingCountRequest } from "../net/request/FollowerFollowingCountRequest";
import { FollowingRequest } from "../net/request/FollowingRequest";
import { IsFollowRequest } from "../net/request/IsFollowRequest";
import { FollowerFollowingCountResponse } from "../net/response/FollowerFollowingCountResponse";
import { FollowingResponse } from "../net/response/FollowingResponse";
import { IsFollowingResponse } from "../net/response/IsFollowingResponse";
import { Response } from "../net/response/Response";

export async function isFollowingFromService(event: IsFollowRequest){
    let following = await isFollowing(event.followerAlias, event.followeeAlias);
    return new IsFollowingResponse(true, following);
}
export async function getFollowersCount(event: FollowerFollowingCountRequest){
    let count = await getUserFollowersCount(event.alias);
    return new FollowerFollowingCountResponse(true, count);
}
export async function getFollowingCount(event: FollowerFollowingCountRequest){
    let count = await getUserFollowingCount(event.alias);
    return new FollowerFollowingCountResponse(true, count);
}
export async function unfollow(event: FollowUnfollowRequest){
    await Promise.all([deleteFollow(event.alias, event.aliasToFollow), decrementFollowersCount(event.aliasToFollow), decrementFollowingCount(event.alias)]);
    return new Response(true);
}
export async function follow(event: FollowUnfollowRequest){
    await Promise.all([putFollow(event.alias, event.aliasToFollow), incrementFollowersCount(event.aliasToFollow), incrementFollowingCount(event.alias)]);
    return new Response(true);
}
export async function getFollowees(event: FollowingRequest){
    
    if(event.followerAlias == null) {
        throw new Error("[Bad Request] Request needs to have a follower alias");
    } else if(event.limit <= 0) {
        throw new Error("[Bad Request] Request needs to have a positive limit");
    }
    let [followers, hasMorePages] = await getDAOFolloweesAliases(event.followerAlias, event.limit, event.lastFolloweeAlias);
    let users = await getUsersFromAliases(followers);
    return new FollowingResponse(true, users, hasMorePages);
}
export async function getFollowers(event: FollowingRequest){
    
    if(event.followerAlias == null) {
        throw new Error("[Bad Request] Request needs to have a follower alias");
    } else if(event.limit <= 0) {
        throw new Error("[Bad Request] Request needs to have a positive limit");
    }
    let [followers, hasMorePages] = await getDAOFollowersAliases(event.followerAlias, event.limit, event.lastFolloweeAlias);
    let users = await getUsersFromAliases(followers);
    return new FollowingResponse(true, users, hasMorePages) ;
}