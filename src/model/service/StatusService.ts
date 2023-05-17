import { PostStatusRequest } from "../net/request/PostStatusRequest";
import { Response } from "../net/response/Response";
import { putStory } from "../dao/StoryDAO";
import { getDAOFolloweesAliases, getDAOFollowers } from "../dao/FollowDAO";
import { putFeeds } from "../dao/FeedDAO";

export async function postStatus(event: PostStatusRequest){
    let timestamp = new Date().getTime();
    await putStory(event.alias, timestamp, event.post);
    let followers, hasMorePages, lastEvaluatedFollowerAlias = null;
    hasMorePages = true;
    while(hasMorePages){
        [followers, hasMorePages, lastEvaluatedFollowerAlias] = await getDAOFollowers(event.alias, 10, lastEvaluatedFollowerAlias);
        await putFeeds(event.alias, event.post, followers, timestamp);
    }

    // let hasMorePages = true;
    // while(hasMorePages){
    //     let [followeeAliases, hasMorePages] = getDAOFolloweesAliases(event.status.user.alias, 10, "lastFolloweeAlias");
    // }
    return new Response(true, event.alias + " posted " + event.post + " at " + timestamp);
}