import { deleteFollow, getDAOFollowees, getDAOFollowersAliases, putFollow } from "../dao/FollowDAO";
import { decrementFollowersCount, decrementFollowingCount, getUserFollowersCount, getUserFollowingCount, getUsersFromAliases, incrementFollowersCount, incrementFollowingCount } from "../dao/UserDAO";
import { FollowUnfollowRequest } from "../net/request/FollowUnfollowRequest";
import { FollowerFollowingCountRequest } from "../net/request/FollowerFollowingCountRequest";
import { FollowingRequest } from "../net/request/FollowingRequest";
import { FollowerFollowingCountResponse } from "../net/response/FollowerFollowingCountResponse";
import { FollowingResponse } from "../net/response/FollowingResponse";
import { Response } from "../net/response/Response";

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
export function getFollowees(event: FollowingRequest){
    
    if(event.followerAlias == null) {
        throw new Error("[Bad Request] Request needs to have a follower alias");
    } else if(event.limit <= 0) {
        throw new Error("[Bad Request] Request needs to have a positive limit");
    }
    let [followees, hasMorePages] = getDAOFollowees(event.followerAlias, event.limit, event.lastFolloweeAlias);
    return new FollowingResponse(true, followees, hasMorePages) ;
}
export async function getFollowers(event: FollowingRequest){
    
    if(event.followerAlias == null) {
        throw new Error("[Bad Request] Request needs to have a follower alias");
    } else if(event.limit <= 0) {
        throw new Error("[Bad Request] Request needs to have a positive limit");
    }
    let [followers, hasMorePages] = await getDAOFollowersAliases(event.followerAlias, event.limit, event.lastFolloweeAlias);
    console.log('numFollowers ' + followers.length);
    console.log('hasMorePages ' + hasMorePages);
    let users = await getUsersFromAliases(followers);
    return new FollowingResponse(true, users, hasMorePages) ;
}