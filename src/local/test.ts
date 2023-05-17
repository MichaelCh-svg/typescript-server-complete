import { getDAOFollowers } from "../model/dao/FollowDAO";
import { FollowingRequest } from "../model/net/request/FollowingRequest";
import { PostStatusRequest } from "../model/net/request/PostStatusRequest";
import { getFollowers } from "../model/service/FollowService"
import { postStatus } from "../model/service/StatusService"
// The test.ts file is in the .gitignore file. If you want this file to upload to github, remove it from the .gitignore file.

// putFeeds("@sylvia", "7nth eleventh",["sarah", "john", "colonel"], 123456789);
// Buffer.from("string", 'base64');
// const encode = (str: string):string => Buffer.from(str, 'binary').toString('base64');
// let s = encode("string");

// import { RegisterRequest } from "../model/net/request/RegisterRequest";
// import { register } from "../model/service/UserService";

// // console.log(s);
// let r = new RegisterRequest("f", "l", "@nightingale13", "p", s);
// register(r);
// let lastFollwerAlias = "@colonel50";
// getFollowers(new FollowingRequest("@slytherine", null, 7, lastFollwerAlias));
// getDAOFollowers("@slytherine", 0, null);
postStatus(new PostStatusRequest("@slytherine", "post office", null))
