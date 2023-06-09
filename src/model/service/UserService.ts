import { FakeData } from "../../util/FakeData";
import { getUser, putUser } from "../dao/UserDAO";
import { setS3Image } from "../dao/s3DAO";
import { AuthToken } from "../domain/AuthToken";
import { User } from "../domain/User";
import { GetUserRequest } from "../net/request/GetUserRequest";
import { LoginRequest } from "../net/request/LoginRequest";
import { RegisterRequest } from "../net/request/RegisterRequest";
import { GetUserResponse } from "../net/response/GetUserResponse";
import { LoginResponse } from "../net/response/LoginResponse";
import { SHA256 } from 'crypto-js';


export async function getUserFromService(event: GetUserRequest){
    try{
        let user = await getUser(event.alias);
        return new GetUserResponse(true, user);
    }
    catch(err){
        throw new Error("[Bad Request] " + (err as Error).message);
    }
}
export async function login(event: LoginRequest){
    if(event._alias == null){
        throw new Error("[Bad Request] Missing a username");
    } else if(event.password == null) {
        throw new Error("[Bad Request] Missing a password");
    }
    let user = null;
    try{
        let user = await getUser(event._alias);
        return new LoginResponse(true, user, AuthToken.Generate())
    }
    catch(err){
        throw new Error("[Bad Request] " + (err as Error).message);
    }
}
export async function register(event: RegisterRequest){
    if(event.alias == null){
        throw new Error("[Bad Request] Missing a username");
    } else if(event.password == null) {
        throw new Error("[Bad Request] Missing a password");
    }
    try{
        let user = await getUser(event.alias);
        if(user != undefined) throw Error("User " + event.alias + " already exists.");
        let imageUrl = await setS3Image(event.imageUrl, event.alias);
        const hashedPassword = SHA256(event.password).toString();
        await putUser(event.firstName, event.lastName, event.alias, hashedPassword, imageUrl);
        return new LoginResponse(true, new User(event.firstName, event.lastName, event.alias, imageUrl), AuthToken.Generate());
    }
    catch(err){
        throw new Error("[Bad Request] " + (err as Error).message);
    }
}
