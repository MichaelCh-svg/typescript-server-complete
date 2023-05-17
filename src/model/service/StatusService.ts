import { PostStatusRequest } from "../net/request/PostStatusRequest";
import { Response } from "../net/response/Response";
import { putStory } from "../dao/StoryDAO";
import { getDAOFollowers } from "../dao/FollowDAO";
import { putFeeds } from "../dao/FeedDAO";
import { PostStatusToSQSRequest } from "../dao/PostStatusToSQSRequest";
import { postStatusToSQSFromSQSService } from "../dao/SQSService";

export async function postStatusToSQS(event: PostStatusRequest){
    await postStatusToSQSFromSQSService(event);
    return new Response(true, event.alias + " posted " + event.post);
}
export async function postStatus(event: PostStatusToSQSRequest){
    await putStory(event.alias, event.timestamp, event.post);
    let followers, hasMorePages, lastEvaluatedFollowerAlias = null;
    hasMorePages = true;
    while(hasMorePages){
        [followers, hasMorePages, lastEvaluatedFollowerAlias] = await getDAOFollowers(event.alias, 10, lastEvaluatedFollowerAlias);
        await putFeeds(event.alias, event.post, followers, event.timestamp);
    }

    // let hasMorePages = true;
    // while(hasMorePages){
    //     let [followeeAliases, hasMorePages] = getDAOFolloweesAliases(event.status.user.alias, 10, "lastFolloweeAlias");
    // }
    return new Response(true, event.alias + " posted " + event.post + " at " + event.timestamp);
}