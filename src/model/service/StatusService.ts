import { PostStatusRequest } from "../net/request/PostStatusRequest";
import { Response } from "../net/response/Response";
import { getStatusList, putStory } from "../dao/StoryDAO";
import { getDAOFollowersAliases } from "../dao/FollowDAO";
import { putFeeds } from "../dao/FeedDAO";
import { PostStatusToSQSRequest } from "../dao/PostStatusToSQSRequest";
import { postFeedToSQSFromSQSService, postStatusToSQSFromSQSService } from "../dao/SQSService";
import { PostFeedToSQSRequest } from "../dao/PostFeedToSQSRequest";
import { StoryRequest } from "../net/request/StoryRequest";
import { StoryFeedResponse } from "../net/response/StoryFeedResponse";

export async function getStory(event: StoryRequest){
    let [statusList, hasMorePages, lastEvaluatedStatusAlias] = await getStatusList(event);
    return new StoryFeedResponse(true, statusList, hasMorePages);
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