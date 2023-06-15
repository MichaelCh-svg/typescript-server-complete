import { handler } from "../lambda/GetFolloweesHandler";
import { getFollowService } from "../lambda/factory/factory";
import { FollowListRequest, StoryFeedRequest } from "../model/dao/net/Request";
import { FollowDaoFace } from "../model/dao/dynamo/FollowDaoFace";
import { FollowDaoFake } from "../model/dao/fakeData/FollowDaoFake";
import { AuthToken } from "../model/domain/AuthToken";
import { User } from "../model/domain/User";
import { FakeData } from "../util/FakeData";


/**
 * although async and await is not supported here, you are able to circumvent this using .then statements.
 */

let testAlias = "@colonel1";
let alias = "@slytherine";
let user = new User('first', 'last', testAlias, 'imageurl');
let token = AuthToken.Generate();
let l = new StoryFeedRequest(user, token, 10, null);

let followDao = new FollowDaoFake();
let service = getFollowService();

