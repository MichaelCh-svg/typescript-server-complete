import { getDAOFollowees } from "../dao/FollowDAO";
import { FollowingRequest } from "../net/request/FollowingRequest";
import { FollowingResponse } from "../net/response/FollowingResponse";

export function getFollowees(event: FollowingRequest){
    
    if(event.followerAlias == null) {
        throw new Error("[Bad Request] Request needs to have a follower alias");
    } else if(event.limit <= 0) {
        throw new Error("[Bad Request] Request needs to have a positive limit");
    }
    let [followees, hasMorePages] = getDAOFollowees(event.followerAlias, event.limit, event.lastFolloweeAlias);
    return new FollowingResponse(true, followees, hasMorePages) ;
}