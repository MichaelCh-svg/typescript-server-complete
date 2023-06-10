import { Status } from "../domain/Status";
import { User } from "../domain/User";
import { StatusListRequest } from "./net/request/StatusListRequest";

export interface IDaoFactory{
    getUserDao(): IUserDao;
    getFollowDao(): IFollowDao;
    getFeedDao(): IFeedDao;
    getStoryDao(): IStoryDao;
}
export interface IUserDao{
    getUser(username: string): Promise<User>;
    isUser(username: string): Promise<boolean>;
    putUser(user: User, password: string): Promise<boolean>;
    decrementFollowersCount(username: string): Promise<boolean>;
    decrementFollowingCount(username: string): Promise<boolean>;
    incrementFollowersCount(username: string): Promise<boolean>;
    incrementFollowingCount(username: string): Promise<boolean>;
    getUsersFromAliases(aliasList: string[]): Promise<User[]>;
    getUserFollowingCount(username: string): Promise<number>;
    getUserFollowersCount(username: string): Promise<number>;
}
export interface IFollowDao{
    isFollowing (followerAlias: string, followeeAlias: string): Promise<boolean>;
    deleteFollow(alias: string, aliasToFollow: string): Promise<void>;
    putFollow(alias: string, aliasToFollow: string): Promise<void>;
    getDAOFollowersAliases(followeeAlias: string, limit: number, lastFollowerAlias: string | null): Promise<[string[], boolean, string | null]>;
    getDAOFolloweesAliases(followerAlias: string, limit: number, lastFolloweeAlias: string | null): Promise<[string[], boolean, string | null]>;
}
export interface IFeedDao{
    getFeedStatusListWithoutUsers(alias: string, lastStatus: Status | null, limit: number): Promise<[Status[], boolean, Status | null]>;
    putFeeds(authorAlias: string, post: string, followersAliases: string[], timestamp: number): Promise<boolean>;
}
export interface IStoryDao{
    getStatusList(request: StatusListRequest): Promise<[Status[], boolean, Status | null]>;
    putStory(alias: string, timestamp: number, post: string): Promise<void>;
}