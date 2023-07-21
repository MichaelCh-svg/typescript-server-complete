import { handler } from "../lambda/LoginHandler";
import { TokenDao } from "../model/dao/dynamo/TokenDao";
import { AuthToken, AuthorizedRequest, LoginRequest, Status, User } from "../model/entities";


/**
 * although async and await is not supported here, you are able to circumvent this using .then statements.
 */



let testAlias = "@colonel1";
let alias = "@slytherine";
let user = new User('first', 'last', '@cat3', 'imageurl');
let status = new Status('knock knock', user, 1688701733232);
// let status = new Status('post', user, 1688698857518);
let tokenDao = new TokenDao();
let r = new LoginRequest("@cat3", "cat3");
handler(r).then(resp => console.log(resp));
// for(let i = 0; i < 30; ++i){
//     tokenDao.putToken(AuthToken.Generate());
// }
// tokenDao.clearExpiredTokens(0);


