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
import { User } from "../domain/User";
import { Status } from "../domain/Status";

export async function getFeed(event: StatusListRequest){

    //since serializaing and deserializing an object disables the 'get' function for the alias, the alias cannot be retrieved from the lambda event.
    let targetUser = User.FromJson(JSON.stringify(event.authorUser));
    if(targetUser == null) throw new Error('get Feed user json could not be converted to user object\nuser: ' + JSON.stringify(event.authorUser));
    let [statusList, hasMorePages, lastEvaluatedStatus] = await getFeedStatusListWithoutUsers(targetUser.alias, event.lastStatus, event.limit);
    let aliasList = statusList.map(s => s.user.alias);
    let aliastListNoDuplicates = [...new Set(aliasList)];
    let userList = await getUsersFromAliases(aliastListNoDuplicates);
    statusList.forEach(s => { 
        let user = userList.find(u => u.alias == s.user.alias);
        if(user !== undefined) s.user = user;
        else throw new Error('status could not find user with alias ' + s.user.alias)})
    return new StoryFeedResponse(true, statusList, hasMorePages, lastEvaluatedStatus);
}

export async function getStory(event: StatusListRequest){

    //since serializaing and deserializing an object disables the 'get' function for the alias, the alias cannot be retrieved from the lambda event.
    let targetUser = User.FromJson(JSON.stringify(event.authorUser));
    if(targetUser == null) throw new Error('get Feed user json could not be converted to user object\nuser: ' + JSON.stringify(event.authorUser));
    event.authorUser = targetUser;
    if(event.lastStatus != null){
        let lastStatusUser = User.FromJson(JSON.stringify(event.lastStatus.user));
        if(lastStatusUser != null) event.lastStatus.user = lastStatusUser;
        else throw new Error("get Feed last status\'s user json could not be converted to user object\nstatus: " + JSON.stringify(event.lastStatus));
    }
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