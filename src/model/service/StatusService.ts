import { PostStatusRequest } from "../net/request/PostStatusRequest";
import { Response } from "../net/response/Response";
import { getStatusList, putStory } from "../dao/StoryDAO";
import { getDAOFollowersAliases } from "../dao/FollowDAO";
import { getFeedStatusListWithoutUsers, putFeeds } from "../dao/FeedDAO";
import { PostStatusToSQSRequest } from "../dao/PostStatusToSQSRequest";
import { postFeedToSQSFromSQSService, postStatusToSQSFromSQSService } from "../dao/SQSService";
import { PostFeedToSQSRequest } from "../dao/PostFeedToSQSRequest";
import { StatusListRequest } from "../net/request/StatusListRequest";
import { StoryFeedResponse } from "../net/response/StoryFeedResponse";
import { getUsersFromAliases } from "../dao/UserDAO";

export async function getFeed(event: StatusListRequest){
    console.log('getFeed statusListRequest authorUser\n' + JSON.stringify(event.authorUser));
    console.log('getFeed statusListRequest authorUser alias: ' + event.authorUser.alias);
    let [statusList, hasMorePages, lastEvaluatedStatus] = await getFeedStatusListWithoutUsers(event.authorUser.alias, event.lastStatus, event.limit);
    let aliasList = statusList.map(s => s.user.alias);
    let aliastListNoDuplicates = [...new Set(aliasList)];
    let userList = await getUsersFromAliases(aliastListNoDuplicates);
    statusList.forEach(s => { 
        let user = userList.find(u => u.alias = s.user.alias);
        if(user !== undefined) s.user = user;
        else throw new Error('status could not find user with alias ' + s.user.alias)})
    return new StoryFeedResponse(true, statusList, hasMorePages, lastEvaluatedStatus);
}

export async function getStory(event: StatusListRequest){
    let [statusList, hasMorePages, lastEvaluatedStatus] = await getStatusList(event);
    return new StoryFeedResponse(true, statusList, hasMorePages, lastEvaluatedStatus);
}

export async function postStatusToSQS(event: PostStatusRequest){
    await postStatusToSQSFromSQSService(event);
    return new Response(true, event.alias + " posted " + event.post);
}
export async function postStatus(event: PostStatusToSQSRequest){
    await putStory(event.alias, event.timestamp, event.post);
    let followers, hasMorePages, lastEvaluatedFollowerAlias = null;
    hasMorePages = true;
    let numQueues = 0;
    while(hasMorePages){
        [followers, hasMorePages, lastEvaluatedFollowerAlias] = await getDAOFollowersAliases(event.alias, 300, lastEvaluatedFollowerAlias);
        let request = new PostFeedToSQSRequest(followers, event.alias, event.post, event.timestamp);
        let data = await postFeedToSQSFromSQSService(request);
        ++numQueues;
    }

    return new Response(true, event.alias + " posted " + event.post + " at " + event.timestamp);
}
export async function postStatusToFeed(event: PostFeedToSQSRequest){
    await putFeeds(event.authorAlias, event.post, event.followerAliasList, event.timestamp);

    return new Response(true, event.authorAlias + " posted " + event.post + " at " + event.timestamp);
}