import { FakeData } from "../../util/FakeData";
import { IDaoFactory, IUserDao } from "../dao/IDaoFactory";
import { UserDAO } from "../dao/dynamo/UserDAO";
import { setS3Image } from "../dao/dynamo/s3DAO";
import { GetUserRequest } from "../dao/net/request/GetUserRequest";
import { LoginRequest } from "../dao/net/request/LoginRequest";
import { RegisterRequest } from "../dao/net/request/RegisterRequest";
import { GetUserResponse } from "../dao/net/response/GetUserResponse";
import { LoginResponse } from "../dao/net/response/LoginResponse";
import { AuthToken } from "../domain/AuthToken";
import { User } from "../domain/User";
import { SHA256 } from 'crypto-js';

export class UserService{
    private userDao : IUserDao;
    constructor(daoFactory: IDaoFactory){
        this.userDao = daoFactory.getUserDao();
    }
    async getUserFromService(event: GetUserRequest){
        try{
            let user = await this.userDao.getUser(event.alias);
            return new GetUserResponse(true, user);
        }
        catch(err){
            throw new Error("[Bad Request] " + (err as Error).message);
        }
    }
    async loginFromService(event: LoginRequest){
        if(event._alias == null){
            throw new Error("[Bad Request] Missing a username");
        } else if(event.password == null) {
            throw new Error("[Bad Request] Missing a password");
        }
        let user = null;
        try{
            let user = await this.userDao.getUser(event._alias);
            return new LoginResponse(true, user, AuthToken.Generate())
        }
        catch(err){
            throw new Error("[Bad Request] " + (err as Error).message);
        }
    }
    async register(event: RegisterRequest){
        if(event.alias == null){
            throw new Error("[Bad Request] Missing a username");
        } else if(event.password == null) {
            throw new Error("[Bad Request] Missing a password");
        }
        try{
            let userExists = await this.userDao.isUser(event.alias);
            if(userExists) throw Error("User " + event.alias + " already exists.");
            let imageUrl = await setS3Image(event.imageUrl, event.alias);
            const hashedPassword = SHA256(event.password).toString();
            let user = new User(event.firstName, event.lastName, event.alias, imageUrl);
            await this.userDao.putUser(user, hashedPassword);
            return new LoginResponse(true, user, AuthToken.Generate());
        }
        catch(err){
            throw new Error("[Bad Request] " + (err as Error).message);
        }
    }
}
