import { putStory } from "./model/dao/StoryDAO";
import { putUser } from "./model/dao/UserDAO";
import { LoginRequest } from "./model/net/request/LoginRequest";
import { RegisterRequest } from "./model/net/request/RegisterRequest";
import { login, register } from "./model/service/UserService";

putStory("@gorilla4", 123456789, "7nth try");
Buffer.from("string", 'base64');
const encode = (str: string):string => Buffer.from(str, 'binary').toString('base64');
let s = encode("string");
console.log(s);
let r = new RegisterRequest("f", "l", "@g10", "p", s);
register(r);