import { AuthToken, PostStatusRequest, Status, StoryFeedRequest, User } from "../entities";



export interface IDaoFactory{
    getUserDao(): IUserDao;
    getFollowDao(): IFollowDao;
    getFeedDao(): IFeedDao;
    getStoryDao(): IStoryDao;
    getTokenDao(): ITokenDao;
}

export interface IUserDao{
    //login, verify password,
    login(username: string, hashedPassword: string): Promise<User>;
    getUser(username: string): Promise<User>;
    // return user with image url, set s3 image,
    putUser(user: User, password: string): Promise<User>;
    decrementFollowersCount(username: string): Promise<void>;
    decrementFollowingCount(username: string): Promise<void>;
    incrementFollowersCount(username: string): Promise<void>;
    incrementFollowingCount(username: string): Promise<void>;
    getUserFollowingCount(username: string): Promise<number>;
    getUserFollowersCount(username: string): Promise<number>;
}

export interface IFollowDao{
    isFollowing (followerUsername: string, followeeUsername: string): Promise<boolean>; 

    deleteFollow(username: string, usernameToUnfollow: string): Promise<void>;
    putFollow(username: string, usernameToFollow: string): Promise<void>;
    getFollowers(followeeUsername: string, limit: number, lastFollowerUsername: string | null): Promise<[User[], boolean]>;
    getFollowees(followerUsername: string, limit: number, lastFolloweeUsername: string | null): Promise<[User[], boolean]>;
}

export interface IFeedDao{
    
    getFeedList(username: string, lastStatus: Status | null, limit: number): Promise<[Status[], boolean]>;
    putFeeds(authorUsername: string, post: string, timestamp: number): Promise<void>;
}

export interface IStoryDao{
    getStoryList(request: StoryFeedRequest, username: string): Promise<[Status[], boolean]>;
    putStory(event: PostStatusRequest, username: string): Promise<void>;
}

export interface ITokenDao{
    getToken(token: string): Promise<[AuthToken, string] | null>;
    updateTokenTimestamp(token: string, timestamp: number): Promise<void>;
    putToken(token: AuthToken, username: string): Promise<void>;
    deleteToken(token: String): Promise<void>;
    clearExpiredTokens(expireTimeInMinutes: number): Promise<void>;
}