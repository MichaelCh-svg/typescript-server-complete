import { IDaoFactory, IFeedDao, IFollowDao, IStoryDao, IUserDao } from "../IDaoFactory";
import { FeedDaoFace } from "./FeedDaoFace";
import { FollowDaoFace } from "./FollowDaoFace";
import { StoryDaoFace } from "./StoryDaoFace";
import { UserDaoFace } from "./UserDaoFace";

export class DynamoFactory implements IDaoFactory{
    getUserDao(): IUserDao { return new UserDaoFace()};
    getFollowDao(): IFollowDao { return new FollowDaoFace()}; 
    getStoryDao(): IStoryDao { return new StoryDaoFace()};
    getFeedDao(): IFeedDao { return new FeedDaoFace()};
}