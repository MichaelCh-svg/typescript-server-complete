import { IDaoFactory, IFeedDao, IFollowDao, IStoryDao, ITokenDao, IUserDao } from "../IDaoFactory";
import { FeedDaoFake } from "./FeedDaoFake";
import { FollowDaoFake } from "./FollowDaoFake";
import { StoryDaoFake } from "./StoryDaoFake";
import { TokenDaoFake } from "./TokenDaoFake";
import { UserDaoFake } from "./UserDaoFake";

export class FakeFactory implements IDaoFactory{
    getTokenDao(): ITokenDao {
        return new TokenDaoFake();
    }
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