import { handler } from "../lambda/GetFolloweesHandler";
import { getFollowService } from "../lambda/factory/factory";
import { FollowDaoFace } from "../model/dao/dynamo/FollowDaoFace";
import { FollowDaoFake } from "../model/dao/fakeData/FollowDaoFake";
import { FollowingRequest } from "../model/dao/net/request/FollowingRequest";
import { StatusListRequest } from "../model/dao/net/request/StatusListRequest";
import { User } from "../model/domain/User";
import { FakeData } from "../util/FakeData";


/**
 * although async and await is not supported here, you are able to circumvent this using .then statements.
 */
let testAlias = "@colonel1";
let alias = "@slytherine";
let user = new User('first', 'last', testAlias, 'imageurl');
let l = new StatusListRequest(user, null, null, 10);

let followDao = new FollowDaoFake();
let service = getFollowService();
let request = new FollowingRequest('@allen', null, 10, null);
handler(request).then(resp => console.log(JSON.stringify(resp)));
