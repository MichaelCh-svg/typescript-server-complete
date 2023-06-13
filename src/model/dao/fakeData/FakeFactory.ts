import { IDaoFactory, IFeedDao, IFollowDao, IStoryDao, IUserDao } from "../IDaoFactory";
import { StoryDao } from "../dynamo/StoryDao";
import { FeedDaoFake } from "./FeedDaoFake";
import { FollowDaoFake } from "./FollowDaoFake";
import { StoryDaoFake } from "./StoryDaoFake";
import { UserDaoFake } from "./UserDaoFake";

export class FakeFactory implements IDaoFactory{
    getUserDao(): IUserDao {
        return new UserDaoFake();
    }
    getFollowDao(): IFollowDao {
        return new FollowDaoFake();
    }
    getFeedDao(): IFeedDao {
        return new FeedDaoFake();
    }
    getStoryDao(): IStoryDao {
        return new StoryDaoFake();
    }
    
}