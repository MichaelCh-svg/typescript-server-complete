import { PostStatusRequest } from "../net/request/PostStatusRequest";
import { Response } from "../net/response/Response";
import { putStory } from "../dao/StoryDAO";
import { getDAOFollowers } from "../dao/FollowDAO";
import { putFeeds } from "../dao/FeedDAO";
import { PostStatusToSQSRequest } from "../dao/PostStatusToSQSRequest";
import { postFeedToSQSFromSQSService, postStatusToSQSFromSQSService } from "../dao/SQSService";
import { PostFeedToSQSRequest } from "../dao/PostFeedToSQSRequest";

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
        [followers, hasMorePages, lastEvaluatedFollowerAlias] = await getDAOFollowers(event.alias, 300, lastEvaluatedFollowerAlias);
        let request = new PostFeedToSQSRequest(followers, event.alias, event.post, event.timestamp);
        let data = await postFeedToSQSFromSQSService(request);
        ++numQueues;
        console.log(followers.length + ' followers ' + followers[0] + ' ' + followers[followers.length-1]);
        if(followers[0] == '@colonel9639') console.log('followers \n' + followers);
    }
    console.log('should be ' + numQueues + ' queues');
    return new Response(true, event.alias + " posted " + event.post + " at " + event.timestamp);
}
export async function postStatusToFeed(event: PostFeedToSQSRequest){
    await putFeeds(event.authorAlias, event.post, event.followerAliasList, event.timestamp);

    return new Response(true, event.authorAlias + " posted " + event.post + " at " + event.timestamp);
}