import { IDaoFactory, IUserDao } from "../dao/IDaoFactory";
import { AuthorizedRequest, GetUserRequest, LoginRequest, RegisterRequest } from "../dao/net/Request";
import { UserResponse, AuthenticateResponse } from "../dao/net/Response";
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
            let user = await this.userDao.getUser(event.usernameToGet);
            return new UserResponse(true, user);
        }
        catch(err){
            throw new Error("[Bad Request] " + (err as Error).message);
        }
    }
    async loginFromService(event: LoginRequest){
        if(event.username == null){
            throw new Error("[Bad Request] Missing a username");
        } else if(event.password == null) {
            throw new Error("[Bad Request] Missing a password");
        }
        let user = null;
        try{
            const hashedPassword = SHA256(event.password).toString();
            let user = await this.userDao.login(event.username, hashedPassword);
            return new AuthenticateResponse(true, user, AuthToken.Generate())
        }
        catch(err){
            throw new Error("[Bad Request] " + (err as Error).message);
        }
    }
    async register(event: RegisterRequest){
        if(event.username == null){
            throw new Error("[Bad Request] Missing a username");
        } else if(event.password == null) {
            throw new Error("[Bad Request] Missing a password");
        }
        try{
            const hashedPassword = SHA256(event.password).toString();
            let user = await this.userDao.putUser(new User(event.firstName, event.lastName, event.username, event.imageUrl), hashedPassword);
            return new AuthenticateResponse(true, user, AuthToken.Generate());
        }
        catch(err){
            throw new Error("[Bad Request] " + (err as Error).message);
        }
    }
}
