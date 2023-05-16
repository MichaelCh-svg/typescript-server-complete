import { putStory } from "./model/dao/StoryDAO";
import { putUser } from "./model/dao/UserDAO";
import { LoginRequest } from "./model/net/request/LoginRequest";
import { RegisterRequest } from "./model/net/request/RegisterRequest";
import { login, register } from "./model/service/UserService";

putStory("@image", 123456789, "7nth eleventh");
// Buffer.from("string", 'base64');
// const encode = (str: string):string => Buffer.from(str, 'binary').toString('base64');
// let s = encode("string");
// console.log(s);
// let r = new RegisterRequest("f", "l", "@gimage", "p", s);
// register(r);