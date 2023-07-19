import { get } from "jquery";
import { FakeData } from "../../../util/FakeData";
import { IUserDao } from "../IDaoFactory";
import { User } from "../../entities";

export class UserDaoFake implements IUserDao{
    private fakeData = FakeData.instance;
    private MALE_IMAGE_URL: string =
  "https://faculty.cs.byu.edu/~jwilkerson/cs340/tweeter/images/donald_duck.png";

    async login(username: string, hashedPassword: string): Promise<User> {
        let user =  this.fakeData.firstUser;
        return user as unknown as User;    
    }
    async getUser(username: string): Promise<User> {
        let user =  this.fakeData.findUserByAlias(username);
        return user as unknown as User;
    }
    async putUser(user: User, password: string): Promise<User> {
        user.imageUrl = this.MALE_IMAGE_URL;
        return user;
    }
    async decrementFollowersCount(username: string): Promise<void> {
        return;
    }
    async decrementFollowingCount(username: string): Promise<void> {
        return;
    }
    async incrementFollowersCount(username: string): Promise<void> {
        return;
    }
    async incrementFollowingCount(username: string): Promise<void> {
        return;
    }
    async getUserFollowingCount(username: string): Promise<number> {
        let user = this.fakeData.findUserByAlias(username);
        if(user == null) throw new Error('user not found with username ' + username);
        let count = this.fakeData.getFolloweesCount(user);
        return count;
    }
    async getUserFollowersCount(username: string): Promise<number> {
        let user = this.fakeData.findUserByAlias(username);
        if(user == null) throw new Error('user not found with username ' + username);
        let count = this.fakeData.getFollowersCount(user);
        return count;
    }
    
}