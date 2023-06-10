import { StatusListRequest } from "../model/dao/net/request/StatusListRequest";
import { User } from "../model/domain/User";


/**
 * although async and await is not supported here, you are able to circumvent this using .then statements.
 */
let testAlias = "@colonel1";
let alias = "@slytherine";
let user = new User('first', 'last', testAlias, 'imageurl');
let l = new StatusListRequest(user, null, null, 10);
