import { Status } from "../domain/Status";
import { User } from "../domain/User";
import { StoryFeedRequest, PostStatusRequest } from "./net/Request";


export interface IDaoFactory{
    getUserDao(): IUserDao;
    getFollowDao(): IFollowDao;
    getFeedDao(): IFeedDao;
    getStoryDao(): IStoryDao;
}

export interface IUserDao{
    //login, verify password,
    login(username: string, hashedPassword: string): Promise<User>;
    getUser(username: string): Promise<User>;
    // return user with image url, set s3 image,
    putUser(user: User, password: string): Promise<User>;
    decrementFollowersCount(username: string): Promise<boolean>;
    decrementFollowingCount(username: string): Promise<boolean>;
    incrementFollowersCount(username: string): Promise<boolean>;
    incrementFollowingCount(username: string): Promise<boolean>;
    getUserFollowingCount(username: string): Promise<number>;
    getUserFollowersCount(username: string): Promise<number>;
}

export interface IFollowDao{
    isFollowing (followerAlias: string, followeeAlias: string): Promise<boolean>;
    deleteFollow(alias: string, aliasToFollow: string): Promise<void>;
    putFollow(alias: string, aliasToFollow: string): Promise<void>;
    getDAOFollowers(followeeAlias: string, limit: number, lastFollowerAlias: string | null): Promise<[User[], boolean]>;
    getDAOFollowees(followerAlias: string, limit: number, lastFolloweeAlias: string | null): Promise<[User[], boolean]>;
}

export interface IFeedDao{
    
    getFeedList(alias: string, lastStatus: Status | null, limit: number): Promise<[Status[], boolean]>;
    putFeeds(authorAlias: string, post: string, timestamp: number): Promise<void>;
}

export interface IStoryDao{
    getStatusList(request: StoryFeedRequest): Promise<[Status[], boolean]>;
    putStory(event: PostStatusRequest): Promise<void>;
}