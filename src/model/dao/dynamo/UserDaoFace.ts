import { User } from "../../domain/User";
import { IUserDao } from "../IDaoFactory";
import { UserDao } from "./UserDao";
import { setS3Image } from "./s3DAO";

export class UserDaoFace implements IUserDao{
    private userDao = new UserDao();
    async login(username: string, password: string): Promise<User> {
        return await this.userDao.getUser(username);
    }
    async getUser(username: string): Promise<User> {
        return await this.userDao.getUser(username);
    }
    async putUser(user: User, hashedPassword: string): Promise<User> {
        let userExists = await this.userDao.isUser(user.alias);
        if(userExists) throw Error("User " + user.alias + " already exists.");
        let imageUrl = await setS3Image(user.imageUrl, user.alias);
        user.imageUrl = imageUrl;
        await this.userDao.putUser(user, hashedPassword);
        return user;
    }
    decrementFollowersCount(username: string): Promise<void> {
        return this.userDao.decrementFollowersCount(username);
    }
    decrementFollowingCount(username: string): Promise<void> {
        return this.userDao.decrementFollowingCount(username);
    }
    incrementFollowersCount(username: string): Promise<void> {
        return this.userDao.incrementFollowersCount(username);
    }
    incrementFollowingCount(username: string): Promise<void> {
        return this.userDao.incrementFollowingCount(username);
    }
    
    getUserFollowingCount(username: string): Promise<number> {
        return this.userDao.getUserFollowingCount(username);
    }
    getUserFollowersCount(username: string): Promise<number> {
        return this.userDao.getUserFollowersCount(username);
    }
    
}