import { Status } from "../../domain/Status";
import { IFeedDao } from "../IDaoFactory";
import { FeedDao } from "./FeedDao";
import { FollowDao } from "./FollowDao";
import { PostFeedToSQSRequest } from "./PostFeedToSQSRequest";
import { postFeedToSQSFromSQSService } from "./SQSService";
import { UserDao } from "./UserDao";

export class FeedDaoFace implements IFeedDao{
    private feedDao = new FeedDao();
    private userDao = new UserDao();
    private followDao = new FollowDao();

    async getFeedList(alias: string, lastStatus: Status | null, limit: number): Promise<[Status[], boolean, Status | null]> {
        let [statusList, hasMorePages, lastEvaluatedStatus] = await this.feedDao.getFeedStatusListWithoutUsers(alias, lastStatus, limit);
        let aliasList = statusList.map(s => s.user.alias);
        let aliastListNoDuplicates = [...new Set(aliasList)];
        let userList = await this.userDao.getUsersFromAliases(aliastListNoDuplicates);
        statusList.forEach(s => { 
            let user = userList.find(u => u.alias == s.user.alias);
            if(user !== undefined) s.user = user;
            else throw new Error('status could not find user with alias ' + s.user.alias)})
        return [statusList, hasMorePages, lastEvaluatedStatus];
    }
    async putFeeds(authorAlias: string, post: string, timestamp: number): Promise<void> {
        let followers, hasMorePages, lastEvaluatedFollowerAlias = null;
        hasMorePages = true;
        let numQueues = 0;
        while(hasMorePages){
            [followers, hasMorePages, lastEvaluatedFollowerAlias] = await this.followDao.getDAOFollowersAliases(authorAlias, 300, lastEvaluatedFollowerAlias);
            let request = new PostFeedToSQSRequest(followers, authorAlias, post, timestamp);
            let data = await postFeedToSQSFromSQSService(request);
            ++numQueues;
        }
        // return this.feedDao.putFeeds(authorAlias, post, followersAliases, timestamp);
    }
    
}