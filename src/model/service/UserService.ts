import { IDaoFactory, ITokenDao, IUserDao } from "../dao/IDaoFactory";
import { SHA256 } from 'crypto-js';
import { TokenService } from "./TokenService";
import { AuthToken, AuthenticateResponse, AuthorizedRequest, LoginRequest, OtherUserRequest, RegisterRequest, User, UserResponse } from "../entities";

export class UserService{
    
    private userDao : IUserDao;
    private tokenDao: ITokenDao;
    private tokenService: TokenService;
    
    constructor(daoFactory: IDaoFactory){
        this.userDao = daoFactory.getUserDao();
        this.tokenDao = daoFactory.getTokenDao();
        this.tokenService = new TokenService(daoFactory);
    }

    async logout(deseralizedRequest: AuthorizedRequest): Promise<void> {
        await Promise.all([this.tokenDao.clearExpiredTokens(TokenService.timeoutInMinutes), this.tokenDao.deleteToken(deseralizedRequest.token.token)]);
    }
    async getUserFromService(event: OtherUserRequest){
        
        await this.tokenService.validateToken(event.token);

        try{
            let user = await this.userDao.getUser(event.username);
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
            let token = AuthToken.Generate();
            await this.tokenDao.putToken(token, user.alias);
            return new AuthenticateResponse(true, user, token)
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
            let token = AuthToken.Generate();
            await this.tokenDao.putToken(token, user.alias);
            return new AuthenticateResponse(true, user, token);
        }
        catch(err){
            throw new Error("[Bad Request] " + (err as Error).message);
        }
    }
}
