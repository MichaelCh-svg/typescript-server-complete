import { FakeData } from "../../util/FakeData";
import { getUser, putUser } from "../dao/UserDAO";
import { User } from "../domain/User";
import { LoginRequest } from "../net/request/LoginRequest";
import { RegisterRequest } from "../net/request/RegisterRequest";
import { LoginResponse } from "../net/response/LoginResponse";
import { SHA256 } from 'crypto-js';

export async function login(event: LoginRequest){
    if(event.username == null){
        throw new Error("[Bad Request] Missing a username");
    } else if(event.password == null) {
        throw new Error("[Bad Request] Missing a password");
    }
    let fakeData = FakeData.instance;
    let user = null;
    try{
        let userData = await getUser(event.username);
        user = new User(userData.firstName, userData.lastName, userData.alias, userData.imageUrl);
        return new LoginResponse(true, user, fakeData.authToken)
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
    let fakeData = FakeData.instance;
    const hashedPassword = SHA256(event.password).toString();
    try{
        await putUser(event.firstName, event.lastName, event.alias, hashedPassword, event.imageUrl);
        return new LoginResponse(true, new User(event.firstName, event.lastName, event.alias, event.imageUrl), fakeData.authToken);
    }
    catch(err){
        throw new Error("[Bad Request] " + (err as Error).message);
    }
}