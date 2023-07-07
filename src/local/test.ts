import { handler } from "../lambda/GetFolloweesHandler";
import { getFollowService } from "../lambda/factory/factory";
import { FollowListRequest, StoryFeedRequest } from "../model/dao/net/Request";
import { FollowDaoFace } from "../model/dao/dynamo/FollowDaoFace";
import { FollowDaoFake } from "../model/dao/fakeData/FollowDaoFake";
import { AuthToken } from "../model/domain/AuthToken";
import { User } from "../model/domain/User";
import { FakeData } from "../util/FakeData";
import { Status } from "../model/domain/Status";
import { FeedDao } from "../model/dao/dynamo/FeedDao";
import { StoryDao } from "../model/dao/dynamo/StoryDao";


/**
 * although async and await is not supported here, you are able to circumvent this using .then statements.
 */

let testAlias = "@colonel1";
let alias = "@slytherine";
let user = new User('first', 'last', '@cat3', 'imageurl');
let status = new Status('knock knock', user, 1688701733232);
// let status = new Status('post', user, 1688698857518);


let f = new StoryDao();
f.getStatusList(user, 10, status)
.then(l => console.log(l))
;

