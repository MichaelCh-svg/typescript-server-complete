import { IDaoFactory, IFeedDao, IFollowDao, IStoryDao, IUserDao } from "../IDaoFactory";
import { FeedDao } from "./FeedDAO";
import { FollowDao } from "./FollowDAO";
import { StoryDAO } from "./StoryDAO";
import { UserDAO } from "./UserDAO";

export class DynamoFactory implements IDaoFactory{
    getUserDao(): IUserDao { return new UserDAO()};
    getFollowDao(): IFollowDao { return new FollowDao()}; 
    getStoryDao(): IStoryDao { return new StoryDAO()};
    getFeedDao(): IFeedDao { return new FeedDao()};
}