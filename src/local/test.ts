
import { PostStatusToSQSRequest } from "../model/dao/PostStatusToSQSRequest";
import { getUserFollowersCount, incrementFollowersCount } from "../model/dao/UserDAO";
import { FollowUnfollowRequest } from "../model/net/request/FollowUnfollowRequest"
import { unfollow } from "../model/service/FollowService"

/**
 * although async and await is not supported here, you are able to circumvent this using .then statements.
 */
let testAlias = "@colonel1";
let l = new FollowUnfollowRequest(testAlias, testAlias, null);

getUserFollowersCount(testAlias).then(c => console.log('c ' + c));