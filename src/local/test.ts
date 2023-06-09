
import { isFollowing } from "../model/dao/FollowDAO";
import { PostStatusToSQSRequest } from "../model/dao/PostStatusToSQSRequest";
import { getUserFollowersCount, incrementFollowersCount } from "../model/dao/UserDAO";
import { Status } from "../model/domain/Status";
import { User } from "../model/domain/User";
import { FollowUnfollowRequest } from "../model/net/request/FollowUnfollowRequest"
import { StatusListRequest } from "../model/net/request/StatusListRequest";
import { unfollow } from "../model/service/FollowService"
import { getFeed } from "../model/service/StatusService";

/**
 * although async and await is not supported here, you are able to circumvent this using .then statements.
 */
let testAlias = "@colonel1";
let alias = "@slytherine";
let user = new User('first', 'last', testAlias, 'imageurl');
let l = new StatusListRequest(user, null, null, 10);
getFeed(l).then(data => data.statusList.forEach(s => console.log(JSON.stringify(s.user)) + '\n'));